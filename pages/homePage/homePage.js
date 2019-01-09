// pages/homePage/homePage.js
//获取应用实例
var app = getApp();
var login = require("../../utils/login.js");
var util = require('../../utils/util.js');
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let City = require('../../utils/allcity.js');
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeWorkTime:'',//门店的营业时间
    storeBedsCnt:'',//门店剩余床位数量
    //后台alertStatus是否展示店庆图，展示 则tabbarflag为true 则应该隐藏tabbar
    tabbarflag: false,
    //所有项目加载完才显示
    allProjectHasBeenLoad: false,
    //检测是否点击获取验证码
    areadyGetYzm: false,
    //注册使用的参数
    union_id: '',
    //验证码按钮的颜色控制
    jihuo: false,
    //注册时 换地区  输入的电话号清空
    phonecash: '',
    //验证码  换电话号时  清空
    yzmcash: '',
    //验证码符合规范
    yzmRight: false,
    //当前保存的预约满时的日期
    currFullTime: '',
    //获取微信昵称和性别
    nickName: '',
    gender: '',
    //获取验证码
    time: '获取', //倒计时 
    currentTime: 61,
    disabled: true,
    //未填提示
    popErrorMsg: '',
    //
    areaList: [
      {
        id: 0,
        name: "中国大陆",
        areaCode: "86",
        checked: true

      },
      {
        id: 1,
        name: "中国香港",
        areaCode: "852",
        checked: false
      },
      {
        id: 2,
        name: "中国澳门",
        areaCode: "853",
        checked: false
      },
    ],
    isShowConfirmBtn: 0,
    hiddenmodalchoosearea: false,
    area: '中国大陆',
    areaId: '0',
    areaCode: '86',
    phoneNumber: '',//18640887833
    yzmCode: '',
    hiddenmodalbindphone: false,


    // 加载中
    hiddenLoading: true,
    // 店庆轮播优惠券
    img_width_three: 60,
    img_width_one: 60,

    // 轮播图片
    queryShuffling: {},

    rzIndexCouponDtoList: [],

    // 获取项目列表
    projectList: [],
    // 获取养脑师列表
    technicianList: [],
    // 获取一个门店信息
    storesInfo: {},
    // 预约门店
    storeName: '',
    // 预约门店code
    storeCode: '',
    // 城市名称
    positionCity: '',
    // 城市code
    positionCode: '',

    isShowDianQingImage: true,
    showView: false,

    // 轮播图    
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    circular: true,
    // 指示点颜色
    beforeColor: "white",
    // 当前选中的指示点颜色
    afterColor: "coral",
    // 前边距
    previousmargin: '30px',
    // 后边距
    nextmargin: '30px',
    // 下架状态
    actStatus: false,
    // 城市信息
    allCity: City,
  },

  // 显示加载图层
  showLoading: function () {
    this.setData({
      hiddenLoading: false,
    });
  },
  // 隐藏加载图层
  hideLoading: function () {
    this.setData({hiddenLoading: true,});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    if (app.globalData.selectStoreTohomePage != 1) {
      self.showLoading();
      login.checkInitAgree(self, function () {
      });
      self.doInit();
    }
    app.globalData.mark_v == 0 ? wx.hideTabBar({animation: false}) : wx.showTabBar({animation: false})//是否需要过渡动画
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    app.globalData.v = '';
    if (app.globalData.selectStoreTohomePage == 1) {
      self.showLoading();
      login.checkInitAgree(self, function () {
      });
      self.doInit();
    }
  },
  doInit: function () {
    let self = this;
    self.queryShuffling();// 获取轮播图片
    let storeCode = app.globalData.storeCode, storeName = app.globalData.storeName
    if (storeCode != '' && storeName != '') {
      self.setData({positionCity: '', positionCode: '', storeName, storeCode});// 城市名称.城市code.预约门店.预约门店code
      self.getStoreInfo();// 获取门店信息
    } else {
      self.loadInfo();// 获取城市名称
    }
  },
  /**
   * 获取门店信息
   */
  getStoreInfo: function () {
    let self = this;
    let data = self.data
    let storeCode = data.storeCode
    let cityCode = data.positionCode
    let name = data.storeName
    if (storeCode == "" && cityCode == "" && name == "") {
      self.getSpecifiedStoreInfo();// 获取默认门店信息
    } else {
      self.getStoreAllData({
        storeCode, cityCode, name,
        lon: app.globalData.currentPositionLon,
        lat: app.globalData.currentPositionLat,
      }, false);
    }
  },
  /**
   * 获取当前位置
   */
  loadInfo: function () {
    let self = this;
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        let longitude = res.longitude
        let latitude = res.latitude
        app.globalData.currentPositionLon = longitude
        app.globalData.currentPositionLat = latitude
        self.loadCity(longitude, latitude)
      },
      fail: self.getSpecifiedStoreInfo,//失败获取默认门店
    });
  },
  /**
   * 获取城市信息
   */
  loadCity: function (longitude, latitude) {
    let self = this
    let key = 'OXFBZ-AGJC2-UECUS-C6M5G-UVVMK-ZXBLD'
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=' + key,
      data: {},
      header: {'Content-Type': 'application/json'},
      success: function (res) {
        let city = res.data.result.address_component.city;
        self.setData({positionCity: city});
        app.globalData.cityName = city;
        app.globalData.firstCityName = city;
        let allcity = self.data.allCity;
        allcity.map(item => {
          if (item.name.indexOf(city) == 0) {
            let positionCode = item.code
            self.setData({positionCode});
            app.globalData.cityCode = positionCode;
            app.globalData.firstCityCode = positionCode;
          }
        })
        self.getStoreInfo();// 获取门店信息
      },
    });
  },
  /**
   * 获取默认门店信息
   */
  getSpecifiedStoreInfo: function () {
    let global = app.globalData
    this.getStoreAllData({
      storeCode: 'UM0008', cityCode: '', name: '',
      lon: global.currentPositionLon,
      lat: global.currentPositionLat,
    }, true)
  },
  //获取门店全部信息
  getStoreAllData (data, isSpecified) {
    let self = this;
    let global = app.globalData
    let selfData = self.data
    selfData.storesInfo = {};
    selfData.projectList = [];
    let projectList = selfData.projectList
    let socket1 =function () {
      return new Promise((resolve)=>{
        wx.request({
          url: global.path + 'rest/transmission/getStoreAllData',
          // url: 'http://192.168.0.121:8081/' + 'rest/transmission/getStoreAllData',
          method: 'GET',
          data,
          success: function (res) {
            let resData = res.data
            resData.proDtos.some(item => {
              if (item.projectEfficacyClass == "招牌项目") {
                if (item.name.length >= 9) item.name = item.name.substring(0, 10) + '..'
                projectList.push(item);
              }
              return projectList.length == 2;
            })
            projectList.map(item => {
              let canUseTime = item.reservationAvailableTime || []
              if (canUseTime.length) {
                canUseTime.sort(self.compare("startTime"));
                canUseTime[0].startTime = canUseTime[0].startTime.substring(11, 16);
              }
              item.hiddenTimeContent = Boolean(canUseTime.length)

              let category = item.category;
              let subCategory = item.subCategory;
              if (category == "" || category == null) {
                item.categorySubCategory = (subCategory || subCategory === 0) ? subCategory : '';
              } else {
                item.categorySubCategory = category + ((subCategory == "" || subCategory == null) ? '' : ("，" + subCategory))
              }
            })
            self.setData({technicianList: resData.nurseDtos});
            let technicianList = selfData.technicianList

            technicianList.map(item => {
              item.evaluateGood = item.evaluateGood || 0
              if (item.name.length == 2) item.name = item.name.substring(0, 1) + "   " + item.name.substring(1, 2)
            })
            if (!selfData.tabbarflag) wx.showTabBar({animation: false}); //是否需要过渡动画
            global.selectStoreTohomePage = '';

            let obj = {
              storesInfo: resData,// 一个门店信息的信息
              storeCode: resData.storeCode,// 一个门店code
              storeName: resData.name,// 一个门店名称
              allProjectHasBeenLoad: true,
              projectList, technicianList
            }
            if (isSpecified) {
              obj.positionCity = '珠海市'// 城市名称
              obj.positionCode = '440400000000'// 城市code
              global.cityName = '珠海市'// 城市名称
              global.cityCode = '440400000000'// 城市code
            }
            self.setData(obj);
            global.storeName = selfData.storeName;
            global.storeCode = selfData.storeCode;
            resolve()
          },
          fail: resolve,
        });
      })
    }

    socket1().then(()=>{
      wx.request({
        url: global.path + 'rest/RzSubsequentDemand/getStoreWorkTime',
        // url: 'http://192.168.0.121:8081/' + 'rest/RzSubsequentDemand/getStoreWorkTime',
        method: 'GET',
        data:{storeCode:selfData.storeCode},
        success: function (res) {
          let resData = res.data
          let sTime = resData.startTime
          let eTime = resData.endTime
          if(sTime && eTime){
            sTime = sTime.substring(0,5)
            eTime = eTime.substring(0,5)
            self.setData({
              storeWorkTime: sTime + '-' + (sTime>eTime?'次日':'') + eTime,
              storeBedsCnt: resData.bedNum
            })
          }else{
            self.setData({
              storeWorkTime: '11:00-23:00',
              storeBedsCnt: '详询门店'
            })
          }
          self.hideLoading()
        },
        fail: self.hideLoading ,
      });
    })
  },


