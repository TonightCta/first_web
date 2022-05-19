// 自选跟踪
<template>
  <div class="bureau-track" :class="isFixed && 'has-fixed-track'">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 将感兴趣的项目加入跟踪清单 -->
        {{ $t("bureau_track.track_title") }}
      </p>
    </div>
    <!-- 移动端搜索 -->
    <div class="mobile-search-track" v-if="$flag">
      <span class="iconfont icon-sousuo_search"></span>
      <input
        type="text"
        :placeholder="$t('public.pls_inp')"
        v-model="trackSearch"
      />
    </div>
    <!-- 项目类型 -->
    <div
      class="race-type type-pc"
      :class="[
        isFixed && 'track-fixed-box',
        isFixed && app.isOpenMenu == 0 && 'other-fixed-width',
      ]"
    >
      <ul>
        <li
          :class="{ activeType: nowType == 9999 }"
          @click="
            nowType = 9999;
            isFollow = null;
            defaultPagination = 1;
            getTrackList();
          "
        >
          <!-- 全部 -->
          {{ $t("echarts_filter.all") }}
          <span class="race-line"></span>
          <span class="race-num">{{ totalPro }}</span>
        </li>
        <li
          v-for="(raceType, indexT) in raceTypeList"
          :key="indexT"
          @click="
            nowType = indexT;
            isFollow = raceType.id;
            defaultPagination = 1;
            getTrackList();
          "
          :class="{ activeType: nowType == indexT }"
        >
          {{ raceType.name }}
          <span class="race-line"></span>
          <span class="race-num">{{ raceType.num }}</span>
        </li>
      </ul>
      <p class="search-type">
        <span class="iconfont icon-sousuo_search"></span>
        <input
          type="text"
          :placeholder="$t('public.pls_inp')"
          v-model="trackSearch"
        />
      </p>
      <div class="fixed-mask"></div>
    </div>
    <!-- 跟踪列表 -->
    <van-pull-refresh
      v-model="isLoading"
      :success-text="$t('public.reload')"
      @refresh="onRefreshTrack"
      v-if="isHasData"
      :disabled="!$flag"
    >
      <!-- 刷新成功 -->
      <div class="row" v-loading="loadData">
        <div
          class="col-sm-6 col-lg-3"
          v-for="(track, indexR) in trackList"
          :key="indexR"
        >
          <TrackComponent :data="track" @upTrackList="upTrackList" />
        </div>
      </div>
    </van-pull-refresh>
    <p class="no-data" v-else>
      <!-- 暂无项目 -->
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
  </div>
</template>

