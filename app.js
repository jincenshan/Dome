//app.js
var Api = require("utils/api.js")
var Config = require("utils/config.js")
// const http = 'http://192.168.2.22:9088' // 测试服 
const http = 'https://oxy.api.ncmed.cn' //正式服
// const http = 'https://oxy.api.test.ncmed.cn' //测试正式服

const appid = 'wxd6f9ec3cd569862c'
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 清除长期缓存
    let expirationTime = wx.getStorageSync('expirationTime');
    if(expirationTime) {
      // 如果缓存时间大于等于29天则清空缓存，让用户重新登录
      let now = new Date();
      if(now.getTime() - expirationTime.getTime() >= 2505600000) {
        wx.clearStorageSync()
      }
    } else{
      wx.clearStorageSync()
    }
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: http + '/eos-wechat/wx/user/' + appid + '/code2Session?code=' + res.code,
          success: res => {
            wx.setStorageSync('openid', res.data.data.openid)
            this.globalData.openid = res.data.data.openid
            this.globalData.sessionKey = res.data.data.sessionKey
            // // 获取用户信息
            // wx.getSetting({
            //   success: res => {
            //     if (res.authSetting['scope.userInfo']) {
            //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            //         if(wx.getStorageSync('userData')){
            //           let res = wx.getStorageSync('userData')
            //           // 登陆userData有问题，签名不改
            //           // 可以将 res 发送给后台解码出 unionId
            //           this.globalData.userInfo = res.userInfo
            //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            //           // 所以此处加入 callback 以防止这种情况
            //           if (this.userInfoReadyCallback) {
            //             this.userInfoReadyCallback(res)
            //           }
            //           let that = this
            //           let params = {
            //             appid: appid,
            //             sessionKey: this.globalData.sessionKey,
            //             signature: res.signature,
            //             rawData: res.rawData,
            //             encryptedData: res.encryptedData,
            //             iv: res.iv,
            //             openid:wx.getStorageSync('openid')
            //           }
            //           Api.getWxOpenId(params, function callback(res) {
            //             if (res.data.code == '40001' || res.data.code == '40002' || res.data.code == '40003') {
            //               wx.removeStorageSync('userInfo')
            //               wx.removeStorageSync('token')
            //               wx.showToast({
            //                 title: '请重新登录',
            //               })
            //               wx.navigateTo({
            //                 url: '/pages/login/index',
            //               })
            //             } else {
            //               if (res.data.code == 1) {
            //                 wx.setStorageSync("userInfo", res.data.data.user)
            //                 wx.setStorageSync('token', res.data.data.token)
            //                 that.globalData.userInfo = res.data.data.user
            //                 that.globalData.token = res.data.data.token
            //                 Config.token = res.data.data.token
            //               }
            //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            //               // 所以此处加入 callback 以防止这种情况
            //               if (that.loginReadyCallback) {
            //                 console.log('loginReadyCallback')
            //                 that.loginReadyCallback(res)
            //               }
            //             }
            //           })
            //         }
            //     }else{
            //       if (this.loginReadyCallback) {
            //         console.log('loginReadyCallback','anon')
            //         this.loginReadyCallback(res)
            //       }
            //     }
            //   }
            // })
          }
        })
      }
    })
  },

  globalData: {
    http: http,
    appid: appid,
    userInfo: null,
    token: null,
    sessionKey: null,
    openid: null,
  }
})