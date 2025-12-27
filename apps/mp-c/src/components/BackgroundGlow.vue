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
    radial-gradient(900px circle at 10% 10%, var(--glow-color-1), transparent 60%),
    radial-gradient(700px circle at 80% 20%, var(--glow-color-2), transparent 60%),
    radial-gradient(900px circle at 20% 80%, var(--glow-color-3), transparent 60%),
    radial-gradient(600px circle at 90% 70%, var(--glow-color-4), transparent 60%);
  filter: blur(60px);
  transform: translateZ(0);
}
.overlay {
  background: linear-gradient(180deg, var(--overlay-start), var(--overlay-end));
}
</style>
