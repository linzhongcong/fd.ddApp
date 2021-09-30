import format from '/utils/common/js/format'
import { merchantDetail,collectCancel,receiveCancel,visitRecord,orderRecord } from '/api/merchant/index'

const leads_statusBox = {
  "waitFollow": "待跟进",
  "inFollow": '跟进中',
  "converted": '已转换',
  "repea": '重复线索',
}
const merchant_typeBox = {
  "cs": "CS",
  "csDealers": "CS经销商",
  "kaDealers": "KA经销商",
  "ka": "KA",
  "otc": "OTC",
  "store": "便利店",
  'newRetailing': '新零售',
  "other": "其他",
}
let shopInfoConfig = [
  {label: '创建时间', icon: 'time', key: 'created_at', value: ''},
  {label: '系统/门店', icon: 'shop', key: 'name', value: ''},
  {label: '联系人', icon: 'user', key: 'contact_name', value: ''},
  {label: '联系人电话', icon: 'phone', key: 'contact_phone', value: ''},
  {label: '线索状态', icon: 'shop', key: 'leads_status', value: ''},
  {label: '门店地址', icon: 'address', key: 'address', value: ''},
]

let customersConfig = [
  {label: '门店数量', icon: 'shop', key: 'estimate_facade_number', value: ''},
  {label: '开拓人', icon: 'user', key: 'salesmanName', value: ''},
  {label: '商务负责人', icon: 'user', key: 'followBy', value: ''},
  {label: '合作状态', icon: 'user', key: 'potentialStatus', value: ''},
  {label: '最近一次下单时间', icon: 'time', key: 'latestOrderAt', value: ''},
]


const sourceMapVisit = { isProfile: 'maintain', maintain: 'return_visit', myVisit: 'return_visit'} // 不同原进行不同拜访

