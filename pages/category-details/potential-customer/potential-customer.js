import { calcScrollViewHeight, formatShop, formatSign } from '/utils';
import { merchantDetail, visitRecord, getContacaList, receiveCancel } from '/api/merchant';
const app = getApp();

Page({
  data: {
    contractorId: '', // 客户id
    tabList: [{title: '拜访记录'},{title: '联系人'}],
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
    contactList: [], // 联系人列表
    loadTipsText: '加载中...',
  },
  /* ------------------------------------ 生命周期 ------------------------------------ */
  onLoad(query) {
    calcScrollViewHeight(['#footer'], (scrollViewHeight) => this.setData({scrollViewHeight}));
    this.data.contractorId = query.id;
    this.getDetail(query.id);
    this.getVisitRecord();
  },

  /* ------------------------------------ 交互 ------------------------------------ */
  /**
   * 触底加载更多
   */
  onScrollToLower() {
    const currentTabIndex = this.data.currentTabIndex;
    !currentTabIndex ? this.getVisitRecord() : this.getContacaInfo();
  },
  /**
   * 选项卡发生变化
   */
  handleTabChange(e) {
    const currentTabIndex = e.index,
          page = 1,
          pageCount = 1,
          loadTipsText = '加载中...',
          contactList = [],
          visitRecordList = [];
    this.calcTabContentHeight(`#tab-content-${currentTabIndex}`)
    this.setData({currentTabIndex, page, pageCount, loadTipsText, contactList, visitRecordList}, () => !currentTabIndex ? this.getVisitRecord() : this.getContacaInfo());
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
    const { type, id, checkinWay } = e.target.dataset;
    if (type === 'detail') {
      my.navigateTo({url: `/pages/check-in-details/check-in-details?signType=${checkinWay}&id=${id}`});
    }
  },

  /**
   * 底部选项卡被点击
   */
  handleOnTabBarClick(e) {
    const type = e.target.dataset.type,
          { id, isCollect } = this.data.detailData;
    if (!id) return false;
    switch (type) {
      case 'cancel': // 退回
        receiveCancel({contractorId: id})
          .then(res => {
            if (res.data.code === 0) {
              my.showToast({content: '操作成功', duration: 1000});
              my.navigateBack(2);
            }
          });
        break;
      case 'visit': // 拜访
        if (isCollect) {
          my.navigateTo({url: `/pages/sign-in/index/index?signType=return_visit&shopInfo=${JSON.stringify({id})}`}); 
        } else {
          my.showToast({content: '不是负责人,无法拜访', duration: 1000});
        }
        break;
      default:
        break;
    }
  },

  /* ------------------------------------ 方法 ------------------------------------ */
  /**
   * 获取详情
   */
  getDetail(contractorId) {
    merchantDetail({contractorId})
      .then(res => {
        if (res.data.code === 0) {
          let data = res.data.data;
          let detailData = data;
          detailData.merchant_type = formatShop(data.merchant_type);
          this.setData({detailData}, () => calcScrollViewHeight(['#footer'], (scrollViewHeight) => this.setData({scrollViewHeight})));
        }
      });
  },

  /**
   * 获取拜访记录
   */
  getVisitRecord() {
    let { visitRecordList, contractorId, page, perPage, pageCount, loadTipsText } = this.data;
    if (page > pageCount) return;
    let params = { contractorId, page, perPage };
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
   * 获取列表人信息列表
   */
  getContacaInfo() {
    let { contactList, contractorId, page, perPage, pageCount, loadTipsText } = this.data;
    if (page > pageCount) return;
    let params = { contractorId, page, perPage };
    getContacaList(params)
      .then(res => {
        if (res.data.code === 0) {
          let data = res.data.data;
          page = page + 1;
          pageCount = data.pageCount;
          contactList = contactList.concat(data.list);
          (data.page == data.pageCount || !data.count) && (loadTipsText = '没有更多了');
          this.setData({contactList: data.list, page, pageCount, loadTipsText}, () => this.calcTabContentHeight('#tab-content-1'));
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
