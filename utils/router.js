// my.navigateTo
// my.redirectTo
// my.navigateBack
// my.reLaunch
// my.switchTab

import { paramsConcatUrl } from './format'

/**
 * 路由拼接参数 >> 对象传参
 * @param {string} url  必选 要跳转路径
 * @param {object} params   必选 以对象结构传参，无参数传空对象
 * @param {funtion} success 
 * @param {funtion} fail 
 * @param {funtion} complete 
 * @returns 
 */
function NavigateTo (url, params, success, fail, complete) {
    let newUrl = paramsConcatUrl(url,params)
    console.log(newUrl);
    return my.navigateTo({url: newUrl,success,fail,complete})
}

function RedirectTo (url, params, success, fail, complete) {
    let newUrl = paramsConcatUrl(url,params)
    return my.redirectTo({url: newUrl,success,fail,complete})
}

function ReLaunch (url, params, success, fail, complete) {
    let newUrl = paramsConcatUrl(url,params)
    return my.reLaunch({url: newUrl,success,fail,complete})
}

export default {
    NavigateTo,
    RedirectTo,
    ReLaunch
}

