// 年会员未读列表
<template>
  <div class="give-box">
    <!-- 项目解析 -->
    <div class="give-project public-give">
      <p class="h4">
        <!-- 项目解析研报 -->
        {{ $t("year_vip.unread_title_1") }}
        ({{ projectList.total }})
      </p>
      <el-table
        :data="projectList.data"
        :empty-text="$t('no_data.no_read_pro')"
        v-if="!$flag"
        @row-click="rowViewPro"
      >
        <el-table-column min-width="50" :label="$t('month_vip.give_issue')">
          <!-- 期数 -->
          <template slot-scope="{ row }">
            <span> {{ row.periods }} </span>
          </template>
        </el-table-column>
        <el-table-column min-width="110" :label="$t('month_vip.table_pro')">
          <!-- 项目名称 -->
          <template slot-scope="{ row }">
            <div style="display: flex; align-items: center">
              <img :src="row.logo" alt="" />
              <p style="color: white; font-weight: bold" class="text-overflow">
                {{ row.title }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="80" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <span>{{ row.race.join(",") }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="50" :label="$t('public.yes_no')">
          <!-- 关注 -->
          <template slot-scope="{ row }">
            <span v-if="row.is_attention == 1">
              <!-- 是 -->
              {{ $t("public.yes") }}
            </span>
            <span v-else>
              <!-- 否 -->
              {{ $t("public.no") }}
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
              @click.stop="goProDetails(row.id, row.symbol)"
            ></span>
            <span
              v-else
              class="iconfont icon-PDF"
              style="color: #a7f0ba"
              @click="goPDF($flag ? row.mobile_pdf : row.pdf, 1, row.id)"
            ></span>
          </div>
        </el-table-column>
      </el-table>
      <!-- 移动端 -->
      <el-table
        :data="projectList.data"
        :empty-text="$t('no_data.no_read_pro')"
        v-else
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
        <el-table-column min-width="90" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <p v-if="true" class="text-overflow">{{ row.race.join(",") }}</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column min-width="40" :label="$t('public.yes_no')">
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
          min-width="40"
          header-align="right"
          :label="$t('public.time')"
        >
          <!-- 时间 -->
          <template slot-scope="{ row }">
            <p class="text-right">{{ row.publish_time.substr(5, 10) }}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新币速递 -->
    <div class="give-coin public-give">
      <p class="h4">
        <!-- 新币速递 -->
        {{ $t("routes.project_del") }}
        ({{ coinList.total }})
      </p>
      <el-table
        :data="coinList.data"
        :empty-text="$t('no_data.no_read_coin')"
        v-if="!$flag"
        @row-click="rowViewCoin"
      >
        <el-table-column min-width="120" :label="$t('month_vip.give_title_2')">
          <!-- 新币名称 -->
          <template slot-scope="{ row }">
            <div style="display: flex; align-items: center">
              <img :src="row.logo" alt="" />
              <p class="text-overflow" style="color: white; font-weight: bold">
                {{ row.title }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="100" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <span>{{ row.race.join(",") }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70" :label="$t('public.yes_no')">
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
          min-width="80"
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
      <!-- 移动端 -->
      <el-table
        :data="coinList.data"
        :empty-text="$t('no_data.no_read_coin')"
        v-else
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
            <div style="display: flex; align-items: center">
              <img :src="row.logo" alt="" />
              <p class="text-overflow" style="color: white; font-weight: bold">
                {{ row.title }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="80" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <p class="text-overflow">{{ row.race.join(",") }}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="40" :label="$t('public.yes_no')">
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
          min-width="40"
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
    </div>
    <!-- 探子回报 -->
    <div class="give-event public-give">
      <p class="h4">
        {{ $t("month_vip.give_title_3") }} ({{ eventsList.total }})
      </p>
      <EventComponent ref="eventcom" :comType="1" />
    </div>
    <!-- 赛道解析 -->
    <div class="give-race public-give">
      <p class="h4">
        <!-- 赛道解析 -->
        {{ $t("routes.sector_an") }}
        ({{ raceList.total }})
      </p>
      <el-table
        :data="raceList.data"
        :empty-text="$t('no_data.no_read_race')"
        v-if="!$flag"
        @row-click="rowViewRace"
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
          min-width="80"
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
      <!-- 移动端 -->
      <el-table
        :data="raceList.data"
        :empty-text="$t('no_data.no_read_race')"
        v-else
        @row-click="goPDFMobileRace"
      >
        <el-table-column min-width="70" :label="$t('month_vip.give_title_4')">
          <!-- 赛道名称 -->
          <template slot-scope="{ row }">
            <p class="text-overflow" style="color: white">{{ row.title }}</p>
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
        <el-table-column width="120" :label="$t('month_vip.table_name')">
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
    </div>
  </div>
</template>

<script>
import * as api from "@/request/api";
export default {
  name: "GiveCenter",
  data() {
    return {
      //项目解析
      projectList: {
        total: 0,
        data: [],
      },
      //新币速递
      coinList: {
        total: 0,
        data: [],
      },
      //重大事件
      eventsList: {
        total: 0,
        data: [],
      },
      //赛道解析
      raceList: {
        total: 0,
        data: [],
      },
    };
  },
  // created() {
  // },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.getAllData();
      }, 1000);
    });
  },
  components: {
    EventComponent: (resolve) =>
      require(["../../coms/listOther/event_coms"], resolve),
  },
  methods: {
    // 数据请求
    getAllData() {
      this.getProject();
      this.getCoin();
      this.getEvents();
      this.$refs.eventcom.getUnReadEvents();
      this.getRace();
    },
    rowViewPro(_row) {
      this.goPDF(this.$flag ? _row.mobile_pdf : _row.pdf, 1, _row.id);
    },
    rowViewCoin(_row) {
      this.goPDF(this.$flag ? _row.mobile_pdf : _row.pdf, 3, _row.id);
    },
    rowViewRace(_row) {
      this.goPDF(this.$flag ? _row.mobile_pdf : _row.pdf, 4, _row.id);
    },
    //未读的项目解析
    async getProject() {
      const result = await api.unReadProject({ limit: 5 });
      this.projectList = result;
    },
    //未读的新币速递
    async getCoin() {
      const result = await api.unReadCoin({ limit: 5 });
      this.coinList = result;
    },
    //未读的重大事件
    async getEvents() {
      const result = await api.unReadEvent({ limit: 500 });
      this.eventsList = result;
    },
    //未读的赛道解析
    async getRace() {
      const result = await api.unReadRace({ limit: 5 });
      this.raceList = result;
    },

    //查看PDF
    goPDF(_url, _type, _id) {
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      !this.$flag
        ? this.$store.dispatch("viewPDF", _url)
        : this.$cell
        ? this.$store.dispatch("viewPDF", _url)
        : window.viewPDF(_url);
      // const is_old = !is_new_pdf ? 1 : is_new_pdf == 1 ? 0 : 1;
      // api.readNow({
      //   type: _type,
      //   id: _id,
      // });
      // !this.$flag
      //   ? window.PDFLock(_type, _id, 1, is_old)
      //   : this.$cell
      //   ? window.PDFLock(_type, _id, 2, is_old)
      //   : window.viewPDF(_type, _id, 2, is_old);
    },
    goPDFMobileCoin(_row) {
      this.goPDF(this.$flag ? _row.mobile_pdf : _row.pdf, 3, _row.id);
    },
    goPDFMobileRace(_row) {
      this.goPDF(this.$flag ? _row.mobile_pdf : _row.pdf, 4, _row.id);
    },
    //项目解析面板
    goProDetails(_id, _symbol) {
      this.$store.commit("upProjectID", _id);
      this.$router.push({
        path: this.$flag
          ? "/mobile-project-details"
          : "/project/projectDetails",
        query: {
          id: _id,
          name: _symbol,
        },
      });
    },
    goProDetailsMobile(_row) {
      api.readNow({
        type: 1,
        id: _row.id,
      });
      _row.is_attention == 1
        ? this.goProDetails(_row.id, _row.symbol)
        : this.goPDF(this.$flag ? _row.mobile_pdf : _row.pdf, 1, _row.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.give-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .public-give {
    width: 49.3%;
    padding: 24px;
    background: $contentBg;
    margin-bottom: 25px;
    border-radius: 4px;
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
      @media screen and (max-width: 1279px) {
        overflow-x: auto;
        p {
          width: $padd24;
          height: $padd24;
          img {
            width: $fon20;
            height: $fon20;
          }
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
    .gem-info::-webkit-scrollbar {
      display: none;
    }
  }
  .give-event {
    padding: 0;
    .h4 {
      transform: translate(24px, 24px);
    }
  }
  @media screen and (max-width: 1560px) {
    .public-give {
      width: 100%;
      padding: 1rem;
      .h4 {
        font-size: $fon14;
      }
    }
    .give-event {
      .h4 {
        transform: translate(0, 0);
      }
    }
  }
}
</style>