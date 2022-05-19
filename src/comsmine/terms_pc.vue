<template>
  <div class="protocol">
    <modal :show.sync="termsServiceBox">
      <div class="terms-box">
        <div v-html="$t('terms_register')"></div>
        <p class="close-btn" @click="termsServiceBox = false">
          <base-button type="default" round>
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- 隐私政策 -->
    <modal :show.sync="termsServiceBoxTwo">
      <div class="terms-box">
        <div v-html="$t('terms_policy')"></div>
        <p class="close-btn" @click="termsServiceBoxTwo = false">
          <base-button type="default" round>
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
export default {
  name: "Protocol",
  data() {
    return {
      termsServiceBox: false,
      termsServiceBoxTwo: false,
    };
  },
  components: { Modal },
};
</script>

<style lang="scss" scoped>
.terms-box {
  padding: 24px 24px 72px 24px;
  max-height: 500px;
  overflow-y: auto;
  /deep/ p {
    text-align: justify;
    color: #404040;
  }
  /deep/ .h2 {
    font-size: 1.3rem;
  }
  /deep/ .h4 {
    font-size: 1rem;
  }
  /deep/ .h5 {
    font-size: $fon12;
  }
  /deep/ .big-title {
    text-align: center;
  }
  /deep/ .up-date {
    text-align: right;
  }
  /deep/ .with-bold {
    font-weight: bold;
  }
  /deep/ .padd-left {
    padding-left: 0.3rem;
  }
  /deep/ .padd-left-other {
    padding-left: 0.6rem;
  }
  /deep/ .padd-left-other-two {
    padding-left: 1rem;
  }
  /deep/ .with-under {
    text-decoration: underline;
  }
  /deep/ .iconfont {
    text-decoration: underline;
    color: $titleColor;
    cursor: pointer;
  }
  .close-btn {
    position: absolute;
    width: 100%;
    text-align: center;
    left: 0;
    bottom: 24px;
  }
}
</style>