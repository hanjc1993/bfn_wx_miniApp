// pages/moreStoreImgs/moreStoreImgs.js
let app = getApp();

Page({
  data: {
    imagesList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.showLoading();
    // 发起网络请求 获取活动信息
    wx.request({
      url: app.globalData.path + 'rest/RzSubsequentDemand/getStoreImgUrls',
      method: 'GET',
      data: {storeCode: app.globalData.storeCode},
      success: function (res) {
        self.setData({imagesList: res.data})
        self.hideLoading();
      },
      fail: function (err) {
        self.hideLoading();
        wx.showModal({
          title: "请求超时",
          content: "系统繁忙，请稍后重试！",
          showCancel: false,
          confirmColor: '#fbb059',
        });
      }
    });
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
  //点击查看大图
  previewImage (e) {
    let urls = []
    this.data.imagesList.map(item => {
      urls.push(item.imgAbs)
    })
    let current = e.currentTarget.dataset.idx
    wx.previewImage({current, /*当前显示图片的http链接*/ urls /*需要预览的图片http链接列表*/})
  }
})