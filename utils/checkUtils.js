// 验证手机号码
function isPhoneNo(phone) {
  var pattern = /^1[34578]\d{9}$/;
  return pattern.test(phone);
};
//验证日期
function isData(Data) {
  var pattern = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  return pattern.test(Data);
}
// 不为空check
function isRequired(item) {

  if (item && item != "undefined" && item != "" && item != null ) {
    return true;
  }

  return false;
}
/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

//数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 去空格
function trimSpace(_str) {
  var rsStr = _str;

  if(_str) {
    rsStr = rsStr.replace(/\s+/g, '');
  }

  return rsStr; 
}

module.exports = {
  isPhoneNo: isPhoneNo,
  isData: isData,
  isRequired: isRequired,
  formatTime: formatTime,
  formatNumber: formatNumber,
  trimSpace: trimSpace
} 
