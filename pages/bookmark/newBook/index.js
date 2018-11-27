const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteMaxLen: 140, //备注最多字数  
    bookDetails: [],
    image: "",
    remark: "",
    color: false,
    success: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getStorage()
    this.isGray()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  //字数限制  
  remark: function (e) {
    var value = e.detail.value, len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;

    this.setData({
      currentNoteLen: len,//当前字数  
      remark: e.detail.value
    });
  },
  // 置灰按钮
  isGray() {
    if (wx.getStorageSync('imgCut').length != 0 && wx.getStorageSync('bookInfo').length != 0) {
      this.setData({
        color: true
      })
    } else {
      this.setData({
        color: false
      })
    }
  },
  // 跳转到addbook
  ScanTo() {
    wx.navigateTo({
      url: '../../bookmark/newBook/addbook',
    })
  },
  // 微信图片上传api
  uploadImg() {

    // var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      // sourceType: [type],
      success: function (res) {
        wx.navigateTo({
          url: '../../bookmark/newBook/imgCut?image=' + res.tempFilePaths[0],
        })
        // that.setData({
        //   cutImage: 'show',
        //   addtribeConShow: 'hide',
        //   ok: true
        // });
        // that.wecropper.pushOrign(res.tempFilePaths[0]);
      }
    })
  },
  // 提交mark数据
  submitMark() {
    if (this.data.image <= 0 || this.data.bookDetails <= 0) {
      return
    }
    let params = {
      imageUrl: this.data.image,
      isbn: this.data.bookDetails.isbn,
      remark: this.data.remark
    }
    app.HttpService.pushMark(params).then(res => {
      if (res.statusCode === 0) {
        wx.setStorageSync("bookMarkInfo", res.data)
        wx.navigateTo({
          url: 'preview',
        })
      }
    })
  },
  // 获取本地信息
  getStorage() {
    if (wx.getStorageSync('imgCut')) {
      this.setData({
        image: wx.getStorageSync('imgCut'),
        success: false
      })
    } else {
      this.setData({
        image: "",
        success: true
      })
    }
    if (wx.getStorageSync('bookInfo')) {
      this.setData({
        bookDetails: JSON.parse(wx.getStorageSync('bookInfo'))
      })
    } else {
      this.setData({
        bookDetails: [],
        remark: "",
        currentNoteLen: 0
      })
    }
  },
})