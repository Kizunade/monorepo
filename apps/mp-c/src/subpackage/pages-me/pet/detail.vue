<script lang="ts" setup>
import type { PetModel } from '@mock/pet/model'
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import WdStatusTip from 'wot-design-uni/components/wd-status-tip/wd-status-tip.vue'
import WdTab from 'wot-design-uni/components/wd-tab/wd-tab.vue'
import WdTabs from 'wot-design-uni/components/wd-tabs/wd-tabs.vue'
import { getPetDetail } from '@/api/pet'
import PageNavbar from '@/components/PageNavbar.vue'
import { usePetHelper } from '@/hooks/usePetHelper'
import { PAGES } from '@/router/config'
import { usePetStore } from '@/store'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '宠物详情',
  },
})

const petStore = usePetStore()
const { getTypeLabel } = usePetHelper()
const petId = ref<number | null>(null)
const pet = ref<PetModel.Pet | null>(null)
const loading = ref(false)
const scrollTop = ref(0)
const currentTab = ref(0)

// Calculate safe area + navbar height for sticky tabs
const systemInfo = uni.getSystemInfoSync()
const offsetTop = (systemInfo.statusBarHeight || 0) + 44

const petAge = computed(() => pet.value?.age || '-')
const petWeight = computed(() => pet.value?.weight != null ? `${pet.value.weight}` : '-')

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
    title: '确认移除',
    content: '移除后无法恢复，确定要送走它吗？',
    confirmColor: '#FF7A00',
    cancelColor: '#9CA3AF',
    success: async (res) => {
      if (!res.confirm)
        return
      const ok = await petStore.remove(petId.value!)
      if (ok) {
        uni.showToast({ title: '已移除', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 800)
      }
      else {
        uni.showToast({ title: '移除失败', icon: 'none' })
      }
    },
  })
}

function handleScroll(e: any) {
  scrollTop.value = e.detail.scrollTop
}

function handleTabChange(e: any) {
  if (e.index > 0) {
    uni.showToast({
      title: '功能升级中...',
      icon: 'none',
      duration: 2000,
    })
  }
}

function handleShare() {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline'],
  })
}

function handleLike() {
  uni.showToast({
    title: '已点赞',
    icon: 'none', // Use none to avoid default success icon, maybe custom image better but keep simple
  })
}

function handleComment() {
  uni.showToast({
    title: '评论功能开发中',
    icon: 'none',
  })
}

