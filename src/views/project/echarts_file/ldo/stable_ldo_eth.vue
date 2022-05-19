// 质押资产总价值 - Ethereum
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-ldo-eth">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="eth-box" id="eth-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { LdoAmount } from "@/request/api";
let ethBox;
export default {
  props:['title','desc'],
  mounted() {
    setTimeout(async () => {
      await this.initPeople();
      this.$emit("resizeEcharts", [ethBox]);
    });
  },
  methods: {
    async initPeople() {
      let _this = this;
      const result = await LdoAmount();
      result.Ethereum = result.Ethereum.map((item) => {
        return item / 1000000;
      });
      const option = {
        height: this.$flag ? 290 : 280,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                "&nbsp;Ethereum&nbsp;&nbsp;&nbsp;" +
                _this.toThousands(e.data * 1000000) +
                " ETH";
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
          // interval: 5,
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
            name: "Ethereum",
            type: "line",
            stack: "Total",
            smooth: true,
            z: 20,
            itemStyle: {
              color: "#33ADFF",
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(51,173,255,.4)",
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
            data: result.Ethereum,
          },
        ],
      };
      ethBox = echarts.init(document.getElementById("eth-box"));
      ethBox.setOption(option);
    },
    toThousands(num) {
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-ldo-eth {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  height: 400px;
  display: flex;
  flex-direction: column;
  .h4 {
    position: relative;
    z-index: 100;
    color:$textColor;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .eth-box {
    flex: 1;
    width: 105%;
    margin-top: -7%;
    margin-left: -2%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-ldo-eth {
    padding: 1rem;
    .h4 {
      font-size: 0.81rem;
    }
    .eth-box {
      margin-top: -12%;
    }
  }
}
</style>