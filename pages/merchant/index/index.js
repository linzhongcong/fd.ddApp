import format from '/utils/common/js/format'
import Glabol from '/Global'
import { merchantList,collectAct,collectCancel,receive,receiveCancel } from '/api/merchant/index'

// let app = getApp()
let app = new Glabol()

const merchant_typeBox = {
// 客户类型：cs-CS，csDealers-CS经销商，kaDealers-KA经销商，ka-KA，otc-OTC，store-便利店，other-其他
  "cs": "CS",
  "csDealers": "CS经销商",
  "kaDealers": "KA经销商",
  "ka": "KA",
  "otc": "OTC",
  "store": "便利店",
  "other": "其他",
  'newRetailing': '新零售'
} 

const leadsStatusBox = {
  "waitFollow": "待跟进",
  "inFollow": '跟进中',
  "converted": '已转换',
  "repea": '重复线索',
}

const pickers = [
  { value: 'own', label: '我负责的'},
  { value: 'all', label: '全部'}
]

const tabs = [
  {
    value: 'myVisit',
    title: '销售线索',
    merchantTabActived: false,
  },
  {
    value: 'maintain',
    title: '潜在客户',
    merchantTabActived: false,
  },
  {
    value: 'isProfile',
    title: '合作客户',
    merchantTabActived: false,
  },
]
// eads-线索（默认），potential-潜在客户，cooperation-合作客户