// 轮播图的切换事件
  swiperChange: function (e) {
    console.log(e.detail.current);
    // 获取当前轮播图片的下标
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  // 滑动图片切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },

  closeDianQing: function () {
    wx.showTabBar({
      animation: false //是否需要过渡动画
    })
    this.setData({
      isShowDianQingImage: false,
      showView: true,
    })
  },

  closeAll: function () {
    this.setData({
      isShowDianQingImage: false,
      showView: false,
    })
  },

  clickDianqingSmall: function () {
    wx.hideTabBar({
      animation: false //是否需要过渡动画
    })
    this.setData({
      isShowDianQingImage: true,
      showView: false,
    })
  },

  clickDianQing: function (e) {
    var self = this;
    wx.request({
      url: app.globalData.path + 'rest/RzAct/getAct?actStatus=1',
      method: 'GET',
      data: {},
      success: function (res) {
        console.log(res)
        var actList = res.data;
        for (var i = 0; i < actList.length; i++) {
          if (e.currentTarget.dataset.item == actList[i].actId) {
            //活动详情
            self.setData({
              actStatus: true
            })
          }
        }
        if (self.data.actStatus == true) {
          self.setData({
            actStatus: false
          })
          wx.navigateTo({
            url: '../../pages/preferentialDetail/preferentialDetail?actId=' + e.currentTarget.dataset.item,
          });
        } else {
          wx.navigateTo({
            url: '../../pages/couponDisable/couponDisable'
          });
        }
        self.hideLoading();
      },
      fail: function (err) {
        self.hideLoading();
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
          confirmColor: '#fbb059',
        });
      }
    });
  },
  //轮播图上的浮窗，点击跳到新页面查看更多门店照片
  showMoreImgs () {
    wx.navigateTo({
      url: '../../pages/moreStoreImgs/moreStoreImgs',
    });
  },

  chooseStore: function (e) {
    var self = this;
    console.log("跳转至选择门店界面")
    if (app.globalData.cityCode != '' && app.globalData.cityName != '') {
      self.data.positionCode = app.globalData.cityCode;
      self.data.positionCity = app.globalData.cityName;
    }
    app.globalData.storeCode = self.data.storeCode;
    app.globalData.storeName = self.data.storeName;
    app.globalData.v = '1';
    wx.switchTab({
      url: '../../pages/selectStores/selectStores',//?cityName=' + self.data.positionCity + '&cityCode=' + self.data.positionCode + '&storeName=' + self.data.storeName + '&storeCode=' + self.data.storeCode + '&v=1',
    })
  },

  moreProject: function (e) {
    var self = this;
    console.log("跳转至所有项目一览界面")
    wx.navigateTo({
      url: '../../pages/project/project?storeCode=' + self.data.storeCode,
    })
  },

  yoyakuBtn: function (e) {
    var self = this;
    wx.navigateTo({
      url: '../../pages/order/order?orderStore=' + self.data.storeName + '&incloudProjectCode=' + e.currentTarget.id + '&incloudProjectName=' + e.currentTarget.dataset.item + '&storeCode=' + self.data.storeCode + '&v=1',
    })
  },

  moreTechnician: function (e) {
    console.log("跳转至技师列表界面")
    var self = this;
    wx.navigateTo({
      url: '../../pages/teacherList/teacherList?storeCode=' + self.data.storeCode,
    })
  },

  projectDetail: function (e) {
    console.log(e);
    console.log("跳转至项目详情界面" + e.currentTarget.id)
    var name = e.currentTarget.dataset.item.name
    if (name.length >= 9) {
      name = name.substring(0, 10) + '..'
    }

    console.log(354)
    console.log(name)
    var self = this;
    wx.navigateTo({
      url: '../../pages/projectDetail/projectDetail?uuid=' + e.currentTarget.dataset.item.uuid + '&nursingTime=' + e.currentTarget.dataset.item.nursingTime + '&name=' + name + '&categorySubCategory=' + e.currentTarget.dataset.item.categorySubCategory,
    });
  },

  technicianDetail: function (e) {
    console.log("跳转至技师详情界面")
    var self = this;
    wx.navigateTo({
      url: '../../pages/teacherDetail/teacherDetail?storeCode=' + self.data.storeCode + '&uuid=' + e.currentTarget.dataset.item.uuid + '&name=' + e.currentTarget.dataset.item.name + '&srcImg=' + encodeURIComponent(e.currentTarget.dataset.item.srcImg) + '&star=' + e.currentTarget.dataset.item.star,
    });
  },

  makeCall: function (e) {
    var self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.storesInfo.phone,
    })
  },

  gotoWebUrlPath: function (e) {
    // var webUrlPath = e.currentTarget.dataset.item.webUrlPath + ''
    // var actId = e.currentTarget.dataset.item.actId + ''
    // console.log(317)
    // console.log(webUrlPath + actId);
    // console.log(e.currentTarget.dataset.item.actId);

    console.log(e)
    var self = this;
    if (e.currentTarget.dataset.item.webUrlPath == null) {
      return;
    } else if (e.currentTarget.dataset.item.webUrlPath != null && e.currentTarget.dataset.item.actId == null) {
      var theurl = '../../' + e.currentTarget.dataset.item.webUrlPath
      console.log(theurl)
      if (theurl.indexOf('mine') != 0) {
        wx.switchTab({
          url: theurl
        })
      }
      wx.navigateTo({
        url: theurl
      });


    } else {
      self.showLoading();
      // 发起网络请求 获取活动信息
      wx.request({
        url: app.globalData.path + 'rest/RzAct/getAct?actStatus=1',
        method: 'GET',
        data: {},
        success: function (res) {
          console.log(res)
          var actList = res.data;
          for (var i = 0; i < actList.length; i++) {
            if (e.currentTarget.dataset.item.actId == actList[i].actId) {
              //活动详情
              self.setData({
                actStatus: true
              })
            }
          }
          if (self.data.actStatus == true) {
            var webUrlPath = e.currentTarget.dataset.item.webUrlPath;
            var actId = e.currentTarget.dataset.item.actId;
            console.log(342)
            console.log(webUrlPath + actId)
            self.setData({
              actStatus: false
            })
            wx.navigateTo({
              url: webUrlPath + actId
            });
          } else {
            wx.navigateTo({
              url: '../../pages/couponDisable/couponDisable'
            });
          }
          self.hideLoading();
        },
        fail: function (err) {
          self.hideLoading();
          wx.showModal({
            title: "请求超时",
            content: "系统繁忙，请稍后重试！",
            showCancel: false,
            confirmColor: '#fbb059',
          });
        }
      });
    }
  },

  getAct: function (actId) {

  },

  /** 店庆轮播优惠券 */
  /** 店庆轮播优惠券 */
  /** 店庆轮播优惠券 */
  //触摸开始事件
  touchstart: function (e) {
    this.data.touchDot = e.touches[0].pageX;
    var that = this;
    this.data.interval = setInterval(function () {
      that.data.time += 1;
    }, 1000);
  },

  //触摸移动事件
  touchmove: function (e) {
    let touchMove = e.touches[0].pageX;
    let touchDot = this.data.touchDot;
    let time = this.data.time;
    //向左滑动
    if (touchMove - touchDot <= -40 && !this.data.done) {
      console.log("向左滑动");
      this.data.done = true;
      this.scrollLeft();
    }
    //向右滑动
    if (touchMove - touchDot >= 40 && !this.data.done) {
      console.log("向右滑动");
      this.data.done = true;
      this.scrollRight();
    }
  },

  //触摸结束事件
  touchend: function (e) {
    clearInterval(this.data.interval);
    this.data.time = 0;
    this.data.done = false;
  },

  //向左滑动事件
  scrollLeft () {
    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    });
    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    });
    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    });
    // this.setData({
    //   img_width_three: 200
    // });

    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation1.translateX(0).opacity(1).scale().step();
    this.animation2.translateX(0).opacity(1).scale().step();
    this.animation3.translateX(0).opacity(1).scale().step();

    this.setData({
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
    });

    var that = this;
    setTimeout(function () {
      that.animation1.translateX(0).opacity(1).step({duration: 0, timingFunction: 'linear'});
      that.animation2.translateX(0).opacity(1).scale().step({duration: 0, timingFunction: 'linear'});
      that.animation3.translateX(0).opacity(1).scale().step({duration: 0, timingFunction: 'linear'});

      that.setData({
        animation1: animation1.export(),
        animation2: animation2.export(),
        animation3: animation3.export(),
        // img_width_three: 60
      });
    }.bind(this), 1000)

    let array = this.data.rzIndexCouponDtoList;
    let shift = array.shift();
    array.push(shift);

    setTimeout(function () {
      this.setData({
        rzIndexCouponDtoList: array
      })
    }.bind(this), 195)
  },

  //向右滑动事件
  scrollRight () {
    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    });
    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    });
    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    });
    var animation4 = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    });
    var animation5 = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    });
    // this.setData({
    //   img_width_one: 200
    // });
    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation1.translateX(0).opacity(1).scale().step();
    this.animation2.translateX(0).opacity(1).scale().step();
    this.animation3.translateX(0).opacity(1).scale().step();

    this.setData({
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
    });

    var that = this;
    setTimeout(function () {
      that.animation1.translateX(0).opacity(1).scale(1, 1).step({duration: 0, timingFunction: 'linear'});
      that.animation2.translateX(0).opacity(1).scale(1, 1).step({duration: 0, timingFunction: 'linear'});
      that.animation3.translateX(0).opacity(1).step({duration: 0, timingFunction: 'linear'});
      that.setData({
        animation1: animation1.export(),
        animation2: animation2.export(),
        animation3: animation3.export(),
        // img_width_one: 60
      });
    }.bind(this), 500)

    let array = this.data.rzIndexCouponDtoList;
    let pop = array.pop();
    array.unshift(pop);

    setTimeout(function () {
      this.setData({
        rzIndexCouponDtoList: array
      });
    }.bind(this), 195)
  },

  /**
   * 优惠券点击事件
   */
  // gotoCouponDetail: function (e) {
  //   wx.navigateTo({
  //     url: '../../pages/preferentialDetail/preferentialDetail?actId=' + e.currentTarget.dataset.item,
  //   })
  // },

  /**
   * 获取活动，轮播图片
   */
  queryShuffling: function () {
    var self = this;
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/RzIndexSetting/searchIndexSetting',
      method: 'GET',
      data: {},
      success: function (res) {
        console.log(8888)
        console.log(res);
        self.setData({
          queryShuffling: res.data,
          rzIndexCouponDtoList: res.data.rzIndexCouponDtoList,
        });

        if (res.data.alertStatus == false) {
          // wx.showTabBar({
          //   animation: false //是否需要过渡动画
          // })
        } else if (res.data.alertStatus == true && self.data.isShowDianQingImage == true) {
          self.setData({
            tabbarflag: true
          })
          wx.hideTabBar({
            animation: false //是否需要过渡动画
          })
        }
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


  /**
   * 获取俩点之间的距离-数组
   */
  getCalculateDistanceArr: function (info) {
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
          // 一个门店信息的信息
          storesInfo: info[0],
          // 一个门店code
          storeCode: info[0].storeCode,
          // 一个门店名称
          storeName: info[0].name,
        });
        app.globalData.storeName = self.data.storeName;
        app.globalData.storeCode = self.data.storeCode;
        // 获取项目列表
        self.getProjects();
        // 获取养脑师
        self.getNurses();
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
   * 获取项目列表
   */
  getProjects: function () {
    var self = this;
    self.data.projectList = [];
    wx.request({
      url: app.globalData.path + 'rest/transmission/getProgramList',
      method: 'GET',
      data: {
        storeCode: self.data.storeCode
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      success: function (res) {
        console.log(779)
        console.log(res);
        console.log("获取项目结束时间" + new Date())
        self.setData({
          allProjectHasBeenLoad: true
        })

        if (res.data.length != 0) {
          for (var index in res.data) {
            if (res.data[index].projectEfficacyClass == "招牌项目") {
              if (res.data[index].name.length >= 9) {
                res.data[index].name = res.data[index].name.substring(0, 10) + '..'
              }
              self.data.projectList.push(res.data[index]);
            }
            if (self.data.projectList.length == 2) {
              break;
            }
          }

          for (var index in self.data.projectList) {
            self.data.projectList[index].reservationAvailableTime.sort(self.compare("startTime"));
            if (self.data.projectList[index].reservationAvailableTime.length != 0) {
              self.data.projectList[index].reservationAvailableTime[0].startTime = self.data.projectList[index].reservationAvailableTime[0].startTime.substring(11, 16);
              self.data.projectList[index].hiddenTimeContent = true;
            } else {
              self.data.projectList[index].hiddenTimeContent = false;
            }

            var category = self.data.projectList[index].category;
            var subCategory = self.data.projectList[index].subCategory;
            var categorySubCategory = "";
            if (category == "" || category == null) {
              if (subCategory == "" || subCategory == null) {
                categorySubCategory = "";
              } else {
                categorySubCategory = subCategory;
              }
            } else {
              if (subCategory == "" || subCategory == null) {
                categorySubCategory = category
              } else {
                categorySubCategory = category + "，" + subCategory;
              }
            }
            self.data.projectList[index].categorySubCategory = categorySubCategory;
          }

          self.setData({
            projectList: self.data.projectList
          });
        }
        self.hideLoading();
        console.log(self.data.tabbarflag + ',' + (self.data.tabbarflag != true))
        if (self.data.tabbarflag != true) {
          wx.showTabBar({
            animation: false //是否需要过渡动画
          })
        }
        app.globalData.selectStoreTohomePage = '';
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
   * 获取养脑师
   */
  getNurses: function () {
    var self = this;
    self.data.technicianList = [];
    wx.request({
      url: app.globalData.path + 'rest/transmission/getNurseList',
      method: 'GET',
      data: {
        storeCode: self.data.storeCode
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      success: function (res) {
        console.log(res);
        console.log("获取养脑师结束时间" + new Date())
        if (res.data.length != 0) {
          self.setData({
            technicianList: res.data
          });
        }

        for (var index in self.data.technicianList) {
          if (self.data.technicianList[index].evaluateGood == null) {
            self.data.technicianList[index].evaluateGood = 0
          }
          if (self.data.technicianList[index].name.length == 2) {
            self.data.technicianList[index].name = self.data.technicianList[index].name.substring(0, 1) + "   " + self.data.technicianList[index].name.substring(1, 2)
          }
        }
        self.setData({
          technicianList: self.data.technicianList
        });
        self.hideLoading();
        app.globalData.selectStoreTohomePage = '';
      },
      fail: function (err) {
        self.hideLoading();
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
    })
  },

  //手机注册
  /** 合并后加的内容 */
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  chooseArea: function () {
    this.setData({
      hiddenmodalchoosearea: true
    })
  }
  ,
  saveArea: function () {
    var name;
    var areaCode;
    var areaList = this.data.areaList
    for (var index in areaList) {
      if (this.data.areaId == areaList[index].id) {
        name = areaList[index].name,
          areaCode = areaList[index].areaCode
        areaList[index].checked = true
      } else {
        areaList[index].checked = false
      }
    }
    this.setData({
      areaList: areaList,
      area: name,
      areaCode: areaCode,
      hiddenmodalchoosearea: false
    })
    this.hideModal()
  },
  yuyueBtn: function (e) {
    console.log(e);
    var self = this;
    //check用户是否注册 没注册调接口注册
    var vipNo = app.globalData.vipNo;
    var couponId = e.currentTarget.dataset.item.couponId;
    var actId = e.currentTarget.dataset.item.actId;
    var isPassed = true
    if (vipNo == '' | vipNo == null) {
      self.setData({
        hiddenmodalbindphone: true
      })
    } else if (vipNo != '' && vipNo != null) {

      //检查优惠券状态 是否强光  失效等..
      self.showLoading()
      wx.request({
        url: app.globalData.path + 'rest/RzAct/getAct?actStatus=1',
        method: 'GET',
        data: {},
        success: function (res) {
          console.log("打印优惠券的状态")
          console.log(res)
          for (var index in res.data) {
            if (actId == res.data[index].actId) {
              isPassed = false
              break
            }
          }
          console.log("遍历完毕")
          if (isPassed == true) {
            wx.showModal({
              title: "",
              content: "该活动已下架",
              showCancel: false,
              confirmColor: '#fbb059',
            });
          } else {
            console.log("请求领取优惠券")
            //发起网络请求 获取活动及优惠券信息
            wx.request({
              url: app.globalData.path + 'rest/RzActivity/restSendCoupon',
              method: 'GET',
              data: {
                vipNo: vipNo,
                couponId: couponId
              },
              success: function (res) {
                console.log(res)
                // 后台正常返回
                if (res.data.status == 'right') {
                  wx.showToast({
                    title: '领取成功',
                    icon: 'success',
                    duration: 2000
                  });
                } else if (res.data.status == 'error') {
                  wx.showModal({
                    title: "",
                    content: res.data.msg,
                    showCancel: false,
                    confirmColor: '#fbb059',
                  });
                } else {
                  wx.showModal({
                    title: "请求超时",
                    content: "系统繁忙，请稍后重试！",
                    showCancel: false,
                    confirmColor: '#fbb059',
                  });
                }
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
          }
          // var actList = res.data;
          // for (var i = 0; i < actList.length; i++) {
          //   if (e.currentTarget.dataset.item.actId == actList[i].actId) {
          //     //活动详情
          //     self.setData({
          //       actStatus: true
          //     })
          //   }
          // }
          // if (self.data.actStatus == true) {
          //   var webUrlPath = e.currentTarget.dataset.item.webUrlPath;
          //   var actId = e.currentTarget.dataset.item.actId;
          //   console.log(342)
          //   console.log(webUrlPath + actId)
          //   self.setData({
          //     actStatus: false
          //   })
          //   wx.navigateTo({
          //     url: webUrlPath + actId
          //   });
          // } else {
          //   wx.navigateTo({
          //     url: '../../pages/couponDisable/couponDisable'
          //   });
          // }
          self.hideLoading();
        },
        fail: function (err) {
          self.hideLoading();
          wx.showModal({
            title: "请求超时",
            content: "系统繁忙，请稍后重试！",
            showCancel: false,
            confirmColor: '#fbb059',
          });
        }
      });
      //以上为检测优惠券状态
      console.log("我要优惠群活动")
      console.log(e.currentTarget.dataset.item)

    }
  },
  //获取微信昵称
  onGotUserInfo: function (e) {
    var self = this;
    //性别是男的
    if (e.detail.userInfo.gender == 1) {
      var gender = 'GENDER_001'
    } else if (e.detail.userInfo.gender == 2) {
      var gender = 'GENDER_002'
    } else {
      var gender = 'GENDER_003'
    }
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    self.setData({
      nickName: e.detail.userInfo.nickName,
      gender: gender,
      encryptedData: encryptedData,
      iv: iv,
      avatarUrl: e.detail.userInfo.avatarUrl
    })
    self.bind_phone();
  },
  bind_phone: function () {
    var self = this
    var vipNo = '';
    var nickName = self.data.nickName;
    var gender = self.data.gender;
    var phoneNumber = self.data.phoneNumber;
    var birthday = '';
    var avatar = self.data.avatarUrl;
    var province = '';
    var city = '';
    var district = '';
    var education = '';
    var introducer = '';
    var introducerPhone = '';
    var occupation = '';
    var income = '';
    var marital = '';
    var sparePhone = '';
    var openId = app.globalData.openid;
    var sysId = '';
    console.log(self.data.phoneNumber);
    console.log(self.data.yzmCode);
    console.log(nickName)
    console.log(gender)
    console.log(1014)
    console.log(self.data.areaCode)
    if (self.data.yzmCode != '') {
      self.showLoading() //开始一系列验证
      wx.request({
        url: app.globalData.path + 'rest/xcx/xcxCheckPhoneCode?phone=%2B' + self.data.areaCode + self.data.phoneNumber + '&passWord=' + self.data.yzmCode,//?phone='+self.data.phoneNumber+'&passWord='+self.data.yzmCode,
        // header: {//请求头
        //   "Content-Type": "applciation/json"
        // },
        // data:{
        //   phone: '%2B' + self.data.areaCode + self.data.phoneNumber,
        //   passWord: self.data.yzmCode
        // },
        method: 'get',
        success: function (res) {
          console.log(res)
          if (res.data.errcode == -10) {
            self.hiddenLoading()//关闭loading图标
            wx.showModal({
              title: '',
              content: res.data.errmsg,
              confirmColor: '#fbb059',
            });
            self.setData({
              popErrorMsg: '验证码错误...'
            })
            app.ohShitfadeOut(self);
            return
          } else {
            // wx.showToast({
            //   title: '手机验证成功...',
            //   icon: 'success',
            //   duration: 1000
            // });

            var encryptedData = self.data.encryptedData;
            var iv = self.data.iv;
            var sessionKey = app.globalData.session_key;
            console.log()
            wx.request({
              url: app.globalData.path + 'rest/xcx/xcxGetUserInfo',
              method: 'GET',
              data: {
                sessionKey: sessionKey,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                var union_id = res.data.union_id;
                self.setData({
                  union_id: union_id,
                });
                //注册
                console.log("console.log(avatar)")
                console.log(avatar)
                wx.request({
                  url: app.globalData.path + 'rest/transmission/createMember',
                  method: 'post',
                  data: {
                    vipNo: vipNo,
                    name: nickName,
                    gender: gender,
                    phone: phoneNumber,
                    birthday: birthday,
                    avatar: avatar,
                    province: province,
                    city: city,
                    district: district,
                    education: education,
                    introducer: introducer,
                    introducerPhone: introducerPhone,
                    occupation: occupation,
                    income: income,
                    marital: marital,
                    sparePhone: sparePhone,
                    openId: openId,
                    sysId: sysId,
                    unionId: self.data.union_id
                  },
                  success: function (res) {
                    console.log("注册返回数据...")
                    console.log(res)
                    if (res.data.errcode == 0) {
                      self.hiddenLoading()//关闭loading图标
                      wx.showToast({
                        title: '注册成功',
                        icon: 'success',
                        duration: 1000
                      });
                      setTimeout(function () {
                        self.setData({
                          hiddenmodalbindphone: false
                        });
                        self.hideModal()
                      }, 1000)
                      login.checkInitAgree(self, function () {
                        var couponId = e.currentTarget.dataset.item
                        //发起网络请求 获取活动及优惠券信息
                        wx.request({
                          url: app.globalData.path + 'rest/RzActivity/restSendCoupon',
                          method: 'GET',
                          data: {
                            vipNo: vipNo,
                            couponId: couponId
                          },
                          success: function (res) {
                            // 后台正常返回
                            if (res.statusCode == 200) {
                              wx.showToast({
                                title: '领取成功',
                                icon: 'success',
                                duration: 2000
                              });
                            } else {
                              wx.showModal({
                                title: "请求超时",
                                content: "系统繁忙，请稍后重试！",
                                showCancel: false,
                                confirmColor: '#fbb059',
                              });
                            }
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
                      });
                    } else {
                      self.hiddenLoading()//关闭loading图标
                      wx.showModal({
                        title: "",
                        content: res.data.errmsg,
                        confirmColor: '#fbb059',
                      });
                    }
                  }
                });
              },
              fail: function (err) {
                self.hiddenLoading()//关闭loading图标
                wx.showModal({
                  title: "请求超时",
                  content: "系统繁忙，请稍后重试！",
                  showCancel: false,
                  confirmColor: '#fbb059',
                });
              }
            })
          }
        },
        fail: function (err) {
          self.hiddenLoading()//关闭loading图标
          wx.showModal({
            title: "请求超时",
            content: "系统繁忙，请稍后重试！",
            showCancel: false,
            confirmColor: '#fbb059',
          });
        }
      })
    } else {
      self.setData({
        popErrorMsg: '请检查验证码格式...'
      })
      app.ohShitfadeOut(self);
      return
    }
  },
  //显示加载logo
  showLoading: function () {
    this.setData({
      hiddenLoading: false
    })
  },
  //隐藏加载logo
  hiddenLoading: function () {
    this.setData({
      hiddenLoading: true
    })
  },
  //
  closePage: function () {
    var area = '中国大陆'
    var areaId = '0'
    var areaCode = '86'
    var areaList = [{
      id: 0,
      name: "中国大陆",
      areaCode: "86",
      checked: true,

    },
      {
        id: 1,
        name: "中国香港",
        areaCode: "852",
        checked: false
      },
      {
        id: 2,
        name: "中国澳门",
        areaCode: "853",
        checked: false
      },
    ]
    this.setData({
      hiddenmodalbindphone: false,
      areaList: areaList,
      area: area,
      areaId: areaId,
      areaCode: areaCode,
      jihuo: false,
    })
    // this.setData({
    //   hiddenmodalbindphone: false
    // })
    this.hideModal()
  },
  areaChange: function (e) {
    this.setData({
      areaId: e.detail.value,
      phonecash: '',
      yzmcash: '',
      yzmRight: false,
      jihuo: false,
      areadyGetYzm: false,//改变了地区 电话也就更改了 所以将得到验证码状态设置为false
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: false
    })
  },
  checkthis: function (r) {
    //console.log(r)
    var e = r.currentTarget.dataset.projectid
    // this.checkboxChange(e);
  },
  //验证大陆手机号
  testPhoneDalu: function (phone) {
    var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
    return reg.test(phone)
  },
  //验证港澳手机号
  testPhoneGangAo: function (phone) {
    var reg = new RegExp('^([1-9])\\d{7}$');
    return reg.test(phone)
  },

  //获取验证码
  yzmGet: function () {
    var self = this
    var phone = self.data.phoneNumber;
    if (phone == '') {
      self.setData({
        popErrorMsg: '请输入11位电话号'
      })
      app.ohShitfadeOut(self);
      return
    } else {
      console.log("验证手机号格式结果")
      console.log(self.testPhoneDalu(phone))
      // var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
      // var phoneVar = reg.test(phone);
      var result = false
      if (phone.length == 11) {
        result = self.testPhoneDalu(phone)
      } else {
        result = self.testPhoneGangAo(phone)
      }
      if (result) {
        self.getVerificationCode();
        console.log(self.data.phoneNumber)
        // var a = self.data.areaCode;
        // var b = self.data.phoneNumber;
        // var c = a*1+b*1;
        console.log(self.data.areaCode)
        wx.request({
          url: app.globalData.path + 'rest/xcx/xcxGetPhoneCode?phone=%2B' + self.data.areaCode + self.data.phoneNumber,
          // data:{
          //   //+86啥的加上没法注册
          //   phone='%2B' + self.data.areaCode + self.data.phoneNumber
          //  // phone: self.data.phoneNumber,
          // },
          // header:{
          //   'content-type':'application/json'
          // },
          success: function (res) {
            console.log(res)
            if (res.data.message == 'success') {
              console.log("得到了验证码")
              self.setData({
                areadyGetYzm: true,
                yzmcash: ''
              })
              //倒计时
              self.setData({
                popErrorMsg: '已发送验证码，请查收...'
              })
              app.ohShitfadeOut(self);
              return

            } else {
              self.setData({
                popErrorMsg: '请检查电话号对错'
              })
              app.ohShitfadeOut(self);
              return
            }
          },
          fail: function (err) {
            wx.showModal({
              title: "请求超时",
              content: "系统繁忙，请稍后重试！",
              showCancel: false,
              confirmColor: '#fbb059',
            });
          }
        })
      } else {
        self.setData({
          popErrorMsg: '请输入正确的手机号'
        })
        app.ohShitfadeOut(self);
        return
      }
    }
  },
  //获得输入的电话号
  getPhone: function (e) {
    console.log(e)
    console.log(e.detail.value.length)
    if (this.data.areaCode == '86') {
      if (e.detail.value.length == 11 && this.testPhoneDalu(e.detail.value)) {
        this.setData({
          phoneNumber: e.detail.value,
          jihuo: true,

        })
      } else {
        this.setData({
          phoneNumber: '',
          jihuo: false,
          yzmCode: '',
          yzmcash: '',
          areadyGetYzm: false,//改动号码时 得到验证码的状态为false
          yzmRight: false//当输完验证码后，改电话电话，验证码符合规格要设为false
        })
        if (e.detail.value.length == 11) {
          console.log("虽然11位 但不符合手机格式")
          this.setData({
            popErrorMsg: '请输入正确的手机号'
          })
          app.ohShitfadeOut(this);
          return
        }

      }
    } else {
      if (e.detail.value.length == 8 && this.testPhoneGangAo(e.detail.value)) {
        this.setData({
          phoneNumber: e.detail.value,
          jihuo: true
        })
      } else {
        this.setData({
          phoneNumber: '',
          jihuo: false,
          yzmCode: "",
          yzmcash: '',
          yzmRight: false //当输完验证码后，改电话电话，验证码符合规格要设为false
        })
        if (e.detail.value.length == 8) {
          this.setData({
            popErrorMsg: '不能以 0 开头电话号...'
          })
          app.ohShitfadeOut(this);
          return
        }
      }
    }

    console.log(this.data.phoneNumber)
  }
  ,
  //得到输入的验证码
  setYzmCode: function (e) {
    if (e.detail.value.length == 6 && this.data.areadyGetYzm == true) {
      this.setData({
        yzmCode: e.detail.value,
        yzmRight: true
      })
    } else {
      this.setData({
        yzmCode: '',
        yzmRight: false
      })
      if (e.detail.value.length >= 1 && this.data.areadyGetYzm == false) {
        this.setData({
          popErrorMsg: "请点击'获取'按钮，得到验证码..."
        })
        app.ohShitfadeOut(this);
        return
      }
    }
    console.log(this.data.yzmRight)
  },
  //验证码倒计时
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒',
        disabled: false
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: true
        })
      }
    }, 1000)
  },
  getVerificationCode () {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },

  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 > value2;
    }
  },
  //点击门店地址跳转到地图页
  jumpToMap(e){
    let store = this.data.storesInfo
    wx.openLocation({
      latitude: Number(store.lat),// 目的地经纬度
      longitude: Number(store.lon),
      scale: 14,// 缩放级别默认18
      name: store.name,// 位置名
      address: store.detailAddr// 详细地址
    });
  }
})