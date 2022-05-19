<template>
  <div class="protocol">
    <MobileNav>
      <p>
        <!-- 条款协议 -->
        {{ $t("terms_name") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="terms-box" :class="app.language == 'en' && 'terms-box-en'">
        <div v-html="$t('terms_box')"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Protocol",
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
};
</script>

<style lang="scss" scoped>
.view-inner-mobile {
  padding: 0 1rem;
  padding-top: 4rem;
}
.terms-box {
  background: $contentBg;
  padding: 2rem 1rem;
  border-radius: 4px;
  /deep/ p {
    color: $textColor;
    text-align: justify;
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
}
.terms-box-en {
  /deep/ p {
    text-align: left!important;
    word-break: break-all;
  }
}
</style>