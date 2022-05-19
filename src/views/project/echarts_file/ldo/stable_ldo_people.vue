// 质押总人数
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-ldo-people">
      <p class="h4">
        <!-- 质押人数 -->
        <!-- {{$t('ldo.num')}} -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="people-box" id="people-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { LdoProple } from "@/request/api";
let peopleBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initPeople();
      this.$emit("resizeEcharts", [peopleBox]);
    });
  },
  methods: {
    async initPeople() {
      const result = await LdoProple();
      result.number = result.number.map((item) => {
        return item / 1000;
      });
      const option = {
        height: this.$flag ? 300 : 280,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                "&nbsp;Number&nbsp;&nbsp;&nbsp;" +
                e.data +
                " k";
            });
            return params[0].axisValue + result;
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: result.time,
            axisLine: false,
            offset: this.$flag ? 4 : 10,
            axisLabel: {
              textStyle: {
                color: "#A2A5B0",
                padding: [0, 30, 0, 0],
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "solid",
                color: "#242D52",
              },
            },
          },
        ],
        yAxis: {
          type: "value",

          interval: 50,
          axisLabel: {
            formatter: "{value}k",
            textStyle: {
              color: "#A2A5B0",
            },
            margin: 16,
          },
          splitLine: {
            z: 10,
            lineStyle: {
              color: "#242D52",
              type: [5, 8],
              dashOffset: 5,
            },
          },
        },
        series: [
          {
            name: "Solana",
            type: "line",
            stack: "Total",
            smooth: true,
            z: 20,
            itemStyle: {
              color: "#FF6666",
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255,102,102,.4)",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.number,
          },
        ],
      };
      peopleBox = echarts.init(document.getElementById("people-box"));
      peopleBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-ldo-people {
  padding: 24px;
  height: 400px;
  display: flex;
  flex-direction: column;
  background: $contentBg;
  border-radius: 4px;
  .h4 {
    position: relative;
    z-index: 100;
    font-size: 16px;
    color: $textColor;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .people-box {
    flex: 1;
    width: 105%;
    margin-top: -7%;
    margin-left: -2%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-ldo-people {
    margin-bottom: $padd24;
    padding: 1rem;
    .h4 {
      font-size: 0.81rem;
    }
    .people-box {
      margin-top: -12%;
    }
  }
}
</style>