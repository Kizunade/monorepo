import type { IUserInfoRes } from '@/api/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserInfo,
} from '@/api/login'
import { pick } from '@/utils/pick'

const storedKeys = ['userId', 'username', 'nickname', 'avatar', 'phone', 'gender', 'birthday', 'intro'] as const
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
  intro: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<TUserInfoWithoutPets>({ ...userInfoState })
    // 设置用户信息
    const setUserInfo = (val: TUserInfoWithoutPets) => {
      console.log('设置用户信息', val)
      const next = { ...val }
      if (!next.avatar) {
        next.avatar = userInfoState.avatar
      }
      userInfo.value = pick(next, [...storedKeys])
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    const setUserIntro = (intro: string) => {
      userInfo.value.intro = intro
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
      setUserIntro,
      ensureUserInfo,
    }
  },
  {
    persist: true,
  },
)
