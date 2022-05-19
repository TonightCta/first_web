// 交易对数量 - 稳定币赛道
<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-coin-race-trade">
      <p class="h4">
        {{ title }}
        <el-popover placement="top" width="360" trigger="hover" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="is-mobile">
        <ul>
          <li>
            <!-- 稳定币名称 -->
            {{$t('public.stable_coin')}}
          </li>
          <li v-for="(name, indexName) in nameData" :key="indexName">
            {{ name }}
          </li>
        </ul>
        <p class="stable-line"></p>
        <ul>
          <li>
            <!-- 交易对数量 -->
            {{$t('public.trade_num')}}
          </li>
          <li v-for="(value, indexVal) in valueData" :key="indexVal">
            {{ value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["title", "desc"],
  name: "StableCoinRaceTrade",
  data() {
    return {
      nameData: [],
      valueData: [],
    };
  },
  created() {
    this.getTradeData();
  },
  methods: {
    async getTradeData() {
      let timestamp = new Date().getTime() * 1000;
      await axios
        .get(process.env.VUE_APP_BASEURL + "/charts/stablecoin/pairs_list.json?timestamp=" + timestamp)
        .then((res) => {
          res.data.forEach((e) => {
            this.nameData.push(e.name);
            this.valueData.push(e.pairs);
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table__body-wrapper .cell {
  color: white;
}
.stable-coin-race-trade {
  height: 320px;
  background: $contentBg;
  border-radius: 4px;
  padding: 24px;
  overflow: hidden;
  .h4 {
    position: relative;
    z-index: 100;
    margin-bottom: 26px;
    .iconfont {
      font-size: 15px;
      color: $textColor;
    }
    margin-bottom: 44px;
  }
}
.stable-line {
  width: 100%;
  height: 1px;
  background: $lineTwoColor;
  margin: 20px 0;
}
ul {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  li {
    font-size: 14px;
    color: white;
    text-align: left;
    min-width: 40px;
  }
  li:first-child {
    color: $remarkColor;
    font-size: 12px;
    font-weight: bold;
  }
}
@media screen and (max-width: 1279px) {
  .stable-coin-race-trade {
    padding: 1rem;
    height: auto;
    .h4 {
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    .is-mobile {
      display: flex;
      justify-content: space-between;
      ul {
        width: 50%;
        flex-direction: column;
        padding: 0;
        li {
          line-height: 3.3rem;
          text-align: left;
          border-top: 1px solid $lineTwoColor;
          padding: 0 0.3rem;
        }
        li:first-child {
          line-height: $padd40;
          color: white;
          border-top: 0;
        }
      }
      ul:last-child {
        li {
          text-align: right;
        }
      }
      .stable-line {
        display: none;
      }
    }
  }
}
</style>
