以太坊混币资产规模
<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-torn-scale">
      <p class="h4">
        <!-- 以太坊混币资产规模 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="scale-box" id="scale-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { TornMsg } from "@/request/api";
import { mapState } from 'vuex';
let scaleBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initScaleBox();
      this.$emit("resizeEcharts", [scaleBox]);
    });
  },
  computed:{
    ...mapState(['app'])
  },
  methods: {
    async initScaleBox() {
      const result = await TornMsg({ type: 1 });
      result.number = result.number.map((item) => {
        return (item / 1000).toFixed(2);
      });
      const option = {
        height: 260,
        // title: {
        //   subtext: this.app.language == "en" ? "Asset size" : "资产规模",
        //   subtextStyle: {
        //     color: "#a2a5b0",
        //   },
        // },
        tooltip: {
          trigger: "axis",
          position: function (p) {
            return [p[0] - 100, p[1] - 120];
          },
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                e.data +
                "k";
            });
            return params[0].axisValue + result;
          },
        },
        xAxis: {
          data: result.time,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#353e66",
            },
          },
          axisTick: false,
          axisLabel: {
            color: "#dddfe6",
            margin: 25,
          },
        },
        yAxis: {
          axisLabel: {
            color: "#dddfe6",
            formatter: "{value} k",
          },
          splitLine: {
            lineStyle: {
              color: "#222a42",
            },
          },
          splitNumber: 3,
          min: 1,
        },
        grid: {
          x: 50,
          y: 40,
        },
        series: [
          {
            name: "Total",
            type: "bar",
            data: result.number,
            emphasis: {
              focus: "series",
            },
          },
        ],
      };
      scaleBox = echarts.init(document.getElementById("scale-box"));
      scaleBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-torn-scale {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  margin-bottom: 16px;
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
  .scale-box {
    flex: 1;
    width: 111%;
    margin-top: -1%;
    margin-left: 0%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-torn-scale {
    padding: 1rem;
    .scale-box {
      width: 110%;
    }
  }
}
</style>