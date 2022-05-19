<template>
  <div class="un-read">
    <MobileNav>
      <p>
        <!-- 未读研报 -->
        {{ $t("routes.unread_pro") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
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
            <p class="un-count">({{ tab.count }})</p>
            <p class="tab-line"></p>
          </li>
        </ul>
      </div>
      <!-- 未读列表 -->
      <div class="read-list" v-loading="loadData">
        <!-- 移动端-项目解析 -->
        <el-table
          :data="readData"
          :empty-text="$t('no_data.no_read')"
          v-if="tabIndex == 1 && this.$flag"
          @row-click="goProDetailsMobile"
        >
          <el-table-column min-width="60" :label="$t('month_vip.table_pro')">
            <!-- 项目名称 -->
            <template slot-scope="{ row }">
              <p style="color: white; font-weight: bold" class="text-overflow">
                {{ row.title }}
              </p>
            </template>
          </el-table-column>
          <el-table-column min-width="70" :label="$t('month_vip.table_race')">
            <!-- 赛道 -->
            <template slot-scope="{ row }">
              <p v-if="true" class="text-overflow">{{ row.race.join(",") }}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column min-width="30" :label="$t('public.follow')">
            <!-- 关注 -->
            <template slot-scope="{ row }">
              <p v-if="row.type != 4">
                <span v-if="row.is_attention == 1">
                  <!-- 是 -->
                  {{$t('public.yes')}}
                </span>
                <span v-else class="text-right">
                  <!-- 否 -->
                  {{$t('public.no')}}
                </span>
              </p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column
            min-width="50"
            header-align="right"
            :label="$t('public.time')"
          >
            <!-- 时间 -->
            <template slot-scope="{ row }">
              <p class="text-right">{{ row.publish_time.substr(5, 10) }}</p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 移动端-重大事件 -->
        <el-table
          :data="readData"
          :empty-text="$t('no_data.no_read')"
          v-if="tabIndex == 2 && $flag"
          @row-click="goPDFMobile"
        >
          <el-table-column :label="$t('month_vip.intell_title_mobile')">
            <!-- 情报标题 -->
            <template slot-scope="{ row }">
              <p style="padding-right: 0.5rem" class="text-overflow-event">
                {{ row.title }}
              </p>
            </template>
          </el-table-column>
          <el-table-column width="60" :label="$t('bureau_mine.be_pro')">
            <!-- 所属项目 -->
            <template slot-scope="{ row }">
              <div style="display: flex; justify-content: center">
                <img :src="row.logo" alt="" />
                <p style="margin-bottom: -5px" class="text-overflow">
                  {{ row.name }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="50"
            header-align="right"
            :label="$t('public.time')"
          >
            <!-- 时间 -->
            <template slot-scope="{ row }">
              <p class="text-right">{{ row.publish_time.substr(5, 10) }}</p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 移动端-新币速递 -->
        <el-table
          :data="readData"
          :empty-text="$t('no_data.no_read')"
          v-if="tabIndex == 3 && $flag"
          @row-click="goPDFMobileCoin"
        >
          <el-table-column min-width="100">
            <template slot="header">
              <p>
                <!-- 新币名称 -->
                {{ $t("month_vip.give_title_2") }}
              </p>
            </template>
            <template slot-scope="{ row }">
              <img :src="row.logo" alt="" />
              <span
                style="color: white; font-weight: bold"
                class="text-overflow"
              >
                {{ row.title }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="80" :label="$t('month_vip.table_race')">
            <!-- 赛道 -->
            <template slot-scope="{ row }">
              <p class="text-overflow">{{ row.race.join(",") }}</p>
            </template>
          </el-table-column>
          <el-table-column min-width="50" :label="$t('public.follow')">
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
            min-width="60"
            header-align="right"
            :label="$t('public.time')"
          >
            <!-- 时间 -->
            <template slot-scope="{ row }">
              <p class="text-right" style="color: #a2a5b0">
                {{ row.publish_time.substr(5, 10) }}
              </p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 移动端-赛道解析 -->
        <el-table
          :data="readData"
          :empty-text="$t('no_data.no_read')"
          v-if="tabIndex == 4 && $flag"
          @row-click="goPDFMobileRace"
        >
          <el-table-column min-width="70" :label="$t('month_vip.give_title_4')">
            <!-- 赛道名称 -->
            <template slot-scope="{ row }">
              <span style="color: white; padding-right: 0.5rem">
                {{ row.title }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="70" label="GEM">
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
          <el-table-column min-width="80" :label="$t('month_vip.table_name')">
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
            min-width="80"
            header-align="right"
            :label="$t('public.time')"
          >
            <!-- 时间 -->
            <template slot-scope="{ row }">
              <p class="text-right">{{ row.publish_time.substr(5, 10) }}</p>
            </template>
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
    </div>
  </div>
</template>

<script>
import { BasePagination } from "@/components";
import * as api from "@/request/api";
import { scrollInner } from "@/util/index";
export default {
  name: "UnRead",
  data() {
    return {
      tabList: [
        {
          //项目解析
          name: this.$t('routes.project_an'),
          type: 1,
          count: "",
        },
        {
          //探子回报
          name: this.$t('month_vip.give_title_3'),
          type: 2,
          count: "",
        },
        {
          //新币速递
          name: this.$t('public.info_coin'),
          type: 3,
          count: "",
        },
        {
          //赛道解析
          name: this.$t('public.info_race'),
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
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
  },
  watch: {
    defaultPagination() {
      this.getUnReadList();
      scrollInner();
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
      this.isNeed = false;
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
      this.$cell ? this.$store.dispatch("viewPDF", _url) : window.viewPDF(_url);
    },
    goPDFMobileRace(_row) {
      this.goPDF(_row.mobile_pdf, 4, _row.id);
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
    goPDFMobileCoin(_row) {
      this.goPDF(_row.mobile_pdf, 3, _row.id);
    },
    goProDetailsMobile(_row) {
      const panel = () => {
        this.$store.commit("upProjectID", _row.id);
        this.$router.push({
          path: "/mobile-project-details",
          query: {
            id: _row.id,
            name: _row.symbol,
          },
        });
      };
      const pdf = () => {
        this.goPDF(_row.mobile_pdf, _row.type, _row.id);
      };
      _row.is_attention == 1 ? panel() : pdf();
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
.un-read {
  .view-inner-mobile {
    padding: 6.5rem 1rem 0;
  }
  .un-tab {
    position: fixed;
    width: calc(100% - 2rem);
    left: 1rem;
    top: 3.75rem;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border-radius: 4px;
    background: $contentBg;
    z-index: 100;
    ul {
      display: flex;
      justify-content: space-between;
      width: 100%;
      overflow-x: auto;
      li {
        display: flex;
        position: relative;
        transition: 0.3s all;
        cursor: pointer;
        font-size: 4px;
        color: $remarkColor;
        font-size: $fon12;
        white-space: nowrap;
        margin-right: 1rem;
        .un-count {
          display: flex;
        }
        .tab-line {
          position: absolute;
          width: 0;
          height: 3px;
          background: $success;
          bottom: -$fon14;
          left: 50%;
          margin-left: -$fon12;
          transition: 0.3s all;
        }
      }
      .active-tab {
        color: $success;
        .un-count {
          color: $success;
        }
        .tab-line {
          width: $padd24;
        }
      }
    }
    ul::-webkit-scrollbar{
      display: none;
    }
  }
  .read-list {
    padding: 1rem;
    background: $contentBg;
    border-radius: 4px;
    margin-top: 1rem;
    .h4 {
      color: white;
      margin-bottom: 4px;
    }
    .give-remark {
      font-size: $fon12;
      color: $remarkColor;
      margin-bottom: $padd24;
    }
    img {
      width: $padd24;
      height: $padd24;
      border-radius: 4px;
      vertical-align: middle;
      margin-right: 0.5rem;
      border: 1px solid #353e66;
    }
    .gem-info {
      display: flex;
      overflow-x: auto;
      p {
        width: $padd24;
        height: $padd24;
        background: $contentBg;
        margin-right: 4px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
          width: $fon20;
          height: $fon20;
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
      justify-content: center;
      margin-top: 36px;
    }
  }
}
</style>