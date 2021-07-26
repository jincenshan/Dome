var MD5 = require('./md5.js')
var Config = {}

// 是否连接本地测试服
Config.debug_local = false;


// is_bind表示是否有绑定手机号，food_sum表示购物车商品数量
Config.session_id = null; 
Config.token = wx.getStorageSync('token');
Config.location = '';
Config.invitationCode = "",
Config.Error = {
  '10001': "找不到店铺",
}
Config.Km = {
  '3':'1000000',
  '4':'500000',
  '5':'200000',
  '6':'100000',
  '7':'50000',
  '8':'50000',
  '9':'20000',
  '10':'10000',
  '11':'5000',
  '12':'2000',
  '13':'1000',
  '14':'500',
  '15':'200',
  '16':'100',
  '17':'50',
  '18':'50',
  '19':'20',
  '20':'10',
},



module.exports = Config