<template>
  <div class="search-center">
    <div class="title-box">
      <i
        class="iconfont icon-sousuo_search"
        @click="searchEvent({ keyCode: 13 })"
      ></i>
      <input
        type="text"
        :placeholder="$t('public.search_holder')"
        v-model="searchVal"
        @keydown="searchEvent($event)"
        v-if="!$flag"
      />
      <input
        type="text"
        :placeholder="$t('search_all.pls_enter')"
        v-model="searchVal"
        @keydown="searchEvent($event)"
        v-else
      />
      <!-- 输入关键字搜索 -->
      <p
        class="iconfont icon-guanbi_close clear-search"
        v-if="searchVal"
        @click="searchVal = null"
      ></p>
      <p
        class="mobile-search-btn"
        v-if="$flag"
        @click="searchEvent({ keyCode: 13 })"
      >
        <!-- 搜索 -->
        {{ $t("public.search") }}
      </p>
    </div>
    <!-- 选项卡 -->
    <div class="un-tab">
      <ul>
        <li
          v-for="(tab, indexT) in tabList"
          :key="indexT"
          :class="{ 'active-tab': tabIndex == indexT + 1 }"
          @click="changeTab(indexT)"
        >
          {{ tab.name }}
          <p class="un-count">{{ tab.count }}</p>
          <p class="tab-line"></p>
        </li>
      </ul>
    </div>
    <!-- 搜索内容 -->
    <div v-loading="loadData" style="min-height: 300px">
      <div v-if="isHasData" class="row">
        <div
          :class="tabIndex != 4 ? 'col-sm-6 col-lg-3' : ''"
          v-for="(search, indexS) in cardData"
          :key="indexS"
        >
          <!-- 项目解析 -->
          <ProjectComponent
            @sendSearch="childSearch"
            :data="search"
            v-if="tabIndex == 1"
          />
          <!-- 新币速递 -->
          <CoinComponent :data="search" v-if="tabIndex == 2" />
          <!-- 赛道解析 -->
          <RaceComponent :data="search" v-if="tabIndex == 3" />
          <!-- 项目咨询 -->
          <ServiceComponent
            :tableData="cardData"
            v-if="tabIndex == 4 && indexS == 0"
          />
        </div>
      </div>
      <div v-else class="no-data">
        <img :src="require('@/assets/images/noTrack.png')" alt="" />
        <p class="no-data-title">
          <!-- 项目解析 -->
          <!-- 没有搜索到相关的 -->
          {{ $t("search_all.no_search") }}
          [
          {{
            /** 项目解析 */
            (tabIndex == 1 && $t("routes.project_an")) ||
            /** 新币速递 */
            (tabIndex == 2 && $t("routes.project_del")) ||
            /** 赛道解析 */
            (tabIndex == 3 && $t("routes.sector_an")) ||
            /** 项目咨询 */
            (tabIndex == 4 && $t("routes.project_en"))
          }}]
        </p>
        <p class="no-data-remark" v-if="allTotal > 0">
          <!-- 可查看其他栏目下的相关内容 -->
          {{ $t("search_all.no_index") }}
        </p>
        <ul>
          <li v-for="(noData, indexNo) in tabList" :key="indexNo">
            <div v-if="noData.count > 0" @click="changeTab(indexNo)">
              <p>
                {{ noData.name }}
                <span>{{ noData.count }}</span>
              </p>
              <p>
                <span class="iconfont icon-you_right"></span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="page-tools" v-if="isNeed">
      <base-pagination
        :page-count="total"
        type="info"
        v-model="defaultPagination"
      ></base-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { searchAll, readNow } from "@/request/api";
