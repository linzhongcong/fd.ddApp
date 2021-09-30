import request from '/plugins/Request/index'

// 常规签到 http://yapi.tfgg5.com/project/177/interface/api/7373
export const signIn = (data) => {
  return request.request({
    url: `/app-checkin-v2/dingCheckin`,
    method: 'post',
    data: data,
  })
}

// 常规签退 http://yapi.tfgg5.com/project/177/interface/api/7377
export const signOut = (data) => {
  return request.request({
    url: `/app-checkin-v2/checkout`,
    method: 'post',
    data: data,
  })
}

// 回访签退 http://yapi.tfgg5.com/project/177/interface/api/43273
export const signOutReturnVisit = (data) => {
  return request.request({
    url: `/app-checkin-v2/checkout-return-visit`,
    method: 'post',
    data: data,
  })
}

// 维护签退 http://yapi.tfgg5.com/project/177/interface/api/43274
export const signOutMaintain = (data) => {
  return request.request({
    url: `/app-checkin-v2/checkout-maintain`,
    method: 'post',
    data: data,
  })
}

// 巡店签退 http://yapi.tfgg5.com/project/177/interface/api/43905
export const signOutPatrol = (data) => {
  return request.request({
    url: `/app-checkin-v2/checkout-patrol`,
    method: 'post',
    data: data,
  })
}

// !
// 签到详情 http://yapi.tfgg5.com/project/177/interface/api/7997
export const signDetail = (params) => {
  return request.request({
    url: `/app-checkin-v2/dingCheckin`,
    method: 'get',  
    data: params
  })
}

// 打卡记录 http://yapi.tfgg5.com/project/177/interface/api/7937
export const signList = (params) => {
  return request.request({
    url: `/app-checkin-v2/checkinList`,
    method: 'get',
    data: params
  })
}

// 获取签到状态 https://fanyi.baidu.com/?aldtype=16047#auto/zh
export const isSign = () =>  {
  return request.request({
    url: `/app-checkin-v2/is-checkin`,
    method: 'get'
  })
}

// 统计当日签到数 http://yapi.tfgg5.com/project/177/interface/api/12555
export const signCount = () => {
  return request.request({
    url: `/app-checkin-v2/countNum`,
    method: 'get',
  })
}

// 检查是否超出范围 http://yapi.tfgg5.com/project/177/interface/api/43905
export const checkDistance = (data) => {
  return request.request({
    url: `/app-checkin-v2/check-distance-limit`,
    method: 'post',
    data: data
  })
}

// 同行人员模糊搜索 http://yapi.tfgg5.com/project/177/interface/api/12555
export const checkColleagues = (data) => {
  return request.request({
    url: `/app-checkin-v2/check-colleagues`,
    method: 'post',
    data: data
  })
}

// 问卷列表 http://yapi.tfgg5.com/project/177/interface/api/43266
export const questionnaireList = (params) => {
  return request.request({
    url: `/app-checkin-v2/survey-list`,
    method: 'get',
    data: params
  })
} 

// 新增联系人 http://yapi.tfgg5.com/project/177/interface/api/43370
export const addContacts = (data) => {
  return request.request({
    url: `/contacts/create`,
    method: 'post',
    data: data
  })
}

// 搜索产品 http://yapi.tfgg5.com/project/177/interface/api/43915
export const searchProducts = (params) => {
  return request.request({
    url: `/app-checkin-v2/productInfo`,
    method: 'get',
    data: params
  })
}

// 获取产品类目 http://yapi.tfgg5.com/project/177/interface/api/43914
export const getProductTypes = () => {
  return request.request({
    url: `/searchData/category`,
    method: 'get',
  })
}

// 门店补录 http://yapi.tfgg5.com/project/177/interface/api/12431
export const facadeSupplement = (params) => {
  return request.request({
    url: `/facade/facadeSupplement`,
    method: 'post',
    data: params
  })
}


export default {
  signIn,
  signOut,
  signOutReturnVisit,
  signOutMaintain,
  signOutPatrol,
  signDetail,
  signList,
  isSign,
  signCount,
  checkDistance,
  checkColleagues,
  questionnaireList,
  addContacts,
  searchProducts,
  getProductTypes,
  facadeSupplement
}

