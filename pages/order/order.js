// pages/yoyakuPage/yoyakuPage.js
// pages/yoyakuPage/yoyakuPage.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var login = require("../../utils/login.js");
var interval = null //倒计时函数
//var Promise = require('./es6-promise.auto.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断currtab
    currtab:'',
    //判断是从养脑师页面来的时候 v=3 此时需要调时间接口的
    v:'',
    //属性接收是本人为null 是同行人这是同行人的下标
    whoAreYou:'',
    //list用来存放被选了的时间点
    haveBeenCheckedTimeList:[],
    //technicianList 本人选完时间筛选后的养脑师放这里
    technicianListCanUsed:[],
    //同行人项目是否和本人一样
    isSameAspartner:true,
    thelistlength:'',
    thelist:[],
    //flist:[],
    //时间变红的情况 免费预约按钮需要置灰 所以多加一个属性控制
    //isTimeOk:true,
    //（选择时间后）当前时间可用的养脑师人数
    currTimeNurseCount:'',
    //当前门店的可预约养脑师人数来控制同行人的数目
    nurseCount:'',
    //同行人选养脑师 控制养脑师显示的flag
    //isShowTechnicianTogether:false,
    //临时存放选中的项目code
    currPjCode:[],
    //时间控件 赋值后再显示
    readyToShowTime: true,
    //检测是否点击获取验证码
    areadyGetYzm:false,
    //注册使用的参数
    union_id:'',
    //验证码按钮的颜色控制
    jihuo:false,
    //注册时 换地区  输入的电话号清空
    phonecash:'',
    //验证码  换电话号时  清空
    yzmcash:'',
    //验证码符合规范
    yzmRight:false,
    //当前保存的预约满时的日期
    currFullTime:'',
    //获取微信昵称和性别
    nickName:'',
    //onGotUserInfo方法 得到的微信使用人的性别
    gender:'',
    //默认隐藏加载
    hiddenLoading:true,
    //获取验证码
    time: '获取', //倒计时 
    //倒计时的时间
    currentTime: 61,
    //倒计时期间 获取验证码按钮不可点击
    disabled:true,
    // 星级（1-5）
    // stars1: false,
    // stars2: false,
    // stars3: false,
    // stars4: false,
    // stars5: false,

    //选养脑师的与否 确定按钮的颜色控制
    isCheckedTechnician:false,
    //添加同行人的btn选中状态
    addBtnIsChecked:false,
    //未填提示
    popErrorMsg:'',
    //选择地区的数组
    areaList: [
      {
        id: 0,
        name: "中国大陆",
        areaCode: "86",
        checked: true

      },
      {
        id: 1,
        name: "中国香港",
        areaCode: "852",
        checked: false
      },
      {
        id: 2,
        name: "中国澳门",
        areaCode: "853",
        checked: false
      },
    ],
    isShowConfirmBtn:0,
    hiddenmodalchoosearea: false,
    area: '中国大陆',
    areaId: '0',
    //选择的地区编号
    areaCode: '86',
    //输入的电话号
    phoneNumber: '',//18640887833
    //输入的验证码
    yzmCode:'',
    hiddenmodalbindphone: false,

    reservationAvailableTime: [],
    //同行人数组下标，用于赋值
    partnerIndex:'',
    // 预约详情列表
    orderList: {
      //选了时间后才存的时间tab值
      finalTab:0,
      //选中的时间状态
      checkedTimeForStatus:'',
      // 1点排  2轮排
      nurseType:2,
      // token
      accessToken: '',
      // 预约开始时间(yyyy-mm-dd hh:mm；ss)
      startTime: '',
      // 预约显示时间(MM.dd)
      orderTime: '',
      // 预约项目
      incloudProject: [],
      // 预约项目code
      incloudProjectCode: '',
      // 预约项目名称
      incloudProjectName: '',
      // 项目编码
      code: '',
      // 预约类型
      type: '',
      // 预约护理师编码
      nurseCode: '',
      // 预约护理师名称
      nurseCodeName: '',
      // 备注
      remark: '本人',
      // 门店编码
      storeCode: '',
      // 门店名称
      orderStore: '',
      // 预约会员编码
      vipNo: '',
      // 同行用户
      togethers: [],

      // 选中日期tab
      currentTab: 0,
      // 是否显示时间选择框
      isShowIndex: false,
      //确定按钮变化
      isShowConfirmBtn:0,
      //技师ID
      technicianId:'',
      //城市名称
      cityName:'',
      //城市code
      cityCode:''
    },
      //门店信息 纬度啥的
    storesInfo:'',
    // 预约同行人详情
    togetherList: {
      //最终选择的时间tab为
      finalTab:'',
      //选中的时间状态
      checkedTimeForStatus: '',
      // 预约开始时间(yyyy-mm-dd hh:mm；ss)
      startTime: '',
      // 预约显示时间(MM.dd)
      orderTime: '',
      // 预约项目
      incloudProject: [],
      // 预约项目名称
      incloudProjectName: '-',
      // 预约类型
      type: '',
      // 备注
      remark: "同行人",

      // 同行人序号
      currentTabIndex: 0,
      // 选中日期tab
      currentTab: 0,
      // 是否显示时间选择框
      isShowIndex: false,
      isShowConfirmBtn: 0,
      //2轮排
      nurseType:2,
      isTimeOk:true
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
      time0000: false,
      time0030: false,
      time0100: false
    },
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
      time0000: false,
      time0030: false,
      time0100: false
    },


    // 工作时间，有使用它的index判断的逻辑，修改时候一定注意
    timesArr: [
      "10:00:00",
      "10:30:00",
      "11:00:00",
      "11:30:00",
      "12:00:00",//有使用timesArr的index判断的逻辑，修改时候一定注意
      "12:30:00",
      "13:00:00",
      "13:30:00",
      "14:00:00",
      "14:30:00",
      "15:00:00",
      "15:30:00",
      "16:00:00",
      "16:30:00",//有使用timesArr的index判断的逻辑，修改时候一定注意
      "17:00:00",
      "17:30:00",
      "18:00:00",
      "18:30:00",
      "19:00:00",
      "19:30:00",
      "20:00:00",
      "20:30:00",//有使用timesArr的index判断的逻辑，修改时候一定注意
      "21:00:00",
      "21:30:00",
      "22:00:00",
      "22:30:00",
      "23:00:00",
      "23:30:00",
      "00:00:00",
      "00:30:00",
      "01:00:00"//有使用timesArr的index判断的逻辑，修改时候一定注意
    ],


    // 显示添加同行人
    showAddFriends: true,

    // 日期bar
    navbar: [util.getDateStrMMdd(0), util.getDateStrMMdd(1), util.getDateStrMMdd(2), util.getDateStrMMdd(3), util.getDateStrMMdd(4), util.getDateStrMMdd(5), util.getDateStrMMdd(6), util.getDateStrMMdd(7)],

    // 日期Value
    navbarValues: [util.getDateStryyyyMMdd(0), util.getDateStryyyyMMdd(1), util.getDateStryyyyMMdd(2), util.getDateStryyyyMMdd(3), util.getDateStryyyyMMdd(4), util.getDateStryyyyMMdd(5), util.getDateStryyyyMMdd(6), util.getDateStryyyyMMdd(7)],

    // 免费预约按钮
    isOk: false,
    //显示本人选择项目弹窗
    isShowProject:false,
    //显示同行人选择项目弹窗
    isShowProjectPartner:false,
    isShowTechnician:false,
    //估计已废弃字段
    yoyakus:[1],
    yoyakuProject:'',
    orderStroe:'',
    orderTime:'',
    yoyakuTechnician:'',

    currentTab: 0,
    isShow:false,
    storeName:'',
    projectList:[],
    checkedProjectList:[],
    checkedProjectName:'',
    showModal: false,
    technicianList: [],
    checkedTechnicianId:'',
    checkedTechnicianName:'',

    length: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    // console.log("app.globalData.storeName=" + app.globalData.storeName);
    // console.log("app.globalData.storeCode=" + app.globalData.storeCode);
    // console.log("app.globalData.cityName=" + app.globalData.cityName);
    // console.log("app.globalData.cityCode=" + app.globalData.cityCode);
    // console.log("app.globalData.myVipNo=" + app.globalData.vipNo);
    //进来时 给projectList每个对象加一个checked属性值为false
    //
    // var pl = self.data.projectList
    // for (var index in pl){
    //   pl[index].checked = false
    // }
    // for (var index in pl) {
    //   console.log(pl.checked)
    // }
    //self.showLoading()

    // 获取预约基本信息
    //店名称
    var temp1 = "orderList.orderStore";
    //包含的项目的名称
    var temp2 = "orderList.incloudProjectName";
    //包含的项目code
    var temp3 = "orderList.incloudProject";
    //店编码
    var temp4 = "orderList.storeCode";
    //养脑师页面传时间
    var temp5 = "orderList.orderTime"
    //养脑师页面传养脑师code
    var temp6 = "orderList.nurseCode"
    //养脑师页面传养脑师name
    var temp7 = "orderList.nurseCodeName"
    var temp8 = "orderList.nurseType"
    //传来的时间tab的下标
    var currentTab = "orderList.currentTab"
    //从养脑师页来，为选中的时间做得准备
    var checkedTimeForStatus = "orderList.checkedTimeForStatus"
    var finalTab = "orderList.finalTab"
    //城市名称
    var cityName = "orderList.cityName"
    //城市code
    var cityCode = "orderList.cityCode"
    //homepage  项目列表 项目详情
    if(options.v==1){
    //将项目code封装到数组内 再赋值
    var list = [{ code: options.incloudProjectCode}];
      self.setData({
      // [temp4]: app.globalData.storeCode,
      [temp4]: 'UM0002',//测试专用
      [temp1]: app.globalData.storeName,//
      [temp2]: options.incloudProjectName,
      [temp3]: list,
      [cityName]:'',//待赋值
      [cityCode]: ''//待赋值
    });
    } else if (options.v == 2){//选择门店返回
      // console.log("选择门店后回来！！！！！！！！！！！！！")
      // console.log(options.storeName)
      // console.log(options.storeCode)
      if (app.globalData.onajiStoreCode == true){
        self.setData({
          [temp2]:app.globalData.projectName,
          [temp3]:app.globalData.projectList
        })
        app.globalData.onajiStoreCode = false
      }
      self.setData({
        [temp4]: options.storeCode,
        [temp1]: options.storeName
      })
    } else if(options.v == 3){//养脑师跳转来
      // console.log("从养脑师传来预约")
      // console.log(options.orderTime)
      var thetime = options.orderTime
      var list = []
          list.push(thetime)
      // console.log(options.incloudProjectName)
      // console.log(options.nurseCode)
      var incloudProjectCode = JSON.parse(options.incloudProjectCode);
      //console.log(incloudProjectCode)
      //console.log()
      self.setData({
        [temp5]: options.orderTime,
        [temp4]: app.globalData.storeCode,//
        [temp1]: app.globalData.storeName,//
        [temp2]: options.incloudProjectName,
        [temp3]: incloudProjectCode,
        [currentTab]: options.currentTab,
        [temp6]: options.nurseCode,
        [temp7]: options.nurseCodeName,
        [temp8]:1, //从养脑师页面来  则为点牌
        haveBeenCheckedTimeList:list,
        v:options.v,
        [currentTab]: options.currentTab,
        [finalTab]: options.currentTab,
        [checkedTimeForStatus]: options.orderTime.substring(11,16).replace(":","")
      })
      self.checkValue()
    }
    var storeCode = self.data.orderList.storeCode
    //console.log(storeCode)
    //检查网络
     login.checkInitAgree(self, function(){
        self.doInit(storeCode);
     });
  },
  doInit:function(storeCode){
    if(this.data.v == 3) this.queryNurseforNursePage(this.data.orderList.orderTime);//从养脑师页面进来
    this.getStoreInfo(storeCode);
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
        if(res.data.length!=0){
        self.setData({
          // 一个门店信息的信息
          storesInfo: res.data[0],
        })
        }
        // self.setData({
        //   // 一个门店code
        //   //storeCode: res.data[0].uuid,
        // })
        console.log("门店经纬度获取完毕：")
        console.log(self.data.storesInfo.lat + "/" + self.data.storesInfo.lon);
        // 获取项目列表
        self.getProjects(storeCode);
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
  //获取项目列表
  getProjects: function (storeCode){
    var self = this;
    wx.request({
      url: app.globalData.path + 'rest/transmission/getProgramList?storeCode='+storeCode,
      method: 'get',
      // data: {
      //   storeCode: storeCode
      // },
      // header: {//请求头
      //   "Content-Type": "application/json"
      // },
      success: function (res) {

        //console.log(res)
        if (res.data.length != 0) {
          for(var index in res.data){
            if(res.data[index].name.length>=9){
              res.data[index].name = res.data[index].name.substring(0,10)+'..'
            }
            res.data[index].checked = false
          }
          console.log("获取门店下的项目列表完毕：" + new Date())
          console.log(res.data)
        self.setData({
          projectList:res.data
        })
        for(var index in self.data.projectList){
          var category = self.data.projectList[index].category;
          var subCategory = self.data.projectList[index].subCategory;
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
          self.data.projectList[index].categorySubCategory = categorySubCategory;
        }
        }
      },
      fail: function (err) {
        console.log(err)
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
    })
  },
  //获取养脑师
  getNurses: function (storeCode){
    var self = this;
    wx.request({
      url: app.globalData.path + 'rest/transmission/getNurseList',
      method: 'get',
      data: {
        storeCode: storeCode
      },
      // header: {//请求头
      //   "Content-Type": "application/json"
      // },
      success: function (res) {
        //console.log(res)
        if (res.data.length != 0) {
        self.setData({
          technicianList:res.data
        })
        }
       // console.log(self.data.technicianList)
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
   * 添加同行人
   */
  addFriends: function(e){
    var self = this;
    if (self.data.orderList.incloudProjectName != '' && self.data.orderList.incloudProjectName != '-'&&self.data.orderList.orderTime!=''&&self.data.orderList.orderTime!='-'){
    //判断总人数是否大于门店可用养脑师的人数
    // if (self.data.nurseCount > self.data.orderList.togethers.length + 1)
    // {

        var orderList = self.data.orderList;
        var togetherList = self.data.togetherList;
        self.setData({
          addBtnIsChecked: true
        })
        if (orderList.togethers.length <= 4) {
          if (orderList.togethers.length == 4) {
            self.setData({
              showAddFriends: false,
            });
          }

          // var temp1 = "togetherList.incloudProjectName";
          // var temp2 = "togetherList.orderTime";
          // var temp3 = "togetherList.currentTab";
          // var temp4 = "togetherList.currentTabIndex";
          // var temp5 = "togetherList.incloudProject";
          // //var temp6 = "togetherList.isTimeOk";

          // self.setData({
          //   [temp1]: orderList.incloudProjectName,
          //   [temp2]: orderList.orderTime,
          //   [temp3]: orderList.currentTab,
          //   [temp4]: orderList.togethers.length,
          //   [temp5]: orderList.incloudProject,
          //   //[temp6]: true
          // });

          // orderList.togethers.push(togetherList);
          self.setData({
            //orderList: orderList,
            addBtnIsChecked: false,
          });
        }


      var temp1 = "togetherList.incloudProjectName";
      var temp2 = "togetherList.orderTime";
      var temp3 = "togetherList.currentTab";
      var temp4 = "togetherList.currentTabIndex";
      var temp5 = "togetherList.incloudProject";
      var temp9 = "togetherList.nurseType";
      var temp11 = "togetherList.checkedTimeForStatus";
      var temp12 = "togetherList.finalTab";
      //var temp6 = "togetherList.isTimeOk";

      self.setData({
        [temp1]: orderList.incloudProjectName,
        [temp2]: orderList.orderTime,
        [temp3]: orderList.currentTab,
        [temp4]: orderList.togethers.length,
        [temp5]: orderList.incloudProject,
        [temp9]: 2,//同行人为轮排
        [temp11]:orderList.checkedTimeForStatus,
        [temp12]:orderList.finalTab
      });
      // orderList.togethers.push(togetherList);
      // self.setData({
      //   orderList: orderList,
      //   //addBtnIsChecked: false,
      // });
      var num = 0
      //判断同行人的时间和本人相同的人数
      var hlist = self.data.haveBeenCheckedTimeList
      for(var i = 0;i<hlist.length;i++){
        if(self.data.orderList.orderTime == hlist[i]){
          num ++
        }
      }
      // if (self.data.orderList.togethers.length == 0){
      //   num = 2
      // }else{
      //   num = self.data.orderList.togethers.length + 2
      // }
      //判断同行人数 是否超过本人选择时间后 可用养脑师的人数
      if (num < self.data.currTimeNurseCount) {
        //此时，成功添加同行人 需要将时间传入被选择时间的数组
        var ptime = self.data.orderList.orderTime
        var plist = []
            plist = self.data.haveBeenCheckedTimeList
            plist.push(ptime)
        var temp6 = "togetherList.isTimeOk";
        self.setData({
          [temp6]: true,
          haveBeenCheckedTimeList: plist
        })
        //console.log("此时的被选中的时间")
        //console.log(self.data.haveBeenCheckedTimeList)
      } else {
        var temp6 = "togetherList.isTimeOk";
        self.setData({
          [temp6]: false,
        })
        wx.showModal({
          title: '',
          content: '当前同行人没有可预约的养脑师，请换个时间...',
          showCancel: false,
          confirmColor: '#fbb059',
        })

      }
      orderList.togethers.push(togetherList);
      self.setData({
        orderList: orderList,
        //addBtnIsChecked: false,
      });
    /** 与593搭配注释 */
    // }else{

    //   wx.showModal({
    //     title: '',
    //     content: '门店共有' + self.data.nurseCount + '位可用技师，不能再添加同行人啦...',
    //     showCancel:false
    //   })
    //   self.setData({
    //     showAddFriends:false
    //   })
    // }

  }else{
      self.setData({
        popErrorMsg:'请选择项目和时间...',
        addBtnIsChecked: false
      })
      app.ohShitfadeOut(this);
      return
    }
   // console.log(self.data.orderList);
    this.checkValue()
  },

  /**
   * 删除同行人
   */
  delFriends: function (e) {
    var self = this;
    var orderList = self.data.orderList;
    //判断删除的同行人的isTimeOk为true的话 需要在被选择时间的数组里的值，将该同行人的时间删掉一个
    var checkedTimeList = self.data.haveBeenCheckedTimeList
    if (orderList.togethers[e.currentTarget.dataset.index].isTimeOk == true){
     // console.log("该人的时间为true")
      for (var i = 0; i < checkedTimeList.length;i++){
        //console.log(checkedTimeList[i])
        if (orderList.togethers[e.currentTarget.dataset.index].orderTime == checkedTimeList[i]){
          //console.log("有相同的时间")
         // console.log(checkedTimeList[i])
          checkedTimeList.splice(i,1)
          break
        }
      }
      //如果有同样的时间同行人  isTimeOk为false 这删除了这个人的，另一个人变为true
      for(var j = 0;j<self.data.orderList.togethers.length;j++){
        if (self.data.orderList.togethers[j].orderTime == orderList.togethers[e.currentTarget.dataset.index].orderTime && self.data.orderList.togethers[j].isTimeOk == false){
          //self.data.orderList.togethers[j].isTimeOk == true
          checkedTimeList.push(self.data.orderList.togethers[j].orderTime)
          var togethers = "orderList.togethers["+j+"].isTimeOk"
          self.setData({
            [togethers]:true
          })
          break
        }
      }
      self.setData({
        haveBeenCheckedTimeList: checkedTimeList
      })
      //console.log("删除了同行人，删除他存在被选择list的值")
      //console.log(orderList.togethers[e.currentTarget.dataset.index].orderTime)
      //console.log(checkedTimeList)
      //console.log(self.data.haveBeenCheckedTimeList)
    }

    orderList.togethers.splice(e.currentTarget.dataset.index, 1);

    for (var index in orderList.togethers) {
     // console.log(index);
      var temp = "orderList.togethers[" + index + "].currentTabIndex";
      self.setData({
        [temp]: index,
      });
    }
    self.setData({
      orderList: orderList,
      showAddFriends: true,
      addBtnIsChecked: false,
    });
    if (self.data.orderList.togethers.length==0){
      this.setData({
        addBtnIsChecked:false
      })
    }
    this.checkValue()
  },

  // 日期tab切换
  navbarTap: function (e) {
    //console.log(e.currentTarget.dataset.idx)
    var self = this;
    self.setData({
      readyToShowTime:true
    })
    self.showLoading();
    var temp = "orderList.currentTab";
    self.setData({
      [temp]: e.currentTarget.dataset.idx,
      currtab: e.currentTarget.dataset.idx
    });
    //console.log("currTab!!!!!" + self.data.currtab)
    //console.log("orderList.currentTab!!!!!" + self.data.orderList.currentTab)
    //选日期tab时期 调用门店可预约时间段接口
    //console.log("选日期tab时期 调用门店可预约时间段接口");
    //console.log(new Date(self.data.navbarValues[self.data.orderList.currentTab]));
    self.queryStoreAvailabilityTime(new Date(self.data.navbarValues[self.data.orderList.currentTab]), e,null);


  },

  // 日期tab切换（同行人）
  togetherNavbarTap: function (e) {
    var self = this;
    self.setData({
      readyToShowTime: true
    })
    var temp = "orderList.togethers[" + e.currentTarget.dataset.item + "].currentTab";
    self.setData({
      [temp]: e.currentTarget.dataset.idx,
      currtab: e.currentTarget.dataset.idx
    });
    //console.log("同行人index为" + e.currentTarget.dataset.idx)
  self.queryStoreAvailabilityTime(new Date(self.data.navbarValues[e.currentTarget.dataset.idx]), e, e.currentTarget.dataset.item);
    //self.getTimeStatus(e.currentTarget.dataset.idx)
  },

  /**
   * 显示时间框
   */
  orderTime: function (e) {
    var self = this;
    var currflag = "orderList.isShowIndex."
    //若是已经点开 需要关闭事件控件 则不调用接口
    if(self.data.orderList.isShowIndex==true){
      self.setData({
        [currflag]: false
      })
    }else{
      self.setData({
        readyToShowTime: true
      })
      //选了项目才可以选时间
      if (self.data.orderList.incloudProject.length > 0) {

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
            currtab:self.data.orderList.finalTab,//将全局的设置为这个人选择时间的最后的时间TAB的值
            [temp9]: self.data.orderList.finalTab//将时间控件点亮的时间Tab的设置为这个人选择时间的最后的时间TAB的值
          });
        }//如果是关闭弹窗  则不去调用可用时间接口
        if (self.data.orderList.isShowIndex == true) {
          //选完时间再次点击时间，时间框架的状态需要停留在当前日期的时间状态
          if (self.data.orderList.currentTab != 0) {
            //因为那边格式写死，所以这边按照格式赋值
            var e = { currentTarget: { dataset: { idx: self.data.orderList.currentTab } } }
            //e.currentTarget.dataset.idx = self.data.orderList.currentTab
            //console.log("之间的currtab")
            //console.log(self.data.orderList.currentTab)
            self.queryStoreAvailabilityTime(new Date(self.data.navbarValues[self.data.orderList.currentTab]), e, null)
          } else {
            self.queryStoreAvailabilityTime(new Date(), null, null)
          }

        }
        //self.getTimeStatus(self.data.orderList.currentTab);
      } else {
        //console.log("项目没有值")
        this.setData({
          popErrorMsg: "请选择项目"
        })
        app.ohShitfadeOut(this);
        return
      }
    }

  },
  //每次选择时间时，调用门店当前可用养脑师。index为空时  是本人在修改  index有值时，是同行人在选项目
  getNowCanUsedNurseList: function (theDay, index) {
    let self = this;
    self.showLoading()
    let orderList = self.data.orderList
    self.setData({whoAreYou: index})//判断是谁在改项目
    // 发起网络请求 获取套餐信息
    let prjUuid = ((index || index === 0) ? orderList.togethers[index] : orderList).incloudProject[0].code
    let date = theDay.substring(0, 10).replace(/-/g, '')
    wx.request({
      url: app.globalData.path + 'rest/res/getReservationTimeRange',
      method: 'GET',
      data: {date, prjUuid/*此属性待商榷，本应该是个数组*/, vipNo: '', storeCode: orderList.storeCode/*app.globalDate.storeCode*/},
      success: function (res) {
        let resData = res.data
        if (resData.errcode == 0) {//养脑师的列表属性名不对，循环重新赋值
          let technicianList = resData.nurse || []
          technicianList.map(item => {
            item.uuid = item.nurseCode
            let nurseName = item.nurseName
            item.name = (nurseName.length == 2) ? nurseName.charAt(0) + '   ' + nurseName.charAt(1) : nurseName
            item.level = item.nurseLevel
            item.imgUrl = item.nurseImg
            item.star = item.nurseStar
            item.checked = false
          })
          self.setData({technicianList})
          //选完时间后，和养脑师可用时间比照，有空闲的显示
          let checktimeStamp = Date.parse(theDay.replace(/-/g, '/'))//将时间的-转换成/   例如2018-09-15 10:00:00  2018/09/15 10:00:00 Iphone才能识别
          let listCanUsed = []
          //全都转换成时间戳去比较时间  筛选养脑师
          self.data.technicianList.map(item => {
            let availableTime = item.reservationAvailableTime || []
            availableTime.map(item2 => {
              let sTime = Date.parse(item2.startTime.replace(/-/g, '/'))
              let eTime = Date.parse(item2.endTime.replace(/-/g, '/'))
              if (checktimeStamp >= sTime && checktimeStamp <= eTime) {
                listCanUsed.push(item)
              }
            })
          })
          //将筛选后的数组赋值给技师list
          //本人重新选择了时间，同行人信息清空
          if (index || index === 0) {//同行人选择时间时
            let temp3 = `orderList.togethers[${index}].isTimeOk`
            let count = 0
            let haveBeenCheckedTimeList = self.data.haveBeenCheckedTimeList
            haveBeenCheckedTimeList.map(item => {
              if (theDay == item) count++
            })
            if (count >= listCanUsed.length) {
              self.setData({[temp3]: false})
              let content = '当前同行人没有可预约的养脑师，请换个时间...'
              wx.showModal({title: '', content, showCancel: false, confirmColor: '#fbb059',})
            } else {
              haveBeenCheckedTimeList.push(theDay)
              self.setData({[temp3]: true, haveBeenCheckedTimeList})
            }
          } else {//本人选择时间时
            self.setData({
              haveBeenCheckedTimeList: [theDay],//如果是本人直接将该日期存入 被选中的日期
              technicianListCanUsed: listCanUsed,
              ["orderList.togethers"]: [],//本人重新选择了时间，同行人信息清空
              showAddFriends: true,//显示添加同行人按钮
              addBtnIsChecked: false,//添加同行人的按钮变为未选中状态
              ["orderList.nurseType"]: 2,//修改时间后 默认改为轮值编号 2
              currTimeNurseCount: listCanUsed.length
            })
          }
          self.checkValue()
          self.hiddenLoading()
        }
      }
    });
  },

  /**
   * 选择服务时间
   */
  chooseTime: function (e) {
    let self = this;
    let buttonTime = e.currentTarget.dataset.item//简化，被点击的按钮上带的参数
    let nowTime = new Date()
    let Y_M = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-'//年加月
    let today = Y_M + (nowTime.getDate() + (buttonTime.substring(0, 1) == '0' ? 1 : 0)) + ' '
    let checkedTime = today +buttonTime
    //选择时间后调用轮值养脑师接口
    self.getTodayNurseList(app.globalData.storeCode, checkedTime);
    //将被所有人选中的时间的list清空，再将本次的选中时间赋值
    self.setData({
      ["orderList.orderTime"]: checkedTime,
      ["orderList.isShowIndex"]: false,
      ["orderList.nurseCodeName"]: '',
      ["orderList.nurseCode"]: '',
      ["orderList.checkedTimeForStatus"]: buttonTime.substring(0, 5).replace(':', ''),//为了展示选中时间的状态
      ["orderList.finalTab"]: self.data.orderList.currentTab//将选中时间此时的时间日期tab下标 赋值给最终选择时间的日期下标保存，用于显示
    })
    //调接口得到当前养脑师列表
    self.getNowCanUsedNurseList(checkedTime, null)
  },

  /**
   * 显示时间框（同行人）
   */
  togetherTime: function(e){
    var self = this;
    self.setData({
      readyToShowTime: true
    })
    var dd = e.currentTarget.dataset.index;
    //选了项目才可以选时间
    if (self.data.orderList.togethers[dd].incloudProjectName != '' && self.data.orderList.togethers[dd].incloudProjectName != '-'){

    var temp = "orderList.togethers[" + e.currentTarget.dataset.index + "].isShowIndex";
    var temp9 = "orderList.togethers[" + e.currentTarget.dataset.index + "].currentTab";
    var isShowIndex = self.data.orderList.togethers[e.currentTarget.dataset.index].isShowIndex;
    if (isShowIndex == true) {
      self.setData({
        [temp]: false,
      });
    } else {
      self.setData({
        [temp]: true,
        currtab: self.data.orderList.togethers[e.currentTarget.dataset.index].finalTab,
        [temp9]: self.data.orderList.togethers[e.currentTarget.dataset.index].finalTab
      });
    }
      //self.togetherNavbarTap(0)
      //同行人时，也调用时间状态方法
      //关闭弹窗时  不调用可用时间接口
      if (self.data.orderList.togethers[dd].isShowIndex == true){
       // console.log("同行人的index："+dd)
        if (self.data.orderList.togethers[dd].currentTab != 0) {
         // console.log("打印出当前同行人的选择的时间tab"+self.data.orderList.togethers[dd].currentTab)
          //因为那边格式写死，所以这边按照格式赋值
          var e = { currentTarget: { dataset: { idx: self.data.orderList.togethers[dd].currentTab } } }
          //e.currentTarget.dataset.idx = self.data.orderList.currentTab
          self.queryStoreAvailabilityTime(new Date(self.data.navbarValues[self.data.orderList.togethers[dd].currentTab]), e, dd)
          //第一个参数为请求的时间  第二个参数为时间控件的tab的值(当前和非当天)  第三个参数为同行人的下标
        } else {
          self.queryStoreAvailabilityTime(new Date(), null, dd)
        }

      //self.queryStoreAvailabilityTime(new Date(),null,dd)
      //self.getTimeStatus(self.data.orderList.togethers[dd].currentTab);
      }
    }else{
     // console.log("项目没有值")
      this.setData({
        popErrorMsg: "请选择项目"
      })
      app.ohShitfadeOut(this);
      return
    }
  },

  /**
   * 选择服务时间（同行人）
   */
  togetherChooseTime: function (e) {
    var self = this;
   // console.log("同行人修改了时间，看养脑师列表变化（开始时）")
    //console.log(self.data.technicianList)
    //判断这个人的原来时间是否在已被选择的时间list中，若有，这删除一个
    var clist = self.data.haveBeenCheckedTimeList
    for (var i = 0; i < clist.length;i++){
      if (self.data.orderList.togethers[e.currentTarget.dataset.index].orderTime == clist[i] && self.data.orderList.togethers[e.currentTarget.dataset.index].isTimeOk==true){
        clist.splice(i,1)
        break
      }
    }
    //如果有同样的时间同行人  isTimeOk为false 则修改了了这个人的，另一个人变为true
    for (var j = 0; j < self.data.orderList.togethers.length; j++) {
      if (self.data.orderList.togethers[j].orderTime == self.data.orderList.togethers[e.currentTarget.dataset.index].orderTime && self.data.orderList.togethers[j].isTimeOk == false && self.data.orderList.togethers[e.currentTarget.dataset.index].isTimeOk == true) {
        //self.data.orderList.togethers[j].isTimeOk == true
        clist.push(self.data.orderList.togethers[j].orderTime)
        var togethers = "orderList.togethers[" + j + "].isTimeOk"
        self.setData({
          [togethers]: true
        })
        break
      }
    }
    self.setData({
      haveBeenCheckedTimeList:clist
    })

    // console.log(e.currentTarget.dataset.index);
    var temp1 = "orderList.togethers[" + e.currentTarget.dataset.index + "].orderTime";
    var temp2 = "orderList.togethers[" + e.currentTarget.dataset.index + "].isShowIndex";
    var temp3 = "orderList.togethers[" + e.currentTarget.dataset.index + "].isTimeOk";
    var temp11 = "orderList.togethers[" + e.currentTarget.dataset.index + "].checkedTimeForStatus"
    //var temp12 = "orderList.togethers[" + e.currentTarget.dataset.index + "].currentTab"
    var temp13 = "orderList.togethers[" + e.currentTarget.dataset.index + "].finalTab"
    var forstatus = self.data.navbarValues[self.data.orderList.togethers[e.currentTarget.dataset.index].currentTab] + " " + e.currentTarget.dataset.item.substring(0, 8)//.substring(11, 16).replace(':', '')
    forstatus = forstatus.substring(11, 16).replace(':', '')
    //console.log("啊哈哈哈哈哈哈哈哈哈哈哈哈")
    //console.log(forstatus)
    //被选中时间的的状态
    self.setData({
      [temp1]: self.data.navbarValues[self.data.orderList.togethers[e.currentTarget.dataset.index].currentTab] + " " + e.currentTarget.dataset.item.substring(0, 8),
      [temp2]: false,
      [temp11]: forstatus,//将选中的日期赋值
      [temp13]: self.data.orderList.togethers[e.currentTarget.dataset.index].currentTab//点击时间控件时，默认选中之前选中的Tab时间日期
    })

    //同行人选完时间后看是否与本人时间相同
    if (self.data.navbarValues[self.data.orderList.togethers[e.currentTarget.dataset.index].currentTab] + " " + e.currentTarget.dataset.item.substring(0, 8) == self.data.orderList.orderTime){
      var count = 0;
      for (var i = 0; i < self.data.haveBeenCheckedTimeList.length;i++){
        if (self.data.navbarValues[self.data.orderList.togethers[e.currentTarget.dataset.index].currentTab] + " " + e.currentTarget.dataset.item.substring(0, 8) == self.data.haveBeenCheckedTimeList[i]){
          count++
        }
      }
      // for(var index in self.data.orderList.togethers){//遍历所有同行人
      //   if (self.data.orderList.orderTime == self.data.orderList.togethers[index].orderTime){//同行人和本人时间相同时
      //     //
      //     var theflag = false//判断同行人换项目后是否和本人选择的项目相同
      //     console.log("+++++++++++++++++++++++++++++")
      //     console.log(this.data.currPjCode.length)
      //     console.log(this.data.orderList.incloudProject.length)
      //     label:
      //     if (self.data.orderList.togethers[index].incloudProject.length == this.data.orderList.incloudProject.length) {
      //       for (var j in self.data.orderList.togethers[index].incloudProject) {
      //         theflag = false
      //         for (var i in this.data.orderList.incloudProject) {
      //           if (this.data.orderList.incloudProject[i].code == self.data.orderList.togethers[index].incloudProject[j].code) {
      //             theflag = true
      //             break
      //           }
      //           if (i == this.data.orderList.incloudProject.length - 1 && theflag == false) {
      //             break label
      //           }
      //         }
      //       }
      //     } else {
      //       theflag = false
      //     }
      //     //如果相同项目相同时间 则++
      //     if (theflag){
      //       count++
      //     }

      //   }
      // }
      //console.log("此时有几个同时间"+count)
      if (count >= self.data.currTimeNurseCount){//count代表同时间一共要去的人数，若大于同时间可预约养脑师的人数时，提示
        self.setData({
          [temp3]: false
        })
        wx.showModal({
          title: '',
          content: '当前同行人没有可预约的养脑师，请换个时间...',
          showCancel: false,
          confirmColor: '#fbb059',
        })
      }else{
        //若没大于 则将该时间存入已经被选的时间list
        var plist = self.data.haveBeenCheckedTimeList
        plist.push(self.data.navbarValues[self.data.orderList.togethers[e.currentTarget.dataset.index].currentTab] + " " + e.currentTarget.dataset.item.substring(0, 8))
        self.setData({
          [temp3]: true,
          haveBeenCheckedTimeList:plist
        })
      }

    }else{//如果与本人时间不同，则调用接口 查询有几个养脑师可约
      //调用接口
      self.getNowCanUsedNurseList(self.data.navbarValues[self.data.orderList.togethers[e.currentTarget.dataset.index].currentTab] + " " + e.currentTarget.dataset.item.substring(0, 8), e.currentTarget.dataset.index)
      // self.setData({
      //   [temp3]:true
      // })
    }
    // console.log(self.data.navbarValues[self.data.orderList.togethers[e.currentTarget.dataset.index].currentTab] + " " + e.currentTarget.dataset.item.substring(0, 8))
   // this.getTimeStatus(e)
   //console.log("同行人修改了时间，看养脑师列表变化")
   //console.log(self.data.technicianList)
    this.checkValue()
  },

  // 时间状态
  getTimeStatus: function (e) {
    let self = this;
    let timeTemp = {}
    for (let i = 1000; i < 2340; i = i + (i % 100 ? 70 : 30)) {
      timeTemp['time' + i] = true
    }
    timeTemp.time0000 = true
    timeTemp.time0030 = true
    timeTemp.time0100 = true
    self.setData({times: timeTemp, fulltimes: timeTemp});
    //以上初始化时间的状态，以下为变量赋值
    let nowTime = new Date()
    let nowStamp = nowTime.getTime()
    let Y_M = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-'//年加月
    let todayHead = Y_M + nowTime.getDate() + ' '//当天的年月日
    let tomorrowHead = Y_M + (nowTime.getDate() + 1) + ' '//明天的年月日
    //由于技师时间一定在营业时间内，超出的也算作非可用时间，所以外层判断营业时间，内层判断技师时间。后续如果营业时间后推，只需改变下面写死的maxTime和minTime即可
    let minTime = new Date(todayHead + '10:00:00').getTime()//开始时间，写死上午10点
    let maxTime = new Date(tomorrowHead + '02:00:00').getTime()//打烊时间，写死后半夜2点，目前按钮只配置到1点，需要的话加按钮即可
    self.data.timesArr.map((item, index) => {
      let timeStamp = new Date((index > 27 ? tomorrowHead : todayHead) + item).getTime()
      let keyAss = item.substring(0, 5).replace(':', '')
      if ((minTime <= timeStamp && timeStamp <= maxTime)//门店营业时间之内
        && ((e == 0) ? nowStamp <= timeStamp : true)//在当前时间之后。。e=0则是当天，不是0则是明天后天等（此时不存在在当前时间之前的情况）
      ) {
        //这里在营业时间内，接下来判断技师是否有空
        self.data.reservationAvailableTime.map(item2 => {
          let sTime = new Date(item2.startTime).getTime()
          let eTime = new Date(item2.endTime).getTime()
          if ((sTime <= timeStamp && timeStamp <= eTime)) self.setData({["fulltimes.time" + keyAss]: false})
        })
      } else {
        self.setData({["times.time" + keyAss]: false})
      }
    })
    self.hiddenLoading()
    self.setData({readyToShowTime: false})
  },
  /**
   * 异步获取可用时间结果后续处理
   */
  doActiveTimeAfter: function (list1){
    var self = this
    console.log("-=-%^$@%%*@&%!")
    console.log(self.data.thelist)
    //有没有门店可预约的thelist的状态0为没有店面 则控件的状态为disable 反之 则为可跳转店面的状态
    if(self.data.thelist.length == list1.length){
      for (var index in list1) {
        // console.log("进入备用list")
        // console.log(index)
        // console.log(list1[index])
        // console.log(list1[index].substring(11, 16).replace(':', ''))
        // console.log(self.data.thelist[index])
        //console.log("对每一个预约满的时间进行判断 是否有店面")
        if (self.data.thelist[index] == 0) {
          var temp = "times.time" + list1[index].substring(11, 16).replace(':', '');
          self.setData({
            [temp]: false
          })
        }
        if (index == list1.length - 1) {
          setTimeout(function(){
            self.hiddenLoading()
            self.setData({
              readyToShowTime: false
            })
          },1000)

        }
      }
    }

   // console.log(self.data.times)
  },
  /**
   * 循环获取可用时间处理
   */
  isOtherStoreHasTime: function (index, url, param, list1){
    var self = this
    // console.log("")
    // console.log("index="+index)
    // console.log("URL="+url)
    // console.log("param=")
    // console.log(param)
    // console.log("list1="+list1)
    // console.log("=====================================")
    var flag = true
    var temp = "thelist["+index+"]"
       wx.request({
        url: url,
        method: 'POST',
        data: param,
        success: function (res) {
          //console.log(res)
          self.setData({
            [temp]:res.data.length
          })
          // if (index == list1.length - 1) {
          //   self.doActiveTimeAfter(list1);//必须执行完所有方法再走下一步
          // }
          //console.log("和开发商付款计划书大空间发挥空间啥")
          //console.log(self.data.thelist)
          for(var index in self.data.thelist){
            if(self.data.thelist[index]==undefined){
              flag = false
              break
            }
          }
          //console.log("判断长度")
          //console.log(self.data.thelistlength)
          if (flag && self.data.thelist.length == self.data.thelistlength){
            //console.log("值都已经赋完，进行下一步")
            self.doActiveTimeAfter(list1);//必须执行完所有方法再走下一步
          }
        },
        fail: function (err) {
          // wx.showModal({
          //   title: "请求超时",
          //   content: "系统繁忙，请稍后重试！",
          //   showCancel: false,
          // });
        }
      })
  }
  ,
  radioChange: function (e) {
    //console.log("点击获取了养脑师")
    //console.log(e.detail.value)
    this.setData({
      checkedTechnicianId: e.detail.value
    })
    //如果有被选中的  确定按钮激活
    if (this.data.checkedTechnicianId!=''){

      this.setData({
        isCheckedTechnician:true
      })
    }
  },

  /**
   * 显示技师列表
   */
  chooseTechnician: function(e){
    if (this.data.orderList.orderTime != '' && this.data.orderList.orderTime != '-'){
    this.setData({
      isShowTechnician: true,
    });
    }else{
      this.setData({
        popErrorMsg: "请选择时间"
      })
      app.ohShitfadeOut(this);
      return
    }
  },

  /**
   * 保存技师
   */
  saveTechnician: function () {
    var list = this.data.technicianList
    var name = ""
    var temp = "orderList.nurseCodeName";
    var temp1 = "orderList.nurseCode";
    var nurseType = "orderList.nurseType"
    if (this.data.checkedTechnicianId != '') {
      //在保存的时候 给技师列表加一个checked属性，默认false，被选中的设置为true
      for (var index in list) {
        if (this.data.checkedTechnicianId == list[index].uuid) {
          list[index].checked = true
          name = list[index].name
        }else{
          list[index].checked = false
        }
      }
      this.setData({
        isShowTechnician: false,
        [temp]:name,
        [nurseType]:1,//保存养脑师的话 则是点牌 所以nurseType改为1
        technicianList: list,
        [temp1]: this.data.checkedTechnicianId
      })
    }
    this.hideModal()
  },

  /**
   * 选择门店
   */
  orderStore: function(e){
    app.globalData.v = '4'
    app.globalData.projectList = this.data.orderList.incloudProject//将值放入全局 以备用
    app.globalData.projectName = this.data.orderList.incloudProjectName
    wx.reLaunch({
      url: '../../pages/selectStores/selectStores'
    })
    // var navigateToUrl = '/pages/selectStores/selectStores'//?jumpPage=2&v=4'
    // wx.switchTab({
    //   url: navigateToUrl
    // });
  },

  /**
   * 显示项目列表
   */
  orderProject: function(e){
    this.setData({
      currPjCode:[]
    })
    var queding = "orderList.isShowConfirmBtn"
    if (this.data.orderList.incloudProject.length != 0) {
      this.setData({
        [queding]: 1
      })
    }
    var storeName = this.data.orderList.orderStore
    //选了门店才能选项目
    if (this.data.orderList.orderStore != '' && this.data.orderList.orderStore != '-'){
    var list = this.data.projectList;
    //保存时先把所有checked设为false，在通过遍历 将选中的项目设置为true
    for (var index in list) {
      list[index].checked = false
    }
    for (var index in list) {
      for (var i in this.data.orderList.incloudProject) {
        if (list[index].uuid == this.data.orderList.incloudProject[i].code) {
         // name = name + ' ' + list[index].projectName;
         //console.log("这个是被选中的项目")
          //console.log(this.data.orderList.incloudProject[i].code)
          list[index].checked = true
        }
      }
    }
    this.setData({
      projectList:list,
      isShowProject: true,
    })
    }else{

      this.setData({
        popErrorMsg:"请选择门店"
      })
      app.ohShitfadeOut(this);
      return
    }
  },
  //同行人选择项目
  orderProjectPartner:function(e){
    this.setData({
      currPjCode: []
    })
    var partnerIndex = e.currentTarget.dataset.index
    if (this.data.orderList.togethers[partnerIndex].incloudProject.length!=0){
    this.setData({
      isShowConfirmBtn:1
    })
    }

    var storeName = this.data.orderList.orderStore
    if (this.data.orderList.orderStore != '' && this.data.orderList.orderStore != '-') {
    //var name = '';

   //点谁 将谁的所选项目数组通过index选出来，再将谁是被选中的赋值给projectList

    var checkedProject = this.data.orderList.togethers[partnerIndex].incloudProject;
    //console.log("此时被选中的项目")
     // console.log(checkedProject)
    var list = this.data.projectList;
    //判断有没有选中的项目，控制确定按钮的CSS
      if (checkedProject.length>0){
        this.setData({
          isShowConfirmBtn:1
        })
      }
    //保存时先把所有checked设为false，在通过遍历 将选中的项目设置为true
    for (var index in list) {
      list[index].checked = false
    }
    for (var index in list) {
      for (var i in checkedProject) {
        if (list[index].uuid == checkedProject[i].code) {
          //name = name + ' ' + list[index].projectName;
          list[index].checked = true

        }
      }
    }
    this.setData({
      projectList:list,
      partnerIndex: partnerIndex,
      isShowProjectPartner: true
      })
    } else {

      this.setData({
        popErrorMsg: "请选择门店"
      })
      app.ohShitfadeOut(this);
      return
    }
  },
  /**
   * 选择项目
   */
  saveProject: function(e){
    var temp3 = "orderList.incloudProject";
    if (this.data.currPjCode.length!=0){
      this.setData({
        [temp3]: this.data.currPjCode,
      })
    }

    var name = '';
    var list = this.data.projectList;
    //保存时先把所有checked设为false，在通过遍历 将选中的项目设置为true
    for(var index in list){
      list[index].checked = false
    }
    for (var index in list){
      for (var i in this.data.orderList.incloudProject){
        if (list[index].uuid == this.data.orderList.incloudProject[i].code){
          name = name + ' ' + list[index].name;
          list[index].checked = true
        }
      }
    }
    //选择项目改动时，将时间养脑师等内容清空
    var time = "orderList.orderTime"
    var nurse = "orderList.nurseCodeName"
    var nurseCode = "orderList.nurseCode"
    //时间控件的状态也初始化到最开始的状态
    var currentTab = "orderList.currentTab"
    var finalTab = "orderList.finalTab"
    var checkedTimeClear = "orderList.checkedTimeForStatus"

    this.setData({
      [checkedTimeClear]:'',//被选中的时间的判断值清空
      [finalTab]:0,//最终选择时间日期的tab的index清空
      [time]:"",
      [nurseCode]:'',
      [nurse]:'',
      [currentTab]:0
    })
    // var e = { currentTarget: { dataset: { idx: this.data.orderList.currentTab}}}
    // console.log("此时的e" + this.data.orderList.currentTab)
    //当保存选择的项目时，调用可用时间段接口，查询该项目的可用时间段，并赋值给时间控件,为了在点开时间的情况下，选择项目，也需要赋值

    //this.queryStoreAvailabilityTime(new Date(),null,null,false)
    var temp = "orderList.incloudProjectName";
    //如果name过长，截取一部分，显示..并加上一共选了几项
    if(name.length>13){//以前的判断长度 10  同行人也的修改
      //name = name.substring(0, 9) + '..(' + this.data.orderList.incloudProject.length+'项)'
      name = name.substring(0, 12) + '..'
    }
    this.setData({

      projectList:list,
      isShowProject: false,
      [temp]: name,
    });
    //本人重新选择了项目，同行人信息清空
    var ttemp = "orderList.togethers"
    var nurseType = "orderList.nurseType"
    this.setData({
      [ttemp]: [],
      showAddFriends:true,
      addBtnIsChecked: false,
      [nurseType]:2//重新改时间后 再默认为2  轮排
    })
    this.checkValue()
  },
//同行人保存项目
  saveProjectPartner:function(){
    //将是否跟本人项目一样的属性初始化
    this.setData({
      isSameAspartner: true,
    })
    var temp3 = "orderList.togethers[" + this.data.partnerIndex + "].incloudProject";
    if (this.data.currPjCode.length != 0) {
      //如果点击选择了项目
      this.setData({
        [temp3]: this.data.currPjCode,
      })
    }
    // var theflag = false//判断同行人换项目后是否和本人选择的项目相同
    // console.log("+++++++++++++++++++++++++++++")
    // console.log(this.data.currPjCode.length)
    // console.log(this.data.orderList.incloudProject.length)
    // label:
    // if (this.data.currPjCode.length == this.data.orderList.incloudProject.length){
    //   for (var index in this.data.currPjCode){
    //     theflag = false
    //     for (var i in this.data.orderList.incloudProject){
    //       if (this.data.orderList.incloudProject[i].code == this.data.currPjCode[index].code){
    //         theflag = true
    //         break
    //       }
    //       if (i == this.data.orderList.incloudProject.length-1 && theflag==false){
    //         break label
    //       }
    //     }
    //   }
    // }else{
    //   theflag = false
    // }
    // console.log("同行人的theflag=" + theflag)
    // //如果不同 则给同行人的isTimeOk的值改为true
    // if(!theflag){
    //   this.setData({
    //     isSameAspartner:false,
    //   })
    // }
    //只要重置时间了 则isTimeOk都为false，页面红字显示内容
    var isOk = "orderList.togethers[" + this.data.partnerIndex + "].isTimeOk";
    this.setData({
      [isOk]: false,//------------jack
    })

    var name = '';
    var partnerIndex = this.data.partnerIndex;
    //console.log("被选中的项目" + this.data.orderList.togethers[partnerIndex].incloudProject)
    var checkedProject = this.data.orderList.togethers[partnerIndex].incloudProject;

    var list = this.data.projectList;
    //保存时先把所有checked设为false，在通过遍历 将选中的项目设置为true
    for (var index in list) {
      list[index].checked = false
    }
    for (var index in list) {
      for (var i in checkedProject) {
        if (list[index].uuid == checkedProject[i].code) {
          name = name + ' ' + list[index].name;
          list[index].checked = true
        }
      }
    }
    //选择项目后刷新
    var time = "orderList.togethers[" + partnerIndex + "].orderTime";
    var currentTab = "orderList.togethers[" + partnerIndex + "].currentTab";
    var finalTab = "orderList.togethers[" + partnerIndex + "].finalTab"
    var checkedTimeClear = "orderList.togethers[" + partnerIndex + "].checkedTimeForStatus"

    this.setData({
      [checkedTimeClear]: '',//被选中的时间的判断值清空
      [finalTab]: 0,//最终选择时间日期的tab的index清空
      [time]:'请重新选择时间',//-jack
      [currentTab]:0
    })
    //this.queryStoreAvailabilityTime(new Date(), null, partnerIndex,false)

    var temp = "orderList.togethers[" + partnerIndex+"].incloudProjectName";
    //如果name过长，截取一部分，显示..并加上一共选了几项
    if (name.length > 13) {
     // name = name.substring(0, 9) + '..(' + checkedProject.length + '项)'
      name = name.substring(0, 12) + '..'
    }
    this.setData({
      projectList: list,
      isShowProject: false,
      isShowProjectPartner:false,
      [temp]: name,
    });
    this.checkValue()
  },

  whenChanel: function(){
    // //取消按钮时，如果没有任何被选中，projectList的checked属性全为false,那么属性变为''
    // var temp = "orderList.incloudProjectName";
    // //如果项目一个没选，则时间和养脑师清空
    // var time = "orderList.orderTime";
    // var nurseName = "orderList.nurseCodeName";
    // var ncode = "orderList.nurseCode";
    // var list = this.data.projectList;
    // if (this.data.currPjCode == '' | this.data.currPjCode == 0){
    //   for (var index in list) {
    //     list[index].checked = false
    //   }
    //   this.setData({

    //     projectList: list,
    //     [temp]: '-',
    //     [time]:'-',
    //     [nurseName]:'-',
    //     [ncode]:'',
    //   })
    // }
    // //如果一次确定没点时，此时点击取消，清空incloudProject的值
    // var ipj = "orderList.incloudProject"
    // var bn = "orderList.isShowConfirmBtn"
    // if (this.data.orderList.incloudProjectName == '' | this.data.orderList.incloudProjectName == '-'){
    //   this.setData({
    //     [ipj]:[],
    //     [bn]:0
    //   })
    // }
    this.setData({
      isShowProject: false,
      isShowTechnician: false,
      isShowProjectPartner: false,
    })
    this.checkValue()
  },
  whenChanelPartner:function(){
    // var list = this.data.projectList;
    // var partnerIndex = this.data.partnerIndex;
    // var temp = "orderList.togethers[" + partnerIndex + "].incloudProjectName";
    // var temp1 = "orderList.togethers[" + this.data.partnerIndex + "].incloudProject";
    // var time = "orderList.togethers[" + this.data.partnerIndex + "].orderTime";
    // if (this.data.orderList.togethers[partnerIndex].incloudProject == '' && this.data.orderList.togethers[partnerIndex].incloudProject.length==0){
    //   for (var index in list) {
    //     list[index].checked = false
    //   }
    //   this.setData({
    //     projectList: list,
    //     [temp]: '-',
    //     [time]:'-'
    //   })

    // }
    // //在选中一个项目的情况下 点击取消 清空对应选中项目数组的值
    //  if (this.data.orderList.togethers[partnerIndex].incloudProjectName == '' | this.data.orderList.togethers[partnerIndex].incloudProjectName == '-'){

    //   this.setData({
    //     [temp1]:[]
    //   })
    // }
    this.setData({
      isShowProject: false,
      isShowTechnician: false,
      isShowProjectPartner: false,
    })
    this.checkValue()
  },
  // checkboxChange: function (e) {
  //   var temp = "orderList.incloudProject";
  //   var temp1 = "orderList.isShowConfirmBtn";
  //   var len = e.detail.value.length
  //   if(len>0){
  //     this.setData({
  //       [temp1]: 1,
  //       isShowConfirmBtn:1
  //     })
  //   }else{
  //     this.setData({
  //       [temp1]: 0,
  //       isShowConfirmBtn:0
  //     })
  //   }
  //   var list = e.detail.value;
  //   var list1 = [];

  //   for(var index in list){
  //       var hi = {code:list[index]}
  //       list1.push(hi)
  //   }

  //   this.setData({
  //     checkedProjectList:list,
  //     [temp]: list1
  //   })
  // },
  //同行人选择项目
  checkboxChangePartner:function(e){

    var temp = "orderList.togethers[" + this.data.partnerIndex +"].incloudProject";
    var temp1 = "orderList.togethers[" + this.data.partnerIndex + "].isShowConfirmBtn";

    var list = e.detail.value;
    var len = e.detail.value.length
    if (len > 0) {
      this.setData({
        [temp1]: 1,
        isShowConfirmBtn:1
      })
    } else {
      this.setData({
        [temp1]: 0,
        isShowConfirmBtn:0
      })
    }
    var list1 = [];

    for (var index in list) {
      var hi = { code: list[index] }
      list1.push(hi)
    }
    this.setData({
      [temp]: list1
    })

  },

  /**
   * 免费预约按钮
   */
  isOk: function(){
    var page = this;
    if (page.data.yoyakuProject != '' && page.data.orderStroe != '' && page.data.orderTime!=''){
      page.setData({
        isOk:"bottom_btn1"
      })
    }
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

  /** 合并后加的内容 */
    chooseArea: function () {
    this.setData({
      hiddenmodalchoosearea: true
    })
  }
  ,
  saveArea: function () {
    var name;
    var areaCode;
    var areaList = this.data.areaList
    for (var index in areaList) {
      if (this.data.areaId == areaList[index].id) {
        name = areaList[index].name,
          areaCode = areaList[index].areaCode
        areaList[index].checked = true
      } else {
        areaList[index].checked = false
      }
    }
    this.setData({
      areaList: areaList,
      area: name,
      areaCode: areaCode,
      hiddenmodalchoosearea: false
    })
    this.hideModal()
  },
  yuyueBtn: function () {
    var self = this;
    console.log("本人订单数据" + self.data.orderList.incloudProjectName)
    console.log("vipNo:"+app.globalData.vipNo)

    //check用户是否注册 没注册调接口注册
    var vipNo = app.globalData.vipNo;
    if (vipNo==''|vipNo==null){
      self.setData({
        hiddenmodalbindphone: true
      })
    }else if(vipNo!=''&&vipNo!=null){
      var data = JSON.stringify(self.data.orderList);

      var storesInfo = JSON.stringify(self.data.storesInfo);//将经纬度传过去 给导航用

      wx.navigateTo({
        url: '../../pages/yoyakuCheckPage/yoyakuCheckPage?orderList=' + data + '&storesInfo=' + encodeURIComponent(storesInfo) ,
      })
      //console.log(self.data.orderList.incloudProject[0].code)
      //有vipNo则调用创建预约接口
      // wx.request({
      //   url: app.globalData.path +'rest/res/createReservation',
      //   data:{
      //     accessToken:'YUIEGDNjBmxmf3VDY0QHU3xmbAQs6dOV5XWLDu',
      //     startTime:self.data.orderList.orderTime,
      //     incloudProject:self.data.orderList.incloudProject,
      //    // type:1,
      //     storeCode: self.data.orderList.storeCode,
      //     vipNo: vipNo,
      //     nurseCode: self.data.nurseCode
      //   },
      //   header: {//请求头
      //     "Content-Type": "applciation/json"
      //   },
      //   method:'post',
      //   success:function(res){
      //       console.log(res)
      //   },
      //   fail: function (err) {
      //       console.log(err)
      //   },//请求失败
      //   complete: function () {
      //   }//请求完成后执行的函数
      // })
    }
  },
  bind_phone: function () {
    var self = this
    var vipNo = '';
    var nickName = self.data.nickName;
    var gender = self.data.gender;
    var phoneNumber = self.data.phoneNumber;
    var birthday = '';
    var avatar = self.data.avatarUrl;
    var province = '';
    var city = '';
    var district = '';
    var education = '';
    var introducer = '';
    var introducerPhone = '';
    var occupation = '';
    var income = '';
    var marital = '';
    var sparePhone = '';
    var openId = app.globalData.openid;
    var sysId = '';
    console.log(self.data.phoneNumber); console.log(self.data.yzmCode);
    console.log(nickName)
    console.log(gender)
    console.log(phoneNumber)
    console.log(openId)
    if (self.data.yzmCode != ''){
      self.showLoading() //开始一系列验证
      wx.request({
        url: app.globalData.path + 'rest/xcx/xcxCheckPhoneCode?phone=%2B' + self.data.areaCode + self.data.phoneNumber + '&passWord=' + self.data.yzmCode,//?phone='+self.data.phoneNumber+'&passWord='+self.data.yzmCode,
        // header: {//请求头
        //   "Content-Type": "applciation/json"
        // },
        // data:{
        //   phone: '%2B' + self.data.areaCode + self.data.phoneNumber,
        //   passWord: self.data.yzmCode
        // },
        method:'get',
        success:function(res){
          //console.log(res)
          if(res.data.errcode == -10){
            self.hiddenLoading()//关闭loading图标
            wx.showModal({
              title: '',
              content: res.data.errmsg,
              confirmColor: '#fbb059',
            });
            self.setData({
              popErrorMsg: '验证码错误...'
            })
            app.ohShitfadeOut(self);
            return
          }else{
            // wx.showToast({
            //   title: '手机验证成功...',
            //   icon:'success',
            //   duration: 1000
            // });
            self.setData({
              hiddenmodalbindphone: false
            });
            self.hideModal()
            //手機驗證成功后，调接口 换取注册时需要的参数unid
            var encryptedData = self.data.encryptedData;
            var iv = self.data.iv;
            var sessionKey = app.globalData.session_key;
            wx.request({
              url: app.globalData.path +'rest/xcx/xcxGetUserInfo',
              method: 'GET',
              data: {
                sessionKey: sessionKey,
                encryptedData: encryptedData,
                iv: iv
              },
              success:function(res){
                  var union_id = res.data.union_id;
                  self.setData({
                    union_id: union_id,
                  });
                  //注册
                  wx.request({
                    url: app.globalData.path + 'rest/transmission/createMember',
                    method: 'post',
                    data: {
                      vipNo: vipNo,
                      name: nickName,
                      gender: gender,
                      phone: phoneNumber,
                      birthday: birthday,
                      avatar: avatar,
                      province: province,
                      city: city,
                      district: district,
                      education: education,
                      introducer: introducer,
                      introducerPhone: introducerPhone,
                      occupation: occupation,
                      income: income,
                      marital: marital,
                      sparePhone: sparePhone,
                      openId: openId,
                      sysId: sysId,
                      unionId: self.data.union_id
                    },
                    success: function (res) {
                      console.log("注册返回数据...")
                      console.log(res)
                      if (res.data.errcode == 0) {
                        self.hiddenLoading()//关闭loading图标
                        wx.showToast({
                          title: '注册成功',
                          icon: 'success',
                          duration: 1000
                        });
                        //console.log("**********************")
                        //console.log(self.data.orderList)
                        //console.log(self.data.storesInfo)
                        var data = JSON.stringify(self.data.orderList);
                        var storesInfo = JSON.stringify(self.data.storesInfo);//将经纬度传过去 给导航用
                        setTimeout(function() {
                        wx.navigateTo({
          url: '../../pages/yoyakuCheckPage/yoyakuCheckPage?orderList=' + data + '&storesInfo=' + encodeURIComponent(storesInfo),
                          })
                        }, 1000)
                      } else {
                        self.hiddenLoading()//关闭loading图标
                        wx.showModal({
                          title: "",
                          content: res.data.errmsg,
                          confirmColor: '#fbb059',
                        });
                      }
                    }
                  });

                },
              fail: function (err) {
                self.hiddenLoading()//关闭loading图标
                // wx.showModal({
                //   title: "请求超时",
                //   content: "系统繁忙，请稍后重试！",
                //   showCancel: false,
                // });
              }
            })
        }
      },
      fail: function (err) {
        self.hiddenLoading()//关闭loading图标
        // wx.showModal({
        //   title: "请求超时",
        //   content: "系统繁忙，请稍后重试！",
        //   showCancel: false,
        // });
      }
    })
  }else{
      self.setData({
        popErrorMsg: '请检查验证码格式...'
      })
      app.ohShitfadeOut(self);
      return
  }
  },
  //
  closePage: function () {
    var area = '中国大陆'
    var areaId = '0'
    var areaCode = '86'
    var areaList = [{
      id: 0,
      name: "中国大陆",
      areaCode: "86",
      checked: true,

    },
    {
      id: 1,
      name: "中国香港",
      areaCode: "852",
      checked: false
    },
    {
      id: 2,
      name: "中国澳门",
      areaCode: "853",
      checked: false
    },
    ]
    this.setData({
      hiddenmodalbindphone: false,
      areaList: areaList,
      area: area,
      areaId: areaId,
      areaCode: areaCode,
      jihuo: false,
    })
    // this.setData({
    //   hiddenmodalbindphone: false
    // })
    this.hideModal()
  },
  areaChange: function (e) {
    this.setData({
      areaId: e.detail.value,
      phonecash:'',
      yzmcash:'',
      yzmRight:false,
      jihuo:false,
      areadyGetYzm: false,//改变了地区 电话也就更改了 所以将得到验证码状态设置为false
    })
  },
  checkthis:function(r){
    //console.log(r)
    var e = r.currentTarget.dataset.projectid
   // this.checkboxChange(e);
  },
  //为了养脑师页面来儿特写的方法
  queryNurseforNursePage: function (theDay) {
    //var today = new Date();
    var self = this;
    self.showLoading()
    //console.log(theDay)
    //console.log("查询门店可预约时间段，查询的日期为")
    //console.log(theDay)
    // var year = theDay.getFullYear().toString()
    // var mon = (theDay.getMonth() + 1).toString()
    // if (mon < 10) {
    //   mon = "0" + mon
    // }
    // var day = theDay.getDate()
    // if (day < 10) {
    //   day = "0" + day
    // }
    // //console.log(day)
    // //day = theDay.getDate().toString()
    // // console.log("打印当前时间")
    // // console.log(year)
    // // console.log(mon)
    // // console.log(day)
    // var dtoDate = year + mon + day
    var dtoDate = theDay.substring(0,10).replace(/-/g,'')
    //console.log(dtoDate)
    //判断是谁在改项目
    var prjCode = ''
    //console.log("同行人ID"+index)
    //此为判断 在order页面选择门店后，不返回项目CODE，不调接口
    // if (self.data.orderList.incloudProject.length == 0) {
    //   //console.log("这是选择门店回来 不含有项目code")
    //   return
    // }

      prjCode = self.data.orderList.incloudProject[0].code

    //console.log("打印要查询的项目code")
    //console.log(prjCode)
    //console.log(self.data.orderList.storeCode)
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/res/getReservationTimeRange',
      method: 'GET',
      data: {
        storeCode: self.data.orderList.storeCode,//app.globalDate.storeCode
        date: dtoDate,//'20180701',
        vipNo: '',
        prjUuid: prjCode,//此属性待商榷啊，本应该是个数组
      },
      success: function (res) {
        //console.log(res)
        //console.log("得到门店可预约时间段的查询结果");
        //console.log(res)
        //养脑师的列表属性名不对，循环重新赋值
        var list = res.data.nurse
        //因为要判断这个是本人选择的  然后将可用养脑师的数目统计一下
          self.setData({
            nurseCount: list.length
          })
        //赋值
        if (list.length != 0) {
          for (var index in list) {
            list[index].uuid = list[index].nurseCode
            if (list[index].nurseName.length == 2) {
              list[index].name = list[index].nurseName.charAt(0) + "   " + list[index].nurseName.charAt(1)
            } else {
              list[index].name = list[index].nurseName
            }

            list[index].level = list[index].nurseLevel
            list[index].imgUrl = list[index].nurseImg
            list[index].star = list[index].nurseStar
            list[index].reservationAvailableTime = list[index].reservationAvailableTime
            list[index].checked = false
            if (list[index].uuid == self.data.orderList.nurseCode){
              list[index].checked = true
            }
          }
        }

        // 后台正常返回
        if (res.data.errcode == 0) {
          self.setData({
            reservationAvailableTime: res.data.reservationAvailableTime,
            //将该门店的可预约技师列表赋值
            technicianList: list
          })
          //给时间控件赋值
          // if (e != null) {
          //   //console.log("e不为空了(非当天)，去修改时间状态")
          //   self.getTimeStatus(e.currentTarget.dataset.idx)
            // if (self.data.orderList.orderTime != '') {
              //专门为养脑师页面来 传了时间的时候  虽然已经呆了养脑师过来，但也需要筛选养脑师.. 对养脑师列表赋值...
              var ct = self.data.orderList.orderTime.replace(/-/g, '/');//将时间的-转换成/   例如2018-09-15 10:00:00  2018/09/15 10:00:00 Iphone才能识别
              //console.log("转换时间")
              //console.log(ct)
              var ctt = Date.parse(ct)
              //console.log(ctt)
              var nurseList = res.data.nurse//self.data.technicianList
              var listCanUsed = []
              // console.log("门店所有可用的技师:")
              // console.log(nurseList)
              //全都转换成时间戳去比较时间  筛选养脑师
              for (var index in nurseList) {
                if (nurseList[index].reservationAvailableTime.length != 0) {
                  for (var i in nurseList[index].reservationAvailableTime) {
                    var st = Date.parse(nurseList[index].reservationAvailableTime[i].startTime.replace(/-/g, '/'))
                    var et = Date.parse(nurseList[index].reservationAvailableTime[i].endTime.replace(/-/g, '/'))
                    //console.log(ctt >= st);
                    //console.log(ctt <= et);
                    if (ctt >= st && ctt <= et) {
                      listCanUsed.push(nurseList[index])
                      //console.log(nurseList[index])
                    }
                  }
                }
              }
              console.log("符合时间的养脑师数据返回完毕:")
              console.log(listCanUsed)

              //将筛选后的数组赋值给技师list
              self.setData({
                technicianListCanUsed: listCanUsed,
                currTimeNurseCount: listCanUsed.length
              })

        } else {
          wx.showModal({
            title: "",
            content: res.data.errmsg,
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
    self.hiddenLoading()
  },
  /**
   * 查询门店可预约时间段
   */
  queryStoreAvailabilityTime: function (theDay,e,index) {
    //var today = new Date();

    var self = this;
    self.showLoading()
    //console.log("查询门店可预约时间段，查询的日期为")
    //console.log(theDay)
    var year = theDay.getFullYear().toString()
    var mon = (theDay.getMonth() + 1).toString()
    if(mon<10){
      mon = "0" + mon
    }
    var day = theDay.getDate()
    if(day<10){
      day = "0" + day
    }
    //console.log(day)
    //day = theDay.getDate().toString()
    // console.log("打印当前时间")
    // console.log(year)
    // console.log(mon)
    // console.log(day)
    var dtoDate = year + mon + day
    //console.log(dtoDate)
    //判断是谁在改项目
    var prjCode = ''
    //console.log("同行人ID"+index)
    //此为判断 在order页面选择门店后，不返回项目CODE，不调接口
    if (self.data.orderList.incloudProject.length == 0) {
    //console.log("这是选择门店回来 不含有项目code")
      return
    }
    //index为空时  是本人在修改  index有值时，是同行人在选项目
    if(index == null){
       prjCode = self.data.orderList.incloudProject[0].code
    }else{
       prjCode = self.data.orderList.togethers[index].incloudProject[0].code
    }
    //console.log("打印要查询的项目code")
    //console.log(prjCode)
    //console.log(self.data.orderList.storeCode)
    // 发起网络请求 获取套餐信息
    wx.request({
      url: app.globalData.path + 'rest/res/getReservationTimeRange',
      method: 'GET',
      data: {
        storeCode: self.data.orderList.storeCode,//app.globalDate.storeCode
        date: dtoDate,//'20180701',
        vipNo: '',
        prjUuid: prjCode,//此属性待商榷啊，本应该是个数组
      },
      success: function (res) {
         //console.log("得到门店可预约时间段的查询结果");
         //console.log(res)
         //养脑师的列表属性名不对，循环重新赋值
         var list = res.data.nurse
        //因为要判断这个是本人选择的  然后将可用养脑师的数目统计一下
        if (index == null) {
          self.setData({
            nurseCount: list.length
          })
        }
        //赋值
         if(list.length!=0){
          for(var index in list){
            list[index].uuid = list[index].nurseCode
            if(list[index].nurseName.length==2){
              list[index].name = list[index].nurseName.charAt(0) + "   " + list[index].nurseName.charAt(1)
            }else{
              list[index].name = list[index].nurseName
            }

            list[index].level = list[index].nurseLevel
            list[index].imgUrl = list[index].nurseImg
            list[index].star = list[index].nurseStar
            list[index].reservationAvailableTime = list[index].reservationAvailableTime
            list[index].checked = false
          }
         }

        // 后台正常返回
        if (res.data.errcode == 0) {
            self.setData({
              reservationAvailableTime:res.data.reservationAvailableTime,
              //将该门店的可预约技师列表赋值
              technicianList:list
            })
            //给时间控件赋值
          if (e != null){
              //console.log("e不为空了(非当天)，去修改时间状态")
              self.getTimeStatus(e.currentTarget.dataset.idx)
              if(self.data.orderList.orderTime!=''){
                //专门为养脑师页面来 传了时间的时候  虽然已经呆了养脑师过来，但也需要筛选养脑师.. 对养脑师列表赋值...
                var ct = self.data.orderList.orderTime.replace(/-/g, '/');//将时间的-转换成/   例如2018-09-15 10:00:00  2018/09/15 10:00:00 Iphone才能识别
                //console.log("转换时间")
                //console.log(ct)
                var ctt = Date.parse(ct)
                //console.log(ctt)
                var nurseList = self.data.technicianList
                var listCanUsed = []
               // console.log("门店所有可用的技师:")
               // console.log(nurseList)
                //全都转换成时间戳去比较时间  筛选养脑师
                for (var index in nurseList) {
                  if (nurseList[index].reservationAvailableTime.length != 0) {
                    for (var i in nurseList[index].reservationAvailableTime) {
                      var st = Date.parse(nurseList[index].reservationAvailableTime[i].startTime.replace(/-/g, '/'))
                      var et = Date.parse(nurseList[index].reservationAvailableTime[i].endTime.replace(/-/g, '/'))
                     // console.log(ctt >= st);
                     // console.log(ctt <= et);
                      if (ctt >= st && ctt <= et) {
                        listCanUsed.push(nurseList[index])
                        //console.log(nurseList[index])
                      }
                    }
                  }
                }
               // console.log("符合时间的养脑师:")
               // console.log(listCanUsed)
                //将筛选后的数组赋值给技师list
                self.setData({
                  technicianList: listCanUsed,
                  currTimeNurseCount: listCanUsed.length
                })
              }
            }else{

                  self.getTimeStatus(0)

                //self.hiddenLoading()
              }

        } else {
          // wx.showModal({
          //   title: "请求超时",
          //   content: "系统繁忙，请稍后重试！",
          //   showCancel: false,
          // });
        }
      },
      fail: function (err) {
        // wx.showModal({
        //   title: "请求超时",
        //   content: "系统繁忙，请稍后重试！",
        //   showCancel: false,
        // });
      }
    });
  },

  /**  检测页面 必填项是否已经填写   */
  checkValue: function () {
    let singo = []
    let list = this.data.orderList
    let arrrr = ['', '-']
    let togethers = list.togethers || []
    togethers.map(item => {
      singo.push(arrrr.indexOf(item.incloudProjectName) < 0 && ['', '-', '请重新选择时间'].indexOf(item.orderTime) < 0 && item.isTimeOk)
    })
    let partner = singo.every(item => {
      return item
    })
    let isOk = Boolean(partner &&
      arrrr.indexOf(list.incloudProjectName) < 0 &&
      arrrr.indexOf(list.orderTime) < 0 &&
      arrrr.indexOf(list.orderStore) < 0)
    this.setData({isOk})
  },
  //验证大陆手机号
  testPhoneDalu:function(phone){
    var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
    return reg.test(phone)
  },
  //验证港澳手机号
  testPhoneGangAo: function (phone) {
    var reg = new RegExp('^([1-9])\\d{7}$');
    return reg.test(phone)
  },

  //获取验证码
  yzmGet:function(){
    var self =this
    var phone = self.data.phoneNumber;
    if(phone==''){
      self.setData({
        popErrorMsg:'请输入11位电话号'
      })
      app.ohShitfadeOut(self);
      return
    }else{
      console.log("验证手机号格式结果")
      console.log(self.testPhoneDalu(phone))
      // var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
      // var phoneVar = reg.test(phone);
      var result = false
      if (phone.length == 11){
        result = self.testPhoneDalu(phone)
      }else{
        result = self.testPhoneGangAo(phone)
      }
      if (result){
      self.getVerificationCode();
      //console.log(self.data.phoneNumber)
      // var a = self.data.areaCode;
      // var b = self.data.phoneNumber;
      // var c = a*1+b*1;
      //console.log(self.data.areaCode)
      wx.request({
        url: app.globalData.path + 'rest/xcx/xcxGetPhoneCode?phone=%2B' + self.data.areaCode + self.data.phoneNumber,
        // data:{
        //   //+86啥的加上没法注册
        //   phone='%2B' + self.data.areaCode + self.data.phoneNumber
        //  // phone: self.data.phoneNumber,
        // },
        // header:{
        //   'content-type':'application/json'
        // },
        success:function(res){
          //console.log(res)
          if(res.data.message=='success'){
            console.log("得到了验证码")
            self.setData({
              areadyGetYzm:true,
              yzmcash:''
            })
            //倒计时
            self.setData({
              popErrorMsg: '已发送验证码，请查收...'
            })
            app.ohShitfadeOut(self);
            return

          } else {
            self.setData({
              popErrorMsg: '请检查电话号对错'
            })
            app.ohShitfadeOut(self);
            return
          }
        },
        fail: function (err) {
          // wx.showModal({
          //   title: "请求超时",
          //   content: "系统繁忙，请稍后重试！",
          //   showCancel: false,
          // });
        }
      })
      }else{
        self.setData({
          popErrorMsg: '请输入正确的手机号'
        })
        app.ohShitfadeOut(self);
        return
      }
    }
  },
  //获得输入的电话号
  getPhone:function(e){
    //console.log(e)
   // console.log(e.detail.value.length)
    if(this.data.areaCode=='86'){
      if (e.detail.value.length == 11 && this.testPhoneDalu(e.detail.value)) {
        this.setData({
          phoneNumber: e.detail.value,
          jihuo:true,

        })
      } else {
        this.setData({
          phoneNumber: '',
          jihuo: false,
          yzmCode:'',
          yzmcash:'',
          areadyGetYzm: false,//改动号码时 得到验证码的状态为false
          yzmRight: false//当输完验证码后，改电话电话，验证码符合规格要设为false
        })
        if (e.detail.value.length == 11){
          this.setData({
            popErrorMsg: '请输入正确的手机号'
          })
          app.ohShitfadeOut(this);
          return
        }

      }
    } else {
      if (e.detail.value.length == 8 && this.testPhoneGangAo(e.detail.value)) {
        this.setData({
          phoneNumber: e.detail.value,
          jihuo: true
        })
      } else {
        this.setData({
          phoneNumber: '',
          jihuo: false,
          yzmCode:"",
          yzmcash: '',
          yzmRight: false //当输完验证码后，改电话电话，验证码符合规格要设为false
        })
        if (e.detail.value.length == 8) {
          this.setData({
            popErrorMsg: '请输入正确港澳电话...'
          })
          app.ohShitfadeOut(this);
          return
        }
      }
    }

    console.log(this.data.phoneNumber)
  }
  ,
 //得到输入的验证码
  setYzmCode:function(e){
    if (e.detail.value.length == 6 && this.data.areadyGetYzm == true){
      this.setData({
        yzmCode: e.detail.value,
        yzmRight:true
      })
    }else{
      this.setData({
        yzmCode: '',
        yzmRight:false
      })
      if (e.detail.value.length >= 1 && this.data.areadyGetYzm == false){
        this.setData({
          popErrorMsg: "请点击'获取'按钮，得到验证码..."
        })
        app.ohShitfadeOut(this);
        return
      }
    }
    console.log(this.data.yzmRight)
  },
  //验证码倒计时
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒',
        disabled: false
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: true
        })
      }
    }, 1000)
  },
  //验证码倒计时
  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },
  //查询当天轮排技师
  getTodayNurseList: function (storeUuid, checkedTime) {
    let self = this
    let date = Date.parse(checkedTime)//'1536854400000'
    let projectCode = []
    self.data.orderList.incloudProject.map(item => {
      projectCode.push(item.code)
    })
    wx.request({
      url: app.globalData.path + 'rest/reservation/storeTurns',
      data: {storeUuid, date, projectCode},
      success: function (res) {
        let resData = res.data
        if (resData.length && ["RES-51002", "RES-52001", "RES-50012"].indexOf(resData.errcode) < 0) {
          self.setData({
            ["orderList.nurseCodeName"]: resData[0].name + '轮排',
            ["orderList.nurseCode"]: resData[0].uuid
          })
        }// else console.log("没有轮排人员")
      }
    })
  },
  //显示加载logo
  showLoading:function(){
    this.setData({
      hiddenLoading: false
    })
  },
  //隐藏加载logo
  hiddenLoading:function(){
    this.setData({
      hiddenLoading: true
    })
  },
  //获取微信昵称
  onGotUserInfo:function(e){
    var self = this;
    //性别 男 1  女 2
    if (e.detail.userInfo.gender ==  1) {
      var gender = 'GENDER_001'
    } else if (e.detail.userInfo.gender == 2) {
      var gender = 'GENDER_002'
    } else {
      var gender = 'GENDER_003'
    }
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    var avatarUrl= e.detail.userInfo.avatarUrl
    self.setData({
      nickName:e.detail.userInfo.nickName,
      gender:gender,
      encryptedData: encryptedData,
      iv: iv,
      avatarUrl: avatarUrl
    })
    self.bind_phone();
  },
  //预约满时
  yoyakuFullTime:function(e){
    let self = this
    self.showLoading()
    let orderList = self.data.orderList//简化
    let dataset = e.currentTarget.dataset//简化，被点击的按钮上带的参数
    let index = dataset.index//简化，点击的按钮的index属性。index==99指是本人选了满的时间，否则是同行人选择的。潜在bug，选择了超过99个时间的时候触发
    let prjUuid = (index == 99 ? orderList : orderList.togethers[index]).incloudProject[0].code//预约的项目id
    // let times = self.data.navbarValues[orderList.currentTab] + " " + dataset.item.substring(0, 8)//以前只能预约当天的时间
    let nowTime = new Date()
    let Y_M = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-'//年加月
    let todayHead = Y_M + nowTime.getDate() + ' '//当天的年月日
    let tomorrowHead = Y_M + (nowTime.getDate() + 1) + ' '//明天的年月日
    let times = (dataset.item.substring(0, 1) == '0' ? tomorrowHead : todayHead) + dataset.item//现在可以预约后半夜的时间
    let reservationTime = Date.parse(times)
    let url = app.globalData.path + 'rest/RzMiniProgramRest/searchStoresWithinGivenDistance'
    let storeInfo = self.data.storesInfo
    let param = {
      cityCode: app.globalData.cityCode,
      lon: storeInfo.lon, lat: storeInfo.lat,
      distance: '3000', reservationTime, prjUuid, vipNo: '',
    }
    self.isOtherStoreHaveTime(url, param, reservationTime)
    self.hiddenLoading()
  },
  //查询其他门店是否有有空的护理师
  isOtherStoreHaveTime: function (url, data, dtoTime) {
    let self = this
    let content = ''
    let confirmText = '确定'
    let showCancel = false
    let success = function (res) {
    }

    function showModal () {
      wx.showModal({title: '', content, confirmColor: '#fbb059', confirmText, success, showCancel})
    }

    wx.request({
      url, data, method: 'POST',
      success (res) {
        if (res.data.length > 0) {
          content = app.globalData.storeName + '此时间已约满，是否查看同时间可预约门店？'
          confirmText = '查看'
          showCancel = true
          success = function (res) {
            if (res.confirm) {
              self.setData({currFullTime: dtoTime})
              self.go2otherStore()
            }
          }
          showModal()
        } else {
          content = '该时间段暂无可预约门店，请您尝试更换其他时间，谢谢！'
          showModal()
        }
      },
      fail (err) {
        content = "服务器出错，稍后再试"
        showModal()
      }
    })
  },
  //跳转别的店铺
  go2otherStore:function(){
    //v=3
    var lat = this.data.storesInfo.lat
    var lon = this.data.storesInfo.lon
    var prjUuid = this.data.orderList.incloudProject[0].code
    var reservationTime = this.data.currFullTime

    console.log(lat + "," + lon + "," + prjUuid + "," + reservationTime)
    //console.log("我要去别的门店")
    app.globalData.v = '3'
    app.globalData.reservationTime = reservationTime
    app.globalData.prjUuid = prjUuid
    app.globalData.lon = lon
    app.globalData.lat = lat
    wx.reLaunch({
      url: '../../pages/selectStores/selectStores'//?reservationTime=' + reservationTime + "&prjUuid=" + prjUuid + "&lon=" + lon+"&lat="+lat+"&v=3&jumpPage=2",
    })
  },
  preventTouchMove:function(){

  },
  checkThis:function(e){
    //console.log(e)
    var pjid = e.currentTarget.dataset.id
    var pjlist = this.data.projectList
    //console.log("现在的项目列表")
   // console.log(pjlist)
    //console.log("选中的项目code：" + pjid)
    for(var index in pjlist){
      if (pjlist[index].uuid == pjid){
        if (pjlist[index].checked == false){
           pjlist[index].checked = true
        }else{
           pjlist[index].checked = false
        }
      }
    }
    this.setData({
      projectList: pjlist
    })
    var count = 0
    var pj = []
    for(var index in this.data.projectList){
      if (this.data.projectList[index].checked == true){
        pj.push(this.data.projectList[index].uuid)
        count ++
      }
    }

    var len = count
    var temp = "orderList.incloudProject";
    var temp1 = "orderList.isShowConfirmBtn";
    //var len = e.detail.value.length
    if (len > 0) {
      this.setData({
        [temp1]: 1,
        isShowConfirmBtn: 1
      })
    } else {
      this.setData({
        [temp1]: 0,
        isShowConfirmBtn: 0
      })
    }
    //var list = e.detail.value;
    var list1 = [];

    for (var index in pj) {
      var hi = { code: pj[index] }
      list1.push(hi)
    }

    this.setData({
      //checkedProjectList: list,
      currPjCode:list1,
      //[temp]: list1
    })
  },
  checkThisPartner:function(e){
    //console.log(e)
    var pjid = e.currentTarget.dataset.id
    var pjlist = this.data.projectList
    //console.log("现在的项目列表")
    //console.log(pjlist)
    //console.log("选中的项目code：" + pjid)
    for (var index in pjlist) {
      if (pjlist[index].uuid == pjid) {
        if (pjlist[index].checked == false) {
          pjlist[index].checked = true
        } else {
          pjlist[index].checked = false
        }
      }
    }
    this.setData({
      projectList: pjlist
    })
    var count = 0
    var pj = []
    for (var index in this.data.projectList) {
      if (this.data.projectList[index].checked == true) {
        pj.push(this.data.projectList[index].uuid)
        count++
      }
    }

    var len = count

    //var temp = "orderList.togethers[" + this.data.partnerIndex + "].incloudProject";
    var temp1 = "orderList.togethers[" + this.data.partnerIndex + "].isShowConfirmBtn";
    //var len = e.detail.value.length
    if (len > 0) {
      this.setData({
        [temp1]: 1,
        isShowConfirmBtn: 1
      })
    } else {
      this.setData({
        [temp1]: 0,
        isShowConfirmBtn: 0
      })
    }
    //var list = e.detail.value;
    var list1 = [];

    for (var index in pj) {
      var hi = { code: pj[index] }
      list1.push(hi)
    }

    this.setData({
      //checkedProjectList: list,
      //[temp]: list1,
      currPjCode:list1
    })
  },
  chooseNurse:function(e){
    //console.log(e.currentTarget.dataset.id)
    var nurseid = e.currentTarget.dataset.id

    var list = this.data.technicianListCanUsed
    //console.log("点击前的养脑师")
    //console.log(list)
    for (var index in list){
      if (list[index].uuid == nurseid){
        //console.log("被选中的养脑师id："+nurseid)
        list[index].checked = true
      }else{
        list[index].checked = false
      }
    }
    //console.log("点击后的养脑师")
    //console.log(list)
    this.setData({
      technicianListCanUsed: list
    })

    this.setData({
      checkedTechnicianId: nurseid
    })
    //如果有被选中的  确定按钮激活
    if (this.data.checkedTechnicianId != '') {

      this.setData({
        isCheckedTechnician: true
      })
    }
  },
  /**
   * 以下为打开同行人选择养脑师功能代码
   */
  // togetherChooseTechnician:function(){
  //   var newList = []
  //   for(var index in this.data.technicianList){
  //     if (this.data.nurseCode == this.data.technicianList[index].uuid){

  //     }else{
  //       newList.push(this.data.technicianList[index])
  //     }
  //   }
  //   this.setData({
  //     isShowTechnician:true
  //   })
  // }
})