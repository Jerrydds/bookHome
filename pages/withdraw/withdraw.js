// pages/withdraw/withdraw.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasCount: null,   // 是否有绑定过帐号
    phone: null,
    QR: null,
    getCodeText: '获取验证码',
    limit: false      // 验证码发送后禁止再次点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHyb()
  },
  // 获取是否绑定会员宝帐号
  getHyb() {
    this.setData({
      hasCount: app.globalData.ownUserInfo.commonUserId
    })
  },
  // 输入的时候获取手机号
  phoneNumber(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 输入的时候获取验证码号
  QRNumber(e) {
    this.setData({
      QR: e.detail.value
    })
  },

  // 获取验证码
  getCode() {
    if (this.data.limit) return
    let s = 60
    let phoneNumber = this.data.phone
    if (!this.isPhone(phoneNumber)) return
    this.setData({
      limit: true,
      getCodeText: '剩余时间' + s + 's'
    })
    let time = setInterval(() => {
      this.setData({
        getCodeText: '剩余时间' + (s - 1) + 's'
      })
      s--
      if (s === 0) {
        this.setData({
          limit: false,
          getCodeText: '获取验证码'
        })
        clearInterval(time)
      }
    }, 1000)
    this.getQRCode({  // 获取验证码
      phone: phoneNumber
    })
  },
  // 手机号码验证
  isPhone(phoneNumber) {
    let re = /^(1[0-9][0-9]{9})$/
    if (!re.test(phoneNumber)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码',
        showCancel: false
      })
      return false
    } else {
      return true
    }
  },
  // 获取验证码
  getQRCode(phone) {
    app.HttpService.getQR(phone).then(res => {
      if (res.statusCode === 0) {
        wx.showModal({
          title: '提示',
          content: '验证码已发送',
          showCancel: false
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  // 绑定手机号
  bindPhone() {
    let data = {
      code: this.data.QR,
      phone: this.data.phone
    }
    if (!data.code || !data.phone || data.code.length !== 4 || data.phone.length !== 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码或验证码',
        showCancel: 0
      })
      return
    }
    app.HttpService.bindPhone(data).then(res => {
      if (res.statusCode === 0) {
        wx.showModal({
          title: '提示',
          content: '绑定成功',
          showCancel: 0
        })
        app.globalData.ownUserInfo.commonUserId = true
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: 0
        })
      }
    })
  },
  preImg() { // 预览二维码
    wx.previewImage({
      urls: ['https://usedgoods-img.thy360.com/u2/avatar6808']
    })
  },
  goHome () {
    wx.switchTab({
      url: '../index/index'
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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