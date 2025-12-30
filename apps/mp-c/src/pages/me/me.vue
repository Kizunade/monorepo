<script lang="ts" setup>
import MeHeader from './components/MeHeader.vue'
import MePetList from './components/MePetList.vue'
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
</script>

<template>
  <view class="w-screen overflow-hidden bg-[#FFF8F5]">
    <!-- 滚动容器 -->
    <scroll-view scroll-y class="h-screen-main w-full" :show-scrollbar="false">
      <!-- 头部区域 (Sticky) -->
      <!-- 使用 sticky top-0 实现吸顶，同时保留在文档流中，解决交互问题 -->
      <view class="sticky top-0 z-0">
        <MeHeader />
      </view>

      <!-- 滚动内容层 (z-10) -->
      <!-- 设置相对定位和背景色，向上滚动时覆盖头部 -->
      <!-- 负 margin 制造一点重叠效果，让圆角衔接更自然 -->
      <view class="relative z-10 overflow-hidden rounded-t-[40rpx] bg-[#FFF8F5] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] -mt-4">
        <!-- 宠物家庭 -->
        <MePetList />

        <!-- 功能矩阵 -->
        <MeTools />

        <!-- 更多服务列表 -->
        <MeServices />
      </view>
    </scroll-view>
  </view>
</template>
