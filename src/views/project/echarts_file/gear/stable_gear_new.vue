<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-gear-new">
      <p class="h4">
        <!-- GearBox协议每日新增用户数 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="grea-new-box" id="grea-new-box"></div>
    </div>
  </div>
</template>

<script>
import { GearCharts } from "@/request/api";
import * as echarts from "echarts";
let greanewBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initGearNew();
      this.$emit("resizeEcharts", [greanewBox]);
    });
  },
  methods: {
    async initGearNew() {
      const result = await GearCharts({ type: 2 });
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: (params) => {
            let result = "";
            params.forEach((e) => {
              if (e.value > 0) {
                result += "<br/>" + e.marker + e.seriesName + `&nbsp;&nbsp;&nbsp;&nbsp;${e.value}`;
              }
            });
            return params[0].axisValue + result;
          },
          // valueFormatter:(value) => value ? value : null,
        },
        legend: {
          textStyle: {
            color: "#dddfe6",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: result.time,
          axisTick: false,
          offset: 10,
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
          axisLabel: {
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
            name: "WBTC",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: result.wbtc,
          },
          {
            name: "DAI",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: result.dai,
          },
          {
            name: "WETH",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: result.weth,
          },
          {
            name: "USDC",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: result.usdc,
          },
        ],
      };
      greanewBox = echarts.init(document.getElementById("grea-new-box"));
      greanewBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-gear-new {
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
  .grea-new-box {
    flex: 1;
    width: 103%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-gear-new {
    padding: 1rem;
  }
}
</style>