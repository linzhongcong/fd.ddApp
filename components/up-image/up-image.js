import { BASE_URL } from "/config/index"

Component({
  mixins: [],
  data: { },
  props: {
    list: [], // 图片数组
    mode: 'aspectFit',
    count: 0, // 可选择图片数量
    sizeType: ['compressed'], // 图片类型
    sourceType: ['camera','album'], // 可选择图片类型
    compressLevel: 4, // 也锁等级 
    action: `${BASE_URL}/file/upload`, // 接受上传的服务器URL
    fileName: 'Upload', // 图片上传文件名
    fileType: 'image', // 文件上传类型
    header: { 'Content-Type': 'multipart/form-data' },
    formData: {}, // 上传请求腹地啊数据
    dataset: '', // 元素上data-set
  },

  didMount() {
    if (typeof this.props.onReceive !== 'function') throw new Error('component a onReceive methods')
    if (typeof this.props.onDelete !== 'function') throw new Error('component a onDelete methods')
  },

  didUpdate() {},

  didUnmount() {},

  methods: {
    // 上传照片
    onAdd(e) {
      const dataset = e.target.targetDataset
      const {count, sizeType, sourceType, compressLevel, action, fileName, fileType, hideLoading, header, formData } = this.props
      my.chooseImage({
        count: count, sizeType: sizeType, sourceType: sourceType,
        success: (choose) => {
          my.compressImage({
            filePaths: choose.apFilePaths, compressLevel: compressLevel,
            success: (compress) => {
              if(compress.apFilePaths.length === 0) {
                return my.hideLoading();
              } else {
                // my.showLoading({content: '上传中...'})
                this.upFile(action, compress.apFilePaths[0], fileName, fileType, header, formData, dataset)
              }
            },
            fail: (err) => {
              my.hideLoading().then(res => my.showToast({type: 'fail', content: '上传失败:'+ err.errorMessage}) )
            }
          });
        }
      });
    },

    // 删除照片
    onDelete(e) {
      this.props.onDelete(e)
    },
    
    // 图片预览
    onPreview(e) {
      let urls = this.props.list.map(item => item.objectUrl)
      my.previewImage({ current: e.currentTarget.dataset.index, urls});
    },

    // 图片上传完并加载完毕
    onLoadOver() {
      my.hideLoading()
    },

    // 图片加载发生异常
    onError(e) {
      my.hideLoading({success: () => my.showToast({type: 'fail', content: '图片加载失败:'}) })
    },
    
    /**
     * 文件上传请求
     * @param {*} action 请求url
     * @param {*} filePath 文件路径由阿里api得到
     * @param {*} fileName 文件名
     * @param {*} fileType 文件类型
     * @param {*} header 请求头
     * @param {*} formData 上传携带数据
     * @param {*} dataset 组件元素上data-set
     */
    upFile(action, filePath, fileName, fileType, header, formData, dataset) {
      my.uploadFile({
        url: action,
        filePath: filePath,
        fileName: fileName,
        fileType: fileType,
        header: header,
        formData: formData,
        success: ({data}) => { 
          const _data = JSON.parse(data)
          this.props.onReceive({dataset: dataset, image: _data.data.fileUploadVo})
        },
        fail: (err) => {
          my.hideLoading().then(res => my.showToast({type: 'fail', content: '上传失败:'+ err.errorMessage}) )
        }
      })
    }
  },
});
