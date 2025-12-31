<script lang="ts" setup>
</script>

<template>
  <view class="px-3 space-y-3">
    <view
      v-for="i in 5"
      :key="i"
      class="rounded-lg bg-white p-4 shadow-sm"
    >
      <view class="flex items-center gap-2">
        <!-- 姓名骨架 -->
        <view class="h-6 w-16 animate-pulse rounded bg-gray-200" />
        <!-- 电话骨架 -->
        <view class="h-5 w-24 animate-pulse rounded bg-gray-200" />
      </view>
      <!-- 地址骨架 -->
      <view class="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
    </view>
  </view>
</template>
