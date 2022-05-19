// 咨询库
<template>
  <div class="library">
    <p class="library-title h4">
      <!-- 咨询库 -->
      {{$t('routes.en_libary')}}
      <span>
        <!-- 以下是被咨询过的项目公开分享信息，欢迎浏览了解更多 -->
      {{$t('library.library_title')}}
      </span>
    </p>
    <div class="library-list" v-loading="loadData">
      <ServiceComponent :tableData="tableData" @savePage="savePage" />
      <!-- 分页器 -->
      <div class="page-tools" v-if="isWithPage">
        <base-pagination
          :page-count="total"
          type="info"
          v-model="defaultPagination"
        ></base-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { BasePagination } from "@/components";
import { library } from "@/request/api";
export default {
  name: "Library",
  data() {
    return {
      tableData: [],
      defaultPagination: 1, //默认页码
      total: 1, //总页数
      loadData: false, //加载状态
      isWithPage: false, //是否需要分页器
    };
  },
  components: {
    BasePagination,
    ServiceComponent: (resolve) =>
      require(["../coms/listOther/service_coms"], resolve),
  },
  created() {
    this.getLibraryList();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name == "LibraryDetails") {
        window.localStorage.getItem("liPage") &&
          (vm.defaultPagination = Number(window.localStorage.getItem("liPage")));
      }
    });
  },
  watch: {
    defaultPagination() {
      this.getLibraryList();
    },
  },
  methods: {
    //获取咨询库列表
    async getLibraryList() {
      this.loadData = true;
      const result = await library({
        page: this.defaultPagination,
        limit: 13,
      });
      this.loadData = false;
      this.total = result.last_page;
      this.tableData = result.data;
      result.last_page > 1 && (this.isWithPage = true);
    },
    savePage() {
      window.localStorage.setItem("liPage", this.defaultPagination);
    },
  },
};
</script>

<style lang="scss" scoped>
.library {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  .library-title {
    color: $textColor;
    span {
      font-size: 13px;
      color: $remarkColor;
    }
  }
  .library-list {
    min-height: 800px;
    /deep/ .el-table__header-wrapper {
      .cell {
        color: $textColor !important;
        font-weight: bold;
      }
    }
    .iconfont {
      font-size: 24px;
      color: $success;
      cursor: pointer;
    }
    .page-tools {
      display: flex;
      justify-content: flex-end;
      margin-top: 36px;
    }
  }
}
</style>