<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { usePetStore } from '@/store/pet'

const petStore = usePetStore()
const { pets } = storeToRefs(petStore)

function toastAdd() {
  uni.showToast({ title: '添加宠物', icon: 'none' })
}
</script>

<template>
  <view class="mt-8 animate-fade-in-up delay-200">
    <view class="flex items-end justify-between px-6">
      <view class="relative">
        <text class="relative z-10 text-xl text-[#333] font-black">毛孩子</text>
        <view class="absolute bottom-1 left-0 z-0 h-3 w-full rounded-full bg-[#ff7a00] opacity-20" />
      </view>
      <view class="flex items-center rounded-lg bg-white px-2 py-1 text-xs text-[#999] font-medium active:bg-gray-50" @click="toastAdd">
        管理档案 <view class="i-carbon-chevron-right ml-1" />
      </view>
    </view>

    <scroll-view scroll-x class="w-screen whitespace-nowrap" :show-scrollbar="false">
      <view class="inline-flex gap-4 p-6 pt-4">
        <!-- 宠物卡片 -->
        <view
          v-for="(pet, index) in pets"
          :key="pet.id"
          :class="` relative box-border h-320rpx w-240rpx flex shrink-0 flex-col items-center justify-center rounded-[32rpx] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all active:scale-95 ${index % 2 === 0 ? '-rotate-1deg' : 'rotate-1deg'}`"
        >
          <view class="relative mb-3">
            <image :src="pet.avatar" class="h-140rpx w-140rpx rounded-[28rpx] bg-gray-50" mode="aspectFill" />
            <view
              class="absolute box-border h-8 w-8 flex items-center justify-center border-2 border-white rounded-full shadow-sm -bottom-2 -right-2"
              :class="pet.gender === 'male' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'"
            >
              <view :class="pet.gender === 'male' ? 'i-carbon-gender-male' : 'i-carbon-gender-female'" class="text-sm font-bold" />
            </view>
          </view>
          <view class="mb-1 text-base text-[#333] font-bold">
            {{ pet.name }}
          </view>
          <view class="rounded-md bg-[#F5F7FA] px-2 py-0.5 text-xs text-[#999]">
            {{ pet.breed }}
          </view>
        </view>

        <!-- 添加卡片 -->
        <view
          class="box-border h-320rpx w-240rpx flex shrink-0 flex-col items-center justify-center gap-3 border-2 border-[#E0E0E0] rounded-[32rpx] border-dashed bg-[#FAFAFA] p-4 transition-colors active:bg-[#F5F5F5]"
          @click="toastAdd"
        >
          <view class="h-12 w-12 flex items-center justify-center rounded-full bg-white shadow-sm">
            <view class="i-carbon-add text-xl text-[#ccc]" />
          </view>
          <view class="text-xs text-[#999] font-medium">
            添加爱宠
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-200 {
  animation-delay: 200ms;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
