<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import { updateUserInfo } from '@/api/login'
import BackgroundGlow from '@/components/BackgroundGlow.vue'
import { useTokenStore } from '@/store/token'
import { useUserStore } from '@/store/user'
import { getEnvBaseUrl, HOME_PAGE } from '@/utils'
import StepBasic from './components/StepBasic.vue'
import StepCard from './components/StepCard.vue'
import StepIntro from './components/StepIntro.vue'

definePage({
  style: {
    navigationBarTitleText: '完善资料',
  },
})

const tokenStore = useTokenStore()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const step = ref(0)
const saving = ref(false)

type Gender = '男' | '女' | '保密'
interface OnboardingFormState {
  nickname: string
  intro: string
  gender: Gender
  birthday: string
  avatarUrl: string
  avatarTempPath: string
}

const form = reactive<OnboardingFormState>({
  nickname: userInfo.value.nickname || '',
  intro: userInfo.value.intro || '',
  gender: (userInfo.value.gender as Gender) || '保密',
  birthday: userInfo.value.birthday || '',
  avatarUrl: userInfo.value.avatar || '/static/images/default-avatar.png',
  avatarTempPath: '',
})

type StepKey = 'card' | 'intro' | 'basic'
interface StepMeta {
  key: StepKey
  title: string
  canNext: (state: OnboardingFormState) => boolean
}

const steps: StepMeta[] = [
  {
    key: 'card',
    title: '名片',
    canNext: s => s.nickname.trim().length >= 2,
  },
  {
    key: 'intro',
    title: '介绍',
    canNext: (s) => {
      const v = s.intro.trim()
      return v.length >= 20 && v.length <= 200
    },
  },
  {
    key: 'basic',
    title: '基本信息',
    canNext: () => true,
  },
]

const activeStep = computed(() => steps[step.value] ?? steps[0])
const activeStepKey = computed<StepKey>(() => activeStep.value.key)

const progress = computed(() => {
  return Math.round(((step.value + 1) / steps.length) * 100)
})

const canNext = computed(() => {
  return activeStep.value.canNext(form)
})

function goNext() {
  if (!canNext.value) {
    uni.showToast({ title: '请先完成当前步骤', icon: 'none' })
    return
  }
  if (step.value < steps.length - 1) {
    step.value += 1
  }
}

function goPrev() {
  if (step.value > 0) {
    step.value -= 1
  }
}

async function pickGender() {
  const itemList = ['男', '女', '保密'] as const
  const res = await new Promise<UniApp.ShowActionSheetRes>((resolve, reject) => {
    uni.showActionSheet({
      itemList: [...itemList],
      success: resolve,
      fail: reject,
    })
  })
  form.gender = itemList[res.tapIndex] ?? '保密'
}

async function pickAvatar() {
  const res = await new Promise<UniApp.ChooseImageSuccessCallbackResult>((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: resolve,
      fail: reject,
    })
  })
  const path = res.tempFilePaths?.[0]
  if (!path)
    return
  form.avatarTempPath = path
  form.avatarUrl = path
}

async function uploadAvatarIfNeeded() {
  if (!form.avatarTempPath)
    return undefined

  const url = `${getEnvBaseUrl()}/mp/upload/avatar`
  const token = tokenStore.tokenInfo.token

  const res = await new Promise<UniApp.UploadFileSuccessCallbackResult>((resolve, reject) => {
    uni.uploadFile({
      url,
      filePath: form.avatarTempPath,
      name: 'file',
      header: {
        Authorization: `Bearer ${token}`,
      },
      success: resolve,
      fail: reject,
    })
  })

  let data: any
  try {
    data = JSON.parse(res.data as any)
  }
  catch {
    data = null
  }

  if (data?.code === 200 && data?.url) {
    return data.url as string
  }
  throw new Error(data?.msg || '上传失败')
}

