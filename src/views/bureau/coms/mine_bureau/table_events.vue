// 即将发生的事件
<template>
  <div class="table-events">
    <!-- @row-click="rowEvents" -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :height="$flag ? null : '460'"
      :empty-text="
        app.account.is_information == 1
          ? $t('no_data.no_evs')
          : $t('no_data.no_ann')
      "
    >
      <el-table-column
        prop="happen_time_str"
        :label="$t('public.time')"
        v-if="app.account.is_information == 1"
        :width="$flag ? '80' : '120'"
      >
        <!-- 时间 -->
      </el-table-column>
      <el-table-column
        :label="$t('month_vip.table_name')"
        v-if="!$flag"
        :width="$flag ? '40' : '80'"
      >
        <!-- 项目 -->
        <template slot-scope="{ row }">
          <p class="icon-box">
            <img :src="row.logo" alt="" />
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :label="
          app.account.is_information == 1
            ? $t('bureau_mine.event_title')
            : $t('bureau_mine.an_title')
        "
      >
        <!-- 事件标题 & 公告标题 -->
        <template slot-scope="{ row }">
          <p :class="$flag ? 'two-elip' : 'text-overflow'">
            <span v-if="app.account.is_information == 1 && $flag"
              >{{ row.projectTitle }}：</span
            >
            {{ app.language == 'en' ? row.title : row.title_zh }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('month_vip.table_oper')"
        header-align="right"
        :width="$flag ? '60' : '110'"
      >
        <!-- 操作 -->
        <template slot-scope="{ row }">
          <div class="text-right" v-if="app.account.is_information == 1">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('burean_mine.get_ann')"
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
              trigger="hover"
              :content="$t('public.con_text')"
              v-if="!$flag"
            >
              <!-- 英文原文 -->
              <p
                slot="reference"
                class="iconfont icon-yanjing_eyes icon-eyes"
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
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('bureau_mine.add_calendar')"
              v-if="row.added == 0"
            >
              <!-- 添加到日历 -->
              <p
                slot="reference"
                class="iconfont icon-rili_calendar"
                @click="addToCalendar(1, row.id)"
              ></p>
            </el-popover>
            <!-- icon-xiaoyan2_check-one -->
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('bureau_mine.has_push')"
              v-else
            >
              <!-- 已添加 -->
              <p slot="reference" class="iconfont icon-xiaoyan2_check-one"></p>
            </el-popover>
          </div>
          <!-- 1U套餐权限 -->
          <div class="text-right" v-else>
            <el-popover
              placement="top"
              :disabled="Boolean($flag)"
              trigger="hover"
              :content="$t('public.soure')"
            >
              <!-- 查看来源 -->
              <p
                slot="reference"
                class="iconfont icon-yuanbian-lianjie_link-two"
                @click="viewOffcial(row.content_url)"
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
import { evMineBureau, addCalendar } from "@/request/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      evType: 1,
    };
  },
  components: {
    TranslateSub: (resolve) => require(["./sub_translate"], resolve),
    ConetentBox: (resolve) => require(["../content_box"], resolve),
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {},
  methods: {
    rowEvents(row) {
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
    changeEvType(_val) {
      this.evType = _val;
      this.getData();
    },
    async getData() {
      const result = await evMineBureau({ type: this.evType });
      this.tableData = result.list;
    },
    viewOffcial(_url) {
      window.open(_url);
    },
    //添加日历
    async addToCalendar(_type, _id) {
      const result = await addCalendar({ id: _id, type: _type });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        //已添加到我的日历<br>如果您已订阅日历，稍后将同步到您的日历客户端。
        message:this.$t('notify.add_calendar'),
      });
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.table-events {
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
    .icon-eyes {
      color: $success !important;
    }
    p:last-child {
      color: #ffd45c;
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