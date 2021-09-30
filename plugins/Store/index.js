import store from './herculexStore'

export default store;


/**
 * 便捷注入方式
 * store 便捷注入可以不用在每个页面引入store插件
 * 步骤：
 * 1，自行插件源码得index.js中得register函数后加入下面函数，拦截Page config 已修改模块下可不加以下代码
 *  
 Store.prototype.install = function () {
    let _store = this, _needMount = {},
    fns = [App, Page, Component], componentLikeFns = [Component]
    _needMount.$store = _store

    fns.forEach(originFn => {
      const highjackedFn = (config) => {
        !config && (config = {})
        let _config = this.register(config)
        originFn(_config)
      }
      switch (originFn) {
        case App: App = highjackedFn; break;
        case Page: Page = highjackedFn; break;
        case Component: Component = highjackedFn; break;
        default: return
      }
    })
  }
 * 
 * 2，在入口app.js处 引入
 *  import $store from './plugins/Store/index'
 *  $store.install() // 注入 store
 * 
 * 3，在页面中通过this.$store 使用
 */