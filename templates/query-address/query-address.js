Page({
  data: { lat: '', lng: '' },
  
  onmessage(e) {
    const material = e.detail.material
    if (material == 'none') {
      this.webViewContext.postMessage({ lat: this.data.lat, lng: this.data.lng }); //向网页发送信息
    } else {
      my.setStorage({ key: 'material', data: material, success: () => my.navigateBack() }) 
    } 
  },

	onLoad(query) {
    this.setData({ lat: query.lat, lng: query.lng })
    my.removeStorage({key: 'material'})
		this.webViewContext = my.createWebViewContext('web-view-1');
  },

  onShow() { my.hideLoading() },
})
