import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { IResponse } from './types'
import AdapterUniapp from '@alova/adapter-uniapp'
import { isMpWeixin } from '@uni-helper/uni-env'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { useGlobalConfigStore } from '@/store/globalConfig'
import { toLoginPage } from '@/utils/toLoginPage'
import { mockList as localMockList } from './mockList'
import { isMatchMock } from './tools/checkMock'
import { ContentTypeEnum, ResultEnum, ShowMessage } from './tools/enum'

// 配置动态Tag
export const API_DOMAINS = {
  DEFAULT: import.meta.env.VITE_SERVER_BASEURL,
  SECONDARY: import.meta.env.VITE_SERVER_BASEURL_SECONDARY,
  DEV: import.meta.env.VITE_SERVER_BASEURL__DEV,
  LOCAL: import.meta.env.VITE_SERVER_BASEURL__LOCAL,
}

/**
 * 创建请求实例
 */
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  // 如果下面拦截不到，请使用 refreshTokenOnSuccess by 群友@琛
  refreshTokenOnError: {
    isExpired: (error) => {
      return error.response?.status === ResultEnum.Unauthorized
    },
    handler: async () => {
      try {
        // await authLogin();
      }
      catch (error) {
        // 切换到登录页
        toLoginPage({ mode: 'reLaunch' })
        throw error
      }
    },
  },
})

/**
 * alova 请求实例
 */
const alovaInstance = createAlova({
  baseURL: API_DOMAINS.DEFAULT,
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,
  cacheFor: {
    get: 0,
    post: 0,
    put: 0,
    delete: 0,
  },

  beforeRequest: onAuthRequired((method) => {
    // 设置默认 Content-Type
    method.config.headers = {
      ContentType: ContentTypeEnum.JSON,
      Accept: 'application/json, text/plain, */*',
      ...method.config.headers,
    }

    const { config, url } = method
    const ignoreAuth = !config.meta?.ignoreAuth
    console.log('ignoreAuth===>', ignoreAuth)
    // 处理认证信息   自行处理认证问题
    if (ignoreAuth) {
      const token = 'getToken()'
      if (!token) {
        throw new Error('[请求错误]：未登录')
      }
      // method.config.headers.token = token;
    }

    let isDevMode = import.meta.env.MODE === 'development'

    if (isMpWeixin) {
      // 微信小程序端环境区分
      const {
        miniProgram: { envVersion },
      } = uni.getAccountInfoSync()
      isDevMode = envVersion === 'develop'
    }

    // 处理mock列表
    const globalConfigStore = useGlobalConfigStore()
    const globalMockList = globalConfigStore.config?.mockList || []

    const isMock = isMatchMock(url, method.type, globalMockList)
    const isLocalMock = isMatchMock(url, method.type, localMockList)

    if (isDevMode && isLocalMock) {
      method.baseURL = API_DOMAINS.LOCAL
    }
    else if (isMock) {
      method.baseURL = API_DOMAINS.DEV
    }

    // 处理动态域名
    if (config.meta?.domain) {
      method.baseURL = config.meta.domain
    }
    console.log('当前域名', method.baseURL)
  }),

  responded: onResponseRefreshToken((response, method) => {
    const { config } = method
    const { requestType } = config
    const {
      statusCode,
      data: rawData,
      errMsg,
    } = response as UniNamespace.RequestSuccessCallbackResult

    // 处理特殊请求类型（上传/下载）
    if (requestType === 'upload' || requestType === 'download') {
      return response
    }

    // 处理 HTTP 状态码错误
    if (statusCode !== 200) {
      const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
      console.error('errorMessage===>', errorMessage)
      uni.showToast({
        title: errorMessage,
        icon: 'error',
      })
      throw new Error(`${errorMessage}：${errMsg}`)
    }

    // 处理业务逻辑错误
    const { code, message, ...data } = rawData as IResponse
    // 0和200当做成功都很普遍，这里直接兼容两者，见 ResultEnum
    if (code !== ResultEnum.Success0 && code !== ResultEnum.Success200) {
      if (config.meta?.toast !== false) {
        uni.showToast({
          title: message,
          icon: 'none',
        })
      }
      throw new Error(`请求错误[${code}]：${message}`)
    }
    // 处理成功响应，返回业务数据
    return rawData
  }),
})

export const http = alovaInstance
