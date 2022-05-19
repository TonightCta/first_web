<template>
  <div>
    <div
      class="nav-header"
      @mouseleave="closeLoginBox"
      :class="[
        app.hedaerClass,
        app.navStyle,
        menuStatusNav ? 'mobile-nav-white' : '',
      ]"
    >
      <div class="nav-inner">
        <p
          class="iconfont icon-caidan1 mobile-nav-menu"
          v-if="false"
          @click="
            mobileMenu = true;
            menuStatusNav = false;
          "
        ></p>
        <div class="logo-box">
          <img
            class="nav-logo"
            :src="navLogo"
            @click="$flag ? backTop() : changePage(-1)"
            alt=""
          />
        </div>
        <ul class="menu-list">
          <li
            ref="navItem"
            v-for="(nav, indexV) in navList"
            :key="indexV"
            @click="changePage(indexV)"
          >
            {{ nav }}
            <span class="nav-line"></span>
          </li>
          <li ref="navItemPrice" @click="changePage(5)">
            <!-- 价格 -->
            {{ $t("index_nav.price") }}
            <span class="nav-line"></span>
          </li>
          <li @click="choseCom()" :class="activeItem">
            <span class="nav-line"></span>
            <!-- 透明承诺 -->
            {{ $t("index_nav.tr_com") }}
          </li>
          <li @click="changePage(7)" ref="navItemOther">
            <!-- 联系我们 -->
            {{ $t("index_nav.contact") }}
            <span class="nav-line"></span>
          </li>
        </ul>
        <div class="tools-box">
          <div class="lang-box">
            <!-- TODO -->
            <!-- @click="changeLang" -->
            <el-popover placement="bottom" trigger="hover">
              <ul class="language-box">
                <li @click="changeLang('en')">English</li>
                <li @click="changeLang('zh-CN')">中文</li>
              </ul>
              <p
                type="icon"
                slot="reference"
                class="iconfont change-lang icon-guojihua_international"
              ></p>
            </el-popover>
          </div>
          <div
            class="contact-wallet"
            v-if="!app.account.uid"
            @mouseenter="openLoginBox"
          >
            <div class="contact-text">
              <!-- 进入头等仓 -->
              <p>{{ $t("public.into_first") }}</p>
            </div>
          </div>
          <el-dropdown
            trigger="hover"
            placement="bottom"
            @command="handleCommand"
            @visible-change="menuStatus"
            v-else
          >
            <div class="contact-wallet el-dropdown-link">
              <div class="contact-text">
                <div class="has-link">
                  <div class="address-icon" ref="addressIcon"></div>
                  <p v-if="app.account.wallet_address">
                    {{ app.account.wallet_address.substr(0, 4) }}
                    ...
                    {{ app.account.wallet_address.substr(38, 4) }}
                  </p>
                  <p v-else>
                    {{ app.account.mobile.substr(0, 3) }}
                    ...
                    {{ app.account.mobile.substr(7, 11) }}
                  </p>
                  <span
                    class="iconfont icon-xia_down"
                    :class="iconfontTransClass"
                  ></span>
                </div>
              </div>
              <div class="contact-msg"></div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :icon="'iconfont ' + menu.icon"
                :command="menu.url"
                v-for="(menu, indexM) in menuList2"
                :key="indexM"
              >
                {{ menu.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="auto"></div>
        <div class="tools-box-mobile">
          <!-- TODO -->
          <!-- @click="changeLang" -->
          <el-popover placement="bottom" trigger="hover">
            <ul class="language-box">
              <li @click="changeLang('en')">English</li>
              <li @click="changeLang('zh-CN')">中文</li>
            </ul>
            <p
              type="icon"
              slot="reference"
              class="iconfont change-lang icon-guojihua_international"
            ></p>
          </el-popover>
          <el-dropdown
            trigger="click"
            placement="bottom-start"
            @command="mobileCom"
          >
            <p class="iconfont icon-gengduo_more el-dropdown-link"></p>
            <el-dropdown-menu slot="dropdown" :visible-arrow="false">
              <el-dropdown-item command="drop0">
                <!-- 我们是谁 -->
                {{ $t("index_nav.wo_we") }}
              </el-dropdown-item>
              <el-dropdown-item command="drop1">
                <!-- 我们要做什么 -->
                {{ $t("index_nav.waht_do") }}
              </el-dropdown-item>
              <el-dropdown-item command="drop2">
                <!-- 投资观 -->
                {{ $t("index_nav.in_view") }}
              </el-dropdown-item>
              <el-dropdown-item command="drop6">
                <!-- 价格 -->
                {{ $t("index_nav.price") }}
              </el-dropdown-item>
              <el-dropdown-item command="drop3">
                <!-- 透明承诺 -->
                {{ $t("index_nav.tr_com") }}
              </el-dropdown-item>
              <el-dropdown-item command="drop4">
                <!-- 联系我们 -->
                {{ $t("index_nav.contact") }}
              </el-dropdown-item>
              <el-dropdown-item command="drop5" divided>
                <base-button type="info" round>
                  <!-- 进入头等仓 -->
                  {{ $t("public.into_first") }}
                </base-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 连接盒子 -->
      <div class="login-box" :class="[domOper, transOper]">
        <p class="h4">
          <!-- 登录 -->
          {{ $t("public.login") }}
        </p>
        <p class="h5">
          <!-- 请使用以下方式登录头等仓 -->
          {{ $t("public.login_remark") }}
        </p>
        <div
          class="login-wallet"
          @click="linkWallet()"
          @mouseenter="metaIn = require('@/assets/images/metamaskIn.png')"
          @mouseleave="test"
        >
          <img :src="metaIn" alt="" />
        </div>
        <div class="login-phone" @click="phoneLogin">
          <p>
            <!-- 手机号登录/注册 -->
            {{ $t("public.mobile_login") }}
          </p>
        </div>
        <p class="h5 uninstall-wallet">
          <!-- 还未安装MetaMask？ -->
          {{ app.language == "en" ? "" : $t("public.un_metamask") }}
          <span @click="openDowload()">
            <!-- 前往安装 -->
            {{ $t("public.to_install") }}
          </span>
        </p>
      </div>
      <div
        class="menu-nav"
        :class="menuStatusNav ? 'open-menu-nav' : ''"
        v-if="false"
      >
        <ul>
          <li
            v-for="(menuNav, indexMN) in navMenuList"
            :key="indexMN"
            @click="
              menuStatusNav = false;
              menuNav.url && $router.push(menuNav.url);
            "
          >
            <p class="iconfont" :class="menuNav.icon"></p>
            <p>{{ menuNav.title }}</p>
          </li>
        </ul>
        <p class="menu-line"></p>
        <div class="contact-box">
          <img :src="contactURL" alt="" />
          <p>
            <!-- 长按保存头等仓二维码 -->
            {{ $t("public.click_save_wechat") }}
          </p>
        </div>
      </div>
      <div
        class="close-mask"
        @click="menuStatusNav = false"
        v-if="menuStatusNav"
      ></div>
    </div>
    <!-- 移动端菜单栏 -->
    <div>
      <el-drawer
        :visible.sync="mobileMenu"
        :append-to-body="true"
        size="60%"
        :show-close="false"
        direction="ltr"
      >
        <div class="mobile-draw">
          <img :src="navLogo" alt="" />
          <div class="menu-box-mobile">
            <ul>
              <li
                v-for="(menuMobile, indexMobile) in menuListMobile"
                :key="indexMobile"
                @click="
                  !app.account.uid
                    ? $router.push('/login-mobile')
                    : $router.push(menuMobile.url);
                  mobileMenu = false;
                "
              >
                <p>
                  <span class="iconfont" :class="menuMobile.icon"></span>
                  {{ menuMobile.title }}
                </p>
              </li>
            </ul>
            <div class="oper-box">
              <p
                class="oper-inner"
                v-if="!app.account.uid"
                @click="
                  mobileMenu = false;
                  $router.push('/login-mobile');
                "
              >
                <button>
                  <!-- 进入头等仓 -->
                  {{ $t("public.into_first") }}
                </button>
              </p>
              <div class="oper-inner" v-else>
                <div style="display: flex; align-items: center">
                  <div class="address-icon" ref="addressIconMobile"></div>
                  <p v-if="app.account.wallet_address">
                    {{ app.account.wallet_address.substr(0, 4) }}
                    ...
                    {{ app.account.wallet_address.substr(38, 4) }}
                  </p>
                  <p v-else>
                    {{ app.account.mobile.substr(0, 3) }}
                    ...
                    {{ app.account.mobile.substr(7, 11) }}
                  </p>
                </div>
                <p class="iconfont icon-kaiguan_power" @click="signOut"></p>
              </div>
              <p class="user-id" v-if="app.account.uid">
                <span class="iconfont icon-bianhao_id"></span>
                UID：{{ app.account.uid }}
              </p>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
    <!-- 手机号登录 -->
    <LoginBox ref="loginBox" />
  </div>
</template>

<script>
import { BaseDropdown, Modal, BaseInput } from "@/components";
import { mapState } from "vuex";
import * as api from "@/request/api";
import jazzicon from "@metamask/jazzicon";
import { scrollInner, GetUrlKey } from "@/util/index";
export default {
  name: "NavHeader",
  data() {
    return {
      theme: true, //主题切换
      navLogo: require("@/assets/images/firstLogo.png"),
      isLink: true, //是否连接了钱包
      metaIn: require("@/assets/images/metamask.png"),
      domOper: "",
      transOper: "",
      iconfontTransClass: "", //菜单动作
      activeItem: null,
      mobileMenu: false, //移动端菜单
      menuStatusNav: false,
      contactURL: null, //客服二维码
      contactWechat: null, //客服微信号
    };
  },
  components: {
    BaseDropdown,
    Modal,
    BaseInput,
    TermsPc: (resolve) => require(["@/comsmine/terms_pc"], resolve),
    LoginBox: (resolve) => require(["@/views/login_mobile/login_box"], resolve),
  },
  computed: {
    ...mapState(["app"]),
    menuListMobile() {
      const { meal_id, is_distributor } = this.app.account;
      return is_distributor == 1
        ? [
            {
              title: "渠道商数据中心",
              icon: "icon-zhanbitu_chart-proportion",
              url: is_distributor == 1 && "/channel-business",
            },
            {
              title: "我的头等仓",
              url:
                (meal_id == 3 && "/userCenter") ||
                (meal_id == 4 && "/userCenter") ||
                (meal_id == 0 && "/unVip") ||
                "/otherCenter",
              icon: "icon-shouye_home",
            },
            {
              title: "项目解析",
              icon: "icon-shichangfenxi_market-analysis",
              url: "/project",
            },
            {
              title: "赛道解析",
              icon: "icon-qukuailian_blockchain",
              url: "/race",
            },
            {
              title: "新币速递",
              icon: "icon-licai_financing",
              url: "/coin",
            },
            {
              title: "项目咨询",
              icon: "icon-erji_headset-one",
              url: "/proNews",
            },
            {
              title: "我的订单",
              icon: "icon-biaoqian_tag-one",
              url: "/mobile-order",
            },
            {
              title: "设置",
              icon: "icon-shezhi_setting-two",
              url: "/setting",
            },
          ]
        : [
            {
              title: "我的头等仓",
              url:
                (meal_id == 3 && "/userCenter") ||
                (meal_id == 4 && "/userCenter") ||
                (meal_id == 0 && "/unVip") ||
                "/otherCenter",
              icon: "icon-shouye_home",
            },
            {
              title: "项目解析",
              icon: "icon-shichangfenxi_market-analysis",
              url: "/project",
            },
            {
              title: "赛道解析",
              icon: "icon-qukuailian_blockchain",
              url: "/race",
            },
            {
              title: "新币速递",
              icon: "icon-licai_financing",
              url: "/coin",
            },
            {
              title: "项目咨询",
              icon: "icon-erji_headset-one",
              url: "/proNews",
            },
            {
              title: "我的订单",
              icon: "icon-biaoqian_tag-one",
              url: "/mobile-order",
            },
            {
              title: "设置",
              icon: "icon-shezhi_setting-two",
              url: "/setting",
            },
          ];
    },
    navList() {
      return [
        this.$t("index_nav.wo_we"),
        this.$t("index_nav.waht_do"),
        this.$t("index_nav.in_view"),
      ];
    },
    navMenuList() {
      return [
        {
          title: this.$t("index_nav.wo_we"),
          type: "drop0",
        },
        {
          title: this.$t("index_nav.waht_do"),
          type: "drop1",
        },
        {
          title: this.$t("index_nav.in_view"),
          type: "drop2",
        },
        {
          title: this.$t("index_nav.tr_com"),
          type: "drop3",
        },
        {
          title: this.$t("index_nav.contact"),
          type: "drop4",
        },
        {
          title: this.$t("index_nav.into_first"),
          type: "drop5",
        },
      ];
    },
    menuList2() {
      return [
        {
          title: this.$t("public.pro_title"),
          icon: "icon-shuji-dakai_book-open",
          url: "userCenter",
        },
        {
          title: this.$t("public.bur_title"),
          icon: "icon-leida_radar",
          url: "bureauCenter",
        },
        {
          title: this.$t("public.login_out"),
          icon: "icon-kaiguan_power",
          url: "loginOut",
        },
      ];
    },
  },
  watch: {
    menuStatusNav(val) {
      this.navLogo = val
        ? require("@/assets/images/firstlogo_red.png")
        : require("@/assets/images/firstLogo.png");
    },
    //主题切换监听
    // theme(val) {
    //   let mo = document.body.classList;
    //   if (val) {
    //     this.navLogo = require("@/assets/images/firstLogo.png");
    //     mo.add("white-content");
    //   } else {
    //     this.navLogo = require("@/assets/images/fooLogo.png");
    //     mo.remove("white-content");
    //   }
    // },
  },
  created() {
    this.app.account.uid != undefined
      ? (this.isLink = false)
      : (this.isLink = true);
    this.getContact();
    this.$route.name == "Committed" && (this.activeItem = "active-item");
  },
  mounted() {
    this.$refs.navItem.push(this.$refs.navItemOther);
    this.$refs.navItem.push(this.$refs.navItemPrice);
    this.$store.commit("upNavDom", this.$refs.navItem);
  },
  methods: {
    //连接钱包
    async linkWallet() {
      await this.$store.dispatch("loginIn");
    },
    //个人中心
    goCenter() {
      this.$router.push("/mine");
    },
    //选中透明承诺
    choseCom() {
      this.$store.commit("upHeader", "");
      this.$refs.navItem.forEach((e) => {
        e.className = "";
      });
      this.$refs.navItemOther.className = "";
      this.$refs.navItemPrice.className = "";
      this.$router.push("/committed");
    },
    //进入无头部页面
    changePage(index) {
      this.$store.commit("upHeader", index != -1 ? "hasGround" : "");
      if (this.$route.path !== "/index") {
        this.$router.push("/index");
        this.activeItem = null;
        setTimeout(() => {
          this.$store.commit("upHeader", index != -1 ? "hasGround" : "");
          window.changeSw(index);
        }, 200);
      } else {
        window.changeSw(index);
      }
    },
    //移动端菜单事件
    mobileCom(_command) {
      const scroll = (_class) => {
        let container = document.querySelector(_class).offsetTop - 30;
        window.scrollTo({
          top: container,
          behavior: "smooth",
        });
      };
      const { name } = this.$route;
      const { meal_id } = this.app;
      const _bol = Boolean(name == "Committed");
      _command == "drop0" &&
        (_bol
          ? (this.$router.push("/"),
            setTimeout(() => {
              scroll(".who-we");
            }, 300))
          : scroll(".who-we"));
      _command == "drop1" &&
        (_bol
          ? (this.$router.push("/"),
            setTimeout(() => {
              scroll(".we-do");
            }, 300))
          : scroll(".we-do"));
      _command == "drop2" &&
        (_bol
          ? (this.$router.push("/"),
            setTimeout(() => {
              scroll(".inve");
            }, 300))
          : scroll(".inve"));
      _command == "drop6" &&
        (_bol
          ? (this.$router.push("/"),
            setTimeout(() => {
              scroll(".meal-page");
            }, 300))
          : scroll(".meal-page"));
      _command == "drop3" && (this.$router.push("/committed"), this.choseCom());
      _command == "drop4" &&
        (_bol
          ? (this.$router.push("/"),
            setTimeout(() => {
              scroll(".contact-us");
            }, 300))
          : scroll(".contact-us"));
      _command == "drop5" &&
        (this.$router.push(
          this.app.account.uid
            ? (meal_id == 3 && "/userCenter") ||
                (meal_id == 4 && "/userCenter") ||
                (meal_id == 1 &&
                  this.app.account.one_day_try_status.status &&
                  this.app.account.one_day_try_status.status == 1 &&
                  "/userCenter") ||
                (meal_id == 0 && "/unVip") ||
                "/otherCenter"
            : GetUrlKey("cooperateCode", window.location.href)
            ? "/login-mobile?coopcode=" +
              GetUrlKey("cooperateCode", window.location.href)
            : "/login-mobile"
        ),
        this.$store.commit("uIsBureau", 0));
    },
    //切换语言
    changeLang(_lang) {
      let lang;
      if (_lang) {
        lang = _lang;
      } else {
        lang = this.app.language == "en" ? "zh-CN" : "en";
      }
      this.$store.commit("setLanguage", lang);
      this.$i18n.locale = lang;
      window.location.reload();
    },
    test() {
      this.metaIn = require("@/assets/images/metamask.png");
    },
    //浏览器应用商店跳转
    openDowload() {
      let u = navigator.userAgent;
      let browser = {
        webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      };
      if (browser.webKit) {
        window.open(
          "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
        );
      } else if (browser.gecko) {
        window.open(
          "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
        );
      } else {
        this.$notify({
          type: "danger",
          message: "当前浏览器暂不支持使用MetaMask",
        });
      }
    },
    //客服微信获取
    async getContact() {
      const result = await api.contactQR();
      this.contactURL = result.image;
      this.contactWechat = result.nickname;
    },
    //开启登录窗口
    openLoginBox() {
      this.domOper = "boxShow";
      setTimeout(() => {
        this.transOper = "startTrans";
      }, 10);
    },
    // 关闭登录窗口
    closeLoginBox() {
      this.transOper = "";
      setTimeout(() => {
        this.domOper = "";
      }, 300);
    },
    //手机号登录
    phoneLogin() {
      localStorage.setItem("openSearchBox", true);
      this.$refs.loginBox.phoneLoginBox = true;
      this.closeLoginBox();
    },
    backTop() {
      scrollInner();
    },
    //下拉菜单行为
    handleCommand(command) {
      const { meal_id, is_information } = this.app.account;
      command == "userCenter" &&
        ((this.$router.push(
          (meal_id == 3 && "/userCenter") ||
            (meal_id == 4 && "/userCenter") ||
            (meal_id == 1 &&
              this.app.account.one_day_try_status.status &&
              this.app.account.one_day_try_status.status == 1 &&
              "/userCenter") ||
            (meal_id == 0 && "/unVip") ||
            "/otherCenter"
        ),
        this.$store.dispatch('setProjectPoint',1),
        this.$store.commit("uIsBureau", 0)),
        this.$store.commit("upAliveName", "open-alive"));
      command == "project" && this.$router.push("/project");
      command == "race" && this.$router.push("/race");
      command == "coin" && this.$router.push("/coin");
      command == "proNews" && this.$router.push("/proNews");
      command == "order" && this.$router.push("/order");
      command == "setting" && this.$router.push("/setting");
      command == "loginOut" && window.loginOut();
      command == "bureauCenter" &&
        (this.app.language == "en" &&
          this.$store.commit("setLanguage", "zh-CN"),
        (this.$i18n.locale = this.app.language),
        this.$router.push(
          ((is_information == 1 || is_information == 2) && "/mine-bureau") ||
            "/unVip"
        ),
        this.$store.dispatch('setProjectPoint',2),
        setTimeout(() => {
          window.location.reload();
        }),
        this.$store.commit("uIsBureau", 1),
        this.$store.commit("upAliveName", "open-alive"));
      //TODO
      // const GO = () => {
      //   this.$router.push(
      //     (is_information == 1 && "/mine-bureau") || "/unVip"
      //   );
      //   this.$store.commit("uIsBureau", 1);
      //   this.$store.commit("upAliveName", "open-alive");
      // };
      // command == "bureauCenter" && (is_information == 1 ? GO() : this.$notify({ type: "danger", message: "暂未开放" }));
    },
    //下拉菜单状态
    menuStatus(_bool) {
      if (_bool) {
        this.iconfontTransClass = "iconfontTrans";
      } else {
        this.iconfontTransClass = "";
      }
    },
    //退出登录
    signOut() {
      window.loginOut();
    },
  },
  beforeDestroy() {
    window.removeEventListener("click", () => {}, true);
  },
  updated() {
    if (this.app.account.uid) {
      // 钱包地址图标
      const el = jazzicon(
        16,
        parseInt(this.app.account.wallet_address.slice(2, 10), 16)
      );
      if (this.$refs.addressIcon && !this.$refs.addressIcon.children[0]) {
        this.$refs.addressIcon.appendChild(el);
      }
      if (
        this.$refs.addressIconMobile &&
        !this.$refs.addressIconMobile.children[0]
      ) {
        this.$refs.addressIconMobile.appendChild(el);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.language-box {
  li {
    color: $titleColor;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 14px;
    border-bottom: 1px solid $remarkColor;
    cursor: pointer;
    text-align: center;
  }
  li:last-child {
    padding-bottom: 0;
    padding-top: 8px;
    border-bottom: 0;
  }
}
.el-dropdown-menu {
  margin-left: 30px !important;
}
/deep/ .el-checkbox__label {
  font-size: 12px;
  color: $titleColor !important;
}
/deep/ .el-checkbox__inner {
  width: $fon14;
  height: $fon14;
  transform: translateY(-1px);
}
/deep/ .el-checkbox__inner::after {
  left: 4px;
  top: 1px;
}
.open-menu-nav {
  transform: translateY(0) !important;
}
.mobile-nav-white {
  z-index: 5000 !important;
  .nav-inner {
    background: white;
  }
  p {
    color: $titleColor !important;
  }
}
/deep/ .el-dropdown-menu__item--divided {
  width: 100%;
  margin: 0 auto;
  padding: 0;
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  p {
    color: $titleColor;
  }
}
/deep/ .el-dropdown-menu__item {
  color: $titleColor !important;
}
/deep/ .popper__arrow {
  // display: none;
}
/deep/ .el-drawer__header {
  display: none;
}
@media screen and (max-width: 1279px) {
  /deep/ .el-dropdown-menu__item {
    justify-content: center;
  }
}
.hidden-nav {
  transform: translateY(0) !important;
}
.boxShow {
  display: block !important;
}
.startTrans {
  opacity: 1 !important;
}
.active-item {
  color: $iconColor;
  .nav-line {
    left: 0 !important;
  }
}
.hasGround {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: saturate(180%) blur(6px);
  transform: translateY(0) !important;
}
.nav-header {
  width: 100%;
  height: 80px;
  transition: 0.3s all;
  position: relative;
  transform: translateY(60px);
  z-index: 1000;
  .nav-inner {
    padding: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 200;
    transition: 0.3s all;
  }
  .logo-box {
    min-width: 333px;
    padding-left: 80px;
    .nav-logo {
      width: 140px;
      height: 36px;
      cursor: pointer;
    }
  }
  .menu-list {
    flex: 1;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    padding-right: 24px;
    li {
      font-size: 16px;
      cursor: pointer;
      transition: 0.3s all;
      position: relative;
      overflow: hidden;
      padding-bottom: 6px;
      margin-bottom: -6px;
      margin-right: 40px;
      .nav-line {
        position: absolute;
        display: inline-block;
        width: 100%;
        background: $iconColor;
        height: 2px;
        bottom: 0;
        transition: 0.3s all;
        left: -100%;
      }
    }
    li:last-child {
      margin-right: 0;
    }
  }
  .tools-box {
    padding-right: 34px;
    min-width: 333px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .lang-box {
      display: flex;
      align-items: center;
      height: 24px;
      cursor: pointer;
      .iconfont {
        font-size: 24px;
        color: $textColor;
        border-radius: 50%;
        transform: translateY(-1px);
        margin-right: 8px;
      }
    }
    .contact-wallet {
      padding: 0 20px;
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 14px;
      cursor: pointer;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.12);
      margin-left: 40px;
      .has-link {
        display: flex;
        box-sizing: border-box;
        padding-top: 2px;
        align-items: center;
        justify-content: space-between;
        .address-icon {
          margin-right: 12px;
        }
      }
      .iconfont {
        color: $textColor;
        margin-left: 12px;
        font-size: 18px;
        transition: 0.3s all;
        display: inline-block;
      }
      .iconfontTrans {
        transform: rotate(180deg);
      }
    }
  }
  .login-box {
    position: absolute;
    width: 290px;
    height: 327px;
    background: white;
    right: 45px;
    top: 70px;
    z-index: 100;
    border-radius: 4px;
    transition: 0.3s all;
    text-align: center;
    padding-top: 48px;
    opacity: 0;
    display: none;
    transition: 0.3s all;
    .h4 {
      margin-bottom: 8px;
      font-weight: bold;
      color: #222a42;
    }
    .h5 {
      margin-bottom: 40px;
      color: $remarkColor;
    }
    .login-wallet {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180px;
      height: 48px;
      margin: 0 auto;
      border: 1px solid $textColor;
      border-radius: 24px;
      cursor: pointer;
      transition: 0.3s all;
      img {
        width: 124px;
        height: 24px;
      }
    }
    .login-wallet:hover,
    .login-phone:hover {
      background: $textColor;
      p {
        color: #222a42;
      }
    }
    .login-phone {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180px;
      height: 48px;
      margin: 0 auto;
      border: 1px solid $textColor;
      border-radius: 24px;
      cursor: pointer;
      transition: 0.3s all;
      margin-top: 16px;
      p {
        color: $remarkColor;
        font-size: 13px;
      }
    }
    .uninstall-wallet {
      margin-top: 40px;
      margin-bottom: 0;
      span {
        color: #0f62fe;
        cursor: pointer;
      }
    }
  }
}
.menu-nav {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 0.6rem 1rem $padd40;
  background: white;
  transition: 0.3s all;
  transform: translateY(-120%);
  z-index: 100;
  ul {
    padding: 0 0.3rem;
    li {
      display: flex;
      height: $padd40;
      align-items: center;
      justify-content: center;
      .iconfont {
        font-size: 1rem;
        color: #606266;
        margin-right: 1rem;
      }
      p {
        font-size: $fon14;
        color: $titleColor;
      }
    }
  }
  .menu-line {
    width: 100%;
    height: 1px;
    background: #efefef;
    margin: 1rem 0;
  }
  .contact-box {
    text-align: center;
    img {
      width: 7.5rem;
      height: 7.5rem;
    }
    p {
      font-size: $fon14;
      color: $titleColor;
      margin-top: 0.5rem;
    }
  }
}
.close-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 10;
  top: 0;
  left: 0;
}
@media screen and (min-width: 1280px) {
  .mobile-nav-menu {
    display: none !important;
  }
  .tools-box-mobile {
    display: none !important;
  }
}
@media screen and (max-width: 1279px) {
  .nav-header {
    transform: translateY(0);
    position: fixed;
    top: 0;
    left: 0;
    // padding-top: 1.25rem;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: saturate(180%) blur(6px);
    .logo-box {
      padding-left: 0.3rem;
      min-width: 0;
      img {
        width: 7.5rem !important;
        height: 2.125rem !important;
      }
    }
    .mobile-nav-menu {
      font-size: $padd24;
      margin-right: 1.5rem;
    }
    .menu-list {
      display: none;
    }
    .tools-box {
      display: none;
    }
    .phone-login-box {
      display: none;
    }
    .tools-box-mobile {
      display: flex;
      // margin-right: $padd24;
      .iconfont {
        font-size: $padd24;
        margin-left: 1rem;
      }
      .icon-guojihua_international {
        margin-left: 0;
      }
    }
  }
}
.mobile-draw {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #25b89b 0%, #0096ad 100%);
  padding: 2rem $padd24 $padd40 $padd24;
  display: flex;
  flex-direction: column;
  img {
    width: 7.5rem;
  }
  .menu-box-mobile {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-top: 2rem;
    ul {
      li {
        height: $padd40;
        font-size: $fon14;
        margin-bottom: 0.625rem;
        p {
          display: flex;
          align-items: center;
          color: white;
          .iconfont {
            font-size: $padd24;
            margin-right: 1rem;
          }
        }
      }
    }
    .oper-inner {
      width: 100%;
      height: $padd40;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 1.25rem;
      font-size: $fon14;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.75rem;
      .address-icon {
        margin-right: 0.5rem;
      }
      .iconfont {
        font-size: 1.125rem;
      }
    }
    .user-id {
      margin-top: $padd24;
      text-align: center;
      width: 100%;
      opacity: 0.8;
      .iconfont {
        font-size: $fon14;
      }
      font-size: 0.8rem;
      color: white;
    }
    p {
      button {
        width: 100%;
        height: $padd40;
        border: none;
        outline: none;
        background: rgba(0, 0, 0, 0);
        border-radius: 1.25rem;
        font-size: $fon14;
        color: white;
      }
    }
  }
}
</style>
