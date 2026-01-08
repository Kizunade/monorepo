<script setup lang="ts">
import type { MpModel } from '@mock/mp/model'
import { computed, ref } from 'vue'
import WdCellGroup from 'wot-design-uni/components/wd-cell-group/wd-cell-group.vue'
import WdCell from 'wot-design-uni/components/wd-cell/wd-cell.vue'
import { getUserInfo } from '@/api/login'
import BackgroundGlow from '@/components/BackgroundGlow.vue'

definePage({
  style: {
    navigationBarTitleText: '订单',
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
              订单概览
            </view>
            <view class="mt-1 text-xs text-gray-500 font-semibold">
              重点看待接单与履约效率
            </view>
          </view>
          <view class="text-right">
            <view class="text-2xl text-gray-900 font-black">
              {{ stats?.orderCount ?? '-' }}
            </view>
            <view class="text-[11px] text-gray-500 font-bold">
              累计订单
            </view>
          </view>
        </view>

        <view class="grid grid-cols-4 mt-4 gap-2">
          <view class="rounded-2xl bg-gray-50 px-2 py-3 text-center">
            <view class="text-sm text-gray-900 font-black">
              -
            </view>
            <view class="mt-1 text-[10px] text-gray-500 font-bold">
              待接单
            </view>
          </view>
          <view class="rounded-2xl bg-gray-50 px-2 py-3 text-center">
            <view class="text-sm text-gray-900 font-black">
              -
            </view>
            <view class="mt-1 text-[10px] text-gray-500 font-bold">
              待出发
            </view>
          </view>
          <view class="rounded-2xl bg-gray-50 px-2 py-3 text-center">
            <view class="text-sm text-gray-900 font-black">
              -
            </view>
            <view class="mt-1 text-[10px] text-gray-500 font-bold">
              服务中
            </view>
          </view>
          <view class="rounded-2xl bg-gray-50 px-2 py-3 text-center">
            <view class="text-sm text-gray-900 font-black">
              -
            </view>
            <view class="mt-1 text-[10px] text-gray-500 font-bold">
              售后
            </view>
          </view>
        </view>
      </view>

      <view class="mt-4 overflow-hidden border border-gray-100 rounded-3xl bg-white/85 shadow-lg backdrop-blur">
        <WdCellGroup>
          <WdCell title="订单列表" value="开发中" is-link @click="toast()">
            <template #icon>
              <view class="i-carbon-list-checked mr-2 text-lg text-gray-600" />
            </template>
          </WdCell>
          <WdCell title="异常与申诉" value="开发中" is-link @click="toast()">
            <template #icon>
              <view class="i-carbon-warning-hex mr-2 text-lg text-gray-600" />
            </template>
          </WdCell>
        </WdCellGroup>
      </view>
    </view>
  </view>
</template>

<style scoped>
.shadow-lg {
  box-shadow: 0 18px 48px rgba(17, 24, 39, 0.08);
}
</style>
