const app = getApp()
import WeCropper from '../../../assets/plugins/we-cropper.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 100;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ok: false,//是否选择图片
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: options.image
    })
    const { cropperOpt } = this.data
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        // console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        // console.log(`before picture loaded, i can do something`)
        // console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        // console.log(`picture loaded`)
        // console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        // console.log(`before canvas draw,i can do something`)
        // console.log(`current canvas context:`, ctx)
      })
      .updateCanvas();
  },
  onShow:function(){
    this.initImg()
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)

  },
  initImg(){
    this.wecropper.pushOrign(this.data.image);
  },
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      // sourceType: [type],
      success: function (res) {
        that.setData({
          cutImage: 'show',
          addtribeConShow: 'hide',
          ok: true
        });
        that.wecropper.pushOrign(res.tempFilePaths[0]);
      }
    })
  },
  getCropperImage() {
    var that = this;
    that.wecropper.getCropperImage((src) => {
      if (src) {
        //此处添加用户确定裁剪后执行的操作 src是截取到的图片路径
        const uploadTask = wx.uploadFile({ //上传文件的接口;
          url: app.Config.basePath + '/sh/ja/v1/book/wx/small/file/upload', //仅为示例，非真实的接口地址
          filePath: src,
          name: 'uploadedFile',
          header: {
            "Content-Type": "multipart/form-data",
            "token": wx.getStorageSync('token')
          },
          success: function (res) {
            let img = JSON.parse(res.data)
            wx.setStorageSync('imgCut', img.data)
            wx.navigateBack()
          }
        })
        uploadTask.onProgressUpdate((res) => {
          wx.showLoading({
            title: '上传中',
          })
        })

      }

    })

  },
})