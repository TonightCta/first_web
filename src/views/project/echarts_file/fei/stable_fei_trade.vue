<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-fei-dis">
      <p class="h4">
        <!-- TRIBE的交易次数 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="fei-trade-box" id="fei-trade-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { FeiTrade } from "@/request/api";
let feitradeBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initFeiTrade();
      this.$emit("resizeEcharts", [feitradeBox]);
    });
  },
  methods: {
    async initFeiTrade() {
      const result = await FeiTrade();
      let option = {
        height: 270,
        tooltip: {
          trigger: "axis",
          axisPointer:{
            type:'shadow'
          }
        },
        xAxis: {
          type: "category",
          data: result.time,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
          axisTick: false,
          offset: 10,
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
              color: "#dddfe6",
            },
          },
        },
        series: [
          {
            name: "Number",
            data: result.data,
            type: "bar",
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{x:40});
      feitradeBox = echarts.init(document.getElementById("fei-trade-box"));
      feitradeBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-fei-dis {
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
  .fei-trade-box {
    flex: 1;
    margin-top: -7%;
    margin-left: -5%;
    width: 115%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-fei-dis {
    padding: 1rem;
    .fei-trade-box {
      margin-top: -15%;
      margin-left: 0%;
      width: 105%;
    }
  }
}
</style>