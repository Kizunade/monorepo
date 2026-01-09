<script lang="ts" setup>
import type { MpModel } from '@mock/mp/model'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdCellGroup from 'wot-design-uni/components/wd-cell-group/wd-cell-group.vue'
import WdCell from 'wot-design-uni/components/wd-cell/wd-cell.vue'
import WdNavbar from 'wot-design-uni/components/wd-navbar/wd-navbar.vue'
import { getUserInfo } from '@/api/login'
import BackgroundGlow from '@/components/BackgroundGlow.vue'
import PageHeader from '@/components/PageHeader.vue'
import PageNavbar from '@/components/PageNavbar.vue'
import { PAGES } from '@/router/pages'
import { useTokenStore } from '@/store/token'
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
})

const tokenStore = useTokenStore()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const scrollTop = ref(0)
const loading = ref(false)
const detail = ref<MpModel.UserInfo | null>(null)

const sitterInfo = computed(() => detail.value?.sitterInfo)
const stats = computed(() => detail.value?.stats)
const wallet = computed(() => detail.value?.wallet)

const displayName = computed(() => detail.value?.nickname || userInfo.value.nickname || '未命名')
const displayAvatar = computed(() => detail.value?.avatar || userInfo.value.avatar || '/static/images/default-avatar.png')
const displayIntro = computed(() => detail.value?.intro || userInfo.value.intro || '')

