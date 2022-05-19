//未来事件
<template>
  <div
    class="bureau-events"
    :class="[
      isFixed && 'has-fixed-events',
      app.account.is_follow == 0 && $flag && 'no-date-mobile',
    ]"
  >
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 随时关注即将发生的一切，因为我们随时有可能改变世界。 -->
        {{ $t("bureau_evs.evs_title") }}
      </p>
    </div>
    <div
      v-if="
        app.account.is_information == 1 && app.account.information_status == 1
      "
    >
      <!-- 移动端搜索 -->
      <div class="mobile-search-box">
        <p>
          <span class="iconfont icon-sousuo_search"></span>
          <input
            type="text"
            :placeholder="$t('public.pls_inp')"
            v-model="trackSearch"
          />
        </p>
        <p>
          <base-button
            type="info"
            round
            class="other-info"
            @click="$router.push('/my-calendar')"
          >
            <!-- 我的日历 -->
            {{ $t("bureau_mine.calendar") }}
          </base-button>
        </p>
      </div>
      <!-- 赛道类型 -->
      <div
        class="race-type type-pc"
        :class="[
          isFixed && 'events-fixed-box',
          isFixed && app.isOpenMenu == 0 && 'other-fixed-width',
        ]"
      >
        <ul>
          <li
            :class="{ activeType: nowType == 9999 }"
            @click="
              nowType = 9999;
              isFollow = 0;
              eventsList = [];
              defaultPagination = 1;
              getEventsList();
            "
          >
            <!-- 我的自选 -->
            {{ $t("bureau_mine.own_track") }}
            <span class="race-line"></span>
            <!-- <span class="race-num">{{ totalPro }}</span> -->
          </li>
          <li
            v-for="(raceType, indexT) in raceTypeList"
            :key="indexT"
            @click="
              nowType = indexT;
              isFollow = raceType.id;
              eventsList = [];
              historyEvs = [];
              defaultPagination = 1;
              getEventsList();
            "
            :class="{ activeType: nowType == indexT }"
          >
            {{ raceType.name }}
            <span class="race-line"></span>
            <!-- <span class="race-num">{{ raceType.num }}</span> -->
          </li>
        </ul>
        <p class="search-type">
          <base-button
            type="info"
            round
            class="other-info"
            @click="$refs.mycalendar.calendarBox = true"
          >
            <!-- 我的日历 -->
            {{ $t("bureau_mine.calendar") }}
          </base-button>
          <span class="iconfont icon-sousuo_search"></span>
          <input
            type="text"
            :placeholder="$t('public.pls_inp')"
            v-model="trackSearch"
          />
        </p>
        <div class="fixed-mask"></div>
      </div>
      <!-- 事件列表 -->
      <div class="events-box" v-loading="loadData" v-if="isHasData">
        <van-pull-refresh
          v-model="reLoading"
          :success-text="$t('public.reload')"
          @refresh="refreshData"
          :disabled="!$flag"
        >
          <!-- 刷新成功 -->
          <!-- 事件列表 -->
          <FutureEvents
            :eventsList="eventsList"
            :nowType="nowType"
            :showCalendar="1"
             @upCalendar="getEventsList"
          />
          <!-- 历史事件 -->
          <div class="history-events" v-if="historyEvs.length > 0">
            <div class="label-line">
              <p class="line-inner"></p>
              <p>
                <span class="iconfont icon-lishijilu_history"></span>
                <!-- 以下为历史事件 -->
                {{ $t("bureau_evs.history") }}
              </p>
              <p class="line-inner"></p>
            </div>
          </div>
          <FutureEvents
            :eventsList="historyEvs"
            :nowType="nowType"
            :showCalendar="0"
          />
        </van-pull-refresh>
      </div>
      <div v-if="app.account.is_follow == 0 && nowType == 9999">
        <NoData @upPageData="upPageData" />
      </div>
      <p class="no-data" v-if="!isHasData && nowType != 9999">
        <!-- 暂无期待 -->
        {{ $t("no_data.no_wants") }}
      </p>
      <!-- 分页器 -->
      <div class="page-tools" v-if="isNeedPage">
        <base-pagination
          :page-count="total"
          type="info"
          v-model="defaultPagination"
        ></base-pagination>
      </div>
    </div>
    <div v-else>
      <NoData />
    </div>
    <!-- 我的日历 -->
    <MyCalendar ref="mycalendar" @upCalendar="getEventsList" />
  </div>
</template>

<script>
import { eventsFutureList } from "@/request/api";
import { BasePagination, Modal } from "@/components";
import { scrollBack } from "@/util/index";
import { mapState } from "vuex";

