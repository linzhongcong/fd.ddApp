Page({
	data: {
		type: '',
		lat: '',
		lng: '',
		flag: true,
	},
	onLoad(e) {
    my.hideLoading();
		this.setData({
			type: e.type,
			lat: e.lat,
			lng: e.lng,
		});
		this.webViewContext = my.createWebViewContext('web-view-1');
	},
	onmessage(e) {
		if (this.data.flag) {
			this.webViewContext.postMessage({ lat: this.data.lat, lng: this.data.lng }); //向网页发送信息
			this.data.flag = false;
		}
		if (e.detail.material != 'none') {
			let _this = this;
			my.setStorage({
				key: 'material',
				data: e.detail.material,
				success: function (res) {
					if (_this.data.type != 'index') {
						my.navigateBack({ delta: 1 });
					} else {
						my.switchTab({ url: '/pages/index/index?isAdjust=1' });
					}
				},
			});
		}
	},
});
