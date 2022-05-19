//  VIP专属项目
<template>
  <div class="">
    <!-- 微信支付成功 -->
    <van-dialog
      v-model="needVIP"
      :width="$flag ? '90%' : '380'"
      :showConfirmButton="false"
    >
      <div class="pay-success">
        <p class="success-title">
          <!-- 年费会员专享 -->
          {{ $t("need_vip.need_title") }}
        </p>
        <p class="success-remark">
          <!-- 该项目为年费会员专享 -->
          {{ $t("need_vip.need_remark") }}
          <br />
          <!-- 您当前还不是年费会员，无法添加该项目 -->
          {{ $t("need_vip.need_remark_2") }}
        </p>
        <p class="success-btn">
          <base-button type="default" round @click="needVIP = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
          <span class="label"></span>
          <base-button type="info" class="other-info" round @click="reNew">
            <!-- 立即订阅 -->
            {{ $t("public.sub_now") }}
          </base-button>
        </p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { priceList, mealInfo } from "@/request/api";
export default {
  data() {
    return {
      needVIP: false,
    };
  },
  methods: {
    //续费会员
    async reNew() {
      const result = await priceList();
      const priceInfo = await mealInfo({
        id: result[result.length - 2].id,
      });
      const orderMsg = {
        id: result[result.length - 2].id,
        price1: priceInfo.price1,
        price: priceInfo.price,
        name: result[result.length - 2].name,
      };
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$router.push(this.$flag ? "/mobile-place-order" : "/placeOrder");
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-success {
  text-align: center;
  padding-top: 48px;
  .success-title {
    font-size: 1rem;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 0.5rem;
  }
  .success-remark {
    font-size: 12px;
    color: $remarkColor;
    line-height: 18px;
    margin-bottom: 36px;
  }
  button {
    margin-bottom: $size48;
  }
  .label {
    display: inline-block;
    width: 24px;
  }
}
</style>