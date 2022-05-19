<template>
  <div class="protocol">
    <MobileNav>
      <p>
        <!-- 条款协议 -->
        {{ $t("terms_name") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="terms-box">
        <div v-html="$t('terms_register')"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Protocol",
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
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
    color: white;
  }
}
</style>