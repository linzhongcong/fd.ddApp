import { dateTimeFormat as dtf } from '/utils/format'

Component({
  mixins: [],
  data: {
    dt: '', // date + time 日期 + 时间
    tr: 0, // 计数器
  },
  props: {
    classNmae: ''
  },
  didMount() {
    let dt = dtf(new Date())
    this.setData({dt, tr: setInterval(() => { this.setData({dt: dtf(new Date()) }) }, 1000) })
  },
  didUpdate() {},
  didUnmount() {
    clearInterval(this.data.tr)
  },
  methods: { },
});
