import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '../store';
import enLocale from './en';
import zhLocale from './zh-CN';
Vue.use(VueI18n);

let langType;
if(store.state.app.language == null || store.state.app.language == ''){
  langType = 'zh-CN'
}else{
  langType = store.state.app.language;
}

const messages = {
  'zh-CN': zhLocale,
  en: enLocale,
};
const i18n = new VueI18n({
  locale:langType, // set locale
  messages // locale messages
});

export default i18n;
