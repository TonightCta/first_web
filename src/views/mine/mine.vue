<template>
  <div class="mine">
    <!-- 工具栏 -->
    <div
      class="tools-box"
      v-if="$route.name !== 'BureauAdmin'"
      :class="menuStatusNav ? 'mobile-nav-white' : ''"
    >
      <div
        class="nav-inner"
        :class="$flag && app.isBureau == 1 && 'bureau-nav-bg'"
      >
        <div class="tools-left-mobile">
          <p
            class="iconfont icon-caidan1"
            @click="
              $refs.menudrawer.mobileMenuInner = true;
              menuStatusNav = false;
            "
          ></p>
        </div>
        <div class="tools-left">
          <p
            class="iconfont icon-shouqicaidan1_menu-fold-one"
            v-if="!isOpen && showOpenIcon"
            @click="
              openMenu();
              $refs.sideBar.toolMenu();
              isOpen = !isOpen;
            "
          ></p>
          <p
            class="iconfont icon-zhankaicaidan1_menu-unfold-one"
            v-if="isOpen && showOpenIcon"
            @click="
              openMenu();
              $refs.sideBar.closeToolMenu();
              isOpen = !isOpen;
            "
          ></p>
          <div
            class="tools-title"
            @click="backRoute"
            v-html="$route.meta.title"
          ></div>
        </div>
        <!-- 移动端切换项目 -->
        <div
          class="mobile-router-title"
          :class="app.language == 'en' && 'mobile-router-title-en'"
          v-if="
            $route.name == 'UnVip' ||
            $route.name == 'UserCenter' ||
            $route.name == 'OtherCenter' ||
            $route.name == 'MineBureau'
          "
        >
          <p
            @click="switchPro('goLibrary')"
            :class="app.isBureau == 0 && 'select-pro'"
          >
            <!-- 研报库 -->
            {{ $t("public.project_name") }}
          </p>
          <p
            @click="switchPro('goBureau')"
            :class="app.isBureau == 1 && 'select-pro'"
          >
            <!-- 情报局 -->
            {{ $t("public.bureau_name") }}
          </p>
        </div>
        <!-- 移动端页面标题 -->
        <div
          class="tools-title mobile-router-title-two"
          :class="app.language == 'en' && 'mobile-router-title-two-en'"
          v-html="$route.meta.title"
          v-else
        ></div>

        <div class="tools-right-mobile">
          <p
            class="iconfont icon-sousuo_search"
            v-if="app.isBureau == 0"
            @click="
              app.account.meal_id == 3 || app.account.meal_id == 4
                ? ($refs.searchall.searchBox = true)
                : ($refs.noservice.notSearch = true)
            "
          ></p>
          <el-dropdown trigger="click" @command="mobileEventType">
            <p class="iconfont icon-gengduo_more el-dropdown-link"></p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="iconfont icon-guojihua_international"
                command="change_language"
              >
                <!-- command="change_language" -->
                <!-- TODO -->
                <!-- 语言 -->
                <!-- {{ $t("public.language") }}中文 -->
                <!-- TODO -->
                {{ app.language == "en" ? "中文" : "English" }}
              </el-dropdown-item>
              <el-dropdown-item
                icon="iconfont icon-tixing_remind"
                command="message"
              >
                <!-- 消息中心 -->
                {{ $t("routes.message_cen") }}
              </el-dropdown-item>
              <el-dropdown-item
                icon="iconfont icon-biaoqian_tag-one"
                command="order"
              >
                <!-- 我的订单 -->
                {{ $t("routes.my_order") }}
              </el-dropdown-item>
              <el-dropdown-item
                icon="iconfont icon-shezhi_setting-two"
                command="setting"
              >
                <!-- 设置 -->
                {{ $t("routes.set") }}
              </el-dropdown-item>
              <el-dropdown-item divided v-if="app.language == 'zh-CN'">
                <p style="padding: 0 1rem">
                  <!-- 联系销售顾问 -->
                  {{ $t("setting.contact_website") }}
                </p>
                <base-button
                  type="info"
                  v-if="app.language == 'zh-CN'"
                  v-clipboard:copy="contactWechat"
                  round
                  :class="app.isBureau == 1 && 'other-info'"
                  v-clipboard:success="firstCopySuccess"
                  v-clipboard:error="firstCopyError"
                >
                  <!-- 复制微信号 -->
                  {{ $t("public.copy_wechat") }}
                </base-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="tools-right">
          <p
            style="margin-right: 40px"
            @click="switchPro(app.isBureau == 1 ? 'goLibrary' : 'goBureau')"
          >
            <base-button
              type="info"
              :class="app.isBureau == 1 ? 'other-info' : 'other-info-li'"
              round
            >
              <i
                class="iconfont"
                :class="
                  app.isBureau == 1
                    ? ' icon-shuji-dakai_book-open'
                    : ' icon-leida_radar'
                "
                :style="{ 'margin-right': '8px' }"
              ></i>
              {{
                app.isBureau == 1
                  ? $t("public.into_project")
                  : $t("public.into_bureau")
              }}
            </base-button>
          </p>
          <p
            class="iconfont icon-tixing_remind"
            @click="goMessage"
            v-if="app.isBureau == 0"
          >
            <span class="round" v-if="app.messageStatus"></span>
          </p>
          <el-popover
            placement="top"
            trigger="hover"
            :content="$t('routes.adv_search')"
            :disabled="app.language == 'en'"
          >
            <!-- 全局搜索 -->
            <p
              slot="reference"
              class="iconfont icon-sousuo_search"
              v-if="app.isBureau == 0"
              @click="
                app.account.meal_id == 3 || app.account.meal_id == 4
                  ? ($refs.searchall.searchBox = true)
                  : ($refs.noservice.notSearch = true)
              "
            ></p>
          </el-popover>
          <!-- 联系邮箱 -->
          <a
            href="mailto:marketing@first.vip"
            target="_blank"
            v-if="app.language == 'en'"
          >
            <p class="iconfont icon-youjian"></p>
          </a>
          <!-- 联系客服 -->
          <el-popover
            placement="bottom"
            width="180"
            trigger="hover"
            v-model="isOpenQR"
            v-if="app.language == 'zh-CN'"
          >
            <div>
              <img
                :src="contactURL"
                style="width: 160px; height: 160px"
                alt=""
              />
            </div>
            <span
              class="iconfont icon-fukuanma_pay-code-one"
              slot="reference"
            ></span>
          </el-popover>
          <div class="uid-box">
            <p class="uid-line"></p>
            <p>
              <span class="iconfont icon-bianhao_id"></span>
              UID：<span class="uid-high">{{ app.account.uid }}</span>
            </p>
          </div>
          <el-dropdown
            placement="bottom"
            @command="handleCommand"
            @visible-change="menuChange"
          >
            <div class="token-msg el-dropdown-link">
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
                :class="iconStatusClass"
              ></span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="iconfont icon-guojihua_international"
                command="change_language"
              >
                <!-- command="change_language" -->
                <!-- //TODO -->
                <!-- 语言 -->
                <!-- {{ $t("public.language") }}中文 -->
                <!-- //TODO -->
                {{ app.language == "en" ? "中文" : "English" }}
              </el-dropdown-item>
              <el-dropdown-item
                icon="iconfont icon-biaoqian_tag-one"
                command="order"
              >
                <!-- 我的订单 -->
                {{ $t("routes.my_order") }}
              </el-dropdown-item>
              <el-dropdown-item
                icon="iconfont icon-shezhi_setting-two"
                command="setting"
              >
                <!-- 设置 -->
                {{ $t("routes.set") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 移动端菜单 -->
      <div class="menu-nav" :class="menuStatusNav ? 'open-menu-nav' : ''">
        <ul>
          <li
            v-for="(menuNav, indexMN) in menuNavList"
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
    <!-- 主体 -->
    <div class="mine-center">
      <!-- 菜单栏 -->
      <!-- :class="[menuStatus,JSOper]"  @mouseenter="openMenu" @mouseleave="closeMenu"-->
      <!-- @mouseenter="!isOpen && openMenu()"
        @mouseleave="!isOpen && closeMenu()" -->
      <div class="mine-menu" :class="[menuStatus, JSOper]">
        <side-bar
          :title="$t('setting.first')"
          :autoClose="false"
          background-color="info"
          :class="app.isBureau == 0 ? 'project-sidebar' : 'bureau-sidebar'"
          :logo="require('@/assets/images/logo.png')"
          ref="sideBar"
        >
          <!-- 头等仓 -->
          <template slot="links">
            <sidebar-item
              v-for="(menu, indexM) in menuList"
              :key="indexM"
              :link="{
                name: menu.title,
                icon: `iconfont ${menu.icon}`,
                path: menu.url,
              }"
            >
            </sidebar-item>
          </template>
        </side-bar>
      </div>
      <!-- 内容盒子 -->
      <div
        class="mine-view"
        :class="[$route.name == 'BureauAdmin' && 'bureau-admin-view']"
      >
        <!-- 视图 -->
        <div
          class="view-box"
          :class="[$flag && app.isBureau == 1 && 'bureau-view']"
        >
          <Loading v-if="!$flag" />
          <div :class="app.aliveName">
            <router-view></router-view>
          </div>
          <!-- <transition :name="app.aliveName">
          </transition> -->
        </div>
      </div>
    </div>
    <!-- 搜索 -->
    <SearchAll ref="searchall" />
    <!-- 无搜索权限 -->
    <NoService ref="noservice" />
    <!-- 移动端菜单 -->
    <MenuDrawer ref="menudrawer" />
    <!-- 公告 -->
    <Annoucement ref="annoucement" />
    <!-- NFT盲盒 -->
    <BlindBox />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { SidebarPlugin, Modal } from "@/components";
import jazzicon from "@metamask/jazzicon";
import { clearNotify } from "@/components/NotificationPlugin";
import { newMessage, contactQR, readMessageNow } from "@/request/api";
import GoEasy from "goeasy";
export default {
  name: "Mine",
  data() {
    return {
      navLogo: require("@/assets/images/firstLogo.png"),
      menuStatus: "", //默认菜单移入
      JSOper: "", //鼠标滑过展开菜单
      menuIsOpen: "", //鼠标滑过收起内容区
      toolsIsOpen: "",
      isOpen: true,
      tagIndex: 0, //当前选中菜单
      searchBox: false, //全局搜索
      iconStatusClass: "",
      isOpenQR: false, //客服微信窗口
      contactURL: null, //客服微信地址
      contactWechat: null, //客服微信号
      JustBtn: null,
      mobileMenuInner: false, //移动端菜单
      menuStatusNav: false,
      // menuNavList: ,
      screenWidth: document.body.clientWidth,
      showOpenIcon: true,
    };
  },
  components: {
    Loading: (resolve) => require(["@/comsmine/loading"], resolve),
    SidebarPlugin,
    Modal,
    MenuDrawer: (resolve) => require(["./coms/menu_drawer"], resolve),
    NoService: (resolve) => require(["./coms/no_service"], resolve),
    SearchAll: (resolve) => require(["./coms/search_all"], resolve),
    Annoucement: (resolve) => require(["@/comsmine/annoucement"], resolve),
    BlindBox: (resolve) => require(["@/comsmine/nft_blind_box"], resolve),
  },
  updated() {
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
  },
  mounted() {
    setTimeout(() => {
      this.menuStatus = "open";
    }, 100);
    this.$store.commit("upIsOpenMenu", 1);
    this.openMenu();
    this.$nextTick(() => {
      this.app.account.meal_id != 3 &&
        this.app.account.meal_id != 4 &&
        this.app.account.is_information == 0 &&
        this.$route.path != "/setting" &&
        !this.$flag &&
        (this.isOpenQR = true);
    });
    if (this.$flag) {
      if (
        this.app.account.uid &&
        this.app.isBureau == 0 &&
        !window.localStorage.getItem("easyStatus")
      ) {
        let goeasy = GoEasy.getInstance({
          host: "hangzhou.goeasy.io",
          appkey: "BC-2a7907b7a2a84350aca0f9669c114272",
        });
        goeasy.connect({
          onSuccess: () => {
            // console.log("连接成功");
            window.localStorage.setItem("easyStatus", 1);
          },
        });
        setTimeout(() => {
          goeasy.subscribe({
            channel: this.app.account.channel,
            onMessage: async (message) => {
              let obj = JSON.parse(message.content);
              await readMessageNow({ id: obj.id });
              switch (obj.type) {
                case 1:
                  this.$notify({
                    icon: "iconfont icon-zhuyi_attention",
                    message:
                      this.app.language == "en" ? obj.content_en : obj.content,
                    timeout: 6000,
                  });
                  break;
                case 2:
                  this.$notify({
                    icon: "iconfont icon-zhuyi_attention",
                    message:
                      this.app.language == "en" ? obj.content_en : obj.content,
                    timeout: 6000,
                    verticalAlign: "top",
                    horizontalAlign: "right",
                  });
                  break;
                case 3:
                  this.$notify({
                    icon: "iconfont icon-xiaoyan_check-one",
                    type: "success",
                    message:
                      this.app.language == "en" ? obj.content_en : obj.content,
                    timeout: 6000,
                  });
                  break;
                case 4 || 5:
                  this.$notify({
                    icon: "iconfont icon-zhuyi_attention",
                    type: "danger",
                    message:
                      this.app.language == "en" ? obj.content_en : obj.content,
                    timeout: 6000,
                  });
                  break;
                case 6:
                  this.$refs.annoucement.newAnn(obj);
                  break;
                default:
              }
              this.$store.commit("upMessageStatus", true);
            },
            onSuccess: () => {
              // console.log("成功");
            },
            onFailed: (failed) => {
              // console.log(failed);
              // console.log("失败");
            },
          });
        }, 500);
      }
    } else {
      if (this.app.account.uid && this.app.isBureau == 0) {
        let goeasy = GoEasy.getInstance({
          host: "hangzhou.goeasy.io",
          appkey: "BC-2a7907b7a2a84350aca0f9669c114272",
        });
        goeasy.connect({
          onSuccess: () => {
            // console.log("连接成功");
            // window.localStorage.setItem('easyStatus',1);
          },
        });
        setTimeout(() => {
          goeasy.subscribe({
            channel: this.app.account.channel,
            onMessage: async (message) => {
              let obj = JSON.parse(message.content);
              await readMessageNow({ id: obj.id });
              switch (obj.type) {
                case 1:
                  this.$notify({
                    icon: "iconfont icon-zhuyi_attention",
                    message:
                      this.app.language == "en" ? obj.content_en : obj.content,
                    timeout: 6000,
                  });
                  break;
                case 2:
                  this.$notify({
                    icon: "iconfont icon-zhuyi_attention",
                    message:
                      this.app.language == "en" ? obj.content_en : obj.content,
                    timeout: 6000,
                    verticalAlign: "top",
                    horizontalAlign: "right",
                  });
                  break;
                case 3:
                  this.$notify({
                    icon: "iconfont icon-xiaoyan_check-one",
                    type: "success",
                    message:
                      this.app.language == "en" ? obj.content_en : obj.content,
                    timeout: 6000,
                  });
                  break;
                case 4 || 5:
                  this.$notify({
                    icon: "iconfont icon-zhuyi_attention",
                    type: "danger",
                    message:
                      this.app.language == "en" ? obj.content_en : obj.content,
                    timeout: 6000,
                  });
                  break;
                case 6:
                  this.$refs.annoucement.newAnn(obj);
                  break;
                default:
              }
              this.$store.commit("upMessageStatus", true);
            },
            onSuccess: () => {
              // console.log("成功");
            },
            onFailed: (failed) => {
              // console.log(failed);
              // console.log("失败");
            },
          });
        }, 500);
      }
    }

    window.onresize = () => {
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;
    };
    if (this.screenWidth <= 1400) {
      this.isOpen && this.openMenu();
      this.$refs.sideBar.closeToolMenu();
      this.isOpen = false;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.menuStatus = "";
    // console.log(this.$sidebar.isMinimized);
    if (this.$sidebar.isMinimized) {
      this.$sidebar.toggleMinimize();
    }
    this.JSOper = "";
    this.isOpen = false;
    setTimeout(() => {
      next();
    }, 100);
  },
  computed: {
    ...mapState(["app"]),
    menuList() {
      const { meal_id, is_distributor, is_information } = this.app.account;
      let status;
      this.app.account.one_day_try_status &&
        (status = this.app.account.one_day_try_status.status);
      return this.app.isBureau == "1"
        ? [
            {
              // 我的情报局
              title:
                this.app.language == "en"
                  ? "Home"
                  : this.$t("routes.mine_intell"),
              icon: "icon-shouye_home",
              url: is_information == 0 ? "/unVip" : "/mine-bureau",
            },
            {
              // 情报速递
              title:
                this.app.language == "en"
                  ? "News"
                  : this.$t("routes.intell_infor"),
              icon: "icon-leida_radar",
              url: "/bureau-express",
            },
            // {
            //Discord专区
            //   title: this.$t('routes.dis_area'),
            //   icon: "icon-qingbaoju_discord",
            //   url: "/bureau-discord",
            // },
            {
              //未来事件
              title: this.$t("routes.future_ev"),
              icon: "icon-jihua_plan",
              url: "/bureau-events",
            },
            {
              //全网提案
              title:
                this.app.language == "en"
                  ? "Proposals"
                  : this.$t("routes.network_pro"),
              icon: "icon-pinglun_comments",
              url: "/bureau-proposal",
            },
            {
              //自选跟踪
              title:
                this.app.language == "en"
                  ? "Watchlist"
                  : this.$t("routes.track_list"),
              icon: "icon-dingyue_rss",
              url: "/bureau-track",
            },
            {
              //重点情报
              title:
                this.app.account.is_focus_page ? this.app.language == "en"
                  ? "Important"
                  : this.$t("bureau_express.important") : '',
              icon: this.app.account.is_focus_page ? "icon-xingxing_star" : '',
              url: this.app.account.is_focus_page ? "/bureau-important" : '',
            },
          ]
        : is_distributor == 1
        ? [
            {
              //渠道商数据中心
              title: this.$t("routes.business"),
              icon: "icon-zhanbitu_chart-proportion",
              url: is_distributor == 1 && "/channel-business",
            },
            {
              //我的研报库
              title:
                this.app.language == "en"
                  ? "Home"
                  : this.$t("routes.mine_project"),
              icon: "icon-shouye_home",
              url:
                (meal_id == 3 && "/userCenter") ||
                (meal_id == 4 && "/userCenter") ||
                (meal_id == 1 && status == 1 && "/userCenter") ||
                (meal_id == 0 && "/unVip") ||
                "/otherCenter",
            },
            {
              //项目解析
              title:
                this.app.language == "en"
                  ? "Project Analysis"
                  : this.$t("routes.project_an"),
              icon: "icon-shichangfenxi_market-analysis",
              url: "/project",
            },
            {
              //赛道解析
              title:
                this.app.language == "en"
                  ? "Sector Analysis"
                  : this.$t("routes.sector_an"),
              icon: "icon-qukuailian_blockchain",
              url: "/race",
            },
            {
              //新币速递
              title:
                this.app.language == "en"
                  ? "Project Express"
                  : this.$t("routes.project_del"),
              icon: "icon-licai_financing",
              url: "/coin",
            },
            {
              //项目咨询
              title:
                this.app.language == "en"
                  ? "Project Enquiry"
                  : this.$t("routes.project_en"),
              icon: "icon-erji_headset-one",
              url: "/proNews",
            },
          ]
        : [
            {
              //我的研报库
              title:
                this.app.language == "en"
                  ? "Home"
                  : this.$t("routes.mine_project"),
              icon: "icon-shouye_home",
              url:
                (meal_id == 3 && "/userCenter") ||
                (meal_id == 4 && "/userCenter") ||
                (meal_id == 1 && status == 1 && "/userCenter") ||
                (meal_id == 0 && "/unVip") ||
                "/otherCenter",
            },
            {
              //项目解析
              title:
                this.app.language == "en"
                  ? "Project Analysis"
                  : this.$t("routes.project_an"),
              icon: "icon-shichangfenxi_market-analysis",
              url: "/project",
            },
            {
              //赛道解析
              title:
                this.app.language == "en"
                  ? "Sector Analysis"
                  : this.$t("routes.sector_an"),
              icon: "icon-qukuailian_blockchain",
              url: "/race",
            },
            {
              //新币速递
              title:
                this.app.language == "en"
                  ? "Project Express"
                  : this.$t("routes.project_del"),
              icon: "icon-licai_financing",
              url: "/coin",
            },
            {
              //项目咨询
              title:
                this.app.language == "en"
                  ? "Project Enquiry"
                  : this.$t("routes.project_en"),
              icon: "icon-erji_headset-one",
              url: "/proNews",
            },
          ];
    },
    menuNavList() {
      return [
        {
          icon: "icon-tixing_remind",
          //消息中心
          title: this.$t("routes.message_cen"),
          url: "/mobile-message",
        },
        {
          icon: "icon-guojihua_international",
          title: this.app.language == "en" ? "Language:中文" : "English",
          url: "",
        },
        {
          icon: "icon-biaoqian_tag-one",
          //我的订单
          title: this.$t("routes.my_order"),
          url: "/mobile-order",
        },
        {
          icon: "icon-shezhi_setting-two",
          //设置
          title: this.$t("routes.set"),
          url: "/setting",
        },
      ];
    },
    // screenWidth() {
    //   return document.body.clientWidth;
    // },
  },
  watch: {
    screenWidth(_val) {
      if (_val <= 1600 && !this.open) {
        // console.log(123)
        this.isOpen && this.openMenu();
        this.$refs.sideBar.closeToolMenu();
        this.isOpen = false;
      }
      // if (_val >= 1600) {
      //   console.log(123);
      //   this.openMenu();
      //   this.$refs.sideBar.toolMenu();
      //   this.isOpen = true;
      // }
      if (_val <= 1400) {
        this.showOpenIcon = false;
      } else {
        this.showOpenIcon = true;
      }
    },
    isOpen(val) {
      val && this.$store.commit("upIsOpenMenu", 1);
      !val && this.$store.commit("upIsOpenMenu", 0);
    },
  },
  methods: {
    // 板块选择
    switchPro(command) {
      const { meal_id, is_information, information_status } = this.app.account;
      command == "goLibrary" &&
        (this.$router.push({
          path:
            (meal_id == 3 && "/userCenter") ||
            (meal_id == 4 && "/userCenter") ||
            (meal_id == 1 &&
              this.app.account.one_day_try_status.status &&
              this.app.account.one_day_try_status.status == 1 &&
              "/userCenter") ||
            (meal_id == 0 && "/unVip") ||
            "/otherCenter",
          query: {
            type: 0,
          },
        }),
        this.$store.commit("uIsBureau", 0),
        this.$store.dispatch("setProjectPoint", 1),
        window.getAnn(),
        clearNotify());
      command == "goBureau" &&
        (this.$router.push({
          path:
            ((is_information == 1 ||
              (is_information == 2 && information_status == 1)) &&
              "/mine-bureau") ||
            "/unVip",
          query: {
            type: 1,
          },
        }),
        this.app.language == "en" &&
          (this.$store.commit("setLanguage", "zh-CN"),
          setTimeout(() => {
            window.location.reload();
          }, 500)),
        this.$store.dispatch("setProjectPoint", 2),
        (this.$i18n.locale = this.app.language),
        this.$store.commit("uIsBureau", 1),
        window.getAnn(),
        clearNotify());
    },
    firstCopySuccess() {
      this.$notify({
        type: "success",
        //复制成功
        message: this.$t("notify.copy_success"),
      });
    },
    firstCopyError() {
      this.$notify({
        type: "danger",
        // 复制失败，请稍后再试
        message: this.$t("notify.copy_falied"),
      });
    },
    openMenu() {
      this.$sidebar.toggleMinimize();
      this.$sidebar.isMinimized
        ? (this.JSOper = "hasOpenMenu")
        : (this.JSOper = "");
    },
    toolMenu() {
      this.JustBtn = "hasOpenMenuBtn";
    },
    closeToolMenu() {
      this.JustBtn = "";
    },
    //关闭菜单
    closeMenu() {
      this.$sidebar.toggleMinimize();
      this.JSOper = "";
    },
    //路由选择
    choseRoute(index) {
      if (this.menuList[index].url == "/project") {
        return;
      }
      if (this.menuList[index].url == "/race") {
        return;
      }
      if (this.menuList[index].url == "/coin") {
        return;
      }
      this.tagIndex = index;
    },
    // 面包屑跳转
    backRoute() {
      if (this.app.route !== this.$route.path) {
        this.$router.push(this.app.route);
      }
    },
    //退出登录
    loginOut() {
      window.loginOut();
    },
    //下拉菜单指令
    handleCommand(command) {
      command == "change_language" &&
        this.app.isBureau == 0 &&
        this.changeLang();
      command == "setting" && this.$router.push("/setting");
      command == "loginOut" && this.loginOut();
      command == "order" && this.$router.push("/order");
    },
    //下拉菜单展开事件
    menuChange(_bool) {
      if (_bool) {
        this.iconStatusClass = "iconUp";
      } else {
        this.iconStatusClass = "";
      }
    },
    //移动端事件类型
    mobileEventType(_command) {
      _command == "change_language" &&
        this.app.isBureau == 0 &&
        this.changeLang();
      _command == "message" && this.$router.push("/mobile-message");
      _command == "order" && this.$router.push("/mobile-order");
      _command == "setting" && this.$router.push("/setting");
    },
    //切换语言
    changeLang() {
      const lang = this.app.language == "en" ? "zh-CN" : "en";
      this.$store.commit("setLanguage", lang);
      this.$i18n.locale = lang;
      window.location.reload();
    },
    //获取新消息状态
    async getMessageStatus() {
      const result = await newMessage();
      result.count == 0 && this.$store.commit("upMessageStatus", false);
    },
    //消息中心
    goMessage() {
      this.$route.path !== "/message" && this.$router.push("/message");
      this.$route.path == "/message" && window.operAll();
    },
    //客服微信获取
    async getContact() {
      const result = await contactQR();
      this.contactURL = result.image;
      this.contactWechat = result.nickname;
    },
  },
  created() {
    const { name } = this.$route;
    name == "UserCenter" && (this.tagIndex = 0);
    name == "Project" && (this.tagIndex = 1);
    name == "Race" && (this.tagIndex = 2);
    name == "Coin" && (this.tagIndex = 3);
    name == "ProNews" && (this.tagIndex = 4);
    this.getMessageStatus();
    this.getContact();
    const resetUrl = () => {
      this.menuList.forEach((e) => {
        if (e.icon === "icon-shouye_home") {
          e.url = "/userCenter";
        }
      });
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin linear-gradient($color1, $color2) {
  background: $color1; /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(
    90deg,
    $color1,
    $color2
  ); /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(
    90deg,
    $color1,
    $color2
  ); /* For Opera 11.1 to 12.0 */
  background: -moz-linear-gradient(
    90deg,
    $color1,
    $color2
  ); /* For Firefox 3.6 to 15 */
  background: linear-gradient(0deg, $color1, $color2); /* Standard syntax */
}
.default-alive {
  transition: 0.3s;
  // transform: scale(0.9) translateY(20px);
  width: 95%;
  margin: 0 auto;
  margin-top: 20px;
  opacity: 0;
}
.open-alive {
  transition: 0.3s;
  // transform: scale(1) translateY(0);
  margin: 0 auto;
  width: 100%;
  opacity: 1;
}
.open-menu-nav {
  transform: translateY(0) !important;
}
.mobile-nav-white {
  .nav-inner {
    background: white !important;
  }
  z-index: 5000 !important;
  p {
    color: $titleColor !important;
  }
  /deep/ p,
  .high {
    color: $titleColor !important;
  }
}
/deep/ .el-dropdown-menu__item--divided {
  width: 100%;
  margin: 0 auto;
  padding: 0;
  padding-top: 0.8rem;
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
  display: none;
}
.mine {
  width: 100%;
  .hasOpenMenu {
    width: 250px !important;
    .login-out {
      width: 280px !important;
      left: 0 !important;
      button {
        width: 160px !important;
        font {
          display: block !important;
          opacity: 1 !important;
        }
      }
    }
  }
  .hasOpenMenuBtn {
    .login-out {
      width: 280px !important;
      left: 0 !important;
      button {
        width: 160px !important;
        font {
          display: block !important;
          opacity: 1 !important;
        }
      }
    }
  }
  .tools-box {
    width: 100%;
    height: 80px;
    position: absolute;
    z-index: 1020;
    top: 0;
    transition: 0.3s all;
    left: 0;
    .nav-inner {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 200;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: 0.3s all;
      background: $mineBg;
    }
    .bureau-nav-bg {
      background: $contentBg;
    }
    .tools-left {
      padding-left: 34px;
      display: flex;
      p {
        font-size: 22px;
        margin-right: 28px;
        cursor: pointer;
        color: white;
      }
    }
    .tools-title {
      padding-top: 2px;
      color: $textColor;
      display: flex;
      cursor: pointer;

      /deep/ p {
        font-size: 18px;
      }
      /deep/ .high {
        color: white;
      }
    }
    .mobile-router-title-two {
      position: absolute;
      left: 40%;
    }
    .mobile-router-title-two-en {
      left: 33%;
    }
    .tools-right {
      display: flex;
      align-items: center;
      padding-right: 34px;
      p:first-child {
        position: relative;
        span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: $danger;
          position: absolute;
          border-radius: 50%;
          right: 0;
          top: -1px;
        }
      }
      .iconfont {
        margin-right: 26px;
        font-size: 20px;
        cursor: pointer;
        color: $textColor;
      }
      .uid-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 24px;
        .uid-line {
          height: 16px;
          width: 1px;
          background: $lineColor;
          margin-right: 26px;
        }
        .iconfont {
          margin: 0;
          font-size: 14px;
          color: $textColor;
        }
        font-size: 13px;
        color: $remarkColor;
        .uid-high {
          color: $textColor;
        }
      }
      .token-msg {
        display: flex;
        height: 40px;
        align-items: center;
        padding: 0 12px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.12);
        display: flex;
        align-items: center;
        font-size: 13px;
        p {
          color: white;
        }
        .address-icon {
          margin-right: 8px;
        }
        span {
          margin-left: 12px;
          margin-right: 0;
          color: #999;
          font-size: 18px;
          transition: 0.3s all;
        }
        .iconUp {
          transform: rotate(180deg);
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
  }
  .mine-center {
    width: 100%;
    display: flex;
    position: absolute;
    width: 100%;
    top: 80px;
    left: 0;
  }
  @media screen and (min-width: 1201px) {
    .tools-box {
      .mobile-router-title {
        display: none;
      }
      .tools-left-mobile {
        display: none;
      }
      .tools-right-mobile {
        display: none;
      }
    }
    .mobile-router-title-two {
      display: none !important;
    }
  }
  @media screen and (max-width: 1200px) {
    .mine-menu {
      display: none;
    }
    .mine-view {
      z-index: 2000;
      .view-box {
        padding: 0 $fon14 $fon14 $fon14 !important;
        padding-bottom: 8rem !important;
      }
      .bureau-view {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
    .bureau-admin-view {
      // height:  100vh!important ;
    }
    .mine-view::-webkit-scrollbar {
      display: none;
    }
    .tools-box {
      position: relative;
      .tools-left {
        display: none;
      }
      .tools-right {
        display: none;
      }
      .mobile-router-title {
        display: flex;
        border: 1px solid #242d52;
        border-radius: 4px;
        align-items: center;
        width: 9.2rem;
        position: absolute;
        left: 50%;
        margin-left: -4.6rem;
        p {
          font-size: $fon14;
          color: #676c7a;
          height: 2rem;
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s all;
        }
        .select-pro {
          background: $conBg2;
          color: white;
        }
      }
      .mobile-router-title-en {
        p {
          font-size: $fon12;
          text-align: center;
        }
      }
      .mobile-router-title-bureau {
        // margin-left: 0;
      }
      .tools-left-mobile {
        margin-left: $padd24;
        .iconfont {
          font-size: $padd24;
          color: white;
        }
      }
      .tools-right-mobile {
        display: flex;
        margin-right: $padd24;
        .iconfont {
          color: white;
          margin-left: $fon14;
          font-size: $fon20;
        }
      }
    }
  }
  .mine-menu {
    width: 100px;
    transform: translateX(-100%);
    transition: 0.3s all;
    box-sizing: border-box;
    height: calc(100vh - 80px);
    position: relative;
    z-index: 2000;
    background: $mineBg;
    position: relative;
    .project-sidebar {
      @include linear-gradient($primary-states, $primary);
    }
    .bureau-sidebar {
      @include linear-gradient(#5147d1, #9055eb);
    }
    .bureau-sidebar::before {
      border-bottom: 5px solid #9055eb;
    }
    .sidebar {
      margin-top: 0;
    }
    .login-out {
      width: 80px;
      position: absolute;
      bottom: 40px;
      left: 20px;
      z-index: 3000;
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: center;
      transition: 0.3s all;
      button {
        width: 40px;
        transition: 0.5s all;
        padding: 12px !important;
        height: 40px;
        background: rgba(255, 255, 255, 0.12);
        color: white;
        text-overflow: hidden;
        white-space: nowrap;
        font {
          display: none;
          margin-left: 8px;
        }
      }
    }
  }
  .open {
    transform: translateX(0);
  }
  .mine-view {
    flex: 1;
    height: calc(100vh - 80px);
    transition: 0.3s all;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    position: relative;
    .view-box {
      flex: 1;
      background: $mineBg;
      // background: red;
      padding: 0 30px 30px 30px;
    }
  }
  .menuOpenNow {
    width: 270px;
  }
  .contnetClose {
    width: 88%;
  }
  .toolsClose {
    width: 88% !important;
    left: 12% !important;
  }
}
</style>
