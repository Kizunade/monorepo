import z from 'zod'
import { PetModel } from '../pet/model'

export const TOOL_NAME = 'mp'

export namespace MpModel {
  export const loginParams = z.object({
    code: z.string().describe('小程序用户code'),
  }).describe('小程序登录参数')

  export const loginResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    token: z.string().describe('登录凭证'),
  }).describe('小程序登录响应')

  export const userInfo = z.object({
    userId: z.number().describe('用户ID'),
    username: z.string().describe('用户名'),
    nickname: z.string().describe('昵称'),
    avatar: z.string().describe('头像URL'),
    phone: z.string().describe('手机号'),
    gender: z.enum(['男', '女', '保密']).describe('性别'),
    birthday: z.string().describe('生日(YYYY-MM-DD)'),
    pets: PetModel.petList.describe('宠物列表'),
  }).describe('用户信息')

  export const getUserInfoResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    data: userInfo.describe('用户数据'),
  }).describe('获取用户信息响应')

  export const updateUserInfoParams = z.object({
    nickname: z.string().min(2).max(20).optional().describe('昵称'),
    avatar: z.string().optional().describe('头像URL'),
    gender: z.enum(['男', '女', '保密']).optional().describe('性别'),
    birthday: z.string().optional().describe('生日'),
  }).describe('更新用户信息参数')

  export const updateUserInfoResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    data: userInfo.describe('更新后的用户数据'),
  }).describe('更新用户信息响应')

  export const uploadFileResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    url: z.string().describe('文件URL'),
  }).describe('文件上传响应')

  export type LoginParams = z.infer<typeof loginParams>
  export type LoginResponse = z.infer<typeof loginResponse>
  export type UserInfo = z.infer<typeof userInfo>
  export type GetUserInfoResponse = z.infer<typeof getUserInfoResponse>
  export type UpdateUserInfoParams = z.infer<typeof updateUserInfoParams>
  export type UpdateUserInfoResponse = z.infer<typeof updateUserInfoResponse>
  export type UploadFileResponse = z.infer<typeof uploadFileResponse>
}
