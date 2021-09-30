Component({
  mixins: [],
  data: {
    show: false  // 是否显示
  },
  props: {
    title: '', // 标题
    placeholder: '', // 占位符
    defaluText: '请选择', // 默认项
    index: [0], // 默认选中下标
    range: [], // 列表
    rangeKey: '', // 参考阿里 https://opendocs.alipay.com/mini/component/picker
    value: undefined, // 传递过来的值
    autoShow: undefined, // 是否自动弹窗
  },

  didMount() {
    if (this.props.range instanceof Array && this.props.range.some(item => item instanceof Object) && !this.props.rangeKey) {
      throw new Error('typeError rangeKey is required when range existing Object element!')
    } else if (Object.prototype.toString.call(this.props.range) === '[object Object]' && !this.props.rangeKey) {
      throw new Error('typeError rangeKey is required when range be Object!')
    } else {
      this.props.autoShow && this.handleClick()  
    }
  },

  didUpdate() {},
  didUnmount() {},

  methods: {
    // 选项弹出
    handleClick() {
      this.setData({ show: !this.data.show })
    },

    // 取消按钮点击
    handlePickerCancle() {
      this.setData({ show: false })
    },

    // 确定按钮点击
    handlePickerConfirm(e) {
      if (this.data.pickerKey) {
        e.detail.key = this.data.pickerKey, e.detail.value = this.data.pickerValue;
      } else {
        e.detail.key = '', e.detail.value = '';
      }
      this.props.onChange(e)
      this.setData({show: false})
    },

    // picker切换
    handlePickerChange(e) {
      const key = e.detail.value[0], value = key - 1
      this.setData({ pickerKey: key, pickerValue: this.props.range[value] })
    }
  }
})
