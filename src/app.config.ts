export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/stardust/index',
    'pages/mine/index',
    'pages/submit/index',
    'pages/redeem/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F5F3FF',
    navigationBarTitleText: '互帮互助',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#5B5FEF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'imgs/home.png',
        selectedIconPath: 'imgs/home_active.png'
      },
      {
        pagePath: 'pages/stardust/index',
        text: '星尘',
        iconPath: 'imgs/stardust.png',
        selectedIconPath: 'imgs/stardust_active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'imgs/mine.png',
        selectedIconPath: 'imgs/mine_active.png'
      }
    ]
  }
})
