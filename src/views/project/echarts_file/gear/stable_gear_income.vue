<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-gear-income">
      <p class="h4">
        <!-- GearBox协议收入情况 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="gear-income-box" id="gear-income-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { GearCharts } from "@/request/api";
let gearincomeBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initGearIncome();
      this.$emit("resizeEcharts", [gearincomeBox]);
    });
  },
  methods: {
    async initGearIncome() {
      const result = await GearCharts({ type: 3 });
      let option = {
        height:270,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          valueFormatter:(value) => Number(value).toFixed(4)
        },
        xAxis: {
          type: "category",
          data: result.time,
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
            formatter:(value) => {
              return value / 1e3 + 'k'
            }
          },
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        series: [
          {
            name:'USD Balance',
            data: result.data,
            type: "bar",
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{x:50});
      gearincomeBox = echarts.init(document.getElementById("gear-income-box"));
      gearincomeBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-gear-income {
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
  .gear-income-box {
    flex: 1;
    margin-top: -7%;
    width: 116%;
    margin-left: -5%;
  }
}
@media screen and (max-width:1279px){
  .stable-gear-income{
    padding: 1rem;
    .gear-income-box{
      width: 110%;
      margin-top: -15%;
      margin-left: -1%;
    }
  }
}
</style>