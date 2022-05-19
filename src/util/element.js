import Vue from 'vue';
import { Spinner } from 'mint-ui';
import VueClipBoard from 'vue-clipboard2'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import {
    Table,
    Dialog,
    TableColumn,
    Image,
    Loading,
    Checkbox,
    CheckboxGroup,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Popover,
    DatePicker,
    Tooltip,
    RadioGroup,
    RadioButton,
    Drawer,
    Progress,
    Collapse,
    CollapseItem,
    Switch,
    Backtop
} from 'element-ui';
Vue.use(Table).use(TableColumn).use(Image).use(Loading).use(Checkbox).use(CheckboxGroup)
.use(Dropdown).use(DropdownMenu).use(DropdownItem).use(Popover).use(DatePicker,{locale}).use(Tooltip)
.use(RadioGroup).use(RadioButton).use(Drawer).use(Progress).use(Collapse).use(CollapseItem).use(Dialog)
.use(Switch).use(Backtop);
Vue.use(Loading.directive);
Vue.component(Spinner.name,Spinner);
Vue.use(VueClipBoard);
