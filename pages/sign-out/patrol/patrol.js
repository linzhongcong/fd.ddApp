import format from '/utils/common/js/format'
import { chooseImage, getCurrentLocation } from '/utils/API'
import { signDetail,signOutPatrol,checkDistance } from '/api/sign/index'
import Global from '/Global'

let app = new Global()

Page({
  data: {
    shopType: '', // 当前客户类型
    shopIndex: '', // 客户类型索引
    shopTypes: [], // 客户类型集合
    visitType: '', // 签到类型
    signOutImages: [], // 签退照片
    signInfo: {}, // 签退详情
    

    showStoreComponents: false, // 显示填写门店详情组件
    showSaleComponents: false, // 显示填写销售详情组件
    modifyStore: false,  // 门店详情填写状态
    modifySale: false, // 销售详情填写状态

    skuCount: '', // 门店sku数
    shelfPeople: '', // 视野内认数
    salesGrowthSuggestion: '', // 销售建议
    facadeSaleDetail: [], // 门店销售详情
    competitorRecord: [], // 竞对记录（结构同门店陈列）
    excellentFacadeDisplay: [], // 优秀陈列
    facadeSaleDetail: [], // 销售详情
    facadePosRecord: [], // POS记录


    signTime: '', // 签到时间
    signoutTime: '', // 签退时间 
    seconds: 2, // 签退倒数秒数
    visitDuration: null, // 访问时长
    visitDurationTimer: null, // 访问时长计时器
    loading: false, // 提交按钮
    
  },

/*---------------------------------   交互逻辑   ---------------------------------*/ 

  // 地址微调
  mapUrl() {
    let lat = this.data.signInfo.lat, lng = this.data.signInfo.lng
    if (!lat || !lng) {
      my.showToast({content: `请确保定位功能开启，若仍无法使用此功能，请返回上级页面后再试`})
    } else {
      my.navigateTo({url: `/pages/location/amap/amap?type=cooperative&lat=${lat}&lng=${lng}`})
    }
  },

  // 新增联系人
  addContacts() {
    let id = this.data.signInfo.contractorId, name = this.data.signInfo.merchantName
    my.navigateTo({url: `/templates/add-contacts/add-contacts?id=${id}&name=${name}`})
  },

  // 填写门店详情
  onStoreDetail() {
    let facadeName = this.data.signInfo.facadeName, checkinWay = this.data.signInfo.checkinWay
    my.navigateTo({url: `/pages/add-store-detail/add-store-detail?checkinWay=${checkinWay}&facadeName=${facadeName}`})
  },
  
  // 填写销售详情
  onAddSaleDetail() {
    let facadeName = this.data.signInfo.facadeName, checkinWay = this.data.signInfo.checkinWay
    my.navigateTo({url: `/pages/add-sale-detail/add-sale-detail?checkinWay=${checkinWay}&facadeName=${facadeName}`})
  },

  /*######################   上传照片相关   #########################*/

  // 张片上传
  upSignOutImage(e) {
    let signOutImages = this.data.signOutImages
    if (signOutImages.length >= 3) return my.showToast({ content: '最多上传3张照片', type: 'fail', duration: 1000 })  
    chooseImage(this, file => { 
      signOutImages.push(file.data.fileUploadVo); this.setData({signOutImages}) 
    })
  },

  onLoadImg() {
    my.hideLoading()
  },
  
  // 张片预览
  preview(e) {
    let urls = this.data.signOutImages.map(item => item.objectUrl)
    my.previewImage({ urrent: e.currentTarget.dataset.index, urls});
  },

  // 照片删除
  delImg(e) {
    let signOutImages = this.data.signOutImages
    signOutImages.splice(e.currentTarget.dataset.index, 1)
    this.setData({signOutImages: signOutImages})
  },

  // 视野人数输入
  onInput(e) {
    this.setData({ shelfPeople: e.detail.value})
  },

  // 增增建议输入
  onTextArea(e) {
    this.setData({ salesGrowthSuggestion: e.detail.value})
  },

  formatStroageData() {
    let storeDisplay = my.getStorageSync({key: 'storeDisplay'}).data
    , storeSale = my.getStorageSync({key: 'storeSale'}).data
    // console.log("storeDisplay",storeDisplay,"storeSale",storeSale);

    if (storeSale) {
      let {facadePosRecord, facadeSaleDetail, sku_count} = storeSale
      , _facadePosRecord = [], _facadeSaleDetail  = [];

      facadeSaleDetail.forEach(fdItem => {
        _facadeSaleDetail.push({productId: fdItem.id, salePrice: fdItem.sale_price , inventory: fdItem.inventory})
      })

      facadePosRecord.forEach(frItem => {
        _facadePosRecord.push({brands: frItem.brands, fileItems: frItem.posRecordImg})
      })
      
      this.setData({
        facadePosRecord: _facadePosRecord, facadeSaleDetail: _facadeSaleDetail, 
        skuCount: sku_count, modifySale: true
      }) 
    } else {
      this.setData({modifySale: false})
    }
    
    if (storeDisplay) {
      let {facadeDisplay, excellentFacadeDisplay, competitorRecord} = storeDisplay
      // [[{},{},{}], [{},{},{}]]
      let list = [], list2 = []
      facadeDisplay.forEach(fd_item => {
        let _list = []
        fd_item.forEach(item => {
          if (item.options) {
            let _option = item.options.find((o_item) => o_item.checked === true)
            if (_option) _list.push({questionId: item.id, optionId: _option.id, value: _option.label});
          } else {
            _list.push({questionId: item.id, optionId: 0, value: item.value})
          }
        })
        list.push(_list)
      })
      
      // console.log("fd_item", list);

      competitorRecord.forEach(cr_item => {
        let _list = []
        cr_item.forEach(item => {
          if (item.type === 'image') {
            _list.push({questionId: item.id, optionId: 0, value: item.value})
          } else {
            _list.push({questionId: item.id, optionId: 0, value: item.value})
          }
        })
        list2.push(_list)
      })

      // console.log("cr_item", list2);
            
      this.setData({facadeDisplay: list, competitorRecord: list2, excellentFacadeDisplay, modifyStore: true})
    } else {
      this.setData({modifyStore: false})
    }
  },


  removeStorage() {
    my.removeStorage({key: 'storeDisplay'})
    my.removeStorage({key: 'storeSale'})
    my.removeStorage({key: 'products'})
  },

  // 签退
  onSubmit(e) {
    // console.log("e",e);
    let timer = setTimeout(() => {
    let form = e.detail.value
    , signInfo = this.data.signInfo
    , params = {}
    params.checkinWay = signInfo.checkinWay
    params.checkinId = signInfo.checkinId
    params.lat = signInfo.lat
    params.lng = signInfo.lng
    params.address = signInfo.address
    params.contractorId = signInfo.contractorId
    params.fileItems = this.data.signOutImages

    params.shelfPeople = form.shelfPeople
    params.salesGrowthSuggestion = form.salesGrowthSuggestion
    params.facadeDisplay = this.data.facadeDisplay
    params.competitorRecord = this.data.competitorRecord
    params.excellentFacadeDisplay = this.data.excellentFacadeDisplay
    params.acadePosRecord = this.data.acadePosRecord
    params.facadeSaleDetail = this.data.facadeSaleDetail
    params.facadePosRecord = this.data.facadePosRecord
    params.skuCount = this.data.skuCount
    
    my.showLoading({content: '加载中...'})
  
  
    // 未通过校验则含有tittle,result: false，通过则只有result: true 
    let valiResult = [], flag = false;
    valiResult = noEmpty(params)
    // console.log('valiResult',valiResult, 'params', params, 'form', form);
    valiResult.reverse().forEach(element => {
      if (element.result === false) {
        flag = true;
        my.hideLoading();
        return my.showToast({content: ''+ element.title + ''})
      }
    })
  
    if (!flag) this.checkDistance(params);
        
    }, 255);
  },



/*---------------------------------   数据获取   ---------------------------------*/
  // 距离检查
  checkDistance(params) {
    const {contractorId, facadeId, lat , lng} = this.data.signInfo
    let data = {contractorId, facadeId, lat, lng}
    checkDistance(data).then(res => {
      const isException = res.data.data.isException
      if (isException) {
        my.confirm({title: '提示', content: '已超出限定范围，是否继续签退',confirmButtonText: '继续签退', cancelButtonText: '取消'})
        .then(result => {
          params.isException = isException
          this.sendSignOut(params)
        })
        .catch(error => {
          // console.log("取消操作",error);
        })
      } else {
        this.sendSignOut(params)
      }
    })
  },

  // 发送签退请求
  sendSignOut(params) {
      this.setData({loading: true})
      signOutPatrol(params)
      .then( res => {
        my.hideLoading()
        this.setData({loading: false})
        my.switchTab({url: '/pages/user/index/index'})
        this.removeStorage()
      })
      .catch(err => {  
        my.hideLoading()
        this.setData({loading: false})
        my.showToast({content: String(err.data.msg)})
      })
  },

  // 签到详情获取 
  fetchSignDetail(id) {
    signDetail({checkinId: id}).then(res => {
      let data = res.data.data
      , visitType = this.formatVisitType(data.checkinWay).label
      , shopIndex = this.formatShopType(data.merchantType).index
      , signTimefmt =  format.timeFormat(data.signinAt, 'yyyy-MM-dd hh:mm:ss')
      , signTime =  format.timeFormat(data.signinAt, 'hh:mm:ss')
      , signInfo = {
        checkinWay: data.checkinWay, checkinId: data.checkinId, 
        contractorId: data.contractorId, merchantName: data.merchantName, merchantType: data.merchantType, 
        facadeId: data.facadeId, facadeName: data.facadeName, 
        facadeLat: data.facadeLat,facadeLng: data.facadeLng,facadeAddress: data.facadeAddress
      }
      this.setData({signInfo, signTime, shopIndex, visitType, signOutImages: []})
      this.visitDurationTimer(signTimefmt)
      this.getLocation()
    })
  },

/*---------------------------------   页面初始化   ---------------------------------*/
  // 获取想要的客户类型，参数解释同上 params: wannaVal
  formatVisitType: app.getVisitType.bind(app),
  formatShopType: app.getShopType.bind(app),

  // 访问时长计时器
  visitDurationTimer(signTime) {
    let that = this
    this.setData({
      signoutTime: format.thisTimeFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      visitDuration: format.checkinLength(signTime),
      visitDurationTimer: setInterval(() => {
        that.setData({ signoutTime: format.thisTimeFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'), visitDuration: format.checkinLength(signTime) })
      }, 1000)
    })
  },

  // 获取地理位置
  getLocation() {
    getCurrentLocation(false).then(res => {
      if (res.address) { this.setData({'signInfo.address': res.address, 'signInfo.lat': res.latitude, 'signInfo.lng': res.longitude}) }
    }).catch(err => { my.showToast({content: '位置信息获取失败...'}) })
  },
  
  // 获取地址微调地址
  setLocationMaterial() {
    let materialData = my.getStorageSync({key: 'material'}).data
    if (materialData) {
      let address = materialData.pname + materialData.cityname + materialData.adname + materialData.address + materialData.name
      this.setData({'signInfo.address': address, "signInfo.lat": materialData.location.lat, "signInfo.lng": materialData.location.lng })
    }
  },

  
/*---------------------------------   页面周期   ---------------------------------*/
  onLoad(query) {
    this.fetchSignDetail(query.id)
  },

  onReady() {
    this.setData({shopTypes: app.shopTypes, answersListChoseceGroup: []})
  },

  onShow() {
    my.showLoading({content: '加载中...'})
    this.setLocationMaterial()
    setTimeout(() => { 
      this.formatStroageData()
      my.hideLoading()
    }, 2000)
  },

  onUnload() {
    clearInterval(this.data.visitDurationTimer)
    my.removeStorageSync({key: 'material'})
  }
});

function noEmpty(params) {
  let result = []
  Object.keys(params).forEach(key => {
    if (key === 'address') {
      if (params.address) { 
        result.push({result: true})
      } else {
        result.push({title: '无法获取定位地址，请重新尝试', result: false})
      }
    }

    if (key === 'fileItems') {
      let ele = params[key]
      if (ele.length > 0) {
        result.push({result: true})
      } else {
       result.push({title: '请上传照片', result: false})
      }
    }

    if (key === 'shelfPeople') {
      if (params[key] !== '') {
        result.push({result: true})
      } else {
        result.push({title: '视野内人数不能为空,且必须为整数', result: false})
      }
    }

    if (key === 'skuCount') {
      if (params[key] !== '') {
        result.push({result: true})
      } else {
        result.push({title: '请填写门店SKU数', result: false})
      }
    }

    if (key === 'facadeDisplay') {
      if (params[key]) {
        if (params[key].length > 0) {
          result.push({result: true})
        } else {
          result.push({title: '请填写门店陈列', result: false})  
        }
      } else {
        result.push({title: '请填写门店陈列', result: false})
      }
    }

    if (key === 'competitorRecord') {
      if (params[key] && params[key].length > 0) {
        result.push({result: true})
      } else {
        result.push({title: '请填写竞对记录', result: false})
      }
    }

    // if (key === 'facadeSaleDetail') {
    //   if (params[key]) {
    //     if (params[key].length > 0) {
    //       result.push({result: true})
    //     } else {
    //       result.push({title: '请填写产品明细', result: false})
    //     }
    //   }
    // }

  })
  return result
}

// const signDetail = {
//   checkinId: '', // 签到类型
//   contractorId: '', // 合作客户ID
//   lat: '', // 维度
//   lng: '', // 经度
//   fileItems: [{}], // 签退照片
//   surveyInfo: [{
//     questionId: '', // 问题ID
//     optionId: '', // 选项ID 
//     name: '', // 名
//     value: '', // 值
//     remark: '' // 备注
//   }] // 问卷调查数据
// }

// /** 门店详情 */

// const facadeDisplay = [{
//   questionId: '', // 问题ID
//   optionId: '', // 选项ID
//   value: '', // 答案， 图片则为图片对象数组
// }] // 门店陈列

// const excellentFacadeDisplay = [{
  
// }] // 优秀门店陈列（图片实体数组 

// const competitorRecord = [{
//   questionId: '', // 问题ID
//   optionId: '', // 选项ID
//   value: '', // 答案， 图片则为图片对象数组
// }] // 竞对记录（结构同门店陈列


// /** 销售详情 */

// const facadeSaleDetail = [{
//   productId: '', // 产品ID
//   salePrice: '', // 门店销售价
//   inventory: '', // 门店库存
// }] // 门店销售详情

// const facadePosRecord = [{
//   brand: '', // 品牌名
//   fileItems: '', // 品牌图片
// }] // POS记录