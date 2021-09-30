import { isSign } from '/api/login/index'
/* ------------------------------------ 入口导航 ------------------------------------ */
const customerNavList = [
  {
    icon: 'static/icon/leads.png',
    name: '销售线索',
    route: 'leads'
  },
  {
    icon: 'static/icon/public_leads.png',
    name: '线索公海',
    route: 'public-leads'
  },
  {
    icon: 'static/icon/potential_customer.png',
    name: '潜在客户',
    route: 'potential-customer'
  },
  {
    icon: 'static/icon/public_customer.png',
    name: '客户公海',
    route: 'public-customer'
  },
  {
    icon: 'static/icon/cooperate_customer.png',
    name: '合作客户',
    route: 'cooperate-customer'
  },
  { icon: '', name: 'none', route: '' } // 奇数障眼法
];
const facadeNavList = [
  {
    icon: 'static/icon/cooperate_facade.png',
    name: '合作门店',
    route: 'cooperate-facade'
  },
  {
    icon: 'static/icon/to_facade.png',
    name: '下店',
    route: 'toFacade'
  },
  {
    icon: 'static/icon/no_facade.png',
    name: '无门店',
    route: 'noFacade'
  },
  { icon: '', name: 'none', route: '' } // 奇数障眼法
];


Page({
  /* ------------------------------------ 数据 ------------------------------------ */
  data: {
    facadeNavList,
    customerNavList,
    signId: '', // 签到ID
    signType: '', // 签到类型
    isSign: false, // 是否有签到正在进行
  },

  /* ------------------------------------ 生命周期 ------------------------------------ */
  onLoad() {
    if (my.getStorageSync({key: 'token'}).data) {
      // this.initLoad()
      // console.log('获取到token', my.getStorageSync({key: 'token'}).data)
    } else {
      // console.log('无token，重新登陆')
      my.navigateTo({url: '/pages/logining/logining'});
    }
  },

  onShow() {
    this.getCheckState();
  },

  /* ------------------------------------ 交互 ------------------------------------ */
  // 跳转对应功能页
  goToPage(e) {
    const route = e.target.dataset.route
    if (!route) return;
    else if (route === 'toFacade') return my.navigateTo({url: '/pages/sign-in/index/index?signType=patrol'});
    else if (route === 'noFacade') return my.navigateTo({url: '/pages/sign-in/index/index?signType=no_shop'});
    my.navigateTo({url: `/pages/entry-category/${route}/${route}`});
  },

  /**
   * 签退
   */
  handleCheckout() {
    const { signId, signType } = this.data;
    // 跳转不同签退页
    switch (signType) {
      case 'return_visit': // 回访
        my.navigateTo({url: `/pages/sign-out/return_visit/return_visit?id=${signId}`});
        break;
      case 'maintain': // 维护
        my.navigateTo({url: `/pages/sign-out/maintain/maintain?id=${signId}`});
        break;
      case 'patrol': // 下店
        my.navigateTo({url: `/pages/sign-out/patrol/patrol?id=${signId}`});
        break;
      default: 
        my.navigateTo({ url: `/pages/sign-out/index/index?type=${signType}&id=${signId}` }); 
        break;
    }
  },

  /* ------------------------------------ 方法 ------------------------------------ */
  /**
   * 获取签到/签退状态
   */
  getCheckState() {
    isSign().then(res => {   
        const { code, data } = res.data;
        if (code === 0 && data) {
          let signId = data.id || data[0].id,
              signType = data.checkinWay ||  data[0].checkinWay;
          signType !== 'no_shop' && signType !== 'street_worship' && this.setData({isSign: true, signId, signType});
        } else {
          this.setData({isSign: false});
        }
    }).catch(err => {
      // this.setData({acceptSign: false})
      my.showToast({type: 'fail', content: `签到状态获取异常，请重新进入程序或联系管理员`})
    })
  },
})