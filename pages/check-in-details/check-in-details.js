import format from '/utils/common/js/format';
import { signDetail } from '/api/sign/index'

Page({
	data: {
		signInfo: '', // 签到详情
    detailId: '',  // id
    detailType: '', // 签到类型 
  },

  // 返回按钮
	backTo() {
		my.navigateBack();
  },

	// 获取签到详情数据
	getCheckDetail(id) {
		my.showLoading({ content: '加载中...' })
	  signDetail({checkinId: id}).then(res => {
				if (res.data.code === 0) {
					let resData = res.data.data;
					resData.signinAt = format.timeFormat(resData.signinAt, 'yyyy-MM-dd hh:mm:ss');
					resData.signoutAt = format.timeFormat(resData.signoutAt, 'yyyy-MM-dd hh:mm:ss');
					resData.checkinWay = format.formatSign(resData.checkinWay);
					resData.merchantTypeName = format.formatShop(resData.merchantType);
					this.setData({signInfo: resData})
				}
			}).catch(err => {
        console.log("err",err);
			})
	},

  
	onLoad(query) {
    this.setData({ detailId: query.id , detailType: query.signType})
		this.getCheckDetail(query.id);
	},

});
