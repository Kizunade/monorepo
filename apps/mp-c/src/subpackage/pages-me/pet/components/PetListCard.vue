<script lang="ts" setup>
import type { PetModel } from '@mock/pet/model'
import { usePetHelper } from '@/hooks/usePetHelper'

defineProps<{
  pet: PetModel.Pet
}>()

const emit = defineEmits<{
  (e: 'click', id: number): void
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}>()

const { getTypeLabel, getGenderLabel } = usePetHelper()
</script>

<template>
  <view
    class="relative overflow-hidden rounded-[36rpx] bg-white p-4 shadow-sm transition-all active:scale-[0.98]"
    @click="emit('click', pet.id)"
  >
    <view class="flex items-center gap-4">
      <!-- Avatar -->
      <view class="relative h-18 w-18 shrink-0">
        <image
          :src="pet.avatar"
          class="relative z-10 h-18 w-18 rounded-[28rpx] bg-gray-50"
          mode="aspectFill"
        />
      </view>

      <!-- Info -->
      <view class="min-w-0 flex-1">
        <view class="flex items-center justify-between">
          <view class="flex items-center gap-2">
            <text class="truncate text-lg text-gray-800 font-black">
              {{ pet.name }}
            </text>
            <view
              class="h-5 flex items-center justify-center rounded-full px-2 text-[10px] font-bold"
              :class="pet.type === 'cat' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'"
            >
              {{ getTypeLabel(pet.type) }}
            </view>
          </view>

          <!-- Actions Icons -->
          <view class="flex items-center gap-3">
            <view
              class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all active:scale-95 active:bg-gray-100"
              @click.stop="emit('edit', pet.id)"
            >
              <view class="i-carbon-edit text-base" />
            </view>
            <view
              class="h-8 w-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 transition-all active:scale-95 active:bg-red-100"
              @click.stop="emit('delete', pet.id)"
            >
              <view class="i-carbon-trash-can text-base" />
            </view>
          </view>
        </view>

        <view class="mt-1 truncate text-xs text-gray-500">
          {{ pet.breed || '未知品种' }}
        </view>

        <view class="mt-2 flex flex-wrap gap-1.5">
          <view v-if="pet.age" class="tag">
            {{ pet.age }}
          </view>
          <view class="tag">
            {{ getGenderLabel(pet.gender) }}
          </view>
          <view v-if="pet.weight != null" class="tag">
            {{ pet.weight }}kg
          </view>
          <view class="tag">
            {{ pet.sterilized ? '已绝育' : '未绝育' }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.shadow-sm {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}
.tag {
  @apply rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500 font-medium;
}
</style>
