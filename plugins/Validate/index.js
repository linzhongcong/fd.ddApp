import Validate from './Validate'

// 全局校验规则项开关 exp: name: {required: treu} email: {required: true, email: true}
const RULES_GLOBAL = [

]

// 全局校验规则项开关提示信息 exp: name: {required: '名称必填'} email: {required: '邮箱必填', email: '请输入合法邮箱'}
const MESSAGES_GLOBAL = [

]

let $validate = new Validate(RULES_GLOBAL, MESSAGES_GLOBAL)

$validate.addMethod('example', (value, params) =>  {
  console.log("校验参数的值", value, '校验的参数',params);
},'全局添加校验方法示例')


export default $validate

/**
 * https://github.com/wux-weapp/wx-extend/blob/master/docs/components/validate.md
 * 
 * 1，程序入口引入后注入
 * 2，my.$vali 使用
 * 3，全局常用校验在此文件配置，然后在页面实例中调用实例方法
 * 4，也可以在页面引入通过进行局部配置 
 * 如何配置 new Validate(ruleConfig, messageConfig)
 */