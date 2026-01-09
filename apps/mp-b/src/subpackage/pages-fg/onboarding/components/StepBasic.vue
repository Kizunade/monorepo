<script setup lang="ts">
const props = defineProps<{
  gender: '男' | '女' | '保密'
  birthday: string
}>()

const emit = defineEmits<{
  (e: 'pick-gender'): void
  (e: 'update:birthday', v: string): void
}>()

function onBirthdayChange(e: any) {
  emit('update:birthday', e?.detail?.value || '')
}
</script>

<template>
  <view class="mt-4">
    <view class="grid grid-cols-2 gap-2">
      <view class="rounded-3xl bg-gray-50 px-3 py-3" @click="emit('pick-gender')">
        <view class="text-[11px] text-gray-500 font-bold">
          性别
        </view>
        <view class="mt-1 flex items-center justify-between">
          <view class="text-sm text-gray-900 font-black">
            {{ gender || '保密' }}
          </view>
          <view class="i-carbon-chevron-right text-lg text-gray-500" />
        </view>
      </view>

      <picker mode="date" :value="birthday" @change="onBirthdayChange">
        <view class="rounded-3xl bg-gray-50 px-3 py-3">
          <view class="text-[11px] text-gray-500 font-bold">
            生日
          </view>
          <view class="mt-1 flex items-center justify-between">
            <view class="text-sm text-gray-900 font-black">
              {{ birthday || '选择日期' }}
            </view>
            <view class="i-carbon-calendar text-lg text-gray-500" />
          </view>
        </view>
      </picker>
    </view>

    <view class="mt-3 border border-gray-100 rounded-3xl bg-white px-3 py-3">
      <view class="text-xs text-gray-600 font-semibold">
        你之后还可以在「我的 → 宠托师信息」继续补充服务项、半径、档期。
      </view>
    </view>
  </view>
</template>
