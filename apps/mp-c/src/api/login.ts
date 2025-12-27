import type { MpModel } from '@mock/mp/model'
import { http } from '@/http/alova'
import { useTokenStore } from '@/store'
import { getEnvBaseUrl } from '@/utils'

/**
 * 用户信息
 */
export type IUserInfoRes = MpModel.UserInfo

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.Get<MpModel.GetUserInfoResponse>('/mp/userInfo')
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: MpModel.UpdateUserInfoParams) {
  return http.Post<MpModel.UpdateUserInfoResponse>('/mp/userInfo', data)
}

/**
 * 上传头像
 */
export function uploadAvatar(filePath: string) {
  const tokenStore = useTokenStore()
  return uni.uploadFile({
    url: `${getEnvBaseUrl()}/mp/upload/avatar`,
    filePath,
    name: 'file',
    header: {
      Authorization: `Bearer ${tokenStore.tokenInfo.token}`,
      // 如果需要token，需在此添加。alova拦截器处理的是http请求，uni.uploadFile需手动处理或封装
      // 假设token在store中，但在api层直接获取store可能引起循环依赖，通常建议在调用处或封装uploadFile
    },
  })
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
