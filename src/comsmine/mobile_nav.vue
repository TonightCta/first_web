// 移动端头部
<template>
  <div class="mobile-nav" :class="menuStatusNav ? 'mobile-nav-white' : ''">
    <div class="nav-inner">
      <p
        class="iconfont icon-zuo_left"
        @click="
          menuStatusNav = false;
          $router.back(-1);
        "
      ></p>
      <slot></slot>
      <!-- <p class="iconfont icon-gengduo_more" :style="{ opacity:!hiddenMenu ? 1 : 0 }" @click="menuStatusNav = !menuStatusNav"></p> -->
      <el-dropdown trigger="click" @command="mobileEventType">
        <p class="iconfont icon-gengduo_more el-dropdown-link"></p>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="iconfont icon-guojihua_international">
            <!-- TODO -->
             <!-- command="change_language" -->
            <!-- {{ app.language == "en" ? "中文" : "English" }} -->
            语言：中文
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
            <p style="padding:0 1rem;">
              <!-- 联系销售顾问 -->
              {{ $t("setting.contact_website") }}
            </p>
            <base-button
              type="info"
              v-if="app.language == 'zh-CN'"
              v-clipboard:copy="contactWechat"
              round
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            >
              <!-- 复制微信号 -->
              {{ $t("public.copy_wechat") }}
            </base-button>
            <base-button
              type="info"
              v-if="false"
              round
              :class="app.isBureau == 1 && 'other-info'"
              @click="switchPro(app.isBureau == 1 ? 'goLibrary' : 'goBureau')"
            >
              <!-- 进入研报库 & 进入情报局 -->
              {{
                app.isBureau == 1
                  ? $t("public.into_project")
                  : $t("public.into_bureau")
              }}
            </base-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div
      class="close-mask"
      @click="menuStatusNav = false"
      v-if="menuStatusNav"
    ></div>
  </div>
</template>

<script>
import { contactQR } from "@/request/api";
import { mapState } from "vuex";
export default {
  name: "MobileNav",
  props: ["hiddenMenu"],
  data() {
    return {
      menuStatusNav: false, //菜单状态
      contactURL: null, //客服微信
      contactWechat: null,
    };
  },
  computed: {
    ...mapState(["app"]),
    menuList(){
      return [
        {
          //消息中心
          icon: "icon-tixing_remind",
          title: this.$t('routes.message_cen'),
          url: "/mobile-message",
        },
        {
          icon: "icon-guojihua_international",
          title: this.app.Language == "en" ? "Language:CHS" : "语言：ENG",
          url: "",
        },
        {
          icon: "icon-biaoqian_tag-one",
          //我的订单
          title: this.$t('routes.my_order'),
          url: "/mobile-order",
        },
        {
          icon: "icon-shezhi_setting-two",
          // 设置
          title: this.$t('routes.set'),
          url: "/setting",
        },
      ]
    }
  },
  created() {
    this.getContact();
  },
  methods: {
    // 板块选择
    switchPro(command) {
      const { meal_id, is_information } = this.app.account;
      command == "goLibrary" &&
        (this.$router.push(
          (meal_id == 3 && "/userCenter") ||
            (meal_id == 4 && "/userCenter") ||
            (meal_id == 1 &&
              this.app.account.one_day_try_status.status &&
              this.app.account.one_day_try_status.status == 1 &&
              "/userCenter") ||
            (meal_id == 0 && "/unVip") ||
            "/otherCenter"
        ),
        this.$store.commit("uIsBureau", 0),
        clearNotify());
      command == "goBureau" &&
        (this.$router.push(
          ((is_information == 1 || is_information == 2) && "/mine-bureau") ||
            "/unVip"
        ),
        this.$store.commit("uIsBureau", 1),
        clearNotify());
    },
    //客服微信获取
    async getContact() {
      const result = await contactQR();
      this.contactURL = result.image;
      this.contactWechat = result.nickname;
    },
    //移动端事件类型
    mobileEventType(_command) {
      _command == "change_language" && this.changeLang();
      _command == "message" && this.$router.push("/mobile-message");
      _command == "order" && this.$router.push("/mobile-order");
      _command == "setting" && this.$router.push("/setting");
    },
    changeLang() {
      const lang = this.app.language == "en" ? "zh-CN" : "en";
      this.$store.commit("setLanguage", lang);
      this.$i18n.locale = lang;
      window.location.reload();
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
        //复制失败，请稍后再试
        message: this.$t('notify.copy_falied'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.open-menu-nav {
  transform: translateY(0) !important;
}
.mobile-nav-white {
  .nav-inner {
    background: white;
  }
  p {
    color: $titleColor !important;
  }
}
.mobile-nav {
  width: 100%;
  height: 3.75rem;
  background: $mineBg;
  position: fixed;
  -webkit-overflow-scrolling: touch;
  top: 0;
  // background: rgba(255, 255, 255, 0.5);
  left: 0;
  z-index: 2000;
  .nav-inner {
    width: 100%;
    padding: 0 $padd24;
    position: relative;
    height: 100%;
    z-index: 200;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: 0.3s all;
  }
  p {
    font-size: 1rem;
    color: white;
    transition: 0.3s all;
  }
  .iconfont {
    font-size: $padd24;
    color: $textColor;
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
</style>