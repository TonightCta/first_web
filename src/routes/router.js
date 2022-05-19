import VueRouter from 'vue-router';
import Vue from 'vue';
import routes from './routes';
import store from '../store/index';
import i18n from '../lang/i18n'
import { userInfo } from '@/request/api';
let lang = new Vue({ i18n })
//处理路由重复错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// configure router
const router = new VueRouter({
  // mode:'history',
  routes, // short for routes: routes
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});
//包月&试用禁止进入包年&非会员
const yearArr = ['UserCenter', 'upVip'];
//包年禁止进入包月&非会员
const monthArr = ['OtherCenter', 'umVip'];
router.beforeEach(async (to, from, next) => {
  store.commit('upAliveName', 'default-alive')
  const { meal_id, is_distributor, is_information, information_status } = store.state.app.account;
  let tryStatus;
  store.state.app.account.one_day_try_status && (tryStatus = store.state.app.account.one_day_try_status.status);
  //更新会员信息
  const upDateInfo = async () => {
    await userInfo().then(res => {
      store.dispatch('setAccount', res);
      // meal_id = res.meal_id;
    });
  }
  store.state.app.token && upDateInfo();
  const condition = tryStatus == 2 ? (yearArr.indexOf(to.name) > -1 && meal_id != 3 && meal_id != 4 && meal_id != 0) : (yearArr.indexOf(to.name) > -1 && meal_id != 1 && meal_id != 3 && meal_id != 4 && meal_id != 0);
  //包年会员权限拦截
  if (condition) {
    store.commit('upAliveName', 'open-alive');
    next('/otherCenter')
    return;
  };
  if (monthArr.indexOf(to.name) > -1 && (meal_id == 3 || meal_id == 4)) {
    store.commit('upAliveName', 'open-alive');
    next('/userCenter');
    return;
  }
  //非会员路由拦截
  const upVip = ['UnVip', 'Index', 'PlaceOrder', 'PayOrder', 'MobilePlaceOrder', 'PayOrderMobile', 'Setting', 'Committed', 'Order', 'ChannelBusiness', 'MobileOrder',
    'MobileOrderDetails', 'MobileProtocol', 'LoginMobile', 'MobileTerms',
    'MobileProtocolTwo', 'BureauAdmin', 'MineBureau', 'BureauExpress', 'BureauDiscord',
    'BureauEvents', 'BureauProposal', 'BureauTrack', 'TrackDetails', 'AddTrack', 'MobileInner', 'PosalDetails',
    'MyCalendar'
  ]
  if (upVip.indexOf(to.name) == -1 && meal_id == 0) {
    Vue.prototype.$notify({
      type: 'danger',
      //该功能为研报库会员专享
      message: lang.$t('notify.need_project_year'),
    });
    store.commit('upAliveName', 'open-alive');
    setTimeout(() => {
      next('/unVip');
    })
    return;
  };
  if (to.name == 'ChannelBusiness' && is_distributor == 0) {
    Vue.prototype.$notify({
      type: 'danger',
      message: store.state.app.language == 'en' ? 'Unauthorized access' : '非法访问',
    });
    store.commit('upAliveName', 'open-alive');
    next('/mine')
    return;
  }
  const bureauList = ['MineBureau', 'BureauExpress', 'BureauDiscord', 'BureauEvents', 'BureauProposal', 'BureauTrack', 'TrackDetails'];
  //情报局拦截
  if (bureauList.indexOf(to.name) > -1 && (is_information == 0 || information_status != 1)) {
    Vue.prototype.$notify({
      type: 'danger',
      message: to.name == 'BureauEvents' ? lang.$t('need_vip.need_year') : store.state.app.language == 'en' ? 'Unauthorized access' : '请先选择订阅套餐',
    });
    store.commit('upAliveName', 'open-alive');
    setTimeout(() => {
      next('/unVip');
    })
    return;
  };
  if (bureauList.indexOf(to.name) > -1) {
    setTimeout(() => {
      store.commit("uIsBureau", 1)
    }, 300)
  }
  //未登录路由拦截
  if (to.name !== 'Index' && to.name !== 'Committed' && to.name !== 'LoginMobile' && to.name !== 'MobileTerms' && to.name !== 'MobileProtocolTwo' && to.name !== 'BureauAdmin' && meal_id == undefined && is_distributor == undefined) {
    store.commit('upAliveName', 'open-alive');
    next('/index')
    return;
  }
  //返回首页时显示头部导航
  if (to.path == '/index' || to.path == '/committed' || !to.name) {
    store.commit('upNavStyle', '')
    next();
  } else {
    store.commit('upNavStyle', 'hidden-nav')
  }
  //如果从首页进入则直接进入页面不启用loading
  if (from.name == 'Index') {
    next()
  }
  //个人中心页面启用Loading
  if (to.path !== '/mine') {
    store.commit('upLoadStatus', { display: 'block', opacity: '1' });
    setTimeout(() => {
      store.commit('upLoadStatus', { display: 'block', opacity: '1' });
    }, 10)
  };
  // to.path == 'Mine'
  setTimeout(() => {
    next();
  }, 500)
});
router.afterEach((to) => {
  store.commit('upAliveName', 'open-alive');
  store.commit('upRoute', to.meta.url);
  //关闭Loading
  store.commit('upLoadStatus', { display: 'block', opacity: '0' });
  setTimeout(() => {
    store.commit('upLoadStatus', { display: 'none', opacity: '0' });
  }, 300)
  let container = document.querySelector(".mine-view");
  container && container.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
export default router;
