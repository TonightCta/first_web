<!-- 赛道解析 -->
<template>
  <div class="race-center">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 全方位的赛道解析，挖掘最具投资潜力的GEM项目 -->
        {{ $t("race.race_title") }}
      </p>
      <div class="picker-box" v-if="false">
        <base-input>
          <el-date-picker
            v-model="filterDateStart"
            type="date"
            placeholder="起始日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </base-input>
        <span class="picker-line">-</span>
        <base-input>
          <el-date-picker
            v-model="filterDateEnd"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </base-input>
      </div>
    </div>
    <!-- 赛道类型 -->
    <div class="race-type type-pc">
      <ul>
        <li
          :class="{ activeType: nowType == 9999 }"
          @click="
            nowType = 9999;
            raceIDS = '';
            defaultPagination = 1;
            getRaceList();
          "
        >
          <!-- 全部 -->
          {{ $t("echarts_filter.all") }}
          <span class="race-line"></span>
        </li>
        <li
          v-for="(raceType, indexT) in raceTypeList"
          :key="indexT"
          @click="
            nowType = indexT;
            raceIDS = raceType.id;
            defaultPagination = 1;
            getRaceList();
          "
          :class="{ activeType: nowType == indexT }"
        >
          {{ raceType.name }}
          <span class="race-line"></span>
        </li>
      </ul>
    </div>
    <div class="race-type type-mobile">
      <div class="type-bg"></div>
      <ul class="tabs-top">
        <li
          :class="{ activeType: nowType == 9999 }"
          ref="tabsTop"
          @click="
            nowType = 9999;
            raceIDS = '';
            defaultPagination = 1;
            getRaceList();
          "
        >
          <!-- 全部 -->
          {{ $t("echarts_filter.all") }}
          <span class="race-line"></span>
        </li>
        <li
          v-for="(raceType, indexT) in raceTypeList"
          :key="indexT"
          ref="tabsTop"
          @click="
            nowType = indexT;
            raceIDS = raceType.id;
            defaultPagination = 1;
            getRaceList();
          "
          :class="{ activeType: nowType == indexT }"
        >
          {{ raceType.name }}
          <span class="race-line"></span>
        </li>
      </ul>
      <div class="mobile-tabs">
        <p class="tabs-line"></p>
        <p class="iconfont icon-caidan" @click="mobileTabs = !mobileTabs"></p>
        <div class="tabs-box" :class="mobileTabs ? 'open-tabs' : ''">
          <ul>
            <li
              :class="[
                { activeType: nowType == 9999 },
                { 'other-bg': nowType == 9999 },
              ]"
              @click="
                nowType = 9999;
                raceIDS = '';
                defaultPagination = 1;
                getRaceList();
                tabsPoint(0, 0);
              "
            >
              <!-- 全部 -->
              {{ $t("echarts_filter.all") }}
            </li>
            <li
              v-for="(raceTypeMobile, indexT) in raceTypeList"
              :key="indexT"
              @click="
                nowType = indexT;
                raceIDS = raceTypeMobile.id;
                defaultPagination = 1;
                getRaceList();
                tabsPoint(indexT, 1);
              "
              :class="[
                { activeType: nowType == indexT },
                { 'other-bg': nowType == indexT },
              ]"
            >
              {{ raceTypeMobile.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 赛道列表 -->
    <div class="row" v-loading="loadData" v-if="isHasData">
      <div
        class="col-sm-6 col-lg-3"
        v-for="(race, indexR) in raceList"
        :key="indexR"
      >
        <RaceComponent :data="race" />
      </div>
    </div>
    <p class="no-data" v-else>
      <!-- 暂无解析 -->
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
    <!-- 蒙层 -->
    <div class="tabs-mask" v-if="mobileTabs" @click="mobileTabs = false"></div>
  </div>
</template>

<script>
import { raceType, raceList, readNow } from "@/request/api";
import { BasePagination } from "@/components";
import { scrollBack } from "@/util/index";
export default {
  name: "RaceCenter",
  data() {
    return {
      filterDateStart: "", //时间筛选开始
      filterDateEnd: "", //时间筛选结束
      raceTypeList: [], //赛道类型列表
      nowType: 9999, //默认选中
      raceList: [], //解析列表
      total: 1, //总页数
      defaultPagination: 1, //当前页码
      loadData: false, //数据加载
      raceIDS: "", //赛道类型筛选
      isNeedPage: false,
      isHasData: true,
      mobileTabs: false, //菜单打开状态
    };
  },
  watch: {
    filterDateStart(val) {
      this.getRaceList();
      if (
        this.filterDateEnd &&
        new Date(val).getTime() >= new Date(this.filterDateEnd).getTime()
      ) {
        this.$notify({
          type: "danger",
          message: "开始时间不得大于结束时间",
        });
        this.filterDateStart = "";
      }
    },
    filterDateEnd(val) {
      this.getRaceList();
      if (
        this.filterDateStart &&
        new Date(val).getTime() <= new Date(this.filterDateStart).getTime()
      ) {
        this.$notify({
          type: "danger",
          message: "结束时间不得小于开始时间",
        });
        this.filterDateEnd = "";
      }
    },
    defaultPagination() {
      // sessionStorage.setItem("page", val);
      this.getRaceList();
      scrollBack();
    },
  },
  components: {
    BasePagination,
    RaceComponent: (resolve) =>
      require(["../coms/listOther/race_coms"], resolve),
  },
  created() {
    // if (sessionStorage.getItem("page")) {
    //   this.defaultPagination = Number(sessionStorage.getItem("page"));
    // }
    this.getRaceType();
    this.getRaceList();
  },
  methods: {
    //获取赛道类型
    async getRaceType() {
      const result = await raceType();
      this.raceTypeList = result;
    },
    //获取赛道解析
    async getRaceList() {
      this.mobileTabs = false;
      const listMsg = {
        limit: 12,
        page: this.defaultPagination,
        race_ids: this.raceIDS,
        date_start: this.filterDateStart,
        date_end: this.filterDateEnd,
      };
      this.loadData = true;
      const result = await raceList(listMsg);
      this.loadData = false;
      this.raceList = result.data;
      this.total = result.last_page;
      result.last_page > 1
        ? (this.isNeedPage = true)
        : (this.isNeedPage = false);
      result.data.length == 0 && (this.isHasData = false);
      result.data.length > 0 && (this.isHasData = true);
    },
    //锚点移动
    tabsPoint(_index, _type) {
      let container = document.querySelector(".tabs-top");
      container.scrollTo({
        left: _type == 1 ? this.$refs.tabsTop[_index].offsetLeft - 12 : 0,
        behavior: "smooth",
      });
    },
  },
  // beforeDestroy() {
  //   sessionStorage.removeItem("page");
  // },
};
</script>

<style lang="scss" scoped>
.open-tabs {
  transform: translateY(0) !important;
  // height: 22.25rem!important;
}
.tabs-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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
.race-center {
  overflow-x: hidden;
  min-height: 20rem;
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: space-between;
    padding-left: 24px;
    align-items: center;
    border-radius: 4px;
    .h4 {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      color: white;

      .iconfont {
        font-size: $iconSize;
        color: white;
        margin-right: 8px;
        font-size: 22px;
      }
    }
    .picker-box {
      display: flex;
      align-items: center;

      /deep/ .form-group {
        margin-bottom: 0;
      }

      .picker-line {
        display: inline-block;
        margin-left: 8px;
        margin-right: 8px;
        color: $lineTwoColor;
      }

      /deep/ .el-input__prefix,
      .el-input__suffix {
        top: -2px;
        color: $remarkColor;
      }
    }
  }
  @media screen and (min-width: 1280px) {
    .type-mobile {
      display: none !important;
    }
  }
  @media screen and (max-width: 1279px) {
    .title-box {
      display: none;
    }
    .race-type {
      margin-top: 0 !important;
    }
    .type-pc {
      display: none;
    }
  }
  .race-type {
    height: 48px;
    padding: 0 12px;
    background: $contentBg;
    margin-top: 16px;
    border-radius: 4px;
    ul {
      overflow-x: auto;
      display: flex;
      .activeType {
        color: $success;
        .race-line {
          width: 100%;
        }
      }
      li {
        line-height: 48px;
        margin: 0 12px;
        white-space: nowrap;
        font-size: 14px;
        color: $remarkColor;
        cursor: pointer;
        transition: 0.3s all;
        position: relative;
        .race-line {
          display: inline-block;
          position: absolute;
          width: 0;
          height: 2px;
          background: $success;
          transition: 0.3s all;
          left: 0;
          bottom: 0;
        }
      }
    }
  }
  .type-mobile {
    display: flex;
    justify-content: flex-end;
    position: relative;
    z-index: 300;
    .type-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: $contentBg;
      z-index: 110;
    }
    .tabs-top {
      width: 85%;
      position: absolute;
      transition: 0.3s all;
      left: 0;
      z-index: 200;
      background: $contentBg;
    }
    .tabs-top::-webkit-scrollbar {
      display: none;
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
        height: 22.25rem;
        transform: translateY(-150%);
        // height: 0;
        background: $contentBg;
        position: absolute;
        left: 0;
        transition: 0.3s all;
        top: 3.25rem;
        z-index: 100;
        ul {
          display: flex;
          height: 100%;
          flex-wrap: wrap;
          width: 100%;
          transition: 0.3s all;
          padding: 1rem;
          .other-bg {
            background: rgba(167, 240, 186, 0.1);
          }
          li {
            padding: 0 $padd24;
            height: 2rem;
            font-size: $fon12;
            background: red;
            margin: 0;
            margin-right: 1rem;
            border-radius: 1rem;
            background: $conBg2;
            line-height: 2rem;
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
  .row {
    margin-top: 16px;
    min-height: 300px;
  }
  .page-tools {
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
  }
  @media screen and (max-width: 1279px) {
    .page-tools {
      justify-content: center;
    }
  }
}
@media screen and (max-width: 1279px) {
  .race-center {
    min-height: 26rem;
  }
}
.no-data {
  text-align: center;
  font-size: 18px;
  color: $remarkColor;
  margin-top: 100px;
}
</style>
