<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-hop-eth">
      <p class="h4">
        <!-- Ethereum跨链桥TVL规模 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="hop-eth-box" id="hop-eth-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { HopEth } from "@/request/api";
let hopethBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initHopETH();
      this.$emit("resizeEcharts", [hopethBox]);
    });
  },
  methods: {
    async initHopETH() {
      const result = await HopEth();
      const option = {
        height: 280,
        tooltip: {
          trigger: "axis",
          valueFormatter:(value) => '$ ' + Number(value).toFixed(4)
        },
        legend: {
          textStyle: {
            color: "#dddfe6",
          },
          type: this.$flag ? "scroll" : null,
          orient: this.$flag ? "plain" : "vertical",
          right: this.$flag ? 10 : 70,
          top: this.$flag ? 380 : 60,
        },
        grid: {
          left: "3%",
          right: this.$flag ? '5%' : "27%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          offset: 10,
          axisTick: false,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
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
              return value / 1e9 + " B";
            },
          },
        },
        series: [
          {
            name: "Arbitrum Bridges",
            type: "line",
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
                  color: "rgb(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Arbitrum_Bridges,
          },
          {
            name: "Avalanche Bridge",
            type: "line",
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
            data: result.Avalanche_Bridge,
          },
          {
            name: "BSC Anyswap Bridge",
            type: "line",
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
            data: result.BSC_Anyswap_Bridge,
          },
          {
            name: "Boba Network Bridge",
            type: "line",
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
            data: result.Boba_Network_Bridge,
          },
          {
            name: "Fantom Anyswap Bridge",
            type: "line",
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
            data: result.Fantom_Anyswap_Bridge,
          },
          {
            name: "Harmony Bridges",
            type: "line",
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
                  color: "rgb(255, 91, 0)",
                },
                {
                  offset: 1,
                  color: "rgb(224, 162, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Harmony_Bridges,
          },
          {
            name: "Moonriver Anyswap Bridge",
            type: "line",
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
                  color: "rgb(155, 191, 0)",
                },
                {
                  offset: 1,
                  color: "rgb(124, 62, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Moonriver_Anyswap_Bridge,
          },
          {
            name: "Near Rainbow Bridge",
            type: "line",
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
                  color: "rgb(115, 191, 0)",
                },
                {
                  offset: 1,
                  color: "rgb(214, 62, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Near_Rainbow_Bridge,
          },
          {
            name: "Nomad Bridge",
            type: "line",
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
                  color: "rgb(225, 121, 0)",
                },
                {
                  offset: 1,
                  color: "rgb(214, 72, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Nomad_Bridge,
          },
          {
            name: "Optics Bridge",
            type: "line",
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
                  color: "rgb(185, 131, 0)",
                },
                {
                  offset: 1,
                  color: "rgb(164, 65, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Optics_Bridge,
          },
          {
            name: "Optimism Bridges",
            type: "line",
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
                  color: "rgb(255, 191, 10)",
                },
                {
                  offset: 1,
                  color: "rgb(224, 22, 176)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Optimism_Bridges,
          },
          {
            name: "Polygon Bridges",
            type: "line",
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
                  color: "rgb(155, 191, 30)",
                },
                {
                  offset: 1,
                  color: "rgb(204, 62, 96)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Polygon_Bridges,
          },
          {
            name: "RSK Token Bridge",
            type: "line",
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
                  color: "rgb(195, 191, 105)",
                },
                {
                  offset: 1,
                  color: "rgb(244, 22, 116)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.RSK_Token_Bridge,
          },
          {
            name: "Ronin Bridge",
            type: "line",
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
                  color: "rgb(205, 191, 20)",
                },
                {
                  offset: 1,
                  color: "rgb(164, 62, 26)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Ronin_Bridge,
          },
          {
            name: "Solana Wormhole",
            type: "line",
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
                  color: "rgb(215, 191, 20)",
                },
                {
                  offset: 1,
                  color: "rgb(184, 162, 26)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Solana_Wormhole,
          },
          {
            name: "Synapse Bridge",
            type: "line",
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
                  color: "rgb(125, 198, 20)",
                },
                {
                  offset: 1,
                  color: "rgb(134, 72, 26)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.Synapse_Bridge,
          },
          {
            name: "ZkSync Bridge",
            type: "line",
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
                  color: "rgb(95, 191, 20)",
                },
                {
                  offset: 1,
                  color: "rgb(64, 62, 26)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.ZkSync_Bridge,
          },
          {
            name: "xDAI Bridges",
            type: "line",
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
                  color: "rgb(25, 191, 20)",
                },
                {
                  offset: 1,
                  color: "rgb(84, 62, 26)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: result.xDAI_Bridges,
          },
        ],
      };
      hopethBox = echarts.init(document.getElementById("hop-eth-box"));
      hopethBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-hop-eth {
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
  .hop-eth-box {
    flex: 1;
    margin-top: -3%;
    width: 108%;
    margin-left: -3%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-hop-eth {
    padding: 1rem;
    margin-bottom: 1rem;
    height: 42.5rem;
    .h4{
      font-size: 1rem;
    }
    .hop-eth-box{
      margin-top: -15%;
    }
  }
}
</style>