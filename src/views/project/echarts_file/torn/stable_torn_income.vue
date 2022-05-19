协议收入
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-torn-income">
      <p class="h4">
        <!-- 协议收入 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="income-box" id="income-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { TornMsg } from "@/request/api";
import { mapState } from "vuex";
let incomeBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initIncomeBox();
      this.$emit("resizeEcharts", [incomeBox]);
    });
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    async initIncomeBox() {
      const result = await TornMsg({ type: 3 });
      result.number = result.number.map((item) => {
        return (item / 1000).toFixed(2);
      });
      const option = {
        height: this.$flag ? 280 : 270,
        // title: {
        //   subtext: this.app.language == "en" ? "Agreement income" : "协议收入",
        //   top: 20,
        //   subtextStyle: {
        //     color: "#a2a5b0",
        //   },
        // },
        xAxis: {
          type: "category",
          data: result.time,
          axisTick: false,
          axisLine: {
            lineStyle: {
              color: "#25345c",
            },
          },
          axisLabel: {
            color: "#dddfe6",
            margin: 15,
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;$&nbsp;` +
                e.data +
                " k";
            });
            return params[0].axisValue + result;
          },
        },
        yAxis: {
          type: "value",
          splitNumber: 2,
          axisLabel: {
            color: "#dddfe6",
            formatter: "{value} k",
          },
          splitLine: {
            lineStyle: {
              color: "#222a42",
            },
          },
        },
        grid: {
          x: 60,
          y: 60,
        },
        series: [
          {
            data: result.number,
            type: "line",
            name: "Total Fees:",
            color: "#aa6d2f",
          },
        ],
      };
      incomeBox = echarts.init(document.getElementById("income-box"));
      incomeBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-torn-income {
  padding: 24px;
  border-radius: 4px;
  background: $contentBg;
  margin: 16px 0;
  height: 400px;
  display: flex;
  flex-direction: column;
  .h4 {
    color: $textColor;
    margin-bottom: 0;
    position: relative;
    z-index: 200;
    .iconfont {
      cursor: pointer;
    }
  }
  .income-box {
    flex: 1;
    width: 112%;
    margin-top: -4%;
    margin-left: 0;
  }
}
@media screen and (max-width: 1279px) {
  .stable-torn-income {
    padding: 1rem;
    .income-box {
      width: 110%;
      margin-left: 0;
      margin-top: -10%;
    }
  }
}
</style>