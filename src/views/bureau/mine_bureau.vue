// 我的情报局
<template>
  <div class="mine-bureau">
    <!-- 标题 -->
    <MineTitle />
    <!-- 情报局统计信息 -->
    <Total ref="total" @reloadMine="upPageData" />
    <!-- 项目信息 -->
    <Project @upLoadData="reloadData" ref="project" />
    <div v-if="app.account.is_follow == 1">
      <!-- 最新资讯 -->
      <News ref="news" />
    </div>
    <div v-else>
      <NoData @upPageData="upPageData" />
    </div>
    <!-- 我的自选 - 移动端 -->
    <MobileMineTrack v-if="$flag" @upPageData="upPageData" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    MineTitle: (resolve) => require(["./coms/mine_bureau/title"], resolve),
    Total: (resolve) => require(["./coms/mine_bureau/total_bureau"], resolve),
    Project: (resolve) =>
      require(["./coms/mine_bureau/project_bureau"], resolve),
    News: (resolve) => require(["./coms/mine_bureau/news_bureau"], resolve),
    NoData: (resolve) => require(["./coms/no_data"], resolve),
    MobileMineTrack: (resolve) =>
      require(["./coms/my_optional_mobile"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created(){
    this.$flag && this.app.account.is_follow == 0 && this.$router.push('/add-track')
  },
  methods: {
    reloadData() {
      this.$refs.news.reload();
    },
    //更新页面信息
    upPageData() {
      setTimeout(() => {
        this.reloadData();
        this.$refs.total.getTotal();
        this.$refs.project.reload();
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1279px) {
  .mine-bureau {
    padding: 0 $fon14;
    overflow-x: hidden;
  }
}
</style>