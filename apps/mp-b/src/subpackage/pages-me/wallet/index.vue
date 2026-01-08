<script setup lang="ts">
import type { MpModel } from '@mock/mp/model'
import { computed, ref } from 'vue'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdCellGroup from 'wot-design-uni/components/wd-cell-group/wd-cell-group.vue'
import WdCell from 'wot-design-uni/components/wd-cell/wd-cell.vue'
import { getUserInfo } from '@/api/login'
import BackgroundGlow from '@/components/BackgroundGlow.vue'

definePage({
  style: {
    navigationBarTitleText: '钱包',
    enablePullDownRefresh: true,
  },
})

const loading = ref(false)
const detail = ref<MpModel.UserInfo | null>(null)
const wallet = computed(() => detail.value?.wallet)

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
      <view class="wallet-card rounded-3xl px-4 py-4 text-white">
        <view class="flex items-center justify-between">
          <view>
            <view class="text-base font-extrabold tracking-tight">
              可提现余额
            </view>
            <view class="mt-1 text-xs text-white/70 font-semibold">
              冻结金额会在售后结束后释放
            </view>
          </view>
          <view class="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/12">
            <view class="i-carbon-wallet text-xl" />
          </view>
        </view>

        <view class="mt-4 text-4xl font-black tracking-tight">
          ¥{{ wallet?.balance?.toFixed?.(2) ?? '-' }}
        </view>

        <view class="grid grid-cols-2 mt-4 gap-2">
          <view class="rounded-2xl bg-white/10 px-3 py-3">
            <view class="text-[11px] text-white/70 font-bold">
              冻结
            </view>
            <view class="mt-1 text-lg font-black">
              ¥{{ wallet?.frozen?.toFixed?.(2) ?? '-' }}
            </view>
          </view>
          <view class="rounded-2xl bg-white/10 px-3 py-3">
            <view class="text-[11px] text-white/70 font-bold">
              本月收入
            </view>
            <view class="mt-1 text-lg font-black">
              ¥{{ wallet?.incomeMonth?.toFixed?.(2) ?? '-' }}
            </view>
          </view>
        </view>

        <view class="mt-4">
          <WdButton block type="primary" @click="toast()">
            发起提现
          </WdButton>
        </view>
      </view>

      <view class="mt-4 overflow-hidden border border-gray-100 rounded-3xl bg-white/85 shadow-lg backdrop-blur">
        <WdCellGroup>
          <WdCell title="收支明细" value="开发中" is-link @click="toast()">
            <template #icon>
              <view class="i-carbon-document mr-2 text-lg text-gray-600" />
            </template>
          </WdCell>
          <WdCell title="提现账户" value="开发中" is-link @click="toast()">
            <template #icon>
              <view class="i-carbon-account mr-2 text-lg text-gray-600" />
            </template>
          </WdCell>
        </WdCellGroup>
      </view>
    </view>
  </view>
</template>

<style scoped>
.wallet-card {
  background:
    radial-gradient(900rpx circle at 12% 20%, rgba(255, 122, 0, 0.35), transparent 55%),
    radial-gradient(700rpx circle at 88% 15%, rgba(255, 205, 86, 0.22), transparent 55%),
    linear-gradient(180deg, rgba(17, 24, 39, 0.92), rgba(17, 24, 39, 0.86));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 50px rgba(17, 24, 39, 0.22);
}
</style>
