import { openapi } from '@elysiajs/openapi'
import { serverTiming } from '@elysiajs/server-timing'
import { Elysia } from 'elysia'
import { BotCiCdModel, TOOL_NAME } from '../model'
import { BotCiCdService } from '../service'

const app = new Elysia({ prefix: `/api/lark/${TOOL_NAME}` })
  .use(openapi())
  .use(serverTiming())
  .post(
    '/on-mp-uploaded',
    (context) => {
      const body = context.body as unknown as BotCiCdModel.WebhookParams
      return BotCiCdService.handleWebhook(body)
    },
    {
      body: BotCiCdModel.webhookPayloadSchema,
      response: BotCiCdModel.ajaxResult,
      detail: {
        summary: '小程序 CI/CD Webhook',
        tags: ['飞书 Bot'],
        operationId: 'botCiCdWebhook',
        description: '接收小程序 CI 打包状态，并发送飞书卡片消息。请求格式为 multipart/form-data。',
      },
    },
  )

export const GET = app.fetch
export const POST = app.fetch
