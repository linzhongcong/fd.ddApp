
import { debounce } from '/utils/other'
import { searchStore, searchShop } from '/api/merchant'

Component({
  mixins: [],
  data: {
    scrollFlag: false, // 由于滚动后点击listItem仍然会触发滚动事件因此加设开关控制触发
    currentSearchType: 'merchant', // 当前搜索类型
    
    merchant: {}, // 合作商客户
    merchantVal: '',  // 客户搜索内容
    merchantList: [], // 合作商列表
    merchantPage: 1,  // 客户信息当前页
    merchantPageSize: 20, // 客户信息当前页每页数量

    store: {}, // 门店
    storeVal: '', // 门店搜索内容
    storeList: [], // 门店列表
    storePage: 1, 
    storePageSize: 20,
  },

  props: {
    show: false, // 是否显示
    signType: '', // 当前签到类型
    onlyShop: false, // 只搜索客户
    onlyStore: false, // 只搜索门店
    merchantName: '' , // 当前商户
    contractorId: '', // 客户的合作商ID
    supplementFace: false, // 是否需要门店补录
  },

  didMount() {
    const {onlyStore, supplementFace, signType, onClose, onReceive, onSupplementFace} = this.props
    const {merchantName, contractorId} = this.data.merchant
    if (!(signType && onClose && onReceive)) throw new Error("onClose && onReceive is required")
    if (onlyStore) this.onlyStore(contractorId, merchantName)
    if (supplementFace && !onSupplementFace && !contractorId) throw new Error("contractorId && onSupplementFace is required")
  },

  didUpdate() {},

  didUnmount() {},
  
  methods: {
  // 返回
  onClose() { this.props.onClose() },

  // 清空搜索
  onClear() {
    if (this.data.currentSearchType === 'store' ) {
      this.setData({storeVal: '', store: {}, storeList: [], storePage: 1})
    } else {
      this.setData({merchantVal: '', merchant: {}, merchantList: [], merchantPage: 1})
    }
  },

  // 占位，点击清除客户信息，从客户信息开始搜索
  shopClear() {
    this.setData({
      merchantVal: '', merchant: {}, merchantList: [], merchantPage: 1,
      storeVal: '', store: {}, storeList: [], storePage: 1,
      currentSearchType: 'merchant'
    })
  },

  // 输入事件  500棉猴请求
  onInput(value) {
    console.log('onInput');
    let { currentSearchType, merchant}= this.data
    // 先要进行客户筛选，选择往完后自然用用了合作商ID
    if (currentSearchType === 'store') {
      this.setData({storeVal: value, store: {}, storeList: [], storePage: 1})
      this.fetchStore(merchant.id, value)
    } else {
      this.setData({scrollFlag: false, merchantVal: value, merchant: {}, merchantList: [], merchantPage: 1})
      this.fetchShop(value)
    }
  },

  // 搜搜结果点击
  onChooseItem(e) {
    console.log("onChooseItem",e);  
    let current = e.target.dataset.item, type = e.target.dataset.type
    if (type === 'store') {
      this.setData({storeVal: current.name, currentSearchType: '', store: current}, ()=> {
        this.props.onClose()
        this.props.onReceive({shop: this.data.merchant, store: this.data.store})
      })
    } else {
      if (this.props.onlyShop) {
        this.props.onReceive({shop: current})
        return this.props.onClose() // 若只需要商家的话则返回
      }
      this.setData({merchantVal: current.merchantName, scrollFlag: false, currentSearchType: 'store', merchant: current}, () => {
        this.fetchStore(current.id, '')
      })
    }
  },

  // 只搜索门店
  onlyStore(contractorId, merchantName) {
    this.setData({merchantVal: merchantName, currentSearchType: 'store', storeList: []})
    this.fetchStore(contractorId, '')
  },

  // 门店补录、
  onSupplementFace() {     
    this.props.onSupplementFace()
  },
  
  onScrollToLower() {
    const {currentSearchType, storePage, merchant, storeVal, scrollFlag} = this.data
    if (currentSearchType === 'store' && scrollFlag) {
      this.setData({storePage: storePage + 1}, () => {
        this.fetchStore(merchant.id, storeVal)
      })
    }
  },
  
/* -----------------------------  fetch data ----------------------------- */
  // 合作商信息
  fetchShop: debounce('debounce_searchShop'),
  debounce_searchShop(name) {
    // const { merchantPage,merchantPageSize } = this.data
    // let params = {name, type: this.props.signType, page: merchantPage, perPage: merchantPageSize}
    let merchantList = this.data.merchantList 
    let params = {name, type: this.props.signType}
    searchShop(params).then(res => {
      let _list = [].concat(merchantList, res.data.data)
      this.setData({merchantList: _list })
    }).catch(err => {
      console.log(err.data.msg)
    })
  },

  // 门店搜索
  fetchStore: debounce('debounce_searchStore'),
  debounce_searchStore(contractorId, name) {
    const {storePage, storePageSize, storeList, scrollFlag} = this.data
    let params = {contractorId, name, page: storePage, perPage: storePageSize}
    searchStore(params).then(res => {
      let _list = [].concat(storeList, res.data.data.list)
      /*
      当scroll-view滚动后点击客户listItem时，会触发一次滚动函数，而此处要配合防抖函数执行
      因此设置只有当fetchStore被首次调用时才开启下拉加载，以避免连续调用而终止门店的获取
      */
      if (scrollFlag)  this.setData({storeList: _list})
      else this.setData({storeList: _list, scrollFlag: true})
    }).catch(err => {
      console.log(err.data.msg)
    })
  },

  },
});
