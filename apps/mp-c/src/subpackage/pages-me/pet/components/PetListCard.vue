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
    class="relative overflow-hidden border border-gray-100 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.98]"
    @click="emit('click', pet.id)"
  >
    <view class="flex items-center gap-3">
      <!-- Avatar -->
      <view class="relative h-16 w-16 shrink-0">
        <image
          :src="pet.avatar"
          class="relative z-10 h-16 w-16 rounded-xl bg-gray-50 object-cover"
          mode="aspectFill"
        />
      </view>

      <!-- Info -->
      <view class="min-w-0 flex-1">
        <view class="flex items-center justify-between">
          <view class="flex items-center gap-2">
            <text class="truncate text-base text-gray-800 font-bold">
              {{ pet.name }}
            </text>
            <view
              class="flex items-center justify-center rounded-lg px-1.5 py-0.5 text-[10px] font-medium"
              :class="pet.type === 'cat' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'"
            >
              {{ getTypeLabel(pet.type) }}
            </view>
          </view>

          <!-- Actions Icons -->
          <view class="flex items-center gap-2">
            <view
              class="h-7 w-7 flex items-center justify-center rounded-full text-gray-400 transition-all active:bg-gray-100 active:text-gray-600"
              @click.stop="emit('edit', pet.id)"
            >
              <view class="i-carbon-edit text-xs" />
            </view>
            <view
              class="h-7 w-7 flex items-center justify-center rounded-full text-gray-400 transition-all active:bg-red-50 active:text-red-500"
              @click.stop="emit('delete', pet.id)"
            >
              <view class="i-carbon-trash-can text-xs text-error" />
            </view>
          </view>
        </view>

        <view class="mt-0.5 truncate text-xs text-gray-500">
          {{ pet.breed || '未知品种' }}
        </view>

        <view class="mt-2 flex flex-wrap gap-2">
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
.tag {
  @apply rounded-lg bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500 font-medium border border-gray-100;
}
</style>
