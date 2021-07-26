// pages/purchase/success.js
var Api = require("../../utils/api.js")
const app = getApp()
let reg = /^(\d{3})\d{4}(\d{4})$/
function urlToObj(str){
  　　var obj = "";
  　　var arr1 = str.split("?");
  　　var arr2 = arr1[1].split("&");
      obj = arr2.toString()
      obj = obj.replace(/,/g,'&')
  　return obj;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'', //金额
    orderId:'', //订单id
    is_bag:false, //氧疗袋弹窗
    is_net:false, //网点弹窗
    scanType:'', // 扫码购买途径
    phone:'',//手机号
    giveCnt:'',//次数
    expiryDate:'',//截止时间
    goodsName:'',//氧疗机名称
    channel:'',//支付类型
    validGiveCnt:'',//有效次数
    orderType:'',//订单类型
  },

  //去绑定氧疗袋
  goBag:function(){
    var that = this
    wx.scanCode({
      success(res) {
        if(res.result !=""){
          var path = urlToObj(res.result)
          wx.navigateTo({
            url: '../binding/index?'+path+that.data.orderId,
          })
        }else{
          wx.showToast({
            title: '传参有误',
            mask:true
          })
        }
      },
      fail(res){
        wx.showToast({
          title: '扫描失败',
          mask:true
        })
      }
    })
  },

  // 关闭弹窗
  goBagColse:function(){
    var that = this
    that.setData({
      is_bag:false,
      is_net:false,
    })
  },

  // 查看订单
  goList:function(){
    var that = this
    wx.reLaunch({
      url: '../purchase/list?orderType='+(that.data.scanType == "equip"?2:1),
    })
  },

  // 返回首页
  goHome:function(){
    var that = this
    wx.reLaunch({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      orderId:options.orderId,
      money:options.money,
      scanType:options.scanType,
      goodsName:options.goodsName,
      // is_bag:options.scanType == "equip"?true:false,
      // is_net:options.scanType == "bag"?true:false,
    })
    wx.getStorage({
      key: 'phone',
      success (res) {
        that.setData({
          phone:res.data.replace(reg, '$1****$2'),
        })
      }
    })
    Api.getOxygenNumbers({orderId:options.orderId},function callback(res){
      if(res.data.code == 1){
        that.setData({
          giveCnt:res.data.data.giveCnt,
          // expiryDate:res.data.data.expiryDate,
          channel:res.data.data.channel,
          validGiveCnt:res.data.data.validGiveCnt,
          orderType:res.data.data.orderType
        })
      }else{
        wx.showToast({
          title: res.data.info,
          mask:true
        })
      }
    })
    if(options.scanType == "equip"){
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/index/index',
        })
      },4000)
    }
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