/**
 * 节流
 * @param {Page、Component this} context  必选 上下文即实例 用于this绑定 
 * @param {Page、Component this} method  必选 实例中的方法名
 * @returns 
 */
 export function trottle (method,context) {
    let timer = null
    return function() {
        let args = arguments, _this = context ? context : this
        if (!timer) {
          timer = setTimeout(() => {
            _this[method].apply(this,args)
            timer = null
          }, 500)
        }
    }
  }
  
  /**
   * 防抖
 * @param {Page、Component this} context  必选 上下文即实例 用于this绑定
 * @param {Page、Component this} method  必选 实例中的方法名
 * @returns 
   */
  export function debounce (method,context) {
    let timer = null
    return function() {
      let args = arguments, _this = context ? context : this
      if (!timer) {
        timer = setTimeout(() => {
        _this[method].apply(this,args)
          timer = null
        }, 500)
      } else {
        clearTimeout(timer)
        timer = null
      }
    }
  }

  /**
   * 设置 scroll-view 高度
   * @param {Array} idList: 小程序节点id  注：不要直接在自定义组件给id，获取不到节点信息
   * @param {Function} callback: 计算完成的回调,返回已经计算好的高度(带单位)
   */
  export function calcScrollViewHeight(idList, callback) {
    my.getSystemInfo({
      success: function (res) {
        let query = my.createSelectorQuery();
        idList.forEach((item) => {
          query.select(item).boundingClientRect();
        })
        query.exec((ret) => {
          let ortherHeight = ret.reduce((prev, curr) => prev + curr.height, 0),
              scrollViewHeight = res.windowHeight - ortherHeight + 'px';
          callback(scrollViewHeight);
        })
      }
    })
  }

  export default {
    debounce,
    trottle,
    calcScrollViewHeight
  }

  