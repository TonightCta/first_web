<template>
  <div class="pay-order">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 请在确认信息无误后完成支付 -->
        {{ $t("pay_order.pay_remark") }}
      </p>
    </div>
    <div class="pay-msg">
      <div class="msg-content">
        <p class="iconBox">
          <img :src="require('@/assets/images/creatOrder.png')" alt="" />
        </p>
        <p class="h2">
          <!-- 您的订单已生成 -->
          {{ $t("pay_order.pay_title") }}
        </p>
        <div class="order-msg" :class="app.language == 'en' && 'order-msg-en'">
          <p class="h5">
            <!-- 订单号： -->
            {{ $t("pay_order.order_number") }}
            <span># {{ app.placeOrderMsg.id }} </span>
          </p>
          <p class="h5">
            <!-- 生成日期： -->
            {{ $t("pay_order.create_date") }}
            <span> {{ app.placeOrderMsg.create_time }} </span>
          </p>
        </div>
        <p class="h4 h-title">
          <!-- 订购详情 -->
          {{ $t("place_order.msg_title") }}
        </p>
        <div class="row">
          <div class="col-md-3 text-left">
            <p class="h5">
              <!-- 产品 -->
              {{ $t("place_order.msg_product") }}
            </p>
          </div>
          <div class="col-md-3 text-left">
            <p class="h5">
              <!-- 单价 -->
              {{ $t("place_order.msg_amount") }}
            </p>
          </div>
          <div class="col-md-3 text-left">
            <p class="h5">
              <!-- 数量 -->
              {{ $t("place_order.msg_total") }}
            </p>
          </div>
          <div class="col-md-3 text-left">
            <p class="h5">
              <!-- 总计 -->
              {{ $t("place_order.all_total") }}
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 text-left">
            <p class="h4">{{ app.placeOrderMsg.name }}</p>
          </div>
          <div class="col-md-3 text-left">
            <p class="h4">
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
          </div>
          <div class="col-md-3 text-left">
            <p class="h4">{{ app.placeOrderMsg.num }}</p>
          </div>
          <div class="col-md-3 text-left">
            <p class="h4">
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
          </div>
        </div>
        <p class="h4 h-title">
          <!-- 账户信息 -->
          {{ $t("place_order.msg_account") }}
        </p>
        <div class="bill-msg">
          <p class="h5">
            <!-- 手机 -->
            {{ $t("place_order.mobile_number") }}:<span>
              {{
                app.placeOrderMsg.mobile
                  ? app.placeOrderMsg.mobile.substr(0, 3) +
                    "****" +
                    app.placeOrderMsg.mobile.substr(7, 11)
                  : $t("public.un_write")
              }}
            </span>
          </p>
          <p class="h5">
            <!-- 邮箱 -->
            {{ $t("place_order.emali_adress") }}:<span>
              {{
                app.placeOrderMsg.email
                  ? app.placeOrderMsg.email
                  : $t("public.un_write")
              }}
            </span>
          </p>
        </div>
      </div>
      <div
        class="msg-pay"
        :class="[(payType == 1 || payType == 4) && 'with-qr',app.language == 'en' && 'msg-pay-en']"
      >
        <div class="total-box">
          <p class="h4">
            <!-- 总计 -->
            {{ $t("place_order.all_total") }}
          </p>
          <p class="h3">
            {{
              coinType == 2 ? app.placeOrderMsg.price1 : app.placeOrderMsg.price
            }}
            &nbsp;{{
              (coinType == 0 && "USDT") ||
              (coinType == 1 && "USDC") ||
              (coinType == 2 && $t("public.coin")) ||
              (coinType == 3 && "USDT / USDC")
            }}
          </p>
        </div>
        <!-- (this.$emit('chooseCoinType','2') -->
        <p class="total-line"></p>
        <p class="pay-tips" v-if="payType != 1">
          <span>*</span>
          <!-- 使用链上支付请预留支付所需的手续费 -->
          {{ $t("pay_order.chain_remark") }}
        </p>
        <p class="place-oper" v-if="payType == 2">
          <base-button
            type="info"
            round
            @click="$refs.paytable.payWallet()"
            :loading="payLoading"
            :disabled="payLoading"
            :class="app.isBureau == 1 && 'other-info'"
          >
            <i class="iconfont icon-shuaka_swipe"></i>
            <!-- 立即支付 -->
            {{ $t("pay_order.pay_now") }}
          </base-button>
        </p>
      </div>
    </div>
    <!-- 支付方式 -->
    <PayTable
      ref="paytable"
      @choosePayType="changePayType"
      @chooseCoinType="changeCoinType"
      @openLoading="openLoading"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PayOrder",
  data() {
    return {
      payType: 2,
      payLoading: false, //支付加载
      coinType: "0", //资产类型
    };
  },
  components: {
    PayTable: (resolve) => require(["./coms/pay_table"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    // this.getContact();
  },
  mounted() {
    // this.app.placeOrderMsg.pay_type == 1 && this.creatPayQr();
  },
  methods: {
    //切换支付方式
    changePayType(_type) {
      this.payType = _type;
    },
    //切换币种
    changeCoinType(_type) {
      this.coinType = _type;
    },
    //按钮加载
    openLoading(_bool) {
      this.payLoading = _bool;
    },
  },
  beforeDestroy() {
    this.$refs.paytable.watchEtherLogCancel &&
      this.$refs.paytable.watchEtherLogCancel.unsubscribe();
    this.$refs.paytable.clearTime();
  },
};
</script>

<style lang="scss" scoped>
.pay-way-new {
  width: calc(100% - 405px) !important;
  margin-top: 16px !important;
  transform: translateY(0) !important;
  .transfar-msg,
  .qr-content {
    width: calc(100% - 128px) !important;
  }
  .pay-way-new-content {
    padding: $padd24 1rem $padd40 !important;
  }
}
.pay-order {
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: space-between;
    padding-left: 24px;
    align-items: center;
    border-radius: 4px;
    .h4 {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      color: white;
      .iconfont {
        font-size: $iconSize;
        color: white;
        margin-right: 8px;
        font-size: 22px;
      }
    }
  }
  .pay-msg {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    .msg-content {
      flex: 1;
      padding: 80px 48px;
      background: $contentBg;
      border-radius: 4px;
      text-align: center;
      margin-right: 30px;
      .iconBox {
        width: 48px;
        height: 48px;
        margin: 0 auto;
        margin-bottom: 24px;
      }
      .h2 {
        margin-bottom: 16px;
        color: white;
        font-weight: bold;
      }
      .order-msg {
        display: flex;
        width: 310px;
        padding: 0 16px;
        height: 32px;
        align-items: center;
        margin: 0 auto;
        background: $conBg2;
        border-radius: 18px;
        justify-content: space-between;
        margin-bottom: 80px;
        .h5 {
          margin-bottom: 0;
          color: $remarkColor;
          span {
            color: $textColor;
          }
        }
      }
      .order-msg-en{
        width: 380px;
      }
      .h-title {
        text-align: left;
        color: $textColor;
        margin-bottom: 24px;
      }
      .row {
        .h5 {
          margin-bottom: 8px;
          color: $remarkColor;
        }
        .h4 {
          margin-bottom: 50px;
          color: white;
        }
      }
      .bill-msg {
        height: 40px;
        background: $conBg2;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding-left: 24px;
        .h5 {
          color: $remarkColor;
          margin-bottom: 0;
          margin-right: 24px;
          span {
            color: $textColor;
          }
        }
      }
      .pay-way {
        text-align: left;
        margin-top: 48px;
        display: flex;
        justify-content: flex-start;
        height: 24px;
        align-items: center;
        .h4 {
          margin-bottom: 0;
          color: $textColor;
        }
        .iconfont {
          font-size: 24px;
          margin-left: 16px;
          margin-right: 8px;
        }
        p:last-child {
          font-size: 14px;
          color: white;
        }
      }
    }
    .with-qr {
      height: 150px !important;
    }
    .msg-pay {
      width: 375px;
      background: $contentBg;
      border-radius: 4px;
      padding: 30px 24px 18px;
      height: 200px;
      .total-box {
        display: flex;
        height: 32px;
        justify-content: space-between;
        align-items: center;
        .h4 {
          margin-bottom: 0;
          color: $textColor;
        }
        .h3 {
          margin-bottom: 0;
          color: $success;
          font-weight: bold;
        }
      }
      .total-line {
        width: 100%;
        height: 1px;
        background: $lineTwoColor;
        margin: 24px 0;
      }
      .pay-tips {
        font-size: 13px;
        color: $remarkColor;
        margin-bottom: 12px;
      }
      .place-oper {
        margin-bottom: 17px;
        button {
          width: 100%;
        }
      }
      .qr-pay {
        .use-title {
          color: $remarkColor;
          text-align: center;
          margin-bottom: 24px;
          span {
            font-weight: bold;
            color: white;
            margin: 0 4px;
          }
        }
        .qr-con {
          width: 160px;
          height: 160px;
          background: white;
          margin: 0 auto;
        }
        .qr-remark {
          margin: 0 auto;
          margin-bottom: 24px;
          height: 40px;
          display: flex;
          margin-top: 24px;
          align-items: center;
          background: $conBg2;
          width: 240px;
          border-radius: 4px;
          justify-content: center;
          .iconfont {
            color: $remarkColor;
            font-size: 14px;
            margin-right: 9px;
          }
          .h5 {
            margin: 0;
            color: $remarkColor;
            span {
              margin: 0 4px;
              color: $success;
              font-weight: bold;
            }
          }
        }
      }
    }
    .msg-pay-en{
      height: 224px;
    }
  }
}
</style>
