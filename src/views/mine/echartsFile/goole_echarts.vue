<template>
  <div class="btc-foam">
    <p>
      <!-- 谷歌搜索趋势图 -->
      {{ $t("year_vip.google_title") }}
    </p>
    <p class="h5">
      <!-- 谷歌搜索热度随时间变化的趋势(Google Trends) -->
      {{ $t("year_vip.google_remark") }}
    </p>
    <div class="echarts-tab">
      <div>
        <el-radio-group v-model="gooleType" size="mini" @change="coinType">
          <el-radio-button label="bitcoin">Bitcoin</el-radio-button>
          <el-radio-button label="ethereum">Ethereum</el-radio-button>
          <el-radio-button label="defi">DeFi</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <el-dropdown @command="gooleDateType">
          <p class="tab-con">
            <span>{{ gooleDateInner }}</span>
            <span class="iconfont icon-xia_down"></span>
          </p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1h">
              <!-- 1小时 -->
              {{ $t("echarts_filter.one_hour") }}
            </el-dropdown-item>
            <el-dropdown-item command="1d">
              <!-- 1天 -->
              {{ $t("echarts_filter.one_day") }}
            </el-dropdown-item>
            <el-dropdown-item command="7d">
              <!-- 7天 -->
              {{ $t("echarts_filter.one_week") }}
            </el-dropdown-item>
            <el-dropdown-item command="1m">
              <!-- 1个月 -->
              {{ $t("echarts_filter.one_month") }}
            </el-dropdown-item>
            <el-dropdown-item command="12m">
              <!-- 12个月 -->
              {{ $t("echarts_filter.one_year") }}
            </el-dropdown-item>
            <el-dropdown-item command="5y">
              <!-- 5年 -->
              {{ $t("echarts_filter.five_year") }}
            </el-dropdown-item>
            <el-dropdown-item command="2004">
              <!-- 全部 -->
              {{ $t("echarts_filter.all") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="goole-foam" id="goole-foam"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
let gooleBox; //谷歌搜索趋势图表
export default {
  name: "GooleEcharts",
  data() {
    return {
      gooleType: "bitcoin", //谷歌搜索数据类型
      gooleDate: "12m", //谷歌搜索数据时间
      gooleDateInner: this.$t("echarts_filter.one_year"), //谷歌搜索默认选项
    };
  },
  mounted() {
    setTimeout(async () => {
      await this.initGooleFoam();
      this.$emit("resizeEcharts", [gooleBox]);
    });
  },
  computed: {
    // gooleDateInner(){
    //   return this.$t('echarts_filter.one_year')
    // }
  },
  methods: {
    //搜索趋势类型
    coinType(_val) {
      gooleBox.dispose();
      this.initGooleFoam();
    },
    //搜索趋势时间
    async gooleDateType(_command, _label) {
      this.gooleDateInner = _label.$el.innerText;
      this.gooleDate = _command;
      gooleBox.dispose();
      await this.initGooleFoam();
      this.$emit("resizeEcharts", [gooleBox]);
    },
    // 搜索搜索趋势
    async initGooleFoam() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/trends/" +
            this.gooleType +
            "/" +
            this.gooleDate +
            "/data.json?timestamp=" +
            timestamp
        )
        .then((res) => {
          result = res.data;
        });
      let interNum =
        (this.gooleDate == "1h" && (this.$flag ? 18 : 2)) ||
        (this.gooleDate == "1d" && (this.$flag ? 50 : 10)) ||
        (this.gooleDate == "7d" && (this.$flag ? 50 : 15)) ||
        (this.gooleDate == "1m" && (this.$flag ? 8 : 2)) ||
        (this.gooleDate == "12m" && (this.$flag ? 18 : 6)) ||
        (this.gooleDate == "5y" && (this.$flag ? 80 : 17)) ||
        (this.gooleDate == "2004" && (this.$flag ? 60 : 17));
      const option = {
        height: this.$flag ? 260 : 230,
        tooltip: this.$flag
          ? {
              trigger: "axis",
            }
          : {
              trigger: "axis",
              position: function (p) {
                return [p[0] - 80, p[1] - 100];
              },
            },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          axisLine: false,
          interval: 5,
          axisLabel: {
            interval: interNum,
            color: "#A2A5B0",
            margin: 20,
            padding: this.$flag ? [0, 0, 0, 80] : [0, 0, 0, 0],
          },
          axisPointer: {
            label: {
              padding: [5, 10, 5, 10],
              backgroundColor: "white",
              color: "#222A42",
            },
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          offset: this.$flag ? "-20" : 0,
          splitLine: {
            interval: 2,
            lineStyle: {
              color: "#49537A",
              opacity: "0.2",
            },
          },
          axisLabel: {
            color: "#A2A5B0",
          },
        },
        dataZoom: "",
        series: [
          {
            data: result.number,
            type: "line",
            name: this.$t("year_vip.google_hot"),
            symbol: "none",
            lineStyle: {
              color: "#A7F0BA",
            },
            itemStyle: {
              color: "#A7F0BA",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(167,240,186,.4)",
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
      gooleBox = echarts.init(document.getElementById("goole-foam"));
      gooleBox.setOption(option);
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
      background: $info;
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
@media screen and (max-width: 1279px) {
  .echarts-tab {
    right: $padd24;
    div {
      .tab-con {
        padding: 0 0.4rem;
        min-width: 6rem;
      }
    }
    div:last-child {
      margin-left: 1rem;
    }
  }
}
.btc-foam {
  padding: 24px;
  background: $contentBg;
  min-height: 400px;
  margin-top: 40px;
  border-radius: 4px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  p {
    color: white;
    font-size: 17px;
  }

  .h5 {
    margin: 0;
    margin-top: 4px;
    font-size: 13px;
    color: $remarkColor;
  }
  .goole-foam {
    width: 122%;
    flex: 1;
    margin-left: -10.5%;
    margin-top: -20px;
  }
}
@media screen and (max-width: 1279px) {
  .echarts-tab {
    width: 100%;
    justify-content: space-between;
    left: -0.5rem;
    top: 3.5rem;
  }
  .btc-foam {
    padding: 1rem;
    height: 28rem;
    margin-top: 1rem;
    overflow-y: hidden;
    p {
      font-size: $fon14;
      .h5 {
        font-size: $fon12;
      }
    }
    .goole-foam {
      margin-top: 5%;
      margin-left: -10%;
      width: 122%;
    }
  }
}
</style>