onShareAppMessage(() => {
  return {
    title: `这是我家 ${pet.value?.name || '毛孩子'}，快来看看！`,
    path: `${PAGES.PET_DETAIL}?id=${petId.value}`,
    imageUrl: pet.value?.avatar || '',
  }
})

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
  <view class="relative h-screen overflow-hidden bg-page font-sans">
    <!-- Immersive Ambient Background -->
    <view class="pointer-events-none absolute left-0 right-0 top-0 h-[70vh] overflow-hidden">
      <!-- Gradient Orb 1 -->
      <view class="absolute h-[400rpx] w-[400rpx] rounded-full bg-orange-200/20 blur-[80px] -right-20 -top-20" />
      <!-- Gradient Orb 2 -->
      <view class="absolute top-40 h-[300rpx] w-[300rpx] rounded-full bg-blue-100/20 blur-[60px] -left-20" />
    </view>

    <!-- Navbar -->
    <PageNavbar
      :title="scrollTop > 100 ? (pet?.name || '宠物详情') : ''"
      :scroll-top="scrollTop"
    />

    <scroll-view
      scroll-y
      class="h-screen w-full"
      :show-scrollbar="false"
      @scroll="handleScroll"
    >
      <view class="px-5 pb-36 pt-28">
        <!-- Loading Skeleton -->
        <view v-if="!pet && loading" class="mt-10 animate-pulse space-y-6">
          <view class="mx-auto h-32 w-32 rounded-full bg-gray-200/50" />
          <view class="mx-auto h-8 w-40 rounded-full bg-gray-200/50" />
          <view class="grid grid-cols-2 mt-8 gap-4">
            <view class="h-24 rounded-2xl bg-gray-200/50" />
            <view class="h-24 rounded-2xl bg-gray-200/50" />
          </view>
        </view>

        <!-- Empty State -->
        <view v-else-if="!pet && !loading" class="mt-32 flex flex-col items-center justify-center">
          <view class="border border-white/50 rounded-[32rpx] bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <WdStatusTip image="/static/assets/content.png" tip="暂无宠物数据" />
          </view>
        </view>

        <!-- Main Content -->
        <view v-else-if="pet" class="animate-fade-in-up space-y-4">
          <!-- Compact Profile Card -->
          <view class="relative overflow-hidden border border-gray-100 rounded-2xl bg-white p-5 shadow-sm">
            <!-- Basic Info Row -->
            <view class="flex items-stretch gap-4">
              <!-- Avatar -->
              <view class="relative shrink-0">
                <image
                  :src="pet.avatar"
                  mode="aspectFill"
                  class="h-14 w-14 border border-gray-100 rounded-full bg-gray-50 object-cover"
                />
                <!-- Gender Badge -->
                <view class="absolute bottom-0 right-0 translate-x-1 translate-y-1">
                  <view class="h-6 w-6 flex items-center justify-center border border-white rounded-full bg-white shadow-sm">
                    <view
                      :class="pet.gender === 'male' ? 'i-carbon-gender-male text-[#5CA1FF]' : 'i-carbon-gender-female text-[#FF6B9C]'"
                      class="text-xs"
                    />
                  </view>
                </view>
              </view>

              <!-- Name & Tags -->
              <view class="min-w-0 flex flex-1 flex-col justify-between py-1">
                <view class="flex items-center gap-2">
                  <text class="truncate text-xl text-gray-900 font-bold">{{ pet.name }}</text>
                </view>
                <view class="mt-2 flex flex-wrap items-center gap-2">
                  <text class="rounded-lg bg-orange-50 px-2 py-0.5 text-xs text-orange-600 font-medium">
                    {{ getTypeLabel(pet.type) }}
                  </text>
                  <text class="text-xs text-gray-300">|</text>
                  <text class="text-xs text-gray-500">{{ pet.breed || '未知品种' }}</text>
                </view>
              </view>
            </view>

            <!-- Divider -->
            <view class="my-5 h-px w-full bg-gray-50" />

            <!-- Stats Row -->
            <view class="grid grid-cols-3 divide-x divide-gray-50">
              <!-- Age -->
              <view class="flex flex-col items-center gap-1 px-2">
                <text class="text-[10px] text-gray-400">年龄</text>
                <text class="text-base text-gray-800 font-bold">{{ petAge }}</text>
              </view>

              <!-- Weight -->
              <view class="flex flex-col items-center gap-1 px-2">
                <text class="text-[10px] text-gray-400">体重</text>
                <view class="flex items-baseline gap-0.5">
                  <text class="text-base text-gray-800 font-bold">{{ petWeight }}</text>
                  <text class="text-[10px] text-gray-400 font-normal">kg</text>
                </view>
              </view>

              <!-- Status -->
              <view class="flex flex-col items-center gap-1 px-2">
                <text class="text-[10px] text-gray-400">状态</text>
                <view class="flex items-center gap-1">
                  <view
                    :class="pet.sterilized ? 'i-carbon-certificate-check text-green-500' : 'i-carbon-help text-gray-300'"
                    class="text-sm"
                  />
                  <text class="text-sm font-medium" :class="pet.sterilized ? 'text-gray-800' : 'text-gray-400'">
                    {{ pet.sterilized ? '已绝育' : '未绝育' }}
                  </text>
                </view>
              </view>
            </view>
          </view>

          <!-- Content Tabs -->
          <view class="min-h-[400rpx]">
            <WdTabs
              v-model="currentTab"
              :offset-top="offsetTop"
              animated swipeable
              background="transparent"
              color="#FF7A00"
              inactive-color="#9CA3AF"
              line-width="20"
              line-height="3"
              custom-class="rounded-2xl overflow-hidden"
              @change="handleTabChange"
            >
              <WdTab title="关于 TA">
                <view class="px-1 py-4">
                  <view class="border border-gray-50 rounded-[24rpx] bg-white p-6 text-sm text-gray-600 leading-relaxed shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                    <view class="mb-3 flex items-center gap-2 text-gray-900 font-bold">
                      <view class="i-carbon-quotes text-orange-500" />
                      <text>主人寄语</text>
                    </view>
                    <text>
                      这个主人很懒，还没有写下 {{ pet.name }} 的故事...
                      <br>
                      <text class="mt-2 block text-xs text-gray-300">在这里记录它成长的点点滴滴吧 ~</text>
                    </text>
                  </view>
                </view>
              </WdTab>
              <WdTab title="洗护记录">
                <view class="flex flex-col items-center justify-center py-12 opacity-50">
                  <view class="i-carbon-clean mb-2 text-4xl text-gray-300" />
                  <text class="text-xs text-gray-400">暂无洗护记录</text>
                </view>
              </WdTab>
              <WdTab title="相册">
                <view class="flex flex-col items-center justify-center py-12 opacity-50">
                  <view class="i-carbon-image mb-2 text-4xl text-gray-300" />
                  <text class="text-xs text-gray-400">暂无照片</text>
                </view>
              </WdTab>
            </WdTabs>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- Floating Action Dock -->
    <view v-if="pet" class="fixed bottom-8 left-0 right-0 z-50 animate-fade-in-up px-6">
      <view class="flex items-center gap-3 border border-white/50 rounded-full bg-white/80 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-lg">
        <!-- Owner Actions -->
        <template v-if="pet.isOwner">
          <!-- Delete Button -->
          <button
            class="h-12 w-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors active:bg-gray-100 active:text-red-500"
            @click="handleDelete"
          >
            <view class="i-carbon-trash-can text-xl" />
          </button>

          <!-- Edit Button (Main) -->
          <button
            class="h-12 flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98]"
            @click="goEdit"
          >
            <view class="i-carbon-edit text-lg" />
            <text class="text-sm font-bold">编辑资料</text>
          </button>
        </template>

        <!-- Visitor Actions -->
        <template v-else>
          <!-- Like Button -->
          <button
            class="h-12 w-12 flex items-center justify-center rounded-full bg-pink-50 text-pink-500 transition-colors active:scale-90 active:bg-pink-100"
            @click="handleLike"
          >
            <view class="i-carbon-favorite text-xl" />
          </button>

          <!-- Comment Button -->
          <button
            class="h-12 w-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 transition-colors active:scale-90 active:bg-blue-100"
            @click="handleComment"
          >
            <view class="i-carbon-chat text-xl" />
          </button>

          <!-- Share Button (Main) -->
          <button
            class="h-12 flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98]"
            open-type="share"
          >
            <view class="i-carbon-share text-lg" />
            <text class="text-sm font-bold">分享给朋友</text>
          </button>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(::-webkit-scrollbar) {
  display: none;
}
</style>
