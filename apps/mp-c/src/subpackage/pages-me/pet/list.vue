<script lang="ts" setup>
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdStatusTip from 'wot-design-uni/components/wd-status-tip/wd-status-tip.vue'
import PageBackground from '@/components/PageBackground.vue'
import PageHeader from '@/components/PageHeader.vue'
import { PAGES } from '@/router/config'
import { usePetStore } from '@/store'
import PetListCard from './components/PetListCard.vue'

definePage({
  style: {
    navigationBarTitleText: '宠物档案',
    enablePullDownRefresh: true,
  },
})

const petStore = usePetStore()
const { pets } = storeToRefs(petStore)

function goAdd() {
  uni.navigateTo({ url: PAGES.PET_EDIT })
}

function goDetail(id: number) {
  uni.navigateTo({ url: `${PAGES.PET_DETAIL}?id=${id}` })
}

function goEdit(id: number) {
  uni.navigateTo({ url: `${PAGES.PET_EDIT}?id=${id}` })
}

async function handleDelete(id: number) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该宠物档案吗？',
    success: async (res) => {
      if (!res.confirm)
        return
      const ok = await petStore.remove(id)
      if (ok) {
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
      else {
        uni.showToast({ title: '删除失败', icon: 'none' })
      }
    },
  })
}

onPullDownRefresh(async () => {
  try {
    await petStore.fetchPets()
  }
  finally {
    uni.stopPullDownRefresh()
  }
})

onShow(async () => {
  if (pets.value.length === 0) {
    await petStore.fetchPets()
  }
})
</script>

<template>
  <view class="relative min-h-screen bg-page">
    <PageBackground />

    <view class="relative z-10 px-4 pt-4">
      <PageHeader title="宠物档案" :subtitle="`共 ${pets.length} 只 · 记录它们的小习惯和小秘密`" />
    </view>

    <view v-if="pets.length === 0" class="relative z-10 flex flex-col items-center justify-center px-4">
      <view class="w-full rounded-[36rpx] bg-white/80 p-6 shadow-sm backdrop-blur">
        <WdStatusTip image="/static/assets/content.png" tip="暂无宠物档案" />
        <view class="mt-5">
          <WdButton block type="primary" custom-class="!rounded-full" @click="goAdd">
            立即添加第一只
          </WdButton>
        </view>
      </view>
    </view>

    <view v-else class="relative z-10 flex flex-col gap-4 px-4">
      <PetListCard
        v-for="pet in pets"
        :key="pet.id"
        :pet="pet"
        @click="goDetail"
        @edit="goEdit"
        @delete="handleDelete"
      />
    </view>

    <!-- Floating Action Button for Add -->
    <view class="fixed bottom-10 right-6 z-20">
      <view class="rounded-full shadow-gray-500/20 shadow-lg">
        <WdButton
          type="primary"
          custom-class="!h-14 !w-14 !rounded-full !p-0 !flex !items-center !justify-center"
          @click="goAdd"
        >
          <view class="i-carbon-add text-3xl text-white font-bold" />
        </WdButton>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* No extra styles needed mostly due to unocss */
</style>
