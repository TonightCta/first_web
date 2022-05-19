<template>
  <div class="event-table">
    <p class="h4">
      <!-- 探子回报 -->
      {{$t('month_vip.give_title_3')}}
    </p>
    <el-table
      :data="tableData"
      max-height="345"
      :empty-text="$t('no_data.no_events')"
      v-if="!$flag"
      ref="eventsTable"
    >
      <el-table-column prop="title" :label="$t('month_vip.intell_title_mobile')" min-width="280">
        <!-- 情报标题 -->
      </el-table-column>
      <el-table-column :label="$t('month_vip.table_date')" header-align="right" min-width="80">
        <!-- 发布时间 -->
        <template slot-scope="{ row }">
          <div class="text-right">{{ row.publish_time }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('month_vip.table_oper')" header-align="right" min-width="80">
        <!-- 操作 -->
        <template slot-scope="{ row }">
          <div
            class="text-right"
            v-if="row.type == 2"
            @click="goPDF($flag ? row.mobile_pdf : row.pdf, 2, row.id)"
          >
            <p class="iconfont icon-PDF"></p>
          </div>
          <div
            class="text-right"
            @click="
              $refs.contentbox.getProps(
                row.id,
                (isTrans = row.is_chinese == 1 ? 0 : 1)
              )
            "
            v-if="row.type == 5"
          >
            <p class="iconfont icon-yanjing_eyes"></p>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 移动端 -->
    <el-table
      :data="tableData"
      ref="eventsTableMobile"
      :empty-text="$t('no_data.no_events')"
      max-height="345"
      v-else
      @row-click="goPDFMobile"
    >
      <el-table-column prop="title" :label="$t('month_vip.intell_title_mobile')" min-width="100">
        <!-- 情报标题 -->
      </el-table-column>
      <el-table-column :label="$t('public.time')" header-align="right" min-width="50">
        <!-- 时间 -->
        <template slot-scope="{ row }">
          <div class="text-right">{{ row.publish_time.substr(5, 10) }}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 内容原文 -->
    <ConetentBox ref="contentbox" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { proEvent } from "@/request/api";
export default {
  name: "EventTable",
  data() {
    return {
      tableData: [],
      defaultPagination: 1,
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getProEvent();
  },
  components: {
    ConetentBox: (resolve) =>
      require(["../../bureau/coms/content_box"], resolve),
  },
  mounted(){
    this.tableListener()
  },
  methods: {
    async getProEvent() {
      const result = await proEvent({
        id: this.$route.query.id,
        limit: 10,
        page: this.defaultPagination,
      });
      if (this.defaultPagination > 1) {
        result.data.forEach((e) => {
          this.tableData.push(e);
        });
      } else {
        this.tableData = result.data;
      }
    },
    goPDF(_url, _type, _id) {
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      !this.$falg
        ? this.$store.dispatch("viewPDF", _url)
        : this.$cell
        ? this.$store.dispatch("viewPDF", _url)
        : window.viewPDF(_url);
    },
    goPDFMobile(_row) {
      _row.type == 5
        ? this.$router.push({
            path: "/mobile-inner",
            query: {
              id: _row.id,
              isTrans: _row.is_chinese == 1 ? 0 : 1,
            },
          })
        : this.goPDF(_row.mobile_pdf, _row.type, _row.id);
    },
    //监听表格滚动
    tableListener() {
      let dom = this.$flag
        ? this.$refs.eventsTableMobile.bodyWrapper
        : this.$refs.eventsTable.bodyWrapper;
      dom.addEventListener("scroll", () => {
        const scrollDistance =
          dom.scrollHeight - dom.scrollTop - dom.clientHeight;
        if (scrollDistance <= 0) {
          this.defaultPagination++;
          this.getProEvent();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.h4 {
  margin-bottom: 24px;
  color: white;
}
.event-table {
  padding: 24px;
  background: $contentBg;
  margin-top: 16px;
  border-radius: 4px;
  .iconfont {
    font-size: 24px;
    color: $success;
    cursor: pointer;
  }
}
@media screen and (max-width: 1279px) {
  .event-table {
    padding: 1rem;
    .h4 {
      font-size: $fon14;
      margin-bottom: 1rem;
    }
  }
  /deep/ .el-table__header-wrapper {
    table {
      th,
      td {
        padding: $fon12 0;
        .cell {
          padding: 0;
        }
      }
    }
  }
  /deep/ .el-table__body-wrapper {
    table {
      td {
        padding: $fon12 0;
        .cell {
          padding: 0;
        }
      }
    }
  }
}
</style>