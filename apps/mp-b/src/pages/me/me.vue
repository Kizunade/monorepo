<script lang="ts" setup>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import MeHeader from './components/MeHeader.vue'
import MeServices from './components/MeServices.vue'
import MeTools from './components/MeTools.vue'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
    navigationBarTextStyle: 'black',
  },
})

// Ensure UnoCSS generates these dynamic icons
// i-carbon-document i-carbon-location i-carbon-ticket i-carbon-help i-carbon-logo-wechat i-carbon-security i-carbon-settings i-carbon-chevron-right i-carbon-add i-carbon-mars i-carbon-female

const instance = getCurrentInstance()
const headerStyle = ref({})
let observer: UniApp.IntersectionObserver | null = null

onMounted(() => {
  // 创建 IntersectionObserver 监听头部滚动
  // 使用阈值数组来实现平滑的过渡效果
  const thresholds = Array.from({ length: 51 }, (_, i) => i / 50)

  observer = uni.createIntersectionObserver(instance, { thresholds })

  observer
    .relativeToViewport()
    .observe('#header-observer', (res) => {
      const { intersectionRatio } = res
      // intersectionRatio: 1 -> 0 (随着向下滚动，比率减小)
      // Scale: 1 -> 0.9
      // Blur: 0 -> 10px
      const noEffectThreshold = 0.3
      const effectStrength = Math.min(1, intersectionRatio + noEffectThreshold)

      const scale = 0.9 + (0.1 * effectStrength)
      const blur = 10 * (1 - effectStrength)

      headerStyle.value = {
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity: 0.5 + (0.5 * effectStrength), // 可选：同时也改变透明度
      }
    })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <view class="w-screen overflow-hidden bg-page">
    <!-- 滚动容器 -->
    <scroll-view scroll-y class="h-screen-main w-full" :show-scrollbar="false">
      <!-- 滚动监听锚点：高度决定了动画的行程 -->
      <view id="header-observer" class="pointer-events-none absolute left-0 top-0 h-[500rpx] w-full" />

      <!-- 头部区域 (Sticky) -->
      <!-- 使用 sticky top-0 实现吸顶，同时保留在文档流中，解决交互问题 -->
      <view class="sticky top-0 z-0">
        <MeHeader :animation-style="headerStyle" />
      </view>

      <!-- 滚动内容层 (z-10) -->
      <!-- 设置相对定位和背景色，向上滚动时覆盖头部 -->
      <!-- 负 margin 制造一点重叠效果，让圆角衔接更自然 -->
      <view class="relative z-10 overflow-hidden rounded-t-[32rpx] bg-page shadow-[0_-10px_40px_rgba(0,0,0,0.02)] -mt-4">
        <!-- 功能矩阵 -->
        <MeTools />

        <!-- 更多服务列表 -->
        <MeServices />
      </view>
    </scroll-view>
  </view>
</template>
