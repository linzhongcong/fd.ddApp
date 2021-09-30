
const router = require('./router');
const format = require('./format');
const API = require('./API');
const other = require('./other');



export default {
    ...router,  // 路由交互
    ...format, // 格式化
    ...API, // 小程序API 二次封装
    ...other, // 其他/临时存放
}