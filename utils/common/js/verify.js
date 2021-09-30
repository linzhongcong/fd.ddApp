// 非空验证
function noEmpty(datas) {
	let flag = true;
	datas.forEach(item => {
		if (item.data == '') {
			my.showToast({
				content: `${item.title}` + '不能为空！',
				type: 'fail',
				duration: 2000,
			});
			flag = false;
		}
	});
	return flag;
}

// 下拉框未选择验证
function firstIndex(dates) {
	let flag = true;
	if (dates.index === 0) {
		my.showToast({
			content: dates.title + '！',
			type: 'fail',
			duration: 2000,
		});
		flag = false;
	}
	return flag;
}

// 图片未上传验证
function file(dates, title) {
	let flag = true;
	if (dates.length === 0 || dates === undefined) {
		my.showToast({
			content: '请提交' + title,
			type: 'fail',
			duration: 2000,
		});
		flag = false;
	}
	return flag;
}

// 整数验证
function isNumber(num) {
	let flag = true;
	if (!/(^[1-9]\d*$)/.test(num)) {
		my.showToast({
			content: '请输入整数！',
			type: 'fail',
			duration: 2000,
		});
		flag = false;
	}
	return flag;
}

// 手机号验证
function phoneCheck(phone) {
	let flag = true;
	if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(phone)) {
		my.showToast({
			content: '请输入合法手机号！',
			type: 'fail',
			duration: 2000,
		});
		flag = false;
	}
	return flag;
}

module.exports = {
	noEmpty: noEmpty,
	firstIndex: firstIndex,
	file: file,
	isNumber: isNumber,
	phoneCheck: phoneCheck,
};
