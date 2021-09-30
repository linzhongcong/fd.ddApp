import Validate from '/plugins/Validate/Validate'
import { addContacts } from '/api/sign/index'

Page({
  data: {
    contractorId: '', // 工商ID
    merchantName: '', // 客户名称
    contactName: '',  // 联系人名称 
    contactJob: '', // 联系人职务
    contactPhone: '', // 联系方式
  },

  onSubmit(e) {
    let params = e.detail.value
    params.contractorId = this.data.contractorId
    
    if (!this.validate.checkForm(params)) {
        const error = this.validate.errorList[0]
        my.showToast({content: `${error.msg}`})
        return false;
    }

    addContacts(params).then(res => {
      my.showToast({content: '操作成功'})
      my.navigateBack()
    }).catch(err => {
      my.showToast({content: `操作失败${err.data.msg}`})
    })
  },

  onLoad(query) {    
    this.initValidate()
    this.setData({contractorId: query.id, merchantName: query.name})
  },

  initValidate() {
    const rules = {
      contactName: { required: true }, 
      contactPhone: { required: true }
    }
    const messages = {
      contactName: { required: '请填写姓名' }, 
      contactPhone: { required: '请填写联系方式' }
    }
    this.validate = new Validate(rules,messages)
  }
})

