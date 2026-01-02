<script lang="ts" setup>
import type { PetModel } from '@mock/pet/model'
import type { FormProps } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdCellGroup from 'wot-design-uni/components/wd-cell-group/wd-cell-group.vue'
import WdCell from 'wot-design-uni/components/wd-cell/wd-cell.vue'
import WdForm from 'wot-design-uni/components/wd-form/wd-form.vue'
import WdInput from 'wot-design-uni/components/wd-input/wd-input.vue'
import WdPicker from 'wot-design-uni/components/wd-picker/wd-picker.vue'
import { getPetDetail } from '@/api/pet'
import PageHeader from '@/components/PageHeader.vue'
import { usePetHelper } from '@/hooks/usePetHelper'
import { useGlobalConfigStore, usePetStore } from '@/store'

definePage({
  style: {
    navigationBarTitleText: '编辑宠物',
  },
})

const petStore = usePetStore()
const globalConfigStore = useGlobalConfigStore()
const { typeOptions, genderOptions, fallbackCatBreeds, fallbackDogBreeds, getDefaultAvatar } = usePetHelper()

const form = ref()
const isEdit = ref(false)
const petId = ref<number | null>(null)

const formData = ref<PetModel.AddPetParams & Partial<Pick<PetModel.Pet, 'id'>>>({
  name: '',
  type: 'cat',
  avatar: 'https://placecats.com/200/200',
  breed: '',
  age: '',
  gender: 'female',
  weight: undefined,
  sterilized: false,
  isOwner: true,
})

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请输入宠物昵称' }],
  type: [{ required: true, message: '请选择宠物类型' }],
  avatar: [{ required: true, message: '请设置宠物头像' }],
}

const breedColumns = computed(() => {
  const formOptions = globalConfigStore.config?.formOptions
  const cats = formOptions?.catBreeds?.map(i => ({ label: i.label, value: i.label }))
  const dogs = formOptions?.dogBreeds?.map(i => ({ label: i.label, value: i.label }))
  return formData.value.type === 'cat'
    ? (cats?.length ? cats : fallbackCatBreeds)
    : (dogs?.length ? dogs : fallbackDogBreeds)
})

const pageTitle = computed(() => (isEdit.value ? '编辑宠物' : '新增宠物'))
const typeLabel = computed(() => (formData.value.type === 'cat' ? '猫' : '狗'))
const genderLabel = computed(() => (formData.value.gender === 'male' ? '公' : '母'))

function applyDefaultAvatar() {
  formData.value.avatar = getDefaultAvatar(formData.value.type)
}

function chooseAvatar() {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    success: (res) => {
      const filePath = res.tempFiles?.[0]?.tempFilePath
      if (filePath)
        formData.value.avatar = filePath
    },
  })
}

async function loadPetById(id: number) {
  const storePet = petStore.pets.find(p => p.id === id)
  if (storePet) {
    formData.value = { ...storePet }
    return
  }

  const res = await getPetDetail({ id })
  if (res.code === 200) {
    formData.value = { ...res.data }
  }
}

