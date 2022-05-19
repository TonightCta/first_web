<template>
  <div class="un-read">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 未读的研报将展示在这里，不会让您迷失 -->
        {{ $t("un_read.unread_title") }}
      </p>
    </div>
    <!-- 选项卡 -->
    <div class="un-tab">
      <ul>
        <li
          v-for="(tab, indexT) in tabList"
          :key="indexT"
          :class="{ 'active-tab': tabIndex == indexT + 1 }"
          @click="changeTab(indexT)"
        >
          {{ tab.name }}
          <p class="un-count">{{ tab.count }}</p>
          <p class="tab-line"></p>
        </li>
      </ul>
      <div class="set-read" @click="readAll">
        <p class="iconfont icon-yiduyoujian_mail-open"></p>
        <!-- 全部标为已读 -->
        {{ $t("un_read.all_read") }}
      </div>
    </div>
    <!-- 未读列表 -->
    <div class="read-list" v-loading="loadData">
      <!-- 项目解析 -->
      <el-table
        :data="readData"
        :empty-text="$t('no_data.no_read')"
        v-if="tabIndex == 1"
      >
        <el-table-column min-width="60" :label="$t('month_vip.give_issue')">
          <!-- 期数 -->
          <template slot-scope="{ row }">
            <span> {{ row.periods }} </span>
          </template>
        </el-table-column>
        <el-table-column min-width="90" :label="$t('month_vip.table_pro')">
          <!-- 项目名称 -->
          <template slot-scope="{ row }">
            <img :src="row.logo" alt="" />
            <span style="margin-bottom: -5px; color: white; font-weight: bold">
              {{ row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <span v-if="row.race">{{ row.race.join(",") }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column min-width="50" :label="$t('month_vip.table_follow')">
          <!-- 关注 -->
          <template slot-scope="{ row }">
            <span v-if="row.is_attention == 1">
              <!-- 是 -->
              {{$t('public.yes')}}
            </span>
            <span v-else>
              <!-- 否 -->
              {{$t('public.no')}}
            </span>
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
          min-width="65"
          header-align="right"
          :label="$t('month_vip.table_oper')"
        >
          <!-- 操作 -->
          <div slot-scope="{ row }" class="text-right">
            <span
              class="iconfont icon-shujubiao_data-sheet"
              style="color: #33b1ff"
              v-if="row.is_attention == 1"
              @click="goProDetails(row.id, row.symbol)"
            ></span>
            <span
              class="iconfont icon-PDF"
              style="color: #a7f0ba"
              @click="goPDF($flag ? row.mobile_pdf : row.pdf, 1, row.id)"
            ></span>
          </div>
        </el-table-column>
      </el-table>
      <!-- 重大事件 -->
      <el-table
        :data="readData"
        :empty-text="$t('no_data.no_read')"
        v-if="tabIndex == 2"
      >
        <el-table-column min-width="160" :label="$t('month_vip.intell_title_mobile')">
          <!-- 情报标题 -->
          <template slot-scope="{ row }">
            <p style="color: white">{{ row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="90" :label="$t('bureau_mine.be_pro')">
          <!-- 所属项目 -->
          <template slot-scope="{ row }">
            <img :src="row.logo" alt="" />
            <span style="margin-bottom: -5px"> {{ row.name }} </span>
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
              @click="goPDF($falg ? row.mobile_pdf : row.pdf, 2, row.id)"
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
      <!-- 新币速递 -->
      <el-table
        :data="readData"
        :empty-text="$t('no_data.no_read')"
        v-if="tabIndex == 3"
      >
        <el-table-column min-width="120" :label="$t('month_vip.give_title_2')">
          <!-- 新币名称 -->
          <template slot-scope="{ row }">
            <img :src="row.logo" alt="" />
            <span style="color: white; font-weight: bold">
              {{ row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="100" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <span v-if="row.race">{{ row.race.join(",") }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70" :label="$t('month_vip.table_follow')">
          <!-- 关注 -->
          <template slot-scope="{ row }">
            <span v-if="row.is_attention == 1">
              <!-- 是 -->
              {{$t('public.yes')}}
            </span>
            <span v-else>
              <!-- 否 -->
              {{$t('public.no')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="70"
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
              @click="goPDF($flag ? row.mobile_pdf : row.pdf, 3, row.id)"
            ></span>
          </div>
        </el-table-column>
      </el-table>
      <!-- 赛道解析 -->
      <el-table
        :data="readData"
        :empty-text="$t('no_data.no_read')"
        v-if="tabIndex == 4"
      >
        <el-table-column min-width="70" :label="$t('month_vip.give_title_4')">
          <!-- 赛道名称 -->
          <template slot-scope="{ row }">
            <span style="color: white"> {{ row.title }} </span>
          </template>
        </el-table-column>
        <el-table-column min-width="50" label="GEM">
          <template slot-scope="{ row }">
            <div class="gem-info">
              <div
                v-for="(gem, indexG) in row.gem_info"
                :key="indexG"
                class="info-content"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="gem.title + '(' + gem.symbol + ')'"
                  placement="top"
                  v-if="indexG <= 1"
                >
                  <p>
                    <img :src="gem.logo" alt="" />
                  </p>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="120" :label="$t('month_vip.table_name')">
          <!-- 项目 -->
          <template slot-scope="{ row }">
            <div class="gem-info">
              <div
                v-for="(gem, indexG) in row.project_info"
                :key="indexG"
                class="info-content"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="gem.title + '(' + gem.symbol + ')'"
                  placement="top"
                  v-if="indexG <= 7"
                >
                  <p>
                    <img :src="gem.logo" alt="" />
                  </p>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="70"
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
              @click="goPDF($flag ? row.mobile_pdf : row.pdf, 4, row.id)"
            ></span>
          </div>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="page-tools" v-if="isNeed">
        <base-pagination
          :page-count="total"
          type="info"
          v-model="defaultPagination"
        ></base-pagination>
      </div>
    </div>
    <!-- 内容原文 -->
    <ConetentBox ref="contentbox" />
  </div>
</template>

<script>
import { BasePagination } from "@/components";
import * as api from "@/request/api";
export default {
  name: "UnRead",
  data() {
    return {
      tabList: [
        {
          //项目解析
          name: this.$t("routes.project_an"),
          type: 1,
          count: "",
        },
        {
          //探子回报
          name: this.$t("month_vip.give_title_3"),
          type: 2,
          count: "",
        },
        {
          //新币速递
          name: this.$t("routes.project_del"),
          type: 3,
          count: "",
        },
        {
          //赛道解析
          name: this.$t("routes.sector_an"),
          type: 4,
          count: "",
        },
      ],
      readData: [], //未读列表
      tabIndex: 1, //当前选中列表
      loadData: false, //数据加载
      total: 1, //总页数
      defaultPagination: 1, //默认页码
      isNeed: false, //是否需要分页器
    };
  },
  components: {
    BasePagination,
    ConetentBox: (resolve) =>
      require(["../../bureau/coms/content_box"], resolve),
  },
  computed: {
    // tabList() {
    //   return
    // },
  },
  watch: {
    defaultPagination() {
      this.getUnReadList();
    },
  },
  created() {
    this.getUnReadCount();
    this.getUnReadList();
  },
  methods: {
    //切换选项卡
    changeTab(_index) {
      this.tabIndex = 99;
      this.loadData = true;
      this.readData = [];
      setTimeout(() => {
        this.tabIndex = _index + 1;
        this.getUnReadList();
        this.loadData = false;
      }, 500);
    },
    //未读总数
    async getUnReadCount() {
      const result = await api.unReadCount();
      this.tabList[0].count = result.project_count;
      this.tabList[1].count = result.event_count;
      this.tabList[2].count = result.coin_count;
      this.tabList[3].count = result.race_count;
    },
    //获取未读列表
    async getUnReadList() {
      const listType = {
        type: this.tabIndex,
        limit: 10,
        page: this.defaultPagination,
      };
      const result = await api.unReadList(listType);
      this.readData = result.data;
      this.total = result.last_page;
      this.total > 1 ? (this.isNeed = true) : (this.isNeed = false);
    },
    //查看PDF
    goPDF(_url, _type, _id) {
      // const is_old = !is_new_pdf ? 1 : is_new_pdf == 1 ? 0 : 1;
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      this.getUnReadList();
      this.$store.dispatch("viewPDF", _url);
    },
    //项目解析面板
    goProDetails(_id, _symbol) {
      this.$store.commit("upProjectID", _id);
      this.$router.push({
        path: "/project/projectDetails",
        query: {
          id: _id,
          name: _symbol,
        },
      });
    },
    //已读全部
    async readAll() {
      await api.readAllRecomand();
      this.getUnReadCount();
      this.getUnReadList();
      this.$notify({
        type: "success",
        //全部已读成功
        message: this.$t("notify.read_all"),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.un-read {
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: flex-start;
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
        margin-right: 8px;
        font-size: 22px;
      }
    }
  }
  .un-tab {
    display: flex;
    justify-content: space-between;
    padding: 15px 24px;
    border-radius: 4px;
    background: $contentBg;
    margin-top: 16px;
    ul {
      display: flex;
      li {
        display: flex;
        margin-right: 24px;
        position: relative;
        transition: 0.3s all;
        cursor: pointer;
        font-size: 4px;
        color: $remarkColor;
        font-size: 14px;
        .un-count {
          display: flex;
          padding: 0 8px;
          align-items: center;
          margin-left: 8px;
          background: rgba(255, 212, 92, 0.1);
          color: #ffd45c;
          border-radius: 4px;
          font-size: 12px;
          transform: translateY(-1px);
        }
        .tab-line {
          position: absolute;
          width: 0;
          height: 3px;
          background: $success;
          bottom: -14px;
          left: 50%;
          margin-left: -12px;
          transition: 0.3s all;
        }
      }
      .active-tab {
        color: $success;
        .un-count {
          color: $success;
          background: rgba(167, 240, 186, 0.1);
        }
        .tab-line {
          width: 24px;
        }
      }
    }
    .set-read {
      display: flex;
      color: white;
      font-size: 14px;
      height: 16px;
      cursor: pointer;
      align-items: center;
      .iconfont {
        font-size: 16px;
        margin-right: 10px;
      }
    }
  }
  .read-list {
    padding: 24px;
    background: $contentBg;
    border-radius: 4px;
    margin-top: 16px;
    min-height: 600px;
    .h4 {
      color: white;
      margin-bottom: 4px;
    }
    .give-remark {
      font-size: 12px;
      color: $remarkColor;
      margin-bottom: 24px;
    }
    .iconfont {
      font-size: 24px;
      cursor: pointer;
    }
    .iconfont:last-child {
      margin-left: 8px;
    }
    img {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      vertical-align: middle;
      margin-right: 12px;
      border: 1px solid #353e66;
    }
    .gem-info {
      display: flex;
      p {
        width: 28px;
        height: 28px;
        background: $contentBg;
        margin-right: 4px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
          width: 24px;
          height: 24px;
          margin-right: 0;
          background: white;
          box-sizing: border-box;
          border-color: rgba(0, 0, 0, 0);
          border-radius: 50%;
        }
      }
      .info-content {
        position: relative;
        z-index: 100;
      }
      .info-content:nth-child(2) {
        margin-left: -8px;
        position: relative;
        z-index: 95;
      }
      .info-content:nth-child(3) {
        margin-left: -8px;
        position: relative;
        z-index: 90;
      }
      .info-content:nth-child(4) {
        margin-left: -8px;
        position: relative;
        z-index: 85;
      }
      .info-content:nth-child(5) {
        margin-left: -8px;
        position: relative;
        z-index: 80;
      }
      .info-content:nth-child(6) {
        margin-left: -8px;
        position: relative;
        z-index: 75;
      }
      .info-content:nth-child(7) {
        margin-left: -8px;
        position: relative;
        z-index: 70;
      }
    }
    .page-tools {
      display: flex;
      justify-content: flex-end;
      margin-top: 36px;
    }
  }
}
</style>