async function finish() {
  if (saving.value)
    return

  if (!canNext.value) {
    uni.showToast({ title: '请先完成当前步骤', icon: 'none' })
    return
  }

  saving.value = true
  try {
    const uploaded = await uploadAvatarIfNeeded()
    const res = await updateUserInfo({
      nickname: form.nickname.trim(),
      intro: form.intro.trim(),
      gender: form.gender,
      birthday: form.birthday,
      ...(uploaded ? { avatar: uploaded } : {}),
    })

    if (res.code !== 200) {
      uni.showToast({ title: res.msg || '保存失败', icon: 'none' })
      return
    }

    await userStore.fetchUserInfo()
    tokenStore.finishFirstLogin()
    uni.reLaunch({ url: HOME_PAGE })
  }
  catch (e: any) {
    uni.showToast({ title: e?.message || '保存失败', icon: 'none' })
  }
  finally {
    saving.value = false
  }
}

onLoad(() => {
  if (!tokenStore.isFirstLogin) {
    uni.navigateBack()
  }
})
</script>

<template>
  <view class="relative min-h-screen bg-page">
    <BackgroundGlow />
    <view class="px-4 pb-8 pt-4">
      <view class="border border-gray-100 rounded-3xl bg-white/85 p-4 shadow-lg backdrop-blur">
        <view class="flex items-start justify-between gap-3">
          <view class="min-w-0">
            <view class="text-base text-gray-900 font-extrabold tracking-tight">
              首次登录 · 60 秒建档
            </view>
            <view class="mt-1 text-xs text-gray-500 font-semibold">
              资料越完整，越容易获得更多优质单
            </view>
          </view>
          <view class="flex flex-col items-end">
            <view class="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] text-orange-900 font-extrabold">
              {{ progress }}%
            </view>
            <view class="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
              <view class="h-full rounded-full bg-primary transition-all" :style="{ width: `${progress}%` }" />
            </view>
          </view>
        </view>

        <view class="mt-4 flex gap-2">
          <view
            v-for="(s, i) in steps"
            :key="s.key"
            class="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold"
            :class="i === step ? 'bg-gray-900 text-white' : i < step ? 'bg-orange-100 text-orange-900' : 'bg-gray-100 text-gray-600'"
          >
            <view v-if="i < step" class="i-carbon-checkmark-filled text-[12px]" />
            <view v-else class="i-carbon-dot-mark text-[12px]" />
            {{ s.title }}
          </view>
        </view>
      </view>

      <view class="mt-4 border border-gray-100 rounded-3xl bg-white/85 p-4 shadow-lg backdrop-blur">
        <view class="text-sm text-gray-900 font-black">
          {{ activeStep.title }}
        </view>

        <StepCard
          v-if="activeStepKey === 'card'"
          :avatar-url="form.avatarUrl"
          :nickname="form.nickname"
          @pick-avatar="pickAvatar"
          @update:nickname="v => (form.nickname = v)"
        />
        <StepIntro
          v-else-if="activeStepKey === 'intro'"
          :intro="form.intro"
          @update:intro="v => (form.intro = v)"
        />
        <StepBasic
          v-else
          :gender="form.gender"
          :birthday="form.birthday"
          @pick-gender="pickGender"
          @update:birthday="v => (form.birthday = v)"
        />
      </view>

      <view class="mt-4 flex items-center gap-3">
        <WdButton v-if="step > 0" plain block :disabled="saving" @click="goPrev">
          上一步
        </WdButton>
        <WdButton
          v-if="step < steps.length - 1"
          block
          type="primary"
          :disabled="saving || !canNext"
          @click="goNext"
        >
          下一步
        </WdButton>
        <WdButton
          v-else
          block
          type="primary"
          :loading="saving"
          :disabled="saving || !canNext"
          @click="finish"
        >
          完成并开始接单
        </WdButton>
      </view>
    </view>
  </view>
</template>

<style scoped>
.shadow-lg {
  box-shadow: 0 18px 48px rgba(17, 24, 39, 0.08);
}
</style>
