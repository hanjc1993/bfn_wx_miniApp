// pages/couponsList/couponsList.js

//获取应用实例
const app = getApp();
var login = require("../../utils/login.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 加载中
    hiddenLoading: true,
    // 控制底部显示
    showNoData: false,
    
    navbar: ['未使用', '已使用', '已过期'],
    currentTab: 0,
    detailDisplayControl: false,
    stateParameter: 0,
    weui: "weui-cell__ft",
    initialData: [],
    showBottom: true,
    hideBottom: false,
    indexData: "",
    chargeDetailVisible:false,
    coupons:"",
    vipNo:"",
    couponId:"",

    coupons1: "",
    coupons2: "",
    coupons3: "",
    backButton: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.data.vipNo = options.vipNo
    if (options.source == 1) {
      self.setData({
        backButton: true
      });
    } else {
      self.setData({
        backButton: false
      });
    }
    // 判断网络状态
    login.checkInitAgree(self, function () {
      self.doInit(options);
    });
  },
  doInit: function (options) {
    console.log(options);
    var self = this;

    self.setData({
      vipNo:app.globalData.vipNo,
      coupons: options.coupons
    });
    //console.log(app.globalData.vipNo);
    if (app.globalData.vipNo == "" || app.globalData.vipNo ==null){

        if (options.coupons == "0") {

          self.setData({
            showNoData: true,
          });
        }
      
    }else{
      self.getPersonalInformation();
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
  /**
   * title Bar
   */
  navbarTap: function (e) {
    //console.log(e);
    this.setData({
      stateParameter: 1,
      currentTab: e.currentTarget.dataset.idx,
      initialData: [],
    });
    // if (e.currentTarget.dataset.idx == 1){
    //     this.setData({
    //       chargeDetailVisible: true,
    //       stateParameter: 1,
    //       currentTab: e.currentTarget.dataset.idx
    //     })
    //   }else {
    //   this.setData({
    //     chargeDetailVisible: false,
    //     stateParameter: 0,
    //     currentTab: e.currentTarget.dataset.idx
    //   })
    //   }
    if (app.globalData.vipNo == "" || app.globalData.vipNo == null) {
        if (this.data.coupons == 0) {
          this.setData({
            showNoData: true,
          });
        }
    } else {
      this.getPersonalInformation();
    }
  },
  /**
   * 点击详情跳转
   */
  goCoupons: function (e) {
    var id = e.currentTarget.dataset.item;
    var couponName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../coupons/coupons?couponId=' + id + '&couponName=' + couponName,
    })
  },
  /**
   * 套餐卡详情展开
   */
  packageCardDetails: function (e) {
    this.data.indexData = e.currentTarget.dataset.id;
    this.data.stateParameter = e.currentTarget.dataset.index;
    //console.log(e.currentTarget.dataset.id);
    //console.log(e.currentTarget.dataset.index);
    this.getInitialDataTest(this.data.indexData, this.data.stateParameter);
  },
  /**
   * 获取页面初始数据
   */
  getPersonalInformation: function () {
    var self = this;
    self.showLoading();
    // 发起网络请求 获取优惠券信息
    wx.request({
       url: app.globalData.path + 'rest/RzActivity/getCouponInfoLst',
      method: 'GET',
      data: {
       vipNo: self.data.vipNo
      },
      success: function (res) {
        console.log("我的优惠券页-详细初始信息");
        console.log(res);
        var testOne = [];
        var test = res.data;
        // 后台正常返回
        if (self.data.currentTab == 0){
          var count = 0;
          for (var index in test) {
            if (test[index].cd.status == 2){
              var testList = {};
              testList.periodValidity = test[index].cd.endTime;
              testList.periodValidity1 = test[index].cd.startTime;
              testList.showOrhide = self.data.hideBottom;
              testList.couponId = test[index].cd.couponId;
              testList.couponName = test[index].cd.couponName;
              // testList.status = test[index].cd.status;
              testList.imageBg = "top_image";
              testList.couponImg = test[index].cd.couponImg;

              testList.mendian = "";
              testList.shangpin = "";
              testList.weui = "weui-cell__ft";
              // testList.couponId = "51";
              testOne.push(testList);
              count++;
            }
          };
          self.setData({ coupons1: count });
          if (count == 0) {
            self.setData({
              showNoData: true,
            });
          }else {
            self.setData({
              showNoData: false,
            });
          }
        } else if (self.data.currentTab == 1){
          var count = 0;
          for (var index in test) {
            if (test[index].cd.status == 3) {
              var testList = {};
              testList.periodValidity = test[index].cd.endTime;
              testList.periodValidity1 = test[index].cd.startTime;
              testList.showOrhide = self.data.hideBottom;
              testList.couponId = test[index].cd.couponId;
              testList.couponName = test[index].cd.couponName;
              // testList.status = test[index].cd.status;
              testList.imageBg = "top_image_bak1";
              testList.couponImg = test[index].cd.couponImg;

              testList.mendian = "";
              testList.shangpin = "";
              testList.weui = "weui-cell__ft";
              // testList.couponId = "51";
              testOne.push(testList);
              count++;
            }
          };
          self.setData({ coupons2: count });
          if (count == 0) {
            self.setData({
              showNoData: true,
            });
          }else {
            self.setData({
              showNoData: false,
            });
          }
        } else if (self.data.currentTab == 2){
          var count = 0;
          for (var index in test) {
            if (test[index].cd.status == 5) {
              var testList = {};
              testList.periodValidity = test[index].cd.endTime;
              testList.periodValidity1 = test[index].cd.startTime;
              testList.showOrhide = self.data.hideBottom;
              testList.couponId = test[index].cd.couponId;
              testList.couponName = test[index].cd.couponName;
              // testList.status = test[index].cd.status;
              testList.imageBg = "top_image_bak1";
              testList.couponImg = test[index].cd.couponImg;

              testList.mendian = "";
              testList.shangpin = "";
              testList.weui = "weui-cell__ft";
              // testList.couponId = "51";
              testOne.push(testList);
              count++;
            }
          };
          self.setData({ coupons1: count });
          if (count == 0) {
            self.setData({
              showNoData: true,
            });
          }else {
            self.setData({
              showNoData: false,
            });
          }
        }
         
          self.setData({
            initialData: testOne,
          });
          self.hideLoading();

      },
      fail: function (err) {
        self.hiddenLoading();
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
  * 重置页面初始数据
  */
  getInitialDataTest: function (indexData, stateParameter) {
    var self = this;
    var test = self.data.initialData;
    var testOne = [];
    for (var index in test) {
      if (indexData == index) {
         var id = test[index].couponId;
        // 获取卡门店
        this.getInitialData(id, indexData);
      } 
    }
  },
  /**
   * 获取优惠券适用门店(快照)
   */
  getInitialData: function (id, indexData) {
    var self = this;
    self.showLoading();
    wx.request({
       url: app.globalData.path + 'rest/RzReissueCoupon/applyStoreForCoupon',
      method: 'GET',
      data: {
         couponId:id
      },
      success: function (res) {
        //console.log("我的优惠券---获取优惠券适用门店(快照)");
        //console.log(res.data);
        // 后台正常返回

            // 适用门店字符串拼接
            var neirong1 = "";
            var neirong2 = ""; 
            if (res.data.briefInfoDto.partStoreLst != null){
              
              for (var index in res.data.briefInfoDto.partStoreLst){
                var a = res.data.briefInfoDto.partStoreLst[index].storeName;
                if (index == res.data.briefInfoDto.partStoreLst.length - 1){
                  neirong1 = neirong1 + a ;
              }else{
                  neirong1 = neirong1 + a + "、";
                } 
              }
            }
            if (res.data.briefInfoDto.briefInfoLst != null) {
              
              for (var index in res.data.briefInfoDto.briefInfoLst) {
                var a = res.data.briefInfoDto.briefInfoLst[index];
                if (index == res.data.briefInfoDto.briefInfoLst.length - 1) {
                  neirong2 = neirong2 + a;
                } else {
                  neirong2 = neirong2 + a + "、";
                }
              }
            }
            var mendian = "";
            if (neirong2 == ""){
              if (neirong1 == ""){
                mendian=""
              }else{
                mendian = neirong1;
              } 
            }else{
              if (neirong1 == ""){
                mendian = neirong2;
              }else{
                mendian = neirong2 + "、" + neirong1;
              }         
            }   
            //console.log(mendian);
          self.getCommodity(id, indexData, mendian);
          // self.hideLoading();
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
  /**
   * 获取优惠券适用商品(快照)
   */
  getCommodity: function (id, indexData, mendian) {
    var self = this;
    wx.request({
      url: app.globalData.path + 'rest/RzReissueCoupon/applyCommodityForCoupon',
      method: 'GET',
      data: {
          couponId:id
      },
      success: function (res) {
        //console.log("我的优惠券页---获取优惠券适用商品(快照)");
        //console.log(res);
        // 后台正常返回
  
          var test = self.data.initialData;
          //console.log(indexData);
          var shangpin = "";
          if (res.data.projectLst != null){
             shangpin = res.data.projectLst[0];
          }
          var tempOne = "initialData[" + indexData + "].shangpin";
          var tempTwo = "initialData[" + indexData + "].mendian";
          var showOrhide = "initialData[" + indexData+"].showOrhide";
          var weui = "initialData[" + indexData + "].weui";
          // var tempThree = "initialData[" + indexData + "].periodValidity";
          // var tempFour = "initialData[" + indexData + "].periodValidity1";
          for (var index in test){
            if (indexData == index) {
              if (test[index].showOrhide == self.data.hideBottom) {
                var showOrhideTest = self.data.showBottom;
                var weuiTest = "weui-cell__ft_bak";
              } else if (test[index].showOrhide == self.data.showBottom) {
                var showOrhideTest= self.data.hideBottom;
                var weuiTest = "weui-cell__ft";
              }
            }
          }   
          self.setData({
            [tempOne]: shangpin,
            [tempTwo]: mendian,
            [showOrhide]: showOrhideTest,
            [weui]: weuiTest,
            // [tempThree]: tempThree,
            // [tempFour]: tempFour,
          });
          //console.log(self.data.initialData);
          // var testOne = [];
          // for (var index in test) {
          //   if (indexData == index) {
          //     var testList = {};
          //     testList.periodValidity = test[index].periodValidity;
          //     testList.couponId = test[index].couponId;
          //     testList.mendian = mendian;
          //     if (res.data.cardLst != null){
          //       var shangpin = res.data.cardLst[0];
          //       testList.shangpin = shangpin;
          //       // testList.shangpin = res.data.briefInfoDto.partStoreLst[0].storeName;
          //     }             
          //     if (test[index].showOrhide == self.data.hideBottom) {
          //       testList.showOrhide = self.data.showBottom;
          //       self.setData({
          //         weui: "weui-cell__ft_bak",
          //       });
          //     } else if (test[index].showOrhide == self.data.showBottom) {
          //       testList.showOrhide = self.data.hideBottom;
          //       self.setData({
          //         weui: "weui-cell__ft",
          //       });
          //     }
          //     testOne.push(testList);
          //   } else {
          //     var testList = {};
          //     testList.periodValidity = test[index].periodValidity;
          //     testList.couponId = test[index].couponId;
          //     testList.showOrhide = test[index].showOrhide;
          //     testList.mendian = mendian;
          //     if (res.data.cardLst != null) {
          //       testList.shangpin = res.data.cardLst[0];
          //       // testList.shangpin = res.data.briefInfoDto.partStoreLst[0].storeName;
          //     }  
          //     testOne.push(testList);
          //   }
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
  },

  gotoMinePage: function () {
    wx.switchTab({
      url: "/pages/mine/mine",
    })
  },
})