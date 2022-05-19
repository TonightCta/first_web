//质押数据
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-hnt-stakers">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="stakers-box" id="stakers-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { HntMsg } from "@/request/api";
let stakersBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initStakersBox();
      this.$emit("resizeEcharts", [stakersBox]);
    });
  },
  methods: {
    async initStakersBox() {
      const result = await HntMsg({ type: 5 });
      result.number = result.number.map((item) => {
        return item / 1000;
      });
      result.staked = result.staked.map((item) => {
        return item / 1000000;
      });
      const option = {
        height: 227,
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
          x:40,
          x2:45
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                e.data +
                (e.seriesName == "Total Staked(HNT)" ? " m" : " k")
            });
            return params[0].axisValue + result;
          },
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#dddfe6",
              formatter: "{value} m",
            },
            name: "质押HNT数",
            nameTextStyle: {
              color: "#a2a5b0",
              align: "center",
              padding: [0, 18, 0, 0],
            },
            splitLine: {
              lineStyle: {
                color: "#242D52",
              },
            },
          },
          {
            type: "value",
            name: "质押验证者数",
            nameTextStyle: {
              color: "#a2a5b0",
            },
            axisLabel: {
              color: "#dddfe6",
              formatter: "{value} k",
            },
            splitLine: {
              lineStyle: {
                color: "#242D52",
              },
            },
          },
        ],
        legend: {
          data: [
            { name: "Total Staked(HNT)", icon: "roundRect" },
            { name: "Staked Validators", icon: "roundRect" },
          ],
          itemStyle: {
            decal: "circle",
          },
          textStyle: {
            color: "#dddfe6",
          },
        },
        series: [
          {
            name: "Total Staked(HNT)",
            data: result.staked,
            type: "line",
            color: "rgba(130,92,255,1)",
            itemStyle: {
              color: "#FFD45C",
            },
          },
          {
            name: "Staked Validators",
            data: result.number,
            type: "bar",
            color: "rgba(130,92,255,1)",
            barWidth: 20,
            yAxisIndex: 1,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#2DE0BD",
                },
                {
                  offset: 1,
                  color: "#1B2447",
                },
              ]),
            },
          },
        ],
      };
      stakersBox = echarts.init(document.getElementById("stakers-box"));
      stakersBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-hnt-stakers {
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
  .stakers-box {
    flex: 1;
    width: 100%;
    margin-top: -2%;
    // margin-left: -1%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-hnt-stakers {
    padding: 1rem;
    .stakers-box {
      width: 100%;
      margin-left: 1%;
    }
  }
}
</style>