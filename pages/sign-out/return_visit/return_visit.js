import format from '/utils/common/js/format'
import { chooseImage, getCurrentLocation } from '/utils/API'
import { questionnaireList,signDetail,signOutReturnVisit } from '/api/sign/index'
import Global from '/Global'

let app = new Global()

Page({
  data: {
    shopType: '', // 当前客户类型
    shopIndex: '', // 客户类型索引
    shopTypes: [], // 客户类型集合
    visitType: '', // 签到类型label

    signOutImages: [], // 签退照片
    signInfo: {}, // 签退详情
    
    isShow: false,
    key: 0,
    isRemark: false,
    questionnaire: [], // 问卷
    answersListText: [], // 文本输入类型答案
    answersListChosece: [], // 选项输入类型答案
    answersListChoseceGroup: [], // 分组内容
    checkboxLimitFlag: false,  // 多选数量超过时设置
    isChecked: true,
    isCheckedValue: '',
    flag: false,

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
    // console.log('e',e);
    let signOutImages = this.data.signOutImages
    signOutImages.splice(e.currentTarget.dataset.index, 1)
    this.setData({signOutImages: signOutImages})
  },

  /*######################   问卷相关   #########################*/
  // 
  
  commonTextInput(e) {
    console.log('commonTextInput', e);
    let questions = e.currentTarget.dataset.item, answers = e.detail.value
    , answersListText = this.data.answersListText
    if (answersListText.length > 0) {
      answersListText = answersListText.filter(answerItem => {
        return answerItem.questionId !== questions.id
      })
      answersListText.push({questionId: questions.id, value: answers}) 
    } else {
      answersListText.push({questionId: questions.id, value: answers})
    }
    this.setData({answersListText: answersListText})

  },

  remarkTextInput(e) {
    console.log("remarkTextInput", e);
    let option = e.currentTarget.dataset.option, answers = e.detail.value, answersListChosece = this.data.answersListChosece
    , answersListChoseceGroup = this.data.answersListChoseceGroup
    
    if (option.masterId) {
      answersListChoseceGroup.forEach(aitem => {
        if (aitem.questionId == option.questionId && aitem.optionId == option.id ) {
          aitem.remark = answers ? answers: option.remark
        }
      })
    } else {
      answersListChosece.forEach(aitem => {
        if (aitem.questionId == option.questionId && aitem.optionId == option.id ) {
          aitem.remark = answers ? answers: option.remark
        }
      })
    }
    this.setData({answersListChosece, answersListChoseceGroup})
  },

  commonRadio(e) {
    // console.log("commonRadio",e);
  },

  setCommonRadio(option, answers) {
    let answersListChosece = this.data.answersListChosece
    if (answersListChosece.length > 0) {
      answersListChosece = answersListChosece.filter(acItem => {
        return acItem.questionId != option.questionId
      })
      answersListChosece.push({optionId: option.id, questionId: option.questionId, value: option.label, remark: option.remark})
    } else {
      answersListChosece.push({optionId: option.id, questionId: option.questionId, value: option.label, remark: option.remark})
    }
    this.setData({answersListChosece: answersListChosece})
  },

  commonRadioChange(e) {
    // 是否等于其他 
    // 等于地或去问就按列表中加上已选属性择
    // console.log('commonRadioChange', e);
    let option = e.currentTarget.dataset.option, answer = e.detail.value, list = this.data.questionnaire
    if (option.label === '其他' && answer) {
      list.forEach(item => {
        if (item.id === option.questionId) item.remarkShow = !item.remarkShow;
      })
    } else {
      list.forEach(item => {
        if (item.id === option.questionId) item.remarkShow = false;
      })
    }
    this.setData({questionnaire: list}, ()=> {
      this.setCommonRadio(option,answer)
    })
  },

  commonCheckbox(e) {
    // console.log("commonCheckbox",e);
    let question = e.currentTarget.question, answers = e.detail.value
    this.setCommonCheck(question, answers)
  },

  setCommonCheck(questions, answers) {
     let answersListChosece = this.data.answersListChosece
     if (answersListChosece.length > 0 && answers.length > 0 ) {
      answersListChosece = answersListChosece.filter(aitem => {
        return aitem.questionId = questions.id
      })
      answers.forEach(anitem => {
        let answersSplit = anitem.split(';')
        answersListChosece.push({
          optionId: answersSplit[0], value: answersSplit[1],
          questionId: answersSplit[3], remark: answersSplit[4]
        })
      })
     } else if (answers.length > 0) {
      answers.forEach(anitem => {
        let answersSplit = anitem.split(';')
        answersListChosece.push({
          optionId: answersSplit[0], value: answersSplit[1],
          questionId: answersSplit[3], remark: answersSplit[4]
        })
      })
     } else {
      answersListChosece = answersListChosece.filter(aitem => {
        return aitem.questionId = questions.id
      })
     }
     this.setData({answersListChosece})
  },

  commonCheckboxChange(e) {
    // console.log('commonCheckboxChange', e);
    let option = e.currentTarget.dataset.option, answer = e.detail.value, list = this.data.questionnaire
    if (option.label === '其他' && option.label === '折扣不满意') {
      list.forEach(item => {
        if (item.id === option.questionId) item.remarkShow = !item.remarkShow;
      })
    } else {
      list.forEach(item => {
        if (item.id === option.questionId) item.remarkShow = false;
      })
    }
    this.setData({questionnaire: list})
  },

  groupRadio(e) {
    // console.log('groupRadio', e);
    let question = e.currentTarget.dataset.question, answer = e.detail.value, questionnaire = this.data.questionnaire
    let answerArr = answer.split(';') // id label masterId questionId remark ischecked
    questionnaire.forEach(qitem => {
      if (qitem.masterId == answerArr[3]) {
          // console.log("qitem",qitem.name)
          qitem.groupShow = true
          qitem.key = answerArr[0]
          qitem.remarkShow = false
          let obj =  qitem.options
          Object.keys(obj).forEach(key => {
            obj[key].forEach(eitem => {
              eitem.isdisable = false
              eitem.ischecked = ''
              eitem.remarkShow = false
              eitem.remark = ''
            })
          })
      }
    })
    this.setData({questionnaire, answersListChoseceGroup: []}, () => {
       this.initGroupCheckbox()
    })
  
  },

  setGroupRadio(option, answers) {
    let answersListChosece = this.data.answersListChosece
    if (answersListChosece.length > 0) {
      answersListChosece = answersListChosece.filter(acItem => {
        return acItem.questionId != option.questionId
      })
      answersListChosece.push({optionId: option.id, questionId: option.questionId, value: option.label,})
    } else {
      answersListChosece.push({optionId: option.id, questionId: option.questionId, value: option.label,})
    }    
    this.setData({answersListChosece: answersListChosece})
  },

  groupRadioChange(e) {
    // console.log('groupRadioChange',e);
    let option = e.currentTarget.dataset.option, answer = e.detail.value
    this.setGroupRadio(option, answer)
  },
  
  groupCheckbox(e) {
    // console.log('你选择的框架是：', e);
  },

  setGroupCheckbox(question, answers) {
    let answersListChoseceGroup = this.data.answersListChoseceGroup, flag = false
    , questionnaire =  this.data.questionnaire
    // 如果动态选项组答案集合  length  0，1，2 2+ 点击已选择和点击未选择两种情况
    if (answersListChoseceGroup.length == 2 ) {
      // 选择的是同一个 answers 应为 false
      if (answers) {
        my.showToast({content: '最多选择两项'})
      } else {
        answersListChoseceGroup = answersListChoseceGroup.filter(aitem => {
          return aitem.optionId != question.id
        })
      }
      // my.showToast({content: '最多选择两项'})
    } else if (answersListChoseceGroup.length == 1) {
      if (answers) {
          answersListChoseceGroup.push({optionId: question.id, questionId: question.questionId, value: question.label })
      } else {
        answersListChoseceGroup = answersListChoseceGroup.filter(aitem => {
          return aitem.optionId != question.id
        })
      }
    } else if (answersListChoseceGroup.length == 0) {
      answersListChoseceGroup.push({optionId: question.id, questionId: question.questionId, value: question.label })
    }
    
    while (answersListChoseceGroup.length > 2) {
      answersListChoseceGroup = answersListChoseceGroup.slice(0,2)
    }
    
    this.setData({answersListChoseceGroup: answersListChoseceGroup},() => {
      // 1, 长度为1 不禁用 2，长度为2 除这两个禁用， 3，为零则还原
      let _list = answersListChoseceGroup
      // console.log('setGroupCheckbox', _list);
        questionnaire.forEach(qitem => {
          if (qitem.name === 'intentionCause') {
            qitem.options[question.masterId].forEach(oitem => {
              if (_list.length == 1 || _list.length == 0 ) {
                oitem.isdisable = false
              }
              if (_list.length >= 2) {
                if (oitem.id == _list[0].optionId || oitem.id == _list[1].optionId ) {
                  oitem.isdisable = false
                  oitem.remarkShow = true
                  oitem.ischecked = true
                } else {
                  oitem.isdisable = true
                  oitem.remarkShow = false
                  oitem.ischecked = ''
                }
              } 
            })
          }
        })
         this.setData({questionnaire: questionnaire}, () => {
          let _list = answersListChoseceGroup
          // console.log('setGroupCheckbox', _list);
            questionnaire.forEach(qitem => {
              if (qitem.name === 'intentionCause') {
                qitem.options[question.masterId].forEach(oitem => {
                  if (_list.length == 1 || _list.length == 0 ) {
                    oitem.isdisable = false
                  }
                  if (_list.length >= 2) {
                    if (oitem.id == _list[0].optionId || oitem.id == _list[1].optionId ) {
                      oitem.isdisable = false
                      oitem.remarkShow = true
                      oitem.ischecked = true
                    } else {
                      oitem.isdisable = true
                      oitem.remarkShow = false
                      oitem.ischecked = undefined
                    }
                  } 
                })
              }
            })
         })

    })
  },

  groupCheckboxChange(e) {
    // console.log("groupCheckboxChange",e);
    let option = e.currentTarget.dataset.option, answer = e.detail.value, questionnaire = this.data.questionnaire
    if ((option.label === '其他' || option.label === '折扣不满意') && answer) {
      questionnaire.forEach(item => {
        if (item.id === option.questionId) {
          item.options[`${option.masterId}`].forEach(oitem => {
              oitem.remarkShow = true
          })
        }
      })
    } else if ((option.label === '其他' || option.label === '折扣不满意') && !answer) {
      questionnaire.forEach(item => {
        if (item.id === option.questionId) {
          item.options[`${option.masterId}`].forEach(oitem => {
              oitem.remarkShow = false
          })
        }
      })
    }
    this.setData({questionnaire: questionnaire})
    this.setGroupCheckbox(option, answer)

  },

  
  initGroupCheckbox() {
    let questionnaire = this.data.questionnaire
    questionnaire.forEach(quest => {
      if (quest.name === 'intentionCause') {
        let obj = quest.options
        quest.remarkShow = false
        Object.keys(obj).forEach(key => {
          obj[key].forEach(eitem => {
            eitem.ischecked = undefined
            eitem.isdisable = false
            eitem.remarkShow = false
            eitem.remark = ''
          })
        })
      }
    })
    this.setData({questionnaire})
  },

  searchQuestion(question) {

  },

  searchOtions(options) {

  },


  // 签退
  onSubmit(e) {
    let timer = setTimeout(() => {
      console.log("e",e);
      let form = e.detail.value
      , signInfo = this.data.signInfo
      , answersChosece = this.data.answersListChosece
      , answersText = this.data.answersListText
      , answersChoseceGroup = this.data.answersListChoseceGroup
      , params = {}
      , answerList = [].concat(answersChosece, answersText,answersChoseceGroup)
      params.checkinId = signInfo.checkinId
      params.lat = signInfo.lat
      params.lng = signInfo.lng
      params.address = signInfo.address
      params.contractorId = signInfo.contractorId
      params.fileItems = this.data.signOutImages

      my.showLoading({content: '加载中...'})

      answerList.forEach(item => {
        if (item.optionId) item.optionId = Number(item.optionId) 
      })
      
      params.surveyInfo = answerList
    
      // 未通过校验则含有tittle,result: false，通过则只有result: true 
      let valiResult = [], flag = false;
      valiResult = noEmpty(params)
      // console.log('valiResult',valiResult, 'params', params, 'form', form);
      valiResult.reverse().forEach(element => {
        if (element.result === false) { 
          flag = true;
          my.hideLoading();
          return my.showToast({content: `${element.title}`})
        }
      })
    
      if (!flag) this.sendSignOut(params);
        
    }, 255);
  },


/*---------------------------------   数据获取   ---------------------------------*/

  // 发送签退请求
  sendSignOut(params) {
      this.setData({loading: true})
      signOutReturnVisit(params)
      .then( res => {
        my.hideLoading()
        this.setData({loading: false})
        my.switchTab({url: '/pages/user/index/index'})
      })
      .catch(err => { 
        my.hideLoading()
        this.setData({loading: false})
        my.showToast({content: String(err.data.msg)})
      })
  },

  // 问卷  签到类型：return_visit-回访，maintain-维护
  fetchQuestList(checkinWay) {
    questionnaireList({checkinWay}).then( res => {
      let list = res.data.data
      let questionnaire = list.filter(item => {
        item.remarkShow = false // 备注是否
        if (item.type === 'radio' || item.type === 'checkbox') { 
          if (item.options instanceof Array) {
            item.options.forEach(oitem => {
              oitem.ischecked = undefined // 是否先择
              oitem.remark = ''  // 备注
              oitem.remarkShow = false // 备注是否
              oitem.isdisable = false // 禁用是否
            })
          } else {
            Object.keys(item.options).forEach(key => {
              item.options[key].forEach(kitem => {
                kitem.ischecked = undefined
                kitem.remark = ''
                kitem.remarkShow = false // 备注是否
                kitem.isdisable = false
              })
            })
          }
        }
        return true
      })
      this.setData({questionnaire: questionnaire}) 
    }).catch( err => {
      my.hideLoading()
      my.showToast({content: `部分信息获取失败，请重新进入，${err.data.msg}`})
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
      , signInfo = {checkinWay: data.checkinWay, checkinId: data.checkinId, contractorId: data.contractorId, merchantName: data.merchantName, merchantType: data.merchantType}
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
    this.fetchQuestList('return_visit')
    this.setData({shopTypes: app.shopTypes, answersListChoseceGroup: []})
  },

  onShow() {
    my.showLoading({content: '加载中...'})
    this.setLocationMaterial()
    setTimeout(() => {
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
    if (key === 'surveyInfo') {
      let ele = params[key]
      if (!ele.length > 0) result.push({title: `请填写完整问卷`, result: false});
      ele.forEach((answer, index) => {
        if (answer.value) {
          result.push({result: true})
        } else {
          result.push({title: `请填写完整问卷`, result: false})
        }
      })
    }
  })
  return result
}

function isEmptyObj(obj) {
  for(let k in obj) {
    return false
  }
  return true
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

// var questionnaire = [
//   {
//     id: '1',
//     title: '品牌认知',
//     type: 'radio',
//     name: 'pinpai',
//     required: true,
//     options: [
//       {id: '11', questionId: '1', label: 'java', value: ''},
//       {id: '12', questionId: '1', label: 'javaScript', value: ''},
//       {id: '13', questionId: '1', label: 'c++', value: ''}
//   ]
//   },
//   {
//     id: '2',
//     title: '客户意向',
//     type: 'checkbox',
//     name: 'kehu',
//     required: true,
//     options: [
//       {id: '21', questionId: '2', label: 'arrayList', value: ''},
//       {id: '22', questionId: '2', label: 'linkList', value: ''},
//       {id: '23', questionId: '2', label: 'binary tree', value: '' }
//     ]
//   },
//   {
//     id: '3',
//     title: '输入项',
//     type: 'input',
//     required: true,
//     name: 'shuru',
//     value: ''
//   }
// ]
