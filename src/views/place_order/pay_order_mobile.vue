// 移动端支付订单
<template>
  <div
    class="pay-order-mobile"
    :class="app.isBureau == 1 && 'bureau-pay-order'"
  >
    <!-- <MobileNav>
      <p>订购支付</p>
    </MobileNav> -->
    <div class="view-inner-place">
      <!-- 标题 -->
      <div class="mobile-place-title">
        <p class="iconfont icon-xinxi_info"></p>
        <p>
          <!-- 请在确认信息无误后完成支付 -->
          {{ $t("pay_order.pay_remark") }}
        </p>
      </div>
      <!-- 订单信息 -->
      <div class="pay-msg">
        <img :src="require('@/assets/images/mobile/order.png')" alt="" />
        <p class="pay-msg-title">
          <!-- 您的订单已生成 -->
          {{ $t("pay_order.pay_title") }}
        </p>
        <div class="pay-msg-number">
          <p>
            <!-- 订单号： -->
            {{ $t("pay_order.order_number") }}
            <span>#{{ app.placeOrderMsg.id }}</span>
          </p>
          <p>
            <!-- 生成日期： -->
            {{ $t("pay_order.create_date") }}
            <span>{{ app.placeOrderMsg.create_time }}</span>
          </p>
        </div>
        <p class="pay-msg-other-title">
          <!-- 订购详情 -->
          {{ $t("place_order.msg_title") }}
        </p>
        <ul>
          <li>
            <p>
              <!-- 产品 -->
              {{ $t("place_order.msg_product") }}
            </p>
            <p>{{ app.placeOrderMsg.name }}</p>
          </li>
          <li>
            <p>
              <!-- 单价 -->
              {{ $t("place_order.msg_amount") }}
            </p>
            <p>
              {{
                (
                  (coinType == 2
                    ? app.placeOrderMsg.price1
                    : app.placeOrderMsg.price) / app.placeOrderMsg.num
                ).toFixed(2)
              }}
              {{
                (coinType == 0 && "USDT") ||
                (coinType == 1 && "USDC") ||
                (coinType == 2 && $t("public.coin")) ||
                (coinType == 3 && "USDT / USDC")
              }}
            </p>
          </li>
          <li>
            <p>
              <!-- 数量 -->
              {{ $t("place_order.msg_total") }}
            </p>
            <p>{{ app.placeOrderMsg.num }}</p>
          </li>
          <li>
            <p>
              <!-- 总计 -->
              {{ $t("place_order.all_total") }}
            </p>
            <p>
              {{
                coinType == 2
                  ? app.placeOrderMsg.price1
                  : app.placeOrderMsg.price
              }}
              {{
                (coinType == 0 && "USDT") ||
                (coinType == 1 && "USDC") ||
                (coinType == 2 && $t("public.coin")) ||
                (coinType == 3 && "USDT / USDC")
              }}
            </p>
          </li>
        </ul>
        <p class="pay-msg-other-title">
          <!-- 账户信息 -->
          {{ $t("mine_order.account_info") }}
        </p>
        <div class="contact-msg">
          <p>
            <!-- 手机： -->
            {{ $t("mine_order.mobile") }}
            <span>
              {{
                app.placeOrderMsg.mobile
                  ? app.placeOrderMsg.mobile.substr(0, 3) +
                    "****" +
                    app.placeOrderMsg.mobile.substr(7, 11)
                  : $t('public.un_write')
              }}
            </span>
          </p>
          <p>
            <!-- 邮箱： -->
            {{$t('mine_order.email')}}
            <span>{{ app.placeOrderMsg.email }}</span>
          </p>
        </div>
        <div class="pay-msg-type" v-if="false">
          <p class="pay-msg-other-title">
            <!-- 支付方式 -->
            {{$t('mine_order.pay_way')}}
          </p>
          <p>
            <span
              class="iconfont"
              :class="
                app.placeOrderMsg.pay_type == 3
                  ? 'icon-weixinzhifu'
                  : 'icon-USDT'
              "
              :style="{
                color: app.placeOrderMsg.pay_type == 3 ? '#09bb07' : '#1ba27a',
              }"
            ></span>
            {{ app.placeOrderMsg.pay_type == 3 ? $t('mine_order.wechat_pay') : "USDT-ERC20" }}
          </p>
        </div>
      </div>
      <PayTable
        ref="paytable"
        @choosePayType="changePayType"
        @chooseCoinType="changeCoinType"
        @openLoading="openLoading"
      />
      <!-- 支付信息 -->
      <div class="mobile-pay">
        <div class="mobile-pay-title">
          <p>
            <!-- 总计 -->
            {{$t('place_order.all_total')}}
          </p>
          <p>
            {{
              coinType == 2
                ? app.placeOrderMsg.price1
                : app.placeOrderMsg.price
            }}&nbsp;{{
              (coinType == 0 && "USDT") ||
              (coinType == 1 && "USDC") ||
              (coinType == 2 && $t('public.coin')) ||
              (coinType == 3 && "USDT / USDC")
            }}
          </p>
        </div>
        <p
          class="mobile-pay-line"
          v-if="coinType == 0 || coinType == 1 || coinType == 2"
        ></p>
        <p class="pay-tips" v-if="eth">
          <span>*</span>
          <!-- 使用链上支付请预留支付所需的手续费 -->
          {{$t('pay_order.chain_remark')}}
        </p>
        <p
          class="mobile-pay-btn"
          v-if="coinType == 0 || coinType == 1 || coinType == 2"
        >
          <base-button
            type="info"
            round
            @click="coinType == 2 ? payWechat() : $refs.paytable.payWallet()"
            :loading="payLoading"
            :disabled="payLoading"
            :class="app.isBureau == 1 && 'other-info'"
          >
            <i class="iconfont icon-shuaka_swipe"></i>
            <!-- 立即支付 -->
            {{$t('pay_order.pay_now')}}
          </base-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { wePay } from "@/request/api";
