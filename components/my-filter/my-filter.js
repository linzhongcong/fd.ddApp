import regions from '/components/cascader/district'
import Global from '/Global'
let app = new Global()

Component({
  mixins: [],
  data: {
    shopTypeG: app.shopTypes,

    regions: regions,
    merchantRegion: [],
    showRegionPicker: false,
    value: '',
    province: '',
    provinces: [],
    city: '',
    citys: [],
    area: '',
    areas: [],
  },
  
  props: {
    showRegion: true,
  },
  
  methods: {

    onCancal() {
      // console.log("onCancal");
      this.$page.setData({showFilter: false})
    },

    onReset() {
      let list = this.data.shopTypeG
      list.forEach(item => {
        item.isSelected = false
      })

      let _list =  this.data.merchantRegion

      _list.forEach(i => {
        i.isSelected = false
      })


      this.setData({
        merchantRegion: _list,
        shopTypeG: list,
        value: '',
        showRegionPicker: false,        
        province: '',
        city: '',
        citys: [],
        area: '',
        areas: [],
      })
    },

    onSubmit() {
      const shopTypeG = this.data.shopTypeG, merchantRegion = this.data.merchantRegion
      let merchantTypefilter = '', merchantRegionfilter = '', list = [], that = this
      list = shopTypeG.filter(sitem => sitem.isSelected).map(n => n.value)
      merchantTypefilter = list.join(',')
      list = merchantRegion.filter(ritem => ritem.isSelected).map(m => m.region)
      merchantRegionfilter = list.join(',')
      let isFilterBtnActive = merchantRegionfilter || merchantTypefilter ? true : false
      // console.log(shopTypeG,merchantRegion,list,isFilterBtnActive,merchantTypefilter, merchantRegionfilter);
      
      if (!this.props.showRegion) {
        this.$page.setData({showFilter: false, isFilterBtnActive, merchantTypefilter}, () => {
          this.$page.initShow()
        })
      } else {
        this.$page.setData({showFilter: false, isFilterBtnActive, merchantTypefilter, merchantRegionfilter}, () => {
          this.$page.initShow()
        })
      }
    },
    

    // 客户类型选项点击
    shopClick(e) {
      const current = e.currentTarget.dataset.item, shopTypeG = this.data.shopTypeG
      shopTypeG.forEach(item => {
        if (item.value ===  current.value) item.isSelected = !item.isSelected; 
      })
      this.setData({shopTypeG})
    },

    // 地区tag点击
    regionClick(e) {
      const current = e.currentTarget.dataset.item, merchantRegion = this.data.merchantRegion
      merchantRegion.forEach(item => {
        // console.log("item",item);
        if (item.region ===  current.region) item.isSelected = !item.isSelected; 
      })
      this.setData({merchantRegion})
    },

    // 定去选择器确定
    confirm(e) {
      // console.log("confirm",e);
      let region = this.data.province + this.data.city + this.data.area
      const i = String(region).search(/(全国|全省|全市)/g)
      let merchantRegion = this.data.merchantRegion

      if (i !== -1) region =  String(region).substring(0 , i);
      if (merchantRegion.findIndex(i => i.region === region) !== -1) return my.showToast({content: '不可添加重复地区筛选项' })
      if (region === '') return; 

      merchantRegion.unshift({region: region, isSelected: true})
      if (merchantRegion.length > 8) merchantRegion.pop();
      
      this.setData({showRegionPicker: false, merchantRegion: merchantRegion })
    },

    // 地区选择器取消
    displayer() {
      this.setData({showRegionPicker: false })
    },
    
    // 添加地区选项
    addRegion() {
      this.setData({showRegionPicker: true})
    },

    // 删除地区选项
    deleRegion(e) {
      console.log("deleRegion");
      let current = e.currentTarget.dataset.item, merchantRegion = this.data.merchantRegion, list = []
      list = merchantRegion.filter(item => {
        return item.region !==  current.region;
      })
      this.setData({merchantRegion: list})
    },

    // 地区选择器滚动选择
    onChange(e) {
      const array = e.detail.value, diff = this.diff(array)

      if (diff === 'area' ) {
        this.setArea(array)
      } else if (diff === 'city') {
        this.setData({value: [array[0], array[1], 0], area: '', areas: []}, () => this.setCity(array))
      } else {
        this.setData({value: [array[0], 0, 0], city: '', citys: [], area: '', areas: []}, () => this.setProvince(array))
      }
    },

    // 分辨当前属于那一集选择
    diff(array) {
      const ps = this.data.provinces, cs = this.data.citys, as = this.data.areas
      , p = this.data.province, c = this.data.city, a = this.data.area
      , length = array.length

      if (length === 1) {
        if (ps[array[0]].val !== p) return 'province'
      } else if (length === 2 ) {
        if (ps[array[0]].val !== p) return 'province'
        if (cs[array[1]].val !== c) return 'city'
      } else if (length === 3) {
        if (ps[array[0]].val !== p) return 'province'
        if (cs[array[1]].val !== c) return 'city'
        if (as[array[2]].val !== a) return 'area'
      }
    },

    setArea (array) {
      const index = array[2], area = this.data.areas[index]

      if (area.key == '000000') return this.setData({area: '全市'})
      this.setData({area: area['val']})
    },

    setCity (array) {
      const regions = this.data.regions
      let areas = [], index = array[1], city = this.data.citys[index], code = city['key']
      areas.push({key: '000000', val: '全市'})
      
      if (code == '000000') return this.setData({areas, city: '全省'})
      for (const [key, val] of Object.entries(regions[code])) { areas.push({key, val}) }

      this.setData({areas, city: city['val']})
    },

    setProvince (array) {
      const regions = this.data.regions
      let citys = [], index = array[0], province = this.data.provinces[index], code = province['key']
      citys.push({key: '000000', val: '全省'})

      if (code == '000000') return this.setData({citys, province: '全省'})
      for (const [key,val] of Object.entries(regions[code])) { citys.push({key, val}) }
      
      this.setData({citys, province: province['val']})
    },
  },


    didMount() {
      const regions = this.data.regions, shopTypeG = this.data.shopTypeG

      let provinces = [], citys = [], areas = [], list = []
      provinces.push({key: '000000', val: '全国'})

      list = shopTypeG.filter(item => {
        item.isSelected = false;
        return item.value !== ''
      })

      for (const [key, val] of Object.entries(regions[100000])) {
        provinces.push({key, val})
      }
      
      this.setData({provinces, citys, areas, shopTypeG: list})
    },
})

