<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-eden-power">
      <p class="h4">
        <!-- 算力占比变化 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="power-box" id="power-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { EdenPower } from "@/request/api";
let powerbox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initPowerBox();
      this.$emit("resizeEcharts", [powerbox]);
    });
  },
  methods: {
    async initPowerBox() {
      const result = await EdenPower();
      const option = {
        height: 260,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                e.axisValue +
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                e.data +
                " %";
            });
            return result;
          },
          position: this.$flag
            ? ["25%", "37%"]
            : function (p) {
                return [p[0] - 80, p[1] - 100];
              },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          axisLine: false,
          offset: 10,
          interval: 15,
          axisLabel: {
            color: "white",
            padding: [0, 20, 0, 0],
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
            formatter: "{value}%",
            textStyle: {
              color: "#dddfe6",
            },
          },
        },
        series: [
          {
            name: this.$t("eden.power"),
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "rgba(1, 191, 236,.7)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(128, 255, 165,.7)",
                },
                {
                  offset: 1,
                  color: "rgba(1, 191, 236,.7)",
                },
              ]),
            },
            data: result.number,
          },
        ],
      };
      powerbox = echarts.init(document.getElementById("power-box"));
      powerbox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-eden-power {
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
  .power-box {
    flex: 1;
    margin-top: -2.5%;
    width: 119%;
    margin-left: -9%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-eden-power {
    padding: 1rem;
    .power-box {
      width: 110%;
      margin-top: -12%;
      margin-left: 0;
    }
  }
}
</style>