export default {
  name: "PayOrderMobile",
  data() {
    return {
      payLoading: false, //支付加载
      coinType: "0", //资产类型
      payType: 2, //支付类型
      payLink: null,
      eth: null,
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    PayTable: (resolve) => require(["./coms/pay_table"], resolve),
  },
  created() {
    const { ethereum } = window;
    this.eth = ethereum;
    ethereum ? (this.coinType = "0") : (this.coinType = "2");
    this.getPayUrl();
    // this.app.placeOrderMsg.pay_type == 3 && this.queryOrder();
  },
  methods: {
    //微信支付
    async payWechat() {
      const backUrl = encodeURIComponent(
        process.env.VUE_APP_RESET + "/#/pay-order-mobile?wechatBack=true"
      );
      window.open(this.payLink + `&redirect_url=${backUrl}`);
    },
    //获取微信支付链接
    async getPayUrl() {
      const result = await wePay({
        order_number: this.app.placeOrderMsg.order_number,
        trade_type: "MWEB",
      });
      this.payLink = result.data.code_url;
    },
    //支付方式选择
    changePayType(_type) {
      this.payType = _type;
    },
    //币种选择
    changeCoinType(_type) {
      this.coinType = _type;
    },
    //加载状态
    openLoading(_bool) {
      this.payLoading = _bool;
    },
  },
  beforeDestroy() {
    // window.clearSub()
    this.$refs.paytable.watchEtherLogCancel &&
      this.$refs.paytable.watchEtherLogCancel.unsubscribe();
    this.$refs.paytable.clearTime();
  },
};
</script>

<style lang="scss" scoped>
.view-inner-place {
  .mobile-place-title {
    padding: 1rem;
    background: $contentBg;
    border-radius: 4px;
    display: flex;
    align-items: center;
    font-size: $fon12;
    line-height: $fon18;
    margin-bottom: $fon14;
    p {
      color: white;
    }
    .iconfont {
      font-size: 0.93rem;
      margin-right: 1rem;
    }
  }
  .pay-msg {
    padding: $padd24;
    background: $contentBg;
    padding-top: 0;
    border-radius: 4px;
    text-align: center;
    img {
      width: $size48;
      height: $size48;
      margin-top: 3.75rem;
      margin-bottom: $padd24;
    }
    .pay-msg-title {
      font-size: 1rem;
      color: white;
      margin-bottom: 1rem;
    }
    .pay-msg-number {
      width: 100%;
      height: $padd24;
      border-radius: 1rem;
      background: $conBg2;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: $padd40;
      p {
        font-size: $fon12;
        color: $remarkColor;
        span {
          color: $textColor;
        }
      }
    }
    .pay-msg-other-title {
      font-size: $fon14;
      color: $textColor;
      text-align: left;
    }
    ul {
      margin-top: $padd24;
      margin-bottom: $padd40;
      li {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        p {
          font-size: $fon12;
          color: $remarkColor;
        }
        p:last-child {
          color: white;
        }
      }
      .line {
        width: 100%;
        height: 1px;
        background: $lineTwoColor;
        margin: $padd24 0;
      }
    }
    .contact-msg {
      width: 100%;
      padding: $fon12 1rem;
      background: $conBg2;
      border-radius: 4px;
      margin-top: 1rem;
      margin-bottom: $padd40;
      p {
        margin-bottom: $fon12;
        text-align: left;
        font-size: $fon12;
        color: $remarkColor;
        span {
          color: $textColor;
        }
      }
      p:last-child {
        margin-bottom: 0;
      }
    }
    .pay-msg-type {
      display: flex;
      align-items: center;
      .iconfont {
        margin-left: $padd24;
        font-size: $padd24;
        margin-right: 0.5rem;
      }
      p {
        font-size: $fon14;
        color: white;
      }
      p:last-child {
        display: flex;
        align-items: center;
      }
      .icon-weixinzhifu {
        color: #09bb07;
      }
      .icon-USDT {
        color: #1ba27a;
      }
    }
  }
  .mobile-pay {
    padding: $padd24;
    background: $contentBg;
    margin-top: 1rem;
    margin-bottom: $padd40;
    border-radius: 4px;
    .mobile-pay-title {
      display: flex;
      justify-content: space-between;
      p {
        font-size: $fon14;
        color: $textColor;
      }
      p:last-child {
        font-size: 1rem;
        color: $success;
      }
    }
    .mobile-pay-line {
      width: 100%;
      height: 1px;
      background: $lineTwoColor;
      margin: $padd24 0;
    }
    .pay-tips {
      font-size: 0.81rem;
      color: $remarkColor;
      margin: $fon12 0;
    }
    button {
      width: 100%;
    }
  }
}
.bureau-pay-order {
  padding: 1rem $fon14;
}
</style>