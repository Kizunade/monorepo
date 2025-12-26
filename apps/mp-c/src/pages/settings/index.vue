<script lang="ts" setup>
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdCellGroup from 'wot-design-uni/components/wd-cell-group/wd-cell-group.vue'
import WdCell from 'wot-design-uni/components/wd-cell/wd-cell.vue'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationBarTitleText: '设置',
  },
})

const tokenStore = useTokenStore()

function handleNavigate(url: string) {
  uni.navigateTo({ url })
}

function unsupportedFeature() {
  uni.showToast({ title: '即将开放', icon: 'none' })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        tokenStore.logout()
        uni.navigateBack()
      }
    },
  })
}
</script>

<template>
  <view class="min-h-screen bg-gray-100 py-4">
    <WdCellGroup border>
      <WdCell title="手机绑定" is-link clickable @click="unsupportedFeature()" />
      <WdCell title="实名认证" is-link clickable @click="unsupportedFeature()" />
      <WdCell title="地址管理" is-link clickable @click="handleNavigate('/pages/address/list')" />
    </WdCellGroup>

    <view class="mt-6 px-4">
      <WdButton type="error" block @click="handleLogout">
        退出登录
      </WdButton>
    </view>
  </view>
</template>
