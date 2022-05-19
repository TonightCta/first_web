<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-eden-pledge">
      <p class="h4">
        <!-- 代币质押情况 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="pledge-box" id="pledge-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { EdenPledge } from "@/request/api";
let pledgerbox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initPledgeTwoBox();
      this.$emit("resizeEcharts", [pledgerbox]);
    });
  },
  methods: {
    async initPledgeTwoBox() {
      let _this = this;
      const result = await EdenPledge();
      let option = {
        height: 230,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                (e.seriesName == _this.$t("eden.staked") ? (e.data / 1000000) : e.data) +
                (e.seriesName == _this.$t("eden.staked") ? " m" : "")
            });
            return params[0].axisValue + result;
          },
          position: this.$flag ? ['25%','37%'] : ''
        },
        xAxis: {
          type: "category",
          data: result.time,
          axisLine: false,
          offset: 10,
          axisLabel: {
            color: "white",
          },
        },
        yAxis: [
          {
            type: "log",
            splitLine: {
              lineStyle: {
                color: "#242D52",
              },
            },
            axisLabel: {
              color: "white",
            },
          },
          {
            type: "value",
            splitLine: {
              lineStyle: {
                color: "#242D52",
              },
            },
            axisLabel: {
              color: "white",
              formatter: function (value, index) {
                return value / 1000000 + " m";
              },
            },
          },
        ],
        legend: {
          data: [
            //质押人数
            this.$t("ldo.num"),
            //质押数
            this.$t("eden.staked"),
          ],
          textStyle: {
            color: "white",
          },
        },
        series: [
          {
            data: result.staker,
            yAxisIndex: 0,
            type: "bar",
            //质押人数
            name: this.$t("ldo.num"),
          },
          {
            data: result.staked,
            yAxisIndex: 1,
            color: "rgba(1, 191, 236,1)",
            type: "bar",
            //质押数
            name: this.$t("eden.staked"),
          },
        ],
      };
      this.$flag &&
        this.$set(option, "grid", {
          left: 50,
          right: 50,
        });
      pledgerbox = echarts.init(document.getElementById("pledge-box"));
      pledgerbox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-eden-pledge {
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
    width: 109%;
    margin-left: -4%;
    margin-top: -2%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-eden-pledge {
    padding: 1rem;
    .pledge-box {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>