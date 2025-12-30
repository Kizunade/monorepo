<script lang="ts" setup>
import { ref } from 'vue'
import { useTokenStore } from '@/store/token'

const tokenStore = useTokenStore()

const serviceItems = ref([
  { key: 'feedback', label: '建议反馈', icon: 'i-carbon-help', desc: '倾听您的声音' },
  { key: 'follow', label: '关注公众号', icon: 'i-carbon-logo-wechat', desc: '获取最新资讯' },
  { key: 'privacy', label: '隐私条款', icon: 'i-carbon-security', desc: '保障您的权益' },
])

function handleAction(key: string) {
  if (key === 'privacy') {
    uni.showToast({ title: '隐私保护条款', icon: 'none' })
    return
  }
  uni.showToast({ title: '即将开放', icon: 'none' })
}

function handleLogout() {
  uni.showModal({
    title: '温馨提示',
    content: '确定要暂时离开吗？',
    confirmText: '退出',
    cancelText: '留下',
    confirmColor: '#ff7a00',
    success: (res) => {
      if (res.confirm) {
        useTokenStore().logout()
        uni.showToast({
          title: '已退出',
          icon: 'success',
        })
      }
    },
  })
}
</script>

<template>
  <view class="mt-6 animate-fade-in-up px-6 pb-8 delay-400">
    <view class="flex flex-col gap-3">
      <view
        v-for="item in serviceItems"
        :key="item.key"
        class="group flex items-center justify-between rounded-[28rpx] bg-white p-4 shadow-sm transition-all active:scale-[0.99]"
        @click="handleAction(item.key)"
      >
        <view class="flex items-center gap-4">
          <view class="h-10 w-10 flex items-center justify-center rounded-full bg-[#F7F8FA] text-[#666] transition-colors group-active:bg-[#ff7a00] group-active:text-white">
            <view :class="item.icon" class="text-lg" />
          </view>
          <view class="flex flex-col">
            <view class="text-sm text-[#333] font-bold">
              {{ item.label }}
            </view>
            <view class="text-[10px] text-[#999]">
              {{ item.desc }}
            </view>
          </view>
        </view>
        <view class="i-carbon-chevron-right text-gray-300" />
      </view>

      <!-- 退出登录 (Ghost Button Style) -->
      <view v-if="tokenStore.hasLogin" class="mt-4">
        <button
          class="w-full border border-[#ff7a00] rounded-full bg-transparent py-3 text-sm text-[#ff7a00] font-bold transition-colors after:border-none active:bg-[#ff7a00] active:text-white"
          @click="handleLogout"
        >
          退出当前账号
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-400 {
  animation-delay: 400ms;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
