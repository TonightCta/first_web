import Vue from 'vue';
import { Toast,Dialog, Notify, DropdownMenu, DropdownItem, CellGroup, Field, NumberKeyboard, CountDown,Popup,DatetimePicker,PullRefresh } from 'vant';
import 'vant/lib/pull-refresh/style'
import 'vant/lib/dropdown-menu/style'
import 'vant/lib/dropdown-item/style'
import 'vant/lib/notify/style'
import 'vant/lib/dialog/style'
import 'vant/lib/field/style'
import 'vant/lib/number-keyboard/style'
import 'vant/lib/cell-group/style'
import 'vant/lib/count-down/style'
import 'vant/lib/popup/style'
import 'vant/lib/datetime-picker/style'
import 'vant/lib/toast/style'

Vue.prototype.$mobileNotify = Notify;
Vue.prototype.$mobileToast = Toast;
Vue.use(Dialog).use(DropdownMenu).use(DropdownItem).use(CellGroup).use(Field).use(NumberKeyboard).use(CountDown).use(Popup).use(DatetimePicker).use(PullRefresh).use(Toast);