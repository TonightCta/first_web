<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-fei-pre">
      <p class="h4">
        <!-- PCV中代币资产占比(USD) -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="fei-pre-box" id="fei-pre-box"></div>
    </div>
  </div>
</template>

<script>
import { FeiPre } from "@/request/api";
import * as echarts from "echarts";
let feipreBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initFeiPre();
      this.$emit("resizeEcharts", [feipreBox]);
    });
  },
  methods: {
    async initFeiPre() {
      const result = await FeiPre();
      const option = {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let result = "";
            result +=
              "<br/>" +
              params.marker +
              `&nbsp;${params.name}&nbsp;&nbsp;&nbsp;$ ` +
              Number(params.value / 1e6).toFixed(2) +
              `m (${params.percent}%)`;
            return "USD" + result;
          },
          textStyle:{
            color:'#333'
          },
          position: this.$flag ? ["30%", "-10%"] : null,
        },
        legend: {
          textStyle: {
            color: "#dddfe6",
          },
        },
        series: [
          {
            name: "占比",
            type: "pie",
            radius: this.$flag ? "60%" : "80%",
            center: ["50%",`${this.$flag ? 70 : 60}%`],
            data: result,
            label: {
              normal:{
                show:true,
                position:'inner',
                textStyle:{
                  
                },
                formatter:"{d}%"
              }
            },
            labelLine:false,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
              },
            },
          },
        ],
      };
      feipreBox = echarts.init(document.getElementById("fei-pre-box"));
      feipreBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-fei-pre {
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
  .fei-pre-box {
    flex: 1;
    margin-top: 1%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-fei-pre {
    padding: 1rem;
  }
}
</style>