<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-dao-inc">
      <p class="h4">
        <!-- Bridgeworld用户增长情况 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="inc-box" id="inc-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { Maglc } from "@/request/api";
let incBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initIncBox();
      this.$emit("resizeEcharts", [incBox]);
    });
  },
  methods: {
    async initIncBox() {
      const result = await Maglc({ type: 2 });
      let option = {
        height: 270,
        xAxis: {
          type: "category",
          data: result.time,
          offset: 10,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
          axisTick: false,
          axisLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        tooltip: {
          trigger: "axis",
          position: this.$flag ? ['25%','37%'] : ''
        },
        yAxis: {
          type: "value",
          splitNumber: 4,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#242D52",
              type: "dashed",
            },
          },
        },
        series: [
          {
            data: result.ctakers,
            name: "Total Unique Ctakers",
            type: "line",
            color: "#119529",
          },
          {
            data: result.stakers,
            name: "Total Unique Stakers",
            type: "line",
            color: "#30cce7",
          },
          {
            data: result.summoners,
            name: "Total Unique Summoners",
            type: "line",
            color: "#e73056",
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{x:50})
      incBox = echarts.init(document.getElementById("inc-box"));
      incBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-dao-inc {
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
  .inc-box {
    flex: 1;
    flex: 1;
    margin-top: -7%;
    width: 116.5%;
    margin-left: -5%;
  }
}
@media screen and (max-width:1279px){
  .stable-dao-inc{
    padding:1rem;
    .inc-box{
      margin-top: -15%;
      width: 110%;
      margin-left: -2%;
    }
  }
}
</style>