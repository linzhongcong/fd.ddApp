Component({
  /**
   * 组件的属性列表
   */
  props: {
    visible: false
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    popPreventTouchmove() { },
    popPreventTouchmove2() { },
    popPreventTouchmove3() { },
    cityChange() { },
    close() {
      this.props.onClose()
    },
    handleClickMask(e) {
      if (e.target.dataset.type !== 'unclose') this.close()
    }
  }
})
