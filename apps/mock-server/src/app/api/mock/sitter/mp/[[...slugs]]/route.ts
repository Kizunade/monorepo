import { openapi } from '@elysiajs/openapi'
import { serverTiming } from '@elysiajs/server-timing'
import { Elysia } from 'elysia'
import { getPrefix } from '@/lib/utils/getPrefix'
import { MpModel, TOOL_NAME } from '../model'
import { MpService } from '../service'

const app = new Elysia({ prefix: getPrefix(TOOL_NAME, 'sitter') })
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
  .get(
    '/userInfo',
    () => {
      return MpService.getUserInfo()
    },
    {
      response: MpModel.getUserInfoResponse,
      detail: {
        summary: '获取用户信息',
        tags: ['用户管理'],
        operationId: 'getUserInfo',
      },
    },
  )
  .post(
    '/userInfo',
    ({ body }) => {
      return MpService.updateUserInfo(body as MpModel.UpdateUserInfoParams)
    },
    {
      body: MpModel.updateUserInfoParams,
      response: MpModel.updateUserInfoResponse,
      detail: {
        summary: '更新用户信息',
        tags: ['用户管理'],
        operationId: 'updateUserInfo',
      },
    },
  )
  .post(
    '/upload/file',
    ({ body }) => {
      const { file } = body as unknown as MpModel.UploadFileParams
      return MpService.uploadFile(file)
    },
    {
      body: MpModel.uploadFileParams,
      response: MpModel.uploadFileResponse,
      detail: {
        summary: '上传文件',
        tags: ['文件上传'],
        operationId: 'uploadFile',
      },
    },
  )
  .post(
    '/upload/avatar',
    ({ body }) => {
      const { file } = body as unknown as MpModel.UploadFileParams
      return MpService.uploadFile(file)
    },
    {
      body: MpModel.uploadFileParams,
      response: MpModel.uploadFileResponse,
      detail: {
        summary: '上传头像',
        tags: ['文件上传'],
        operationId: 'uploadAvatar',
      },
    },
  )
  .get(
    '/globalConfig',
    () => {
      return MpService.getGlobalConfig()
    },
    {
      response: MpModel.globalConfigResponse,
      detail: {
        summary: '获取全局配置',
        tags: ['基础配置'],
        operationId: 'getGlobalConfig',
      },
    },
  )

export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch
