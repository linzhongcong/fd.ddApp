import Glabol from '/Global'
import { searchBusinewss } from '/api/merchant/index'

Component({
  mixins: [],
  data: {
    list: [], // 工商数据集合
    value: '', // 输入值
    page: 1, // 当前页数
    count: 0, // 总数
    perPage: 20, // 每页条数
    companyTypes: new Glabol().companyTypes, // 公司类型
  },

  props: {
    show: false,  // 是否显示
    animation: false, // 是否开启动画
    privilege: false, // 特权是否开启
    onReceive: undefined,
    onClose: undefined
  },

  didMount() {
    if (!(this.props.onClose && this.props.onReceive)) throw new Error('onClose && onReceive is required')
  },

  didUpdate() {},

  didUnmount() {},

  methods: {
    goBack() { this.props.onClose() },

    handleInput(value) {  this.setData({value}) },
    
    handleClear() { this.setData({value: ''}) },

    // 搜索
    handleSubmit() { 
      const name = this.data.value
      if (name) {
        this.setData({page: 1, list: []}, () => this.fetchData(name))
      } else {
        this.setData({page: 1, list: []})
      }
    },

    // 选项卡点击
    onClick(e) { 
      const item = e.currentTarget.dataset.item, privilege = this.props.privilege
      if (!privilege && item.contractorId > 0) {
        my.showToast({content: '已使用'})
      } else {
        this.props.onReceive(item)
      }
    },

    onReachBottom() {
      const name = this.data.value, page = this.data.page + 1
      this.setData({page: page}, () => this.fetchData(name))
    },

    // 搜索数据
    fetchData(name) {
      let preList = [], list = this.data.list
      let params = {companyName: name, page: this.data.page, perPage: this.data.perPage}
      searchBusinewss(params).then(res => {
        preList = res.data.data.list
        if (preList.length > 0) preList = this.dataProcessing(preList, name);
        if (params.page > 1 && preList.length > 0 ) preList = [].concat(list,preList);
        if (preList.length > 0) this.setData({list: preList}); // 为了不重复加工 list 中的数据
      }).catch(err => {
        my.showToast({content: `${err.data.msg}`, type: 'fail'})
      })
    },
    
    // 数据加工
    dataProcessing(data, name) {    
      let str = '';
      data.forEach(d => {
        if (d.name.indexOf(name) !== -1) {
          str = d.name.replace(`${name}`,`*${name}*`)
          d.names = str.split('*')
        }
      })
      return data
    },

  }
})
