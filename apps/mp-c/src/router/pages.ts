export const PAGES = {
  INDEX: '/pages/index/index',
  ME: '/pages/me/me',

  LOGIN_PAGE: '/subpackage/pages-fg/login/login',
  REGISTER_PAGE: '/subpackage/pages-fg/login/register',
  NOT_FOUND_PAGE: '/subpackage/pages-fg/404/index',

  ADDRESS_LIST: '/subpackage/pages-me/address/list',
  ADDRESS_EDIT: '/subpackage/pages-me/address/edit',
  PET_LIST: '/subpackage/pages-me/pet/list',
  PET_EDIT: '/subpackage/pages-me/pet/edit',
  PET_DETAIL: '/subpackage/pages-me/pet/detail',
  SETTINGS_INDEX: '/subpackage/pages-me/settings/index',
  SETTINGS_PROFILE: '/subpackage/pages-me/settings/profile',
} as const

export const PAGE_NAMES: Record<keyof typeof PAGES, string> = {
  INDEX: '首页',
  ME: '我的',

  LOGIN_PAGE: '登录',
  REGISTER_PAGE: '注册',
  NOT_FOUND_PAGE: '404',

  ADDRESS_LIST: '地址列表',
  ADDRESS_EDIT: '编辑地址',
  PET_LIST: '宠物档案',
  PET_EDIT: '编辑宠物',
  PET_DETAIL: '宠物详情',
  SETTINGS_INDEX: '设置',
  SETTINGS_PROFILE: '个人信息',
}

export const PAGE_QUERIES: {
  [key in keyof typeof PAGES]?: Record<string, string>
} = {
  PET_DETAIL: {
    id: '1',
  },
}

export function getCurrentPageIndex(page: keyof typeof PAGES) {
  return Object.keys(PAGES).indexOf(page)
}
