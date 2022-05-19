//覆盖城市数
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-hnt-city">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="city-box" id="city-box"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { HntMsg } from "@/request/api";
let cityBox;
export default {
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initCityBox();
      this.$emit("resizeEcharts", [cityBox]);
    });
  },
  methods: {
    async initCityBox() {
      const result = await HntMsg({ type: 6 });
      const option = {
        height: this.$flag ? 250 : 230,
        xAxis: {
          type: "category",
          data: result.time,
          axisLine: false,
          offset: 10,
          axisLabel: {
            color: "white",
          },
        },
        tooltip: {
          trigger: "axis",
        },
        grid:{
          x:50,
          y2:30
        },
        yAxis: {
          type: "value",
          name: "覆盖城市数",
          nameTextStyle: {
            color: "#a2a5b0",
            align: "center",
            padding: [0, 35, 0, 0],
          },
          axisLabel: {
            color: "#dddfe6",
          },
          splitLine: {
            lineStyle: {
              color: "#242D52",
            },
          },
        },
        series: [
          {
            data: result.number,
            type: "line",
            name: "Number",
            color: "rgba(51,173,255,1)",
          },
        ],
      };
      cityBox = echarts.init(document.getElementById("city-box"));
      cityBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-hnt-city {
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
      cursor: pointer;
      color: $textColor;
    }
  }
  .city-box {
    flex: 1;
    width: 110%;
    margin-top: -2%;
    // margin-left: -4.5%;
  }
}
@media screen and (max-width: 1279px) {
  .stable-hnt-city {
    padding: 1rem;
    margin-bottom: 2rem;
    .city-box {
      width: 105%;
      margin-left: 0;
      margin-top: -8%;
    }
  }
}
</style>