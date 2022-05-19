<!-- 热币速递 -->
<template>
  <div class="coin-center">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 新币速递即之前的热币速递 -->
        {{ $t("coin.coin_title") }}
      </p>
    </div>
    <p
      style="
        width: 100%;
        height: 16px;
        background: #111a3b;
        position: relative;
        z-index: 1300;
      "
    ></p>
    <!-- TODO -->
    <!-- 过滤合作 - 新 -->
    <div class="filter-box-new filter-box-new-pc" v-click-outside="closeFilter">
      <!-- 标题信息 -->
      <div class="filter-box-new-inner">
        <p class="h5" @click="openFilterNew = !openFilterNew">
          <span class="iconfont icon-caidan"></span>
          <font>
            <!-- 筛选 -->
            {{ $t("project_info.filter") }}
          </font>
          <span
            class="iconfont icon-xia_down"
            :style="{
              transform: openFilterNew
                ? 'rotate(180deg) translateY(-2px)'
                : 'rotate(0) translateY(2px)',
            }"
          ></span>
        </p>
        <p class="choose-now" v-if="levelOneText || levelTwoText.length > 0">
          <span>
            {{ levelOneText }}<i class="iconfont icon-you_right" v-if="levelTwoText.length > 0"></i
            >{{ levelTwoText.join(",") }}
            <i class="iconfont icon-guanbi_close" @click="cancelFilter()"></i>
          </span>
        </p>
        <div class="title-filter">
          <span>|</span>
          <el-checkbox v-model="hotCoin">
            <!-- 热币 -->
            {{ $t("coin.coin_hot") }}
          </el-checkbox>
          <el-checkbox v-model="newCoin">
            <!-- 新币 -->
            {{ $t("coin.coin_new") }}
          </el-checkbox>
          <el-checkbox v-model="unCoin">
            <!-- 尚未发币 -->
            {{ $t("coin.un_coin") }}
          </el-checkbox>
        </div>
      </div>
      <!-- 筛选条件盒子 -->
      <div
        class="filter-dom-new"
        :class="openFilterNew ? 'show-filter-new' : ''"
      >
        <!-- 一级赛道 -->
        <div class="level-one">
          <p class="level-title">
            <!-- 一级赛道 -->
            {{ $t("project_info.one_level") }}
          </p>
          <ul class="stop-click-ul" v-if="isChooseOne">
            <li
              class="stop-click"
              v-for="(i, indexOne) in raceList"
              :key="indexOne"
              @click.stop="
                raceList = [];
                levelOneText = i.name;
                levelOneID = i.id;
                checkAll = true;
                getRaceList();
                isChooseOne = false;
                checkRace(indexOne,1)
              "
            >
              {{ i.name }}
            </li>
          </ul>
          <!-- 选中一级赛道 -->
          <p class="choose-one" v-else>{{ levelOneText }}</p>
        </div>
        <!-- 二级赛道 -->
        <div class="level-two">
          <p class="level-title">
            <!-- 二级赛道 -->
            {{ $t("project_info.two_level") }}
          </p>
          <p class="level-remark" v-if="isChooseOne">
            <!-- 请先选择一级赛道 -->
            {{$t('public.pls_choice_race')}}
          </p>
          <p class="level-remark choose-two-level" v-else>
            <span
              v-for="(race, indexR) in raceList"
              :label="race.id"
              :key="indexR"
              @click.stop="checkRace(indexR,2)"
              >{{ race.name }}</span
            >
          </p>
        </div>
        <p class="level-line"></p>
        <div class="level-oper">
          <p
            class="reset-level"
            @click="
              raceList = [];
              checkedRace = [];
              levelTwoText = [];
              isChooseOne = true;
              levelOneID = null;
              getRaceList();
              getCoinList();
            "
          >
            <span class="iconfont icon-shuaxin_refresh"></span>
            <!-- 重置筛选 -->
            {{$t('public.reset_filter')}}
          </p>
          <p v-if="false">
            <base-button type="defalut" round @click="resetFilter()">
              <!-- 取消 -->
              {{ $t("public.cancel") }}
            </base-button>
          </p>
        </div>
      </div>
    </div>
    <p
      class="choose-now choose-new-mobile"
      v-if="levelOneText || levelTwoText.length > 0"
    >
      <span>
        {{ levelOneText }}<i class="iconfont icon-you_right" v-if="levelTwoText.length > 0"></i
        >{{ levelTwoText.join(",") }}
      </span>
      <i class="iconfont icon-guanbi_close" @click="cancelFilter()"></i>
    </p>
    <!-- 新币列表 -->
    <div class="coin-list" v-loading="loadCoin" v-if="isHasData">
      <div class="row">
        <div
          class="col-sm-6 col-lg-3"
          v-for="(coin, indexC) in coinList"
          :key="indexC"
        >
          <CoinComponent :data="coin" />
        </div>
      </div>
    </div>
    <p class="no-data" v-else>
      <!-- 暂时没有项目 -->
      {{$t('no_data.no_project')}}
    </p>
    <!-- 分页器 -->
    <div class="page-tools" v-if="isNeedPage">
      <base-pagination
        :page-count="total"
        type="info"
        v-model="defaultPagination"
      ></base-pagination>
    </div>
    <div class="tabs-mask" v-if="mobileTabs" @click="mobileTabs = false"></div>
  </div>
