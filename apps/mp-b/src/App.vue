<script setup
  lang="ts"
>
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'
import { useGlobalConfigStore, useTokenStore } from '@/store'

const globalConfigStore = useGlobalConfigStore()
const tokenStore = useTokenStore()
onLaunch(async (options) => {
  console.log('App.vue onLaunch', options)
  // 静默登录
  const loginRes = await tokenStore.ensureUserLogin()
  console.log('静默登录：', loginRes)
  globalConfigStore.fetchConfig()
})
onShow((options) => {
  console.log('App.vue onShow', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss"></style>
