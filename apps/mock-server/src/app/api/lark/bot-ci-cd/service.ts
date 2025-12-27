import { Buffer } from 'node:buffer'
import * as lark from '@larksuiteoapi/node-sdk'
import { z } from 'zod'
import { BotCiCdModel } from './model'

// Placeholder Template IDs - Replace with actual IDs in production
const TEMPLATE_IDS = {
  [BotCiCdModel.BuildStatus.SUCCESS]: 'AAqXn7JQNyu8J', // Example ID
  [BotCiCdModel.BuildStatus.FAILED]: 'AAqXn9ijVCz2N', // Example ID
}

// Hardcoded Receive ID (Placeholder)
const RECEIVE_ID = 'oc_b5305b177c63343af1ff3b6e4900cde6'

export abstract class BotCiCdService {
  private static getClient() {
    const appId = process.env.BOT_CI_CD_LARK_APP_ID
    const appSecret = process.env.BOT_CI_CD_LARK_APP_SECRET

    if (!appId || !appSecret) {
      throw new Error('未配置 LARK_APP_ID 或 LARK_APP_SECRET 环境变量')
    }

    return new lark.Client({
      appId,
      appSecret,
      disableTokenCache: false,
    })
  }

  static async handleWebhook(params: BotCiCdModel.WebhookParams): Promise<BotCiCdModel.AjaxResult> {
    try {
      const client = this.getClient()
      const { status, 'commit-message': commitMessage, 'error-message': errorMessage, qrcode, mission, 'log-url': logUrl } = params

      let imageKey = ''

      // Upload QR Code if present
      if (qrcode) {
        try {
          const fileBuffer = Buffer.from(await qrcode.arrayBuffer())

          const tenantAccessToken = await (client as any).tokenManager.getTenantAccessToken()
          const formData = new FormData()
          formData.append('image', new Blob([fileBuffer]))
          formData.append('image_type', 'message')

          const res = await fetch('https://open.larksuite.com/open-apis/im/v1/images', {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${tenantAccessToken}`,
            },
          })

          const resData = await res.json()

          const parsed = z.object({
            data: z.object({
              image_key: z.string(),
            }),
          }).parse(resData)

          imageKey = parsed.data.image_key
        }
        catch (error) {
          console.error('Error processing image:', error)
        }
      }

      // Select Template
      const templateId = TEMPLATE_IDS[status] || TEMPLATE_IDS[BotCiCdModel.BuildStatus.FAILED]

      // Construct Template Variables
      // Adjust variable names based on your actual template definition
      const templateVariable: any = {
        status_text: status === BotCiCdModel.BuildStatus.SUCCESS ? '构建成功' : '构建失败',
        commit_message: commitMessage || '无提交信息',
        error_message: errorMessage || '',
        build_time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        mission: mission || '默认任务',
        log_url: logUrl,
      }

      if (imageKey) {
        templateVariable.qrcode_image = {
          img_key: imageKey,
        }
      }

      // Send Message
      const res = await client.im.message.createByCard({
        params: {
          receive_id_type: 'chat_id', // Assuming open_id for the hardcoded ID
        },
        data: {
          receive_id: RECEIVE_ID,
          template_id: templateId,
          template_variable: templateVariable,
        },
      })

      if (res.code !== 0) {
        return {
          code: 200,
          msg: res.msg || '发送飞书消息失败',
          data: res.data,
        }
      }

      return {
        code: 0,
        msg: '操作成功',
        data: res.data,
      }
    }
    catch (e: any) {
      console.error('BotCiCdService Error:', e)
      return {
        code: 500,
        msg: e.message || '内部错误',
        data: null,
      }
    }
  }
}