</template>

<script>
import { BaseCheckbox, BasePagination } from "@/components";
import * as api from "@/request/api";
import { scrollBack } from "@/util/index";
export default {
  name: "CoinCenter",
  data() {
    return {
      newCoin: true, //新币选项
      hotCoin: true, //热币选项
      raceList: [], //赛道列表
      coinList: [], //热币列表
      loadCoin: false, //加载状态
      defaultPagination: 1, //当前页码
      total: 1, //总页数
      checkedRace: [], //选中赛道
      filterStatus: false, //筛选展开状态
      checkAll: false, //全选
      newCoinType: "1", //新币选项
      hotCoinType: "1", //热币选项
      isHasData: true, //是否有数据
      isNeedPage: false, //是否显示分页器
      mobileTabs: false, //移动端菜单状态
      unCoin: false, //尚未发币
      unCoinType: "1",
      openFilterNew: false, //筛选盒子 -- 新
      levelOneID: null, //选中一级赛道ID
      levelOneText: null, //选中一级赛道文本
      isChooseOne: true, //是否选中一级赛道
      levelTwoText: [],
    };
  },
  components: {
    BaseCheckbox,
    BasePagination,
    CoinComponent: (resolve) =>
      require(["../coms/listOther/coin_coms"], resolve),
  },
  watch: {
    defaultPagination() {
      // sessionStorage.setItem("page", val);
      this.getCoinList();
      scrollBack();
    },
    //新币
    newCoin(val) {
      if (val) {
        this.newCoinType = "1";
      } else {
        this.newCoinType = "0";
      }
      this.defaultPagination = 1;
      this.getCoinList();
    },
    //热币
    hotCoin(val) {
      if (val) {
        this.hotCoinType = "1";
      } else {
        this.hotCoinType = "0";
      }
      this.defaultPagination = 1;
      this.getCoinList();
    },
    //是否发币
    unCoin(val) {
      if (val) {
        this.unCoinType = "0";
      } else {
        this.unCoinType = "1";
      }
      this.defaultPagination = 1;
      this.getCoinList();
    },
  },
  created() {
    // if (sessionStorage.getItem("page")) {
    //   this.defaultPagination = Number(sessionStorage.getItem("page"));
    // }
    this.getRaceList();
    this.getCoinList();
  },
  methods: {
    closeFilter() {
      this.openFilterNew && (this.openFilterNew = false);
    },
    //新币赛道
    async getRaceList() {
      const result = await api.coinRaceList({ pid: this.levelOneID });
      if (result.length > 0) {
        this.raceList = result;
      } else {
        this.levelTwoText.push(this.levelOneText);
        this.checkedRace = this.levelOneID;
        let mineTwo = {
          name: this.levelOneText,
          id: this.levelOneID,
        };
        this.raceList.push(mineTwo);
        this.openFilterNew = false;
        this.getCoinList();
      }
      // if (this.levelOneID) {
      //   this.checkAll = true;
      //   this.checkedRace = this.raceList.map((e) => e.id);
      //   this.levelTwoText = this.raceList.map((e) => e.name);
      // }
    },
    //获取新币列表
    async getCoinList() {
      this.coinList = [];
      this.loadCoin = true;
      // this.levelOneID && this.checkedRace.push(this.levelOneID);
      // this.levelOneText && this.levelTwoText.push(this.levelOneText);
      const result = await api.coinList({
        limit: 12,
        page: this.defaultPagination,
        race_ids: this.checkedRace,
        is_hot: this.hotCoinType,
        is_new: this.newCoinType,
        is_tokens: this.unCoinType,
      });
      this.loadCoin = false;
      this.total = result.last_page;
      result.last_page > 1
        ? (this.isNeedPage = true)
        : (this.isNeedPage = false);
      result.data.length == 0 && (this.isHasData = false);
      result.data.length > 0 && (this.isHasData = true);
      this.coinList = result.data;
    },
    //提交赛道筛选
    subRaceFilter() {
      this.defaultPagination = 1;
      this.getCoinList();
      this.openFilterNew = false;
    },
    //重置筛选
    resetFilter() {
      this.openFilterNew = false;
      this.levelTwoText = [];
      this.levelOneText = null;
      this.checkedRace = [];
      this.isChooseOne = true;
      this.levelOneID = null;
      this.getCoinList();
      this.getRaceList();
    },
     //取消筛选
    cancelFilter() {
      if (this.levelTwoText.length > 0) {
        this.levelTwoText = [];
        this.checkRace(1, 1);
      } else {
        this.resetFilter();
      }
    },
    //单选赛道
    checkRace(_index,_type) {
      _type == 2 && this.levelTwoText.push(this.raceList[_index].name);
      this.checkedRace = _type == 1 ? this.levelOneID : this.raceList[_index].id;
      _type == 2 && (this.openFilterNew = false);
      this.getCoinList(); 
      //TODO
      return;
      if (_bool) {
        this.levelTwoText.push(this.raceList[_index].name);
        if (this.checkedRace.length === this.raceList.length) {
          this.checkAll = true;
        }
      } else {
        this.levelTwoText.splice(
          this.levelTwoText.indexOf(this.raceList[_index].name),
          1
        );
        this.checkAll = false;
      }
      // this.getCoinList();
    },
  },
  // beforeDestroy() {
  //   sessionStorage.removeItem("page");
  // },
};
</script>

