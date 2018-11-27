import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
	constructor() {
		super()
		this.$$prefix = ''
		this.$$path = {
      base: '/sh/ja/v1/book/wx/small/',
      regist: '/sh/ja/v1/regist/'
		}
	}
  // 保存书签及其图片
  saveMark(markUrl,markId){
    let param ={
      bookmarkImageUrl: markUrl,
      id: markId
    }
    return this.putRequest(this.$$path.base + 'bookmark',param)
  }
  // 获取书签列表数据
  getMarkData(params) {
    return this.getRequest(this.$$path.base + 'bookmark/list', params)
  }
  // 获取书列表
  getBookData() {
    return this.getRequest(this.$$path.base + 'bookmark/list/group')
  }
  // 获取有书签的天数
  getHadMarkDays(yearAndMonth) {
    let param = {
      yearAndMonth: yearAndMonth
    }
    return this.getRequest(this.$$path.base + 'bookmark/record',param)
  }
  // 删除书签
  deleteMark(id) {
    let param = {
      id: id
    }
    return this.deleteRequest(this.$$path.base + `bookmark/${id}`)
  }
  // 支付成功查看购买订单详情
  confirmPay(orderId) {
    return this.getRequest(this.$$path.base + `buy/order/${orderId}/pay/success`)
  }
  // 重新支付
  payOrder(orderId) {
    return this.postRequest(this.$$path.base + `buy/order/pay/${orderId}`)
  }
  // 获取类目
  getClassy() {
    return this.getRequest(this.$$path.base + 'category')
  }
  // 根据类目获得商品
  getGoods(categoryId, params) {
    return this.getRequest(this.$$path.base + `category/${categoryId}/book`, params)
  }
  // 搜索商品
  searchGoods(bookName) {
    return this.getRequest(this.$$path.base + `book/search?bookName=${encodeURIComponent(bookName)}`)
  }
  // 获取sessionkey
  getSessionKey(params) {
    return this.getRequest(this.$$path.base + 'jsCode2Session?code=' + params)
  }
  // 调自己的接口登录获取登录信息
  sessionLogin(params) {  
    return this.postRequest(this.$$path.base + 'bindingWx', params)
  }
  // 根据isbn获取书本信息
  getBookInfo (isbn) {
    return this.getRequest(this.$$path.base + 'getDetail?isbn=' + isbn)
  }
  // 获取回收购物车清单列表
  getShopList (type1) {
    return this.getRequest(this.$$path.base + type1 + '/cart')
  }
  // 书本添加到回收清单里
  addReCart(isbn) {
    return this.postRequest(this.$$path.base + 'recycle/cart/' + isbn)    
  }
  // 获取回收订单信息
  getReOrderInfo (type1,params) {
    return this.postRequest(this.$$path.base + type1 +'/order/confirm', params)        
  }
  // 删除回收清单的某一项书本
  delReBook (type1,id) {
    return this.deleteRequest(this.$$path.base + type1 + '/cart/'+ id)
  }
  //获取卖书订单列表 	0-回收订单 1-购买订单
  getReOrderList(params, orderType) {
    console.log("路由里面的"+orderType+typeof(orderType));
    // return this.getRequest(this.$$path.base + 'recycle/orderList', params) 
    if (orderType==="0") {
      return this.getRequest(this.$$path.base + 'recycle/order', params) 
    }else{
      return this.getRequest(this.$$path.base + 'buy/order', params) 
    }
  }
  // 验证码QR
  getQR(params) {
    return this.postRequest(this.$$path.regist + 'code', params)
  }
  // 获取卖书收入与余额
  getBalanceAndIncome () {
    return this.getRequest(this.$$path.base + 'recycle/myMoney')        
  }
  // 提交下单
  postOrder (type1,params) {
    return this.postRequest(this.$$path.base + type1 + '/order/submit', params)    
  }
  // 获取回收订单详情
  // getReDetail (id) {
  //   return this.getRequest(this.$$path.base + 'recycle/order/' + id)
  // }
  // 获取回收订单详情
  getReDetail(id, orderType) {
    console.log("路由获取详情页面的type类型" + orderType + typeof (orderType))
      if (orderType === '0') {
         return this.getRequest(this.$$path.base + 'recycle/order/' + id)
      }else {
        return this.getRequest(this.$$path.base + 'buy/order/' + id)
     }
  }

  // 绑定手机号
  bindPhone (params) {
    return this.postRequest(this.$$path.base + 'recycle/phone/bind', params)  
  }

  // 取消回收订单
  cancelReOrder(orderId, orderType) {
    console.log("取消回收订单" + orderType + typeof (orderType))
    if (orderType === '0') {
     return this.putRequest(this.$$path.base + '/recycle/order/' + orderId)  
    }else{
      return this.putRequest(this.$$path.base + '/buy/order/' + orderId)  
    }
  }
  //获取书籍详情(此处是book ISBN)
  getBookDetail (bookId) {
    return this.getRequest(this.$$path.base + 'book/' + bookId)
  }
  //加入购物车
  toBuyBook(bookId) {
    return this.postRequest(this.$$path.base + 'buy/cart/' + bookId)
  }
  //提现
  newWithDraw() {
    return this.postRequest(this.$$path.base + 'withdraw/') 
  }
  //图片上传
  upLoadImg(params) {
    return this.postRequest(this.$$path.base + '/file/upload', params)
  }
  //书签提交
  pushMark(params){
    return this.postRequest(this.$$path.base + 'bookmark', params)
  }
}

export default Service