// 稳定币赛道-历史变化
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-coin-race-history">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="history-box" id="history-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
let historyBox;
export default {
  props: ["title", "desc"],
  name: "StableCoinRaceHitory",
  data() {
    return {};
  },
  mounted() {
    setTimeout(async () => {
      await this.initHitory();
      this.$emit("resizeEcharts", [historyBox]);
    });
  },
  methods: {
    //市值历史变化
    async initHitory() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(process.env.VUE_APP_BASEURL + "/charts/stablecoin/cap_list.json?timestamp=" + timestamp)
        .then((res) => {
          result = res.data;
        });
      const option = {
        color: [
          "#2DE0BD",
          "#FFD45C",
          "#FF6B6B",
          "#33ADFF",
          "#288F7B",
          "#FF9752",
          "#825CFF",
          "#304270",
        ],
        height: 170,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          formatter: function (params) {
            let relVal = params[0].name;

            for (let i = 0, l = params.length; i < l; i++) {
              if (params[i].value * 10 > 0) {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：              " +
                  (params[i].value * 10).toFixed(2) +
                  " 亿   ";
              }
            }
            return relVal;
          },
        },
        dataZoom: "",
        legend: {
          left: this.$flag ? 90 : "center",
          bottom: "0",
          icon: "circle",
          textStyle: {
            color: "white",
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
            axisLine: false,
            data: result.time,
            axisLabel: {
              color: "#A2A5B0",
              margin: 20,
              padding: this.$flag ? [0, 0, 0, 40] : [0, 40, 0, 0],
            },
          },
        ],
        yAxis: [
          {
            z: 100,
            type: "value",
            name: this.$t('project_interface.all_trade_inner'),
            offset: this.$flag ? "-45" : 0,
            nameTextStyle: {
              color: "white",
              padding: [0, 50, 0, 0],
            },
            axisLabel: {
              formatter: "$ {value} B",
              color: "#A2A5B0",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#49537A",
              },
            },
            splitNumber: 2,
          },
        ],
        series: [
          {
            name: "FEI",
            type: "line",
            stack: this.$t('project_interface.echarts_total'),//总量
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#2DE0BD",
                },
                {
                  offset: 1,
                  color: "#2DE0BD",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.FEI,
          },
          {
            name: "LUSD",
            type: "line",
            stack: this.$t('project_interface.echarts_total'),//总量
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#FFD45C",
                },
                {
                  offset: 1,
                  color: "#FFD45C",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.LUSD,
          },
          {
            name: "ESD",
            type: "line",
            stack: this.$t('project_interface.echarts_total'),//总量
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#FF6B6B",
                },
                {
                  offset: 1,
                  color: "#FF6B6B",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.ESD,
          },
          {
            name: "sUSD",
            type: "line",
            stack: this.$t('project_interface.echarts_total'),//总量,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#33ADFF",
                },
                {
                  offset: 1,
                  color: "#33ADFF",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.sUSD,
          },
          {
            name: "AMPL",
            type: "line",
            stack: this.$t('project_interface.echarts_total'),//总量,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#288F7B",
                },
                {
                  offset: 1,
                  color: "#288F7B",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.AMPL,
          },
          {
            name: "FRAX",
            type: "line",
            stack: this.$t('project_interface.echarts_total'),//总量
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#FF9752",
                },
                {
                  offset: 1,
                  color: "#FF9752",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.FRAX,
          },
          {
            name: "UST",
            type: "line",
            stack: this.$t('project_interface.echarts_total'),//总量
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#825CFF",
                },
                {
                  offset: 1,
                  color: "#825CFF",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.UST,
          },
          {
            name: "DAI",
            type: "line",
            stack: this.$t('project_interface.echarts_total'),//总量
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#304270",
                },
                {
                  offset: 1,
                  color: "#304270",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.DAI,
          },
        ],
      };
      this.$flag &&
        (option.dataZoom = [
          {
            type: "inside",
            start: 0,
            end: 25,
            show: false,
          },
          {
            start: 0,
            end: 25,
            show: false,
          },
        ]);
      historyBox = echarts.init(document.getElementById("history-box"));
      historyBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-coin-race-history {
  height: 320px;
  background: $contentBg;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  .h4 {
    position: relative;
    z-index: 100;
    .iconfont {
      font-size: 15px;
      color: $textColor;
    }
  }
  .history-box {
    flex: 1;
    width: 107%;
    margin-top: -20px;
    margin-left: -3%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-coin-race-history {
    height: 21rem;
    padding: 1rem;
    .h4 {
      font-size: 1rem;
    }
    .history-box {
      width: 124%;
      margin-left: -18%;
    }
  }
}
</style>
