/*!

 =========================================================
 * Vue Black Dashboard PRO - v1.2.3
 =========================================================

 * Product Page: https://www.creative-tim.com/product/vue-black-dashboard-pro
 * Copyright 2019 Creative Tim (https://www.creative-tim.com)

 * Coded by Creative Tim

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterPrefetch from 'vue-router-prefetch'
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App.vue';
import './config.js';
import './util/element.js';
import './util/vant.js';
// router setup
import router from './routes/router';
import store from './store/index';
import i18n from './lang/i18n';
import './registerServiceWorker';
import '@/assets/icon/iconfont.css';
import './style/reset.css';
//Font
// import './util/rem.js'
// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);
Vue.prototype.$flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
Vue.prototype.$cell = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  i18n
});
