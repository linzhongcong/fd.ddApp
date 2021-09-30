/** 
 * 根据Setting.js 自动 生成 app.json
 * 程序先加载app.json 再进入app.js
 * 项目编译前使用 node ./plugins/AutoSetting/index.js
 */
import './plugins/Compatible/index'  // 不兼容API 兼容处理
import $validate from './plugins/Validate/index'  // 全局校验器
import { authLogin } from '/api/login/index'
import $mixin from './plugins/Mixin/index'
import $moment from './plugins/Moment/index'

my.$vali = $validate // 注入 Validator
my.$mixin = $mixin // 注入 Mixin
my.$moment = $moment // 注入 moment

const LoginAction = () => {
  // let token = my.getStorageInfoSync({key: 'token'}).data; // 这是获取storage信息的API
  // let token = my.getStorageSync({key: 'token'}).data && my.getStorageSync({key: 'token'}).data.token // 这才是获取storage里token的API
  // if (token)  my.switchTab({url: '/pages/entry/entry'}); // v2.0
  my.getAuthCode({success: ({authCode}) => {
    authLogin({code: authCode}).then(res => {
      my.setStorage({
        key: 'token', data: {token: res.data.data.access_token},
        // success: () => { my.switchTab({url: '/pages/index/index'}) } // v1.0
        success: () => { my.switchTab({url: '/pages/entry/entry'}) } // v2.0
      })
    }).catch(err => {
      if (err.data && err.data.code ) {
        my.showToast({ content: `登录失败：${err.data.code}，${err.data.msg}`, duration: 2000 })
      } else {
        my.showToast({ content: `登录失败：空响应体${err.data}`, duration: 2000 })
      }
      setTimeout(() => my.reLaunch({ url: '/pages/login-fail/login-fail' }), 2000);
    })
  }})
}

App({
  onLaunch() {
    LoginAction()
  },
  onError (error) {
    console.log( `%c app ${error}`,'color: #f00; font-weight: bold;')
    my.alert({title: '程序异常：请截图反馈给管理员', content: `${error}`, buttonText: '确定'})
  },
  onUnhandledRejection (reject) {
    const errMsg = reject.reason.data.msg  || '操作失败';
    my.hideLoading();
    console.log('%c promise reject', 'color: #f00; font-weight: bold', reject.reason);
    my.showToast({type: 'fail', content: `${errMsg}`, duration: 3000});
  },
})