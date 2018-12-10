//检查网络状态
function checkNetWorkStatus(callback) {
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型2g，3g，4g，wifi, none, unknown
      var networkType = res.networkType
      // 没有网络连接
      if (networkType == "none") {
        var result = {
          "code": 1,
          "title": "没有网络连接",
          "message": "请检查您的网络设置",
        };
        callback(result);
      }
      // 未知的网络类型
      else if (networkType == "unknown") {

        var result = {
          "code": 1,
          "title": "未知的网络类型",
          "message": "请检查您的网络设置",
        };
        callback(result);
      }
      else {
        var result = {
          "code": 0,
        };
        callback(result);
      }
    }
  });
}

module.exports = {
  checkNetWorkStatus: checkNetWorkStatus
}