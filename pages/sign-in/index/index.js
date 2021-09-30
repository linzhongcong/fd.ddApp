import format from '/utils/common/js/format';
import {chooseImage, getCurrentLocation} from '/utils/API'
import { formatShop } from '/utils/format'
import { signIn } from '/api/sign/index' 
import { merchantDetail } from '/api/merchant/index'
import Global from '/Global'

let app = new Global()


Page({
	data: {
    /* 路由参数 */
    visitTypes: {}, // 签到类型
    shopInfo: {}, // 客户信息
    business: {}, // 工商信息
    businessFlag: false, // 是否查询工商信息
    locationObj: '', // 位置信息对象

    /* 签到信息 */
    signTime: '', // 当前时间
    signType: '', // 签到类型
    longitude:  '', // 纬度
    latitude: '', // 经度 
    address: '', // 当前签到地址
    timer:  '', //  签到时间计时器
    seconds: 2, // 签到倒数秒数
    countDowner: '', // 签到结果 倒计时器
    isSign: false, // 签到成功跳转
  
		signInfo: {}, // 签到提交表单对象
    /* 客户/门店搜索 */
    searchModalShow: false, // 客户搜索开启开关
    currentSearchType: '', // 当前搜索类型
    merchantVal: '',  // 客户搜索内容
    storeVal: '', // 门店搜索内容
    merchantList: [], // 合作商列表
    merchantPage: 1,  // 客户信息当前页
    merchantPageSize: 10, // 客户信息当前页每页数量
    storeList: [], // 门店列表
    storePage: 1, 
    storePageSize: 20,

    /* 其他 */
    shopType: '', // 客户类型
    shopTypes: [], // 客户类型集合
    shopTypeIndex: 0, // 类型索引
    clientType: '', // 当前客户等级
    clientTypes: [], // 客户等级
    clientIndex: 0, // 当前客户等级索引
  },
/*-----------------------------------   交互逻辑   ------------------------------- */

  // 地址微调
  onListItemClick() {
    this.mapUrl()
  },

  // 公司名称查询 工商名称
  onStopSearch() {
    this.setData({businessFlag: true})    
  },

	// 客户类型选择
	pickerChangeType(e) {
    this.setData({shopTypeIndex: e.detail.value, 'signInfo.merchantType': this.data.shopTypes[e.detail.value].value })
  },

  // 客户等级 
  pickerChangeLevel(e) {
    // console.log("e",e);    
    this.setData({clientIndex: e.detail.value, 'signInfo.level': this.data.clientTypes[e.detail.value].name })
  },

  // 设置客户名
	setMerchantName(e) {
		this.setData({ 'signInfo.merchantName': e.detail.value });
  },
  
  // 设置门店名
	setFacadeName(e) {
		this.setData({ 'signInfo.facadeName': e.detail.value });
  },
  
  // 设置销售目标
	setSaleTarget(e) {
		e.detail.value === '' && this.setData({ loading: false });
		this.setData({ 'signInfo.salesTarget': e.detail.value });
	},

	// 门店补录跳转
	jumpFace() {
    const page = '/pages/face-make/face-make'
    ,     id = this.data.signInfo.contractorId // 合作商户ID
    ,     name = this.data.signInfo.merchantName || this.data.merchantVal // 合作商名
    ,     type = this.data.signInfo.merchantType // 合作商类型
    ,     lat = this.data.signInfo.lat
    ,     lng = this.data.signInfo.lng
    if (!name) { return my.alert({ title: '客户名称不能为空！', buttonText: '我知道了' }) }
    this.setData({searchModalShow: false})
		my.removeStorageSync({ key: 'facade' })
    my.navigateTo({url: `${page}?id=${id}&name=${name}&type=${type}&lat=${lat}&lng=${lng}`})
  },
  
                  /* ##########   上传照片相关   ##########*/
  onLoadImg() {    
    setTimeout(() => {
      my.hideLoading()
    }, 200);
  },

  // 上传门店头
  onFacadeSignFileItems () {
    let _list = this.data.signInfo.facadeSignFileItems, _listCache = this.data.signInfo.facadeSignFileItemsCache
		if (_list.length >= 3) {
      return my.showToast({ content: '最多上传3张照片', type: 'fail', duration: 3000 })
		} else {
      chooseImage(this, (file, apFilePath) => {
        _listCache.push(apFilePath) // 图片URL
        _list.push(file.data.fileUploadVo)  // 图片对象
        this.setData({ 'signInfo.facadeSignFileItems': _list, 'signInfo.facadeSignFileItemsCache': _listCache })
      })
		}
  },

  // 上传门店整体
  onOverFacadeFileItems () {
    let _list = this.data.signInfo.overFacadeFileItems, _listCache = this.data.signInfo.overFacadeFileItemsCache
		if (_list.length >= 3) {
			return my.showToast({ content: '最多上传3张照片', type: 'fail', duration: 3000 })
		} else {
      chooseImage(this, (file, apFilePath) => {
        _listCache.push(apFilePath) // 图片URL
        _list.push(file.data.fileUploadVo)  // 图片对象
        this.setData({ 'signInfo.overFacadeFileItems': _list, 'signInfo.overFacadeFileItemsCache': _listCache })
      })
		}
  },
  
  // 上传产品区
  onMaskAreaFileItems() {
    let _list = this.data.signInfo.maskAreaFileItems, _listCache = this.data.signInfo.maskAreaFileItemsCache
		if (_list.length >= 3) {
			return my.showToast({ content: '最多上传3张照片', type: 'fail', duration: 3000 })
		} else {
      chooseImage(this, (file, apFilePath) => {
        _listCache.push(apFilePath) // 图片URL
        _list.push(file.data.fileUploadVo)  // 图片对象
        this.setData({ 'signInfo.maskAreaFileItems': _list, 'signInfo.maskAreaFileItemsCache': _listCache })
      })
		}
  },

  // 上传自拍
  onSelfieFileItems() {
    let _list = this.data.signInfo.selfieFileItems || [], _listCache = this.data.signInfo.selfieFileItemsCache || []
		if (_list.length >= 3) {
			return my.showToast({ content: '最多上传3张照片', type: 'fail', duration: 3000 })
		} else {
      chooseImage(this, (file, apFilePath) => {
        _listCache.push(apFilePath) // 图片URL
        _list.push(file.data.fileUploadVo)  // 图片对象
        // console.log("file:",file,"apFilePath",apFilePath,_list);
        this.setData({ 'signInfo.selfieFileItems': _list, 'signInfo.selfieFileItemsCache': _listCache })
      })
		}
  },

	// 预览图片
	previewImg(e) {
    // console.log("previewImg",e);
    const name = e.currentTarget.dataset.name;
    switch (name) {
      case 'doorhead':
        my.previewImage({ current: e.currentTarget.dataset.index, urls: this.data.signInfo.facadeSignFileItemsCache });
      break;
      case 'doorbody':
        my.previewImage({ current: e.currentTarget.dataset.index, urls: this.data.signInfo.overFacadeFileItemsCache });
      break;
      case 'product':
        my.previewImage({ current: e.currentTarget.dataset.index, urls: this.data.signInfo.maskAreaFileItemsCache });
      break;
      case 'self':
        my.previewImage({ current: e.currentTarget.dataset.index, urls: this.data.signInfo.selfieFileItemsCache });
      break;
    }
	},

	// 删除图片e
	delImg(e) {
    // console.log("delImg",e);
    const name = e.currentTarget.dataset.name;
    const that = this;
    switch (name) {
      case 'doorhead':
        const index0 = e.currentTarget.dataset.index;
        this.data.signInfo.facadeSignFileItems.splice(index0, 1);
        this.data.signInfo.facadeSignFileItemsCache.splice(index0, 1);
        this.setData({ 'signInfo.facadeSignFileItems': that.data.signInfo.facadeSignFileItems, "signInfo.facadeSignFileItemsCache": that.data.signInfo.facadeSignFileItemsCache });
      break;
      case 'doorbody':
        const index1 = e.currentTarget.dataset.index;
        this.data.signInfo.overFacadeFileItems.splice(index1, 1);
        this.data.signInfo.overFacadeFileItemsCache.splice(index1, 1);
        this.setData({ 'signInfo.overFacadeFileItems': that.data.signInfo.overFacadeFileItems, "signInfo.overFacadeFileItemsCache": that.data.signInfo.overFacadeFileItemsCache });
      break;
      case 'product':
        const index2 = e.currentTarget.dataset.index;
        this.data.signInfo.maskAreaFileItems.splice(index2, 1);
        this.data.signInfo.maskAreaFileItemsCache.splice(index2, 1);
        this.setData({ 'signInfo.maskAreaFileItems': that.data.signInfo.maskAreaFileItems, "signInfo.maskAreaFileItemsCache": that.data.signInfo.maskAreaFileItemsCache });
      break;
      case 'self':
        const index3 = e.currentTarget.dataset.index;
        this.data.signInfo.selfieFileItems.splice(index3, 1);
        this.data.signInfo.selfieFileItemsCache.splice(index3, 1);
        this.setData({ 'signInfo.selfieFileItems': that.data.signInfo.selfieFileItems, "signInfo.selfieFileItemsCache": that.data.signInfo.selfieFileItemsCache });
      break;
    }
	},
  
/* ##########   合作商/门店搜索相关   ##########*/
  onStopSearch() {
    this.setData({businessFlag: true})
  },

  onReceiveBusiness(e) {
    console.log(e);
    this.getBusiness(e)
    this.setData({businessFlag: false})
  },

  // 开启搜索
  searchModalShow() {
    this.setData({searchModalShow: true, onlyShop: false, onlyStore: false})
  },
  
  onlyShophModalShow() {
    this.setData({searchModalShow: true, onlyShop: true, onlyStore: false})
  },

  onlyStorehModalShow() {
    let contractorId = this.data.signInfo.contractorId
    if (contractorId) {
      this.setData({searchModalShow: true, onlyShop: false, onlyStore: true})
    } else {
      my.showToast({content: '请先选择客户'})
    }
  },

  onCancel() {
    this.setData({searchModalShow: false, businessFlag: false })
  },

  onReceive(e) {
    const {shop, store} = e
    this.$batchedUpdates(() => {
      this.setData({
        "signInfo.contractorId":  shop.id,
        "signInfo.merchantName":  shop.merchantName,
        "signInfo.merchantType":  shop.merchantType,
        "signInfo.merchantTypeText":  formatShop(shop.merchantType),
        "signInfo.contactName":  shop.contactName,
        "signInfo.contactPhone":  shop.contactPhone,
      })
      if (store) {
        this.setData({
          "signInfo.facadeId":  store.id,
          "signInfo.facadeLng":  store.lng,
          "signInfo.facadeLat":  store.lat,
          "signInfo.facadeName":  store.name,
          "signInfo.facadeAddress":  store.address,
        })
      }
      this.setData({searchModalShow: false})
    })
  },

	// 提交签到表单
	subForm(e) {
    console.log(e.detail.value, this.data.signInfo);
    let data = e.detail.value
    ,   signInfo = this.data.signInfo
    ,   selfieFileItems = signInfo.selfieFileItems.length > 0 ? signInfo.selfieFileItems : undefined 
    ,   maskAreaFileItems = signInfo.maskAreaFileItems.length > 0 ? signInfo.maskAreaFileItems : undefined
    ,   facadeSignFileItems = signInfo.facadeSignFileItems.length > 0 ? signInfo.facadeSignFileItems : undefined
    ,   overFacadeFileItems = signInfo.overFacadeFileItems.length > 0 ? signInfo.overFacadeFileItems : undefined

    let params = {
      lng: signInfo.lng,
      lat: signInfo.lat,
      address: signInfo.address,
      checkinWay: signInfo.checkinWay,
      companyInfoId: signInfo.companyInfoId,
      contractorId: signInfo.contractorId,
      merchantName: data.merchantName,
      merchantType: data.merchantType,
      level: data.level,
      facadeId: signInfo.facadeId,
      facadeLng: signInfo.facadeLng,
      facadeLat: signInfo.facadeLat,
      facadeName: data.facadeName,
      facadeAddress: data.facadeAddress,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      inRemark: data.inRemark || signInfo.inRemark,
      visitWith: data.visitWith,
      salesTarget: data.salesTarget || signInfo.salesTarget,
      selfieFileItems, facadeSignFileItems, // 照片Array || undefined
      maskAreaFileItems, overFacadeFileItems, // 照片Array || undefined
    }
    
    if (signInfo.checkinWay === 'return_visit' || signInfo.checkinWay === 'maintain') {
      delete params["facadeId"]
      delete params["facadeLng"]
      delete params["facadeLat"]
      delete params["facadeName"]
      delete params["facadeAddress"]
    }

    my.removeStorage({ key: 'facade' });
    // console.log("submit params",params);
    Object.keys(params).forEach(key => {
      if (params[key] === '' && key !== 'merchantName') { delete params[key] }
    })
    
    // 若没通过校验则含有 false 值 valiResult 为 true 
    let  valiResult;
    if (signInfo.checkinWay === 'no_shop') {
      // 无门店 不校验
      valiResult = [photoCheck]
      .map(item => item(params) ).some( bool => bool === false)
    } else if (signInfo.checkinWay === 'return_visit' || signInfo.checkinWay === 'maintain') {
      valiResult = [addressCheck,merchantCheck]
      .map(item => item(params) ).some( bool => bool === false)
    } else if (signInfo.checkinWay === 'patrol') {
      valiResult = [addressCheck,merchantCheck,facadeCheck]
      .map(item => item(params) ).some( bool => bool === false)
    } else if (signInfo.checkinWay === 'street_worship') {
      valiResult = [addressCheck,merchantCheck,facadeCheck,photoCheck]
      .map(item => item(params) ).some( bool => bool === false)
    } else {      
      valiResult = [addressCheck,merchantCheck,facadeCheck]
      .map(item => item(params) ).some( bool => bool === false)
    }

    if (valiResult) { return; }
    
		this.checkin(params);
	},


/*-----------------------------------   FETCH DATA   ------------------------------- */
  // 发起签到
  checkin(params) {
    my.showLoading({content: '签到中，请稍后'})
    // console.log(params.checkinWay);
    if (params.checkinWay === 'patrol') {
      params.merchantName = this.data.signInfo.merchantName
    }
    let _this = this
    signIn(params).then(res => {
       my.hideLoading()
      // _this.countDown(res.data.data.checkinId, params.checkinWay)
      _this.handleCheckinSuccess(res.data.data.checkinId, params.checkinWay);
    }).catch(err => {
      my.hideLoading()
      my.showToast({content: `签到失败${err.data.msg}`, type: 'fail'})
    })
  },

  // 根据id获取签到客户信息
  fetchDataShopInfo(id) {
    merchantDetail({contractorId: id}).then(res => {
      let _data = res.data.data
      let shopTypeIndex = this.formatShopType(_data.merchant_type).index
      this.setData({
        shopTypeIndex: shopTypeIndex,
        "signInfo.contractorId": _data.id,
        "signInfo.companyInfoId": _data.company_info_id,
        "signInfo.merchantName": _data.merchant_name,
        "signInfo.merchantType": _data.merchant_type,
        "signInfo.merchantTypeText": formatShop(_data.merchant_type),
        "signInfo.level": _data.level,
        "signInfo.facadeId": _data.facadeId,
        "signInfo.facadeName": _data.name,
        "signInfo.facadeAddress": _data.address,
        "signInfo.contactName": _data.contact_name,
        "signInfo.contactPhone": _data.contact_phone,
        "signInfo.visitWith": _data.visitWith,
        "signInfo.potentialStatus": _data.potentialStatus,
      })
    }).catch(err => {
      my.showToast({ content: err.msg || '请求失败', type: 'fail' })
    })
  },

  onCloseBusiness() {
    this.setData({businessFlag: false})
  },
  
  onReceiveBusiness(e) {
    console.log(e);
    this.getBusiness(e)
    this.setData({businessFlag: false})
  },

  getBusiness(business) {
    this.setData({"signInfo.companyInfoId": business.id, "signInfo.merchantName": business.name})
  },
  

/*-------------------------------------   页面周期   ----------------------------------*/
  // 进入场景：1，首页  2，客户列表/客户详情 3，工商查询
  // 对应路由参数状态： 1，仅签到类型  2，有客户信息对象，3，有工信心对象
  // 数据管理：1，工商查询后跳转前传递的数据任然保留 2，签到过后要清空当前数据缓存


  // 问题 页面销毁时页面的 object 数据会被所有页面公用，再unload后就算手动 下次进入也不会销毁 
  // 解决思路 将页面object表单独享设置为空，或其他基本类型对象，2，设置为页面特有数据 
  constructorSignInfo () {
    return {
			checkinWay: '', // 签到类型
      address: '', // 签到地址
			lat: '',  // 纬度
      lng: '', // 经度
      locationObj: '', // 位置信息对象
			contractorId: '', // 合作商id
      companyInfoId: '', // 工商信息ID
			merchantName: '', // 客户名称
      merchantType: '', // 客户类型
      level: '', // 客户等级
			contactName: '', // 签到客户联系人名称
			contactPhone: '', // 签到客户联系人手机
			facadeId: '', // 门店id
			facadeName: '', // 系统/门店名称
			facadeAddress: '', // 门店地址
			facadeLat: '', // 门店纬度
			facadeLng: '', // 门店经度
			inRemark: '', // 备注
      salesTarget: '', // 销售目标
      visitWith: '', // 陪同人
      potentialStatus: '', //潜客合作状态
      facadeSignFileItems: [], // 拍门店照片/门头招牌（陌拜必填）
      overFacadeFileItems: [], // 拍门店整体（陌拜必填）
      maskAreaFileItems: [], // 拍面膜区/水乳区（陌拜必填
      selfieFileItems: [], // 自拍签到图片（原签到图片） 
      facadeSignFileItemsCache: [], // 拍门店照片/门头招牌（陌拜必填）
      overFacadeFileItemsCache: [], // 拍门店整体（陌拜必填）
      maskAreaFileItemsCache: [], // 拍面膜区/水乳区（陌拜必填
      selfieFileItemsCache: [], // 自拍签到图片（原签到图片） 
    }
  },

  getLocation () {
    getCurrentLocation().then( res => {
      if (res.address) {this.setData({locationObj: res},() => this.setLocationInfo() )}
    }).catch(err => {
      console.log(err);
      my.showToast({content: '位置信息获取失败...'})
    })
  },


  initLoad(signType,shopInfo) {
    let shopTypes = app.shopTypes
    ,   clientTypes = app.clientType
    ,   visitTypes = this.formatVisitType('' ,true) // return obj
    ,   _signInfo = this.constructorSignInfo()  
    
    this.$batchedUpdates(() => {
      this.setData({signInfo: _signInfo})
      this.setData({signType, shopTypes, clientTypes, visitTypes, "signInfo.checkinWay": signType})
    })

    if (shopInfo) { this.fetchDataShopInfo(shopInfo.id) }
  },

  initShow() {
    let materialData = my.getStorageSync({key: 'material'}).data
    if (materialData) { this.setLocationInfo() }
    my.getStorage({key: 'facade'}).then(res => {
      if (res.data) {
        this.setData({
          'signInfo.facadeName': res.data.name,
          'signInfo.facadeAddress': res.data.address,
          'signInfo.facadeLng': res.data.lng,
          'signInfo.facadeLat': res.data.lat,
          'signInfo.facadeId': res.data.facadeId,
        })
      }
    })
  },

	onLoad(query) {
    let shopInfo = query.shopInfo ? JSON.parse(query.shopInfo) : null
    ,   signType = query.signType
    if (!signType) { my.alert({content: '签到类型错误，请联系管理员', buttonText: '我知道了'})} 
    this.setNavigationBar(signType)
    this.initLoad(signType,shopInfo)
    my.showLoading({content: '加载中'})
  },

  onReady () {
    this.getLocation()
  },

	onShow() {
    setTimeout(() => {
      this.initShow()      
    },500)
    this.timer()
  },
  
  onUpdate() {
    this.addThrottle()
  },
  
  onUnload() {
    clearInterval(this.data.countDowner)
    clearInterval(this.data.timer)
    this.setData({countDowner: null,  timer: null})
    my.removeStorage({key: 'material' })
    my.removeStorage({key: 'business'})
  },

/*--------------------------------------   公共   ------------------------------------*/

  // 格式化签到类型 params: wannaVVal 想要检索的值 return {label: '', value: '', index: '所在第几项'}或 {value: label}
  // formatVisitType: app.globalMethods.formatVisitType.bind(app),
  // formatShopType: app.globalMethods.formatShopType.bind(app),
  formatVisitType: app.getVisitType.bind(app),
  formatShopType: app.getShopType.bind(app),
  
                    /* ##########   地理位置/地址信息相关   ##########*/
  

  // 地点微调跳转
  mapUrl() {
    let lat = this.data.signInfo.lat, lng = this.data.signInfo.lng
    if (!lat || !lng) {
      my.showToast({content: `请确保定位功能开启，若仍无法使用此功能，请返回上级页面后再试`})
    } else {
      my.navigateTo({ url: `/pages/location/amap/amap?type=cooperative&lat=${lat}&lng=${lng}` })
    }
  },

  // 根据签到类型进设置自己或们带你的位置，保证得到地理位置，签到类型后使用
  // 有微调优先用微调  陌拜设置门店地址，其他设置自己地址，
  setLocationInfo() {
    let materialData = my.getStorageSync({key: 'material'}).data
    ,   signType = this.data.signType
    ,   locationObj = this.data.locationObj
    // console.log("locationObj",locationObj, materialData);
    if (materialData && signType === 'street_worship') {
      // 又微调的陌拜 
      let materialAddress = materialData.pname + materialData.cityname + materialData.adname + materialData.address + materialData.name
      this.setData({
        address: materialAddress,
        "signInfo.address": materialAddress,
        "signInfo.lat": materialData.location.lat,
        "signInfo.lng": materialData.location.lng,
        "signInfo.facadeAddress": materialAddress,
        'signInfo.facadeLng': materialData.location.lng,
        'signInfo.facadeLat': materialData.location.lat,
      })
    } else if (!materialData && signType === 'street_worship') {
      // 无微调的陌拜
      this.setData({
        address: locationObj.address,
        "signInfo.address": locationObj.address,
        "signInfo.lat": locationObj.latitude, 
        "signInfo.lng": locationObj.longitude,
        "signInfo.facadeAddress": locationObj.address,
        'signInfo.facadeLat': locationObj.latitude,
        'signInfo.facadeLng': locationObj.longitude,
      })
    } else if (materialData && signType !== 'street_worship') {
      // 有微调的其他签到
      let materialAddress = materialData.pname + materialData.cityname + materialData.adname + materialData.address + materialData.name
      this.setData({
        address: materialAddress,
        "signInfo.address": materialAddress,
        "signInfo.lat": materialData.location.lat, 
        "signInfo.lng": materialData.location.lng
      })
    } else {
      // 无微调的其他签到
      this.setData({
        address: locationObj.address,
        "signInfo.address": locationObj.address,
        "signInfo.lat": locationObj.latitude, 
        "signInfo.lng": locationObj.longitude 
      })
    }
  },

  // 签到成功倒计时 - 废弃
  countDown(checkinId, signType) {
    let that = this
    signType = signType.toString().trim()
    that.setData({
      isSign: true,
      countDowner: setInterval(function () {
        let seconds = that.data.seconds
        that.setData({
          seconds: seconds - 1,
        },() => {
        if (that.data.seconds <= 0) {
          if (signType === 'no_shop' || signType === 'street_worship') {
            my.switchTab({url: '/pages/index/index'})
          } else if (signType === 'return_visit') {
            my.redirectTo({url: `/pages/sign-out/return_visit/return_visit?id=${checkinId}`})
          } else if (signType === 'maintain') {
            my.redirectTo({url: `/pages/sign-out/maintain/maintain?id=${checkinId}`})
          } else if (signType === 'patrol') {
            my.redirectTo({url: `/pages/sign-out/patrol/patrol?id=${checkinId}`})
          } else {
            my.redirectTo({url: `/pages/sign-out/index/index?id=${checkinId}`})
          }
          clearInterval(that.data.countDowner);
        }
        })
      }, 1000),
    });
  },

  // 签到成功
  handleCheckinSuccess(checkinId, signType) {
    if (signType === 'no_shop' || signType === 'street_worship') {
      my.switchTab({url: '/pages/user/index/index'})
    } else if (signType === 'return_visit') {
      my.redirectTo({url: `/pages/sign-out/return_visit/return_visit?id=${checkinId}`})
    } else if (signType === 'maintain') {
      my.redirectTo({url: `/pages/sign-out/maintain/maintain?id=${checkinId}`})
    } else if (signType === 'patrol') {
      my.redirectTo({url: `/pages/sign-out/patrol/patrol?id=${checkinId}`})
    } else {
      my.redirectTo({url: `/pages/sign-out/index/index?id=${checkinId}`})
    }
  },

  // 当前签到时间
  timer() {
    let date = new Date()    
    let signTime = format.formatDateTime(date)
    this.setData({signTime, timer: setInterval(() => { this.setData({signTime: format.formatDateTime(new Date()) }) },1000) })
  },

  // 根据拜访类型设置页面title
  setNavigationBar(visitType) {
    switch (visitType) {
      case 'street_worship': my.setNavigationBar({ title: '新建线索' }); break;
      case 'maintain': my.setNavigationBar({ title: '维护签到' }); break;
      case 'stick_cabinet': my.setNavigationBar({ title: '选择合作商' }); break;
      case 'activity': my.setNavigationBar({ title: '选择合作商' }); break;
      case 'no_shop': my.setNavigationBar({title: '确认签到信息'}); break;
      case 'patrol': my.setNavigationBar({title: '下店'}); break;
      default: my.setNavigationBar({ title: '回访客户' }); break;
    }
  },
});

