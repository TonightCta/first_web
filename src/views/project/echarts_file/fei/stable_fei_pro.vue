<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-fei-pro">
      <p class="h4">
        <!-- 协议持有的FEI分布情况 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="fei-pro-box" id="fei-pro-box"></div>
      <div class="inc-box">
        <ul>
          <li v-for="(inc, indexInc) in incList" :key="indexInc">
            $&nbsp;{{ Number(inc.value / 1e6).toFixed(2) }}m
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { FeiPro } from "@/request/api";
let feiproBox;
export default {
  data() {
    return {
      incList: [],
    };
  },
  props: ["title", "desc"],
  mounted() {
    setTimeout(async () => {
      await this.initFeiPro();
      this.$emit("resizeEcharts", [feiproBox]);
    });
  },
  methods: {
    async initFeiPro() {
      const result = await FeiPro();
      this.incList = result;
      const option = {
        tooltip: {
          trigger: "item",
          valueFormatter: (value) =>
            "$  " + Number(value / 1e6).toFixed(2) + "m",
        },
        legend: {
          orient: "vertical",
          textStyle: {
            color: "#dddfe6",
          },
          right: `${this.$flag ? 55 : 20}%`,
          top: this.$flag ? 'auto' : 45,
          bottom:this.$flag ? 20 : 'auto'
        },
        series: [
          {
            name: "占比",
            type: "pie",
            radius: ["50%", this.$flag ? "85%" : "80%"],
            center: [`${this.$flag ? 50 : 30}%`, `${this.$flag ? 30 : 50}%`],
            labelLine: {
              length: 30,
            },
            label: {
              formatter: "{d}%",
              position: "inner",
            },
            data: result,
          },
        ],
      };
      feiproBox = echarts.init(document.getElementById("fei-pro-box"));
      feiproBox.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-fei-pro {
  padding: 24px;
  height: 400px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
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
  .fei-pro-box {
    flex: 1;
  }
  .inc-box {
    position: absolute;
    top:0;
    right:10%;
    top:114px;
    ul {
      li {
        color: #dddfe6;
        height: 24px;
      }
    }
  }
}
@media screen and (max-width: 1279px) {
  .stable-fei-pro {
    padding: 1rem;
    height: 40rem;
    .inc-box{
      top:auto;
      bottom:30px;
      right:15%;
    }
  }
}
</style>