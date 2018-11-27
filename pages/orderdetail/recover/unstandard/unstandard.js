// pages/orderdetail/recover/unstandard/unstandard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errbook: [],
    withholdMoney: 0,
    amount:'' //回收款
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      withholdMoney: JSON.parse(options.withholdMoney), 
      errbook: JSON.parse(options.errbook),
      amount: JSON.parse(options.amount)
    })
    // console.log(this.data.withholdMoney)
    // console.log(this.data.options.errbook)
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