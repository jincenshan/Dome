// pages/binding/index.js
var Api = require("../../utils/api.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:'', //订单编号
    bagSn:'', //氧疗袋Sn
    list_date:'', //数据
  },

  // 确定绑定
  go_buy:function(){
    var that = this
    Api.getOxyBagN({orderNo:that.data.orderNo,bagSn:that.data.bagSn},function callbcak(res){
      if(res.data.code == 1){
        wx.navigateTo({
          url: 'get_bag?giveCnt'+res.data.giveCnt+'&expiryDate='+res.data.expiryDate+'&orderNo='+that.data.orderNo,
        })
      }else{
        wx.showToast({
          title: res.data.info,
          icon: 'error',
          duration: 1000,
          mask:true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      orderNo:options.orderNo,
      bagSn:options.sn
    })
    var params = {
      orderNo:options.orderNo,
      bagSn:options.sn
    }
    Api.getOxyBag(params,function callbcak(res){
      if(res.data.code == 1){
        that.setData({
          list_date:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.info,
          icon: 'error',
          duration: 1000,
          mask:true
        })
      }
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