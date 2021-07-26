// pages/purchase/index.js
//获取应用实例
var Api = require("../../utils/api.js")
var Config = require("../../utils/config.js")

function urlToObj(str) {
  var obj = {};
  var arr1 = str.split("?");
  var arr2 = arr1[1].split("&");
  for (var i = 0; i < arr2.length; i++) {
    var arr3 = arr2[i].split("=");
    obj[arr3[0]] = arr3[1]
  }
  return obj;
}
let reg = /^(\d{3})\d{4}(\d{4})$/
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

// 实例化API核心类
var map_demo = new QQMapWX({
  key: 'P2YBZ-QKQCF-SUEJS-NCFPJ-NPTG6-PCBYX' // 必填
});
const app = getApp()


//日期格式(YY-mm-dd HH:MM:SS)转时间戳（秒）    
function DateToTamp(oString) {
  var f = oString.split(' ', 2);
  var d = (f[0] ? f[0] : '').split('-', 3);
  var t = (f[1] ? f[1] : '').split(':', 3);
  //使用Date的构造函数，实力化并解析      
  return (new Date(parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1, parseInt(d[2], 10) || null, parseInt(t[0], 10) || null, parseInt(t[1], 10) || null, parseInt(t[2], 10) || null)).getTime() / 1000;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendTime: '', //倒计时时间
    orderNo: 0, //订单号
    reponse: [], //订单信息
    money_number: 0, //金额
    name: '制氧机', //名称
    token: '', //token秘钥
    times: '', //定时器名字
    isSuspend: 0, //时间格式
    position: "暂无",
    createDate: 0,
    is_buy: false,
    scanType: '', //扫码类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(wx.getStorageSync('userInfo'))
    // console.log(options, decodeURIComponent(options.q)) 
    // if (wx.getStorageSync('userInfo') && wx.getStorageSync('phone')) {
    //   this.init(options)
    // } else {
    //   app.loginReadyCallback = res => {
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('phone')) {
          this.init(options)
        }else{
          wx.setStorageSync('path', urlToObj(decodeURIComponent(options.q)))
          wx.navigateTo({
            url: '../login/index',
          })
        }
    //   }
    // }
  },
  init: function(options) {
    let that = this
    if (options.q) {
      var path = urlToObj(decodeURIComponent(options.q))
      that.setData({
        scanType: path.scanType,
        equipSN: path.sn,
        orderNo: path.orderNo,
        bagSn: path.bagSn,
        goodsId: path.goodsId,
      })
    } else {
      that.setData({
        scanType: options.scanType,
        equipSN: options.sn,
        orderNo: options.orderNo,
        bagSn: options.bagSn,
        goodsId: options.goodsId,
      })
    }
    if (that.data.scanType == "equip") {
      var params = {
        equipSN: that.data.equipSN,
        orderNo: that.data.orderNo,
        goodsId: that.data.goodsId,
      }
      Api.getOrder(params, function callback(res) {
        if (res.data.code == 1) {
          that.setData({
            reponse: res.data.data,
            scanType: options.scanType,
            sendTime: (parseInt(res.data.data.timestampOrder) + 120) - Math.round(new Date().getTime() / 1000)
          })
          that.timeShow()
        } else {
          wx.showToast({
            title: res.data.info,
            mask: true
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../index/index',
            })
          }, 2000)
        }
      })
    } else if (that.data.scanType == "bag") {
      Api.getNetBag({
        bagSn: that.data.equipSN,
        goodsId: that.data.goodsId,
      }, function callback(res) {
        if (res.data.code == 1) {
          that.setData({
            reponse: res.data.data,
            scanType: that.data.scanType,
            sendTime: (parseInt(res.data.data.timestampOrder) + 120) - Math.round(new Date().getTime() / 1000)
          })
          that.timeShow()
        } else {
          wx.showToast({
            title: res.data.info,
            mask: true
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../index/index',
            })
          }, 2000)
        }
      })
    } else if (that.data.scanType == "oxy") {
      var params = {
        equipSN: that.data.equipSN,
        orderNo: that.data.orderNo,
        bagSn: that.data.bagSn,
        goodsId: that.data.goodsId,
      }
      Api.getOxyOrder(params, function callback(res) {
        if (res.data.code == 1) {
          that.setData({
            reponse: res.data.data,
            sendTime: (parseInt(res.data.data.timestampOrder) + 120) - Math.round(new Date().getTime() / 1000)
          })
          that.timeShow()
          if (that.data.reponse.bindState == 2) {
            wx.redirectTo({
              url: '../binding/message?bagSn=' + that.data.reponse.bagSn + '&userAccount=' + that.data.reponse.userAccount,
            })
          }
        } else {
          wx.showToast({
            title: res.data.info,
            mask: true
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../index/index',
            })
          }, 2000)
        }
      })
    }
  },
  timeShow: function () {
    var that = this
    // 60秒后重新获取验证码
    that.data.times = setInterval(function () {
      this.setData({
        sendTime: this.data.sendTime - 1
      });
      if (this.data.sendTime <= 0) {
        clearInterval(that.data.times)
        this.setData({
          sendTime: 0,
        });
      }
    }.bind(this), 1000);
  },

  go_black: function () {
    var that = this
    if (that.data.status == 4) {
      wx.showModal({
        title: '提示',
        content: '退出将视为取消订单支付，请认真选择！',
        success(res) {
          if (res.confirm) {
            Api.getOrderClose({
              token: that.data.token
            }, function callback(res) {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../member/index',
                })
              }, 3000)
              return;
            })
          } else if (res.cancel) {}
        }
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  // 微信用户信息获取
  onGotUserInfo: function (e) {
    var that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.login({
        complete: (res) => {
          // 微信的code用来跟服务器换取
          if (res.code) {
            var params = {
              code: res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
            }
            Api.getWxOpenId(params, function callback(res) {
              wx.setStorageSync("userInfo", res.data.data)
              Config.session_id = res.data.data.openid
              Config.session_key = res.data.data.sessionKey
              that.setData({
                userInfo: res.data,
                hasUserInfo: true,
                userInfo: res.data.data,
              })
            })
          } else {

          }
        },
      })
    }
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      //用户信息
      var params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: Config.session_key,
      }
      //后端获取参数进行解密
      Api.getPhoneNumber(params, function callback(res) {
        wx.setStorage({
          key: "phone",
          data: res.data.data.phone
        })
        that.setData({
          hasPhone: true,
          status: 4,
        })
        Api.getOrder({
          token: that.data.scene,
          position: '',
        }, function callback(res) {
          if (res.data.status == 500 || res.data.code == 0) {
            wx.hideLoading()
            wx.showToast({
              title: res.data.info,
              mask: true
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../member/index',
              })
            }, 3000)
            return;
          } else {
            wx.hideLoading()
            that.setData({
              reponse: res.data.data.reponse,
              money_number: res.data.data.reponse.amount,
              status: 4,
              orderNo: res.data.data.reponse.orderNo,
              name: res.data.data.reponse.productName,
              end_time: (parseInt(res.data.data.reponse.createDate) + 120) - Math.round(new Date().getTime() / 1000),
              token: that.data.scene,
            })
            that.countDown();
          }
        })
      })
    }
  },
  // 穿透
  molde: function () {
    return
  },


  // 支付
  go_buy: function () {
    var that = this
    if (that.data.sendTime == 0) {
      wx.showToast({
        title: '订单已超时',
        mask: true
      })
    } else {
      wx.showLoading({
        title: "加载中..."
      })
      if (that.data.reponse.orderId) {
        Api.getOrderPre({
          orderId: that.data.reponse.orderId
        }, function callback(res) {
          if (res.data.code == 1) {
            wx.hideLoading()
            wx.requestPayment({
              appId: res.data.data.appId,
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.packages,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              success(res) {
                if (res.errMsg == "requestPayment:ok") {
                  wx.reLaunch({
                    url: 'success?orderId=' + that.data.reponse.orderId + '&money=' + that.data.reponse.salePrice + '&scanType=' + that.data.scanType + '&goodsName=' + that.data.reponse.goodsName,
                  })
                }
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  mask: true
                })
              }
            })

          } else {
            wx.showToast({
              title: res.data.info,
              mask: true,
            })
          }
        })
      }
    }
  },
  go_buy_number: function () {
    var that = this
    if (that.data.sendTime == 0) {
      wx.showToast({
        title: '订单已超时',
        mask: true
      })
    } else {
      wx.showModal({
        title: '确定提交？',
        content: '您本次氧疗服务将会扣减一次免费氧疗服务次数',
        success(res) {
          if (res.confirm) {
            Api.getPayGive({
              orderId: that.data.reponse.orderId
            }, function callback(res) {
              if (res.data.code == 1) {
                wx.reLaunch({
                  url: 'success?orderId=' + that.data.reponse.orderId + '&money=' + that.data.reponse.salePrice + '&scanType=' + that.data.scanType + '&goodsName=' + that.data.reponse.goodsName,
                })
              } else {
                wx.showToast({
                  title: res.data.info,
                  mask: true,
                })
              }
            })
          } else if (res.cancel) {

          }
        }
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
    var that = this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // var that = this;
    // clearInterval(that.data.times);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    clearInterval(that.data.times);
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