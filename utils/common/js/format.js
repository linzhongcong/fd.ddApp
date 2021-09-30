// 时间戳转换时间
function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}

const date = (time, fmt) => {
	if (!time || time === 'Invalid Date' || time === '0') {
		return '';
	}
	let date = new Date(Number(time) * 1000);
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}

	let obj = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
	};
	for (let k in obj) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = obj[k] + '';
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
		}
  }
  // console.log("fmt",fmt,time);
  
	return fmt;
};

// 拜访类型格式化
function formatSign(type) {
	switch (type) {
		case 'street_worship':
			return '陌拜';
		case 'return_visit':
			return '回访';
		case 'no_shop':
			return '无门店';
		case 'maintain':
			return '维护';
		case 'stick_cabinet':
      return '贴柜';
    case 'patrol': 
      return '下店';
		default:
			return '活动';

	}
}

// 客户类型格式化
function formatShop(type) {
	if (type == 'ka') {
		return 'KA';
	} else if (type == 'cs') {
		return 'CS';
	} else if (type == 'otc') {
		return 'OTC';
	} else if (type == 'store') {
		return '便利店';
	} else if (type == 'other') {
    return '其他';
	} else if (type == 'csDealers') {
		return 'CS经销商';
	} else if (type == 'kaDealers') {
    return 'KA经销商';
  } else if (type == 'newRetailing' ) {
    return '新零售';
  } else if (type === 'keyAccount') {
    return '大客户';
	} else {
		return type;
	}
}

// 拜访类型格式化
function formatLevel(type) {
	if (type == 's') {
		return 'S';
	} else if (type == 'a') {
		return 'A';
	} else if (type == 'b') {
		return 'B';
	} else if (type == 'c') {
		return 'C';
	} else if (type == 'd') {
		return 'D';
	}
}

// 访问时长
let diff = 0
function checkinLength(time) {
  // console.log("checkinLength",time);
  // console.log("tiem",time);
	let signinDate = time.replace(/-/g, '/'); // 解决new Date()转换时间时间格式时IOS不兼容的问题 ，ios系统不支持2018-03-29的时间格式，IOS只识别2018/03/09，
  let currentDate = new Date().getTime() + diff
  signinDate = new Date(signinDate).getTime()
  let differDate = currentDate - signinDate;
  if (differDate < 0) {
    diff = diff -= differDate
    differDate = differDate -= differDate
  }
    let surplusHours = differDate % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
    let surplusMinutes = surplusHours % (3600 * 1000); // 计算小时后剩余的毫秒数
    let surplusSeconds = surplusMinutes % (60 * 1000); // 计算分钟数后剩余的毫秒数
    let hours = Math.floor(surplusHours / (3600 * 1000));
    let minutes = Math.floor(surplusMinutes / (60 * 1000));
    let seconds = Math.floor(surplusSeconds / 1000);
    return hours + '小时' + minutes + '分' + seconds + '秒';

}

// 依据时间错计算当前访问时长
function checkinLengthofTimeStamp (mss) {
  console.log("mss", new Date(mss));
  var hours = parseInt((mss % (24 * 3600 * 1000)) / (3600 * 1000));
  var minutes = parseInt((hours % (3600 * 1000)) / (1000 * 60));
  var seconds = parseInt( (minutes % (1000 * 60)) / 1000);
  hours = hours;
  minutes = minutes;
  seconds = seconds;
  return `${hours} 时 ${minutes} 分 ${seconds} 秒`;
}


// 时分秒格式化
const timeFormat = d => {
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate(0)
  return `${[year, month, day].map(monthToString(val)).join('-')}`
  return `${d.getFullYear()}-${d.getMonth() +1}`
}

const dateFormat = d => {
	let isTime = '';
	isTime =
		(d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
		':' +
		(d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
		':' +
		(d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds());

	return isTime;
};

// 获取时间并格式化
const thisTimeFormat = (date, fmt) => {
	let d = new Date(date);
	var o = {
		'M+': d.getMonth() + 1, //月份
		'd+': d.getDate(), //日
		'h+': d.getHours(), //小时
		'm+': d.getMinutes(), //分
		's+': d.getSeconds(), //秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (let k in o)
		if (new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	return fmt;
};



function formatDateTime (d) {
  const year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate(0)
  const hour = d.getHours(), minutes = d.getMinutes(),seconds = d.getSeconds()
  return `${[year, month, day].map(this.formatdateString).join('-')} ${[hour, minutes, seconds].map(this.formatdateString).join(':')}`
}
function formatDate(d) {
  const year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate(0)
  return `${[year, month, day].map(this.formatdateString).join('-')}`
}
function formatTime(d) {
  const hour = d.getHours(), minutes = d.getMinutes(),seconds = d.getSeconds()
  return `${[hour, minutes, seconds].map(this.formatdateString).join(':')}`
}
 function formatdateString(str) {
  str = str.toString()
  return str[1] ? str : `0${str}`
}



module.exports = {
  formatDateTime,
  formatDate,
  formatTime,
  formatdateString,
  checkinLengthofTimeStamp,
	timeFormat: date,
	formatSign: formatSign,
	checkinLength: checkinLength,
	formatShop: formatShop,
	dateFormat: dateFormat,
	thisTimeFormat: thisTimeFormat,
	formatLevel: formatLevel,
};
