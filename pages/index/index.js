//获取应用实例
const app = getApp()

Page({
  data:{
   searchValue: '',
   categoryId: 1,
   tabList: [],
   goodsList: [],
   currPage:1,
   limit:20,
   hasNext:true,
  },
  onLoad:function () {
    this.getClassy()
  },
  onshow:function () {
    this.setData({
      searchValue: e.detail.value
    })
  },
  goSearch:function () {
    if (!this.data.searchValue) {
      wx.showModal({
        title: '提示',
        content: '请输入书名',
        showCancel: false,
      })
      return
    }
    wx.navigateTo({
      url: '/pages/search/index?searchValue=' + this.data.searchValue
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  // 获取类目和列表数据
  getClassy: function() {
    app.HttpService.getClassy().then(res => {
      if (res.statusCode === 0) {
        this.setData({
          tabList:res.data,
          categoryId: res.data[0].id
        })
        this.getGoods(this.data.categoryId) 
      } else {
        wx.showToast({
          title: res.msg
        })
      }
    })
  },
  getGoods: function(e) {
    let id = this.data.categoryId
    if (e.currentTarget && e.currentTarget.dataset.id){
      id = e.currentTarget.dataset.id
    } else {
      id = e
    }
    if (id != this.data.categoryId){
      this.setData({
        goodsList: [],
        categoryId: id,
        currPage: 1
      })
    }
    let params = {
      page : this.data.currPage,
      size : this.data.limit
    }
    app.HttpService.getGoods(this.data.categoryId,params).then(res => {
      if (res.statusCode === 0) {
        this.setData({
          goodsList: this.data.goodsList.concat(res.data.data),
          hasNext: res.data.hasNext
        })
        console.log(this.data.hasNext)
        
      } else {
        wx.showModal({    // 添加失败
          title: '失败',
          content: res.msg,
          showCancel: false,
        })
      }
    })
  },
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '猪猪书屋',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
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
    if (!this.data.hasNext) {
      wx.showToast({
        title: '没有更多数据了哦',
      })
      return
    }
    let page = this.data.currPage;
    this.setData({
      hasNext: false,
      currPage: page + 1
    })
    this.getGoods(this.data.categoryId)
  },
  // 一键扫码卖书
  sellbook () {
    // if (!app.globalData.ownUserInfo.nickname) {   // 判断是否登录
    //   app.loginIf()
    // }
    wx.navigateTo({
      url: '../scanbook/scanbook'
    })
  }
})
