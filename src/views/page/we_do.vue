<template>
  <div class="we-do">
    <p class="do-title">
      <!-- 我们做什么 -->
      {{$t('index_nav.waht_do')}}
    </p>
    <p class="do-remark remark-pc">
      <!-- 头等仓全面覆盖、深度分析、挖掘极具价值的区块链创新热点，以此推出区块链项目研报、赛道解析、新币速递等研报产品 -->
      {{$t('index.we_do.do_remaek_1')}}
    </p>
    <p class="do-remark remark-mobile">
      <!-- 头等仓全面覆盖极具价值的区块链创新热点 -->
      {{$t('index.we_do.do_remark_3')}}
      <!-- {{$t('index.we_do.do_remark_4')}} -->
    </p>
    <p class="do-list-title">
      <!-- 头等仓研报样刊 -->
      {{$t('index.we_do.do_remark_2')}}
    </p>
    <p class="do-list-remark list-remark-pc">
      <!-- 以下展示头等仓以往公开的研报做为样刊，仅供参考，不可根据研报内容指导投资！ -->
      {{$t('index.we_do.do_remark_5')}}
    </p>
    <p class="do-list-remark list-remark-mobile">
      <!-- 以下展示以往公开的研报做为样刊，仅供参考 -->
      {{$t('index.we_do.do_remark_6')}}
    </p>
    <div class="row">
      <div
        class="col-sm-6 col-lg-3"
        v-for="(weDo, indexD) in essayList"
        :key="indexD"
        @click="goView($flag ? weDo.mobile_ur : weDo.url)"
      >
        <div class="do-tent">
          <div class="top-tent" :style="{ background: weDo.bgColor }">
            <p class="iconfont">
              <img :src="weDo.titleimg" alt="" />
            </p>
            <p class="top-posi" v-if="false">{{$t('index.we_do.do_sub')}}</p>
            <div class="tent-bg-text">
              <p>{{ weDo.remark1 }}</p>
              <p>{{ weDo.remark2 }}</p>
            </div>
            <div class="tent-text">
              <p v-if="app.language != 'en'">{{ weDo.remark1 }}&nbsp;{{ weDo.remark2 }}</p>
              <p>{{ weDo.title }}</p>
            </div>
          </div>
          <div class="bottom-tent">
            <p class="tent-text">{{ weDo.name }}</p>
            <div class="go-icon">
              <p class="iconfont icon-you_right"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "WeDo",
  data() {
    return {
      // essayList: 
    };
  },
  computed:{
    ...mapState(['app']),
    essayList(){
      return [
        {
          title: this.$t('public.info_project'),
          remark1: "RESEARCH",
          remark2: "ANALYSIS",
          bg: "linear-gradient(45deg,rgba(136, 98, 245, 0.2) 0%,rgba(198, 178, 255, 0.2) 100%)",
          titleimg: require("@/assets/images/pageIcon/we_do_1.png"),
          bgColor: "#2B64F8",
          name: "The Sandbox",
          url: "https://asset.first.vip/uploads/20211124/95_The Sandbox新-62831945.pdf",
          mobile_ur:'https://asset.first.vip/uploads/20211124/95_The Sandbox新_手机-48267935.pdf'
        },
        {
          title: this.$t('public.info_race'),
          remark1: "SECTOR",
          remark2: "ANALYSIS",
          bg: "linear-gradient(225deg, rgba(143,176,255,.2) 0%, rgba(92,138,248,.2) 100%)",
          titleimg: require("@/assets/images/pageIcon/we_do_3.png"),
          bgColor: "#1FBF75",
          name: "跨链桥",
          url: "https://asset.first.vip/uploads/20211206/6_跨链桥_211119-21576438-54278196.pdf",
          mobile_ur:'https://asset.first.vip/uploads/20211206/6_跨链桥_211119-21576438-54278196.pdf'
        },
        {
          title: this.$t('public.info_coin'),
          remark1: "PROJECT",
          remark2: "EXPRESS",
          bg: "linear-gradient(45deg,rgba(250, 172, 20, 0.2) 0%,rgba(255, 217, 143, 0.2) 100%)",
          titleimg: require("@/assets/images/pageIcon/we_do_4.png"),
          bgColor: "#33A9FF",
          name: "Axie Infinity",
          url: "https://asset.first.vip/uploads/20211124/Axie Infinity_Jaden-24578319.pdf",
          mobile_ur:'https://asset.first.vip/uploads/20211124/Axie Infinity_手机-74698531.pdf'
        },
      ]
    }
  },
  mounted() {},

  methods: {
    //范文阅读
    goView(_url) {
      !this.$flag
        ? window.open(_url)
        : this.$cell
        ? window.open(_url)
        : window.viewPDF(_url);
    },
  },
};
</script>

