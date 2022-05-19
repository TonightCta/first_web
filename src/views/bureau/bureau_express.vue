// 情报速递
<template>
  <div
    class="bureau-express"
    :class="app.account.is_follow == 0 && $flag && 'no-date-mobile'"
  >
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 没有比这更快速、更有用、更精准、更深入、覆盖更广的项目情报信息了！ -->
        {{$t('bureau_express.exporess_title')}}
      </p>
    </div>
    <div v-if="app.account.is_follow == 1">
      <Intellgence ref="intell" />
    </div>
    <div v-else>
      <NoData @upPageData="upPageData" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["app"]),
  },
  components: {
    Intellgence: (resolve) => require(["./coms/Intelligence_list"], resolve),
    NoData: (resolve) => require(["./coms/no_data"], resolve),
  },
  created() {
    this.$store.commit("upTrackID", null);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name !== "MobileInner") {
        vm.$store.commit("saveInedx", { _tabIndex: null, _dataIndex: null });
      }
    });
  },
  methods: {
    upPageData() {
      this.$refs.intell.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.bureau-express {
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
      .iconfont {
        position: absolute;
        top: 7px;
        font-size: 14px;
        right: 12px;
      }
      input {
        width: 100%;
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
}
@media screen and (max-width: 1279px) {
  .bureau-express {
    // overflow-x: hidden;
    // overflow-y: auto;
    .title-box {
      display: none;
    }
  }
}
</style>