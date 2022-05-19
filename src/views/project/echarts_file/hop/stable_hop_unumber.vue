<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-hop-unumber">
      <p class="h4">
        <!-- Hop Protocol 累计用户数 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="hop-user-box" id="hop-user-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { HopActive } from "@/request/api";
let unumberBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initUNumber();
      this.$emit("resizeEcharts", [unumberBox]);
    });
  },
  methods: {
    async initUNumber() {
      const result = await HopActive();
      const option = {
        height: 270,
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
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
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
            formatter: (value) => {
              return value / 1e3 + " K";
            },
          },
        },
        series: [
          {
            name: "Number",
            data: result.user,
            type: "line",
            showSymbol: false,
            areaStyle: {},
          },
        ],
      };
      unumberBox = echarts.init(document.getElementById("hop-user-box"));
      unumberBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-hop-unumber {
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
  .hop-user-box {
    flex: 1;
    margin-top: -8%;
    width: 115%;
    margin-left: -6%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-hop-unumber {
    margin-bottom: 1rem;
    padding: 1rem;
    .hop-user-box {
      margin-top: -15%;
      width: 105%;
      margin-left: 0;
    }
  }
}
</style>