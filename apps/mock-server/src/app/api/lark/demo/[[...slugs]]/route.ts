import { openapi } from '@elysiajs/openapi'
import { serverTiming } from '@elysiajs/server-timing'
import { Elysia } from 'elysia'
import { LarkDemoModel, TOOL_NAME } from '../model'
import { LarkDemoService } from '../service'

const app = new Elysia({ prefix: `/api/lark/${TOOL_NAME}` })
  .use(openapi())
  .use(serverTiming())
  .post(
    '/send',
    ({ body }) => {
      return LarkDemoService.sendMessage(body)
    },
    {
      body: LarkDemoModel.sendMessageSchema,
      response: LarkDemoModel.ajaxResult,
      detail: {
        summary: '发送飞书消息',
        tags: ['飞书Demo'],
        operationId: 'sendMessage',
      },
    },
  )

export const POST = app.fetch
export const GET = app.fetch
