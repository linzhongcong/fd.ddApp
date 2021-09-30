
Component({
  mixins: [],
  data: {
    initMinDate: new Date(2010,1,0).getTime(),
    initMaxDate: new Date().getTime(),
    initialValue: [0, 0, 0, 0, 0],
    years: [],
    months: [],
    days: [],
    hours: [],
    minute: [],
    inintDaysArr: []
  },
  props: {
    type:'days', //展示类型 默认展示年月日 如只要月，则传type为months
    format: "yyyy-MM-dd hh:mm",//返回的格式要求 1.yyyy-MM-dd 2.yyyy-MM-dd hh:mm:ss 3.yyyy/MM/dd 4.yyyy年MM月dd日  5.yyyy年MM月  5.yyyy-MM
    value: new Date().getTime(),
    minDate: new Date(2019,1,0).getTime(),
    maxDate: new Date().getTime(),
    initialArr: [],
    onPickerChange: () => { },
    onHiddenMask: () => { },
  },
  didMount() {
    this.updateByValue();
  },
  didUpdate(prevProps, prevData) {
    if (prevProps.value != this.props.value) {
      this.updateByValue();
    }
  },
  didUnmount() { },
  methods: {
    updateByValue() {
      let value = new Date(this.props.value);
      let years = this.getYears();
      let months = this.getMonths(value.getFullYear());
      let days = this.getDays(value.getFullYear(), value.getMonth() + 1);
      //let inintDaysArr = this.data.inintDaysArr.length? this.data.inintDaysArr:this.getDays(value.getFullYear(), value.getMonth() + 1);
      this.getHours();
      this.getMinute();
      let initialValue = [0, 0, 0, 0, 0];
      if(this.props.initialArr.length){
        initialValue = this.props.initialArr;
      }else{
        //最开始没有initialArr值时，则计算出来
        initialValue[0] = years.indexOf(value.getFullYear());
        initialValue[1] = months.indexOf(value.getMonth() + 1);
        initialValue[2] = days.indexOf(value.getDate());
      }
      (days.length > 6) && days.unshift(...this.data.inintDaysArr);
      (days.length > 6) && days.push(...this.data.inintDaysArr);
      this.setData({
        years: years,
        months: months,
        days: days,
      }, () => {
        this.setData({
          initialValue: initialValue,
        })
      })
    },
    getYears() {
      let minDate = this.props.minDate?new Date(this.props.minDate): new Date(this.data.initMinDate);
      let maxDate = this.props.maxDate?new Date(this.props.maxDate): new Date(this.data.initMaxDate);
      let years = Array(maxDate.getFullYear() - minDate.getFullYear() + 1).fill(minDate.getFullYear()).map((x, y) => x + y);
      return years;
    },
    getMonths(year) {
      //let maxDate = new Date(this.props.maxDate);
      let minDate = this.props.minDate?new Date(this.props.minDate): new Date(this.data.initMinDate);
      let maxDate = this.props.maxDate?new Date(this.props.maxDate): new Date(this.data.initMaxDate);
      let maxMonth = (year == maxDate.getFullYear() ? (maxDate.getMonth() + 1) : 12);
      let months = Array(maxMonth).fill(1).map((x, y) => x + y);

      let minDateIndex = -1;
      //跟最小值的年对比
      if(year == minDate.getFullYear()){
        minDateIndex = months.indexOf(minDate.getMonth() + 1);
        months.splice(0, minDateIndex);
      }
      return months
    },
    getDays(year, month) {
      //month = this.getMonths(year)[month];
      let minDate = this.props.minDate?new Date(this.props.minDate): new Date(this.data.initMinDate);
      let maxDate = this.props.maxDate?new Date(this.props.maxDate): new Date(this.data.initMaxDate);
      let maxDay = (year == maxDate.getFullYear() && month == (maxDate.getMonth() + 1)) ? maxDate.getDate() : new Date(year, month, 0).getDate();
      let days = Array(maxDay).fill(1).map((x, y) => x + y);

      let minDateIndex = -1;
      //跟最小值的年对比
      if(year == minDate.getFullYear() && month == minDate.getMonth() + 1){
        minDateIndex = days.indexOf(minDate.getDate());
        days.splice(0, minDateIndex);
      }
      this.setData({
        inintDaysArr: this.deepCopy(days)
      })
      return days
    },
    changeTime(e) {
      let _valArr = e.detail.value;
      let months = this.getMonths(this.data.years[_valArr[0]]);
      if (_valArr[1] >= months.length) {
        _valArr[1] = months.length - 1;
      }
      let days = [];
      //let inintDaysArr = this.getDays(this.data.years[_valArr[0]], this.data.months[_valArr[1]]);
      if(_valArr[0] != this.data.initialValue[0] || (_valArr[1] != this.data.initialValue[1])){
        days = this.getDays(this.data.years[_valArr[0]], months[_valArr[1]]);
      }
      days = days.length ? days: this.data.days;
      if (_valArr[2] >= days.length) {
        _valArr[2] = days.length - 1;
      }
      //年和月change时才改变days，且展示的个数是7个
      if(days.length > 6){
        let isAddDays = (_valArr[0] != this.data.initialValue[0]) || (_valArr[1] != this.data.initialValue[1]);
        //如果年或者月变化时，日添加重复数组数据，固定3个
        if(isAddDays){
          days.unshift(...this.data.inintDaysArr);
          days.push(...this.data.inintDaysArr);
          //以下代表日位于数组第一个范围内时比如10月1，因为在前面添加了一个数组数据，所以日所在位置也添加一个数组长度，视觉上前面还有值可选
          if(_valArr[2] < (days.length / 3)){
            _valArr[2] = _valArr[2] + days.length / 3;
          }
        }
        //如果日变化，就判断是第一组还是第三组
        if(_valArr[2] != this.data.initialValue[2]){
          let initDays = days.length?days: this.data.days;
          let daysLen = initDays.length;
          let inintDaysArrLen = this.data.inintDaysArr.length;
          //代表第一组，则删除第三组，添加到最前面，日所在位置对应添加一个数组长度
          if(_valArr[2] < (daysLen / 3)){
            initDays.splice(daysLen - daysLen / 3,daysLen / 3);
            initDays.unshift(...this.data.inintDaysArr);
            days = initDays;
            _valArr[2] = _valArr[2] + inintDaysArrLen;
          }
          //代表第三组，则删除第一组，添加到最后面，日所在位置对应减去一个数组长度
          if(_valArr[2] > (daysLen / 3 * 2)){
            initDays.splice(0, daysLen / 3);
            initDays.push(...this.data.inintDaysArr);
            days = initDays;
            _valArr[2] = _valArr[2] - inintDaysArrLen;
          }
        }
      }
      this.setData({
        months: months,
        days: days.length?days: this.data.days,
        'initialValue': _valArr
      })
    },
    cancelChoose() {
      this.props.onHiddenMask();
    },
    confirmChoose(e) {
      let initialValue = this.data.initialValue;
      let _val = new Date(this.data.years[initialValue[0]], this.data.months[initialValue[1]] - 1, this.data.days[initialValue[2]],this.data.hours[initialValue[3]], this.data.minute[initialValue[4]]);
      let crtTime = this.dateFtt(this.props.format,_val);
      //第一个参数为固定格式的时间，第二个选中的index数组，第三个时间戳
      this.props.onPickerChange(crtTime, initialValue, _val.getTime());
      this.props.onHiddenMask();
    },
    dateFtt(fmt, date) { //author: meizz   
      var o = {   
        "M+" : date.getMonth()+1,                 //月份   
        "d+" : date.getDate(),                    //日   
        "h+" : date.getHours(),                   //小时   
        "m+" : date.getMinutes(),                 //分   
        "s+" : date.getSeconds(),                 //秒   
        "q+" : Math.floor((date.getMonth()+3)/3), //季度   
        "S"  : date.getMilliseconds()             //毫秒   
      };   
      if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
      for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
      return fmt;   
    },
    typeCheck(data) {
      let typeObj = {
        "[object String]": 'string',
        "[object Number]": 'number',
        "[object Boolean]": 'boolean',
        "[object Object]": 'object',
        "[object Null]": 'null',
        "[object Undefined]": 'undefined',
        "[object Symbol]": 'symbol',
        // 上面的是7种基本类型。下面的是自带原生类型情况。
        "[object Function]": 'function',   // object
        "[object Date]": 'date',           // object  -- new Date() 出来的值。
        "[object Array]": 'array',         // object
        "[object RegExp]": 'regexp',       // object  正则的简写也同样是object,有test,match这个方法。      
      };
      // 得到一个数据最原始的类型，直接去调用Object.prototype.toString()的方法。
      let strKey = Object.prototype.toString.call(data);  // 直接调用call方法，call为传单个参数的值，apply传入list;
      return typeObj[strKey];
    },
    deepCopy(data) {
      // 1.先进行数据的类型判断
      let typeKey = this.typeCheck(data);
      // 2.只有两种情况。 1种是这个数据是值类型，另一种是object.
      let res_data = "", list = [], obj = {};
      if (typeof data === 'object') { // 会有一个null的问题。  
        if (typeKey === 'object') {
          // 对像
          for (let o in data) {
            obj[o] = this.deepCopy(data[o])
          }
          return obj;
        } else if (typeKey === 'array') {
          // list;
          data.forEach(item => {
            list.push(this.deepCopy(item));
          });
          return list;
        } else {
          // 其它对象类型。eg: function, date, reg 是对象也是以值类型存在。
          return data
        }
      } else {
        // 基础值类型--在这一个基础值类型中只会执行一次。
        return data;
      }
    },
    getHours(){
      let hours = [];
      hours = Array(24).fill(0).map((x, y) => x + y);
      this.setData({
        hours: hours
      })
    },
    getMinute(){
      let minute = [];
      minute = Array(60).fill(0).map((x, y) => x + y);
      this.setData({
        minute: minute
      })
    },
  },
});



/**
 * 使用示例
 *         <date-picker type="{{timeRange.timebegin.multiPickerType}}" 
          format="{{timeRange.timebegin.format}}"
          value="{{pickerValue}}" 
          initialValue="{{initialValue}}" 
          minDate="{{minDate}}"
          maxDate="{{maxDate}}"
          onHiddenMask="onHiddenMask" 
          onPickerChange="pickerChange">
        </date-picker>

  	bindPickerChange(e) {
		this.setData({
			'filterData.type': this.data.dateType[e.detail.value].value,
		});
		let dateList = this.data.dateType;
		dateList.forEach(item => {
			item.isShow = false;
		});
		dateList[e.detail.value].isShow = dateList[e.detail.value].isShow === false ? true : false;
		this.setData({
			'filterData.type': this.data.dateType[e.detail.value].value,
			dateType: dateList,
			'isDate.startDate': '请选择开始时间',
			'isDate.endDate': '请选择结束时间',
		});
	}
 */