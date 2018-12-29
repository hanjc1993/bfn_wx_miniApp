// pages/yoyakuCheckPage/yoyakuCheckPage.js
// pages/yoyakuPage/yoyakuPage.js
const app = getApp()
var login = require("../../utils/login.js");
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    /** 本页面用到的 */
    evaluateStatus: false,
    technician:'',
    time:'',
    status:'',
    storeNameForTitle:'',
    storeName:'',
    longName:'',
    projectName:'',
    reservationCode:'',
    nurseCode:'',
    storeCode:'',
    orderCode:'',
    //
    welCome:'',
    showWelcomeImg:'',
    welComeImage:'',
    showWelcomeText:'',
    //isEvaluated:false,
    hiddenLoading:true,
    hiddenmodalput:false,
    remark:'',//新增备注
  },
  checkboxChange: function (e) {
    console.log(e)
    var projectid = e.detail.value;
    var list = this.data.checkedProjectList;
    list.push(projectid)
    this.setData({
      checkedProjectList: list
    })

    console.log(this.data.checkedProjectList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var status = options.status;
    var technician = options.technician;
    var projectName = options.projectName;
    var storeName = options.storeName;
    var time = options.time;
    var reservationCode = options.reservationCode;
    var vipNo = options.vipNo;
    var storeCode = options.storeCode;
    var nurseCode = options.nurseCode;
    var orderCode = options.orderCode;
    console.log(status + "," + technician + "," + projectName + "," + storeName + "," + time)
    var longName = ''
    // if(storeName.length>8){
    //   var titleName = "预约成功，" + storeName
    //       longName = "全体员工恭候您的莅临！"
    // }else{
      var titleName = "预约成功，" + storeName + "全体员工恭候您的莅临！"
      console.log(titleName.length)
    if (titleName.length>18){
      this.setData({
        welCome:'welCome',
        showWelcomeImgView:"showWelcomeImgViewLong",
        welComeImage:"welComeImgLong",
        showWelcomeText:"showWelcomeTextLong"
      })
    }else{
      this.setData({
        welCome: 'welComeShort',
        showWelcomeImgView: "showWelcomeImgViewShort",
        welComeImage: "welComeImgShort",
        showWelcomeText: "showWelcomeTextShort"
      })
    }
    // }
    var self = this;
    if (status=='已到店'){//如果是结束状态 需调接口判断是否已经评价
      login.checkInitAgree(self, function () {
        self.doInit(orderCode);
      });
    }
    self.setData({
      time: time,
      projectName: projectName,
      longName: longName,
      storeName: storeName,
      storeNameForTitle: titleName,
      technician: technician,
      status:status,
      reservationCode: reservationCode,
      nurseCode: nurseCode,
      storeCode: storeCode,
      orderCode: orderCode,
      remark:options.remark
    })
    console.log(options.status)
  },
  doInit(orderCode){
    var self = this
    self.showLoading()
    self.getEvaluate(orderCode)
    self.evalationSwitch()//评价开关
    self.hideLoading()
  },
  // 评价按钮开关
  evalationSwitch: function () {
    var self = this
    wx.request({
      url: app.globalData.path + 'rest/RzEvaluateSettingRest/getEvaluateSettingDetail',
      success: function (res) {
        console.log("评价开关")
        console.log(res)
        self.setData({
          evaluateStatus: res.data.evaluateStatus,
          //suggestionStatus: res.data.suggestionStatus
        })
      },
      fail: function (err) {
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
          confirmColor: '#fbb059',
        });
      }
    })
  },
  //通过评论接口返回数据判断是否已经评价
  getEvaluate: function (orderCode){
    var self = this
    
    wx.request({
      url: app.globalData.path + 'rest/RzEvaluateRest/searchEvaluateByOrderNum?orderNum=' + orderCode,
      success: function (res) {
        if (res.data.length==0|res.data == '' | res.data == null) {
          self.setData({
            isEvaluated: true
          })
        }else{
          self.setData({
            isEvaluated: false
          })
        }
      },
      fail: function (err) {
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
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
    this.getEvaluate(this.data.orderCode)
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
  listenerRadioGroup: function (e) {
    if (this.data.isChecked == false) {
      var list = this.data.yoyakus;
      if (list.length < 5) {
        list.push(1);
        this.setData({
          isChecked: false
        })
        this.setData({
          yoyakus: list
        })
      }
    } else {
      this.setData({
        isChecked: false
      })
    }
  },
  radioChange: function (e) {
    this.setData({
      checkedTechnicianId: e.detail.value
    })
  },
  saveTechnician: function () {
    if (this.data.checkedTechnicianId != '') {
      for (var index in this.data.technicianList) {
        if (this.data.checkedTechnicianId == this.data.technicianList[index].technicianId) {
          this.setData({
            checkedTechnicianName: this.data.technicianList[index].technicianName,
            isShowTechnician: false
          })
        }
      }
    }
    this.hideModal()
  },
  delFriends: function (e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.yoyakus;
    list.splice(index, 1);
    this.setData({
      yoyakus: list
    })
  },
  yoyakuTime: function (e) {
    if (e.currentTarget.dataset.index == 0) {
      this.setData({
        isShow: true,
        yoyakuTime: ''
      })
    }

  },
  chooseTechnician: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.index == 0) {
      this.setData({
        isShowTechnician: true
      })
    }
  },
  clickDaohang:function(){
    // this.setData({
    //   hiddenmodalput: true
    // })
    var self = this
    wx.showModal({
      title: '',
      content: '立即导航去预约门店?',
      confirmText:"导航",
      confirmColor: '#fbb059',
      success:function(res){
        if(res.confirm){
          self.go2Store()
        }
      }
    })
  },
  go2Store: function (e) {
    console.log('约定门店')
    var self = this;
    // this.setData({
    //   hiddenmodalput: false
    // })
    var storeCode = self.data.storeCode
    console.log(storeCode)
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: storeCode,
        //cityCode: self.data.positionCode,
        //name: self.data.storeName,
      },
      // header: {//请求头
      //   "Content-Type": "application/json"
      // },
      success: function (res) {
        if (res.data.length != 0) {
          self.setData({
            // 一个门店信息的信息
            storesInfo: res.data[0],
          })
          console.log("打印门店信息")
          console.log(self.data.storesInfo);
          wx.openLocation({
            latitude: parseInt(self.data.storesInfo.lat),
            longitude: parseInt(self.data.storesInfo.lon),
            scale: 18,
            name: self.data.storesInfo.name,
            address: self.data.storesInfo.detailAddr
          })
        }else{
          wx.showModal({
            title: '',
            content: '没有找到门店定位信息',
            confirmColor: '#fbb059',
          })
        }
        // self.setData({
        //   // 一个门店code
        //   //storeCode: res.data[0].uuid,
        // })
        
        // 获取项目列表
        //self.getProjects(storeCode);
        // 获取养脑师
        //self.getNurses(storeCode);
      },
      fail: function (err) {
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
    })
  },
  cancel:function(){
    this.setData({
      hiddenmodalput:false
    })
  },
  /**
* 获取门店信息 经纬度等
*/
  getStoreInfo: function (storeCode) {
    var self = this;
    wx.request({
      url: app.globalData.path + 'rest/transmission/getStoreInfo',
      method: 'GET',
      data: {
        storeCode: storeCode,
        //cityCode: self.data.positionCode,
        //name: self.data.storeName,
      },
      // header: {//请求头
      //   "Content-Type": "application/json"
      // },
      success: function (res) {
        console.log(res)
        if (res.data.length != 0) {
          self.setData({
            // 一个门店信息的信息
            storesInfo: res.data[0],
          })
        }
        // self.setData({
        //   // 一个门店code
        //   //storeCode: res.data[0].uuid,
        // })
        console.log("打印门店信息")
        console.log(self.data.storesInfo);
        // 获取项目列表
        //self.getProjects(storeCode);
        // 获取养脑师
        //self.getNurses(storeCode);
      },
      fail: function (err) {
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
    })
  },
  yoyakuProject: function (e) {
    this.setData({
      isShowProject: true,
      checkedProjectList: [],
      checkedProjectName: ''
    })
  },
  saveProject: function (e) {
    var name = ''
    for (var index in this.data.projectList) {
      for (var i in this.data.checkedProjectList) {
        if (this.data.projectList[index].projectId == this.data.checkedProjectList[i]) {
          console.log(this.data.projectList[index].projectName + '1111111111111')
          name = name + ' ' + this.data.projectList[index].projectName
        }
      }
    }
    this.setData({
      isShowProject: false,
      checkedProjectName: name,

    })
    this.hideModal();
  },
  whenChanel: function () {
    this.setData({
      isShowProject: false,
      isShowTechnician: false,
      checkedProjectList: [],
      checkedProjectName: ''
    })
    this.hideModal();
  },
  isOk: function () {
    var page = this;
    if (page.data.yoyakuProject != '' && page.data.yoyakuStroe != '' && page.data.yoyakuTime != '') {
      page.setData({
        isOk: "bottom_btn1"
      })
    }
  },
  navbarTap: function (e) {
    console.log(e);
    console.log(e.currentTarget.dataset.idx);
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    this.setData({
      yoyakuTime: e.currentTarget.dataset.yoyakudate
    })
  },
  chooseTime: function (e) {
    console.log(e.currentTarget.dataset.item);
    if (this.data.yoyakuTime == '') {
      this.setData({
        yoyakuTime: this.data.navbar[0],
      })
    }
    var time = this.data.yoyakuTime;
    time = time + '日' + e.currentTarget.dataset.item
    console.log(time)
    this.setData({
      yoyakuTime: time,
      isShow: false
    })
  },
  /**
  * 隐藏模态对话框
  */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  /** dialog的JS */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },

  // 消费记录详情
  chooseConsumptionRecords: function (e) {
    
  },
  //去评价
  go2Evaluate:function(e){
    var self = this
    console.log(self.data.orderCode)
    wx.navigateTo({
      url: '../../pages/consumptionRecordsDetail/consumptionRecordsDetail?code=' + self.data.orderCode,
    })
  },
  //取消预约
  cancelOrder:function(e){
    var self = this
    console.log(self.data.reservationCode)
    wx.showModal({
      title: '',
      content: '确定取消吗？',
      confirmColor: '#fbb059',
      success:function(res){
        if(res.confirm){
          self.showLoading()
          wx.request({
            url: app.globalData.path + 'rest/res/cancelReservation',
            data: {
              reservationCode: self.data.reservationCode,
             //accessToken:'YUIEGDNjBmxmf3VDY0QHU3xmbAQs6dOV5XWLDu'
            },
            method: 'post',
            // header: {//请求头
            //   "Content-Type": "applciation/json"
            // },
            success: function (res) {
              console.log("取消预订返回结果")
              console.log(res)
              if(res.data.errcode==0){
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 1000
                  });
                  //需跳转页面
                //app.globalData.firstLoad = true;
                // wx.switchTab({
                //   url: '../../pages/mine/mine',
                // }) 

                setTimeout(function () {
                  self.hideLoading()
                   wx.navigateBack({
                    delta: 1,
                  });                 
                }, 1000)
              } else {
                self.hideLoading()
                  wx.showToast({
                    title: '失败',
                    icon: 'loading',
                    duration: 2000
                  })
              }
            },
            fail: function (err) {
              self.hideLoading()
              console.log(err)
            },//请求失败
            complete: function () {

            }//请求完成后执行的函数
          })
        }else if(res.cancel){
             //点击取消 无需任何动作
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
})