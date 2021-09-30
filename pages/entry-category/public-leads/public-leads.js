import { calcScrollViewHeight, formatShop } from '/utils';
import { getMerchantList, collectAct, collectCancel } from '/api/merchant';

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
    this.getList();
  },
  
  /* ------------------------------------ 交互 ------------------------------------ */
  /**
   * 领取/取消领取
   * @return {Object} e: 事件对象
   * e.contractorId: 当前操作目标的id
   * e.index: 当前操作目标的下标
   * e.state: 当前操作目标的领取状态
   */
  handleReceive(e) {
    const { contractorId, index, state } = e.target.dataset,
          API = state ? collectCancel : collectAct; // 根据不同状态调取不同api
    API({contractorId})
      .then(res => {
        if (res.data.code === 0) {
          const target = `dataList[${index}].isCollect`;
          this.setData({[target]: !state});
          my.showToast({content: '操作成功'});
        }
      })
      .catch(err => {
        my.showToast({content: err.data.msg});
      });
  },

  /**
   * 滚动底部加载
   */
  onScrollToLower() {
    this.getList(this.data.queryParams);
  },
  /* ------------------------------------ 方法 ------------------------------------ */
  /**
   * 获取公海列表
   */
  getList(params = {}, type = '') {
    let { page, perPage, pageCount, dataList, loadTipsText } = this.data;
    if (page > pageCount) return;
    this.setData({loadTipsText: '加载中...'});
    params.merchantKind = 'leads';
    params.ownership = 'all';
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
