const app = getApp()

Page({
  data: {
    imgUrl:'',
    markId:null,
    idx1:null,
    idx2:null
  },
  onLoad: function (options) {
    if (options.id){
      this.setData({
        imgUrl:options.imgUrl,
        markId:options.id,
      })
    }else{
      this.setData({
        imgUrl: options.imgUrl
      })
    }
    if (options.idx1){
      this.setData({
        idx1: options.idx1,//哪本书
        idx2: options.idx2//哪个书签
      })
    }
  },

  // 删除书签
  deleteMark: function () {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认删除该书签？',
      confirmColor: '#4971a4',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          app.HttpService.deleteMark(_this.data.markId).then(res => {
            if (res.statusCode === 0) {
              if (_this.data.idx1) {
                let delData = {
                  idx1: _this.data.idx1,
                  idx2: _this.data.idx2
                }
                wx.setStorageSync('del', delData)
              }
              wx.navigateBack({})
            }else{
              wx.showToast({
                title: res.msg,
              })
            }
          })
          
        }
      }
    })
  },
  // 保存图片到本地
  saveMark: function () {
    let _this = this
    console.log(11, _this.data.imgUrl)
    wx.downloadFile({
      url: _this.data.imgUrl, //仅为示例，并非真实的资源
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功'
            })
          }
        })
      },
      fail:function(res){
        wx.showToast({
          title: res.msg
        })
      }
    })
  }
})