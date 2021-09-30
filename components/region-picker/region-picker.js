import cascade from './region'

Component({
  mixins: [],
  data: {
    autoShow: false, // 是否自动弹窗
    provinces: '',
    citys: '',
    areas: '',
    index: '',
  },
  
  props: {    
    show: false,  // 是否显示
    type: '', // 级联类型
    title: '', // 标题
    placeholder: '', // 占位符
    defaluText: '请选择', // 默认项
    defaultIndex: [0,0,0], // 默认选中下标
    value: undefined, // 传递过来的值
  },

  didMount() {
    if ((this.props.placeholder && this.props.onClose) || (!this.props.placeholder && !this.props.onClose)) {
      throw new Error('Placeholder and onclose cannot both exist, but there must be one !')
    }
    this.setData({provinces: cascade.provinces, citys: [], areas: [], index: this.props.defaultIndex })
  },

  didUpdate(prevProps, prevData) {

    // 通过比较得出变动项，并将变动项索引传给对应赋值方法
    let newData = this.data.index, oldData = prevData.index, diff;
    if (newData === oldData) return false;
    for(let i = 0; i < newData.length; i++) newData[i] !== oldData[i] && (diff = i);
    switch(diff) {
      case 0: this.setProvince(newData[diff]); break; 
      case 1: this.setCity(newData[diff]); break;
    }
  },

  didUnmount() {},

  methods: {
    // 选项弹出
    handleClick() {      
      this.handlePickerCancle()
    },

    // 取消按钮点击
    handlePickerCancle() {
      if (this.props.onClose) {
        this.props.onClose()
      } else {
        this.setData({autoShow: !this.data.autoShow})
      }
      this.props.defaultIndex = [0,0,0]
    },

    // 确定按钮点击
    handlePickerConfirm(e) {
      e.detail.value = this.getRegion(e.currentTarget.dataset.value) 
      this.props.onChange(e)
      this.handlePickerCancle()
    },

    // picker切换
    handlePickerChange(e) {
      const res = e.detail.value;
      this.setData({ index: res })
    },
    
    // 设置最终选择
    getRegion(indexs) { 
      // 默认首选项在占一个索引，因此 0: '首选项文案', 但是地区数据结构里 0 不是 首选项文案
      let regio = [this.data.provinces, this.data.citys, this.data.areas], str = '';
      for (let i = 0; i < indexs.length; i++) {
        if (indexs[i] === 0) { str = str + ''; continue; } // 组件数据结构
        str = str + regio[i][indexs[i] - 1].name // 数据结构
      }
      return str
    },

    // 设置城市
    setCity(index) {
      let _index = this.data.index;
       _index[2] = 0; index = index - 1; 
      if (index < 0) return this.setData({areas: [], index: _index});
      const cid = this.data.citys[index].id, areas = cascade.areas[cid]
      this.setData({areas})
    },

    // 设置省
    setProvince(index) {
      index = index - 1; if (index < 0) return this.setData({citys: [], areas: [], index: [0, 0, 0]});
      const pid = this.data.provinces[index].id, citys = cascade.citys[pid], _index = this.data.index;
      _index[1] = 0; _index[2] = 0
      this.setData({citys, areas: [], index: _index})
    }
  }

})
