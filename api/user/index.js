/** 个人中心相关 */
import request from '/plugins/Request/index'

// 个人简介获取 http://yapi.tfgg5.com/project/177/interface/api/22397
export const fetchPersonalInfo = (params) => {
  return request.request({
    url: `/space/detail/profile`,
    method: 'get',
    data: params
  })
}

// 修改个人简洁 http://yapi.tfgg5.com/project/177/interface/api/22427
export const patchPersonalInfo = (params) => {
  return request.request({
    url: `/space/detail/profile`,
    method: 'post',
    data: params
  })
}
  
// 空间主页信息 http://yapi.tfgg5.com/project/177/interface/api/22397
export const fetchSpaceHomeInfo = (params) => {
  return request.request({
    url: `/space/detail/`,
    method: 'get',
    data: params
  })
}


// 我得详情 http://yapi.tfgg5.com/project/177/interface/api/29531
export const userDetail = () => {
  return request.request({
    url: `/app-checkin-v2/checkinListTop`,
    method: 'get'
  })
}



export default {
  fetchPersonalInfo,
  patchPersonalInfo,
  fetchSpaceHomeInfo,
  userDetail
}