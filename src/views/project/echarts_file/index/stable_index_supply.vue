<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-index-supply">
      <p class="h4">
        <!-- 指数代币供应量 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="index-supply-box" id="index-supply-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { IndexSupply } from "@/request/api";
let indexSupplyBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initIndexSupply();
      this.$emit("resizeEcharts", [indexSupplyBox]);
    });
  },
  methods: {
    async initIndexSupply() {
      const result = await IndexSupply();
      const option = {
        color: [
          "#80FFA5",
          "#00DDFF",
          "#37A2FF",
          "#FF0087",
          "#FFBF00",
          "#9236DA",
        ],
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value > 0) {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：    " +
                  Number(params[i].value).toFixed(0);
              }
            }
            return relVal;
          },
          position:this.$flag ? ["25%", "37%"] : '',
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
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: result.time,
            axisTick: false,
            offset: 10,
            axisLabel: {
              textStyle: {
                color: "#dddfe6",
              },
            },
          },
        ],
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
            name: "DPI",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.DPI,
          },
          {
            name: "ETH2x-FLI",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(0, 221, 255)",
                },
                {
                  offset: 1,
                  color: "rgb(77, 119, 255)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.ETH2x_FLI,
          },
          {
            name: "BTC2x-FLI",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(55, 162, 255)",
                },
                {
                  offset: 1,
                  color: "rgb(116, 21, 219)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.BTC2x_FLI,
          },
          {
            name: "MVI",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 0, 135)",
                },
                {
                  offset: 1,
                  color: "rgb(135, 0, 157)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.DVI,
          },
          {
            name: "BED",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 191, 0)",
                },
                {
                  offset: 1,
                  color: "rgb(224, 62, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.BED,
          },
          {
            name: "DATA",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(146, 54, 218)",
                },
                {
                  offset: 1,
                  color: "rgb(162, 44, 160)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.DATA,
          },
        ],
      };
      indexSupplyBox = echarts.init(
        document.getElementById("index-supply-box")
      );
      indexSupplyBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-index-supply {
  padding: 24px;
  height: 400px;
  background: $contentBg;
  display: flex;
  flex-direction: column;
  border-block: 4px;
  .h4 {
    position: relative;
    z-index: 100;
    color: $textColor;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .index-supply-box {
    flex: 1;
    width: 106.5%;
    margin-left: -3%;
  }
}
@media screen and (max-width:1279px){
  .stable-index-supply{
    padding:1rem;
  }
}
</style>