<style lang="scss" scoped>
.we-do {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 19.5%;
  background: url("../../assets/images/pageIcon/inve_bg.png");
  background-size: 100% 100%;
  p {
    color: white;
  }
  .do-title {
    font-size: 28px;
    color: $success;
    margin-bottom: 24px;
  }
  .do-remark {
    font-size: 14px;
    margin-bottom: 80px;
  }
  .do-list-title {
    font-size: 20px;
    margin-bottom: 24px;
  }
  .do-list-remark {
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 48px;
  }
  .remark-pc{
    line-height: 22px;
  }
  .row {
    .col-sm-6 {
      width: 33%;
      max-width: 33%;
      flex: inherit;
    }
  }
  .row::-webkit-scrollbar {
    display: none;
  }
  .do-tent {
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    .top-tent {
      height: 180px;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px;
      overflow: hidden;
      border-radius: 4px;
      .iconfont {
        img {
          width: 48px;
          height: 48px;
        }
      }
      .tent-text {
        p:first-child {
          font-size: 12px;
          color: white;
          line-height: 32px;
        }
        p:last-child {
          font-size: 28px;
          font-weight: 500;
        }
      }
      .top-posi {
        position: absolute;
        border-radius: 0px 0px 4px 4px;
        top: 0;
        right: 16px;
        font-size: 13px;
        font-weight: bold;
        // width: 40px;
        padding:0 8px;
        height: 24px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("../../assets/images/pageIcon/we_do_5.png");
        background-size: 100% 100;
      }
      .tent-bg-text {
        position: absolute;
        line-height: 44px;
        color: white;
        opacity: 0.1;
        font-size: 40px;
        left: 220px;
        top: 24px;
        bottom: 16px;
        letter-spacing: 2px;
        white-space: nowrap;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }
    }
    .bottom-tent {
      width: 100%;
      height: 60px;
      display: flex;
      padding: 18px;
      justify-content: space-between;
      align-items: center;
      background: $conBg2;
      .tent-text {
        font-size: 16px;
        color: white;
      }
      .go-icon {
        .iconfont {
          font-size: 24px;
          color: #49537a;
        }
      }
    }
  }
}
@media screen and (min-width: 1280px) {
  .remark-mobile {
    display: none !important;
  }
  .list-remark-mobile {
    display: none !important;
  }
}
@media screen and (max-width: 1279px) {
  .we-do {
    padding: 0 $padd24;
    .do-title {
      font-size: $fon18;
      margin-bottom: 1rem;
    }
    .remark-pc {
      display: none;
    }
    .remark-mobile{
      line-height: $fon18;
    }
    .do-remark {
      margin-bottom: 0.5rem;
      font-size: $fon12;
    }
    .do-list-title {
      margin-top: $padd40;
      font-size: 1rem;
    }
    .list-remark-pc {
      display: none;
    }
    .do-list-remark {
      margin-bottom: $padd80;
      font-size: $fon12;
    }
  }
  .row {
    flex-wrap: nowrap;
    overflow-x: auto;
    .col-sm-6 {
      width: auto !important;
      max-width: none !important;
      .do-tent {
        width: 16.8rem;
        .top-tent {
          padding: $padd24;
          .iconfont {
            img {
              width: $size48;
              height: $size48;
            }
          }
          .tent-bg-text {
            font-size: 2.25rem;
            top: 1rem;
            left: 10rem;
          }
          .tent-text {
            p {
              font-size: $fon12;
            }
            p:last-child {
              font-size: $padd24;
            }
          }
        }
        .bottom-tent {
          p {
            font-size: $fon12;
          }
          .iconfont {
            font-size: $padd24;
          }
        }
      }
    }
  }
}
</style>