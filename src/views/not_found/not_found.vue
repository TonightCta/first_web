<template>
  <div class="not-found">
    <img
      :src="require('@/assets/images/error/error_bottom.png')"
      class="bottom-left"
      alt=""
    />
    <img
      :src="require('@/assets/images/error/error_top.png')"
      class="top-right"
      alt=""
    />
    <div>
      <img
        class="img-center"
        :src="require('@/assets/images/error/not_found.png')"
        alt=""
      />
      <p class="error-title">
        <!-- 抱歉，找不到您要得内容 -->
        {{ $t("not_found.not_title") }}
      </p>
      <p class="error-remark">
        <!-- 页面可能已移除，您可以返回首页查看其他内容 -->
        {{ $t("not_found.not_remark") }}
      </p>
      <p>
        <base-button type="info" round @click="$router.push('/')">
          <!-- 返回首页 -->
          {{ $t("not_found.back_page") }}
        </base-button>
      </p>
    </div>
    <Foo />
  </div>
</template>

<script>
export default {
  name: "NotFound",
  components: {
    Foo: (resolve) => require(["../page/footer_nav"], resolve),
  },
};
</script>

<style lang="scss" scoped>
.not-found {
  background: $mineBg;
  height: calc(100vh);
  position: fixed;
  top: 0;
  width: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  img {
    position: absolute;
  }
  .img-center {
    position: static;
    width: 320px;
    height: 200px;
  }
  .top-right {
    right: 0;
    top: 0;
    width: 636px;
    height: 734px;
    right: -100px;
    top: -102px;
  }
  .bottom-left {
    left: 0;
    bottom: 0;
    width: 1144px;
    height: 1320px;
    left: -304px;
    bottom: -509px;
  }
  .error-title {
    font-size: 20px;
    color: $success;
    margin-top: 80px;
    margin-bottom: 8px;
  }
  .error-remark {
    font-size: 14px;
    clear: white;
    margin-bottom: 40px;
  }
}
</style>