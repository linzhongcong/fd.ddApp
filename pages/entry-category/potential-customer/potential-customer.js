import { calcScrollViewHeight, formatShop } from '/utils';
import { getMerchantList } from '/api/merchant';

Page({
  data: {
    page: 1, // 页数
    perPage: 10, // 页大小
    pageCount: 1, // 最大页数
    backTop: 0, // 滚动视图顶部
    scrollViewHeight: '100vh',
    loadTipsText: '加载中...',
    queryParams: {}, // 查询条件
    dataList: [], // 列表数据
  },
  /* ------------------------------------ 生命周期 ------------------------------------ */
  onLoad() {
    calcScrollViewHeight(['#header'], (scrollViewHeight) => this.setData({scrollViewHeight}));
    
  },
  onShow() {
    this.data.page = this.data.pageCount = 1;
    this.setData({dataList: []}, () => this.getList(this.data.queryParams));
  },

  /* ------------------------------------ 交互 ------------------------------------ */
  /**
   * 去拜访
   */
  goToPage(e) {
    const { name, id, isCollect } = e.target.dataset;
    if (name === 'visit') { // 去拜访
      if (isCollect) {
        my.navigateTo({url: `/pages/sign-in/index/index?signType=return_visit&shopInfo=${JSON.stringify({id})}`}); 
      } else {
        return my.showToast({content: '不是负责人,无法拜访', duration: 1000});
      }
    } else {
      my.navigateTo({url: `/pages/category-details/potential-customer/potential-customer?id=${id}`});
    }
  },

  /**
   * 滚动底部加载
   */
  onScrollToLower() {
    this.getList(this.data.queryParams);
  },

  /* ------------------------------------ 方法 ------------------------------------ */
  /**
   * 获取潜客列表
   */
  getList(params = {}, type = '') {
    let { page, perPage, pageCount, dataList, loadTipsText } = this.data;
    if (page > pageCount) return;
    this.setData({loadTipsText: '加载中...'});
    params.merchantKind = 'potential';
    params.ownership = params.ownership || 'self';
    params.page = page;
    params.perPage = perPage;
    getMerchantList(params)
      .then(res => {
        if (res.data.code === 0) {
          let data = res.data.data;
          page = page + 1;
          pageCount = data.pageCount;
          data.list.forEach(item => item.merchantType = formatShop(item.merchantType));
          dataList = !type ? dataList.concat(data.list) : data.list;
          (data.page == data.pageCount || !data.count) && (loadTipsText = '没有更多了');
          this.setData({dataList, page, pageCount, loadTipsText});
        }
      })
      .catch(() => {
        loadTipsText = '数据加载失败,请重试';
        this.setData({loadTipsText});
      })
  },

  /**
   * 完成筛选条件
   * @return {Object} queryParams: 筛选完成的条件查询对象
   */
  handleOnOk(queryParams) {
    const backTop = this.data.backTop === 0 ? -1 : 0; // 返回顶部，不返回可能会触发底部事件
    this.setData({queryParams, page: 1, pageCount: 1, dataList: [], backTop});
    this.getList(queryParams, 'new');
  },
});
