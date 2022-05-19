// 移动端菜单
<template>
  <div>
    <div>
      <el-drawer
        :visible.sync="mobileMenuInner"
        :append-to-body="true"
        size="60%"
        :show-close="false"
        direction="ltr"
      >
        <div
          class="mobile-draw"
          :class="app.isBureau == 1 && 'mobile-draw-bureau'"
        >
          <img :src="navLogo" alt="" @click="$router.push('/')" />
          <div class="menu-box-mobile">
            <ul>
              <li
                v-for="(menuMobile, indexMobile) in menuList"
                :class="activeDrawer == indexMobile && 'active-drawer'"
                :key="indexMobile"
                @click="
                  activeDrawer = indexMobile;
                  $router.push(menuMobile.url);
                  mobileMenuInner = false;
                "
              >
                <p>
                  <span
                    v-if="app.account.uid"
                    class="iconfont"
                    :class="menuMobile.icon"
                  ></span>
                  {{ menuMobile.title }}
                </p>
              </li>
            </ul>
            <div class="oper-box">
              <p
                class="feed-back-mobile"
                @click="
                  mobileMenuInner = false;
                  $refs.feedback.feedBack = true;
                "
              >
                <span class="iconfont icon-tishi_tips-one"></span>
                <!-- 用户反馈 -->
                {{ $t("public.feed_back") }}
              </p>
              <div class="oper-inner">
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
                <p class="iconfont icon-kaiguan_power" @click="loginOut"></p>
              </div>
              <p class="user-id">
                <span class="iconfont icon-bianhao_id"></span>
                UID：{{ app.account.uid }}
              </p>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
    <!-- 用户反馈 -->
    <FeedBack ref="feedback" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      navLogo: require("@/assets/images/firstLogo.png"),
      mobileMenuInner: false,
      activeDrawer: 0,
    };
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
              //我的情报局
              title:
                this.app.language == "en"
                  ? "Home"
                  : this.$t("routes.mine_intell"),
              icon: "icon-shouye_home",
              url: is_information == 0 ? "/unVip" : "/mine-bureau",
            },
            {
              //情报速递
              title:
                this.app.language == "en"
                  ? "Intelligence"
                  : this.$t("routes.intell_infor"),
              icon: "icon-leida_radar",
              url: "/bureau-express",
            },
            // {
            //   title: "Discord专区",
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
                  ? "My Tracking List"
                  : this.$t("routes.track_list"),
              icon: "icon-dingyue_rss",
              url: "/bureau-track",
            },
            {
              //重点情报
              title: this.app.account.is_focus_page
                ? this.app.language == "en"
                  ? "Important"
                  : this.$t("bureau_express.important")
                : "",
              icon: this.app.account.is_focus_page ? "icon-xingxing_star" : "",
              url: this.app.account.is_focus_page ? "/bureau-important" : "",
            },
          ]
        : is_distributor == 1
        ? [
            {
              //渠道商数据中心
              title: this.$t("routes.mine_business"),
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
  },
  created() {
    (this.$route.name == "UserCenter" ||
      this.$route.name == "OtherCenter" ||
      this.$route.name == "UnVip" ||
      this.$route.name == "MineBureau") &&
      (this.activeDrawer = 0);
    (this.$route.name == "Project" || this.$route.name == "BureauExpress") &&
      (this.activeDrawer = 1);
    (this.$route.name == "Race" || this.$route.name == "BureauEvents") &&
      (this.activeDrawer = 2);
    (this.$route.name == "Coin" || this.$route.name == "BureauProposal") &&
      (this.activeDrawer = 3);
    (this.$route.name == "ProNews" || this.$route.name == "BureauTrack") &&
      (this.activeDrawer = 4);
  },
  watch: {
    $route(to, from) {
      (to.name == "UserCenter" ||
        to.name == "OtherCenter" ||
        to.name == "UnVip" ||
        to.name == "MineBureau") &&
        (this.activeDrawer = 0);
      (to.name == "Project" || to.name == "BureauExpress") &&
        (this.activeDrawer = 1);
      (to.name == "Race" || to.name == "BureauEvents") &&
        (this.activeDrawer = 2);
      (to.name == "Coin" || to.name == "BureauProposal") &&
        (this.activeDrawer = 3);
      (to.name == "ProNews" || to.name == "BureauTrack") &&
        (this.activeDrawer = 4);
    },
  },
  components: {
    FeedBack: (resolve) => require(["@/comsmine/feed_back"], resolve),
  },
  methods: {
    //退出登录
    loginOut() {
      window.loginOut();
    },
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
/deep/ .el-drawer__header {
  display: none;
}
.mobile-draw {
  width: 100%;
  height: 100%;
  @include linear-gradient($primary-states, $primary);
  padding: 2rem 0 $padd40 0;
  display: flex;
  flex-direction: column;
  img {
    width: 7.5rem;
    margin-left: $padd24;
  }
  .menu-box-mobile {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-top: 2rem;
    ul {
      padding: 0 1rem;
      li {
        height: $padd40;
        padding: 0 1rem;
        border-radius: 4px;
        font-size: $fon14;
        margin-bottom: 0.625rem;
        transition: 0.3s all;
        display: flex;
        align-items: center;
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
      .active-drawer {
        background: rgba(255, 255, 255, 0.2);
      }
    }
    .oper-box {
      padding: 0 $padd24;
      .feed-back-mobile {
        margin-bottom: $padd24;
        font-size: 0.81rem;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
          font-size: $fon20;
          color: white;
          margin-right: 0.5rem;
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
.mobile-draw-bureau {
  @include linear-gradient(#5147d1, #9055eb);
}
</style>