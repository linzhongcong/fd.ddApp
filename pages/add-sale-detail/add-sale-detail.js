


Page({
  data: {
    checkinWay: '',
    facadeId: '',
    facadeName: '凡岛小店',
    brands : [],    
    // 答案收集
    sku_count: '',
    facadeSaleDetail: [], // 门店销售
    facadePosRecord: [], // POS记录
  },

  /*------------------------------  公共逻辑   ------------------------------*/
  setVal() {
    
  },

  getVal() {

  },

  getId() {

  },

  setSaleDetail() {
    let _facadeSaleDetail = this.data.facadeSaleDetail
    let facadeSaleDetail = this.constructorFacadeSaleDetail()
    _facadeSaleDetail.push(facadeSaleDetail)
    this.setData({facadeSaleDetail: _facadeSaleDetail})
  },
              
  
  /*------------------------------  交互逻辑   ------------------------------*/

  onDelete(e) {
    // console.log(e);
    const _index = e.currentTarget.dataset.index, _data = this.data.facadePosRecord
    // console.log(_data);
    
    _data.forEach(item => {
      item.posRecordImg.splice(_index,1)
    })
    this.setData({facadePosRecord: _data})
  },
  
  onReceive(e) {
    // console.log(e);
    const image = e.image, cindex = e.dataset.item;
    let _data = this.data.facadePosRecord;
    for (let index = 0; index < _data.length; index++) {
      if (cindex === index) {
        _data[index].posRecordImg.push(image)
        break;
      } 
    }
    
    this.setData({facadePosRecord: _data})
  },

  handleInputChangeFacadeDetail(e) {
    // console.log("handleInputChangeFacadeDetail",e);
    const {cindex, id, type} = e.currentTarget.dataset, value = e.detail.value;
    let _data = this.data.facadeSaleDetail;
    
    for (let index = 0; index < _data.length; index++) {
      if (_data[index].id === id) {
        if (type === "sale_price") { // 门店零售价
          let reg = /^\d*(\.\d*)?$/; // 零售价可以有浮点
          reg.test(value) && (_data[index].sale_price = value)
        } else {
          let reg = /^\d*$/;
          reg.test(value) && (_data[index].inventory = value)
        }
        break;
      }
    }
    // console.log("_data",_data);
    
    
    this.setData({facadeSaleDetail: _data})
  },


  // 品牌输入赋值
  handleChangeFacadePosRecord(e) {
    // console.log(e);
    const id = e.currentTarget.dataset.id , brands = this.data.brands
    let _data = this.data.facadePosRecord, bindex = e.detail.value

    for (let index = 0; index < _data.length; index++) {
      if (_data[index].id == id) {
        _data[index].brandIndex = e.detail.value
        _data[index].brands = brands[bindex].name === '点击选择' ? '' : brands[bindex].name
        break;
      }
    }
    
    this.setData({facadePosRecord: _data})
  },

  // 单选赋值
  handleInputChangeSkuCount(e) {
    // console.log(e);
    let sku_count = e.detail.value,
      reg = /^\d*$/;
    if (!reg.test(sku_count)) {
      sku_count = this.data.sku_count;
      my.showToast({content: '请输入整数', duration: 1000});
    }
    this.setData({sku_count})
  },

  // 添加表单项
  onAdd(e) {
    // console.log(e)
    const type = e.currentTarget.dataset.type === 'store_sale' ? true : false;   
    if (type) return my.navigateTo({url: '/pages/search-product/search-product'});
    let _data = this.data.facadePosRecord, item = this.cosntructorFacadePosRecord()
    _data.push(item)
    this.setData({facadePosRecord: _data})
  },


  // 减少表单项
  onReduce(e) {
    // console.log(e)
    const type = e.currentTarget.dataset.type === 'store_sale' ? true : false, cindex = e.currentTarget.dataset.cindex;
    if (type) {
      let questions = this.data.facadeSaleDetail
      questions.splice(cindex, 1);
      this.$spliceData({facadeSaleDetail: questions}, () => {
        this.setData({facadeSaleDetail: questions})
      })
    } else {
      let questions = this.data.facadePosRecord
      questions.splice(cindex, 1);
      this.$spliceData({facadePosRecord: questions}, () => {
        this.setData({facadePosRecord: questions});
      })
    }
  },


  // 提交
  onSubmit(e) { 
    setTimeout(() => {
      let facadeSaleDetail = this.data.facadeSaleDetail, facadePosRecord = this.data.facadePosRecord
        , sku_count = this.data.sku_count
      if (sku_count == '') {
          my.showToast({content: '门店门店SKU数不能为空'})
      } else if (!this.noEmpty(facadeSaleDetail)) {
          my.showToast({content: '门店详情不能有空'})
      } else if (!this.noEmptyPOS(facadePosRecord)) {
          my.showToast({content: 'POS记录信息不能有空'})
      } else {
        facadeSaleDetail.forEach(item => {
          item.sale_price = parseFloat(item.sale_price);
          item.inventory = parseInt(item.inventory);
        });
        my.setStorage({
          key: 'storeSale',
          data: { sku_count, facadeSaleDetail: facadeSaleDetail, facadePosRecord: facadePosRecord },
          success: () => { my.navigateBack() }
        })  
      }

    }, 100);
  },

  onCancel() {
    my.navigateBack()
  },

  checkStroage() {
    let storeSale = my.getStorageSync({key: 'storeSale'}).data
    // console.log("storeSale",storeSale);
    if (storeSale) {
      let {facadeSaleDetail, facadePosRecord, sku_count} = storeSale
      this.setData({facadeSaleDetail, facadePosRecord, sku_count})
    }
  },

  onLoad(query) {
    let _facadePosRecord = this.cosntructorFacadePosRecord()
    let _brands = [
      { name: '点击选择' },
      { name: 'WIS' },      
      { name: 'KONO' },
    ]
    this.setData({
      brands: _brands,
      checkinWayId: '',
      checkinWay: query.checkinWay,
      facadeName: query.facadeName,
      sku_count: '',
      facadeSaleDetail: [], 
      facadePosRecord: [_facadePosRecord], 
    },() => {
      this.checkStroage()
    })
    
  },

  onShow() {
    let products = my.getStorageSync({key: 'products'}).data
    if (products) {
      let facadeSaleDetail = this.data.facadeSaleDetail
      facadeSaleDetail = [].concat(facadeSaleDetail,products) 
      this.setData({facadeSaleDetail}, () => {
        this.removeStorageProduct()
      })
    }
  },

  removeStorageProduct() {
    my.removeStorage({key: 'products'})
  },

  noEmpty(array) {
    let flag = true
    // console.log("array",array);
    if (array.length > 0) {
      array.forEach(ele => {
        if (ele.sale_price !== undefined && ele.inventory !== undefined) {
          if (ele.sale_price === '' || ele.inventory === '') flag = false;
        } else {
          flag = false;
        }
      })
    }
    return flag
  },

  noEmptyPOS(array) {
    let flag = true
    // console.log("array",array);
    if (array.length > 0 ) {
      array.forEach(ele => {
        if (ele.brands === '' && ele.posRecordImg.length <= 0) {
          flag = true
        } else if (ele.brands !== '' && ele.posRecordImg.length > 0) {
          flag = true
        } else {
          flag = false
        }
      })
    } else {
      if (array[0].brands === '' && array[0].posRecordImg.length <= 0) {
        flag = true
      } else if (array[0].brands !== '' && array[0].posRecordImg.length > 0) {
        flag = true
      } else {
        flag = false
      }
    }
    return flag
  },

  // 门店销售
  constructorFacadeSaleDetail() {
    let _data = this.data.facadeSaleDetail, id = 0;
    id = _data.length > 0 ? _data[_data.length - 1].id + 1 : 1
    return {
        id: id, 
        name: '', // 产品名称
        src: '', // 产品图链接
        price: '', // 零售价
        sale_price: '', // 门店销售价
        inventory: '', // 门店库存
      }
  },

  cosntructorFacadePosRecord() {
    let _data = this.data.facadePosRecord, id = 0;
    id = _data.length > 0 ? _data[_data.length - 1].id + 1 : 1
    return {
        id: id, // POS记录id
        checkinId: 1, // 签到id
        brandIndex: 0,
        brands: '', // 品牌
        posRecordImg: [], // POS记录图片（图片实体数组）
      }
  }

});


