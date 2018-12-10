// pages/mine/mine.js
//获取应用实例
const app = getApp();
var login = require("../../utils/login.js");
// 会员名字
var name;
// 会员生日
var birthday;
// 会员性别
var gender;
// 会员电话
var phone;
// vipNo
var vipNo;
// openid
var openid;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //本人微信的头像url
    avatarUrl:'',
    //判断我的预约里是否有未服务的订单
    isHaveNotDone:false,
    // 加载中
    hiddenLoading: true,
    // title显示
    popErrorMsg: "",

    showNikeNameOne: true,
    showNikeNameTwo: false,
    showNikeNameThree: false,
    showNikeNameFour: true,
    showNikeNameFive:false,
    showViewOne:true,
    showViewTwo: true,
    showViewThree: true,
    //用户个人信息
    userInfo: {
      avatarUrl: "",
      nickName: "",
    },
    appointment:"",
    preferential: "",
    consumption: "",
    assets:"",
    coupons:"",
    nikename:"",
    cardNumber:"",

    // 套餐卡储值卡数组
    comboCard:[],
    storedValueCard:[],

    // 卡数、券数
    // coupons:0,
    // assets:0,
    showPage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var self = this;
    app.globalData.v = '';
    // 判断网络状态
    login.checkInitAgree(self, function () {
      self.doInit();
    });
  },

  doInit: function () {
    var self = this;
    vipNo = app.globalData.vipNo;
    console.log("vipNo=" + vipNo);
    if (!vipNo) {
      self.setData({
        showNikeNameFour: false,
        assets: 0,
        coupons: 0,
        showPage: true,
      });
      return;
    } else {
      self.getPersonalInformation(vipNo);
      self.getCouponsCount(vipNo);
      self.getInitialData(vipNo);
      self.getOrderList(vipNo);
    }
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
  //获取我的预约列表
  getOrderList: function (vipNo) {
    var self = this
    //self.showLoading();
    wx.request({
      url: app.globalData.path + 'rest/res/getReservationList',
      data: { vipNo: vipNo },//S27395
      method: 'get',
      // header: {//请求头
      //   "Content-Type": "application/json"
      // },
      success: function (res) {
        
        if (res.data.reservations.length != 0) {
          var list = res.data.reservations
          var totalList = []
          // var togetherList = []
          for (var index in list) {
            totalList.push(list[index])
            if (list[index].togethers != null) {
              for (var i in list[index].togethers) {
                var togetherList = list[index].togethers[i]
                //list.push(togetherList)
                totalList.push(togetherList)
              }
            }
          }
          for(var i in totalList){
            if(totalList[i].status=="未服务"){
              self.setData({
                isHaveNotDone:true
              })
              break
            }else{
              self.setData({
                isHaveNotDone: false
              })
            }
          }
        }else{
          self.setData({
            isHaveNotDone: false
          })
        }

        console.log("我的订单List数据获取完毕："+new Date())
        console.log(res)
        self.hideLoading();
      },
      fail: function (err) {
        self.hideLoading();
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
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

  inputTyping: function (e) {

  },
  changeNikeName: function(){
    var self = this;
    self.setData({
      showNikeNameOne: false,
      showNikeNameTwo: true,
      showNikeNameThree: false,
      showNikeNameFour: false,
      showNikeNameFive:true,
    });
  },
  /**
   * 返回数据（页面） 
   */
  retrunData: function (e) {
    var self = this;
    name = e.detail.value.nikename;
    self.setData({
      showNikeNameOne: false,
      showNikeNameTwo: false,
      showNikeNameThree: true,
      showNikeNameFour: true,
      showNikeNameFive: false,
      nikename: e.detail.value.nikename,
    });
    //console.log(e.detail.value.nikename);
    // 调用顾客在小程序中修改会员信息接口
    self.retrunName(name);
  },
  retrunName: function (name){
    var self = this;
    if (vipNo == "" || vipNo == null){
      this.setData({
        popErrorMsg: "您还没有注册，可以先去设置页注册！"
      })
      app.ohShitfadeOut(self);
      return;
    }
    if (name == "" || name == null) {
      this.setData({
        popErrorMsg: "昵称不能为空！"
      })
      app.ohShitfadeOut(self);
      return;
    }
    var radioStr;
    if(gender == "男"){
      radioStr = "GENDER_001";
    } else if (gender == "女"){
      radioStr = "GENDER_002";
    }else{
      radioStr = "GENDER_003";
    }
    wx.request({
      url: app.globalData.path + 'rest/transmission/modifyMemberInfo',
      method: 'POST',
      data: {
        name: name,
        gender: radioStr,
        vipNo:vipNo,
        phone:phone,
      },
      success: function (res) {
        //console.log(res);
        
        // 后台正常返回
        if (res.data.errcode == 0) {
          self.setData({
            popErrorMsg: "昵称修改成功！"
          })
          app.ohShitfadeOut(self);
          return;
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
  /**
   * 获取页面初始数据
   * 
   */
  getInitialData: function (vipNo) {
    var self = this;
    //self.showLoading();
    // 发起网络请求 获取会员信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/getMemberInfo/'+vipNo,
      method: 'GET',
      data:{
      },
      success: function (res) {
        console.log("我的基本信息获取完毕：" + new Date());
        console.log(res);
        // 后台正常返回
        if (res.data.length != 0) {

          var cardNumber = res.data.vipNo;
          var nikeName = name;
          name = res.data.name;
          phone = res.data.phone;
          vipNo = res.data.vipNo;
          gender = res.data.gender;
          birthday = res.data.birthday;
          self.setData({ 
            isModifiedBirthday: res.data.isModifiedBirthday,
            nikeName:res.data.name
            });
            //console.log(265)
          //console.log(self.data.isModifiedBirthday)
          if (vipNo == "" || vipNo ==null){
            self.setData({ showNikeNameFour: false, showPage: true,});
          }
          if (name != null){
            self.setData({
              cardNumber: cardNumber,
              showNikeNameOne: false,
              showNikeNameTwo: false,
              showNikeNameThree: true,
              showNikeNameFour: true,
              showNikeNameFive: false,
              nikename: name,
            });
          }else {
            self.setData({
              cardNumber: cardNumber,
              showNikeNameOne: true,
              showNikeNameTwo: false,
              showNikeNameThree: false,
              showNikeNameFour: true,
              showNikeNameFive: false,
            });
          }
        }
        self.hideLoading();
        self.setData({
          showPage: true,
        });
      },
      fail: function (err) {
        self.hideLoading();
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
   * 获取个人账户信息查询信息(我的资产项目数)
   */
  getPersonalInformation: function(vipNo){
    var self = this;
    //self.showLoading();
    // 发起网络请求 
    wx.request({
      url: app.globalData.path + 'rest/transmission/getMemberAccount/' + vipNo,
      method: 'GET',
      data: {
      },
      success: function (res) {
        console.log("我的资产数据获取完毕：" + new Date());
        console.log(res);
        // 后台正常返回
        if (res.data.length != 0) {
          self.data.comboCard = res.data.comboCard;
          self.data.storedValueCard = res.data.storedValueCard;
          var assets;
          if (res.data.comboCard !=null){
            var assets1 = self.data.comboCard.length;
           // console.log(assets1);
          }else{
             assets1 = 0;
          } 
          if (self.data.storedValueCard != null) {
            var assets2 = self.data.storedValueCard.length;
            //console.log(assets2);
          } else {
            assets2 = 0;
          } 
            assets = assets1 * 1 + assets2 * 1;
          //console.log("卡数=" + assets);
            self.setData({
              assets: assets
            })
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
   * 获取我的优惠券(张数)
   */
  getCouponsCount: function (vipNo) {
    var self = this;
    //self.showLoading();
    // vipNo = app.globalData.vipNo
    // 发起网络请求 
    wx.request({
      url: app.globalData.path + 'rest/RzActivity/getCouponInfoLst',
      method: 'GET',
      data: {
        // vipNo:"sss1001275"
        vipNo:vipNo
      },
      success: function (res) {
        console.log("我的优惠券获取完毕：" + new Date());
        console.log(res);
        // 后台正常返回
        var coupons
        if (res.data.length != 0) {
          
          if (res.data.length != null) {
            //挑选出未使用的优惠券张数
            var count = 0
            for(var index in res.data){
              if(res.data[index].cd.status==2){
                count ++
              }
            }
            //coupons = res.data.length;
            self.setData({
              coupons: count
            })
          }else{
            coupons = 0;
            self.setData({
              coupons: coupons
            })
          }
          
        } else{
          self.setData({
            coupons: 0
          })
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
   * 点击设置跳转
   */
  goSetUp: function (){
    var self = this;
    var assets = self.data.assets;
    var coupons = self.data.coupons;
    var cardNumber = self.data.cardNumber;
    var nikename = self.data.nikename;
    var isModifiedBirthday = self.data.isModifiedBirthday;
    // gender = e.detail.userInfo.gender;
    //console.log(self.data.nikename);
    if (nikename == null || nikename == "") {
      wx.navigateTo({
        url: '../setUp/setUp?nikename=' + "0" + '&coupons=' + coupons + '&assets=' + assets + '&cardNumber=' + cardNumber + '&birthday=' + birthday + '&gender=' + gender + '&phone=' + phone + '&isModifiedBirthday=' + isModifiedBirthday,
      }) 
    }else{
      wx.navigateTo({
        url: '../setUp/setUp?nikename=' + nikename + '&coupons=' + coupons + '&assets=' + assets + '&cardNumber=' + cardNumber + '&birthday=' + birthday + '&gender=' + gender + '&phone=' + phone + '&isModifiedBirthday=' + isModifiedBirthday,
      })
    }
  },
  /**
   * 点击我的预约跳转
  */
  onGotUserInfo: function (e) {
    var self = this;
    console.log(e.detail.userInfo.avatarUrl)
    self.setData({
      avatarUrl: e.detail.userInfo.avatarUrl
    })
    name = e.detail.userInfo.nickName;
    if (vipNo == "" || vipNo == null){
      gender = e.detail.userInfo.gender;
      if (e.detail.userInfo.gender == 1) {
        gender = '男';
      } else if (e.detail.userInfo.gender == 2) {
        gender = '女';
      } else {
        gender = 0;
      }
    }
    self.goSetUp();
  },
  /**
   * 点击我的预约跳转
  */
  goWdyy:function(){
    wx.navigateTo({
      url: '../../pages/myOrderList/myOrderList',
    })
  },

  /**
   * 点击我的资产跳转
  */
  goMineAssets: function(){
    wx.navigateTo({
      url: '../mineAssets/mineAssets?assets=' + this.data.assets,
    })
  },
  /**
  * 点击我的优惠券跳转
  */
  goCoupons: function () {
    // wx.navigateTo({
    //   url: '../couponsList/couponsList?vipNo='+vipNo,
    // })
    wx.navigateTo({
      url: '../couponsList/couponsList?vipNo=' + "SYHY000004248" + '&coupons=' + this.data.coupons,
    })
  },
  
  /**
  * 点击消费记录跳转
  */
  goXfjl: function () {
    wx.navigateTo({
      url: '../consumptionRecords/consumptionRecords',
    })
  },
  /**
  * 点击优惠活动跳转
  */
  goYhhd: function () {
    if (this.data.nikename != null){
      var nikename = this.data.nikename
    }
    wx.navigateTo({
      url: '../preferentialitem/preferentialitem?nikename=' + nikename,
    })
  },

})