<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-aave-loan">
      <p class="h4">
        <!-- 资金池内各项资产出借情况 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="aave-loan-box" id="aave-loan-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { AavePool } from "@/request/api";
let loanBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initLoanBox();
      this.$emit("resizeEcharts", [loanBox]);
    });
  },
  methods: {
    async initLoanBox() {
      const result = await AavePool();
      let resultData = [];
      result.debt.forEach((e) => {
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
                "<br/>" +
                e.marker +
                "&nbsp;&nbsp;" +
                (Number(e.data.value).toFixed(0) / 1000000).toFixed(2) +
                " m";
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
              return value / 1000000 + " m";
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
      this.$flag && this.$set(option, "grid", { x: 60 });
      loanBox = echarts.init(document.getElementById("aave-loan-box"));
      loanBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-aave-loan {
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
  .aave-loan-box {
    flex: 1;
    width: 114%;
    margin-left: -4%;
    margin-top: -7%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-aave-loan {
    padding: 1rem;
    .aave-loan-box {
      margin-top: -14%;
      width: 110%;
      margin-left: -2%;
    }
  }
}
</style>