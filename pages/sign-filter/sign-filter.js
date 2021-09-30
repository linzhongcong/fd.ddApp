import { merchantSuccessVist,getMember } from '/api/merchant/index'

Page({
	data: {
		conformBtnActive: false, // 确定按钮是否激活
		dateType: [
			{ value: 'today', name: '今天', isShow: false },
			{ value: 'yesterday', name: '昨天', isShow: false },
			{ value: 'lately', name: '近七天', isShow: false },
		],
		isDate: {
			contractorNames: '',
			type: '',
			startDate: '请选择开始时间',
			endDate: '请选择结束时间',
			isShow: false,
			selectShop: '',
			selectColleagues: '', // 已选择队员
		},
		filterData: {
			startTime: '',
			endTime: '',
			type: '',
			contractorNames: [],
			staffNames: [],
		},
		topList: [], // 常访问的前六条客户数据
		topColleaguesList: [], // 常访问的前8条客户数据
	},

	onLoad() {
		this.getShopList();
		this.getColleagues();
	},

	onShow() {
		let that = this;
		that.onReset();

		my.getStorage({
			key: 'shopList',
			success: function (res) {
				if (res.data !== null) {
					that.setData({
						'filterData.contractorNames': res.data,
						'isDate.selectShop': res.data.join('，'),
					});
				}
			},
		});

		my.getStorage({
			key: 'chooseColleagues',
			success: function (res) {
				if (res.data !== null) {
					that.setData({
						'filterData.staffNames': res.data,
						'isDate.selectColleagues': res.data.join('，'),
					});
				}
			},
		});

		setTimeout(() => {
			const collTempList = [];
			that.data.topColleaguesList.length &&
				that.data.topColleaguesList.forEach(({ name }) => {
					collTempList.push({
						name,
						isShow: that.data.isDate.selectColleagues.split('，').includes(name) ? true : false,
					});
				});
			that.setData({ topColleaguesList: collTempList });
		}, 300);
	},

	// 显示隐藏日期选择器
	pickerShow(e) {
		let isShow = this.data.isDate.isShow === false ? true : false;
		let dateList = this.data.dateType;
		dateList.forEach(item => {
			item.isShow = false;
		});
		this.setData({
			'isDate.isShow': isShow,
			dateType: dateList,
			'filterData.type': '',
		});
		if (e !== undefined) {
			this.setData({
				'isDate.type': e.target.dataset.type,
			});
		}
	},

	// 选择时间区间
	pickerChange(value, initialValue, timeStamp) {
		this.setData({ conformBtnActive: true });
		if (this.data.isDate.type === 'startTime') {
			this.setData({
				'isDate.startDate': value,
				'filterData.startTime': timeStamp / 1000,
			});
		} else {
			this.setData({
				'isDate.endDate': value,
				'filterData.endTime': timeStamp / 1000,
			});
		}
	},

	onHiddenMask() {
		this.pickerShow();
	},

	jumpShopFilter() {
		my.navigateTo({ url: '/pages/merchant/filter/filter?type=sign' });
	},

	jumpColleaguesFilter() {
		this.data.topColleaguesList.length
			? my.navigateTo({ url: '/pages/colleagues-filter/colleagues-filter' })
			: my.setStorage({ key: 'allColleagues', data: null }) &&
			  my.setStorage({ key: 'chooseColleagues', data: [] }) &&
			  my.navigateTo({ url: '/pages/colleagues-filter/colleagues-filter' });
	},

	// 时间选择
	bindPickerChange(e) {
		this.setData({
			'filterData.type': this.data.dateType[e.detail.value].value,
		});
		let dateList = this.data.dateType;
		dateList.forEach(item => {
			item.isShow = false;
		});
		dateList[e.detail.value].isShow = dateList[e.detail.value].isShow === false ? true : false;
		this.setData({
			'filterData.type': this.data.dateType[e.detail.value].value,
			dateType: dateList,
			'isDate.startDate': '请选择开始时间',
			'isDate.endDate': '请选择结束时间',
		});
	},

	// 获取客户列表
	getShopList() {
		let that = this;
		merchantSuccessVist({ type: 'partly' })
			.then(res => {
				if (res.data.code === 0) {
					let list = [];
					res.data.data.forEach(item => {
						list.push({ name: item, isShow: false });
					});
					that.setData({
						topList: list,
					});
				}
			});
	},

	// 获取签到签退添加的队员
	getColleagues() {
		const that = this;
		this.setData({ topColleaguesList: [] });
    getMember().then(res => {
				const { name, group } = res.data.data;
				if (res.data.code === 0) {
					const list = [];
					name &&
						name.forEach(item => {
							list.push({ name: item, isShow: false });
						});
					that.setData({ topColleaguesList: list });
					my.setStorage({ key: 'allColleagues', data: group });
				}
			})
			.catch(err => {
				my.setStorage({ key: 'allColleagues', data: {} });
			});
	},

	// 常访问六客户选择
	thisShop(e) {
		let isArr = this.data.topList;
		let arr = [];
		isArr[e.target.dataset.index].isShow = isArr[e.target.dataset.index].isShow === false ? true : false;
		isArr.forEach(item => {
			if (item.isShow === true) {
				this.setData({ conformBtnActive: true });
				arr.push(item.name);
			}
		});
		this.setData({
			topList: isArr,
			'filterData.contractorNames': arr,
			'isDate.selectShop': arr.join('，'),
		});
	},

	// 快捷队员8个常选项
	thisColleagues(e) {
		const { index } = e.target.dataset;
		const { topColleaguesList } = this.data;
		const collTempArr = [];
		this.data.topColleaguesList[index].isShow = !this.data.topColleaguesList[index].isShow;
		topColleaguesList.forEach(({ isShow, name }) => {
			isShow && collTempArr.push(name) && this.setData({ conformBtnActive: true });
		});
		this.setData({
			topColleaguesList: topColleaguesList,
			'filterData.staffNames': collTempArr,
			'isDate.selectColleagues': collTempArr.join('，'),
		});
	},

	// 保存
	subForm() {
		my.removeStorage({ key: 'filter' });
		if (Number(this.data.filterData.startTime) > Number(this.data.filterData.endTime)) {
			my.showToast({
				type: 'fail',
				content: '开始时间不能大于结束时间',
				duration: 3000,
			});
			return false;
		}
		my.setStorage({
			key: 'filter',
			data: this.data.filterData,
			success() {
				my.switchTab({ url: '/pages/index/index' });
			},
		});
	},

	// 重置
	onReset() {
		my.removeStorage({ key: 'filter' });
		my.removeStorage({ key: 'filterShop' });
		my.removeStorage({ key: 'filterColleagues' });

		let shopList = this.data.topList.map(({ isShow, ...item }) => {
			isShow = false;
			return { isShow, ...item };
		});
		let collList = this.data.topColleaguesList.map(({ isShow, ...item }) => {
			isShow = false;
			return { isShow, ...item };
		});
		let dateList = this.data.dateType.map(({ isShow, ...item }) => {
			isShow = false;
			return { isShow, ...item };
		});

		this.setData({
			'isDate.startDate': '请选择开始时间',
			'isDate.endDate': '请选择结束时间',
			'isDate.contractorNames': '',
			'isDate.selectShop': '',
			'isDate.selectColleagues': '',
			'isDate.type': '',
			'filterData.startTime': '',
			'filterData.endTime': '',
			'filterData.type': '',
			'filterData.contractorNames': [],
			'filterData.staffNames': [],
			topList: shopList,
			topColleaguesList: collList,
			dateType: dateList,
		});
	},
});
