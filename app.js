//app.js
import WxValidate from 'helpers/WxValidate'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'

var QQMapWX = require('./assets/plugins/qqmap-wx-jssdk.min.js');
//  添加域名地址https://apis.map.qq.com
var map = new QQMapWX({
  key: 'JRTBZ-J5RKW-CRXRW-OSMHF-LNGPT-W3FV3' // 必填
});

App({
  onLaunch: function (options) {    // 初始化
    this.loginIf()
  },
  onLoad() {
    map = new QQMapWX({
      key: 'JRTBZ-J5RKW-CRXRW-OSMHF-LNGPT-W3FV3' // 必填
    })
  },
  globalData: {   // 全局变量
    tmpUserInfo: null,    // 这个页面暂时用的用户信息
    ownUserInfo: null,    // 自家服务器的用户信息
    userInfo: {},
    deviceInfo: null,
    enterBoolean: false,
    userCity: null,    //　地理位置
    reBookList: null    // 选中的回收清单列表
  },
  loginIf() {   // 登录获取userInfo，地理位置，token
    /*
    * 微信code > sessionKey > 微信userInfo > 自家userInfo & token
    **/
    // let userInfo = null    // 暂存个人信息，等到跟自己的服务器交互完再设置
    this.WxService.login().then(res => {  // 获取微信code
      return this.HttpService.getSessionKey(res.code)
    }).then(res => {
      if (res.statusCode === 0) {
        let sessionKey = res.data
        wx.setStorageSync('session', sessionKey)    // 全局保存session
        return this.WxService.getUserInfo()
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: 0
        })
      }
    })
      .catch(() => {  // 如果拒绝授权
        let _this = this
        wx.showModal({
          title: '警告',
          showCancel: 0,
          content: '如需正常使用猪猪书屋功能，请按确定并在授权管理中选中“用户信息”，重新进入小程序即可正常使用',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) {  //如果用户重新同意了授权登录,继续登录
                    console.log('进入再次授权')
                    _this.WxService.getUserInfo().then(res => {
                      _this.globalData.tmpUserInfo = res.userInfo
                      res.session = wx.getStorageSync('session')  // 增加session属性
                      return _this.HttpService.sessionLogin(res)   // 获取自家接口的用户信息
                    }).then(res => {
                      if (res.statusCode === 0) {
                        _this.globalData.ownUserInfo = res.data    // 全局保存自己用户信息
                        _this.globalData.userInfo = _this.globalData.tmpUserInfo    // 全局保存微信用户信息                
                        wx.setStorageSync('token', res.data.token)  // 全局保存token
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: res.msg,
                          showCancel: 0
                        })
                      }
                    })
                  }
                }
              })
            }
          }
        })
      })
      .then(res => {   // 正常流程
        res.session = wx.getStorageSync('session')  // 增加session属性
        this.globalData.tmpUserInfo = res.userInfo  
        console.log('微信', this.globalData.tmpUserInfo)
              
        return this.HttpService.sessionLogin(res)   // 获取自家接口的用户信息
      }).then(res => {
        if (res.statusCode === 0) {
          this.globalData.ownUserInfo = res.data    // 全局保存自己用户信息
          this.globalData.userInfo = this.globalData.tmpUserInfo    // 全局保存微信用户信息      
          console.log('全局信息：', this.globalData)          
          wx.setStorageSync('token', res.data.token)  // 全局保存token
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: 0
          })
        }
      })

    // this.getLocation()  // 获取地理信息
  },
  // 获取地理信息
  getLocation() {
    // 地理定位，手机上使用时打开 暂时不要定位
    let self = this
    map.reverseGeocoder({   // 获取用户地理信息
      success: function (res) {
        let city = res.result.ad_info.city
        self.globalData.userCity = city // 保存用户当前城市位置
        if (city !== '深圳市' && city !== '广州市') {
          wx.showModal({
            title: '提示',
            confirmText: '去卖书',
            content: `您在${city}，猪猪书屋目前仅在广州、深圳运营，点击确定进入查看`
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '定位失败',
          confirmText: '随便逛逛',
          // cancelText: '再次定位',
          showCancel: 0,
          content: '我们无法获取您的位置，猪猪书屋目前仅在广州、深圳运营，点击进入查看',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })
  },
  //获取设备信息
  getDeviceInfo() {
    this.globalData.deviceInfo = this.WxService.getSystemInfoSync()
  },
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
  HttpService: new HttpService,
  WxService: new WxService,
  Tools: new Tools,
  Config: Config,
  onShow: function () {
    //用于进入小程序修改目前定位为当前定位
    //this.globalData.chooseLocationBoolean用于修复微信6.5.9的选完定位会触发app.onshow的bug
    // enterBoolean onshow的时候刷新定位
    if (!this.globalData.enterBoolean) {
      this.globalData.enterBoolean = true
    }
  },
  onShow: function () {
  },
  onHide: function () {
  }
})