import { BasePagination } from "@/components";
import { scrollBack } from "@/util/index";
export default {
  name: "Search",
  data() {
    return {
      searchVal: "", //搜索内容
      tabList: [
        {
          //项目解析
          name: this.$t("routes.project_an"),
          type: 1,
          count: "0",
        },
        {
          //新币速递
          name: this.$t("routes.project_del"),
          type: 3,
          count: "0",
        },
        {
          //赛道解析
          name: this.$t("routes.sector_an"),
          type: 4,
          count: "0",
        },
        {
          //项目咨询
          name: this.$t("routes.project_en"),
          type: 5,
          count: "0",
        },
      ],
      tabIndex: 1, //当前选中列表
      dateIndex: 1,
      cardData: [], //搜索数据
      loadData: false, //数据loading
      isNeed: false, //是否需要分页起
      total: 1, //总页数
      defaultPagination: 1, //当前页码
      isHasData: true, //是否存有数据
      allTotal: 0,
    };
  },
  mounted() {
    this.searchVal = this.app.searchMsg;
    this.getCardData();
  },
  watch: {
    defaultPagination() {
      this.getCardData();
      scrollBack();
    },
  },
  components: {
    BasePagination,
    ProjectComponent: (resolve) =>
      require(["../coms/listOther/project_coms"], resolve),
    EventComponent: (resolve) =>
      require(["../coms/listOther/event_coms"], resolve),
    CoinComponent: (resolve) =>
      require(["../coms/listOther/coin_coms"], resolve),
    RaceComponent: (resolve) =>
      require(["../coms/listOther/race_coms"], resolve),
    ServiceComponent: (resolve) =>
      require(["../coms/listOther/service_coms.vue"], resolve),
  },
  methods: {
    //切换选项卡
    changeTab(_index) {
      this.tabIndex = 99;
      this.loadData = true;
      this.cardData = [];
      this.defaultPagination = 1;
      this.isNeed = false;
      setTimeout(() => {
        this.tabIndex = _index + 1;
        this.dateIndex = this.tabList[_index].type;
        this.getCardData();
        this.loadData = false;
      }, 200);
    },
    searchEvent(e) {
      if (e.keyCode == 13) {
        const next = () => {
          let history = JSON.parse(localStorage.getItem("historyList")) || [];
          if (history.length == 5) {
            history.splice(history.length - 1, 1);
            history.unshift(this.searchVal);
          } else {
            if (history.indexOf(this.searchVal) < 0) {
              history.unshift(this.searchVal);
            }
          }
          localStorage.setItem("historyList", JSON.stringify(history));
          this.$store.commit("upSearchMsg", this.searchVal);
          this.defaultPagination = 1;
          this.isNeed = false;
          this.tabIndex = 1;
          this.getCardData();
        };
        // next()
        this.searchVal != ""
          ? next()
          : this.$notify({
              type: "danger",
              //请输入您要搜索的内容
              message: this.$t("notify.pls_search"),
            });
      }
    },
    //tag搜索
    childSearch(_val) {
      this.searchVal = _val;
      this.getCardData();
    },
    //获取搜索数据
    async getCardData() {
      const searchMsg = {
        search: this.searchVal,
        limit: 12,
        category_id: this.dateIndex,
        page: this.defaultPagination,
      };
      const result = await searchAll(searchMsg);
      this.tabList[0].count = result.count.project_count;
      this.tabList[1].count = result.count.coin_count;
      this.tabList[2].count = result.count.raceAnalysis_count;
      this.tabList[3].count = result.count.kbs_count;
      let allTotal = 0;
      this.tabList.map((e) => {
        allTotal = allTotal + e.count;
      });
      this.allTotal = allTotal;
      // this.tabList[4].count = result.count.kbs_count;
      this.total = result.last_page;
      result.last_page > 1 && (this.isNeed = true);
      result.data.length > 0
        ? (this.isHasData = true)
        : (this.isHasData = false);
      this.cardData = result.data;
    },
    //查看PDF
    goPDF(_url, _type, _id) {
      readNow({
        type: _type,
        id: _id,
      });
      window.PDFLock(_type, _id, 1, 1);
    },
  },
  computed: {
    ...mapState(["app"]),
  },
};
</script>

