// Hotspots数量和拥有者数变化
<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-hnt-hot">
      <p class="h4">Hotspots数量和拥有者数变化</p>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
let hotBox;
export default {
  mounted() {
    setTimeout(async () => {
      await this.initHotBox();
      this.$emit("resizeEcharts", [hotBox]);
    });
  },
  methods: {
    async initHotBox() {},
  },
};
</script>

<style lang="scss" scoped>
.stable-hnt-hot {
  padding: 24px;
  height: 400px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
</style>