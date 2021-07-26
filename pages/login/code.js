// pages/login/code.js
var Api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '' //邀请码
  },

  // 输入code
  inputCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  // 确定
  goSubmit: function () {
    var that = this
    if (that.data.code == "" || that.data.code.length == 0) {
      wx.showToast({
        title: '请输入邀请码',
        mask: true
      })
      return
    }
    Api.getUserCode({
      invitationCode: that.data.code
    }, function callback(res) {
      if(res.data.code == 1){
        if (wx.getStorageSync('path')) {
          var params = wx.getStorageSync('path')
          wx.removeStorageSync('path')
          wx.redirectTo({
            url: '../purchase/index?scanType=' + params.scanType + '&sn=' + params.sn + '&orderNo=' + params.orderNo + '&goodsId=' + params.goodsId + '&bagSn=' + params.bagSn,
          })
        } else {
          wx.reLaunch({
            url: '../index/index',
          })
        }
      // if(res.data.code == 1){
      //   wx.reLaunch({
      //     url: '../index/index',
      //   })
      }else{
        wx.showToast({
          title: res.data.info,
          mask:true
        })
      }
    })
  },

  // 返回首页
  goHome: function () {
    if (wx.getStorageSync('path')) {
        var params = wx.getStorageSync('path')
        wx.removeStorageSync('path')
        wx.redirectTo({
          url: '../purchase/index?scanType=' + params.scanType + '&sn=' + params.sn + '&orderNo=' + params.orderNo + '&goodsId=' + params.goodsId + '&bagSn=' + params.bagSn,
        })
      } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var code = wx.getStorageSync('invitationCode')
    this.setData({
      code: code
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

  }
})