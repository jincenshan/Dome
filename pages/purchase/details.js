// pages/purchase/details.js
//获取应用实例
var Api = require("../../utils/api.js")
const app = getApp()
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
    reponse:'', //数据
    sendTime:'',//倒计时时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // var scene = options.scene?decodeURIComponent(options.scene):'';
    Api.getOrderDetails({id:options.id},function callback(res){
      if(res.data.code == 1){
        that.setData({
          reponse:res.data.data,
          sendTime:(parseInt(res.data.data.timestampOrder)+120)-Math.round(new Date().getTime() / 1000)
        })
        if(that.data.reponse.status == 1 || that.data.reponse.status == 4){
          that.timeShow()
        }
      }else{
        wx.showToast({
          title: res.data.info,
          mask:true
        })
      }
    })
    
  },

  // 倒计时
  timeShow:function(){
    var that = this
     // 60秒后重新获取验证码
     that.data.times = setInterval(function() {
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
  
  //购买下单
  buyShow:function(e){
    var that = this
    if(that.data.sendTime == 0){
      wx.showToast({
        title: '订单已超时',
        mask:true
      })
    }else{
    // 预备支付
    wx.showLoading({
      title:'加载中...',                             
      mask:true                                  
    })
    Api.getOrderPre({orderId:e.currentTarget.dataset.id},function callback(res){
      if(res.data.code == 1){
        wx.hideLoading()
        wx.requestPayment({
          appId:res.data.data.appId,
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.packages,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success(res) {
            if (res.errMsg == "requestPayment:ok") {
              wx.navigateTo({
                url: 'success?orderId='+that.data.reponse.orderId+'&money='+that.data.reponse.salePrice+'&scanType='+that.data.reponse.scanType,
              })
            }
          },
          fail(res) {
            wx.showToast({
              title: '支付失败',
              mask:true
            })
          }
       })
      }else{
        wx.showToast({
          title: res.data.info,
          mask:true,
        })
      }
    })
  }
  },

  // 抵扣次数
  buyNumberShow:function(e){
    var that = this
    if(that.data.sendTime == 0){
      wx.showToast({
        title: '订单已超时',
        mask:true
      })
    }else{
    wx.showModal({
      title: '确定提交？',
      content: '您本次氧疗服务将会扣减一次免费氧疗服务次数',
      success (res) {
        if (res.confirm) {
          Api.getPayGive({orderId:e.currentTarget.dataset.id},function callback(res){
            if(res.data.code == 1){
              wx.reLaunch({
                url: 'success?orderId='+that.data.reponse.orderId+'&money='+that.data.reponse.salePrice+'&scanType='+that.data.scanType+'&goodsName='+that.data.reponse.goodsName,
              })
            }else{
              wx.showToast({
                title: res.data.info,
                mask:true,
              })
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
    }
  },

  //去绑定氧疗袋
  goBag:function(e){
    var that = this
    wx.scanCode({
      success(res) {
        if(res.result !=""){
          var path = urlToObj(res.result)
          wx.navigateTo({
            url: '../binding/index?'+path+e.currentTarget.dataset.id,
          })
        }else{
          wx.showToast({
            title: '传参有误',
            mask:true
          })
        }
      },
      fail(res){
        wx.showToast({
          title: '扫描失败',
          mask:true
        })
      }
    })
  },

  // 取消订单
  buyClose:function(e){
    Api.getOrderClose({orderId:e.currentTarget.dataset.id},function callback(res){
      wx.showToast({
        title: res.data.info,
        mask:true
      })   
      wx.navigateBack({
        delta:1,
      })
    })
  },

  // 拨打电话
  goPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '15343309234',
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
    var that = this;
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