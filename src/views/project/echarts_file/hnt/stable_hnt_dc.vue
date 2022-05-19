// 花费DC数变化
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-hnt-dc">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="dc-box" id="dc-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { HntMsg } from "@/request/api";
import { mapState } from "vuex";
let dcBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initDcBox();
      this.$emit("resizeEcharts", [dcBox]);
    });
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    async initDcBox() {
      const result = await HntMsg({ type: 3 });
      const option = {
        height: this.$flag ? 260 :240,
        title: {
          subtext: this.app.language == "en" ? "DC" : "过去30天花费的DC数",
          left: 0,
          top: this.$flag ? 0 : -10,
          subtextStyle: {
            color: "#a2a5b0",
          },
        },
        xAxis: {
          type: "category",
          data: result.time,
          axisLine: false,
          offset: 10,
          axisLabel: {
            color: "white",
          },
        },
        grid:{
          x:50,
          y:40
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                "&nbsp;DC&nbsp;&nbsp;&nbsp;" +
                e.data +
                " bn";
            });
            return params[0].axisValue + result;
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#dddfe6",
            formatter: "{value} bn",
          },
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        series: [
          {
            data: result.number,
            name: "Number",
            type: "line",
            color: "rgba(255,151,82,1)",
          },
        ],
      };
      dcBox = echarts.init(document.getElementById("dc-box"));
      dcBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-hnt-dc {
  padding: 24px;
  height: 400px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .h4 {
    position: relative;
    color: $textColor;
    z-index: 200;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .dc-box {
    flex: 1;
    width: 108%;
    margin-top: -1%;
    // margin-left: -2%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-hnt-dc {
    padding: 1rem;
    .dc-box {
      width: 105%;
      margin-top: -5%;
      margin-left: 1%;
    }
  }
}
</style>