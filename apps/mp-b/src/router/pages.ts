export const PAGES = {
  INDEX: '/pages/index/index',
  SERVICE: '/pages/service/index',
  MESSAGE: '/pages/message/index',
  ME: '/pages/me/me',

  LOGIN_PAGE: '/subpackage/pages-fg/login/login',
  REGISTER_PAGE: '/subpackage/pages-fg/login/register',
  NOT_FOUND_PAGE: '/subpackage/pages-fg/404/index',

  ADDRESS_LIST: '/subpackage/pages-me/address/list',
  ADDRESS_EDIT: '/subpackage/pages-me/address/edit',
  SITTER_PROFILE: '/subpackage/pages-me/sitter/index',
  ME_RATING: '/subpackage/pages-me/rating/index',
  ME_ORDERS: '/subpackage/pages-me/orders/index',
  ME_WALLET: '/subpackage/pages-me/wallet/index',
  SETTINGS_INDEX: '/subpackage/pages-me/settings/index',
  SETTINGS_PROFILE: '/subpackage/pages-me/settings/profile',
} as const

export const PAGE_NAMES: Record<keyof typeof PAGES, string> = {
  INDEX: '首页',
  SERVICE: '服务',
  MESSAGE: '消息',
  ME: '我的',

  LOGIN_PAGE: '登录',
  REGISTER_PAGE: '注册',
  NOT_FOUND_PAGE: '404',

  ADDRESS_LIST: '地址列表',
  ADDRESS_EDIT: '编辑地址',
  SITTER_PROFILE: '宠托师信息',
  ME_RATING: '评分与口碑',
  ME_ORDERS: '订单',
  ME_WALLET: '钱包',
  SETTINGS_INDEX: '设置',
  SETTINGS_PROFILE: '个人信息',
}

export const PAGE_QUERIES: {
  [key in keyof typeof PAGES]?: Record<string, string>
} = {
}

export function getCurrentPageIndex(page: keyof typeof PAGES) {
  return Object.keys(PAGES).indexOf(page)
}
