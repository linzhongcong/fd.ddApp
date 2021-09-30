import regions from '/components/cascader/district'
import Global from '/Global';
let app = new Global();

const dataRange = [
  {value: 'self', label: '我负责的'},
  {value: 'container', label: '本部门及下属的'}
]

Component({
  mixins: [],
  data: {
    // dataRange, // 数据权限范围
    inputValue: '', // 搜索框内容
    popupArea: false, // 展示地区选择器
    popupScreen: false, // 展示筛选
    popupDataRange: false, // 展示数据范围
    selectDataRangeIndex: 0, // 选中数据范围下标
    merchantType: [], // 客户类型
    province: [], // 地区选择器 - 省
    city: [], // 地区选择器 - 市
    county: [], // 地区选择器 - 区
    selectAreaValue: [0, 0, 0],
    addAreaList: [], // 添加的地区
    timer: null, // 定时器
  },
  props: {
    hideArea: false, // 隐藏 筛选 - 地区
    hideScreen: false, // 隐藏筛选
    hideDataRange: false, // 隐藏数据权限范围
    inputPlaceholder: '请输入公司名称、系统/门店名称',
    dataRange: [
      {value: 'self', label: '我负责的'},
      {value: 'container', label: '本部门及下属的'}
    ]
  },
  didMount() {
    my.getStorage({
      key: 'customer',
      success: (res) => {
        if (!res.data) return;
        let addAreaList = res.data.addAreaList.map(item => {
          item._isChecked = false;
          return item;
        })
        this.setData({addAreaList});
      }
    })
    let merchantType = app.shopTypes.map((item) => {
      let obj = Object.assign(item);
      obj._isChecked = false;
      return obj
    })
    let province = [{value: '000000', label: '全国'}],
        city = [{value: '000000', label: '全省'}],
        county = [{value: '000000', label: '全市'}];
    for (const [value, label] of Object.entries(regions[100000])) {
      province.push({value, label});
    }
    this.setData({merchantType, province, city, county});
  },
  methods: {
    /* ------------------------------------ 交互 ------------------------------------ */
    /**
     * 文本框发生变化
     * @param {String} value: 文本框的值
     */
    handleInput(value) {
      this.data.inputValue = value; // 不需要视图更新
    },

    /**
     * 点击搜索
     * @param {String} value: 文本框的值
     */
    handleSubmit(value) {
      const params = this.getSearchContent();
      this.props.onOk(params);
    },

    /**
     * 清空文本输入框
     */
    handleClear() {
      this.data.inputValue = '';
    },

    /**
     * 弹出/收缩 数据权限范围
     */
    handleShowDataRange() {
      const popupDataRange = !this.data.popupDataRange;
      this.setData({popupDataRange})
    },

    /**
     * 弹出筛选
     */
    handleShowScreen() {
      this.setData({popupScreen: true,popupDataRange:false})
    },

    /**
     * 收缩数据权限范围
     */
    handleCloseDataRange(e) {
      this.setData({popupDataRange: false});
    },

    /**
     * 选择数据权限范围
     */
    handleSelectDataRange(e) {
      const selectDataRangeIndex = e.target.dataset.index;
      this.setData({selectDataRangeIndex, popupDataRange: false}, () => {
        const params = this.getSearchContent();
        this.props.onOk(params);
      })
    },

    /**
     * 收缩筛选
     */
    handleCloseFilter(a) {
      this.setData({popupScreen: false})
    },

    /**
     * 选择客户类型
     */
    handleSelectMerchantType(e) {
      const index = e.target.dataset.index,
            target = `merchantType[${index}]._isChecked`,
            state = this.data.merchantType[index]._isChecked;
      this.setData({[target]: !state});
    },

    /**
     * 选择地区
     */
    handleSelectArea(e) {
      const index = e.target.dataset.index;
      this.handleArea('select', index);
    },

    /**
     * 移除地区列表
     */
    handleRemoveArea(e) {
      const index = e.target.dataset.index;
      this.handleArea('delete', index);
    },

    /**
     * 添加地区
     */
    handleAddArea() {
      this.setData({popupArea: true});
    },

    /**
     * 地区选择器发生变化
     */
    handleAreaPickChange(e) {
      let value = e.detail.value,
          {province, city, selectAreaValue} = this.data;
      value.forEach((item, index) => {
        if (item !== selectAreaValue[index]) {
          if (index === 0) { // 第一列发生变化
            this.resetAreaPickChange([item, 0, 0]) && (value = this.data.selectAreaValue); // 重置为某省 某市 全市 且重置完需要重新覆盖value的值, 已保证数据为最新
            this.initCity(+province[item].value); // 更新第二列 市
          } else if (index === 1) {
            this.resetAreaPickChange([value[0], value[1], 0]) && (value = this.data.selectAreaValue); // 重置为某省 某市 全市 且重置完需要重新覆盖value的值, 已保证数据为最新
            this.initCounty(+city[item].value); // 更新第三列 区
          }
          this.setData({selectAreaValue: value})
        }
      })
    },

    /**
     * 关闭省市区级联
     * 关闭时需要重置级联数据
     */
    handleCloseAreaPicker() {
      this.setData({
        popupArea: false,
        selectAreaValue: [0, 0, 0],
        city: [{value: '000000', label: '全省'}],
        county: [{value: '000000', label: '全市'}]
      });
    },

    /**
     * 确定所选择的省市区
     */
    handleSubmitAreaPicker() {
      const {selectAreaValue, province, city, county} = this.data;
      let addAreaList = this.data.addAreaList,
          obj = { value: [], label: '', _isChecked: false};
      selectAreaValue.forEach((item, index) => {
        if (index === 0) {
          obj.label = province[item].label;
          obj.value.push(province[item].value);
        } else if (index === 1) {
          item > 0 && (obj.label = `${obj.label}-${city[item].label}`) && obj.value.push(city[item].value);
        } else if (index === 2) {
          item > 0 && (obj.label = `${obj.label}-${county[item].label}`) && obj.value.push(county[item].value);
        }
      })
      const flag = addAreaList.some(item => item.label === obj.label);
      if (flag) {
        my.showToast({
          type: 'none',
          content: `已经存在地区：${obj.label}`
        });
      } else {
        addAreaList.length === 8 && addAreaList.pop();
        addAreaList.unshift(obj);
        this.setData({addAreaList}, () => this.setAreaStorage());
        this.handleCloseAreaPicker();
      }
    },

    /**
     * 确认筛选条件
     */
    handleSubmitFilter() {
      const params = this.getSearchContent();
      this.setData({popupScreen: false});
      this.props.onOk(params); // 调用父级的传递的函数
    },

    /**
     * 重置筛选条件
     */
    handleResetFilter() {
      let {merchantType, addAreaList} = this.data;
      merchantType.forEach(item => item._isChecked = false);
      addAreaList.forEach(item => item._isChecked = false);
      this.setData({merchantType, addAreaList}, () => {
        const params = this.getSearchContent();
        this.props.onOk(params);
      })
    },

    /* ------------------------------------ 方法 ------------------------------------ */
    /**
     * 操作地区列表
     * @param {String} target: 操作目标
     * @param {Number} index: 下标
     */
    handleArea(target, index) {
      let addAreaList = this.data.addAreaList;
      switch (target) {
        case 'select':
          addAreaList[index]._isChecked = !addAreaList[index]._isChecked;
          break;
        case 'delete':
          addAreaList.splice(index, 1);
        default:
          break;
      }
      this.setData({addAreaList}, () => {
        target === 'delete' && this.setAreaStorage()
      });
    },

    /**
     * 初始化地区选择 - 市
     * @param {Number} pCode: 省编码
     */
    initCity(pCode) {
      let city = [{value: '000000', label: '全省'}];
      if (pCode > 0) {
        for (const [value, label] of Object.entries(regions[pCode])) {
          city.push({value, label});
        }
      }
      this.setData({city});
    },

    /**
     * 初始化地区选择 - 区
     * @param {Number} cCode: 市编码
     */
    initCounty(cCode) {
      let county = [{value: '000000', label: '全市'}];
      if (cCode > 0) {
        for (const [value, label] of Object.entries(regions[cCode])) {
          county.push({value, label});
        }
      }
      this.setData({county});
    },

    /**
     * 获取查询条件
     * @return {Object} 查询条件对象
     */
    getSearchContent() {
      const { selectDataRangeIndex, inputValue, merchantType, addAreaList } = this.data,
            _this$props = this.props;
      let obj = {
        name: inputValue,
        ownership: _this$props.dataRange[selectDataRangeIndex].value,
        merchantType: merchantType.filter(item => item._isChecked),
        merchantRegion: addAreaList.filter(item => item._isChecked)
      };
      obj.merchantType = obj.merchantType.map(item => item.value).toString();
      obj.merchantRegion = obj.merchantRegion.map(item => item.label.replace(/\-/g, '')).toString();
      obj.merchantRegion.indexOf('全国') > -1 && delete obj.merchantRegion; // 全国优先级最高
      _this$props.hideDataRange && delete obj.ownership;
      _this$props.hideArea && delete obj.merchantRegion;
      _this$props.hideScreen && (delete obj.merchantType) && (delete obj.merchantRegion);
      return obj;
    },

    /**
     * 重置地区选中状态
     */
    resetAreaPickChange(selectAreaValue) {
      this.setData({selectAreaValue, county:[{value: '000000', label: '全市'}]});
      return true;
    },

    /**
     * 缓存已选择地区
     */
    setAreaStorage() {
      let addAreaList = this.data.addAreaList;
      addAreaList.filter
      my.setStorage({
        key: 'customer',
        data: {
          addAreaList
        }
      });
    }
  },
});
