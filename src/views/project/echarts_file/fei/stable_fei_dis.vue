<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-fei-dis">
      <p class="h4">
        <!-- FEI的持有分布(协议持有/用户持有) -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="fei-dis-box" id="fei-dis-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { FeiDis } from "@/request/api";
let feidisBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initFeiDis();
      this.$emit("resizeEcharts", [feidisBox]);
    });
  },
  methods: {
    async initFeiDis() {
      const result = await FeiDis();
      const option = {
        height: 250,
        tooltip: {
          trigger: "axis",
          valueFormatter:(value) => '$ ' + Number(value / 1e6).toFixed(0) + 'm'
        },
        legend: {
          textStyle: {
            color: "#dddfe6",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          axisTick: false,
          offset: 10,
          axisLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
            formatter: function (value) {
              return value / 1e6 + " m";
            },
          },
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        series: [
          {
            name: "User FEI",
            type: "line",
            stack: "Total",
            areaStyle: {},
            smooth: true,
            showSymbol: false,
            emphasis: {
              focus: "series",
            },
            data: result.user_fei,
          },
          {
            name: "Protocol FEI",
            type: "line",
            stack: "Total",
            smooth: true,
            showSymbol: false,
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: result.protocol_fei,
          },
        ],
      };
      feidisBox = echarts.init(document.getElementById("fei-dis-box"));
      feidisBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-fei-dis {
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
   .fei-dis-box {
    flex: 1;
    margin-top: -2%;
    width: 105%;
    margin-left: -3%;
  }
}
@media screen and (max-width:1279px){
  .stable-fei-dis{
    padding: 1rem;
  }
}
</style>