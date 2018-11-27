const app = getApp()
let chooseYear = null;
let chooseMonth = null;
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    imgList:[],
  },
  onLoad() {
    // 换成服务器的时间
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const curDay = date.getDate();
    const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
    this.getThisMonthHadMarkDays(curYear, curMonth);
    this.setData({
      curYear,
      curMonth,
      curDay,
      weeksCh
    });
  },
  onShow(){
    this.setData({
      imgList:[]
    });
    console.log(this.data.curDay)
    this.getMarkList(this.data.curDay)
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
    // 根据年月获取当月有添加书签的相关日期及其数据
  getThisMonthHadMarkDays(year,month){
    let param = year + '-' + (month < 10 ? '0' + month : month)
    let _this = this
    app.HttpService.getHadMarkDays(param).then(res => {
      if (app.Tools.formatDate(new Date(), 'yyyy-MM-dd', 0) === app.Tools.formatDate(res.time, 'yyyy-MM-dd')){
        if (res.statusCode === 0) {
          let list = res.data
          let arr = []
          if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              if (list[i].substring(8, 10) < 10) {

                arr.push({ day: parseInt(list[i].substring(9, 10)) })
              } else {
                arr.push({ day: parseInt(list[i].substring(8, 10)) })
              }
            }
          }
          _this.calculateDays(year, month, arr)
          _this.calculateEmptyGrids(year, month)
        } else {
          wx.showToast({
            title: res.msg
          })
        }
      }else{
        // 本地时间与服务器时间不一致//年月日
        var y = app.Tools.formatDate(res.time, 'yyyy-MM-dd').substring(0, 4)
        var m = app.Tools.formatDate(res.time, 'yyyy-MM-dd').substring(5, 7) > 10 ? app.Tools.formatDate(res.time, 'yyyy-MM-dd').substring(5, 7) : app.Tools.formatDate(res.time, 'yyyy-MM-dd').substring(6, 7)
        var d = app.Tools.formatDate(res.time, 'yyyy-MM-dd').substring(8, 10) > 10 ? app.Tools.formatDate(res.time, 'yyyy-MM-dd').substring(8, 10) : app.Tools.formatDate(res.time, 'yyyy-MM-dd').substring(9, 10)
        _this.setData({
          curYear: y,
          curMonth: m,
          curDay: d
        });
        _this.getThisMonthHadMarkDays(y,m)
      }
    })
    
  },
  calculateDays(year, month, thisMonthMarkData) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      let hadMark = false
      for (let j = 0; j < thisMonthMarkData.length; j++){
        if (thisMonthMarkData[j].day === i){
          hadMark = true
        }
      }
      days.push({
        day: i,
        choosed: false ,
        hadMark: hadMark
      });
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    if (handle === 'prev') {
      let newMonth = curMonth - 1;
      let newYear = curYear;
      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }

      this.getThisMonthHadMarkDays(newYear, newMonth);
      this.setData({
        curYear: newYear,
        curMonth: newMonth,
        curDay: '',
        imgList: []
      });
    } else {
      let newMonth = curMonth + 1;
      let newYear = curYear;
      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }

      this.getThisMonthHadMarkDays(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth,
        curDay:'',
        imgList:[]
      });
    }
  },
  tapDayItem(e) {
    const idx = e.currentTarget.dataset.idx;
    const days = this.data.days;
    this.getMarkList(e.currentTarget.dataset.idx+1)
    for (var i = 0; i < days.length;i++){
      days[i].choosed = false
    }
    days[idx].choosed = true;
    this.setData({
      days,
      curDay: parseInt(e.currentTarget.dataset.idx + 1)
    });
    console.log(this.data.curDay)
    
  },
  // 根据年月日获取该日期的书签列表
  getMarkList(day){
    const curYear = this.data.curYear;
    const _this = this;
    const curMonth = this.data.curMonth < 10 ? '0' + this.data.curMonth : this.data.curMonth;
    const curDay = day < 10 ?'0' + day : day
    let param = {
      date: curYear + '-' + curMonth + '-' + curDay
    }
    app.HttpService.getMarkData(param).then(res => {
      if (res.statusCode === 0) {
        _this.setData({
          imgList: res.data.data,
        })
      } else {
        wx.showToast({
          title: res.msg
        })
      }
    })
  },
  chooseYearAndMonth() {
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    let pickerYear = [];
    let pickerMonth = [];
    for (let i = 1900; i <= 2100; i++) {
      pickerYear.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      pickerMonth.push(i);
    }
    const idxYear = pickerYear.indexOf(curYear);
    const idxMonth = pickerMonth.indexOf(curMonth);
    this.setData({
      pickerValue: [idxYear, idxMonth],
      pickerYear,
      pickerMonth,
      showPicker: true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    chooseYear = this.data.pickerYear[val[0]];
    chooseMonth = this.data.pickerMonth[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.curYear = chooseYear;
      o.curMonth = chooseMonth;
      this.getThisMonthHadMarkDays(chooseYear, chooseMonth);
    }

    this.setData(o);
  },
  getGoods(e){
    const id = e.currentTarget.dataset.id;
    const imgUrl = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: 'markDetail?id=' + id +'&imgUrl=' + imgUrl,
    })
  }
};

Page(conf);
