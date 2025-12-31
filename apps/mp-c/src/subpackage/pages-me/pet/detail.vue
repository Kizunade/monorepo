<script lang="ts" setup>
import type { PetModel } from '@mock/pet/model'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdStatusTip from 'wot-design-uni/components/wd-status-tip/wd-status-tip.vue'
import { getPetDetail } from '@/api/pet'
import PageBackground from '@/components/PageBackground.vue'
import PageHeader from '@/components/PageHeader.vue'
import { usePetHelper } from '@/hooks/usePetHelper'
import { PAGES } from '@/router/config'
import { usePetStore } from '@/store'

definePage({
  style: {
    navigationBarTitleText: '宠物详情',
  },
})

const petStore = usePetStore()
const { getTypeLabel, getGenderLabel } = usePetHelper()
const petId = ref<number | null>(null)
const pet = ref<PetModel.Pet | null>(null)
const loading = ref(false)

async function load() {
  if (petId.value == null)
    return

  const storePet = petStore.pets.find(p => p.id === petId.value)
  if (storePet)
    pet.value = storePet

  loading.value = true
  try {
    const res = await getPetDetail({ id: petId.value })
    if (res.code === 200) {
      pet.value = res.data
    }
  }
  finally {
    loading.value = false
  }
}

function goEdit() {
  if (petId.value == null)
    return
  uni.navigateTo({ url: `${PAGES.PET_EDIT}?id=${petId.value}` })
}

function handleDelete() {
  if (petId.value == null)
    return

  uni.showModal({
    title: '提示',
    content: '确定要删除该宠物档案吗？',
    success: async (res) => {
      if (!res.confirm)
        return
      const ok = await petStore.remove(petId.value!)
      if (ok) {
        uni.showToast({ title: '删除成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 800)
      }
      else {
        uni.showToast({ title: '删除失败', icon: 'none' })
      }
    },
  })
}

onLoad((options) => {
  const id = options?.id ? Number(options.id) : Number.NaN
  if (!Number.isNaN(id)) {
    petId.value = id
  }
})

onShow(() => {
  load()
})
</script>

<template>
  <view class="relative min-h-screen bg-page">
    <PageBackground />

    <view class="relative z-10 p-4">
      <PageHeader title="宠物详情" subtitle="更好地了解它，照顾也会更轻松" />

      <view v-if="!pet && loading" class="space-y-4">
        <!-- Skeleton -->
        <view class="rounded-[36rpx] bg-white/70 p-4 shadow-sm backdrop-blur-md">
          <view class="flex items-center gap-4">
            <view class="h-24 w-24 animate-pulse rounded-[32rpx] bg-gray-200" />
            <view class="min-w-0 flex-1">
              <view class="h-6 w-28 animate-pulse rounded bg-gray-200" />
              <view class="mt-3 h-4 w-40 animate-pulse rounded bg-gray-200" />
            </view>
          </view>
        </view>
      </view>

      <view v-else-if="!pet && !loading" class="pt-12">
        <view class="rounded-[36rpx] bg-white/80 p-6 shadow-sm backdrop-blur">
          <WdStatusTip image="/static/assets/content.png" tip="未找到宠物信息" />
        </view>
      </view>

      <view v-else-if="pet" class="space-y-4">
        <!-- Main Card -->
        <view class="rounded-[36rpx] bg-white p-6 shadow-sm">
          <view class="flex flex-col items-center">
            <view class="relative h-28 w-28">
              <image :src="pet.avatar" class="relative z-10 h-28 w-28 rounded-[40rpx] bg-gray-50 shadow-inner" mode="aspectFill" />
            </view>

            <view class="mt-4 flex items-center gap-2">
              <text class="text-2xl text-gray-800 font-black">{{ pet.name }}</text>
              <view
                class="h-6 flex items-center rounded-full px-2.5 text-xs font-bold"
                :class="pet.type === 'cat' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'"
              >
                {{ getTypeLabel(pet.type) }}
              </view>
            </view>

            <view class="mt-1 text-sm text-gray-500">
              {{ pet.breed || '未知品种' }}
            </view>
          </view>
        </view>

        <!-- Stats Grid -->
        <view class="grid grid-cols-2 gap-3">
          <view class="stat-card">
            <view class="stat-label">
              年龄
            </view>
            <view class="stat-value">
              {{ pet.age || '-' }}
            </view>
          </view>
          <view class="stat-card">
            <view class="stat-label">
              性别
            </view>
            <view class="stat-value">
              {{ getGenderLabel(pet.gender) }}
            </view>
          </view>
          <view class="stat-card">
            <view class="stat-label">
              体重
            </view>
            <view class="stat-value">
              {{ pet.weight != null ? `${pet.weight}kg` : '-' }}
            </view>
          </view>
          <view class="stat-card">
            <view class="stat-label">
              绝育状态
            </view>
            <view class="stat-value">
              {{ pet.sterilized ? '已绝育' : '未绝育' }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="fixed bottom-0 left-0 right-0 z-20 border-t border-white/60 bg-white/70 p-4 backdrop-blur-md pb-safe">
      <view class="flex gap-3">
        <WdButton block type="primary" custom-class="!rounded-full !flex-1" @click="goEdit">
          编辑
        </WdButton>
        <WdButton type="error" plain block custom-class="!rounded-full !flex-1 !bg-white/50" @click="handleDelete">
          删除
        </WdButton>
      </view>
    </view>
  </view>
</template>

<style scoped>
.stat-card {
  @apply rounded-[32rpx] bg-white/70 p-4 shadow-sm backdrop-blur transition-transform active:scale-[0.98];
}
.stat-label {
  @apply text-xs text-gray-400 mb-1;
}
.stat-value {
  @apply text-lg font-black text-gray-800;
}
.shadow-sm {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}
</style>
