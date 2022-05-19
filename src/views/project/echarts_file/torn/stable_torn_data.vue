混币业务核心数据一览
<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-torn-data">
      <p class="h4">
        <!-- 混币业务核心数据一览 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="data-box" id="data-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { TornMsg } from "@/request/api";
import { mapState } from "vuex";
let dataBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initDataBox();
      this.$emit("resizeEcharts", [dataBox]);
    });
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    async initDataBox() {
      const result = await TornMsg({ type: 2 });
      const option = {
        height: this.$flag ? 280 : 250,
        // title: {
        //   subtext: this.app.language == "en" ? "Asset size" : "资产规模",
        //   left: 150,
        //   top: 10,
        //   subtextStyle: {
        //     color: "#a2a5b0",
        //   },
        // },
        tooltip: {
          trigger: "axis",
          position: function (p) {
            return [p[0] - 100, p[1] - 120];
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
          },
          splitLine: {
            lineStyle: {
              color: "#222a42",
            },
          },
          splitNumber: 3,
          min: 1,
        },
        series: [
          {
            name: "Total",
            type: "bar",
            data: result.number,
            emphasis: {
              focus: "series",
            },
            color: "#2cb57d",
          },
        ],
      };
      dataBox = echarts.init(document.getElementById("data-box"));
      dataBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-torn-data {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
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
  .data-box {
    flex: 1;
    width: 121%;
    margin-top: -2%;
    margin-left: -9.5%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-torn-data {
    padding: 1rem;
    .data-box {
      width: 110%;
      margin-top: -10%;
      margin-left: 0;
    }
  }
}
</style>