// pages/consumptionRecords/consumptionRecords.js
//获取应用实例
const app = getApp();
var login = require("../../utils/login.js");
var dateTimePicker = require("../../utils/dateTimePicker.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    // 加载中
    hiddenLoading: true,
    // 开始坐标
    startX: 0, 
    startY: 0,

    noData: false,
    backButton: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    if (options.source == 1) {
      self.setData({
        backButton: true
      });
    } else {
      self.setData({
        backButton: false
      });
    }
    // for (var i = 0; i < 10; i++) {
    //   self.data.items.push({
    //     content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
    //     // 默认隐藏删除
    //     isTouchMove: false 
    //   });
    // }

    login.checkInitAgree(self, function () {
      self.doInit();
    });
  },

  doInit: function () {
    var self = this;

    // 消费记录详细
    self.queryConsumptionRecords();
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

  // 手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    var self = this;
    // 开始触摸时 重置所有删除
    self.data.items.forEach(function (v, i) {
      if (v.isTouchMove) {
        // 只操作为true的
        v.isTouchMove = false;
      }
    });

    self.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: self.data.items
    });
  },

  // 滑动事件处理
  touchmove: function (e) {
    var self = this,
    // 当前索引
    index = e.currentTarget.dataset.index,
    // 开始X坐标
    startX = self.data.startX,
    // 开始Y坐标
    startY = self.data.startY,
    // 滑动变化坐标
    touchMoveX = e.changedTouches[0].clientX,
    // 滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,
 
    // 获取滑动角度
    angle = self.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });

    self.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      // 滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) {
          //右滑
          v.isTouchMove = false
        } else {
          //左滑
          v.isTouchMove = true
        } 
      }
    });

    //更新数据
    self.setData({
      items: self.data.items
    });
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
    _Y = end.Y - start.Y
    // 返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 删除事件
  del: function (e) {
    var self = this;
    self.data.items.splice(e.currentTarget.dataset.index, 1)
    self.setData({
      items: self.data.items
    });
    // 消费记录删除
    self.delConsumptionRecords(e.currentTarget.dataset.item);
  },

  // 消费记录详情
  chooseConsumptionRecords: function (e) {
    var code = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../pages/consumptionRecordsDetail/consumptionRecordsDetail?code=' + code,
    })
  },
  
  /**
   * 消费记录详细
   */
  queryConsumptionRecords: function () {
    var self = this;
    self.showLoading();
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/getPurchaseRecord',
      method: 'GET',
      data: {
        vipNo: app.globalData.vipNo,
      },
      success: function (res) {
        console.log(res);
        if (res.data.length > 0){
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].insertTime = dateTimePicker.formatTime(res.data[i].insertTime, "Y-M-D h:m");
          }
          self.setData({
            items: res.data,
          });
        } else {
          self.setData({
            noData: true,
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

  /**
   * 消费记录取消
   */
  delConsumptionRecords: function (id) {
    var self = this;
    // self.showLoading();
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/delPurchaseRecord',
      method: 'GET',
      data: {
        id: id,
      },
      success: function (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
        // self.hideLoading();
      },
      fail: function (err) {
        // self.hideLoading();
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

  gotoMinePage: function () {
    wx.switchTab({
      url: "/pages/mine/mine",
    })
  },
})