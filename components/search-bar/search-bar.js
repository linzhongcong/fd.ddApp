Component({
  props: {
    className: '',
    placeholder: '',
    focus: false,
    showVoice: false,
    borderColor: '#1677ff',
    controlled: true,
    enableNative: false, // false 处理 fixed 定位后输入框内容闪动的问题
    cancelButtonText: '取消',
    showCancelButton: false,
    comfirmButtonText: '搜索',
    showComfirmButton: false
  },
  data: {
    _value: '',
    focus: false,
    _i18nCancel: '',
    _i18nComfirm: ''
  },
  didMount: function didMount() {
    this.setData({
      _value: 'value' in this.props ? this.props.value : '',
      focus: this.props.focus,
      _i18nCancel: this.props.cancelButtonText,
      _i18nComfirm: this.props.comfirmButtonText
    });
  },
  didUpdate: function didUpdate() {
    if ('value' in this.props && this.props.value !== this.data._value) {
      this.setData({
        _value: this.props.value
      });
    }
  },
  methods: {
    handleInput: function handleInput(e) {
      var value = e.detail.value;

      if (!('value' in this.props)) {
        this.setData({
          _value: value
        });
      }

      if (this.props.onInput) {
        this.props.onInput(value);
      }
    },
    handleClear: function handleClear() {
      var _this = this;

      // this.setData({
      //   focus: true,
      // });
      setTimeout(function () {
        _this.handleFocus();
      }, 100);

      if (!('value' in this.props)) {
        this.setData({
          _value: ''
        });
      }

      this.doClear();
    },
    doClear: function doClear() {
      if (this.props.onClear) {
        this.props.onClear('');
      }

      if (this.props.onChange) {
        this.props.onChange('');
      }
    },
    handleFocus: function handleFocus() {
      this.setData({
        focus: true
      });

      if (this.props.onFocus) {
        this.props.onFocus();
      }
    },
    handleBlur: function handleBlur() {
      this.setData({
        focus: false
      });

      if (this.props.onBlur) {
        this.props.onBlur();
      }
    },
    handleCancel: function handleCancel() {
      if (!('value' in this.props)) {
        this.setData({
          _value: ''
        });
      }

      if (this.props.onCancel) {
        this.props.onCancel();
      } else {
        this.doClear();
      }
    },
    handleConfirm: function handleConfirm(e) {
      var value;
      if (e.detail.value) {
        value = e.detail.value;
      } else {
        value = this.data._value
      }

      if (this.props.onSubmit) {
        this.props.onSubmit(value);
      }
    },
    handleVoice: function handleVoice() {
      if (this.props.onVoiceClick) {
        this.props.onVoiceClick();
      }
    }
  }
});