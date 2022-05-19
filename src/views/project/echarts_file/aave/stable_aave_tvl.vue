<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-aave-tvl">
      <p class="h4">
        <!-- AAVE资金锁仓规模(TVL) -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="aave-tab">
        <div class="coin-type">
          <el-radio-group v-model="coinType" size="mini" @change="switchCoin">
            <el-radio-button label="tvl">TVL(USD)</el-radio-button>
            <el-radio-button label="eth">ETH</el-radio-button>
            <el-radio-button label="btc">BTC</el-radio-button>
          </el-radio-group>
        </div>
        <div class="date-type">
          <el-radio-group v-model="dateType" size="mini" @change="switchDate">
            <el-radio-button label="all">All</el-radio-button>
            <el-radio-button label="year">1 Year</el-radio-button>
            <el-radio-button label="day_ninety">90 Day</el-radio-button>
            <el-radio-button label="day_thirty">30 Day</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="aave-tvl-box" id="aave-tvl-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { AaveTVL } from "@/request/api";
let aaveTvlBox;
export default {
  props: ["title", "desc"],
  data() {
    return {
      coinType: "tvl",
      dateType: "all",
    };
  },
  mounted() {
    setTimeout(async () => {
      await this.initAaveTvlBox();
      this.$emit("resizeEcharts", [aaveTvlBox]);
    });
  },
  methods: {
    //选择币种
    switchCoin() {
      aaveTvlBox.dispose();
      this.initAaveTvlBox();
    },
    //选择时间
    switchDate() {
      aaveTvlBox.dispose();
      this.initAaveTvlBox();
    },
    //初始化图表
    async initAaveTvlBox() {
      let _this = this;
      const result = await AaveTVL({ time: this.dateType });
      let option = {
        height: this.$flag ? 210 : 260,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;${
                  _this.coinType == "tvl" ? "$" : ""
                }&nbsp;` +
                Number(
                  e.data / (_this.coinType == "tvl" ? 1e9 : 1000)
                ).toFixed(2) +
                (_this.coinType == "tvl" ? " B" : " k");
            });
            return params[0].axisValue + result;
          },
          position: function (p) {
            return [p[0] - 80, p[1] - 100];
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          offset: 10,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
            padding: [0, 0, 0, 50],
          },
          axisLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          axisTick: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          axisLabel: {
            formatter: function (value, index) {
              if (_this.coinType == "tvl") {
                return "$ " + value / 1000000000 + " B";
              } else {
                return value / 1000 + " k";
              }
            },
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
            name:
              (this.coinType == "tvl" && "USD") ||
              (this.coinType == "eth" && "ETH") ||
              (this.coinType == "btc" && "BTC"),
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "#ff8000",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(191, 119, 46,.7)",
                },
                {
                  offset: 1,
                  color: "rgba(0, 0, 0,0)",
                },
              ]),
            },
            data:
              (this.coinType == "tvl" && result.usd) ||
              (this.coinType == "eth" && result.eth) ||
              (this.coinType == "btc" && result.btc),
          },
        ],
      };
      this.$flag && this.$set(option, "grid", { x: 50 });
      aaveTvlBox = echarts.init(document.getElementById("aave-tvl-box"));
      aaveTvlBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-radio-group {
  margin-top: 9px;
}
/deep/ .is-active {
  .el-radio-button__inner {
    background: linear-gradient(
      90deg,
      rgba(191, 119, 46, 0.7) 0%,
      rgba(191, 119, 46, 4) 100%
    );
    color: white;
  }
}
/deep/ .el-radio-button__inner {
  background: rgba(0, 0, 0, 0);
  color: #ff8000;
  border-color: #ff8000 !important;
  padding: 5px 15px;
  box-shadow: none !important;
}
.stable-aave-tvl {
  height: 400px;
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
  .h4 {
    color: $textColor;
    position: relative;
    z-index: 200;
    .iconfont {
      font-size: 15px;
      cursor: pointer;
    }
  }
  .aave-tab {
    position: absolute;
    right: 24px;
    top: 24px;
    display: flex;
    z-index: 200;
    .date-type {
      margin-left: 80px;
    }
  }
  .aave-tvl-box {
    flex: 1;
    margin-top: -3%;
    width: 120%;
    margin-left: -9%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-aave-tvl {
    padding: 1rem;
    .aave-tab {
      flex-wrap: wrap;
      left: 1rem;
      top: $size48;
      .date-type {
        margin-left: 0;
      }
    }
    .aave-tvl-box {
      width: 105%;
      margin-left: 0;
      margin-top: 8%;
    }
  }
}
</style>