// pages/orderlist/recover/recover.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realPayAmount: null,  // 实际付的钱
    isLoading: false,   // 是否正在加载数据
    page: 1,
    size: 4,
    hasNext: null,    // 是否有下一页
    orderList: [],
    orderType: '' // 订单类型 //0-回收订单 1-购买订单 ifBuy（从下单页面传过来的字段）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempOrderId = null;
    if (options.ifBuy || options.orderType === '0'){
      tempOrderId='0';
    }else{
      tempOrderId = '1';
    }
    this.setData({   
      orderType: tempOrderId //订单类型 //0-回收订单 1-购买订单 
    })
    console.log(typeof (options.orderType)+options.orderType)
    //根据订单类型显示导航栏 
    if (this.data.orderType === '0'){
      wx.setNavigationBarTitle({
        title: '回收订单'
      })
    } else if(this.data.orderType === '1' || ifBuy){
      wx.setNavigationBarTitle({
        title: '购买订单'
      })
    }
    this.getOrderList()
  },

  // 获取卖书订单列表
  getOrderList () {
    this.setData({    // 防止多次刷新
      isLoading: true     
    })
    let _this = this    
    let data = {
      page: this.data.page,
      size: this.data.size
    }
    console.log("订单种类" + this.data.orderType);
    //订单状态
    // 购买订单的状态 0 待付款  1待发货 2 已发货 3已取消  10 自动取消 11待付款取消  12待发货取消
    //回收订单的状态 0 待发货 1 "待发货-已取消" 2 "待收货" 5 "已签收" 3 "已验收，待打款" 4 "已完成"
    app.HttpService.getReOrderList(data, this.data.orderType).then(res => {
      let realPayAmount = null
      if (res.statusCode === 0) {
        console.log(res.data.data);
        res.data.data.forEach(item => {
          item.createTime = this.formatDate(item.createTime, 'yyyy-MM-dd hh:mm')
          // if (item.status === 3 || item.status === 4) {   //　订单完成，显示真正付的钱
          //   item.recycleAmount = item.payAmount
          // }
          // item.bookAmount=1.0009;
          //金额去两位小数
          // if (item.totalAmount){
          //   item.totalAmount = item.totalAmount.toFixed(2);
          // }else{
          //   item.totalAmount=""
          // }
          //已取消置灰色 这个暂时不做
        })
        // this.fiterStatus(res.data.data)
     
        this.setData({
          page: _this.data.page + 1,    //　确定页数
          orderList: _this.data.orderList.concat(res.data.data),
          isLoading: false,
          hasNext: res.data.hasNext
        })
        console.log(this.data.orderList);
      }
    })
  },
  
  // 状态过滤已收货和已签收为已完成
  // fiterStatus (arr) {
  //   arr.forEach(item => {
  //     if (item.status === 3) {
  //       item.statusDesc = '已完成'
  //     }
  //   })
  // },

  // 上拉刷新
  lower () {
    console.log("上拉刷新的操作")
    if (this.data.isLoading) return
    if (!this.data.hasNext) return
    this.getOrderList()
  },

  // 查看详情
  detail (e) {
    let id = e.currentTarget.dataset.id
    let orderType = this.data.orderType
    console.log("查看详情的id" + id + "订单类型" + this.data.orderType);
    wx.navigateTo({
      url: '../../orderdetail/recover/detail/detail?id=' + id + '&orderType=' + orderType
    })
  },

  // 日期格式化
  formatDate (date, fmt) {
    return app.Tools.formatDate(date, fmt)
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