import { merchantSuccessVist } from '/api/merchant/index'
Page({
	data: {
		letterList: [
			'A',
			'B',
			'C',
			'D',
			'E',
			'F',
			'G',
			'H',
			'I',
			'J',
			'K',
			'L',
			'M',
			'N',
			'O',
			'P',
			'Q',
			'R',
			'S',
			'T',
			'U',
			'V',
			'W',
			'X',
			'Y',
			'Z',
			'#',
		], // 字母列表
		businessList: [], // 客户
		hidden: true, // 显示/隐藏当前字母选择提示框
		chooseText: '', // 当前字母
		toView: '', // 滚到指定的字母
		nav_height: '', //字母导航单个元素高度
		chooseMerchant: [], // 存储之前选中的值
		type: '',
		page: '',

		isOpenShopModal: false,
		selectedShopList: []
	},

	onLoad(option) {
		const that = this;
		this.setData({ selectedShopList: [], page: option.page || '' })
		that.getMerchantName();
		my.getStorage({
			key: 'chooseMerchant',
			success (res) {
				that.setData({ chooseMerchant: res.data	});
			},
		});
		if (!!option.type)	that.setData({	type: option.type	})
	},

	onReady: function () {
		this.getHeight();
	},

	// 关闭已选客户弹窗
	handleCloseModal(e) {
		const { type } = e.currentTarget.dataset
		this.setData({ isOpenShopModal: type === 'open' ? true : false })
	},

	// 获取高度
	getHeight() {
		let that = this;
		let query = my.createSelectorQuery();
		query.select('#nav_item').boundingClientRect();
		query.exec(function (res) {
			that.setData({
				nav_height: res[0].height,
			});
		});
	},

	// 触摸开始
	touchStart(e) {
		this.setScroll(e);
	},

	// 触摸移动
	touchMove(e) {
		this.setScroll(e);
	},

	// 触摸停止
	touchEnd(e) {
		this.setScroll(e);
		this.setData({
			hidden: true,
		});
	},

	// 设置滚动
	setScroll(e) {
		let pageY = e.changedTouches[0].pageY;
		let nav_height = +this.data.nav_height;
		let idx = Math.floor(pageY / nav_height) - 1;
		let letter = this.data.letterList[idx];
		this.setData({
			toView: letter,
			chooseText: letter,
			hidden: false,
		});
	},

	// 获取全部客户的名称
	getMerchantName() {
		let that = this;
		let params = {};
		params.type = 'all';
		let resList = [];
		my.showLoading({ url: '加载中...' })
		merchantSuccessVist(params)
			.then(res => {
				my.hideLoading()
				if (res.data.code === 0) {
					for (let i in res.data.data) {
						if (i !== '') {
							let obj = {};
							obj.title = i;
							obj.list = res.data
								.data[i].map(item => ({merchantName: item, checked: false}))
							resList.push(obj);
						}
					}
					that.setData({	businessList: resList });
				}
			})
			.catch(err => {
				console.log(err, 'err')
				my.hideLoading()
			});
	},

	// 点击确定
	onSubmit(e) {
		const that = this
		const { selectedShopList, page } = this.data
		const key = page === 'merchantFilter' ? 'merchantList' : 'shopList'
		my.setStorage({
			key,
			data: selectedShopList,
			success() {
				that.setData({ selectedShopList: [] });
				my.navigateBack({ delta: 1 });
			},
		});
	},

	// checkbox选项点击
	handleCheckboxClick(e) {
		const { businessList, selectedShopList } = this.data
		const { idx, index, name, checked } = e.currentTarget.dataset

		businessList[idx].list
			.forEach((item, subIdx) => index === subIdx && (item.checked  = !checked))
		
			businessList[idx].list[index].checked 
				? selectedShopList.push(name)
				: selectedShopList.splice(selectedShopList.indexOf(name), 1) 
			this.setData({ selectedShopList, businessList })
	},
});
