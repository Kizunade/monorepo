<script setup lang="ts">
import { computed } from 'vue'
import WdInput from 'wot-design-uni/components/wd-input/wd-input.vue'

const props = defineProps<{
  avatarUrl: string
  nickname: string
}>()

const emit = defineEmits<{
  (e: 'pick-avatar'): void
  (e: 'update:nickname', v: string): void
}>()

const nicknameModel = computed({
  get: () => props.nickname,
  set: v => emit('update:nickname', v),
})
</script>

<template>
  <view class="mt-4">
    <view class="flex items-center gap-4">
      <view class="relative">
        <image
          :src="avatarUrl"
          mode="aspectFill"
          class="h-16 w-16 rounded-3xl bg-gray-100"
          @click="emit('pick-avatar')"
        />
        <view class="absolute rounded-full bg-gray-900 px-2 py-1 text-[10px] text-white font-extrabold -bottom-1 -right-1">
          换
        </view>
      </view>
      <view class="min-w-0 flex-1">
        <view class="text-xs text-gray-500 font-semibold">
          昵称（至少 2 个字）
        </view>
        <WdInput v-model="nicknameModel" placeholder="比如：阿梨宠托" clearable />
        <view class="mt-1 text-[11px] text-gray-500 font-semibold">
          这是用户看到你的第一眼
        </view>
      </view>
    </view>
  </view>
</template>
