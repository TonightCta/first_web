<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-float-price">
      <p class="h4">
        <!-- Folat价格 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="float-price-box" id="float-price-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { FloatPrice } from "@/request/api";
let priceBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initPriceBox();
      this.$emit("resizeEcharts", [priceBox]);
    });
  },
  methods: {
    async initPriceBox() {
      const result = await FloatPrice();
      result.time = result.time.map((item) => {
        return item.substr(0, 10);
      });
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                Number(e.data).toFixed(2) +
                " USD";
            });
            return params[0].axisValue + result;
          },
          position: this.$flag ? ['25%','37%'] : ''
        },
        height: 250,
        legend: {
          top: 15,
          textStyle: {
            color: "white",
          },
        },
        xAxis: {
          type: "category",
          data: result.time,
          offset: 5,
          axisLabel: {
            textStyle: {
              color: "white",
            },
            padding: [0, 0, 0, 30],
          },
          axisLine: {
            lineStyle: {
              color: "#353e66",
            },
          },
          spliteNumber: 10,
          axisTick: false,
        },
        yAxis: {
          type: "value",
          offset:5,
          splitLine: {
            lineStyle: {
              color: "#353e66",
            },
          },
          axisLabel: {
            formatter: "{value} USD",
            textStyle: {
              color: "white",
            },
          },
        },
        series: [
          {
            data: result.price,
            name: "Float",
            showSymbol: false,
            type: "line",
          },
          {
            data: result.target_price,
            name: "Target Price",
            showSymbol: false,
            connectNulls:true,
            type: "line",
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{x:60})
      priceBox = echarts.init(document.getElementById("float-price-box"));
      priceBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-float-price {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 400px;
  .h4 {
    color: $textColor;
    position: relative;
    z-index: 200;
    .iconfont {
      font-size: 15px;
      cursor: pointer;
    }
  }
  .float-price-box {
    flex: 1;
    width: 115%;
    margin-left: -4%;
    margin-top: -3%;
  }
}
@media screen and (max-width:1279px){
  .stable-float-price{
    padding:1rem;
    .float-price-box{
      width: 106%;
      margin-top: -6%;
      margin-left: 0;
    }
  }
}
</style>