// pages/index/equipment.js
//获取应用实例
var Api = require("../../utils/api.js")
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const chooseLocation = requirePlugin('chooseLocation');
var qqmapsdk
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: 'CU3BZ-IYNLS-RLNOM-6SL2K-TNK6F-KMFIQ', //地图key
    markers: [], //标点
    latitude: '', //经度
    longitude: '', //纬度
  },

   // 地图数据
   map_markerShow:function(){
    var that = this
     // 搜索周边抱抱氧机器
     var params = {
      location: that.data.latitude + ',' + that.data.longitude,
      radius: 5000,
      spatialRel: 0,
      autoExtend: 1,
      keyword: 'BBY',
      tableId: '60c02ae831259d2d7e584cc8',
      orderby: 'distance(' + that.data.latitude + ',' + that.data.longitude + ')',
      key: that.data.key
     }
     Api.getMapList(params,function callback(res){
      if(res.data.code == 1){
        // const result = [{
        //   width: 100,
        //   height: 70,
        //   iconPath: "/images/fjsb.png",
        //   id: 0,
        //   latitude: that.data.latitudeOne,
        //   longitude: that.data.longitudeOne,
        // },{
        //   width: 100,
        //   height: 50,
        //   iconPath: "/images/dqwz.png",
        //   id: 1,
        //   latitude: that.data.latitude,
        //   longitude: that.data.longitude,
        // }]
        // res.data.data.map(function (item,index){
        //   item.iconPath = (item.status == "NORMAL"?"/images/home-map-o2.png":"/images/home-map-o2-abnormal.png")
        //   item.width = 60
        //   item.height = 60
        //   item.latitude = item.lat
        //   item.longitude = item.lng
        //   item.briefAddr = item.address
        //   if(index == 0){
        //     item.callout = {
        //             content: "附近氧疗机"+parseInt(item.distance)+"m",
        //             color: "#FFFFFF",
        //             fontSize: 12,
        //             borderRadius: 12,
        //             bgColor: "#57595c",
        //             padding: 8,
        //             display: 'ALWAYS',
        //           }
        //   }
        // })
        that.data.markers = that.data.markers.concat(res.data.data)
          that.setData({
            markers: that.data.markers
          })
      }else{
        wx.showToast({
          title: '服务端报错',
          mask:true
        })
      }
     })
  },

    // 去高德地图
    go_gaode: function (e) {
      var that = this;
      var markers = that.data.markers
      var markerId = e.currentTarget.dataset.id
      for (let item of markers) {
        if (item.id == markerId) {
          var latitude = item.lat
          var longitude = item.lng
          var name = item.address;
          wx.openLocation({ //微信方法
            latitude: parseFloat(latitude), //经纬度
            longitude: parseFloat(longitude),
            name: name,
            success: function (res) {
            },
            fail:function(res){
              
            },
          })
        }
      }
    },

    // 打电话
    go_phone:function(e){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel,
      })
    },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      longitude:options.longitude,
      latitude:options.latitude
    })
    this.map_markerShow()
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