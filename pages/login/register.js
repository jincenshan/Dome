// pages/login/register.js
var Api = require("../../utils/api.js")
var Config = require("../../utils/config.js")
var Md5 = require("../../utils/md5.js")
var Util = require("../../utils/util.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'', //手机号
    validCode:'', //短信验证码
    sendText:'获取验证码', //验证码文字
    sendTime:60, //验证码倒计时
    times:'', //时间事件
  },

  // 手机号输入
  inputShow:function(e){
    if(e.detail.value.length == 11){
      if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(e.detail.value))){
        wx.showToast({
          title: '手机号不正确',
          icon: 'error',
          duration: 1000,
          mask:true
        })
        return
      }
      this.setData({
        username:e.detail.value
      })
    }
  },

  // 验证码填入
  codeShow:function(e){
    this.setData({
      validCode:e.detail.value
    })
  },

  // 获取验证码
  goCode:function(){
    var that = this
    if(that.data.username.length == 11){
      if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(that.data.username))){
        wx.showToast({
          title: '手机号不正确',
          icon: 'error',
          duration: 1000,
          mask:true
        })
        return
      }
    }else{
      wx.showToast({
        title: '手机号不正确',
        icon: 'error',
        duration: 1000,
        mask:true
      })
      return
    }
    if(this.data.sendTime == 60){
    Api.getPhoneCode({mobilePhone:that.data.username},function callback(res){
      if(res.data.code == 1){
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 1000,
          mask:true
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
  }

  if(!that.data.is_code){
    // 60秒后重新获取验证码
    that.data.times = setInterval(function() {
      this.setData({
        is_code:true,
        sendText: this.data.sendTime + 's后重发',
        sendTime: this.data.sendTime - 1
      });
      if (this.data.sendTime < 0) {
        clearInterval(that.data.times)
        this.setData({
          sendText: '获取验证码',
          sendTime: 60,
          is_code: false
        });
      }
    }.bind(this), 1000);
  }
  },

  // 登录提交
  goLogin:function(){
    var that = this
    var params = {
      appId:app.globalData.appid,
      headUrl:app.globalData.userInfo.headUrl,
      invitationCode: "",
      inviter:'',
      name:app.globalData.userInfo.name,
      openid:app.globalData.openid,
      username:that.data.username,
      validCode:that.data.validCode,
    }
    if(that.data.username == ""){
      wx.showToast({
        title: '手机号未填写',
        icon: 'error',
        duration: 1000,
        mask:true
      })
    }
    if(that.data.validCode == ""){
      wx.showToast({
        title: '验证码未填写',
        icon: 'error',
        duration: 1000,
        mask:true
      })
    }
    Api.getPhoneRegister(params,function callback(res){
      if(res.data.code == 1){
        clearInterval(that.data.times)
          app.globalData.userInfo = res.data.data.user
          wx.setStorageSync("userInfo", res.data.data.user)
          wx.setStorageSync('token', res.data.data.token)
          app.globalData.token = res.data.data.token
          Config.token = res.data.data.token
          wx.setStorage({
            key: "phone",
            data: res.data.data.user.username
          })
          wx.navigateTo({
            url: 'code',
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
    var that = this;
    app.globalData.userInfo = wx.getStorageSync('userInfo')
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
    // clearInterval(this.data.times)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.times)
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