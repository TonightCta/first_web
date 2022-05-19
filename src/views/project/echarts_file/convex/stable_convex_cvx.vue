<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-convex-cvx">
      <p class="h4">
        <!-- DAO持有CVX数量 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "desc"],
};
</script>

<style lang="scss" scoped>
.stable-convex-cvx {
  padding: 24px;
  height: 400px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .h4 {
    position: relative;
    z-index: 200;
    color: $textColor;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
}
</style>