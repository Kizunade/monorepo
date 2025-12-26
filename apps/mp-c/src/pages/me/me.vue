<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import WdNavbar from 'wot-design-uni/components/wd-navbar/wd-navbar.vue'
import BackgroundGlow from '@/components/BackgroundGlow.vue'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
})

const userStore = useUserStore()
const tokenStore = useTokenStore()
const { userInfo } = storeToRefs(userStore)

async function handleLogin() {
  await tokenStore.ensureUserLogin()
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        useTokenStore().logout()
        uni.showToast({
          title: '退出登录成功',
          icon: 'success',
        })
      }
    },
  })
}

function handleSettings() {
  uni.navigateTo({ url: '/pages/settings/index' })
}

const avatarPlaceholder = 'https://github.com/shadcn.png'

const displayName = computed(() => {
  const info = userInfo.value as any
  return info?.nickname || info?.nickName || ''
})

interface Pet {
  id: number
  name: string
  avatar: string
}

const pets = ref<Pet[]>([
  { id: 1, name: '可乐', avatar: 'https://placecats.com/200/200' },
  { id: 2, name: '团团', avatar: 'https://placecats.com/201/200' },
  { id: 3, name: '球球', avatar: 'https://placecats.com/200/201' },
  // { id: 4, name: '豆豆', avatar: 'https://placecats.com/199/200' },
])

const actions = ref([
  { key: 'orders', label: '查看订单' },
  { key: 'feedback', label: '建议反馈' },
  { key: 'follow', label: '关注公众号' },
  { key: 'privacy', label: '隐私保护条款' },
])

function handleAction(key: string) {
  if (key === 'privacy') {
    uni.showToast({ title: '隐私保护条款', icon: 'none' })
    return
  }
  uni.showToast({ title: '即将开放', icon: 'none' })
}

function toastAdd() {
  uni.showToast({ title: '添加宠物', icon: 'none' })
}
</script>

<template>
  <view class="relative min-h-screen px-4">
    <BackgroundGlow />
    <WdNavbar custom-style="background-color: transparent;" safe-area-inset-top :bordered="false" />

    <view class="flex items-center justify-between">
      <view class="flex items-center gap-3">
        <image :src="avatarPlaceholder" class="h-48rpx w-48rpx rounded-full bg-white/60" mode="aspectFill" />
        <view v-if="!tokenStore.hasLogin" class="text-lg text-gray-800 font-semibold" @click="handleLogin">
          点击登录
        </view>
        <view v-else class="text-lg text-gray-800 font-semibold">
          {{ displayName || '欢迎回来' }}
        </view>
      </view>
      <view class="i-carbon-settings text-28rpx text-gray-700" @click="handleSettings" />
    </view>

    <view class="mt-6">
      <view class="mb-3 px-1 text-base text-gray-700 font-semibold">
        我的宠物
      </view>
      <view class="grid grid-cols-2 gap-3">
        <view
          v-for="pet in pets"
          :key="pet.id"
          class="rounded-2xl bg-white/90 p-3 shadow-md"
        >
          <view class="flex flex-col items-center">
            <image :src="pet.avatar" class="h-120rpx w-120rpx rounded-full" mode="aspectFill" />
            <view class="mt-2 text-sm text-gray-700 font-medium">
              {{ pet.name }}
            </view>
          </view>
        </view>
        <view
          class="flex flex-col items-center justify-center border border-gray-300 rounded-2xl border-dashed bg-white/70 p-3 shadow"
          @click="toastAdd"
        >
          <view class="i-carbon-add text-40rpx text-gray-500" />
          <view class="mt-1 text-sm text-gray-600">
            添加
          </view>
        </view>
      </view>
    </view>

    <view class="mt-6">
      <view class="mb-3 px-1 text-base text-gray-700 font-semibold">
        更多服务
      </view>
      <view>
        <view
          v-for="act in actions"
          :key="act.key"
          class="mb-2 flex items-center justify-between rounded-2xl bg-white/90 p-4 shadow-md"
          @click="handleAction(act.key)"
        >
          <view class="text-gray-800">
            {{ act.label }}
          </view>
          <view class="i-carbon-chevron-right text-28rpx text-gray-500" />
        </view>
        <view
          v-if="tokenStore.hasLogin"
          class="mt-2 flex items-center justify-between rounded-2xl bg-white/90 p-4 shadow-md"
          @click="handleLogout"
        >
          <view class="text-red-600">
            退出登录
          </view>
          <view class="i-carbon-exit text-28rpx text-red-500" />
        </view>
      </view>
    </view>
  </view>
</template>
