// pages/projectDetail/projectDetail.js
//获取应用实例
const app = getApp()
var login = require("../../utils/login.js");
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
  * 页面的初始数据
  */
  data: {
    // 加载中
    hiddenLoading: true,
    name:"",
    projectName: '',
    picDes: '',
    projectPic: '',
    projectCode:"",
    simpleDes:"",
    nursingTime:"",

    categorySubCategory:"",
    // 跳转到外网网址
    jumpToOtherWeb: '',
    // 显示页面
    showPage: false,
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var self = this;
    // self.setData({
    //   jumpToOtherWeb: 'https://www.bufannao.cn/wx/#/goodDetail?pCode=' + options.uuid + '&type=0' //options.jumpToOtherWeb,
    // });
    var self = this;
    console.log(options);
    self.data.projectCode = options.uuid;
    self.data.nursingTime = options.nursingTime;
    self.data.name = options.name;

    self.setData({
      nursingTime: options.nursingTime,
      categorySubCategory: options.categorySubCategory,
    })
    // 判断网络状态
    login.checkInitAgree(self, function () {
      self.doInit();
    });
  },
  doInit: function () {
    var self = this;
    self.getDetail();
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
  yoyakuNow: function (e) {
    var pId = this.data.projectCode;
    var pName = this.data.name
    wx.navigateTo({
      url: '../../pages/order/order?incloudProjectCode=' + pId + '&incloudProjectName=' + pName + '&v=' + 1,
    })
  },
  /**
  * get项目详细 调用接口
  */
  getDetail: function () {
    var self = this
    self.showLoading();
    console.log(self.data.projectCode);
    wx.request({
      url: app.globalData.path + 'rest/transmission/getCommodityInfo',
      method: 'GET',
      data: {
        // accessToken: "YwdkT0oCVWABZgYCBVBiAWUDbwS6V367g",
        projectCode: self.data.projectCode,
        // projectCode: "PRJ001478",
      },
      success: function (res) {
        console.log("项目详情")
        console.log(res.data)
        var initialization = res.data.projectDto;
        var name = res.data.projectDto.projectName
        if (name.length > 9) {
          name = name.substring(0, 9) + '..'
        }
        self.setData({
          projectName: name,
          simpleDes: res.data.projectDto.simpleDes,
          projectPic: res.data.projectDto.projectPic,
        });
        WxParse.wxParse('insertData', 'html', res.data.projectDto.picDes.replace(/src="/g, 'src="' + res.data.imgHead), self);
        console.log(res.data.projectDto.picDes);
        self.hideLoading();
        self.setData({
          showPage: true,
        })
      },
      fail: function (err) {
        self.hideLoading();
        self.setData({
          showPage: true,
        })
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
    })
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

  convertHtmlToText: function convertHtmlToText(inputText) {
    var returnText = "" + inputText;

    returnText = returnText.replace('<img', '<image');
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, '  *  ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    // returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g, '');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace('</p>', '');
    returnText = returnText.replace(/ /gi, " ");
    returnText = returnText.replace(/&/gi, "&");
    returnText = returnText.replace(/"/gi, '"');
    returnText = returnText.replace(/</gi, '<');
    returnText = returnText.replace(/>/gi, '>');

    return returnText;
  },
})