/*----------------------------  工具函数   ----------------------*/
// 门店校验
function facadeCheck(params) {
  if (params.facadeId && !params.facadeId === '') { my.alert({content: '请填写客户信息选择门店', buttonText: '确定'}); return false }
  else if (params.facadeName && params.facadeName === '') { my.alert({content: '请填写门店名称', buttonText: '确定'}); return false }
  else if (params.facadeAddress && params.facadeAddress === '') { my.alert({content: '请填写门店地址', buttonText: '确定'}); return false }
  else { return true }
}

// 联系方式校验
function conactPhoneCheck (params) {
  if (params.contactPhone && !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(params.contactPhone)) { my.alert({ content: '请填写合法手机号！', buttonText: '确定'}); return false }
  else { return true }
}

// 公司信息教员
function merchantCheck(params) {
  if (!params.merchantName && params.checkinWay !== "street_worship") { my.alert({content: '请填写客户名称', buttonText: '确定'}); return false }
  else if (!params.merchantType) { my.alert({content: '请选择客户类型', buttonText: '确定'}); return false }
  else { return true }
}

// 客户等级
function merchantLevelCheck(params) {
  if (params.level === '' || typeof params.level === 'undefined' || typeof params.level === null ) {
    my.alert({content: '请填写客户等级', buttonText: '确定'});
    return false
  } else { return true }
}

// 拍照信息校验 任何签到类型 自拍必填
function photoCheck(params) {
  if (!params.selfieFileItems > 0) { my.alert({content: '请上传签到自拍', buttonText: '确定'}); return false }
  else if (params.facadeSignFileItems && !params.facadeSignFileItems.length > 0) { my.alert({content: '请上传门店照片', buttonText: '确定'}); return false }
  else if (params.overFacadeFileItems && !params.overFacadeFileItems.length > 0) { my.alert({content: '请上传门店整体', buttonText: '确定'}); return false }
  else if (params.maskAreaFileItems && !params.maskAreaFileItems.length > 0) { my.alert({content: '请上传产品区（面膜/水润）', buttonText: '确定'}); return false }
  else { return true }
}

// 地址校验
function addressCheck(params) {
  if (!params.address) { my.alert({content: '无法获取定位地址，请重新尝试', buttonText: '确定'}); return false; } 
  else { return true }
}