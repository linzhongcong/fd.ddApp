// 客户/线索相关
import request from '/plugins/Request/index'

// ！
// 客户搜索 http://yapi.tfgg5.com/project/177/interface/api/7325
export const searchShop = (params) => {
  return request.request({
    url: `/searchData/contractor`,
    method: 'get',
    data: params
  })
}

// ！
// 门店搜索 http://yapi.tfgg5.com/project/177/interface/api/7361
export const searchStore = (params) => {
  return request.request({
    url: `/searchData/facade`,
    method: 'get',
    data: params
  })
}

// 线索池商户列表 http://yapi.tfgg5.com/project/177/interface/api/43126
export const merchantList = (params) => {
  return request.request({
    url: `/contractor/home`,
    method: 'get',
    data: params
  })
}

// 历史拜访 http://yapi.tfgg5.com/project/177/interface/api/29543
export const visitRecord = (params) => {
  return request.request({
    url: `/contractor/visitingRecord`,
    method: 'get',
    data: params
  })
}

// 历史订单 http://yapi.tfgg5.com/project/177/interface/api/29537
export const orderRecord = (params) => {
  return request.request({
    url: `/contractor/historyOrder`,
    method: 'get',
    data: params
  })
}

// 客户详情 http://yapi.tfgg5.com/project/177/interface/api/29567
export const merchantDetail = (params) => {
  return request.request({
    url: `contractor/detail`,
    method: 'get',
    data: params
  })
}

// !
// 收藏 http://yapi.tfgg5.com/project/177/interface/api/43130
export const collectAct = (params) =>  {
  return request.request({
    url: `/contractor/collect`,
    method: 'post',
    data: params
  })
}

// 取消收藏 http://yapi.tfgg5.com/project/177/interface/api/43131
export const collectCancel = (params) => {
  return request.request({
    url: `/contractor/cancel-collect`,
    method: 'post',
    data: params
  })
}

// 领取 http://yapi.tfgg5.com/project/177/interface/api/43187
export const receive = (params) => {
  return request.request({
    url: `/contractor/receive`,
    method: 'post',
    data: params
  })
}

// 退回 http://yapi.tfgg5.com/project/177/interface/api/43188
export const receiveCancel = (params) => {
  return request.request({
    url: `/contractor/return`,
    method: 'post',
    data: params
  })
}

// 获取用户拜访的商家名称 http://yapi.tfgg5.com/project/177/interface/api/12443
export const merchantSuccessVist = (params) => {
	return request.request({
    url: `/app-checkin-v2/getCheckinContractor`,
    method: 'get',
    data: params
  }) 	
}

// 搜索成员 http://yapi.tfgg5.com/project/177/interface/api/14711
export const getMember = (params) => {
  return request.request({
    url: `searchData/member`,
    method: 'get',
    data: params
  })
}

// 转化 http://yapi.tfgg5.com/project/177/interface/api/43129
export const clueTransfer = (data) => {  
  return request.request({
    url: `/contractor/convert`,
    method: 'post',
    data: data
  })
}

// 搜索工商信息 http://yapi.tfgg5.com/project/177/interface/api/43158
export const searchBusinewss = (params) => {
  return request.request({
    url: `/company-info`,
    method: 'get',
    data: params
  })
}

// 获取客户列表 http://yapi.tfgg5.com/project/177/interface/api/44183
export const getMerchantList = (params) => {
  return request.request({
    url: `/contractor/list`,
    method: 'get',
    data: params
  })
}

// 获取联系人列表 http://yapi.tfgg5.com/project/177/interface/api/44199
export const getContacaList = (params) => {
  return request.request({
    url: `/contractor/contact-list`,
    method: 'get',
    data: params
  })
}

// 获取合作门店列表 http://yapi.tfgg5.com/project/177/interface/api/44223
export const getFacadeList = (params) => {
  return request.request({
    url: `/facade/list`,
    method: 'get',
    data: params
  })
}

// 获取合作门店详情 http://yapi.tfgg5.com/project/177/interface/api/44207
export const facadeDetail = (params) => {
  return request.request({
    url: `/facade`,
    method: 'get',
    data: params
  })
}

export default {
  searchShop,
  searchStore,
  merchantList,
  visitRecord,
  orderRecord,
  merchantDetail,
  collectAct,
  collectCancel,
  receive,
  receiveCancel,
  merchantSuccessVist,
  getMember,
  clueTransfer,
  searchBusinewss,
  getMerchantList,
  getContacaList,
  getFacadeList,
  facadeDetail,
}