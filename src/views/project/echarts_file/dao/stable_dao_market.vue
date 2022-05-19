<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-dao-market">
      <p class="h4">
        <!-- Treasure Market每日成交量 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="market-box" id="market-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { Maglc } from "@/request/api";
let marketBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initMarketBox();
      this.$emit("resizeEcharts", [marketBox]);
    });
  },
  methods: {
    async initMarketBox() {
      const result = await Maglc({ type: 1 });
      const option = {
        height:270,
        xAxis: {
          type: "category",
          data: result.time,
          offset:10,
          axisLabel:{
            textStyle:{
              color:'#dddfe6'
            }
          },
          axisTick:false,
          axisLine:{
            lineStyle:{
              color:'#242D52'
            }
          }
        },
        tooltip:{
          trigger:'axis',
          position: this.$flag ? ['25%','37%'] : ''
        },
        yAxis: {
          type: "value",
          splitNumber:4,
          axisLabel: {
            textStyle:{
              color:'#dddfe6'
            },
            formatter: function (value) {
              return (value / 1000000).toFixed(1) + " M";
            },
          },
          splitLine: {
            lineStyle: {
              color: "#242D52",
              type:'dashed'
            },
          },
        },
        series: [
          {
            data: result.data,
            name:'USD',
            type: "bar",
            color:'#119529'
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{x:50})
      marketBox = echarts.init(document.getElementById("market-box"));
      marketBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-dao-market {
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
  .market-box {
    flex: 1;
    margin-top: -7%;
    width: 116.5%;
    margin-left: -5%;
  }
}
@media screen and (max-width:1279px){
  .stable-dao-market{
    padding:1rem;
    .market-box{
      width: 110%;
      margin-top: -14%;
      margin-left: -2%;
    }
  }
}
</style>