const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookmark: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onShow: function () {
    this.getWholeMark()
  },
  // 获取全部书签
  getWholeMark() {
    let param = {
      page: 1,
      size: 10
    }
    app.HttpService.getMarkData(param).then(res => {
      if (res.statusCode === 0) {
        this.setData({
          bookmark: res.data.data
        })
      } else {
        wx.showToast({
          title: res.msg
        })
      }
    })
  },
  // 进入书签详情
  markDetail() {
    console.log(1)
  },
  markbook() {
    wx.navigateTo({
      url: '../bookmark/newBook/index',
    })
  },
  wholeMark() {
    wx.navigateTo({
      url: 'markList',
    })
  },
})