<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-float-tvl">
      <p class="h4">
        <!-- 篮子TVL -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="float-tvl-box" id="float-tvl-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { FloatTVL } from "@/request/api";
let tvlBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initTvlBox();
      this.$emit("resizeEcharts", [tvlBox]);
    });
  },
  methods: {
    async initTvlBox() {
      const result = await FloatTVL();
      result.time = result.time.map((item) => {
        return item.substr(0, 10);
      });
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                Number(e.seriesName == 'TVL(USD)' ? (e.data / 1000000) : (e.data / 1000)).toFixed(2) +
                (e.seriesName == 'TVL(USD)' ? ' m' : " k");
            });
            return params[0].axisValue + result;
          },
          position: this.$flag ? ['25%','37%'] : ''
        },
        height: 250,
        legend: {
          top: 15,
          textStyle: {
            color: "white",
          },
        },
        xAxis: {
          type: "category",
          data: result.time,
          offset: 5,
          axisLabel: {
            textStyle: {
              color: "white",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#353e66",
            },
          },
          spliteNumber: 10,
          axisTick: false,
        },
        yAxis: [
          {
            type: "value",
            offset: 5,
            splitLine: {
              lineStyle: {
                color: "#353e66",
              },
            },
            axisLabel: {
              formatter: function (value, index) {
                return value / 1000 + " k";
              },
              textStyle: {
                color: "white",
              },
            },
          },
          {
            type: "value",
            offset: 5,
            splitLine: {
              lineStyle: {
                color: "#353e66",
              },
            },
            axisLabel: {
              formatter: function (value, index) {
                return value / 1000000 + " m";
              },
              textStyle: {
                color: "white",
              },
            },
          },
        ],
        series: [
          {
            data: result.tvl_eth,
            name: "TVL(ETH)",
            color: "#d19922",
            showSymbol: false,
            yAxisIndex:0,
            type: "line",
          },
          {
            data: result.tvl_usd,
            name: "TVL(USD)",
            color: "#6b36dc",
            showSymbol: false,
            type: "line",
            yAxisIndex:1,
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{x:70})
      tvlBox = echarts.init(document.getElementById("float-tvl-box"));
      tvlBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-float-tvl {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  height: 400px;
  flex-direction: column;
  .h4 {
    position: relative;
    color: $textColor;
    z-index: 200;
    .iconfont {
      font-size: 15px;
      cursor: pointer;
      color: $textColor;
    }
  }
  .float-tvl-box {
    flex: 1;
    width: 113%;
    margin-left: -5.5%;
    margin-top: -3%;
  }
}
@media screen and (max-width:1279px){
  .stable-float-tvl{
    padding:1rem;
    .float-tvl-box{
      margin-top: -5%;
      width: 105%;
      margin-left: -7%;
    }
  }
}
</style>