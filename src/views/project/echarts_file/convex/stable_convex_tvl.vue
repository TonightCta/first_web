<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-convex-tvl">
      <p class="h4">
        <!-- Convex TVL -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="convex-box" id="convex-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { Convex } from "@/request/api";
let convexBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initConvexBox();
      this.$emit("resizeEcharts", [convexBox]);
    });
  },
  methods: {
    async initConvexBox() {
      const result = await Convex({ type: 1 });
      const option = {
        height: 265,
        tooltip: {
          trigger: "axis",
          valueFormatter: (value) =>
            "$ " + Number(value / 1e9).toFixed(2) + "B",
          position: function (p) {
            return [p[0] - 80, p[1] - 100];
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
          axisTick: false,
          offset: 10,
          axisLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
            formatter: function (value) {
              return value / 1e9 + " B";
            },
          },
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        series: [
          {
            name: "TVL",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "#3141d4",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(49, 65, 212,.8)",
                },
                {
                  offset: 1,
                  color: "rgba(49, 65, 212,.1)",
                },
              ]),
            },
            data: result.data,
          },
        ],
      };
      convexBox = echarts.init(document.getElementById("convex-box"));
      convexBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-convex-tvl {
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
  .convex-box {
    flex: 1;
    margin-top: -3.2%;
    width: 120%;
    margin-left: -9%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-convex-tvl {
    margin-bottom: $padd24;
    padding: 1rem;
    .convex-box {
      margin-top: -14%;
      width: 105%;
      margin-left: 0;
    }
  }
}
</style>