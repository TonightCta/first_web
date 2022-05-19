// 条款隐私
<template>
  <div class="">
    <modal :show.sync="termsBox">
      <div class="terms-box" :class="app.language == 'en' && 'terms-box-en'">
        <div v-html="$t('terms_box')"></div>
        <p class="close-btn">
          <base-button type="default" round @click="termsBox = false">
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
import { mapState } from "vuex";
export default {
  name: "TermsBox",
  data() {
    return {
      termsBox: false,
    };
  },
  components: { Modal },
  computed: {
    ...mapState(["app"]),
  },
};
</script>

<style lang="scss" scoped>
.terms-box {
  padding: 24px 24px 72px 24px;
  max-height: 500px;
  overflow-y: auto;
  /deep/ p {
    color: #404040;
    text-align: justify;
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
  .close-btn {
    position: absolute;
    width: 100%;
    text-align: center!important;
    left: 0;
    bottom: 24px;
  }
}
.terms-box-en {
  /deep/ p {
    text-align: inherit!important;
    word-break: break-all;
  }
}
</style>