//下单
<template>
  <div class="place-order">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 您的个人资料将用于处理您的订单、改进您在本网站的使用体验，以及用于我们隐私政策中描述的其他用途。 -->
        {{ $t("place_order.place_remark") }}
      </p>
    </div>
    <div class="place-msg">
      <div class="msg-box">
        <div class="order-msg public-msg">
          <div class="public-title">
            <p class="h4">
              <!-- 订购详情 -->
              {{ $t("place_order.msg_title") }}
            </p>
          </div>
          <div class="order-content">
            <ul>
              <li>
                <p class="h4">
                  <!-- 产品 -->
                  {{ $t("place_order.msg_product") }}
                </p>
                <p class="h4 white">{{ app.placeOrderMsg.name }}</p>
              </li>
              <li>
                <p class="h4">
                  <!-- 单价 -->
                  {{ $t("place_order.msg_amount") }}
                </p>
                <p class="h4 white">
                  {{
                    payType == 2
                      ? app.placeOrderMsg.price
                      : app.placeOrderMsg.price1
                  }}&nbsp;{{ payType == 2 ? "USDT" : $t("public.coin") }}
                </p>
              </li>
              <li>
                <p class="h4">
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
              <li class="order-line"></li>
              <li>
                <p class="h4">
                  <!-- 总计 -->
                  {{ $t("place_order.all_total") }}
                </p>
                <p class="h4 white">
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
        <div class="bill-msg public-msg">
          <div class="public-title">
            <p class="h4">
              <!-- 账户信息 -->
              {{ $t("place_order.msg_account") }}
            </p>
          </div>
          <div class="contact-box">
            <div class="row">
              <div class="col-sm-12 col-lg-6">
                <p class="label">
                  <!-- 邮箱地址 -->
                  {{ $t("place_order.emali_adress") }}
                </p>
                <p class="inp-box">
                  <input
                    type="text"
                    :class="{ 'has-danger-mine': emailFailed }"
                    v-model="app.account.email"
                    disabled="disabled"
                    v-if="app.account.email"
                  />
                  <span v-else @click="$refs.emailEdit.getWorkType(1)">
                    <!-- 点击绑定邮箱 -->
                    {{ $t("place_order.bind_email") }}
                  </span>
                </p>
              </div>
              <div class="col-sm-12 col-lg-6">
                <p class="label">
                  <!-- 手机号 -->
                  {{ $t("place_order.mobile_number") }}
                  <span>*</span>
                </p>
                <p class="inp-box">
                  <input
                    type="tel"
                    :class="{ 'has-danger-mine': mobileFailed }"
                    v-model="app.account.mobile"
                    disabled="disabled"
                    maxlength="11"
                    v-if="app.account.mobile"
                  />
                  <span v-else @click="$refs.mobileEdit.getWorkType(1)">
                    <!-- 点击绑定手机 -->
                    {{ $t("place_order.bind_mobile") }}
                  </span>
                </p>
              </div>
            </div>
            <div class="remark-box">
              <p class="label">
                <!-- 订单备注 -->
                {{ $t("place_order.order_remark") }}
              </p>
              <textarea
                name=""
                v-model="remark"
                :placeholder="$t('place_order.inp_remark')"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="place-next" :class="app.language == 'en' && 'place-next-en'">
        <div class="total-box">
          <p class="h4">
            <!-- 总计 -->
            {{ $t("place_order.all_total") }}
          </p>
          <p
            class="h3"
            v-if="app.placeOrderMsg.price || app.placeOrderMsg.price1"
          >
            <span v-if="totalPrice">
              {{ totalPrice }}
            </span>
            <span v-else>
              {{
                payType == 2
                  ? (app.placeOrderMsg.price * num).toFixed(2)
                  : (app.placeOrderMsg.price1 * num).toFixed(2)
              }}
            </span>
            &nbsp;{{ payType == 2 ? "USDT" : $t("public.coin") }}
          </p>
          <p class="h3" v-else>-</p>
        </div>
        <p class="total-line"></p>
        <p class="place-oper">
          <base-button type="info" round @click="submitOrder">
            <!-- 下单 -->
            {{ $t("place_order.place_submit") }}
          </base-button>
        </p>
        <p>
          <el-checkbox v-model="agree">
            <!-- 我已经阅读并同意本网站的 -->
            {{ $t("place_order.read_remark") }}
          </el-checkbox>
          <span @click="$refs.terms.termsBox = true" class="trems-text">
            <!-- 《条款和协议》 -->
            {{ $t("place_order.website") }}
          </span>
          {{ app.language == "en" ? " of this website" : "" }}
        </p>
      </div>
    </div>
    <!-- 绑定钱包地址 -->
    <modal :show.sync="needBind" modalClasses="need-bind-address">
      <div class="need-bind-address-inner">
        <p class="h4">
          <!-- 您的账号尚未绑定钱包，是否立即前往绑定？ -->
          {{ $t("pay_order.un_bind_wallet") }}
        </p>
        <p>
          <base-button type="defalut" round @click="needBind = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span class="label-inner"></span>
          <base-button type="info" round @click="$router.push('/setting')">
            <!-- 立即绑定 -->
            {{ $t("pay_order.bind_now") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- 手机号绑定 -->
    <Mobile ref="mobileEdit" />
    <!-- 邮箱绑定 -->
    <Email ref="emailEdit" />
    <!-- 条款协议 -->
    <Terms ref="terms" />
    <!-- 0元套餐支付成功 -->
    <PayResult ref="payresult" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { BaseRadio, Modal } from "@/components";
import { creatOrder, mealInfo } from "@/request/api";
export default {
  name: "placeHolder",
  data() {
    return {
      emailFailed: false, //邮箱错误
      mobileFailed: false, //手机错误
      email: "", //账单邮箱地址
      mobile: "", //账单手机号地址
      remark: "", //订单备注
      payType: "2", //支付方式
      agree: true, //同意协议
      num: 1, //数量
      price: 29.8,
      totalPrice: 0,
      needBind: false,
    };
  },
  components: {
    BaseRadio,
    Modal,
    Terms: (resolve) => require(["@/comsmine/terms_box"], resolve),
    Mobile: (resolve) => require(["@/views/setting/mobile"], resolve),
    Email: (resolve) => require(["@/views/setting/email"], resolve),
    PayResult: (resolve) => require(["./coms/pay_success"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.app.placeOrderMsg.order_number && this.$router.push("/payOrder");
  },
  watch: {
    num(val) {
      // 数量监听
      let price =
        this.payType == 2
          ? this.app.placeOrderMsg.price
          : this.app.placeOrderMsg.price1;
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
    email(val) {
      let emailEval =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (emailEval.test(val)) {
        this.emailFailed = false;
      }
    },
    // mobile(val) {
    //   let mobileEval =
    //     /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    //   if (val.length == 11) {
    //     if (mobileEval.test(val)) {
    //       this.mobileFailed = false;
    //     }
    //   }
    // },
  },
  methods: {
    //提交订单
    async submitOrder() {
      // if (this.payType == 2 && !this.app.account.wallet_address) {
      //   this.needBind = true;
      //   return;
      // }
      this.app.account.email && (this.email = this.app.account.email);
      this.app.account.mobile && (this.mobile = this.app.account.mobile);
      // let emailEval =
      //   /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      // if (!this.email || !emailEval.test(this.email)) {
      //   this.emailFailed = true;
      //   return;
      // }
      // let mobileEval =
      //   /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      // if (this.mobile) {
      //   if (!mobileEval.test(this.mobile)) {
      //     this.mobileFailed = true;
      //     return;
      //   }
      // }
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
      if (result.data.meal_id == 7) {
        await this.$store.dispatch("upAccount");
        this.$refs.payresult.paySuccess = true;
        return;
      }
      const success = () => {
        this.$store.commit("upPlaceOrderMsg", result.data);
        this.$router.push("/payOrder");
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
};
</script>

<style lang="scss" scoped>
.place-order {
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
  .place-msg {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    .msg-box {
      flex: 1;
      margin-right: 30px;
      border-radius: 4px;
      .public-msg {
        margin-top: 16px;
        .public-title {
          padding: 18px 24px;
          background: $conBg2;
          border-radius: 4px;
          .h4 {
            margin-bottom: 0;
            color: $textColor;
          }
        }
        .order-content {
          padding: 24px;
          background: $contentBg;
          border-radius: 4px;
          ul {
            li {
              display: flex;
              justify-content: space-between;
              padding: 0 24px;
              .white {
                color: white;
              }
            }
            .with-count {
              display: flex;
              align-items: center;
              .h4 {
                color: white;
                margin: 0 14px;
              }
              .iconfont {
                font-size: 18px;
                color: $iconColor;
                cursor: pointer;
              }
            }
            li:nth-child(2) {
              margin-top: 25px;
              margin-bottom: 26px;
            }
            .order-line {
              margin-top: 26px;
              margin-bottom: 25px;
              height: 1px;
              background: $lineTwoColor;
              width: 100%;
            }
          }
          .h4 {
            margin: 0;
            color: $remarkColor;
          }
        }
        .contact-box {
          padding: 24px;
          background: $contentBg;
          border-radius: 4px;
          .row {
            .has-danger-mine {
              border-color: $danger !important;
              color: $danger !important;
            }
            .label {
              font-size: 12px;
              margin-bottom: 8px;
              span {
                color: #ff8389;
              }
            }
            .inp-box {
              input {
                width: 100%;
                height: 38px;
                background: $contentBg;
                border: 1px solid $lineTwoColor;
                border-radius: 4px;
                font-size: 12px;
                color: $textColor;
                box-sizing: border-box;
                padding-left: 18px;
              }
              span {
                display: inline-block;
                width: 100%;
                height: 38px;
                cursor: pointer;
                font-size: 13px;
                color: $textColor;
                text-align: center;
                background: $conBg2;
                border: 1px solid $info;
                line-height: 38px;
                border-radius: 4px;
              }
            }
            .error {
              color: $danger;
              font-size: 12px;
              margin-top: 4px;
            }
          }
        }
        .remark-box {
          margin-top: 16px;
          .label {
            font-size: 12px;
            margin-bottom: 8px;
          }
          textarea {
            width: 100%;
            height: 100px;
            resize: none;
            outline: none;
            border: 1px solid $lineTwoColor;
            background: $contentBg;
            font-size: 12px;
            box-sizing: border-box;
            padding: 11px 18px;
            color: $textColor;
          }
        }
        .way-box {
          padding: 24px;
          background: $contentBg;
          border-radius: 4px;
          display: flex;
          p {
            display: flex;
            margin-right: 24px;
            height: 24px;
            align-items: center;
            cursor: pointer;
            /deep/ .form-check {
              margin-top: 0;
            }
            .iconfont {
              font-size: 24px;
              margin-left: 12px;
              margin-right: 8px;
            }
            .icon-weixinzhifu {
              color: #09bb07;
            }
            .icon-USDT {
              color: #1ba27a;
            }
            span {
              font-size: 14px;
            }
          }
          p:nth-child(2) {
            margin-right: 8px;
          }
        }
      }
      .public-msg:first-child {
        margin-top: 0;
      }
    }
    .place-next {
      width: 375px;
      height: 214px;
      background: $contentBg;
      border-radius: 4px;
      padding: 30px 24px 18px;
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
      .place-oper {
        margin-bottom: 17px;
        button {
          width: 100%;
        }
      }
      p:last-child {
        padding-left: 20px;
        .trems-text {
          font-size: 14px;
          color: $iconColor;
          cursor: pointer;
        }
        /deep/ .el-checkbox__input {
          margin-top: -2px;
        }
        /deep/ .el-checkbox__label {
          color: $textColor;
        }
      }
    }
    .place-next-en {
      height: 246px;
    }
  }
}
.need-bind-address-inner {
  padding-top: 24px;
  .h4 {
    text-align: left;
  }
  p {
    display: flex;
    justify-content: center;
    .label-inner {
      display: inline-block;
      width: 16px;
    }
  }
  p:last-child {
    margin-top: 24px;
  }
}
</style>
