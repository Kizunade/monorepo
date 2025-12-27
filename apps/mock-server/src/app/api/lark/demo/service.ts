import type { LarkDemoModel } from './model'
import * as lark from '@larksuiteoapi/node-sdk'

export abstract class LarkDemoService {
  static async sendMessage(params: LarkDemoModel.SendMessageParams): Promise<LarkDemoModel.AjaxResult> {
    const { appId, appSecret, receiveId, receiveIdType, msgType, content } = params

    // 优先使用参数传入的凭证，否则使用环境变量
    const finalAppId = appId || process.env.DEMO_LARK_APP_ID || ''
    const finalAppSecret = appSecret || process.env.DEMO_LARK_APP_SECRET || ''

    if (!finalAppId || !finalAppSecret) {
      return {
        code: 400,
        msg: '未配置 App ID 或 App Secret',
      }
    }

    const client = new lark.Client({
      appId: finalAppId,
      appSecret: finalAppSecret,
      disableTokenCache: false,
    })

    try {
      const res = await client.im.message.create({
        params: {
          receive_id_type: receiveIdType as any,
        },
        data: {
          receive_id: receiveId,
          msg_type: msgType,
          content: JSON.stringify({
            text: content,
          }),
        },
      })

      if (res.code !== 0) {
        return {
          code: res.code || 500,
          msg: res.msg || '发送失败',
          data: res.data,
        }
      }

      return {
        code: 0,
        msg: '发送成功',
        data: res.data,
      }
    }
    catch (e: any) {
      return {
        code: 500,
        msg: e.message || '内部错误',
      }
    }
  }
}
