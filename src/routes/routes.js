const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
import Vue from 'vue';
import i18n from '../lang/i18n';
let lang = new Vue({i18n});
const language = sessionStorage.getItem('language');
const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  //首页
  {
    path: '/index',
    name: 'Index',
    component: () => import("@/views/index")
  },
  //透明承诺
  {
    path: '/committed',
    name: 'Committed',
    component: () => import('@/views/page/committed')
  },
  //404
  {
    path: '*',
    component: () => import('@/views/not_found/not_found')
  },
  //移动端登录
  {
    path: '/login-mobile',
    name: 'LoginMobile',
    component: () => import('@/views/login_mobile/login.vue')
  },
  //移动端-订单详情
  {
    path: '/mobile-order-details',
    name: 'MobileOrderDetails',
    component: () => import('@/views/order/mobile_order_details'),
    meta: { title: `<p>${lang.$t('routes.check_order')}</p>` }
  },
  //移动端-支付订单
  {
    path: '/mobile-order-pay',
    name: 'MobileOrderPay',
    component: () => import('@/views/order/coms/mobile_pay'),
    meta: { title: `<p>${lang.$t('routes.order_pay')}</p>` }
  },
  //移动端-提交咨询
  {
    path: '/mobile-submit-pro',
    name: 'MobileSubmitPro',
    component: () => import('@/views/pro_news/submit_pro_mobile'),
    meta: { title: `<p>${lang.$t('routes.submit_en')}</p>` }
  },
  //移动端-咨询详情
  {
    path: '/mobile-service-details',
    name: 'MobileServiceDetails',
    component: () => import('@/views/pro_news/mobile/details_service'),
  },
  //移动端-咨询库
  {
    path: '/mobile-library',
    name: 'MobileLibrary',
    component: () => import('@/views/pro_news/mobile/library_mobile'),
    meta: { titel: `<p>${lang.$t('routes.en_libary')}</p>` }
  },
  //移动端-咨询库详情
  {
    path: '/mobile-library-details',
    name: 'MobileLibraryDetails',
    component: () => import('@/views/pro_news/mobile/details_mobile'),
    meta: { title: `<p>${lang.$t('routes.en_infor')}</p>` }
  },
  //移动端-未读研报
  {
    path: '/mobile-unread',
    name: 'MobileUnRead',
    component: () => import('@/views/mine/yearCenter/mobile_unread'),
  },
  //移动端-解析面板
  {
    path: '/mobile-project-details',
    name: 'MobileProjectDetails',
    component: () => import('@/views/project/mobile_project_details')
  },
  //移动端-条款协议
  {
    path: '/mobile-protocol',
    name: 'MobileProtocol',
    component: () => import('@/comsmine/protocol')
  },
  //移动端-注册服务协议
  {
    path: '/mobile-terms',
    name: 'MobileTerms',
    component: () => import('@/comsmine/terms_service')
  },
  //移动端-隐私政策
  {
    path: '/mobile-protocol-two',
    name: 'MobileProtocolTwo',
    component: () => import('@/comsmine/terms_protocol')
  },
  //移动端 - 我的日历
  {
    path: '/my-calendar',
    name: 'MyCalendar',
    component: () => import('@/views/bureau/coms/my_calendar_mobile')
  },
  //情报审核
  {
    path: '/bureau-admin',
    name: 'BureauAdmin',
    component: () => import('@/views/bureau_admin/b_admin')
  },
  //移动端 - 提案详情
  {
    path:'/posal-details',
    name:'PosalDetails',
    component:() => import('@/views/bureau/coms/posal_details')
  },
  //移动端 - 添加自选
  {
    path:'/add-track',
    name:'AddTrack',
    component:() => import('@/views/bureau/coms/mine_bureau/add_track_mobile')
  },
  //移动端 - 内容详情
  {
    path:'/mobile-inner',
    name:'MobileInner',
    component:() => import('@/views/bureau/coms/inner_details')
  },
  //情报局-重点情报
  {
    path:'/bureau-important',
    name:'BureauImportant',
    component:() => import('@/views/bureau/bureau_important')
  },
  // 个人中心
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/mine/mine'),
    redirect: '/unVip',
    children: [

      //非会员
      {
        path: '/unVip',
        name: 'UnVip',
        component: () => import('@/views/mine/un_vip'),
        meta: { title: `<p class='high'>${language == 'en' ? 'Home' : '我的头等仓'}</p>`, url: '/unVip' }
      },
      //年费会员中心
      {
        path: '/userCenter',
        name: 'UserCenter',
        component: () => import('@/views/mine/center'),
        meta: { title: `<p class="high">${lang.$t('routes.mine_project')}</p>`, url: '/userCenter' }
      },
      //年费会员未读研报1
      {
        path: '/userCenter/unRead',
        name: 'UnRead',
        component: () => import('@/views/mine/yearCenter/unRead'),
        meta: { title: `<p>${lang.$t('routes.mine_project')}</p>&nbsp;/&nbsp;<p class="high">${lang.$t('routes.unread_pro')}</p>`, url: '/userCenter' }
      },
      //试用、包月会员中心
      {
        path: '/otherCenter',
        name: 'OtherCenter',
        component: () => import('@/views/mine/other_center'),
        meta: { title: `<p class="high">${lang.$t('routes.mine_project')}</p>`, url: '/otherCenter' }
      },
      //渠道商数据中心
      {
        path: '/channel-business',
        name: 'ChannelBusiness',
        component: () => import('@/views/channel_business/business'),
        meta: { title: `<p class="high">${lang.$t('routes.mine_business')}</p>`, url: '/channel-business' }
      },
      //项目解析
      {
        path: '/project',
        name: 'Project',
        component: () => import('@/views/project/project'),
        meta: { title: `<p class="high">${lang.$t('routes.project_an')}</p>`, url: '/project' }
      },
      //项目解析
      {
        path: '/project/projectDetails',
        name: 'ProjectDetails',
        component: () => import('@/views/project/project_details'),
        meta: { title: `<p>${lang.$t('routes.project_an')}</p>&nbsp;/&nbsp;<p class="high">${lang.$t('routes.an_interface')}</p>`, url: '/project' }
      },
      //赛道解析
      {
        path: '/race',
        name: 'Race',
        component: () => import('@/views/race/race'),
        meta: { title: `<p class="high">${lang.$t('routes.sector_an')}</p>`, url: '/race' }
      },
      //热币速递
      {
        path: '/coin',
        name: 'Coin',
        component: () => import('@/views/coin/coin'),
        meta: { title: `<p class="high">${lang.$t('routes.project_del')}</p>`, url: '/coin' }
      },
      //项目咨讯
      {
        path: '/proNews',
        name: 'ProNews',
        component: () => import('@/views/pro_news/pro_news'),
        meta: { title: `<p class="high">${lang.$t('routes.project_en')}</p>`, url: '/proNews' }
      },
      //提交项目咨询
      {
        path: '/proNews/submitPro',
        name: 'SubmitPro',
        component: () => import('@/views/pro_news/submit.vue'),
        meta: { title: `<p>${lang.$t('routes.project_en')}</p>&nbsp;/&nbsp;<p class="high">${lang.$t('routes.submit_en')}</p>`, url: '/proNews' }
      },
      //项目咨询详情
      {
        path: '/proNews/serviceDetails',
        name: 'ServiceDetails',
        component: () => import('@/views/pro_news/service_details'),
        meta: { title: `<p>${lang.$t('routes.project_en')}</p>&nbsp;/&nbsp;<p class="high">${lang.$t('routes.en_details')}</p>`, url: '/proNews' }
      },
      //咨询库
      {
        path: '/proNews/library',
        name: 'Library',
        component: () => import('@/views/pro_news/library'),
        meta: { title: `<p>${lang.$t('routes.project_en')}</p>&nbsp;/&nbsp;<p class="high">${lang.$t('routes.en_libary')}</p>`, url: '/proNews' }
      },
      //咨询库详情
      {
        path: '/proNews/library/libraryDetails',
        name: 'LibraryDetails',
        component: () => import('@/views/pro_news/library_details'),
        meta: { title: `<p>${lang.$t('routes.en_libary')}</p>&nbsp;/&nbsp;<p class="high">${lang.$t('routes.en_details')}</p>`, url: '/proNews/library' }
      },
      //设置
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/setting/setting'),
        meta: { title: `<p class="high">${language == 'en' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : '&nbsp;&nbsp;&nbsp;&nbsp;'}${lang.$t('routes.set')}</p>`, url: '/setting' }
      },
      //个人订单
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/views/order/order'),
        meta: { title: `<p class="high">${lang.$t('routes.my_order')}</p>`, url: '/order' }
      },
      //移动端-个人订单
      {
        path: '/mobile-order',
        name: 'MobileOrder',
        component: () => import('@/views/order/mobile_order'),
        meta: { title: `<p>${language == 'en' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : ''}${lang.$t('routes.my_order')}</p>` }
      },
      //消息中心
      {
        path: '/message',
        name: 'Message',
        component: () => import('@/views/message/message'),
        meta: { title: `<p class="high">${lang.$t('routes.message_cen')}</p>`, url: '/message' }
      },
      //移动端-消息中心
      {
        path: '/mobile-message',
        name: 'MobileMessage',
        component: () => import('@/views/message/message_mobile'),
        meta: { title:  `<p>${lang.$t('routes.message_cen')}</p>` }
      },
      //下单
      {
        path: '/placeOrder',
        name: 'PlaceOrder',
        component: () => import('@/views/place_order/placeOrder'),
        meta: { title: `<p class="high">${lang.$t('routes.pu_infor')}</p>`, url: '/placeOrder' }
      },
      //移动端-下单
      {
        path: '/mobile-place-order',
        name: 'MobilePlaceOrder',
        component: () => import('@/views/place_order/place_order_mobile'),
        meta: { title: `<p>${lang.$t('routes.pu_infor')}</p>` }
      },
      //移动端-支付
      {
        path: '/pay-order-mobile',
        name: 'PayOrderMobile',
        component: () => import('@/views/place_order/pay_order_mobile'),
        meta: { title: `<p>${lang.$t('routes.order_pay')}</p>` }
      },
      //支付订单
      {
        path: '/payOrder',
        name: 'PayOrder',
        component: () => import('@/views/place_order/payOrder'),
        meta: { title: `<p>${lang.$t('routes.my_order')}</p>&nbsp;/&nbsp;<p class="high">${lang.$t('routes.order_pay')}</p>`, url: '/order' }
      },
      //搜索
      {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/search/index'),
        meta: { title: `<p class="high">${lang.$t('routes.adv_search')}</p>`, url: '/search' }
      },
      //搜索前置
      {
        path: '/searchBefore',
        name: 'SearchBefore',
        component: () => import('@/views/mine/search_before'),
      },
      //我的情报局
      {
        path: '/mine-bureau',
        name: 'MineBureau',
        component: () => import('@/views/bureau/mine_bureau'),
        meta: { title: `<p class="high">${lang.$t('routes.mine_intell')}</p>`, url: '/mine-bureau' }
      },
      //情报速递
      {
        path: '/bureau-express',
        name: 'BureauExpress',
        component: () => import('@/views/bureau/bureau_express'),
        meta: { title: `<p class="high">${lang.$t('routes.intell_infor')}</p>`, url: '/bureau-express' }
      },
      //discord专区
      {
        path: '/bureau-discord',
        name: 'BureauDiscord',
        component: () => import('@/views/bureau/bureau_discord'),
        meta: { title: `<p class="high">${lang.$t('routes.dis_area')}</p>`, url: '/bureau-discord' }
      },
      //未来事件
      {
        path: '/bureau-events',
        name: 'BureauEvents',
        component: () => import('@/views/bureau/bureau_events'),
        meta: { title: `<p class="high">${lang.$t('routes.future_ev')}</p>`, url: '/bureau-events' }
      },
      //全网提案
      {
        path: '/bureau-proposal',
        name: 'BureauProposal',
        component: () => import('@/views/bureau/bureau_proposal'),
        meta: { title: `<p class="high">${lang.$t('routes.network_pro')}</p>`, url: '/bureau-proposal' }
      },
      //自选跟踪
      {
        path: '/bureau-track',
        name: 'BureauTrack',
        component: () => import('@/views/bureau/bureau_track'),
        meta: { title: `<p class="high">${lang.$t('routes.track_list')}</p>`, url: '/bureau-track' }
      },
      //自选详情
      {
        path: '/bureau-track/track-details',
        name: 'TrackDetails',
        component: () => import('@/views/bureau/track_details'),
        meta: { title: `<p class="high">${flag ? lang.$t('routes.pro_details') : `${lang.$t('routes.track_list')}&nbsp;/&nbsp;${lang.$t('routes.pro_details')}`}</p>`, url: '/bureau-track' }
      }
    ]
  },
];

export default routes;