async function handleSave() {
  const { valid } = await form.value.validate()
  if (!valid)
    return

  if (!formData.value.avatar)
    applyDefaultAvatar()

  if (isEdit.value && petId.value != null) {
    const ok = await petStore.update({
      ...(formData.value as PetModel.UpdatePetParams),
      id: petId.value,
    })
    if (ok) {
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 800)
    }
    else {
      uni.showToast({ title: '保存失败', icon: 'none' })
    }
  }
  else {
    const ok = await petStore.add(formData.value as PetModel.AddPetParams)
    if (ok) {
      uni.showToast({ title: '添加成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 800)
    }
    else {
      uni.showToast({ title: '添加失败', icon: 'none' })
    }
  }
}

onLoad(async (options) => {
  if (!globalConfigStore.config) {
    await globalConfigStore.fetchConfig()
  }

  const id = options?.id ? Number(options.id) : Number.NaN
  if (!Number.isNaN(id)) {
    isEdit.value = true
    petId.value = id
    uni.setNavigationBarTitle({ title: '编辑宠物' })
    await loadPetById(id)
  }
  else {
    uni.setNavigationBarTitle({ title: '新增宠物' })
  }
})
</script>

<template>
  <view class="relative min-h-screen bg-page">
    <view class="relative z-10 p-4 pb-32 space-y-4">
      <PageHeader :title="pageTitle" subtitle="完整的信息会让服务人员更懂它" />

      <!-- Content Card -->
      <view class="overflow-hidden border border-gray-100 rounded-2xl bg-white p-4 shadow-sm">
        <!-- Avatar Section (Refined Style) -->
        <view class="relative overflow-hidden border border-orange-100/50 rounded-xl bg-orange-50/50 p-4">
          <view class="relative z-10 flex items-center gap-4">
            <view class="relative h-20 w-20 shrink-0">
              <image
                :src="formData.avatar"
                class="relative z-10 h-20 w-20 border border-white rounded-xl bg-gray-100 object-cover shadow-sm"
                mode="aspectFill"
              />
              <view class="absolute z-20 rounded-full bg-white p-1 shadow-sm -bottom-1 -right-1">
                <view class="i-carbon-camera text-base text-gray-500" />
              </view>
            </view>

            <view class="min-w-0 flex-1">
              <view class="mb-3 flex flex-wrap items-center gap-2">
                <view class="border border-gray-100 rounded-lg bg-white px-2.5 py-1 text-xs text-gray-600 shadow-sm">
                  类型：{{ typeLabel }}
                </view>
                <view class="border border-gray-100 rounded-lg bg-white px-2.5 py-1 text-xs text-gray-600 shadow-sm">
                  性别：{{ genderLabel }}
                </view>
              </view>
              <view class="flex gap-2">
                <WdButton size="small" type="primary" plain custom-class="!h-7 !rounded-full !text-xs !px-3 !border-orange-200 !text-orange-600 !bg-white" @click="chooseAvatar">
                  更换头像
                </WdButton>
                <WdButton size="small" type="info" plain custom-class="!h-7 !rounded-full !text-xs !px-3 !border-gray-200 !text-gray-500 !bg-white" @click="applyDefaultAvatar">
                  恢复默认
                </WdButton>
              </view>
            </view>
          </view>
        </view>

        <!-- Form Section -->
        <view class="mt-4">
          <WdForm ref="form" :model="formData" :rules="rules" error-type="toast">
            <WdCellGroup border>
              <WdInput v-model="formData.name" label="昵称" placeholder="例如：可乐" prop="name" clearable />

              <WdPicker
                v-model="formData.type"
                label="类型"
                :columns="typeOptions"
                prop="type"
                @confirm="applyDefaultAvatar"
              />

              <WdPicker
                v-model="formData.gender"
                label="性别"
                :columns="genderOptions"
              />

              <WdPicker
                v-model="formData.breed"
                label="品种"
                :columns="breedColumns"
              />

              <WdInput v-model="formData.age" label="年龄" placeholder="例如：2岁" clearable />

              <WdInput
                v-model.number="formData.weight"
                label="体重(kg)"
                placeholder="选填"
                type="number"
                clearable
              />

              <WdCell title="绝育" title-width="33%">
                <view class="flex justify-end">
                  <switch
                    :checked="formData.sterilized"
                    color="var(--wot-color-theme)"
                    style="transform: scale(0.8)"
                    @change="(e: any) => formData.sterilized = e.detail.value"
                  />
                </view>
              </WdCell>
            </WdCellGroup>
          </WdForm>
        </view>
      </view>
    </view>

    <view class="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white/90 p-4 backdrop-blur-md pb-safe">
      <WdButton
        block
        type="primary"
        custom-class="shadow-orange-500/20 shadow-lg"
        size="large"
        @click="handleSave"
      >
        保存
      </WdButton>
    </view>
  </view>
</template>

<style scoped>
:deep(.wd-cell-group__title) {
  display: none;
}
</style>
