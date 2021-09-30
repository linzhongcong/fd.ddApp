import { searchProducts,getProductTypes } from '/api/sign/index'

Page({
  data: {
    showFilter: false, // 筛选开关
    productTypes: [], // 产品类目
    filterList: [], // 筛选条件数组
    
    page: 1,
    perPage: 20,
    pageCount: 0,
    value: '', // 搜索值
    products: [], // 当前卡片列表
    productsCache: [], // 选中卡片列表
  },
  

  // onReachBottom() {
  //   console.log("onReachBottom");
  //   const page = this.data.page + 1
  //   this.searchProducts(page)
  // },

  getMoreData() {
    console.log("onReachBottom");
    const page = this.data.page + 1
    this.fetchhProducts(page)
  },

  checkSelected(list) {    
    const productsCache = this.data.productsCache
    productsCache.forEach(item => {
      list.forEach(lis => {
        if (lis.id === item.id) lis.selected = item.selected;
      })
    })
    return list
  },
  
  /*-----------------------------  筛选组件  -----------------------------*/
  // 筛选开关
  showFilter() {
    this.setData({ showFilter: !this.data.showFilter})
  },
  
  // 多选时提交选中回调
  handleFilterChange(e) {
    console.log(e)
    let productTypes = this.data.productTypes
    e.forEach(item => {
      productTypes.forEach(type => {
        if (item.id === type.id) type.selected = true;
      })
    })
    this.setData({productTypes, showFilter: false, page: 1}, () => {
      this.fetchhProducts()
    })
  },

  // 筛选项点击
  onReset(e) {
    let productTypes = this.data.productTypes
    productTypes.forEach(item => {
      item.selected = false
    })
    this.setData({productTypes})
  },

  // 删选关闭
  handleFilterClose() {
    // this.setData({ showFilter: false})
    // my.showToast({content: '请点击确定'})
  },

  /*----------------------------- 搜索  -----------------------------*/

  // 搜索框输入
  handleInput(value) {
    console.log(value)
    this.setData({value: value}, () => {
      this.fetchhProducts()
    })
  },
  
  // 搜索清空
  handleClear() {
    this.setData({value: ''})
  },

  // 搜索取消
  handleCancel() {
    this.setData({value: ''}, () => {
      this.fetchhProducts()
    })
  },

  // 手机键盘右下角的确认键 
  handleSubmit(value) {
    console.log(value)
    this.setData({value: value}, () => {
      this.fetchhProducts()
    })
  },

  // 卡片选择
  handleCheckboxChange(e) {
    console.log(e)
    let items = e.currentTarget.dataset.item, selected = e.detail.value , list = []
    , products = this.data.products , productsCache = this.data.productsCache

    if (selected) {
      items.selected = true
      products.forEach(pitem => { if (pitem.id === items.id) pitem.selected = true; })
      list = productsCache.filter(pcitem => pcitem.id !== items.id)
      list.push(items)
    } else {
      items.selected = false
      list = productsCache.filter(pcitem => pcitem.id !== items.id)
    }
    this.setData({products, productsCache: list})
    
  },

  onCancelSelected() {
    let products = this.data.products;
    for (let index = 0; index < products.length; index++) {
      products[index].selected = false;
    }
    this.setData({products, productsCache: []})
  },

  onComfirmSelected() {
    let products = this.data.productsCache
    my.setStorage({key: 'products', data: products}).then(res => {
      my.navigateBack()
    })
  },
  
  // 搜索产品
  fetchhProducts(page) {
    let params = {productName: '', categoryIds: ''}
    params.page = page ? page : 1
    params.perPage = 20
    const productTypes =  this.data.productTypes
    let str = ""
    if (productTypes.length > 0) {
      productTypes.forEach(item => {
        if (item.selected) str = str + item.id + ','
      })
      params.categoryIds = str.substr(0, str.length-1)
    }
    params.productName = this.data.value
    my.showLoading({content: '加载中...'})
    if (page) {
      searchProducts(params).then(res => {
        let data = res.data.data, list = data.list, _products = this.data.products;
        if (list.length > 0) list.forEach(item => { item.selected = false });
        if (list.length > 0) list = this.checkSelected(list);
        const products = [].concat(_products, list), pageCount = data.count;
        this.setData({products, pageCount})
        my.hideLoading()
      }).catch(err => {
        my.hideLoading()
        my.showToast({content: `${err.data.msg}`})
      })
    } else {
      searchProducts(params).then(res => {
        let data = res.data.data, list = data.list
        if (list.length > 0) list.forEach(item => { item.selected = false });
        if (list.length > 0) list = this.checkSelected(list);
        const products = list, pageCount = data.count;
        this.setData({products, pageCount})
        my.hideLoading()
      }).catch(err => {
        my.hideLoading()
        my.showToast({content: `${err.data.msg}`})
      })
    }
  },

  // 获取产品类目
  fetchProductTypes() {
    getProductTypes().then(res => { 
      let _data = res.data.data
      for (let index = 0; index < _data.length; index++) {
        _data[index].selected = false         
      }
      this.setData({productTypes: _data})
    })
  },

  initLoad() {
    this.fetchProductTypes()
    this.fetchhProducts()
  },

  onLoad() {
    this.initLoad()
  },
});
