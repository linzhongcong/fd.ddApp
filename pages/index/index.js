import format from '/utils/common/js/format';
import { getUser,DiligenceRanking,popInfo,popAttention,isSign,signCount } from '/api/login/index'

let app = getApp();
Page({
  data: {
    /* 签到/签退 */
    branch: {}, // 用户信信息
    acceptSign: true, // 是否允许签到，签到请求错误则不允许签到
    isSign: false, // 是否已签到标识
    signType: '', // 签到类型
    signId: '', // 签到id
    signTime: '', // 当前时间
    address: '', // 当前地址
    timer: '', // 签到时间
    
    /* 排行榜 */
    tabs: [{value: 'diligence', title: '勤奋榜'}, {value: 'business', title: '业绩榜 '}],
    tabIndex: 0,
    rankingType: '',  // 排行榜类型:diligence=勤奋榜,business=业绩榜(总榜),new_people=业绩榜(新人榜)
    page: 1, // 分页当前页
    count: 0, // 签到次数（无门店签到不算在内）
    perPage: 10, // 分页大小
		rankingsObj: {}, // 榜单数据
    
    /* 其他 */
		notifyPrompt: false, // 通知弹窗是否展示
    notifyContent: [], // 消息通知具体内容
    attentionPrompt: false, // 注意事项弹窗是否展示
    attentionPromptLogin: false,  // 登录时 注意事项弹窗是否展示
    attentionClickMatter: {}, //注意事项 - 点击时弹出
    attentionLoginMatter: {}, //注意事项 - 登录时弹出
	},

/*--------------------------------    交互      -----------------------------*/
	// 查看更多排名
	jumpToOtherPage(e) {
		const { type } = e.currentTarget.dataset;
		type === 'viewMore' && my.navigateTo({ url: '/pages/ranking/ranking' });
  },

  // tab 被点击的回调 ：(index: Number，tabsName：String) => void
  handleTabClick(e) {
    this.setData({ tabIndex: e.index, rankingType: this.data.tabs[e.index].value, page: 1, count: 0 })
  },

  // 注意事项
  openModal() {
    this.setData({attentionPrompt: true})
  },

  onModalClick() {
    this.setData({attentionPrompt: false, attentionPromptLogin: false})
  },

/*-------------------------------   签到/签退    -----------------------------*/

  // 签到
  signIn() {
    if (!this.data.acceptSign) {
      return my.showToast({content: `请检查网络设置，或联系管理员`}) 
    } else {
      my.navigateTo({ url: `/pages/sign-in/transfer-station/transfer-station` })
    }
  },

  // 签退
  signOut() {
    if (!this.data.acceptSign) return my.showToast({content: `请检查网络设置，或联系管理员`})
    let page = `/pages/sign-out/index/index`, signType = this.data.signType, id = this.data.signId  
    // 不同页面签退不同
    switch ((signType)) {
      case 'return_visit':
      my.navigateTo({url: `/pages/sign-out/return_visit/return_visit?id=${id}`})
      break;
      case 'maintain': 
      my.navigateTo({url: `/pages/sign-out/maintain/maintain?id=${id}`})
      break;
      case 'patrol': 
      my.navigateTo({url: `/pages/sign-out/patrol/patrol?id=${id}`})
      break;
      default: 
      my.navigateTo({ url: `${page}?type=${signType}&id=${id}` }); 
      break;
    }
  },

  onScrollToLower(){ },

  //签到时间
  timer() {
    let date = new Date()    
    let signTime = format.formatDateTime(date)
    this.setData({signTime, timer: setInterval(() => { this.setData({signTime: format.formatDateTime(new Date()) }) },1000) })
  },

  /*-------------------------------   FETCH DATA   -----------------------------*/
  
  // 获取签到状态
  fetchCheckStatus() {
    isSign().then(res => {   
      let data = res.data.data, code = res.data.code
      if ( code === 0 && data) {
        let _signId = data.id || data[0].id, signType = data.checkinWay ||  data[0].checkinWay
        if (signType !== 'no_shop' && signType !== 'street_worship' ) {
          this.setData({isSign: true, signId: _signId, signType: signType, acceptSign: true})
        }
      } else {
        this.setData({isSign: false, acceptSign: true})
      }
    }).catch(err => {
      this.setData({acceptSign: false})
      my.showToast({type: 'fail', content: `签到状态获取异常，请重新进入程序或联系管理员`})
    })
  },

  // 获取用户信息
  fetchUserInfo() {
    getUser().then(res => {
      let _data = res.data.data
      , parentDept = _data.parentDept ? _data.parentDept : ''
      , groupName = _data.groupName ? _data.groupName : '' 
      , department = `${parentDept} - ${groupName}`
      this.setData({branch: res.data.data})
      this.setData({ 'branch.department': department })
    }).catch(err => { 
      if (err.data && err.data.msg) {
        my.showToast({type: 'fail', content: err.data.msg, duration: 1500}) 
      }
      console.log("err",err);
    })
  },

  // 获取签到次数
  fetchCheckInCount() {
		signCount().then(res => that.setData({ count: res.data.data.dayCount }) )
  },

  // 获取排行榜
  fetchRankingData(data) {
    let params = {type: this.data.rankingType, page: this.data.page, perPage: this.data.perPage}
    if (data) { params.type = data.type }
    DiligenceRanking(params).then(res => {
      this.setData({ rankingsObj: res.data.data })
    }).catch(err => {
      my.showToast({content: `排行榜数据加载失败`})
    })
  },

  // 获取通知内容
  fetchNotifyContent() {
    popInfo().then(res => { 
      if (res.show && res.show.length > 0) { this.setData({notifyContent: res.show}) } 
    }).catch(err => {
      console.log("通知 err",err)      
    })

  },
  
  // 获取注意事项
  fetchattentionClickMatter() {
    let regexp = /萍/g, clicks = [], logins = [], attentionClickMatter = {}, attentionLoginMatter = {}
		popAttention().then(res => {
      let click = res.data.clickPop, login = res.data.loginPop
      if (!!click) {
        clicks = click.noticeContent.split(regexp)
        attentionClickMatter = click
        attentionClickMatter.noticeContent = clicks
        this.setData({attentionClickMatter})
      }
      if (!!login) {
        logins = click.noticeContent.split(regexp)
        attentionLoginMatter = login
        attentionLoginMatter.noticeContent = logins
        this.setData({attentionLoginMatter, attentionPromptLogin: true})
      }
    }).catch(err => console.log(`注意事项获取失败`))
  },

  // 上拉加载排行榜
  onReachBottom() {
    this.setData({ page: this.data.page + 1 }, () =>  this.fetchRankingData())
  },

  initLoad() {
    this.fetchUserInfo() 
    this.fetchattentionClickMatter()
    this.fetchNotifyContent()
  },
  
	onLoad() {
    if (my.getStorageSync({key: 'token'}).data) {
      this.initLoad()
    } else {
      my.navigateTo({url: '/pages/logining/logining'})
    }
  },
  
	onShow() {
    this.fetchCheckStatus()
    this.timer()
  },

  onHide() {
    clearInterval(this.data.timer)
  }
});


/*-------------------------  reference type data describe  -------------------------*/
const branch = {
  id: '', // 员工id
  uuid: "", // uid
  avatar: "" , // 头像
  parentId: '', // 上级部门id
  parentDept: "", // 上级部门
  groupId: '',  // 所在部门Id
  groupName: "", // 所在部门
  deptJobId: '', // 职务id
  deptJobName: "", // 职务
  realName: "", // 花名
  username: "", // 工号
  phone: "", // 电话
  status: "", // 用户转台
  lastVisitAt: '', // 最后一次签到时间
}

const rankingsObj = {
  username: '', // 员工工号
  loginName: '', // 员工姓名
  rank: 0, // 员工排名
  checkinNumber: 0, // 员工签到次数
  signingNumber: 0, // 签约合作商数量
  count: 0, // 排行榜数量
  page: 1, // 当前页数
  perPage: 10, // 每页数量
  pages: 0, // 排行榜页数
  list: [], // 排行列表
}