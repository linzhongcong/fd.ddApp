import DISTRICTS from './district'

Component({
  mixins: [],
  data: {
    isChecked: false,
    isFoucs: false,
    isActive: true,
    isAllSelect: false,
    districts: DISTRICTS, // 全国省市区地方
    allProvinces: {}, // 所有省份
    selectedProvinces: [], // 已选的省份
    selectProvinceCity: [], // 已选省份下的城市
    selectCityArea: [], // 已选城市下的县
    wholeDistrictList: [], // 省市区完整的地区

    showCityList: [],
    showAreaList: []
  },
  props: {
    isReset: false,
    isComfirn: false,
    onChange: () => {}, // 当选中节点变化时触发
  },

  didMount() {
    this.setData({ 
      wholeDistrictList: [], 
      selectProvinceCity: [], 
      selectCityArea: [],
      showCityList: [],
      showAreaList: []
    })
    this.getInitData()
  },
  
  didUpdate() {
    if(this.props.isReset) {
      this.setData({ 
        wholeDistrictList: [], 
        selectProvinceCity: [], 
        selectCityArea: [],
        showCityList: [], 
        showAreaList: []
      })
      this.getInitData()
    }
  },

  didUnmount() {},

  methods: {
    // 初始化数据
    getInitData() {
      const { districts } = this.data
      const provinces = []
       // 当前项添加对应的状态判断值
      for (const [key, value] of Object.entries( districts['100000'])) {
        provinces.push({ 
          num: key, 
          province: value, 
          isAllSelect: false, 
          isChecked: false, 
          isFoucs: false
        })
      }
      this.setData({ allProvinces: provinces })
    },
    
    // 省地区选择
    handleProviceSelectClick(e) {
      let { districts, allProvinces, selectProvinceCity, selectCityArea } = this.data 
      const { index: provinceNum, province, selected } = e.currentTarget.dataset

      // 给点击的省加上选中标识并显示出下面的所有市
      for (const [key, { num, isChecked, isFoucs  }] of Object.entries(allProvinces)) {
       num === provinceNum &&  (allProvinces[key].isFoucs = true)
        // 显示或移除该省下面的市
        if(num === provinceNum) {
          for (const [idx, value] of Object.entries(districts[num])) {
            if(!isFoucs) {
              selectProvinceCity.push({ isChecked, isFoucs, parentNum: num, num: idx, province, city: value })
            }
            else {
              let deleteIdx
              selectProvinceCity.forEach((item, provinceIndex) => {
                if(item.num === idx ) return deleteIdx = provinceIndex
              })
              selectProvinceCity.length && selectProvinceCity.splice(deleteIdx, 1)
              allProvinces[key].isFoucs = false
            }
          }
        }
      }
      
      // 选择多个省的时候，市显示省数组最后一个省的所有市
      let tempList
      if(selected) {
        tempList = selectProvinceCity.filter(item => item.province === province)
        this.setData({ selectProvinceCity: tempList, allSelectedList: selectProvinceCity })
      } else {
        const selectdProvinceList = allProvinces.filter(({ isFoucs }) => isFoucs)
        tempList = selectProvinceCity.filter(item => item.province === selectdProvinceList[selectdProvinceList.length - 1].province)
      }

      this.setData({ allProvinces, selectProvinceCity, showCityList: tempList, showAreaList: [], selectCityArea })
      this.props.onChange(
        selected
        ? { selected: true, province, isProvince: true } 
        : { selected: false, province, isProvince: true }
      )
    },

    // 城市地区选择
    handleCitySelectClick(e) {
      let { districts, showCityList, selectCityArea } = this.data
      const { index, province, city, pindex, checked, selected, foucs } = e.currentTarget.dataset

      showCityList.forEach(item => {
        if(item.num === index) {
          item.isFoucs = true
          // 获取该市下的所有区或者县
          for (const [key, value] of Object.entries(districts[index])) {
             if(!foucs) {
              selectCityArea.push({ 
                isChecked: checked, 
                isFoucs: foucs, 
                province,
                city,
                grandNum: pindex,
                parentNum: index,
                num: key, 
                area: value 
              })
            } else {
              let deleteIdx
                selectCityArea.forEach((item, provinceIndex) => {
                if(item.parentNum === index ) return deleteIdx = provinceIndex
              })
              selectCityArea.length && selectCityArea.splice(deleteIdx, 1)
              item.isFoucs = false
            }
          }
        }
      })

       // 选择多个市的时候，市显示数组最后一个市的所有县、区
      let tempList
       if(selected) {
        tempList = selectCityArea.filter(item => item.city === city)
      } else {
        const selectedCityList = showCityList.filter(({ isFoucs }) => isFoucs)
        console.log(selectedCityList)
        tempList = selectedCityList.length && selectCityArea.filter(item => item.city === selectedCityList[selectedCityList.length - 1].city)
      }

      this.setData({ showCityList, showAreaList: tempList, selectCityArea  })
      this.props.onChange(
        selected
          ? { selected: true, city, province, isCity: true}
          : { selected: false, city, province, isCity: true}
      )
    },

    // 县级地区选择
    handleAreaSelectClick(e) {
      const { index, city, area, province, checked, selected } = e.currentTarget.dataset
      const { wholeDistrictList, selectCityArea, showAreaList } = this.data
      
      // 多选以及取消多选
      showAreaList.forEach(item => {
        if(item.num === index) {
          item.isChecked = !checked
          item.isAllSelect = !selected
          if(!checked){
            wholeDistrictList.push(item)
          } else {
            let deleteIdx
            wholeDistrictList.forEach((list, selectIndex) => {
              if(list.num === index ) return deleteIdx = selectIndex
            })
            wholeDistrictList.splice(deleteIdx, 1)
          }
        }
      })

      this.setData({ showAreaList, selectCityArea, wholeDistrictList })
      this.props.onChange(
        selected
          ? { selected: true, area, city, province, isArea: true}
          : { selected: false, area,  city, province, isArea: true}
      )
    }
  },
});
