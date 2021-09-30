import verify from '/utils/common/js/verify';
import { BASE_URL } from '/config/index';
import { searchProducts } from '/api/sign/index'

Page({
	data: {
		selImg: '/static/image/up.svg',
		selStartSell: true,
		selStartStore: true,
		recordInfo: {
			sellArr: [],
			storeArr: [],
			sellInputVal: [{ productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 }],
			storeInputVal: [{ productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 }],
			sellFileItems: [],
			storeFileItems: [],
			sellRemark: '',
			storeRemark: '',
		},
		stockInfo: {
			// 库存信息
		},
		isSearch: false, // 搜索
		productList: [], //产品
		sellIndex: '', // 进行搜索的销售框
		storeIndex: '', // 进行搜索的库存框
		chooseIndex: '',
		sellAmount: '', // 销售总额
		storeAmount: '', //货值总值
		searchType: '', //搜索类型
		checkId: '', //签到id
	},
	onLoad(e) {
		this.setData({
			checkId: e.id,
		});
		this.data.recordInfo.storeFileItems.length = 0;
		this.data.recordInfo.sellFileItems.length = 0;
		this.data.recordInfo.sellArr.length = 0;
		this.data.recordInfo.storeArr.length = 0;
		this.setData({
			'recordInfo.storeFileItems': this.data.recordInfo.storeFileItems,
			'recordInfo.sellFileItems': this.data.recordInfo.sellFileItems,
			'recordInfo.sellArr': this.data.recordInfo.sellArr,
			'recordInfo.storeArr': this.data.recordInfo.storeArr,
		});
	},
	onShow() {
		let _than = this;
		let list = my.getStorageSync({ key: 'record' });
		if (list != null && list.data && list.data.stockSaleList.length != 0) {
			list.data.stockSaleList.forEach(item => {
				if (item.type === 'sale') {
					let products =
						item.products.length > 0
							? item.products
							: [{ productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 }];
					let imgList = [];
					item.fileItems.forEach(items => {
						imgList.push(items.url);
					});
					_than.setData({
						'recordInfo.sellInputVal': products,
						'recordInfo.sellRemark': item.remark,
						'recordInfo.sellFileItems': item.fileItems,
						'recordInfo.sellArr': imgList,
					});
				} else {
					let products =
						item.products.length > 0
							? item.products
							: [{ productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 }];
					let imgList = [];
					item.fileItems.forEach(items => {
						imgList.push(items.url);
					});
					_than.setData({
						'recordInfo.storeInputVal': products,
						'recordInfo.storeRemark': item.remark,
						'recordInfo.storeFileItems': item.fileItems,
						'recordInfo.storeArr': imgList,
					});
				}
			});
		}
	},
	// 销售图片上传
	importImgSell() {
		let _this = this;
		my.chooseImage({
			count: 3,
			success: res => {
				my.showLoading({
					content: '上传中',
				});
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
								header: {
									'Content-Type': 'multipart/form-data',
								},
								success: data => {
									my.hideLoading();
									my.showToast({
										type: 'success',
										content: '上传成功',
										duration: 2000,
									});
									let file = JSON.parse(data.data);
									if (file.code == 0) {
										_this.data.recordInfo.sellFileItems.push(file.data.fileUploadVo);
										_this.data.recordInfo.sellArr.push(item);
										_this.setData({
											'recordInfo.sellFileItems': _this.data.recordInfo.sellFileItems,
											'recordInfo.sellArr': this.data.recordInfo.sellArr,
										});
									}
								},
								fail(data) {
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
				});
			},
		});
	},
	// 删除销售图片
	delImgSell(e) {
		this.data.recordInfo.sellArr.splice(e.currentTarget.dataset.index, 1);
		this.data.recordInfo.sellFileItems.splice(e.currentTarget.dataset.index, 1);
		this.setData({
			'recordInfo.sellArr': this.data.recordInfo.sellArr,
		});
	},
	// 预览销售图片
	previewImgSell(e) {
		my.previewImage({
			current: e.currentTarget.dataset.index,
			urls: this.data.recordInfo.sellArr,
		});
	},
	// 库存图片上传
	importImgStore() {
		let _this = this;
		my.chooseImage({
			count: 3,
			success: res => {
				my.showLoading({
					content: '上传中',
				});
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
								header: {
									'Content-Type': 'multipart/form-data',
								},
								success: data => {
									my.hideLoading();
									my.showToast({
										type: 'success',
										content: '上传成功',
										duration: 2000,
									});
									let file = JSON.parse(data.data);
									if (file.code == 0) {
										_this.data.recordInfo.storeFileItems.push(file.data.fileUploadVo);
										_this.data.recordInfo.storeArr.push(item);
										_this.setData({
											'recordInfo.storeFileItems': _this.data.recordInfo.storeFileItems,
											'recordInfo.storeArr': this.data.recordInfo.storeArr,
										});
									}
								},
								fail(data) {
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
				});
			},
		});
	},
	// 删除库存图片
	delImgStore(e) {
		this.data.recordInfo.storeArr.splice(e.currentTarget.dataset.index, 1);
		this.data.recordInfo.storeFileItems.splice(e.currentTarget.dataset.index, 1);
		this.setData({
			'recordInfo.storeArr': this.data.recordInfo.storeArr,
		});
	},
	// 预览库存图片
	previewImgStore(e) {
		my.previewImage({
			current: e.currentTarget.dataset.index,
			urls: this.data.recordInfo.storeArr,
		});
	},
	// 下拉弹出
	selTapSell() {
		if (this.data.selStartSell == false) {
			this.setData({
				selImg: '/static/image/up.svg',
				selStartSell: true,
			});
		} else {
			this.setData({
				selImg: '/static/image/down.svg',
				selStartSell: false,
			});
		}
	},
	selTapStore() {
		if (this.data.selStartStore == false) {
			this.setData({
				selImg: '/static/image/up.svg',
				selStartStore: true,
			});
		} else {
			this.setData({
				selImg: '/static/image/down.svg',
				selStartStore: false,
			});
		}
	},
	// 增加销售记录
	addSellInput() {
		let obj = { productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 };
		this.data.recordInfo.sellInputVal.push(obj);
		this.setData({
			'recordInfo.sellInputVal': this.data.recordInfo.sellInputVal,
		});
	},
	// 删除销售记录
	delSellInput(e) {
		my.confirm({
			title: '确认删除',
			content: '确定删除这条记录吗？',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			success: res => {
				if (res.confirm) {
					this.data.recordInfo.sellInputVal.splice(e.currentTarget.dataset.index, 1);
					this.setData({
						'recordInfo.sellInputVal': this.data.recordInfo.sellInputVal,
					});
				}
			},
		});
	},
	//获取销售input的值
	getSellVal(e) {
		let _this = this;
		_this.setData({
			sellIndex: e.currentTarget.dataset.index,
			searchType: 'sell',
		});
		if (e.currentTarget.dataset.type == 'name') {
			if (e.detail.value.trim() == '') {
				// 不输入搜索条件 不搜索
				return;
			}
			_this.setData({
				isSearch: true,
			});
			searchProducts({ productName: e.detail.value.trim() })
				.then(res => {
					if (res.data.code == 0) {
						_this.setData({
							productList: res.data.data,
						});
					}
				});
		} else if (e.currentTarget.dataset.type == 'count') {
			const count = `recordInfo.sellInputVal[${_this.data.sellIndex}].number`;
			if (verify.isNumber(e.detail.value)) {
				//校验整数
				const total = `recordInfo.sellInputVal[${_this.data.sellIndex}].value`;
				_this.setData({
					[count]: +e.detail.value,
					[total]:
						Math.round(e.detail.value * _this.data.recordInfo.sellInputVal[_this.data.sellIndex].retailPrice * 10000) /
						10000,
				});
			} else {
				_this.setData({
					[count]: 0,
				});
			}
		}
		//销售总额
		this.setData({
			sellAmount: _this.data.recordInfo.sellInputVal
				.map(item => item.value)
				.reduce(function (prev, cur) {
					return prev + cur;
				}, 0), //销售总额
		});
	},
	//选择商品
	getChoose(e) {
		let _this = this;
		if (_this.data.searchType == 'sell') {
			const chooseName = `recordInfo.sellInputVal[${_this.data.sellIndex}].productName`;
			const choosePrice = `recordInfo.sellInputVal[${_this.data.sellIndex}].retailPrice`;
			const chooseId = `recordInfo.sellInputVal[${_this.data.sellIndex}].productId`;
			_this.setData({
				chooseIndex: e.currentTarget.dataset.index,
				[chooseName]: _this.data.productList[e.currentTarget.dataset.index].name,
				[choosePrice]: +_this.data.productList[e.currentTarget.dataset.index].price,
				[chooseId]: _this.data.productList[e.currentTarget.dataset.index].id,
			});
		} else if (_this.data.searchType == 'store') {
			const chooseName = `recordInfo.storeInputVal[${_this.data.storeIndex}].productName`;
			const choosePrice = `recordInfo.storeInputVal[${_this.data.storeIndex}].retailPrice`;
			const chooseId = `recordInfo.storeInputVal[${_this.data.storeIndex}].productId`;
			_this.setData({
				chooseIndex: e.currentTarget.dataset.index,
				[chooseName]: _this.data.productList[e.currentTarget.dataset.index].name,
				[choosePrice]: +_this.data.productList[e.currentTarget.dataset.index].price,
				[chooseId]: _this.data.productList[e.currentTarget.dataset.index].id,
			});
		}
		// 收起选择框
		let animation = my.createAnimation({
			duration: 600,
			timeFunction: 'eased',
		});
		animation.translateY(90).translateY(200).translateY(280).step();
		_this.setData({
			animationInfo: animation.export(),
		});
		// 隐藏选择框、清除动画
		setTimeout(function () {
			animation.step({ duration: 0 });
			_this.setData({
				isSearch: false,
				animationInfo: animation.export(),
			});
		}, 600);
	},
	// 增加库存记录
	addStoreInput() {
		let obj = { productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 };
		this.data.recordInfo.storeInputVal.push(obj);
		this.setData({
			'recordInfo.storeInputVal': this.data.recordInfo.storeInputVal,
		});
	},
	// 删除库存记录
	delStoreInput(e) {
		my.confirm({
			title: '确认删除',
			content: '确定删除这条记录吗？',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			success: res => {
				if (res.confirm) {
					this.data.recordInfo.storeInputVal.splice(e.currentTarget.dataset.index, 1);
					this.setData({
						'recordInfo.storeInputVal': this.data.recordInfo.storeInputVal,
					});
				}
			},
		});
	},
	//获取库存input的值
	getStoreVal(e) {
		if (e.detail.value.trim() == '') {
			// 不输入搜索条件 不搜索
			return;
		}
		let _this = this;
		_this.setData({
			storeIndex: e.currentTarget.dataset.index,
			searchType: 'store',
		});
		if (e.currentTarget.dataset.type == 'name') {
			_this.setData({
				isSearch: true,
			});
		  searchProducts({ productName: e.detail.value.trim() })
				.then(res => {
					if (res.data.code == 0) {
						_this.setData({
							productList: res.data.data,
						});
					}
				});
		} else if (e.currentTarget.dataset.type == 'count') {
			const count = `recordInfo.storeInputVal[${_this.data.storeIndex}].number`;
			if (verify.isNumber(e.detail.value)) {
				//校验整数
				const total = `recordInfo.storeInputVal[${_this.data.storeIndex}].value`;
				_this.setData({
					[count]: +e.detail.value,
					[total]:
						Math.round(
							e.detail.value * _this.data.recordInfo.storeInputVal[_this.data.storeIndex].retailPrice * 10000
						) / 10000,
				});
			} else {
				_this.setData({
					[count]: 0,
				});
			}
		}
		//货值总值
		this.setData({
			storeAmount: _this.data.recordInfo.storeInputVal
				.map(item => item.value)
				.reduce(function (prev, cur) {
					return prev + cur;
				}, 0), //销售总额
		});
	},
	// 关闭下拉框--不选择就清除数据
	closeSearch() {
		if (this.data.searchType == 'sell') {
			const chooseSell = `recordInfo.sellInputVal[${this.data.sellIndex}]`;
			this.setData({
				[chooseSell]: { productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 },
				isSearch: false,
			});
		} else if (this.data.searchType == 'store') {
			const chooseStore = `recordInfo.storeInputVal[${this.data.storeIndex}]`;
			this.setData({
				[chooseStore]: { productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 },
				isSearch: false,
			});
		}
	},
	// 销售备注
	getSellRemmark(e) {
		this.setData({
			'recordInfo.sellRemark': e.detail.value,
		});
	},
	// 库存备注
	getStoreRemmark(e) {
		this.setData({
			'recordInfo.storeRemark': e.detail.value,
		});
	},
	//过滤记录--数量和名称都为空不录入
	filterProduct(arr) {
		return arr.filter(function (item) {
			return item.productName.trim() != '' && item.number != 0;
		});
	},
	// 保存
	submit() {
		let _this = this;
		let storeImg = _this.data.recordInfo.storeFileItems.length;
		let sellImg = _this.data.recordInfo.sellFileItems.length;
		let storeLeg = _this.filterProduct(_this.data.recordInfo.storeInputVal).length;
		let sellLeg = _this.filterProduct(_this.data.recordInfo.sellInputVal).length;
		if (storeImg == 0 && sellImg == 0) {
			//销售、库存凭证二选一
			my.showToast({
				type: 'fail',
				content: '销售、库存凭证二选一！',
				duration: 2000,
			});
		} else {
			if (storeLeg > 0 && storeImg == 0) {
				my.showToast({
					type: 'fail',
					content: '请上传库存凭证！',
					duration: 2000,
				});
			} else if (sellLeg > 0 && sellImg == 0) {
				my.showToast({
					type: 'fail',
					content: '请上传销售凭证！',
					duration: 2000,
				});
			} else {
				let recordData = {
					stockSaleList: [
						{
							type: 'stock',
							remark: _this.data.recordInfo.storeRemark,
							fileItems: _this.data.recordInfo.storeFileItems,
							products: _this.filterProduct(_this.data.recordInfo.storeInputVal),
						},
						{
							type: 'sale',
							remark: _this.data.recordInfo.sellRemark,
							fileItems: _this.data.recordInfo.sellFileItems,
							products: _this.filterProduct(_this.data.recordInfo.sellInputVal),
						},
					],
				};

				if (sellLeg == 0 && sellImg > 0) {
					recordData.stockSaleList.map(item => {
						if (item.type == 'sale') {
							item.products.push({ productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 });
						}
					});
				}
				if (storeLeg == 0 && storeImg > 0) {
					recordData.stockSaleList.map(item => {
						if (item.type == 'stock') {
							item.products.push({ productName: '', productId: 0, retailPrice: 0.0, value: 0.0, number: 0 });
						}
					});
				}
				// let params = {
				//   id: _this.data.checkId,
				//   data: recordData
				// }

				my.setStorage({
					key: 'record',
					data: recordData,
					success: function () {
						my.navigateBack({ delta: 1 });
					},
				});

				// getApp().httpService.stock(params)
				// .then((res) => {
				//   if(res.data.code == 0){
				//     my.reLaunch({
				//       url: '/pages/call-on/call-on?signType=maintain&isFill=1'
				//     })
				//   }
				// })
			}
		}
	},
});
