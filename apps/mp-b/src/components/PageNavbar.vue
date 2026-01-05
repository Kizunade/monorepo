<script lang="ts" setup>
import { computed } from 'vue'
import WdNavbar from 'wot-design-uni/components/wd-navbar/wd-navbar.vue'
import { PAGES } from '@/router/pages'

const props = withDefaults(defineProps<{
  title?: string
  scrollTop?: number
  opacityThreshold?: number
  transparent?: boolean
}>(), {
  title: '',
  scrollTop: 0,
  opacityThreshold: 100,
  transparent: true, // Default to transparent/immersive mode behavior
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'home'): void
}>()

// Page stack check
const pages = getCurrentPages()
const hasHistory = pages.length > 1

// Calculate opacity based on scroll position
const navbarStyle = computed(() => {
  if (!props.transparent) {
    return 'background-color: #fff; --wd-navbar-title-color: #333;'
  }
  
  const threshold = props.opacityThreshold
  const top = props.scrollTop
  let opacity = top / threshold
  if (opacity > 1) opacity = 1
  if (opacity < 0) opacity = 0

  return `background-color: rgba(255, 255, 255, ${opacity}); --wd-navbar-title-color: rgba(0, 0, 0, ${opacity});`
})

const titleStyle = computed(() => {
  if (!props.transparent) return 'opacity: 1; color: #333;'

  const threshold = props.opacityThreshold
  const top = props.scrollTop
  let opacity = top / threshold
  if (opacity > 1) opacity = 1
  
  return `opacity: ${opacity}; transition: opacity 0.2s; color: #333;`
})

const iconColor = computed(() => {
  if (!props.transparent) return '#333'
  
  const threshold = props.opacityThreshold
  const top = props.scrollTop
  // Keep dark for better visibility on light backgrounds or switch based on design
  // For this specific design, we use dark icons as the background is light/gradient
  return '#333' 
})

function handleLeftClick() {
  if (hasHistory) {
    emit('back')
    uni.navigateBack()
  } else {
    emit('home')
    uni.reLaunch({ url: PAGES.INDEX })
  }
}
</script>

<template>
  <view class="fixed left-0 top-0 z-50 w-full">
    <WdNavbar
      :bordered="false"
      :custom-style="navbarStyle"
      safe-area-inset-top
      fixed
      :placeholder="false"
    >
      <template #left>
        <view
          class="h-8 w-8 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md transition-all active:scale-90"
          @click="handleLeftClick"
        >
          <view 
            :class="hasHistory ? 'i-carbon-chevron-left' : 'i-carbon-home'" 
            class="text-lg" 
            :style="{ color: iconColor }" 
          />
        </view>
      </template>

      <template #title>
        <text class="text-base font-bold" :style="titleStyle">{{ title }}</text>
      </template>

      <template #right>
        <slot name="right" :icon-color="iconColor" />
      </template>
    </WdNavbar>
  </view>
</template>
