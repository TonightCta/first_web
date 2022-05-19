<template>
  <div class="sidebar" @mouseenter="toolMenu" @mouseleave="closeToolMenu">
    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <div class="logo" style="cursor: pointer" @click="$router.push('/')">
        <p class="simple-text logo-mini">
          <img :src="logo" alt="app-logo" />
        </p>
        <p class="simple-text logo-normal logo-mine">
          <img
            :src="require('@/assets/images/logoText.png')"
            style="height: 36px"
            alt=""
          />
        </p>
      </div>
      <slot></slot>
      <ul class="nav">
        <slot name="links">
          <sidebar-item
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :link="link"
          >
            <sidebar-item
              v-for="(subLink, index) in link.children"
              :key="subLink.name + index"
              :link="subLink"
            >
            </sidebar-item>
          </sidebar-item>
        </slot>
      </ul>
      <div class="login-out" :class="JustBtn">
        <div class="open-btn">
          <p @click="$refs.feedback.feedBack = true">
            <span class="iconfont icon-tishi_tips-one"></span>
            <font>
              <!-- 用户反馈 -->
              {{$t('public.feed_back')}}
            </font>
          </p>
          <base-button
            @click="loginOut()"
            type="primary"
            round
            iconfont="iconfont icon-kaiguan_power"
          >
            <span class="iconfont icon-kaiguan_power"></span>
            <font>
              <!-- 退出登录 -->
              {{$t('public.login_out')}}
            </font>
          </base-button>
        </div>
      </div>
    </div>
    <!-- 用户反馈 -->
    <FeedBack ref="feedback" />
  </div>
</template>
<script>
export default {
  name: "sidebar",
  data() {
    return {
      JustBtn: "hasOpenMenuBtn",
    };
  },
  props: {
    title: {
      type: String,
      default: "Creative Tim",
      description: "Sidebar title",
    },
    shortTitle: {
      type: String,
      default: "CT",
      description: "Sidebar short title",
    },
    logo: {
      type: String,
      default: "img/icon-vue.png",
      description: "Sidebar app logo",
    },
    // backgroundColor: {
    //   type: String,
    //   default: "vue",
    //   validator: (value) => {
    //     let acceptedValues = [
    //       "",
    //       "vue",
    //       "blue",
    //       "green",
    //       "orange",
    //       "red",
    //       "primary",
    //       "yellow",
    //     ];
    //     return acceptedValues.indexOf(value) !== -1;
    //   },
    //   description:
    //     "Sidebar background color (vue|blue|green|orange|red|primary|yellow)",
    // },
    sidebarLinks: {
      type: Array,
      default: () => [],
      description:
        "List of sidebar links as an array if you don't want to use components for these.",
    },
    autoClose: {
      type: Boolean,
      default: true,
      description:
        "Whether sidebar should autoclose on mobile when clicking an item",
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  components: {
    FeedBack: (resolve) => require(["../../comsmine/feed_back"], resolve),
  },
  methods: {
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
    toolMenu() {
      this.JustBtn = "hasOpenMenuBtn";
    },
    closeToolMenu() {
      if (!this.$sidebar.isMinimized) {
        this.JustBtn = "";
      }
    },
    //退出登录
    loginOut() {
      window.loginOut();
    },
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.hasOpenMenuBtn {
  width: 100% !important;
  display: flex;
  justify-content: center;
  p {
    .iconfont {
      margin-right: 8px;
    }
    font {
      display: block!important;
    }
  }
  button {
    width: 160px !important;
    font {
      display: block !important;
      opacity: 1 !important;
    }
  }
}
.login-out {
  width: 100%;
  position: absolute;
  bottom: 40px;
  left: 0;
  z-index: 3000;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  transition: 0.3s all;
  p {
    width: 100%;
    color: white;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    cursor: pointer;
    .iconfont {
      font-size: 20px;
      display: inline-block;
      transform: translateY(1px);
    }
    font {
      display: none;
    }
  }
  button {
    width: 40px;
    transition: 0.5s all;
    padding: 12px !important;
    font-weight: 400;
    height: 40px;
    background: rgba(255, 255, 255, 0.12) !important;
    color: white;
    text-overflow: hidden;
    white-space: nowrap;
    .iconfont {
      font-weight: 400;
    }
    font {
      display: none;
      margin-left: 8px;
    }
  }
}
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}
</style>
