// pages/member/friends.js
var Api = require("../../utils/api.js")
let reg = /^(\d{3})\d{4}(\d{4})$/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl:'', //头像
    allCnt:'',//邀请总人数
    unvalidCnt:'',//邀请待生效人数
    validCnt:'',//邀请有效人数
    invalidCnt:'',//邀请失效人数
    tabbar_status:0, //tabid
    pageNo:1,//页码
    pageSize:8,//条数
    is_data:true, //是否有数据
    list_date:[],//数据
  },

  // 切换tabbaar
  tabbarShow:function(e){
    var that = this
    that.setData({
      tabbar_status:parseInt(e.currentTarget.dataset.id),
      pageNo:1,
      is_data:true,
      list_date:[],
    })
    that.listShow()
  },

  listShow:function(){
    var that = this;
    wx.showLoading({
      title:'加载中',                             
      mask:true                                  
    })
    if (that.data.is_data) {
      Api.getFriendsList({
        state:that.data.tabbar_status,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
      }, function callbcak(res) {
        wx.hideLoading()
        if(res.data.code == 1){
        if (res.data.data.list.length < 8 || res.data.data.list == null) {
          that.setData({
            is_data: false
          })
        }
        that.data.list_date = that.data.list_date.concat(res.data.data.list)
        that.setData({
          list_date:that.data.list_date
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      headUrl:wx.getStorageSync('userInfo').headUrl ? wx.getStorageSync('userInfo').headUrl : '../../images/personal-top-photo-nobody.png',
    })
    Api.getFriendsNumber({},function callback(res){
      if(res.data.code == 1){
        that.setData({
          allCnt:res.data.data.allCnt,
          unvalidCnt:res.data.data.unvalidCnt,
          validCnt:res.data.data.validCnt,
          invalidCnt:res.data.data.invalidCnt,
        })
      }else{
        wx.showToast({
          title: res.data.info,
          mask:true
        })
      }
    })
    that.listShow()
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
    var that = this
    that.data.pageNo = that.data.pageNo + 1
    if(that.data.is_data){
      that.setData({
        pageNo:that.data.pageNo
      })
      that.listShow()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})