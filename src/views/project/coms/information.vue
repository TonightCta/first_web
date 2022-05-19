<template>
  <div class="details-box">
    <div class="details-left">
      <div class="details-left-top">
        <div class="title-msg">
          <p class="h4">
            <!-- 基本数据 -->
            {{ $t("project_interface.info") }}
          </p>
          <p class="h4" v-if="info.info">
            Rank
            <span class="title-number">#{{ info.info.market_cap_rank }}</span>
          </p>
        </div>
        <!-- 价格信息 -->
        <p class="h5 price-title">
          <!-- 价格 -->
          {{ $t("project_info.price") }}
          (5min)
        </p>
        <div class="price-box">
          <p class="h1" v-if="info.info">$ {{ info.info.price }}</p>
          <p
            class="h3"
            v-if="info.info"
            :style="{
              color:
                info.info.price_change_percentage > 0 ? '#a7f0ba' : '#FF6B6B',
            }"
          >
            {{ info.info.price_change_percentage > 0 ? "+" : ""
            }}{{ info.info.price_change_percentage }}%
            <span
              >(
              <!-- 研报发布时： -->
              {{ $t("project_interface.reports_release") }}
              <font>$ {{ info.publish_price }} </font>)</span
            >
          </p>
        </div>
        <p class="h5 release-price">
          (
          <!-- 研报发布时： -->
          {{ $t("project_interface.reports_release") }}
          <span>${{ info.publish_price }}</span
          >)
        </p>
        <!-- 交易量 -->
        <div class="trade-msg" v-if="info.info">
          <div>
            <p class="h5">
              <!-- 24小时交易： -->
              {{ $t("project_interface.trade_hour") }}&nbsp;
            </p>
            <p class="h4">$ {{ info.info.hours_vol }}</p>
          </div>
          <div>
            <p class="h5">
              <!-- 总市值： -->
              {{ $t("project_interface.all_trade") }}&nbsp;
            </p>
            <p class="h4">$ {{ info.info.total_cap }}</p>
          </div>
        </div>
        <!-- 流通量 -->
        <div
          class="tion-box"
          :class="app.language == 'en' && 'tion-box-en'"
          v-if="info.info"
        >
          <div class="">
            <p>
              <!-- 流通市值 -->
              {{ $t("project_interface.cap_trade") }}
            </p>
            <p class="h4">$ {{ info.info.market_cap }}</p>
          </div>
          <p class="tion-line" v-if="info.content"></p>
          <div class="" v-if="info.content && info.content.length == 2">
            <p>
              {{
                app.language == "en"
                  ? `Market cap. of estimated circulating supply on ${ app.language == 'en' ? info.content[0].timer : info.content[0].timer.substr(
                      5,
                      10
                    ) }`
                  : `${info.content[0].timer.substr(5, 10)}估算流通量的对应市值`
              }}
            </p>
            <p class="h4">$ {{ info.content[0].supply }}</p>
          </div>
          <p class="tion-line" v-if="info.content"></p>
          <div class="" v-if="info.content">
            <p>
              {{
                app.language == "en"
                  ? `Market cap. of estimated circulating supply on ${info.content[1].timer}`
                  : `${info.content[1].timer}估算流通量的对应市值`
              }}
            </p>
            <p class="h4">$ {{ info.content[1].supply }}</p>
          </div>
        </div>
      </div>
      <div class="details-left-bottom" v-if="info.info">
        <p class="h3">
          <!-- 头等仓观点 -->
          {{ $t("project_interface.first_view") }}
          (<label>{{ info.desc_time }}</label
          >)
          <span></span>
        </p>
        <el-popover
          placement="top"
          :title="$t('project_interface.first_view')"
          :width="$flag ? 320 : 400"
          trigger="hover"
          :content="info.desc_full"
          v-if="info.desc_full"
        >
          <p class="h4 text-overflow" slot="reference" style="cursor: pointer">
            {{ info.desc }}
          </p>
        </el-popover>
        <p class="h4" v-else>{{ info.desc }}</p>
        <img :src="require('@/assets/images/proIcon.png')" alt="" />
      </div>
    </div>
    <div class="details-right" v-if="info.info">
      <p class="h4">
        <!-- 基本信息 -->
        {{ $t("project_interface.info_2") }}
      </p>
      <div class="right-msg">
        <p class="h5" style="min-width: 5rem">
          <!-- 官网 -->
          {{ $t("project_interface.website") }}
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: flex-end">
          <p
            class="h5 msg-box"
            @click="goView(view)"
            v-for="(view, indexView) in info.info.website"
            :key="indexView"
            style="margin-bottom: 8px; margin-left: 8px"
          >
            <span
              class="iconfont icon-lianjie_link-one"
              style="margin-left: 0"
            ></span>
            {{ indexView }}
          </p>
        </div>
      </div>
      <div class="right-msg" v-if="info.info.announcement">
        <p class="h5" style="min-width: 5rem">
          <!-- 官方博客 -->
          {{ $t("project_interface.website_blog") }}
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: flex-end">
          <p
            class="h5 msg-box"
            @click="goView(viewBo)"
            v-for="(viewBo, indexViewBo) in info.info.announcement"
            :key="indexViewBo"
            style="margin-bottom: 8px; margin-left: 8px"
          >
            <span
              class="iconfont icon-lianjie_link-one"
              style="margin-left: 0"
            ></span>
            {{ indexViewBo }}
          </p>
        </div>
      </div>
      <div class="right-msg" v-if="info.info.contract">
        <p class="h5 right-title-inner">
          <!-- 合约地址 -->
          {{ $t("project_interface.contract_address") }}
        </p>
        <div class="other-icon">
          <p class="h5 msg-box">
            <svg
              class="icon"
              aria-hidden="true"
              style="width: 14px; height: 14px; margin-right: 8px"
            >
              <use xlink:href="#icon-Ethereum"></use>
            </svg>
            {{ info.info.contract.substr(0, 4) }}
            ...
            {{ info.info.contract.substr(38, 4) }}
            <span
              class="iconfont icon-fuzhi_copy copy"
              :data-clipboard-text="info.info.contract"
              @click="copyAddress"
              style="margin-right: 0"
            ></span>
          </p>
          <p class="more-icon" v-if="false">
            <span class="iconfont icon-gengduo_more"></span>
          </p>
        </div>
      </div>
      <div class="right-msg">
        <p class="h5 right-title-inner">
          <!-- 浏览器 -->
          {{ $t("project_interface.browser") }}
        </p>
        <div class="other-icon">
          <p
            class="h5 msg-box"
            v-for="(brower, indexBrower) in info.info.explorers"
            :key="indexBrower"
            style="margin-bottom: 8px; margin-left: 8px"
            @click="goView(brower)"
          >
            {{ indexBrower }}
          </p>
        </div>
      </div>
      <div class="right-msg" style="margin-top: -6px">
        <p class="h5 right-title-inner">
          <!-- 历史K线 -->
          {{ $t("project_interface.history_k") }}
        </p>
        <p class="h5 msg-box" @click="goKView">
          <span
            class="iconfont icon-gushi_stock-market1"
            style="margin-left: 0"
          ></span>
          <!-- 查看K线图 -->
          {{ $t("project_interface.view_k") }}
        </p>
      </div>
      <div class="right-msg">
        <p class="h5 right-title-inner">
          <!-- 十大交易所上线数 -->
          {{ $t("project_interface.exchange") }}
          <el-popover placement="bottom" width="368" trigger="hover">
            <div class="exchange-box">
              <ul>
                <li
                  v-for="(exChange, indexEx) in info.exchanges"
                  :key="indexEx"
                >
                  <p>{{ indexEx + 1 }}</p>
                  <img :src="exChange.logo" alt="" />
                  <p>{{ exChange.name }}</p>
                </li>
              </ul>
              <p class="change-line"></p>
              <p class="change-remark">
                <!-- 前十交易所是以币种深度、交易对数量、成交量以及知名度来综合排序，头等仓未收取这些交易所任何费用做任何推荐 -->
                {{ $t("project_interface.exchange_remark") }}
              </p>
            </div>
            <span class="iconfont icon-bangzhu_help" slot="reference"></span>
          </el-popover>
        </p>
        <p class="h5" style="height: 24px; color: white; line-height: 24px">
          {{ info.info.exchange_number }}
        </p>
      </div>
      <div class="right-msg">
        <p class="h5 right-title-inner">
          <!-- 交易对数量 -->
          {{ $t("project_interface.trade_num") }}
        </p>
        <p class="h5" style="height: 24px; color: white; line-height: 24px">
          {{ info.info.trading_number }}
        </p>
      </div>
      <div class="right-msg">
        <p class="h5 right-title-inner">
          <!-- 社群 -->
          {{ $t("project_interface.com") }}
        </p>
        <div class="other-icon-inner">
          <div
            class="iconfont"
            v-for="(mu, indexMu) in info.info.community"
            :key="indexMu"
            @click="goView(mu)"
          >
            <div
              v-if="
                indexMu == 'Discord' ||
                indexMu == 'Reddit' ||
                indexMu == 'Twitter' ||
                indexMu == 'Facebook' ||
                indexMu == 'Telegram'
              "
            >
              <svg class="icon" aria-hidden="true" v-if="indexMu == 'Discord'">
                <use xlink:href="#icon-discord"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-if="indexMu == 'Reddit'">
                <use xlink:href="#icon-Reddit"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-if="indexMu == 'Twitter'">
                <use xlink:href="#icon-twitter"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-if="indexMu == 'Facebook'">
                <use xlink:href="#icon-facebook"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-if="indexMu == 'Telegram'">
                <use xlink:href="#icon-telegram"></use>
              </svg>
            </div>
            <p v-else>{{ indexMu }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { mapState } from "vuex";
export default {
  props: ["info"],
  name: "Information",
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    //查看历史K线图
    goKView() {
      window.open(this.info.tradingview_address);
    },
    //项目官网
    goView(_url) {
      window.open(_url);
    },
    //复制邀请码
    copyAddress() {
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          //复制成功
          message: this.$t("notify.copy_success"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          //复制失败
          message: this.$t("notify.copy_falied"),
        });
        clipboard.destroy();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.h4,
.h5,
.h1,
.h3 {
  margin-bottom: 0;
  color: white;
}
.details-box {
  display: flex;
  width: 100%;
  justify-content: space-between;
  // height: 470px;
  margin-top: 24px;
  .details-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .details-left-top {
      flex: 1;
      background: $contentBg;
      border-radius: 4px;
      padding: 24px;
      .title-msg {
        display: flex;
        justify-content: space-between;
        .title-number {
          padding: 4px 16px;
          background: $conBg2;
          border-radius: 4px;
          margin-left: 16px;
        }
      }
      .price-title {
        margin-top: 40px;
        color: $remarkColor;
      }
      .price-box {
        display: flex;
        margin-top: 4px;
        height: 40px;
        .h1 {
          color: white;
          line-height: 40px;
        }
        .h3 {
          line-height: 48px;
          color: $success;
          margin-left: 8px;
          span {
            font-size: 13px;
            color: $remarkColor;
            font {
              color: white;
            }
          }
        }
      }
      .release-price {
        font-size: $fon12;
        margin-top: 0.3rem;
        color: $remarkColor;
        span {
          color: white;
        }
      }
      .trade-msg {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        div {
          margin-right: 40px;
          display: flex;
          height: 24px;
          align-items: center;
        }
        .h5 {
          color: $remarkColor;
          display: flex;
        }
      }
      .tion-box {
        display: flex;
        margin-top: 40px;
        flex-wrap: wrap;
        align-items: center;
        p {
          font-size: 12px;
          color: $remarkColor;
          max-width: 240px;
          word-break: kepp-all;
          line-height: 14px;
        }
        .h4 {
          font-size: 17px;
          color: white;
          line-height: 40px;
          margin-top: 4px;
          
        }
        .tion-line {
          height: 46px;
          width: 1px;
          background: $lineTwoColor;
          margin: 0 48px;
        }
      }
      .tion-box-en {
        .h4 {
          line-height: 20px;
        }
      }
    }
    .details-left-bottom {
      height: 100px;
      margin-top: 24px;
      background: $contentBg;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px;
      position: relative;
      width: 100%;
      .h3 {
        font-size: 17px;
        color: $remarkColor;
        position: relative;
        padding-left: 20px;
        // margin-bottom: 12px;
        label {
          font-size: 13px !important;
          color: $success;
          display: inline-block;
          transform: translateY(-1px);
        }
        span {
          display: inline-block;
          width: 4px;
          height: 16px;
          background: $success;
          position: absolute;
          left: 0;
          top: 3px;
        }
      }
      .h4 {
        padding-left: 20px;
        font-size: 13px;
        max-width: 820px;
        width: 80%;
        position: relative;
        z-index: 200;
      }
      img {
        height: 100px;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 100;
      }
    }
  }
  .details-right {
    max-width: 512px;
    background: $contentBg;
    margin-left: 30px;
    border-radius: 4px;
    padding: 24px;
    padding-bottom: 36px;
    .h4 {
      margin-bottom: 40px;
    }
    .right-msg {
      display: flex;
      margin: 24px 0;
      justify-content: space-between;
      .h5 {
        color: $remarkColor;
        line-height: 24px;
      }
      .right-title-inner {
        min-width: 130px;
        .iconfont {
          font-size: 15px;
          margin-left: 8px;
          display: inline-block;
          transform: translateY(1px);
          color: $textColor;
          cursor: pointer;
        }
      }
      .other-icon {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        .more-icon {
          width: 24px;
          height: 24px;
          background: $conBg2;
          margin-left: 8px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
      .other-icon-inner {
        min-height: 24px;
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        .iconfont {
          font-size: 24px;
          cursor: pointer;
          margin-left: 16px;
          .icon {
            width: 24px;
            height: 24px;
          }
          p {
            font-size: 12px;
            height: 24px;
            padding: 0 8px;
            background: $conBg2;
            border-radius: 12px;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(4px);
          }
        }
        .iconfont:last-child {
          margin-right: 0;
        }
      }
      .msg-box {
        color: white;
        height: 24px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $conBg2;
        border-radius: 12px;
        cursor: pointer;
        .iconfont {
          font-size: 14px;
          color: $remarkColor;
          margin: 0 8px;
        }
      }
    }
    .right-msg:last-child{
      margin-bottom: 0;
    }
  }
}
.exchange-box {
  overflow: hidden;
  ul {
    display: flex;
    flex-wrap: wrap;
    max-height: 200px;
    overflow-y: auto;
    margin-left: 12px;
    margin-top: 20px;
    li {
      width: 50%;
      display: flex;
      height: 24px;
      align-items: center;
      margin-bottom: 16px;
      img {
        width: 24px;
        height: 24px;
        border: 1px soldi $textColor;
        border-radius: 50%;
      }
      p {
        color: $titleColor;
        font-size: 12px;
      }
      p:first-child {
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        background: $textColor;
        border-radius: 4px;
        margin-right: 16px;
      }
      p:last-child {
        margin-left: 8px;
      }
    }
  }
  .change-line {
    width: 100%;
    height: 1px;
    background: $textColor;
    margin: 24px 12px;
  }
  .change-remark {
    color: #676c7a;
    font-size: 12px;
    line-height: 24px;
    margin: 0 12px;
  }
}
@media screen and (min-width: 1280px) {
  .release-price {
    display: none;
  }
}
@media screen and (max-width: 1279px) {
  .details-box {
    flex-direction: column;
    min-height: 75rem;
    .details-left {
      .details-left-top {
        padding: 1rem;
        .title-msg {
          .h4 {
            font-size: 1rem;
          }
          p:last-child {
            font-size: $fon14;
          }
        }
        .price-title {
          margin-top: $padd40;
          font-size: $fon12;
        }
        .price-box {
          p {
            font-size: 2rem;
          }
          .h3 {
            font-size: 1.4rem;
            transform: translateY(-1px);
            span {
              display: none;
            }
          }
        }
        .trade-msg {
          .h5 {
            font-size: $fon12;
          }
          p {
            font-size: $fon14;
          }
        }
        .tion-box {
          flex-direction: column;
          align-items: flex-start;
          .tion-line {
            display: none;
          }
          div {
            margin-top: 1rem;
            .h4 {
              font-size: $fon14;
              line-height: normal;
            }
          }
          div:first-child {
            margin-top: 0;
          }
        }
      }
      .details-left-bottom {
        min-height: 6.25rem;
        height: auto;
        padding: 1rem;
        .h3 {
          font-size: $fon12;
          padding-left: $fon14;
          span {
            height: $fon12;
            top: 2px;
          }
        }
        .h4 {
          width: 100%;
          padding-left: $fon14;
          line-height: 1.3rem;
          text-align: justify;
        }
        img {
          display: none;
        }
      }
    }
    .details-right {
      margin-left: 0;
      width: 100%;
      min-width: 0;
      margin-top: 1rem;
      padding:$padd24;
      .right-msg{
        white-space: nowrap;
      }
    }
  }
}
</style>