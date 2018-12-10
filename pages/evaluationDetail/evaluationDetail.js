// pages/evaluationDetail/evaluationDetail.js
//获取应用实例
const app = getApp();
var login = require("../../utils/login.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFolded: true,
    sho: true,
    //默认隐藏加载
    hiddenLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self =this;
    var nurseId = options.nurseId;
    self.setData({
      nurseId: nurseId
    })

    login.checkInitAgree(self, function(){
    self.doInit();
    });
  },
  doInit: function () {
    var self = this;
    // 获取评论信息
    self.getNurseEvaluate()
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

  //显示加载logo
  showLoading: function () {
    this.setData({
      hiddenLoading: false
    })
  },
  //隐藏加载logo
  hideLoading: function () {
    this.setData({
      hiddenLoading: true
    })
  },

  //评论接口
  getNurseEvaluate: function () {
    console.log("12313123");
    var self = this;
    self.showLoading();
    
    var eList = []
    var nurseId = self.data.nurseId
    wx.request({
      url: app.globalData.path + 'rest/RzEvaluateRest/getNurseEvaluateLst',
      method: 'GET',
      data: {
        nurseId: nurseId
      },
      success: function (res) {

        if (res.data.statusCode = 200) {
          var evaluateList = res.data;   
          console.log(evaluateList)       
          if (evaluateList.length != 0) {
            // for (var index in evaluateList) {
            //   evaluateList[index].isFolded = true
            // }
          
          for (var i = 0; i < evaluateList.length; i++) {
            evaluateList[i].isFolded = true
            //显示星级
            self.showEvaluateStar(evaluateList[i].evaluateScore);
            evaluateList[i].evaluateStarList = self.data.evaluateStarList;
            //改变时间戳
            var tim = self.getDateDiff(evaluateList[i].evaluateTime);
            evaluateList[i].evaluateTime = tim;
            //名字长度限制
            if (evaluateList[i].userName != null && evaluateList[i].userName.length>2){          
              var nameLenght = evaluateList[i].userName.length
              evaluateList[i].userName = evaluateList[i].userName.charAt(0) + '****' + evaluateList[i].userName.charAt(nameLenght-1) ;
            } else if (evaluateList[i].userName != null && evaluateList[i].userName.length <= 2){
              evaluateList[i].userName = evaluateList[i].userName.charAt(0) + '****'
            }
            //评价内容
            if (evaluateList[i].evaluateContent == null) {
              evaluateList[i].evaluateContent = ' '
            }
            //是否显示全文按钮
            if (evaluateList[i].evaluateContent != null&&evaluateList[i].evaluateContent.length>70){
              evaluateList[i].isShowBtn = true
            }else{
              evaluateList[i].isShowBtn = false
            }
          }  
             
            self.setData({
              evaluateList: evaluateList,
              sho: true
            })    
          }else{
            self.setData({
              sho: false
            })
          }
        } else {
          self.hideLoading();
          wx.showModal({
            title: "请求超时",
            content: "系统繁忙，请稍后重试！",
            showCancel: false,
            confirmColor: '#fbb059',
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
 * 显示星级
 */
  showEvaluateStar(evaluateStar) {

    var self = this;
    var evaluateStarList = [];

    if (evaluateStar >= 5) {
      self.setData({
        evaluateStar: 5
      })
    }
    if (evaluateStar <= 0) {
      self.setData({
        evaluateStar: 0
      })
    }
    var evaluateStarS = evaluateStar;

    var noneStars = 5 - evaluateStarS;
    for (var i = 0; i < evaluateStarS; i++) {
      evaluateStarList.push(true);
    }
    if (evaluateStarS != 5) {
      for (var i = 0; i < noneStars; i++) {
        evaluateStarList.push(false);
      }
    }
    self.setData({
      evaluateStarList: evaluateStarList
    })

  },
  // // 改变时间戳
  // showEvaluateSTime(num) {
  //   var n = num;
  //   var date = new Date(n);
  //   var Y = date.getFullYear() + '-';
  //   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  //   var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  //   var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  //   var S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  //   return (Y + M + D + H + S)
  // },

  //几天前，几小时前，几分钟前
  getDateDiff(dateTimeStamp) {
    var result;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
      if (monthC <= 12)
        result = "" + parseInt(monthC) + "月前";
      else {
        result = "" + parseInt(monthC / 12) + "年前";
      }
    }
    else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else {
      result = "刚刚";
    }

    return result;
  },
  change: function (e) {
    var temp = "evaluateList["+e.currentTarget.dataset.index+"].isFolded"
    console.log(e)
    console.log(e.currentTarget.dataset.index)
    if (this.data.evaluateList[e.currentTarget.dataset.index].isFolded == true){
      this.setData({
        [temp]: false,
      })
    }else{
      this.setData({
        [temp]: true,
      })
    }
    
    console.log(this.data.evaluateList)
  }
})