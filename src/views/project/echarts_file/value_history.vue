// 市值&交易量历史变化
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="value-history">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="value-box" id="value-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
let tradeBox;
export default {
  props: ["projectType", "title", "desc"],
  name: "ValueAndHistory",
  data() {
    return {};
  },
  mounted() {
    setTimeout(async () => {
      await this.initTrade();
      this.$emit("resizeEcharts", [tradeBox]);
    });
  },
  methods: {
    //交易量历史变化
    async initTrade() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/charts/" +
            this.projectType +
            "/cap_volume_list.json?timestamp=" + timestamp
        )
        .then((res) => {
          result = res.data;
        });
      const xAxisData = result.time;
      const data1 = result.cap;
      const data3 = result.volume;

      const emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.3)",
        },
      };

      const option = {
        height: 180,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" +
                params[i].marker +
                " " +
                params[i].seriesName +
                "：              " +
                params[i].value +
                " 百万";
            }
            return relVal;
          },
        },
        xAxis: {
          data: xAxisData,
          axisLine: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: "#242D52",
              opacity: "0.4",
            },
          },
          splitArea: false,
          axisLabel: {
            color: "#A2A5B0",
            margin: 20,
            interval: this.$flag ? 50 : 80,
            pdding: this.$flag ? [0, 20, 0, 0] : [0, 0, 0, 0],
          },
        },
        yAxis: [
          {
            type: "value",
            min: 0,
            axisLabel: {
              color: "#33B1FF",
              formatter: "$ {value} M",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#242D52",
              },
            },
            position: "left",
            offset: this.$flag ? "-50" : 0,
            z: 100,
          },
          {
            type: "value",
            min: 0,
            splitLine: false,
            axisLabel: {
              color: "#FF6666",
              formatter: "$ {value} M",
            },
            position: "right",
            offset: this.$flag ? -45 : 0,
            z: 100,
          },
        ],
        grid: {
          bottom: 100,
        },
        dataZoom: "",
        series: [
          {
            name: this.$t('project_interface.market_value'),//市值
            type: "line",
            emphasis: emphasisStyle,
            data: data1,
            yAxisIndex: 0,
            barMaxWidth: 16,
            symbol: "none",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(51,177,255,0.4)" },
                { offset: 1, color: "rgba(0,0,0,0)" },
              ]),
            },
            itemStyle: {
              color: "#33B1FF",
            },
          },
          {
            name: this.$t('project_interface.trade_total'),//交易量
            type: "line",
            data: data3,
            smooth: true,
            symbol: "none",
            yAxisIndex: 1,
            lineStyle: {
              color: "#FF6666",
              width: 4,
            },
            itemStyle: {
              color: "#FF6666",
              borderWidth: 4,
              borderColor: "#FF6666",
            },
          },
        ],
      };
      this.$flag &&
        (option.dataZoom = [
          {
            type: "inside",
            start: 0,
            end: 60,
            show: false,
          },
          {
            start: 0,
            end: 10,
            show: false,
          },
        ]);
      tradeBox = echarts.init(document.getElementById("value-box"));
      tradeBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.value-history {
  height: 320px;
  background: $contentBg;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .h4 {
    position: relative;
    z-index: 100;
    .iconfont {
      font-size: 15px;
      color: $textColor;
    }
  }
  .value-box {
    flex: 1;
    width: 107%;
    margin-top: -30px;
    margin-left: -3%;
  }
}
@media screen and (max-width: 1279px) {
  .value-history {
    padding: 1rem;
    .h4 {
      font-size: 1rem;
    }
    .value-box {
      width: 124.5%;
      margin-left: -13%;
    }
  }
}
</style>
