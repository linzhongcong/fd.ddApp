import { BASE_URL } from '/config/index';
import Global from '/Global' 
Page({
  data: {
    place: {
      productFileItems: [],// 产品陈列拍照
      materialFileItems: [],// 物料图拍照
      remark: '', // 产品陈列描述
      level: '', // 陈列级别
      situation: '',// 陈列级别
      materialRemark: ''// 物料图描述
    },
    displayTypeArr: [],
    displayTypeIndex: 0,
    checkId: '',// 签退ID
    signType: '',
    productImgArr: [],
    materialImgArr: []
  },
  onLoad(option) {
    this.setData({
      displayTypeArr: new Global().displayLevels,
      checkId: option.id,
      signType: option.signType
    })
    this.data.place.productFileItems.length = 0
    this.data.productImgArr.length = 0
    this.data.place.materialFileItems.length = 0
    this.data.materialImgArr.length = 0
    this.setData({
      'place.productFileItems': this.data.place.productFileItems,
      'productImgArr': this.data.productImgArr,
      'place.materialFileItems': this.data.place.materialFileItems,
      'materialImgArr': this.data.materialImgArr
    })
  }, 
  onShow(){
    let than = this;
    // 获取缓存数据
    my.getStorage({
      key: 'exhibit',
      success: function(res) {
        let exhibit = res.data;
        let materialFiles = [];
        let productFiles = [];
        if(res.data !== null){
          // 获取缓存中的物料图
          res.data.materialFileItems.forEach(item => {
            materialFiles.push(item.url)
          })
          // 获取缓存中的产品陈列图
          res.data.productFileItems.forEach(item => {
            productFiles.push(item.url)
          })
          // 根据缓存中的陈列级别设置选中状态
          than.data.displayTypeArr.map((item, index) => {
            if(item.name === res.data.level){
              than.setData({
                displayTypeIndex: index
              })
            }
          })
          than.setData({
            place: res.data,
            materialImgArr: materialFiles,
            productImgArr: productFiles,
          })
        }
      },
      fail: function(err){
        console.log(err)
      }
    });
  },
   // 保存
  submit() {
    my.setStorage({
      key: 'exhibit',
      data: this.data.place,
      success: function() {
        my.showToast({
          type: 'success',
          content: '保存成功',
          duration: 3000,
          success: () => {
            my.navigateBack({ delta: 1 });
          },
        });
      }
    });
  },
  // 产品陈列上传
  importImgDisplay() {
    let _this = this
    my.chooseImage({
      count: 3,
      success: (res) => {
        my.showLoading({
            content: '上传中'
        })
        my.compressImage({
          filePaths: res.apFilePaths,
          compressLevel: 2,
          success: (res) => {
            res.apFilePaths.map((item) => {
              my.uploadFile({
                url: `${BASE_URL}/file/upload`,
                fileType: 'image',
                fileName: 'Upload',
                filePath: item,
                header: {
                  'Content-Type': 'multipart/form-data'
                },
                success: (data) => {
                  my.hideLoading();
                  my.showToast({
                    type: 'success',
                    content: '上传成功',
                    duration: 2000
                  })
                  let file = JSON.parse(data.data)
                  if(file.code == 0){
                    _this.data.place.productFileItems.push(file.data.fileUploadVo)
                    _this.data.productImgArr.push(item)
                    _this.setData({
                      'place.productFileItems': _this.data.place.productFileItems,
                      'productImgArr': _this.data.productImgArr
                    })
                  }
                },
                fail(data) {
                  my.hideLoading();
                  my.showToast({
                    type: 'fail',
                    content: '上传失败',
                    duration: 2000
                  })
                }
              });
            })
          }
        })
      }
    })
  },
  // 删除产品陈列
  delImgDisplay(e) {
    this.data.place.productFileItems.splice(e.currentTarget.dataset.index,1)
    this.data.productImgArr.splice(e.currentTarget.dataset.index,1)
    this.setData({
      'place.productFileItems': this.data.place.productFileItems,
      'productImgArr': this.data.productImgArr
    })
  },
  // 预览产品陈列
  previewImgDisplay(e) {
    my.previewImage({
      current: e.currentTarget.dataset.index,
      urls: this.data.productImgArr
    })
  },
  // 物料图上传
  importImgMaterials() {
    let _this = this
    my.chooseImage({
      count: 3,
      success: (res) => {
        my.showLoading({
            content: '上传中'
        })
        my.compressImage({
          filePaths: res.apFilePaths,
          compressLevel: 2,
          success: (res) => {
            res.apFilePaths.map((item) => {
              my.uploadFile({
                url: `${BASE_URL}/file/upload`,
                fileType: 'image',
                fileName: 'Upload',
                filePath: item,
                header: { 'Content-Type': 'multipart/form-data' },
                success: (data) => {
                  my.hideLoading();
                  my.showToast({
                    type: 'success',
                    content: '上传成功',
                    duration: 2000
                  })
                  let file = JSON.parse(data.data)
                  if(file.code == 0){
                    _this.data.place.materialFileItems.push(file.data.fileUploadVo)
                    _this.data.materialImgArr.push(item)
                    _this.setData({
                      'place.materialFileItems': _this.data.place.materialFileItems,
                      'materialImgArr': _this.data.materialImgArr
                    })
                  }
                },
                fail(data) {
                  my.hideLoading();
                  my.showToast({
                    type: 'fail',
                    content: '上传失败',
                    duration: 2000
                  })
                }
              });
            })     
          }
        })
      }
    })
  },
  // 删除物料图
  delImgMaterials(e) {
    this.data.place.materialFileItems.splice(e.currentTarget.dataset.index,1)
    this.data.materialImgArr.splice(e.currentTarget.dataset.index,1)
    this.setData({
      'place.materialFileItems': this.data.place.materialFileItems,
      'materialImgArr': this.data.materialImgArr
    })
  },
  // 预览物料图
  previewImgMaterials(e) {
    my.previewImage({
      current: e.currentTarget.dataset.index,
      urls: this.data.materialImgArr
    })
  },
  // 陈列级别
  displayPickerChange(e) {
    this.setData({
      displayTypeIndex: e.detail.value,
      'place.level': this.data.displayTypeArr[e.detail.value].name
    })
  },
  // 产品陈列描述
  displayInput(e){
    this.setData({
      'place.remark': e.detail.value
    })
  },
  // 产品级别描述
  levelInput(e){
    this.setData({
      'place.situation': e.detail.value
    })
  },
  // 物料图描述
  materialsInput(e){
    this.setData({
      'place.materialRemark': e.detail.value
    })
  },
})