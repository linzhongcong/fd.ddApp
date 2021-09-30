import { merchantSuccessVist } from '/api/merchant/index'
Page({
  data: {
    conformBtnActive: false, // 确定按钮是否激活

    shopList: [], // 常访问的前六条客户数据
    districtList: [], // 地区数据
    merchantType: [
      // 类型
      { value: 'cs', name: 'CS', checked: false },
      { value: 'ka', name: 'KA', checked: false },
      { value: 'otc', name: 'OTC', checked: false },
      { value: 'store', name: '便利店', checked: false },
      { value: 'other', name: '其他', checked: false },
      { value: 'csDealers', name: 'CS经销商', checked: false },
      { value: 'kaDealers', name: 'KA经销商', checked: false },
      { value: 'newRetailing', name: '新零售', checked: false}
    ],

    selectshopList: [], // 已选择客户
    selectTypeList: [], // 已选择类型
    selectDistrictList: [], // 已选择地区
  },

  // 页面跳转
  handleJumpPageClick(e) {
    const { type, page } = e.currentTarget.dataset
    const url =
      type === 'district'
        ? '../district-filter/district-filter'
        : `../filter/filter?page=${page}`
    my.navigateTo({ url })
  },

  // 客户名称
  handleSlectShopClick(e) {
    let { shopList, selectshopList } = this.data
    const { index, show } = e.currentTarget.dataset

    shopList.forEach((item, idx) => idx === index && (item.isShow = !show))
    selectshopList = shopList
      .map(({ name, isShow }) => (isShow ? name : ''))
      .filter((item) => item !== '')
    this.setData({ shopList, selectshopList })
  },

  // 类型选择
  handlePickerTypeChange(e) {
    let { merchantType, selectTypeList } = this.data
    const { value } = e.detail

    merchantType.forEach(
      (item) => item.name === value && (item.checked = !item.checked)
    )
    selectTypeList = merchantType
      .map(({ checked, name }) => (checked ? name : ''))
      .filter((item) => item !== '')
    this.setData({ merchantType, selectTypeList })
  },

  // 地区选择
  handleSelectDistrictClick(e) {
    const { index, checked } = e.currentTarget.dataset
		let { districtList } = this.data
		
    districtList.forEach((item, idx) => {
      index === idx && (item.checked = !checked)
		})
		
    const selectDistrictList = districtList
      .map(({ address, checked }) => (checked ? address : ''))
      .filter((item) => item)

    this.setData({ districtList, selectDistrictList })
  },

  // 重置按钮
  handleResetBtnClick() {
    const { merchantType, shopList, districtList } = this.data
    merchantType.forEach((item) => (item.checked = false))
    shopList.forEach((item) => (item.isShow = false))
    districtList.forEach((item) => (item.checked = false))

    this.setData({
      merchantType,
      shopList,
      districtList,
      selectTypeList: [],
      selectshopList: [],
      selectDistrictList: [],
    })
  },

  // 确定按钮
  handleConfirmBtnClick() {
    const { selectshopList, selectTypeList, selectDistrictList } = this.data
    my.setStorage({
      key: 'merchantFilterParams',
      data: { selectshopList, selectTypeList, selectDistrictList },
    })
    // my.navigateTo({ url: '../merchant' })
    my.navigateBack();
  },

  // 获取用户拜访客户列表
  getShopListData() {
    // 这个操作让人窒息，
    this.setData({ shopList: [] })
    const { shopList } = this.data
    merchantSuccessVist({ type: 'partly' })
    .then(({ data: { code, data } }) => {
      if (code === 0) {
        my.hideLoading()
        data.forEach(
          (item, key) =>
            key <= 5 && shopList.push({ name: item, isShow: false })
        )
        this.setData({ shopList })
      }
    })
  },

  onLoad() {
    const that = this
    // console.log('onLoad')
    this.getShopListData()

    // 每次打开客户筛选页面的时候
    my.getStorage({
      key: 'merchantFilterParams',
      success({ data }) {
        that.setData({
          selectshopList: data ? data.selectshopList : [],
          selectTypeList: data ? data.selectTypeList : [],
          selectDistrictList: data ? data.selectDistrictList : [],
        })
      },
    })
  },

  onShow() {
    const that = this
    const { shopList } = this.data

    // 客户缓存数据
    my.getStorage({
      key: 'merchantList',
      success({ data }) {
        if (data) {
          data.forEach((item) =>
            shopList.forEach(
              (list) => (list.isShow = list.name === item ? true : false)
            )
          )
          that.setData({ selectshopList: data, shopList })
        }
      },
    })

    // 地区缓存 - 最近访问
    my.getStorage({
      key: 'districtList',
      success({ data }) {
        if (data) {
          that.setData({
            districtList: data
              .map((item, index) => {
                if (index < 3) return { address: item, checked: false }
              })
              .filter((item) => item),
          })
        }
      },
    })

    // 地区缓存 - 已选择
    my.getStorage({
      key: 'selectedDistrictList',
      success({ data }) {
        if (data) {
          that.setData({ selectDistrictList: data })
        }
      },
    })
  },
})
