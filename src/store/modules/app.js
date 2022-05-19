import Vue from 'vue'
import EthTool from '@/util/web3'
import * as api from '@/request/api'
import router from '@/routes/router';
import { GetUrlKey } from '@/util/index'
let lang = sessionStorage.getItem('language') || 'zh-CN';

function getStorage(key, defaults) {
  let data = window.localStorage.getItem(key);
  return data !== null ? data : defaults;
};

const app = {
  state: {
    language: sessionStorage.getItem('language') || 'zh-CN',//多语言
    token: localStorage.getItem('token'),
    account: JSON.parse(getStorage('account', '{}')),//用户信息
    loading: { display: 'none', opacity: '0' },//页面加载
    navStyle: '',//头部导航状态
    navDom: '',//首页菜单栏DOM
    route: localStorage.getItem('route'),//当前路由父级地址
    serviceID: localStorage.getItem('serviceID'),//当前工单ID
    libraryID: localStorage.getItem('libraryID'),//当前查看咨询库ID
    isBindCode: localStorage.getItem('isBindCode'),
    messageStatus: localStorage.getItem('messageStatus') || true,
    hedaerClass: localStorage.getItem('hedaerClass') || '',
    placeOrderMsg: JSON.parse(getStorage('placeOrderMsg', '{}')),//下单信息
    searchMsg: localStorage.getItem('searchMsg'),//搜索
    projectID: localStorage.getItem('projectID'),//项目解析ID
    isGoEvent: localStorage.getItem('upGoEvent') || false,//是否跳转重大事件
    isBindAddress: localStorage.getItem('isBindAddress') || false,//是否为绑定钱包地址
    repeatShow: localStorage.getItem('repeatShow') || 0,//账号重复登录提示
    contactWechat: localStorage.getItem('contactWechat'),//客服微信号码
    showTips: localStorage.getItem('showTips') || 1,//引导访问
    chainType: localStorage.getItem('chainType') || '0',//公链类型
    aliveName: localStorage.getItem('aliveName'),//过渡动画
    viewStatus: localStorage.getItem('viewStatus') || 3,//PDF阅读器状态
    viewUrl: localStorage.getItem('viewUrl'),//PDF阅读器文件源
    annStatus: localStorage.getItem('annStatus') || 0,//公告状态
    notifyHeight: '',//通知高度
    isBureau: localStorage.getItem('isBureau') || 0,//0 -- 研报中心 1 -- 情报局
    trackID: localStorage.getItem('trackID') || null,//自选项目ID
    tabIndex: localStorage.getItem('tabIndex') || null,
    dataIndex: localStorage.getItem('dataIndex') || null,
    isNeglect: localStorage.getItem('isNeglect') || 0,//是否现实全部忽略
    isOpenMenu: localStorage.getItem('isOpenMenu') || 1,//菜单打开状态
  },
  mutations: {
    upAccount: (state, account) => {//更新用户信息
      state.account = account;
      localStorage.setItem('account', JSON.stringify(account))
    },
    upPlaceOrderMsg: (state, placeOrderMsg) => {
      state.placeOrderMsg = placeOrderMsg;
      localStorage.setItem('placeOrderMsg', JSON.stringify(placeOrderMsg))
    },
    upLoadStatus: (state, bool) => {//主体加载状态
      state.loading = bool;
    },
    upNavStyle: (state, classOut) => {//头部导航状态
      state.navStyle = classOut;
    },
    upNavDom: (state, navDom) => {
      state.navDom = navDom;
    },
    setLanguage: (state, language) => {//语言切换
      state.language = language;
      sessionStorage.setItem('language', language)
    },
    upToken: (state, token) => {//用户Token更新
      state.token = token;
      localStorage.setItem('token', token)
    },
    upRoute: (state, route) => {//当前路由父级地址更新
      state.route = route;
      localStorage.setItem('route', route)
    },
    upServiceIDL: (state, serviceID) => {//当前工单ID更新
      state.serviceID = serviceID;
      localStorage.setItem('serviceID', serviceID)
    },
    upLibraryID: (state, libraryID) => {//当前咨询库ID更新
      state.libraryID = libraryID;
      localStorage.setItem('libraryID', libraryID)
    },
    upIsBindCode: (state, isBindCode) => {//更新是否显示邀请码窗口
      state.isBindCode = isBindCode;
      localStorage.setItem('isBindCode', isBindCode)
    },
    upMessageStatus: (state, messageStatus) => {//更新新消息提示
      state.messageStatus = messageStatus;
      localStorage.setItem('messageStatus', messageStatus);
    },
    upHeader: (state, hedaerClass) => {//更新头部样式
      state.hedaerClass = hedaerClass;
      localStorage.setItem('hedaerClass', hedaerClass)
    },
    upSearchMsg: (state, searchMsg) => {//更新搜索内容
      state.searchMsg = searchMsg;
      localStorage.setItem('searchMsg', searchMsg);
    },
    upProjectID: (state, projectID) => {//更新项目解析ID
      state.projectID = projectID;
      localStorage.setItem('projectID', projectID)
    },
    upIsGoEvent: (state, isGoEvent) => {//是否锚点解析面板重大事件
      state.isGoEvent = isGoEvent;
      localStorage.setItem('isGoEvent', isGoEvent);
    },
    upIsBindAddress: (state, isBindAddress) => {//是否为绑定钱包地址
      state.isBindAddress = isBindAddress;
      localStorage.setItem('isBindAddress', isBindAddress)
    },
    upRepeatShow: (state, repeatShow) => {//更新重复登录提醒弹框
      state.repeatShow = repeatShow;
      localStorage.setItem('repeatShow', repeatShow)
    },
    upShowTips: (state, showTips) => {//更新提示状态
      state.showTips = showTips;
      localStorage.setItem('showTips', showTips)
    },
    upChainType: (state, chainType) => {//更新选择公链
      state.chainType = chainType;
      localStorage.setItem('chainType', chainType);
    },
    upAliveName: (state, aliveName) => {//更新路由过渡状态
      state.aliveName = aliveName;
      localStorage.setItem('aliveName', aliveName);
    },
    upViewStatus: (state, viewStatus) => {//更新PDF阅读器查看状态
      state.viewStatus = viewStatus;
      localStorage.setItem('viewStatus', viewStatus)
    },
    upViewUrl: (state, viewUrl) => {//更新PDF阅读器文件源
      state.viewUrl = viewUrl;
      localStorage.setItem('viewUrl', viewUrl);
    },
    upAnnStatus: (state, annStatus) => {//更新公告状态
      state.annStatus = annStatus;
      localStorage.setItem('annStatus', annStatus)
    },
    upNotifyHeight: (state, notifyHeight) => {//更新通知高度
      state.notifyHeight = notifyHeight;
    },
    uIsBureau: (state, isBureau) => {//更新项目入口状态
      state.isBureau = isBureau;
      localStorage.setItem('isBureau', isBureau);
    },
    upTrackID: (state, trackID) => {//更新自选项目ID
      state.trackID = trackID;
      localStorage.setItem('trackID', trackID);
    },
    saveInedx: (state, { _tabIndex, _dataIndex }) => {
      state.tabIndex = _tabIndex;
      state.dataIndex = _dataIndex;
      localStorage.setItem('tabIndex', _tabIndex)
      localStorage.setItem('dataIndex', _dataIndex)
    },
    UpIsNeglect: (state, isNeglect) => {
      state.isNeglect = isNeglect;
      localStorage.setItem('isNeglect', isNeglect);
    },
    upIsOpenMenu: (state, isOpenMenu) => {
      state.isOpenMenu = isOpenMenu;
      localStorage.setItem('isOpenMenu', isOpenMenu);
    }
  },
  actions: {
    loginIn: async ({ dispatch, commit }) => { //登入
      const result = await EthTool.signIn();
      if (result !== undefined && result != 'UnLock') {
        switch (result.code) {
          case 4001:
            Vue.prototype.$notify({
              type: 'danger',
              message: lang == 'en' ? 'Authorization cancelled' : '您已取消授权'
            });
            break;
          case -32002:
            window.openHint()
          default:
            if (!result[1]) {
              if (result.length) {
                dispatch('loginDiel', result[0])
              }
            }
        }
      }
    },
    //签名验证登录
    loginDiel: async ({ commit, dispatch }, _address) => {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      //获取签名随机数
      const signNonce = await api.metaNonce({ address: _address });
      if (signNonce.code == 1001) {
        localStorage.setItem("openSearchBox", true);
        commit('upRepeatShow', 1);
        return
      } else if (signNonce.code == 1003) {
        window.openFailed();
        return
      }
      if (!signNonce.data.nonce) {
        return
      }
      //获取 Web3 用户签名信息
      const sign = await EthTool.sign(_address, signNonce.data.nonce);
      if (!sign) {
        return
      }
      //提交签名验证
      const signResult = await api.metaSign({ address: _address, signature: sign, parent_code: GetUrlKey('code', window.location.href) ? GetUrlKey('code', window.location.href) : '', cooperateCode: GetUrlKey('cooperateCode', window.location.href) ? GetUrlKey('cooperateCode', window.location.href) : '' });
      if (!signResult.data || signResult.code != 2000) {
        Vue.prototype.$notify({
          type: 'danger',
          message: signResult.msg
        });
        return
      }
      let add = [];
      add.push(_address);
      dispatch('setAccount', signResult.data.data);
      commit('upToken', signResult.data.token);
      // const { meal_id, is_distributor } = signResult.data.data;
      // is_distributor == 1
      //   ? router.push('/channel-business')
      //   : router.push(
      //     (meal_id == 3 && "/userCenter") ||
      //     (meal_id == 4 && "/userCenter") ||
      //     (meal_id == 1 &&
      //       signResult.data.data.one_day_try_status.status &&
      //       signResult.data.data.one_day_try_status.status == 1 &&
      //       "/userCenter") ||
      //     (meal_id == 0 && "/unVip") ||
      //     "/otherCenter"
      //   );
      // commit("upAliveName", "open-alive");
      router.push('/');
      setTimeout(() => {
        window.getAnn();
        window.getCodeStatus();
        flag && window.isTip();
      }, 2000)
    },
    setAccount({ commit }, account) {
      commit('upAccount', account)
    },
    //更新用户信息
    upAccount: async ({ commit }) => {
      await api.userInfo().then((res) => {
        commit('upAccount', res)
      })
    },
    //查看研报
    viewPDF: ({ dispatch }, _url) => {
      window.open(_url);
    },
    //已读研报
    readPDF: ({ dispatch }, { _type, _id }) => {
      api.readNow({
        type: _type,
        id: _id,
      });
    },
    //埋点统计用户操作
    setPoint: ({ dispatch }, _point_type) => {
      api.setPoint({
        point_type: _point_type
      })
    },
    //项目入口统计操作
    setProjectPoint:({dispatch},_project_type) => {
      api.SetProjectInto({
        type:_project_type
      })
    }
  },
  getter: {

  }
}
export default app;
