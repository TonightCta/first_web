<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-aave-use">
      <p class="h4">
        <!-- 各项资产利用率百分比 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="aave-use-box" id="aave-use-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { AavePool } from "@/request/api";
let useBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initKeepBox();
      this.$emit("resizeEcharts", [useBox]);
    });
  },
  methods: {
    async initKeepBox() {
      const result = await AavePool();
      let resultData = [];
      result.utilization.forEach((e) => {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        resultData.push({
          value: e,
          itemStyle: {
            color: `rgb(${r},${g},${b})`,
          },
        });
      });
      let option = {
        height: 260,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" + e.marker + "&nbsp;&nbsp;" + e.data.value + " %";
            });
            return params[0].axisValue + result;
          },
        },
        xAxis: {
          type: "category",
          data: result.name,
          axisTick: false,
          offset: 10,
          axisLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
            formatter: function (value) {
              return value + " %";
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
            data: resultData,
            type: "bar",
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{x:50})
      useBox = echarts.init(document.getElementById("aave-use-box"));
      useBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-aave-use {
  height: 400px;
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .h4 {
    color: $textColor;
    position: relative;
    z-index: 200;
    .iconfont {
      font-size: 15px;
      cursor: pointer;
    }
  }
  .aave-use-box {
    flex: 1;
    width: 114%;
    margin-left: -4%;
    margin-top: -7%;
  }
}
@media screen and (max-width:1279px){
  .stable-aave-use{
    padding: 1rem;
    .aave-use-box{
      margin-top: -14%;
      width: 110%;
      margin-left: -2%;
    }
  }
}
</style>