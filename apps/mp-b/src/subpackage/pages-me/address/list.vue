<script lang="ts" setup>
import type { AddressModel } from '@mock/address/model'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdStatusTip from 'wot-design-uni/components/wd-status-tip/wd-status-tip.vue'

import { PAGES } from '@/router/config'
import { useAddressStore } from '@/store'
import AddressCard from './components/AddressCard.vue'
import AddressSkeleton from './components/AddressSkeleton.vue'

definePage({
  style: {
    navigationBarTitleText: '地址管理',
    enablePullDownRefresh: true,
  },
})

const addressStore = useAddressStore()
const { addressList: list, loading, finished } = storeToRefs(addressStore)

function handleAdd() {
  uni.navigateTo({ url: PAGES.ADDRESS_EDIT })
}

function handleEdit(item: AddressModel.Address) {
  // 传递地址信息到编辑页
  const addressStr = encodeURIComponent(JSON.stringify(item))
  uni.navigateTo({ url: `${PAGES.ADDRESS_EDIT}?data=${addressStr}` })
}

// 下拉刷新
onPullDownRefresh(async () => {
  try {
    await addressStore.refreshAddressList()
  }
  finally {
    uni.stopPullDownRefresh()
  }
})

// 上拉加载更多
onReachBottom(async () => {
  if (!finished.value) {
    await addressStore.loadMore()
  }
})

onShow(() => {
  // 首次加载或返回时刷新
  if (list.value.length === 0) {
    addressStore.refreshAddressList()
  }
})
</script>

<template>
  <view class="min-h-screen bg-page">
    <!-- 骨架屏 -->
    <AddressSkeleton v-if="loading && list.length === 0" />

    <!-- 空状态 -->
    <view v-else-if="!loading && list.length === 0" class="flex flex-col items-center justify-center pt-20">
      <WdStatusTip image="/static/assets/content.png" tip="暂无地址信息" />
    </view>

    <!-- 地址列表 -->
    <view v-else class="flex flex-col gap-3 p-3">
      <AddressCard
        v-for="item in list"
        :key="item.addrId"
        :item="item"
        @click="handleEdit"
      />

      <!-- 加载状态 -->
      <view v-if="list.length > 0" class="py-4 text-center text-sm text-tips">
        <text v-if="loading">
          加载中...
        </text>
        <text v-else-if="finished">
          没有更多了
        </text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="shadow-t fixed bottom-0 left-0 right-0 bg-card p-4 pb-safe">
      <WdButton block type="primary" @click="handleAdd">
        新增地址
      </WdButton>
    </view>
  </view>
</template>

<style scoped>
.shadow-t {
  box-shadow: 0 -2px 10px var(--shadow-sm);
}
</style>
