import Top from '../../Global'

const defaultTypes = 'network;busy;error;empty;logoff;payment;redpacket'

Page({
  data: {
    from: '', // 页面来源，来源页面有参数，需为拼接后的url
    type: 'error',
    title: '页面出现了一些小问题',
    brief: '稍后刷新',
    footer: [{text: '修复'}, {text: '刷新'}],
  },
  
  onTapLeft() {
    my.switchTab({url: '/pages/index/index'})
  },
  
  onTapRight() {
    my.redirectTo({url: this.data.from})
  },

  onLoad(query) {
    const from = query.from, type = query.type, top = new Top(), errorType =  top.getErrorType(type)
    if (!from) throw new Error('来源地址必填');
    this.$batchedUpdates(() => {
      this.setData({ from, title: errorType.title, brief: errorType.brief })
      if (defaultTypes.indexOf(type) !== -1) this.setData({ type });
    })
  },

});
