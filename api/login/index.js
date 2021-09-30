import {BASE_URL} from '/config/index'
import request from '/plugins/Request/index'


/**
 * 登录接口，这里作示范用
 * @param {code: authCode} authCode 
 * @returns 
 */
export const authLogin =  (authCode) => {
  return request.request({
    url: `${BASE_URL}/authorization/dingtalk`,
    method: 'get',
    data: authCode,
  })
}

// 获取身份信息
export const getUser = () =>  {
  return request.request({
    url: `${BASE_URL}/auth/userinfo`,
    method: 'get'
  })
}

// !
// 排行榜 - 勤奋榜 http://yapi.tfgg5.com/project/177/interface/api/22151
export const DiligenceRanking = (params) => {
  return request.request({
    url: `/ranking-list`,
    method: 'get',
    data: params
  })
}



// 消息通知 http://yapi.tfgg5.com/project/177/interface/api/14591
export const popInfo = () => {
  return request.request({
    url: `/notice-ding-pop/info`,
    method: 'get'
  })
}

// 注意事项 http://yapi.tfgg5.com/project/177/interface/api/24653
export const popAttention = () => {
  return request.request({
    url: `/notice-ding-pop/attention`,
    method: 'get'
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


export default {
  authLogin,
  getUser,
  DiligenceRanking,
  popInfo,
  popAttention,
  isSign,
  signCount
}

