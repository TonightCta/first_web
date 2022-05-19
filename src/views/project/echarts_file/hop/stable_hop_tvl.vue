<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-hop-tvl">
      <p class="h4">
        <!-- Hop Protocol TVL -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="hop-tvl-box" id="hop-tvl-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { HopTVL } from "@/request/api";
let hoptvlBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initHopTVL();
      this.$emit("resizeEcharts", [hoptvlBox]);
    });
  },
  methods: {
    async initHopTVL() {
      const result = await HopTVL();
      let option = {
        height: 270,
        tooltip: {
          trigger: "axis",
          valueFormatter:(value) => '$ ' + (Number(value) / 1e6).toFixed(2) + 'M',
          position: (p) => {
            return [p[0] - 100, p[1] - 100];
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          offset: 10,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
          axisTick: false,
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
            formatter: (value) => {
              return value / 1e6 + " M";
            },
            textStyle: {
              color: "#dddfe6",
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
              color: "rgb(255, 70, 131)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)",
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)",
                },
              ]),
            },
            data: result.TVL,
          },
        ],
      };
      this.$flag && this.$set(option, "grid", { x: 50 });
      hoptvlBox = echarts.init(document.getElementById("hop-tvl-box"));
      hoptvlBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-hop-tvl {
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
  .hop-tvl-box {
    flex: 1;
    margin-top: -3.3%;
    width: 121%;
    margin-left: -9%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-hop-tvl {
    padding: 1rem;
    .hop-tvl-box {
      margin-top: -15%;
      width: 107%;
      margin-left: 0;
    }
  }
}
</style>