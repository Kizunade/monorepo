<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import WdNavbar from 'wot-design-uni/components/wd-navbar/wd-navbar.vue'
import { PAGES } from '@/router/config'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'
import MeStats from './MeStats.vue'

defineProps<{
  animationStyle?: {
    transform?: string
    filter?: string
  }
}>()
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
  <view class="relative w-full overflow-hidden pb-8" :style="animationStyle">
    <!-- 导航栏 (z-50) - 始终固定在顶部 -->
    <WdNavbar :bordered="false" custom-style="background-color: transparent;" safe-area-inset-top />
    <!-- 背景层 -->
    <view class="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
      <view class="animate-pulse-slow absolute h-full w-80 rounded-full bg-[#FFE4C4] opacity-30 blur-3xl -right-20 -top-20" />
      <view class="animate-pulse-slow absolute top-20 h-full w-60 rounded-full bg-[#FFD700] opacity-20 blur-3xl delay-700 -left-20" />
    </view>

    <!-- 内容层 (padding-top 由外部 Navbar 决定，或者预留) -->
    <view class="relative z-10 px-4 pt-2">
      <view class="flex items-start justify-between">
        <!-- 用户信息 -->
        <view class="flex animate-fade-in-up items-center gap-3" @click="handleUserInfoClick">
          <!-- 头像容器：固定宽高，防止被父容器拉伸 -->
          <view class="group relative h-16 w-16 shrink-0">
            <!-- 点击时的光圈：限制在父容器内 -->
            <view class="absolute inset-0 scale-110 rounded-full bg-primary opacity-0 transition-opacity duration-300 group-active:opacity-20" />
            <image
              :src="userInfo.avatar"
              class="relative z-10 h-full w-full border-2 border-white rounded-full shadow-sm"
              mode="aspectFill"
            />
            <view
              v-if="tokenStore.hasLogin"
              class="absolute bottom-0 right-0 z-20 h-5 w-5 border-2 border-white rounded-full bg-success shadow-sm"
            />
          </view>

          <view class="flex flex-col items-start">
            <view class="flex items-center gap-2 text-xl text-main font-bold tracking-tight">
              {{ tokenStore.hasLogin ? (displayName || '铲屎官') : '欢迎加入' }}
              <view v-if="tokenStore.hasLogin" class="i-carbon-edit text-xs text-tips opacity-50" />
            </view>
            <view class="mt-1 inline-flex items-center border border-white/50 rounded-full bg-white/60 px-2 py-0.5 shadow-sm backdrop-blur-sm">
              <text class="text-xs text-content font-medium">
                {{ tokenStore.hasLogin ? '普通会员' : '登录开启美好生活' }}
              </text>
              <view class="i-carbon-chevron-right ml-0.5 text-[10px] text-tips" />
            </view>
          </view>
        </view>

        <!-- 设置按钮 -->
        <view
          class="h-9 w-9 flex items-center justify-center border border-white/60 rounded-full bg-white/60 shadow-sm backdrop-blur-md transition-transform active:scale-90"
          @click="handleSettings"
        >
          <view class="i-carbon-settings text-lg text-content" />
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
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}
</style>
