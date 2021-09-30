import format from '/utils/common/js/format';
import { BASE_URL } from '/config/index';
import { chooseImage,getCurrentLocation } from "/utils/API";
import { signOut,signDetail,checkDistance,checkColleagues } from '/api/sign/index'
import Global from '/Global'

let app = new Global()

Page({
	data: {
    /* 公共 */
		isSignType: '', 
		checkinId: '', 
		shopTypeData: [],
		shopTypeIndex: 0,
		clientType: [],
		clientIndex: 0,
		clientIsShow: false,
		displayType: [],
		displayIndex: 0,
		textColor: '',
		// 签退表单
		signInfo: {
			checkinId: '',
			outRemark: '',
			lat: '',
			lng: '',
			contractorId: '',
			merchantName: '',
			merchantType: '',
			level: 'A',
			facadeId: '',
			facadeName: '',
			facadeAddress: '',
			facadeLat: '',
			facadeLng: '',
			fileItems: [],
			displayData: {
				situation: '',
				level: '',
				productFileItems: [],
				materialFileItems: [],
			},
			stockSaleList: [],
			saleDetail: {},
			checkinSaleDetailData: {
				// 销售详情数据
				peopleNumber: 0, // 同行人数
				colleagues: [], // 同行人员
				brand: '', // 品牌
				activityType: '', //活动类型
				days: '',
				totalPerformanceDecimal: '',
				selfPerformance: '',
				totalOrders: '',
				averagePrice: '',
				personalMaxPrice: '',
				teamMaxPrice: '',
				stickCabinetFileItems: [], // 贴柜现场陈列图片
				activityFileItems: [], // 活动现场陈列图片
				salesAchievedFileItems: [], /// 当天销售总业绩图片
			},
		},
		sign: {
			// 签到信息
			time: '',
			signAddress: '',
			visitType: '',
			signImgArr: [], //签到图片
		},
		shrink: {
			selImg: '/static/image/down.svg',
			type: true,
			normShow: false,
			clientShow: false,
		},
		visitTime: '',
		checkId: '', //签退ID
		timer: '', //计时器
		timers: '', //当前计时器
		signOut: {
			outRemark: '',
			fileItems: [],
			productFileItems: [], // 陈列
			materialFileItems: [], // 物料
			// stickCabinetFileItems: [], // 贴柜现场陈列图片
			// activityFileItems: [], // 活动现场陈列图片
			// salesAchievedFileItems: [], // 当天销售总业绩图片
		},
		confim: {
			type: '',
			isShow: true,
		},
		signOutArr: [],
		isSign: false, //签到成功跳转
		countdown: '', //倒计时
		seconds: 2, //秒数
		signDate: '', //当前时间
    
		activityType: [], // 活动类型 selector
		activityIndex: 0,
		activityTitle: '活动类型',
		isActivityToast: false,

		brandType: [], // 品牌 selector
		brandIndex: 0,

    passVerify: false,
    
    // i其拿到
    _signInfo: {
    },
    signoutTime: ''
    
  

  },
  
/*---------------------------------------   页面周期   ---------------------------------------*/

  /*############   表单交互   ############*/
  // 提交表单
  onSubmit(e) {
    console.log("onSubmit",e);
    
  },

	onLoad(option) {

		const that = this;
		const { shopTypes, clientTypes, displayLevels, activityTypes, brandTypes } = app;
		my.showLoading({ content: '加载中...' });
		my.setStorageSync({ key: 'colleagues', data: [] });

		this.setData({
			shopTypeData: shopTypes, // 获取客户类型
			clientType: clientTypes,
			displayType: displayLevels,
			activityType: activityTypes,
			brandType: brandTypes,
			checkinId: option.id,
		});
		// 获取签到详情
		signDetail({checkinId: option.id})
			.then(datas => {
				if (datas.data.code === 0) {
          let _signAt = format.timeFormat(datas.data.data.signinAt, 'yyyy-MM-dd hh:mm:ss')
          // console.log("time",datas.data.data.signinAt,new Date(datas.data.data.signinAt), _signAt);
					that.setData({
						isSignType: datas.data.data.checkinWay,
						signInfo: datas.data.data,
						'sign.time': format.timeFormat(datas.data.data.signinAt, 'yyyy-MM-dd hh:mm:ss'),
						'sign.visitType': format.formatSign(datas.data.data.checkinWay),
						'sign.signImgArr': datas.data.data.checkinFileItems,
						'sign.merchantTypeCN': format.formatShop(datas.data.data.merchantType),
						'signInfo.outRemark': datas.data.data.inRemark,
						'signInfo.level': datas.data.data.level || 'A',
						'signInfo.merchantName': datas.data.data.merchantName,
						'signInfo.facadeId': datas.data.data.facadeId,
						'signInfo.facadeName': datas.data.data.facadeName,
						'signInfo.facadeAddress': datas.data.data.facadeAddress,
						'signInfo.facadeLat': datas.data.data.facadeLat,
						'signInfo.facadeLng': datas.data.data.facadeLng,
						'signInfo.checkinSaleDetailData': {},
						'signInfo.checkinSaleDetailData.stickCabinetFileItems': [],
						'signInfo.checkinSaleDetailData.activityFileItems': [],
						'signInfo.checkinSaleDetailData.salesAchievedFileItems': [],
						'signInfo.fileItems': [],
						'signInfo.displayData.productFileItems': [],
						'signInfo.displayData.materialFileItems': [],
						'signInfo.displayData.level': '',
            'signInfo.stockSaleList': [],
            timers: setInterval(function () {
              let d = new Date();
              that.setData({
                signDate: format.dateFormat(d),
                visitTime: format.checkinLength(_signAt),
              });
            }, 1000),
					});
					// 根据拜访类型确定标题
					switch (option.type) {
						case 'street_worship':
							my.setNavigationBar({ title: '陌拜签退' });
							break;
						case 'return_visit':
							my.setNavigationBar({ title: '回访签退' });
              break;
						case 'maintain':
							my.setNavigationBar({ title: '回访签退' });
							break;
						case 'stick_cabinet':
							my.setNavigationBar({ title: '贴柜签退' });
							break;
						case 'activity':
							my.setNavigationBar({ title: '活动签退' });
							break;
						default:
							my.setNavigationBar({ title: '无门店签退' });
					}

					that.data.shopTypeData.map((item, index) => {
						if (item.value === that.data.signInfo.merchantType) {
							that.setData({
								shopTypeIndex: index,
							});
						}
					});

					that.data.clientType.map((item, index) => {
						if (item.name === that.data.signInfo.level) {
							that.setData({
								clientIndex: index,
							});
						}
					});
					my.hideLoading();
          getCurrentLocation().then(res => {
            if (res) {
							that.setData({
								'signInfo.lat': res.latitude,
								'signInfo.lng': res.longitude,
              });
            }
          })
				}
			});

		that.setData({
			//当前时间
			isSignType: option.signType,
			checkId: option.checkId,
			'signOut.fileItems': that.data.signOut.fileItems,
			signOutArr: that.data.signOutArr
		});

		// 初始化数据
		that.data.signOut.fileItems.length = 0;
    that.data.signOutArr.length = 0;
    
	},

	onShow() {
    let { data } = my.getStorageSync({ key: 'colleagues' })
    this.setData({
      'signInfo.checkinSaleDetailData.colleagues': data
    });
  },
  
	onUnload() {
		// 清除计时器
    clearInterval(this.data.timer);
    clearInterval(this.data.timers)
	},

	// 导入图片
	importImg(e) {
		let type = e.target.dataset.type;
		let that = this;
		if (
			(type === 'display' && this.data.signInfo.checkinSaleDetailData.stickCabinetFileItems.length >= 3) ||
			(type === 'activity' && this.data.signInfo.checkinSaleDetailData.activityFileItems.length >= 3) ||
			(type === 'sale' && this.data.signInfo.checkinSaleDetailData.salesAchievedFileItems.length >= 3) ||
			(type === 'product' && this.data.signInfo.displayData.productFileItems.length >= 3) ||
			(type === 'materials' && this.data.signInfo.displayData.materialFileItems.length >= 3) ||
			(type === 'out' && this.data.signInfo.fileItems.length >= 3)
		) {
			return my.showToast({ content: '最多上传3张照片', type: 'fail' });
		} else {
			my.chooseImage({
				count: 3,
				sourceType: ['camera'],
				// sourceType: ['camera','album'],
				success: res => {
					my.showLoading({ content: '上传中' });
					my.compressImage({
						filePaths: res.apFilePaths,
						compressLevel: 2,
						success: res => {
							res.apFilePaths.map(item => {
								my.uploadFile({
									url: `${BASE_URL}/file/upload`,
									fileType: 'image',
									fileName: 'Upload',
									filePath: item,
									header: { 'Content-Type': 'multipart/form-data' },
									success: data => {
										setTimeout(() => {
											my.hideLoading();
											my.showToast({
												type: 'success',
												content: '上传成功',
												duration: 2000,
											});
										}, 500);
										let file = JSON.parse(data.data);
										let list = [];
										let imgArr = [];
										if (file.code == 0) {
											switch (type) {
												case 'out':
													list.push(file.data.fileUploadVo);
													imgArr.push(item);
													const fileImgArr = that.data.signInfo.fileItems;
													that.setData({
														'signInfo.fileItems': [...fileImgArr, ...list],
														'signOut.fileItems': imgArr,
													});
													break;
												case 'product':
													list.push(file.data.fileUploadVo);
													imgArr.push(item);
													const proImgArr = that.data.signInfo.displayData.productFileItems;
													that.setData({
														'signInfo.displayData.productFileItems': [...proImgArr, ...list],
														'signOut.productFileItems': imgArr,
													});
													break;
												case 'display':
													list.push(file.data.fileUploadVo);
													imgArr.push(item);
													const disImgArr = that.data.signInfo.checkinSaleDetailData.stickCabinetFileItems;
													that.setData({
														'signInfo.checkinSaleDetailData.stickCabinetFileItems': [...disImgArr, ...list],
														'signOut.stickCabinetFileItems': imgArr,
													});
													break;
												case 'activity':
													list.push(file.data.fileUploadVo);
													imgArr.push(item);
													const activityImgArr = that.data.signInfo.checkinSaleDetailData.activityFileItems;
													that.setData({
														'signInfo.checkinSaleDetailData.activityFileItems': [...activityImgArr, ...list],
														'signOut.activityFileItems': imgArr,
													});
													break;
												case 'sale':
													list.push(file.data.fileUploadVo);
													imgArr.push(item);
													const saleImgArr = that.data.signInfo.checkinSaleDetailData.salesAchievedFileItems;
													that.setData({
														'signInfo.checkinSaleDetailData.salesAchievedFileItems': [...saleImgArr, ...list],
														'signOut.salesAchievedFileItems': imgArr,
													});
													break;
												default:
													list.push(file.data.fileUploadVo);
													const materImgArr = that.data.signInfo.displayData.materialFileItems;
													imgArr.push(item);
													that.setData({
														'signInfo.displayData.materialFileItems': [...materImgArr, ...list],
														'signOut.materialFileItems': imgArr,
													});
											}
										}
									},
									fail() {
										my.hideLoading();
										my.showToast({
											type: 'fail',
											content: '上传失败',
											duration: 2000,
										});
									},
								});
							});
						},
						fail: err => {
							my.hideLoading();
							my.showToast({ type: 'fail', content: '上传失败 ' });
						},
					});
        },
        fail(err) {
          my.hideLoading()
        }
			});
		}
	},

	// 删除图片
	delImg(e) {
		const { index } = e.currentTarget.dataset;
		let { checkinSaleDetailData } = this.data.signInfo;
		let { stickCabinetFileItems, activityFileItems, salesAchievedFileItems } = checkinSaleDetailData;

		switch (e.currentTarget.dataset.type) {
			case 'out':
				this.data.signInfo.fileItems.splice(index, 1);
				this.data.signOut.fileItems.splice(index, 1);
				this.setData({
					'signInfo.fileItems': this.data.signInfo.fileItems,
					'signOut.fileItems': this.data.signOut.fileItems,
				});
				break;
			case 'product':
				this.data.signInfo.displayData.productFileItems.splice(index, 1);
				this.data.signOut.productFileItems.splice(index, 1);
				this.setData({
					'signInfo.displayData.productFileItems': this.data.signInfo.displayData.productFileItems,
					'signOut.productFileItems': this.data.signOut.productFileItems,
				});
				break;
			case 'display':
				stickCabinetFileItems.splice(index, 1);
				this.data.signOut.stickCabinetFileItems.splice(index, 1);
				this.setData({
					'signInfo.checkinSaleDetailData.stickCabinetFileItems': stickCabinetFileItems,
					'signOut.stickCabinetFileItems': this.data.signOut.stickCabinetFileItems,
				});
				break;
			case 'activity':
				activityFileItems.splice(index, 1);
				this.data.signOut.activityFileItems.splice(index, 1);
				this.setData({
					'signInfo.checkinSaleDetailData.activityFileItems': activityFileItems,
					'signOut.stickCabinetFileItems': this.data.signOut.activityFileItems,
				});
				break;
			case 'sale':
				salesAchievedFileItems.splice(index, 1);
				this.data.signOut.salesAchievedFileItems.splice(index, 1);
				this.setData({
					'signInfo.checkinSaleDetailData.salesAchievedFileItems': salesAchievedFileItems,
					'signOut.stickCabinetFileItems': this.data.signOut.salesAchievedFileItems,
				});
				break;
			default:
				this.data.signInfo.displayData.materialFileItems.splice(index, 1);
				this.data.signOut.materialFileItems.splice(index, 1);
				this.setData({
					'signInfo.displayData.materialFileItems': this.data.signInfo.displayData.materialFileItems,
					'signOut.materialFileItems': this.data.signOut.materialFileItems,
				});
		}
	},

	// 预览图片
	previewImg(e) {
		let arr = [];
		switch (e.currentTarget.dataset.type) {
			case 'out':
				arr = this.data.signOut.fileItems;
				break;
			case 'product':
				arr = this.data.signOut.productFileItems;
				break;
			case 'display':
				arr = this.data.signInfo.checkinSaleDetailData.stickCabinetFileItems;
				break;
			case 'activity':
				arr = this.data.signInfo.checkinSaleDetailData.activityFileItems;
				break;
			case 'sale':
				arr = this.data.signInfo.checkinSaleDetailData.salesAchievedFileItems;
				break;
			default:
				arr = this.data.signOut.materialFileItems;
		}
		my.previewImage({
			current: e.currentTarget.dataset.index,
			urls: arr,
		});
	},

	// 展开收缩
	cardShow() {
		if (this.data.shrink.type === false) {
			this.setData({
				'shrink.type': true,
				'shrink.selImg': '/static/image/up.svg',
			});
		} else {
			this.setData({
				'shrink.type': false,
				'shrink.selImg': '/static/image/down.svg',
			});
		}
	},

	jumpIndex() {
		my.navigateTo({ url: '/pages/index/index' });
	},

	// 验证数字以及整数
	veryIntegerNum(e) {
		const that = this;
		const regNumStr = /^[0-9]+.?[0-9]*$/; // 数字
		const regIntegerStr = /^\+?[1-9][0-9]*$/; // 正整数
		const { label } = e.currentTarget.dataset;
		const { value } = e.detail;
		const key = `signInfo.checkinSaleDetailData.${label}`;

		console.log(value, label, 'value');
		if (label === 'days' && value == 0) {
			my.showToast({ content: '活动天数不能为0' });
			that.setData({ passVerify: false });
		}

		that.setData({ passVerify: true });
		if (value === '') {
			my.showToast({ content: '请输入完整信息' });
			that.setData({ [key]: value });
			that.setData({ passVerify: false });
		} else if (!regNumStr.test(value)) {
			my.showToast({ content: '请输入数字' });
			that.setData({ passVerify: false });
		} else {
			that.setData({ [key]: value });
			!regIntegerStr.test(value) &&
				value != 0 &&
				my.showToast({ content: '请输入整数' }) &&
				that.setData({ passVerify: false });
		}
	},

	// 验证浮点数
	veryFloatNum(e) {
		const that = this;
		const regIntegerStr = /^\d+(\.\d+)?$/; // 非浮点数
		const { label } = e.currentTarget.dataset;
		const { value } = e.detail;
		const key = `signInfo.checkinSaleDetailData.${label}`;

		console.log(value, 'value');
		that.setData({ [key]: Number(value), passVerify: true });
		if (value === '') {
			my.showToast({ content: '请输入完整信息' });
			that.setData({ [key]: value, passVerify: false });
		} else {
			!regIntegerStr.test(value) && my.showToast({ content: '请输入数字' }) && that.setData({ passVerify: false });
		}
	},

	// 跳转同行人员
	jumpToColleague(e) {
		const that = this;
		setTimeout(() => {
			const { type } = e.currentTarget.dataset;
			const { peopleNumber, colleagues = [] } = that.data.signInfo.checkinSaleDetailData;
			if (peopleNumber == 0) return my.showToast({ type: 'fail', content: `${type}人数不能为0` });
			if (peopleNumber == 1) return my.showToast({ content: `${type}人数为1,无需填写此项` });
			peopleNumber
				? my.navigateTo({ url: `/pages/colleagues/colleagues?peopleNumber=${peopleNumber}&colleagues=${colleagues}` })
				: my.showToast({ type: 'fail', content: `请先正确填写${type}人数`, duration: 3000 });
		}, 300);
	},

	// 跳转客户陈列
	jumpFill() {
		my.navigateTo({ url: '/pages/fill-in-shop/fill-in-shop?id=' + this.data.checkinId });
	},

	// 跳转库存销售
	jumpStock() {
		my.navigateTo({ url: '/pages/fill-in-record/fill-in-record?id=' + this.data.checkinId });
	},

	// 选择客户类型
	typePickerChange(e) {
		this.setData({
			shopTypeIndex: e.detail.value,
		});
		// 被选中的客户类型index不为0时
		if (this.data.shopTypeIndex != 0) {
			this.setData({
				textColor: '#000',
				'signInfo.merchantType': this.data.shopTypeData[e.detail.value].value,
			});
		}
		if (this.data.shopTypeIndex == 0) {
			this.setData({
				textColor: '#ccc',
			});
		}
	},

	// 选择客户类型
	clientTypeChoose(e) {
		this.setData({
			clientIndex: e.detail.value,
		});
		// 被选中的客户类型index不为0时
		if (this.data.clientIndex !== 0) {
			this.setData({
				// textColor: '#000',
				'signInfo.level': this.data.clientType[e.detail.value].name,
			});
		}
	},
	// 选择品牌类型
	clientBrandChoose(e) {
    this.setData({ brandIndex: e.detail.value });
    let brand = this.data.brandType[e.detail.value].label
		// 被选中的客户类型index不为0时
		if (this.data.brandIndex !== 0) {
			this.setData({
				'signInfo.checkinSaleDetailData.brand': brand,
			});
		} else {
			this.setData({ textColor: '#ccc' });
		}
	},

	//活动类型 选中值
	activityTypeChoose(e) {
    this.setData({ activityIndex: e.detail.value });
    let activityType = this.data.activityType[e.detail.value].label
		// 被选中的客户类型index不为0时
		if (this.data.activityIndex !== 0) {
			this.setData({
				'signInfo.checkinSaleDetailData.activityType': activityType,
			});
		} else {
			this.setData({ textColor: '#ccc' });
		}
	},

	// 活动类型弹窗
	closeActivityToast({ currentTarget = {} }) {
		const { close, label } = currentTarget.dataset;
		this.setData({
			isActivityToast: close ? false : true,
			activityTitle: label === 'activitTotalSale' ? '活动累计销售达成' : '活动类型',
		});
	},

	// 客户分类显示状态
	clientClassShow() {
		let isType = '';
		isType = this.data.clientIsShow === false ? true : false;
		this.setData({
			clientIsShow: isType,
		});
	},

	// 陈列等级选择
	displayPickerChange(e) {
		this.setData({
			displayIndex: e.detail.value,
		});
		if (this.data.displayIndex !== 0) {
			this.setData({
				textColor: '#000',
				'signInfo.displayData.level': this.data.displayType[e.detail.value].name,
			});
		}
	},

	// 提交表单
	subForm(e) {
		let that = this;
		// const { fileItems } = this.data.signInfo;
		// const { stickCabinetFileItems, activityFileItems, salesAchievedFileItems } = this.data.signInfo;

		// 获取备注
		that.setData({
			'signInfo.outRemark': e.detail.value.outRemark,
			'signInfo.checkinId': Number(that.data.checkinId),
		});

		// 拜访类型为贴柜或活动类型
		if (this.data.isSignType === 'stick_cabinet' || this.data.isSignType === 'activity') {
			const {
				peopleNumber,
				colleagues,
				brand,
				activityType,
				days,
				totalPerformanceDecimal,
				activitySalesAchieved,
				selfPerformance,
				totalOrders,
				averagePrice,
				personalMaxPrice,
				teamMaxPrice,
			} = e.detail.value;

			const verifyArr = [
				brand,
				activityType,
				peopleNumber,
				days,
				totalPerformanceDecimal,
				activitySalesAchieved,
				selfPerformance,
				totalOrders,
				averagePrice,
				personalMaxPrice,
				teamMaxPrice,
			];

			const stickCabinetItems = this.data.signInfo.checkinSaleDetailData.stickCabinetFileItems || [];
			const activityItems = this.data.signInfo.checkinSaleDetailData.activityFileItems || [];
			const saleItems = this.data.signInfo.checkinSaleDetailData.salesAchievedFileItems || [];
			const signItems = this.data.signInfo.fileItems || [];
			const actFlag = this.data.isSignType === 'activity';
			const stickFlag = this.data.isSignType === 'stick_cabinet';

			// if (verifyArr[0] == '请选择品牌') {
			// 	return my.showToast({ type: 'fail', content: '请选择品牌' });
			// } else if (verifyArr[1] == '请选择活动类型' && this.data.isSignType === 'activity') {
			// 	return my.showToast({ type: 'fail', content: '请选择活动类型' });
			// } else if (verifyArr.filter(item => item !== undefined && item != 0 && !item).length) {
			// 	return my.showToast({ type: 'fail', content: '请输入完整信息' });
			// } else if ((!stickCabinetItems.length && stickFlag) || (!activityItems.length && actFlag)) {
			// 	return my.showToast({ type: 'fail', content: '请提交现场陈列照片' });
			// } else if (!saleItems.length) {
			// 	return my.showToast({ type: 'fail', content: '请提交当天销售达成照片' });
			// } else if (!signItems.length) {
			// 	return my.showToast({ type: 'fail', content: '请提交签退照片' });
      // }
       if (!signItems.length) {
				  return my.showToast({ type: 'fail', content: '请提交签退照片' });
       }

			that.setData({
				'signInfo.checkinSaleDetailData.peopleNumber': parseInt(peopleNumber),
				'signInfo.checkinSaleDetailData.colleagues': colleagues,
				'signInfo.checkinSaleDetailData.brand': brand,
				'signInfo.checkinSaleDetailData.activityType': activityType,
				'signInfo.checkinSaleDetailData.days': parseInt(days),
				'signInfo.checkinSaleDetailData.totalPerformanceDecimal': parseFloat(totalPerformanceDecimal),
				'signInfo.checkinSaleDetailData.activitySalesAchieved': parseFloat(activitySalesAchieved),
				'signInfo.checkinSaleDetailData.selfPerformance': parseFloat(selfPerformance),
				'signInfo.checkinSaleDetailData.totalOrders': parseInt(totalOrders),
				'signInfo.checkinSaleDetailData.averagePrice': parseFloat(averagePrice),
				'signInfo.checkinSaleDetailData.personalMaxPrice': parseFloat(personalMaxPrice),
				'signInfo.checkinSaleDetailData.teamMaxPrice': parseFloat(teamMaxPrice),
			});
		}

		// 判断拜访类型是否为维护
		const { checkinWay } = this.data.signInfo;
		if (checkinWay !== 'maintain' && checkinWay !== 'activity' && checkinWay !== 'stick_cabinet') {
			that.setData({
				'signInfo.merchantName': e.detail.value.merchantName,
				'signInfo.facadeName': e.detail.value.facadeName,
				'signInfo.facadeAddress': e.detail.value.facadeAddress,
				'signInfo.contactName': e.detail.value.contactName,
				'signInfo.contactPhone': e.detail.value.contactPhone,
			});

			// 获取缓存中的商品陈列信息
			my.getStorage({
				key: 'exhibit',
				success: function (res) {
					that.setData({ 'signInfo.displayData': res.data });
				},
			});

    } else {
			that.setData({
				'signInfo.displayData.situation': e.detail.value.situation,
				'signInfo.displayData.remark': e.detail.value.remark,
				'signInfo.displayData.materialRemark': e.detail.value.materialRemark,
			});

			// 获取
			let record = my.getStorageSync({ key: 'record' });
			let recordList = [];
			if (record && record.data) {
				record.data.stockSaleList.forEach(item => {
					item.fileItems.length && recordList.push(item);
				});
				that.setData({
					'signInfo.stockSaleList': recordList,
				});
			}
		}

		// 判断拜访类型为维护
		if (checkinWay === 'maintain') {
			const { fileItems = [] } = this.data.signInfo;
			const { productFileItems = [], materialFileItems = [], level = '' } = this.data.signInfo.displayData;
			// if (!productFileItems.length) return my.showToast({ type: 'fail', content: '请选择产品陈列图片' });
			// if (level == '' ) return my.showToast({ type: 'fail', content: '请选择陈列级别' });
			// if (!materialFileItems.length) return my.showToast({ type: 'fail', content: '请选择物料图' });
			if (!fileItems.length) return my.showToast({ type: 'fail', content: '请选择签退图片' });
		}

		// 范围判断
		// let flag = range.distance(
		// 	that.data.signInfo.lat,
		// 	that.data.signInfo.lng,
		// 	that.data.signInfo.facadeLat,
		// 	that.data.signInfo.facadeLng,
		// 	500
    // );

    if (checkinWay === 'stick_cabinet' || checkinWay === 'activity') {
      let colleagues = that.data.signInfo.checkinSaleDetailData.colleagues
      let param_colleagues = colleagues.length ? colleagues : [] 
      let conText = '确定进行签退操作吗？';
      let conBtnText = '确定';
      if (param_colleagues.length > 0) {
      checkColleagues({ colleagues: param_colleagues })
        .then(res => {
          const vali = res.data.data;
          console.log("data", vali, res);
          
          if (vali) {
            that.checkDistance().then(flag => {
              if (flag) { conText = '已超出限定范围，是否继续签退？'; conBtnText = '继续签退'; }
              my.confirm({
                title: '确认签退', content: conText,
                confirmButtonText: conBtnText, cancelButtonText: '取消',
                success: result => {
                  console.log(result);
                  if (result.confirm === true) {
                    that.signOut();
                  }
                },
                fail: error => {
                  console.log(error);
                }
              })
            })
          }
        })
        .catch(err => {
          if (params && params.length === 0) {
              return true
          } else {
            my.showToast({ content: '用户不存在，请重新选择', type: 'fail', duration: 3000 });
            return false;
          }
        })
      } else {
        that.checkDistance().then(flag => {
          if (flag) { conText = '已超出限定范围，是否继续签退？'; conBtnText = '继续签退'; }
          my.confirm({
            title: '确认签退', content: conText,
            confirmButtonText: conBtnText, cancelButtonText: '取消',
            success: result => {
              console.log(result);
              if (result.confirm === true) {
                that.signOut();
              }
            },
            fail: error => {
              console.log(error);
            }
          })
        })
      }

    } else {
      that.signOut();
    }

  },

	// 签退
	signOut(isException) {
		let that = this;
		let params = this.data.signInfo;
		const { checkinWay } = this.data.signInfo;
		const notActStick = checkinWay !== 'activity' && checkinWay !== 'stick_cabinet';
		for (let i in params) params[i] != 0 && !params[i] && notActStick && delete params[i];
		if (!notActStick && this.data.signInfo.checkinSaleDetailData.peopleNumber == 1) {
			this.setData({ 'signInfo.checkinSaleDetailData.colleagues': [] });
    }
    if (checkinWay !== 'activity' || checkinWay !== 'stick_cabinet') {
      params.isException = isException
    }

		params = this.data.signInfo;
      if (checkinWay === 'street_worship' || checkinWay === 'return_visit') {
        delete params['displayData']
      }
		my.showLoading({ content: '签退中，请稍后' });

		signOut(params)
			.then(res => {
				if (res.data.code == 0) {
					my.removeStorage({ key: 'exhibit' }); //清除签到信息缓存
					my.removeStorage({ key: 'branch' });
					my.removeStorage({ key: 'facade' });
					my.removeStorage({ key: 'record' });
          my.removeStorage({ key: 'colleagues' });
					my.hideLoading();
					that.setData({
						isSign: true,
						timer: setInterval(function () {
							that.data.seconds--;
							that.setData({
								seconds: that.data.seconds,
							});
							if (that.data.seconds == 0) {
								clearInterval(that.data.timer);
								my.switchTab({ url: '/pages/index/index' });
							}
						}, 1000),
					});
				}
			})
			.catch(err => {
				my.showToast({
					type: 'fail',
					content: err.data.msg,
					duration: 1000,
				});
				setTimeout(function () {
					my.hideLoading();
				}, 1000);
			});
  },

  // 距离检查
  checkDistance() {
    const {contractorId, facadeId, lat , lng} = this.data.signInfo
    let data = {contractorId, facadeId, lat, lng}
    return checkDistance(data).then(res => {
      return res.data.data.isException;
    })
  },

	// 验证同行人员是否为线下员工
	// validColleagues(params) {
	// 	return checkColleagues({ colleagues: params })
	// 		.then(res => {
	// 			const { data } = res.data.data;
	// 			if (res.code === 0) {
	// 				return data;
	// 			}
	// 		})
	// 		.catch(err => {
  //       if (params && params.length === 0) {
  //           return true
  //       } else {
  //         my.showToast({ content: '用户不存在，请重新选择', type: 'fail', duration: 3000 });
  //         return false;
  //       }
	// 		})
	// },

	// 表单字段验证
	dataFormFormat(e) {
		const { displayIndex } = this.data;
		const { fileItems, checkinWay } = this.data.signInfo;
		const { productFileItems, materialFileItems } = this.data.signInfo.displayData;

		const validForm = [
			{
				value: fileItems.length,
				prompt: '请选择签退图片！',
			},
			// {
			// 	value: productFileItems.length,
			// 	prompt: '请选择产品陈列图片！',
			// },
			// {
			// 	value: materialFileItems.length,
			// 	prompt: '请选择物料图！',
			// },
			// {
			// 	value: displayIndex,
			// 	prompt: '请选择陈列级别！',
			// },
		];

		// integerNumArr.forEach(item => {
		// 	if (!item) return this.showToast({ content: '请填写完整信息', type: 'fail' });
		// 	isNumber(item);
		// });
		// floatNumArr.forEach(item => {
		// 	if (!item) return this.showToast({ content: '请填写完整信息', type: 'fail' });
		// 	!parseFloat(item) && that.showToast({ content: '请输入数字', type: 'fail' });
		// });

		if (checkinWay !== 'activity' && checkinWay !== 'stick_cabinet')
			validForm.forEach(
				({ value, prompt }) => !value && my.showToast({ type: 'fail', content: prompt, duration: 3000 })
			);
	},
});