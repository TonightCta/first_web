<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-convex-active">
      <p class="h4">
        <!-- Convex每月活跃用户 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="active-box" id="active-box-convex"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { Convex } from "@/request/api";
let activeBoxConvex;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initActiveBox();
      this.$emit("resizeEcharts", [activeBoxConvex]);
    });
  },
  methods: {
    async initActiveBox() {
      const result = await Convex({ type: 2 });
      let option = {
        height: 260,
        tooltip: {
          trigger: "axis",
          position: function (p) {
            return [p[0] - 80, p[1] - 100];
          },
        },
        xAxis: {
          type: "category",
          data: result.time,
          offset: 10,
          axisTick: false,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
        },
        series: [
          {
            data: result.data,
            name: "Active Users",
            type: "bar",
          },
        ],
      };
      this.$flag && this.$set(option, "grid", { x: 50 });
      activeBoxConvex = echarts.init(
        document.getElementById("active-box-convex")
      );
      activeBoxConvex.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-convex-active {
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
  .active-box {
    flex: 1;
    margin-top: -3%;
    width: 120%;
    margin-left: -9%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-convex-active {
    padding: 1rem;
    margin-bottom: $padd24;
    .active-box {
      margin-top: -14%;
      width: 105%;
      margin-left: 0;
    }
  }
}
</style>