import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { tabBar } from './src/tabbar/config'

export default defineUniPages({
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
