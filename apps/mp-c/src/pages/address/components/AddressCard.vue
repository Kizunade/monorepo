<script lang="ts" setup>
import type { AddressModel } from '@mock/address/model'

interface Props {
  item: AddressModel.Address
}

interface Emits {
  (e: 'click', item: AddressModel.Address): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleClick() {
  emit('click', props.item)
}
</script>

<template>
  <view
    class="rounded-lg bg-white p-4 shadow-sm active:bg-gray-50"
    @click="handleClick"
  >
    <view class="flex items-center justify-between">
      <view class="flex items-center gap-2">
        <text class="text-lg font-bold">
          {{ item.name }}
        </text>
        <text class="text-gray-500">
          {{ item.phone }}
        </text>
        <view
          v-if="item.isDefaultAddr"
          class="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-500"
        >
          默认
        </view>
      </view>
    </view>
    <view class="mt-2 text-sm text-gray-600">
      {{ item.city }}{{ item.address }}{{ item.houseNo }}
    </view>
  </view>
</template>
