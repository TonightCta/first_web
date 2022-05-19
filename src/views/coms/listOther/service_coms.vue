<template>
  <!-- 项目咨询 -->
  <div class="service-tent">
    <el-table :data="tableData" v-if="!$flag" @row-click="rowService" :empty-text="$t('no_data.no_table')">
      <el-table-column width="180" :label="$t('month_vip.table_pro')">
        <!-- 项目名称 -->
        <template slot-scope="{ row }">
          <p style="color: white; font-weight: bold" class="text-overflow">
            {{ row.title }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="desc" :label="$t('project_interface.service_con')">
        <!-- 咨询内容 -->
        <template slot-scope="{ row }">
          <p style="color: white" class="text-overflow">
            {{ row.desc }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        prop="create_time"
        :label="$t('project_interface.service_date')"
      >
        <!-- 咨询时间 -->
      </el-table-column>
      <el-table-column width="150" :label="$t('library.status')">
        <!-- 当前状态 -->
        <template slot-scope="scope">
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
        </template>
      </el-table-column>
      <el-table-column
        width="70"
        prop="name"
        :label="$t('month_vip.table_oper')"
        header-align="right"
      >
        <!-- 操作 -->
        <template slot-scope="scope">
          <div class="text-right">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('library.view_details')"
            >
              <p
                slot="reference"
                class="iconfont icon-yanjing_eyes"
                @click="goLibraryDetails(scope.row)"
              ></p>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 移动端 -->
    <el-table :data="tableData" v-else @row-click="serviceDetails">
      <el-table-column min-width="50" :label="$t('library.com_name')">
        <!-- 名称 -->
        <template slot-scope="{ row }">
          <p style="color: white; font-weight: bold" class="text-overflow">
            {{ row.title }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="desc"
        :label="$t('project_interface.service_con')"
      >
        <!-- 咨询内容 -->
        <template slot-scope="{ row }">
          <p style="color: white" class="text-overflow">
            {{ row.desc }}
          </p>
        </template>
      </el-table-column>
      <el-table-column min-width="55" :label="$t('public.time')">
        <!-- 时间 -->
        <template slot-scope="{ row }">
          <p>{{ row.create_time.substr(5, 10) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="60" :label="$t('work_order.work_status')">
        <!-- 状态 -->
        <template slot-scope="scope">
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ServiceComs",
  props: ["tableData"],
  methods: {
    rowService(_row) {
      this.goLibraryDetails(_row);
    },
    //项目咨询详情
    goLibraryDetails(_msg) {
      this.$emit("savePage");
      this.$store.commit("upLibraryID", _msg.id);
      this.$router.push("/proNews/library/libraryDetails");
    },
    serviceDetails(_row) {
      this.$store.commit("upLibraryID", _row.id);
      this.$router.push("/mobile-library-details?id=" + _row.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.service-tent {
  padding: 24px;
  .iconfont {
    font-size: 24px;
    color: $success;
    cursor: pointer;
  }
}
@media screen and (max-width: 1279px) {
  .service-tent {
    padding: 1rem;
  }
}
</style>