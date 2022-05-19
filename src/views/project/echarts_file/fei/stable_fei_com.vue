<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-fei-com">
      <p class="h4">
        <!-- PCV中代币资产组合(USD) -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="fei-com-box" id="fei-com-box"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { FeiCom } from "@/request/api";
let feiComBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initFeiComBox();
      this.$emit("resizeEcharts", [feiComBox]);
    });
  },
  methods: {
    async initFeiComBox() {
      const result = await FeiCom();
      const option = {
        height: this.$flag ? 300 : 280,
        // color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
        tooltip: {
          trigger: "axis",
          position: this.$flag ? ["50%", "-50%"] : null,
          valueFormatter: (value) => "$ " + Number(value).toFixed(0),
        },
        legend: {
          type: "plain",
          orient: "vertical",
          right: this.$flag ? 10 : 30,
          top: 50,
          itemWidth: 20,
          itemHeight: 12,
          itemGap: 6,
          textStyle: {
            color: "#dddfe6",
          },
        },
        grid: {
          left: "3%",
          right: this.$flag ? "22%" : "10%",
          bottom: "3%",
          containLabel: true,
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
          type: "log",
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          splitNumber: 5,
          max: 1e9,
          min: 1e5,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
            formatter: function (value, index) {
              // return
              let item = "";
              if (value == 1) {
                item = "$ 1";
              } else if (value === 1e7) {
                item = "$ 10m";
              } else if (Math.ceil(value) === 1e9) {
                item = "$ 1b";
              }
              return item;
            },
          },
        },
        series: [
          {
            name: "Token",
            symbol: "circle",
            type: "line",
            connectNulls: true,
            stack: "Total",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(241, 90, 30)",
                },
                {
                  offset: 1,
                  color: "rgb(157, 66, 29)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.token,
            color: "rgb(241, 90, 30)",
          },
          {
            name: "Lqty",
            symbol: "circle",
            connectNulls: true,
            stack: "Total",
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(159, 234, 44)",
                },
                {
                  offset: 1,
                  color: "rgb(113, 157, 47)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.lqty,
            color: "rgb(159, 234, 44)",
          },
          {
            name: "Index",
            connectNulls: true,
            symbol: "circle",
            stack: "Total",
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(93, 228, 46)",
                },
                {
                  offset: 1,
                  color: "rgb(70, 161, 39)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.index,
            color: "rgb(93, 228, 46)",
          },
          {
            name: "Gohm",
            symbol: "circle",
            connectNulls: true,
            stack: "Total",
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(54, 225, 96)",
                },
                {
                  offset: 1,
                  color: "rgb(39, 141, 64)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.gohm,
            color: "rgb(54, 225, 96)",
          },
          {
            name: "Dpi",
            symbol: "circle",
            stack: "Total",
            type: "line",
            connectNulls: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(63, 240, 215)",
                },
                {
                  offset: 1,
                  color: "rgb(42, 153, 138)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.dpi,
            color: "rgb(63, 240, 215)",
          },
          {
            name: "Dai",
            symbol: "circle",
            stack: "Total",
            type: "line",
            connectNulls: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(56, 214, 243)",
                },
                {
                  offset: 1,
                  color: "rgb(41, 124, 139)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.dai,
            color: "rgb(56, 214, 243)",
          },
          {
            name: "Cvx",
            symbol: "circle",
            stack: "Total",
            connectNulls: true,
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(56, 167, 249)",
                },
                {
                  offset: 1,
                  color: "rgb(54, 123, 173)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.cvx,
            color: "rgb(56, 167, 249)",
          },
          {
            name: "Crv",
            symbol: "circle",
            stack: "Total",
            connectNulls: true,
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(117, 49, 237)",
                },
                {
                  offset: 1,
                  color: "rgb(95, 48, 179)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.crv,
            color: "rgb(117, 49, 237)",
          },
          {
            name: "Cream",
            stack: "Total",
            symbol: "circle",
            connectNulls: true,
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(238, 34, 34)",
                },
                {
                  offset: 1,
                  color: "rgb(159, 42, 42)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.cream,
            color: "rgb(238, 34, 34)",
          },
          {
            name: "Comp",
            symbol: "circle",
            connectNulls: true,
            stack: "Total",
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 191, 0)",
                },
                {
                  offset: 1,
                  color: "rgb(224, 62, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Comp,
            color: "rgb(255, 191, 0)",
          },
          {
            name: "Bal",
            connectNulls: true,
            stack: "Total",
            type: "line",
            symbol: "circle",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 0, 135)",
                },
                {
                  offset: 1,
                  color: "rgb(135, 0, 157)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.bal,
            color: "rgb(255, 0, 135)",
          },
          {
            name: "Rai",
            symbol: "circle",
            stack: "Total",
            connectNulls: true,
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(242, 161, 33)",
                },
                {
                  offset: 1,
                  color: "rgb(166, 117, 39)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.rai,
            color: "rgb(242, 161, 33)",
          },
          {
            name: "Lusd",
            symbol: "circle",
            connectNulls: true,
            stack: "Total",
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(212, 223, 44)",
                },
                {
                  offset: 1,
                  color: "rgb(139, 146, 37)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.lusd,
            color: "rgb(212, 223, 44)",
          },
          {
            name: "Angle",
            type: "line",
            connectNulls: true,
            stack: "Total",
            symbol: "circle",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(55, 162, 255)",
                },
                {
                  offset: 1,
                  color: "rgb(116, 21, 219)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Angle,
            color: "rgb(55, 162, 255)",
          },
          {
            name: "Ageur",
            type: "line",
            stack: "Total",
            symbol: "circle",
            connectNulls: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(0, 221, 255)",
                },
                {
                  offset: 1,
                  color: "rgb(77, 119, 255)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.ageur,
            color: "rgb(0, 221, 255)",
          },
          {
            name: "AAVE",
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            stack: "Total",
            connectNulls: true,
            symbol: "circle",
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)",
                },
              ]),
            },
            color: "rgb(128, 255, 165)",
            emphasis: {
              focus: "series",
            },
            data: result.aave,
          },
          {
            name: "Eth",
            symbol: "circle",
            connectNulls: true,
            stack: "Total",
            type: "line",
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(57, 247, 160)",
                },
                {
                  offset: 1,
                  color: "rgb(53, 164, 113)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.eth,
            color: "rgb(57, 247, 160)",
          },
        ],
      };
      feiComBox = echarts.init(document.getElementById("fei-com-box"));
      feiComBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-fei-com {
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
  .fei-com-box {
    flex: 1;
    width: 105%;
    margin-top: -3%;
    margin-left: -3%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-fei-com {
    padding: 1rem;
    .fei-com-box {
      margin-top: -15%;
    }
  }
}
</style>