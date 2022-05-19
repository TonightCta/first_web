<template>
  <div class="contact-box">
    <!-- 持仓量 -->
    <div class="position-box">
      <p class="h4">
        <!-- 合约-持仓量 -->
        {{ $t("year_vip.contract_name") }}
      </p>
      <div class="position-echarts" id="position-echarts"></div>
      <div class="echarts-tab">
        <div>
          <el-radio-group
            v-model="positionType"
            size="mini"
            @change="coinPositionType"
          >
            <el-radio-button label="btc">Bitcoin</el-radio-button>
            <el-radio-button label="eth">Ethereum</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <el-dropdown @command="contactDateType">
            <p class="tab-con">
              <span>{{ contactCoinDateInner }}</span>
              <span class="iconfont icon-xia_down"></span>
            </p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="five">
                <!-- 5分钟 -->
                {{$t('echarts_filter.five_mins')}}
              </el-dropdown-item>
              <el-dropdown-item command="hour">
                <!-- 1小时 -->
                {{$t('echarts_filter.one_hour')}}
              </el-dropdown-item>
              <el-dropdown-item command="day">
                <!-- 1天 -->
                {{$t('echarts_filter.one_day')}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 锁仓量 -->
    <div class="lock-box">
      <p class="h4">
        <!-- DEFI总锁仓量 -->
        {{ $t("year_vip.difi_name") }}
      </p>
      <div class="lock-echarts" id="lock-echarts"></div>
      <div class="all-total">
        <p>
          <!-- 总金额： -->
          {{ $t("year_vip.difi_total") }}
          <span>{{ usdTotal / 10 }} B</span>
        </p>
      </div>
      <div class="echarts-tab">
        <div>
          <el-dropdown @command="lockDateType">
            <p class="tab-con">
              <span>{{ lockDateTypeInner }}</span>
              <span class="iconfont icon-xia_down"></span>
            </p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="30_day">
                <!-- 1个月 -->
                {{$t('echarts_filter.one_month')}}
              </el-dropdown-item>
              <el-dropdown-item command="90_day">
                <!-- 3个月 -->
                {{$t('echarts_filter.three_month')}}
              </el-dropdown-item>
              <el-dropdown-item command="1_year">
                <!-- 1年 -->
                {{$t('echarts_filter.one_year_2')}}
              </el-dropdown-item>
              <el-dropdown-item command="all">
                <!-- 全部 -->
                {{$t('echarts_filter.all')}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from 'vuex';
import axios from "axios";
let positonBox; //合约持仓量
let lockBox; //总锁仓量
export default {
  data() {
    return {
      positionType: "btc",
      contactCoinDateInner: this.$t('echarts_filter.one_day'),
      contactDateTypeText: "day",
      lockDateTypeInner: this.$t('echarts_filter.one_year_2'),
      lockDateTypeText: "1_year",
      usdTotal: "", //锁仓总额
    };
  },
  computed:{
    ...mapState(['app'])
  }, 
  mounted() {
    setTimeout(async () => {
      await this.initPosttion();
      await this.initLock();
      this.$emit("resizeEcharts", [positonBox, lockBox]);
    });
  },
  methods: {
    //持仓量币种类型
    coinPositionType(_val) {
      positonBox.dispose();
      this.initPosttion();
    },
    //持仓量时间类型
    async contactDateType(_command, _label) {
      this.contactCoinDateInner = _label.$el.innerText;
      this.contactDateTypeText = _command;
      positonBox.dispose();
      await this.initPosttion();
      this.$emit("resizeEcharts", [positonBox, lockBox]);
    },
    //持仓量图表初始化
    async initPosttion() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/" +
            this.positionType +
            "/longShortChart.json?timestamp=" +
            timestamp
        )
        .then((res) => {
          result = res.data;
        });
      let xAxisData = [];
      let data1 = [];
      let data2 = [];
      let data3 = [];
      if (this.contactDateTypeText == "five") {
        xAxisData = result.minute.dateList;
        data1 = result.minute.longRateList;
        data2 = result.minute.shortsRateList;
        data3 = result.minute.longShortRateList;
      } else if (this.contactDateTypeText == "hour") {
        xAxisData = result.hours_one.dateList;
        data1 = result.hours_one.longRateList;
        data2 = result.hours_one.shortsRateList;
        data3 = result.hours_one.longShortRateList;
      } else if (this.contactDateTypeText == "day") {
        xAxisData = result.hours_twenty_four.dateList;
        data1 = result.hours_twenty_four.longRateList;
        data2 = result.hours_twenty_four.shortsRateList;
        data3 = result.hours_twenty_four.longShortRateList;
      }
      let emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.3)",
        },
      };
      const option = {
        height: 190,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].seriesName == "多空单比例：") {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  params[i].value;
              } else {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  " " +
                  params[i].seriesName +
                  ' '
                  +
                  params[i].value +
                  " %";
              }
            }
            return relVal;
          },
          position: this.$flag ? ['25%','37%'] : ''
        },
        xAxis: {
          data: xAxisData,
          axisLine: false,
          splitLine: false,
          splitArea: false,
          axisLabel: {
            color: "#A2A5B0",
          },
          axisPointer: {
            label: {
              padding: [5, 10, 5, 10],
              backgroundColor: "white",
              color: "#222A42",
            },
          },
        },
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 100,
            splitNumber: 2,
            offset: -10,
            z: 2,
            splitLine: {
              lineStyle: {
                color: "#49537A",
                width: 2,
              },
            },
            axisLabel: {
              color: "#A2A5B0",
              formatter: "{value}% ",
            },
          },
          {
            type: "value",
            min: 0,
            splitLine: false,
            axisLabel: {
              color: "#A2A5B0",
            },
          },
        ],
        dataZoom: "",
        series: [
          {
            name: this.$t('year_vip.contract_remark_1'),
            type: "bar",
            stack: "one",
            emphasis: emphasisStyle,
            data: data1,
            barWidth: this.$flag ? "10" : "18",
            yAxisIndex: 0,
            z: 1,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(167,240,186,0.6)" },
                { offset: 1, color: "rgba(0,0,0,0.1)" },
              ]),
              borderColor: "rgba(167,240,186,0.6)",
            },
          },
          {
            name: this.$t('year_vip.contract_remark_2'),
            type: "bar",
            stack: "one",
            emphasis: emphasisStyle,
            data: data2,
            barWidth: this.$flag ? "10" : "18",
            z: 1,
            yAxisIndex: 0,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(0,0,0,0.1)" },
                { offset: 1, color: "rgba(255,102,102,0.6)" },
              ]),
              borderColor: "rgba(255,102,102,0.6)",
            },
          },
          {
            name: this.$t('year_vip.contract_remark_3'),
            type: "line",
            data: data3,
            yAxisIndex: 1,
            symbol: "none",
            lineStyle: {
              color: "#33B1FF",
              width: 2,
            },
            z: 100,
            itemStyle: {
              color: "#33B1FF",
            },
          },
        ],
      };
      this.$flag &&
        (option.dataZoom = [
          {
            type: "inside",
            start: 100,
            end: 50,
            show: false,
          },
          {
            start: 100,
            end: 50,
            show: false,
          },
        ]);
      //初始化
      positonBox = echarts.init(document.getElementById("position-echarts"));
      positonBox.setOption(option);
    },
    //总锁仓量时间类型
    async lockDateType(_command, _label) {
      this.lockDateTypeInner = _label.$el.innerText;
      this.lockDateTypeText = _command;
      lockBox.dispose();
      await this.initLock();
      this.$emit("resizeEcharts", [positonBox, lockBox]);
    },
    //USD总锁仓量
    async initLock() {
      let result;
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/" +
            this.lockDateTypeText +
            "/lockedDeFi.json?timestamp=" +
            timestamp
        )
        .then((res) => {
          result = res.data;
          this.usdTotal = res.data.total.usd;
        });
      let interNum =
        (this.lockDateTypeText == "30_day" && 3) ||
        (this.lockDateTypeText == "90_day" && 11) ||
        (this.lockDateTypeText == "1_year" && (this.$flag ? 130 : 58)) ||
        (this.lockDateTypeText == "all" && (this.$flag ? 400 : 230));
      let _this = this;
      const option = {
        height: this.$flag ? 200 : 190,
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" +
                params[i].marker +
                " " +
                params[i].seriesName +
                ' ' +
                params[i].value + '  B'
                
            }
            return relVal;
          },
        },
        dataZoom: "",
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: result.time,
          axisLine: false,
          axisLabel: {
            interval: interNum,
            // padding: [0, 0, 0, 100],
            color: "#A2A5B0",
            margin: 16,
            padding: this.$flag ? [0, 0, 0, 80] : [0, 0, 0, 0],
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#49537A",
              opacity: "0.4",
            },
          },
          axisPointer: {
            label: {
              padding: [5, 10, 5, 10],
              backgroundColor: "white",
              color: "#222A42",
            },
          },
        },
        grid:{
          y:30
        },
        yAxis: {
          type: "value",
          min: 0,
          offset: this.$flag ? "-36" : "0",
          axisLabel: {
            formatter: "$ {value}B",
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
        series: [
          {
            data: result.usd,
            type: "line",
            name: this.$t('year_vip.difi_remark_1'),
            symbol: "none",
            smooth: true,
            lineStyle: {
              color: "#33b1ff",
            },
            itemStyle: {
              color: "#33b1ff",
            },
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
        ],
      };
      lockBox = echarts.init(document.getElementById("lock-echarts"));
      lockBox.setOption(option);
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
.contact-box {
  display: flex;
  height: 320px;
  margin-bottom: 40px;
  .position-box {
    width: 61.5%;
    height: 100%;
    background: $contentBg;
    border-radius: 4px;
    margin-right: 30px;
    padding: 24px;
    flex-direction: column;
    display: flex;
    position: relative;
    p {
      color: white;
    }
    .position-echarts {
      flex: 1;
      width: 117%;
      margin-top: -40px;
      margin-left: -8%;
    }
  }
  .lock-box {
    flex: 1;
    height: 100%;
    background: $contentBg;
    border-radius: 4px;
    padding: 24px;
    display: flex;
    width: 100%;
    overflow-x: hidden;
    flex-direction: column;
    position: relative;
    .all-total {
      width: 100%;
      position: absolute;
      font-size: 13px;
      top: 28px;
      text-align: center;
      span {
        font-size: 17px;
        font-weight: bold;
        color: $success;
        display: inline-block;
      }
    }
    p {
      color: white;
    }
    .lock-echarts {
      flex: 1;
      width: 116%;
      margin-top: -20px;
      margin-left: -5%;
    }
  }
}
@media screen and (max-width: 1366px) {
  .echarts-tab {
    width: 98%;
    display: flex;
    justify-content: space-between;
    left: -0.5rem;
    top: 2.5rem;
  }
  .contact-box {
    flex-wrap: wrap;
    height: auto;
    .h4 {
      font-size: $fon14;
    }
    .position-box {
      width: 100%;
      margin-bottom: $padd24;
      height: 22rem;
      padding: 1rem;
      margin-right: 0;
      overflow: hidden;
      .position-echarts {
        margin-top: 0;
        margin-left: 0;
        width: 100%;
      }
    }
    .lock-box {
      padding: 1rem;
      height: 22rem;
      overflow: hidden;
      .echarts-tab {
        top: 0.8rem;
        left: 0;
        justify-content: flex-end;
      }
      .lock-echarts {
        margin-top: 2%;
        width: 120%;
        margin-left: -8%;
      }
      .all-total {
        left: 0;
        top: 3.5rem;
      }
    }
  }
}
</style>