import {BASE_URL} from '/config/index'


// 授权登录并获取token
export const getAuth = context => {
  let url = `${BASE_URL}/authorization/dingtalk`
  my.getAuthCode()
  .then(response => {
    let data = { code: response.authCode }
    my.request({url, method: 'get', data, dataType: 'json',})
    .then(res => {
      my.setStorageSync({key: 'token', data: {token: res.data.data.access_token}})
    })
    .catch(err => {
      if (err.data && err.data.code ) {
        my.showToast({ content: `登录i失败：${err.data.code}，${err.data.msg}`, duration: 2000 })
      } else {
        my.showToast({ content: `登录i失败：空响应体${err.data}`, duration: 2000 })
      }
      setTimeout(() => my.reLaunch({ url: 'login-fail/login-fail' }), 2100);
    })
  })
  .catch(reject => {
    if (reject) {
      my.showToast({content: `错误：${reject.errorMessage}`})
    } else {
      my.showToast({content: `错误：${reject}`})
    }
  })
}

// 获取地理位置 return { 经度 维度 地址 省 城市 }
export const getCurrentLocation = (needLoading = true) => {
  if (needLoading) my.showLoading({content: '定位获取中请稍等...' });
  return my.getLocation({type: 1})
  .then(res => {
    my.hideLoading();
    let object = res ? res : {longitude: '', latitude: '',province: '', city: '', address: ''}
    for(let key in object) {
      if (object[key] === undefined || object[key] === 'undefined') { object[key] = ''}
    }
    return object
  }).catch(err => { 
  if (needLoading) my.hideLoading();
  switch (err.error) {  
      case 3: my.alert({ content: '无法获取定位地址，请再次尝试', buttonText: '确定' }); break;
      case 4: my.alert({ content: '无法获取定位地址，请检查定位设置', buttonText: '确定' }); break;
      case 12: my.alert({ content: '网络异常，请检查当前网络', buttonText: '确定' }); break;
      case 13: my.alert({ content: '定位失败，请再次尝试', buttonText: '确定' }); break;
      case 14: my.alert({ content: '业务定位超时, 请再次尝试', buttonText: '确定' }); break;
      case 2001: my.alert({ content: '钉钉获取定位权限未设置, 请授权', buttonText: '确定' }); break;
      default: my.alert({ content: '地理位置获取失败，请再次尝试', buttonText: '确定' }); break;
    }
  })
}

// 拍照上传
export function chooseImage (context,callback,option = {}) {
  let count = option.count || 3, sourceType = option.sourceType || ['camera']
  , compressLevel = option.compressLevel || 2
  , url = option.url || `${BASE_URL}/file/upload`
  , fileType = option.fileType || 'image'
  , fileName = option.fileName || 'Upload'
  , header = option.header || { 'Content-Type': 'multipart/form-data'}

  my.chooseImage({ count, sourceType })
  .then(choose => {
    my.compressImage({filePaths: choose.apFilePaths, compressLevel}).then(compress => {
      my.showLoading({content: '上传中'})
      if(compress.apFilePaths.length <= 0) { my.hideLoading()} 
      compress.apFilePaths.forEach(filePath => {
        my.uploadFile({url,fileType,fileName,filePath,header}).then(uploadFile => {
        if (callback) callback.call(context,JSON.parse(uploadFile.data),filePath)
        }).catch(err => my.hideLoading())
      })
    })
  })
  .catch(err => {
   console.log(`上传失败${err}`) 
  })
}

// 获取设备信息
export const storageSystemInfo = () => {
  my.getSystemInfo().then(res => {
    const systemName = res.platform.toString().toLowerCase()
    if (systemName.indexOf('ios') !== -1) {
      my.setStorageSync({key: 'system', data: { name: 'ios'}})
    } else if (systemName.indexOf('Android') !== -1) {
      my.setStorageSync({key: 'system', data: { name: 'Android'}})
    } else {
      my.setStorageSync({key: 'system', data: { name: systemName}})
    }
  })
}



export default {
  getAuth, // 授权登录
  getCurrentLocation, // 获取地理位置
  chooseImage, // 上传并压缩图片
  storageSystemInfo, // 获取设备信息
}
