// pages/binding/get_bag.js
var Api = require("../../utils/api.js")
let reg = /^(\d{3})\d{4}(\d{4})$/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',//手机号
    giveCnt:'', //次数
    expiryDate:'', //截止日期
  },

   // 返回首页
   go_home:function(){
    var that = this
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 查看订单
  goList:function(){
    var that = this
    wx.reLaunch({
      url: '../member/service',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this
    that.setData({
      expiryDate:options.expiryDate,
      giveCnt:options.giveCnt,
      orderNo:options.orderNo
    })
    wx.getStorage({
      key: 'phone',
      success (res) {
        that.setData({
          phone:res.data.replace(reg, '$1****$2'),
        })
      }
    })
    Api.getNetNumber({id:that.data.orderNo},function callback(res){
      that.setData({
        expiryDate:res.data.data.expiryDate,
        giveCnt:res.data.data.giveCnt
      })
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