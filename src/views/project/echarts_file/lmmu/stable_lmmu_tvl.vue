<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stale-lmmu-tvl">
      <p class="h4">
        <!-- Immutable X TVL -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="coin-type">
        <el-radio-group v-model="coinType" size="mini" @change="switchCoin">
          <el-radio-button label="USD">USD</el-radio-button>
          <el-radio-button label="ETH">ETH</el-radio-button>
        </el-radio-group>
      </div>
      <div class="lmmu-tvl-box" id="lmmu-tvl-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { LmmuTVL } from "@/request/api";
let lmmuTvlBox;
export default {
  props: ["title", "desc"],
  data() {
    return {
      coinType: "USD",
    };
  },
  mounted() {
    setTimeout(async () => {
      await this.initLmmuTVL();
      this.$emit("resizeEcharts", [lmmuTvlBox]);
    });
  },
  methods: {
    switchCoin() {
      lmmuTvlBox.dispose();
      this.initLmmuTVL();
    },
    async initLmmuTVL() {
      let _this = this;
      const result = await LmmuTVL();
      let option = {
        height: this.$flag ? 275 : 260,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                e.data +
                (_this.coinType == "USD" ? " USD" : " ETH");
            });
            return params[0].axisValue + result;
          },
          position:this.$flag ? ["25%", "37%"] : '',
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          axisTick: false,
          offset: 10,
          axisLabel: {
            textStyle: {
              color: "#dddfe7",
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
              color: "#dddfe7",
            },
            formatter: function (value) {
              if (_this.coinType == "USD") {
                return value / 1000000 + " m";
              } else {
                return value / 1000 + " k";
              }
            },
          },
        },
        series: [
          {
            name: "TVL",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "rgb(218,54,54)",
                },
                {
                  offset: 1,
                  color: "rgb(54,82,218)",
                },
              ]),
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "rgba(218,54,54,0.8)",
                },
                {
                  offset: 1,
                  color: "rgba(54,82,218,0.8)",
                },
              ]),
            },
            data: this.coinType == "USD" ? result.usd : result.eth,
          },
        ],
      };
      this.$flag && this.$set(option, "grid", { x: 50 });
      lmmuTvlBox = echarts.init(document.getElementById("lmmu-tvl-box"));
      lmmuTvlBox.setOption(option);
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
      rgba(112, 54, 218, 0.7) 0%,
      rgba(112, 54, 218, 4) 100%
    );
    color: white;
  }
}
/deep/ .el-radio-button__inner {
  background: rgba(0, 0, 0, 0);
  color: #7036da;
  border-color: #7036da !important;
  padding: 5px 15px;
  box-shadow: none !important;
}
.stale-lmmu-tvl {
  padding: 24px;
  height: 400px;
  display: flex;
  flex-direction: column;
  background: $contentBg;
  border-radius: 4px;
  position: relative;
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
  .coin-type {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 200;
  }
  .lmmu-tvl-box {
    flex: 1;
    width: 120.5%;
    margin-left: -9%;
    margin-top: -3%;
  }
}
@media screen and (max-width: 1279px) {
  .stale-lmmu-tvl {
    padding: 1rem;
    .coin-type {
      top: 0.5rem;
      right: 1rem;
    }
    .lmmu-tvl-box {
      margin-top: -15%;
      margin-left: 0;
      width: 108%;
    }
  }
}
</style>