<template>
  <!-- 新币速递 -->
  <div class="coin-tent">
    <div class="top-content">
      <div
        @click="
          data.permission == 1
            ? goPDF($flag ? data.mobile_pdf : data.pdf, 3, data.id)
            : null
        "
      >
        <div class="coin-msg">
          <img :src="data.logo_image" alt="" />
          <div class="msg-name">
            <p class="h4">{{ data.symbol }}</p>
            <p class="h5">{{ data.title }}</p>
          </div>
        </div>
        <div class="coin-race">
          <p
            v-for="(raceList, indexL) in data.race"
            :key="indexL"
            @click.stop="goSearch(raceList)"
            style="cursor: pointer"
            class="h5"
          >
            {{ raceList }}
          </p>
          <p class="price-box" v-if="data.publish_price">
            <!-- 研报发布时 -->
            {{ $t("project_interface.reports_release") }}
            &nbsp;$&nbsp;{{ data.publish_price }}
          </p>
          <p class="price-box" v-else>
            <!-- 发布时尚未发币 -->
            {{ $t("coin.un_coin") }}
          </p>
        </div>
        <p class="coin-text">{{ data.content }}</p>
        <!-- 官网信息 -->
        <div class="officila-box">
          <p @click.stop="officilaView" class="officila-btn">
            <span class="iconfont icon-diqiuyi_earth"></span>
            <!-- 官网 -->
            {{ $t("coin.coin_website") }}
          </p>
          <div style="display: flex">
            <div
              class="officila-com"
              v-for="(off, i) in data.community"
              :key="i"
              @click.stop="comView(off)"
            >
              <div
                v-if="
                  i == 'Discord' ||
                  i == 'Reddit' ||
                  i == 'Twitter' ||
                  i == 'Facebook' ||
                  i == 'Telegram'
                "
              >
                <svg class="icon" aria-hidden="true" v-if="i == 'Discord'">
                  <use xlink:href="#icon-discord"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="i == 'Reddit'">
                  <use xlink:href="#icon-Reddit"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="i == 'Twitter'">
                  <use xlink:href="#icon-twitter"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="i == 'Facebook'">
                  <use xlink:href="#icon-facebook"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="i == 'Telegram'">
                  <use xlink:href="#icon-telegram"></use>
                </svg>
              </div>
              <el-popover
                v-else
                v-model="noRemarkOfficial"
                placement="top"
                trigger="hover"
                :content="i"
              >
                <p class="other-com" slot="reference">
                  <span class="iconfont icon-renqun_peoples-two"></span>
                </p>
              </el-popover>
            </div>
          </div>
        </div>
      </div>

      <div class="coin-date">
        <p class="h5">{{ data.publish_time }}</p>
        <div class="read-pdf">
          <el-popover
            placement="bottom"
            trigger="hover"
            v-model="noRemarkReport"
            v-if="!$flag && data.project_info"
          >
            <ul class="view-choice">
              <li @click.stop="withPro(data.project_info)">
                <!-- 查看调研报告 -->
                {{ $t("coin.view_report") }}
              </li>
              <li></li>
              <li
                @click.stop="
                  downPDF(data.project_info.pdf, 1, data.project_info.id)
                "
              >
                <!-- 下载调研报告 -->
                {{ $t("coin.down_report") }}
              </li>
            </ul>
            <p slot="reference" class="other-pdf">
              <i class="iconfont icon-shuqian_bookmark-one"></i>
            </p>
          </el-popover>
          <el-popover
            placement="bottom"
            trigger="hover"
            v-if="$flag && data.project_info"
            v-model="noRemarkInfo"
          >
            <ul class="view-choice">
              <li @click.stop="withPro(data.project_info)">
                <!-- 查看调研报告 -->
                {{ $t("coin.view_report") }}
              </li>
              <li></li>
              <li
                @click.stop="
                  downPDF(data.project_info.pdf, 1, data.project_info.id)
                "
              >
                <!-- 下载调研报告 -->
                {{ $t("coin.down_report") }}
              </li>
            </ul>
            <!-- @click="goPDF($flag ? data.mobile_pdf : data.pdf, 1, data.id)" -->
            <base-button type="default" class="not-sure" slot="reference" round>
              <!-- 研报 -->
              {{
                $flag
                  ? $t("bureau_track.report_mobile")
                  : $t("bureau_track.report")
              }}
            </base-button>
          </el-popover>
          <el-popover
            placement="bottom"
            trigger="hover"
            v-model="noRemarkChoice"
          >
            <ul class="view-choice">
              <li
                @click.stop="
                  goPDF($flag ? data.mobile_pdf : data.pdf, 3, data.id)
                "
              >
                <!-- 查看新币速递 -->
                {{ $t("coin.view_coin_report") }}
              </li>
              <li></li>
              <li @click.stop="downPDF(data.pdf, 3, data.id)">
                <!-- 下载新币速递 -->
                {{ $t("coin.down_coin_report") }}
              </li>
            </ul>
            <!-- @click="goPDF($flag ? data.mobile_pdf : data.pdf, 1, data.id)" -->
            <base-button type="default" slot="reference" round>{{
              $t("public.read")
            }}</base-button>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="hot-icon" v-if="data.is_recommend == 1">
      <img
        :src="
          app.language == 'en'
            ? require('@/assets/images/hotCoin_en.png')
            : require('@/assets/images/hotCoin.png')
        "
        alt=""
      />
    </div>
    <div class="back-box" v-if="data.is_recommend == 1">
      <img :src="require('@/assets/images/coinHotbg.png')" alt="" />
    </div>
    <!-- 无权限 -->
    <NoPermission v-if="data.permission == 0" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "CoinComs",
  props: ["data"],
  data() {
    return {
      noRemarkOfficial: false,
      noRemarkReport: false,
      noRemarkInfo: false,
      noRemarkChoice: false,
    };
  },
  components: {
    NoPermission: (resolve) => require(["./no_permission"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  mounted() {
    this.$flag && window.addEventListener("scroll", this.closeTooltip, true);
  },
  methods: {
    //查看PDF
    goPDF(_url, _type, _id) {
      this.$store.dispatch("setPoint", 12);
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      // console.log(this.$flag && this.$cell)
      !this.$flag
        ? this.$store.dispatch("viewPDF", _url)
        : this.$cell
        ? this.$store.dispatch("viewPDF", _url)
        : window.viewPDF(_url);
    },
    goSearch(_val) {
      window.goSearch(_val);
    },
    //官网
    officilaView() {
      window.open(this.data.homepage);
    },
    //舍弃
    comView(_url) {
      window.open(_url);
    },
    //研报
    withPro(_msg) {
      this.$store.dispatch("readPDF", { _type: 1, _id: _msg.id });
      const panel = () => {
        this.$store.commit("upProjectID", _msg.id);
        this.$router.push({
          path: this.$flag
            ? "/mobile-project-details"
            : "/project/projectDetails",
          query: {
            id: _msg.id,
            name: _msg.symbol,
          },
        });
      };
      const pdf = () => {
        // const is_old = !_msg.is_new_pdf ? 1 : _msg.is_new_pdf == 1 ? 0 : 1;
        !this.$flag
          ? this.$store.dispatch(
              "viewPDF",
              this.$flag ? _msg.mobile_pdf : _msg.pdf
            )
          : this.$cell
          ? this.$store.dispatch(
              "viewPDF",
              this.$flag ? _msg.mobile_pdf : _msg.pdf
            )
          : window.viewPDF(this.$flag ? _msg.mobile_pdf : _msg.pdf);
      };
      // _msg.is_attention == 1 ? panel() : ;
      pdf();
    },
    //下载研报
    downPDF(_url, _type, _id) {
      window.PDFLock(_type, _id, this.$flag ? 2 : 1, 1);
    },
    //关闭Tooltip
    closeTooltip() {
      this.noRemarkOfficial = false;
      this.noRemarkReport = false;
      this.noRemarkInfo = false;
      this.noRemarkChoice = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.coin-tent {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  margin-bottom: 24px;
  // max-width: 415px;
  position: relative;
  overflow: hidden;
  .top-content {
    position: relative;
    z-index: 200;
  }
  @keyframes backAnimate {
    0% {
      transform: translateX(-440px);
    }
    50% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-440px);
    }
  }
  .hot-icon {
    position: absolute;
    width: 140px;
    height: 120px;
    z-index: 121;
    top: 0;
    right: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .back-box {
    position: absolute;
    width: 1176px;
    height: 100%;
    z-index: 100;
    top: 0;
    left: 0;
    animation: backAnimate 15s linear infinite;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .coin-msg {
    display: flex;
    img {
      width: 60px;
      height: 60px;
      border-radius: 4px;
    }
    .msg-name {
      margin-left: 16px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .h4 {
        margin: 0;
        color: $success;
      }
      .h5 {
        margin: 0;
        color: $textColor;
        margin-bottom: 3px;
      }
    }
  }
  .coin-race {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    height: 20px;
    p {
      margin-bottom: 0;
      margin-right: 8px;
      color: $success;
      background: rgba(167, 240, 186, 0.1);
      padding: 1px 7px;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .price-box {
      font-size: 12px;
      display: flex;
      align-items: center;
      background: rgba(255, 212, 92, 0.1);
      color: #ffd45c;
    }
  }
  .coin-text {
    margin: 40px 0;
    line-height: 24px;
    font-size: 12px;
    color: $remarkColor;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    min-height: 72px;
  }
  .officila-box {
    width: 120%;
    margin-left: -10%;
    padding: 0 32px;
    display: flex;
    border-bottom: 1px solid $mineBg;
    padding-bottom: 24px;
    margin-bottom: 16px;
    .officila-btn {
      padding: 0 12px;
      border-radius: 20px;
      height: 24px;
      display: flex;
      align-items: center;
      background: $conBg2;
      cursor: pointer;
      color: white;
      font-size: 13px;
      .iconfont {
        margin-right: 3px;
        color: $remarkColor;
        font-size: 15px;
      }
    }
    .officila-com {
      display: flex;
      .other-com {
        margin-left: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: $contentBg;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
          font-size: 16px;
          color: $contentBg;
          color: white;
          cursor: pointer;
        }
      }
      .icon {
        margin-left: 8px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
  }
  .coin-date {
    display: flex;
    width: 100%;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    .h5 {
      margin: 0;
      color: $remarkColor;
    }
    .read-pdf {
      display: flex;
      align-items: center;
      .not-sure {
        margin-right: 1rem;
      }
      .other-pdf {
        display: inline-block;
        width: 40px;
        height: 40px;
        background: $info;
        margin-right: 16px;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        cursor: pointer;
        i {
          font-size: 22px;
          color: white;
        }
      }
    }
  }
}
@media screen and (max-width: 1279px) {
  .coin-tent {
    padding: 1rem;
    margin-bottom: 1rem;
  }
}
@media screen and (max-width: 1600px) {
  .coin-tent {
    max-width: none;
  }
}
</style>