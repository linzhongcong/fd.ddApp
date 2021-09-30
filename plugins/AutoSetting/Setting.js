/**
 * 该文件需要在node环境下使用
 */

module.exports = {
  "pages": [
    "pages/logining/logining", // 加载
    "pages/entry/entry", // 客户 - 入口
    "pages/entry-category/leads/leads", // 销售线索
    "pages/entry-category/public-leads/public-leads", // 线索公海
    "pages/entry-category/potential-customer/potential-customer", // 潜在客户
    "pages/entry-category/public-customer/public-customer", // 客户公海
    "pages/entry-category/cooperate-customer/cooperate-customer", // 合作客户
    "pages/entry-category/cooperate-facade/cooperate-facade", // 合作门店
    "pages/category-details/leads/leads", // 线索详情
    "pages/category-details/potential-customer/potential-customer", // 潜在客户客详情
    "pages/category-details/cooperate-customer/cooperate-customer", // 合作客户详情
    "pages/category-details/cooperate-facade/cooperate-facade", // 合作门店详情
    "pages/index/index", // 首页
    "pages/ranking/ranking", // 更多排行榜
    "pages/merchant/index/index", // 线索客户首页
    "pages/merchant/merchant-detail/merchant-detail", // 线索/客户详情
    "pages/merchant/clue-transfer/clue-transfer", // 线索转化
    "pages/user/index/index", // 个人中心筛选
    "pages/check-in-details/check-in-details", // 签到详情筛选
    "pages/merchant/filter/filter", // 客户筛选
    "pages/sign-filter/sign-filter", // 签到筛选
    "pages/colleagues-filter/colleagues-filter", // 同行人筛选
    "pages/sign-in/index/index", // 登录首页
    "pages/sign-in/transfer-station/transfer-station", // 登录场景
    "pages/face-make/face-make", // 门店补录
    "pages/sign-out/index/index", // 签退首页
    "pages/sign-out/return_visit/return_visit", // 回访签退
    "pages/sign-out/maintain/maintain", // 维护签退
    "pages/sign-out/patrol/patrol", // 巡店签退
    "pages/add-store-detail/add-store-detail", // 添加门店详情
    "pages/add-sale-detail/add-sale-detail", // 添加门店销售记录
    "pages/search-product/search-product", // 搜索产品
    "pages/colleagues/colleagues", // 签退首页-添加同行人员
    "templates/add-contacts/add-contacts", // 添加联系人
    "pages/fill-in-record/fill-in-record", // 签退首页-添加库存
    "pages/fill-in-shop/fill-in-shop", // 签退首页-填写客户陈列
    "pages/location/amap/amap", // 地址微调
    "pages/login-fail/login-fail", // 登录异常
    "pages/test/test" // 测试页面
  ],
  "window": {
    "enableWK": "YES",  // 启用WK
    "enableDSL": true, // 启用DSL
    "defaultTitle": "签到", // 程序标签名
    "backgroundColor": "#F5F5F9", // 背景
    "pullRefresh": false, // 是否允许下拉刷新
    "allowsBounceVertical": true,  // 是否允许向下拉拽
    "onReachBottomDistance": 100 // 上拉触发距离
  },
  "tabBar": {
    "textColor": "#000000",
    "selectedColor": "#108ee9",
    "backgroundColor": "#ffffff",
    "items": [
      // {
      //   "pagePath": "pages/index/index",
      //   "icon": "static/image/sign.png",
      //   "activeIcon": "static/image/sign_active.png",
      //   "name": "签到"
      // },
      // {
      //   "pagePath": "pages/merchant/index/index",
      //   "icon": "static/image/merchant.png",
      //   "activeIcon": "static/image/merchant-active.png",
      //   "name": "客户"
      // },
      {
        "pagePath": "pages/entry/entry",
        "icon": "static/icon/tab/customer.png",
        "activeIcon": "static/icon/tab/customer_actived.png",
        "name": "客户"
      },
      {
        "pagePath": "pages/user/index/index",
        "icon": "static/image/user.png",
        "activeIcon": "static/image/user_active.png",
        "name": "我的"
      }
    ]
  },
  "debug": true
}
