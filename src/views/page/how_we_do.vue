<template>
  <div class="how-we-do" ref="how_we_do" @scroll.passive="getScroll($event)">
    <div class="test" ref="testBox">
      <p class="how-title">
        <!-- 我们怎么做 -->
        {{ $t("index_nav.how_do") }}
      </p>
      <!-- 介绍列表 -->
      <ul class="intList">
        <li v-for="(int, indexI) in intList" :key="indexI">
          <div class="intMsg">
            <p class="intTitle">{{ int.title }}</p>
            <p class="intRemark">{{ int.remark }}</p>
          </div>
          <img :src="int.icon" alt="" />
        </li>
      </ul>
      <div class="bottom-show">
        <p class="other-title">
          <!-- 深度挖掘区块链价值 -->
          {{ $t("index.how_do.how_remark_4") }}
        </p>
        <p class="other-remark remark-pc">
          <!-- 我们的专业团队通过几十种因素来评估各种区块链创新的发展潜力，通过 -->
          {{ $t("index.how_do.how_remark_5") }}
          <span>
            <!-- 6大维度，48个指标 -->
            {{ $t("index.how_do.how_remark_6") }}
          </span>
          <!-- 分析调研项目质量，为投资者提供全方位的信息，避免盲目决策。 -->
          {{ $t("index.how_do.how_remark_7") }}
        </p>
        <p class="other-remark remark-mobile">
          <!-- 头等仓的研究员团队通过几十种因素来评估各区块链创新的发展潜力，为投资者提供全方位的信息，避免盲目决策 -->
          {{ $t("index.how_do.how_remark_7_mobile") }}
        </p>
        <!-- <p class="other-title-two">六大维度</p> -->
        <!-- 项目列表 -->
        <ul class="proList">
          <li v-for="(pro, index) in proList" :key="index">
            <img :src="pro.icon" alt="" />
            <img :src="pro.turn" alt="" />
            <p :class="app.language && 'other-size'">{{ pro.title }}</p>
          </li>
        </ul>
        <!-- 优势列表 -->
        <ul class="hasList">
          <li v-for="(has, indexH) in hasList" :key="indexH">
            <i
              class="iconfont icon-xiaoyan-xiao_check-small"
              style="color: #33b1ff"
            ></i>
            <p>{{ has.text }}</p>
          </li>
        </ul>
        <!-- 更多 -->
        <div class="more">
          <p class="more-icon">
            <span class="iconfont icon-you_right"></span>
          </p>
          <p>
            <!-- 等48个指标深度调研项目 -->
            {{ $t("index.how_do.how_remark_more") }}
            {{ app.language == "en" ? "" : "..." }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "WeDo",
  data(){
    return{
      v:null,
    }
  },
  mounted() {
    let fixfox = navigator.userAgent.indexOf("Firefox") != -1;
    fixfox
      ? window.addEventListener("DOMMouseScroll", this.handleScroll, true)
      : window.addEventListener("mousewheel", this.handleScroll, true);
  },
  methods: {
    handleScroll(v) {
      this.v = v;
      // let fixfox = navigator.userAgent.indexOf("Firefox") != -1;
      // const { bottom } = this.$refs.testBox.getBoundingClientRect();
      // if ((fixfox ? detail : deltaY) < 0 && bottom === (this.app.language == 'en' ? 2518 : 2496)) {
      //   this.$emit("openMouse");
      // }
      // const el = document.querySelector(".how-we-do");
      // const offsetHeight = el.offsetHeight;
      // el.onscroll = () => {
      //   const scrollTop = el.scrollTop;
      //   const scrollHeight = el.scrollHeight;
      //   if (
      //     offsetHeight + scrollTop - scrollHeight == 0 &&
      //     (fixfox ? detail : deltaY) > 0
      //   ) {
      //     this.$emit("openMouse");
      //   }
      // };
      const { deltaY } = v;
      // console.log(deltaY)
      // return
      let scrollTop = this.$refs.how_we_do.scrollTop;
      if (scrollTop == 0 && deltaY < 0) {
        this.$emit("openMouse");
      }
      // console.log('相对距离', this.$refs.test2.scrollTop)
    },
    getScroll(event) {
      const { deltaY } = this.v;
      let scrollBottom =
        event.target.scrollHeight -
        event.target.scrollTop -
        event.target.clientHeight;
      if (scrollBottom == 0 && deltaY > 0) {
        this.$emit("openMouse");
      }
    },
  },
  computed: {
    ...mapState(["app"]),
    intList() {
      return [
        {
          icon: require("@/assets/images/pageIcon/how_do_2.png"),
          title: this.$t("index.how_do.how_title_1"),
          remark: this.$flag
            ? this.$t("index.how_do.how_remark_1_mobile")
            : this.$t("index.how_do.how_remark_1"),
        },
        {
          icon: require("@/assets/images/pageIcon/how_do_1.png"),
          title: this.$t("index.how_do.how_title_2"),
          remark: this.$t("index.how_do.how_remark_2"),
        },
        {
          icon: require("@/assets/images/pageIcon/how_do_3.png"),
          title: this.$t("index.how_do.how_title_3"),
          remark: this.$t("index.how_do.how_remark_3"),
        },
      ];
    },
    proList() {
      //项目列表
      return [
        {
          icon: require("@/assets/images/pageIcon/strategyIcon.png"),
          turn: require("@/assets/images/pageIcon/turnStrate.png"),
          title: this.$t("index.how_do.por_remark_1"),
          anitime: ".5s",
        },
        {
          icon: require("@/assets/images/pageIcon/progIcon.png"),
          turn: require("@/assets/images/pageIcon/turnProg.png"),
          title: this.$t("index.how_do.por_remark_2"),
          anitime: ".7s",
        },
        {
          icon: require("@/assets/images/pageIcon/hisIcon.png"),
          turn: require("@/assets/images/pageIcon/turnHis.png"),
          title: this.$t("index.how_do.por_remark_3"),
          anitime: ".9s",
        },
        {
          icon: require("@/assets/images/pageIcon/ecoIcon.png"),
          turn: require("@/assets/images/pageIcon/turnEco.png"),
          title: this.$t("index.how_do.por_remark_4"),
          anitime: "1.1s",
        },
        {
          icon: require("@/assets/images/pageIcon/pareIcon.png"),
          turn: require("@/assets/images/pageIcon/turnPare.png"),
          title: this.$t("index.how_do.por_remark_5"),
          anitime: "1.3s",
        },
        {
          icon: require("@/assets/images/pageIcon/anaIcon.png"),
          turn: require("@/assets/images/pageIcon/turnAna.png"),
          title: this.$t("index.how_do.por_remark_6"),
          anitime: "1.5s",
        },
      ];
    },
    hasList() {
      //优势列表
      return [
        {
          text: this.$t("index.how_do.hot_remark_1"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_2"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_3"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_4"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_5"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_6"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_7"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_8"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_9"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_10"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_11"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_12"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_13"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_14"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_15"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_16"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_17"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
        {
          text: this.$t("index.how_do.hot_remark_18"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_19"),
          aniname: "wow animate__fadeInRight",
          anitime: ".5s",
        },
        {
          text: this.$t("index.how_do.hot_remark_20"),
          aniname: "wow animate__fadeInRight",
          anitime: "1s",
        },
      ];
    },
  },
  beforeDestroy() {
    window.removeEventListener("mousewheel", this.handleScroll, true);
  },
};
</script>

<style lang="scss" scoped>
.how-we-do {
  width: 100%;
  height: 100%;
  padding-top: 240px;
  box-sizing: border-box;
  text-align: center;
  font-size: 36px;
  overflow-y: auto;
  position: relative;
  background: url("../../assets/images/pageIcon/how_we_do.png");
  background-size: 100% 100%;
  overflow-x: hidden;
  p {
    color: white;
  }
  .how-title {
    font-size: 28px;
    color: $success;
    text-align: left;
    padding: 0 19.5%;
  }
  .intList {
    padding: 0 19.5%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    height: auto;
    margin-top: 80px;
    li {
      width: 100%;
      height: 360px;
      position: relative;
      margin-bottom: 160px;
      display: flex;
      align-items: center;
      img {
        width: 480px;
        height: 360px;
        position: absolute;
        z-index: 100;
      }
      .intMsg {
        width: 530px;
        position: relative;
        z-index: 200;
        .intTitle {
          text-align: left;
          margin-bottom: 24px;
          color: white;
          font-size: 20px;
        }
        .intRemark {
          text-align: left;
          font-size: 14px;
          color: white;
          line-height: 24px;
        }
      }
    }
    li:nth-child(2) {
      justify-content: flex-end;
      .intMsg {
        width: 450px;
      }
    }
    li:last-child {
      .intMsg {
        top: 103px;
      }
    }
    li:nth-child(even) {
      img {
        left: 0;
      }
    }
    li:nth-child(odd) {
      img {
        right: -40px;
      }
    }
  }
  .bottom-show {
    padding: 0 19.5%;
  }
  .other-title {
    text-align: left;
    font-size: 20px;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 24px;
  }
  .other-remark {
    font-size: 14px;
    width: 100%;
    margin: 0 auto;
    text-align: left;
    margin-bottom: 80px;
    span {
      color: $success;
      margin: 0 4px;
    }
  }
  .remark-pc {
    line-height: 22px;
  }
  .other-title-two {
    font-size: 24px;
    font-weight: 500px;
    margin-bottom: 8px;
  }
  .proList {
    width: 100%;
    height: 203px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    li {
      width: 160px;
      height: 100%;
      font-size: 18px;
      box-sizing: border-box;
      padding-top: 36px;
      background: rgba(37, 52, 92, 0.8);
      border-radius: 4px;
      cursor: pointer;
      transition: 0.5s all;
      position: relative;
      color: white;
      img {
        width: 80px;
        height: 80px;
        margin-bottom: 14px;
      }
      img:nth-child(2) {
        position: absolute;
        left: 50%;
        margin-left: -40px;
        top: 36px;
        opacity: 0;
        transition: 0.5s all;
      }
      .other-size {
        font-size: 16px;
        line-height: 22px;
        padding: 0 16px;
      }
    }
    // li:hover{
    //   background: $themeColor;
    //   color:white;
    //   margin-top: -10px;
    //   box-shadow: 0px 10px 15px #ccc;
    //   img:first-child{
    //     opacity: 0;
    //   }
    //   img:nth-child(2){
    //     opacity: 1;
    //   }
    // }
  }
  .hasList {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 auto;
    margin-top: 80px;
    li {
      width: 25%;
      position: relative;
      text-align: left;
      box-sizing: border-box;
      padding-left: 87px;
      margin-bottom: 15px;
      font-size: 14px;
      color: white;
      white-space: nowrap;
      i {
        font-size: 16px;
        position: absolute;
        left: 60px;
        top: 0;
      }
    }
  }
  .more {
    width: 100%;
    margin: 0 auto;
    text-align: left;
    position: relative;
    box-sizing: border-box;
    padding-left: 87px;
    border-radius: 0;
    color: white;
    font-size: 14px;
    background: rgba(0, 0, 0, 0) !important;
    margin-bottom: 230px;
    .more-icon {
      width: 14px;
      height: 14px;
      background: $success;
      position: absolute;
      left: 62px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconfont {
        color: #707070;
        font-size: 12px;
        display: inline-block;
        transform: translateX(1px);
      }
    }
  }
}
@media screen and (min-width: 1280px) {
  .remark-mobile {
    display: none !important;
  }
}
@media screen and (max-width: 1279px) {
  .how-we-do {
    padding-top: 0;
    .how-title {
      padding: 0 $padd24;
      font-size: $fon18;
    }
    .intList {
      padding: 0 $padd24;
      margin-top: $padd40;
      li {
        flex-direction: column;
        margin-bottom: 7.5rem;
        .intMsg {
          width: 100% !important;
          .intTitle {
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          .intRemark {
            font-size: $fon12;
            line-height: $fon18;
          }
        }
        img {
          position: static;
          width: 16.8rem;
          height: 13rem;
          margin-top: $padd40;
        }
      }
      li:last-child {
        img {
          margin-top: 7rem;
        }
      }
    }
    .bottom-show {
      padding: 0;
    }
    .other-title {
      padding: 0 $padd24;
      font-size: 1rem;
    }
    .other-remark {
      padding: 0 $padd24;
      width: 100%;
      font-size: $fon12;
      line-height: $padd24;
      margin-bottom: 0;
    }
    .remark-pc {
      display: none;
    }
    .proList {
      display: none;
    }
    .hasList {
      display: none;
    }
    .more {
      display: none;
    }
  }
}
</style>
