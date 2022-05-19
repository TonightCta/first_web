// 质押资产总价值 - Terra
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-ldo-luna">
      <p class="h4">
        <!-- 质押资产总价值 - Terra(LUNA计价) -->
        <!-- {{$t('ldo.terra_title')}} -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="terra-box" id="terra-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { LdoAmount } from "@/request/api";
let terraBox;
export default {
  props:['title','desc'],
  mounted() {
    setTimeout(async () => {
      await this.initPeople();
      this.$emit("resizeEcharts", [terraBox]);
    });
  },
  methods: {
    async initPeople() {
      const result = await LdoAmount();
      result.Terra = result.Terra.map((item) => {
        return item / 1000000;
      });
      const option = {
        height: this.$flag ? 290 : 280,
        tooltip: {
          trigger: "axis",
          //`${element.marker}{b}<br/>Treea  {c}%`
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                "&nbsp;Treea&nbsp;&nbsp;&nbsp;" +
                e.data +
                " m";
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
            offset: 10,
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
          interval: 20,
          axisLabel: {
            formatter: "{value}m",
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
            name: "Terra",
            type: "line",
            stack: "Total",
            smooth: true,
            z: 20,
            itemStyle: {
              color: "#FF9752",
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255,151,82,.4)",
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
            data: result.Terra,
          },
        ],
      };
      terraBox = echarts.init(document.getElementById("terra-box"));
      terraBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-ldo-luna {
  padding: 24px;
  height: 400px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .h4 {
    position: relative;
    color:$textColor;
    z-index: 100;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .terra-box {
    flex: 1;
    width: 105%;
    margin-top: -7%;
    margin-left: -2%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-ldo-luna {
    padding: 1rem;
    .h4 {
      font-size: 0.81rem;
    }
    .terra-box {
      margin-top: -12%;
    }
  }
}
</style>