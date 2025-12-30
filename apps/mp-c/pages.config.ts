import type { UserPagesConfig } from '@uni-helper/vite-plugin-uni-pages'
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { getCurrentPageIndex, PAGE_NAMES, PAGE_QUERIES, PAGES } from './src/router/pages'
import { tabBar } from './src/tabbar/config'

function getPageQueries(page: string) {
  const queryObject = PAGE_QUERIES[page] || {}
  return Object.entries(queryObject).map(item => `${item[0]}=${item[1]}`).join('&')
}

const pageList: UserPagesConfig['condition']['list'] = Object.entries(PAGES).map(item => ({
  name: PAGE_NAMES[item[0]],
  path: item[1],
  query: getPageQueries(item[0]),
}))

export default defineUniPages({
  condition: {
    current: getCurrentPageIndex('ME'),
    list: pageList,
  },
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'unibest',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  preloadRule: {
    'pages/me/me': {
      packages: ['subpackage/pages-me'],
    },
    // 'pages/index/index': {
    //   network: 'all',
    //   packages: ['subpackage/pages-main'],
    // },
  },
  // 开启自动引入功能后，导致所有自动引入的组件无法在 github actions 的产物中使用
  // easycom: {
  //   autoscan: true,
  //   custom: {
  //     '^fg-(.*)': '@/components/fg-$1/fg-$1.vue',
  //     '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
  //       'z-paging/components/z-paging$1/z-paging$1.vue',
  //     '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
  //   },
  // },
  // tabbar 的配置统一在 “./src/tabbar/config.ts” 文件中
  tabBar: tabBar as any,
})
