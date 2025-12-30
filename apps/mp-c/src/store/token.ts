import type { MpModel } from '@mock/mp/model'
import { isMpWeixin } from '@uni-helper/uni-env'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue' // 修复：导入 computed
import {
  wxLogin as _wxLogin,
  getWxCode,
} from '@/api/login'
// import { LOGIN_PAGE } from '@/router/config'
import { useUserStore } from './user'

// 初始化状态
const tokenInfoState = {
  code: 0,
  msg: '',
  token: '',
}

export const useTokenStore = defineStore(
  'token',
  () => {
    // 定义用户信息
    const tokenInfo = ref<MpModel.LoginResponse>({ ...tokenInfoState })

    // 添加一个时间戳 ref 作为响应式依赖
    const nowTime = ref(Date.now())
    /**
     * 更新响应式数据:now
     * 确保isTokenExpired/isRefreshTokenExpired重新计算,而不是用错误过期缓存值
     * 可useTokenStore内部适时调用;也可链式调用:tokenStore.updateNowTime().hasLogin
     * @returns 最新的tokenStore实例
     */
    const updateNowTime = () => {
      nowTime.value = Date.now()
      return useTokenStore()
    }

    // 设置用户信息
    const setTokenInfo = (val: MpModel.LoginResponse) => {
      updateNowTime()
      tokenInfo.value = val

      // 计算并存储过期时间
      const now = Date.now()
      const expireTime = now + 60 * 120 * 1000 // 120分钟过期
      uni.setStorageSync('accessTokenExpireTime', expireTime)
    }

    /**
     * 判断token是否过期
     */
    const isTokenExpired = computed(() => {
      if (!tokenInfo.value) {
        return true
      }

      const now = nowTime.value
      const expireTime = uni.getStorageSync('accessTokenExpireTime')

      if (!expireTime)
        return true
      return now >= expireTime
    })

    /**
     * 登录成功后处理逻辑
     * @param tokenInfo 登录返回的token信息
     */
    async function _postLogin(tokenInfo: MpModel.LoginResponse) {
      setTokenInfo(tokenInfo)
      // 获取用户信息
      const userStore = useUserStore()
      await userStore.fetchUserInfo()
    }

    /**
     * 微信登录
     * 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口，一个获取token，一个获取用户信息
     * （各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
     * @returns 登录结果
     */
    const wxLogin = async () => {
      try {
        if (isMpWeixin) {
          // 获取微信小程序登录的code
          const code = await getWxCode()
          console.log('微信登录-code: ', code)
          const res = await _wxLogin(code)
          console.log('微信登录-res: ', res)
          await _postLogin(res)
          // uni.showToast({
          //   title: '登录成功',
          //   icon: 'success',
          // })
          return res
        }
        else {
          const res = await _wxLogin({ code: 'demo' })
          await _postLogin(res)
        }
      }
      catch (error) {
        console.error('微信登录失败:', error)
        uni.showToast({
          title: '微信登录失败，请重试',
          icon: 'error',
        })
        throw error
      }
      finally {
        updateNowTime()
      }
    }

    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      try {
        // TODO 实现自己的退出登录逻辑
      }
      catch (error) {
        console.error('退出登录失败:', error)
      }
      finally {
        updateNowTime()

        // 无论成功失败，都需要清除本地token信息
        // 清除存储的过期时间
        uni.removeStorageSync('accessTokenExpireTime')
        console.log('退出登录-清除用户信息')
        tokenInfo.value = { ...tokenInfoState }
        uni.removeStorageSync('token')
        const userStore = useUserStore()
        userStore.clearUserInfo()
      }
    }

    /**
     * 获取有效的token
     * 注意：在computed中不直接调用异步函数，只做状态判断
     * 实际的刷新操作应由调用方处理
     * 建议这样使用 tokenStore.updateNowTime().validToken
     */
    const getValidToken = computed(() => {
      // token已过期，返回空
      if (isTokenExpired.value) {
        return ''
      }

      return tokenInfo.value.token
    })

    /**
     * 检查是否有登录信息（不考虑token是否过期）
     */
    const hasLoginInfo = computed(() => {
      if (!tokenInfo.value) {
        return false
      }
      return Boolean(tokenInfo.value.token)
    })

    /**
     * 检查是否已登录且token有效
     * 建议这样使用tokenStore.updateNowTime().hasLogin
     */
    const hasValidLogin = computed(() => {
      console.log('hasValidLogin', hasLoginInfo.value, !isTokenExpired.value)
      return hasLoginInfo.value && !isTokenExpired.value
    })

    /**
     * 尝试获取有效的token，如果过期且可刷新，则刷新token
     * @returns 有效的token或空字符串
     */
    const tryGetValidToken = async (): Promise<string> => {
      updateNowTime()
      return getValidToken.value
    }

    // 登录弹窗控制
    let loginResolve: ((value: any) => void) | null = null
    let loginReject: ((reason?: any) => void) | null = null

    /**
     * 确保用户已登录
     * 未登录则跳转登录页
     */
    const ensureUserLogin = async () => {
      updateNowTime()
      if (hasValidLogin.value) {
        const userStore = useUserStore()
        await userStore.ensureUserInfo()
        return
      }

      // 未登录，跳转登录页
      // uni.navigateTo({ url: LOGIN_PAGE })
      // return new Promise((resolve, reject) => {
      //   loginResolve = resolve
      //   loginReject = reject
      // })
      return await wxLogin()
    }

    const loginSuccess = (res?: any) => {
      if (loginResolve) {
        loginResolve(res)
        loginResolve = null
        loginReject = null
      }
    }

    const loginFail = (err?: any) => {
      if (loginReject) {
        loginReject(err)
        loginResolve = null
        loginReject = null
      }
    }

    return {
      // 核心API方法
      wxLogin,
      logout,
      ensureUserLogin,
      loginSuccess,
      loginFail,

      // 认证状态判断（最常用的）
      hasLogin: hasValidLogin,

      // 内部系统使用的方法
      tryGetValidToken,
      validToken: getValidToken,

      // 调试或特殊场景可能需要直接访问的信息
      tokenInfo,
      setTokenInfo,
      updateNowTime,
    }
  },
  {
    // 添加持久化配置，确保刷新页面后token信息不丢失
    persist: true,
  },
)
