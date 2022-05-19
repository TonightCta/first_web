<template>
  <div
    class="event-con"
    :class="$route.name == 'OtherCenter' && 'without-padding'"
  >
    <el-table
      :data="tableData"
      :empty-text="$t('no_data.no_events')"
      v-if="!$flag"
      max-height="345"
      ref="eventsTable"
    >
      <el-table-column min-width="160" :label="$t('bureau_mine.intell_name')">
        <!-- 情报名称 -->
        <template slot-scope="{ row }">
          <p style="color: white" class="text-overflow">{{ row.title }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="90" :label="$t('bureau_mine.be_pro')">
        <!-- 所属项目 -->
        <template slot-scope="{ row }">
          <div style="display: flex; align-items: center">
            <img :src="row.logo" alt="" />
            <p style="margin-bottom: -5px" class="text-overflow">
              {{ row.project_title }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        min-width="90"
        prop="publish_time"
        :label="$t('month_vip.table_date')"
      >
        <!-- 发布时间 -->
      </el-table-column>
      <el-table-column
        min-width="50"
        header-align="right"
        :label="$t('month_vip.table_oper')"
      >
        <!-- 操作 -->
        <div slot-scope="{ row }" class="text-right">
          <span
            class="iconfont icon-PDF"
            style="color: #a7f0ba"
            @click="goPDF($flag ? row.mobile_pdf : row.pdf, 2, row.id)"
            v-if="row.type == 2"
          ></span>
          <span
            class="iconfont icon-yanjing_eyes"
            style="color: #a7f0ba"
            @click="
              $refs.contentbox.getProps(
                row.id,
                (isTrans = row.is_chinese == 1 ? 0 : 1)
              )
            "
            v-if="row.type == 5"
          ></span>
        </div>
      </el-table-column>
    </el-table>
    <!-- 移动端 -->
    <el-table
      :data="tableData"
      :empty-text="$t('no_data.no_events')"
      height="345"
      ref="eventsTableMobile"
      v-else
      @row-click="goPDFMobile"
    >
      <el-table-column min-width="60" :label="$t('bureau_mine.be_pro')">
        <!-- 所属项目 -->
        <template slot-scope="{ row }">
          <div style="display: flex">
            <img :src="row.logo" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="150" :label="$t('bureau_mine.intell_name')">
        <!-- 情报名称 -->
        <template slot-scope="{ row }">
          <p style="" class="text-overflow-event">{{ row.title }}</p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="40"
        header-align="right"
        :label="$t('public.time')"
      >
        <!-- 时间 -->
        <!-- 时间 -->
        <template slot-scope="{ row }">
          <p class="text-right">{{ row.publish_time.substr(5, 10) }}</p>
        </template>
      </el-table-column>
    </el-table>
    <!-- 内容原文 -->
    <ConetentBox ref="contentbox" />
  </div>
</template>

<script>
import { giveEvent, unReadEvent } from "@/request/api";
export default {
  name: "EventComs",
  props: ["comType"],
  /**
   * @param comType == 1 --> 未读探子回报
   * @param comType == 2 --> 赠送探子回报
   */
  data() {
    return {
      tableData: [],
      defaultPagination: 1,
    };
  },
  created() {
    this.comType == 1 ? this.getUnReadEvents() : this.getGiveEvents();
  },
  mounted() {
    this.tableListener();
  },
  methods: {
    //赠送的探子回报
    async getGiveEvents() {
      const result = await giveEvent({
        limit: 10,
        page: this.defaultPagination,
      });
      if (this.defaultPagination > 1) {
        result.forEach((e) => {
          this.tableData.push(e);
        });
      } else {
        this.tableData = result;
      }
    },
    //未读的探子回报
    async getUnReadEvents() {
      const result = await unReadEvent({
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
    //查看PDF
    goPDF(_url, _type, _id) {
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      // window.open(_url);
      !this.$flag
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
          this.comType == 1 ? this.getUnReadEvents() : this.getGiveEvents();
        }
      });
    },
  },
  components: {
    ConetentBox: (resolve) =>
      require(["../../bureau/coms/content_box"], resolve),
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1279px) {
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

.event-con {
  padding: 24px;
  .text-overflow-event {
    color: white;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    padding-right: 0.5rem;
  }
  .iconfont {
    font-size: 24px;
    cursor: pointer;
  }
  img {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    vertical-align: middle;
    margin-right: 12px;
    border: 1px solid #353e66;
  }
}
.without-padding {
  padding: 0;
}
@media screen and (max-width: 1279px) {
  .event-con {
    padding: 0;
    img {
      width: $padd24;
      height: $padd24;
    }
  }
}
</style>