<script>
import { BasePagination } from "@/components";
import { trackPro, trackCount } from "@/request/api";
import { scrollBack } from "@/util/index";
import { mapState } from "vuex";
export default {
  data() {
    return {
      raceTypeList: [
        {
          //开放项目
          name: this.$t('bureau_track.own_pro'),
          id: 2,
          num: 0,
        },
        {
          //自选跟踪
          name: this.$t('bureau_track.open_pro'),
          id: 1,
          num: 0,
        },
        {
          //未跟踪项目
          name: this.$t('bureau_track.un_pro'),
          id: 0,
          num: 0,
        },
      ], //赛道类型列表
      nowType: 9999, //默认选中
      trackList: [], //解析列表
      total: 10, //总页数
      defaultPagination: 1, //当前页码
      loadData: false, //数据加载
      isNeedPage: false,
      isHasData: true,
      mobileTabs: false, //菜单打开状态
      totalPro: 0, //项目总数
      isFollow: null, //项目类型
      trackSearch: null, //搜索
      isFixed: false, //是否吸顶
      isLoading: false,
    };
  },
  created() {
    if (window.localStorage.getItem("trackPage")) {
      this.defaultPagination = Number(window.localStorage.getItem("trackPage"));
    }
    this.getTeackCount();
    this.getTrackList();
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {
    trackSearch() {
      this.defaultPagination = 1;
      this.getTrackList();
    },
    defaultPagination(val) {
      this.getTrackList();
      scrollBack();
      window.localStorage.setItem("trackPage", val);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.initHeight, true);
  },
  components: {
    BasePagination,
    TrackComponent: (resolve) => require(["./coms/track_list.vue"], resolve),
  },
  methods: {
    //获取跟踪数量信息
    async getTeackCount() {
      const result = await trackCount();
      this.totalPro = result.total;
      this.$set(this.raceTypeList[0], "num", result.free);
      this.$set(this.raceTypeList[1], "num", result.follow);
      this.$set(this.raceTypeList[2], "num", result.notFollow);
    },
    //获取跟踪项目
    async getTrackList() {
      this.loadData = true;
      const result = await trackPro({
        page: this.defaultPagination,
        limit: 12,
        follow: this.isFollow,
        search: this.trackSearch,
      });
      this.loadData = false;
      this.trackList = result.data;
      this.total = result.last_page;
      result.last_page > 1
        ? (this.isNeedPage = true)
        : (this.isNeedPage = false);
      result.data.length == 0 && (this.isHasData = false);
      result.data.length > 0 && (this.isHasData = true);
    },
    //更新列表状态
    upTrackList() {
      this.getTeackCount();
      this.getTrackList();
    },
    //锚点移动
    tabsPoint(_index, _type) {
      let container = document.querySelector(".tabs-top");
      container.scrollTo({
        left: _type == 1 ? this.$refs.tabsTop[_index].offsetLeft - 12 : 0,
        behavior: "smooth",
      });
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
    //下拉刷新
    async onRefreshTrack() {
      await this.getTrackList();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.initHeight, true);
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== "TrackDetails") {
      window.localStorage.removeItem("trackPage");
    }
    next();
  },
};
</script>

<style lang="scss" scoped>
.has-fixed-track {
  padding-top: 64px;
}
.track-fixed-box {
  position: fixed !important;
  width: 83.5%;
  top: 64px;
  z-index: 1400;
  .fixed-mask {
    display: block !important;
  }
}
.other-fixed-width {
  width: 91.3%;
}

@media screen and (min-width: 2000px) {
  .track-fixed-box {
    width: 87.7% !important;
  }
  .other-fixed-width {
    width: 93.5% !important;
  }
}
@media screen and (max-width: 1400px) {
  .track-fixed-box {
    width: 88.1% !important;
  }
}
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
.bureau-track {
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
  }
  .mobile-search-track {
    padding: 1rem $fon14;
    padding-top: 0.5rem;
    width: 100%;
    background: $contentBg;
    position: relative;
    input {
      width: 100%;
      height: 2rem;
      background: $conBg2;
      border-radius: $fon18;
      font-size: 0.81rem;
      color: $textColor;
      box-sizing: border-box;
      padding-left: 2rem;
    }
    .iconfont {
      display: inline-block;
      position: absolute;
      left: 1.6rem;
      top: 1rem;
      font-size: 1rem;
      color: $textColor;
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
      width: 160px;
      height: 28px;
      background: $conBg2;
      border-radius: 18px;
      position: relative;
      margin-right: 12px;
      .iconfont {
        position: absolute;
        top: 7px;
        font-size: 14px;
        left: 12px;
      }
      input {
        width: 100%;
        height: 100%;
        color: $textColor;
        background: rgba(0, 0, 0, 0);
        font-size: 12px;
        box-sizing: border-box;
        padding-left: 30px;
      }
    }
  }
  .row {
    margin-top: 24px;
    min-height: 600px;
  }
  .page-tools {
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
  }
  .no-data {
    text-align: center;
    font-size: 18px;
    color: $remarkColor;
    margin-top: 100px;
  }
}
@media screen and (max-width: 1279px) {
  .has-fixed-track {
    padding-top: 3.3rem;
  }
  .track-fixed-box {
    // top:;
    width: 100% !important;
    position: fixed;
    top: 4.8rem;
    .fixed-mask {
      height: 1rem !important;
      bottom: -1rem !important;
    }
  }
  .bureau-track {
    overflow-x: hidden;
    .title-box {
      display: none;
    }
    .race-type {
      width: 100%;
      border-radius: 0;
      margin-top: 0;
      ul::-webkit-scrollbar {
        display: none;
      }
      .search-type {
        display: none;
      }
    }
    .row {
      // margin-top: 6rem;
      padding: 0 $fon14;
    }
    .page-tools {
      justify-content: center;
    }
    .no-data {
      margin-top: 140px;
    }
  }
}
</style>