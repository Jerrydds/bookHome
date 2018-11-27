const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopLength: 0,
    config: null
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopList()
  },

  formSubmit (e) {    // 点击添加的时候，电脑测试用，到时候删掉
    let isbn = e.detail.value.isbnInput
    this.addReCart(isbn)
  },
  // 通过输入框点击完成按钮输入
  addBook (e) {
    let isbn = e.detail.value
    if (!isbn) return
    this.addReCart(isbn)
  },
  // 输入监听，到13位就提交
  isbnWatch (e) {
    if (e.detail.cursor === 13) {
      this.addReCart(e.detail.value)
      return ''
    }
  },

  //  书本添加到回收清单里
  addReCart (isbn) {
    app.HttpService.addReCart(isbn).then(res => {
      if (res.statusCode === 0) {
        wx.showToast({
          title: '添加成功'
        })
        this.getShopList()    //　重新计算清单长度
      } else {
        wx.showModal({    // 添加失败
          title: '失败',
          content: res.msg,
          showCancel: false,
        })
      }
    })
  },

  // 获取回收购物车清单列表与=包括运费最小值
  getShopList() {
    app.HttpService.getShopList('recycle').then(res => {
      let data = res.data
      this.setData({    // 设定购物车多少
        shopLength: data.cartBookItems.length,
        config: data.config
      })
    })
  },
  // 一键扫码卖书
  scan() {
    wx.scanCode({
      success: (res) => {
        let code = res.result
        this.addReCart(code)
      }
    })
  },
  // 查看清单
  goList() {
    wx.switchTab({
      url: '../list/list',
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