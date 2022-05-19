// 我们的成绩
<template>
  <div class="we-grades">
    <p class="we-title">
      <!-- 我们的投研成果 -->
      {{ $t("index.we_gra.gra_title") }}
    </p>
    <p class="we-remark">
      <!-- 以下展示头等仓研报发布至今的各个区块链创新项目的波动情况 -->
      {{ $t("index.we_gra.gra_title_1") }}
    </p>
    <div class="grades-msg">
      <p class="msg-total">
        <!-- 项目总数： -->
        {{ $t("index.we_gra.gra_total")
        }}<span>&nbsp;{{ proTotal }}&nbsp;{{ $t("index.we_gra.gra_unit") }}</span>
      </p>
      <!-- 更新时间： -->
      <p class="msg-date">{{ $t("index.we_gra.gra_date") }}{{ upDate }}</p>
      <!-- 涨幅率 -->
      <p class="canvas-title">{{ $t("index.we_gra.gra_inc") }}</p>
      <!-- 项目数占比 -->
      <p class="title-two">
        {{ $t("index.we_gra.gra_pre") }}
      </p>
      <div class="echarts-box" id="echarts-box"></div>
      <div class="mine-legend">
        <p>
          <!-- 投研项目涨幅率数据 -->
          {{ $t("index.we_gra.gra_inc_2") }}
        </p>
        <ul>
          <li>
            <span></span>
            >&nbsp;1000%
          </li>
          <li>
            <span></span>
            >&nbsp;500%
          </li>
          <li>
            <span></span>
            >&nbsp;200%
          </li>
          <li>
            <span></span>
            >&nbsp;50%
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ourAchievement } from "@/request/api";
import * as echarts from "echarts";
import { mapState } from 'vuex';
export default {
  name: "WeGrades",
  data() {
    return {
      gradesBox: null,
      proTotal: 0, //项目总数
      upDate: null, //更时间
    };
  },
  computed:{
    ...mapState(['app'])
  },
  methods: {
    //我们的成绩
    async initEcharts() {
      const result = await ourAchievement();
      let arr = [];
      for (let i in result) {
        arr.push((result[i] / result.count) * 100);
      }
      arr = arr.sort((x, y) => {
        return x - y;
      });
      this.proTotal = result.count;
      this.upDate = result.time;
      let _this = this;
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = "";
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" +
                params[i].marker +
                " " +
                params[i].seriesName +
                "：  " +
                params[i].value.toFixed(2) +
                " %";
            }
            return relVal;
          },
        },
        grid: {
          left: 100,
        },
        xAxis: {
          type: "value",
          interval: 20,
          z: 10,
          axisLabel: {
            formatter: "{value} %",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#49537A",
            },
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          axisLine: false,
          splitLine: true,
          data: [">1000%", ">500%", ">200%", ">50%"],
          axisLabel: {
            color: "#A2A5B0",
          },
        },
        series: [
          {
            //项目数占比
            name: this.$t('index.we_gra.gra_pre'),
            type: "bar",
            label: {
              show: true,
              formatter: function (params) {
                return Math.floor((params.data / 100) * result.count) + (_this.app.language == 'en' ? '' : " 个");
              },
            },
            z: 12,
            barWidth: 40,
            data: arr,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "rgba(51,177,255,.1)", // 0% 处的颜色
                    },
                    {
                      offset: 0.5,
                      color: "rgba(51,177,255,.5)", // 50% 处的颜色
                    },
                    {
                      offset: 1,
                      opacity: 0.1,
                      color: "rgba(51,177,255,.1)", // 100% 处的颜色
                    },
                  ],
                  false
                ),
                borderColor: "#33B1FF",
              },
            },
          },
        ],
      };
      this.gradesBox = echarts.init(document.getElementById("echarts-box"));
      this.gradesBox.setOption(option);
    },
    //移动端初始化
    async initEchartsMobile() {
      const result = await ourAchievement();
      let arr = [];
      this.proTotal = result.count;
      this.upDate = result.time;
      const option = {
        angleAxis: {
          max: this.proTotal,
          show: false,
        },
        radiusAxis: {
          type: "category",
          data: [
            `${result[1000]}${this.app.language == 'en' ? '' : '个'}`,
            `${result[500]}${this.app.language == 'en' ? '' : '个'}`,
            `${result[200]}${this.app.language == 'en' ? '' : '个'}`,
            `${result[50]}${this.app.language == 'en' ? '' : '个'}`,
          ],
          z: 10,
          axisLine: false,
          splitLine: false,
          axisLabel: {
            color: "white",
          },
        },
        polar: {
          radius:'100%',
          center: ["53%", "50%"],
        },
        series: [
          {
            type: "bar",
            data: [
              { value: result[1000], itemStyle: { color: "#FF6B6B" } },
              { value: result[500], itemStyle: { color: "#FF9752" } },
              { value: result[200], itemStyle: { color: "#33ADFF" } },
              { value: result[50], itemStyle: { color: "#2DE0BD" } },
            ],
            coordinateSystem: "polar",
            showBackground: true,
            backgroundStyle: {
              color: "#1B2447",
            },
          },
        ],
      };
      this.gradesBox = echarts.init(document.getElementById("echarts-box"));
      this.gradesBox.setOption(option);
    },
  },
  mounted() {
    !this.$flag ? this.initEcharts() : this.initEchartsMobile();
  },
};
</script>

