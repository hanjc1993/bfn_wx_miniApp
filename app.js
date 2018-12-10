//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  globalData: {
    AppID: 'wxcffcbb402b02c858',
    AppSecret: 'd43b046c29cba3f59aaf34e8ee653110',
    session_key: '',
    openid: '',
    vipNo: '',
    path: 'https://admin.bufannao.cn/',
    storeCode: '',
    storeName: '',
    cityCode: '',
    cityName: '',
    firstCityCode: '',
    firstCityName: '',
    chooseCityCode: '',
    chooseCityName: '',
    v: '',
    reservationTime: '',
    prjUuid: '',
    lon: '',
    lat: '',
    jumpPage: '',
    firstLoad: false,//已经登录后 改为true 
    selectStoreTohomePage: '',
    onajiStoreCode:false,//选择门店后  门店是否和之前的一样
    projectList:[],//存备用
    projectName:'',//
    mark_v:0,
    currentPositionLon: '',
    currentPositionLat: '',
  },

  /**
   * 前台校验提示
   */
  ohShitfadeOut(_page) {
    var fadeOutTimeout = setTimeout(() => {
      _page.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 2500);
  }
})