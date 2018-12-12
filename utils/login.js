var app = getApp();
var checkNetWork = require("../utils/checknetwork.js");

function userlogin(_self, callback) {
  // 用户登录
  wx.login({
    success: res => {
      if (app.globalData.openid == '' || app.globalData.openid == null) {
        if (res.code) {
          wx.request({
            // url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.AppID +
            //   '&secret=' + app.globalData.AppSecret + '&js_code=' + res.code + '&grant_type=authorization_code',
            url: app.globalData.path + 'rest/xcx/xcxGetOpenid',
            method: 'GET',
            data: {
              code: res.code,
            },
            success: function (res) {
              console.log(res);
              app.globalData.openid = res.data.openID;
              app.globalData.session_key = res.data.sessionKey;
              if (app.globalData.vipNo == '' || app.globalData.vipNo == null) {
                wx.request({
                  url: app.globalData.path + 'rest/user/info/getVipNo',
                  method: 'GET',
                  data: {
                    openid: app.globalData.openid,
                  },
                  success: function (res) {
                    var result = {
                      "code": 0,
                    };
                    if (res.data.vipNo != undefined) {
                      app.globalData.vipNo = res.data.vipNo;
                    }
                    callback(result);
                  },
                  fail: function (err) {
                    var result = {
                      "code": 2,
                      "title": "无法响应请求",
                      "message": err.errMsg,
                    };
                    callback(result);
                  }
                });
              } else {
                var result = {
                  "code": 0,
                };
                callback(result);
              }
            }
          });
        } else {
          var result = {
            "code": 0,
          };
          callback(result);
        }
      } else {
        if (app.globalData.vipNo == '' || app.globalData.vipNo == null) {
          wx.request({
            url: app.globalData.path + 'rest/user/info/getVipNo',
            method: 'GET',
            data: {
              openid: app.globalData.openid,
            },
            success: function (res) {
              var result = {
                "code": 0,
              };
              if (res.data.vipNo != undefined) {
                app.globalData.vipNo = res.data.vipNo;
              }
              callback(result);
            },
            fail: function (err) {
              var result = {
                "code": 2,
                "title": "无法响应请求",
                "message": err.errMsg,
              };
              callback(result);
            }
          });
        } else {
          var result = {
            "code": 0,
          };
          callback(result);
        }
      }
    },
    fail: function (err) {
      var result = {
        "code": 5,
        "title": "无法响应登录请求",
        "message": "无法响应登录请求，请重新登录！",
      };
      callback(result);
    }
  });
}

/**
 * 页面初始化，对网络状态以及登录状态的check
 */
function checkInitAgree(_self, callback) {
  // 判断网络状态
  checkAgree(_self, function () {
    // 判断用户权限
    if (app.globalData.vipNo != '' && app.globalData.vipNo != null) {
      // 业务处理
      callback();
    } else {
      userlogin(_self, function (result) {
        if (result.code == 0) {
          // 业务处理
          callback();
        }
      });
    }
  });
}

/**
 * 调用接口前，对网络状态以及登录状态的check
 */
function checkAgree(_self, callback) {

  // 判断网络状态
  checkNetWork.checkNetWorkStatus(function (result) {
    if (result.code == 0) {
      // 业务处理
      callback();
    } else {
      _self.hideLoading();
      wx.showModal({
        title: result.title,
        content: result.message,
        showCancel: false,
      });
    }
  })
}

module.exports = {
  userlogin: userlogin, // 用户login
  checkInitAgree: checkInitAgree, // 初始化，保证用户login成功
  checkAgree: checkAgree, // 检查网络状态
}