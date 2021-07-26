// pages/member/service.js
var Api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar_id:1, //tabbarid
    validCnt:'',//有效次数
    usedCnt:'',//已使用次数
    invalidCnt:'',//失效次数
    list_date:[], //数据
    pageNo:1, //页码
    pageSize:8, //数量
    is_data:true, //是否还有数据
  },

  // 切换
  tabbarShow:function(e){ 
    var that = this
    that.setData({
      tabbar_id:e.currentTarget.dataset.id,
      pageNo:1,
      is_data:true,
      list_date:[],
    })
    that.list_show()
  },
  //列表数据 
  list_show: function () {
    var that = this;
    wx.showLoading({
      title:'加载中',                             
      mask:true                                  
    })
    if (that.data.is_data) {
      Api.getOxygenList({
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
        state:that.data.tabbar_id,
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
        }else if(res.data.code == 0){
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
    var that = this
    Api.getOxygenNumber({},function callback(res){
      if(res.data.code == 1){
        that.setData({
          validCnt:res.data.data.validCnt,
          usedCnt:res.data.data.usedCnt,
          invalidCnt:res.data.data.invalidCnt,
        })
      }else{
        wx.showToast({
          title: res.data.info,
          mask:true
        })
      }
    })
    that.list_show()
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
      that.list_show()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})