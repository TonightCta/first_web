<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-aave-active">
      <p class="h4">
        <!-- AAVE活跃用户数 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="aave-active-box" id="aave-active-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { AaveActive } from "@/request/api";
let activeBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initActiveBox();
      this.$emit("resizeEcharts", [activeBox]);
    });
  },
  methods: {
    async initActiveBox() {
      const result = await AaveActive();
      const option = {
        height: 260,
        color: ["#80FFA5", "#00DDFF", "#FF0087"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Borrow", "Deposit", "FlashLoan"],
          top: 20,
          textStyle: {
            color: "#dddfe6",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          axisTick: false,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          offset: 10,
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
              color: "#dddfe6",
            },
          },
        },
        series: [
          {
            name: "Borrow",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.borrow,
          },
          {
            name: "Deposit",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(0, 221, 255)",
                },
                {
                  offset: 1,
                  color: "rgb(77, 119, 255)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.deposit,
          },
          {
            name: "FlashLoan",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 0, 135)",
                },
                {
                  offset: 1,
                  color: "rgb(135, 0, 157)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.flashloan,
          },
        ],
      };
      activeBox = echarts.init(document.getElementById("aave-active-box"));
      activeBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-aave-active {
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
  .aave-active-box {
    flex: 1;
    width: 107%;
    margin-left: -3%;
    margin-top: -4%;
  }
}
@media screen and (max-width:1279px){
  .stable-aave-active{
    padding:1rem;
  .aave-active-box {
    margin-top: -7%;
  }
  }
}
</style>