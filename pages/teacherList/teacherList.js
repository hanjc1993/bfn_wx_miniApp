// pages/teacherList/teacherList.js
var login = require("../../utils/login.js");
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //养脑师集合
    teacherList:{},
    // starNumber: 1,
    starList: [],
    storeCode:'',
    orderTime:'',
    incloudProject:[],
    nurseCode:'',
    //好评数集合
    evaluateGoodList:[],
    showPage:false,
    hiddenLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var self=this;
  //从上个页面得到门店code
  //var storeCode = options.storeCode
    self.showLoading()
   var storeCode = app.globalData.storeCode
   if(options.v==5){
     var incloudProjectCode = JSON.parse(options.incloudProjectCode);
     self.setData({
       orderTime:options.orderTime,
       incloudProject: incloudProjectCode,
       nurseCode:options.nurseCode
     })
     console.log(options.orderTime)
   }
    self.setData({
      storeCode: storeCode,
      showPage: false
    })
    console.log('门店code')
    console.log(storeCode)
     login.checkInitAgree(self, function(){
       self.doInit(storeCode);
   });
  },
  doInit: function (storeCode) {
    var self = this;
    //后台获取数据
    if(self.data.orderTime!=''){
      self.getCanUsedNurse(storeCode)
    }else{
      self.getNurseList();
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
/**
 * 进详情页面
 */
  goTeacherDetailPage(e) {
    var self=this;
  //把员工Code 员工name 员工photoUrl 员工星级  传到该员工的详细页面
    wx.navigateTo({
      url: '../../pages/teacherDetail/teacherDetail?storeCode=' + self.data.storeCode + '&uuid=' + e.currentTarget.dataset.item.uuid + '&name=' + e.currentTarget.dataset.item.name + '&srcImg=' + encodeURIComponent(e.currentTarget.dataset.item.srcImg)  + '&star=' + e.currentTarget.dataset.item.star,
    })

  },
  /** 
  * 显示星级
  */
  showStar(star) {
   
    var self = this;
    var starList = [];
   
    if (star >= 5 ){
      self.setData({
        star: 5
      })
    }
    if (star<= 0) {
      self.setData({
        star: 0
      })
    }
    var stars = star;

    var noneStars = 5 - stars;
    for (var i = 0; i < stars; i++) {
      starList.push(true);
    }
    if (stars != 5) {
      for (var i = 0; i < noneStars; i++) {
        starList.push(false);
      }
    }

    return starList;
  },
  showLoading: function () {
    this.setData({
      hiddenLoading: false
    })
  },
  //隐藏加载logo
  hiddenLoading: function () {
    this.setData({
      hiddenLoading: true
    })
  },
  getCanUsedNurse:function(storeCode){
    var self = this;
    console.log("看接口是否返回项目")
    var storeCode = storeCode
    var theDay = new Date(self.data.orderTime)
    console.log(theDay)
    var year = theDay.getFullYear().toString()
    var mon = (theDay.getMonth() + 1).toString()
    if (mon < 10) {
      mon = "0" + mon
    }
    var day = theDay.getDate()
    if (day < 10) {
      day = "0" + day
    }
    var dtoDate = self.data.orderTime.substring(0,10).replace(/-/g,'')//year + mon + day
    console.log(dtoDate)
    console.log(self.data.incloudProject[0].code)
    // 发起网络请求 获取套餐信息
    self.showLoading();
    wx.request({
      url: app.globalData.path + 'rest/res/getReservationTimeRange',
      method: 'GET',
      data: {
        storeCode: self.data.storeCode,
        date: dtoDate,
        vipNo: '',
        prjUuid: self.data.incloudProject[0].code, //此属性待商榷啊，本应该是个数组
      },
      success: function (res) {
        
        console.log("111111111111111111111")
        console.log(res)
        if (res.data.errcode == 0) {
          var list = res.data.nurse;
          var canUsedNurse = []
          //var storeTime = res.data.reservationAvailableTime;
          if (list.length != 0) {
            var wangsTime = Date.parse(self.data.orderTime.replace(/-/g, '/'))//将想要的时间转换成时间戳
            //获取好评数
             self.getEvaluateGood(storeCode);

            for (var index in list) {
              if (list[index].reservationAvailableTime.length!=0){
                for (var i in list[index].reservationAvailableTime){
                  var st = Date.parse(list[index].reservationAvailableTime[i].startTime.replace(/-/g, '/'))
                  var et = Date.parse(list[index].reservationAvailableTime[i].endTime.replace(/-/g, '/'))
                  if (wangsTime >= st && wangsTime<=et){
                    canUsedNurse.push(list[index])
                  }
                }
              }
            }
            for (var index in canUsedNurse){
              canUsedNurse[index].name = canUsedNurse[index].nurseName
              canUsedNurse[index].uuid = canUsedNurse[index].nurseCode
              canUsedNurse[index].star = canUsedNurse[index].nurseStar
              canUsedNurse[index].srcImg = canUsedNurse[index].nurseImg
              canUsedNurse[index].level = canUsedNurse[index].nurseLevel
              var starList = self.showStar(canUsedNurse[index].nurseStar)
              canUsedNurse[index].starList = starList
         
            }
        
        
            
            self.setData({
              teacherList: canUsedNurse,
              showPage: true
            })
            console.log(234)
            console.log(self.data.teacherList)
        
            
          } else {
            self.setData({
              nurseList: [],
              teacherList: [],
              showPage: true
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
        self.hideLoading()
      },
      fail: function (err) {
        self.hideLoading()
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
          confirmColor: '#fbb059',
        });
      }
    });
    
  },
  filterNurse:function(){
    var nurselist = this.data.teacherList
    var orderTime = this.data.orderTime
    console.log("筛选前的养脑师列表")
    console.log(nurselist)
    console.log("想要的时间")
    console.log(orderTime)
  },
  //预约时间满了时，看其他养脑师的好评数
  getEvaluateGood :function (storeCode) {
    var evaluateGoodList=[]
    var self = this;
    var storeCode = storeCode;
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/getNurseList',
      method: 'GET',
      data: {
        storeCode: storeCode
      },
      success: function (res) {

        // 后台正常返回
        if (res.statusCode == 200) {
          if (res.data.length != 0) {
            var othreteacherList = res.data;
            for (var index in othreteacherList) {
              if (othreteacherList[index].evaluateGood == null) {
                othreteacherList[index].evaluateGood = 0
              } 
            }
            for (var index in othreteacherList) {
              if (othreteacherList[index].srcImg == null) {
                othreteacherList[index].srcImg = "../../images/headImg.png"
              }
            }
         
            var teacherList = self.data.teacherList
            for (var i in teacherList){
             
              for (var j in othreteacherList){
                if (teacherList[i].uuid == othreteacherList[j].uuid){
                  teacherList[i].evaluateGood = othreteacherList[j].evaluateGood

                }

              }
            }
            console.log(300)
            console.log(teacherList)
            self.setData({
              teacherList: teacherList
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

  getNurseList: function () {
    console.log(330)
    var self = this;
    console.log(self.data.storeCode)
    //var evaluateGoodList=[];
 var storeCode = self.data.storeCode;
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/getNurseList',
      method: 'GET',
      data: {
        storeCode: storeCode
      },
      success: function (res) {
        console.log(res);
        console.log(res.data)
        // 后台正常返回
        if (res.statusCode == 200) {
          if (res.data.length!=0){
          var teacherList = res.data;
            for (var index in teacherList) {
              if (teacherList[index].srcImg == null) {
                teacherList[index].srcImg = "../../images/headImg.png"
              }
            }
          for (var index in teacherList){
            if (teacherList[index].evaluateGood == null){
              teacherList[index].evaluateGood =0
            }
            if (teacherList[index].name.length==2){
              teacherList[index].name = teacherList[index].name.substring(0, 1) + "   " + teacherList[index].name.substring(1, 2)
          }
            var starList=self.showStar(teacherList[index].star)
            teacherList[index].starList = starList
           // evaluateGoodList.push(othreteacherList[index].evaluateGood)
          }
            console.log("teacherList")
            console.log(teacherList)
          self.setData({
            teacherList: teacherList,
            showPage: true
            // evaluateGoodList: evaluateGoodList
          })
          if(self.data.orderTime!=''){
            self.filterNurse()
          }
          }else{
            self.setData({
              teacherNone: true
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
        self.hideLoading()
      },
      fail: function (err) {
        self.hideLoading()
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
})