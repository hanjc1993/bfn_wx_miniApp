// pages/consumptionRecordsDetail/consumptionRecordsDetail.js
//获取应用实例
var app = getApp();
var login = require("../../utils/login.js");
var dateTimePicker = require("../../utils/dateTimePicker.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //店铺建议开关
    suggestionStatus:false,
    //评价开关
    evaluateStatus:false,
    // 加载中
    hiddenLoading: true,
    // 消费记录详细
    consumptionRecords: {},
    // 划卡明细
    cardDetial: [],
    // 购买明细
    buyDetial: [],
    // 购买明细数量
    buyDetialSum: '',
    // 购买明细价格
    buyDetialPrice: 0,
    // 订单编码
    orderNum: '',
    // 评价星级
    evaluateScore: '',
    // 评价内容
    evaluateContent: '',
    // 评价标签
    evaluateSettingSignIdLst: [],
    // 养脑师图片
    nurseImgUrl: '',
    // 养脑师名称
    nurseName: '',
    // 显示评价弹窗
    isShowEvaluation: false,

    // 星级（1-5）
    stars1: false,
    stars2: false,
    stars3: false,
    stars4: false,
    stars5: false,

    // 评价成功弹窗
    hiddenModal: true,

    // 显示评价内容弹窗
    isShowEvaluationContent: false,

    // 显示评价内容
    showEvaluationContent: [],

    // 评价内容
    evaluationContent: '',

    // 匿名提交按钮
    anonymousSubmissionsBtn: false,

    // 是否评价完成
    evaluateComplete1: true,
    evaluateComplete2: false,

    // 评价提示语
    evaluateDis: '',
    // 实付金额
    payAmount: '',
    // 零售金额
    retailPrice: '',
    showPage: false,
    backButton: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("来评价")
    var self = this;
    self.showLoading();
    if (options.source == 1) {
      self.setData({
        backButton: true
      });
    } else {
      self.setData({
        backButton: false
      });
    }
    if (options.code != undefined) {
      // 订单编号
      self.setData({
        orderNum: options.code,
      });
    }
    login.checkInitAgree(self, function () {
      self.doInit();
    });
  },

  doInit: function () {
    var self = this;

    // 是否评价完成
    self.evaluateComplete();
    // 消费记录详细
    self.queryConsumptionRecords();
    //评价开关
    self.evalationSwitch();
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

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {

  },

  /**
   * 显示评价弹窗
   */
  openEvaluation: function () {
    this.setData({
      isShowEvaluation: true,
    });
  },
  // 评价按钮开关
  evalationSwitch:function(){
    var self = this
    wx.request({
      url: app.globalData.path + 'rest/RzEvaluateSettingRest/getEvaluateSettingDetail',
      success:function(res){
        console.log("评价开关")
        console.log(res)
        self.setData({
          evaluateStatus: res.data.evaluateStatus,
          suggestionStatus: res.data.suggestionStatus
        })
      },
      fail:function(err){
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
          confirmColor: '#fbb059',
        });
      }
    })
  },
  /**
   * 关闭评价弹窗
   */
  closeEvaluation: function () {
    this.setData({
      isShowEvaluation: false,
      stars1: false,
      stars2: false,
      stars3: false,
      stars4: false,
      stars5: false,
      showEvaluationContent:[],
      // 显示评价内容弹窗
      isShowEvaluationContent: false,
      // 匿名提交按钮
      anonymousSubmissionsBtn: false,
    });
  },

  /**
   * 星级
   */
  stars: function (e) {
    var self = this;
    self.setData({
      stars1: false,
      stars2: false,
      stars3: false,
      stars4: false,
      stars5: false,
    });

    for (var i = 1; i < Number(e.currentTarget.dataset.item) + 1; i++) {
      var temp = "stars" + i;
      self.setData({
        [temp]: true,
        // 显示评价内容弹窗
        isShowEvaluationContent: true,
        // 匿名提交按钮
        anonymousSubmissionsBtn: true,
      });
    }
  
    // 评价星级
    self.setData({
      evaluateScore: e.currentTarget.dataset.item,
    });

    // 获取评价内容
    self.evaluateStars(e.currentTarget.dataset.item);
  },

  /**
   * 选择评价
   */
  chooseComments: function (e) {
    var self = this;
    self.data.evaluateSettingSignIdLst = [];

    // 评价标签
    if (self.data.showEvaluationContent[e.currentTarget.dataset.index].ContentStatus == false) {
      self.data.showEvaluationContent[e.currentTarget.dataset.index].ContentStatus = true;
    } else {
      self.data.showEvaluationContent[e.currentTarget.dataset.index].ContentStatus = false;
    }

    for (var i = 0; i < self.data.showEvaluationContent.length; i++) {
      if (self.data.showEvaluationContent[i].ContentStatus == true) {
        self.data.evaluateSettingSignIdLst.push(self.data.showEvaluationContent[i].id);
      }
    }

    self.setData({
      // 显示评价内容
      showEvaluationContent: self.data.showEvaluationContent,
    });
  },

  /**
   * 评价内容
   */
  bindTextAreaBlur: function (e) {
    var self = this;
    self.setData({
      evaluateContent: e.detail.value,
    });
  },

  /**
   * 匿名评价
   */
  anonymousSubmissions: function () {
    var self = this;

    var param = {
      // 订单编码
      orderNum: self.data.orderNum,
      // 评价星级
      evaluateScore: self.data.evaluateScore,
      // 评价内容
      evaluateContent: self.data.evaluateContent,
      // 评价标签
      evaluateSettingSignIdLst: self.data.evaluateSettingSignIdLst,
    };
    //console.log(param);
    if (self.data.anonymousSubmissionsBtn == false) {
    } else {
      var self = this;
      // 发起网络请求 获取套餐信息
      wx.request({
        url: app.globalData.path + 'rest/RzEvaluateRest/saveUpdateEvaluate',
        method: 'POST',
        data: JSON.stringify(param),
        success: function (res) {
          //console.log(res);
          self.evaluateComplete();
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
      wx.showModal({
        title: '',
        content: '评价成功，感谢您的支持！',
        confirmColor: '#fbb059',
        showCancel:false,
        confirmText:'知道啦'
      })
      this.setData({
        //hiddenModal: false,
        isShowEvaluation: false,
      });
    }
  },

  /**
   * 评价完成
   */
  // modalConfirm: function () {
  //   this.setData({
  //     hiddenModal: true,
  //   });
  // },

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
        //console.log("********************")
        //console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          if (self.data.orderNum == res.data[i].code){
            self.data.consumptionRecords = res.data[i];
            self.setData({
              payAmount: res.data[i].payAmount,
              retailPrice: res.data[i].retailPrice
            });
            self.data.consumptionRecords.insertTime = dateTimePicker.formatTime(self.data.consumptionRecords.insertTime, "Y-M-D");
            // self.data.buyDetialPrice = self.data.consumptionRecords.bcList[j].retailPrice;
            for (var j = 0; j < self.data.consumptionRecords.bcList.length; j++) {
              if (self.data.consumptionRecords.bcList[j].isDraw == true) {
                // 划卡明细
                self.data.cardDetial.push(self.data.consumptionRecords.bcList[j]);
                if (self.data.consumptionRecords.bcList[j].comName.length >= 8) {
                  self.data.consumptionRecords.bcList[j].comName = self.data.consumptionRecords.bcList[j].comName.substring(0, 10) + '..'
                }
                var category = self.data.consumptionRecords.bcList[j].categoryName;
                var subCategory = self.data.consumptionRecords.bcList[j].subCategoryName;
                var categorySubCategory = "";
                if (category == "" || category == null) {
                  if (category == "" || category == null) {
                    categorySubCategory = "";
                  } else {
                    categorySubCategory = subCategory;
                  }
                } else {
                  if (category == "" || category == null) {
                    categorySubCategory = category
                  } else {
                    categorySubCategory = category + "，" + subCategory;
                  }
                }
                self.data.consumptionRecords.bcList[j].categorySubCategory = categorySubCategory;
                if (self.data.consumptionRecords.bcList[j].gifts == false){
                  self.setData({
                    nurseImgUrl: self.data.consumptionRecords.bcList[j].nurseImgUrl,
                    // 养脑师名称
                    nurseName: self.data.consumptionRecords.bcList[j].staffName,
                  });
                }
              } else {
                // 购买明细
                self.data.buyDetial.push(self.data.consumptionRecords.bcList[j]);
                // self.data.buyDetialPrice += self.data.consumptionRecords.bcList[j].retailPrice;
                if (self.data.consumptionRecords.bcList[j].comName.length >= 8) {
                  self.data.consumptionRecords.bcList[j].comName = self.data.consumptionRecords.bcList[j].comName.substring(0, 10) + '..'
                }
                var category = self.data.consumptionRecords.bcList[j].categoryName;
                var subCategory = self.data.consumptionRecords.bcList[j].subCategoryName;
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
                self.data.consumptionRecords.bcList[j].categorySubCategory = categorySubCategory;
                if (self.data.consumptionRecords.bcList[j].gifts == false) {
                  self.setData({
                    nurseImgUrl: self.data.consumptionRecords.bcList[j].nurseImgUrl,
                    // 养脑师名称
                    nurseName: self.data.consumptionRecords.bcList[j].staffName,
                  });
                }
              }
            }

            // 购买明细数量
            self.data.buyDetialSum = self.data.cardDetial.length + self.data.buyDetial.length,

            self.setData({
              consumptionRecords: self.data.consumptionRecords,
              cardDetial: self.data.cardDetial,
              buyDetial: self.data.buyDetial,
              buyDetialSum: self.data.buyDetialSum,
              buyDetialPrice: self.data.buyDetialPrice,
              showPage: true
            });
          }
        }

        self.hideLoading();
      },
      fail: function (err) {
        self.setData({
          showPage: true
        });
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
   * 评价星级
   */
  evaluateStars: function (evaluateScore) {
    var self = this;

    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/RzEvaluateRest/displayEvaluateSettingSign',
      method: 'GET',
      data: {
        evaluateScore: evaluateScore,
      },
      success: function (res) {
        //console.log(res);
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].ContentStatus = false;
        }

        self.setData({
          showEvaluationContent: res.data,
          // 评价提示语
          evaluateDis: res.data[0].evaluateDis,
        });
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

  /**
   * 是否已经评价
   */
  evaluateComplete: function () {
    var self = this;
    //console.log(self.data.orderNum);
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/RzEvaluateRest/searchEvaluateByOrderNum',
      method: 'GET',
      data: {
        orderNum: self.data.orderNum,
      },
      success: function (res) {
        if (res.data.length > 0) {
          console.log("已经评价过了")
          self.setData({
            evaluateComplete1: false,
            evaluateComplete2: true
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
  gotoMinePage: function () {
    wx.switchTab({
      url: "/pages/mine/mine",
    })
  },
})