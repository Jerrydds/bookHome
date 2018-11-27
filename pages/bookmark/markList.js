const app = getApp()
Page({
  data: {
    MarkList:[]
  },
  onLoad: function (options) {
    this.getBookData(true)
  },
  onShow:function(){
    var del = wx.getStorageSync('del')
    if(del){
      this.data.MarkList[del.idx1].markList.splice(del.idx2, 1)
      if (this.data.MarkList[del.idx1].markList.length === 0){
        this.data.MarkList.splice(del.idx1,1)
      }
      this.setData({
        MarkList: this.data.MarkList
      })
      wx.removeStorageSync('del')
    }
  },
  getBookData: function (ifFirst){
    const _this = this
    app.HttpService.getBookData().then(res => {
      if (res.statusCode === 0) {
        let arr = res.data
        for(var i = 0;i<arr.length;i++){
          arr[i].markList = []
          arr[i].showMarkList = false
        }
        _this.setData({
          MarkList: arr,
        })
        if (ifFirst){
          _this.showMark(null)
        }
      } else {
        wx.showToast({
          title: res.msg
        })
      }
    })
  },
  showMark:function(e,isbn){
    const _this = this
    let idx = ''
    if(e){
      idx = e.currentTarget.dataset.idx
    }else{
      idx = 0
    }
    if (_this.data.MarkList[idx].markList.length>0){
      _this.data.MarkList[idx].showMarkList = !_this.data.MarkList[idx].showMarkList
      _this.setData({
        MarkList: _this.data.MarkList
      })
    }else{
      let param = {
        isbn: _this.data.MarkList[idx].isbn,
        page:1,
        size:100
      }
      app.HttpService.getMarkData(param).then(res => {
        if (res.statusCode === 0) {
          _this.data.MarkList[idx].showMarkList = !_this.data.MarkList[idx].showMarkList
          _this.data.MarkList[idx].markList = res.data.data
          _this.setData({
            MarkList: _this.data.MarkList
          })
        } else {
          wx.showToast({
            title: res.msg
          })
        }
      })
    }
  }
})