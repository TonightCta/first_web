<template>
  <div class="cbbi-foam">
    <p class="h4">
      <!-- 比特币趋势指数CBBI -->
      {{ $t("year_vip.cbbi_title") }}
      <span
        class="iconfont icon-bangzhu_help"
        @click="cbbiRemark = true"
      ></span>
    </p>
    <p class="h5">CBBI Historical Chart</p>
    <p class="today-cbbi">
      <!-- 今日CBBI： -->
      {{ $t("year_vip.cbbi_today") }}
      <span>&nbsp;{{ todayCBBI }}</span>
    </p>
    <div class="cbbi-echarts" id="cbbi-echarts"></div>
    <!-- 全屏测试 -->
    <p class="full-screen" @click="openFull">
      <span class="iconfont icon-quanping"></span>
    </p>
    <div class="echarts-tab" :class="app.language == 'en' && $flag && 'echarts-tab-mobile'">
      <div>
        <el-dropdown @command="cbbiDateType">
          <p class="tab-con">
            <span>{{ cbbiDateTypeInner }}</span>
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
    <!-- CBBI说明 -->
    <modal :show.sync="cbbiRemark" modalClasses="search-box-modal">
      <div class="rich-remark">
        <p class="rich-remark-title">{{ remarkMsg.title }}</p>
        <p
          class="rich-remark-text"
          v-for="(remarkMsgText, indexRMsg) in remarkMsg.tootip"
          :key="indexRMsg"
        >
          {{ remarkMsgText }}
        </p>
        <p class="rich-remark-btn">
          <base-button type="default" round @click="cbbiRemark = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { Modal } from "@/components";
