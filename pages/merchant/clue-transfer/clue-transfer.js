import {BASE_URL} from '/config/index'
import { merchantDetail,clueTransfer } from '/api/merchant/index'

const storeTypes = [
    {id: 1, value: 'ka', label: 'KA' },
    {id: 2, value: 'cs', label: 'CS' },
    {id: 3, value: 'store', label: '便利店' },
    {id: 4, value: 'otc', label: 'OTC' },
    {id: 5, value: 'csDealers', label: 'CS经销商' },
    {id: 6, value: 'kaDealers', label: 'KA经销商' },
    {id: 7, value: 'other', label: '其他' },
    {id: 8, value: 'newRetailing', label: '新零售'}
]

const leads_statusBox = {
  valid: '有效线索',
  invalid: '存疑线索'
}

Page({
  data: {
    imageAddSuccess: [], // 添加成功图片
    imageDec: [], // 备注图片
    storeTypesIndex: '',
    storeTypes: storeTypes,
    storeTYpe: '',
    leads_statusBox: leads_statusBox,
    businessFlag: false, // 工商查询
    isStatus: '',
    form: {
      id: '',
      company_info_id: '',
      merchant_type: '',
      merchant_name: '',
      estimate_facade_number: '',
      facadeId: '',
      name: '',
      address: '',
      contact_name: '',
      contact_job: '',
      contact_phone: '',
      getWechatFileItems: [],
      wechatRemarkFileItems: [],
      associate_id: '',
      dec: '',
      level: '',
      leads_status: '',
      leads_type: '',
      created_at: '',
    }, // 由于提交时，图片URL与本地上传URL不同 提交表单数据，提交时将图片缓存数组赋值给表单图片数组
  },

  // 工商插叙
  onReceiveBusiness(e) {
    console.log(e);
    this.getBusiness(e)
    this.setData({businessFlag: false})
  },

  onClose() {
    this.setData({businessFlag: false})
  },

  onPopupClose(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      storeTypesIndex: e.detail.value,
      storeType: storeTypes[e.detail.value].value
    })
  },

  // 上传添加成功照片
  onUpImageAddSuccess() {
    let _this = this;
    if (this.data.imageAddSuccess.length >= 3 ) { return mmy.showToast({ content: '最多上传3张照片', type: 'fail' }); }
      my.chooseImage({
				count: 3, sourceType: ['album'],
				success: (rec) => {
          my.compressImage({
            filePaths: rec.apFilePaths, compressLevel: 2,
						success: (res) => { 
              my.showLoading({ content: '上传中' });
              // console.log("compressImage",res,rec);
              if ( rec.apFilePaths.length ===0) my.hideLoading()
							res.apFilePaths.forEach(apFilePath => {
								my.uploadFile({
									url: `${BASE_URL}/file/upload`, fileType: 'image', fileName: 'Upload', filePath: apFilePath, header: { 'Content-Type': 'multipart/form-data' },
									success: (data) => {
                    my.hideLoading()
                    my.showToast({ type: 'success', content: '上传成功', duration: 2000})
                    let file = JSON.parse(data.data)
                    // console.log("uploadFile",file,apFilePath);
                    if (file.code === 0) {
                      _this.data.imageAddSuccess.push(file.data.fileUploadVo.objectUrl)
                      _this.data.form.getWechatFileItems.push(file.data.fileUploadVo);
                      // console.log("push",_this.data.imageAddSuccess,file.data.fileUploadVo.objectUrl);
                      _this.setData({
                        imageAddSuccess: _this.data.imageAddSuccess,
                        "form.getWechatFileItems": this.data.form.getWechatFileItems
                       },() => {
                        // console.log(_this.data.imageAddSuccess);                        
                      })                 
                    }
									},
									fail(data) {
										my.hideLoading()
										my.showToast({type: 'fail', content: '上传失败', duration: 2000,})
                  },
                  complete() {
                    my.hideLoading()
                  }
								})
              })
              // console.log("getWechatFileItems:",_this.data.form.getWechatFileItems,_this.data.imageAddSuccess);
						},
						fail: err => {
							my.hideLoading()
							my.showToast({ content: '上传失败' })
						},
					});
				},
			});
  },

  // 上传备注照片
  onUpImageDec() {
    let _this = this;
    if (this.data.imageDec.length >= 3) { return mmy.showToast({ content: '最多上传3张照片', type: 'fail' }); }
      my.chooseImage({
				count: 3, sourceType: ['album'],
				success: (rec) => {
          my.compressImage({
            filePaths: rec.apFilePaths, compressLevel: 2,
						success: (res) => { 
              my.showLoading({ content: '上传中' });
              // console.log("compressImage",res,rec);
							res.apFilePaths.forEach(apFilePath => {
								my.uploadFile({
									url: `${BASE_URL}/file/upload`, fileType: 'image', fileName: 'Upload', filePath: apFilePath, header: { 'Content-Type': 'multipart/form-data' },
									success: (data) => {
                    my.hideLoading()
                    my.showToast({ type: 'success', content: '上传成功', duration: 2000})
                    let file = JSON.parse(data.data)
                    // console.log("uploadFile",file,apFilePath);
                    if (file.code === 0) {
                      _this.data.imageDec.push(file.data.fileUploadVo.objectUrl)
                      _this.data.form.wechatRemarkFileItems.push(file.data.fileUploadVo);
                      // console.log("push",_this.data.imageDec,file.data.fileUploadVo.objectUrl);
                      _this.setData({
                        imageDec: _this.data.imageDec,
                        "form.wechatRemarkFileItems": this.data.form.wechatRemarkFileItems
                       },() => {
                        // console.log(_this.data.imageDec);                        
                      })                 
                    }
									},
									fail(data) {
										my.hideLoading()
										my.showToast({type: 'fail', content: '上传失败', duration: 2000,})
									}
								})
              })
              // console.log("wechatRemarkFileItems:",_this.data.form.mageDecCache,_this.data.imageDec);
						},
						fail: err => {
							my.hideLoading()
							my.showToast({ content: '上传失败' })
						},
					});
				},
			});
  },

  	// 预览图片
	previewImg(e) {
    const name = e.currentTarget.dataset.name;
    switch (name) {
      case 'add-success':
        my.previewImage({
          current: e.currentTarget.dataset.index,
          urls: this.data.imageAddSuccess,
        });
      break;
      case 'dec':
        my.previewImage({
          current: e.currentTarget.dataset.index,
          urls: this.data.imageDec,
        });
      break;
    }
  },

	// 删除图片e
	delImg(e) {
    const name = e.currentTarget.dataset.name;
    const _this = this;
    switch (name) {
      case 'add-success':
        const index0 = e.currentTarget.dataset.index;
        this.data.imageAddSuccess.splice(index0, 1);
        this.data.form.getWechatFileItems.splice(index0, 1);
        this.setData({ imageAddSuccess: _this.data.imageAddSuccess });
      break;
      case 'dec':
        const index1 = e.currentTarget.dataset.index;
        this.data.form.wechatRemarkFileItems.splice(index1, 1);
        this.data.imageDec.splice(index1, 1);
        this.setData({ imageDec: _this.data.imageDec });
      break;
    }
  },

  validtor(data, type) {
    if(type === '"invalid"') {
      if (!data.merchantName) {my.showToast({content: '请填写公司名称'}); return false; }
      if (!data.merchantType)  {my.showToast({content: '请填写客户类型'}); return false; }
      if (data.estimateFacadeNumber === '') {my.showToast({content: '请填写门店数量'}); return false; }
      if (!data.name) {my.showToast({content: '请填写系统/门店名称'}); return false; }
      if (!data.address) {my.showToast({content: '请填写门店地址'}); return false; }
      if (!data.contactName) {my.showToast({content: '请填写联系人姓名'}); return false; }
      if (!data.contactJob) {my.showToast({content: '请填写联系人职务'}); return false; }
      if (data.contactPhone && !phoneCheck(data.contactPhone)) { my.showToast({ content: '请输入合法手机号' }); return false;} 
      if (data.getWechatFileItems.length === 0) {my.showToast({content: '请上传微信凭证'}); return false; }
      if (data.wechatRemarkFileItems.length === 0) {my.showToast({content: '请上传微信凭证'}); return false; }
    } else {
      if (data.estimateFacadeNumber === '') {my.showToast({content: '请填写门店数量'}); return false; }
      if (!data.contactName) {my.showToast({content: '请填写联系人姓名'}); return false; }
      if (!data.contactJob) {my.showToast({content: '请填写联系人职务'}); return false; }
      if (data.contactPhone && !phoneCheck(data.contactPhone)) { my.showToast({ content: '请输入合法手机号' }); return false;} 
      if (data.getWechatFileItems.length === 0) {my.showToast({content: '请上传微信凭证'}); return false; }
      if (data.wechatRemarkFileItems.length === 0) {my.showToast({content: '请上传微信凭证'}); return false; }
    }
    return true;
  }, 
  
  
  // 转换
  onSubmit(e) {
    let _this = this;
    // console.log("form",this.data.form,e)
    const current = e.detail.value; 

    let current_merchantType = storeTypes.find((item) => item.label === current.merchant_type )
    let flog = [];
    // console.log(_this.data.imageAddSuccess,_this.data.imageDec,current);
    let obj = this.data.form
    obj.companyInfoId = obj.company_info_id
    obj.contactPhone = current.contact_phone
    obj.contactName = current.contact_name
    obj.contactJob = current.contact_job
    obj.estimateFacadeNumber = current.estimate_facade_number
    obj.merchantName = current.merchant_name
    obj.merchantType = current_merchantType ? current_merchantType.value : obj.merchant_type
    if (!this.validtor(obj,this.data.form.leads_type)) {
      return false;
    }
    let that = this
    clueTransfer(obj).then(res=> {
      my.showToast({
        content: `${res.data.msg}`, duration: 1000,
        success: () => my.redirectTo({ url: '/pages/entry-category/potential-customer/potential-customer'})
      })
    }).catch(err => {
      my.showToast({content: `${err.data.msg}：请点击公司名称获得工商id`, type:'fail'});
    })
  },

  goBusinessSearch(){
    this.setData({businessFlag: true})
  },
  

  getBusiness(business) {
    this.setData({'form.company_info_id': business.id, 'form.merchant_name': business.name})
  },
  
  onLoad(options) {
    let _this = this
    merchantDetail({contractorId: options.id}).then(res => {
      let shoppType = res.data.data.merchant_type ? res.data.data.merchant_type: '无'
      const typeIndex = storeTypes.findIndex((item) => {
        return item.value === shoppType
      })
      let form = res.data.data
      form.getWechatFileItems = []
      form.wechatRemarkFileItems = []
      _this.setData({ form: form, storeTypesIndex: typeIndex,imageAddSuccess: [], imageDec: [] })
    }).catch(err => {
      my.showToast({content: '请求失败', type: 'fail'});
    })
  },


  onShow() {
  },

  onHide() {
    // console.log('onHide');
  },

  onUnload() {
  }

})



function judge(value) {
  switch (typeof value) {
    case 'object': return (value instanceof Array) ? !isEmptyArr(value) : !isEmpty(value); break;
    case 'number': return !isNan(value); break;
    case 'string': return !isSpace(value); break;
    case 'boolean': return true; break;
    case 'null' : return false;
    case 'undefined': return false;
  }
}  

function isEmptyArr(arr) {
  return Array.isArray(arr) && arr[0] ? false : true; 
}
function isSpace(str) {
  return str.trim() ? false : true;
}
function isNan (value) {
  return Number.isNaN(value)
}
function isEmpty(obj) {
  return obj && Object.keys(obj).length && obj !== null ? false :true;
}

// 手机号验证
function phoneCheck(phone) {
	let flag = true;
	if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(phone)) {
		flag = false;
	}
	return flag;
}