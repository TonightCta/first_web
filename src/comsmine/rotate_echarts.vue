//横屏CBBI
<template>
  <div class="rotate-box" v-show="isRotate" v-loading="loadEcharts">
    <p class="rotate-title">
      <!-- 比特币趋势指数CBBI -->
      {{ $t("year_vip.cbbi_title") }}
    </p>
    <div class="rotate-echarts" id="rotate-echarts"></div>
    <div class="echarts-tab">
      <p>
        <!-- 今日CBBI: -->
        {{ $t("year_vip.cbbi_today") }}
        <span>{{ todayCBBI }}</span>
      </p>
    </div>
    <p class="close-full" @click="closeFull">
      <span class="iconfont icon-icon-"></span>
    </p>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";
let cbbiRotateBox = null;
export default {
  data() {
    return {
      isRotate: false,
      todayCBBI: null,
      cbbiDateTypeText: "all",
      cbbiDateTypeInner: "全部",
      loadEcharts: false,
    };
  },
  methods: {
    //趋势指数时间类型
    async cbbiDateType(_command, _label) {
      this.cbbiDateTypeInner = _label.$el.innerText;
      this.cbbiDateTypeText = _command;
      cbbiRotateBox.dispose();
      await this.initCbbi();
      this.$emit("resizeEcharts", [cbbiRotateBox]);
    },
    //比特币趋势指数
    async initCbbi() {
      let result;
      await axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/cbbi/" +
            this.cbbiDateTypeText +
            "/latest.json"
        )
        .then((res) => {
          result = res.data;
          this.todayCBBI = res.data.cbbi[res.data.cbbi.length - 1];
        });
      let interNum = 600;
      const option = {
        color: "white",
        tooltip: {
          // show:this.$flag ? false : true,
          trigger: "axis",
          position: "",
          axisPointer: {
            type: "cross",
          },
          formatter: function (params) {
            let relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].seriesName == "CBBI") {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：            " +
                  params[i].value;
              } else {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：$ " +
                  params[i].value;
              }
            }
            return relVal;
          },
        },
        legend: {
          data: ["CBBI", "BTC价格"],
          bottom: 0,
          z: 100,
          textStyle: {
            color: "#ffffff",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          offset: 16,
          axisLine: false,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            rotate: this.$flag ? 0 : 70,
            interval: interNum,
            color: "#A2A5B0",
            // padding: this.$flag ? [0, 10, 0, 30] : [0, 0, 0, 0],
          },
          axisPointer: {
            label: {
              padding: [5, 10, 5, 10],
              backgroundColor: "white",
              color: "#222A42",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#49537A",
              opacity: "0.4",
            },
          },
        },
        yAxis: [
          {
            type: "value",
            min: 0,
            position: "left",
            tooltip: {
              show: true,
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#49537A",
                opacity: "0.4",
              },
            },
            axisLabel: {
              color: "#A2A5B0",
            },
          },
          {
            type: "log",
            min: 1,
            max: 80000,
            axisLabel: {
              formatter: function (value, index) {
                let item = "";
                if (value === 10) {
                  item = "$ 10 \n \n$ 6";
                } else if (value === 100) {
                  item = "$ 100 \n \n$ 60";
                } else if (value === 1000) {
                  item = "\n$ 1,000 \n \n$ 600";
                } else if (value === 10000) {
                  item = "\n$ 10,000 \n \n$ 6000";
                } else {
                  item = "$ " + value;
                }
                return item;
              },
              color: "#A2A5B0",
            },

            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#49537A",
                opacity: "0.4",
              },
            },
          },
        ],
        series: [
          {
            data: result.cbbi,
            type: "line",
            name: "CBBI",
            symbol: "none",
            lineStyle: {
              color: "#33b1ff",
            },
            itemStyle: {
              color: "#33b1ff",
            },
            yAxisIndex: 0,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(51,177,255,.4)",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0)",
                },
              ]),
            },
          },
          {
            data: result.price,
            type: "line",
            //BTC价格
            name: this.$t('year_vip.cbbi_price'),
            symbol: "none",
            tooltip: {
              show: true,
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
            },
            lineStyle: {
              color: "#ff6666",
            },
            yAxisIndex: 1,
            itemStyle: {
              color: "#ff6666",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255,131,102,.4)",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0)",
                },
              ]),
            },
          },
        ],
      };
      !this.$flag &&
        (option.tooltip.position = function (p) {
          return [p[0] - 80, p[1] - 100];
        });
      cbbiRotateBox = echarts.init(document.getElementById("rotate-echarts"));
      cbbiRotateBox.setOption(option);
      this.loadEcharts = false;
    },
    openScreen() {
      this.isRotate = true;
      this.loadEcharts = true;
      setTimeout(() => {
        this.initCbbi();
      }, 500);
    },
    closeFull() {
      this.isRotate = false;
      cbbiRotateBox.dispose();
    },
  },
  mounted() {
    window.openScreen = this.openScreen;
  },
};
</script>

<style lang="scss" scoped>
.rotate-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: $contentBg;
  z-index: 9999;
  .rotate-echarts {
    width: 88vh;
    height: 21rem;
    transform: rotate(90deg);
    margin-top: 38%;
    margin-left: -38%;
  }
  .rotate-title {
    position: absolute;
    transform: rotate(90deg);
    font-size: $fon14;
    color: $textColor;
    right: -2rem;
    top: 5rem;
  }
  .echarts-tab {
    position: absolute;
    bottom: 52%;
    right: -0.1rem;
    display: flex;
    transform: rotate(90deg);
    z-index: 2000;
    font-size: $fon12;
    span {
      color: $success;
      font-weight: bold;
    }
  }
  .close-full {
    position: absolute;
    width: $padd24;
    height: $padd24;
    border-radius: 4px;
    background: $conBg2;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 1.3rem;
    bottom: 2rem;
    .iconfont {
      font-size: $fon18;
      color: $textColor;
      font-weight: bold;
    }
  }
}
</style>