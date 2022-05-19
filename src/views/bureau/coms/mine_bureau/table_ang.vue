// 研究员观表格
<template>
  <div class="table-ang">
    <!-- @row-click="rowContent" -->
    <el-table
      :data="tableData"
      style="width: 100%"
      height="460"
      :empty-text="$t('no_data.no_medium')"
    >
      <!-- 暂无Medium文章 -->
      <el-table-column
        prop="publish_time_str"
        :label="$t('public.time')"
        width="120"
        v-if="!$flag"
      >
        <!-- 时间 -->
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('month_vip.table_name')"
        :width="$flag ? '55' : '80'"
      >
        <!-- 项目 -->
        <template slot-scope="{ row }">
          <p class="icon-box">
            <img :src="row.logo" alt="" />
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('bureau_mine.ari_title')">
        <!-- 文章标题 -->
        <template slot-scope="{ row }">
          <div class="ev-box">
            <p :class="$flag ? 'two-elip' : 'ev-abs'">
              {{ app.language == 'en' ? row.title :  row.title_zh }}
            </p>
            <p class="ev-ang" v-if="row.analysis">{{ row.analysis }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('month_vip.table_oper')"
        :width="$flag ? '40' : '100'"
        header-align="right"
      >
        <!-- 操作 -->
        <template slot-scope="{ row }">
          <div class="text-right">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('bureau_mine.get_ann')"
              v-if="false"
            >
              <!-- 召唤研究员 -->
              <p
                slot="reference"
                class="iconfont icon-renyuanshuohua_people-speak icon-color"
              ></p>
            </el-popover>
            <el-popover
              placement="top"
              :disabled="Boolean($flag)"
              trigger="hover"
              :content="$t('public.con_text')"
            >
              <!-- 英文原文 -->
              <p
                slot="reference"
                class="iconfont icon-yanjing_eyes"
                @click="
                  !$flag
                    ? $refs.contentbox.getProps(
                        row.id,
                        row.is_chinese == 1 ? 0 : 1
                      )
                    : $router.push({
                        path: '/mobile-inner',
                        query: {
                          id: row.id,
                          isTrans: row.is_chinese == 1 ? 0 : 1,
                        },
                      })
                "
              ></p>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 内容原文 -->
    <ConetentBox ref="contentbox" />
    <!-- 提交翻译 -->
    <TranslateSub ref="translateSub" />
  </div>
</template>

<script>
import { angMineBureau } from "@/request/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  components: {
    TranslateSub: (resolve) => require(["./sub_translate"], resolve),
    ConetentBox: (resolve) => require(["../content_box"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {},
  created() {
    this.getData();
  },
  methods: {
    rowContent(row) {
      !this.$flag
        ? this.$refs.contentbox.getProps(row.id, row.is_chinese == 1 ? 0 : 1)
        : this.$router.push({
            path: "/mobile-inner",
            query: {
              id: row.id,
              isTrans: row.is_chinese == 1 ? 0 : 1,
            },
          });
    },
    async getData() {
      const result = await angMineBureau();
      this.tableData = result;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-ang {
  .icon-box {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid $lineTwoColor;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      border-radius: 50%;
      height: 100%;
      background: white;
    }
  }
  .ev-box {
    .ev-abs {
      // width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      margin-bottom: 4px;
      color: white;
    }
    .ev-ang {
      // width: 50%;
      font-size: 12px;
      padding: 8px;
      border-radius: 4px;
      background: rgba(167, 240, 186, 0.1);
      color: $success;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .text-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .iconfont {
      margin-left: 8px;
      font-size: 20px;
      cursor: pointer;
    }
    .icon-color {
      color: $iconColor !important;
    }
    p:last-child {
      color: $success;
    }
  }
}
@media screen and (max-width: 1279px) {
  /deep/ .el-table__header {
    th {
      padding-left: 0;
      padding-right: 0;
      .cell {
        padding-right: 0;
      }
    }
  }
  /deep/ .el-table__body {
    td {
      padding-left: 0;
      padding-right: 0;
      .cell {
        padding-right: 0;
      }
    }
  }
}
</style>