import format from '/utils/common/js/format';
import { FILE_URL } from '/config/index'
import { signList,signCount } from '/api/sign/index'
import { userDetail } from '/api/user/index'

Page({
	data: {
		info: {
			userId: '',
			name: '',
			numbers: 0,
			department: '',
			deptJobName: '',
		},
		signListAll: [],
		signInfo: [],
		also: true, // 是否还有数据
		page: 1,
		filterShop: {},
		statisticsInfo: {}
	},

	onShow() {
		this.getUserStatisticsData();
    this.getUserCountNum();
    this.getSignList(1)
	},

	// 页面被拉到底部
	onScrollToLower() {
		let pages = this.data.page;
		pages += 1;
		this.setData({page: pages}, () => {
      this.getSignList(pages);
    });
	},

	dateCon(data) {
		// 格式化日期
		let dates = new Date(data * 1000);
		dates =
			dates.getFullYear() +
			'年' +
			(dates.getMonth() + 1 > 9 ? dates.getMonth() + 1 : '0' + (dates.getMonth() + 1)) +
			'月' +
			(dates.getDate() > 9 ? dates.getDate() : '0' + dates.getDate()) +
			'日';
		return dates;
	},

	timeCon(data) {
		// 格式化时间
		let datas = new Date(data * 1000);
		datas =
			(datas.getHours() > 9 ? datas.getHours() : '0' + datas.getHours()) +
			':' +
			(datas.getMinutes() > 9 ? datas.getMinutes() : '0' + datas.getMinutes()) +
			':' +
			(datas.getSeconds() > 9 ? datas.getSeconds() : '0' + datas.getSeconds());
		return datas;
	},

	drop(property) {
		// 降序规则
		return (data, datas) => {
			if (data[property] > datas[property]) {
				return -1;
			} else if (data[property] < datas[property]) {
				return 1;
			} else {
				return 0;
			}
		};
	},

	// 我的-签到列表信息
	getSignList(pages) {
		let that = this;
		let params = {};
		params.page = pages;
		params.perPage = 20;
		params.createdBy = that.data.info.name;
		if (pages == 1) {
			// 初始化数据
			that.data.signInfo.length = 0;
			that.data.signListAll.length = 0;
		}
		my.showLoading({ content: '加载中...' });
		let filter = my.getStorageSync({ key: 'filter' });
		if (filter.data) {
			params.contractorNames = filter.data.contractorNames.join(',');
			params.staffNames = filter.data.staffNames.join(',');
			params.endTime = filter.data.endTime;
			params.startTime = filter.data.startTime;
			params.type = filter.data.type;
			that.setData({ filterShop: params });
		}
		that.getSignData(params);
	},

	getSignData(params) {
		let that = this;
		let list = [];
		for (let i in params) !params[i] && delete params[i];

		signList(params)
			.then(res => {
				// 查询数据为空
				if (!res.data.data.list.length) {
					return my.showToast({ content: '暂无数据', duration: 3000 });
				}

				res.data.data.list.forEach(item => {
					// 获取我的签到数据
					//if(that.data.info.userId == item.createdId){
					item.date = that.dateCon(new Date(item.signin_at.date).getTime() /1000 );
					item.timer = item.signin_at.time;
					item.visitType = format.formatSign(item.checkinWay);
					item.merchantType = format.formatShop(item.merchantType);
					list.push(item);
					//}
				});

				if (that.data.signListAll.length != 0) {
					// 存储上个分页的签到数据
					that.data.signListAll.forEach(item => {
						list.push(item);
					});
				}
				if (list.length != 0) {
					// 数组去重
					// 将不同日期数据降序并存储到新数组中
					let signList = [];
					list.map(items => {
						let result = signList.find(item => {
							return item.date === items.date;
						});
						if (result) {
							result.info.push(items);
						} else {
							signList.push({ date: items.date, info: [items] });
						}
					});
					signList = signList.sort(that.drop('date')); // 根据时间排序
					// 将同日期的数据存储到一个数组中
					signList.forEach(item => {
						list.forEach(items => {
							if (item.date === items.date && item.info[0].id != items.id) {
								item.info.push(items);
							}
						});
						item.info = item.info.sort(that.drop('timer')); // 当天日期排序
					});

					// 同日期数据追加进新数组
					that.setData({
						signInfo: signList,
						signListAll: list,
					});
				}
			})
			.catch(err => {
				my.showToast({
					type: 'fail',
					content: `${err.msg || err.data.msg}`,
					duration: 3000,
				});
			});
	},

	showSign(e) {
		my.previewImage({
			urls: [e.currentTarget.dataset.img],
		});
	},

	// 跳转签到详情
  jumpInfo(e) {
    let id = e.currentTarget.dataset.item.checkinId, signType = e.currentTarget.dataset.item.checkinWay
    , url =  '/pages/check-in-details/check-in-details'
		my.navigateTo({ url: `${url}?id=${id}&signType=${signType}`});
	},

	// 重置
	reset(e) {
		my.removeStorageSync({
			key: 'shopList',
		});
		my.removeStorageSync({
			key: 'filter',
		});
		this.getSignList(1);
	},

	// 筛选
	jumpFilter() {
		my.setStorage({
			key: 'chooseColleagues',
			data: [],
			success() {
				my.navigateTo({ url: '/pages/sign-filter/sign-filter' });
			},
		});
	},

	// 获取个人信息数据
	getUserCountNum() {
		let that = this;
		signCount()
			.then(res => {
				my.hideLoading();
				that.setData({
					'info.userId': res.data.data.userId,
					'info.name': res.data.data.userName,
					'info.department': res.data.data.deptName,
					'info.deptJobName': res.data.data.jobName,
					'info.numbers': res.data.data.monthDay,
				});
			})
			.catch(err => {
				my.hideLoading();
			});
	},

	// 获取我的页面顶部数据
	getUserStatisticsData() {
		const that = this
		userDetail().then(({ data: { data } }) => {
				data['monthTimeLength'] = Number(data.checkinLen).toFixed(2)
				data['totalMoneyAmount'] = Number(data.totalAmount).toFixed(2)
				data['url'] = data.url ? `${FILE_URL}/${data.url}` : ''
				that.setData({ statisticsInfo: data })
			})
			.catch(err => console.log(err, 'err'));
	},
});
