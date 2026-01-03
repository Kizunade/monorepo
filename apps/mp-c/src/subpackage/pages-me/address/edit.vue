<script lang="ts" setup>
import type { AddressModel } from '@mock/address/model'
import type { FormProps } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import WdButton from 'wot-design-uni/components/wd-button/wd-button.vue'
import WdCellGroup from 'wot-design-uni/components/wd-cell-group/wd-cell-group.vue'
import WdCell from 'wot-design-uni/components/wd-cell/wd-cell.vue'
import WdForm from 'wot-design-uni/components/wd-form/wd-form.vue'
import WdInput from 'wot-design-uni/components/wd-input/wd-input.vue'
import WdSwitch from 'wot-design-uni/components/wd-switch/wd-switch.vue'

import { addAddress, deleteAddress, updateAddress } from '@/api/address'
import { useAddressStore } from '@/store'

definePage({
  style: {
    navigationBarTitleText: '编辑地址',
  },
})

const addressStore = useAddressStore()
const formData = ref<AddressModel.Address>({
  name: '',
  phone: '',
  city: '',
  addrName: '', // Default to empty or same as address
  address: '',
  houseNo: '',
  longitude: 0,
  latitude: 0,
  isDefaultAddr: false,
})

const isEdit = ref(false)
const form = ref()

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请输入联系人' }],
  phone: [
    { required: true, message: '请输入手机号' },
    { required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
  ],
  city: [{ required: true, message: '请输入城市' }],
  address: [{ required: true, message: '请输入详细地址' }],
  houseNo: [{ required: true, message: '请输入门牌号' }],
}

function handleChooseLocation() {
  uni.choosePoi({
    success: (res) => {
      // 提取城市信息 (简单处理，实际可能需要更复杂的解析或逆地理编码)
      // res.address 通常格式为 "XX省XX市XX区XX街道..."

      formData.value.addrName = res.name
      formData.value.address = res.address
      formData.value.latitude = res.latitude
      formData.value.longitude = res.longitude
      formData.value.city = String(res.city)
    },
    fail: (err) => {
      console.error('选择位置失败', err)
    },
  })
}

onLoad((options) => {
  if (options?.data) {
    try {
      const data = JSON.parse(decodeURIComponent(options.data))
      formData.value = { ...data }
      isEdit.value = true
      uni.setNavigationBarTitle({ title: '修改地址' })
    }
    catch (e) {
      console.error('解析地址数据失败', e)
    }
  }
})

async function handleSave() {
  try {
    const { valid } = await form.value.validate()
    if (!valid)
      return

    // 补充 addrName，如果没有填写，默认使用 address
    if (!formData.value.addrName) {
      formData.value.addrName = formData.value.address
    }

    if (isEdit.value) {
      await updateAddress(formData.value)
      uni.showToast({ title: '修改成功', icon: 'success' })
    }
    else {
      await addAddress(formData.value)
      uni.showToast({ title: '添加成功', icon: 'success' })
    }

    await addressStore.refreshAddressList()

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
  catch (error) {
    console.error(error)
  }
}

function handleDelete() {
  if (!formData.value.addrId)
    return

  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteAddress({
            addrId: formData.value.addrId,
          })
          uni.showToast({ title: '删除成功', icon: 'success' })

          await addressStore.refreshAddressList()
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
        catch (error) {
          console.error(error)
          // uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    },
  })
}
</script>

<template>
  <view class="min-h-screen bg-gray-100 p-3">
    <view class="overflow-hidden rounded-lg bg-white">
      <WdForm ref="form" :model="formData" :rules="rules">
        <WdCellGroup border>
          <WdInput
            v-model="formData.name"
            label="联系人"
            placeholder="请输入联系人姓名"
            prop="name"
            clearable
          />
          <WdInput
            v-model="formData.phone"
            label="手机号"
            placeholder="请输入手机号"
            type="number"
            :maxlength="11"
            prop="phone"
            clearable
          />
          <WdCell title="地址" is-link title-width="33%" required prop="address" @click="handleChooseLocation">
            <view v-if="formData.address" class="text-left">
              <view class="text-gray-900">
                {{ formData.addrName }}
              </view>
            </view>
            <view v-else class="text-gray-400">
              点击选择
            </view>
          </WdCell>
          <WdInput
            v-model="formData.houseNo"
            label="门牌号"
            placeholder="楼号、单元、门牌号"
            prop="houseNo"
            clearable
          />
          <WdCell title="设为默认地址" center>
            <WdSwitch v-model="formData.isDefaultAddr" />
          </WdCell>
        </WdCellGroup>
      </WdForm>
    </view>

    <view class="mt-8 px-2 space-y-3">
      <WdButton block type="primary" @click="handleSave">
        保存
      </WdButton>
      <WdButton
        v-if="isEdit"
        type="error"
        plain
        block
        @click="handleDelete"
      >
        删除
      </WdButton>
    </view>
  </view>
</template>

<style scoped>
:deep(.wd-cell-group__title) {
  display: none;
}
</style>
