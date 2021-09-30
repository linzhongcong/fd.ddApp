/*   --------------------------------------  date format  --------------------------------------    */

// export const systemName = my.getStorageSync({key: 'system'}).data.name // ios || andorid || *
export const systemName = my.getSystemInfoSync().platform.toString().toLowerCase()

// yyyy-MM-dd hh:mm:ss  -->  yyyy/MM/dd hh:mm:ss
// 兼容IOS 还可以使用 format('L') 因为这样得到的就是 yyyy/MM/dd 格式的时间数据
export function compatible_IOS (str) {
  return str.toString.replace('/-/g','/')
}

/** 
 * @param {date || string  number} d  时间 时间字符串 时间数值
 * @param {string} t // type 类型 只返回日期 只返回时间 
 * @returns 
 */
export function dateTimeFormat (d,t) {
  let date;
  if (d instanceof Date) {
    date = d
  } else {
    date = typeof date === 'string' && systemName === 'ios' ? new Date(compatible_IOS(d)) : new Date(d)
  } 
  
  if (date === 'Invalid Date') throw new Error('date must be a valid Date');

  const year = date.getUTCFullYear()
      , month = date.getMonth() + 1
      , day = date.getDate()
      , hour = date.getHours()
      , mutations = date.getMinutes()
      , seconds = date.getSeconds()

  if (t === 'date') {
    return `${[year, month, day].map(fullZero).join('-')}`
  } else if (t === 'time') {
    return `${[hour, mutations, seconds].map(fullZero).join(':')}`
  } else {
    return `${[year, month, day].map(fullZero).join('-')} ${[hour, mutations, seconds].map(fullZero).join(':')}`
  }
}

// 填零
export function fullZero (str) {
  str = str.toString()
  return str[1] ? str : `0${str}`
}

// ！ timeFormat
export const timeFormat = (time, fmt) => {
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

	return fmt;
};

// 拜访类型格式化
export function formatSign(type) {
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
      // return '巡店'
		default:
			return '活动';
	}
}

// 客户类型格式化
export function formatShop(type) {
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
	} else if (type == 'keyAccount') {
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


/*   --------------------------------------  url  --------------------------------------    */

/**
 * 参数对象拼入页面路由
 * @param {*} url 
 * @param {*} params 
 * @returns 
 */
export function paramsConcatUrl (url,params) {  
  Object.keys(params).forEach((key, index) => {
    let val = params[key]
    url = url + (index === 0 ? '?' : '&') + key + '=' + val
  })
  return url
}

/*   --------------------------------------  file  --------------------------------------    */
// fmtClass
var hasOwn = {}.hasOwnProperty;
/* eslint-disable no-continue, prefer-spread */

export function fmtClass() {
  var classes = [];

  for (var i = 0; i < arguments.length; i++) {
    var arg = i < 0 || arguments.length <= i ? undefined : arguments[i];
    if (!arg) continue;
    var argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length) {
      var inner = fmtClass.apply(null, arg);

      if (inner) {
        classes.push(inner);
      }
    } else if (argType === 'object') {
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

// fmtEvent
export function fmtEvent(props, e) {
  var dataset = {};

  for (var key in props) {
    if (/data-/gi.test(key)) {
      dataset[key.replace(/data-/gi, '')] = props[key];
    }
  }

  return Object.assign({}, e, {
    currentTarget: {
      dataset: dataset
    },
    target: {
      dataset: dataset,
      targetDataset: dataset
    }
  });
}

  
// fmtUnit
var jsUnitRpx = 'false';
/* eslint-disable no-continue, prefer-spread */

export function fmtUnit(oldUnit) {
  var getUnit = oldUnit;

  if (jsUnitRpx === 'true') {
    if (typeof getUnit === 'string' && getUnit === 'px') {
      getUnit = 'rpx';
    } else if (typeof getUnit === 'number') {
      getUnit *= 2;
    } else if (typeof getUnit === 'string') {
      getUnit = oldUnit.match(/(\d+|\d+\.\d+)(px)/)[1] * 2 + 'rpx';
    }
  }

  return getUnit;
}


// getI18n

// import I18n_zhCN from '../_lang/zh-CN';
// import I18n_enUS from '../_lang/en-US';
// export function getI18n() {
//   try {
//     /* global getApp */

//     /* eslint no-undef: "error" */
//     var appMiniAliUI = getApp() || null;

//     if (appMiniAliUI) {
//       var _appMiniAliUI$globalD;

//       if (((_appMiniAliUI$globalD = appMiniAliUI.globalData) == null ? void 0 : _appMiniAliUI$globalD.miniAliUiLang) === 'en-US') {
//         return I18n_enUS;
//       } else {
//         return I18n_zhCN;
//       }
//     } else {
//       return I18n_zhCN;
//     }
//   } catch (error) {
//     return I18n_zhCN;
//   }
// }


export default {
  compatible_IOS, // IOS时间字符串兼容
  systemName,  // 系统信息
  dateTimeFormat, // 格式化时间
  paramsConcatUrl, // 路由参数格式化
  timeFormat, // 根据format格式化时间
  formatSign,
  formatShop,
  checkinLength,
  fmtClass, // css格式化
  fmtEvent, // 事件对象属性合并
  fmtUnit, // 尺寸单位格式化
}