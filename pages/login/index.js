// pages/login/index.js
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
    hasPhone: false, //是否授权手机号
    hasUserInfo: false, //是否授权用户信息
    is_title: true, //是否同意服务协议
    ishasPhone: false, //拒绝再授权登陆
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.globalData.userInfo = wx.getStorageSync('userInfo')
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        hasPhone: wx.getStorageSync('phone') ? true : false
      })
    } else {
      that.setData({
        hasUserInfo: false,
        userInfo: '',
        hasPhone: wx.getStorageSync('phone') ? true : false
      })
    }
  },

  // 微信用户信息获取
  getUserProfile: function (e) {
    var that = this
    if (!that.data.is_title) {
      wx.showToast({
        title: '未勾选服务协议',
        icon: 'error',
        duration: 1000,
        mask: true
      })
      return
    }
    wx.getUserProfile({
      desc: '用于完善会员个人资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (e) => {
        wx.setStorageSync('userData', e)
        wx.setStorageSync('expirationTime', new Date())
        if (e.errMsg == "getUserProfile:ok") {
          let openid = wx.getStorageSync('openid')
          let params = {
            appid: app.globalData.appid,
            sessionKey: app.globalData.sessionKey,
            signature: e.signature,
            rawData: e.rawData,
            encryptedData: e.encryptedData,
            iv: e.iv,
            openid:openid
          }
          Api.getWxOpenId(params, function callback(res) {
            if (res.data.code == 1) {
              app.globalData.userInfo = res.data.data.user
              wx.setStorageSync("userInfo", res.data.data.user)
              wx.setStorageSync('token', res.data.data.token)
              app.globalData.token = res.data.data.token
              Config.token = res.data.data.token
              wx.setStorage({
                key: "phone",
                data: res.data.data.user.username
              })
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
            } else if (res.data.code == 0) {
              if (wx.getStorageSync('phone')) {
                wx.navigateBack({
                  delta: 1,
                })
              } else {
                wx.showToast({
                  title: '请再授权手机号',
                })
                that.setData({
                  userInfo: app.globalData.userInfo,
                  hasUserInfo: true,
                  hasPhone: false,
                })
              }
            } else {
              wx.showToast({
                title: res.data.info,
              })
            }
          })
        }
      },
      fail() {
        console.log("用户拒绝授权")
      }
    })
  },

  // 手机号注册拉取用户信息
  onPhoneUserInfo: function (e) {
    var that = this
    wx.navigateTo({
      url: 'register',
    })
  },
  // 用户协议
  go_agreement: function () {
    wx.navigateTo({
      url: 'agreement',
    })
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    var that = this;
    if (!that.data.is_title) {
      wx.showToast({
        title: '未勾选服务协议',
        icon: 'error',
        duration: 1000,
        mask: true
      })
      return
    }
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      let authUrl = app.globalData.http + '/eos-auth/jwt/bbyAuthorizationRegister/' + app.globalData.openid
      // console.log('invitationCode', wx.getStorageSync('invitationCode'))
      // if(wx.getStorageSync('invitationCode')) {
      //   authUrl += '/' + wx.getStorageSync('invitationCode')
      // }
      //用户信息
      wx.request({
        url: authUrl,
        data: {
          appid: app.globalData.appid,
          sessionKey: app.globalData.sessionKey,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        method: 'POST',
        success: res => {
          if (res.data.code == 1) {
            app.globalData.userInfo = res.data.data.user
            wx.setStorageSync("userInfo", res.data.data.user)
            wx.setStorageSync('token', res.data.data.token)
            app.globalData.token = res.data.data.token
            Config.token = res.data.data.token
            wx.setStorage({
              key: "phone",
              data: res.data.data.user.username
            })
            // if (!wx.getStorageSync('invitationCode')) {
            wx.navigateTo({
              url: 'code',
            })
            // } else {
            // if (wx.getStorageSync('path')) {
            //   var params = wx.getStorageSync('path')
            //   wx.removeStorageSync('path')
            //   wx.redirectTo({
            //     url: '../purchase/index?scanType=' + params.scanType + '&sn=' + params.sn + '&orderNo=' + params.orderNo + '&goodsId=' + params.goodsId + '&bagSn=' + params.bagSn,
            //   })
            // } else {
            //   wx.reLaunch({
            //     url: '../index/index',
            //   })
            // }
            // }
          } else {
            wx.showToast({
              title: '授权注册失败',
              icon: 'error',
              duration: 1000,
              mask: true
            })
          }
        }
      })
    } else {
      that.setData({
        ishasPhone: true
      })
    }
  },

  // 服务协议
  checkboxShow: function () {
    var that = this
    that.setData({
      is_title: !that.data.is_title
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