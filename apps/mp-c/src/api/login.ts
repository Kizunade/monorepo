import type { MpModel } from '@mock/mp/model'
import { http } from '@/http/alova'

/**
 * 用户信息
 */
export interface IUserInfoRes {
  userId: number
  username: string
  nickname: string
  avatar?: string
  [key: string]: any // 允许其他扩展字段
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.Get<IUserInfoRes>('/user/info')
}

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: err => reject(new Error(err)),
    })
  })
}

/**
 * 微信登录
 * @param params 微信登录参数，包含code
 * @returns Promise 包含登录结果
 */
export function wxLogin(params: MpModel.LoginParams) {
  return http.Post<MpModel.LoginResponse>('/mp/login', {}, {
    params,
  })
}
