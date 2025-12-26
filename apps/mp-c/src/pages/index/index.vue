<script lang="ts" setup>
import WdStatusTip from 'wot-design-uni/components/wd-status-tip/wd-status-tip.vue'
import BackgroundGlow from '@/components/BackgroundGlow.vue'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

onLoad(() => {
  console.log('测试 uni API 自动引入: onLoad')
})
</script>

<template>
  <view class="relative min-h-screen flex px-4">
    <BackgroundGlow />
    <view class="flex flex-1 flex-col items-center justify-center">
      <WdStatusTip image="/static/assets/content.png" tip="开发中..." />
    </view>
  </view>
</template>
