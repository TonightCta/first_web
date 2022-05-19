<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-dao-hold">
      <p class="h4">
        <!-- $MAGIC的持币地址数 -->
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
.stable-dao-hold {
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