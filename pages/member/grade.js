// pages/member/grade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',//用户信息
    invitationNumberNeed:'',//还需邀请人数
    invitationNumberSuccess:'',//成功邀请人数
    nextLevel:'',//文字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo:wx.getStorageSync('userInfo'),
      invitationNumberNeed:options.invitationNumberNeed,
      invitationNumberSuccess:options.invitationNumberSuccess,
      nextLevel:options.nextLevel
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