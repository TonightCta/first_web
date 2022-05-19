//包年会员中心
<template>
  <div class="year-center">
    <!-- 一日游倒计时 -->
    <div
      class="try-count"
      v-if="
        app.account.meal_id == 1 &&
        app.account.one_day_try_status.status == 1 &&
        isHasCount
      "
    >
      <p class="try-title">
        <!-- 您正在体验年费首页，剩余时间： -->
        {{ $t("month_vip.try_day") }}&nbsp;
      </p>
      <div>
        <van-count-down millisecond :time="tryCountdown" @finish="tryOver">
          <template #default="timeData">
            <div class="count-down-box">
              <span class="with-bold">{{
                timeData.hours >= 10 ? timeData.hours : "0" + timeData.hours
              }}</span>
              <span>:</span>
              <span class="with-bold">{{
                timeData.minutes >= 10
                  ? timeData.minutes
                  : "0" + timeData.minutes
              }}</span>
              <span>:</span>
              <span class="with-bold">{{
                timeData.seconds >= 10
                  ? timeData.seconds
                  : "0" + timeData.seconds
              }}</span>
            </div>
          </template>
        </van-count-down>
      </div>
      <p class="oper-btn">
        <base-button type="info" default @click="reNew" round>
          <!-- 立即订阅 -->
          {{ $t("public.sub_now") }}
        </base-button>
      </p>
    </div>
    <!-- 标题信息 -->
    <div class="title-box">
      <div class="title-left">
        <p class="h4">
          <span class="iconfont icon-xinxi_info"></span>
          <font>
            <!-- {{
              (app.account.meal_id == 3 && $t("public.year_vip")) ||
              (app.account.meal_id == 4 && $t("public.share_vip")) ||
              (app.account.meal_id == 1 && $t("public.try_vip_1"))
            }} -->
            {{ app.language == "en" ? " Expire on:" : "服务期限至" }}
            <span class="high">
              {{ app.account.end_time.substr(0, 10) }}
            </span>
          </font>
        </p>
        <p>
          <base-button type="info" round @click="reNew">
            <!-- 立即续费 -->
            {{ $t("public.renew") }}
          </base-button>
        </p>
      </div>
      <div class="title-right">
        <p
          class="h4"
          @click="
            !app.account.code ? ($refs.createCode.creatInvite = true) : null
          "
        >
          <span class="iconfont icon-quan_ticket"></span>
          <!-- 我的推荐码： -->
          {{ $t("public.my_code") }}
          <span class="high">
            {{ app.account.code ? app.account.code : $t("public.un_set") }}
          </span>
        </p>
        <div class="title-btn-box">
          <div class="btn-box-pc">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('bureau_mine.copy_link')"
            >
              <!-- 复制邀请链接 -->
              <p
                slot="reference"
                class="copy copy-icon"
                v-if="app.account.code"
                @click="copyCodeUrl"
                :data-clipboard-text="baseUrl + '?code=' + app.account.code"
              >
                <i class="iconfont icon-fuzhi_copy"></i>
              </p>
            </el-popover>
            <base-button
              type="info"
              round
              v-if="!app.account.code"
              @click="$refs.createCode.creatInvite = true"
            >
              <!-- 生成推荐码 -->
              {{
                this.$flag
                  ? $t("public.create_code_mobile")
                  : $t("public.create_code")
              }}
            </base-button>
            <InviteBtn style="margin-left: 16px" v-else />
          </div>
          <div class="btn-box-mobile">
            <base-button
              type="info"
              round
              v-if="!app.account.code"
              @click="$refs.createCode.creatInvite = true"
            >
              <!-- 生成推荐码 -->
              {{
                this.$flag
                  ? $t("public.create_code_mobile")
                  : $t("public.create_code")
              }}
            </base-button>
            <p
              class="copy"
              @click="copyCodeUrl"
              v-if="app.account.code"
              :data-clipboard-text="baseUrl + '?code=' + app.account.code"
            >
              <span class="iconfont icon-fuzhi_copy"></span>
            </p>
            <p v-if="app.account.code">
              <MobileInviteBtn :icon="true" />
            </p>
          </div>
          <!-- 下载海报 -->
          <DownPoster />
        </div>
      </div>
    </div>
    <!-- 谷歌搜索趋势图指数 -->
    <GooleEcharts @resizeEcharts="getResize" />
    <!-- 暴富指数 -->
    <div class="row rich-box">
      <div
        class="col-sm-6 col-lg-3"
        v-for="(rich, indexRich) in richList"
        :key="indexRich"
      >
        <div class="rich-con" :class="[rich.iconBg, rich.otherClass]">
          <div class="rich-top">
            <p class="h4">
              <!-- :style="{ 'padding-right': rich.isOther ? '60px' : 0 }" -->
              {{ rich.title }}
              <span
                class="iconfont icon-bangzhu_help"
                @click="
                  $refs.remarkBox.remarkBox = true;
                  remarkMsg = rich;
                "
              ></span>
              <span v-if="false" class="up-gmi" @click="openUp">
                <!-- 订阅高级版 -->
                {{ $t("year_vip.gmi_up") }}
              </span>
            </p>
            <p class="rich-data">
              <span v-if="!rich.number">
                <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
              </span>
              <span v-else>
                {{ rich.isPer ? rich.number + "%" : rich.number }}
                <!-- 牛 / 熊市 -->
                <span class="gim-other" v-if="rich.isOther">{{
                  parseInt(rich.number * 10) >= 4
                    ? $t("year_vip.bull_mar")
                    : $t("year_vip.bear_mar")
                }}</span>
              </span>
            </p>
            <div class="rich-icon-box" v-if="!rich.dash">
              <span class="iconfont" :class="rich.icon"></span>
            </div>
            <div class="dash-box" v-if="rich.dash">
              <div class="dash-echarts" id="dash-echarts"></div>
              <p class="h5">
                <!-- 当前 -->
                {{ $t("year_vip.current") }}
              </p>
              <p class="h4">
                <span v-if="rich.number <= 25">
                  <!-- 极度恐惧 -->
                  {{ $t("year_vip.ex_fear") }}
                </span>
                <span v-if="rich.number > 25 && rich.number < 50">
                  <!-- 恐惧 -->
                  {{ $t("year_vip.fear") }}
                </span>
                <span v-if="rich.number == 50">
                  <!-- 中性 -->
                  {{ $t("year_vip.half") }}
                </span>
                <span v-if="rich.number > 50 && rich.number <= 75">
                  <!-- 贪婪 -->
                  {{ $t("year_vip.greedy") }}
                </span>
                <span v-if="rich.number > 75 && rich.number <= 100">
                  <!-- 极度贪婪 -->
                  {{ $t("year_vip.ex_greedy") }}
                </span>
              </p>
            </div>
          </div>
          <div class="rich-bottom">
            <p class="h5">
              <!-- 下一次更新时间 -->
              {{ $t("year_vip.next_up") }}
            </p>
            <p>
              <span v-if="!rich.next_time">
                <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
              </span>
              <span v-else> {{ rich.next_time }} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 合约信息 -->
    <ContactEcharts @resizeEcharts="getResize" />
    <!-- 最新发布研报 -->
    <p class="h4 new-project-title">
      <!-- 最新发布研报 -->
      {{ $t("year_vip.release_title") }}
    </p>
    <p class="h5 new-project-remark">
      <!-- 您可以查阅以下所有订阅期内发布的研报 -->
      {{ $t("year_vip.release_remark") }}
    </p>
    <!-- 最新研报 -->
    <div class="row new-pro">
      <div
        class="col-sm-6 col-lg-3"
        v-for="(last, indexL) in lastProjectList"
        :key="indexL"
        @click.stop="
          detailsPDF($flag ? last.mobile_pdf : last.pdf, last.id, last.type)
        "
      >
        <div
          class="new-con"
          :class="[
            last.type == 1 && 'default-bg',
            last.type == 2 && 'events-bg',
            last.type == 3 && 'coin-bg',
            last.type == 4 && 'race-bg',
          ]"
        >
          <div class="new-top">
            <div
              class="other-class"
              v-if="last.type == 4 && last.gem.length > 0"
            >
              <div style="display: flex">
                <div class="icon-box">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="last.gem[0].title"
                    placement="top"
                  >
                    <div>
                      <div class="mask-box"></div>
                      <img :src="last.gem[0].logo" alt="" />
                      <div class="gem-box"></div>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <img :src="last.logo" alt="" v-else />
            <div class="title-msg">
              <p class="h4 text-overflow">{{ last.title }}</p>
              <p>
                <span
                  class="title-start"
                  v-if="last.is_attention == 1 && last.type == 1"
                >
                  <!-- 关注 -->
                  {{ $t("public.follow") }}
                </span>
                <span class="title-number" v-if="last.type == 1">
                  {{
                    app.language == "en"
                      ? `No.${last.periods}`
                      : `第${last.periods}期`
                  }}
                </span>
                <span
                  class="title-race"
                  v-for="(lastRace, indexLR) in last.race"
                  :key="indexLR"
                  @click.stop="goSearch(lastRace)"
                >
                  {{ lastRace }}
                </span>
              </p>
            </div>
          </div>
          <p class="tag-list">
            <span
              v-for="(tag, indexTag) in last.tag"
              @click.stop="goSearch(tag)"
              :key="indexTag"
            >
              {{ tag }}
            </span>
          </p>
          <div class="new-bottom">
            <p>
              <span class="iconfont icon-rili_calendar"></span>
              {{ last.publish_time }}
            </p>
            <p v-if="last.type == 1">
              <!-- 下一期时间： -->
              {{ $t("year_vip.release_next") }}&nbsp;
              <span> {{ last.next_publish_time }} </span>
            </p>
          </div>
          <!-- 类型角标 -->
          <span
            class="start-icon"
            :class="[
              last.type == 1 && 'default-color',
              last.type == 2 && 'events-color',
              last.type == 3 && 'coin-color',
              last.type == 4 && 'race-color',
            ]"
          >
            {{
              (last.type == 1 && $t("year_vip.project_an")) ||
              (last.type == 2 && $t("year_vip.important_ev")) ||
              (last.type == 3 && $t("year_vip.project_del")) ||
              (last.type == 4 && $t("year_vip.sector_an"))
            }}
          </span>
        </div>
      </div>
    </div>
    <!-- 头等仓推荐 -->
    <p class="h4 new-project-title">
      <!-- 推荐阅读 -->
      {{ $t("year_vip.recommend_title") }}
    </p>
    <p class="h5 new-project-remark">
      <!-- 以下推荐完全基于项目基本面判断，头等仓从未跟以下项目方收取任何形式的费用。 -->
      {{ $t("year_vip.recommend_remark") }}
    </p>
    <div class="new-project-box">
      <el-table
        :data="tableData"
        :empty-text="$t('no_data.no_recommend')"
        v-if="!$flag"
        @row-click="rowView"
      >
        <!-- 暂无推荐 -->
        <el-table-column min-width="150" :label="$t('month_vip.table_pro')">
          <!-- 项目名称 -->
          <template slot-scope="{ row }">
            <div style="display: flex; color: white; font-weight: bold">
              {{ row.title }}
              <p v-if="row.type != 4">
                <span v-if="row.is_attention == 1" class="project-start">
                  <!-- 关注 -->
                  {{ $t("public.follow") }}
                </span>
                <span v-else class="project-unstart">
                  <!-- 不关注 -->
                  {{ $t("public.un_follow") }}
                </span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="150" :label="$t('month_vip.table_type')">
          <!-- 所属研报 -->
          <template slot-scope="{ row }">
            <span v-if="row.type == 1">
              <!-- 项目解析 -->
              {{ $t("routes.project_an") }}
            </span>
            <span v-if="row.type == 2">
              <!-- 重大事件 -->
              {{ $t("routes.important_ev") }}
            </span>
            <span v-if="row.type == 3">
              <!-- 新币速递 -->
              {{ $t("routes.project_del") }}
            </span>
            <span v-if="row.type == 4">
              <!-- 赛道解析 -->
              {{ $t("routes.sector_an") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="150" :label="$t('month_vip.table_race')">
          <!-- 赛道 -->
          <template slot-scope="{ row }">
            <span v-if="true"> {{ row.race.join(",") }} </span>
            <span v-else> - </span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="publish_time"
          :label="$t('month_vip.table_date')"
        >
          <!-- 发布时间 -->
        </el-table-column>
        <el-table-column
          min-width="100"
          header-align="right"
          :label="$t('month_vip.table_oper')"
        >
          <!-- 操作 -->
          <div slot-scope="{ row }" class="text-right">
            <span
              class="iconfont icon-shujubiao_data-sheet"
              style="color: #33b1ff"
              v-if="row.type == 1 && row.is_attention == 1"
              @click.stop="goProDetails(row.id, row.symbol)"
            ></span>
            <span
              class="iconfont icon-PDF"
              style="color: #a7f0ba"
              @click.stop="
                detailsPDF($flag ? row.mobile_pdf : row.pdf, row.id, row.type)
              "
            ></span>
          </div>
        </el-table-column>
      </el-table>
      <!-- 移动端 -->
      <el-table
        :data="tableData"
        :empty-text="$t('no_data.no_recommend')"
        v-else
        @row-click="goProDetailsMobile"
      >
        <!-- 暂无推荐 -->
        <el-table-column min-width="100" :label="$t('month_vip.table_pro')">
          <!-- 项目名称 -->
          <template slot-scope="{ row }">
            <p style="color: white; font-weight: bold" class="text-overflow">
              {{ row.title }}
            </p>
          </template>
        </el-table-column>
        <el-table-column min-width="95">
          <template slot="header">
            <span class="label-type">
              <!-- 所属研报 -->
              {{ $t("month_vip.table_type") }}
            </span>
          </template>
          <template slot-scope="{ row }">
            <span v-if="row.type == 1" class="label-type">
              <!-- 项目解析 -->
              {{ $t("routes.project_an") }}
            </span>
            <span v-if="row.type == 2" class="label-type">
              <!-- 重大事件 -->
              {{ $t("routes.important_ev") }}
            </span>
            <span v-if="row.type == 3" class="label-type">
              <!-- 新币速递 -->
              {{ $t("routes.project_del") }}
            </span>
            <span v-if="row.type == 4" class="label-type">
              <!-- 赛道解析 -->
              {{ $t("routes.sector_an") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="50">
          <template slot="header">
            <span class="label-type">
              <!-- 赛道 -->
              {{ $t("month_vip.table_race") }}
            </span>
          </template>
          <template slot-scope="{ row }">
            <p v-if="true" class="text-overflow label-type">
              {{ row.race.join(",") }}
            </p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column
          min-width="40"
          header-align="right"
          :label="$t('public.follow')"
        >
          <!-- 关注 -->
          <template slot-scope="{ row }">
            <p v-if="row.type != 4" class="text-right">
              <span v-if="row.is_attention == 1">
                <!-- 是 -->
                {{ $t("public.yes") }}
              </span>
              <span v-else class="text-right">
                <!-- 否 -->
                {{ $t("public.no") }}
              </span>
            </p>
            <p v-else style="text-align: right">-</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 未读列表 -->
    <div class="my-service" style="margin-bottom: 0">
      <div>
        <p class="h4 new-project-title">
          <!-- 未读研报 -->
          {{ $t("year_vip.unread_title") }}
        </p>
        <p class="h5 new-project-remark">
          <!-- 确保您不错过每一份精彩研报 -->
          {{ $t("year_vip.unread_remark") }}
        </p>
      </div>
      <div>
        <p
          @click="readAll()"
          :style="{ 'margin-right': '1rem' }"
          v-if="app.account.unread_count > 0"
        >
          {{ $flag ? $t("year_vip.ignore") : $t("year_vip.ignore_all") }}
        </p>
        <p
          @click="$router.push($flag ? '/mobile-unread' : '/userCenter/unRead')"
        >
          <!-- 查看全部 -->
          {{ $t("year_vip.view_all") }}
        </p>
      </div>
    </div>
    <!-- 未读信息 -->
    <Give ref="give" />
    <!-- 我的咨询 -->
    <div class="my-service">
      <div>
        <p class="h4 new-project-title">
          <!-- 我的咨询 -->
          {{ $t("work_order.mine_work") }}
        </p>
        <p class="h5 new-project-remark">
          {{
            app.language == "en"
              ? `${serviceCount.total} Submitted, ${serviceCount.end} Completed, ${serviceCount.pending} Ongoing`
              : `已提交${serviceCount.total}条咨询，已结单${serviceCount.end}条，未结单${serviceCount.pending}条`
          }}
        </p>
      </div>
      <div>
        <p @click="$router.push('/proNews')" v-if="!$flag">
          <!-- 查看全部 -->
          {{ $t("year_vip.view_all") }}
        </p>
        <p
          @click="
            $router.push($flag ? '/mobile-submit-pro' : '/proNews/submitPro')
          "
        >
          <!-- 我要咨询 -->
          {{ $t("year_vip.need_sub") }}
        </p>
      </div>
    </div>
    <MyService :showmore="true" />
    <!-- 比特币趋势指数 -->
    <CBBIEcharts @resizeEcharts="getResize" />
    <!-- 指数说明 -->
    <RemarkBox ref="remarkBox" :remarkMsg="remarkMsg"></RemarkBox>
    <!-- 设置邀请码奖励 -->
    <RewardChoice
      ref="rewardchoice"
      :need="baseUrl + '?code=' + app.account.code"
    />
    <!-- 创建邀请码 -->
    <Invite ref="createCode" />
  </div>
</template>

<script>
import * as api from "@/request/api";
import { mapState } from "vuex";
import * as echarts from "echarts";
import Clipboard from "clipboard";
export default {
  name: "OtherCenter",
  data() {
    return {
      nextDate: "", //下期研报发布时间
      tableData: [],
      //我的咨询条数
      serviceCount: {
        end: 0,
        pending: 0,
        total: 0,
      },
      dashBox: null, //贪婪指数
      lastProjectList: [], //最新发布的研报
      resizeList: [],
      remarkMsg: {
        title: "",
        tooltip: [],
      },
      //各项指数
      // richList:
      // 一日游倒计时
      tryCountdown: 24 * 60 * 60 * 1000,
      isHasCount: false, //倒计时回执
      richList: [
        {
          //头等仓暴富指数
          title: this.$t("year_vip.wealth_name"),
          icon: "icon-gushi_stock-market1",
          iconBg: "icon-purple",
          isPer: false,
          next_time: "",
          number: "",
          tooltip: [
            this.$t("year_vip.wealth_remark_1"),
            "",
            this.$t("year_vip.wealth_remark_2"),
            "",
            this.$t("year_vip.wealth_remark_3"),
          ],
        },
        {
          //Morecoin牛熊指数
          title: this.$t("year_vip.gmi_name"),
          icon: "icon-zhexiantu_chart-line",
          iconBg: "icon-green",
          isPer: false,
          isOther: true,
          next_time: "",
          number: "",
          otherClass: "",
          tooltip: [
            this.$t("year_vip.gmi_remark_1"),
            "",
            this.$t("year_vip.gmi_remark_2"),
            "",
            this.$t("year_vip.gmi_remark_3"),
            "",
            this.$t("year_vip.gmi_remark_4"),
            "",
            this.$t("year_vip.gmi_remark_5"),
          ],
        },
        {
          //BTC市值占率
          title: this.$t("year_vip.btc_name"),
          icon: "icon-bitebi_bitcoin",
          iconBg: "icon-red",
          isPer: true,
          next_time: "",
          number: "",
          tooltip: [
            this.$t("year_vip.btc_remark_1"),
            "",
            this.$t("year_vip.btc_remark_2"),
          ],
        },
        {
          //恐慌与贪婪指数
          title: this.$t("year_vip.fear_name"),
          icon: "icon-diqiuyi_earth",
          iconBg: "icon-blue",
          isPer: false,
          next_time: "",
          number: "",
          dash: true,
          tooltip: [
            this.$t("year_vip.fear_remark_1"),
            "",
            this.$t("year_vip.fear_remark_2"),
            "",
            this.$t("year_vip.fear_remark_3"),
            this.$t("year_vip.fear_remark_4"),
            this.$t("year_vip.fear_remark_5"),
            this.$t("year_vip.fear_remark_6"),
            this.$t("year_vip.fear_remark_7"),
            this.$t("year_vip.fear_remark_8"),
          ],
        },
      ],
    };
  },
  components: {
    Give: (resolve) => require(["./yearCenter/give_year"], resolve),
    MyService: (resolve) => require(["../coms/my_service"], resolve),
    InviteBtn: (resolve) => require(["../coms/invite_button"], resolve),
    GooleEcharts: (resolve) => require(["./echartsFile/goole_echarts"], resolve),
    ContactEcharts: (resolve) =>
      require(["./echartsFile/contact_echarts"], resolve),
    CBBIEcharts: (resolve) => require(["./echartsFile/cbbi_echarts"], resolve),
    RemarkBox: (resolve) => require(["@/views/coms/remark_box"], resolve),
    MobileInviteBtn: (resolve) =>
      require(["../coms/mobile_invite_button"], resolve),
    RewardChoice: (resolve) => require(["@/comsmine/reward_choice"], resolve),
    DownPoster: (resolve) => require(["@/comsmine/down_poster"], resolve),
    Invite: (resolve) => require(["../setting/invite"], resolve),
  },
  computed: {
    ...mapState(["app"]),
    baseUrl() {
      return process.env.VUE_APP_RESET + "/#/index";
    },
    language() {
      return this.app.language;
    },
  },
  created() {
    this.getNewPro();
    this.getMyServiceMsg();
    this.getLast();
    this.app.account.meal_id == 1 &&
      this.app.account.one_day_try_status.status == 1 &&
      this.getTryStatus();
  },
  methods: {
    rowView(_row) {
      this.detailsPDF(
        this.$flag ? _row.mobile_pdf : _row.pdf,
        _row.id,
        _row.type
      );
    },
    //最新的产品信息
    async getLast() {
      const result = await api.lastProject();
      this.lastProjectList = result;
    },
    //推荐的研报
    async getNewPro() {
      const result = await api.recommend({ limit: 5 });
      this.tableData = result;
    },
    //查看PDF
    detailsPDF(_url, _id, _type) {
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      !this.$flag
        ? this.$store.dispatch("viewPDF", _url)
        : this.$cell
        ? this.$store.dispatch("viewPDF", _url)
        : window.viewPDF(_url);
    },
    //我的咨询信息
    async getMyServiceMsg() {
      const result = await api.myService();
      this.serviceCount = result.count;
    },
    // 已读全部
    async readAll() {
      await api.readAllRecomand();
      this.$refs.give.getAllData();
    },
    //暴富指数
    async getRich() {
      const result = await api.richMsg();
      this.richList[0].number = result.rich.number;
      this.richList[0].next_time = result.rich.next_time;
      this.richList[1].number = result.gmi.number;
      this.richList[1].next_time = result.gmi.next_time;
      result.gmi.number * 10 >= 4
        ? this.$set(this.richList[1], "otherClass", "niu-color")
        : this.$set(this.richList[1], "otherClass", "xiong-color");
      this.richList[2].number = result.btc_cap.number;
      this.richList[2].next_time = result.btc_cap.next_time;
      this.richList[3].number = result.fear_greed.number;
      this.richList[3].next_time = result.fear_greed.next_time;
      this.initDash(result.fear_greed.number);
    },
    //贪婪指数
    initDash(_val) {
      const option = {
        height: 200,
        series: [
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            pointer: false,
            radius: "180%",
            center: ["50%", "90%"],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#FF8389" },
                { offset: 0.5, color: _val >= 50 ? "#FFD45C" : "#FF8389" },
                { offset: 1, color: _val >= 50 ? "#A7F0BA" : "#FF8389" },
              ]),
              shadowColor: "#3072f0",
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            progress: {
              show: true,
              roundCap: true,
              width: 10,
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 10,
                color: [[1, "white"]],
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: _val,
              },
            ],
          },
        ],
      };
      this.dashBox = echarts.init(document.getElementById("dash-echarts"));
      this.dashBox.setOption(option);
    },
    getResize(_canvas) {
      _canvas.forEach((e) => {
        this.resizeList.push(e);
      });
    },
    //重绘图表
    resizeEcharts() {
      this.resizeList.forEach((e) => {
        e.resize();
      });
    },
    //清空图表数据
    clearEcharts() {
      this.resizeList.forEach((e) => {
        e.clear();
      });
    },
    //续费会员
    async reNew() {
      this.$store.dispatch("setPoint", 2);
      const result = await api.priceList();
      const priceInfo = await api.mealInfo({ id: result[2].id });
      const orderMsg = {
        id: result[2].id,
        price1: priceInfo.price1,
        price: priceInfo.price,
        name: result[2].name,
      };
      // console.log(priceInfo);
      // return;
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$router.push(this.$flag ? "/mobile-place-order" : "/placeOrder");
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
      this.detailsPDF(
        this.$flag ? _row.mobile_pdf : _row.pdf,
        _row.id,
        _row.type
      );
    },
    //标签跳转搜索
    goSearch(_val) {
      window.goSearch(_val);
    },
    //订阅高级版
    openUp() {
      window.open("https://morecoin.app/");
    },
    //复制邀请链接
    copyCodeUrl() {
      this.$store.dispatch("setPoint", 5);
      if (
        this.app.account.reward_tip == 1 &&
        this.app.account.meal_id != 0 &&
        this.app.account.is_information != 0
      ) {
        this.$refs.rewardchoice.choiceBox = true;
        return;
      }
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          // 邀请链接复制成功
          message: this.$t("notify.link_copy"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          // 复制失败
          message: this.$t("notify.copy_falied"),
        });
        clipboard.destroy();
      });
    },
    //获取一日游倒计时
    async getTryStatus() {
      const result = await api.tryStatus();
      // const nowTime = (new Date().getTime() / 1000).toFixed(0);
      this.tryCountdown = result.left_time * 1000;
      this.isHasCount = true;
    },
    //一日游体验结束
    tryOver() {
      // window.location.replace(process.env.VUE_APP_RESET + '/#/otherCenter')
      this.$router.push("/otherCenter");
      // window.location.reload();
    },
    //获取所有未读消息
    async getAllUnRead() {
      const result = await api.newMessage({ limit: 5 });
      this.$store.commit("upNotifyHeight", "high-height");
      if (result.count == 0) {
        return;
      }
      result.list.forEach(async (e) => {
        await api.readMessageNow({ id: e.id });
        if (e.type == 1 || e.type == 2) {
          this.$notify({
            icon: "iconfont icon-tixing_remind",
            message: e.content,
            timeout: 600000,
            verticalAlign: "bottom",
            horizontalAlign: "right",
          });
        }
        if (e.type == 3) {
          this.$notify({
            icon: "iconfont icon-xiaoyan_check-one",
            type: "success",
            message: e.content,
            timeout: 600000,
            verticalAlign: "bottom",
            horizontalAlign: "right",
          });
        }
        if (e.type == 4 || e.type == 5) {
          this.$notify({
            icon: "iconfont icon-tixing_remind",
            type: "dangger",
            message: e.content,
            timeout: 600000,
            verticalAlign: "bottom",
            horizontalAlign: "right",
          });
        }
      });
      this.$store.commit("UpIsNeglect", 1);
      setTimeout(() => {
        this.$store.commit("upNotifyHeight", "");
      }, 3000);
    },
  },
  mounted() {
    this.getRich();
    this.getAllUnRead();
    window.addEventListener("resize", this.resizeEcharts, true);
  },
  beforeDestroy() {
    this.clearEcharts();
  },
  destroyed() {
    this.resizeList = [];
    window.removeEventListener("resize", this.resizeEcharts, true);
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1600px) {
  .col-lg-3 {
    max-width: 50%;
    flex: 0 0 50%;
  }
}
@media screen and (max-width: 768px) {
  .col-lg-3 {
    max-width: 100%;
    flex: 0 0 100%;
  }
}
.year-center {
  /deep/ .el-dropdown {
    margin-left: 0 !important;
  }
  /deep/ .el-radio-group {
    margin-top: 9px;
  }
  /deep/ .is-active {
    .el-radio-button__inner {
      background: linear-gradient(90deg, #25b89b 0%, #0096ad 100%);
      color: white;
    }
  }
  /deep/ .el-radio-button__inner {
    background: rgba(0, 0, 0, 0);
    color: $success;
    border-color: #0096ad;
    padding: 5px 15px;
  }
  .title-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .title-left {
      display: flex;
      justify-content: space-between;
      background: $contentBg;
      padding: 0 24px;
      border-radius: 4px;
      align-items: center;
      height: 64px;
      width: 50%;
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
        .high {
          margin-right: 12px;
          color: $success;
          margin-left: 4px;
        }
      }
    }
    .title-right {
      flex: 1;
      display: flex;
      height: 64px;
      justify-content: space-between;
      background: $contentBg;
      margin-left: 30px;
      border-radius: 4px;
      align-items: center;
      padding: 0 24px;
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
        .high {
          margin-right: 12px;
          color: $success;
          margin-left: 4px;
        }
      }
      .title-btn-box {
        display: flex;
        .btn-box-pc {
          display: flex;
          align-items: center;
          .copy-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: $info;
            cursor: pointer;
            .iconfont {
              font-size: 16px;
            }
          }
        }
        .btn-box-mobile {
          display: flex;
          align-items: center;
          p {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background: $info;
            display: flex;
            justify-content: center;
            margin-left: 1rem;
            align-items: center;
            .iconfont {
              font-size: $fon14;
              color: white;
            }
          }
        }
      }
    }
  }
  .try-count {
    width: 100%;
    margin: 0 0 16px 0;
    height: 93px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: url("../../assets/images/tryBg.png");
    background-size: 100% 100%;
    position: relative;
    .oper-btn {
      position: absolute;
      top: 24px;
      right: 24px;
    }
    .try-title {
      color: $textColor;
      font-size: 17px;
    }
    p {
      color: $success;
    }
    .count-down-box {
      min-width: 12.5rem;
      span {
        font-size: 2rem;
        color: $success;
      }
    }
  }
  @media screen and (min-width: 1579px) {
    .btn-box-mobile {
      display: none !important;
    }
  }
  @media screen and (max-width: 1578px) {
    .title-box {
      flex-direction: column;
      .title-left {
        width: 100%;
        padding: 0 1rem;
        .h4 {
          font-size: $fon12;
          width: 65%;
          .iconfont {
            font-size: 1rem;
          }
        }
      }
      .title-right {
        width: 100%;
        padding: 1rem 1rem;
        margin-left: 0;
        margin-top: 1rem;
        .title-btn-box {
          .btn-box-pc {
            display: none;
          }
        }
        .h4 {
          font-size: $fon12;
          width: 80%;
          .iconfont {
            font-size: 1rem;
          }
        }
      }
    }
  }
  .rich-box {
    margin-bottom: 40px;
    .rich-con {
      min-height: 174px;
      background: $contentBg;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      padding: 24px;
      padding-bottom: 0;
      .rich-top {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .h4 {
          color: white;
          margin-bottom: 0;
          position: relative;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          .iconfont {
            font-size: 15px;
            color: $textColor;
            cursor: pointer;
            margin-left: 8px;
          }
          .up-gmi {
            padding: 2px 8px;
            background: white;
            color: #00cc8f;
            position: absolute;
            right: -24px;
            top: -2px;
            font-size: 12px;
            cursor: pointer;
            border-radius: 20px 0px 0px 20px;
          }
        }
        .rich-data {
          font-size: 48px;
          line-height: 40px;
          margin-top: 16px;
          color: white;
          .gim-other {
            font-size: 14px;
            font-weight: bold;
            color: #00cc8f;
            padding: 0 8px;
            height: 24px;
            line-height: 26px;
            border-radius: 4px;
            background: white;
            display: inline-block;
            transform: translateY(-8px);
          }
        }
        .rich-icon-box {
          position: absolute;
          top: 24px;
          left: 24px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
          .iconfont {
            font-size: 26px;
          }
        }
        .dash-box {
          width: 140px;
          height: 75px;
          position: absolute;
          top: 30px;
          left: 30px;
          .dash-echarts {
            width: 100%;
            height: 100%;
          }
          .h5 {
            position: absolute;
            top: 24px;
            text-align: center;
            color: white;
            width: 100%;
          }
          .h4 {
            font-weight: bold;
            position: absolute;
            top: 50px;
            text-align: center;
            color: white;
            width: 100%;
          }
        }
      }
      .rich-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        border-radius: 0 0 4px 4px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        .h5 {
          margin: 0;
          color: white;
        }
        p:last-child {
          font-size: 13px;
          color: white;
        }
      }
    }
    @media screen and (max-width: 1600px) {
      .rich-con {
        padding: 1rem;
        margin-bottom: 1rem;
        .rich-top {
          .h4 {
            .up-gmi {
              right: -1rem;
            }
          }
        }
      }
    }
    .icon-green,
    .niu-color {
      background: linear-gradient(270deg, #00cc8f 0%, #29c7cc 100%);
      .iconfont {
        color: #00cc8f;
      }
    }
    .icon-purple {
      background: linear-gradient(90deg, #b866ff 0%, #9652ff 100%);
      .iconfont {
        color: #9652ff;
      }
    }
    .icon-blue {
      background: linear-gradient(270deg, #3072f0 0%, #339cff 100%);
    }
    .icon-red,
    .xiong-color {
      background: linear-gradient(270deg, #f55d5d 0%, #ff7b61 100%);
      .iconfont {
        color: #f55d5d;
      }
      .gim-other {
        color: $danger !important;
      }
    }
  }
  .new-pro {
    margin-bottom: 24px;
    .new-con {
      height: 200px;
      border-radius: 4px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      .start-icon {
        width: 120px;
        height: 60px;
        top: 15px;
        right: -35px;
        position: absolute;
        font-size: 12px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        display: inline-block;
        transform: rotate(45deg);
        color: white;
      }
      .default-color {
        background: linear-gradient(180deg, #25b89b 0%, #0096ad 100%);
      }
      .events-color {
        background: linear-gradient(180deg, #ff7b61 0%, #f55d5d 100%);
      }
      .coin-color {
        background: linear-gradient(45deg, #9652ff 0%, #b866ff 100%);
      }
      .race-color {
        background: linear-gradient(45deg, #3072f0 0%, #339cff 100%);
      }
      .new-top {
        display: flex;
        .other-class {
          .icon-box {
            position: relative;
            width: 48px;
            height: 48px;
            margin-right: 8px;

            img {
              width: 100%;
              height: 100%;
              background: white;
            }

            .mask-box {
              position: absolute;
              width: 100%;
              height: 100%;
              background: url("../../assets/images/gemBg.png");
              background-size: 100% 100%;
            }

            .gem-box {
              position: absolute;
              width: 32px;
              height: 14px;
              background: url("../../assets/images/gemText.png");
              background-size: 100% 100%;
              left: 50%;
              margin-left: -16px;
              bottom: -8px;
              border-radius: 2px;
            }
          }
        }
        img {
          width: 48px;
          height: 48px;
          border-radius: 4px;
        }
        .title-msg {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 24px;
          width: 100%;
          .h4 {
            margin: 0;
            color: white;
            margin-bottom: 6px;
            width: 75%;
          }
          .title-start {
            font-size: 12px;
            padding: 0 8px;
            margin-right: 8px;
            font-weight: bold;
            border-radius: 4px;
            color: $titleColor;
            background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
          }
          .title-number {
            font-size: 13px;
            padding: 0 8px;
            background: $info;
            color: white;
            border-radius: 4px;
            margin-right: 8px;
          }
          .title-race {
            font-size: 13px;
            color: $success;
            padding: 0 8px;
            background: rgba(167, 240, 186, 0.1);
            margin-right: 8px;
            border-radius: 4px;
          }
        }
      }
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        span {
          padding: 2px 8px;
          font-size: 12px;
          background: $info;
          border-radius: 12px;
          color: $textColor;
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
      .new-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: 13px;
          display: flex;
          color: $remarkColor;
          .iconfont {
            font-size: 14px;
            color: $remarkColor;
            margin-right: 4px;
          }
          span {
            color: white;
          }
        }
      }
    }
    .default-bg {
      background: url("../../assets/images/project_bg.png");
      background-size: 100% 100%;
    }
    .events-bg {
      background: url("../../assets/images/events_bg.png");
      background-size: 100% 100%;
    }
    .coin-bg {
      background: url("../../assets/images/coin_bg.png");
      background-size: 100% 100%;
    }
    .race-bg {
      background: url("../../assets/images/race_bg.png");
      background-size: 100% 100%;
    }
    @media screen and (max-width: 1600px) {
      .new-con {
        padding: 1rem;
        margin-bottom: 1rem;
      }
    }
  }
  .new-project-title {
    color: white;
    margin-bottom: 4px;
  }
  .new-project-remark {
    color: $remarkColor;
    margin-bottom: 16px;
  }
  .new-project-box {
    padding: 24px;
    background: $contentBg;
    border-radius: 4px;
    margin-bottom: 40px;
    .project-start {
      display: inline-block;
      width: 44px;
      background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
      color: $titleColor;
      font-weight: bold;
      font-size: 12px;
      text-align: center;
      border-radius: 4px;
      height: 20px;
      line-height: 20px;
      margin-left: 8px;
    }
    .project-unstart {
      display: inline-block;
      width: 44px;
      background: linear-gradient(90deg, #25345c 0%, #304270 100%);
      font-size: 12px;
      color: white;
      text-align: center;
      border-radius: 4px;
      height: 20px;
      line-height: 20px;
      margin-left: 8px;
    }
    .project-unstart-en {
      width: 88px;
    }
    .iconfont {
      font-size: 24px;
      margin-left: 8px;
      cursor: pointer;
    }
    .label-type {
      padding-left: 1rem;
    }
  }
  .my-service {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-bottom: 8px;
    .h4 {
      color: white;
    }
    div:last-child {
      display: flex;
      height: 50px;
      align-items: center;
      p {
        margin-right: 24px;
        font-size: 13px;
        color: white;
        cursor: pointer;
      }
      p:last-child {
        margin-right: 0;
      }
      @media screen and (max-width: 1279px) {
        justify-content: flex-end;
        p:first-child {
          margin: 0;
        }
      }
    }
  }
}
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
  .rich-con {
    padding-bottom: 0 !important;
  }
  .year-center {
    overflow: hidden;
    .try-count {
      height: 7.2rem;
      align-items: stretch;
      padding-top: 1.75rem;
      .try-title {
        font-size: $fon12;
        padding-top: 0.3rem;
      }
      .count-down-box {
        min-width: 5rem;
        span {
          font-size: $fon18;
        }
      }
      .oper-btn {
        top: 4rem;
        right: 50%;
        margin-right: -$size48;
      }
    }
    .new-project-box {
      padding: 1rem;
    }
    .new-project-title {
      font-size: 1rem;
    }
    .new-project-remark {
      font-size: $fon12;
    }
  }
}
</style>