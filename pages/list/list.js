//list.js
//获取应用实例
const app = getApp()
Page({
  data: {
    realExpressFee: 0, // 实际扣除的运费计算
    config: null,   // 基础信息妹纸
    minCount: null,
    expressCharges: null,
    total: 0,
    isCanPay: false,    // 是否可以结算
    checkedList: [],
    items: [],    // 回收清单列表
    tabList: [
      {
        id: 1,
        type1: 'buy',
        name: '我买到的'
      },
      {
        id: 2,
        type1: 'recycle',
        name: '我卖出的'
      }
    ],
    type1: 'recycle'
  },
  onLoad: function (options) { // tab页只会load一次，所以列表刷新放在show里，每次显示都刷新
    if(options.ifBuy){
      this.setData({
        type1: 'buy' //1为买到的  2为卖出的
      })
    }
  },
  onShow () {
    this.getGoods()
  },
  getGoods (e) {
    if(e){
      this.setData({
        type1: e.currentTarget.dataset.typ
      })
    }
    app.HttpService.getShopList(this.data.type1).then(res => {
      this.dealData(res.data)
    })
  },
  dealData (data) {
    data.cartBookItems.forEach(item => {    // 设置默认全选
      if (!item.invalidStr){
        item.check = true
      }
      item.totalAmount = parseFloat(item.totalAmount).toFixed(2)
    })
    this.setData({    // 设定最小值，运费,清单列表等
      config: data.bookConfig,
      realExpressFee: data.bookConfig.expressFee,
      items: data.cartBookItems
    })
    this.fillCheckedList(data.cartBookItems)  // 默认全选
    this.canPay()
  },
  // 默认填满checkedList和价格因为默认全选
  fillCheckedList (arr) {
    let bookCount = this.data.config.noExpressCount           // 包邮数量
    let noExpressMoney = this.data.config.noExpressMoney      // 包邮金额
    let expressFee = this.data.config.expressFee              // 累加运费
    let expressFeeCount = this.data.config.expressFeeCount    // 累加数量
    let tmp = [],   // 选中的书本数量
        total = 0   //　选中书本总金额
    arr.forEach(item => {
      if (item.id) {
        if (!item.invalidStr){
          tmp.push(item.id)
          total = app.Tools.add(total, parseFloat(item.totalAmount).toFixed(2))  // 浮点数计算
        }
      }
    })
    // 如果不满足包邮金额或者数量
    if ((tmp.length > 0 && tmp.length < bookCount) && total < noExpressMoney) {
      let realExpressFee = Math.ceil(tmp.length / expressFeeCount) * expressFee
      // if (this.data.type1 === 'buy') {
      //   total = app.Tools.add(total, realExpressFee)
      // } else {
      //   total = app.Tools.sub(total, realExpressFee)
      // }
      this.setData({
        realExpressFee: realExpressFee
      })
    }
    this.setData({
      checkedList: tmp,
      total: total
    })
    this.canPay()
  },
  checkboxChange: function (e) {
    let bookCount = this.data.config.noExpressCount           // 包邮数量
    let noExpressMoney = this.data.config.noExpressMoney      // 包邮金额
    let expressFee = this.data.config.expressFee              // 累加运费
    let expressFeeCount = this.data.config.expressFeeCount    // 累加数量
    this.setData({    // 设置以选中的数组
      checkedList: e.detail.value
    })
    let total = 0,      // 总价
        shopList = []   // 选中商品列表
    e.detail.value.forEach(item => {  // 双循环计算总价
      this.data.items.forEach(i => {
        if (i.id == item) {
          total = app.Tools.add(total, parseFloat(i.totalAmount).toFixed(2))
          shopList.push(i.id)
        }
      })
    })
    // 如果不满足包邮金额或者数量
    if ((shopList.length > 0 && shopList.length < bookCount) && total < noExpressMoney) {
      let realExpressFee = Math.ceil(shopList.length / expressFeeCount) * expressFee
      // if (this.data.type1 === 'buy'){
      //   total = app.Tools.add(total, realExpressFee)
      // }else{
      //   total = app.Tools.sub(total, realExpressFee)
      // }
      this.setData({
        realExpressFee: realExpressFee
      })
    }
    this.setData({    // 设置总价
      total: total
    })
    this.canPay()
  },
  delItem (e) {   // 删除某个回收清单
    let id = e.currentTarget.dataset.id
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定删除',
      success (res) {
        if (res.confirm) {
          app.HttpService.delReBook(_this.data.type1,id).then(res => {
            if (res.statusCode === 0) {
              wx.showToast({
                'title':'删除成功！'
              })
              _this.getGoods()
              _this.canPay()
            }
          })
        }
      }
    })
  },
  canPay() {   // 判断是否可以支付
    if (this.data.type1 === 'buy') {
      if (this.data.checkedList.length >0){
        this.setData({
          isCanPay: true
        })
      }else{
        this.setData({
          isCanPay: false
        })
      }
    }else{
      if (this.data.checkedList.length >= this.data.config.buildOrderCount || this.data.total >= this.data.config.buildOrderMoney) {
        this.setData({
          isCanPay: true
        })
      } else {
        this.setData({
          isCanPay: false
        })
      }
    }
  },
  pay() {    // 去结算
    if (!this.data.isCanPay) {
      return
    }
    app.globalData.reBookList = this.data.checkedList  // 全局保存选中书籍的ids    
    if (this.data.type1 === 'buy') {
      wx.navigateTo({
        url: '../placeorder/recover/recover?ifBuy=true'
      })
    } else {
      wx.navigateTo({
        url: '../step/step1/step'
      })
    }
    
  },
}) 
