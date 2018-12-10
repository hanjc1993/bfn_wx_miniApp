// pages/demo/demo.js
let City = require('../../utils/allcity.js');
const app = getApp();
Page({

  data: {
    // city: City
    // 加载中
    hiddenLoading: true,
    city: []
  },

  input(e){
    this.value = e.detail.value
  },

  searchMt(){
    // 当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if(!this.value){
      this.value = '';
    }
    this.setData({
      value:this.value
    })
  },

  onLoad: function (options) {
    this.loadInfo();
    this.getStoreCity();
  },

  loadInfo: function () {
    var page = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        // success
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });
  },

  chooseCity(e) {
    var self = this;
    self.queryStoreByAll(e.detail.code, e.detail.name);
  },

  clickme: function (e) {
    var self = this;
    var name = e.currentTarget.dataset.name
    wx.request({
      url: app.globalData.path + 'rest/transmission/getCity',
      data: {},
      success: function (res) {
        for (var index in res.data) {
          if (res.data[index].name.indexOf(name) == 0) {
            app.globalData.cityCode = res.data[index].code;
          }
        }
        self.queryStoreByAll(app.globalData.cityCode, name);
      },
      fail: function () {
        // fail
      }
    });

    if(name=='定位失败'){
      this.loadInfo();
    }
  },

  loadCity: function (longitude, latitude) {
    var page = this
    var key = 'OXFBZ-AGJC2-UECUS-C6M5G-UVVMK-ZXBLD'
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=' + key,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        var city = res.data.result.address_component.city;
        page.setData({ positionCity: city });
        // wx.showModal({
        //   title: '提示',
        //   content: '检测到您当前位置：' + city,
        //   cancelText:'手动选择',
        //   confirmText:'立即前往',
        //   success: function (res) {
        //     if (res.confirm) {
        //       wx.navigateTo({
        //         url: '../../pages/selectStores/selectStores?cityName=' + city,
        //       })
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })
      },
      fail: function () {
        // fail
        page.setData({ positionCity: "定位失败" });
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * 获取可选择城市列表
   */
  getStoreCity: function () {
    var self = this;
    self.data.technicianList = [];
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreCity',
      method: 'GET',
      data: {},
      success: function (res) {
        self.setData({ city: res.data });
        // self.hideLoading();
      },
      fail: function (err) {
        self.hideLoading();
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
    })
  },

  /**
   * 选择门店-多个
   */
  queryStoreByAll: function (cityCode, name) {
    var self = this;
    self.showLoading();
    // 发起网络请求 获取套餐信息
    console.log(self.data.cityCode)
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: '',
        cityCode: cityCode,
        name: '',
      },
      success: function (res) {
        console.log(res);
        if (res.data.length > 0) {
          app.globalData.chooseCityName = name;
          app.globalData.chooseCityCode = cityCode;
          app.globalData.v = 5
          wx.switchTab({
            url: '../../pages/selectStores/selectStores',//?cityName=' + name + '&cityCode=' + cityCode + '&v=5',
          });
        } else {
          wx.showModal({
            title: "提示",
            content: "您所在的城市没有门店",
            showCancel: true,
            cancelText: "取消",
            // cancelColor: "#000",
            confirmText: "确定",
            confirmColor: '#fbb059',
            // confirmColor: "#0f0",
            success: function (res) {
              console.log(res)
              if (res.confirm) {
                app.globalData.cityName = '珠海市';
                app.globalData.cityCode = '440400000000';
                app.globalData.v = 5
                wx.switchTab({
                  url: '../../pages/selectStores/selectStores',//?cityName=珠海市' + '&cityCode=440400000000' + '&v=5',
                });
              }
            }
          });
        }
        self.hideLoading();
      },
      fail: function (err) {
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
          confirmColor: '#fbb059',
        });
      }
    });
  },

  // 显示加载图层
  showLoading: function () {
    this.setData({
      hiddenLoading: false,
    });
  },

  // 隐藏加载图层
  hideLoading: function () {
    this.setData({
      hiddenLoading: true,
    });
  },
})