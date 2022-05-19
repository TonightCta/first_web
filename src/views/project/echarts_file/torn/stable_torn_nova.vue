Nova混币池规模
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-torn-nova">
      <p class="h4">
        <!-- Nova混币池规模 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="nova-box" id="nova-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { TornMsg } from "@/request/api";
import { mapState } from 'vuex';
let novaBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initNovaBox();
      this.$emit("resizeEcharts", [novaBox]);
    });
  },
  computed:{
    ...mapState(['app'])
  },
  methods: {
    async initNovaBox() {
      const result = await TornMsg({ type: 4 });
      const option = {
        height: this.$flag ? 280 : 270,
        // title: {
        //   subtext: this.app.language == "en" ? "Mixing pool size" : "混币池规模",
        //   left: 50,
        //   top: 20,
        //   subtextStyle: {
        //     color: "#a2a5b0",
        //   },
        // },
        xAxis: {
          type: "category",
          data: result.time,
          axisTick: false,
          axisLine: {
            lineStyle: {
              color: "#25345c",
            },
          },
          axisLabel: {
            color: "#dddfe6",
            margin: 15,
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                e.axisValue +
                "<br/>" +
                e.marker +
                `&nbsp;${e.seriesName}&nbsp;&nbsp;&nbsp;` +
                e.data;
            });
            return result;
          },
        },
        yAxis: {
          type: "value",
          splitNumber: 2,
          axisLabel: {
            color: "#dddfe6",
          },
          splitLine: {
            lineStyle: {
              color: "#222a42",
            },
          },
        },
        series: [
          {
            data: result.number,
            type: "line",
            name: "Total",
            color: "#aa992f",
          },
        ],
      };
      novaBox = echarts.init(document.getElementById("nova-box"));
      novaBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-torn-nova {
  padding: 24px;
  border-radius: 4px;
  background: $contentBg;
  margin: 16px 0;
  height: 400px;
  display: flex;
  flex-direction: column;
  .h4 {
    color: $textColor;
    margin-bottom: 0;
    position: relative;
    z-index: 200;
    .iconfont {
      cursor: pointer;
    }
  }
  .nova-box {
    flex: 1;
    width: 118%;
    margin-top: -4%;
    margin-left: -7%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-torn-nova {
    padding: 1rem;
    .nova-box {
      width: 110%;
      margin-left: -1%;
      margin-top: -10%;
    }
  }
}
</style>