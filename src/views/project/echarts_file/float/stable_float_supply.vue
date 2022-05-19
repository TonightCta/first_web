<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-float-supply">
      <p class="h4">
        <!-- Float供应量 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="float-supply-box" id="float-supply-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { FloatSupply } from "@/request/api";
let supplyBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initSupplyBox();
      this.$emit("resizeEcharts", [supplyBox]);
    });
  },
  methods: {
    async initSupplyBox() {
      const result = await FloatSupply();
      result.time = result.time.map((item) => {
        return item.substr(0, 10);
      });
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                Number(e.data / 1000000).toFixed(2) +
                " m";
            });
            return params[0].axisValue + result;
          },
          position: this.$flag ? ['25%','37%'] : ''
        },
        height: this.$flag ? 290 : 275,
        xAxis: {
          type: "category",
          data: result.time,
          offset: 5,
          axisLabel: {
            textStyle: {
              color: "white",
            },
            padding: this.$flag ? '' : [0, 0, 0, 30],
          },
          axisLine: {
            lineStyle: {
              color: "#353e66",
            },
          },
          spliteNumber: 10,
          axisTick: false,
        },
        yAxis: {
          type: "value",
          offset:5,
          splitLine: {
            lineStyle: {
              color: "#353e66",
            },
          },
          axisLabel: {
            formatter:function(value,index){
              return value / 1000000 + ' m'
            },
            textStyle: {
              color: "white",
            },
          },
        },
        series: [
          {
            data: result.number,
            name: "Total Supply",
            showSymbol: false,
            type: "line",
          },
        ],
      };
      supplyBox = echarts.init(document.getElementById("float-supply-box"));
      supplyBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-float-supply{
  padding:24px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  height: 400px;
  flex-direction: column;
  .h4{
    color:$textColor;
    position: relative;
    z-index: 200;
    .iconfont{
      font-size: 15px;
      cursor: pointer;
    }
  }
  .float-supply-box{
    flex:1;
    width: 116%;
    margin-left: -6.5%;
    margin-top: -6.5%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-float-supply {
    padding: 1rem;
    .float-supply-box {
      width: 108%;
      margin-top: -17%;
      margin-left: 0;
    }
  }
}
</style>