export default {
  data() {
    return {
      raceTypeList: [
        {
          //今日发生
          name: this.$t('bureau_evs.today'),
          id: 1,
          num: 0,
        },
        {
          //本周期待
          name: this.$t('bureau_evs.week'),
          id: 2,
          num: 0,
        },
        {
          //本月期待
          name: this.$t('bureau_evs.month'),
          id: 3,
          num: 0,
        },
        {
          //所有期待
          name: this.$t('bureau_evs.all_wants'),
          id: 4,
          num: 0,
        },
      ], //赛道类型列表
      nowType: 9999, //默认选中
      eventsList: [], //提案列表
      total: 10, //总页数
      defaultPagination: 1, //当前页码
      loadData: false, //数据加载
      isNeedPage: false,
      isHasData: true,
      mobileTabs: false, //菜单打开状态
      totalPro: 0, //项目总数
      isFollow: 0, //项目类型
      trackSearch: null, //搜索
      isFixed: false, //是否吸顶
      reLoading: false, //下拉刷新
      historyEvs: [],
    };
  },
  components: {
    BasePagination,
    Modal,
    NoData: (resolve) => require(["./coms/no_data"], resolve),
    MyCalendar: (resolve) => require(["./coms/my_calendar"], resolve),
    TranslateSub: (resolve) =>
      require(["./coms/mine_bureau/sub_translate"], resolve),
    FutureEvents: (resolve) => require(["./coms/future_events"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {
    defaultPagination() {
      this.getEventsList();
      scrollBack();
    },
    trackSearch() {
      this.defaultPagination = 1;
      this.getEventsList();
    },
  },
  created() {
    if (this.nowType == 9999) {
      if (this.app.account.is_follow == 1) {
        this.getEventsList();
      } else {
        this.isHasData = false;
      }
    } else {
      this.getEventsList();
    }
  },
  mounted() {
    window.addEventListener("scroll", this.initHeight, true);
  },
  methods: {
    //下拉刷新
    async refreshData() {
      await this.getEventsList();
      setTimeout(() => {
        this.reLoading = false;
      }, 500);
    },
    //获取事件列表
    async getEventsList() {
      this.loadData = true;
      const result = await eventsFutureList({
        page: this.defaultPagination,
        limit: 100,
        type: this.isFollow,
        search: this.trackSearch,
        history: 0,
      });
      const history = await eventsFutureList({
        page: this.defaultPagination,
        limit: 100,
        type: this.isFollow,
        search: this.trackSearch,
        history: 1,
      });
      // historyEvs
      this.loadData = false;
      this.eventsList = result.data;
      this.historyEvs = history.data;
      this.eventsList.forEach((e) => {
        e.list.forEach((x) => {
          this.$set(x, "abs_translate", true);
        });
      });
      this.historyEvs.forEach((e) => {
        e.list.forEach((x) => {
          this.$set(x, "abs_translate", true);
        });
      });
      this.total = result.last_page;
      result.last_page > 1 || history.last_page > 1
        ? (this.isNeedPage = true)
        : (this.isNeedPage = false);
      result.data.length == 0 && history.data.length == 0
        ? (this.isHasData = false)
        : (this.isHasData = true);
    },
    //添加系统日历
    getCalendarFile(_date, _day) {
      const startDateTime = _date.replace("-", "") + _day + "T170000";
      const icsMSG =
        "BEGIN:VCALENDAR\nPRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN\nVERSION:2.0\nMETHOD:REQUEST\nX-MS-OLK-FORCEINSPECTOROPEN:TRUE\nBEGIN:VEVENT\nDTSTART;TZID=China/Beijing:" +
        startDateTime +
        "\nSUMMARY;LANGUAGE=en-sg:Future events\nX-MICROSOFT-CDO-BUSYSTATUS:TENTATIVE\nX-MICROSOFT-CDO-IMPORTANCE:1\nX-MICROSOFT-CDO-INTENDEDSTATUS:BUSY\nX-MICROSOFT-DISALLOW-COUNTER:FALSE\nX-MS-OLK-CONFTYPE:0\nBEGIN:VALARM\nTRIGGER:-PT15M\nACTION:DISPLAY\nDESCRIPTION:Reminder\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR\n";
      return icsMSG;
    },
    //判断吸顶
    initHeight() {
      let el = document.querySelector(".open-alive");
      let scrollTop = el.getBoundingClientRect().top;
      if (!this.$flag) {
        this.isFixed = scrollTop <= 0 ? true : false;
      }
      if (this.$flag) {
        this.isFixed = scrollTop <= 18 ? true : false;
      }
    },
    //更新页面信息
    upPageData() {
      if (this.nowType == 9999) {
        if (this.app.account.is_follow == 1) {
          this.isHasData = true;
          setTimeout(() => {
            this.getEventsList();
          }, 300);
        }
      } else {
        this.isHasData = true;
        setTimeout(() => {
          this.getEventsList();
        }, 300);
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.initHeight, true);
  },
};
</script>

<style lang="scss" scoped>
.has-fixed-events {
  padding-top: 64px;
}
.events-fixed-box {
  position: fixed !important;
  width: 83.5%;
  top: 64px;
  z-index: 1400;
  .fixed-mask {
    display: block !important;
  }
}
.other-fixed-width {
  width: 91.3% !important;
}
@media screen and (min-width: 2000px) {
  .events-fixed-box {
    width: 87.5% !important;
  }
  .other-fixed-width {
    width: 93.4% !important;
  }
}
@media screen and (max-width:1279px){
  .other-fixed-width {
    width: 100% !important;
  }
}
.bureau-events {
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
        font-size: 22px;
        margin-right: 8px;
      }
    }
    .search-type {
      width: 160px;
      height: 28px;
      background: $conBg2;
      border-radius: 18px;
      position: relative;
      margin-right: 12px;
      button {
        height: 28px;
      }
      .iconfont {
        position: absolute;
        top: 7px;
        font-size: 14px;
        right: 12px;
      }
      input {
        width: 160px;
        height: 100%;
        color: $textColor;
        background: rgba(0, 0, 0, 0);
        font-size: 12px;
        box-sizing: border-box;
        padding-left: 12px;
        padding-right: 30px;
      }
    }
  }
  .mobile-search-box {
    width: 100%;
    padding: 1rem $fon14;
    padding-top: 0;
    display: flex;
    align-items: center;
    background: $contentBg;
    p:first-child {
      flex: 1;
      position: relative;
      .iconfont {
        position: absolute;
        left: $fon12;
        top: 0.5rem;
        font-size: 1rem;
        color: $textColor;
      }
      input {
        width: 100%;
        height: 2rem;
        border-radius: $fon18;
        background: $conBg2;
        color: white;
        font-size: 0.8rem;
        box-sizing: border-box;
        padding-left: 2rem;
      }
    }
    p:last-child {
      margin-left: 1rem;
    }
  }
  .race-type {
    height: 48px;
    padding: 0 12px;
    background: $contentBg;
    margin-top: 16px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .fixed-mask {
      position: absolute;
      width: 100%;
      height: 24px;
      bottom: -24px;
      background: $mineBg;
      left: 0;
      display: none;
    }
    ul {
      overflow-x: auto;
      display: flex;
      .activeType {
        color: $success;
        .race-line {
          width: 100%;
        }
        .race-num {
          background: rgba(167, 240, 186, 0.1);
          color: $success;
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
        .race-num {
          font-size: 12px;
          display: inline-block;
          height: 14px;
          padding: 0 4px;
          background: rgba(255, 212, 92, 0.1);
          color: #ffd45c;
          line-height: 14px;
          transform: translateY(-1px);
          border-radius: 4px;
          transition: 0.3s all;
        }
      }
    }
    .search-type {
      height: 28px;
      position: relative;
      margin-right: 12px;
      button {
        height: 28px;
        margin-top: 0;
        margin-right: 16px;
        margin-bottom: 0;
        font-weight: 400;
        font-size: 12px;
        color: white;
      }
      .iconfont {
        position: absolute;
        top: 7px;
        font-size: 14px;
        right: 140px;
      }
      input {
        width: 160px;
        height: 100%;
        background: $conBg2;
        color: $textColor;
        font-size: 12px;
        box-sizing: border-box;
        border-radius: 18px;
        padding-left: 24px;
        padding-right: 30px;
      }
    }
  }
  .events-box {
    margin-top: 24px;
    min-height: 600px;
    .history-events {
      margin: 40px 0 24px;
      .label-line {
        display: flex;
        align-items: center;
        .line-inner {
          flex: 1;
          height: 1px;
          background: #353e66;
        }
        p:nth-child(2) {
          margin: 0 40px;
          .iconfont {
            font-size: 16px;
            color: $remarkColor;
            margin-right: 8px;
          }
          font-size: 14px;
          color: #676c7a;
        }
      }
    }
  }
}
.page-tools {
  display: flex;
  justify-content: center;
}
@media screen and (min-width: 1280px) {
  .bureau-events {
    .mobile-search-box {
      display: none;
    }
  }
}
@media screen and (max-width: 1279px) {
  .has-fixed-events {
    padding-top: 3.3rem;
  }
  .events-fixed-box {
    // top:;
    position: fixed;
    top: 4.625rem;
    .fixed-mask {
      height: 1rem !important;
      bottom: -1rem !important;
    }
  }
  .bureau-events {
    // padding-top: 6.5rem;
    .title-box {
      display: none;
    }
    .race-type {
      margin-top: 0;
      padding: 0;
      border-radius: 0;
      width: 100%;
      left: 0;
      z-index: 300;
      .search-type {
        display: none;
      }
      ul {
        .activeType {
          .race-line {
            width: $padd24;
            left: 50%;
            margin-left: -$fon12;
          }
        }
        li:first-child {
          margin-left: $fon14;
        }
        li:last-child {
          margin-right: $fon14;
        }
      }
      ul::-webkit-scrollbar {
        display: none;
      }
    }
    .events-box {
      margin-top: 1rem;
      padding: 0 $fon14;
    }
  }
}
</style>