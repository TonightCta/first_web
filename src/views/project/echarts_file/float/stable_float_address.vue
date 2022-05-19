<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-float-address">
      <p class="h4">
        <!-- Folat持有地址 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="float-address-box" id="float-address-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { FloatAddress } from "@/request/api";
let addressyBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initSupplyBox();
      this.$emit("resizeEcharts", [addressyBox]);
    });
  },
  methods: {
    async initSupplyBox() {
      const result = await FloatAddress();
      result.time = result.time.map((item) => {
        return item.substr(0, 10);
      });
      const option = {
        tooltip: {
          trigger: "axis",
          position: this.$flag ? ["25%", "37%"] : "",
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
            padding: this.$flag ? "" : [0, 0, 0, 30],
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
            color: "#2bb191",
            areaStyle: {},
          },
        ],
      };
      addressyBox = echarts.init(document.getElementById("float-address-box"));
      addressyBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-float-address {
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
  .float-address-box {
    flex: 1;
    width: 116%;
    margin-left: -6.5%;
    margin-top: -6.5%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-float-address {
    padding: 1rem;
    .float-address-box {
      width: 108%;
      margin-top: -17%;
      margin-left: 0;
    }
  }
}
</style>