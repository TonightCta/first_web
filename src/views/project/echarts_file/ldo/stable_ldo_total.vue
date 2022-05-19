// 质押资产总价值
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-ldo-total">
      <p class="h4">
        <!-- 质押资产总价值(USD计价) -->
        <!-- {{$t('ldo.usd_title')}} -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="total-box" id="total-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { LdoTotal } from "@/request/api";
let totalBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initTotalBox();
      this.$emit("resizeEcharts", [totalBox]);
    });
  },
  methods: {
    async initTotalBox() {
      const result = await LdoTotal();
      result.Ethereum = result.Ethereum.map((item) => {
        return item / 100000000;
      });
      result.Solana = result.Solana.map((item) => {
        return item / 100000000;
      });
      result.Terra = result.Terra.map((item) => {
        return item / 100000000;
      });
      const option = {
        color: ["#33ADFF", "#FF9752", "#825CFF"],
        height: this.$flag ? 280 : 250,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                "&nbsp;" +
                e.seriesName +
                "&nbsp;&nbsp;&nbsp;" +
                e.data +
                " m";
            });
            return params[0].axisValue + result;
          },
        },
        legend: {
          itemHeight: 8,
          itemWidth: 12,
          itemGap: 16,
          data: [
            { name: "Ethereum 2.0", icon: "roundRect" },
            { name: "Terra", icon: "roundRect" },
            { name: "Solana", icon: "roundRect" },
          ],
          bottom: "0",
          textStyle: {
            color: "#DDDFE6",
            fontSize: 13,
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
                padding: [0, 40, 0, 0],
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            interval: 50,
            axisLabel: {
              formatter: "{value}B",
              textStyle: {
                color: "#A2A5B0",
              },
              margin: 16,
            },
            splitLine: {
              lineStyle: {
                color: "#49537A",
                type: [5, 8],
                dashOffset: 5,
              },
            },
          },
        ],
        series: [
          {
            name: "Ethereum 2.0",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: "1",
              color: "#33ADFF",
            },
            emphasis: {
              focus: "series",
            },
            data: result.Ethereum,
          },
          {
            name: "Terra",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: "1",
              color: "#FF9752",
            },
            emphasis: {
              focus: "series",
            },
            data: result.Terra,
          },
          {
            name: "Solana",
            type: "line",
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: "#825CFF",
            },
            emphasis: {
              focus: "series",
            },
            data: result.Solana,
          },
        ],
      };
      totalBox = echarts.init(document.getElementById("total-box"));
      totalBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-ldo-total {
  height: 400px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
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
  .total-box {
    flex: 1;
    width: 107%;
    margin-left: -3%;
    margin-top: -4%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-ldo-total {
    padding: 1rem;
    .h4 {
      font-size: 0.81rem;
    }
    .total-box {
      margin-top: -12%;
    }
  }
}
</style>