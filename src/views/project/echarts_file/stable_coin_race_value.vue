// 稳定币赛道-市值
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-coin-race-value">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="echarts-inner">
        <div class="all-inner" id="all-inner"></div>
        <div class="other-inner" id="other-inner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
let allBox; //全部种类
let otherBox; //其他种类
export default {
  props: ["title", "desc"],
  name: "StableCoinRaceValue",
  data() {
    return {};
  },
  mounted() {
    setTimeout(async () => {
      await this.initAllBox();
      await this.initOther();
      this.$emit("resizeEcharts", [allBox, otherBox]);
    });
  },
  methods: {
    //全部种类
    async initAllBox() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/charts/stablecoin/percentage_list.json?timestamp=" + timestamp
        )
        .then((res) => {
          result = res.data;
        });
      const option = {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let relVal = params.seriesName;
            relVal +=
              "<br/>" +
              params.marker +
              " " +
              params.name +
              "：    " +
              Number(params.value).toFixed(2) +
              " %";
            return relVal;
          },
        },
        legend: {
          bottom: "-5px",
          left: "center",
          itemWidth: 12,
          itemHeight: 8,
          textStyle: {
            color: "white",
          },
        },
        series: [
          {
            name: this.$t('project_interface.pre_city'),//市值占比
            type: "pie",
            radius: this.$flag ? ["40%", "60%"] : ["55%", "80%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "12",
                color: "white",
                fontWeight: "bold",
                formatter: "{b} {c} %",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: result[0].value,
                name: this.$t('project_interface.around_city'),//中心化稳定币
                itemStyle: { color: "#B85CFF" },
              },
              {
                value: 100 - result[0].value,
                name: this.$t('project_interface.un_around_city'),//去中心化稳定币
                itemStyle: { color: "#EDF57F" },
              },
            ],
          },
        ],
      };
      allBox = echarts.init(document.getElementById("all-inner"));
      allBox.setOption(option);
    },
    //其他种类
    async initOther() {
      let result;
      await axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/charts/stablecoin/percentage_list.json"
        )
        .then((res) => {
          result = res.data.splice(1, 8);
        });
      const option = {
        color: [
          "#2DE0BD",
          "#EDF57F",
          "#FF6B6B",
          "#33ADFF",
          "#288F7B",
          "#FF9752",
          "#825CFF",
          "#304270",
        ],
        // padding: [0, 0, 100, 0],
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let relVal = params.seriesName;
            relVal +=
              "<br/>" +
              params.marker +
              " " +
              params.name +
              "：    " +
              Number(params.value).toFixed(2) +
              " %";
            return relVal;
          },
        },
        legend: {
          bottom: "-5px",
          left: "center",
          itemWidth: 12,
          itemHeight: 8,
          textStyle: {
            color: "white",
          },
        },
        series: [
          {
            name: this.$t('project_interface.pre_city'),//市值占比
            type: "pie",
            radius: this.$flag ? ["40%", "60%"] : ["50%", "75%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "16",
                color: "white",
                fontWeight: "bold",
                formatter: "{b} {c} %",
              },
            },
            labelLine: {
              show: false,
            },
            data: result,
          },
        ],
      };
      otherBox = echarts.init(document.getElementById("other-inner"));
      otherBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-coin-race-value {
  height: 320px;
  background: $contentBg;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  .h4 {
    position: relative;
    z-index: 100;
    .iconfont {
      font-size: 15px;
      color: $textColor;
    }
  }
  .echarts-inner {
    flex: 1;
    display: flex;
    margin-top: -10px;
    div {
      width: 50%;
    }
    .all-inner {
      margin-left: 6%;
    }
    .other-inner {
      width: 110%;
    }
  }
}
@media screen and (max-width: 1279px) {
  .stable-coin-race-value {
    padding: 1rem;
    height: 44rem;
    .h4 {
      font-size: 1rem;
    }
    .echarts-inner {
      flex-direction: column;
      div {
        width: 100% !important;
        height: 100%;
      }
      .all-inner {
        margin-left: 0;
      }
    }
  }
}
</style>