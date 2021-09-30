Page({
	data: {
		peopleNumber: 0, // 同行人数
		colleagues: [], // 同行人员
		collStrArr: [],
		clearTextOperate: false,
	},

	// 同行人员选中值
	saveColleagues() {
		const { collStrArr, colleagues } = this.data;
		clearTimeout(timer);
		const nameStr = [];
		const timer = setTimeout(() => {
			colleagues.forEach(item => {
				nameStr.push(item.username);
			});
			if (nameStr.includes('')) {
				return my.showToast({ type: 'fail', content: '请填写同行人员姓名' });
			} else {
				my.setStorageSync({
					key: 'colleagues',
					data: collStrArr,
				});
				my.navigateBack({ delta: 1 });
			}
		}, 300);
	},

	// 同行人员绑定值
	bindColleagues(e) {
		const { value } = e.detail;
		const { index } = e.currentTarget.dataset;
		const nameStr = `colleagues[${index}].username`;
		this.setData({ [nameStr]: value });
		const { colleagues, collStrArr } = this.data;
		const { username } = colleagues[index];
		collStrArr.length ? collStrArr.splice(index, 1, username) : collStrArr.push(username);
	},

	settingClearText() {
		this.setData({ clearTextOperate: false });
	},

	// 重置同行人数input框值
	deleteColleagues(e) {
		const { index } = e.currentTarget.dataset;
		const name = `colleagues[${index}].username`;
		const { collStrArr } = this.data;
		collStrArr.splice(index, 1);
		this.setData({ [name]: '', collStrArr: collStrArr, clearTextOperate: true });
		my.setStorageSync({ key: 'colleagues', data: collStrArr.length ? collStrArr : [] });
	},

	onLoad({ peopleNumber, colleagues: coll }) {
		this.setData({ peopleNumber: peopleNumber - 1 });
		const collArr = coll && coll.split(',');
		if (collArr.length === peopleNumber - 1) {
			this.setData({
				collStrArr: coll.split(','),
				colleagues: coll
					.split(',')
					.filter(item => item !== '')
					.map(item => ({ username: item })),
			});
		} else if (collArr.length < peopleNumber - 1) {
			const colleaguesArr = [];
			for (let index = 0; index < peopleNumber - 1; index++) {
				colleaguesArr.push({ username: collArr[index] ? collArr[index] : '' });
			}
			this.setData({ colleagues: colleaguesArr });
		} else if (collArr.length > peopleNumber - 1) {
			const colleaguesArr = [];
			const collArrStr = [];
			for (let index = 0; index < peopleNumber - 1; index++) {
				colleaguesArr.push({ username: collArr[index] ? collArr[index] : '' });
				collArrStr.push(collArr[index]);
			}
			this.setData({ colleagues: colleaguesArr, collStrArr: collArrStr });
		} else {
			const colleaguesArr = [];
			for (let index = 0; index < peopleNumber - 1; index++) colleaguesArr.push({ username: '' });
			this.setData({ colleagues: colleaguesArr });
		}
	},
});
