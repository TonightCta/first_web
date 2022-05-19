// 移动端下单
<template>
  <div
    class="place-order-mobile"
    :class="app.isBureau == 1 && 'bureau-place-order'"
  >
    <!-- <MobileNav>
      <p>订购信息</p>
    </MobileNav> -->
    <div class="view-inner-place">
      <!-- 标题 -->
      <div class="mobile-place-title">
        <p class="iconfont icon-xinxi_info"></p>
        <p>
          <!-- 您的个人资料将用于处理您的订单、改进您在本网站的使用体验，以及用于我们隐私政策中描述的其他用途。 -->
          {{ $t("place_order.place_remark") }}
        </p>
      </div>
      <!-- 订购详情 -->
      <div class="place-msg public-box">
        <p class="public-title">
          <!-- 订购详情 -->
          {{ $t("place_order.msg_title") }}
        </p>
        <div class="public-box-inner place-msg-inner">
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
                  payType == 2
                    ? app.placeOrderMsg.price
                    : app.placeOrderMsg.price1
                }}&nbsp;{{ payType == 2 ? "USDT" : $t("public.coin") }}
              </p>
            </li>
            <li>
              <p>
                <!-- 数量 -->
                {{ $t("place_order.msg_total") }}
              </p>
              <p class="h4" v-if="app.placeOrderMsg.id == 1">1</p>
              <div class="with-count" v-else>
                <p
                  class="iconfont icon-jianshao_reduce-one"
                  @click="num > 1 && num--"
                ></p>
                <p class="h4">{{ num }}</p>
                <p class="iconfont icon-tianjia_add-one" @click="num++"></p>
              </div>
            </li>
            <li class="line"></li>
            <li>
              <p>
                <!-- 总计 -->
                {{ $t("place_order.all_total") }}
              </p>
              <p>
                {{
                  payType == 2
                    ? (app.placeOrderMsg.price * num).toFixed(2)
                    : (app.placeOrderMsg.price1 * num).toFixed(2)
                }}&nbsp;{{ payType == 2 ? "USDT" : $t("public.coin") }}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 账户信息 -->
      <div class="address-msg public-box">
        <p class="public-title">
          <!-- 账户信息 -->
          {{ $t("place_order.msg_account") }}
        </p>
        <div class="public-box-inner address-msg-inner">
          <div class="inp-box">
            <p>
              <!-- 邮箱地址 -->
              {{ $t("place_order.emali_adress") }}
            </p>
            <p>
              <input
                type="text"
                :placeholder="$t('place_order.pls_inp_email')"
                v-model="app.account.email"
                disabled="disabled"
                v-if="app.account.email"
              />
              <!-- 请输入邮箱 -->
              <span
                v-else
                class="need-bind"
                @click="$refs.emailEdit.getWorkType(1)"
              >
                <!-- 点击绑定邮箱 -->
                {{ $t("place_order.click_bind_email") }}
              </span>
            </p>
          </div>
          <div class="inp-box">
            <p>
              <!-- 手机号 -->
              {{ $t("place_order.mobile_number") }}
              <span style="color: #ff8389">*</span>
            </p>
            <p>
              <input
                type="number"
                :placeholder="$t('place_order.pls_inp_phone')"
                v-model="app.account.mobile"
                disabled="disabled"
                v-if="app.account.mobile"
              />
              <!-- 请输入手机号 -->
              <span
                v-else
                class="need-bind"
                @click="$refs.mobileEdit.getWorkType(1)"
              >
                <!-- 点击绑定手机号 -->
                {{ $t("place_order.click_bind_phone") }}
              </span>
            </p>
          </div>
          <div class="inp-box">
            <p>
              <!-- 订单备注 -->
              {{ $t("mine_order.order_remark") }}
            </p>
            <p>
              <textarea :placeholder="$t('place_order.inp_remark')"></textarea>
              <!-- 如有备注内容，请在此输入 -->
            </p>
          </div>
        </div>
      </div>
      <!-- 总计 -->
      <div class="total-box">
        <p class="total-title">
          <span>
            <!-- 总计 -->
            {{ $t("place_order.all_total") }}
          </span>
          <span v-if="totalPrice">
            {{ totalPrice }}&nbsp;{{
              payType == 2 ? "USDT" : $t("public.coin")
            }}
          </span>
          <span v-else>
            {{
              payType == 2
                ? (app.placeOrderMsg.price * num).toFixed(2)
                : (app.placeOrderMsg.price1 * num).toFixed(2)
            }}&nbsp;{{ payType == 2 ? "USDT" : $t("public.coin") }}
          </span>
        </p>
        <p class="total-line"></p>
        <p class="total-btn">
          <base-button
            type="info"
            :class="app.isBureau == 1 && 'other-info'"
            round
            @click="placeOrder()"
          >
            <!-- 下单 -->
            {{ $t("place_order.place_submit") }}
          </base-button>
        </p>
        <p>
          <el-checkbox v-model="agree">
            <!-- 我已经阅读并同意本网站的 -->
            {{ $t("place_order.read_remark") }}
          </el-checkbox>
          <span @click="$router.push('/mobile-protocol')" class="trems-text">
            <!-- 《条款和协议》 -->
            {{ $t("place_order.website") }}
          </span>
          {{ app.language == 'en' ? 'of this website' : '' }}
        </p>
      </div>
    </div>
    <!-- 零钱通 -->
    <van-dialog
      v-model="payRemark"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
    >
      <div class="pay-remark">
        <p class="remark-title">
          <!-- 微信支付 - 零钱通 -->
          {{ $t("pay_order.wechat_pay") }}
        </p>
        <img :src="require('@/assets/images/wechatRemark.png')" alt="" />
        <p class="remark-btn">
          <base-button type="default" round @click="payRemark = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
        </p>
      </div>
    </van-dialog>
    <!-- 手机号绑定 -->
    <Mobile ref="mobileEdit" />
    <!-- 邮箱绑定 -->
    <Email ref="emailEdit" />
    <!-- 0元套餐支付成功 -->
    <PayResult ref="payresult" />
  </div>
