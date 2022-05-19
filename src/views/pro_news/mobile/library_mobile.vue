// 移动端咨询库详情
<template>
  <div class="library-details-mobile">
    <MobileNav>
      <p>
        <!-- 咨询库 -->
        {{ $t("routes.en_libary") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="library-inner" v-loading="loadData">
        <el-table :data="tableData" @row-click="goDetails">
          <el-table-column :label="$t('month_vip.table_pro')" min-width="60">
            <!-- 项目名称 -->
            <template slot-scope="{ row }">
              <p style="color: white" class="text-overflow-inner">
                {{ row.title }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('project_interface.service_con')"
            min-width="100"
          >
            <!-- 咨询内容 -->
            <template slot-scope="{ row }">
              <p style="color: white" class="text-overflow-inner">
                {{ row.desc }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('work_order.work_status')"
            min-width="60"
            header-align="right"
          >
            <template slot-scope="scope">
              <div class="text-right">
                <span v-if="scope.row.status == 1">
                  <!-- 处理中 -->
                  {{ $t("library.pro_progress") }}
                </span>
                <span v-if="scope.row.status == 2">
                  <!-- 已回复 -->
                  {{ $t("library.has_back") }}
                </span>
                <span v-if="scope.row.status == 3">
                  <!-- 待评价 -->
                  {{ $t("library.wait_evl") }}
                </span>
                <span v-if="scope.row.status == 4">
                  <!-- 已结单 -->
                  {{ $t("library.has_end") }}
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
  </div>
</template>

<script>
import { BasePagination } from "@/components";
import { library } from "@/request/api";
import { scrollInner } from "@/util/index";
export default {
  name: "DetailsLibraryMobile",
  data() {
    return {
      tableData: [
        {
          name: "213",
        },
      ],
      isWithPage: false,
      defaultPagination: 1,
      total: 1,
      loadData: false,
    };
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    BasePagination,
  },
  watch: {
    defaultPagination() {
      this.getData();
      scrollInner();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loadData = false;
      const result = await library({ page: this.defaultPagination, limit: 10 });
      this.loadData = false;
      this.total = result.last_page;
      this.tableData = result.data;
      result.last_page > 1
        ? (this.isWithPage = true)
        : (this.isWithPage = false);
    },
    goDetails(_row) {
      this.$router.push({
        path: "/mobile-library-details",
        query: {
          id: _row.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.view-inner-mobile {
  padding: 4rem 1rem;
}
.library-inner {
  padding: 1rem;
  // overflow-x: hidden;
  background: $contentBg;
  border-radius: 4px;
  .text-overflow-inner {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .page-tools {
    display: flex;
    justify-content: center;
  }
}
</style>