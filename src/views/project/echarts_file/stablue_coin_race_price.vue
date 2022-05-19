// 价格历史变化 - 稳定币赛道
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-coin-race-price">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="price-box" id="price-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
let priceBox;
export default {
  props: ["title", "desc"],
  name: "StableCoinRacePrice",
  data() {
    return {};
  },
  mounted() {
    setTimeout(async () => {
      await this.initPrice();
      this.$emit("resizeEcharts", [priceBox]);
    });
  },
  methods: {
    //历史价格变化
    async initPrice() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(process.env.VUE_APP_BASEURL + "/charts/stablecoin/price_list.json?timestamp=" + timestamp)
        .then((res) => {
          result = res.data;
        });
      const option = {
        height: 148,
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
        xAxis: {
          type: "category",
          data: result.time,
          axisLine: false,
          axisLabel: {
            margin: 20,
            color: "#A2A5B0",
            interval: 50,
            padding: this.$flag ? [0, 0, 0, 50] : [0, 0, 0, 0],
          },
        },
        dataZoom: "",
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = params[0].name;
            for (let i = 0, l = params.length; i < l; i++) {
              if (params[i].value * 10 > 0) {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：             $ " +
                  params[i].value;
              }
            }
            return relVal;
          },
        },
        legend: {
          bottom: 0,
          textStyle: {
            color: "white",
          },
          left: this.$flag ? 50 : "center",
        },
        yAxis: {
          type: "value",
          offset: this.$flag ? -40 : 0,
          axisLabel: {
            formatter: "$ {value}.00",
            color: "#A2A5B0",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#49537A",
            },
          },
        },
        series: [
          {
            data: result.FEI,
            type: "line",
            name: "FEI",
            smooth: true,
            symbol: "none",
          },
          {
            data: result.LUSD,
            type: "line",
            name: "LUSD",
            smooth: true,
            symbol: "none",
          },
          {
            data: result.ESD,
            type: "line",
            name: "ESD",
            smooth: true,
            symbol: "none",
          },
          {
            data: result.SUSD,
            type: "line",
            name: "sUSD",
            smooth: true,
            symbol: "none",
          },
          {
            data: result.AMPL,
            type: "line",
            name: "AMPL",
            smooth: true,
            symbol: "none",
          },
          {
            data: result.FRAX,
            type: "line",
            name: "FRAX",
            smooth: true,
            symbol: "none",
          },
          {
            data: result.UST,
            type: "line",
            name: "UST",
            smooth: true,
            symbol: "none",
          },
          {
            data: result.DAI,
            type: "line",
            name: "DAI",
            smooth: true,
            symbol: "none",
          },
        ],
      };
      this.$flag &&
        (option.dataZoom = [
          {
            type: "inside",
            start: 0,
            end: 30,
            show: false,
          },
          {
            start: 0,
            end: 10,
            show: false,
          },
        ]);
      priceBox = echarts.init(document.getElementById("price-box"));
      priceBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-coin-race-price {
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
  .price-box {
    flex: 1;
    width: 115%;
    margin-top: -30px;
    margin-left: -4%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-coin-race-price {
    padding: 1rem;
    height: 22rem;
    .h4 {
      font-size: 1rem;
    }
    .price-box {
      width: 120%;
      margin-left: -10%;
    }
  }
}
</style>
