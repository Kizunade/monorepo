<script setup lang="ts">
import { computed } from 'vue'
import WdTextarea from 'wot-design-uni/components/wd-textarea/wd-textarea.vue'

const props = defineProps<{
  intro: string
}>()

const emit = defineEmits<{
  (e: 'update:intro', v: string): void
}>()

const introModel = computed({
  get: () => props.intro,
  set: v => emit('update:intro', v),
})

const trimmedLen = computed(() => introModel.value.trim().length)
const remain = computed(() => Math.max(0, 20 - trimmedLen.value))
</script>

<template>
  <view class="mt-4">
    <view class="text-xs text-gray-500 font-semibold">
      用 2-3 句话说清楚：擅长什么 + 你怎么做 + 你会记录什么
    </view>
    <view class="mt-3 border border-gray-100 rounded-3xl bg-gray-50 px-3 py-3">
      <WdTextarea
        v-model="introModel"
        no-border
        placeholder="示例：擅长照顾胆小猫，上门会先确认门牌并全程记录。喂食、换水、清理猫砂后会补拍照片，结束前会复核一次状态并回访。"
        placeholder-style="color: rgba(31, 41, 55, 0.40); font-weight: 600; font-size: 14px;"
        :maxlength="200"
        show-word-limit
        custom-textarea-class="text-sm text-gray-900 font-semibold leading-6"
      />
    </view>
  </view>
</template>
