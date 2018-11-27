const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: null,
    booksList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wholeBooks()
  },

  formSubmit(e) {    // 点击添加的时候，电脑测试用，到时候删掉
    let isbn = e.detail.value.isbnInput
  },
  // 通过输入框点击完成按钮输入
  addBook(e) {
    let isbn = e.detail.value
    if (!isbn) return
    this.ToNewBook(res.data)
  },
  // 输入监听，到13位就提交
  isbnWatch(e) {
    if (e.detail.cursor === 13) {
      this.checkBookIs(e.detail.value)
      return ''
    }
  },

  // 一键扫码卖书
  scanDetail() {
    wx.scanCode({
      success: (res) => {
        let code = res.result
        this.checkBookIs(code)
      }
    })
  },
  // 获取全部有书签的书getBookData
  wholeBooks() {
    app.HttpService.getBookData().then(res => {
      if (res.statusCode === 0) {
        this.setData({
          booksList: res.data
        })
      }
    })
  },
  // 进入书签列表
  markBookIsbn(e) {
    this.checkBookIs(e.currentTarget.dataset.isbn)
  },
  checkBookIs(isbn) {
    app.HttpService.getBookDetail(isbn).then(res => {
      if (res.statusCode === 0) {
        wx.showToast({
          title: '添加成功'
        })
        this.ToNewBook(res.data)
      } else {
        wx.showModal({    // 添加失败
          title: '失败',
          content: res.msg,
          showCancel: false,
        })
      }
    })
  },
  ToNewBook(data) {
    var data = JSON.stringify(data)
    wx.setStorageSync('bookInfo', data)
    wx.navigateBack({
      delta:1
    })
  },
})