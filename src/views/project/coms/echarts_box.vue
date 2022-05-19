<template>
  <div
    class="echarts-box"
    :class="$route.query.name == 'GRT' && 'more-height-parent'"
  >
    <div
      class="round-box"
      :class="$route.query.name == 'GRT' && 'more-height'"
      v-if="isHasRules"
    >
      <p class="h4">
        <!-- 代币分发规则 -->
        {{ $t("project_interface.coin_rules") }}
      </p>
      <div class="coin-lssue" id="coin-lssue"></div>
    </div>
    <div v-else class="round-box desc-msg">
      <p class="h4">
        <!-- 代币分发规则 -->
        {{ $t("project_interface.coin_rules") }}
      </p>
      <p>{{ desc }}</p>
    </div>
    <div class="label-box"></div>
    <div class="bar-box">
      <p class="h4">
        <!-- 社群活跃度 -->
        {{ $t("project_interface.active") }}
        <span
          class="iconfont icon-bangzhu_help"
          style="cursor: pointer"
          @click="$refs.remarkBox.remarkBox = true"
        ></span>
      </p>
      <div class="active-box" id="active-box"></div>
      <div class="echarts-tab" v-if="false">
        <div>
          <el-dropdown>
            <p class="tab-con">
              <span>
                <!-- 3个月 -->
                {{ $t("echarts_filter.three_month") }}
              </span>
              <span class="iconfont icon-xia_down"></span>
            </p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="3m">
                <!-- 3个月 -->
                {{ $t("echarts_filter.three_month") }}
              </el-dropdown-item>
              <el-dropdown-item command="6m">
                <!-- 6个月 -->
                {{ $t("echarts_filter.half_year") }}
              </el-dropdown-item>
              <el-dropdown-item command="1y">
                <!-- 1年 -->
                {{ $t("echarts_filter.one_year_2") }}
              </el-dropdown-item>
              <el-dropdown-item command="2y">
                <!-- 2年 -->
                {{ $t("echarts_filter.two_year") }}
              </el-dropdown-item>
              <el-dropdown-item command="all">
                <!-- 全部 -->
                {{ $t("echarts_filter.all") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 说明 -->
    <RemarkBox ref="remarkBox" :remarkMsg="remarkMsg"></RemarkBox>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { coinLssue, coinActive } from "@/request/api";
let lssueBox; //代币分发规则
let activeBox; //社区活跃度
export default {
  props: ["projectId", "desc", "symbol"],
  name: "EchartsBox",
  data() {
    return {
      // remarkMsg: {},
      isHasRules: true,
    };
  },
  components: {
    RemarkBox: (resolve) => require(["@/views/coms/remark_box"], resolve),
  },
  mounted() {
    setTimeout(async () => {
      await this.initCoinLssue();
      await this.initActive();
      this.$emit("resizeEcharts", [lssueBox, activeBox]);
    });
  },
  computed: {
    remarkMsg() {
      return {
        title: this.$t("project_interface.active"),
        tooltip: [this.$t("project_interface.active_remark")],
      };
    },
  },
  methods: {
    //代币分发规则
    async initCoinLssue() {
      const result = await coinLssue({ id: this.projectId });
      result.length > 0 ? (this.isHasRules = true) : (this.isHasRules = false);
      const tooltipData = {};
      result.forEach((e) => {
        tooltipData[e.name] = e.value;
      });
      const data1 = result;
      const option = {
        color: [
          "#FFD45C",
          "#FF9752",
          "#FF6B6B",
          "#304270",
          "#33ADFF",
          "#2DE0BD",
          "#825CFF",
        ],
        tooltip: {
          show: this.$flag ? false : true,
          trigger: "item",
          formatter: function (params) {
            let retVal = params.seriesName;
            retVal +=
              "<br/>" +
              params.marker +
              " " +
              params.name +
              "： " +
              params.value +
              " %";
            return retVal;
          },
          position: function (p) {
            return [p[0] - 80, p[1] - 100];
          },
        },
        legend: {
          bottom: this.$flag ? "4%" : "30%",
          left: this.$flag ? "28%" : "5%",
          orient: "vertical",
          itemGap: 16,
          itemWidth: 12,
          itemHeight: 8,
          textStyle: {
            color: "white",
          },
          formatter: function (name) {
            return name + "     " + tooltipData[name] + " %";
          },
        },
        series: [
          {
            name: this.$t("project_interface.coin_rules_2"),
            type: "pie",
            radius: this.$flag ? ["50%", "70%"] : ["65%", "90%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: this.$flag ? "12" : "16",
                color: "white",
                fontWeight: "bold",
                formatter: "{b} {c} %",
              },
            },
            labelLine: {
              show: false,
            },
            data: data1,
          },
        ],
      };
      lssueBox = echarts.init(document.getElementById("coin-lssue"));
      result.length > 0 && lssueBox.setOption(option);
    },
    //社区活跃度
    async initActive() {
      const result = await coinActive({ id: this.projectId });
      const xAxisData = result.time;
      const data1 = result.followers_change;
      const data3 = result.interactive;
      let _this = this;
      const emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.3)",
        },
      };

      const option = {
        height: 220,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              if (
                params[i].seriesName == _this.$t("project_interface.add_fans")
              ) {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：              " +
                  params[i].value +
                  " 位";
              } else {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：" +
                  params[i].value +
                  " 次";
              }
            }
            return relVal;
          },
        },
        dataZoom: "",
        xAxis: {
          data: xAxisData,
          axisLine: false,
          splitLine: false,
          splitArea: false,
          axisLabel: {
            color: "#A2A5B0",
            margin: 10,
          },
        },
        yAxis: [
          {
            type: "value",
            min: 0,
            splitNumber: 2,
            position: "left",
            offset: this.$flag ? -20 : 0,
            axisLabel: {
              color: "#a7f0ba",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#49537A",
              },
            },
          },
          {
            type: "value",
            min: 0,
            offset: this.$flag ? -20 : 0,
            position: "right",
            splitLine: false,
            axisLabel: {
              color: "#FF6666",
            },
          },
        ],
        legend: [
          {
            bottom: this.$flag ? "10" : "0",
            right: this.$flag ? "5%" : "35%",
            textStyle: {
              color: "white",
              fontSize: 13,
              fontFamily: "微软雅黑",
            },
            itemWidth: 8,
            itemHeight: 8,
            data: [
              {
                name: _this.$t("project_interface.add_fans"),
                icon: "circle",
                itemStyle: {
                  color: "rgba(255,102,102,0.1)",
                  borderColor: "#a7f0ba",
                  borderWidth: 1,
                },
              },
            ],
          },
          {
            bottom: this.$flag ? "10" : "0",
            left: this.$flag ? "5%" : "35%",
            textStyle: {
              color: "white",
              fontSize: 13,
              fontFamily: "微软雅黑",
            },
            itemWidth: 8,
            itemHeight: 8,
            data: [
              {
                name: _this.$t("project_interface.interactive"),
                icon: "circle",
                itemStyle: {
                  color: "rgba(255,102,102,0.1)",
                  borderWidth: 1,
                },
              },
            ],
          },
        ],
        grid: {
          bottom: 100,
        },
        series: [
          {
            name: this.$t("project_interface.add_fans"),
            type: "bar",
            stack: "one",
            emphasis: emphasisStyle,
            data: data1,
            yAxisIndex: 0,
            barMaxWidth: 16,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(167,240,186,0.4)" },
                { offset: 0.5, color: "rgba(167,240,186,0.4)" },
                { offset: 1, color: "rgba(0,0,0,0)" },
              ]),
              borderColor: "#a7f0ba",
            },
          },
          {
            name: this.$t("project_interface.interactive"),
            type: "line",
            data: data3,
            yAxisIndex: 1,
            lineStyle: {
              color: "#FF6666",
              width: 4,
            },
            itemStyle: {
              color: "#FF6666",
              borderWidth: 4,
              borderColor: "#FF6666",
            },
          },
        ],
      };
      this.$flag &&
        (option.dataZoom = [
          {
            type: "inside",
            start: 0,
            end: 25,
            show: false,
          },
          {
            start: 0,
            end: 25,
            show: false,
          },
        ]);
      activeBox = echarts.init(document.getElementById("active-box"));
      activeBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.echarts-tab {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  z-index: 2000;
  div {
    display: flex;
    align-items: center;
    position: relative;
    .h5 {
      color: $remarkColor;
      margin-bottom: 3px;
      margin-right: 8px;
    }
    .tab-con {
      font-size: 13px;
      color: white;
      height: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 82px;
      padding: 0 8px;
      background: $conBg2;
      border-radius: 4px;
      cursor: pointer;
      .iconfont {
        font-size: 16px;
      }
    }
  }
  div:last-child {
    margin-left: 24px;
    .iconfont {
      margin-left: 10px;
    }
  }
}
.h4 {
  margin-bottom: 0;
  color: white;
  position: relative;
  z-index: 200;
}
@media screen and (max-width: 1560px) {
  .echarts-box {
    flex-wrap: wrap;
    .round-box {
      width: 100%;
      flex: none !important;
    }
    .label-box {
      display: none;
    }
    .bar-box {
      margin-top: 16px;
    }
  }
}
.echarts-box {
  display: flex;
  justify-content: space-between;
  min-height: 400px;
  margin-top: 16px;
  .round-box {
    background: $contentBg;
    border-radius: 4px;
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 400px;
    overflow: hidden;
    .coin-lssue {
      flex: 1;
      margin-right: -35%;
    }
  }
  .desc-msg {
    display: flex;
    align-items: center;
    width: 100%;
    p:first-child {
      width: 100%;
    }
    p:last-child {
      width: 100%;
      text-align: center;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      word-break: break-all;
      font-size: 14px;
      color: $success;
    }
  }
  .label-box {
    width: 30px;
  }
  .bar-box {
    background: $contentBg;
    min-height: 400px;
    border-radius: 4px;
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    .iconfont {
      color: $remarkColor;
      font-size: 16px;
    }
    .active-box {
      flex: 1;
      width: 112%;
      margin-top: -20px;
      margin-left: -5%;
    }
  }
}
@media screen and (max-width: 1279px) {
  .echarts-box {
    width: 100%;
    flex-direction: column;
    min-height: 62.5rem;
    .round-box {
      width: 100%;
      padding: 1rem;
      height: 550px;
      .coin-lssue {
        margin-right: 0;
        margin-left: -2%;
        margin-top: -70%;
      }
    }
    .more-height {
      height: 680px;
    }
    .label-box {
      display: none;
    }
    .bar-box {
      padding: 1rem;
      width: 100%;
      .active-box {
        width: 120%;
        margin-left: -10%;
      }
    }
  }
  .more-height-parent {
    min-height: 70.5rem;
  }
}
</style>