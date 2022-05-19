// 质押资产总价值 - Solana
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-ldo-sol">
      <p class="h4">
        <!-- 质押资产总价值 - Solana(SOL计价) -->
        <!-- {{$t('ldo.sol_title')}} -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="sol-box" id="sol-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { LdoAmount } from "@/request/api";
let solBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initPeople();
      this.$emit("resizeEcharts", [solBox]);
    });
  },
  methods: {
    async initPeople() {
      const result = await LdoAmount();
      result.Solana = result.Solana.map((item) => {
        return item / 1000000;
      });
      const option = {
        height: this.$flag ? 290 : 280,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                "&nbsp;Solona&nbsp;&nbsp;&nbsp;" +
                e.data +
                " m";
            });
            return params[0].axisValue + result;
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
            axisLine: false,
            offset: 10,
            axisLabel: {
              textStyle: {
                color: "#A2A5B0",
                padding: [0, 30, 0, 0],
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "solid",
                color: "#242D52",
              },
            },
          },
        ],
        yAxis: {
          type: "value",

          interval: 50,
          axisLabel: {
            formatter: "{value}m",
            textStyle: {
              color: "#A2A5B0",
            },
            margin: 16,
          },
          splitLine: {
            z: 10,
            lineStyle: {
              color: "#242D52",
              type: [5, 8],
              dashOffset: 5,
            },
          },
        },
        series: [
          {
            name: "Solana",
            type: "line",
            stack: "Total",
            smooth: true,
            z: 20,
            itemStyle: {
              color: "#825CFF",
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(130,92,255,.4)",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Solana,
          },
        ],
      };
      solBox = echarts.init(document.getElementById("sol-box"));
      solBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-ldo-sol {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  height: 400px;
  display: flex;
  flex-direction: column;
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
  .sol-box {
    flex: 1;
    width: 105%;
    margin-top: -7%;
    margin-left: -2%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-ldo-sol {
    padding: 1rem;
    margin-bottom: $padd24;
    .h4 {
      font-size: 0.81rem;
    }
    .sol-box {
      margin-top: -12%;
    }
  }
}
</style>