Page({
  data: {
    /* tabs标签页 */
    tabs: [],
    activeTab: 0, // 当前tab索引
    currentTab: '', // 当前tab
    /* filter */ 
    keyword: '', // 搜索i框   
    filter: [],
    showFilter: false,
    isFilterBtnActive: false, // 筛选按钮激活
    merchantRegionfilter: '', // 删选回来的地区
    merchantTypefilter: '',  // 上旋回4来的客户类型 以上数据多文本用,号    
    chooseMerchantfilter: [], // 选择的客户  赛选回来的客户id 
    pickers: [],
    pickerIndex: 0,
    picker: '', // 当前选择项  我负责的/全部
    /* 销售线索 */
    eadsPage: 1, 
    eadsPerPage: 10,
    eadsTotal: 0,
    eadsList: [],
    eadsListCache: [],
    /* 潜在客户 */
    potentialPage: 1,
    potentialPerPage: 10,
    potentialTotal: 0,
    potentialList: [],
    potentialListCache: [],
    /* 合作客户 */
    cooperationPage: 1,
    cooperationPerPage: 10,
    cooperationTotal: 0,
    cooperationList: [],
    cooperationListCache: [],
    /* 其他 */
    merchantTypes: [], // 客户类型
    merchantTypesObj: {},
    merchantTypeIndex: 0,
    merchantType: '', 
    leadsStatusBox: leadsStatusBox, // 状态
    hasOnshow: true, // 避免onshow执行两次问题
    touches: [],
    canFilter: false
  },


  handleInput(value) {
    this.setData({keyword: value})
  },

  handleClear(e) {
    this.setData({value: ''})
  },

  handleSubmit(e) {
    this.setData({keyword: e})
  },


  /* tabs相关 */
  // tab 被点击的回调 ：(index: Number，tabsName：String) => void
  handleTabClick(e) {
    // console.log("handleTabClick",e);
    let that = this
    this.setData({
      activeTab: e.index,
      currentTab: this.data.tabs[e.index].value,
      eadsPage: 1, 
      eadsPerPage: 10,
      eadsTotal: 0,
      eadsList: [],
      eadsListCache: [],
      potentialPage: 1,
      potentialPerPage: 10,
      potentialTotal: 0,
      potentialList: [],
      potentialListCache: [],
      cooperationPage: 1,
      cooperationPerPage: 10,
      cooperationTotal: 0,
      cooperationList: [],
      cooperationListCache: [],
    },()=>{
      that.handleTabChangeSelf(e)
    })
  },

/*-----------------------   交互逻辑     -----------------------*/

  // icon 被点击时的回调 () => {}
  handlePlusClick(e) {
    // console.log("handlePlusClick",e);
    switch(e.index) {
      case 0 : this.fetchDataEads(); break;
      case 1: this.fetchDataPotential(); break;
      case 2: this.fetchDataCooperation(); break;
    }
  },

  // tab 变化时触发。(index: Number，tabsName：String) => void
  handleTabChangeSelf(e) {
    // console.log("handleTabChange",e);
    switch(e.index) {
      case 0 : this.fetchDataEads(); break;
      case 1: this.fetchDataPotential(); break;
      case 2: this.fetchDataCooperation(); break;
    }
  }, 

  // 收藏事件处理
  handlerCollect(e) {
    // console.log(e)
    const current = e.currentTarget.dataset
    collectAct(current.item.id).then(res => {
      my.showToast({content: '收藏成功'})
      this.handelerCollectReact(current.type,res.data.data.id,res.data.data.associateId)
    }).catch(err => {
      console.log("收藏失败；",err);
      my.showToast({content: `收藏失败；${err.data.msg}`})
    })
  },

  // 收藏本地响应 type: leads potential cooperation
  handelerCollectReact(type, id, associateId) {
    // console.log("type",id,associateId,this.data.eadsListCache);
    // eads ListCache
    let dataName = type.toString().trim() +'ListCache'
    let list = this.data[dataName]
    // console.log("eadsList",list,this);
    list.forEach(item =>{
      // console.log("item", item.id, id);
      if(item.id == id) {item.associateId = associateId};
    })
    // console.log("handelerCollectReact",list);
    this.setData({
      eadsList: list
    })
  },

  // 取消收藏
  handlerCollectCancel(e) {
    const current = e.currentTarget.dataset
    collectCancel(current.item.id).then(res => {
      my.showToast({content: '取消收藏成功'})
      this.handelerCollectReactCancel(current.type,current.item.id,0)
    }).catch(err => {
      my.showToast({content: `取消收藏失败；${err.data.msg}`})
    })
  },

  // 取消收藏相应函数
  handelerCollectReactCancel(type, id, associateId) {
    console.log("type",type,id,associateId);
    let dataName = type+'ListCache'
    let list = this.data[dataName]
    list.forEach(item =>{
      // console.log("handelerCollectReactCancel",item,id);
      if(item.id == id) { item.associateId = 0 };
    })
    console.log("handelerCollectReact",list);
    this.setData({
      eadsList: list
    })
  },

  // 领取事件处理
  handlerReceive(e) {
    console.log(e)
    const current = e.currentTarget.dataset
    receive(current.item.id).then(res => {
      my.showToast({content: '领取成功'})
      this.handlerReceiveReact(current.type,res.data.data.id,res.data.data.salesmanId)
    }).catch(err => {
      console.log("收藏失败；",err);
      my.showToast({content: `领取失败；${err.data.msg}`})
    })
  },

  // 收藏本地响应 type: leads potential cooperation
  handlerReceiveReact(type, id, salesmanId) {
    console.log("type",id,salesmanId,this.data.potentialList);
    // eads ListCache
    let dataName = type.toString().trim() +'ListCache'
    let list = this.data.potentialListCache
    console.log("eadsList",list,this);
    list.forEach(item =>{
      // console.log("item", item.id, id);
      if(item.id == id) {item.salesmanId = salesmanId};
    })
    console.log("handlerReceiveReact",list);
    this.setData({
      potentialList: list
    })
  },

  // 回退时间处理
  handlerReceiveCancel(e) {
    const current = e.currentTarget.dataset
    receiveCancel(current.item.id).then(res => {
      my.showToast({content: '回退成功'})
      this.handlerReceiveReactCancel(current.type,current.item.id,0)
    }).catch(err => {
      my.showToast({content: `回退失败；${err.data.msg}`})
    })
  },

  // 回退相应函数
  handlerReceiveReactCancel(type, id, salesmanId) {
    console.log("type",type,id,salesmanId);
    let dataName = type+'ListCache'
    let list = this.data.potentialListCache
    list.forEach(item =>{
      // console.log("handelerCollectReactCancel",item,id);
      if(item.id == id) { item.salesmanId = 0 };
    })
    console.log("handlerReceiveReactCancel",list);
    this.setData({
      potentialList: list
    })
  },

  // 去拜访
  handleJumpVisit(e) {
    // 数据类型不同。拜访类型不同    
    let sourceMap = { isProfile: 'maintain', maintain: 'return_visit', myVisit: 'return_visit'}
    , url = `/pages/sign-in/index/index`
    , signType =  sourceMap[this.data.currentTab]
    , current =  e.currentTarget.dataset.item 
    , shopInfo = {id: current.id}
    my.navigateTo({ url: `${url}?signType=${signType}&shopInfo=${JSON.stringify(shopInfo)}` })
  },

  // 详情 
  handleJumpDetail(e){
    let current = e.currentTarget.dataset
    , url = '/pages/merchant/merchant-detail/merchant-detail'
    , source = this.data.currentTab
    , id = current.item.id
    my.navigateTo({ url: `${url}?id=${id}&source=${source}`})
  },

  onAdd() {
    let url = `/pages/sign-in/index/index` , signType = 'street_worship'
    my.navigateTo({ url: `${url}?signType=${signType}`})
  },

  /* filter */
  // 筛选picker点击事件
  pickerClick(e) {
    // console.log("pickerClick",e);
    let that = this
    let index = e.currentTarget.dataset.index
    this.setData({
      pickerIndex: index,
      picker: pickers[index].value,
      eadsPage: 1, 
      eadsPerPage: 10,
      eadsTotal: 0,
      eadsList: [],
      eadsListCache: [],
      cooperationPage: 1,
      cooperationPerPage: 10,
      cooperationTotal: 0,
      cooperationList: [],
      cooperationListCache: [],
      potentialPage: 1,
      potentialPerPage: 10,
      potentialTotal: 0,
      potentialList: [],
      potentialListCache: [],
    },() => {
      that.handleTabChangeSelf({index: that.data.activeTab})
    })
  },

  // 负责/我的 筛选
  onPickerChange(e) {
    let that = this
    this.setData({
      pickerIndex: e.detail.value,
      picker: pickers[e.detail.value].value,
      eadsPage: 1, 
      eadsPerPage: 10,
      eadsTotal: 0,
      eadsList: [],
      eadsListCache: [],
      cooperationPage: 1,
      cooperationPerPage: 10,
      cooperationTotal: 0,
      cooperationList: [],
      cooperationListCache: [],
      potentialPage: 1,
      potentialPerPage: 10,
      potentialTotal: 0,
      potentialList: [],
      potentialListCache: [],
    },() => {
      that.handleTabChangeSelf({index: that.data.activeTab})
    })
  },

  // 筛选页筛选
  onFilter() {    
    this.setData({showFilter: true})
  },
  
  onCancelFilter() {
    this.setData({showFilter: false})
  },

  onTouchStart(e) {
    // console.log("onTouchStart",e);
    const touches = e.changedTouches[0]
    this.setData({touches})
  },
  
  
  onTouchEnd(e) {
    // console.log("onTouchEnd",e);
    const changedTouches = e.changedTouches[0] , touches = this.data.touches
    if (changedTouches.clientX - touches.clientX > 0) {
      this.setData({showFilter: false})
    }
  },
  


  /*--------------------------   数据拉取fetch data  ---------------------*/
  fetchDataEads(pageparams) {
  my.showLoading({ content: '加载中...' })
  let that = this, params = {};
  // source = my.getStorageSync({ key: 'source' }).data ? my.getStorageSync({ key: 'source' }).data : 'myVisit' 
  params.page = pageparams !== undefined ? pageparams : this.data.eadsPage
  params.source = this.data.currentTab
  params.belongTo = this.data.picker
  // params.keyword = this.data.keyword
  // params.merchantNames = this.data.chooseMerchantfilter
  params.merchantRegion = this.data.merchantRegionfilter
  params.merchantType = this.data.merchantTypefilter
  for (const [key, value] of Object.entries(params)) {
    if ((!value || (value instanceof Array && !value.length) )) {
       delete params[key]
    }
  }
  console.log('销售线索请求参数',params);

  merchantList(params).then((res) => {
    // console.log("销售线索请求成功",res);
    my.hideLoading()
    if (res.data.code === 0) {
      let resList = res.data.data.list
      let eadsListCache = that.data.eadsListCache
      resList.forEach(item => {
        item.signin_at = format.timeFormat(item.createdAt,'yyyy-MM-dd hh:mm:ss')
      })
      if (pageparams) {
        console.log("page");
        eadsListCache = [].concat(eadsListCache,resList)
      } else {
        eadsListCache = resList
      }

      that.setData({
        eadsList: eadsListCache,
        eadsListCache: eadsListCache,
        eadsPage: res.data.data.page,
        eadsTotal: res.data.data.count,
      })
    }
  })
  .catch((err) => {
    my.hideLoading()
    my.showToast({ type: 'fail', content: '没有客户数据', duration: 3000 })
  })
  // this.setData({currentTab: source })
  },

  // 潜在客户
  fetchDataPotential(pageparams) {
  my.showLoading({ content: '加载中...' })
  let that = this, params = {};
  // source = my.getStorageSync({ key: 'source' }).data ? my.getStorageSync({ key: 'source' }).data : 'myVisit' 
  params.page = pageparams !== undefined ? pageparams : this.data.potentialPage
  params.source = this.data.currentTab
  params.belongTo = this.data.picker
  // params.keyword = this.data.keyword
  // params.merchantNames = this.data.chooseMerchantfilter
  params.merchantRegion = this.data.merchantRegionfilter
  params.merchantType = this.data.merchantTypefilter
  for (const [key, value] of Object.entries(params)) {
    if ((!value || (value instanceof Array && !value.length) )) {
       delete params[key]
    }
  }
  console.log('销售线索请求参数',params);

  merchantList(params).then((res) => {
    // console.log("潜在客户请求成功",res);
    my.hideLoading()
    if (res.data.code === 0) {
      let resList = res.data.data.list
      let potentialListCache = that.data.potentialListCache
      resList.forEach(item => {
        item.signin_at = format.timeFormat(item.createdAt,'yyyy-MM-dd hh:mm:ss')
      })
      if (pageparams) {
        potentialListCache = [].concat(potentialListCache,resList)
      } else {
        potentialListCache = resList
      }
      
      that.setData({
        potentialList: potentialListCache,
        potentialListCache: potentialListCache,
        potentialPage: res.data.data.page,
        potentialTotal: res.data.data.count,
      })
    }
  })
  .catch((err) => {
    my.hideLoading()
    my.showToast({ type: 'fail', content: '没有客户数据', duration: 3000 })
  })
  },

  // 合作客户
  fetchDataCooperation(pageparams) {
  my.showLoading({ content: '加载中...' })
  let that = this, params = {};
  // source = my.getStorageSync({ key: 'source' }).data ? my.getStorageSync({ key: 'source' }).data : 'myVisit' 
  params.page = pageparams !== undefined ? pageparams : this.data.cooperationPage
  params.source = this.data.currentTab
  // params.belongTo = this.data.picker
  params.belongTo = 'own'
  // params.keyword = this.data.keyword
  // params.merchantNames = this.data.chooseMerchantfilter
  // params.merchantRegion = this.data.merchantRegionfilter
  params.merchantType = this.data.merchantTypefilter
  for (const [key, value] of Object.entries(params)) {
    if ((!value || (value instanceof Array && !value.length) )) {
       delete params[key]
    }
  }
  // console.log('销售线索请求参数',params);
  merchantList(params).then((res) => {
    // console.log("潜在客户请求成功",res);
    my.hideLoading()
    if (res.data.code === 0) {
      let resList = res.data.data.list
      let cooperationListCache = that.data.cooperationListCache
      resList.forEach(item => {
        item.signin_at = format.timeFormat(item.createdAt,'yyyy-MM-dd hh:mm:ss')
      })
      // console.log("cooperationListCache",cooperationListCache);
      if (pageparams) {
        cooperationListCache = [].concat(cooperationListCache,resList)
      } else {
        cooperationListCache = resList
      }
      
      // console.log("cooperationListCache",cooperationListCache);
      that.setData({
        cooperationList: cooperationListCache,
        cooperationListCache: cooperationListCache,
        cooperationPage: res.data.data.page,
        cooperationTotal: res.data.data.count,
      })
    }
  })
  .catch((err) => {
    my.hideLoading()
    my.showToast({ type: 'fail', content: '没有客户数据', duration: 3000 })
  })
  },

  // 统一数据获取
  fetchData() {
    const currentTab = this.data.currentTab
    switch (currentTab) {
      case 'myVisit':
        this.fetchDataEads()
      break;
      case 'maintain':
        this.fetchDataPotential()
      break;
      case 'isProfile':
        this.fetchDataCooperation()
      break;
    }
  },

  /*------------------------------  公共   ---------------------------*/
  // 与后台约定筛选条件  merchantType 客户类型 merchantRegion 客户地区 merchantKind 客户Id 用逗号分割
  formatFilterResult(filterParams) {
  let chooseMerchant = filterParams.selectshopList || [], // 筛选的商列表
      merchantRegion = filterParams.selectDistrictList || [],//  赛选的客户地区
      selectTypeList = filterParams.selectTypeList || [] // 筛选的客户类型
  chooseMerchant = chooseMerchant.length > 0 ? chooseMerchant.join(',') : []
  merchantRegion = merchantRegion.length > 0 ? merchantRegion.map((item) => item.replace(/-/gi, '')).join(',') : []
  selectTypeList = selectTypeList.length > 0 ? this.matchShopTypeValue(selectTypeList).join(',') : []
  return { chooseMerchant, merchantRegion, selectTypeList}
  },

  // 转换客户类型表单值
  matchShopTypeValue(arr) {
    let temp = app.shopTypes.slice(0),   obj = {},   list = []
    temp.forEach(item => { obj[item.label] = item.value })
    list = arr.map(item => obj[item])
    return list
  },

  /* 页面级事件 */
  onReachBottom() {
    // console.log(this.data.currentTab);
    switch (this.data.currentTab) {
      case 'myVisit':
        this.fetchDataEads(this.data.eadsPage + 1)
      break;
      case 'maintain':
        this.fetchDataPotential(this.data.potentialPage + 1)
      break;
      case 'isProfile': 
        this.fetchDataCooperation(this.data.cooperationPage + 1)
      break;
    }
    // console.log("onReachBottom");
  },

  onPullDownRefresh() {
    // console.log("onPullDownRefresh");
  },

  resetData() {
    this.setData({
    // activeTab: '', // 当前tab索引
    // currentTab: '', // 当前tab
    /* filter */    
    filter: [],
    // isFilterBtnActive: false, // 筛选按钮激活
    isFilter: false, // 控制筛选状态文案样式
    idfilter: '', // 赛选回来的客户id 
    merchantRegion: '', // 删选回来的地区
    merchantType: '',  // 上旋回4来的客户类型 以上数据多文本用,号
    // chooseMerchantfilter: [], // 选择的客户
    // pickerIndex: 0
    // picker: '', // 当前选择项
    /* 销售线索 */
    eadsPage: 1, 
    eadsPerPage: 10,
    eadsTotal: 0,
    eadsList: [],
    eadsListCache: [],
    /* 潜在客户 */
    potentialPage: 1,
    potentialPerPage: 10,
    potentialTotal: 0,
    potentialList: [],
    potentialListCache: [],
    /* 合作客户 */
    cooperationPage: 1,
    cooperationPerPage: 10,
    cooperationTotal: 0,
    cooperationList: [],
    cooperationListCache: [],
    /* 其他 */
    merchantTypeIndex: 0,
    merchantType: '', 
    hasOnshow: true, // 避免onshow执行两次问题
    })
  },

  // 重置
  reset() {
    my.removeStorageSync({
      key: 'selectedDistrictList',
    })

    my.removeStorage({
      key: 'merchantList',
    })

    my.removeStorage({
      key: 'chooseMerchant',
    })

    my.removeStorage({
      key: 'merchantFilterParams',
    })
  },
  
  initLoad() {
    this.setData({
      tabs,
      pickers,
      picker: 'own',
      activeTab: 0,
      currentTab: 'myVisit',
      merchantTypes: app.shopTypes.slice(0),
      merchantTypesObj: merchant_typeBox,
    })
  },

  initShow() {
    if (this.data.activeTab === 1)  {
      this.fetchDataPotential()
    } else if ( this.data.activeTab === 2) {
      this.fetchDataCooperation()
    } else {
      this.fetchDataEads()
    }
  },
/*------------------------------- -  生命周期   -------------------------*/
  onLoad() {
    this.initLoad()
  },
  onReady() {
    setTimeout(() => {
      this.setData({canFilter: true})
    },500)
  },
  onShow() {
    this.initShow()
  },
  onHide(){
    this.resetData()
    this.reset()
  }

})