Page({
  data: {
    shopInfo: {}, // 客户信息
    shopInfoArray: [], // 存放表单Label与编导值

    visitInfo: [], // 拜访记录
    visitInfoCache: [], // 拜访记录缓存
    facadeList: [], // 门店列表
    facadeListCache: [], // 门店列表缓存
    count: 0, // 拜访记录总数
    page: 1, // 当前页
    perPage: 5, // 煤业条数
    active: '', // 当前tab visit || facade
    source: '', //  // 我的拜访：myVisit，我的维护：maintain，客户档案 ：isProfile
    merchantTypes: merchant_typeBox,
    leads_statusBox: leads_statusBox,
    query: [] // 路由参数
  },



/*-----    交互   -----*/
  // tab 切换 ——拜访记录 / 们带你泪飙
  handlerTabContentClick(e) {
    // console.log("handlerTabContentClick",my.canIUse('$spliceData'), e);
    let active = e.currentTarget.dataset.type === 'facade' ? 'facade' : 'visit'
    let id = this.data.query.id, source = this.data.query.source
    this.$spliceData({active, page: 0, visitInfo: [], facadeList: []},() => {
      e.currentTarget.dataset.type === 'facade' ? this.getfacadeList(id, source) : this.getMerchantVisitData(id, source)
    })
  },

  // 跳转签到详情页面
  handleJumpPageClick(e) {
    const { checkinId, checkinWay} = e.currentTarget.dataset.item
    dd.navigateTo({ url: `/pages/check-in-details/check-in-details?id=${checkinId}&signType=${checkinWay}`});
  },

  // 取消收藏
  handlerCollectCancel() {
    collectCancel(this.data.shopInfo.id).then(res => {
      // console.log("shopInfo",this.data.shopInfo);
      my.navigateBack({ success: res => my.showToast({content: '取消收藏成功'}) })
    }).catch(err => {
      my.showToast({content: '取消收藏失败' +  err.data.msg});
    })
  },

  // 回退
  handlerReceiveCancel() {
    receiveCancel(this.data.shopInfo.id).then(res => {
      // console.log("shopInfo",this.data.shopInfo);
      my.navigateBack({ success: res => my.showToast({content: '回退成功'}) })
    }).catch(err => {
      my.showToast({content: '回退失败' + err.data.msg});
    })
  },

  // 拜访
  handlerVisit(e) {
    // console.log("asd",e);
    let signType = sourceMapVisit[this.data.source]
    , shopInfo = {id: this.data.shopInfo.id}
    const url = `/pages/sign-in/index/index?signType=${signType}&shopInfo=${JSON.stringify(shopInfo)}`
    my.navigateTo({ url: url })
  },

  // 转换
  handlerTransfer() {
    // console.log("shopInfo",this.data.shopInfo);
    if (this.data.shopInfo.leads_status === 'repeat') {
      my.showToast({content: '已重复线索不能转换'});
    } else if (this.data.shopInfo.leads_status === 'converted') {
      my.showToast({content: '已转化线索不能转化'});
    }  else {
      my.navigateTo({ url: `/pages/merchant/clue-transfer/clue-transfer?id=${this.data.shopInfo.id}` })
    }
  },



/*-----    fetch data   -----*/
  // 详情信息
  getMerchantDetailData(id,source) {
    merchantDetail({contractorId: id}).then(res => {
      const shopInfoArray = this.formatObjTooArr(res.data.data,source)
      this.setData({ shopInfo: res.data.data, shopInfoArray: shopInfoArray })
    }).catch(err => {
      my.showToast({ content: `${err.data.msg || '请求失败'}`, type: 'fail' })
    })
  },

  // 拜访记录模块数据
  getMerchantVisitData(id, source) {
    let params = {page: this.data.page, perPage: this.data.perPage, contractorId: id, source: source}
    visitRecord(params).then(res => {
      let list = [].concat(this.data.visitInfo, res.data.data.list)
      this.setData({visitInfo: list, count: res.data.data.count})
    }).catch(err => {
      my.showToast({ content: `${err.data.msg || '请求失败'}`, type: 'fail' })
    })
  },

  // 历史订单
  getfacadeList(id, source) {
    let params = {page: this.data.page, perPage: this.data.perPage, contractorId: id, source: source}
    orderRecord(params).then(res => {
      let list = [].concat(this.data.facadeList, res.data.data.list)
      this.setData({facadeList: list, count: res.data.data.count})
    }).catch(err => {
      my.showToast({ content: `${err.data.msg || '请求失败'}`, type: 'fail' })
    })    
  },

  // 下拉加载更多数据
  getMoreData() {
  //   // console.log("滚动了");
  //   let fetch = this.data.active === 'facade' ? this.getfacadeList : this.getMerchantVisitData
  //   this.setData({ page: this.data.page + 1 },() => {
  //     fetch(this.data.shopInfo.id, this.data.source)
  //   })
  },



/*-----    公共   -----*/
  // 转表单对象为数组
  formatObjTooArr(obj, type) {
    let copy = {}
    Object.keys(obj).forEach(key => copy[key] = obj[key] )
    copy.created_at = format.timeFormat(copy.created_at,'yyyy-MM-dd hh:mm:ss')
    copy.leads_status = leads_statusBox[copy.leads_status]
    copy.potentialStatus = obj.potentialStatus === 'noCo' ? '未合作' : '已合作'
    if (type === 'isProfile' ) {
      copy.latestOrderAt = format.timeFormat(copy.latestOrderAt,'yyyy-MM-dd hh:mm:ss')
      customersConfig.forEach(item => {
        for(let key in copy) { if(key ===  item.key) { item.value = copy[key]; } }
      })
      return customersConfig
    } else {
      shopInfoConfig.forEach(item => {
        for(let key in copy) { if(key ===  item.key) { item.value = copy[key]; } }
      })
      return shopInfoConfig
    }
  },

  // 初始化数据
  init(query) {
    this.setData({query: query, source: query.source || 'myVisit', active: 'visit', shopInfoArray: shopInfoConfig})
    this.getMerchantDetailData(query.id, query.source)
    this.getMerchantVisitData(query.id, query.source)
    switch (query.source) {
      case 'myVisit': my.setNavigationBar({title: '线索详情'}); break;
      case 'maintain': my.setNavigationBar({title: '潜在客户详情'}); break;
      case 'valuisProfilee': my.setNavigationBar({title: '合作客户详情'}); break;
    }
  },


/*-----   生命周期   ----- */
  onLoad(query) {
    console.log("query",query);
    let id = query.id
    let source = query.source
    this.init({id, source})
  },

  onUnload() {
  },

  // 防止数据未清除导致二尺加载 IOS有此问题  并且onUnload可能不起作用
  clear() {
    this.setData({
      shopInfo: {}, // 客户信息
      shopInfoArray: [], // 存放表单Label与编导值
      visitInfo: [], // 拜访记录
      visitInfoCache: [], // 拜访记录缓存
      facadeList: [], // 门店列表
      facadeListCache: [], // 门店列表缓存
      count: 0, // 拜访记录总数
      page: 1, // 当前页
      perPage: 5, // 煤业条数
      active: '', // 当前tab visit || facade
      source: '', //  // 我的拜访：myVisit，我的维护：maintain，客户档案 ：isProfile
      merchantTypes: merchant_typeBox,
      leads_statusBox: leads_statusBox,
      query: [] // 路由参数
    })
  }
})