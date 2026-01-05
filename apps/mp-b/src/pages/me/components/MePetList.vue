<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { PAGES } from '@/router/config'
import { usePetStore } from '@/store/pet'

const petStore = usePetStore()
const { pets } = storeToRefs(petStore)

function goToPetList() {
  uni.navigateTo({ url: PAGES.PET_LIST })
}

function goToPetDetail(id: number) {
  uni.navigateTo({ url: `${PAGES.PET_DETAIL}?id=${id}` })
}

function goToPetCreate() {
  uni.navigateTo({ url: PAGES.PET_EDIT })
}
</script>

<template>
  <view class="mt-6 animate-fade-in-up delay-200">
    <view class="flex items-end justify-between px-4">
      <view class="relative">
        <text class="relative z-10 text-lg text-main font-bold">毛孩子</text>
        <view class="absolute bottom-1 left-0 z-0 h-2.5 w-full rounded-full bg-primary opacity-20" />
      </view>
      <view class="flex items-center rounded-lg bg-white px-2 py-0.5 text-xs text-tips font-medium active:bg-gray-50" @click="goToPetList">
        管理档案 <view class="i-carbon-chevron-right ml-0.5" />
      </view>
    </view>

    <scroll-view scroll-x class="w-screen whitespace-nowrap" :show-scrollbar="false">
      <view class="inline-flex gap-3 p-4 pt-3">
        <!-- 宠物卡片 -->
        <view
          v-for="(pet, index) in pets"
          :key="pet.id"
          :class="` relative box-border h-40 w-28 flex shrink-0 flex-col items-center justify-center rounded-2xl bg-white p-3 shadow-sm transition-all active:scale-95 ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`"
          @click="goToPetDetail(pet.id)"
        >
          <view class="relative mb-2.5">
            <image :src="pet.avatar" class="h-16 w-16 rounded-xl bg-gray-50" mode="aspectFill" />
            <view
              class="absolute box-border h-6 w-6 flex items-center justify-center border-2 border-white rounded-full shadow-sm -bottom-1.5 -right-1.5"
              :class="pet.gender === 'male' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'"
            >
              <view :class="pet.gender === 'male' ? 'i-carbon-gender-male' : 'i-carbon-gender-female'" class="text-xs font-bold" />
            </view>
          </view>
          <view class="mb-0.5 max-w-full truncate px-1 text-sm text-main font-bold">
            {{ pet.name }}
          </view>
          <view class="max-w-full truncate rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-tips">
            {{ pet.breed }}
          </view>
        </view>

        <!-- 添加卡片 -->
        <view
          class="box-border h-40 w-28 flex shrink-0 flex-col items-center justify-center gap-2 border border-border rounded-2xl border-dashed bg-gray-50 p-3 transition-colors active:bg-gray-100"
          @click="goToPetCreate"
        >
          <view class="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm">
            <view class="i-carbon-add text-lg text-tips" />
          </view>
          <view class="text-xs text-tips font-medium">
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
