// 支付成功
<template>
  <div>
    <!-- 1U套餐订单完成 -->
    <van-dialog v-model="paySuccess" :showConfirmButton="false">
      <div class="pay-success">
        <p class="icon-box">
          <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
        </p>
        <p class="success-title">
          <!-- 恭喜，支付成功 -->
          {{$t('pay_order.pay_ok')}}
        </p>
        <p class="success-remark">
          {{$t('pay_order.pay_ok_2')}}
        </p>
        <p class="success-btn">
          <base-button
            type="info"
            class="other-info"
            round
            @click="$router.push('/mine-bureau')"
            >
              <!-- 进入我的情报局 -->
              {{$t('public.inside_news')}}
            </base-button
          >
        </p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paySuccess: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.pay-success {
  text-align: center;
  padding:0 $padd24;
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
    margin-bottom: 2rem;
    .iconfont {
      font-size: 2rem;
      font-weight: bold;
    }
  }
  .success-title {
    font-size: 1rem;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 1rem;
  }
  .success-remark {
    font-size: $fon12;
    color: $remarkColor;
    margin-bottom: $padd24;
  }
  button {
    margin-bottom: $size48;
  }
}
</style>