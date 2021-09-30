import { questionnaireList } from '/api/sign/index'

Page({
  data: {
    checkinWay: '', // 签到类型
    facadeId: '', // 门店Id
    facadeName: '', // 门店名称
    
    // 问题集合
    facadeDisplayItem: [], //  门店陈列问题项
    questions_store_displays: [], // 门店陈列
    competitorRecordItem: [],
    questions_compare_records: [], // 竞对记录
    excellentFacadeDisplayItem: [],
    questions_excellent_displays: [], // 优秀陈列

  },
              
  
  /*------------------------------  交互逻辑   ------------------------------*/

  onDelete(e) {
    // console.log(e);
    const _index = e.currentTarget.dataset.index, _data = this.data.questions_excellent_displays
    _data.splice(_index, 1)
    this.setData({questions_excellent_displays: _data})
  },

  // 删除照片
  onDeleteStore(e) {
    // console.log(e);
    const _index = e.currentTarget.dataset.index, sindex = e.currentTarget.dataset.item;
    let _data = this.data.questions_store_displays;
    
    for (let index = 0; index < _data.length; index++) {
      if (index === sindex) {
        _data[index][0].value.splice(_index,1)
        break;
      }
    }
    
    this.setData({questions_store_displays: _data})
  },
  
  onDeleteCompare(e) {
    // console.log(e);
    const _index = e.currentTarget.dataset.index, sindex = e.currentTarget.dataset.item;
    let _data = this.data.questions_compare_records;
    
    for (let index = 0; index < _data.length; index++) {
      if (index === sindex) {
        _data[index][0].value.splice(_index,1)
        break;
      }
    }
    
    this.setData({questions_compare_records: _data})
  },
  
  onReceive(e) {
    // console.log(e);
    const image = e.image;
    let _data = this.data.questions_excellent_displays;
    _data.push(image)
    this.setData({questions_excellent_displays: _data})
  },

  // 上传照片
  onReceiveStore(e) {
    // console.log(e);
    const sindex = e.dataset.item, image = e.image;
    let _data = this.data.questions_store_displays;

    for (let index = 0; index < _data.length; index++) {
      if (index === sindex) {
        _data[index][0].value.push(image)
        break;
      }
    }

    this.setData({ questions_store_displays: _data  })
  },
   
  onReceiveCompare(e) {
    // console.log(e);
    const sindex = e.dataset.item, image = e.image;
    let _data = this.data.questions_compare_records;

    for (let index = 0; index < _data.length; index++) {
      if (index === sindex) {
        _data[index][0].value.push(image)
        break;
      }
    }

    this.setData({ questions_compare_records: _data  })
  },

  // 输入赋值
  handleInputChange(e) {
    // console.log(e);
    const id = e.currentTarget.dataset.id, value = e.detail.value
    , sindex = e.currentTarget.dataset.sindex, qindex = e.currentTarget.dataset.qindex
    , _data = this.data.questions_compare_records

    _data[sindex][qindex].value = value
    this.setData({questions_compare_records: _data})
  },

  // 单选赋值
  handleRadioChange(e) {
    // console.log(e);
    const sindex = e.currentTarget.dataset.sindex, qindex = e.currentTarget.dataset.qindex;
    let value = e.detail.value, values = value.split(';')
    , _data = this.data.questions_store_displays

    // _data 问题集合 中的 问题组的 选项组
    _data[sindex][qindex].options.forEach(oitem => {
      oitem.checked = false
      if (oitem.id == values[2]) {
        oitem.checked = true
      }
    })

    this.setData({questions_store_displays: _data})
  },

  // 添加表单项
  onAdd(e) {
    // console.log(e)
    const type = e.currentTarget.dataset.type === 'store_display' ? true : false;
    let questions = type ? this.data.questions_store_displays : this.data.questions_compare_records;
    let question = type ? this.constructorFacade() : this.constructorCompare();
    questions.push(question);
    // console.log("questions",questions);
    if (type) {
        this.setData({questions_store_displays: questions})
    } else {
        this.setData({questions_compare_records: questions})
    }
  },


  // 减少表单项
  onReduce(e) {
    // console.log(e)
    const type = e.currentTarget.dataset.type === 'store_display' ? true : false
    , sindex = e.currentTarget.dataset.sindex;

    if (type) {
      let questions = this.data.questions_store_displays
      questions.splice(sindex, 1);
      this.$spliceData({questions_store_displays: questions}, () => {
        this.setData({questions_store_displays: questions})
      })
    } else {
      let questions = this.data.questions_compare_records
      questions.splice(sindex, 1);
      this.$spliceData({questions_compare_records: questions}, () => {
        this.setData({questions_compare_records: questions});
      })
    }
  },


  // 提交
  onSubmit(e) { 
    setTimeout(() => {
      // console.log('facadeDisplay',this.data.questions_store_displays);
      // console.log('competitorRecord',this.data.questions_compare_records);
      // console.log('excellentFacadeDisplay',this.data.questions_excellent_displays);

      if (!this.noEmpty(this.data.questions_store_displays)) {
        my.showToast({content: '门店陈列不能有空'})
      } else if (!this.noEmpty(this.data.questions_compare_records)) {
        my.showToast({content: '竞对不能有空'})
      } else {
        my.setStorage({ key: 'storeDisplay', data: {
            facadeDisplay:  this.data.questions_store_displays,
            competitorRecord: this.data.questions_compare_records,
            excellentFacadeDisplay: this.data.questions_excellent_displays
          },
          success: () => { my.navigateBack()}
        })
      }

    }, 255);
  },
  
  onCancel() { my.navigateBack() },

  // 检查缓存中是否有上一次填写的内容，用则服用
  checkStorage(storeDisplay) {
    // console.log('storeDisplay',storeDisplay);
    let {facadeDisplay, excellentFacadeDisplay ,competitorRecord} = storeDisplay
    this.setData({questions_store_displays: facadeDisplay,questions_compare_records: competitorRecord,excellentFacadeDisplay})
  },

  // 获取门店陈列问卷
  fetchQuestListFacade(flag) {
    questionnaireList({checkinWay: 'facadeDisplay'}).then(res => {
      let _data = res.data.data;
      _data[0].value = []

      // 构造完整数据结构以达到控制单选/多选表单控件状态的目的
      _data.forEach(item => {
        if (item.options) {
          item.options.forEach(oitem => {
            oitem.checked = false
          })
        }
      })

      // 排除questions_store_displays中的元素项与，facadeDisplayItem 有引用关系的可能
      const item = JSON.parse(JSON.stringify(_data)) 
      if (flag) {
        this.setData({facadeDisplayItem: item})
      } else {
        this.setData({questions_store_displays: [_data], facadeDisplayItem: item})
      }
    })
  },

  // 获取竞对记录问卷
  fetchQuestListCompare(flag) {
    questionnaireList({checkinWay: 'competitorRecord'}).then(res => { 
      let _data = res.data.data;
      _data[0].value = []
      
      const item = JSON.parse(JSON.stringify(_data))
      if (flag) {
        this.setData({competitorRecordItem: item})
      } else {
        this.setData({questions_compare_records: [_data], competitorRecordItem: item})
      }
    })
  },

  initData(query,callback) {
    this.setData({
      checkinWay: query.checkinWay,
      facadeName: query.facadeName,
      facadeDisplayItem: [],
      questions_store_displays: [],
      competitorRecordItem: [],
      questions_compare_records: [],
      excellentFacadeDisplay:[],
    },callback)
  },

  onLoad(query) {
    my.showLoading()
    let _this = this
    let storeDisplay = my.getStorageSync({key: 'storeDisplay'}).data; // 是否有缓存，有则使用无则不适用 
    // 洗一下数据
    this.initData(query,() => {
      if (storeDisplay) {
        _this.checkStorage(storeDisplay)
        _this.fetchQuestListCompare(true)
        _this.fetchQuestListFacade(true)
      } else {
        _this.fetchQuestListCompare()
        _this.fetchQuestListFacade()
      }
    })
  },

  onShow() {
    my.hideLoading()
  },

  /*------------------------------  公共逻辑   ------------------------------*/
  setVal() {
    
  },

  getVal() {

  },

  getId() {

  },

  noEmpty(array) {
    let flag = true
    array.forEach(arr => {
      if(arr) {
        arr.forEach(ele => {
          if (ele) {
            if (ele.options) {
              flag = ele.options.some(oitem => oitem.checked)
            } else {
              if (ele.value) {
                if (typeof ele.value === 'string') {
                  flag = ele.value.trim().length > 0 ? true : false
                } else {
                  flag = ele.value.length > 0 ? true : false
                }
              } else {
                flag = false
              }
            }
          }
        })
      }
    })
    return flag
  },

  constructorFacade() {
    return JSON.parse(JSON.stringify(this.data.facadeDisplayItem))
  },

  constructorCompare() {
    return JSON.parse(JSON.stringify(this.data.competitorRecordItem))
  },
});


