// pages/placeorder/recover/recover.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: null,  //　后台传回的订单信息
    array: ['深圳', '广州'],
    index: 0,
    time: null,
    date: null,
    startDate: null,
    endDate: null,
    isSuccess: false,   // 是否提交成功
    orderId: null,   // 提交订单后的id
    type1:'recycle'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type1: options.ifBuy ? 'buy' :'recycle'
    })
    wx.setNavigationBarTitle({
      title: options.ifBuy ? '购书下单' : '回收下单'
    })
    this.getNowDate()
    this.getReOrderInfo()
  },

  openmap () {
    // 打开地址选择控件
    app.WxService.chooseAddress()
      .then(data => {
        console.log(data)
        this.data.orderInfo.address = {
          contact: data.userName,
          phone: data.telNumber,
          village: data.provinceName + data.cityName + data.countyName,
          room1: data.detailInfo
        }
        this.setData({
          orderInfo: this.data.orderInfo
        })
      })
  },
  // 获取订单信息
  getReOrderInfo () {
    app.HttpService.getReOrderInfo(this.data.type1,app.globalData.reBookList).then(res => {
      if (res.statusCode === 0) {
        this.setData({
          orderInfo: res.data
        })
        // 接口没返回地址获取微信收货地址
        if (!res.data.address.phone) {
          this.openmap()
        }
      }else{
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false,
          confirmColor: '#4971a4',
          confirmText: '确认',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({})
            }
          }
        })
      }
    })
  },

  bindPickerChange: function (e) {  // 省市区选择
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindTimeChange: function (e) {    //　时间选择
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  getNowDate () {
    let date = new Date()
    // let strTime = "2018-02-22";    //字符串日期格式             
    // let date = new Date(Date.parse(strTime.replace(/-/g, "/")));  
    let endDate = new Date()
    // let endDate = new Date(Date.parse(strTime.replace(/-/g, "/")));  
    let hour = date.getHours()
    let day = 24 * 60 * 60 * 1000
    if (hour < 17) {
      date.setTime(date.getTime() + day)  // 明天
      endDate.setTime(endDate.getTime() + 7 * day)  // 七天后
    } else {    //　17点后顺延一天
      date.setTime(date.getTime() + 2 * day)  // 后天
      endDate.setTime(endDate.getTime() + 8 * day)  // 七天后
    }
   console.log(11,date)
    this.setData({
      startDate: app.Tools.formatDate(date, 'yyyy-MM-dd', 0),
      endDate: app.Tools.formatDate(endDate, 'yyyy-MM-dd', 0)
    })
  },
  goSucc (id) {
    wx.redirectTo({
      url: '../success/success?id=' + id
    })
  },
  formSubmit (e) {   // 提交订单
    let data = e.detail.value
    if (data.contact === '') {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false,
        confirmColor: '#4971a4'
      })
      return
    }
    let re = /^(1[0-9][0-9]{9})$/
    if (!re.test(data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码',
        showCancel: false,
        confirmColor: '#4971a4'
      })
      return
    }
    if (data.village === '') {
      wx.showModal({
        title: '提示',
        content: '请输入省市区',
        showCancel: false,
        confirmColor: '#4971a4'
      })
      return
    }
    if (data.room === '') {
      wx.showModal({
        title: '提示',
        content: '请输入详细地址',
        showCancel: false,
        confirmColor: '#4971a4'    
      })
      return
    }
    if(this.data.type1 != 'buy'){
      if (this.data.time === null || this.data.date === null) {
        wx.showModal({
          title: '提示',
          content: '请选择快递员上门时间',
          showCancel: false,
          confirmColor: '#4971a4'
        })
        return
      }
    }
    // this.data.index === 0 ? data.village = '深圳' : data.village = '广州'
    if (this.data.type1 != 'buy') {
      let tmpTime = this.data.date.replace(/-/g, '/') // yyyy-MM-dd 转为 yyyy/MM/dd
      let reTime = tmpTime + ' ' + this.data.time
      let timeStamp = Date.parse(new Date(reTime))
      data.visitingTime = timeStamp
    }
    console.log('待提交data', params)
    let params = {
      cartBookItemIds: app.globalData.reBookList,
      address:{
        contact: data.contact,
        phone:data.phone,
        room: data.room,
        village: data.village,
        visitingTime: data.visitingTime
      }
    }
    app.HttpService.postOrder(this.data.type1, params).then(res => {
      if (res.statusCode === 0) {
        app.globalData.reBookList = []    // 清空购物车
        if (this.data.type1 != 'buy'){
          this.setData({
            orderId: res.data,
            isSuccess: true
          })
        }else{
          this.wxPay(res.data)
        }
        
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false,
          confirmColor: '#4971a4',
          confirmText: '确认',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({})
            }
          }
        })
      }
    })
  },
  wxPay (data){
    let self= this
    let params = {
      'timeStamp': data.smallRoutinePayArgs.timeStamp,
      'nonceStr': data.smallRoutinePayArgs.nonceStr,
      'package': 'prepay_id=' + data.smallRoutinePayArgs.prepayId,
      'signType': data.smallRoutinePayArgs.signType,
      'paySign': data.smallRoutinePayArgs.paySign,
      'success': function (res) {
        app.HttpService.confirmPay(data.orderId).then(res => {
          if (res.statusCode === 0) {
          }
        })
        self.setData({
          orderId: data.orderId,
          isSuccess: true
        })
      },
      'fail': function (res) {
        wx.showModal({
          title: '支付失败',
          content: '您可前往个人中心查看订单',
          showCancel: false,
          confirmColor: '#4971a4',
          confirmText: '确认',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../../orderdetail/recover/detail/detail?id=' + data.orderId + '&ifBuy=true' 
              })
            }
          }
        })
      },
    }
    //拉支付接口
    wx.requestPayment(params)
  },
  showTitle() {
    wx.showModal({
      title: '',
      content: '有任何疑问，您可前往“猪猪集市”公众号内留言',
      showCancel: false,
      confirmColor: '#4971a4',
      confirmText: '确认'      
    })
  },
  // 去查看订单详情
  orderDetail() {
    let _this = this
    wx.redirectTo({
      url: '../../orderdetail/recover/detail/detail?id=' + _this.data.orderId + '&ifBuy=' + (_this.data.type1 === 'buy' ?true :false)
    })
  },
  // 回首页
  goHome() {
    wx.switchTab({
      url: '../../index/index'
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
  
  }
})