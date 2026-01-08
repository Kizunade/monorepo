<script lang="ts" setup>
// Pure presentation component for the background blobs
</script>

<template>
  <view class="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
    <view class="absolute h-90 w-90 rounded-full bg-orange-200/50 blur-3xl -left-30 -top-30" />
    <view class="absolute top-30 h-70 w-70 rounded-full bg-amber-200/40 blur-3xl -right-24" />
    <view class="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-rose-200/35 blur-3xl" />
  </view>
</template>
