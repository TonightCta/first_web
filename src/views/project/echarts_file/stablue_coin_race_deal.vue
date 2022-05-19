// 成交量占比历史变化 - 稳定币赛道
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-coin-race-deal">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="deal-box" id="deal-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
let dealBox;
export default {
  props: ["title", "desc"],
  name: "StableCoinRaceDeal",
  data() {
    return {};
  },
  mounted() {
    setTimeout(async () => {
      await this.initDeal();
      this.$emit("resizeEcharts", [dealBox]);
    });
  },
  methods: {
    async initDeal() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(
          process.env.VUE_APP_BASEURL + "/charts/stablecoin/volume_list.json?timestamp=" + timestamp
        )
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

        height: 180,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value * 10 > 0) {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：    " +
                  params[i].value +
                  " %";
              }
            }
            return relVal;
          },
        },
        legend: {
          left: this.$flag ? 50 : "center",
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
              // interval: 1,
              padding: this.$flag ? [0, 0, 0, 50] : [0, 40, 0, 0],
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            inverse: true,
            offset: this.$flag ? -40 : 0,
            z: 100,
            axisLabel: {
              formatter: "{value} %",
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
        dataZoom: "",
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
              normal: {
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
            end: 20,
            show: false,
          },
          {
            start: 0,
            end: 10,
            show: false,
          },
        ]);
      dealBox = echarts.init(document.getElementById("deal-box"));
      dealBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-coin-race-deal {
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
  .deal-box {
    flex: 1;
    width: 107%;
    margin-top: -30px;
    margin-left: -3%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-coin-race-deal {
    height: 21rem;
    padding: 1rem;
    .h4 {
      font-size: 1rem;
    }
    .deal-box {
      width: 122%;
      margin-left: -17%;
    }
  }
}
</style>
