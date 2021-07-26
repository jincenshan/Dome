// pages/member/index.js
var Api = require("../../utils/api.js")
// var map = require('../../lib/map/qqmap-wx-jssdk.js')

//获取应用实例
const app = getApp()
let reg = /^(\d{3})\d{4}(\d{4})$/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_date: [], //列表
    userInfo:'', //用户信息
    phone:"", // 手机号
    headUrl:'', //头像
    bonus:'',//奖励金
    freeOxygen:'',//免费吸氧次数
    invitationNumber:'',//邀请人数
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
      headUrl:wx.getStorageSync('userInfo').headUrl ? wx.getStorageSync('userInfo').headUrl : '../../images/personal-top-photo-nobody.png',
    })
    wx.getStorage({
      key: 'phone',
      success (res) {
        that.setData({
          phone:res.data.replace(reg, '$1****$2'),
        })
      }
    })
  },

  // 关于我们
  go_agreement:function(){
    wx.navigateTo({
      url: '../login/agreement',
    })
  },

  // 登录
  goLogin: function(){
    if(!this.data.userInfo){
      wx.navigateTo({
        url: '../login/index',
      })
    }
  },
  // 返回首页
  go_black: function () {
   wx.reLaunch({
     url: '../index/index',
   })
  },

  // 会员等级
  goGrade:function(){
    if(this.data.userInfo){
      wx.navigateTo({
        url: 'grade?invitationNumberNeed='+this.data.invitationNumberNeed+'&invitationNumberSuccess='+this.data.invitationNumberSuccess+'&nextLevel='+this.data.nextLevel,
      })
    }
  },
  // 订单列表
  go_purchase: function (e) {
    var that = this;
    if(this.data.userInfo){
      wx.navigateTo({
        url: '../purchase/list',
      })
    }else{
      wx.navigateTo({
        url: '../login/index',
      })
    }
  },

  // 邀请有礼
  goInvitation:function(){
    if(this.data.userInfo){
      wx.navigateTo({
        url: 'invitation',
      })
    }else{
      wx.navigateTo({
        url: '../login/index',
      })
    }
  },

  // 氧疗服务
  goService:function(){
    if(this.data.userInfo){
      wx.navigateTo({
        url: '../member/service',
      })
    }else{
      wx.navigateTo({
        url: '../login/index',
      })
    }
  },

  // 邀请好友
  goFriends:function(){
    if(this.data.userInfo){
      wx.navigateTo({
        url: 'friends',
      })
    }else{
      wx.navigateTo({
        url: '../login/index',
      })
    }
  },

  // 拨打电话
  goPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '15343309234',
    })
  },

  list_show: function () {
    var that = this;
    wx.showLoading({
      title:'加载中',                             
      mask:true                                  
    })
    if (that.data.is_data) {
      Api.getMemberList({
        consumerId: that.data.userInfo.id,
        currentPage: that.data.page,
        pageSize: 10,
      }, function callbcak(res) {
        wx.hideLoading()
        if (res.data.data.list.length < 10 || res.data.data.list == null) {
          that.setData({
            is_data: false
          })
        }
        that.data.list_date = that.data.list_date.concat(res.data.data.list)
        that.setData({
          list_date:that.data.list_date
        })
      })
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
    var that = this
    if(that.data.userInfo){
      Api.getUserNumber({}, function callbcak(res){
        if(res.data.code == 1){
          that.setData({
            bonus:res.data.data.bonus,
            freeOxygen:res.data.data.freeOxygen,
            invitationNumber:res.data.data.invitationNumber,
            invitationNumberSuccess:res.data.data.invitationNumberSuccess,
            invitationNumberNeed:res.data.data.invitationNumberNeed,
            nextLevel:res.data.data.nextLevel
          })
        }else{
          wx.showToast({
            title: res.data.info,
            mask:true
          })
        }
      })
    }
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