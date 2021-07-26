var Config = require("./config.js")
var SECRET_KEY = "DS321!#(&%123dC"
// 以上定义禁止修改

// 以下是切换调试和服务器
if (!Config.debug_local) {
  var HOST_URI = 'https://oxy.api.ncmed.cn'; //正式
  // var HOST_URI = 'https://oxy.api.test.ncmed.cn'; //测试
} else {
  var HOST_URI = 'http://192.168.2.22:9088';
}


//下面的必须以/结尾,因为后面还要拼接session_id
var GET_WX_OPENID = "/eos-auth/wechat/index"
var GET_INFO = "/eos-wechat/wx/user/"
var GET_REGISTER = "/eos-auth/jwt/bbyAuthorizationRegister/"
var BUY_GOOD = "/eos-bby/applet/order/buyBagAtEquip" 
var GET_PHONE_CODE = "/eos-auth/jwt/sendCode" 
var GET_PHONE_REGISTER = "/eos-auth/jwt/bbySmsRegister/"
var GET_USER_CODE = "/eos-bby/user/fillInvitationCode"
var GET_ORDER_PRE = "/eos-bby/applet/order/payOrder/"
var GET_OXY_BAG = "/eos-bby/oxygenbag/bindCheck"
var GET_OXY_BAGN ="/eos-bby/oxygenbag/bindUser"
var GET_BAG_LIST = "/eos-bby/applet/order/list"
var GET_ORDER_DETAILS = "/eos-bby/applet/order/info/"
var GET_NET_BAG = "/eos-bby/applet/order/buyBagAtNet"
var GET_MAP_LIST = "/eos-lbs/placeCloud/peripheralSearch"
var GET_USER_NUMBER = "/eos-bby/user/personalInfo"
var GET_INVITATION_CODE = "/eos-bby/anon/info/"
var GET_FRIENDS_NUMBER = "/eos-bby/applet/oxygengivecnt/invitedSum"
var GET_FRIENDS_LIST = "/eos-bby/applet/oxygengivecnt/listInvited"
var GET_GIVE_SUM = "/eos-bby/applet/oxygengivecnt/sumOxygenGive"
var GET_OXYGEN_LIST = "/eos-bby/applet/oxygengivecnt/listOxygenGive" 
var GET_NET_NUMBER = "/eos-bby/applet/oxygengivecnt/info/"
var GET_OXYGEN_NUMBER = "/eos-bby/applet/oxygengivecnt/getOxygenGiveByOrderId"
var GET_USER_ORDER = "/eos-bby/applet/order/getReadyPayOne"
var GET_ORDER_CLOSE = "/eos-bby/applet/order/cancelOrder"
var GET_OXY_ORDER = "/eos-bby/applet/order/buyOxygenOrder"
var GET_PAY_GIVE = "/eos-bby/applet/order/payChannelGive/" 
var SHOW = "/eos-bby/eventlog/save"

function format_url(URL, obj) {
  for (var key in obj) {
    URL = URL.replace("$" + key, obj[key])
  }
  return URL
}

function obj2uri(obj) {
  return Object.keys(obj).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
  }).join('&');
}

function empty_func() {

}

function fail_func() {
  wx.hideLoading();
  wx.showToast({
    title: '网络请求失败',
  })
}

var form_header = {
  "Content-Type": "application/json",
  "Authorization": ""
}
var form_header_post = {
  "Content-Type": "application/x-www-form-urlencoded",
  "Authorization": ""
}

function getDataFromGetNet(uri, func, data, fail, complete,header) {
  header.Authorization = Config.token
  wx.request({
    url: uri,
    data: data,
    method: 'GET',
    header: header,
    success: function (res) {
      if (res.data.code == '40001' || res.data.code == '40002' || res.data.code == '40003') {
        var code = "请先授权登录";
        wx.removeStorageSync('userInfo')
        processRetStat(code)
        return
      }
      func(res)
    },
    fail: fail || fail_func,
    complete: complete || empty_func
  })
}

function getDataFromPostNet(uri, func, data, fail, complete, header) {
  header.Authorization = Config.token
  wx.request({
    url: uri,
    data: data,
    method: 'POST',
    header: header,
    success: function (res) {
      if (res.data.code == '40001' || res.data.code == '40002' || res.data.code == '40003') {
        var code = "请先授权登录";
        wx.removeStorageSync('userInfo')
        processRetStat(code)
        return
      }
      func(res)
    
    },
    fail: fail || fail_func,
    complete: complete || empty_func
  })
}

function getDataFromPutNet(uri, func, data, fail, complete, header) {
  header.Authorization = Config.token
  wx.request({
    url: uri,
    data: data,
    method: 'PUT',
    header: header,
    success: function (res) {
      if (res.data.code == '40001' || res.data.code == '40002' || res.data.code == '40003') {
        var code = "请先授权登录";
        wx.removeStorageSync('userInfo')
        processRetStat(code)
        return
      }
      func(res)
    
    },
    fail: fail || fail_func,
    complete: complete || empty_func
  })
}

