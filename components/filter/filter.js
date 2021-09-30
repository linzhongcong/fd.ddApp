
Component({
  data: {
    results: [],
    items: [],
    commonProps: {
      max: 10000
    },
    maxHeight: 0,
    _i18nReset: '重置',
    _i18nConfirm: '确定'
  },
  props: {
    className: '',
    onChange: function onChange() {},
    max: 10000,
    equalRows: 0
  },

  didMount: function didMount() {
    var commonProps = this.data.commonProps;
    var max = this.props.max;
    commonProps.max = max;
  },

  didUnmount: function didUnmount() {
    var _this$data = this.data,
        items = _this$data.items,
        results = _this$data.results;
    results.splice(0, results.length);
    items.splice(0, items.length);
  },

  methods: {
    resetFn: function resetFn() {
      var _this$data = this.data,
          items = _this$data.items,
          results = _this$data.results;
      items.forEach(function (element) {
        element.setData({
          confirmStyle: ''
        });
      });
      results.splice(0, results.length);
      this.props.onReset()
    },
    confirmFn: function confirmFn() {
      var onChange = this.props.onChange;
      var results = this.data.results;
      onChange(results);
    },
    maskTap: function maskTap() {
      if (this.props.onMaskTap) {
        this.props.onMaskTap();
      }
    }
  }
});