// pages/project/project.js
const app = getApp();
var login = require("../../utils/login.js");
var count;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 加载中
    hiddenLoading: true,

    // navbar: ['招牌项目', '舒缓疲劳', '健体助眠', '抗老养颜'],
    navbar:[],
    currentTab: 0,
    initialData:[],
    initialDataAll: [],
    inputVal:"",
    projectName: [],// 项目名称
    showView:"",
    showViewBottom:false,
    projectTab:[],

    uuid:"",
    name:"",
    timeLength:"",
    retailPrice:"",
    scheduledTime:"",

    storeCode:"",

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
    self.data.storeCode = options.storeCode;
    console.log(options.storeCode);
    // 判断网络状态
     login.checkInitAgree(self, function () {
       self.doInit();
     });
  },
  doInit: function () {
    var self = this;
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
   * tab切换事件
   */
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    this.getInitializationTab();
  },
  /**
   * 获取页面所有数据以及初始化页面数据
   */
  getInitialData: function(){
    var self = this;
    self.showLoading();
    // 发起网络请求 获取所有项目信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/getProgramList',
      method: 'GET',
      data: {
        //  storeCode: "SY00151"
        storeCode: self.data.storeCode
      },
      success: function (res) {
        console.log("项目列表页");
        console.log(res);
        // 后台正常返回
        if (res.data.length != 0) {
          // 所有数据获得
          var tab = [];
          var projectTest = [];
          for (var index in res.data){
             var projectList = {};
             projectList.imgUrl = res.data[index].imgUrl;
            if (res.data[index].name.length > 9) {
              res.data[index].name = res.data[index].name.substring(0, 10) + '..'
            }
             projectList.name = res.data[index].name;
             projectList.projectEfficacyClass = res.data[index].projectEfficacyClass;
            // projectList.reservationAvailableTime = res.data[index].reservationAvailableTime;
             projectList.nursingTime = res.data[index].nursingTime;
             projectList.uuid = res.data[index].uuid;
             projectList.retailPrice = res.data[index].retailPrice;
             projectList.showView = true;

             var category = res.data[index].category;
             var subCategory = res.data[index].subCategory;
             var categorySubCategory="";
            if (category == "" || category == null){
              if (subCategory == "" || subCategory == null){
                categorySubCategory = "";
                }else{
                categorySubCategory = subCategory;
                }
             }else{
              if (subCategory == "" || subCategory == null) {
                categorySubCategory = category
              } else {
                categorySubCategory = category + "，" + subCategory;
              }
             }
             projectList.categorySubCategory = categorySubCategory;
             if (res.data[index].reservationAvailableTime.length != 0){
               res.data[index].reservationAvailableTime.sort(self.compare("startTime"));
              projectList.startTime = res.data[index].reservationAvailableTime[0].startTime.substring(11, 16);

               projectList.hiddenTimeContent = true;
             } else {
               projectList.hiddenTimeContent = false;
             }
             
             var title = res.data[index].name
            self.data.projectName.push(title);
            tab.push(res.data[index].projectEfficacyClass);
             projectTest.push(projectList);
          }
          self.setData({
            initialDataAll: projectTest,
          });
          var storeName = "";
          // 去重重新排序
          self.distinct(tab, projectTest, storeName);

        } else {
          self.setData({
            initialDataAll: projectTest,
          });
          self.hideLoading();
        }
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
  * 去重方法(服务名字去重)
  */
  distinct: function (tab, projectTest, storeName) {
    console.log("去重方法(服务名字去重)");
    var self = this;
    var arr = tab,
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
    self.setData({ navbar: result });

  // 初始化数据获得
    var projectTest1 = [];
    var adr = self.data.currentTab;
    console.log(adr);
    console.log(result);
    var name = result[adr];
    console.log(name);
    for (var index in projectTest) {
      if (storeName == "" || storeName == null || storeName == "undefined"){
        if (name == projectTest[index].projectEfficacyClass){
          var projectList = {};
          projectList.imgUrl = projectTest[index].imgUrl;
          if (projectTest[index].name.length > 9) {
            projectTest[index].name = projectTest[index].name.substring(0, 10) + '..'
          }
          projectList.name = projectTest[index].name;
          projectList.projectEfficacyClass = projectTest[index].projectEfficacyClass;
          // projectList.reservationAvailableTime = projectTest[index].reservationAvailableTime;
          projectList.nursingTime = projectTest[index].nursingTime;
          projectList.uuid = projectTest[index].uuid;
          projectList.retailPrice = projectTest[index].retailPrice;
          projectList.showView = projectTest[index].showView;
          projectList.categorySubCategory = projectTest[index].categorySubCategory;
          projectList.startTime = projectTest[index].startTime;
          projectList.hiddenTimeContent = projectTest[index].hiddenTimeContent;
          projectTest1.push(projectList);
        }
      }else{
          var name1 = result[0];
          if (name1 == projectTest[index].projectEfficacyClass) {
            var projectList = {};
            projectList.imgUrl = projectTest[index].imgUrl;
            if (projectTest[index].name.length > 9) {
              projectTest[index].name = projectTest[index].name.substring(0, 10) + '..'
            }
            projectList.name = projectTest[index].name;
            projectList.projectEfficacyClass = projectTest[index].projectEfficacyClass;
            // projectList.reservationAvailableTime = projectTest[index].reservationAvailableTime;
            projectList.nursingTime = projectTest[index].nursingTime;
            projectList.uuid = projectTest[index].uuid;
            projectList.retailPrice = projectTest[index].retailPrice;
            projectList.showView = projectTest[index].showView;
            projectList.categorySubCategory = projectTest[index].categorySubCategory;
            projectList.startTime = projectTest[index].startTime;
            projectList.hiddenTimeContent = projectTest[index].hiddenTimeContent;
            projectTest1.push(projectList);
          } 
      }
    }

    if (projectTest1.length == 0){
      self.setData({
        showViewBottom: true,
      });
    } else {
      self.setData({
        showViewBottom: false,
      });
    }
    self.setData({
      initialData: projectTest1,
      currentTab: 0
    });
    console.log(projectTest1);
    self.hideLoading();
  },
  /**
   * 切换tab获得数据
   */
  getInitializationTab: function (){
    count = 0;
    var tabNew = this.data.navbar;
    var adr = this.data.currentTab;
    var name = tabNew[adr];
    console.log(adr);
    console.log(name);
    var projectTest = [];
    for (var index in this.data.initialDataAll) {      
      if (name == this.data.initialDataAll[index].projectEfficacyClass){
        var projectList = {};
        projectList.imgUrl = this.data.initialDataAll[index].imgUrl;
        if (this.data.initialDataAll[index].name.length > 9) {
          this.data.initialDataAll[index].name = this.data.initialDataAll[index].name.substring(0, 10) + '..'
        }
        projectList.name = this.data.initialDataAll[index].name;
        projectList.projectEfficacyClass = this.data.initialDataAll[index].projectEfficacyClass;
        // projectList.reservationAvailableTime = this.data.initialDataAll[index].reservationAvailableTime;
        projectList.nursingTime = this.data.initialDataAll[index].nursingTime;
        projectList.uuid = this.data.initialDataAll[index].uuid;
        projectList.retailPrice = this.data.initialDataAll[index].retailPrice;
        projectList.categorySubCategory = this.data.initialDataAll[index].categorySubCategory;
        projectList.startTime = this.data.initialDataAll[index].startTime;
        projectList.hiddenTimeContent = this.data.initialDataAll[index].hiddenTimeContent;
        projectList.showView = true;
        projectTest.push(projectList);
        count++;
        }
      }
           console.log(projectTest);
           this.setData({
           initialData: projectTest,
         })
  },
  /**
   * 自定义精确搜索
   */
  inputTyping: function (e) {
    console.log("自定义精确搜索");
    count = 0;
    var self = this;
    var initialDataTest = [];
    var name = e.detail.value;
    if (name != ""){
      for (var index in self.data.initialData) {
        var initialDataList = {};
        if (self.data.initialData[index].name.length > 9) {
          self.data.initialData[index].name = self.data.initialData[index].name.substring(0, 10) + '..'
        }
        initialDataList.name = self.data.initialData[index].name;
        // initialDataList.imgUrl = self.data.initialData[index].imgUrl;
        // initialDataList.projectEfficacyClass = self.data.initialData[index].tiprojectEfficacyClassme;
        // initialDataList.reservationAvailableTime = self.data.initialData[index].reservationAvailableTime;
        initialDataList.uuid = self.data.initialData[index].uuid;
        if (name == self.data.initialData[index].name) {
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
      if (count == 0) {
        self.setData({
          showViewBottom: true,
        });
      } else {
        self.setData({
          showViewBottom: false,
        });
      }
    }else{
      self.setData({
        showViewBottom: false,
      });
       self.onLoad();
    }
  },
  /**
   * input回车触发搜索事件
   */
  inputSelect: function(e) {
    var self = this;
    self.showLoading();
    var storeName = e.detail.value;
    console.log(storeName);
    // 发起网络请求 获取所有项目信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/getProgramList',
      method: 'GET',
      data: {
        name: storeName,
        storeCode: self.data.storeCode
      },
      success: function (res) {
        console.log("项目列表页");
        console.log(res);
        // 后台正常返回
        if (res.data.length != 0) {
          // 所有数据获得
          var tab = [];
          var projectTest = [];
          for (var index in res.data) {
            var projectList = {};
            projectList.imgUrl = res.data[index].imgUrl;
            if (res.data[index].name.length > 9) {
              res.data[index].name = res.data[index].name.substring(0, 10) + '..'
            }
            projectList.name = res.data[index].name;


            projectList.projectEfficacyClass = res.data[index].projectEfficacyClass;
            // projectList.reservationAvailableTime = res.data[index].reservationAvailableTime;
            projectList.nursingTime = res.data[index].nursingTime;
            projectList.uuid = res.data[index].uuid;
            projectList.retailPrice = res.data[index].retailPrice;
            projectList.showView = true;

            var category = res.data[index].category;
            var subCategory = res.data[index].subCategory;
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
            projectList.categorySubCategory = categorySubCategory;
            if (res.data[index].reservationAvailableTime.length != 0) {
              projectList.startTime = res.data[index].reservationAvailableTime[0].startTime.substring(11, 16);
              projectList.hiddenTimeContent == true;
            }else{
              projectList.hiddenTimeContent == false;
            }

            var title = res.data[index].name
            self.data.projectName.push(title);
            tab.push(res.data[index].projectEfficacyClass);
            projectTest.push(projectList);
          }
          self.setData({
            initialDataAll: projectTest,
          });
          console.log(projectTest);
          // 去重重新排序
          self.distinct(tab, projectTest, storeName);
        }else {
          var tab = [];
          var projectTest = [];
          // 去重重新排序
          self.distinct(tab, projectTest, storeName);
        }
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
   * 点击项目跳转项目详情
   */
   goDatails: function (e) {
    var id = e.currentTarget.dataset.item;
    var nursingTime = e.currentTarget.dataset.time;
    var name = e.currentTarget.dataset.name;
     if (name.length >= 6) {
       name = name.substring(0, 7) + '..'
     }
    var categorySubCategory = e.currentTarget.dataset.casb
    wx.navigateTo({
      url: '../../pages/projectDetail/projectDetail?uuid=' + id + '&nursingTime=' + nursingTime + '&name=' + name + '&categorySubCategory=' + categorySubCategory,
    })
  },
  /**
   * 点击预约跳转预约页面
   */
  goOrder: function(e) {
    var pId = e.currentTarget.dataset.id;
    var pName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../../pages/order/order?incloudProjectCode=' + pId + '&incloudProjectName=' + pName+'&v='+1,
    })
  },

  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 > value2;
    }
  },

  gotoMinePage: function () {
    wx.switchTab({
      url: "/pages/mine/mine",
    })
  },
})