<style lang="scss" scoped>
.we-grades {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  font-size: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 100px;
  background: url("../../assets/images/pageIcon/we_grades.png");
  background-size: 100% 100%;
  p {
    color: white;
    padding-left: 19.5%;
    text-align: left;
  }
  .we-title {
    font-size: 28px;
    color: $success;
  }
  .we-remark {
    font-size: 14px;
    color: white;
    margin-top: 16px;
  }
  .grades-msg {
    position: relative;
    width: 60%;
    margin: 0 auto;
    p {
      position: absolute;
    }
    .msg-total {
      top: 100px;
      left: 0;
      padding: 0;
      font-size: 17px;
      color: $remarkColor;
      span {
        color: white;
      }
    }
    .msg-date {
      left: 150px;
      top: 102px;
      text-align: right;
      font-size: 13px;
      color: $remarkColor;
    }
    .canvas-title {
      top: 148px;
      font-size: 13px;
      color: $remarkColor;
      left: 16px;
      height: 480px;
      padding-top: 20px;
      padding: 0;
    }
    .title-two {
      position: absolute;
      bottom: 50px;
      right: -100px;
      font-size: 13px;
      color: $remarkColor;
    }
  }
  .echarts-box {
    width: 114%;
    margin: 0 auto;
    height: 460px;
    margin-top: 100px;
    margin-left: -3%;
  }
  .mine-legend {
    position: absolute;
    width: 100%;
    bottom: -4rem;
    p {
      font-size: $fon12;
      font-weight: bold;
      color: white;
      text-align: center;
      width: 100%;
    }
    ul {
      display: flex;
      margin-top: 1.5rem;
      justify-content: center;
      li {
        font-size: $fon12;
        color: $textColor;
        margin-right: 1rem;
        span {
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          // transform: translateY(1px);
        }
      }
      li:first-child {
        span {
          background: #ff6b6b;
        }
      }
      li:nth-child(2) {
        span {
          background: #ff9752;
        }
      }
      li:nth-child(3) {
        span {
          background: #33adff;
        }
      }
      li:last-child {
        span {
          background: #2de0bd;
        }
        margin-right: 0;
      }
    }
  }
}
@media screen and (min-width: 1280px) {
  .mine-legend {
    display: none !important;
  }
}
@media screen and (max-width: 1279px) {
  .we-grades {
    position: relative;
    padding-top: 0;
    p {
      padding: 0 $padd24;
    }
    .we-title {
      font-size: $fon18;
    }
    .we-remark {
      font-size: $fon12;
      line-height: $padd24;
      margin-top: 1rem;
    }
    .grades-msg {
      margin: 0;
      width: 100%;
      .msg-total {
        top: $padd40;
        left: $padd24;
        font-size: $fon14;
      }
      .msg-date {
        top: $padd40;
        right: 0;
        font-size: $fon12;
      }
      .canvas-title {
        display: none;
      }
      .title-two {
        display: none;
      }
    }
    .echarts-box {
      width: 100%;
      height: 22.5rem;
    }
  }
}
</style>