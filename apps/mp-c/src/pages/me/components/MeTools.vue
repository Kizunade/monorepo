<script lang="ts" setup>
import type { LocationUrl } from 'virtual:uni-pages'
import { ref } from 'vue'
import { PAGES } from '@/router/config'

interface MenuItem {
  key: string
  label: string
  icon: string
  color: string
  bg: string
  url?: LocationUrl
}

const menuItems = ref<MenuItem[]>([
  { key: 'orders', label: '我的订单', icon: 'i-carbon-document', color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'address', label: '地址管理', icon: 'i-carbon-location', color: 'text-orange-500', bg: 'bg-orange-50', url: PAGES.ADDRESS_LIST },
  { key: 'coupons', label: '优惠券', icon: 'i-carbon-ticket', color: 'text-red-500', bg: 'bg-red-50' },
])

function handleAction(key: string) {
  uni.showToast({ title: '即将开放', icon: 'none' })
}

function handlePageNavigate(url: string) {
  uni.navigateTo({ url })
}
</script>

<template>
  <view class="animate-fade-in-up px-6 delay-300">
    <view class="rounded-[40rpx] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
      <view class="mb-5 border-l-4 border-[#ff7a00] pl-2 text-base text-[#333] font-bold">
        常用工具
      </view>
      <view class="grid grid-cols-3 gap-y-6">
        <view
          v-for="item in menuItems"
          :key="item.key"
          class="flex flex-col items-center gap-2 active:opacity-60"
          @click="item.url ? handlePageNavigate(item.url) : handleAction(item.key)"
        >
          <view
            class="h-12 w-12 flex items-center justify-center rounded-2xl text-xl shadow-sm transition-transform active:scale-90"
            :class="[item.bg, item.color]"
          >
            <view :class="item.icon" />
          </view>
          <view class="text-xs text-[#555] font-medium">
            {{ item.label }}
          </view>
        </view>
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

.delay-300 {
  animation-delay: 300ms;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
