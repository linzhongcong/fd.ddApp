import Global from '/Global'

Page({
  data: {
    signType: '', //选择的签到类型
    signTypes: '', // 签到类型
  },

  goBack() {
    my.navigateBack();
  },
  
  onItemClick(value) {
    my.navigateTo({ url: `/pages/sign-in/index/index?signType=${value.index}`})
  },

  // 中转站函数
  transferStation() { },

  onLoad() {
    let signTypes = new Global().visitTypes
    signTypes = signTypes.filter(i => i.value !== 'street_worship')
    this.setData({signTypes})
  }
});
