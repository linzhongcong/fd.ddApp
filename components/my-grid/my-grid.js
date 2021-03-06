import { fmtUnit } from '/utils/format'
Component({
  data: {
    getColumnBorderIndex: 0,
    iconSize: fmtUnit(28)
  },
  props: {
    needPadding: false,
    className: '',
    columnNum: 3,
    circular: false,
    list: [],
    onGridItemClick: function onGridItemClick() {},
    hasLine: true,
    infinite: false,
    multiLine: false,
    infiniteHeight: fmtUnit('90px'),
    gridName: ''
  },
  didMount: function didMount() {
    this.clearBorder();
    this.createGridName();
  },
  didUpdate: function didUpdate() {
    this.clearBorder();
    this.createGridName();
  },
  methods: {
    onGridItemClick: function onGridItemClick(e) {
      this.props.onGridItemClick({
        detail: {
          index: e.target.dataset.index,
          item: e.target.dataset.item
        }
      });
    },
    clearBorder: function clearBorder() {
      var _this$props = this.props,
          list = _this$props.list,
          columnNum = _this$props.columnNum;

      if (columnNum === 3) {
        var rows = list.length % columnNum;
        this.setData({
          getColumnBorderIndex: rows === 0 ? 3 : rows
        });
      }
    },
    createGridName: function createGridName() {
      var _this$props2 = this.props,
          infinite = _this$props2.infinite,
          gridName = _this$props2.gridName;

      if (infinite) {
        if (gridName === '' && !gridName) {
          this.props.gridName = "grid" + Math.floor(Math.random() * 100000);
          this.setData({
            gridName: this.props.gridName
          });
        }
      }
    }
  }
});