// pages/bookdetail/bookDetail.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   bookId:null, //书籍id
   bookInfo:{}, //书籍详情
   isContinue:true//是否可以加入购物车
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({    //　保存id
      bookId: options.bookId
    })
    console.log(this.data);
    this.getBookDetail(this.data.bookId);
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
  // 获取书籍详情
  getBookDetail: function () {
    app.HttpService.getBookDetail(this.data.bookId).then(res => {
      if (res.statusCode === 0) {
        // res.data.image="https://img1.doubanio.com/mpic/s27783358.jpg"
        // res.data.image=""
        // res.data.contentDesc = JSON.stringify(res.data.contentDesc)
        console.log(res.data.contentDesc)
        // res.data.contentDesc = res.data.contentDesc.replace(/[\n\r]/g, '<br>')
        this.setData({
          bookInfo: res.data
        })
        if(res.data.stock===0){
          this.setData({
            isContinue: false
          })
        }else{
          this.setData({
            isContinue: true
          })
        }
        console.log(res);
        // this.getGoods(this.data.categoryId)
      } else {
        wx.showToast({
          title: res.msg
        })
      }
    })
  },
  //添加到买书清单
  toBuyBook: function () {
    app.HttpService.toBuyBook(this.data.bookId).then(res => {
      // res.statusCode = 2
      if (res.statusCode === 0) {
        console.log(res);
        wx.showToast({
          title: "添加成功"
        })
      } else if (res.statusCode === 2){
        this.setData({
          isContinue: false
        })
        wx.showToast({
          title: "已售罄"
        })
      } else {
        wx.showToast({
          title: res.msg
        })
      }
    })
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