</template>

<script>
import { creatOrder, mealInfo } from "@/request/api";
import { BaseRadio } from "@/components";
import { mapState } from "vuex";
export default {
  name: "PlaceOrderMobile",
  data() {
    return {
      payType: "2", //支付方式
      agree: true, //协议
      payRemark: false, //零钱通说
      num: 1,
      totalPrice: 0, //总数
    };
  },
  created() {
    this.app.placeOrderMsg.order_number &&
      this.$router.push("/pay-order-mobile");
  },
  watch: {
    payType() {
      this.num = 1;
    },
    num(val) {
      // 数量监听
      let price = this.app.placeOrderMsg.price;
      // this.payType == 2
      //   ? this.app.placeOrderMsg.price
      //   : this.app.placeOrderMsg.price1;
      // 数量监听
      this.totalPrice = (price * val).toFixed(2);
      if (val > 10 && this.app.placeOrderMsg.id == 2) {
        this.num = 1;
        this.app.placeOrderMsg.name = this.$t("bureau_mine.renew_year"); //包年套餐
        this.$notify({
          type: "success",
          //您已添加10个以上的包月会员，根据订购规则，已自动为您转换成包年会员
          message: this.$t("pay_order.month_tips"),
        });
        const result = async () => {
          const meal = await mealInfo({ id: 2 });
          this.app.placeOrderMsg.id = 2;
          this.app.placeOrderMsg.price = meal.price;
          this.app.placeOrderMsg.price1 = meal.price1;
          price =
            this.payType == 2
              ? this.app.placeOrderMsg.price
              : this.app.placeOrderMsg.price1;
          this.totalPrice = (this.num * price).toFixed(2);
        };
        result();
      }
    },
  },
  mounted() {
    !this.browserType && (this.payType = "3");
  },
  methods: {
    async placeOrder() {
      if (!this.app.account.mobile) {
        this.$notify({
          type: "danger",
          //请先绑定您的手机号
          message: this.$t("notify.bind_mobile"),
        });
        return;
      }
      if (!this.agree) {
        this.$notify({
          type: "danger",
          //请先阅读并同意本站的《条款和协议》
          message: this.$t("notify.need_protocol_2"),
        });
        return;
      }
      const placeMsg = {
        meal_id: this.app.placeOrderMsg.id,
        remark: this.remark,
        num: this.num,
      };
      const result = await creatOrder(placeMsg);
      if (!result.data.status) {
        this.$notify({ type: "danger", message: result.msg });
        return;
      }
      if (placeMsg.meal_id == 7) {
        await this.$store.dispatch("upAccount");
        this.$refs.payresult.paySuccess = true;
        return;
      }
      const success = () => {
        this.$store.commit("upPlaceOrderMsg", result.data);
        this.$router.push("/pay-order-mobile");
      };
      result.data.status == 1
        ? success()
        : this.$notify({
            type: "danger",
            //下单失败，请稍后再试
            message: this.$t("pay_order.order_failed"),
          });
    },
  },
  computed: {
    ...mapState(["app"]),
    browserType() {
      const { ethereum } = window;
      return ethereum;
    },
  },
  components: {
    // MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    BaseRadio,
    Mobile: (resolve) => require(["@/views/setting/mobile"], resolve),
    Email: (resolve) => require(["@/views/setting/email"], resolve),
    PayResult: (resolve) => require(["./coms/pay_success"], resolve),
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
  .public-box {
    background: $contentBg;
    border-radius: 4px;
    margin-bottom: 1rem;
    .public-title {
      height: $padd40;
      line-height: $padd40;
      background: $conBg2;
      font-size: $fon12;
      border-radius: 4px;
      padding-left: 1rem;
      color: $textColor;
    }
    .public-box-inner {
      padding: $padd24;
    }
  }
  .place-msg-inner {
    ul {
      li {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        p {
          color: $remarkColor;
          font-size: $fon12;
        }
        p:last-child {
          color: white;
        }
        .with-count {
          display: flex;
          height: $fon14;
          align-items: center;
          p {
            color: white;
          }
          p:nth-child(2) {
            margin: 0 $fon12;
          }
          .iconfont {
            color: $iconColor;
            font-size: $fon14;
          }
        }
      }
      .line {
        width: 100%;
        height: 1px;
        background: $lineTwoColor;
        margin: $padd24 0;
      }
    }
  }
  .address-msg-inner {
    .inp-box {
      margin-bottom: 1rem;
    }
    p {
      font-size: $fon12;
      margin-bottom: 0.5rem;
      input {
        width: 100%;
        height: 2.375rem;
        border-radius: 4px;
        border: 1px solid $lineTwoColor;
        background: $contentBg;
        padding-left: $fon18;
        font-size: $fon12;
      }
      .need-bind {
        display: inline-block;
        width: 100%;
        height: 2.375rem;
        border-radius: 4px;
        border: 1px solid $lineTwoColor;
        background: $conBg2;
        text-align: center;
        line-height: 2.375rem;
      }
      textarea {
        width: 100%;
        resize: none;
        border-radius: 4px;
        background: $contentBg;
        border: 1px solid $lineTwoColor;
        height: 6.25rem;
        box-sizing: border-box;
        padding: 0.6rem $fon18;
        font-size: $fon12;
      }
    }
    .inp-box:last-child {
      margin-bottom: 0;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
  .pay-type-inner {
    p {
      display: flex;
      align-items: center;
      font-size: $fon14;
      color: white;
      .we-remark {
        i {
          font-size: 0.9rem;
          color: $remarkColor;
        }
      }
      /deep/ .form-check {
        transform: translateY(-2px);
      }
      .iconfont {
        font-size: $padd24;
        margin: 0 0.5rem;
      }
      .icon-weixinzhifu {
        color: #09bb07;
      }
      .icon-USDT {
        color: #1ba27a;
      }
    }
  }
  .total-box {
    padding: $padd24;
    background: $contentBg;
    margin-bottom: $padd40;
    border-radius: 4px;
    .total-title {
      display: flex;
      justify-content: space-between;
      span {
        font-size: $fon14;
      }
      span:last-child {
        font-size: 1rem;
        color: $success;
      }
    }
    .total-line {
      width: 100%;
      height: 1px;
      background: $lineTwoColor;
      margin: $padd24 0;
    }
    button {
      width: 100%;
      font-size: $fon14;
      margin-bottom: 1rem;
    }
    p:last-child {
      .trems-text {
        font-size: $fon12;
        color: $iconColor;
        cursor: pointer;
      }
      /deep/ .el-checkbox__input {
        margin-top: -2px;
      }
      /deep/ .el-checkbox__label {
        color: $textColor;
        font-size: $fon12;
      }
    }
  }
}
.pay-remark {
  text-align: center;
  .remark-title {
    font-size: $fon14;
    color: $titleColor;
    margin: $padd24 0;
  }
  img {
    height: 10rem;
    margin-bottom: $padd24;
  }
  button {
    margin-bottom: 1rem;
  }
}
.bureau-place-order {
  padding: 1rem $fon14;
}
</style>