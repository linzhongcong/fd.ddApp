Page({
  data: {
    selectDistrictList: {
      trueSlectedDistrictList: [],
      provinceList: [],
      cityList: [],
      areaList: []
    },
    isReset: false,
    isOpenShopModal: false,
    userPickerList: [],
  },

  // 获取组件传过来的已选择地区
  handleChangeDistrictClick(list) {
    const that = this
    let {  selected, province, city, area, isProvince, isCity, isArea } = list
    let { selectDistrictList, userPickerList } = this.data
    let { provinceList, cityList, areaList } = selectDistrictList

    this.setData({ isReset: false })
    !provinceList.length && this.setData({ 'selectDistrictList.trueSlectedDistrictList': [] })

    // 第一次点击 selected : true 添加
    // 第二次点击 selected  移除点击的相同项
    if(list.selected){
      this.setData({ userPickerList: [...userPickerList, list] })
    } else if(this.data.userPickerList.length && !list.selected) {
    
     userPickerList.forEach(item => {
        let tempList = []
        if(list.isProvince) {
          tempList = this.data.userPickerList.filter(item => item.province !== list.province)
        } else if (list.isCity){
          tempList = this.data.userPickerList.filter(item => item.city !== list.city)
        } else {
          tempList = this.data.userPickerList.filter(item => item.area !== list.area)
        }
        this.setData({ userPickerList: tempList })
     })
    }

    const pickList = this.data.userPickerList.map(({ province, city = '', area='' }) => `${province}${city}${area}`)
    // 已选区或县就去除市以及省
    // 已选了市则去除省
    pickList.forEach((item, idx, arr) => {
      if(arr.length <= 1)  return
      if(idx + 1 >= arr.length ) {
        if(item.includes(arr[idx - 1])) return pickList.splice(idx-1, 1)
        if(arr[idx - 1].includes(item)) return pickList.splice(idx, 1)
      } else {
        if(arr[idx+1].includes(item)) return pickList.splice(idx, 1)
        if(item.includes(arr[idx + 1])) return pickList.splice(idx + 1, 1)
      }
    })

    pickList.forEach((item, idx, arr) => {
      if(arr.length <= 1)  return
      if(idx + 1 >= arr.length ) {
        if(item.includes(arr[idx - 1])) return pickList.splice(idx-1, 1)
        if(arr[idx - 1].includes(item)) return pickList.splice(idx, 1)
      } else {
        if(arr[idx+1].includes(item)) return pickList.splice(idx, 1)
        if(item.includes(arr[idx + 1])) return pickList.splice(idx + 1, 1)
      }
    })

    this.setData({ 'selectDistrictList.trueSlectedDistrictList': pickList })
  },

  // 点击重置按钮
  handleResetClick() {
    this.setData({ 
      isReset: true,
      userPickerList: [],
      selectDistrictList: { 
        trueSlectedDistrictList: [],
        provinceList: [],
        cityList: [],
        areaList: []
      } 
    })
  },

  // 点击确定按钮
  handleConfirmClick() {
    const { trueSlectedDistrictList } = this.data.selectDistrictList
    trueSlectedDistrictList.length &&
    my.setStorage({
      key: 'districtList',
      data: trueSlectedDistrictList,
    });
    my.setStorage({
      key: 'selectedDistrictList',
      data: trueSlectedDistrictList,
      success() {
       my.navigateBack({ delta: 1 })
      }
    });
  },

  handleCloseModal(e) {
    const { type } = e.currentTarget.dataset
    this.setData({ isOpenShopModal: type === 'open' ? true : false })
  },

  onLoad() {
    const that = this
    my.getStorage({
			key: 'selectedDistrictList',
			success({ data }) {
        that.setData({ 
          'selectDistrictList.trueSlectedDistrictList': data
         })
      }
    })
  },
});
