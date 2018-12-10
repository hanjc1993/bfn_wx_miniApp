// pages/preferentialitem/preferentialitem.js
var login = require("../../utils/login.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sho:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
     login.checkInitAgree(self, function(){
    self.doInit();
    });
    },
    doInit: function () {
      var self = this;

      // 获取活动列表
      self.getAct()
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

  getAct: function () {
    var self = this;
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/RzAct/getAct?actStatus=1',
      method: 'GET',
      data: {},
      success: function (res) {
        console.log(res);
        console.log(res.data)
        // 后台正常返回
        if (res.statusCode == 200) {
          if (res.data.length!=0){
          var ActList = res.data;
          var newActList = [];
          for (var i = 0; i < ActList.length; i++) {
            //图片显示地址
            // ActList[i].themeImg = app.globalData.path + ActList[i].themeImg;
            //改变时间戳
            if (ActList[i].actXcxDisplay == 1){
              var tim = self.showEvaluateSTime(ActList[i].updateTime);
              ActList[i].updateTime = tim;
              newActList.push(ActList[i]);
            }
          }
          if (newActList.length != 0){
            self.setData({
              sho: true
            })
          } else {
            self.setData({
              sho: false
            })
          }
          self.setData({
            ActList: newActList
          })
          }else{
            self.setData({
              sho: false
            })
          }
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
  },
  goPreferentialDetailPage(e) {
    console.log(e)
    var actId = e.currentTarget.dataset.actid;
    //var actName = e.currentTarget.dataset.actName;
    //var actStart = e.currentTarget.dataset.actStart;
    var nikename = this.data.nikename;
    wx.navigateTo({
      url: "../preferentialDetail/preferentialDetail?actId=" + actId, //,
    })
  },
  // 改变时间戳
  showEvaluateSTime(num) {
    var n = num;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) ;

    return (Y + M + D )
  },
})