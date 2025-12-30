<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import WdNavbar from 'wot-design-uni/components/wd-navbar/wd-navbar.vue'
import { PAGES } from '@/router/config'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'
import MeStats from './MeStats.vue'

const userStore = useUserStore()
const tokenStore = useTokenStore()
const { userInfo } = storeToRefs(userStore)

const displayName = computed(() => {
  const info = userInfo.value as any
  return info?.nickname || info?.nickName || ''
})

async function handleLogin() {
  await tokenStore.ensureUserLogin()
}

function handleSettings() {
  uni.navigateTo({ url: PAGES.SETTINGS_INDEX })
}

function handleProfile() {
  uni.navigateTo({ url: PAGES.SETTINGS_PROFILE })
}

function handleUserInfoClick() {
  if (!tokenStore.hasLogin) {
    handleLogin()
  }
  else {
    handleProfile()
  }
}
</script>

<template>
  <view class="relative w-full overflow-hidden pb-10">
    <!-- 导航栏 (z-50) - 始终固定在顶部 -->
    <WdNavbar :bordered="false" custom-style="background-color: transparent;" safe-area-inset-top />
    <!-- 背景层 -->
    <view class="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
      <view class="animate-pulse-slow absolute h-full w-80 rounded-full bg-[#FFE4C4] opacity-40 blur-3xl -right-20 -top-20" />
      <view class="animate-pulse-slow absolute top-20 h-full w-60 rounded-full bg-[#FFD700] opacity-30 blur-3xl delay-700 -left-20" />
    </view>

    <!-- 内容层 (padding-top 由外部 Navbar 决定，或者预留) -->
    <!-- 假设 Navbar 高度约 88px (44px status + 44px nav) -->
    <view class="relative z-10 px-6 pt-4">
      <view class="flex items-start justify-between">
        <!-- 用户信息 -->
        <view class="flex animate-fade-in-up items-center gap-4" @click="handleUserInfoClick">
          <!-- 头像容器：固定宽高，防止被父容器拉伸 -->
          <view class="group relative h-140rpx w-140rpx shrink-0">
            <!-- 点击时的光圈：限制在父容器内 -->
            <view class="absolute inset-0 scale-110 rounded-full bg-[#ff7a00] opacity-0 transition-opacity duration-300 group-active:opacity-20" />
            <image
              :src="userInfo.avatar"
              class="relative z-10 h-full w-full border-6rpx border-white rounded-full shadow-[0_8px_20px_rgba(255,122,0,0.15)]"
              mode="aspectFill"
            />
            <view
              v-if="tokenStore.hasLogin"
              class="absolute bottom-0 right-0 z-20 h-6 w-6 border-4rpx border-white rounded-full bg-[#34D399] shadow-sm"
            />
          </view>

          <view class="flex flex-col items-start">
            <view class="flex items-center gap-2 text-2xl text-[#333] font-black tracking-wide">
              {{ tokenStore.hasLogin ? (displayName || '铲屎官') : '欢迎加入' }}
              <view v-if="tokenStore.hasLogin" class="i-carbon-edit text-sm text-gray-400 opacity-50" />
            </view>
            <view class="mt-2 inline-flex items-center border border-white/50 rounded-full bg-white/60 px-3 py-1 shadow-sm backdrop-blur-sm">
              <text class="text-xs text-[#666] font-medium">
                {{ tokenStore.hasLogin ? '普通会员' : '登录开启美好生活' }}
              </text>
              <view class="i-carbon-chevron-right ml-1 text-[10px] text-[#999]" />
            </view>
          </view>
        </view>

        <!-- 设置按钮 -->
        <view
          class="h-10 w-10 flex items-center justify-center border border-white/60 rounded-full bg-white/60 shadow-sm backdrop-blur-md transition-transform active:scale-90"
          @click="handleSettings"
        >
          <view class="i-carbon-settings text-lg text-[#666]" />
        </view>
      </view>
    </view>

    <!-- 数据统计 -->
    <MeStats />
  </view>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-700 {
  animation-delay: 700ms;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}
</style>
