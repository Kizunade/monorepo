<script setup lang="ts">
import type { MpModel } from '@mock/mp/model'
import { computed, ref } from 'vue'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import { getUserInfo } from '@/api/login'
import BackgroundGlow from '@/components/BackgroundGlow.vue'

definePage({
  style: {
    navigationBarTitleText: '评分与口碑',
    enablePullDownRefresh: true,
  },
})

const loading = ref(false)
const detail = ref<MpModel.UserInfo | null>(null)
const stats = computed(() => detail.value?.stats)

function toast(title = '开发中') {
  uni.showToast({ title, icon: 'none' })
}

async function fetchDetail() {
  if (loading.value) {
    uni.stopPullDownRefresh?.()
    return
  }
  loading.value = true
  try {
    const res = await getUserInfo()
    if (res.code === 200 && res.data) {
      detail.value = res.data
    }
    else {
      uni.showToast({ title: res.msg || '获取失败', icon: 'none' })
    }
  }
  catch {
    uni.showToast({ title: '网络异常', icon: 'none' })
  }
  finally {
    loading.value = false
    uni.stopPullDownRefresh?.()
  }
}

onPullDownRefresh(async () => {
  await fetchDetail()
})

onShow(() => {
  fetchDetail()
})
</script>

<template>
  <view class="relative min-h-screen bg-page">
    <BackgroundGlow />
    <view
      v-if="loading"
      class="fixed left-1/2 top-14 z-50 rounded-full bg-black/70 px-3 py-1 text-[11px] text-white font-semibold backdrop-blur -translate-x-1/2"
    >
      正在刷新
    </view>
    <view class="px-4 py-4">
      <view class="border border-gray-100 rounded-3xl bg-white/85 p-4 shadow-lg backdrop-blur">
        <view class="flex items-center justify-between">
          <view>
            <view class="text-base text-gray-900 font-extrabold tracking-tight">
              当前评分
            </view>
            <view class="mt-1 text-xs text-gray-500 font-semibold">
              高分更容易抢到优质订单
            </view>
          </view>
          <view class="h-10 w-10 flex items-center justify-center rounded-2xl bg-orange-50">
            <view class="i-carbon-star-filled text-xl text-primary" />
          </view>
        </view>

        <view class="mt-4 flex items-end gap-2">
          <text class="text-4xl text-gray-900 font-black tracking-tight">{{ stats?.rating ?? '-' }}</text>
          <text class="pb-1 text-xs text-gray-500 font-bold">/ 5.0</text>
        </view>

        <view class="grid grid-cols-2 mt-4 gap-2">
          <view class="rounded-2xl bg-gray-50 px-3 py-3">
            <view class="text-[11px] text-gray-500 font-bold">
              累计订单
            </view>
            <view class="mt-1 text-lg text-gray-900 font-black">
              {{ stats?.orderCount ?? '-' }}
            </view>
          </view>
          <view class="rounded-2xl bg-gray-50 px-3 py-3">
            <view class="text-[11px] text-gray-500 font-bold">
              粉丝
            </view>
            <view class="mt-1 text-lg text-gray-900 font-black">
              {{ stats?.fans ?? '-' }}
            </view>
          </view>
        </view>
      </view>

      <view class="mt-4 border border-gray-100 rounded-3xl bg-white/85 p-4 shadow-lg backdrop-blur">
        <view class="text-base text-gray-900 font-extrabold tracking-tight">
          复盘建议
        </view>
        <view class="mt-2 text-sm text-gray-600 font-semibold">
          把“准时 + 过程记录 + 加项透明”做成默认动作，评分会稳定上扬。
        </view>
        <view class="mt-4">
          <WdButton block type="primary" @click="toast()">
            查看最近评价
          </WdButton>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.shadow-lg {
  box-shadow: 0 18px 48px rgba(17, 24, 39, 0.08);
}
</style>
