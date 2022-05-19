<!-- 首屏 -->
<template>
  <div class="page-screen">
    <div class="screen-box">
      <img
        class="title-bg-pc"
        :class="app.language == 'en' && 'title-bg-en'"
        :src="
          app.language == 'en'
            ? require('@/assets/images/screenTitle_en.png')
            : require('@/assets/images/screenTitle.png')
        "
        alt=""
      />
      <img
        class="title-bg-mobile"
        :class="app.language == 'en' && 'title-bg-mobile-en'"
        :src="
          app.language == 'en'
            ? require('@/assets/images/screenTitleMobile_en.png')
            : require('@/assets/images/screenTitleMobile.png')
        "
        alt=""
      />
      <p class="anthoner anthoner-top">
        {{ $t("index.screen.screen_title_1")
        }}{{ app.language == "en" ? "." : "" }}
        {{ app.language == "en" ? $t("index.screen.screen_title_2") : "" }}
      </p>
      <p class="anthoner" style="margin-top: 16px" v-if="app.language != 'en'">
        {{ $t("index.screen.screen_title_2") }}
      </p>
      <!-- 内页入口 -->
      <div class="entrance-box" v-if="app.token">
        <ul>
          <li @click="switchPro('goLibrary')">
            <!-- 进入研报库 -->
            <p>
              <span
                type="icon"
                class="iconfont icon-shuji-dakai_book-open"
              ></span>
              {{ $t("public.into_project") }}
            </p>
            <p>
              <span type="icon" class="iconfont icon-you_right"></span>
            </p>
          </li>
          <li @click="switchPro('goBureau')">
            <!-- 进入情报局 -->
            <p>
              <span type="icon" class="iconfont icon-leida_radar"></span>
              {{ $t("public.into_bureau") }}
            </p>
            <p>
              <span type="icon" class="iconfont icon-you_right"></span>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 背景方块 -->
    <div class="bg-box">
      <img
        class="top-left"
        :src="require('@/assets/images/pageIcon/top_left.png')"
        alt=""
      />
      <img
        class="center"
        :src="require('@/assets/images/pageIcon/center.png')"
        alt=""
      />
      <img
        class="top-right"
        :src="require('@/assets/images/pageIcon/top_right.png')"
        alt=""
      />
      <img
        class="bottom-left"
        :src="require('@/assets/images/pageIcon/bottom_left.png')"
        alt=""
      />
      <img
        class="bottom-right"
        :src="require('@/assets/images/pageIcon/bottom_right.png')"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EthToolTest from '@/util/web3/test'

export default {
  name: "PageScreen",
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    // 板块选择
    async switchPro(command) {
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
        this.$store.dispatch('setProjectPoint',1),
        this.$store.commit("uIsBureau", 0));
      command == "goBureau" &&
        (this.app.language == "en" &&
          this.$store.commit("setLanguage", "zh-CN"),
        (this.$i18n.locale = this.app.language),
        this.$router.push(
          ((is_information == 1 || is_information == 2) && "/mine-bureau") ||
            "/unVip"
        ),
        this.$store.dispatch('setProjectPoint',2),
        setTimeout(() => {
          this.app.language == "en" && window.location.reload();
        }),
        this.$store.commit("uIsBureau", 1));
    },
    async test(){
      const result = await EthToolTest.test();
      console.log(result)
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .back-top {
  display: none;
}
.page-screen {
  width: 100%;
  height: 100%;
  background: #15204a;
  background-image: url("../../assets/images/screenBg.png");
  background-size: 100% 100%;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  // overflow-x: hidden;

  .screen-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 200;
    .title-bg-pc {
      width: 780px;
      height: 140px;
      position: static;
    }
    .title-bg-en {
      width: 1094px;
      height: 180px;
    }
    .title-bg-mobile {
      width: 20.375rem;
      height: 4rem;
      position: static;
    }
    .title-bg-mobile-en {
      height: 5.75rem;
    }
    .anthoner {
      font-size: 18px;
      color: white;
    }
    .anthoner-top {
      margin-top: 57px;
    }
    .entrance-box {
      margin-top: 48px;
      ul {
        width: 100%;
        display: flex;
        li {
          width: 100%;
          height: 48px;
          display: flex;
          border-radius: 4px;
          align-items: center;
          cursor: pointer;
          margin: 0 12px;
          transition: 0.3s all;
          p:first-child {
            flex: 1;
            font-size: 14px;
            color: white;
            padding-left: 16px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            white-space: nowrap;
            span[type="icon"] {
              color: white;
              font-size: 20px;
              margin-right: 8px;
            }
          }
          p:last-child {
            width: 40px;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 46px;
            span[type="icon"] {
              color: white;
              font-size: 24px;
            }
          }
        }
        li:first-child {
          background: linear-gradient(90deg, #0f83fe 0%, #00b0f0 100%);
        }
        li:last-child {
          background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
        }
      }
    }
  }
  @-webkit-keyframes slowAndShort {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }
  @-webkit-keyframes slowAndFar {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-30px);
    }
    100% {
      transform: translateY(0);
    }
  }
  @-webkit-keyframes FastAndFar {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-30px);
    }
    100% {
      transform: translateY(0);
    }
  }
  @-webkit-keyframes FastAndShort {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }
  .bg-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    img {
      position: absolute;
    }
    .center {
      width: 320px;
      height: 368px;
      top: 50%;
      margin-top: -184px;
      left: 50%;
      margin-left: -160px;
      animation: slowAndShort 5s linear infinite;
    }
    .top-left {
      width: 1042px;
      height: 1204px;
      top: -884px;
      left: -270px;
      animation: slowAndFar 8s linear infinite;
    }
    .top-right {
      width: 522px;
      height: 603px;
      top: -192px;
      right: -34px;
      animation: slowAndFar 6s linear infinite;
    }
    .bottom-left {
      width: 654px;
      height: 755px;
      left: -356px;
      bottom: -280px;
      animation: FastAndShort 6s linear infinite;
    }
    .bottom-right {
      width: 540px;
      height: 624px;
      right: 77px;
      bottom: -430px;
      animation: FastAndFar 4s linear infinite;
    }
  }
}
@media screen and (min-width: 1280px) {
  .title-bg-mobile {
    display: none;
  }
}
@media screen and (max-width: 1279px) {
  .page-screen {
    padding-bottom: 5rem;
    .screen-box {
      .title-bg-pc {
        display: none;
      }
      .anthoner {
        font-size: $fon14;
        padding: 0 $padd24;
      }
      .anthoner-top {
        text-align: center;
        margin-top: $padd24 !important;
        line-height: 1.375rem;
      }
      // .iconfont {
      //   display: none;
      // }
    }
    .bg-box {
      .center {
        width: 10rem;
        height: 11.5rem;
        margin-top: -5.75rem;
        margin-left: -5rem;
      }
      .top-left {
        width: 17rem;
        height: 19.5rem;
        top: -10.4rem;
        left: -5.25rem;
      }
      .top-right {
        width: 7.18rem;
        height: 8.3rem;
        top: 8.125rem;
        right: -4.43rem;
      }
      .bottom-right {
        width: 11.68rem;
        height: 13.43rem;
        right: -4.43rem;
        bottom: -5rem;
      }
      .bottom-left {
        bottom: 5rem;
        width: 7.18rem;
        height: 8.31rem;
        left: -3.75rem;
      }
    }
    .entrance-box {
      ul {
        flex-direction: column;
        li {
          margin-bottom: 1rem !important;
          p:last-child {
            margin-left: 1rem !important;
            width: 1.875rem !important;
          }
        }
      }
    }
  }
}
</style>