<style lang="scss" scoped>
.show-filter-new {
  transform: translateY(64px) !important;
}
.open-tabs {
  transform: translateY(0) !important;
}
.tabs-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
}
@media screen and (max-width: 1600px) {
  .col-lg-3 {
    max-width: 50%;
    flex: 0 0 50%;
  }
}
@media screen and (max-width: 768px) {
  .col-lg-3 {
    max-width: 100%;
    flex: 0 0 100%;
  }
}
.coin-center {
  overflow-x: hidden;
  min-height: 20rem;
  .choose-now {
    margin-left: 26px;
    height: 24px;
    background: $conBg2;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: 20px;
    span {
      font-size: 12px;
      color: $success;
    }
    .iconfont {
      font-size: 10px;
      margin: 0 8px;
      color: $remarkColor;
      display: inline-block;
    }
    .icon-guanbi_close {
      margin-right: 0;
      cursor: pointer;
    }
  }
  .choose-new-mobile {
    margin-left: 0;
    margin-top: 1rem;
    height: auto !important;
    padding: 0.8rem $fon12 !important;
    justify-content: space-between;
    line-height: 1.3rem;
  }
  .title-filter {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    position: absolute;
    right: 12px;
    /deep/ .form-check {
      margin-right: 24px !important;
      margin-bottom: 0 !important;
    }
    /deep/ .el-checkbox {
      margin-bottom: 0 !important;
      margin-right: 24px;
    }
    /deep/ .el-checkbox__inner {
      background: $contentBg;
      border-color: #49537a;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: -3px;
    }
    /deep/ .el-checkbox__inner::after {
      top: 3px;
      left: 6px;
    }
    /deep/ .el-checkbox__label {
      color: $textColor;
    }
    /deep/ .is-checked {
      .el-checkbox__inner {
        background: #33b1ff;
      }
    }
    span {
      margin-right: 24px;
    }
    @media screen and (max-width: 1279px) {
      position: static;
      span {
        display: none;
      }
    }
  }
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: space-between;
    padding-left: 24px;
    align-items: center;
    border-radius: 4px;
    position: relative;
    z-index: 1300;
    .h4 {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      color: white;
      .iconfont {
        font-size: $iconSize;
        color: white;
        font-size: 22px;
        margin-right: 8px;
      }
    }
  }
  .filter-box-new {
    height: 48px;
    z-index: 1200;
    position: relative;
    .filter-box-new-inner {
      padding: 0 24px;
      display: flex;
      align-items: center;
      height: 100%;
      position: relative;
      width: 100%;
      background: $contentBg;
      border-radius: 4px;
      z-index: 200;
    }
    .h5 {
      color: $textColor;
      margin-bottom: 0;
      cursor: pointer;
      position: relative;
      z-index: 200;
      .iconfont {
        display: inline-block;
        transform: translateY(1px);
        margin-right: 6px;
        transition: 0.3s all;
      }
      .iconfont:last-child {
        margin-left: 6px;
      }
    }
    .filter-dom-new {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      padding: 24px;
      background: $contentBg;
      transition: 0.6s all;
      border-radius: 4px;
      transform: translateY(-200%);
      z-index: 100;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
      overflow: hidden;
      .level-title {
        width: 96px;
        color: white;
        font-size: 14px;
        font-weight: bold;
      }
      .level-one {
        display: flex;
        margin-bottom: 16px;
        ul {
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          li {
            margin-right: 24px;
            margin-bottom: 16px;
            cursor: pointer;
            color: $remarkColor;
          }
        }
        .choose-one {
          color: $success;
        }
      }
      .level-two {
        display: flex;
        margin-bottom: 24px;
        .level-remark {
          color: #676c7a;
          font-size: 14px;
        }
        .choose-two-level {
          display: flex;
          flex: 1;
          span {
            margin-right: 24px;
            font-size: 14px;
            color: $textColor;
            cursor: pointer;
          }
        }
      }
      .level-line {
        width: 100%;
        height: 1px;
        background: $lineTwoColor;
        margin-bottom: 24px;
      }
      .level-oper {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .reset-level {
          cursor: pointer;
        }
        .label {
          display: inline-block;
          width: 24px;
        }
      }
    }
  }
  @media screen and (max-width: 1279px) {
    .title-box {
      display: none;
    }
    .filter-box-pc {
      display: none !important;
    }
    .filter-box-new-inner {
      .choose-now {
        display: none;
      }
      .h5 {
        position: absolute;
        right: $fon14;
        top: $fon14;
        font {
          display: none;
        }
        span:last-child {
          display: none;
        }
      }
    }
    .filter-dom-new {
      .level-one {
        flex-direction: column;
        ul {
          margin-top: $fon20;
          max-height: 8rem;
          overflow-y: auto;
          flex: none !important;
        }
        .choose-one {
          margin-top: $fon20;
          margin-bottom: 0.6rem;
        }
      }
      .level-two {
        flex-direction: column;
        .level-remark {
          margin-top: $fon20;
          position: relative;
          flex-wrap: wrap;
          span{
            margin-bottom: .5rem;
          }
          /deep/ .el-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            .el-checkbox {
              margin-right: 0.5rem;
            }
          }
          .check-all {
            position: absolute;
            top: -2.2rem;
            right: -1rem;
          }
        }
      }
    }
  }
  @media screen and (min-width: 1280px) {
    .choose-new-mobile {
      display: none !important;
    }
    .filter-box-mobile {
      display: none !important;
    }
  }
  .filter-box-mobile {
    position: relative;
    display: flex;
    justify-content: space-between;
    z-index: 1200;
    margin-top: 0 !important;
    .filter-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: $contentBg;
      z-index: 50;
    }
    .title-filter {
      position: relative;
      z-index: 80;
      display: flex;
      overflow: auto;
      flex-wrap: nowrap;
    }
    .mobile-tabs {
      width: 10%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tabs-line {
        width: 1px;
        height: 1rem;
        background: $lineTwoColor;
        position: relative;
        z-index: 200;
      }
      .iconfont {
        color: white;
        position: relative;
        z-index: 200;
        background: $contentBg;
      }
      .tabs-box {
        width: 100%;
        height: 20rem;
        transform: translateY(-125%);
        background: $contentBg;
        position: absolute;
        left: 0;
        transition: 0.3s all;
        top: 3.25rem;
        padding: 1rem;
        overflow-y: auto;
        /deep/ .el-checkbox {
          margin-bottom: $padd24 !important;
          margin-right: $fon18;
        }
      }
    }
    .filter-line {
      margin-right: 1rem;
      display: inline-block;
      transform: translateY(2px);
    }
    /deep/ .form-check {
      margin-right: $fon18 !important;
      margin-bottom: 0 !important;
    }
    /deep/ .el-checkbox {
      margin-bottom: 0 !important;
      margin-right: $fon18;
    }
    /deep/ .el-checkbox__inner {
      background: $contentBg;
      border-color: #49537a;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: -2px;
    }
    /deep/ .el-checkbox__inner::after {
      top: 3px;
      left: 6px;
    }
    /deep/ .el-checkbox__label {
      color: $textColor;
    }
    /deep/ .is-checked {
      .el-checkbox__inner {
        background: #33b1ff;
      }
    }
  }
  .filter-box {
    padding: 15px 24px;
    border-radius: 4px;
    background: $contentBg;
    margin-top: 16px;
    display: flex;
    .showFilter {
      height: auto !important;
      margin-top: -30px;
      /deep/ .el-checkbox {
        margin-top: 30px;
      }
    }
    .filter-dom {
      width: 96%;
      display: flex;
      flex-wrap: wrap;
      height: 20px;
      overflow: hidden;
      /deep/ .el-checkbox {
        margin-bottom: 0 !important;
      }
      /deep/ .el-checkbox__inner {
        background: $contentBg;
        border-color: #49537a;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: -2px;
      }
      /deep/ .el-checkbox__inner::after {
        top: 3px;
        left: 6px;
      }
      /deep/ .el-checkbox__label {
        color: $textColor;
      }
      /deep/ .is-checked {
        .el-checkbox__inner {
          background: #33b1ff;
        }
      }
    }
    .upAdown {
      font-size: 14px;
      flex: 1;
      height: 20px;
      display: flex;
      align-items: center;
      margin-top: -1px;
      p {
        cursor: pointer;
        color: $textColor;
      }
    }
  }
  .coin-list {
    margin-top: 16px;
    min-height: 800px;
  }
  .page-tools {
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
  }
}
.no-data {
  text-align: center;
  font-size: 18px;
  color: $remarkColor;
  margin-top: 100px;
}
</style>
