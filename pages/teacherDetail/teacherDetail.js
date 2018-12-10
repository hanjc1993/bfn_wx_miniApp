// pages/teacherDetail/teacherDetail.js
var util = require('../../utils/util.js');
var login = require("../../utils/login.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //评论长度
    evaluateListLength:'',
    showALL:false,
    isFolded: true,
    hiddenLoading:true,
    //时间控件 赋值后再显示
    readyToShowTime: true,
    //门店信息
    storesInfo:"",
    sho: true,
    showScrol: true,
    //当前保存的预约满时的日期
    currFullTime: '',
    hiddenmodalput: false,
    reservationAvailableTime: [],
    // 预约详情列表
    orderList: {
      //选了时间时，此时的时间控件的日期tab值
      finalTab:0,
      //已经选中的时间
      hasCheckedTime:'',
      // token
      accessToken: '',
      // 预约开始时间(yyyy-mm-dd hh:mm；ss)
      startTime: '',
      // 预约显示时间(MM.dd)
      orderTime: '',
      // 选中日期tab
      currentTab: 0,
      // 是否显示时间选择框
      isShowIndex: false,
    },
    // 工作时间
    times: {
      time1000: false,
      time1030: false,
      time1100: false,
      time1130: false,
      time1200: false,
      time1230: false,
      time1300: false,
      time1330: false,
      time1400: false,
      time1430: false,
      time1500: false,
      time1530: false,
      time1600: false,
      time1630: false,
      time1700: false,
      time1730: false,
      time1800: false,
      time1830: false,
      time1900: false,
      time1930: false,
      time2000: false,
      time2030: false,
      time2100: false,
      time2130: false,
      time2200: false,
      time2230: false,
      time2300: false,
      time2330: false,
    },

    // 工作时间
    timesArr: [
      "10:00:00",
      "10:30:00",
      "11:00:00",
      "11:30:00",
      "12:00:00",
      "12:30:00",
      "13:00:00",
      "13:30:00",
      "14:00:00",
      "14:30:00",
      "15:00:00",
      "15:30:00",
      "16:00:00",
      "16:30:00",
      "17:00:00",
      "17:30:00",
      "18:00:00",
      "18:30:00",
      "19:00:00",
      "19:30:00",
      "20:00:00",
      "20:30:00",
      "21:00:00",
      "21:30:00",
      "22:00:00",
      "22:30:00",
      "23:00:00",
      "23:30:00",
    ],

    // 预约满时
    fulltimes: {
      time1000: false,
      time1030: false,
      time1100: false,
      time1130: false,
      time1200: false,
      time1230: false,
      time1300: false,
      time1330: false,
      time1400: false,
      time1430: false,
      time1500: false,
      time1530: false,
      time1600: false,
      time1630: false,
      time1700: false,
      time1730: false,
      time1800: false,
      time1830: false,
      time1900: false,
      time1930: false,
      time2000: false,
      time2030: false,
      time2100: false,
      time2130: false,
      time2200: false,
      time2230: false,
      time2300: false,
      time2330: false,
    },
    // 日期bar
    navbar: [util.getDateStrMMdd(0), util.getDateStrMMdd(1), util.getDateStrMMdd(2), util.getDateStrMMdd(3), util.getDateStrMMdd(4), util.getDateStrMMdd(5), util.getDateStrMMdd(6), util.getDateStrMMdd(7)],

    // 日期Value
    navbarValues: [util.getDateStryyyyMMdd(0), util.getDateStryyyyMMdd(1), util.getDateStryyyyMMdd(2), util.getDateStryyyyMMdd(3), util.getDateStryyyyMMdd(4), util.getDateStryyyyMMdd(5), util.getDateStryyyyMMdd(6), util.getDateStryyyyMMdd(7)],

    // 当前时间
    nowTime: util.formatTime(new Date()).substring(11),
    //养脑师可预约时间段
    nurseList: [],
    //星级
    starNumber: "",
    starList: [],
    evaluateStarList: [],
    evaluateStar: 0,
    //项目List
    projectList: {},

    incloudProjectName: "",
    incloudProjectNameList: [],
    incloudProjectCodeList: [],

    //立即预约按钮
    showBtn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    self.showLoading()
    //页面传过来的属性
    //门店code
    var storeCode = app.globalData.storeCode
    console.log(options)
    // if(options.v==3){
    //   var dto = JSON.parse(options.dtodata)
    //   console.log("到了技师详情页面")
    //   console.log(dto)
    // }else{
    
    //id
    var nurseId = options.uuid;

    //name
    var name = options.name;
    //图片
    var srcImg = decodeURIComponent(options.srcImg); 
    //console.log(171)
    //console.log(srcImg)
    if (srcImg == 'null'){
      srcImg ="../../images/headImage.png"
    }
    //星级
    var star = options.star
    //console.log(161)
    //console.log(srcImg)
    //}
    // if (options.star == "null") {

    //   star = 0
    // }
    self.setData({
      storeCode: storeCode,
      nurseId: nurseId,
      name: name,
      srcImg: srcImg,
      starNumber: star,
      // showALL: false
    })
    //console.log(self.data.nurseId)

    login.checkInitAgree(self, function() {
      self.doInit();
    });
  },
  doInit: function() {
    var self = this;

    var storeCode = self.data.storeCode
    // 获取星级
    self.showStar(self.data.starNumber);
    //获取项目
    self.getPro();
    //获取评价列表
    self.getNurseEvaluate();
    // setTimeout(function () {
      
    // }, 1000)

    
      //获取经纬度
   //self.getStoreInfo(storeCode);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /** 
   * 显示星级
   */
  showStar(star) {


    var self = this;
    var starList = [];

    if (star >= 5) {
      self.setData({
        star: 5
      })
    }
    if (star <= 0) {
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
    self.setData({
      starList: starList
    })

  },
  // 显示加载图层
  showLoading: function() {
    this.setData({
      hiddenLoading: false,
    });
  },
  // 隐藏加载图层
  hideLoading: function() {
    this.setData({
      hiddenLoading: true,
    });
  },

  //得到项目列表
  getPro: function() {
    var self = this;
    var storeCode = self.data.storeCode
  
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/transmission/getProgramList',
      method: 'GET',
      data: {
        storeCode: storeCode
      },
      success: function(res) {
        console.log('得到项目列表')
        console.log(res)
      
        if (res.data.statusCode = 200 && res.data.length!=0) {
          
          var projectList = res.data;
          for (var index = 0; index < projectList.length; index++) {
            //console.log(projectList[index].name)
            if (projectList[index].name.length >=4) {
              projectList[index].name = projectList[index].name.substring(0, 5) + '..'
            }
          }
          //console.log(328)
          self.setData({
            projectList: projectList
          })
          self.checkProject();
        } else {
          wx.showModal({
            title: "请求超时",
            content: "系统繁忙，请稍后重试！",
            showCancel: false,
            confirmColor: '#fbb059',
          });
        }
      },
      fail: function(err) {
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
          confirmColor: '#fbb059',
        });
      }
    });
  },

  //给项目列表添加checked
  checkProject() {
    var self = this
    var projectList = self.data.projectList;
    for (var i = 0; i < projectList.length; i++) {
      projectList[i].checked = true;
    }
    self.setData({
      projectList: projectList
    })

  },

  /**
   * 显示项目
   */
  showScrol() {
    this.setData({
      showScrol: true
    })
  },

  /**
   * 隐藏项目
   */
  hideScrol() {
    this.setData({
      showScrol: false
    })
  },

  /**
   * 展示项目
   */
  getScrol: function(e) {
    var self = this;
    var lenI;
    if (self.data.showScrol == false) {
      self.showScrol();
    } else {
      self.hideScrol();
    }
  },

  //选择项目
  select(e) {
    var projectList = this.data.projectList;
    //多选
    projectList[e.currentTarget.dataset.index].checked = !projectList[e.currentTarget.dataset.index].checked;
    //选中或者 选中后取消的放进数组
    // this.data.incloudProjectNameList.push(projectList[e.currentTarget.dataset.index])
    this.setData({
      projectList: projectList,
    })
    //选择项目改动时，将时间养脑师等内容清空
    var time = "orderList.orderTime";
    var temp = "orderList.currentTab";
    var checkedTime = "orderList.hasCheckedTime"
    var finalTab = "orderList.finalTab"
    this.setData({
      [time]: "",
      [temp]: 0,
      [checkedTime]:'',
      [finalTab]:0
    })
    this.shoeNam();
    this.queryStoreAvailabilityTime(new Date(), null,true);
  },

  //展示名字
  shoeNam() {
    var num = 0;
    var name = ''
    var list = this.data.projectList;
    for (var index in list) {
      if (list[index].checked == false) {
        name = name + ' ' + list[index].name;
        num++;
        if (name.length > 13) {
          name = name.substring(0, 12)+".."
        }
      }
      this.setData({
        incloudProjectName: name,
      })
    }
    this.checkValue();
  },

  // 日期tab切换
  navbarTap: function(e) {
    var self = this;
    self.setData({
      readyToShowTime: true
    })
    //debugger
    
    var temp = "orderList.currentTab";
    self.setData({
      [temp]: e.currentTarget.dataset.idx
    });
    self.getTimeStatus(e.currentTarget.dataset.idx)
    //选日期tab时期 调用门店可预约时间段接口
    //console.log("选日期tab时期 调用门店可预约时间段接口");
    //console.log(new Date(self.data.navbarValues[self.data.orderList.currentTab]));
    //console.log(e)
    self.queryStoreAvailabilityTime(new Date(self.data.navbarValues[self.data.orderList.currentTab]), e,false);
  },

  /**
   * 显示时间框
   */
  orderTime: function(e) {
    var self = this;
    var flag = "orderList.isShowIndex"
    if(self.data.orderList.isShowIndex==true){
      self.setData({
        [flag]:false
      })
    }else{
     
      self.setData({
        readyToShowTime: true
      })
      //选了项目才可以选时间
      if (self.data.incloudProjectName != "") {
        self.showLoading()
        var temp = "orderList.isShowIndex";
        var temp9 = "orderList.currentTab";
        var isShowIndex = self.data.orderList.isShowIndex;
        if (isShowIndex == true) {
          self.setData({
            [temp]: false,
          });
        } else {
          self.setData({
            [temp]: true,
            [temp9]:self.data.orderList.finalTab
          });
        }
        //self.getTimeStatus(self.data.orderList.currentTab);
        var e = { currentTarget: { dataset: { idx: self.data.orderList.currentTab } } }
        //获取养脑师可预约时间段
        self.queryStoreAvailabilityTime(new Date(self.data.navbarValues[self.data.orderList.currentTab]), e,false);
      } else {
        this.setData({
          popErrorMsg: "请选择项目"
        })
        app.ohShitfadeOut(this);
        return
      }
    }
    
  },

  /**
   * 查询门店可预约时间段
   */
  queryStoreAvailabilityTime: function(theDay, e,isProject) {
    var self = this;
    var year = theDay.getFullYear().toString()
    var mon = (theDay.getMonth() + 1).toString()
    if (mon < 10) {
      mon = "0" + mon
    }
    var day = theDay.getDate()
    if (day < 10) {
      day = "0" + day
    }
    var dtoDate = year + mon + day
    var list = self.data.projectList;
    var codeList = []
    for (var index in list) {
      if (list[index].checked == false) {
        var code = {
          code: list[index].uuid
        }
        codeList.push(code)
      }
    };
    self.setData({
      incloudProject: codeList
    })
    if (self.data.incloudProject.length == 0) {
      var temp = "orderList.isShowIndex";
      self.setData({
        [temp]: false,
      });
      return
    }
    // 发起网络请求 获取套餐信息
    //self.showLoading();
    wx.request({
      url: app.globalData.path + 'rest/res/getReservationTimeRange',
      method: 'GET',
      data: {
        storeCode: self.data.storeCode,
        date: dtoDate,
        vipNo: '',
        prjUuid: self.data.incloudProject[0].code, //此属性待商榷啊，本应该是个数组
      },
      success: function(res) {
        //self.hideLoading();
        //console.log("111111111111111111111")
        console.log(res)
        if (res.data.errcode == 0) {
          var list = res.data.nurse;
          var storeTime = res.data.reservationAvailableTime;
          if (list.length != 0) {
            for (var index in list) {
              if (list[index].nurseCode == self.data.nurseId) {
                var nurseList = list[index].reservationAvailableTime;
                self.setData({
                  nurseList: nurseList,
                })
              }
            }
          }else{
            self.setData({
              nurseList: [],
            })
          }
          // self.setData({
          //   reservationAvailableTime: storeTime,
          // })
          //给时间控件赋值
          if (e != null && !isProject) {
            //console.log("不是当天的e")
            self.getTimeStatus(e.currentTarget.dataset.idx)
            //self.hideLoading()
          } else {
            if (!isProject){
              self.getTimeStatus(0)
            }              
          }
        }else {
          wx.showModal({
            title: "请求超时",
            content: "系统繁忙，请稍后重试！",
            showCancel: false,
            confirmColor: '#fbb059',
          });
        }
      },
      fail: function(err) {
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
          confirmColor: '#fbb059',
        });
      }
    });
    //self.hideLoading()
  },

  /**
   * 选择服务时间
   */
  chooseTime: function(e) {
    var self = this;
    var temp1 = "orderList.orderTime";
    var temp2 = "orderList.isShowIndex";
    var temp3 = "orderList.hasCheckedTime"
    var temp4 = "orderList.finalTab"
    var curtime = self.data.navbarValues[self.data.orderList.currentTab] + " " + e.currentTarget.dataset.item.substring(0, 5)
    curtime = curtime.substring(11,16)
    //console.log(curtime)
    self.setData({
      [temp1]: self.data.navbarValues[self.data.orderList.currentTab] + " " + e.currentTarget.dataset.item.substring(0, 5),
      [temp2]: false,
      [temp3]:curtime,
      [temp4]: self.data.orderList.currentTab
    })
    self.checkValue();
  },

  // 时间状态
  getTimeStatus: function(e) {
    var self = this;
    self.showLoading()
    var timeTemp = {
      time1000: false,
      time1030: false,
      time1100: false,
      time1130: false,
      time1200: false,
      time1230: false,
      time1300: false,
      time1330: false,
      time1400: false,
      time1430: false,
      time1500: false,
      time1530: false,
      time1600: false,
      time1630: false,
      time1700: false,
      time1730: false,
      time1800: false,
      time1830: false,
      time1900: false,
      time1930: false,
      time2000: false,
      time2030: false,
      time2100: false,
      time2130: false,
      time2200: false,
      time2230: false,
      time2300: false,
      time2330: false,
    }
    self.setData({
      times: timeTemp,
      fulltimes: timeTemp
    });
    //得到门店预约最早时间和 最晚时间
    var minTime = '10:00:00' //所有时间的最小时间，（开始时间）
    var maxTime = '23:30:00' //所有时间的最大时间，（打烊时间）
    var list = []
    var list1 = []
    //根据时间给页面的disable赋值
    for (var index1 in self.data.nurseList) {
      for (var index2 in self.data.timesArr) {
        if (e == 0) { //当前时间
          if (self.data.nurseList[index1].startTime.substring(11) <= self.data.timesArr[index2] && self.data.timesArr[index2] <= self.data.nurseList[index1].endTime.substring(11) && self.data.nowTime <= self.data.timesArr[index2]) {
            var temp = "times.time" + self.data.timesArr[index2].substring(0, 5).replace(':', '');
            list.push(self.data.timesArr[index2])
            self.setData({
              [temp]: true
            });
          }
        } else {
          if (self.data.nurseList[index1].startTime.substring(11) <= self.data.timesArr[index2] && self.data.timesArr[index2] <= self.data.nurseList[index1].endTime.substring(11)) {
            var temp = "times.time" + self.data.timesArr[index2].substring(0, 5).replace(':', '');
            list.push(self.data.timesArr[index2])
            self.setData({
              [temp]: true
            });
          }
        }
      }
    }
    if (e == 0) {
      for (var index in self.data.timesArr) {
        if (self.data.timesArr[index] >= minTime && self.data.timesArr[index] >= self.data.nowTime && self.data.timesArr[index] <= maxTime) {
          list1.push(self.data.timesArr[index])
        }
      }
    } else {
      for (var index in self.data.timesArr) {
        if (self.data.timesArr[index] >= minTime && self.data.timesArr[index] <= maxTime) {
          list1.push(self.data.timesArr[index])
        }
      }
    }
    //将可用时间 和可预约时间段的时间相减
    for (var index in list1) {
      for (var i in list) {
        if (list[i] == list1[index]) {
          list1.splice(index, 1)
        }
      }
    }
    //筛选出了可预约时间段内的预约满的时间，进行赋值
    for (var index in list1) {
      var temp1 = "fulltimes.time" + list1[index].substring(0, 5).replace(':', '');
      var temp = "times.time" + list1[index].substring(0, 5).replace(':', '');
      self.setData({
        [temp1]: true,
        [temp]: true
      })
    }
   
    setTimeout(function () {
      self.setData({
        readyToShowTime: false
      })
      self.hideLoading()
    }, 500) //延迟时间 这里是1秒
    
  },

  /**  检测页面 必填项是否已经填写   */
  checkValue: function() {
    var list = this.data.orderList
    var incloudProjectName = this.data.incloudProjectName;
    if (incloudProjectName != '' && incloudProjectName != '请选择' && list.orderTime != '' && list.orderTime != '请选择') {
      this.setData({
        showBtn: false
      })
    } else {
      this.setData({
        showBtn: true
      })
    }
  },

  //预约满时
  yoyakuFullTime: function(e) {
    var self = this
    var times = self.data.navbarValues[self.data.orderList.currentTab] + " " + e.currentTarget.dataset.item.substring(0, 8)
    //console.log(times)
    wx.showModal({
      title: '',
      content: '该养脑师的当前时间预约已排满，是否查看其他养脑师?',
      confirmColor: '#fbb059',
      success:function(res){
        if(res.confirm){
          self.setData({
            //hiddenmodalput: true,
            currFullTime: times
          })
          self.go2otherStore()
        }
      }
    })
    //var dtoTime = Date.parse(times)
    // self.setData({
    //   hiddenmodalput: true,
    //   currFullTime: times
    // })
  },

