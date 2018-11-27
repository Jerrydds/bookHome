//获取应用实例
const app = getApp()

Page({
  data: {
    searchValue: '',
    categoryId: 1,
    tabList: [],
    goodsList: [],
    currPage: 1,
    limit: 20,
    hasNext: true,
  },
  onLoad: function (options) {
    this.setData({
      searchValue: options.searchValue
    })
    this.searchGoods()
  },
  bindKeyInput: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  searchGoods: function () {
    if (!this.data.searchValue){
      wx.showModal({
        title: '提示',
        content: '请输入书名',
        showCancel: false,
      })
      return
    }
    this.setData({
      goodsList: []
    })
    let params = {
      page: this.data.currPage,
      size: this.data.limit
    }
    app.HttpService.searchGoods(this.data.searchValue).then(res => {
      if (res.statusCode === 0) {
        if(res.data.data.length>0){
          this.setData({
            goodsList: this.data.goodsList.concat(res.data.data),
            hasNext: res.data.hasNext
          })
        }else{
         
        }
      } else {
        wx.showModal({    // 添加失败
          title: '失败',
          content: res.msg,
          showCancel: false,
        })
      }
    })
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
    this.searchGoods()
  }
})
