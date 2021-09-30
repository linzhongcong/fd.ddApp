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
		memberList: [], // 队员
		hidden: true, // 显示/隐藏当前字母选择提示框
		chooseText: '', // 当前字母
		toView: '', // 滚到指定的字母
		nav_height: '', //字母导航单个元素高度
		chooseColleagues: [], // 存储之前选中的值
		type: '',
		btnConfirmActive: false,
		selectedMembers: [], //已选中的成员
	},
	onLoad(option) {
		let that = this;
		that.getColleagues();
		my.getStorage({
			key: 'chooseColleagues',
			success(res) {
				that.setData({ chooseColleagues: res.data });
			},
		});
		this.setData({ selectedMembers: that.data.chooseColleagues });
		if (!!option.type) {
			that.setData({
				type: option.type,
			});
		}
	},

	onReady: function () {
		this.getHeight();
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

	// 获取全部队员的名称
	getColleagues() {
		const that = this;
		const resList = [];
		my.showLoading({ content: '加载中...' });
		my.getStorage({
			key: 'allColleagues',
			success(res) {
				my.hideLoading();
				if (!res.data) return my.showToast({ content: '暂无数据', type: 'fail' });
				for (let i in res.data) {
					if (i !== '') {
						let obj = {};
						obj.title = i;
						obj.list = res.data[i];
						resList.push(obj);
					}
				}
				that.setData({
					memberList: resList,
				});
			},
			fail(err) {
				my.hideLoading();
				my.showToast({ content: '获取全部队员数据失败', type: 'fail' });
			},
		});
		setTimeout(() => {
			my.hideLoading();
		}, 500);
	},

	// 点击确定
	onSubmit(e) {
		let list = []; // 选中的客户
		const nameStr = [];
		for (let i in e.detail.value) {
			if (e.detail.value[i].length !== 0) {
				nameStr.push(...e.detail.value[i]);
				list = [...nameStr];
			}
		}
		let keyName = '';
		if (!!this.data.type) {
			keyName = 'filterColleagues';
		} else {
			keyName = 'chooseColleagues';
		}
		my.setStorage({
			key: keyName,
			data: list,
			success() {
				my.navigateBack({ delta: 1 });
			},
		});
	},

	onChange(e) {
		// 确定按钮激活
		const { value } = e.detail;
		const { selectedMembers } = this.data;
		value[0] ? selectedMembers.push(value[0]) : selectedMembers.pop();
		this.setData({
			selectedMembers: selectedMembers,
			btnConfirmActive: selectedMembers.length ? true : false,
		});
	},
});
