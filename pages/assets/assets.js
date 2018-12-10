// pages/assets/assets.js
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
    
    initialDataOne: [],
    initialDataTwo: [],
    initialDataAll: [],

    name: [],
    cardId:"",

    cardName:"",
    showPage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    // 判断网络状态
     login.checkInitAgree(self, function () {
       self.doInit(options);
     });
  },
  doInit: function (options) {
    var self = this;
    self.data.cardId = options.cardId;
    //console.log(options.cardId);
    self.setData({
      cardName: options.cardName,
    });
    self.getInitialData();
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
    self.setData({
      showPage: false,
    });
    self.showLoading();
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
   * 获取页面数据
   */
  getInitialData: function () {
    var self = this;
    self.showLoading();
    //console.log("cardId = " + self.data.cardId);
    // 发起网络请求 获取门店列表
    wx.request({
      url: app.globalData.path + 'rest/transmission/getCardStore',
      method: 'GET',
      data: {
        // vipNo: "SYHY000003558",
        // cardId:"141"
        cardId: self.data.cardId
      },
      success: function (res) {
        //console.log("我的卡适用门店列表");
        //console.log(res);
        // 后台正常返回
        if (res.statusCode == 200) {
          var LevelOne = res.data.csDto.partStoreLst;
          var LevelTwo = res.data.applyStoreDtoLst;
          var nameList = [];
          var LevelAll = [];

          if (res.data.applyStoreDtoLst != null) {
            for (var index in LevelOne) {
              var LevelAllList = {};
              nameList.push(LevelOne[index].cityName);
              LevelAllList.storeName = LevelOne[index].storeName;
              LevelAllList.storeAddr = LevelOne[index].storeAddr;
              LevelAllList.storePhone = LevelOne[index].storePhone;
              LevelAllList.cityName = LevelOne[index].cityName;
              LevelAll.push(LevelAllList);
            }
          }
          if (res.data.csDto.partStoreLst != null) {
            for (var index in LevelTwo) {
              var LevelAllList = {};
              nameList.push(LevelTwo[index].cityName)
              LevelAllList.storeName = LevelTwo[index].storeName;
              LevelAllList.storeAddr = LevelTwo[index].storeAddr;
              LevelAllList.storePhone = LevelTwo[index].storePhone;
              LevelAllList.cityName = LevelTwo[index].cityName;
              LevelAll.push(LevelAllList);
            }
          }       
          self.setData({
            initialDataOne: LevelOne,
            initialDataTwo: LevelTwo,
          });
          
          self.distinct(nameList, LevelAll);
          self.hideLoading();
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
        self.setData({
          showPage: true,
        });
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
* 去重方法(城市名字去重)
*/
  distinct: function (nameList, LevelAll) {
    var self = this;
    var arr = nameList,
      result = [],
      i,
      j,
      len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i] === arr[j]) {
          j = ++i;
        }
      }
      result.push(arr[i]);
    }
    self.setData({ name: result });
    // 数据整合
    self.getDataIntegration(LevelAll, result);
  },
  /**
   * 数据整合
   */
  getDataIntegration: function (LevelAll, nameListNew) {
    var self = this;
    var LevelAll = LevelAll;
    var nameListNew = nameListNew;
    var LevelNew = [];
    for (var index in nameListNew) {
      var Level = {};
      var LevelAllNew = [];
      var LevelAllNewTest = [];
      for (var a = 0; a < LevelAll.length; a++) {
        if (nameListNew[index] == LevelAll[a].cityName) {

          var LevelAllNewList = {};
          LevelAllNewList.cityName = LevelAll[a].cityName;
          LevelAllNewList.storeAddr = LevelAll[a].storeAddr;
          LevelAllNewList.storeName = LevelAll[a].storeName;
          LevelAllNewList.storePhone = LevelAll[a].storePhone;
          LevelAllNewTest.push(LevelAllNewList);
        }
      }
      // Level.a = "../../images/coupons_gz.png";
      Level.a = nameListNew[index];
      Level.b = LevelAllNewTest;
      LevelNew.push(Level);
    }

    //console.log(LevelNew);
    self.setData({
      initialDataAll: LevelNew,
      showPage: true,
    })
  },
})