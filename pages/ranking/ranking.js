import { DiligenceRanking } from '/api/sign//index'


Page({
	data: {
		noMore: false,
		rankingType: '',
		rankingData: {
			loginName: '', // 员工姓名
			rank: 0, // 员工排名
			checkinNumber: 0, // 员工签到次数
			signingNumber: 0, // 签约合作商数量
			list: [], // 排行列表
		},
		rankingParams: { type: 'diligence', page: 1, perPage: 20 },
		tabDiligentActived: true, // 勤奋排行榜激活
		tabPerformanceActived: false, // 业绩排行榜激活
		totalActived: true, // 总榜排行榜激活
		newerActived: false, // 新人排行榜激活
	},

	// 跳转其他页面
	jumpToOtherPage(e) {
		const { type, label, username } = e.currentTarget.dataset;
		type === 'user' && my.navigateTo({ url: `../my-space/my-space?type=${type}&label=${label}&username=${username}` });
		type === 'member' && my.navigateTo({ url: `../space/space?type=${type}&label=${label}&username=${username}` });
	},

	// 切换排行榜
	changeRankingTab(e) {
		const that = this;
		const { type } = e.currentTarget.dataset;
		type === 'diligence' && this.setData({ tabDiligentActived: true, tabPerformanceActived: false, rankingType: type });
		type === 'business' && this.setData({ tabDiligentActived: false, tabPerformanceActived: true, rankingType: type });
		type === 'total' && this.setData({ totalActived: true, newerActived: false, rankingType: 'business' });
		type === 'new_people' && this.setData({ totalActived: false, newerActived: true, rankingType: type });

		const { rankingType } = this.data;
		that.setData({
			rankingData: {},
			'rankingParams.type': rankingType ? rankingType : 'diligence',
			'rankingParams.page': 1,
		});
		this.fetchRankingData(this.data.rankingParams);
	},

	// 获取排行榜信息
	fetchRankingData(parmas, isLoadMore = false) {
		const that = this;
		this.setData({ noMore: false });
		my.showLoading({ content: '加载中...' });
		DiligenceRanking(parmas)
			.then(({ data: { data } }) => {
				if (!data.list.length) {
					that.setData({ noMore: true });
					my.showToast({ type: 'fail', content: '暂无更多数据' });
					return;
				}
				isLoadMore
					? that.setData({ 'rankingData.list': [...that.data.rankingData.list, ...data.list] }) // 加载更多
					: that.setData({ rankingData: data }); // 初始化加载
				my.hideLoading();
			})
			.catch(err => {
				console.log(err, 'errr');
				my.hideLoading();
				my.showToast({ type: 'fail', content: '数据加载失败' });
			});
	},

	// 加载更多
	loadMore() {
		let { page } = this.data.rankingParams;
		page++;
		this.setData({ 'rankingParams.page': page });
		this.fetchRankingData(this.data.rankingParams, true);
	},

	onLoad() {
		this.fetchRankingData(this.data.rankingParams);
	},
});
