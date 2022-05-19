<template>
  <div class="list-box">
    <el-table
      :data="tableData"
      v-loading="loadData"
      :empty-text="$t('no_data.no_service')"
      class="service-pc"
      @row-click="rowDetails"
    >
      <el-table-column min-width="100" :label="$t('work_order.work_numer')">
        <!-- 工单号 -->
        <template slot-scope="scope">
          <span style="color: #a2a5b0">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" :label="$t('month_vip.table_pro')">
        <!-- 项目名称 -->
        <template slot-scope="scope">
          <span style="color: white; font-weight: bold">{{
            scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" :label="$t('work_order.work_date')">
        <!-- 咨询时间 -->
        <template slot-scope="scope">
          <span style="color: #a2a5b0">{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" :label="$t('work_order.work_end')">
        <!-- 预计完成时间 -->
        <template slot-scope="{ row }">
          <p style="color: #a2a5b0">{{ row.estimate_time }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="100" :label="$t('work_order.work_pri')">
        <!-- 优先级 -->
        <template slot-scope="scope">
          <span style="color: white" v-if="scope.row.urgentrank_id == 2">
            <!-- 加急处理 -->
            {{ $t("work_details.urgent") }}
            <span
              class="iconfont icon-shandian_lightning"
              style="color: #ffbe5c; font-weight: 400"
            ></span>
          </span>
          <span v-else style="color: white">
            <!-- 普通处理 -->
            {{ $t("work_details.process") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" :label="$t('work_order.work_status')">
        <!-- 状态 -->
        <template slot-scope="scope">
          <span style="color: white" v-if="scope.row.status == 0">
            <!-- 已提交 -->
            {{ $t("work_details.has_sub") }}
          </span>
          <span style="color: white" v-if="scope.row.status == 1">
            <!-- 已分派 -->
            {{ $t("work_details.has_dispatch") }}
          </span>
          <span style="color: white" v-if="scope.row.status == 2">
            <!-- 待回复 -->
            {{ $t("work_details.pend_back") }}
          </span>
          <span style="color: white" v-if="scope.row.status == 3">
            <!-- 待评价 -->
            {{ $t("library.wait_evl") }}
          </span>
          <span style="color: white" v-if="scope.row.status == 4">
            <!-- 已结单 -->
            {{ $t("library.has_end") }}
          </span>
          <span style="color: white" v-if="scope.row.status == 5">
            <!-- 已回复 -->
            {{ $t("library.has_back") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        header-align="right"
        :label="$t('month_vip.table_oper')"
      >
        <!-- 操作 -->
        <template slot-scope="scope">
          <div class="text-right" @click="goDetails(scope.row)">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('library.view_details')"
            >
              <!-- 查看咨询详情 -->
              <p
                style="width: 20px"
                slot="reference"
                class="iconfont icon-yanjing_eyes"
              ></p>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="tableData"
      v-loading="loadData"
      :empty-text="$t('no_data.no_service')"
      class="service-mobile"
      @row-click="mobileDetails"
      width="100%"
    >
      <el-table-column width="140" :label="$t('month_vip.table_pro')">
        <!-- 项目名称 -->
        <template slot-scope="scope">
          <span style="color: white; font-weight: bold">{{
            scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column width="70" :label="$t('work_order.work_date')">
        <!-- 咨询时间 -->
        <template slot-scope="scope">
          <span style="color: #a2a5b0">{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('work_order.work_status')"
        header-align="right"
      >
        <!-- 状态 -->
        <template slot-scope="scope">
          <div class="text-right">
            <span style="color: white" v-if="scope.row.status == 0">
              <!-- 已提交 -->
              {{ $t("work_details.has_sub") }}
            </span>
            <span style="color: white" v-if="scope.row.status == 1">
              <!-- 已分派 -->
              {{ $t("work_details.has_dispatch") }}
            </span>
            <span style="color: white" v-if="scope.row.status == 2">
              <!-- 待回复 -->
              {{ $t("work_details.pend_back") }}
            </span>
            <span style="color: white" v-if="scope.row.status == 3">
              <!-- 待评价 -->
              {{ $t("library.wait_evl") }}
            </span>
            <span style="color: white" v-if="scope.row.status == 4">
              <!-- 已结单 -->
              {{ $t("library.has_end") }}
            </span>
            <span style="color: white" v-if="scope.row.status == 5">
              <!-- 已回复 -->
              {{ $t("library.has_back") }}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="$flag && showmore" class="show-more">
      <base-button type="default" @click="$router.push('/proNews')">
        <!-- 查看全部 -->
        {{ $t("year_vip.view_all") }}
      </base-button>
    </p>
  </div>
</template>

<script>
import * as api from "@/request/api";
import { BasePagination } from "@/components";
export default {
  props: ["showmore"],
  name: "MyService",
  data() {
    return {
      tableData: [],
      loadData: false, //表格加载动画
      last_page: 1, //总页码
      defaultPagination: 1, //当前页码
      isPage: false, //是否显示分页器
    };
  },
  components: {
    BasePagination,
  },
  watch: {
    defaultPagination() {
      this.getWorkList();
    },
  },
  created() {
    this.getWorkList();
  },
  methods: {
    rowDetails(_row) {
      this.goDetails(_row);
    },
    //获取会员咨询列表
    async getWorkList() {
      const result = await api.serviceList({
        limit: 10,
        page: this.defaultPagination,
      });
      this.tableData = result.data;
      this.last_page = result.last_page;
      this.last_page > 1 && (this.isPage = true);
    },
    //工单详情
    goDetails(_ROW) {
      this.$store.commit("upServiceIDL", _ROW.id);
      this.$router.push("/proNews/serviceDetails");
    },
    //工单详情
    mobileDetails(_ROW) {
      this.$store.commit("upServiceIDL", _ROW.id);
      this.$router.push("/mobile-service-details");
    },
  },
};
</script>

<style lang="scss" scoped>
.list-box {
  width: 100%;
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  margin-bottom: 40px;
  .iconfont {
    color: $success;
    font-size: 20px;
    cursor: pointer;
  }
  .show-more {
    button {
      width: 100%;
      background: $conBg2;
    }
  }
  .text-right {
    display: flex;
    justify-content: flex-end;
  }
  .page-tools {
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
  }
  @media screen and (max-width: 1200px) {
    .page-tools {
      justify-content: center;
    }
  }
}
@media screen and (min-width: 1201px) {
  .list-box {
    .service-mobile {
      display: none;
    }
  }
}
@media screen and (max-width: 1200px) {
  .list-box {
    padding: 1rem;
    .service-pc {
      display: none;
    }
  }
}
</style>