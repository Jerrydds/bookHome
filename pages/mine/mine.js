// pages/mine/mine.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    balance: 0,
    orderType: null, //0-回收订单 1-购买订单
    returnData:{} //收入和余额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBalanceAndIncome()    
  },
  //0-回收订单 1-购买订单
  // 查看我卖出的清单
  soldOut () {  
    wx.navigateTo({
      url: '../orderlist/recover/recover?orderType='+'0',
    })
  },
  //买到的清单
  buyIn() {
    wx.navigateTo({
      url: '../orderlist/recover/recover?orderType='+'1',
    })
  },
  // 获取卖书收入与余额
  getBalanceAndIncome() {
    app.HttpService.getBalanceAndIncome().then(res => {
      if (res.statusCode === 0) {
        this.setData({
          returnData: res.data
        })
        // this.setData({
        //   balance: res.data.balance
        // })
      }
    })
  },
  // 去提现
  withdraw () {
    // this.data.returnData.balance =1
    if (this.data.returnData.balance === "0.00") {
      wx.showModal({
        title: '提示',
        content: '当前余额为0，不可提现',
        showCancel: 0
      })
      return
    }else{
      wx.showModal({
        title: '提现确认',
        content: '是否确认将余额全部提现到微信零钱？',
        cancelText:'取消',
        confirmText:'确认提现',
        success: function (res) {
          if (res.confirm) {
              console.log('用户点击确定')
              app.HttpService.newWithDraw().then(res => {
                if (res.statusCode === 0) {
                  wx.navigateTo({
                    url: '../withdrawalResult/result'
                  })
                } else {
                  wx.showToast({
                    title: res.msg
                  })
                }
              })
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    // wx.navigateTo({
    //   url: '../withdraw/withdraw'
    // })
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