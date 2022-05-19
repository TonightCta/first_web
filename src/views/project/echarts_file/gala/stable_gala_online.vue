<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-gala-online">
      <p class="h4">
        <!-- Gala Games创始人在线节点数 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="gala-online-box" id="gala-online-box"></div>
    </div>
  </div>
</template>

<script>
import { GalaOnline } from "@/request/api";
import * as echarts from "echarts";
let galalineBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initGalaLine();
      this.$emit("resizeEcharts", [galalineBox]);
    });
  },
  methods: {
    async initGalaLine() {
      const result = await GalaOnline();
      const option = {
        height:290,
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "7%",
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
            name: "Search Engine",
            type: "line",
            showSymbol: false,
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: result.number,
          },
        ],
      };
      galalineBox = echarts.init(document.getElementById("gala-online-box"));
      galalineBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-gala-online {
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
  .gala-online-box {
    flex: 1;
    margin-top: -7%;
    width: 106%;
    margin-left: -3%;
  }
}
@media screen and (max-width:1279px){
  .stable-gala-online{
    padding: 1rem;
    .gala-online-box{
      margin-top: -15%;
    }
  }
}
</style>