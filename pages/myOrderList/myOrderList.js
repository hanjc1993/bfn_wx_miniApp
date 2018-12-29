// pages/orderList/orderList.js
const app = getApp();
var login = require("../../utils/login.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // items: [{asdasd: false}],
    // 加载中
    hiddenLoading: true,
    // 开始坐标
    startX: 0,
    startY: 0,
    items:[],
    hasNoData:false,
    backButton: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var vipNo = app.globalData.vipNo;
    if (options.source == 1){
      self.setData({
        backButton: true
      });
    } else {
      self.setData({
        backButton: false
      });
    }
    console.log(vipNo != '');
    if(vipNo!=''){
     login.checkInitAgree(self, function(){
         self.doInit(vipNo);
     });
    }else{
      self.setData({
        hasNoData:true
      })
    }
  },
  doInit: function (vipNo){
    var self = this 
   // self.getOrderList(vipNo)
  },
  //获取预约列表
  getOrderList:function(vipNo){
    var self = this
    self.showLoading();
    wx.request({
      url: app.globalData.path +'rest/res/getReservationList',
      data: { vipNo: vipNo },//S27395
      method: 'get',
      // header: {//请求头
      //   "Content-Type": "application/json"
      // },
      success:function(res){
        console.log("得到我的订单List")
        console.log(res)
        if (res.data.reservations.length != 0) {
          var list = res.data.reservations
          var totalList = []
         // var togetherList = []
          for(var index in list){
            totalList.push(list[index])
            if (list[index].togethers!=null){
              for(var i in list[index].togethers){
               var togetherList = list[index].togethers[i]
                //list.push(togetherList)
                totalList.push(togetherList)
              }
            }
          }
          for (var i = 0; i < totalList.length;i++){
            var currName = ''
            for (var j = 0; j < totalList[i].incloudProject.length;j++){
              if (j != totalList[i].incloudProject.length-1){
                currName += totalList[i].incloudProject[j].projectName + '+'
              }else{
                currName += totalList[i].incloudProject[j].projectName
              }
              if (j == totalList[i].incloudProject.length - 1){
                if (totalList[i].together == false&&currName.length>9){
                  currName = currName.substring(0, 10) + '..'
                } else if (totalList[i].together == true && currName.length >= 7){
                  currName = currName.substring(0, 7) + '..'
                }
                totalList[i].totalName = currName
              } 
            }
            if(totalList[i].storeName.length>10){
              totalList[i].storeName = totalList[i].storeName.substring(0,10) + '..'
            }
          }
          self.setData({
            items: totalList,
            hasNoData: false
          })
        }else{
          self.setData({
            hasNoData:true
          })
        }
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
  go2Detail:function(e){
      var index = e.currentTarget.id;
      console.log("编号"+index)
      var list = this.data.items;
      var currProjectName = '';
      console.log(list[index])
      if(list[index].incloudProject.length==1){
        currProjectName = list[index].incloudProject[0].projectName
      } else if (list[index].incloudProject.length==2){
        currProjectName = list[index].incloudProject[0].projectName + " " + list[index].incloudProject[1].projectName
      }else{
        currProjectName = list[index].incloudProject[0].projectName + "..（共" + list[index].incloudProject.length + "项）"
      }
      wx.navigateTo({
        url: '../../pages/myOrderListDetail/myOrderListDetail?storeName=' + list[index].storeName + "&projectName=" + list[index].totalName + "&status=" + list[index].status + "&technician=" + list[index].nurseName + "&time=" + list[index].startTime + "&vipNo=" + list[index].vipNo + "&reservationCode=" + list[index].reservationCode + "&nurseCode=" + list[index].nurseCode + "&storeCode=" + list[index].storeCode + "&orderCode=" + list[index].orderCode +`&remark=${list[index].remark}`,
      })
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
    var self = this;
    login.checkInitAgree(self, function () {
      var vipNo = app.globalData.vipNo
      // this.getOrderList(vipNo)
      if (vipNo != '') {
        self.getOrderList(vipNo)
        // login.checkInitAgree(self, function () {
        //   self.doInit(vipNo);
        // });
      } else {
        self.setData({
          hasNoData: true
        })
      }
    });
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
    //reservationCode 换取  用于调接口删数据
    var self =this
    var reservationCode = self.data.items[e.currentTarget.dataset.index].reservationCode;
    // var param = {
    //   reservationCode: reservationCode
    // }
    console.log("删除的订单编号为：" + reservationCode)
    wx.request({
      url: app.globalData.path + 'rest/res/deleteReservation?reservationCode=' + reservationCode,
      // data: {
      //   reservationCode: reservationCode,
      // },
      // header:{
      //   'Content-Type':'application/json'
      // },
        method:'post',
        success:function(res){
          console.log(res)
          if(res.data.errcode==0){//接口不对  展示用
            self.data.items.splice(e.currentTarget.dataset.index, 1)
            self.setData({
              items: self.data.items
            });
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
          }else{
            // wx.showToast({
            //   title: '失败',
            //   icon:'loading',
            //   duration:1000
            // })
            if (res.data.errcode =="RES-52005")
            wx.showModal({
              title: '',
              content: res.data.errmsg,
              confirmColor: '#fbb059',
            })
          }
        }
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

  gotoMinePage: function () {
    wx.switchTab({
      url: "/pages/mine/mine",
    })
  },
})