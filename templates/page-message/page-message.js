/**
 * ！待优化
 * ! 还需要根据fail的错误类型来传递不同的参数给to 
 * ！ 工具 store 
 */

const types = {
  success: '操作成功', 
  fail: '操作失败', 
  info: '操作成功', 
  warn: '操作成功', 
  waiting: '操作成功'
}

class PageMessage {

  data = {
    type: 'info',
    title: '操作成功',
    subtitle: '操作成功',    
    content: "秒后自动跳转...",
    seconds: 3,
    timer: 0,
    to: '',
  }
  
  setContent(options) {
    
    let type = options.type || this.data.type
      , subtitle = options.subtitle || this.data.subtitle
      , seconds = options.seconds || this.data.seconds
      , title = types[type]
      , url = `${options.to}?from=${this.route}`
    
      this.$batchedUpdates(() => {
        this.setData({type, title, subtitle, seconds})
        //! 若不使用箭头函数则需要绑定function 运行的this 否则this 无法指向当前页面实例
        this.setData({timer: setInterval(() => {
          let _seconds = this.data.seconds -1
          this.setData({seconds: _seconds})
          if (_seconds <= 0) {
            my.redirectTo({ url })
            clearInterval(this.data.timer)
          }
        },1000) })
      })

  }

  onLoad (query) {
    try { var options = JSON.parse(query.params) } catch (e) { console.log('query error',query) }
    this.setContent(options)
  }

  onUnload() {
    console.log('onUnload')
  }
  
}

Page( my.$mixin({}, PageMessage) )