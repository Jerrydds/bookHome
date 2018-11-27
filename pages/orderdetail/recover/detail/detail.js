const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer:null,
    stepBar: {    // 条的状态
      step1: '已发货',
      active1: 'active',
      step2: '已发货',
      active2: 'active',
      step3: '已发货',
      active3: 'active',
      width: null
    },
    buystepBar: {    //购买书籍的物流详情
      step1: '已发货',
      active1: 'active',
      // step2: '已发货',
      // active2: 'active',
      step3: '已发货',
      active3: 'active',
      width: null
    },
    realPayAmount: null,  // 实际付的钱
    isDone: null,         // 该订单是否已完成
    errBook: [],          // 不合格的书
    orderStatus: null,    // 当前订单状态（回收订单的订单状态）
    orderStatusBuy:null,  //当前订单状态（购书订单状态）
    isComplete: null,     // 是否是完整订单
    orderDetail: null,
    orderId: null,
    step: 1,
    cancelText1: null,  // 上方第一行字
    cancelText2: null,  // 上方第二行字
    desc1: null,        // 下方第一行字
    desc2: null,         // 下方第二行字
    orderType: '', //订单类型 //0-回收订单 1-购买订单
    address:{}, // 地址
    withholdMoney:'',//扣除运费（回收订单里面）
    amount:'',//收款（回收订单里面）
    time_val:'00分00秒',
    systime:'',
    ms:''// 剩余的时间
  },
  questionDetail() {    
    // console.log(this.data.errBook);
    let errbook = JSON.stringify(this.data.errBook)
    let withholdMoney = JSON.stringify(this.data.orderDetail.withholdMoney)
    let amount = JSON.stringify(this.data.orderDetail.totalAmount);
    // withholdMoney=1.00;
    wx.navigateTo({
      url: '../unstandard/unstandard?errbook=' + errbook + '&withholdMoney=' + withholdMoney + '&amount=' + amount
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempOrderId = null;
    if (options.ifBuy === undefined){
      if ( options.orderType === '0') {
        tempOrderId = '0';
      } else if (options.orderType === '1') {
        tempOrderId = '1';
      }
    } else if (options.ifBuy === true || options.ifBuy === 'true'){
    
        tempOrderId = '1';
    } else if (options.ifBuy === false || options.ifBuy === 'false'){
        tempOrderId = '0';
    }
    // console.log(typeof (options.ifBuy))
    // if (!options.ifBuy || options.orderType === '0') {
    //   tempOrderId = '0';
    // } else if (options.ifBuy || options.orderType === '1'){
    //   tempOrderId = '1';
    // }
    // console.log(tempOrderId);
    //获取传过来的订单id id=orderId
    this.setData({    
      orderId: options.id,
      orderType: tempOrderId //订单类型 //0-回收订单 1-购买订单 
    })
    //根据订单类型显示导航栏 
    if (this.data.orderType === '0') {
      wx.setNavigationBarTitle({
        title: '回收订单详情'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '购买订单详情'
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getReDetail(this.data.orderId, this.data.orderType)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 订单详情页面
  getReDetail(id, orderType) {
    clearInterval(this.data.timer)
    app.HttpService.getReDetail(id, orderType).then(res => {
      let _this = this
      let realPayAmount = null
      if (res.statusCode === 0) {
       
        // res.data.order.status=1
        res.data.order.createTime = app.Tools.formatDate(res.data.order.createTime, 'yyyy-MM-dd hh:mm:ss')    // 订单创建时间
        res.data.address.visitingTime = app.Tools.formatDate(res.data.address.visitingTime, 'yyyy-MM-dd hh:mm:ss')  // 取件时间
        // console.log('系统时间', res.time)
        // console.log('订单截止时间', res.data.order.endPayTime)
        // console.log('订单开始时间', res.data.order.createTime)
        this.setData({
          // realPayAmount: realPayAmount,
          orderStatus: res.data.order.status,
          orderStatusBuy:res.data.order.status,
          orderDetail: res.data.order,
          address:res.data.address,
          errBook: _this.filterErrBook(res.data.order.orderItems),  // 把不合格的书拿出来
          withholdMoney: res.data.order.withholdMoney,
            systime:res.time
        })

        if (this.data.orderType === '0'){
            this.opratestatus() //回收订单的订单状态
        }else{
          this.oprateBuystatus() //购买订单的订单状态
        }
        if (this.data.orderType === '1' && this.data.orderStatusBuy === 0) {
          let currentDate = res.time;//当前时间
          // let endtime = currentDate + (1000 * 60 * 1);//结束时间
          let endtime = res.data.order.endPayTime
          let days = endtime - currentDate;
          this.setData({
            ms: parseInt(days / 1000)
          })
          console.log('书本信息', this.data.ms)
          this.timeCoumt()
        }
      }
    })
  },
  filterErrBook(arr) {    // 抽出不合格的书
    let tmp = []
    console.log('所有书', arr)
    arr.forEach(book => {
      if (book.acceptanceStatus !== 1) {    // 只要没有验收成功，就有问题
        tmp.push(book)
      }
    })
    // console.log('不符的书', tmp)
    return tmp
  },
  //倒计时的计算
  getTheTime: function (obj,ms) {
    //计时开始
    let h = Math.floor(ms / 60 / 60);
    let m = Math.floor((ms - h * 60 * 60) / 60);
    let s = Math.floor((ms - h * 60 * 60 - m * 60));
    let d = parseInt(h / 24);

    h = this.prefix(h, 2);
    m = this.prefix(m, 2);
    s = this.prefix(s, 2)

    let time_val = "";
    switch (obj) {
      case 1://模式一：00:00:00 时分秒
        time_val = h + "小时" + m + "分:" + s + "秒:";
        break;
      case 2://模式二：00:00 分秒
        time_val =  m + "分" + s + "秒";
        break;
    }
    this.setData({
      desc1: '请您在' + time_val + '内支付，超时系统将自动取消订单'
    })
    // ms--;
    if ((ms) < 0) {
      this.setData({
        cancelText1: '支付超时，订单已取消',
        orderStatusBuy:3,
        desc1:''
      })
      clearInterval(this.data.timer)
    }
  },
  //定时器
  timeCoumt: function (){
    let tempms=this.data.ms
    let that = this
    this.setData({
      timer: setInterval(function () {
        that.getTheTime(2, tempms),
          tempms--
    }, 1000)
    })
  },
  //num传入的数字，n需要的字符长度
  prefix: function (num, n) {
    let len = num.toString().length;
    while (len < n) {
      num = "0" + num;
      len++;
    }
    return num;
  },
   // 购买订单的状态 0 待付款  1待发货 2 已发货 3已取消  10 自动取消 11待付款取消  12待发货取消
    //回收订单的状态 0 待发货 1 "待发货-已取消" 2 "待收货" 5 "已签收" 3 "已验收，待打款" 4 "已完成"
  // 根据订单状态设置提示文字和进度  回收订单
  opratestatus() {
    let status = this.data.orderStatus
    switch (status) {
      case 0:   // 待发货
        this.setData({
          cancelText1: '',
          cancelText2: '',
          desc1: `已为您预约${this.data.address.visitingTime}取件`,
          desc2: '',
          stepBar: {
            step1: '待发货',
            active1: 'active',
            step2: '待签收',
            active2: '',
            step3: '待打款',
            active3: '',
            width: 'w35'
          }
        })
        break
      case 1:   // 已取消
        this.setData({
          cancelText1: '您已取消订单',
          cancelText2: '',
          desc1: '',
          desc2: '',
          stepBar: {
            step1: '已发货',
            active1: 'active',
            step2: '待签收',
            active2: '',
            step3: '待打款',
            active3: '',
            width: 'w35'
          }
        })
        break
      case 2:   // 待收货 
        this.setData({
          cancelText1: '',
          cancelText2: '',
          desc1: '快递运输中',
          desc2: '我们将在收到书籍的3个工作日内验收打款',
          stepBar: {
            step1: '已发货',
            active1: 'active',
            step2: '待签收',
            active2: '',
            step3: '待打款',
            active3: '',
            width: 'w35'
          }
        })
        break
      case 3:   // 已验收
        this.setData({
          isDone: true,
          cancelText1: '',
          cancelText2: '',
          desc1: '订单已完成',
          desc2: '款项已发放到您的账户，请前往个人中心查看',
          stepBar: {
            step1: '已发货',
            active1: 'active',
            step2: '已签收',
            active2: 'active',
            step3: '已完成',
            active3: 'active',
            width: 'w100'
          }
        })
        break
      case 4:   // 已完成
        this.setData({
          isDone: true,          
          cancelText1: '',
          cancelText2: '',
          desc1: '订单已完成',
          desc2: '款项已发放到您的账户，请前往个人中心查看',
          stepBar: {
            step1: '已发货',
            active1: 'active',
            step2: '已签收',
            active2: 'active',
            step3: '已完成',
            active3: 'active',
            width: 'w100'
          }
        })
        break
      case 5:   // 已签收
        this.setData({
          // isDone: true,          
          cancelText1: '',
          cancelText2: '',
          desc1: '我们将在3个工作日内验收打款',
          desc2: '',
          stepBar: {
            step1: '已发货',
            active1: 'active',
            step2: '已签收',
            active2: 'active',
            step3: '待打款',
            active3: '',
            width: 'w65'
          }
        })
        break
    }
  },
  // 购买订单的状态 0 待付款  1待发货 2 已发货 3已取消(cancelType 0自动取消 1待付款取消 2待发货取消)  10 自动取消 11待付款取消  12待发货取消
  //购买订单详情物流详情
  oprateBuystatus() {
    let status = this.data.orderStatusBuy
    if (status === 3){
      if (this.data.orderDetail.cancelType === 0) {
        status =30
      } else if (this.data.orderDetail.cancelType === 1){
        status = 31
      } else if (this.data.orderDetail.cancelType === 2){
        status = 32
      }
    }
    // this.setData({
    //   orderStatusBuy:3
    // })
    // status=1
    switch (status) {
      case 0:   // 待付款
        this.setData({
          cancelText1: '',
          cancelText2: '',
          desc1: '请您在'+this.data.time_val+'内支付，超时系统将自动取消订单',
          desc2: '',
          buystepBar: {
            step1: '待付款',
            active1: 'active',
            step3: '待发货',
            active3: '',
            width: 'w65'
          }
        })
        break
      case 1:   // 待发货
        this.setData({
          cancelText1: '',
          cancelText2: '',
          desc1: '',
          desc2: '订单已付款，我们将在3个工作日内发货',
          buystepBar: {
            step1: '已付款',
            active1: 'active',
            step3: '待发货',
            active3: '',
            width: 'w65'
          }
        })
        break
      case 2:   // 已发货
        this.setData({
          cancelText1: '',
          cancelText2: '',
          desc1: '订单已发货',
          desc2: '您收到商品后若有疑问，可联系fk_zzsw@hey900.com',
          buystepBar: {
            step1: '已付款',
            active1: 'active',
            step3: '已发货',
            active3: '',
            width: 'w65'
          }
        })
        break
      case 30:   // 已取消
        this.setData({
          cancelText1: '支付超时，订单已取消',
          cancelText2: '',
          desc1: '',
          desc2: '',
          buystepBar: {
            step1: '已发货',
            active1: 'active',
            step2: '待签收',
            active2: '',
            step3: '待打款',
            active3: '',
            width: 'w35'
          }
        })
        break
      case 31:   // 已取消
        this.setData({
          cancelText1: '您已取消订单',
          cancelText2: '',
          desc1: '',
          desc2: '',
          buystepBar: {
            step1: '已发货',
            active1: 'active',
            step2: '待签收',
            active2: '',
            step3: '待打款',
            active3: '',
            width: 'w35'
          }
        })
        break
      case 32:   // 已取消
        this.setData({
          cancelText1: '',
          cancelText2: '',
          desc1: '订单已取消，钱款将在7个工作日内原路',
          desc2: '退回，请查收',
          buystepBar: {
            step1: '已发货',
            active1: 'active',
            step2: '待签收',
            active2: '',
            step3: '待打款',
            active3: '',
            width: 'w35'
          }
        })
        break
    }
  },
  //订单咨询
  toLink() {
    wx.showModal({
      title: '',
      content: '有任何疑问，您可前往“猪猪集市”公众号内留言',
      success: function (res) {
        if (res.confirm) {
          return;
        }
      },
      confirmText:'确认',
      showCancel:false
    })
  },
  // 取消订单
  orderCancel() {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定要取消订单？',
      success: function (res) {
        if (res.confirm) {
          app.HttpService.cancelReOrder(_this.data.orderId, _this.data.orderType).then(res => {
            if (res.statusCode === 0) {
              wx.showModal({
                title: '提示',
                content: '您的订单已取消',
                showCancel: 0,
                success: function (res) {
                  if (res.confirm) {
                    _this.getReDetail(_this.data.orderId, _this.data.orderType)
                  }
                }
              })
            }else{
              wx.showToast({
                title: res.msg
              })
            }
          })
        }
      }
    })

  },
  // 查看书籍详情
  goBookDetail:function (e) {
    let id = e.currentTarget.dataset.id
    if (this.data.orderType === '1'){
      wx.navigateTo({
        url: '../../../bookdetail/bookDetail?bookId=' + id,
      })
    }
  },
  //立即支付
  payoff: function () {
    let _this = this
    app.HttpService.payOrder(_this.data.orderId).then(res => {
      if (res.statusCode === 0) {
        this.wxPay(res.data)
        this.getReDetail(this.data.orderId, this.data.orderType)
      } else {
        wx.showToast({
          title: res.msg
        })
      }
    })
  },
  wxPay(data) {
    let self = this
    let params = {
      'timeStamp': data.smallRoutinePayArgs.timeStamp,
      'nonceStr': data.smallRoutinePayArgs.nonceStr,
      'package': 'prepay_id=' + data.smallRoutinePayArgs.prepayId,
      'signType': data.smallRoutinePayArgs.signType,
      'paySign': data.smallRoutinePayArgs.paySign,
      'success': function (res) {
        app.HttpService.confirmPay(data.orderId).then(res => {
          if (res.statusCode === 0) {
          }
        })
        self.setData({
          orderStatusBuy: 0
        })
      },
      'fail': function (res) {
        
      },
    }
    //拉支付接口
    wx.requestPayment(params)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timeCoumt) 
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
   // if (res.data.recycleOrder.status === 3 || res.data.recycleOrder.status === 4) {   //　订单完成，显示真正付的钱
  //   realPayAmount = res.data.recycleOrder.payAmount
  // } else {
  //   realPayAmount = res.data.recycleOrder.amount      
  //   res.data.recycleOrder.withholdMoney = 0      
  // }
    // 查看不合格明细
  // questionDetail() {    
  //   let errbook = JSON.stringify(this.data.errBook)
  //   let withholdMoney = JSON.stringify(this.data.orderDetail.recycleOrder.withholdMoney)
  //   wx.navigateTo({
  //     url: '../unstandard/unstandard?errbook=' + errbook + '&withholdMoney=' + withholdMoney
  //   })
  // },

  //     let that = this
  //   let currentDate;//当前时间
  // let endtime;//结束时间
  // let days;
    // let ms;//精确到秒

    // currentDate = new Date();//当前时间
    // endtime = new Date(currentDate.getTime() + (1000 * 60 * 1));//结束时间
    // endtime = new Date('2018/2/10');
    // days = endtime - currentDate;
    // ms = parseInt(days / 1000);//精确到秒
})