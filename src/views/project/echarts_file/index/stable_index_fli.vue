<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-index-fil">
      <p class="h4">
        <!-- FLI交易量 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="index-fil-box" id="index-fil-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { IndexFLI } from "@/request/api";
let indexFLIBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initIndexFLI();
      this.$emit("resizeEcharts", [indexFLIBox]);
    });
  },
  methods: {
    async initIndexFLI() {
      const result = await IndexFLI();
      const option = {
        height: this.$flag ? 300 : 270,
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
                  Number(params[i].value).toFixed(0) + ' m';
              }
            }
            return relVal;
          },
          position: this.$flag ? ["25%", "37%"] : "",
        },
        legend: {
          type: "plain",
          orient: "vertical",
          right: 10,
          top: 50,
          itemWidth: 15,
          itemHeight: 8,
          itemGap: 6,
          textStyle: {
            color: "#dddfe6",
          },
        },
        grid: {
          left: "3%",
          right: "20%",
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
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
            formatter: function (value) {
              return value / 1000000 + " m";
            },
          },
        },
        series: [
          {
            name: "0x Native4",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Ox_Native4,
          },
          {
            name: "1inch Limit Order",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Linch_Limit_Order_Protocol2,
          },
          {
            name: "1inch3",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Linch3,
          },
          {
            name: "1inch4",
            stack: "bar_up",
            type: "bar",
            data: result.Linch4,
            emphasis: {
              focus: "series",
            },
          },
          {
            name: "1inchUNI v2",
            type: "bar",
            barWidth: 5,
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.LinchUNI_v2,
          },
          {
            name: "1inchUNI v3",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.LinchUNI_v3,
          },
          {
            name: "DODO2",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.DODO2,
          },
          {
            name: "Gnosis Protocol2",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Gnosis_Protocol2,
          },
          {
            name: "Paraswap1",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Paraswap1,
          },
          {
            name: "Sushiwap1",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Sushiswap1,
          },
          {
            name: "Uniswap3",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Uniswap3,
          },
          {
            name: "mistX1",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.mistX1,
          },
          {
            name: "Balancer1",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Balancer1,
          },
          {
            name: "Uniswap2",
            type: "bar",
            stack: "bar_up",
            emphasis: {
              focus: "series",
            },
            data: result.Uniswap2,
          },
        ],
      };
      indexFLIBox = echarts.init(document.getElementById("index-fil-box"));
      indexFLIBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-index-fil {
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
  .index-fil-box {
    flex: 1;
    width: 106%;
    margin-left: -2%;
    margin-top: -5%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-index-fil {
    padding: 1rem;
    .index-fil-box {
      margin-top: -15%;
    }
  }
}
</style>