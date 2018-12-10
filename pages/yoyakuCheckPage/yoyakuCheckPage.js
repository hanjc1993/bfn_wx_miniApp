// pages/yoyakuCheckPage/yoyakuCheckPage.js
// pages/yoyakuPage/yoyakuPage.js
const app = getApp();
var login = require("../../utils/login.js");
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 2018-09-13   以下为本page需要用的数据 by Jw
     */
    orderList:{},
    storesInfo:{},
    popErrorMsg:'',
    successMsg:false,
    togethers:[],
    //默认隐藏加载
    hiddenLoading: true,
    disabledSubmitBtn:false,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
     var orderList = JSON.parse(options.orderList);
    console.log(options.storesInfo);
    var storesInfo = JSON.parse(decodeURIComponent(options.storesInfo));
     console.log("看传过来的养脑师code")
    console.log(orderList.nurseCode)
      self.setData({
        orderList: orderList,
        storesInfo: storesInfo
      })
      console.log(orderList)
      var tongxing = [] 
      for(var index in orderList.togethers){
         var rs = {
           "startTime": orderList.togethers[index].orderTime,
           "incloudProject": orderList.togethers[index].incloudProject,
           "nurseType": orderList.togethers[index].nurseType,
           "remark": orderList.togethers[index].remark
         }
         tongxing.push(rs)
      }
      self.setData({
        togethers:tongxing
      })
      console.log("同行人信息"+tongxing)
    login.checkInitAgree(self, function () {
      self.doInit();
    });
  },
  doInit:function(){
   
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
    this.setData({
      disabledSubmitBtn: false
    })
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
  subbmitOrderList:function(){
    var self = this
    self.setData({
      disabledSubmitBtn:true
    })
    self.showLoading()
    console.log(self.data.orderList)
    var partner = false;
    if (self.data.orderList.togethers.length!=0){
        partner = true
    }
    
    console.log("提交信息了")
    console.log("这为插入接口时的数据"+self.data.orderList.orderTime)
    console.log("1点排 2轮排---此时的nurseType：" + self.data.orderList.nurseType)//1点排 2轮排
    // if(self.data.orderList.nurseCode!=''){
     var  param = {
        startTime: self.data.orderList.orderTime,
        incloudProject: self.data.orderList.incloudProject,
        nurseType: self.data.orderList.nurseType,//2
        nurseCode: self.data.orderList.nurseCode,
        remark:self.data.orderList.remark,
        storeCode: self.data.orderList.storeCode,
        vipNo: app.globalData.vipNo,
        togethers: self.data.togethers,
        together: partner,
        errcode: 'string',
        errmsg: 'string',
        'type': 2
      }
    // }else{
    //    param= {
    //     startTime: self.data.orderList.orderTime + ":00" ,
    //     incloudProject: self.data.orderList.incloudProject,
    //      nurseType: self.data.orderList.nurseType,//2,
    //   // nurseCode: self.data.orderList.nurseCode,
    //      remark: self.data.orderList.remark,
    //     storeCode: self.data.orderList.storeCode,
    //     vipNo: self.data.orderList.vipNo,
    //     togethers:[
    //       // { startTime: "2018-04-20 10:00:00",
    //       //   incloudProject:[
    //       //     { code: "PRJ000001"}
    //       //   ],
    //       //   nurseType:2,
    //       //   remark:'这是同行人数据'
    //       // }
    //     ],
    //     together: false,
    //     errcode:'string',
    //     errmsg:'string',
    //     'type':2
    //   }
    // }
    console.log("在这看vipNo")
    console.log(param)
    
    wx.request({    
      url: app.globalData.path +'rest/res/createReservation',
      data: JSON.stringify(param),
        // header: {//请求头
        //   "Content-Type": "applciation/json"
        // },
        method:'POST',
        success:function(res){
          console.log(res)
          if(res.data.errcode == 0){
            console.log("成功插入了数据库")
            wx.showToast({
              title: '预约成功',
              icon:'success',
              duration:1000
            });
            //弹出恭喜预约成功信息
            // self.setData({
            //   successMsg:true
            // })
            //改全局变量标识 在mine页面判断 为true 跳到myorderlist页面
            //app.globalData.firstLoad = true;
            // wx.switchTab({
            //   url: '../../pages/mine/mine',
            // }) 

            setTimeout(function () {
              wx.switchTab({
                url: '../../pages/mine/mine',
              })
            }, 1000)
            // setTimeout(function () {
            //   //关闭预约成功信息
            //     self.setData({
            //       successMsg: false
            //    })
            //     wx.switchTab({
            //       url: '../../pages/mine/mine',
            //     }) 
            //   }, 500)
            
          }else{
            // wx.showToast({
            //   title: '失败',
            //   icon: 'loading',
            //   duration: 2000
            // });
            // if (res.data.errcode =="RES-51012"){
            //   wx.showModal({
            //     title: '',
            //     content: res.data.errmsg,
            //   })
            // }
            // else if (res.data.errcode == "RES-51017") {
            //   wx.showModal({
            //     title: '',
            //     content: res.data.errmsg,
            //   })
            // }
            // else{}
            self.setData({
              disabledSubmitBtn: false
            })
            console.log(res.data)
              wx.showModal({
                title: '',
                content:  res.data.errmsg,
                confirmColor: '#fbb059',
              })
            
          }
          //下面需要删除  只为显示通畅
          //改全局变量标识 在mine页面判断 为true 跳到myorderlist页面
         
          //改全局变量标识 在mine页面判断 为true 跳到myorderlist页面
          // app.globalData.firstLoad = true;
          // self.setData({
          //   successMsg: true
          // })
          // setTimeout(function () {
          //   wx.switchTab({
          //     url: '../../pages/mine/mine',
          //   })
          // }, 2000)
          self.hiddenLoading()
        },
        fail: function (err) {
            console.log("调取接口失败")
            
        },//请求失败
        complete: function () {
        }//请求完成后执行的函数
      })
  },
  go2Store:function(){
    var self = this 
    wx.showModal({
      title: '',
      content: '导航到这里去？',
      confirmColor: '#fbb059',
      success:function(res){
        if(res.confirm){
          wx.openLocation({
            latitude: parseInt(self.data.storesInfo.lat),
            longitude: parseInt(self.data.storesInfo.lon),
            scale: 18,
            name: self.data.storesInfo.name,
            address: self.data.storesInfo.detailAddr
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }

      }
    })
  },
  //显示加载logo
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
  
})