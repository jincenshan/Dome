// pages/member/photo.js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      headUrl: wx.getStorageSync('userInfo').headUrl ? wx.getStorageSync('userInfo').headUrl : '../../images/personal-top-photo-nobody.png',
      user: wx.getStorageSync('userInfo'),
      qrcode: 'https://oxy.api.ncmed.cn/eos-wechat/qrcode/' + wx.getStorageSync('userInfo').invitationCode + '.jpg',
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // 图片
    this.widget = that.selectComponent('.widget')
  },

  // 保存照片
  go_friends: function () {
    var that = this;
    var wxml = `
    <view class="main">
    <view class="top-images">
      <image src="https://oxy.api.ncmed.cn/eos-wechat/qrcode/invita-bg-5.png" class="top-view-bg" mode='aspectFit'></image>
      <image src="https://oxy.api.ncmed.cn/eos-wechat/qrcode/invita-bg-4.png" class="top-view-bg-1" mode='aspectFit'></image>
    </view>
    <view class="top-view">
      <view class="top-view-text">
        <text class="top-text1">全藏区</text>
        <text class="top-text2">306个</text>
        <text class="top-text3">取氧点，随时补氧</text> 
      </view>
      <image src="` + that.data.headUrl ? that.data.headUrl : "https://oxy.api.ncmed.cn/eos-wechat/qrcode/personal-top-photo-nobody.png" + `" class="top-avatarUrl" mode='aspectFit'></image>
      <text class="text">您的邀请码</text>
      <text class="text red">` + that.data.user.invitationCode + `</text>
      <text class="text">微信识别二维码</text>
      <image class="code-images" mode='aspectFit' src="` + that.data.qrcode + `"></image>
      <text class="text margin">用户输入您的邀请码</text>
      <view class="top-view-text">
        <text class="top-bottom red">双方将会获得1次免费取氧次数</text>
      </view>
    </view>
    <view class="bottom">
      <image src="https://oxy.api.ncmed.cn/eos-wechat/qrcode/invita-bg-6.png" class="bottom-image" mode='aspectFit'></image>
    </view>
    </view>
    `

    var style = {
      main: {
        width: 375,
        flexDirection: 'column',
        height: 750,
        alignItems: 'center',
        backgroundColor: '#0080FF',
      },
      topImages: {
        width: 375,
        height: 220,
        flexDirection: 'column',
        alignItems: 'center',
      },
      topView: {
        width: 350,
        height: 400,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      topViewText: {
        width: 350,
        height: 17,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
      },
      topText1: {
        fontSize: 12,
        lineHeight: 12,
        fontWeight: 'bold',
        width: 40,
        height: 17,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      topText2: {
        width: 40,
        height: 17,
        fontSize: 12,
        lineHeight: 12,
        fontWeight: 'bold',
        color: '#0080FF',
      },
      topText3: {
        fontSize: 12,
        lineHeight: 12,
        fontWeight: 'bold',
        width: 100,
        height: 17,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      topBottom: {
        fontSize: 12,
        lineHeight: 12,
        fontWeight: 'bold',
        width: 200,
        height: 17,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      topViewBg: {
        width: 218,
        height: 120,
      },
      topViewBg1: {
        width: 350,
        height: 100,
      },
      topAvatarUrl: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginTop: 10,
      },
      codeImages: {
        width: 110,
        height: 110,
        marginTop: 10,
        marginBottom: 10,
      },
      margin: {
        marginTop: 10,
      },
      text: {
        fontSize: 12,
        lineHeight: 12,
        fontWeight: 'bold',
        width: 300,
        height: 17,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      red: {
        color: '#FF0000',
      },
      bottom:{
        width: 350,
        height: 14,
        flexDirection: 'column',
        alignItems: 'center',
      },
      bottomImage: {
        width: 350,
        height: 14,
      }
    }

    const p1 = this.widget.renderToCanvas({
      wxml,
      style
    })
    p1.then((res) => {
      this.main = res

    })
  },

  // 保存图片
  go_photo: function () {
    // this.go_friends()
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
    var imgSrc = this.data.src
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath, //图片文件路径
          success(res) {
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

      }
    })



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(this.go_friends, 3000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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