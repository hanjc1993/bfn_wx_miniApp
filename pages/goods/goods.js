// pages/goods/goods.js
const app = getApp();
var login = require("../../utils/login.js");
var count;
var countCard;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['项目', '卡项', '产品'],
    currentTab: 2,
    navbarProject: ['招牌项目', '舒缓疲劳', '健体助眠', '抗老养颜'],
    currentTabProject: 0,
    navbarCarditem: ['套餐卡', '储金卡'],
    currentTabCarditem: 0,
    navbarProduct: ['洗漱用品', '门店小物'],
    currentTabProduct: 0,
    // 项目部分数据
    initialData: [],
    inputVal: "",
    projectName: [],// 项目名称
    showView: "",
    showViewBottom: false,
    // 卡项部分数据
    initialDataCard: [],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    console.log(self.data.currentTab);
    self.getInitialData();
    // 判断网络状态
    // login.checkInitAgree(self, function () {
    //   self.doInit();
    // });
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
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  navbarProject: function (e) {
    this.setData({
      currentTabProject: e.currentTarget.dataset.idx
    })
  },
  navbarCarditem: function (e) {
    this.setData({
      currentTabCarditem: e.currentTarget.dataset.idx
    })
  },
  navbarProduct: function (e) {
    this.setData({
      currentTabProduct: e.currentTarget.dataset.idx
    })
  },
  doInit: function () {
    var self = this;
    self.getInitialData();
  },
  /**
   * 获取页面数据
   */
  getInitialData: function () {
    var self = this;
    // 项目数据
    var initialDataTest = [{
      title: "脑补养护",
      price: "298",
      time: "13:00",
      minutes: "90",
      showView: true,
    }, {
      title: "111",
      price: "198",
      time: "13:00",
      minutes: "90",
      showView: true,
    }, {
      title: "222",
      price: "298",
      time: "13:00",
      minutes: "90",
      showView: true,
    }, {
      title: "333",
      price: "298",
      time: "13:00",
      minutes: "90",
      showView: true,
    }, {
      title: "444",
      price: "298",
      time: "13:00",
      minutes: "90",
      showView: true,
    }, {
      title: "naonaonao",
      price: "298",
      time: "13:00",
      minutes: "90",
      showView: true,
    }];
    // 卡项数据
    var initialDataCard = [{
      title: "脑补",
      nursingTime: "90",
      nursingCount: "28",
      category: "减压按摩",
      periodValidity:"3",
      showView: true,
    }, {
      title: "111",
      nursingTime: "90",
      nursingCount: "28",
      category: "减压按摩",
      periodValidity: "3",
      showView: true,
    }, {
      title: "222",
      nursingTime: "90",
      nursingCount: "28",
      category: "减压按摩",
      periodValidity: "3",
      showView: true,
    }, {
      title: "333",
      nursingTime: "90",
      nursingCount: "28",
      category: "减压按摩",
      periodValidity: "3",
      showView: true,
    }, {
      title: "444",
      nursingTime: "90",
      nursingCount: "28",
      category: "减压按摩",
      periodValidity: "3",
      showView: true,
    }, {
      title: "naonaonao",
      nursingTime: "90",
      nursingCount: "28",
      category: "减压按摩",
      periodValidity: "3",
      showView: true,
    }];
    for (var index in initialDataTest) {
      var title = initialDataTest[index].title;
      self.data.projectName.push(title);
    }
    self.setData({
      initialData: initialDataTest,
      initialDataCard: initialDataCard,
    });
  },
  /**
   * 搜索逻辑
   */
  inputTyping: function (e) {
    count = 0;
    var self = this;
    var initialDataTest = [];
    var name = e.detail.value;
    if (name != "") {
      if (this.data.currentTab == 0) {
        for (var index in self.data.initialData) {
          var initialDataList = {};
          initialDataList.title = self.data.initialData[index].title;
          initialDataList.nursingTime = self.data.initialData[index].nursingTime;
          initialDataList.nursingCount = self.data.initialData[index].nursingCount;
          initialDataList.category = self.data.initialData[index].category;
          initialDataList.periodValidity = self.data.initialData[index].periodValidity;
          if (name == self.data.initialData[index].title) {
            initialDataList.showView = true;
            count++;
          } else {
            initialDataList.showView = false;
          }
          initialDataTest.push(initialDataList);
        }
        self.setData({
          initialData: initialDataTest,
          inputVal: e.detail.value,
        });
      } else if (this.data.currentTab == 1){
        for (var index in self.data.initialDataCard) {
          var initialDataList = {};
          initialDataList.title = self.data.initialDataCard[index].title;
          initialDataList.price = self.data.initialDataCard[index].price;
          initialDataList.time = self.data.initialDataCard[index].time;
          initialDataList.minutes = self.data.initialDataCard[index].minutes;
          if (name == self.data.initialDataCard[index].title) {
            initialDataList.showView = true;
            count++;
          } else {
            initialDataList.showView = false;
          }
          initialDataTest.push(initialDataList);
        }
        self.setData({
          initialDataCard: initialDataTest,
          inputVal: e.detail.value,
        });
      }    
      if (count == 0) {
        self.setData({
          showViewBottom: true,
        });
      } else {
        self.setData({
          showViewBottom: false,
        });
      }
    } else {
      self.setData({
        showViewBottom: false,
      });
      self.onLoad();
    }
  },
})