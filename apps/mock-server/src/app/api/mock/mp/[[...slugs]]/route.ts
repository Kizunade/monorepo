import { openapi } from '@elysiajs/openapi'
import { serverTiming } from '@elysiajs/server-timing'
import { Elysia } from 'elysia'
import { getPrefix } from '@/lib/utils/getPrefix'
import { MpModel, TOOL_NAME } from '../model'
import { MpService } from '../service'

const app = new Elysia({ prefix: getPrefix(TOOL_NAME) })
  .use(
    openapi(),
  )
  .use(serverTiming())
  .post(
    '/login',
    ({ query }) => {
      return MpService.login(query as MpModel.LoginParams)
    },
    {
      query: MpModel.loginParams,
      response: MpModel.loginResponse,
      detail: {
        summary: '微信小程序登录',
        tags: ['用户登录'],
        operationId: 'login',
      },
    },
  )

export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch
