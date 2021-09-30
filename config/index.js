// 内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
// 替换成开发者后台设置的安全域名
// const domain = 'http://localhost:3000';
// const url = 'http://suppplytest.fandow.com/v1/user/login';


/* 请求服务器 */
const baseUrl = 'https://apitest.fandow.com';                        // 测试
// const baseUrl = 'https://api.fandow.com';                            // 正式

/* 文件服务器 */
const fileUrl = 'http://api-offlinetest.fandow.com'                   // 测试
// const fileUrl = 'http://api-offline.fandow.com'                    // 正式

// 请求前缀 后缀
const prefix = '/oa/cwa'
const suffix = 'Request'

export const BASE_URL = baseUrl;
export const FILE_URL = fileUrl;
export const SUFFIX = suffix; 
export const PREFIX = prefix;

export default {
  BASE_URL, FILE_URL, PREFIX ,SUFFIX
}