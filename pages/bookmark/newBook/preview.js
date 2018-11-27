// pages/bookmark/newBook/index.js
const app = getApp()
Page({
  data: {
    userInfo:{
      nickName:'猪猪',
      avatarUrl:'../../../imgs/head.png'
    },
    bookInfo:{},
    createTime:{
      date:'',
      day:0
    },
    httpImage:[],
    time:0
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '生成中',
      mask:true,
    })
    this.getMarkInfo()
    this.drawImage(wx.getSystemInfoSync().windowWidth / 375)
    this.getInterImg()
  },
  getMarkInfo: function(){
    let bookInfo = wx.getStorageSync('bookMarkInfo')
    this.setData({
      bookInfo: bookInfo,
      createTime: {
        day: new Date(bookInfo.createTime).getDay(),
        date: app.Tools.formatDate(bookInfo.createTime, 'yyyy-MM-dd')
      }
    })
    if (app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },
  getInterImg: function () {
    const _this = this
    let bookInfo = wx.getStorageSync('bookMarkInfo')
    let arr = [_this.data.userInfo.avatarUrl,bookInfo.imageUrl, bookInfo.book.image]
    let imgs = []
    downImage(arr[0],0)
    function downImage(url, sort){
      if (sort < 3) {
        wx.downloadFile({
          url: url,
          header: {
            "Content-Type": "multipart/form-data",
            "token": wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.statusCode === 200) {
              imgs.push(res.tempFilePath)
              sort++;
              downImage(arr[sort], sort)
            }
          }
        })
      } else {
        wx.hideLoading()
        _this.drawImage(wx.getSystemInfoSync().windowWidth / 375, imgs[0], imgs[1], imgs[2])
      }
    }
  },
  drawImage: function (ratio, img1, img2, img3){
    const ctx = wx.createCanvasContext('myCanvas')
    // 设置画布背景
    ctx.setFillStyle('#3A3F44')
    if (this.data.bookInfo.remark != '') {
      ctx.fillRect(0, 0, 375 * ratio, 800 * ratio)
    }else{
      ctx.fillRect(0, 0, 375 * ratio, 650 * ratio)
    }
    this.setTopImage(ctx, ratio, img1)
    this.setMarkImage(ctx, ratio,img2)
    this.setBookDetail(ctx, ratio,img3)
    if (this.data.bookInfo.remark!=''){
      this.setsetBookDesc(ctx, ratio)
      this.setBootomImage(ctx, ratio, true)
    }else{
      this.setBootomImage(ctx, ratio,false)
    }
    this.setArc(ctx,ratio)
    ctx.draw()
  },
  setTopImage: function (ctx, ratio, img1){
    const _this = this
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(25 * ratio, 15 * ratio, 325 * ratio, 75 * ratio)
    if (img1){
      ctx.drawImage(img1, 40 * ratio, 26.5 * ratio, 50 * ratio, 50 * ratio)
    }
    ctx.setFontSize(15 * ratio)
    ctx.setFillStyle('#333333')
    ctx.fillText(_this.data.userInfo.nickName, 105 * ratio, 45 * ratio)
    ctx.setFontSize(12 * ratio)
    ctx.setFillStyle('#666666')
    var str = '这是本月第' + _this.data.bookInfo.readingMonthCount + '次阅读'
    ctx.fillText(str, 105 * ratio, 72 * ratio)
    ctx.setFontSize(10 * ratio)
    ctx.setFillStyle('#999999')
    ctx.fillText(_this.data.createTime.date, 275 * ratio, 72 * ratio)
    var imgUrl = ''
    switch (_this.data.createTime.day) {
    case 1:
        imgUrl = '../../../imgs/bookmark/mon.png'
      break;
    case 2:
        imgUrl = '../../../imgs/bookmark/ture.png'
      break;
    case 3:
        imgUrl = '../../../imgs/bookmark/wed.png'
      break;
    case 4:
        imgUrl = '../../../imgs/bookmark/thur.png'
      break;
    case 5:
        imgUrl = '../../../imgs/bookmark/fri.png'
      break;
    case 6:
        imgUrl = '../../../imgs/bookmark/sat.png'
      break;
    case 0:
        imgUrl = '../../../imgs/bookmark/sun.png'
      break;
    default:
      imgUrl = '../../../imgs/bookmark/sun.png'
    }    
    ctx.drawImage(imgUrl, 308 * ratio, 13 * ratio, 27 * ratio, 38.5 * ratio)
  },
  setMarkImage: function (ctx, ratio,img2){
    const _this = this
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(25 * ratio, 89 * ratio, 325 * ratio, 325 * ratio)
    ctx.setStrokeStyle('#E7EBF1')
    ctx.setLineWidth(1 * ratio)
    ctx.moveTo(40 * ratio, 90 * ratio)
    ctx.lineTo(330 * ratio, 90 * ratio)
    ctx.stroke()
    if (img2){
      ctx.drawImage(img2, 40 * ratio, 105 * ratio, 295 * ratio, 295 * ratio)
    }
  },
  setBookDetail: function (ctx, ratio,img3){
    const _this = this
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(25 * ratio, 413 * ratio, 325 * ratio, 140 * ratio)
    ctx.setStrokeStyle('#E7EBF1')
    ctx.setLineWidth(1 * ratio)
    ctx.moveTo(40 * ratio, 413 * ratio)
    ctx.lineTo(330 * ratio, 413 * ratio)
    ctx.stroke()
    if(img3){
      ctx.drawImage(img3, 45 * ratio, 428 * ratio, 68 * ratio, 100 * ratio)
    }
    ctx.setFontSize(16 * ratio)
    ctx.setFillStyle('#333333')
    // 文字長度超過12 添加小數點...
    var str = _this.data.bookInfo.book.name
    if (_this.data.bookInfo.book.name.length>12){
      str = _this.data.bookInfo.book.name.substring(0,12)+'...'
    }
    ctx.fillText(str, 135 * ratio, 443 * ratio)
    ctx.setFontSize(13 * ratio)
    ctx.setFillStyle('#999999')
    // 文字長度超過13 添加小數點...
    var str1 = _this.data.bookInfo.book.author
    if (_this.data.bookInfo.book.author.length > 13) {
      str1 = _this.data.bookInfo.book.author.substring(0, 13) + '...'
    }
    ctx.fillText(str1, 135 * ratio, 473 * ratio)
    ctx.setFontSize(12 * ratio)
    ctx.setFillStyle('#4971A4')
    ctx.fillText('豆瓣评分:' + _this.data.bookInfo.book.average, 135 * ratio, 523 * ratio)
  },
  setsetBookDesc: function (ctx, ratio){
    const _this = this
    var str1 = _this.data.bookInfo.remark
    var lineWidth = 0;
    var canvasWidth = 340 * ratio;//计算canvas的宽度
    var time = 0;
    for (let i = 0; i < str1.length; i++) {
      lineWidth += ctx.measureText(str1[i]).width+2.1;//加2.1是为了右边距
      console.log(ctx.measureText(str1[i]).width == 0)
      if (ctx.measureText(str1[i]).width == 0||lineWidth > canvasWidth) {
        time++;
        lineWidth = 0;
      }
      if (i == str1.length - 1) {//绘制剩余部分
        time++;
      }
    }
    ctx.setFillStyle('#ffffff')
    time = time>1?(time === 5?4:time):time*2
    ctx.fillRect(25 * ratio, 552 * ratio, 325 * ratio, time * 30 * ratio)
    _this.setData({
      time:time
    })
    ctx.setStrokeStyle('#E7EBF1')
    ctx.setLineWidth(1 * ratio)
    ctx.moveTo(40 * ratio, 552 * ratio)
    ctx.lineTo(325 * ratio, 552 * ratio)
    ctx.stroke()
    ctx.setFontSize(11 * ratio)
    ctx.setFillStyle('#666666')
    var str = _this.data.bookInfo.remark
    // str = str.replace(new RegExp(/(\n)/g), '')
    var lineWidth = 0;
    var canvasWidth = 340 * ratio;//计算canvas的宽度
    var initHeight = 580 * ratio;//绘制字体距离canvas顶部初始的高度
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width + 2.1;//加2.1是为了右边距
      if (ctx.measureText(str1[i]).width == 0 || lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), 45 * ratio, initHeight);//绘制截取部分
        initHeight += 25 * ratio;//20为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == str.length - 1) {//绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), 45 * ratio, initHeight);
      }
    }
  },
  setBootomImage: function (ctx, ratio, hadDesc){
    var y =''
    if (!hadDesc){
      y = 551*ratio
    }else{
      y = (551+this.data.time*30) * ratio
    }
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(25 * ratio, y, 325 * ratio, 75 * ratio)
    ctx.setStrokeStyle('#E7EBF1')
    ctx.setLineWidth(1 * ratio)
    ctx.moveTo(105 * ratio, y)
    ctx.lineTo(330 * ratio, y)
    ctx.stroke()
    ctx.drawImage('../../../imgs/bookmark/erweima.png', 45 * ratio, y + 5 * ratio, 44 * ratio, 44 * ratio)
    ctx.setFontSize(12 * ratio)
    ctx.setFillStyle('#999999')
    ctx.fillText('进入猪猪书屋', 105 * ratio, y + 25 * ratio)
    ctx.fillText('记录你的读书时刻', 105 * ratio, y + 48 * ratio)
  },
  setArc:function(ctx,ratio){
    // 半圆
    ctx.beginPath();
    ctx.arc(24 * ratio, 413 * ratio, 7.5 * ratio, -0.5 * Math.PI, 0.5 * Math.PI)
    ctx.closePath();
    ctx.setFillStyle('#3A3F44')
    ctx.fill()
    ctx.beginPath();
    ctx.arc(351 * ratio, 413 * ratio, 7.5 * ratio, 0.5 * Math.PI, -0.5 * Math.PI)
    ctx.closePath();
    ctx.setFillStyle('#3A3F44')
    ctx.fill()
    ctx.closePath();
  },
  saveImage:function (){
    let self = this
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          self.uploadImg(tempFilePath);
        },
        fail: function (res) {
          wx.showToast({
            title: res.mag,
          })
        }
      });
    }, 1000);
  },
  // 微信图片上传api
  uploadImg:function (tempFilePath) {
    let _this = this
    const uploadTask = wx.uploadFile({ //上传文件的接口;
      url: app.Config.basePath + '/sh/ja/v1/book/wx/small/file/upload', 
      filePath: tempFilePath,
      name: 'uploadedFile',
      header: {
        "Content-Type": "multipart/form-data",
        "token": wx.getStorageSync('token')
      },
      success: function (res) {
        let img = JSON.parse(res.data)
        if (img.statusCode === 0) {
          _this.saveMark(img.data)
        }
      },
      fail: function (res) {
       wx.showToast({
         title: res.msg,
       })
      }
    })
    uploadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '上传中',
      })
    })
  },
  // 保存书签
  saveMark:function(url){
    const _this = this
    app.HttpService.saveMark(url, _this.data.bookInfo.id).then(res => {
      if (res.statusCode === 0) {
        wx.removeStorageSync('bookMarkInfo')
        wx.removeStorageSync('imgCut')
        wx.removeStorageSync('bookInfo')
          wx.redirectTo({
            url: 'markSuccess?id=' + _this.data.bookInfo.id + '&imgUrl=' + url,
          })    
      }else{
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false
        })
      }
    })
  }
})