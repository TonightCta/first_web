<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-eden-pledge-two">
      <p class="h4">
        <!-- 代币质押情况 - Two -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="pledge-two-box" id="pledge-two-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { EdenPledgeTwo } from "@/request/api";
let pledgetworbox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initPledgeTwoBox();
      this.$emit("resizeEcharts", [pledgetworbox]);
    });
  },
  methods: {
    async initPledgeTwoBox() {
      const result = await EdenPledgeTwo();
      let option = {
        height: 260,
        tooltip: {
          trigger: "axis",
          position: this.$flag ? ['25%','37%'] : ''
        },
        xAxis: {
          type: "category",
          data: result.name,
          axisLine: false,
          offset: 10,
          axisLabel: {
            color: "white",
            rotate: 35,
          },
        },
        yAxis: {
          type: "log",
          max: 600000,
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
          axisLabel: {
            color: "white",
          },
        },
        series: [
          {
            data: result.number,
            type: "bar",
            name: "质押人数",
          },
        ],
      };
      this.$flag && this.$set(option,'grid',{left:55})
      pledgetworbox = echarts.init(document.getElementById("pledge-two-box"));
      pledgetworbox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-eden-pledge-two {
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
  .pledge-two-box {
    flex: 1;
    width: 115%;
    margin-left: -4%;
    margin-top: -7%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-eden-pledge-two {
    padding: 1rem;
    .pledge-two-box{
        width: 108%;
        margin-top: -15%;
        margin-left: 0;
    }
  }
}
</style>