<style lang="scss" scoped>
.search-center {
  overflow-x: hidden;
  .title-box {
    width: 100%;
    height: 64px;
    background: $conBg2;
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
    input {
      flex: 1;
      background: rgba(0, 0, 0, 0);
      color: $textColor;
    }
    .icon-sousuo_search {
      font-size: 24px;
      color: white;
      cursor: pointer;
      margin-right: 16px;
    }
    .clear-search {
      margin-right: 1rem;
      color: $remarkColor;
      font-size: 16px !important;
      cursor: pointer;
    }
    .mobile-search-btn {
      width: 3.6rem;
      height: 100%;
      background: linear-gradient(90deg, #0f83fe 0%, #00b0f0 100%);
      font-size: 0.81rem;
      color: white;
      height: 100%;
      border-radius: 0 4px 4px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .un-tab {
    display: flex;
    justify-content: space-between;
    padding: 15px 24px;
    border-radius: 4px;
    background: $contentBg;
    margin-top: 16px;
    ul {
      display: flex;
      li {
        display: flex;
        margin-right: 24px;
        position: relative;
        transition: 0.3s all;
        cursor: pointer;
        font-size: 4px;
        color: $remarkColor;
        font-size: 14px;
        cursor: pointer;
        .un-count {
          display: flex;
          padding: 2px 4px;
          background: rgba(255, 212, 92, 0.1);
          color: #ffd45c;
          border-radius: 4px;
          margin-left: 4px;
          font-size: 12px;
          transform: translateY(-1px);
        }
        .tab-line {
          position: absolute;
          width: 0;
          height: 3px;
          background: $success;
          bottom: -14px;
          left: 50%;
          margin-left: -12px;
          transition: 0.3s all;
        }
      }
      .active-tab {
        color: $success;
        .un-count {
          background: rgba(167, 240, 186, 0.1);
          color: #a7f0ba;
        }
        .tab-line {
          width: 24px;
        }
      }
    }
  }
  .un-tab::-webkit-scrollbar {
    display: none;
  }
  .no-data {
    height: 100%;
    padding: 200px 0;
    width: 100%;
    background: $contentBg;
    border-radius: 4px;
    margin-top: 16px;
    img {
      width: 160px;
      height: 160px;
    }
    .no-data-title {
      margin-top: 40px;
      font-size: 17px;
      color: $textColor;
      margin-bottom: 40px;
    }
    .no-data-remark {
      font-size: 13px;
      color: $textColor;
    }
    ul {
      display: flex;
      width: 100%;
      justify-content: center;
      margin-top: 24px;
      li {
        div {
          width: 180px;
          margin: 0 8px;
          display: flex;
          border: 1px solid $lineColor;
          overflow: hidden;
          border-radius: 4px;
          cursor: pointer;
        }
        p:first-child {
          font-size: 13px;
          color: $textColor;
          padding: 10px 0 10px 12px;
          text-align: left;
          flex: 1;
          span {
            color: #a7f0ba;
            font-weight: bold;
            margin-left: 8px;
          }
        }
        p:last-child {
          width: 36px;
          background: $conBg2;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 1px solid $lineColor;
          border-radius: 0 4px 4px 0;
          .iconfont {
            font-size: 16px;
            color: $textColor;
          }
        }
      }
    }
  }
  .row {
    margin-top: 16px;
  }
  .page-tools {
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
  }
}
@media screen and (max-width: 1279px) {
  .search-center {
    .pc-title {
      display: none;
    }
    .title-box {
      height: 40px;
      padding-right: 0;
      margin-top: 0;
      input {
        font-size: $fon12;
      }
      .iconfont {
        font-size: 1rem;
      }
      .clear-search {
        font-size: $fon12 !important;
      }
    }
    .un-tab {
      padding: 1rem;
      overflow-x: auto;
      ul {
        justify-content: space-between;
        overflow-x: auto;
        li {
          font-size: $fon12;
          width: auto;
          margin-right: 1rem;
          white-space: nowrap;
          .un-count {
            transform: translateY(-2px);
          }
        }
      }
      ul::-webkit-scrollbar {
        display: none;
      }
    }
    .no-data {
      font-size: $fon14;
      padding: 5rem 0;
      ul {
        flex-direction: column;
        align-items: center;
        li {
          div {
            width: 10rem;
            margin-bottom: 1rem;
          }
        }
      }
    }
    .page-tools {
      justify-content: center;
    }
  }
}
</style>