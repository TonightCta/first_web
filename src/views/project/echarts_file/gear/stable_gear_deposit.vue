<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-gear-deposit">
      <p class="h4">
        <!-- GearBox协议存款规模 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="gear-deposit-box" id="gear-deposit-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { GearCharts } from "@/request/api";
let depositBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initDeposit();
      this.$emit("resizeEcharts", [depositBox]);
    });
  },
  methods: {
    async initDeposit() {
      const result = await GearCharts({ type: 1 });
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
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
          data: result.time,
          axisTick: false,
          offset: 10,
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
        },
        yAxis: {
          type: "value",
          axisLabel: {
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
            name: "BTC Value(USD)",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: result.btc,
          },
          {
            name: "DAI/UDSC (USD)",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: result.dai,
          },
          {
            name: "ETH Value(USD)",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: result.eth,
          },
        ],
      };
      depositBox = echarts.init(document.getElementById("gear-deposit-box"));
      depositBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-gear-deposit {
  padding: 24px;
  height: 400px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .h4 {
    position: relative;
    z-index: 200;
    color: $textColor;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .gear-deposit-box {
    flex: 1;
    width: 107%;
    margin-left: -3%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-gear-deposit {
    padding: 1rem;
  }
}
</style>