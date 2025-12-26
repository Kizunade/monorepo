<script lang="ts" setup>
import { onUnload } from '@dcloudio/uni-app'
import { isMpWeixin } from '@uni-helper/uni-env'
import { ref } from 'vue'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdCheckbox from 'wot-design-uni/components/wd-checkbox/wd-checkbox.vue'
import WdTooltip from 'wot-design-uni/components/wd-tooltip/wd-tooltip.vue'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationBarTitleText: '登录',
  },
})

const tokenStore = useTokenStore()
const isAgreed = ref(false)
const showTooltip = ref(false)
const appName = import.meta.env.VITE_APP_TITLE || 'Kizunade'

async function handleLogin() {
  if (!isAgreed.value) {
    showTooltip.value = true
    setTimeout(() => {
      showTooltip.value = false
    }, 2000)
    return
  }

  if (isMpWeixin) {
    // 微信小程序登录
    uni.requirePrivacyAuthorize({
      success: async () => {
        try {
          await tokenStore.wxLogin()
          tokenStore.loginSuccess()
          uni.navigateBack()
        }
        catch (error) {
          tokenStore.loginFail(error)
        }
      },
      fail: (err) => {
        tokenStore.loginFail(err)
      },
    })
  }
  else {
    // 非微信环境，执行模拟登录 (保留原有 login.vue 的逻辑)
    try {
      await tokenStore.wxLogin()
      tokenStore.loginSuccess()
      uni.navigateBack()
    }
    catch (error) {
      console.error('登录失败', error)
      tokenStore.loginFail(error)
    }
  }
}

// 页面卸载时，如果未登录，则视为取消登录
onUnload(() => {
  if (!tokenStore.hasLogin) {
    tokenStore.loginFail(new Error('用户取消登录'))
  }
})
</script>

<template>
  <view class="login-container h-full flex flex-col items-center justify-center px-5 pt-20">
    <view class="mb-10 text-xl font-bold">
      欢迎来到{{ appName }}
    </view>

    <view class="w-full">
      <WdButton block size="large" @click="handleLogin">
        {{ isMpWeixin ? '手机号快捷登录' : '一键登录' }}
      </WdButton>
    </view>

    <view class="mt-4 flex justify-center">
      <!-- 手动控制 tooltip 显示 -->
      <WdTooltip :show="showTooltip" content="点击勾选方可进行注册/登录" placement="top">
        <WdCheckbox v-model="isAgreed" shape="circle" checked-color="#0083ff">
          我已认真阅读并同意{{ appName }}《服务条款》
        </WdCheckbox>
      </WdTooltip>
    </view>
  </view>
</template>

<style scoped>
/* 确保 tooltip 不会被遮挡 */
:deep(.wd-tooltip) {
  display: inline-block;
}
.login-container {
  min-height: 100vh;
  background-color: #fff;
}
</style>
