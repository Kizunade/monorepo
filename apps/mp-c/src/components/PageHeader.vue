<script lang="ts" setup>
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <view class="mb-4 rounded-[36rpx] bg-white/70 p-4 shadow-sm backdrop-blur-md">
    <view class="flex items-center gap-2">
      <view class="h-6 w-1.5 rounded-full bg-primary" />
      <text class="text-xl text-gray-800 font-black tracking-wide">
        {{ title }}
      </text>
    </view>
    <view v-if="subtitle" class="mt-2 text-xs text-gray-500">
      {{ subtitle }}
    </view>
    <slot />
  </view>
</template>

<style scoped>
.shadow-sm {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}
</style>
