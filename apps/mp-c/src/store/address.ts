import type { AddressModel } from '@mock/address/model'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAddressList } from '@/api/address'

export const useAddressStore = defineStore('address', () => {
  const addressList = ref<AddressModel.Address[]>([])
  const loading = ref(false)
  const finished = ref(false)
  const page = ref(1)
  const pageSize = ref(10)
  const error = ref<any>(null)

  // 获取地址列表
  const fetchAddressList = async (isLoadMore = false) => {
    if (loading.value || (finished.value && isLoadMore))
      return

    loading.value = true
    error.value = null

    try {
      const currentPage = isLoadMore ? page.value + 1 : 1
      const res = await getAddressList({
        pageNum: currentPage,
        pageSize: pageSize.value,
      })

      const list = res.data || []

      if (isLoadMore) {
        addressList.value.push(...list)
        page.value = currentPage
      }
      else {
        addressList.value = list
        page.value = 1
      }

      // 判断是否已加载完所有数据
      if (list.length < pageSize.value) {
        finished.value = true
      }
      else {
        finished.value = false
      }
    }
    catch (err) {
      console.error('获取地址列表失败', err)
      error.value = err
      throw err
    }
    finally {
      loading.value = false
    }
  }

  // 刷新地址列表
  const refreshAddressList = async () => {
    finished.value = false
    page.value = 1
    await fetchAddressList(false)
  }

  // 加载更多
  const loadMore = async () => {
    await fetchAddressList(true)
  }

  // 清空地址列表
  const clearAddressList = () => {
    addressList.value = []
    page.value = 1
    finished.value = false
    loading.value = false
    error.value = null
  }

  return {
    addressList,
    loading,
    finished,
    error,
    page,
    fetchAddressList,
    refreshAddressList,
    loadMore,
    clearAddressList,
  }
})
