<template>
  <div class="mobile-order-pay">
    <MobileNav>
      <p>
        <!-- 订单支付 -->
        {{ $t("routes.order_pay") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <PayTable
        ref="paytable"
        @chooseCoinType="chooseCoinType"
        @choosePayType="choosePayType"
      />
      <div class="total-box">
        <p>
          <!-- 总计： -->
          {{ $t("place_order.all_total") }}:
          <span
            >{{
              coinType == 2 ? app.placeOrderMsg.price1 : app.placeOrderMsg.price
            }}
          </span>
        </p>
        <p
          class="pay-oper"
          v-if="coinType == 0 || coinType == 1 || coinType == 2"
        >
          <base-button
            type="info"
            round
            @click="
              coinType == 2
                ? $refs.paytable.creatPayQr()
                : $refs.paytable.payWallet()
            "
          >
            <i class="iconfont icon-shuaka_swipe"></i>
            <!-- 立即支付 -->
            {{ $t("pay_order.pay_now") }}
          </base-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PayMobile",
  data() {
    return {
      coinType: 0,
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    //支付方式切换
    choosePayType(_type) {
      this.payType = _type;
    },
    //资产类型切换
    chooseCoinType(_type) {
      this.coinType = _type;
    },
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    PayTable: (resolve) =>
      require(["@/views/place_order/coms/pay_table"], resolve),
  },
  beforeDestroy() {
    localStorage.removeItem("isHasPay");
    this.$refs.paytable.watchEtherLogCancel &&
      this.$refs.paytable.watchEtherLogCancel.unsubscribe();
    this.$refs.paytable.clearTime();
  },
};
</script>

<style lang="scss" scoped>
.mobile-order-pay {
  padding: 4rem 1rem;
  .total-box {
    width: 100%;
    margin-top: 1rem;
    padding: 1rem $padd24;
    background: $contentBg;
    border-radius: 4px;
    p:first-child {
      margin-top: $fon12;
      display: flex;
      justify-content: space-between;
      font-size: $fon14;
      span {
        font-size: 1rem;
        font-weight: bold;
        color: $success;
      }
    }
    .pay-oper {
      padding-top: $padd24;
      border-top: 1px solid $lineTwoColor;
      margin-top: $padd24;
      text-align: center;
      button {
        width: 100%;
      }
    }
  }
}
</style>