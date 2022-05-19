<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-float-bank">
      <p class="h4">
        <!-- Bank持有地址 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="float-bank-box" id="float-bank-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { FloatBank } from "@/request/api";
let bankBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initBankBox();
      this.$emit("resizeEcharts", [bankBox]);
    });
  },
  methods: {
    async initBankBox() {
      const result = await FloatBank();
      result.time = result.time.map((item) => {
        return item.substr(0, 10);
      });
      let option = {
        tooltip: {
          trigger: "axis",
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
          offset: 5,
          splitLine: {
            lineStyle: {
              color: "#353e66",
            },
          },
          axisLabel: {
            textStyle: {
              color: "white",
            },
          },
        },
        series: [
          {
            data: result.number,
            name: "Holders",
            showSymbol: false,
            type: "line",
            color:'#b1742b',
            areaStyle: {},
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{x:50})
      bankBox = echarts.init(document.getElementById("float-bank-box"));
      bankBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-float-bank {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  height: 400px;
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
  .float-bank-box{
    flex:1;
    width: 116%;
    margin-left: -6.5%;
    margin-top: -6.5%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-float-bank {
    padding: 1rem;
    .float-bank-box {
      width: 108%;
      margin-top: -17%;
      margin-left: 0;
    }
  }
}
</style>