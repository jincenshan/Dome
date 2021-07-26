// pages/member/invitation.js
var Api = require("../../utils/api.js")
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl: '', //头像
    qrcode: '',
    user: '',
    src: '',
    width: '',
    height: '',
    photo: true,
    rate: rate
  },

  // 复制文字
  goCopy: function () {
    var that = this
    wx.setClipboardData({
      data: that.data.user.invitationCode,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              mask: true
            })
          }
        })
      }
    })
  },

  // 邀请
  goShow: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: (res) => {
        console.log(res)
        wx.showToast({
          title: "成功"
        })
      },
      complete: (res) => {
        console.log(res)
        wx.showToast({
          title: res
        })
      },
    })
  },
  // 保存照片
  go_friends: function () {
    this.setData({
      photo: false
    })
    this.widget = this.selectComponent('.widget')
    var that = this;
    var wxml = `
    <view class="main">
    <view class="top-images">
      <image src="https://oxy.api.ncmed.cn/eos-wechat/qrcode/invita-bg-5.png" class="top-view-bg" mode='aspectFit'></image>
    </view>
    <view class="middle-images">
      <image src="https://oxy.api.ncmed.cn/eos-wechat/qrcode/invita-bg-4.png" class="top-view-bg-1" mode='aspectFit'></image>
    </view>
    <view class="top-view">
      <view class="top-view-text">
        <text class="top-text1">全藏区</text>
        <text class="top-text2">306个</text>
        <text class="top-text3">取氧点，随时补氧</text> 
      </view>
      <image src="`  + that.data.headUrl + `" class="top-avatarUrl" mode='aspectFit'></image>
      <text class="invitation-text">您的邀请码</text>
      <text class="invitation-code">` + that.data.user.invitationCode + `</text>
      <text class="text">微信识别二维码</text>
      <image class="code-images" mode='aspectFit' src="` + that.data.qrcode + `"></image>
      <text class="tip">用户输入您的邀请码</text>
      <text class="top-bottom">双方将会获得1次免费取氧次数</text>
    </view>
    <view class="bottom">
      <image src="https://oxy.api.ncmed.cn/eos-wechat/qrcode/invita-bg-6.png" class="bottom-image" mode='aspectFit'></image>
    </view>
    </view>
    `
    var style = {
      main: {
        width: 750 / rate,
        height: 1300 / rate,
        alignItems: 'center',
        backgroundColor: '#0080FF',
      },
      topImages: {
        width: 436 / rate,
        height: 240 / rate,
        flexDirection: 'column',
        alignItems: 'center',
      },
      middleImages: {
        width: 690 / rate,
        height: 200 / rate,
        flexDirection: 'column',
        alignItems: 'center',
      },
      topView: {
        width: 690 / rate,
        height: 800 / rate,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      },
      topViewText: {
        width: 531 / rate,
        height: 38 / rate,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30 / rate,
      },
      topText1: {
        fontSize: 36 / rate,
        lineHeight: 38 / rate,
        fontWeight: 'bold',
        width: 108 / rate,
        height: 38 / rate,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      topText2: {
        width: 90 / rate,
        height: 38 / rate,
        fontSize: 36 / rate,
        lineHeight: 38 / rate,
        fontWeight: 'bold',
        color: '#0080FF',
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      topText3: {
        width: 288 / rate,
        fontSize: 36 / rate,
        lineHeight: 38 / rate,
        fontWeight: 'bold',
        height: 38 / rate,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      topAvatarUrl: {
        width: 120 / rate,
        height: 120 / rate,
        borderRadius: 30,
        marginTop: 46 / rate,
      },
      invitationText: {
        width: 172 / rate,
        height: 33 / rate,
        fontSize: 34 / rate,
        lineHeight: 33 / rate,
        marginTop: 19 / rate,
        fontWeight: 'bold',
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      invitationCode: {
        width: 224 / rate,
        height: 45 / rate,
        fontSize: 60 / rate,
        lineHeight: 45 / rate,
        marginTop: 35 / rate,
        fontWeight: 'bold',
        textAlign: 'center',
        verticalAlign: 'middle',
        color: '#ff3b3b',
      },
      text: {
        fontSize: 23 / rate,
        lineHeight: 23 / rate,
        fontWeight: 'bold',
        width: 171 / rate,
        height: 23 / rate,
        marginTop: 35 / rate,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      codeImages: {
        width: 220 / rate,
        height: 220 / rate,
        marginTop: 31 / rate,
      },
      tip: {
        width: 300 / rate,
        height: 37 / rate,
        lineHeight: 37 / rate,
        fontWeight: 'bold',
        marginTop: 32 / rate,
        fontSize: 30 / rate,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      topBottom: {
        width: 417 / rate,
        height: 38 / rate,
        lineHeight: 37 / rate,
        fontSize: 30 / rate,
        fontWeight: 'bold',
        textAlign: 'center',
        verticalAlign: 'middle',
        color: '#ff3b3b',
      },
      topViewBg: {
        width: 436 / rate,
        height: 240 / rate,
      },
      topViewBg1: {
        width: 690 / rate,
        height: 200 / rate,
      },
      bottom: {
        width: 690 / rate,
        height: 28 / rate,
        flexDirection: 'column',
        alignItems: 'center',
      },
      bottomImage: {
        width: 690 / rate,
        height: 28 / rate,
      }
    }
    this.widget = this.selectComponent('.widget')
    wx.showLoading({
      title: '海报生成中......',
    })
    setTimeout(() => {
      const p1 = this.widget.renderToCanvas({
        wxml,
        style
      })
      p1.then((res) => {
        this.main = res
      })
      wx.hideLoading()
    }, 1500)
  },

  // 保存图片
  go_photo: function () {
    this.extraImage()
  },

  extraImage() {
    const p2 = this.widget.canvasToTempFilePath()
    p2.then(res => {
      this.setData({
        src: res.tempFilePath,
        width: this.main.layoutBox.width,
        height: this.main.layoutBox.height
      })
      this.saveImg()
    })
  },

  /**
   * saveImg:点击按钮保存图片到本地
   */
  saveImg: function () {
    const imgSrc = this.data.src
    console.log('imgSrc', imgSrc)
    //图片保存到本地
    wx.saveImageToPhotosAlbum({
      filePath: imgSrc, //图片文件路径
      success(res) {
        console.log('saveImageToPhotosAlbum success', res)
        //接口调用成功
        wx.showToast({
          title: '保存成功',
          duration: 1000, //提示延迟时间
          mask: true
        })
      },
      fail(err) {
        //需要用户授权设置
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          // 用户授权设置
          wx.openSetting({
            success(settingdata) {
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      headUrl: wx.getStorageSync('userInfo').headUrl ? wx.getStorageSync('userInfo').headUrl : 'https://oxy.api.ncmed.cn/eos-wechat/qrcode/personal-top-photo-nobody.png',
      user: wx.getStorageSync('userInfo'),
      qrcode: 'https://oxy.api.ncmed.cn/eos-wechat/qrcode/' + wx.getStorageSync('userInfo').invitationCode + '.jpg',
      // qrcode:'http://192.168.2.22:9088/eos-wechat/qrcode/'+wx.getStorageSync('userInfo').invitationCode+'.jpg',
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    Api.getShow({eventId:"19988"},function callback(res){
  
    })
  },

  // 立即邀请
  goShow: function () {
    wx.showShareImageMenu({
      path: this.data.qrcode + '?invitationCode=' + wx.getStorageSync('userInfo').invitationCode,
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
      title: wx.getStorageSync('userInfo').nick + '邀请您体验共享氧疗服务抱抱氧;邀请码' + wx.getStorageSync('userInfo').invitationCode,
      path: '/pages/member/invitation_one?invitationCode=' + wx.getStorageSync('userInfo').invitationCode, //分享的页面所需要的id
      imageUrl: '/images/invitation.jpg' //分享界面的图片
    }
  }
})