import axios from "axios";
import { mapState } from 'vuex';
let cbbiBox;
export default {
  name: "CBBIEcharts",
  data() {
    return {
      cbbiDateTypeInner: this.$t('echarts_filter.all'),
      cbbiDateTypeText: "all",
      todayCBBI: 0, //今日CBBI
      cbbiRemark: false, //CBBI说明
      // remarkMsg: 
    };
  },
  components: { Modal },
  mounted() {
    setTimeout(async () => {
      await this.initCbbi();
      this.$emit("resizeEcharts", [cbbiBox]);
    });
  },
  computed:{
    // cbbiDateTypeInner(){
    //   return this.$t('echarts_filter.all')
    // },
    ...mapState(['app']),
    remarkMsg(){
      return {
        title: this.$t('year_vip.cbbi_title'),
        tootip: [
          this.$t('year_vip.cbbi_remark_1'),
          "",
          this.$t('year_vip.cbbi_remark_2'),
          "",
          this.$t('year_vip.cbbi_remark_3'),
          "",
          this.$t('year_vip.cbbi_remark_4'),
          "",
          this.$t('year_vip.cbbi_remark_5'),
          "",
          this.$t('year_vip.cbbi_remark_6'),
        ],
      }
    }
  },
  methods: {
    //趋势指数时间类型
    async cbbiDateType(_command, _label) {
      this.cbbiDateTypeInner = _label.$el.innerText;
      this.cbbiDateTypeText = _command;
      cbbiBox.dispose();
      await this.initCbbi();
      this.$emit("resizeEcharts", [cbbiBox]);
    },
    //比特币趋势指数
    async initCbbi() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/cbbi/" +
            this.cbbiDateTypeText +
            "/latest.json?timestamp=" +
            timestamp
        )
        .then((res) => {
          result = res.data;
          this.todayCBBI = res.data.cbbi[res.data.cbbi.length - 1];
        });
      let interNum =
        (this.cbbiDateTypeText == "3m" && (this.$flag ? 6 : 3)) ||
        (this.cbbiDateTypeText == "6m" && (this.$flag ? 20 : 6)) ||
        (this.cbbiDateTypeText == "1y" && (this.$flag ? 40 : 20)) ||
        (this.cbbiDateTypeText == "2y" && (this.$flag ? 70 : 35)) ||
        (this.cbbiDateTypeText == "all" && (this.$flag ? 400 : 100));
      const option = {
        height: 380,
        color: "white",
        tooltip: {
          // show:this.$flag ? false : true,
          trigger: "axis",
          position: "",
          formatter: function (params) {
            let relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].seriesName == "CBBI") {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：            " +
                  params[i].value;
              } else {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  "：$ " +
                  params[i].value;
              }
            }
            return relVal;
          },
        },
        legend: {
          data: ["CBBI", this.$t('year_vip.cbbi_price')],
          bottom: this.$flag ? "10" : "0",
          z: 100,
          textStyle: {
            color: "#ffffff",
          },
        },
        dataZoom: "",
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          offset: 16,
          axisLine: false,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            rotate: this.$flag ? 0 : 70,
            interval: interNum,
            color: "#A2A5B0",
            padding: this.$flag ? [0, 40, 0, 30] : [0, 0, 0, 0],
          },
          axisPointer: {
            label: {
              padding: [5, 10, 5, 10],
              backgroundColor: "white",
              color: "#222A42",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#49537A",
              opacity: "0.4",
            },
          },
        },
        yAxis: [
          {
            type: "value",
            min: 0,
            offset: this.$flag ? "-30" : 0,
            position: "left",
            tooltip: {
              show: true,
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#49537A",
                opacity: "0.4",
              },
            },
            axisLabel: {
              color: "#A2A5B0",
            },
          },
          {
            type: this.$flag ? "value" : "log",
            min: 1,
            offset: this.$flag ? -50 : 0,
            max: 80000,
            axisLabel: {
              formatter: function (value, index) {
                let item = "";
                if (value === 10) {
                  item = "$ 10 \n \n$ 6";
                } else if (value === 100) {
                  item = "$ 100 \n \n$ 60";
                } else if (value === 1000) {
                  item = "\n$ 1,000 \n \n$ 600";
                } else if (value === 10000) {
                  item = "\n$ 10,000 \n \n$ 6000";
                } else {
                  item = "$ " + value;
                }
                return item;
              },
              color: "#A2A5B0",
            },

            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#49537A",
                opacity: "0.4",
              },
            },
          },
        ],
        series: [
          {
            data: result.cbbi,
            type: "line",
            name: "CBBI",
            symbol: "none",
            lineStyle: {
              color: "#33b1ff",
            },
            itemStyle: {
              color: "#33b1ff",
            },
            yAxisIndex: 0,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(51,177,255,.4)",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0)",
                },
              ]),
            },
          },
          {
            data: result.price,
            type: "line",
            name: this.$t('year_vip.cbbi_price'),
            symbol: "none",
            tooltip: {
              show: true,
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
            },
            lineStyle: {
              color: "#ff6666",
            },
            yAxisIndex: 1,
            itemStyle: {
              color: "#ff6666",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255,131,102,.4)",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0)",
                },
              ]),
            },
          },
        ],
      };
      !this.$flag &&
        (option.tooltip.position = function (p) {
          return [p[0] - 80, p[1] - 100];
        });
      this.$flag &&
        (option.dataZoom = [
          {
            type: "inside",
            start: 100,
            end: 70,
            show: false,
          },
          {
            start: 100,
            end: 70,
            show: false,
          },
        ]);
      cbbiBox = echarts.init(document.getElementById("cbbi-echarts"));
      cbbiBox.setOption(option);
    },
    //打开全屏
    openFull() {
      window.openScreen();
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
  z-index: 1000;
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
.echarts-tab-mobile{
  top:$size48;
}
.full-screen {
  position: absolute;
  top: 5.2rem;
  right: 1rem;
  width: $padd24;
  height: $padd24;
  background: $conBg2;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  .iconfont {
    color: $textColor;
    font-size: $fon18;
    font-weight: bold;
  }
}
.cbbi-foam {
  padding: 24px;
  background: $contentBg;
  min-height: 638px;
  margin-top: 40px;
  border-radius: 4px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
  transition: 0.3s all;
  .h4 {
    margin-bottom: 0;
    color: white;
    position: relative;
    z-index: 200;
    .iconfont {
      font-size: 16px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .today-cbbi {
    position: absolute;
    width: 100%;
    top: 24px;
    left: 0;
    font-size: 13px;
    color: white;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: 27px;
      color: $success;
    }
  }
  p {
    color: white;
  }
  .h5 {
    margin: 0;
    margin-top: 4px;
    color: $remarkColor;
  }
  .cbbi-echarts {
    flex: 1;
    width: 119%;
    margin-left: -10%;
    margin-top: -30px;
  }
}
.rich-remark {
  .rich-remark-title {
    font-size: 17px;
    text-align: center;
    margin-bottom: 30px;
  }
  .rich-remark-text {
    line-height: 30px;
    font-size: 13px;
  }
  .rich-remark-btn {
    text-align: center;
    margin-top: 30px;
  }
}
@media screen and (min-width: 1280px) {
  .full-screen {
    display: none;
  }
}
@media screen and (max-width: 1279px) {
  .echarts-tab {
    right: 1rem;
  }
  .cbbi-foam {
    padding: 1rem;
    // min-height: 800px;
    .today-cbbi {
      top: 5rem;
      span {
        font-size: $fon18;
      }
    }
    .cbbi-echarts {
      margin-top: 10%;
      width: 120%;
      margin-left: -10%;
    }
  }
  .rich-remark {
    padding: 2rem 1rem;
  }
}
</style>