//预约满时跳转
  go2otherStore: function() {
    var storeCode = app.globalData.storeCode
    //console.log("点了预约满的时间")
    //console.log(this.data.currFullTime)
    var list = this.data.projectList;
    var codeList = []
    for (var index in list) {
      if (list[index].checked == false) {
        var code = {
          code: list[index].uuid
        }
        codeList.push(code)
      }
    };
    var incloudProjectCode = JSON.stringify(codeList);
    wx.navigateTo({
      url: '../../pages/teacherList/teacherList?storeCode=' + storeCode + '&orderTime=' + this.data.currFullTime + '&v=5' + '&incloudProjectCode=' + incloudProjectCode + '&nurseCode=' + this.data.nurseId
    })
    //console.log(737)
    var arr=new Array(10)
    //console.log(arr)
    // this.setData({
    //   hiddenmodalput: false
    // })
  },
  // go2otherStore: function () {
  //   //v=3
  //   var lat = this.data.storesInfo.lat
  //   var lon = this.data.storesInfo.lon

  //   var list = this.data.projectList;
  //   var codeList = []
  //   for (var index in list) {
  //     if (list[index].checked == false) {
  //       var code = {
  //         code: list[index].uuid
  //       }
  //       codeList.push(code)
  //     }
  //   };
  //   var prjUuid = codeList[0].code
  //   var reservationTime = this.data.currFullTime
  //   console.log(lat + "," + lon + "," + prjUuid + "," + reservationTime)
  //   console.log("我要去别的门店")
  //   wx.navigateTo({
  //     url: '../../pages/selectStores/selectStores?reservationTime=' + reservationTime + "&prjUuid=" + prjUuid + "&lon=" + lon + "&lat=" + lat + "&v=3",
  //   })
  // },

  //是否跳转
  goOrderPage(e) {
    var self = this;
    var currentTab = self.data.orderList.currentTab
    //console.log(703703703)
    //console.log(self.data.orderList.currentTab)
    var list = self.data.projectList;
    var codeList = []
    for (var index in list) {
      if (list[index].checked == false) {
        var code = {
          code: list[index].uuid
        }
        codeList.push(code)
      }
    };
    var incloudProjectName = self.data.incloudProjectName
    var incloudProjectCode = JSON.stringify(codeList);
    var orderStore = self.data.storeCode;
    var nurseCode = self.data.nurseId;
    var orderTime = self.data.orderList.orderTime + ":00";
    //console.log(718)
    //console.log(orderTime)
    var nurseCodeName = self.data.name;
    wx.navigateTo({
      url: '../order/order?orderStore=' + orderStore + '&incloudProjectName=' + incloudProjectName + '&incloudProjectCode=' + incloudProjectCode + '&nurseCode=' + nurseCode + '&currentTab=' + currentTab+ '&orderTime=' + orderTime + '&nurseCodeName=' + nurseCodeName + '&v=3',
    })
  },
  cancel: function() {
    this.setData({
      hiddenmodalput: false
    })
  },

  //评论接口
  getNurseEvaluate: function() {
    var self = this;
    var eList = []
    var nurseId = self.data.nurseId
    self.showLoading();
    wx.request({
      url: app.globalData.path + 'rest/RzEvaluateRest/getNurseEvaluateLst',
      method: 'GET',
      data: {
        nurseId: nurseId
      },
      success: function(res) {
        console.log('评价接口');
        console.log(res);

        self.hideLoading();
        if (res.data.statusCode = 200) {
          var evaluateList = res.data;
          if (evaluateList.length != 0) {
            var evaluateListLength = evaluateList.length
            self.setData({
              evaluateListLength: evaluateListLength,
            
            })
        
            for (var i = 0; i < evaluateList.length; i++) {
              //显示星级
              self.showEvaluateStar(evaluateList[i].evaluateScore);
              evaluateList[i].evaluateStarList = self.data.evaluateStarList;
              //改变时间戳
              var tim = self.getDateDiff(evaluateList[i].evaluateTime);
              evaluateList[i].evaluateTime = tim;
              //名字长度限制
              if (evaluateList[i].userName != null && evaluateList[i].userName.length > 2) {
                var nameLenght = evaluateList[i].userName.length
                evaluateList[i].userName = evaluateList[i].userName.charAt(0) + '****' + evaluateList[i].userName.charAt(nameLenght - 1);
              } else if (evaluateList[i].userName != null && evaluateList[i].userName.length <= 2) {
                evaluateList[i].userName = evaluateList[i].userName.charAt(0) + '****'
              }
              //评价内容
              if (evaluateList[i].evaluateContent == null){
                evaluateList[i].evaluateContent =' '
              }
              //是否显示全文按钮
              if (evaluateList[i].evaluateContent != null && evaluateList[i].evaluateContent.length > 70) {
                evaluateList[i].isShowBtn = true
              } else {
                evaluateList[i].isShowBtn = false
              }
            }
            if (evaluateList.length >= 3){
              for (var i = 0; i < 3; i++) {
                eList.push(evaluateList[i])
              }
            } else if(evaluateList.length < 3 && evaluateList.length !=0){
              for (var i = 0; i < evaluateList.length; i++) {
                eList.push(evaluateList[i])
              }
            }
            var eListLength = eList.length
            //console.log(865)
            self.setData({
              eList: eList,
              sho: true,
              showAll: true,
              eListLength:eListLength
            })
            //console.log(self.data.showAll)
          } else {
            self.setData({
              sho: false,
              showAll: true
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
        
        // self.setData({
        //   showAll: true
        // })
      },
      fail: function(err) {
        self.setData({
          showAll: true
        })
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
    } else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else {
      result = "刚刚";
    }

    return result;
  },
  
  /**
   * 评价更多
   */
  goEvaluationDetailPage() {
    var self = this;
    var nurseId = self.data.nurseId;
    wx.navigateTo({
      url: "../evaluationDetail/evaluationDetail?nurseId=" + nurseId,
    })
  },
  change: function (e) {
    this.setData({
      isFolded: !this.data.isFolded,
    })
  }


  // getStoreInfo: function (storeCode) {
  //   var self = this;
  //   wx.request({
  //     url: app.globalData.path + 'rest/transmission/getStoreInfo',
  //     method: 'GET',
  //     data: {
  //       storeCode: storeCode,
  //     },
  
  //     success: function (res) {
  //       console.log("打印门店信息")
  //       console.log(res);
  //       if (res.data.length != 0) {
  //         self.setData({
  //           // 一个门店信息的信息
  //           storesInfo: res.data[0],
  //         })
  //       }
  //       console.log("打印门店信息")
  //       console.log(self.data.storesInfo);
     
  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     },//请求失败
  //     complete: function () {

  //     }//请求完成后执行的函数
  //   })
  // },
})