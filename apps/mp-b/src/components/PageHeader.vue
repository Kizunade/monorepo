<script lang="ts" setup>
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <view class="my-4 border border-gray-100 rounded-2xl bg-white p-4 shadow-sm">
    <view class="flex items-center gap-3">
      <view class="h-5 w-1 rounded-full bg-primary" />
      <text class="text-lg text-gray-800 font-bold tracking-tight">
        {{ title }}
      </text>
    </view>
    <view v-if="subtitle" class="mt-1 pl-4 text-xs text-gray-500 font-medium">
      {{ subtitle }}
    </view>
    <slot />
  </view>
</template>

<style scoped>
.shadow-sm {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
</style>
