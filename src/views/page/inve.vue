<!-- 投资观 -->
<template>
  <div class="inve section">
    <p class="inve-title">
      <!-- 投资观 -->
      {{ $t("index_nav.in_view") }}
    </p>
    <p class="inve-remark">
      <!-- 价值投资是头等仓倡导的核心投资观 -->
      {{ $t("index.inve.inve_remark_1") }}
    </p>
    <p class="inve-title-two">
      <!-- 以创新的力量，构建全新的区块链世界！ -->
      {{ $t("index.inve.inve_remark_2") }}
    </p>
    <p class="inve-remark">
      <!-- 头等仓以价值投资理念引导资本流向具备创新力、想象力、有趣的原创型区块链项目，让更多的投资者关注创新与创造，推动行业良性发展，构建全新的区块链世界。 -->
      {{ $t("index.inve.inve_remark_3") }}
    </p>
    <Ani v-if="!$flag" />
    <img
      :src="require('@/assets/images/mobile/inve_mobile_bg.png')"
      alt=""
      v-else
    />
  </div>
</template>

<script>
export default {
  name: "Inve",
  data() {
    return {};
  },
  components: {
    Ani: (resolve) => require(["@/comsmine/animate"], resolve),
  },
};
</script>

<style lang="scss" scoped>
.inve {
  width: 100%;
  height: 100%;
  padding-left: 19.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: url("../../assets/images/pageIcon/we_do_bg.png");
  background-size: 100% 100%;
  p {
    color: white;
  }
  .inve-title {
    font-size: 28px;
    color: $success;
    margin-bottom: 24px;
  }
  .inve-remark {
    font-size: 14px;
    line-height: 24px;
    max-width: 570px;
  }
  .inve-title-two {
    font-size: 20px;
    margin-top: 80px;
    margin-bottom: 24px;
  }
}
@media screen and (max-width: 1279px) {
  .inve {
    padding: 4rem $padd24 10rem;
    .inve-title {
      font-size: $fon18;
      margin-bottom: 1.3rem;
    }
    .inve-remark {
      margin-top: -0.5rem;
      font-size: $fon12;
      line-height: $fon18;
    }
    .inve-title-two {
      margin-top: 2rem;
      font-size: 1rem;
      line-height: 1.375rem;
    }
    img {
      width: 16.8rem;
      height: 16.8rem;
      margin: 0 auto;
      margin-top: $padd40;
    }
  }
}
</style>
