/**
 * 提供继承
 * 全局数据
 */

export default class Global {

  // 拜访类型
  visitTypes = [
    { value: 'street_worship', label: '陌拜' },
    { value: 'return_visit', label: '回访' },
    { value: 'maintain', label: '维护' },
    { value: 'patrol', label: '下店' },
    // { value: 'patrol', label: '巡店' },
    { value: 'activity', label: '活动' },
    { value: 'stick_cabinet', label: '贴柜' },
    { value: 'no_shop', label: '无门店' },
  ]

  // 合作商类型
  shopTypes = [
      { value: 'ka', label: 'KA' },
      { value: 'cs', label: 'CS' },
      { value: 'otc', label: 'OTC' },
      { value: 'other', label: '其他' },
      { value: 'store', label: '便利店' },
      { value: 'keyAccount', label: '大客户'},
      { value: 'csDealers', label: 'CS经销商' },
      { value: 'kaDealers', label: 'KA经销商' },
      { value: 'newRetailing', label: '新零售'},
  ]

  // 客户类型
  clientTypes = [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
  ]

  // 品牌
  brandTypes = [
      { value: '', label: '请选择品牌' },
      { value: 'WIS', label: 'WIS' },
      { value: 'MVE', label: 'MVE' },
      { value: 'IRY', label: 'IRY' },
      { value: '魔渍', label: '魔渍' },
      { value: 'KONO', label: 'KONO' },
      { value: '柏菲娜', label: '柏菲娜' },
  ]

  // 活动类型
  activityTypes = [
      { value: '', label: '请选择活动类型' },
      { value: '小型', label: '小型' },
      { value: '中型', label: '小型' },
      { value: '大型', label: '小型' },
  ]

  // 陈列等级
  displayLevels = [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
  ]

  // 公司类型
  companyTypes = [
    {label: '其他',value: 0},
    {label: '公司',value: 1},
    {label: '⾹港公司',value: 2},
    {label: '社会组织',value: 3},
    {label: '律   所',value: 4},
    {label: '事业单位',value: 5},
    {label: '基金会',value: 6}
  ]

  // 页面异常状态
  ErrorType = [
      {code: 101, type: 'network', title: '网络不给力', brief: '请检查网络设置', status: []},
      {code: 101, type: 'error', title: '系统错误', brief: '请反馈给管理员', status: []},
      {code: 101, type: 'empty', title: '页面空白', brief: '页面空空如也', status: []},
      {code: 101, type: 'busy', title: '服务器繁忙', brief: '服务器繁忙，请稍后再试', status: []},
      {code: 102, type: 'location', title: '获取不到地理位置', brief: '请检查定位设置', status: []},
  ]

  // 页面结果类型
  MessageResult = [
      {type: 'success', title: '操作成功'},
      {type: 'fail', title: '操作失败'},
      {type: 'info', title: '操作陈功'},
      {type: 'warn', title: '操作陈功，但有一个警告'},
      {type: 'waiting', title: '操作陈功，请稍等'}
  ]

  
  constructor (name) {
      this.instance = null
      this.initArrayType()
  }
  
  static getInstance () {
      if (!this.instance) this.instance = new Global()
      return this.instance
  }    
  
  initArrayType () {
      let object = this
      for (const key in object) {
          if (object[key] instanceof Array) {
              object[key].forEach((element,index) => {
                element.id = index
                element['index'] = index
              })
          }
      }
  }

  getVisitType (val,  transformObj) {
      let obj = {}
      if (transformObj) {
          this.visitTypes.forEach(item => { obj[item.value] = item.label; })    
      } else {
          this.visitTypes.forEach(item => { if (item.value == val || item.label === val || item.id === val) obj = item; })
      }
      return obj
  } 
  
  getShopType (val, transformObj) {
      let obj = {}
      if (transformObj) {
          this.shopTypes.forEach(item => { obj[item.value] = item.label; })    
      } else {
          this.shopTypes.forEach(item => { if (item.value == val || item.label === val || item.id === val) obj = item; })
      }
      return obj
  }

  getClientType (val, transformObj) {
      let obj = {}
      if (transformObj) {
          this.clientTypes.forEach(item => { obj[item.value] = item.label; })    
      } else {
          this.clientTypes.forEach(item => { if (item.value == val || item.label === val || item.id === val) obj = item; })
      }
      return obj
  }

  getBrandType (val, transformObj) {
      let obj = {}
      if (transformObj) {
          this.brandTypes.forEach(item => { obj[item.value] = item.label; })    
      } else {
          this.brandTypes.forEach(item => { if (item.value == val || item.label === val || item.id === val) obj = item; })
      }
      return obj
  }

  getActivityType (val, transformObj) {
      let obj = {}
      if (transformObj) {
          this.activityTypes.forEach(item => { obj[item.value] = item.label; })    
      } else {
          this.activityTypes.forEach(item => { if (item.value == val || item.label === val || item.id === val) obj = item; })
      }
      return obj
  }

  getDisplayLevel (val, transformObj) {
      let obj = {}
      if (transformObj) {
          this.displayLevels.forEach(item => { obj[item.value] = item.label; })    
      } else {
          this.displayLevels.forEach(item => { if (item.value == val || item.label === val || item.id === val) obj = item; })
      }
      return obj
  }

  getErrorType (val) {
      let obj = {}
      this.ErrorType.forEach(item => { if (item.type == val || item.id === val) obj = item; })
      return obj
  }

  getMessageResult (val,transformObj) {
      let obj = {}
      if (transformObj) {
          this.MessageResult.forEach(item => { obj[item.type] = item.title; })
      } else {
          this.MessageResult.forEach(item => { if (item.type == val || item.id === val) obj = item; })
      }
      return obj
  }

  isEmpty(obj) {
      for (let key in obj) return true;
      return false
  }
    
}