function maskPhone(phone?: string) {
  if (!phone)
    return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

async function fetchDetail() {
  if (loading.value)
    return
  loading.value = true
  try {
    const res = await getUserInfo()
    if (res.code === 200 && res.data) {
      detail.value = res.data
      userStore.setUserInfo(res.data)
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

function onScroll(e: any) {
  scrollTop.value = e?.detail?.scrollTop || 0
}

function onRefresh() {
  fetchDetail()
}

function go(url: string) {
  uni.navigateTo({ url })
}

function goSettings() {
  go(PAGES.SETTINGS_INDEX)
}

function onTapSitter() {
  go(PAGES.SITTER_PROFILE)
}

function onTapOrders() {
  go(PAGES.ME_ORDERS)
}

function onTapWallet() {
  go(PAGES.ME_WALLET)
}

function onTapRating() {
  go(PAGES.ME_RATING)
}

async function onLogout() {
  await tokenStore.logout()
  uni.showToast({ title: '已退出', icon: 'none' })
}

onShow(() => {
  fetchDetail()
})
</script>

<template>
  <view class="relative h-screen-main overflow-hidden bg-page">
    <BackgroundGlow />
    <PageNavbar
      title="我的"
      :scroll-top="scrollTop"
    />

    <scroll-view
      scroll-y
      class="h-screen-main"
      :refresher-enabled="true"
      :refresher-triggered="loading"
      @refresherrefresh="onRefresh"
      @scroll="onScroll"
    >
      <!-- 透明导航栏占位 -->
      <WdNavbar :bordered="false" custom-style="background-color: transparent;" safe-area-inset-top />
      <view class="px-4 pb-4">
        <view class="border border-gray-100 rounded-3xl bg-white/85 p-4 shadow-lg backdrop-blur">
          <view class="flex items-center gap-3">
            <image
              class="h-16 w-16 rounded-2xl"
              :src="displayAvatar"
              mode="aspectFill"
            />

            <view class="min-w-0 flex-1">
              <view class="flex items-center gap-2">
                <text class="max-w-44 truncate text-xl text-gray-900 font-black tracking-tight">
                  {{ displayName }}
                </text>
                <view
                  v-if="sitterInfo?.verified"
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700 font-bold"
                >
                  <view class="i-carbon-checkmark-filled text-[12px]" />
                  已认证
                </view>
              </view>

              <view class="mt-1 flex flex-wrap items-center gap-2">
                <view
                  v-if="sitterInfo?.level"
                  class="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] text-primary font-extrabold"
                >
                  <view class="i-carbon-award text-[12px]" />
                  {{ sitterInfo.level }}
                </view>
                <view
                  v-if="typeof sitterInfo?.serviceYears === 'number'"
                  class="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] text-gray-700 font-bold"
                >
                  <view class="i-carbon-time text-[12px]" />
                  {{ sitterInfo.serviceYears }}年经验
                </view>
              </view>

              <view class="mt-2 text-xs text-gray-500 font-medium">
                {{ maskPhone(detail?.phone || userInfo.phone) }}
              </view>

              <view
                class="mt-1 max-w-full flex items-center gap-2"
              >
                <view class="i-carbon-quotes text-[14px] text-gray-400" />
                <text
                  class="max-w-full truncate text-[12px] font-semibold"
                  :class="displayIntro ? 'text-gray-700' : 'text-gray-400'"
                >
                  {{ displayIntro || '添加一句你的服务风格（可提升信任与转化）' }}
                </text>
              </view>
            </view>

            <view
              class="h-9 w-9 flex items-center justify-center rounded-2xl bg-gray-50 active:scale-95"
              @click="go(PAGES.SETTINGS_PROFILE)"
            >
              <view class="i-carbon-edit text-lg text-gray-700" />
            </view>
          </view>

          <view class="grid grid-cols-3 mt-4 gap-2">
            <view
              class="rounded-2xl bg-gray-50 px-3 py-3 active:opacity-80"
              @click="onTapRating"
            >
              <view class="flex items-end gap-1">
                <text class="text-lg text-gray-900 font-black">{{ stats?.rating ?? '-' }}</text>
                <text class="text-[10px] text-gray-500 font-bold">/ 5.0</text>
              </view>
              <view class="mt-1 flex items-center gap-1 text-[10px] text-gray-600 font-bold">
                <view class="i-carbon-star-filled text-[12px] text-primary" />
                评分
              </view>
            </view>
            <view
              class="rounded-2xl bg-gray-50 px-3 py-3 active:opacity-80"
              @click="onTapOrders"
            >
              <view class="text-lg text-gray-900 font-black">
                {{ stats?.orderCount ?? '-' }}
              </view>
              <view class="mt-1 flex items-center gap-1 text-[10px] text-gray-600 font-bold">
                <view class="i-carbon-receipt text-[12px] text-primary" />
                订单
              </view>
            </view>
            <view class="rounded-2xl bg-gray-50 px-3 py-3">
              <view class="text-lg text-gray-900 font-black">
                {{ stats?.fans ?? '-' }}
              </view>
              <view class="mt-1 flex items-center gap-1 text-[10px] text-gray-600 font-bold">
                <view class="i-carbon-user-follow text-[12px] text-primary" />
                粉丝
              </view>
            </view>
          </view>
        </view>

        <view class="wallet-card mt-4 rounded-3xl px-4 py-4 text-white">
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <view class="h-8 w-8 flex items-center justify-center rounded-2xl bg-white/12">
                <view class="i-carbon-wallet text-lg" />
              </view>
              <view>
                <view class="text-sm font-extrabold tracking-tight">
                  钱包
                </view>
                <view class="text-[11px] text-white/70 font-semibold">
                  结算与提现一目了然
                </view>
              </view>
            </view>
            <view
              class="h-9 flex items-center justify-center rounded-2xl bg-white/12 px-3 text-[11px] font-extrabold active:scale-95"
              @click="onTapWallet"
            >
              查看明细
              <view class="i-carbon-chevron-right ml-1 text-[14px]" />
            </view>
          </view>

          <view class="grid grid-cols-3 mt-4 gap-2">
            <view class="rounded-2xl bg-white/10 px-3 py-3">
              <view class="text-[11px] text-white/70 font-bold">
                余额
              </view>
              <view class="mt-1 text-lg font-black">
                ¥{{ wallet?.balance?.toFixed?.(2) ?? '-' }}
              </view>
            </view>
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
        </view>

        <PageHeader title="快捷入口" subtitle="常用功能，一眼就到">
          <view class="grid grid-cols-4 mt-4 gap-2">
            <view class="border border-gray-100 rounded-2xl bg-white/90 px-2.5 py-3 text-center active:scale-95" @click="onTapSitter">
              <view class="mx-auto h-10 w-10 flex items-center justify-center rounded-2xl bg-gray-100">
                <view class="i-carbon-id-management text-xl text-primary" />
              </view>
              <view class="mt-2 text-[11px] text-gray-900 font-extrabold">
                档案
              </view>
            </view>
            <view class="border border-gray-100 rounded-2xl bg-white/90 px-2.5 py-3 text-center active:scale-95" @click="onTapOrders">
              <view class="mx-auto h-10 w-10 flex items-center justify-center rounded-2xl bg-gray-100">
                <view class="i-carbon-task text-xl text-primary" />
              </view>
              <view class="mt-2 text-[11px] text-gray-900 font-extrabold">
                订单
              </view>
            </view>
            <view class="border border-gray-100 rounded-2xl bg-white/90 px-2.5 py-3 text-center active:scale-95" @click="onTapRating">
              <view class="mx-auto h-10 w-10 flex items-center justify-center rounded-2xl bg-gray-100">
                <view class="i-carbon-star-review text-xl text-primary" />
              </view>
              <view class="mt-2 text-[11px] text-gray-900 font-extrabold">
                口碑
              </view>
            </view>
            <view class="border border-gray-100 rounded-2xl bg-white/90 px-2.5 py-3 text-center active:scale-95" @click="onTapWallet">
              <view class="mx-auto h-10 w-10 flex items-center justify-center rounded-2xl bg-gray-100">
                <view class="i-carbon-wallet text-xl text-primary" />
              </view>
              <view class="mt-2 text-[11px] text-gray-900 font-extrabold">
                钱包
              </view>
            </view>
          </view>
        </PageHeader>

        <view class="mt-4 overflow-hidden border border-gray-100 rounded-3xl bg-white/85 shadow-lg backdrop-blur">
          <WdCellGroup>
            <WdCell title="个人信息" is-link @click="go(PAGES.SETTINGS_PROFILE)">
              <template #icon>
                <view class="i-carbon-user-avatar mr-2 text-lg text-gray-600" />
              </template>
            </WdCell>
            <WdCell title="地址管理" is-link @click="go(PAGES.ADDRESS_LIST)">
              <template #icon>
                <view class="i-carbon-location mr-2 text-lg text-gray-600" />
              </template>
            </WdCell>
            <WdCell title="设置" is-link @click="go(PAGES.SETTINGS_INDEX)">
              <template #icon>
                <view class="i-carbon-settings mr-2 text-lg text-gray-600" />
              </template>
            </WdCell>
          </WdCellGroup>
        </view>

        <view class="mt-4">
          <WdButton plain block type="primary" @click="onLogout">
            退出登录
          </WdButton>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.shadow-lg {
  box-shadow: 0 18px 48px rgba(17, 24, 39, 0.08);
}

.wallet-card {
  background:
    radial-gradient(900rpx circle at 12% 20%, rgba(255, 122, 0, 0.35), transparent 55%),
    radial-gradient(700rpx circle at 88% 15%, rgba(255, 205, 86, 0.22), transparent 55%),
    linear-gradient(180deg, rgba(17, 24, 39, 0.92), rgba(17, 24, 39, 0.86));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 50px rgba(17, 24, 39, 0.22);
}
</style>
