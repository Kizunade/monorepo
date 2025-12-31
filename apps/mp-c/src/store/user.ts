import type { IUserInfoRes } from '@/api/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserInfo,
} from '@/api/login'
import { pick } from '@/utils/pick'
import { usePetStore } from './pet'

const storedKeys = ['userId', 'username', 'nickname', 'avatar', 'phone', 'gender', 'birthday'] as const
type TStoredKeys = typeof storedKeys[number]
type TUserInfoWithoutPets = Pick<IUserInfoRes, TStoredKeys>

// 初始化状态
const userInfoState: TUserInfoWithoutPets = {
  userId: -1,
  username: '',
  nickname: '',
  avatar: '/static/images/default-avatar.png',
  phone: '',
  gender: '保密',
  birthday: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<TUserInfoWithoutPets>({ ...userInfoState })
    // 设置用户信息
    const setUserInfo = (val: TUserInfoWithoutPets) => {
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatar) {
        val.avatar = userInfoState.avatar
      }
      userInfo.value = pick(val, [...storedKeys])
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    // 删除用户信息
    const clearUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('user')
    }

    /**
     * 获取用户信息
     */
    const fetchUserInfo = async () => {
      const res = await getUserInfo()
      if (res.code === 200 && res.data) {
        setUserInfo(res.data)
        // Sync pets to petStore
        if (res.data.pets) {
          const petStore = usePetStore()
          petStore.setPets(res.data.pets)
        }
        return res.data
      }
      return null
    }

    const ensureUserInfo = async () => {
      const info = userInfo.value
      if (info.userId <= 0) {
        await fetchUserInfo()
      }
      return userInfo.value
    }

    return {
      userInfo,
      clearUserInfo,
      fetchUserInfo,
      setUserInfo,
      setUserAvatar,
      ensureUserInfo,
    }
  },
  {
    persist: true,
  },
)
