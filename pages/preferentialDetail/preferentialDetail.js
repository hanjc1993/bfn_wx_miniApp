// pages/preferentialDetail/preferentialDetail.js
var login = require("../../utils/login.js");
var checkUtils = require("../../utils/checkUtils.js");
const app = getApp();
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actName:'',
    actStart:'',
    //是否已全部领取
    hiddenLoading: true,
    isGotAll:false,
    yzmCode: '',
    yzmcash: '',
    phonecash: '',
    areadyGetYzm: false,
    //验证码按钮的颜色控制
    jihuo: false,
    //注册时 换地区  输入的电话号清空
    phonecash: '',
    //验证码符合规范
    yzmRight: false,
    //优惠券剩余
    couponResidue: '',
    showModal: "",
    chargeDetailVisible: "",
    union_id: '',
    couponListStyle:'',
    areaList: [{
        id: 0,
        name: "中国大陆",
        areaCode:"86",
        checked: true

      },
      {
        id: 1,
        name: "中国香港",
        areaCode:"852",
        checked: false
      },
      {
        id: 2,
        name: "中国澳门",
        areaCode:"853",
        checked: false
      },
    ],
    hiddenmodalchoosearea: false,
    area: '中国大陆',
    areaId: '0',
    areaCode:'86',
    hiddenmodalbindphone: false,
    //获取验证码
    time: '获取',
    //倒计时 
    currentTime: 61,
    disabled: true,
    showPage: false,
    actStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(query) {
    var self = this;
    console.log("query=" + query);
    const scene = decodeURIComponent(query.scene)
    console.log("scene="+scene);
    if (scene == 'undefined'){
      var actId = query.actId;
    } else {
      var actId = scene;
    }

    self.setData({
      actId: actId,
      //actName:query.actName,
      //actStart:query.actStart
    })
    login.checkInitAgree(self, function() {
      self.doInit();
    });
  },
  doInit: function() {
    var self = this;
    // 获取活动列表
    self.getAct();
    // if(app.globalData.vipNo!=''){
    //   self.isAlreadyGotCoupons();
    // }
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
   *规则弹窗
   */
  showDialogBtnName: function() {
    this.setData({
      showModalName: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMovecHospital: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModalName: function() {
    this.setData({
      showModalName: false
    });
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancelName: function() {
    this.hideModalName();
  },
  showHaveGotAllMsg:function(){
    wx.showModal({
      title: '',
      content: '您已经领取全部优惠券，不能再领取',
      showCancel:false,
      confirmColor: '#fbb059',
    })
  },
  //可领取状态
  isAlreadyGotCoupons:function(){
    var self = this
    wx.request({
      url: app.globalData.path + 'rest/RzActivity/actCouponActStatus?vipNo='+app.globalData.vipNo+'&actId='+this.data.actId,
      success:function(res){
        console.log("查询优惠券可领取状态")
        console.log(res)
        if(res.data.length!=0){
          var couponList = self.data.actDetail.couponList;
          //根据是否领取判断底部弹窗是否弹出       
           var reviceNumber=0;
          for(var index in res.data){
            if (JSON.stringify(res.data[index]).toString().indexOf("未领取") != -1){
             reviceNumber++ ;
              self.setData({
                showProject: true,
                reviceNumber: reviceNumber
              })
            }else{
              self.setData({
                reviceNumber: reviceNumber
              })
            }
          }
         console.log(200)
          console.log(reviceNumber)
          if (self.data.reviceNumber == 0) {
            self.showHaveGotAllMsg()
          }
          //把是否领取状态给该优惠券
          for (var index in res.data) {
            if (JSON.stringify(res.data[index]).toString().indexOf("未领取") != -1 || JSON.stringify(res.data[index]).toString().indexOf("已领光") != -1) {
               console.log(201)
              console.log(JSON.stringify(res.data[index]).toString().indexOf(couponList[index].couponId) )
              // if (JSON.stringify(res.data[index]).toString().indexOf(couponList[index].couponId) != -1) { 
                console.log("zhanghaipeng ")
                couponList[index].recive = true   
                //  }
                
            } else {
              // if (JSON.stringify(res.data[index]).toString().indexOf(couponList[index].couponId) != -1) {
                couponList[index].recive = false
              // }
             
            }
          }
          self.setData({
            couponListStyle1: couponList
          })
          console.log(10100)
          console.log(self.data.couponListStyle1)
          //判断优惠券是否抢光
          for (var index in self.data.couponList) {
           
            //已领取和未领取
            if (couponList[index].recive == true && couponList[index].surplusCount != 0 ){            
              couponList[index].couponResidue = true
            } else {
              couponList[index].couponResidue = false
            }
            //抢光和有剩余
            // if (couponList[index].surplusCount == 0) {
            //   couponList[index].couponResidue = false
            // } else {
            //   couponList[index].couponResidue = true
            // }
            console.log(210)
            console.log(couponList)
            // if(couponList[index].couponId){}

          }
          
          self.setData({
            couponListStyle: couponList
          })
          console.log(self.data.couponListStyle) 
        }
      },
      fail:function(err){

      }
    })
  },
  /**
   *底部弹窗
   */
  showProjectBtn: function() {
    //测试代码
    console.log(241)
    console.log(app.globalData.vipNo)
    if (app.globalData.vipNo == '') { //改完将这里改成==  测试绑定电话页面的
      this.setData({
        showProject: false,
        chargeDetailVisible: true
      })
    } else {
      this.isAlreadyGotCoupons();
      this.setData({  
        chargeDetailVisible: false
      })
    };

    // if (app.globalData.vipNo == '') {
    //   this.setData({
    //     showProject: false,
    //     chargeDetailVisible: true
    //   })
    // } else {
    //   this.setData({
    //     showProject: true,
    //     chargeDetailVisible: false
    //   })
    // };

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
      chargeDetailVisible: true
    })
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
      chargeDetailVisible: false,
      areaList: areaList,
      area: area,
      areaId: areaId,
      areaCode: areaCode,
      jihuo:false
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
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMovecHospital: function() {},

  /**
   * 隐藏模态对话框
   */
  hideProject: function() {
    this.setData({
      showProject: false
    });
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancelProject: function() {
    this.hideProject();
  },
  getAct: function() {
    var self = this;
    // 发起网络请求 获取活动信息
    wx.request({
      url: app.globalData.path + 'rest/RzAct/getAct?actStatus=1',
      method: 'GET',
      data: {},
      success: function(res) {
        var ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        var arr = ['一', '两', '三', '四', '五', '六', '七', '八', '九', '十']
        // 后台正常返回
        if (res.statusCode == 200) {
          console.log("11111111111")
          console.log(res)
          // self.isAlreadyGotCoupons()
          var actList = res.data;
          var actDetail = {};
          for (var i = 0; i < actList.length; i++) {
            if (self.data.actId == actList[i].actId) {
              actDetail = actList[i]
              //活动详情
              self.setData({
                actDetail: actDetail,
                actStatus: true
              })
              // self.setData({
              //   actStatus: true
              // })
            }
          }
          if (self.data.actStatus == true) {
            self.setData({
              actStatus: false
            })
        
            var couponList = self.data.actDetail.couponList
            if (couponList != null && couponList.length != 0) {
              //规则弹窗显示几张优惠券
              for (var i in ar) {
                if (couponList.length == ar[i]) {
                  actDetail.leng = arr[i]
                }
              }
              //规则优惠券名字显示
              if (couponList.length > 1) {
                for (var i = 0; i < couponList.length - 1; i++) {
                  console.log(287)
                  console.log(couponList[i].couponName)

                  couponList[i].couponName = couponList[i].couponName + '，'
                }
                self.setData({
                  couponList: couponList
                })
              } else if (couponList.length == 1) {
                self.setData({
                  couponList: couponList
                })
              }
              // //判断优惠券是否抢光
              // for (var index in couponList) {
              //   //抢光和有剩余
              //   if (couponList[index].surplusCount == 0) {
              //     couponList[index].couponNone=true
              //     couponList[index].couponResidue = false
              //   } else {
              //     couponList[index].couponNone = false
              //     couponList[index].couponResidue = true
              //   }
              // }
              // self.setData({
              //   couponListStyle: couponList
              // })
              self.setData({
                actDetail: actDetail,
                showPage: true
              })
            } else {
              self.setData({
                actDetail: actDetail,
                showPage: true
              })
            }



          } else {
            wx.navigateTo({
              url: '../../pages/couponDisable/couponDisable'
            });
          }
     
          
        } else {
          self.setData({
            showPage: true
          })
          wx.showModal({
            title: "请求超时",
            content: "系统繁忙，请稍后重试！",
            showCancel: false,
            confirmColor: '#fbb059',
          });
        }
      },
      fail: function(err) {
        self.setData({
          showPage: true
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

  // 改变时间戳
  showEvaluateSTime(num) {
    var n = num;
    var date = new Date(n);
    var Y = date.getFullYear() + '年';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';

    return (Y + M + D)
  },
  //领取单张优惠券
  getCoupon(e) {
    var self = this;
    console.log(297)
    console.log(e)

    var vipNo = app.globalData.vipNo;
    var couponId = e.currentTarget.dataset.couponid
    wx.request({
      url: app.globalData.path + 'rest/RzActivity/restSendCoupon',
      method: 'GET',
      data: {
        vipNo: vipNo,
        couponId: couponId
      },
      success: function(res) {
        // 后台正常返回
        if (res.data.status == "right") {
          self.setData({
            showProject: false,
          })
          wx.navigateTo({
            url: "../couponsList/couponsList",
          })

        } else if (res.data.status == "error") {
          wx.showModal({
            title: "领取失败",
            content: res.data.msg,
            showCancel: false,
            confirmColor: '#fbb059',
          });
          self.setData({
            showProject: false,
          })
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
  // 底部buttom领取优惠券
  submitCoupon(e) {
    var self = this;
    var actDetail = self.data.actDetail;
    var couponList = actDetail.couponList;
    var actId = actDetail.actId;
    var vipNo = app.globalData.vipNo;
    var couponId;

    if (couponList.length != 0 && couponList.length == 1) {
      for (var index in couponList) {
        if (couponList[index].surplusCount != 0) {
          couponId = couponList[index].couponId
        } else {
          wx.showModal({
            title: "领取失败",
            content: "优惠券已被抢光！",
            showCancel: false,
            confirmColor: '#fbb059',
          });
          return
        }

      }
      //发起网络请求 获取活动及优惠券信息
      wx.request({
        url: app.globalData.path + 'rest/RzActivity/restSendCoupon',
        method: 'GET',
        data: {
          vipNo: vipNo,
          couponId: couponId
        },
        success: function(res) {
          console.log("多张优惠券")
          console.log(res)
          // 后台正常返回
          if (res.data.status == "right") {
            self.setData({
              showProject: false,
            })
            wx.navigateTo({
              url: "../couponsList/couponsList",
            })

          } else if (res.data.status == "error") {
            self.setData({
              showProject: false,
            })
            wx.showModal({
              title: "领取失败",
              content: res.data.msg,
              showCancel: false,
              confirmColor: '#fbb059',
            });
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
    }
    if (couponList.length != 0 && couponList.length > 1) {

      // 发起网络请求 获取套餐信息
      wx.request({
        url: app.globalData.path + 'rest/RzActivity/sendCouponAct',
        method: 'GET',
        data: {
          vipNo: vipNo,
          actId: actId
        },
        success: function(res) {
          console.log("多张优惠券")
          console.log(res)
          // 后台正常返回
          if (res.data.status == "right") {
            self.setData({
              showProject: false,
            })
            wx.navigateTo({
              url: "../couponsList/couponsList",
            })

          } else if (res.data.status == "error") {
            self.setData({
              showProject: false,
            })
            wx.showModal({
              title: "领取失败",
              content: res.data.msg,
              showCancel: false,
              confirmColor: '#fbb059',
            });
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
    }
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
  /**
   * 第一浮窗的返回数据
   */
  //手机号码
  getPhone(e) {
    console.log(e)
    console.log(e.detail.value.length)
    if (this.data.areaCode == '86') {
      if (e.detail.value.length == 11 && this.testPhoneDalu(e.detail.value)) {
        this.setData({
          phoneNumber: e.detail.value,
          jihuo: true,

        })
      } else {
        this.setData({
          phoneNumber: '',
          jihuo: false,
          yzmCode: '',
          yzmcash: '',
          areadyGetYzm: false, //改动号码时 得到验证码的状态为false
          yzmRight: false //当输完验证码后，改电话电话，验证码符合规格要设为false
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
          phoneNumber: e.detail.value,
          jihuo: true
        })
      } else {
        this.setData({
          phoneNumber: '',
          jihuo: false,
          yzmCode: "",
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
  },

  //点击获取按钮  获取验证码
  obtain(e) {
    var self = this;
    //倒计时
    self.getVerificationCode();
    var phone = self.data.phoneNumber;
    //发起网络请求 用手机号获取验证码
    wx.request({
      url: app.globalData.path + 'rest/xcx/xcxGetPhoneCode?phone=%2B' + self.data.areaCode + phone,
      method: 'GET',
      success: function(res) {
        console.log(196)
        var url1 = app.globalData.path + 'rest/xcx/xcxGetPhoneCode?phone=%2B' + self.data.areaCode + phone
        console.log(url1)
        console.log(phone)
        console.log(res)
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

        } else {
          self.setData({
            popErrorMsg: '请检查电话号对错'
          })
          app.ohShitfadeOut(self);
          return
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

  //获取输入页面上的验证码
  getYanZheng(e) {
    if (e.detail.value.length == 6 && this.data.areadyGetYzm == true) {
      this.setData({
        yzmCode: e.detail.value,
        yzmRight: true
      })
    } else {
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

  //获取个人用户信息
  onGotUserInfo: function(e) {
    console.log("微信啊啊啊啊啊啊啊啊啊啊啊")
    console.log(e)
    var self = this;
    //性别是男的
    if (e.detail.userInfo.gender == 1) {
      var gender = 'GENDER_001'
    } else if (e.detail.userInfo.gender == 2) {
      var gender = 'GENDER_002'
    } else {
      var gender = 'GENDER_003'
    }
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    console.log("个人信息")
    console.log(encryptedData)
    console.log(iv)
    self.setData({
      nickName: e.detail.userInfo.nickName,
      gender: gender,
      encryptedData: encryptedData,
      iv: iv,
      avatarUrl: e.detail.userInfo.avatarUrl
    });
    var yzmRight = self.data.yzmRight
    var jihuo = self.data.jihuo
    console.log(yzmRight && jihuo)
    if (yzmRight && jihuo) {
      self.retrunData();
    }

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
  /*
   *验证码校验
   */
  retrunData: function() {
    console.log(9999)
    var self = this;
    self.showLoading()
    var phoneNum = self.data.phoneNumber;
    var yanzhengma = self.data.yzmCode;
    console.log(829)
    console.log(yanzhengma)
    console.log(self.data.phoneNumber)
    //发起网络请求 用手机号获取验证码
    wx.request({
      url: app.globalData.path + 'rest/xcx/xcxCheckPhoneCode?phone=%2B' + self.data.areaCode + self.data.phoneNumber + '&passWord=' + self.data.yzmCode,
      method: 'get',
      // data: {
      //   phone: phoneNum,
      //   passWord: yanzhengma
      // },
      success: function(res) {
        console.log("retrunData");
        console.log(res);
        // 后台正常返回
        if (res.data.errcode != -10) {
          console.log("进入验证验证码方法 并正确返回")
          self.setData({
            chargeDetailVisible: false,
          })
          self.hideModal();

          //新添加接口，代码修改
          self.getUser();
          // self.goCreateMember();
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.errmsg,
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
    self.hideLoading()
  },

  //为注册获取参数
  getUser() {
    var self = this
    var encryptedData = self.data.encryptedData;
    var iv = self.data.iv;
    var sessionKey = app.globalData.session_key;
    // var code = app.globalData.code;
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
        console.log(res)
        console.log(res.errMsg)
        //  if (res.errMsg == "request:ok"){
        var union_id = res.data.union_id;
        self.setData({
          union_id: union_id,
        });
        self.goCreateMember()
        // }else{
        //   wx.showModal({
        //     title: "请求超时",
        //     content: "系统繁忙，请稍后重试！",
        //     showCancel: false,
        //   });
        // }
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

  //用户注册
  goCreateMember() {
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
    var sysId = '';
    var unionId = self.data.union_id
    //发起网络请求 用手机号获取验证码
    wx.request({
      url: app.globalData.path + 'rest/transmission/createMember',
      method: 'POST',
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
        openId: app.globalData.openid,
        sysId: sysId,
        unionId: unionId
      },
      success: function(res) {
        console.log('注册res')
        console.log(res)
        // 后台正常返回
        if (res.data.errcode == 0) {
          // 后台正常返回
          // self.setData({
          //   popErrorMsg: "注册成功！！"
          // })
          // app.ohShitfadeOut(self);
            // 如果vipNo为空,那么显示注册窗口
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          });
          login.checkInitAgree(self, function() {
            if (app.globalData.vipNo == "" || app.globalData.vipNo == null) {
              self.setData({
                chargeDetailVisible: true
              })
            }else{
              self.setData({
                chargeDetailVisible: false
              })
            }
        
          });
       
        } else {
          wx.showModal({
            title: "操作失败",
            content: res.data.errmsg,
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

  //倒计时
  getVerificationCode() {
    var that = this
    that.getCode();
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

})