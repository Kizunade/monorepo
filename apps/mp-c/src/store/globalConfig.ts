import type { MpModel } from '@mock/mp/model'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getGlobalConfig } from '@/api/login'

export const useGlobalConfigStore = defineStore('globalConfig', () => {
  const config = ref<MpModel.GlobalConfigResponse['data'] | null>(null)

  const fetchConfig = async () => {
    try {
      const res = await getGlobalConfig()
      if (res.code === 200) {
        config.value = res.data
      }
    }
    catch (error) {
      console.error('Fetch global config failed:', error)
    }
  }

  return {
    config,
    fetchConfig,
  }
})
