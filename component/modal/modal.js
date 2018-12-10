// component/modal/modal.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
 * 弹出框蒙层截断touchmove事件
 */
  preventTouchMove: function () {
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

  /**
   * 显示授权模态窗口
   */
  showAuthModal: function () {
    this.setData({
      showAuthModal: true
    })
  },

  /**
   * 隐藏授权模态窗口
   */
  hideAuthModal: function () {
    this.setData({
      showAuthModal: false
    });
  },
})
