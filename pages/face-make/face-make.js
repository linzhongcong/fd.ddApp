import { facadeSupplement } from '/api/sign/index'
Page({
  data: {
    isMap: {
      lat: '',
      lng: ''
    },
    merchant: {
      name: '',
      type: ''
    },
    facade: {
      contractorId: '',
      name: '',
      address: '',
      lat: '',
      lng: '',
    },
    btnType: false
  },

  onLoad(option) {
    this.setData({
      'merchant.name': option.name,
      'merchant.type': option.type,
      'facade.contractorId': Number(option.id),
      'isMap.lat': option.lat,
      'isMap.lng': option.lng,
      'facade.lat': option.lat,
      'facade.lng': option.lng,
    })
  },

  onShow(){
    this.materials()
  },

  jumpMap(){
    my.navigateTo({ url: '/pages/location/amap/amap?type=face&lat=' + this.data.isMap.lat + '&lng=' + this.data.isMap.lng });
  },
  // 判断是否通过地点微调获取定位
  materials(){
    let _this = this;
    my.getStorage({
      key: 'material',
      success: function(res) {
        if(!!res.data){
          _this.setData({
            'facade.lng': res.data.location.lng,
            'facade.lat': res.data.location.lat,
            'facade.address': res.data.pname + res.data.cityname + res.data.adname + res.data.address,
          })
        }
      }
    })
  },

  subForm(e){
    this.setData({
      'facade.name': e.detail.value.name,
      'facade.address': e.detail.value.address,
    })
    if(this.data.facade.name === ''){
      my.alert({
        title: '系统/门店名称不能为空！',
        buttonText: '我知道了',
      });
      return;
    }
    if(this.data.facade.address === ''){
      my.alert({
        title: '门店地址不能为空！',
        buttonText: '我知道了',
      });
      return;
    }
    let than = this;
    let data = this.data.facade
    facadeSupplement(data)
      .then(res => {
        than.setData({
          'facade.facadeId': res.data.data.id
        })
        my.setStorage({//缓存数据
          key: 'facade',
          data: than.data.facade,
          success: function() {
            my.removeStorage({
              key: 'material',
              success: function(){
                my.navigateBack({delta: 1});
              }
            });
          }
        })
      })
      .catch(err => {
        my.alert({
          title: err.data.msg,
          buttonText: '我知道了',
        });
      })
  },

});
