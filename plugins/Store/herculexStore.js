 import Store from 'herculex'
 
 export default new Store({
 connectGlobal: true,
  state: {
    count: 0,
    userInfo: {},
    bannerList: [],
    loading: false,
    buttonLoading: false,
    contacts: {} // 添加
  },
  mutations: {
    setCount(state, payload) {
      state.count = payload
    }
  },
  getters: {},
  actions: {},
  plugins: [ 'logger' ], // inner plugin logger
});