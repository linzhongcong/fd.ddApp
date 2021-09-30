import { calcScrollViewHeight, formatShop, formatSign } from '/utils';
import { facadeDetail, visitRecord } from '/api/merchant';
const app = getApp();

const formatGoodsType = {
  importBase: '进口品为主',
  homeBase: '国产品为主',
  ownBase: '自有品为主',
  hotBase: '网红品为主',
  mixSale: '混合销售'
}

const formatSize = {
  s: '小店',
  m: '中店',
  l: '大店',
  xl: '特大店'
}

const formatType = {
  singleStore: '单体店',
  regionalChain: '区域性连锁',
  topChain: '百强连锁'
}

const formatTradeAreaLevel = {
  1: '一级商圈',
  2: '二级商圈',
  3: '三级商圈'
}

const formatTradeArea = {
  shoppingCenter: '购物中心',
  businessStreet: '商业街',
  pedestrianStreet: '步行街',
  communityStore: '社区店',
  countryStore: '乡镇店',
}

const formatCityLevel = {
  first: '一线城市',
  seconde: '二线城市',
  third: '三线城市',
  fourth: '四线城市',
  fifth: '五线城市',
  newFirst: '新一线城市',
}

Page({
  data: {
    contractorId: '', // 客户id
    facadeId: '', // 门店id
    tabList: [{title: '拜访记录'}],
    currentTabIndex: 0, // 当前选中的选项卡
    currentTabName: 'visit', // 当前选项卡名称
    tabContentHeight: '0px', // 选卡内容高度
    scrollViewHeight: '100vh', // 可滚动视图高度
    page: 1, // 当前页
    perPage: 10, // 页大小
    pageCount: 1, // 页数量
    backTop: 0, // 返回顶部
    detailData: {}, // 详情数据
    visitRecordList: [], // 拜访记录列表
    loadTipsText: '加载中...',
  },  /* ------------------------------------ 生命周期 ------------------------------------ */
  onLoad(query) {
    calcScrollViewHeight(['#footer'], (scrollViewHeight) => this.setData({scrollViewHeight}));
    let { facadeId, contractorId } = query;
    this.data.facadeId = facadeId;
    this.data.contractorId = contractorId
    this.getDetail(facadeId);
    this.getVisitRecord();
  },

  /* ------------------------------------ 交互 ------------------------------------ */
  /**
   * 触底加载更多
   */
  onScrollToLower() {
    this.getVisitRecord();
  },

  /**
   * 选项卡发生变化 暂时只有一个选项，不需要使用
   */
  handleTabChange(e) {
    const currentTabIndex = e.index,
          page = 1,
          pageCount = 1,
          loadTipsText = '加载中...',
          visitRecordList = [];
    this.calcTabContentHeight(`#tab-content-${currentTabIndex}`)
    this.setData({currentTabIndex, page, pageCount, loadTipsText, visitRecordList}, () => this.getVisitRecord());
  },

  /**
   * 选项卡首次加载回调
   */
  handleTabFirstShow() {
    this.calcTabContentHeight(`#tab-content-0`)
  },

  /**
   * 跳转
   */
  goToPage(e) {
    const { type, checkinWay, id } = e.target.dataset;
    if (type === 'detail') {
      my.navigateTo({url: `/pages/check-in-details/check-in-details?signType=${checkinWay}&id=${id}`});
    }
  },

  /**
   * 底部选项卡被点击
   */
  handleOnTabBarClick(e) {
    const { type } = e.target.dataset;
    const id = this.data.contractorId;
    if (!id) return;
    switch (type) {
      case 'facade': // 下店
        my.navigateTo({url: `/pages/sign-in/index/index?signType=patrol&shopInfo=${JSON.stringify({id})}`});
        break;
      default:
        break;
    }
  },

  /* ------------------------------------ 方法 ------------------------------------ */
  /**
   * 获取详情
   */
  getDetail(id) {
    facadeDetail({id})
      .then(res => {
        if (res.data.code === 0) {
          let detailData = res.data.data;
          detailData.size = formatSize[detailData.size];
          detailData.type = formatType[detailData.type];
          detailData.tradeArea = formatTradeArea[detailData.tradeArea];
          detailData.cityLevel = formatCityLevel[detailData.cityLevel];
          detailData.goodsType = formatGoodsType[detailData.goodsType];
          detailData.tradeAreaLevel = formatTradeAreaLevel[detailData.tradeAreaLevel];
          detailData.inBrands = detailData.inBrands.toUpperCase();
          detailData.merchantType = formatShop(detailData.merchantType);
          this.setData({detailData});
        }
      });
  },

  /**
   * 获取拜访记录
   */
  getVisitRecord() {
    let { visitRecordList, contractorId, facadeId, page, perPage, pageCount, loadTipsText } = this.data;
    if (page > pageCount) return;
    let params = { contractorId, facadeId, page, perPage };
    visitRecord(params)
      .then(res => {
        if (res.data.code === 0) {
          let data = res.data.data;
          page = page + 1;
          pageCount = data.pageCount;
          data.list.forEach(item => {
            let dArr = item.signin_at && item.signin_at.date.split('-');
            item.checkinWayText = formatSign(item.checkinWay);
            item.signin_at = item.signin_at && `${dArr[0]}年${dArr[1]}月${dArr[2]}日 ${item.signin_at.time}`;
          });
          visitRecordList = visitRecordList.concat(data.list);
          (data.page == data.pageCount || !data.count) && (loadTipsText = '没有更多了');
          this.setData({visitRecordList, page, pageCount, loadTipsText}, () => this.calcTabContentHeight('#tab-content-0')); // 更新一遍选项卡内容高度
        }
      })
      .catch(() => {
        loadTipsText = '数据加载失败,请重试';
        this.setData({loadTipsText});
      });
  },

  /**
   * 计算tab-content高度
   */
  calcTabContentHeight(dom) {
    let _this = this
    my.createSelectorQuery().select(dom).boundingClientRect().exec(function (ret) {
      const tabContentHeight = ret[0].height + 'px';
      _this.setData({tabContentHeight});
    });
  },
});
