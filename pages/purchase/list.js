// pages/purchase/list.js
//获取应用实例
var Api = require("../../utils/api.js")
var Config = require("../../utils/config.js")
var Md5 = require("../../utils/md5.js")
var Util = require("../../utils/util.js")
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
    orderType:2, //tabbar 选择
    list_date:[], //数据
    pageNo:1, //页码
    pageSize:5, //数量
    is_data:true, //是否还有数据
  },

  // tabbar 选项
  hreadShow:function(e){
    var that = this
    that.setData({
      orderType:parseInt(e.currentTarget.dataset.id),
      pageNo:1,
      is_data:true,
      list_date:[],
    })
    that.list_show()
  },

  // 跳转详情页
  buyShow:function(e){
    var that = this
    wx.navigateTo({
      url: 'details?id='+e.currentTarget.dataset.id,
    })
  },

  //去绑定氧疗袋
  goBag:function(e){
    var that = this
    wx.showModal({
      title:'提示',
      content:'请在抱抱氧氧疗机设备感应识别绑定氧疗袋',
      showCancel:false,
      success (res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      }
    })
    // wx.scanCode({
    //   success(res) {
    //     if(res.result !=""){
    //       var path = urlToObj(res.result)
    //       wx.navigateTo({
    //         url: '../binding/index?'+path+e.currentTarget.dataset.id,
    //       })
    //     }else{
    //       wx.showToast({
    //         title: '传参有误',
    //         mask:true
    //       })
    //     }
    //   },
    //   fail(res){
    //     wx.showToast({
    //       title: '扫描失败',
    //       mask:true
    //     })
    //   }
    // })
  },

  list_show: function () {
    var that = this;
    wx.showLoading({
      title:'加载中',                             
      mask:true                                  
    })
    if (that.data.is_data) {
      Api.getBagList({
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
        orderType:that.data.orderType,
      }, function callbcak(res) {
        wx.hideLoading()
        if(res.data.code == 1){
          if (res.data.data.list.length < 5 || res.data.data.list == null) {
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
    this.setData({
      orderType:options.orderType?options.orderType:2,
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
    var that = this
    that.setData({
      pageNo:1,
      is_data:true,
      list_date:[],
    })
    that.list_show()
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