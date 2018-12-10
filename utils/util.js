
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取MM.DD日期
function getDateStrMMdd (AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1);
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
  return m + "." + d;
}

// 获取MM.DD日期
function getDateStryyyyMMdd(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
  // 年
  var y = dd.getFullYear();
  // 月
  var m = (dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1);
  // 日
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
  // // 时
  // var h = dd.getHours();
  // // 分
  // var m = dd.getMinutes();
  // // 秒
  // var s = dd.getSeconds();

  return y + "-" + m + "-" + d;
}


module.exports = {
  formatTime: formatTime,
  getDateStrMMdd: getDateStrMMdd,
  getDateStryyyyMMdd: getDateStryyyyMMdd,
}