module.exports = {
  // 获取小程序open_id
  getWxOpenId: function (params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_WX_OPENID,params), func, params, null, null, form_header
    )
  },
  // 授权一键
  getRegister: function (params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_REGISTER+params.openid,params), func, params, null, null, form_header
    )
  },

  // 用户信息
  getInfo: function (params, func) {
    getDataFromGetNet(
      HOST_URI + format_url(GET_INFO+params.appid+'/info',params), func, params, null, null, form_header_post
    )
  },

  // 在设备购买氧疗袋
  getOrder:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(BUY_GOOD, params), func, params, null, null, form_header_post
    )
  },

  // 订单预生成
  getOrderPre:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_ORDER_PRE+params.orderId, params), func, params, null, null, form_header
    )
  },
  // 发送手机号验证码
  getPhoneCode:function(params, func) {
    getDataFromGetNet(
      HOST_URI + format_url(GET_PHONE_CODE, params), func, params, null, null, form_header_post
    )
  },

  // 手机号注册 
  getPhoneRegister:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_PHONE_REGISTER+params.validCode, params), func, params, null, null, form_header
    )
  },

  // 填写邀请码 
  getUserCode:function(params, func) {
    getDataFromPutNet(
      HOST_URI + format_url(GET_USER_CODE, params), func, params, null, null, form_header_post
    )
  },

  // 氧疗袋绑定设备
  getOxyBag:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_OXY_BAG, params), func, params, null, null, form_header_post
    )
  },

  // 氧疗用户绑定氧疗袋获得次数
  getOxyBagN:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_OXY_BAGN, params), func, params, null, null, form_header_post
    )
  },

  // 氧疗list
  getBagList:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_BAG_LIST, params), func, params, null, null, form_header
    )
  },

  // 订单详情
  getOrderDetails:function(params, func) {
    getDataFromGetNet(
      HOST_URI + format_url(GET_ORDER_DETAILS+params.id, params), func, params, null, null, form_header_post
    )
  },

  // 在网点绑定设备 
  getNetBag:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_NET_BAG, params), func, params, null, null, form_header_post
    )
  },

  // 地图附近 GET_MAP_LIST
  getMapList:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_MAP_LIST, params), func, params, null, null, form_header
    )
  },

  // 个人中心个人信息
   getUserNumber:function(params, func) {
    getDataFromGetNet(
      HOST_URI + format_url(GET_USER_NUMBER, params), func, params, null, null, form_header_post
    )
  },

  // 根据邀请码获取用户信息  GET_INVITATION_CODE
  getInvitationCode:function(params, func) {
    getDataFromGetNet(
      HOST_URI + format_url(GET_INVITATION_CODE+params.invitationCode, params), func, params, null, null, form_header_post
    )
  },

  // 邀请好友数量
  getFriendsNumber:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_FRIENDS_NUMBER, params), func, params, null, null, form_header_post
    )
  },

  // 邀请好友列表
  getFriendsList:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_FRIENDS_LIST, params), func, params, null, null, form_header
    )
  },

  // 氧疗服务次数 
  getOxygenNumber:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_GIVE_SUM, params), func, params, null, null, form_header_post
    )
  },
   // 氧疗服务列表
   getOxygenList:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_OXYGEN_LIST, params), func, params, null, null, form_header
    )
  },

  // 支付成功次数 
  getOxygenNumbers:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_OXYGEN_NUMBER, params), func, params, null, null, form_header_post
    )
  },

  // 是否有未支付订单 
  getUserOrder:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_USER_ORDER, params), func, params, null, null, form_header_post
    )
  },

  // 用户网点免费氧疗袋次数 
  getNetNumber:function(params, func) {
    getDataFromGetNet(
      HOST_URI + format_url(GET_NET_NUMBER, params), func, params, null, null, form_header_post
    )
  },

  // 订单取消 
  getOrderClose:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_ORDER_CLOSE, params), func, params, null, null, form_header_post
    )
  },

  // 氧气购买 
  getOxyOrder:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_OXY_ORDER, params), func, params, null, null, form_header_post
    )
  },
  //订单抵扣赠送支付  SHOW
  getPayGive:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(GET_PAY_GIVE+params.orderId, params), func, params, null, null, form_header_post
    )
  },
  //事件
  getShow:function(params, func) {
    getDataFromPostNet(
      HOST_URI + format_url(SHOW, params), func, params, null, null, form_header
    )
  },
};

function processRetStat(res) {
  wx.showToast({
    title: res,
    duration: 2000,
    mask:true
  })
  setTimeout(function () {
    if (res == "请先授权登录") {
      wx.reLaunch({
        url: '/pages/login/index',
      })
      return
    }
  },2000)
 
}