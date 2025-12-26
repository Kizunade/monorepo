<script setup lang="ts"></script>

<template>
  <view class="absolute inset-0 overflow-hidden -z-10">
    <view class="glow" />
  </view>
  <slot />
  <view class="overlay absolute inset-0 -z-10" />
</template>

<style scoped>
.glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px circle at 10% 10%, rgba(255, 138, 76, 0.45), transparent 60%),
    radial-gradient(700px circle at 80% 20%, rgba(255, 99, 132, 0.45), transparent 60%),
    radial-gradient(900px circle at 20% 80%, rgba(255, 205, 86, 0.45), transparent 60%),
    radial-gradient(600px circle at 90% 70%, rgba(255, 159, 64, 0.45), transparent 60%);
  filter: blur(60px);
  transform: translateZ(0);
}
.overlay {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8));
}
</style>
