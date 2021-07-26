// pages/member/invitation_one.js
var Api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl:'',//头像
    qrcode:'',
    user:'',
  },

  // 复制文字
  goCopy: function() {
    var that = this
    wx.setClipboardData({
      data: that.data.user.invitationCode,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              mask:true
            })
          }
        })
      }
    })
  },

  // 邀请
  goShow:function(){
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success:(res) =>{
        console.log(res)
        wx.showToast({
          title:"成功"
        })
      },
      complete: (res) => {
        wx.showToast({
          title:res
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let invitationCode = options.invitationCode?options.invitationCode:decodeURIComponent(options.scene)
    wx.setStorageSync('invitationCode', invitationCode)
    Api.getInvitationCode({invitationCode:invitationCode},function callback(res) {
      that.setData({
        user:res.data.data
      })
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 立即邀请
  goShow:function(){
    wx.showShareImageMenu({
      path:this.data.qrcode+'?invitationCode='+wx.getStorageSync('userInfo').invitationCode,
    })
  },

  // 进入首页
  go_home:function(){
    wx.reLaunch({
      url: '../index/index',
    })
  },

  // 现在去注册
  go_login:function(){
    var user = wx.getStorageSync('userInfo')
    if(!user){
      wx.reLaunch({
        url: '../login/index',
      })
    }else{
      wx.showToast({
        title: '已注册登录',
      })
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },
   /**
   * saveImg:点击按钮保存图片到本地
   */
  saveImg: function() {
    var imgSrc = this.data.qrcode
    wx.downloadFile({
      url: imgSrc,
      success: function(res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,//图片文件路径
          success(res){
            //接口调用成功
            wx.showToast({
              title: '保存成功',
              duration:1000,//提示延迟时间
              mask:true
            })
          },
          fail(err){
            //需要用户授权设置
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny"){
                // 用户授权设置
                wx.openSetting({
                  success(settingdata){
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    } else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
 
            }
          }
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
    return {
      title: wx.getStorageSync('userInfo').nick+'邀请您体验共享氧疗服务抱抱氧',
      path: '/pages/index/index?invitationCode='+wx.getStorageSync('userInfo').invitationCode,    //分享的页面所需要的id
      imageUrl: this.data.qrcode   //分享界面的图片
    }
  }
})