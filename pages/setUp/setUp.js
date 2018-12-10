// pages/setUp/setUp.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
var login = require("../../utils/login.js");
var util = require("../../utils/util.js");
var interval = null //倒计时函数
//获取应用实例
const app = getApp();
// 拟定验证码
var yZm;
// 获取完整的年月日 时分秒，以及默认显示的数组
var data = new Date();
// var tim = "2000-02-24 09:00"
console.log(13)
console.log(new Date().getDate())
var mou = "0"
var mo = new Date().getMonth()+1
if (mo <10 ){

  mo = mou + mo
}

var tim = "" + new Date().getFullYear() + "-" + mo + "-" + new Date().getDate()+" 09:00"
var obj = dateTimePicker.dateTimePicker(1900, 2100, tim);
var timeArr = obj.dateTimeArray
var dataTimeArr = obj.dateTime
var years = timeArr[0]
var months = timeArr[1]
var days = timeArr[2]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    years: years,
    year: '',
    months: months,
    month: '',
    days: days,
    day:'',
    //year: date.getFullYear(),
    value: [dataTimeArr[0], new Date().getMonth(), new Date().getDate() - 1],
    //以上为时间控件
    yearOld: '',
    monthOld: '',
    dayOld: '',
    //警告生日只能修改一次的view控制
    warn_msg: false,
    areadyGetYzm: false,
    // 加载中
    hiddenLoading: true,
    // title显示
    popErrorMsg: "",
    //验证码按钮的颜色控制
    jihuo: false,
    //注册时 换地区  输入的电话号清空
    //验证码符合规范
    yzmRight: false,
    yzmcash: '',
    disabled: true,
    IsGetCode: 0,
    union_id: "",

    phonecash: '',
    showtitle1: true,
    showtitle2: false,
    showNikeNameOne: "",
    showNikeNameThree: "",
    assets: "",
    coupons: "",
    nikename: "",
    cardNumber: "",
    endtime: "",
    date: "",
    phoneNum: "",
    phoneNumTrue: '',
    showPhoneNum: '',
    yanzhengma: "",
    vipNo: '',
    openid: "",
    items: [{
        name: 'M',
        value: '男',
        checked: false
      },
      {
        name: 'w',
        value: '女',
        checked: false
      },
    ],
    radioStr: "",
    showModal: "",
    chargeDetailVisible: "",

    //选择地区的数组
    areaList: [{
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
    hiddenmodalchoosearea: false,
    area: '中国大陆',
    areaId: '0',
    areaCode: '86',
    hiddenmodalbindphone: false,

    //获取验证码
    time: '获取', //倒计时 
    currentTime: 61,
    yZmState: 0,

    // 个人昵称和性别 
    nikeName: "",
    gender: "",
    // 验证码验证标识码
    yzmCode: 0,

    encryptedData: "",
    iv: "",

    avatarUrl: "",
    showAll:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    // 根据传过来的性别显示性别-默认为女
    var itemsNew = self.data.items;
    var gender = options.gender;
    if (options.gender == "男") {
      itemsNew[0].checked = true;
      itemsNew[1].checked = false;
      self.setData({
        items: itemsNew
      });
    } else if (options.gender == "女") {
      itemsNew[0].checked = false;
      itemsNew[1].checked = true;
      self.setData({
        items: itemsNew
      });
    } else {
      itemsNew[0].checked = false;
      itemsNew[1].checked = false;
      self.setData({
        items: itemsNew
      });
    }
    //出生日期
    var birthday = options.birthday;
    console.log("***" + birthday)
    console.log(options)
    var isModifiedBirthday = options.isModifiedBirthday;
    if (birthday != 'null' && birthday != 'undefined') {
      var birthArr = birthday.split('-');
      var year = birthArr[0];
      var month = birthArr[1];
      var day = birthArr[2];
      self.setData({
        year: year,
        month: month,
        day: day,

      });
    }
    
    self.setData({
      isModifiedBirthday: isModifiedBirthday,
    });


    if (options.birthday == "" || options.birthday == null || options.birthday == "undefined" || options.birthday == "null") {
      self.setData({
        date: ""
      });
    } else {
      self.setData({
        date: options.birthday
      });
    }
    
    if (options.phone == "" || options.phone == null || options.phone == "undefined" || options.phone == "null") {
      self.setData({
        phoneNum: "",
        phoneNumTrue: '',
        showPhoneNum: ''
      });
    } else {
      var str = options.phone
      var head = str.substring(0, 3)
      var end = str.substring(7, 11)
      var rs = head + '****' + end
      self.setData({
        phoneNum: options.phone,
        phoneNumTrue: options.phone,
        showPhoneNum: rs
      });
    }

    if (options.nikename == "0") {
      self.setData({
        coupons: options.coupons,
        assets: options.assets,
        cardNumber: options.cardNumber,
        // date: options.birthday,
        showNikeNameOne: true,
        showNikeNameThree: false,
        endtime: util.formatTime(new Date()),
      });
    } else {
      self.setData({
        coupons: options.coupons,
        assets: options.assets,
        nikename: options.nikename,
        cardNumber: options.cardNumber,
        showNikeNameOne: false,
        showNikeNameThree: true,
        endtime: util.formatTime(new Date()),
      });
    };
    login.checkInitAgree(self, function() {
      self.showLoading();
      self.doInit(options);
    });
  },

  doInit: function(options) {
    var self = this; 
    self.setData({
      openid: app.globalData.openid,
      vipNo: app.globalData.vipNo,

    });

    if (!app.globalData.vipNo) {
      self.setData({
        chargeDetailVisible: true,
        showtitle1: true,
        showtitle2: false,
      });
    } else {
      self.setData({
        chargeDetailVisible: false,
        showtitle1: false,
        showtitle2: true,
      });
    }
    self.hideLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var self=this
    self.setData({
      showAll: true
    });
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
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},

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

  /**
   * 显示授权模态窗口
   */
  showAuthModal: function() {
    this.setData({
      showAuthModal: true
    })
  },

  /**
   * 隐藏授权模态窗口
   */
  hideAuthModal: function() {
    this.setData({
      showAuthModal: false
    });
  },
  /**
   * 显示收费标准
   */
  showChargeDetail() {
    this.setData({
      chargeDetailVisible: true,

    })

  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 隐藏收费标准
   */
  hideChargeDetail() {
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
      areaList: areaList,
      area: area,
      areaId: areaId,
      areaCode: areaCode,
    })
    this.setData({
      chargeDetailVisible: false
    });
    clearInterval(interval);
    this.setData({
      time: '验证',
      currentTime: 61,
      disabled: true,
      jihuo: false,
      yzmRight: false,
    })

    // var switchTabUrl = '/pages/mine/mine';
    // wx.switchTab({
    //   url: switchTabUrl,
    //   success: function (e) {
    //     var page = getCurrentPages().pop();
    //     if (page == undefined || page == null) return;
    //     page.onLoad();
    //   }
    // });
  },

  /**
   * 点击我的资产跳转
   */
  goMineAssets: function() {
    wx.navigateTo({
      url: '../mineAssets/mineAssets',
    })
  },
  /**
   * 点击我的优惠券跳转
   */
  goCouponsList: function() {
    wx.navigateTo({
      url: '../couponsList/couponsList',
    })
  },
  // /**
  //  * 页面跳转
  // */
  // goPhone: function () {

  //   this.setData({ showModal: true });
  // },
  /**
   * 获取出生日期的date
   */
  changeDate(e) {
    this.setData({
      date: e.detail.value
    });
    this.data.date = e.detail.value;
    console.log(this.data.date);

  },

  /**
   * 性别复选框
   */
  radioChange: function(e) {
    var str = null;
    for (var value of this.data.items) {
      if (value.name === e.detail.value) {
        str = value.value;
        break;
      }
    }
    console.log(482)
    console.log(str)
    if (str == '男') {
      this.setData({
        radioStr: "GENDER_001"
      });
    } else if (str == '女') {
      this.setData({
        radioStr: "GENDER_002"
      });
    } else {
      this.setData({
        radioStr: "GENDER_003"
      });
    }
    console.log(this.data.radioStr);
  },
  /**
   * 第二浮窗返回数据
   */
  chooseArea: function() {
    this.setData({
      hiddenmodalchoosearea: true
    })
  },
  saveArea: function() {
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
    this.hideModal();
  },
  areaChange: function(e) {
    this.setData({
      areaId: e.detail.value,
      phonecash: '',
      yzmcash: '',
      yzmRight: false,
      jihuo: false,
      areadyGetYzm: false,
    })
  },
  /**
   * 第一浮窗的返回数据
   */
  // retrunData: function (e) {
  //   console.log(e);
  //   yZm = e.detail.value.yanzhengma;
  //   this.validation(yZm);
  // },
  /**
   * 返回数据
   */
  getInitialData: function() {
    var self = this;
    // 发起网络请求 返回修改会员信息
    if (self.data.vipNo == null || self.data.vipNo == "") {
      self.setData({
        popErrorMsg: "未注册，点击设置注册！"
      })
      app.ohShitfadeOut(self);
      return;
    }
    // if (self.data.nikename == null || self.data.nikename ==""){
    //   self.setData({
    //     popErrorMsg: "姓名不能为空！"
    //   })
    //   app.ohShitfadeOut(self);
    //   return;
    // }
  
    var year=self.data.year;
    var month = self.data.month;
    var day = self.data.day;
    if(year==''|month==''|day==''){
      var birthday = ''
    }else{
      var birthday = year + '-' + month + '-' + day
    }
    
    console.log("naaaaaaaaaaaaaaaameeeeeeeeeeeeeeeeee")
    console.log(self.data.nikename)
    console.log(571)
    console.log(self.data.radioStr)
    wx.request({
      url: app.globalData.path + 'rest/transmission/modifyMemberInfo',
      method: 'POST',
      data: {
        name: self.data.nikename,
        gender: self.data.radioStr,
        vipNo: self.data.vipNo,
        phone: self.data.phoneNumTrue,
        birthday: birthday,
      },
      success: function(res) {
        console.log(res);
        // 后台正常返回
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function() {
            wx.switchTab({
              url: '../../pages/mine/mine',
            })
          }, 1000)

        } else {
          // self.setData({
          //   popErrorMsg: '修改失败...'
          // })
          // app.ohShitfadeOut(self);
          wx.showModal({
            title: '',
            content: res.data.errmsg,
            showCancel: false,
            confirmColor: '#fbb059',
          })
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
  /**
   * 调用返回数据接口
   */
  goSave: function(e) {
    var self = this;

    self.getInitialData();
  },
  /**
   * 获取验证码
   */
  obtain: function() {
    var self = this;
    //倒计时
    self.getVerificationCode();
    if (self.data.phoneNum.length != 11) {
      this.setData({
        popErrorMsg: "请输入正确的手机号！"
      })
      app.ohShitfadeOut(self);
      return;
    }
    wx.request({
      url: app.globalData.path + 'rest/xcx/xcxGetPhoneCode?phone=%2B' + self.data.areaCode + self.data.phoneNum,
      method: 'GET',
      data: {
        // phone: "13504090230"

      },
      success: function(res) {
        console.log("获取手机验证码");
        console.log(res);
        if (res.data.message == 'success') {
          console.log("得到了验证码")
          self.setData({
            areadyGetYzm: true,
            yzmcash: ''
          })
          //倒计时
          self.setData({
            popErrorMsg: '已发送验证码，请查收...'
          })
          app.ohShitfadeOut(self);
          return
        }
        if (res.statusCode == 200) {
          console.log(res.data.message);
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
  /**
   * 输入完手机号更新缓存手机号码
   */
  //验证大陆手机号
  testPhoneDalu: function(phone) {
    var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
    return reg.test(phone)
  },
  //验证港澳手机号
  testPhoneGangAo: function(phone) {
    var reg = new RegExp('^([1-9])\\d{7}$');
    return reg.test(phone)
  },
  getPhone: function(e) {
    // if (e.detail.value.length == 11){
    //   this.data.phoneNum = e.detail.value;
    //   this.setData({ phoneNum: e.detail.value});
    // }
    if (this.data.areaCode == '86') {
      if (e.detail.value.length == 11 && this.testPhoneDalu(e.detail.value)) {
        this.setData({
          phoneNum: e.detail.value,
          jihuo: true,
        })
      } else {
        this.setData({
          phoneNum: '',
          jihuo: false,
          yzmCode: '',
          yzmcash: '',
          areadyGetYzm: false, //改动号码时 得到验证码的状态为false
          yzmRight: false
        })
        if (e.detail.value.length == 11) {
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
          phoneNum: e.detail.value,
          jihuo: true
        })
      } else {
        this.setData({
          phoneNum: '',
          jihuo: false,
          yzmCode: "",
          yzmcash: '',
          yzmRight: false
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
  },
  /**
   * 输入完验证码更新缓存验证码
   */
  getYzm: function(e) {
    if (e.detail.value.length == 6 && this.data.areadyGetYzm == true) {
      yZm = e.detail.value;
      this.setData({
        yzmRight: true,
        yzmCode: yZm
      })
    } else {
      yZm = "";
      this.setData({
        yzmCode: '',
        yzmRight: false
      })
      if (e.detail.value.length >= 1 && this.data.areadyGetYzm == false) {
        this.setData({
          popErrorMsg: "请点击'获取'按钮，得到验证码..."
        })
        app.ohShitfadeOut(this);
        return
      }
    }
  },
  /**
   * 验证码验证
   */
  validation: function(code, nikeName, gender) {
    var self = this;
    self.showLoading()
    console.log("验证码=" + code);
    if (code.length != 6) {
      this.setData({
        popErrorMsg: "验证码必须是6位！"
      })
      app.ohShitfadeOut(self);
      return;
    }
    console.log("修改手机号来了")
    wx.request({
      url: app.globalData.path + 'rest/xcx/xcxCheckPhoneCode?phone=%2B' + self.data.areaCode + self.data.phoneNum + '&passWord=' + code,
      method: 'GET',
      data: {
        // phone: self.data.phoneNum,
        // passWord: code,
      },
      success: function(res) {
        console.log("验证码验证");
        console.log(res);
        if (res.data.errcode != -10) {
          // 后台正常返回
          if (self.data.vipNo == null || self.data.vipNo == "") {
            //新添加接口，代码修改
            self.getUser(nikeName, gender);
            // // 第一次验证成功后调用注册接口
            // self.getRegistered(nikeName, gender);
          } else {
            yZm = "";
            self.setData({
              popErrorMsg: "手机号码修改成功！",
              chargeDetailVisible: false,
              jihuo: false,
              yzmRight: false,
              IsGetCode: 1,
              phoneNumTrue: self.data.phoneNum,
              showNikeNameThree: true,
              showNikeNameOne: false,
              disabled: true,
              showPhoneNum: self.data.phoneNum,
            })
            app.ohShitfadeOut(self);
            clearInterval(interval);
            self.setData({
              time: '获取',
              currentTime: 61,

            })
          }
        } else {
          self.setData({
            popErrorMsg: "验证码错误！",
            disabled: true,
          })
          app.ohShitfadeOut(self);

          wx.showModal({
            title: "请求超时",
            content: res.data.errmsg,
            showCancel: false,
            confirmColor: '#fbb059',
          });
          // clearInterval(interval);
          // self.setData({
          //   time: '获取',
          //   currentTime: 61,

          //   jihuo: false,
          //   yzmRight: false,
          // })
          // yZm = "";
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
    self.hideLoading()
  },
  // 进入验证码倒计时
  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },
  //验证码倒计时
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
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

  //获取用户名称性别
  onGotUserInfo: function(e) {
    var self = this;
    console.log(yZm);
    console.log(e);
    // self.setData({
    //   nickName: e.detail.userInfo.nickName,
    //   gender: e.detail.userInfo.gender
    // });
    var a = e.detail.userInfo.nickName;
    var b = e.detail.userInfo.gender;
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    var avatarUrl = e.detail.userInfo.avatarUrl;
    self.setData({
      encryptedData: encryptedData,
      iv: iv,
      // nikename:a,
      avatarUrl: avatarUrl,
    });
    if (b == 1) {
      var c = "GENDER_001";
    } else if (b == 2) {
      var c = "GENDER_002";
    } else {
      var c = "GENDER_003";
    }
    console.log(a + c);
    if (yZm == "undefined" || yZm == "null" || yZm == "" || yZm == null) {
      self.setData({
        popErrorMsg: "请输入手机号和验证码！！"
      })
      app.ohShitfadeOut(self);
      return
    } else if (self.data.jihuo == false || self.data.yzmRight == false) {
      self.setData({
        popErrorMsg: "请输入手机号和验证码！！"
      })
      app.ohShitfadeOut(self);
      return
    } else {
      self.validation(yZm, a, c);
    }
  },

  // 注册
  getRegistered: function(nikeName, gender) {
    var self = this;
    console.log(nikeName);
    console.log(gender);
    console.log(self.data.phoneNum);
    console.log(self.data.openid);
    console.log(self.data.union_id);
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
    var sysId = '';
    var birthday = '';
    var unionId = self.data.union_id
    wx.request({
      url: app.globalData.path + 'rest/transmission/createMember',
      method: 'POST',
      data: {
        name: nikeName,
        gender: gender,
        vipNo: "",
        phone: self.data.phoneNum,
        openId: self.data.openid,
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
        sysId: sysId,
        unionId: unionId,
      },
      success: function(res) {
        console.log("注册");
        console.log(res);

        yZm = "";
        clearInterval(interval);
        self.setData({
          time: '验证',
          currentTime: 61,
          // disabled: false,
          jihuo: false,
          yzmRight: false,
        })
        if (res.data.errcode == 0) {
          // 后台正常返回
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          });

          login.checkInitAgree(self, function() {

            if (app.globalData.vipNo == "" || app.globalData.vipNo == null) {
              self.setData({
                chargeDetailVisible: true,
                showtitle1: true,
                showtitle2: false,
              });
            } else {
              self.setData({
                chargeDetailVisible: false,
                showtitle1: false,
                showtitle2: true,
              });
            }

            // 如果vipNo为空,那么显示注册窗口
            self.setData({
              openid: app.globalData.openid,
              vipNo: app.globalData.vipNo,
              cardNumber: app.globalData.vipNo,
            });
          });


        } else {
          wx.showModal({
            title: "注册失败！",
            content: res.data.errmsg + '',
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

  //为注册获取参数
  getUser(nikeName, gender) {
    var self = this
    var encryptedData = self.data.encryptedData;
    var iv = self.data.iv;
    var sessionKey = app.globalData.session_key;
    console.log("encryptedData")
    console.log(encryptedData)
    console.log("iv")
    console.log(iv)
    console.log("sessionKey")
    console.log(sessionKey)
    //发起网络请求 
    wx.request({
      url: app.globalData.path + 'rest/xcx/xcxGetUserInfo',
      method: 'GET',
      data: {
        sessionKey: sessionKey,
        encryptedData: encryptedData,
        iv: iv
      },
      success: function(res) {
        console.log(899);
        console.log(res)
        console.log(res.errMsg)
        var union_id = res.data.union_id;
        self.setData({
          union_id: union_id,
        });
        // 第一次验证成功后调用注册接口
        self.getRegistered(nikeName, gender);
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
  //以下为时间控件
  toggleDialog: function() {
    var self=this;
    var isModifiedBirthday = self.data.isModifiedBirthday;
    console.log(1066)
    console.log(isModifiedBirthday)
      // || isModifiedBirthday == 'undefined'
    if (isModifiedBirthday == 'true' ){
  
      this.setData({
        isShow: false
      })
    }else{
      this.setData({
        isShow: true
      })
    }

  
  },
  bindChange: function(e) {
    
    const val = e.detail.value;
   var  yearChange=this.data.years[val[0]];
    var   monthChange= this.data.months[val[1]];
     var   dayChange= this.data.days[val[2]]
 

    var tim = "" + yearChange + "-" + monthChange + "-" + dayChange + " 09:00"
    var obj = dateTimePicker.dateTimePicker(1900, 2100, tim);
    var timeArr = obj.dateTimeArray
    var dataTimeArr = obj.dateTime
    var years = timeArr[0]
    var months = timeArr[1]
    var days = timeArr[2]
    this.setData({
      yearOld: this.data.years[val[0]],
      monthOld: this.data.months[val[1]],
      dayOld: this.data.days[val[2]],
      days: days
    })

  },
  hidePicker: function() {
    this.setData({

      isShow: false

    })
  },
  successEvent: function() {
    console.log(1146)
    if (this.data.yearOld != ''){
    var year = this.data.yearOld
    var month = this.data.monthOld
      var day = this.data.dayOld
    this.setData({
      isShow: false,
      year: year,
      month: month,
      day: day
    })
    }else{
      
      var year = new Date().getFullYear()
      var month = new Date().getMonth()+1
      var day = new Date().getDate()
      this.setData({
        isShow: false,
        year: year,
        month: month,
        day: day
      })
    }
  },
})