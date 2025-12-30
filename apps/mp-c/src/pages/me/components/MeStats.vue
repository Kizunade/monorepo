<script lang="ts" setup>
function handleAction(key: string) {
  uni.showToast({ title: '即将开放', icon: 'none' })
}
</script>

<template>
  <view class="relative z-10 px-6">
    <!-- 悬浮数据卡片 -->
    <view class="mx-2 mt-8 flex animate-fade-in-up items-center justify-between border border-white/60 rounded-[32rpx] bg-white/80 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)] backdrop-blur-xl delay-100">
      <view class="flex flex-1 flex-col items-center gap-1 transition-transform active:scale-95" @click="handleAction('orders')">
        <view class="text-2xl text-[#333] font-bold">
          0
        </view>
        <view class="text-xs text-[#999] font-medium">
          全部订单
        </view>
      </view>
      <view class="h-8 w-[1px] bg-gray-100" />
      <view class="flex flex-1 flex-col items-center gap-1 transition-transform active:scale-95" @click="handleAction('coupons')">
        <view class="text-2xl text-[#333] font-bold">
          2
        </view>
        <view class="text-xs text-[#999] font-medium">
          优惠券
        </view>
      </view>
      <view class="h-8 w-[1px] bg-gray-100" />
      <view class="flex flex-1 flex-col items-center gap-1 transition-transform active:scale-95" @click="handleAction('points')">
        <view class="text-2xl text-[#333] font-bold">
          100
        </view>
        <view class="text-xs text-[#999] font-medium">
          我的积分
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-100 {
  animation-delay: 100ms;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
