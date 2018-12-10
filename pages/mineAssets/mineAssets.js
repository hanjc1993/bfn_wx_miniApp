// pages/mineAssets/mineAssets.js
//获取应用实例
const app = getApp();
var login = require("../../utils/login.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarNmae:'套餐卡',
    // 加载中
    hiddenLoading: true,
    // title显示
    popErrorMsg: "",
    // 控制底部显示
    showNoData:false,

    navbar: ['套餐卡', '储金卡'],
    currentTab:0,
    detailDisplayControl:false,
    stateParameter:"",
    weui:"weui-cell__ft",
    initialData:[],
    initialData1: [],
    showBottom:true,
    hideBottom:false,
    indexData:"",

    // 套餐卡储值卡
    comboCard:null,
    storedValueCard:null,

    // 门店名字列表
    storeNamesList:null,

    vipNo:"",
    assets:"",
    showNoDataOne:"",
    showNoDataTwo:"",
    backButton: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    // this.data.comboCard = options.comboCard;
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
    var self = this;
    // 获取套餐卡储蓄卡信息
    self.setData({
      vipNo: app.globalData.vipNo
    });
    if (app.globalData.vipNo == "" || app.globalData.vipNo == null) {
      if (options.assets == 0) {
        self.setData({
          showNoData: true,
        });
      }
    } else {
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
    var navbarNmae = this.data.navbar[e.currentTarget.dataset.idx]
    //console.log(137)
    //console.log(navbarNmae)
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      initialData: [],
      initialData1: [],
      navbarNmae: navbarNmae,
    })
    if(app.globalData.vipNo!=''){
      this.getPersonalInformation();
    }
    
  },
  /**
   * 点击详情跳转
   */
  goCoupons: function (e) {
    var id = e.currentTarget.dataset.item;
    var cardName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../assets/assets?cardId=' + id + '&cardName=' + cardName,
    })
  },
  /**
   * 套餐卡详情展开
   */
  packageCardDetails: function(e){
    this.data.indexData = e.currentTarget.dataset.id;
    this.data.stateParameter = e.currentTarget.dataset.index;
    //console.log(e.currentTarget.dataset.id);
    //console.log(e.currentTarget.dataset.index);

    this.getInitialDataTest(this.data.indexData, this.data.stateParameter);
  },
  /**
   * 获取个人账户信息信息
   */
  getPersonalInformation: function () {
    var self = this;
    self.showLoading();
    //console.log(self.data.vipNo);
    // 发起网络请求 
    wx.request({
      url: app.globalData.path + 'rest/transmission/getMemberAccount/'+self.data.vipNo,
      method: 'GET',
      data: {
      },
      success: function (res) {
        console.log("我的资产页---个人中心获取初始信息");
        console.log(res);
        // 后台正常返回

          self.data.comboCard = res.data.comboCard;
          self.data.storedValueCard = res.data.storedValueCard;

          var testOne = [];
          var testTwo = [];
          var count1 = 0;
          var count2 = 0;
        if (self.data.comboCard.length != 0 && self.data.comboCard!=''){
            for (var index in self.data.comboCard) {
              var testList = {};
              testList.cardCode = self.data.comboCard[index].cardCode;
              testList.cardMoreThan = self.data.comboCard[index].surplusCnt;
              testList.periodValidity = self.data.comboCard[index].validDate;
              // var periodValidityTest = self.data.comboCard[index].validDate;
              // testList.periodValidity = '“' + periodValidityTest +'”';
              testList.showOrhide = self.data.hideBottom;
              testList.cardId = self.data.comboCard[index].id;
              testList.cardName = self.data.comboCard[index].cardName;
              testList.cardImg = self.data.comboCard[index].cardImg;

              testList.mendian = "";
              testList.weui = "weui-cell__ft";

              testOne.push(testList);
              count1++;
            }    
        }
        if (self.data.storedValueCard.length != 0 && self.data.storedValueCard != ''){
          for (var index in self.data.storedValueCard) {
            var testList = {};
            testList.cardCode = self.data.storedValueCard[index].cardCode;
            testList.cardMoreThan = self.data.storedValueCard[index].cardSurplusValue;
            testList.periodValidity = self.data.storedValueCard[index].validDate;
            // var periodValidityTest = self.data.storedValueCard[index].validDate;
            // testList.periodValidity = '“' + periodValidityTest + '”';
            testList.showOrhide = self.data.hideBottom;
            testList.cardId = self.data.storedValueCard[index].id;
            testList.cardName = self.data.storedValueCard[index].cardName;
            testList.cardImg = self.data.storedValueCard[index].cardImg;

            testList.mendian = "";
            testList.shangpin = "";
            testList.weui = "weui-cell__ft";

            testTwo.push(testList);
            count2++;
          }

        }
            
            if(self.data.currentTab == 0){
              if (count1 == 0) {
                var navbarNmae = self.data.navbar[0]
                self.setData({
                  showNoData: true,
                  navbarNmae:navbarNmae,
                });
              }else {
                self.setData({
                  showNoData: false,
                });
              }
            }
            if(self.data.currentTab == 1){
              if (count2 == 0) {
                self.setData({
                  showNoData: true,
                });
              }else{
                self.setData({
                  showNoData: false,
                });
              }
            }
          self.setData({
            initialData: testOne,
            initialData1: testTwo,
          });
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
   * 获取卡项适用门店(快照)
   */
  getInitialData: function (id, indexData) {
    var self = this;
    self.showLoading();
    wx.request({
      url: app.globalData.path + 'rest/transmission/getCardStore',
      method: 'GET',
      data: {
        cardId:id
        // cardId:"141"
      },
      success: function (res) {
        console.log("我的资产页---获取卡项适用门店(快照)");
        console.log(res);
        // 后台正常返回
        if (res.statusCode == 200) {
          var test = self.data.initialData;
          var testOne = [];
          var test1 = self.data.initialData1;
          var testOne1 = [];
          //console.log(test);
          // tab为套餐卡
          if (self.data.currentTab == 0){
                      var test = self.data.initialData;
          //console.log(indexData);
          // var mendian = "";
          //   if (res.data.csDto.briefInfoLst != null){
          //   mendian = res.data.csDto.briefInfoLst[0];
          //     console.log("mendian=" + mendian);
          // }
            // 适用门店字符串拼接
            var neirong1 = "";
            var neirong2 = "";
            if (res.data.csDto.partStoreLst != null) {

              for (var index in res.data.csDto.partStoreLst) {
                var a = res.data.csDto.partStoreLst[index].storeName;
                if (index == res.data.csDto.partStoreLst.length - 1) {
                  neirong1 = neirong1 + a;
                } else {
                  neirong1 = neirong1 + a + "、";
                }
              }
            }
            if (res.data.csDto.briefInfoLst != null) {

              for (var index in res.data.csDto.briefInfoLst) {
                var a = res.data.csDto.briefInfoLst[index];
                if (index == res.data.csDto.briefInfoLst.length - 1) {
                  neirong2 = neirong2 + a;
                } else {
                  neirong2 = neirong2 + a + "、";
                }
              }
            }
            var mendian = "";
            if (neirong2 == "") {
              if (neirong1 == "") {
                mendian = ""
              } else {
                mendian = neirong1;
              }
            } else {
              if (neirong1 == "") {
                mendian = neirong2;
              } else {
                mendian = neirong2 + "、" + neirong1;
              }
            }   
          var tempTwo = "initialData[" + indexData + "].mendian";
          var showOrhide = "initialData[" + indexData+"].showOrhide";
          var weui = "initialData[" + indexData + "].weui";
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
            [tempTwo]: mendian,
            [showOrhide]: showOrhideTest,
            [weui]: weuiTest,
          });
          //console.log(self.data.initialData);
          self.hideLoading();
            // for (var index in test) {
            //   if (indexData == index) {
            //     var testList = {};
            //     testList.periodValidity = test[index].periodValidity;
            //     testList.cardMoreThan = test[index].cardMoreThan;
            //     testList.applyStores = test[index].applyStores;
            //     testList.cardId = test[index].cardId;
            //     if (res.data.applyStoreDtoLst.length != 0){
            //       if (res.data.applyStoreDtoLst[0].storeName != null){
            //         testList.mendian1 = res.data.applyStoreDtoLst[0].storeName;
            //         }
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
            //   }
            //   else {
            //     var testList = {};
            //     testList.periodValidity = test[index].periodValidity;
            //     testList.cardMoreThan = test[index].cardMoreThan;
            //     testList.applyStores = test[index].applyStores;
            //     testList.cardId = test[index].cardId;
            //     testList.showOrhide = test[index].showOrhide;
            //     if (res.data.applyStoreDtoLst.length != 0) {
            //       if (res.data.applyStoreDtoLst[0].storeName != null) {
            //         testList.mendian1 = res.data.applyStoreDtoLst[0].storeName;
            //       }
            //     }
            //     testOne.push(testList);
            //   } 
            //   self.hideLoading();
            // }
            // self.setData({
            //   initialData: testOne,
            // });
          } else if (self.data.currentTab == 1){
            // var mendian = "";
            // if (res.data.csDto.briefInfoLst != null) {
            //   mendian = res.data.csDto.briefInfoLst[0];
            //   console.log("mendian=" + mendian);
            // }
            // 适用门店字符串拼接
            var neirong1 = "";
            var neirong2 = "";
            if (res.data.csDto.partStoreLst != null) {

              for (var index in res.data.csDto.partStoreLst) {
                var a = res.data.csDto.partStoreLst[index].storeName;
                if (index == res.data.csDto.partStoreLst.length - 1) {
                  neirong1 = neirong1 + a;
                } else {
                  neirong1 = neirong1 + a + "、";
                }
              }
            }
            if (res.data.csDto.briefInfoLst != null) {

              for (var index in res.data.csDto.briefInfoLst) {
                var a = res.data.csDto.briefInfoLst[index];
                if (index == res.data.csDto.briefInfoLst.length - 1) {
                  neirong2 = neirong2 + a;
                } else {
                  neirong2 = neirong2 + a + "、";
                }
              }
            }
            var mendian = "";
            if (neirong2 == "") {
              if (neirong1 == "") {
                mendian = ""
              } else {
                mendian = neirong1;
              }
            } else {
              if (neirong1 == "") {
                mendian = neirong2;
              } else {
                mendian = neirong2 + "、" + neirong1;
              }
            }   
            self.getCommodity(id, indexData, mendian);
          }

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
   * 获取卡项适用商品(快照)
   */
  getCommodity: function (id, indexData, mendian) {
    var self = this;
    wx.request({
      url: app.globalData.path + 'rest/transmission/getCardCommodity',
      method: 'GET',
      data: {
        cardId:id
        //  cardId:"141"
      },
      success: function (res) {
        console.log("我的资产页---获取卡项适用商品(快照)");
        console.log(res);
        // 后台正常返回
        if (res.statusCode == 200) {

          var test1 = self.data.initialData1;
          //console.log(indexData);
          var shangpin = "";
          if (res.data.cardSaveProjectDto != null){
          var shangpinTest = res.data.cardSaveProjectDto[0].name;
            shangpin = shangpinTest+"等商品";
          }else{
            shangpin = "暂无可用商品";
          }
          var tempOne = "initialData1[" + indexData + "].shangpin";
          var tempTwo = "initialData1[" + indexData + "].mendian";
          var showOrhide = "initialData1[" + indexData + "].showOrhide";
          var weui = "initialData1[" + indexData + "].weui";
          for (var index in test1) {
            if (indexData == index) {
              if (test1[index].showOrhide == self.data.hideBottom) {
                var showOrhideTest = self.data.showBottom;
                var weuiTest = "weui-cell__ft_bak";
              } else if (test1[index].showOrhide == self.data.showBottom) {
                var showOrhideTest = self.data.hideBottom;
                var weuiTest = "weui-cell__ft";
              }
            }
          }
          self.setData({
            [tempOne]: shangpin,
            [tempTwo]: mendian,
            [showOrhide]: showOrhideTest,
            [weui]: weuiTest,
          });
          //console.log(self.data.initialData1);
          // var test1 = self.data.initialData1;
          // var testOne1 = [];
          //   for (var index in test1) {
          //     if (indexData == index) {
          //       var testList = {};
          //       testList.periodValidity = test1[index].periodValidity;
          //       testList.cardMoreThan = test1[index].cardMoreThan;
          //       testList.cardId = test1[index].cardId;
          //       testList.mendian1 = mendian;
          //       if (res.data.cardComboProjects != null) {
          //         if (res.data.cardComboProjects[0].name != null){
          //           testList.shangpin = res.data.cardComboProjects[0].name;
          //          }
          //       }
                
          //       if (test1[index].showOrhide == self.data.hideBottom) {
          //         testList.showOrhide = self.data.showBottom;
          //         self.setData({
          //           weui: "weui-cell__ft_bak",
          //         });
          //       } else if (test1[index].showOrhide == self.data.showBottom) {
          //         testList.showOrhide = self.data.hideBottom;
          //         self.setData({
          //           weui: "weui-cell__ft",
          //         });
          //       }
          //       testOne1.push(testList);
          //       console.log(testOne1);
          //     }
          //     else {
          //       var testList = {};
          //       testList.periodValidity = test1[index].periodValidity;
          //       testList.cardMoreThan = test1[index].cardMoreThan;
          //       testList.cardId = test1[index].cardId;
          //       testList.mendian1 = mendian;
          //       testList.showOrhide = self.data.showBottom;
          //       if (res.data.cardComboProjects != null) {
          //         if (res.data.cardComboProjects[0].name != null) {
          //           testList.shangpin = res.data.cardComboProjects[0].name;
          //         }
          //       }
          //       testOne1.push(testList);
          //     }
              
          //   }
          
          // self.setData({
          //   initialData1: testOne1,
          // });


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
   * 重置页面初始数据
   */
  getInitialDataTest: function (indexData, stateParameter) {
    var self = this;
    var test = self.data.initialData;
    var test1 = self.data.initialData1;
    var testOne = [];
    var testOne1= [];
    if(self.data.currentTab == 0){
      for (var index in test) {
        if (indexData == index) {
          var id = test[index].cardId;
          // 获取卡门店
          this.getInitialData(id, indexData);
        } 
      }
    } else if (self.data.currentTab == 1){
      for (var index in test1) {
        if (indexData == index) {
          var id = test1[index].cardId;
          // 获取卡门店
          this.getInitialData(id, indexData);

        } 
      }
    }
  },
  gotoMinePage: function () {
    wx.switchTab({
      url: "/pages/mine/mine",
    })
  },
})