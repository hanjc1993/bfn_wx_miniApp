// pages/selectStores/selectStores.js
//获取应用实例
const app = getApp();
var login = require("../../utils/login.js");
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面跳转（1:首页 2:在线预约页面）
    jumpPage: 1,
    // 地图的宽度
    map_width: 100,
    // 地图的高度
    map_height: 100,
    // 所有门店显示高度
    scrollHeight: 0,
    // 所有门店显示高度滚动条
    scrolly: true,
    // // 是否显示一个门店信息
    // showOneStoresInfo: true,
    // // 是否显示所有门店信息
    // showAllStoresInfo: false,
    // 所有门店信息
    allStoresInfo: [],
    // 一个门店信息的信息
    storesInfo: {},
    // 城市名称
    cityName: '',
    // 城市code
    cityCode: '',
    // 门店名称
    storeName: '',
    // 门店code
    storeCode: '',

    inputShowed: true,
    inputVal: "",

    // 纬度
    latitude: app.globalData.currentPositionLat,
    // 经度
    longitude: app.globalData.currentPositionLon,
    // 详细地址
    detailAddr: "",
    // 距离
    distance: "",
    // 地图标记点信息 
    markers: [],

    scrollTop: 0,

    lastX: 0,     //滑动开始x轴位置
    lastY: 0,     //滑动开始y轴位置
    text: "没有滑动",
    currentGesture: 0, //标识手势
    baiduToQQ: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var self = this;
    // 获取地图高度
    self.getMapHeight(454);
  },

  doInit: function () {
    var self = this;

    console.log("app.globalData.storeName=" + app.globalData.storeName);
    console.log("app.globalData.storeCode=" + app.globalData.storeCode);
    console.log("app.globalData.cityName=" + app.globalData.cityName);
    console.log("app.globalData.cityCode=" + app.globalData.cityCode);
    console.log("app.globalData.v=" + app.globalData.v);

    if (app.globalData.v == 1) {
      console.log("v=1");
      self.setData({
        // 城市名称
        cityName: app.globalData.cityName,
        // 城市code
        cityCode: app.globalData.cityCode,
        // 门店名称
        storeName: app.globalData.storeName,
        // 门店code
        storeCode: app.globalData.storeCode,
      });
    } else if (app.globalData.v == 2) {
      self.setData({
        // 城市名称
        cityName: app.globalData.cityName,
      });

      // 城市名称
      app.globalData.cityName = app.globalData.cityName;
    } else if (app.globalData.v == 3) {
      console.log("v=3");
      self.setData({
        // 城市名称
        cityName: app.globalData.cityName,
        // 城市code
        cityCode: app.globalData.cityCode,
      });
    } else if (app.globalData.v == 4) {
      console.log("v=4");
      self.setData({
        // 城市名称
        cityName: app.globalData.cityName,
        // 城市code
        cityCode: app.globalData.cityCode,
        // 门店名称
        storeName: app.globalData.storeName,
        // 门店code
        storeCode: app.globalData.storeCode,
      });
    } else if (app.globalData.v == 5) {
      console.log("v=5");
      self.setData({
        // 城市名称
        cityName: app.globalData.chooseCityName,
        // 城市code
        cityCode: app.globalData.chooseCityCode,
      });
    } else {
      self.setData({
        // 城市名称
        cityName: app.globalData.cityName,
        // 城市code
        cityCode: app.globalData.cityCode,
        // 门店名称
        storeName: app.globalData.storeName,
        // 门店code
        storeCode: app.globalData.storeCode,
      });
    }

    if (app.globalData.v == 5) {
      self.queryStoreByAllV5();
    } else if (app.globalData.v == 3) {
      // 获取门店-指定距离
      self.queryStoreByDistance();
    } else {
      //  if (app.globalData.v == 1 || app.globalData.v == 2 || app.globalData.v == 4 || app.globalData.firstLoad == false)
      // // 获取门店-一个
      // self.queryStoreByOne();

      // 获取门店-多个
      self.queryStoreByAll();
    } 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    wx.getSetting({
      success: (res) => {
        // 非初始化进入该页面,且未授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '不凡脑小程序',
            content: '需要获取您的地理位置，请确认\r\n授权，否则地图功能将无法使用',
            confirmColor: '#fbb059',
            success: function (res) {
              if (res.cancel) {

              } else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 3000
                      });
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 3000
                      });
                    }
                  }
                });
              }
            }
          });
        } else {
          // 初始化进入
          self.getLocationLBS();
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取地图高度
   */
  getMapHeight: function (height) {
    var self = this;
    //获得高度
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        self.setData({
          // map部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          //		//选择id
          map_height: res.windowHeight - res.windowWidth / 750 * height,
        })
        console.log('map_height=' + self.data.map_height);
      }
    })
  },

  /**
   * 获取当前位置
   */
  loadInfo: function () {
    var self = this;
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: '',
        cityCode: app.globalData.firstCityCode,
        name: '',
      },
      success: function (res) {
        if (res.data.length != 0) {
          self.data.markers = [];
          for (var index in res.data) {
            self.loadInfoFunction(res.data, index)
          }
        } else {
          console.log('获取指定门店信息2');
          // 获取指定门店信息
          self.queryStoreByAllV5();
        }
      },
      fail: function (err) {
        console.log(err)
      },//请求失败
      complete: function () {
      }//请求完成后执行的函数
    });
  },

  loadInfoFunction: function (res, index) {
    var self = this;
    // self.reverseLocation(res[index], function (cRes) {
    var marker = {};
    var callout = {};
    marker.iconPath = "/images/map_icon.png",
      marker.id = res[index].storeCode,
      marker.latitude = res[index].lat,
      marker.longitude = res[index].lon,
      marker.width = 30,
      marker.height = 30,

      callout.content = res.name, // + '\n' + res.data[index].parkinglotAddress
      callout.color = "#000000",
      callout.fontSize = "16",
      callout.borderRadius = "10",
      callout.bgColor = "#f3f3f3",
      callout.padding = "10",
      callout.display = "ALWAYS",

      marker.callout = callout,
      self.data.markers.push(marker);
    if (res[index].evaluateGood == null) {
      res[index].evaluateGood = '100';
    }
    if (res[index].pageViewCnt == null) {
      res[index].pageViewCnt = 0;
    }

    if (res.length - 1 == index) {
      self.setData({
        // 一个门店code
        storeCode: res[0].storeCode,
        // 一个门店名称
        storeName: res[0].name,
        // 一个门店信息的信息
        storesInfo: res[0],
        // 所有门店信息
        allStoresInfo: res,
        // 纬度
        latitude: res[0].lat,
        // 经度
        longitude: res[0].lon,
        cityName: app.globalData.firstCityName,
        // 是否显示一个门店信息
        showOneStoresInfo: true,
        // 是否显示所有门店信息
        showAllStoresInfo: false,
      });
      app.globalData.storeName = self.data.storeName;
      app.globalData.storeCode = self.data.storeCode;
      self.getCalculateDistanceOne(res[0]);
      self.getCalculateDistanceArr(res);
      // self.setData({
      //   // // 是否显示一个门店信息
      //   showOneStoresInfo: true,
      //   // // 是否显示所有门店信息
      //   showAllStoresInfo: false,
      // });
    }
    // });
  },

  /**
   * 获取门店信息
   */
  getStoreInfo: function () {
    var self = this;
    self.data.storesInfo = {};
    console.log(self.data.storeCode);
    console.log(self.data.cityCode);
    console.log(self.data.storeName);
    if (self.data.storeCode == "" && self.data.cityCode == "" && self.data.storeName == "") {
      console.log('获取指定门店信息1');
      // 获取指定门店信息
      self.queryStoreByAllV5();
    } else {
      wx.request({
        url: app.globalData.path + 'rest/transmission/getStoreInfo',
        method: 'GET',
        data: {
          storeCode: self.data.storeCode,
          cityCode: self.data.cityCode,
          name: self.data.storeName,
        },
        success: function (res) {
          if (res.data.length != 0) {
            self.data.markers = [];
            for (var index in res.data) {
              self.getStoreInfoFunction(res.data, index)
            }
          } else {
            console.log('获取指定门店信息2');
            // 获取指定门店信息
            self.queryStoreByAllV5();
          }
        },
        fail: function (err) {
          console.log(err)
        },//请求失败
        complete: function () {
        }//请求完成后执行的函数
      });
    }
  },

  getStoreInfoFunction: function (res, index) {
    var self = this;
    // self.reverseLocation(res[index], function (cRes) {
    var marker = {};
    var callout = {};
    marker.iconPath = "/images/map_icon.png",
    marker.id = res[index].storeCode,
    marker.latitude = res[index].lat,
    marker.longitude = res[index].lon,
    marker.width = 30,
    marker.height = 30,

    callout.content = res[index].name, // + '\n' + res.data[index].parkinglotAddress
    callout.color = "#000000",
    callout.fontSize = "16",
    callout.borderRadius = "10",
    callout.bgColor = "#f3f3f3",
    callout.padding = "10",
    callout.display = "ALWAYS",

    marker.callout = callout,
    self.data.markers.push(marker);
    if (res[index].evaluateGood == null) {
      res[index].evaluateGood = '100';
    }
    if (res[index].pageViewCnt == null) {
      res[index].pageViewCnt = 0;
    }

    if (res.length - 1 == index) {
      self.setData({
        // 一个门店code
        storeCode: res[0].storeCode,
        // 一个门店名称
        storeName: res[0].name,
        // 是否显示一个门店信息
        showOneStoresInfo: true,
        // 是否显示所有门店信息
        showAllStoresInfo: false,
        // 纬度
        latitude: res[0].lat,
        // 经度
        longitude: res[0].lon,
        markers: self.data.markers,
      });
      app.globalData.storeName = self.data.storeName;
      app.globalData.storeCode = self.data.storeCode;
      self.getCalculateDistanceOne(res[0]);
      self.getCalculateDistanceArr(res);
    }
    // });
  },

  /**
   * 获取指定门店信息
   */
  getSpecifiedStoreInfo: function () {
    var self = this;
    self.data.storesInfo = {};
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: 'UM0008',
        cityCode: '',
        name: '',
      },
      success: function (res) {
        if (res.data.length != 0) {
          self.setData({
            // 一个门店信息的信息
            storesInfo: res.data[0],
            // 一个门店code
            storeCode: res.data[0].storeCode,
            // 一个门店名称
            storeName: res.data[0].name,
            // 城市名称
            cityName: '珠海市',
            // 城市code
            cityCode: '440400000000',
          });
          app.globalData.storeName = self.data.storeName;
          app.globalData.storeCode = self.data.storeCode;
          app.globalData.cityName = self.data.cityName;
          app.globalData.cityCode = self.data.cityCode;
        }
      },
      fail: function (err) {
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
    })
  },

  /**
   * 获取当前位置
   */
  getLocationLBS: function () {
    var self = this;
    self.setData({
      inputVal: '',
    });

    // login.checkInitAgree(self, function () {
      self.doInit();
    // });
  },

  /**
   * 获取所有门店信息
   */
  getAllStoresInfoList: function (e) {
    var self = this;
    if (self.data.allStoresInfo.length > 3) {
      wx.getSystemInfo({
        success: function (res) {
          self.setData({
            // 所有门店信息的高度
            scrollHeight: 750 * res.windowHeight / res.windowWidth - 80,
            // 是否显示一个门店信息
            showOneStoresInfo: false,
            // 是否显示所有门店信息
            showAllStoresInfo: true,
          });
        },
      });
    } else {
      wx.getSystemInfo({
        success: function (res) {
          console.log(res.windowHeight / res.windowWidth / 750 + '高度')
          self.setData({
            // 所有门店信息的高度
            scrollHeight: 750 * res.windowHeight / res.windowWidth - 80,
            // 是否显示一个门店信息
            showOneStoresInfo: false,
            // 是否显示所有门店信息
            showAllStoresInfo: true,
          });
        },
      });
    }
    // self.setData({
    //   // 是否显示一个门店信息
    //   showOneStoresInfo: false,
    //   // 是否显示所有门店信息
    //   showAllStoresInfo: true,
    // });
  },

  /**
   * 收起所有门店信息
   */
  packUpAllStoresInfoList: function (e) {
    var self = this;
    self.getMapHeight(454);
    self.setData({
      // 是否显示一个门店信息
      showOneStoresInfo: true,
      // 是否显示所有门店信息
      showAllStoresInfo: false,
      // 所有门店信息的高度
      scrollHeight: 0,
    });
  },

  /**
   * 打开手机应用导航
   */
  getNavigation: function (e) {
    var self = this;
    var uuid = e.currentTarget.dataset.item;
    for (var index in self.data.allStoresInfo) {
      if (uuid == self.data.allStoresInfo[index].storeCode) {
        self.setData({
          latitude: self.data.allStoresInfo[index].lat,
          longitude: self.data.allStoresInfo[index].lon,
          detailAddr: self.data.allStoresInfo[index].detailAddr,
        })
      }
    }

    wx.openLocation({
      // 目的地经纬度
      latitude: Number(self.data.latitude),
      longitude: Number(self.data.longitude),
      // 缩放级别默认18
      scale: 14,
      // 位置名
      name: '',
      // 详细地址
      address: self.data.detailAddr,
      // 成功打印信息
      success: function (res) {
        console.log(res)
      },
      // 失败打印信息
      fail: function (err) {
        console.log(err)
      },
      // 完成打印信息
      complete: function (info) {
        console.log(info)
      },
    });
  },

  /**
   * 返回首页或者在线预约页面
   */
  gotoPage: function (e) {
    var self = this;
    self.setData({
      // 是否显示一个门店信息
      showOneStoresInfo: true,
      // 是否显示所有门店信息
      showAllStoresInfo: false,
    });
    if (app.globalData.v == 3 || app.globalData.v == 4) {
      // var pages = getCurrentPages();
      // var prevPage = pages[pages.length - 2];
      // var temp = "listForYoyaku[" + 0 + "].yoyakuStroe";
      // prevPage.setData({
      //   [temp]: "111111111111111111111111",
      // });
      // wx.navigateBack({
      //   delta: 1,
      // });
      if (app.globalData.storeCode == e.currentTarget.dataset.item.storeCode) {
        app.globalData.onajiStoreCode = true
      }
      app.globalData.storeCode = e.currentTarget.dataset.item.storeCode;
      app.globalData.storeName = e.currentTarget.dataset.item.name;
      app.globalData.cityCode = self.data.cityCode;
      app.globalData.cityName = self.data.cityName;
      wx.navigateTo({
        url: '../../pages/order/order?storeCode=' + e.currentTarget.dataset.item.storeCode + '&storeName=' + e.currentTarget.dataset.item.name + '&v=2',
      });
    } else {
      app.globalData.storeCode = e.currentTarget.dataset.item.storeCode;
      app.globalData.storeName = e.currentTarget.dataset.item.name;
      app.globalData.cityCode = self.data.cityCode;
      app.globalData.cityName = self.data.cityName;
      app.globalData.mark_v = 1;
      app.globalData.selectStoreTohomePage = 1;
      var switchTabUrl = '/pages/homePage/homePage';
      wx.switchTab({
        url: switchTabUrl,
        // success: function (e) {
        //   var page = getCurrentPages().pop();
        //   if (page == undefined || page == null) return;
        //   page.onShow();
        // }
      });
    }
  },

  /**
   * 选择城市
   */
  gotoselectArea: function () {
    var navigateToUrl = '/pages/chooseCity/chooseCity'
    wx.navigateTo({
      url: navigateToUrl
    });
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  clearInput: function () {
    var self = this;
    self.setData({
      inputVal: '',
      // 门店名称
      storeName: '',
      storeCode: '',
    });

    // 选择门店-一个
    self.queryStoreByOne();
  },

  inputTyping: function (e) {
    var self = this;
    self.setData({
      inputVal: e.detail.value,
      // 门店名称
      storeName: e.detail.value,
      storeCode: '',
    });

    // if (e.detail.value.length>0){
      
    // }
    // 选择门店-一个
    self.queryStoreByOne();
  },

  /**
   * 选择门店-一个
   */
  queryStoreByOne: function () {
    var self = this;

    // 发起网络请求 获取套餐信息
    console.log(self.data.storeCode);
    console.log(self.data.cityCode);
    console.log(self.data.storeName);
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: self.data.storeCode,
        cityCode: self.data.cityCode,
        name: self.data.storeName,
      },
      success: function (res) {
        console.log(res);
        console.log("选择门店-一个");
        if (res.data.length != 0) {
          var markers = [];
          for (var index in res.data) {
            var marker = {};
            var callout = {};
            marker.iconPath = "/images/map_icon.png",
            marker.id = res.data[index].storeCode,
            marker.latitude = res.data[index].lat,
            marker.longitude = res.data[index].lon,
            marker.width = 30,
            marker.height = 30,

            callout.content = res.data[index].name, // + '\n' + res.data[index].parkinglotAddress
            callout.color = "#000000",
            callout.fontSize = "16",
            callout.borderRadius = "10",
            callout.bgColor = "#f3f3f3",
            callout.padding = "10",
            callout.display = "ALWAYS",

            marker.callout = callout,

            markers.push(marker);
            if (res.data[index].evaluateGood == null) {
              res.data[index].evaluateGood = '100';
            }
            if (res.data[index].pageViewCnt == null) {
              res.data[index].pageViewCnt = 0;
            }
          }

          self.setData({
            markers: markers,
            // 一个门店信息的信息
            storesInfo: res.data[0],
            // 所有门店信息
            allStoresInfo: res.data,
            // 纬度
            latitude: res.data[0].lat,
            // 经度
            longitude: res.data[0].lon
          });
          self.getAllStoresInfoList();
          self.getCalculateDistanceArrByOne(res.data);

        } else if (self.data.inputVal != '') {
          wx.showModal({
            title: "提示",
            content: "没有查询的门店信息",
            showCancel: false,
            confirmColor: '#fbb059',
          });
          self.setData({
            inputVal: '',
          });
        }
      },
      fail: function (err) {
        wx.showModal({
          title: "提示",
          content: "系统异常，请稍后再试",
          showCancel: false,
          confirmColor: '#fbb059',
        });
        self.setData({
          inputVal: '',
        });
      }
    });
  },

  /**
   * 选择门店-多个
   */
  queryStoreByAll: function () {
    var self = this;

    // 发起网络请求 获取套餐信息
    console.log(self.data.cityCode)
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: '',
        cityCode: self.data.cityCode,
        name: '',
      },
      success: function (res) {
        console.log(res);
        console.log("选择门店-多个");

        if (res.data.length != 0) {
          var markers = [];
          var storesInfoTemp = {};
          var storeCode = self.data.storeCode;

          for (var index in res.data) {
            console.log(index + " : " + res.data[index].storeCode);
            if (storeCode == res.data[index].storeCode) {
              storesInfoTemp = res.data[index];
            }

            var marker = {};
            var callout = {};
            marker.iconPath = "/images/map_icon.png",
            marker.id = res.data[index].storeCode,
            marker.latitude = res.data[index].lat,
            marker.longitude = res.data[index].lon,
            marker.width = 30,
            marker.height = 30,

            callout.content = res.data[index].name, // + '\n' + res.data[index].parkinglotAddress
            callout.color = "#000000",
            callout.fontSize = "16",
            callout.borderRadius = "10",
            callout.bgColor = "#f3f3f3",
            callout.padding = "10",
            callout.display = "ALWAYS",

            marker.callout = callout,

            markers.push(marker);
            if (res.data[index].evaluateGood == null) {
              res.data[index].evaluateGood = '100';
            }
            if (res.data[index].pageViewCnt == null) {
              res.data[index].pageViewCnt = 0;
            }
          }

          self.setData({
            markers: markers,
            storesInfo: storesInfoTemp,
            // 纬度
            latitude: storesInfoTemp.lat,
            // 经度
            longitude: storesInfoTemp.lon,
            // 所有门店信息
            allStoresInfo: res.data,
            // // 是否显示一个门店信息
            // showOneStoresInfo: true,
            // // 是否显示所有门店信息
            // showAllStoresInfo: false,
          });
        }
        self.getCalculateDistanceArr(res.data);
        self.packUpAllStoresInfoList();
      },
      fail: function (err) {
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
        });
      }
    });
  },
  /**
   * 选择门店-多个v5
   */
  queryStoreByAllV5: function () {
    var self = this;

    if (app.globalData.v == 5) {
      self.setData({
        // 城市名称
        cityName: app.globalData.chooseCityName,
        // 城市code
        cityCode: app.globalData.chooseCityCode,
      });
    } else {
      self.setData({
        // 城市名称
        cityName: '珠海市',
        // 城市code
        cityCode: '440400000000',
      });
      app.globalData.cityName = self.data.cityName
      app.globalData.cityCode = self.data.cityCode
    }

    // 发起网络请求 获取套餐信息
    console.log(self.data.cityCode)
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: '',
        cityCode: self.data.cityCode,
        name: '',
      },
      success: function (res) {
        console.log(res);
        if (res.data.length != 0) {
          self.data.markers = [];
          for (var index in res.data) {
            self.queryStoreByAllV5Function(res.data, index)
          }
        }
      },
      fail: function (err) {
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
        });
      }
    });
  },

  queryStoreByAllV5Function: function (res, index) {
    var self = this;
    // self.reverseLocation(res[index], function (cRes) {
    var marker = {};
    var callout = {};
    marker.iconPath = "/images/map_icon.png",
    marker.id = res[index].storeCode,
    marker.latitude = res[index].lat,
    marker.longitude = res[index].lon,
    marker.width = 30,
    marker.height = 30,

    callout.content = res[index].name, // + '\n' + res.data[index].parkinglotAddress
    callout.color = "#000000",
    callout.fontSize = "16",
    callout.borderRadius = "10",
    callout.bgColor = "#f3f3f3",
    callout.padding = "10",
    callout.display = "ALWAYS",

    marker.callout = callout,
    self.data.markers.push(marker);

    if (res[index].evaluateGood == null) {
      res[index].evaluateGood = '100';
    }
    if (res[index].pageViewCnt == null) {
      res[index].pageViewCnt = 0;
    }

    if (res.length - 1 == index) {
      app.globalData.v = '';
      self.getCalculateDistanceArrV5(res);
    }
    // });
  },

  /**
   *  查询门店可预约时间段
   */
  queryAvailableTime: function () {
    var self = this;

    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: '',
        cityCode: '440400000000',
        name: '珠海市',
      },
      success: function (res) {
        if (res.data.length != 0) {
          self.setData({
            // 所有门店信息
            allStoresInfo: self.data.allStoresInfo,
            // 一个门店信息的信息
            storesInfo: res.data[0],
          });
        }

        // 后台正常返回
        // if (res.data.errcode == 0) {

        // } else {
        //   wx.showModal({
        //     title: "请求超时",
        //     content: "系统繁忙，请稍后重试！",
        //     showCancel: false,
        //   });
        // }
      },
      fail: function (err) {
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
        });
      }
    });
  },

  /**
   * 获取俩点之间的距离-单个
   */
  getCalculateDistanceOne: function (info) {
    var self = this;
    var distanceOne = {};
    console.log("1031");
    distanceOne.latitude = info.lat,
      distanceOne.longitude = info.lon

    // 实例化API核心类
    var locationDistance = new QQMapWX({
      key: 'OXFBZ-AGJC2-UECUS-C6M5G-UVVMK-ZXBLD' // 必填
    });

    // 调用接口
    locationDistance.calculateDistance({
      to: [distanceOne],
      success: function (res) {
        info.distance = Number((res.result.elements[0].distance / 1000).toFixed(0));
        self.setData({
          // markers: self.data.markers,
          storesInfo: info,
          // 是否显示一个门店信息
          showOneStoresInfo: true,
          // 是否显示所有门店信息
          showAllStoresInfo: false,
        });
      },
      fail: function (res) {
        self.setData({
          // markers: self.data.markers,
          storesInfo: info,
          // 是否显示一个门店信息
          showOneStoresInfo: true,
          // 是否显示所有门店信息
          showAllStoresInfo: false,
        });
      }
    });
  },

  /**
   * 获取俩点之间的距离-数组-byone
   */
  getCalculateDistanceArrByOne: function (info) {
    var self = this;
    var distanceArr = [];
    console.log("info")
    console.log(info)
    for (var index in info) {
      var distanceOne = {};
      distanceOne.latitude = info[index].lat + '',
      distanceOne.longitude = info[index].lon + ''
      distanceArr.push(distanceOne);
    }
    // 实例化API核心类
    var locationDistance = new QQMapWX({
      key: 'OXFBZ-AGJC2-UECUS-C6M5G-UVVMK-ZXBLD' // 必填
    });
    console.log(distanceArr)
    // 调用接口
    locationDistance.calculateDistance({
      from: {
        latitude: app.globalData.currentPositionLat,
        longitude: app.globalData.currentPositionLon
      },
      to: distanceArr,
      success: function (res) {
        for (var index in info) {
          info[index].distance = Number((res.result.elements[index].distance / 1000).toFixed(0));
        }
        info.sort(self.compare("distance"));
        self.setData({
          storesInfo: info[0],
          allStoresInfo: info
        });
      },
      fail: function (res) {
        console.log(res);
        // self.onShow();
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 获取俩点之间的距离-数组
   */
  getCalculateDistanceArr: function (info) {
    var self = this;
    var distanceArr = [];
    console.log("info")
    console.log(info)
    for (var index in info) {
      var distanceOne = {};
      distanceOne.latitude = info[index].lat + '',
      distanceOne.longitude = info[index].lon + ''
      distanceArr.push(distanceOne);
    }
    // 实例化API核心类
    var locationDistance = new QQMapWX({
      key: 'OXFBZ-AGJC2-UECUS-C6M5G-UVVMK-ZXBLD' // 必填
    });
    console.log(distanceArr)
    // 调用接口
    locationDistance.calculateDistance({
      from: {
        latitude: app.globalData.currentPositionLat,
        longitude: app.globalData.currentPositionLon
      },
      to: distanceArr,
      success: function (res) {
        console.log("app.globalData.v=" + app.globalData.v);
        if (app.globalData.v == 3){
          for (var index in info) {
            info[index].distance = Number((res.result.elements[index].distance / 1000).toFixed(0));
          }
          info.sort(self.compare("distance"));
          self.setData({
            storesInfo: info[0],
            allStoresInfo: info
          });
        } else {
          var storesInfoTemp = {};
          var storeCode = self.data.storeCode;
          for (var index in info) {
            info[index].distance = (res.result.elements[index].distance / 1000).toFixed(0);
            if (storeCode == info[index].storeCode) {
              storesInfoTemp = info[index];
            }
          }
          info.sort(self.compare("distance"));
          console.log(info);
          self.setData({
            storesInfo: storesInfoTemp,
            allStoresInfo: info
          });
        }
      },
      fail: function (res) {
        console.log(res);
        // self.onShow();
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  /**
    * 获取俩点之间的距离-数组
    */
  getCalculateDistanceArrV5: function (info) {
    var self = this;
    var distanceArr = [];
    for (var index in info) {
      var distanceOne = {};
      distanceOne.latitude = info[index].lat,
      distanceOne.longitude = info[index].lon
      distanceArr.push(distanceOne);
    }
    // 实例化API核心类
    var locationDistance = new QQMapWX({
      key: 'OXFBZ-AGJC2-UECUS-C6M5G-UVVMK-ZXBLD' // 必填
    });
    // 调用接口
    locationDistance.calculateDistance({
      from: {
        latitude: app.globalData.currentPositionLat,
        longitude: app.globalData.currentPositionLon
      },
      to: distanceArr,
      success: function (res) {
        for (var index in info) {
          info[index].distance = Number((res.result.elements[index].distance / 1000).toFixed(0));
        }
        info.sort(self.compare("distance"));
        self.setData({
          // 纬度
          latitude: info[0].lat,
          // 经度
          longitude: info[0].lon,
          // // 是否显示一个门店信息
          // showOneStoresInfo: true,
          // // 是否显示所有门店信息
          // showAllStoresInfo: false,
          allStoresInfo: info,
          // 一个门店信息的信息
          storesInfo: info[0],
          markers: self.data.markers,
        });
        app.globalData.v = '';
        self.packUpAllStoresInfoList();
      },
      fail: function (res) {
        console.log(res);
        // self.onShow();
      },
      complete: function (res) {
        console.log(res);
        app.globalData.firstLoad = true;
      }
    });
  },

  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  /**
   * 获取俩点之间的距离-自己写的
   */
  getDistance: function (lat1, lng1, lat2, lng2) {

    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;
    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)
  },

  /**
   * 获取指定门店信息
   */
  getStoreBybindmarkertap: function (e) {
    var self = this;

    for (var item in self.data.allStoresInfo) {
      if (e.markerId == self.data.allStoresInfo[item].storeCode) {
        self.data.storesInfo = self.data.allStoresInfo[item];
      }
    }
  
    self.setData({
      storesInfo: self.data.storesInfo
    });
  },

  /**
   * 选择门店-指定距离（m）
   */
  queryStoreByDistance: function () {
    var self = this;
    console.log("app.globalData.cityCode");
    console.log(app.globalData.cityCode);
    var param = {
      cityCode: app.globalData.cityCode,
      lon: app.globalData.lon,
      lat: app.globalData.lat,
      distance: '3000',
      reservationTime: app.globalData.reservationTime,
      prjUuid: app.globalData.prjUuid,
      vipNo: '',
    }

    // 发起网络请求
    wx.request({
      url: app.globalData.path + 'rest/RzMiniProgramRest/searchStoresWithinGivenDistance',
      method: 'POST',
      data: param,
      success: function (res) {
        console.log("选择门店-指定距离（m）");
        if (res.data.length != 0) {
          self.data.markers = [];
          for (var index in res.data) {
            self.queryStoreByDistanceFunction(res.data, index)
          }
        }
      },
      fail: function (err) {
      }
    });
  },

  queryStoreByDistanceFunction: function (res, index) {
    var self = this;
    // self.reverseLocation(res[index], function (cRes) {
    var marker = {};
    var callout = {};
    marker.iconPath = "/images/map_icon.png",
    marker.id = res[index].storeCode,
    marker.latitude = res[index].lat,
    marker.longitude = res[index].lon,
    marker.width = 30,
    marker.height = 30,

    callout.content = res[index].name, // + '\n' + res.data[index].parkinglotAddress
    callout.color = "#000000",
    callout.fontSize = "16",
    callout.borderRadius = "10",
    callout.bgColor = "#f3f3f3",
    callout.padding = "10",
    callout.display = "ALWAYS",

    marker.callout = callout,
    self.data.markers.push(marker);
    if (res[index].evaluateGood == null) {
      res[index].evaluateGood = '100';
    }
    if (res[index].pageViewCnt == null) {
      res[index].pageViewCnt = 0;
    }

    if (res.length - 1 == index) {
      self.setData({
        markers: self.data.markers,
        // 所有门店信息
        allStoresInfo: res,
        // 一个门店信息的信息
        storesInfo: res[0],
        // // 是否显示一个门店信息
        // showOneStoresInfo: true,
        // // 是否显示所有门店信息
        // showAllStoresInfo: false,
        latitude: res[0].lat,
        longitude: res[0].lon
      });
      // self.getCalculateDistanceOne(res[0]);
      self.getCalculateDistanceArr(res);
      self.packUpAllStoresInfoList();
    }
    // });
  },

  // 监听屏幕滚动 判断上下滚动  
  onPageScroll: function (ev) {
    console.log(ev);
    var self = this;
    //当滚动的top值最大或者最小时，为什么要做这一步是由于在手机实测小程序的时候会发生滚动条回弹，所以为了解决回弹，设置默认最大最小值 
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      ev.scrollTop = wx.getSystemInfoSync().windowHeight;
    }
    console.log(ev.scrollTop);
    //判断浏览器滚动条上下滚动  
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
      console.log('向下滚动');
      //self.packUpAllStoresInfoList();
    } else {
      console.log('向上滚动');
      self.getAllStoresInfoList();
    }
    //给scrollTop重新赋值    
    setTimeout(function () {
      self.setData({
        scrollTop: ev.scrollTop
      });
    }, 0)
  },

  handletouchmove: function (event) {
    var self = this;
    var currentX = event.touches[0].pageX
    var currentY = event.touches[0].pageY
    var tx = currentX - this.data.lastX
    var ty = currentY - this.data.lastY
    var text = ""
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0) {
        text = "向左滑动"
      } else if (tx > 0) {
        text = "向右滑动"
      }
    }
    //上下方向滑动
    else {
      if (ty < 0) {
        text = "向上滑动"
        self.getAllStoresInfoList();
      } else if (ty > 0) {
        text = "向下滑动"
        //self.packUpAllStoresInfoList();
      }
    }

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    this.setData({
      text: text,
    });
  },

  //滑动开始事件
  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  //滑动结束事件
  handletouchend: function (event) {
    this.data.currentGesture = 0;
    this.setData({
      text: "没有滑动",
    });
  },

  reverseLocation: function (lbs, callback) {
    var self = this;
    // 实例化API核心类
    var baiduToQQ = new QQMapWX({
      key: 'OXFBZ-AGJC2-UECUS-C6M5G-UVVMK-ZXBLD' // 必填
    });
    // 调用接口
    baiduToQQ.reverseGeocoder({
      location: {
        latitude: lbs.lat,
        longitude: lbs.lon
      },
      coord_type: 3,//baidu经纬度
      success: function (res) {
        callback(res);
      }
    });
  }
})