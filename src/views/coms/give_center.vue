// 赠送列表
<template>
  <div class="give-box">
    <!-- 赠送项目解析 -->
    <div class="give-project public-give">
      <p class="h4">
        <!-- 项目解析研报 -->
        {{ $t("month_vip.give_title_1") }}
        (5)
      </p>
      <p class="give-remark">
        {{
          app.language == "en"
            ? `${
                (app.account.meal_id == 1 && "Trial subscribers") ||
                (app.account.meal_id == 2 && "Monthly subscribers")
              } will receive extra 5 latest complimenatry Project Analysis, annual subscribers have the access to view all`
            : `${
                (app.account.meal_id == 1 && "试用会员") ||
                (app.account.meal_id == 2 && "包月会员")
              }赠送最近5篇项目研报，包年会员可查看所有`
        }}
      </p>
      <el-table
        :data="projectList"
        :empty-text="$t('no_data.no_report')"
        v-if="!$flag"
      >
        <!-- 暂无解析研报 -->
        <el-table-column min-width="60" :label="$t('month_vip.give_issue')">
          <!-- 期数 -->
          <template slot-scope="{ row }">
            <span> {{ row.periods }} </span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" :label="$t('month_vip.table_pro')">
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
            <span>{{ row.race.parent }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="55" :label="$t('month_vip.table_follow')">
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
      <!-- 移动端 -->
      <el-table
        :data="projectList"
        :empty-text="$t('no_data.no_report')"
        v-else
        @row-click="goProDetailsMobile"
      >
        <!-- 暂无解析研报 -->
        <el-table-column min-width="80" :label="$t('month_vip.table_pro')">
          <!-- 项目名称 -->
          <template slot-scope="{ row }">
            <div style="display: flex">
              <p style="color: white; font-weight: bold" class="text-overflow">
                {{ row.title }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="90" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <span>{{ row.race.parent }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="50" :label="$t('month_vip.table_follow')">
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
          min-width="50"
          header-align="right"
          :label="$t('month_vip.table_date')"
        >
          <!-- 时间 -->
          <template slot-scope="{ row }">
            <p class="text-right">{{ row.publish_time.substr(5, 10) }}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 赠送新币速递 -->
    <div class="give-coin public-give">
      <p class="h4">
        <!-- 新币速递 -->
        {{ $t("routes.project_del") }} (5)
      </p>
      <p class="give-remark">
        {{
          app.language == "en"
            ? `${
                (app.account.meal_id == 1 && "Trial subscribers") ||
                (app.account.meal_id == 2 && "Monthly subscribers")
              } will can view the following complimentary Project Express. Project Express is exclusive for annual subscribers`
            : `${
                (app.account.meal_id == 1 && "试用会员") ||
                (app.account.meal_id == 2 && "包月会员")
              }赠送以下新币速递，新币速递为包年会员专享内容`
        }}
      </p>
      <el-table
        :data="coinList"
        :empty-text="$t('no_data.no_public_coin')"
        v-if="!$flag"
      >
        <!-- 暂无公开新币速递 -->
        <el-table-column min-width="120" :label="$t('month_vip.give_title_2')">
          <!-- 新币名称 -->
          <template slot-scope="{ row }">
            <div style="display: flex; align-items: center">
              <img :src="row.logo_image" alt="" />
              <span
                class="text-overflow"
                style="color: white; font-weight: bold"
              >
                {{ row.title }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="100" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <span>{{ row.race.join(",") }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70" :label="$t('month_vip.table_follow')">
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
        :data="coinList"
        :empty-text="$t('no_data.no_public.coin')"
        v-else
        @row-click="goPDFMobileCoin"
      >
        <!-- 暂无公开新币速递 -->
        <el-table-column min-width="100">
          <template slot="header">
            <p>
              <!-- 新币名称 -->
              {{ $t("month_vip.give_title_2") }}
            </p>
          </template>
          <template slot-scope="{ row }">
            <img :src="row.logo_image" alt="" />
            <span class="text-overflow" style="color: white; font-weight: bold">
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
        <el-table-column min-width="50" :label="$t('month_vip.table_follow')">
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
          min-width="60"
          header-align="right"
          :label="$t('month_vip.table_date')"
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
    <!-- 赠送重大事件 -->
    <div class="give-event public-give">
      <p class="h4">
        <!-- 探子回报 -->
        {{ $t("month_vip.give_title_3") }}
      </p>
      <p class="give-remark">
        {{ $t("month_vip.give_title_6") }}
      </p>
      <EventComponent :comType="2" />
    </div>
    <!-- 增送赛道解析 -->
    <div class="give-race public-give">
      <p class="h4">
        <!-- 赛道解析 -->
        {{ $t("routes.sector_an") }}(5)
      </p>
      <p class="give-remark">
        {{
          app.language == "en"
            ? `${
                (app.account.meal_id == 1 && "Trial subscribers") ||
                (app.account.meal_id == 2 && "Monthly subscribers")
              } will receive extra 5 latest complimenatry Sector Analysis, annual subscribers have the access to view all`
            : `${
                (app.account.meal_id == 1 && "试用会员") ||
                (app.account.meal_id == 2 && "包月会员")
              }赠送最近5篇赛道解析，包年会员可查看所有`
        }}
      </p>
      <el-table
        :data="raceList"
        :empty-text="$t('no_data.no_race')"
        v-if="!$flag"
      >
        <!-- 暂无赛道解析 -->
        <el-table-column min-width="90" :label="$t('month_vip.give_title_4')">
          <!-- 赛道名称 -->
          <template slot-scope="{ row }">
            <span style="color: white"> {{ row.title }} </span>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="GEM">
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
              @click="goPDF($flag ? row.mobile_pdf : row.pdf, 4, row.id)"
            ></span>
          </div>
        </el-table-column>
      </el-table>
      <!-- 移动端 -->
      <el-table
        :data="raceList"
        :empty-text="$t('no_data.no_race')"
        v-else
        @row-click="goPDFMobileRace"
      >
        <!-- 暂无赛道解析 -->
        <el-table-column min-width="90" :label="$t('month_vip.give_title_4')">
          <!-- 赛道名称 -->
          <template slot-scope="{ row }">
            <span style="color: white"> {{ row.title }} </span>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="GEM">
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
          min-width="50"
          header-align="right"
          :label="$t('month_vip.table_date')"
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
import { mapState } from "vuex";
export default {
  name: "GiveCenter",
  data() {
    return {
      //项目解析
      projectList: [],
      //新币速递
      coinList: [],
      //重大事件
      eventsList: [],
      //赛道解析
      raceList: [],
    };
  },
  components: {
    EventComponent: (resolve) =>
      require(["../coms/listOther/event_coms"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getProject();
    this.getCoin();
    // this.getEvents();
    this.getRace();
  },
  methods: {
    //赠送的项目解析
    async getProject() {
      const result = await api.giveProject({ limit: 5 });
      this.projectList = result;
      // console.log(result);
    },
    //赠送的新币速递
    async getCoin() {
      const result = await api.giveCoin({ limit: 5 });
      this.coinList = result;
    },
    //赠送的赛道解析
    async getRace() {
      const result = await api.giveRace({ limit: 5 });
      this.raceList = result;
    },
    //查看PDF
    goPDF(_url, _type, _id) {
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      // const is_old = !is_new_pdf ? 1 : is_new_pdf == 1 ? 0 : 1;
      // window.PDFLock(_type, _id, 1, is_old);
      this.$store.dispatch("viewPDF", _url);
    },
    goPDFMobileCoin(_row) {
      this.$store.dispatch("readPDF", { _type: 3, _id: _row.id });
      this.$cell
        ? this.$store.dispatch("viewPDF", _row.mobile_pdf)
        : window.viewPDF(_row.mobile_pdf);
    },
    goPDFMobileRace(_row) {
      this.$store.dispatch("readPDF", { _type: 4, _id: _row.id });
      this.$cell
        ? this.$store.dispatch("viewPDF", _row.mobile_pdf)
        : window.viewPDF(_row.mobile_pdf);
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
      const pdf = () => {
        this.$store.dispatch("readPDF", { _type: 1, _id: _row.id });
        // const is_old = !_row.is_new_pdf ? 1 : _row.is_new_pdf == 1 ? 0 : 1;
        this.$cell
          ? this.$store.dispatch("viewPDF", _row.mobile_pdf)
          : window.viewPDF(_row.mobile_pdf);
      };
      _row.is_attention == 1 ? this.goProDetails(_row.id, _row.symbol) : pdf();
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
    .with-space {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
    @media screen and (max-width: 1279px) {
      .give-remark {
        display: none;
      }
      img {
        width: $padd24;
        height: $padd24;
        margin-right: 0.5rem;
      }
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
        img {
          width: 24px;
          height: 24px;
          margin-right: 0;
          background: white;
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
    }
  }
  @media screen and (max-width: 1560px) {
    .public-give {
      width: 100%;
    }
  }
}
@media screen and (max-width: 1279px) {
  .give-box {
    .public-give {
      padding: 1rem;
    }
  }
}
</style>