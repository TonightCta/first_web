<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-convex-pledge">
      <p class="h4">
        <!-- CRV质押量 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="pledge-box" id="pledge-convex-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { Convex } from "@/request/api";
let pledgeConvexBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initPleConBox();
      this.$emit("resizeEcharts", [pledgeConvexBox]);
    });
  },
  methods: {
    async initPleConBox() {
      const result = await Convex({ type: 3 });
      // console.log(result);
      // return
      let option = {
        height: 260,
        xAxis: {
          type: "category",
          data: result.time,
          offset: 10,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
          },
          axisTick: false,
          axisLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        tooltip: {
          trigger: "axis",
          valueFormatter:(value) => Number(value).toFixed(2),
          position:  this.$flag ? ["25%", "37%"] : function (p) {
            return [p[0] - 100, p[1] - 100];
          },
        },
        yAxis: {
          type: "value",
          splitNumber: 4,
          axisLabel: {
            textStyle: {
              color: "#dddfe6",
            },
            formatter: function (value) {
              return value / 1e6 + " M";
            },
          },
          splitLine: {
            lineStyle: {
              color: "#242D52",
              type: "dashed",
            },
          },
        },
        series: [
          {
            data: result.convex,
            name: "Convex",
            type: "line",
            connectNulls: true,
            color: "#119529",
          },
          {
            data: result.stakedao,
            connectNulls: true,
            name: "StakeDao",
            type: "line",
            color: "#30cce7",
          },
          {
            data: result.other,
            connectNulls: true,
            name: "Other",
            type: "line",
            color: "#e73056",
          },
          {
            data: result.yearn,
            name: "Yearn",
            type: "line",
            connectNulls: true,
            color: "#c4208e",
          },
        ],
      };
      this.$flag && this.$set(option, "grid", { x: 50 });
      pledgeConvexBox = echarts.init(
        document.getElementById("pledge-convex-box")
      );
      pledgeConvexBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-convex-pledge {
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
  .pledge-box {
    flex: 1;
    margin-top: -3%;
    width: 120%;
    margin-left: -9%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-convex-pledge {
    padding: 1rem;
    margin-bottom: $padd24;
    .pledge-box {
      width: 110%;
      margin-top: -14%;
      margin-left: 0;
    }
  }
}
</style>