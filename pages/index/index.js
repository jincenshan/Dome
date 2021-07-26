//index.js
//获取应用实例
var Api = require("../../utils/api.js")
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const chooseLocation = requirePlugin('chooseLocation');
var qqmapsdk
const app = getApp()
let markerIndex = 0
let markerMap = []

function urlToObj(str) {
  var obj = "";
  var arr1 = str.split("?");
  var arr2 = arr1[1].split("&");
  obj = arr2.toString()
  obj = obj.replace(/,/g, '&')
  return obj;
}

Page({
  data: {
    key: 'CU3BZ-IYNLS-RLNOM-6SL2K-TNK6F-KMFIQ', //地图key
    userInfo: {}, //用户信息
    hasUserInfo: false, //是否授权
    latitude: '', //经度
    longitude: '', //纬度
    latitudeOne: '', //中心经度或者第一次初始
    longitudeOne: '', //中心纬度或者第一次初始
    markers: '', //标点
    bbyName: '', //名称
    briefAddr: '', //地址
    polyline: [], //路线
    map_view: false, //地图弹框
    hasPhone: false, //是否授权手机
    scale_number: 14, //地图尺寸
    markerId: '', //标点id
    markers_position: '', //标点位置
    markers_name: '', //标点名称
    is_title: false, //弹框
    markers_phone: '', //标点手机号
    markers_distance: '', //标点距离
    markers_status: '', //标点状态
    is_call: false, //搜索弹窗
    orderId: '', //订单id
  },

  onLoad: function (options) {
    var that = this;
    wx.setStorageSync('invitationCode', options.invitationCode)
    wx.getStorage({
      key: 'phone',
      success(res) {
        that.setData({
          hasPhone: res.data ? true : false,
        })
      }
    })
    wx.onCopyUrl(() => {
      return { query: 'a=1&b=2' }
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    app.globalData.userInfo = wx.getStorageSync('userInfo')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      this.setData({
        hasUserInfo: false,
        userInfo: '',
      })
    }
    // 拉起地图授权
    that.map_show();
  },
  onShow: function () {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (location != null) {
      this.setData({
        latitudeOne: location.latitude,
        longitudeOne: location.longitude,
      })
      this.map_markerShow()
    }
    // app.js异步请求，父子集
    let token = wx.getStorageSync('token')
    if (token) {
      this.getOrder()
    } 
    // else {
    //   app.loginReadyCallback = res => {
    //     if (res != '' && app.globalData.userInfo && app.globalData.token) {
    //       this.getOrder()
    //     }
    //   }
    // }
  },

  // 未支付订单
  getOrder: function () {
    var that = this
    Api.getUserOrder({}, function callback(res) {
      if (res.data.code == 1) {
        that.setData({
          orderId: res.data.data == "0" ? "" : res.data.data,
        })
      } else {
        wx.showToast({
          title: res.data.info,
          mask: true
        })
      }
    })
  },

  // 去详情页面
  go_detail: function () {
    wx.navigateTo({
      url: '../purchase/details?id=' + this.data.orderId,
    })
  },

  // 去邀请
  invitation_show: function () {
    var that = this
    if (!that.data.hasUserInfo || !that.data.hasPhone) {
      wx.navigateTo({
        url: '../login/index',
      })
    } else {
      wx.navigateTo({
        url: '../member/invitation',
      })
    }
  },

  // 打电话地图上
  go_phone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },


  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  //   return {
  //     title: wx.getStorageSync('userInfo').nick + '邀请您体验共享氧疗服务抱抱氧;邀请码' + wx.getStorageSync('userInfo').invitationCode,
  //     path: '/pages/member/invitation_one?invitationCode=' + wx.getStorageSync('userInfo').invitationCode, //分享的页面所需要的id
  //     imageUrl: '/images/invitation.jpg' //分享界面的图片
  //   }
  // },
  // 地图授权
  map_show: function () {
    var that = this
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          latitudeOne: res.latitude,
          longitudeOne: res.longitude,
        })
        that.map_markerShow()
      },
      fail(res) {
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
          success: function (res) {
            if (res.cancel) {
              wx.showToast({
                title: '授权失败',
                icon: 'success',
                duration: 1000,
                mask: true
              })
            } else if (res.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000,
                      mask: true
                    })
                    //再次授权，调用getLocationt的API
                    wx.getLocation({
                      type: 'wgs84',
                      success(res) {
                        that.setData({
                          latitude: res.latitude,
                          longitude: res.longitude,
                          latitudeOne: res.latitude,
                          longitudeOne: res.longitude,
                        })
                      },
                    })
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'success',
                      duration: 1000,
                      mask: true
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  // 地图数据
  map_markerShow: function () {
    var that = this
    // 搜索周边抱抱氧机器
    var params = {
      location: that.data.latitudeOne + ',' + that.data.longitudeOne,
      radius: 5000,
      spatialRel: 0,
      autoExtend: 1,
      keyword: 'BBY',
      tableId: '60c02ae831259d2d7e584cc8',
      orderby: 'distance(' + that.data.latitudeOne + ',' + that.data.longitudeOne + ')',
      key: that.data.key
    }
    Api.getMapList(params, function callback(res) {
      if (res.data.code == 1) {
        const result = [{
          width: 110,
          height: 70,
          iconPath: "/images/fjsb.png",
          id: -1,
          latitude: that.data.latitudeOne,
          longitude: that.data.longitudeOne,
        }, {
          width: 100,
          height: 50,
          iconPath: "/images/dqwz.png",
          id: -2,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
        }]
        res.data.data.map(function (item, index) {
          markerMap[markerIndex] = item.id
          item.id = markerIndex++
          item.iconPath = (item.status == "NORMAL" ? "/images/home-map-o2.png" :( item.status != "ALARM"?"/images/home-map-o2-abnormalb.png":"/images/home-map-o2-abnormal.png"))
          item.width = 60
          item.height = 60
          item.latitude = item.lat
          item.longitude = item.lng
          item.briefAddr = item.address
          item.name = ""
          item.title = ""
          if (index == 0) {
            item.callout = {
              content: "最近氧疗机" + parseInt(item.distance) + "m",
              color: "#FFFFFF",
              fontSize: 12,
              borderRadius: 12,
              bgColor: "#57595c",
              padding: 8,
              display: 'ALWAYS',
              anchorY:8,
            }
          }
        })
        that.data.markers = result.concat(res.data.data)
        that.setData({
          markers: that.data.markers
        })
      }
    })
  },
  // 中心位置
  regionchangeShow: function (e) {
    var that = this
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.mapCtx = wx.createMapContext("map");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (res) {
          that.setData({
            latitudeOne: res.latitude,
            longitudeOne: res.longitude,
          })
          that.map_markerShow()
        }
      })
      this.mapCtx.translateMarker({
        markerId: -1,
        autoRotate: true,
        duration: 1000,
        destination: {
          latitude: that.data.latitude,
          longitude: that.data.longitude,
        },
        animationEnd() {

        },
        success: function (res) {

        }
      })
    }
  },

  // 搜索弹出框
  searchShow: function () {
    var that = this
    Api.getShow({eventId:"10000"},function callback(res){
    })
    var referer = '共享氧吧抱抱氧'
    var category = ''
    var location = JSON.stringify({
      latitude: that.data.latitudeOne,
      longitude: that.data.longitudeOne
    });
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${that.data.key}&referer=${referer}&location=${location}&category=${category}`
    });
  },

  // 穿透
  molde: function () {
    return
  },
  // 显示弹框
  go_title: function (e) {
    var that = this
    if (!that.data.hasUserInfo || !that.data.hasPhone) {
      wx.navigateTo({
        url: '../login/index',
      })
    } else {
      that.go_purchase()
    }
  },
  close_show: function (e) {
    var that = this
    that.setData({
      is_title: false
    })
  },
  // 扫一扫
  go_purchase: function (e) {
    var that = this
    wx.scanCode({
      success(res) {
        if (res.result != "") {
          var path = urlToObj(res.result)
          wx.navigateTo({
            url: '../purchase/index?' + path,
          })
        } else {
          wx.showToast({
            title: '传参有误',
            mask: true
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '扫描失败',
          mask: true
        })
      }
    })
  },

  // 关闭标点
  regionchange_one: function () {
    var that = this;
    for (let item of that.data.markers) {
      if (item.id == that.data.markerId) {
        item.iconPath = (item.status == "NORMAL" ? "/images/home-map-o2.png" :( item.status != "ALARM"?"/images/home-map-o2-abnormalb.png":"/images/home-map-o2-abnormal.png"))
      }
    }
    that.setData({
      map_view: false,
      markers: that.data.markers
    })
  },
  // 点击标点地址解析
  markertap: function (e) {
    var that = this;
    var markerId = e.detail.markerId
    var markers = that.data.markers
    markers.forEach(function (item, index) {
      if (item.id == markerId) {
        var latitude = item.latitude
        var longitude = item.longitude
        var name = item.spec
        var phone = item.tel
        var distance = item.distance
        var markers_status = item.status
        if (markerId == -1) {
          wx.navigateTo({
            url: 'equipment?latitude=' + latitude + '&longitude=' + longitude,
          })
        } else if (markerId == -2) {
          return
        } else if (index >= 0) {
          that.setData({
            map_view: markerId >= 0 ? true : false,
            markerId: markerId,
          })
          if (that.data.map_view) {
            item.iconPath = (item.status == "NORMAL" ? "/images/home-map-o2-selected.png" : (item.status != "ALARM"?"/images/home-map-o2-abnormalb-selected.png":"/images/home-map-o2-abnormal-selected.png"))
          } else {
            item.iconPath = (item.status == "NORMAL" ? "/images/home-map-o2.png" :( item.status != "ALARM"?"/images/home-map-o2-abnormalb.png":"/images/home-map-o2-abnormal.png"))
          }
          // 调用接口转换成具体位置
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function (res) {
              that.setData({
                markers_position: res.result.address,
                markers_name: name,
                markers_phone: phone,
                markers_distance: distance,
                markers_status: markers_status,
              })
            },
          })
        }
      } else {
        if (item.status) {
          item.iconPath = (item.status == "NORMAL" ? "/images/home-map-o2.png" :( item.status != "ALARM"?"/images/home-map-o2-abnormalb.png":"/images/home-map-o2-abnormal.png"))
        }
      }
    })
    that.setData({
      markers: markers,
    })
  },
  // 去高德地图
  go_gaode: function () {
    var that = this;
    var markers = that.data.markers
    var markerId = that.data.markerId
    for (let item of markers) {
      if (item.id == markerId) {
        var latitude = item.latitude
        var longitude = item.longitude
        var name = item.name;
        wx.openLocation({ //微信方法
          latitude: parseFloat(latitude), //经纬度
          longitude: parseFloat(longitude),
          name: that.data.markers_position,
          success: function (res) {}
        })
      }
    }
  },
  // 电话弹窗
  callShow: function () {
    this.setData({
      map_view: false,
      is_call: true,
    })
  },

  // 关闭电话弹窗
  callShowColse: function () {
    this.setData({
      is_call: false
    })
  },

  // 拨打电话
  goPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '15343309234',
    })
  },

  onReady: function (e) {
    this.map = wx.createMapContext("map")
  },

})