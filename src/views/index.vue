<template>
  <div class="Index">
    <Nav ref="nav" />
    <div class="swiper-container index-page" v-if="!$flag">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <Screen />
        </div>
        <div class="swiper-slide">
          <WhoWe />
        </div>
        <div class="swiper-slide">
          <WeDo />
        </div>
        <div class="swiper-slide">
          <Inve />
        </div>
        <div class="swiper-slide">
          <HowWeDo @openMouse="openMouse" @closeMouse="closeMouse" />
        </div>
        <div class="swiper-slide">
          <WeGrades ref="we_grades" />
        </div>
        <div class="swiper-slide">
          <MealPage @openLogin="openLogin" />
        </div>
        <div class="swiper-slide">
          <ContactUs />
        </div>
      </div>
    </div>
    <div class="index-page-mobile" v-else>
      <div class="mobile-slide">
        <Screen />
      </div>
      <div class="mobile-slide how-we-do">
        <WhoWe />
      </div>
      <div class="mobile-slide">
        <WeDo />
      </div>
      <div class="mobile-slide how-we-do">
        <Inve />
      </div>
      <div class="mobile-slide how-we-do">
        <HowWeDo />
      </div>
      <div class="mobile-slide">
        <WeGrades />
      </div>
      <div class="mobile-slide">
        <MealPage @openLogin="openLogin" />
      </div>
      <div class="mobile-slide how-we-do">
        <ContactUs />
      </div>
    </div>
    <!-- Back-top -->
    <div
      class="back-top"
      @click="changeSw(-1)"
      :style="{ opacity: showTop ? '1' : '0' }"
    >
      <p class="iconfont icon-shang_up"></p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Index",
  data() {
    return {
      resSwiper: null,
      showTop: false,
      activeIndex:null,
    };
  },
  components: {
    Nav: (resolve) => require(["@/comsmine/nav_header"], resolve),
    //首屏
    Screen: (resolve) => require(["./page/screen"], resolve),
    //我们是谁
    WhoWe: (resolve) => require(["./page/who_we"], resolve),
    //我们做什么
    WeDo: (resolve) => require(["./page/we_do"], resolve),
    //投资观
    Inve: (resolve) => require(["./page/inve"], resolve),
    //我们怎么做
    HowWeDo: (resolve) => require(["./page/how_we_do"], resolve),
    //我们的成绩
    WeGrades: (resolve) => require(["./page/we_grades"], resolve),
    //套餐列表
    MealPage: (resolve) => require(["./page/meal_page"], resolve),
    //联系我们
    ContactUs: (resolve) => require(["./page/contact_us"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.$route.name == "Index" && this.$store.commit("upHeader", "");
  },
  mounted() {
    window.changeSw = this.changeSw;
    !this.$flag && this.initSwiper();
  },
  watch:{
    activeIndex(val){
      val == 4 && this.resSwiper.mousewheel.disable();
    }
  },
  methods: {
    openLogin() {
      this.$refs.nav.phoneLogin();
    },
    //图表重置SIZE
    resizeEcharts() {
      this.$refs.we_grades.gradesBox.resize();
    },
    changeSw(index) {
      this.resSwiper.slideToLoop(index + 1, 1000, false);
      for (let i in this.app.navDom) {
        this.app.navDom[i].className = "";
      }
      if (index != 7 && index != -1 && index != 5) {
        this.app.navDom[index].className = "active-item";
      } else if (index == 5) {
        this.app.navDom[this.app.navDom.length - 1].className = "active-item";
      } else if (index != -1) {
        this.app.navDom[index - 4].className = "active-item";
      }
    },
    openMouse() {
      !this.$flag && this.resSwiper.mousewheel.enable();
    },
    closeMouse() {
      !this.$flag && this.resSwiper.mousewheel.disable();
    },
    initSwiper() {
      let _this = this;
      this.$nextTick(() => {
        setTimeout(() => {
          this.resSwiper = new Swiper(".index-page", {
            direction: "vertical",
            followFinger: false,
            speed: 800,
            mousewheel: true,
            keyboard: {
              enabled: true,
            },
            on: {
              slideChangeTransitionStart: function (swiper) {
                let current = this.activeIndex;
                _this.activeIndex = this.activeIndex;
                current == 0 && _this.$store.commit("upHeader", "");
                current == 1 && _this.$store.commit("upHeader", "hasGround");
                current == 2 && _this.$store.commit("upHeader", "hasGround");
                current == 3 && _this.$store.commit("upHeader", "hasGround");
                current == 5 && _this.$store.commit("upHeader", "hasGround");
                current == 7 && _this.$store.commit("upHeader", "hasGround");
                current == 8 && _this.$store.commit("upHeader", "hasGround");

                for (let i in _this.app.navDom) {
                  _this.app.navDom[i].className = "";
                }
                current != 0 ? (_this.showTop = true) : (_this.showTop = false);
                switch (current) {
                  case 1:
                    _this.app.navDom[current - 1].className = "active-item";
                    break;
                  case 2:
                    _this.app.navDom[current - 1].className = "active-item";
                    break;
                  case 3:
                    _this.app.navDom[current - 1].className = "active-item";
                    break;
                  case 6:
                    _this.app.navDom[_this.app.navDom.length - 1].className =
                      "active-item";
                    break;
                  case 7:
                    _this.app.navDom[_this.app.navDom.length - 2].className =
                      "active-item";
                    break;
                }
                if (current == 4) {
                  // console.log(swiper);
                  // console.log(swiper.mousewheel);
                  // _this.closeMouse()
                  // swiper.mousewheel.disable();
                  // swiper.autoplay.stop();
                  // swiper.stopAutoplay()
                }
              },
            },
            pagination: {
              el: ".menu-list",
              clickable: true,
              type: "custom",
              // renderCustom: function (swiper,current) {
              //   console.log(current);
              //   current == 5 && swiper.mousewheel.disable();
              // },
            },
          });
        }, 100);
      });
    },
  },
  destroyed() {
    // window.removeEventListener("resize", this.resizeEcharts, true);
  },
};
</script>

<style lang="scss" scoped>
.hasGround {
  top: 0 !important;
  height: calc(100vh - 80px) !important;
}
@media screen and (max-width: 1279px) {
  
  .back-top {
    display: none !important;
  }
}
.index-page-mobile {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .mobile-slide {
    height: 100vh;
  }
  .how-we-do {
    height: auto;
  }
}
.swiper-container {
  transition-delay: 0.3s;
  // position: absolute;
  width: 100%;
  margin-top: -80px;
  padding: 0;
  height: 100vh;
}
.swiper-wapper {
  width: 100%;
  height: 100vh;
}
.swiper-slide {
  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  display: -webkit-flex;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -ms-flex-align: center;
}
.nav-item {
  position: relative;
  z-index: 200;
}
.back-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  cursor: pointer;
  transition: 0.3s all;
  p {
    font-size: 20px;
  }
}
</style>
