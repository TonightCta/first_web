// 移动端订单详情
<template>
  <div class="mobile-order-details">
    <MobileNav>
      <p>
        <!-- 查看订单 -->
        {{ $t("routes.check_order") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="details-inner">
        <p class="details-title">
          <!-- 订单详情 -->
          {{ $t("mine_order.details") }}
        </p>
        <!-- 生成信息 -->
        <div class="number-box">
          <p>
            <!-- 订单号： -->
            {{ $t("pay_order.order_number") }}
            <span>#{{ orderID }}</span>
          </p>
          <p style="display: flex">
            <!-- 生成日期： -->
            {{ $t("pay_order.create_date") }}&nbsp;
            <span v-if="!orderDetails.create_time">
              <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
            </span>
            <span v-else>{{ orderDetails.create_time_text }}</span>
          </p>
        </div>
        <p class="details-title-other">
          <!-- 订单信息 -->
          {{ $t("mine_order.order_msg") }}
        </p>
        <!-- 订单信息 -->
        <div class="order-msg">
          <ul>
            <li>
              <p>
                <!-- 产品 -->
                {{ $t("mine_order.product") }}
              </p>
              <p>
                <span v-if="!orderDetails.name">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else>{{ orderDetails.name }}</span>
              </p>
            </li>
            <li>
              <p>
                <!-- 单价 -->
                {{ $t("mine_order.unit") }}
              </p>
              <p>
                <span v-if="!orderDetails.price">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else>{{
                  ethereum ? orderDetails.price : orderDetails.price1
                }}</span>
              </p>
            </li>
            <li>
              <p>
                <!-- 数量 -->
                {{ $t("mine_order.num") }}
              </p>
              <p>
                <span v-if="!orderDetails.num">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else>{{ orderDetails.num }}</span>
              </p>
            </li>
            <li>
              <p>
                <!-- 支付金额 -->
                {{ $t("pay_order.pay_price") }}
              </p>
              <p class="need-bold">
                <span v-if="!orderDetails.price">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else>{{
                  ethereum ? orderDetails.price : orderDetails.price1
                }}</span>
              </p>
            </li>
            <li>
              <p>
                <!-- 订单备注 -->
                {{ $t("mine_order.order_remark") }}
              </p>
              <p>
                <span v-if="orderDetails.remark == undefined">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else
                  >{{
                    orderDetails.remark != ""
                      ? orderDetails.remark
                      : $t("public.un_write")
                  }}
                </span>
              </p>
            </li>
          </ul>
        </div>
        <p class="details-title-other">
          <!-- 账户信息 -->
          {{ $t("place_order.msg_account") }}
        </p>
        <!-- 账户信息 -->
        <div class="account-msg">
          <p style="display: flex">
            <!-- 手机： -->
            {{ $t("mine_order.mobile") }}&nbsp;
            <span v-if="orderDetails.mobile == undefined">
              <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
            </span>
            <span v-else
              >{{ orderDetails.mobile.substr(0, 3) }}
              ****
              {{ orderDetails.mobile.substr(7, 11) }}</span
            >
          </p>
          <p style="display: flex">
            <!-- 邮箱： -->
            {{ $t("mine_order.email") }}&nbsp;
            <span v-if="orderDetails.email == undefined">
              <!-- 未填写 -->
              {{$t('public.un_write')}}
            </span>
            <span v-else>{{ orderDetails.email }}</span>
          </p>
        </div>
        <!-- 支付方式 -->
        <p class="details-title-other pay-away">
          <!-- 支付方式 -->
          {{ $t("mine_order.pay_way") }}
          <span class="iconfont">
            <!-- 合约支付 & 微信支付 -->
            <font>{{
              ethereum
                ? $t("mine_order.contract_pay")
                : $t("mine_order.wechat_pay")
            }}</font>
          </span>
        </p>
        <!-- 订单状态 -->
        <p class="details-title-other order-status">
          <!-- 订单状态 -->
          {{ $t("mine_order.order_status") }}
          <span class="load-other" v-if="!orderDetails.status">
            <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
          </span>
          <span v-if="orderDetails.status == 1" style="color: #ff8389">
            <!-- 待支付 -->
            {{ $t("mine_order.un_pay") }}
          </span>
          <span v-if="orderDetails.status == 2" style="color: #a7f0ba">
            <!-- 已完成 -->
            {{ $t("mine_order.down") }}
          </span>
          <span v-if="orderDetails.status == 5" style="color: #00b0f0">
            <!-- 支付中 -->
            {{ $t("mine_order.pay_pending") }}
          </span>
          <span v-if="orderDetails.status == 3" style="color: #ff6666">
            <!-- 已取消 -->
            {{ $t("mine_order.cancel") }}
          </span>
        </p>
        <p class="details-line"></p>
        <p class="oper-box">
          <base-button
            type="info"
            round
            v-if="
              (orderDetails.status == 2 || orderDetails.status == 5) &&
              orderDetails.pay_type == 2
            "
          >
            <i class="iconfont icon-diqiuyi_earth"></i>
            <!-- 查看区块链浏览器 -->
            {{ $t("mine_order.view_block") }}
          </base-button>
          <base-button
            type="info"
            round
            v-if="orderDetails.status == 1 || orderDetails.status == 5"
            @click="goPayMobile"
            :loading="payLoading"
            :disabled="payLoading"
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
import * as api from "@/request/api";
export default {
  name: "MobileOrderDetails",
  data() {
    return {
      orderID: null,
      orderDetails: {}, //订单详情
      payLoading: false, //支付loading
      paySuccess: false,
      ethereum: null,
    };
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    PayTable: (resolve) =>
      require(["@/views/place_order/coms/pay_table"], resolve),
  },
  created() {
    this.orderID = this.$route.query.order_id;
    this.getDetails();
    const { ethereum } = window;
    this.ethereum = ethereum;
    // if (GetUrlKey("wechatBack", window.location.href)) {
    //   this.queryOrder();
    // }
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    async getDetails() {
      this.orderDetails = await api.orderDetails({ order_id: this.orderID });
      this.$store.commit("upPlaceOrderMsg", this.orderDetails);
    },
    //微信支付
    wechatPay() {
      this.orderDetails.pay_type == 1 &&
        this.$notify({
          type: "danger",
          //请勿跨设备进行订单结算
          message: this.$t("notify.pay_failed"),
        });
      const next = () => {
        this.payLoading = true;
        const backUrl = encodeURIComponent(
          process.env.VUE_APP_RESET +
            "/#/mobile-order-details?order_id=" +
            this.orderID +
            "&wechatBack=true"
        );
        window.open(this.orderDetails.code_url + `&redirect_url=${backUrl}`);
      };
      this.orderDetails.pay_type == 3 && next();
    },
    //订单支付
    goPayMobile() {
      this.orderDetails.status == 5 &&
        this.orderDetails.pay_type == 4 &&
        localStorage.setItem("isHasPay", true);
      this.$router.push("/mobile-order-pay");
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-order-details {
  padding: 4rem 1rem;
  .details-inner {
    padding: 0 $padd24;
    padding-bottom: $padd24;
    background: $contentBg;
    border-radius: 4px;
  }
  .details-title {
    text-align: center;
    margin-top: $padd24;
  }
  .number-box {
    margin: 0 auto;
    margin-top: 1rem;
    display: flex;
    width: 90%;
    background: $conBg2;
    justify-content: space-around;
    height: $padd24;
    align-items: center;
    border-radius: 1rem;
    margin-bottom: $padd40;
    p {
      font-size: $fon12;
      color: $remarkColor;
      span {
        color: white;
      }
    }
  }
  .details-title-other {
    text-align: left;
    font-size: $fon14;
    color: $textColor;
  }
  .order-msg {
    margin-top: $padd24;
    margin-bottom: $padd40;
    ul {
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
        .need-bold {
          font-weight: bold;
          color: $success !important;
        }
      }
    }
  }
  .account-msg {
    margin-top: 1rem;
    padding: $fon12 1rem;
    background: $conBg2;
    border-radius: 4px;
    p {
      margin-bottom: $fon12;
      font-size: $fon12;
      color: $remarkColor;
      span {
        color: white;
      }
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
  .pay-away {
    margin-top: $padd40;
    height: $padd24;
    display: flex;
    align-items: center;
    .iconfont {
      font-size: $padd24;
      margin-left: $padd24;
      font {
        font-size: $fon14;
        // margin-left: 0.5rem;
        display: inline-block;
        transform: translateY(-3px);
        color: white;
      }
    }
  }
  .order-status {
    margin-top: 1.75rem;
    display: flex;
    .load-other {
      display: inline-block;
      transform: translateY(-1.1rem);
    }
    span {
      font-size: 1rem;
      font-weight: bold;
      margin-left: $padd24;
    }
  }
  .details-line {
    width: 100%;
    height: 1px;
    background: $lineTwoColor;
    margin-top: $padd40;
    margin-bottom: $padd24;
  }
  button {
    width: 100%;
  }
}
.pay-success {
  text-align: center;
  .icon-box {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(90deg, #00bad6 0%, #2de0bd 100%);
    margin: 0 auto;
    margin-top: 3.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    .iconfont {
      font-size: 2rem;
      font-weight: bold;
    }
  }
  .success-title {
    font-size: 1rem;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 0.5rem;
  }
  .success-remark {
    font-size: $fon12;
    color: $remarkColor;
    margin-bottom: $padd24;
  }
  button {
    width: 60%;
    margin-bottom: $size48;
  }
}
</style>