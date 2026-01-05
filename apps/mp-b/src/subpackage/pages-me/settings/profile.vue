<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdCellGroup from 'wot-design-uni/components/wd-cell-group/wd-cell-group.vue'
import WdDatetimePicker from 'wot-design-uni/components/wd-datetime-picker/wd-datetime-picker.vue'
import WdInput from 'wot-design-uni/components/wd-input/wd-input.vue'
import WdPicker from 'wot-design-uni/components/wd-picker/wd-picker.vue'
import WdToast from 'wot-design-uni/components/wd-toast/wd-toast.vue'
import { updateUserInfo, uploadAvatar } from '@/api/login'
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationBarTitleText: '个人信息',
  },
})

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const toast = useToast()

const formData = reactive({
  avatar: userInfo.value.avatar || '',
  nickname: userInfo.value.nickname || '',
  gender: userInfo.value.gender || '保密',
  birthday: userInfo.value.birthday || '',
  phone: userInfo.value.phone || '',
})

const genderColumns = ref(['男', '女', '保密'])
const currentDate = ref<number | string>(formData.birthday ? new Date(formData.birthday).getTime() : '')

function maskPhone(phone: string) {
  if (!phone)
    return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

async function onChooseAvatar(e: any) {
  const { avatarUrl } = e.detail

  // Check file size/type
  try {
    const fileInfo = await uni.getFileInfo({ filePath: avatarUrl })
    const size = fileInfo.size // bytes
    if (size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过5MB')
      return
    }
    // Type check is hard with temp path, but usually chooseAvatar returns image.
    // We can rely on extension or backend check.
    // Backend mock currently doesn't check.
  }
  catch (err) {
    console.error('Get file info failed', err)
    // Continue or return? If we can't check size, maybe just proceed or warn.
    // Proceeding is better UX if getFileInfo fails for some reason.
  }

  // Upload avatar
  try {
    uni.showLoading({ title: '上传中...' })
    const uploadRes = await uploadAvatar(avatarUrl)
    // uploadRes is standard uni.uploadFile response string
    const data = JSON.parse(uploadRes.data)
    if (data.code === 200) {
      formData.avatar = data.url
      uni.hideLoading()
    }
    else {
      throw new Error(data.msg)
    }
  }
  catch (err) {
    uni.hideLoading()
    toast.error('上传失败')
    console.error(err)
  }
}

function handleGenderConfirm({ value }: any) {
  formData.gender = value
}

function handleBirthdayConfirm({ value }: any) {
  // value is timestamp
  const date = new Date(value)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  formData.birthday = `${year}-${month}-${day}`
}

async function handleSubmit() {
  if (!formData.nickname || formData.nickname.length < 2 || formData.nickname.length > 20) {
    toast.warning('昵称长度需在2-20个字符之间')
    return
  }

  try {
    uni.showLoading({ title: '保存中...' })
    const res = await updateUserInfo({
      avatar: formData.avatar,
      nickname: formData.nickname,
      gender: formData.gender as any,
      birthday: formData.birthday,
    })

    if (res.code === 200) {
      userStore.setUserInfo(res.data)
      toast.success('保存成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
    else {
      toast.error(res.msg || '保存失败')
    }
  }
  catch (err) {
    toast.error('网络异常，请重试')
    console.error(err)
  }
  finally {
    uni.hideLoading()
  }
}
</script>

<template>
  <view class="min-h-screen bg-wot-bg py-4">
    <wd-toast />

    <view class="mb-4 flex flex-col items-center justify-center bg-white p-4">
      <button
        class="m-0 flex flex-col items-center border-none bg-transparent p-0 outline-none after:border-none"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
      >
        <image :src="formData.avatar" class="h-160rpx w-160rpx rounded-full bg-wot-disabled" mode="aspectFill" />
        <view class="mt-2 text-sm text-wot-content">
          点击修改头像
        </view>
      </button>
    </view>

    <wd-cell-group border>
      <wd-input
        v-model="formData.nickname"
        custom-input-class="text-right"
        label="昵称"
        placeholder="请输入昵称"
        type="nickname"
        clearable
        :maxlength="20"
      />

      <wd-picker
        v-model="formData.gender"
        label="性别"
        align-right
        :columns="genderColumns"
        @confirm="handleGenderConfirm"
      />

      <wd-datetime-picker
        v-model="currentDate"
        label="生日"
        align-right
        type="date"
        :min-date="new Date('1900-01-01').getTime()"
        :max-date="new Date().getTime()"
        :default-value="Date.now()"
        @confirm="handleBirthdayConfirm"
      />
    </wd-cell-group>

    <view class="mt-8 px-4">
      <wd-button block @click="handleSubmit">
        保存修改
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
button::after {
  border: none;
}
</style>
