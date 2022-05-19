// 试用、包月会员中心
<template>
  <div class="other-center">
    <!-- 标题信息 -->
    <div class="title-box">
      <div class="title-left">
        <p class="h4">
          <span class="iconfont icon-xinxi_info"></span>
          <font>
            <!-- {{
              (app.account.meal_id == 1 && $t("public.try_vip")) ||
              (app.account.meal_id == 2 && $t("public.mon_vip"))
            }} -->
            {{ app.language == "en" ? " Expire on:" : "服务期限至" }}
            <span class="high">
              {{ app.account.end_time.substr(0, 10) }}
            </span>
          </font>
        </p>
        <p>
          <base-button type="info" round @click="reNew(2)">
            <!-- 立即续费 -->
            {{ $t("public.renew") }}
          </base-button>
        </p>
      </div>
      <div class="title-right">
        <p class="h4">
          <span class="iconfont icon-quan_ticket"></span>
          <font
            @click="
              !app.account.code ? ($refs.createCode.creatInvite = true) : null
            "
          >
            <!-- 我的推荐码： -->
            {{ $t("public.my_code") }}
            <span class="high">
              {{ app.account.code ? app.account.code : $t("public.un_set") }}
            </span>
          </font>
        </p>
        <div class="title-btn-box">
          <div class="btn-box-pc">
            <p
              class="copy copy-icon"
              v-if="app.account.code"
              @click="copyCodeUrl"
              :data-clipboard-text="baseUrl + '?code=' + app.account.code"
            >
              <i class="iconfont icon-fuzhi_copy"></i>
            </p>
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
            <InviteBtn
              style="margin-left: 16px"
              :isUnvip="app.account.meal_id == 1 ? true : false"
              v-else
            />
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
              <MobileInviteBtn
                :icon="true"
                :isUnvip="app.account.meal_id == 1 ? true : false"
              />
            </p>
          </div>
          <!-- 下载海报 -->
          <DownPoster />
        </div>
      </div>
    </div>
    <!-- 下期研报发布时间 -->
    <div class="next-project">
      <div class="next-year public-next">
        <div class="bg-top"></div>
        <div class="bg-bottom"></div>
        <p>
          <span v-if="!nextDate">
            <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
          </span>
          <span v-else> {{ nextDate.substring(0, 4) }} </span>
        </p>
      </div>
      <div class="next-month public-next">
        <div class="bg-top"></div>
        <div class="bg-bottom"></div>
        <p>
          <span v-if="!nextDate">
            <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
          </span>
          <span v-else> {{ nextDate.substring(5, 7) }} </span>
        </p>
      </div>
      <div class="next-day public-next">
        <div class="bg-top"></div>
        <div class="bg-bottom"></div>
        <p>
          <span v-if="!nextDate">
            <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
          </span>
          <span v-else> {{ nextDate.substring(8, 10) }} </span>
        </p>
      </div>
    </div>
    <p class="h4 next-remark">
      <!-- 下一期项目研报预计发布日期 -->
      {{ $t("month_vip.next_date") }}
    </p>
    <p
      class="is-experience"
      v-if="
        app.account.meal_id == 1 && app.account.one_day_try_status.status != 2
      "
    >
      <base-button
        type="info"
        round
        @click="
          app.account.one_day_try_status.status == 0
            ? (openExperience = true)
            : $router.push('/userCenter')
        "
      >
        <!-- 体验年费首页 -->
        {{ $t("month_vip.try_year") }}
      </base-button>
    </p>
    <!-- 最新发布的研报 -->
    <p class="h3 new-project-title">
      <!-- 最新发布研报 -->
      {{ $t("month_vip.up_date") }}
    </p>
    <p class="h5 new-project-remark">
      <!-- 您可以查阅以下所有订阅期内发布的研报 -->
      {{ $t("month_vip.up_remark") }}
    </p>
    <div class="new-project-box">
      <el-table
        :data="tableData"
        :empty-text="$t('no_data.no_recommend')"
        v-if="!$flag"
      >
        <!-- 暂无推荐 -->
        <el-table-column min-width="150" :label="$t('month_vip.table_pro')">
          <!-- 项目名称 -->
          <template slot-scope="{ row }">
            <p style="color: white; font-weight: bold" class="text-overflow">
              {{ row.title }}
            </p>
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
              {{ $t("index.how_do.hot_remark_19") }}
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
          prop="publish_time_text"
          :label="$t('month_vip.table_date')"
        >
          <!-- 发布时间 -->
        </el-table-column>
        <el-table-column min-width="150" :label="$t('month_vip.table_follow')">
          <!-- 是否关注 -->
          <template slot-scope="{ row }">
            <span class="project-start" v-if="row.is_attention == 1">
              <!-- 关注 -->
              {{ $t("public.follow") }}
            </span>
            <span class="project-unstart" v-else>
              <!-- 不关注 -->
              {{ $t("public.un_follow") }}
            </span>
          </template>
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
              @click="goProDetails(row.id, row.symbol)"
            ></span>
            <span
              class="iconfont icon-PDF"
              style="color: #a7f0ba"
              @click="
                detailsPDF($flag ? row.mobile_pdf : row.pdf, row.type, row.id)
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
        <el-table-column min-width="80" :label="$t('month_vip.table_pro')">
          <template slot-scope="{ row }">
            <p style="color: white; font-weight: bold" class="text-overflow">
              {{ row.title }}
            </p>
          </template>
        </el-table-column>
        <el-table-column min-width="60" :label="$t('month_vip.table_type')">
          <template slot-scope="{ row }">
            <span v-if="row.type == 1">
              <!-- 项目解析 -->
              {{ $t("routes.project_an") }}
            </span>
            <span v-if="row.type == 2">
              <!-- 重大事件 -->
              {{ $t("index.how_do.hot_remark_19") }}
            </span>
            <span v-if="row.type == 3">
              <!-- 赛道解析 -->
              {{ $t("routes.sector_an") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="70" :label="$t('month_vip.table_race')">
          <template slot-scope="{ row }">
            <p v-if="true" class="text-overflow">{{ row.race.join(",") }}</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column min-width="50" :label="$t('month_vip.table_date')">
          <template slot-scope="{ row }">
            <p>{{ row.publish_time_text.substr(5, 10) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          min-width="40"
          header-align="right"
          :label="$t('public.follow')"
        >
          <template slot-scope="{ row }">
            <div class="text-right" style="padding-right: 0.2rem">
              <span v-if="row.is_attention == 1">
                <!-- 是 -->
                {{ $t("public.yes") }}
              </span>
              <span v-else>
                <!-- 否 -->
                {{ $t("public.no") }}
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 赠送列表 -->
    <p class="h3 new-project-title">
      {{
        app.language == "en"
          ? `Exclusive reports for ${
              app.account.meal_id == 1
                ? "trial subscribers"
                : "monthly subscribers"
            }`
          : `${
              (app.account.meal_id == 1 && "试用会员") ||
              (app.account.meal_id == 2 && "包月会员")
            }专享研报`
      }}
    </p>
    <p class="h5 new-project-remark">
      {{
        app.language == "en"
          ? `The following are additional complimentary reports for ${
              app.account.meal_id == 1
                ? "trial subscribers"
                : "monthly subscribers"
            }`
          : ` 以下为头等仓额外赠送给${
              (app.account.meal_id == 1 && "试用会员") ||
              (app.account.meal_id == 2 && "包月会员")
            }的研报`
      }}
    </p>
    <Give />
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
        <p @click="$router.push('/proNews')">
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
    <!-- 头等仓套餐服务 -->
    <!-- <p class="h4 new-project-title mobile-other">头等仓套餐服务</p>
    <p class="h5 new-project-remark mobile-other-remark">
      86%以上的包年订阅会员已通过研报赚回了年费
    </p> -->
    <!-- <Meal v-if="!$flag" />
    <MealMobileCenter v-else /> -->
    <!-- 开启体验版 -->
    <modal :show.sync="openExperience" modalClasses="login-box-modal">
      <div class="open-experience">
        <p class="icon-ex">
          <img :src="require('@/assets/images/tryYear.png')" alt="" />
        </p>
        <p>
          <!-- 体验年费首页 -->
          {{ $t("month_vip.exper_title") }}
        </p>
        <ul>
          <li>1. {{ $t("month_vip.exper_list_1") }}</li>
          <li>2. {{ $t("month_vip.exper_list_2") }}</li>
          <li>3. {{ $t("month_vip.exper_list_3") }}</li>
          <li>{{ $t("month_vip.exper_list_4") }}</li>
        </ul>
        <p>
          <base-button type="default" round @click="openExperience = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span class="label"></span>
          <base-button type="info" round @click="openExperienceEv">
            <!-- 开始体验 -->
            {{ $t("month_vip.expre_start") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- 设置邀请码奖励 -->
    <RewardChoice
      ref="rewardchoice"
      :need="baseUrl + '?code=' + app.account.code"
    />
    <!-- 创建邀请码 -->
    <Invite ref="createCode" />
    <!-- 选择套餐 -->
    <van-dialog v-model="chioceMeal" :showConfirmButton="false" width="320">
      <div class="pay-success">
        <p class="icon-box">
          <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
        </p>
        <p class="success-title">
          <!-- 续费情报局套餐 -->
          {{ $t("bureau_mine.renew") }}
        </p>
        <ul>
          <li @click="reNew(2)">
            <p class="iconfont icon-taocantubiao_baonian"></p>
            <p>
              <!-- 包年套餐 -->
              {{ $t("bureau_mine.renew_year") }}
            </p>
          </li>
          <li @click="reNew(1)">
            <p class="iconfont icon-taocantubiao_baoyue"></p>
            <p>
              <!-- 包月套餐 -->
              {{ $t("bureau_mine.meal_month_inner") }}
            </p>
          </li>
        </ul>
        <p class="success-btn">
          <base-button type="default" round @click="chioceMeal = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
        </p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import * as api from "@/request/api";
import { mapState } from "vuex";
import Clipboard from "clipboard";
import { Modal } from "@/components";
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
      openExperience: false, //开启体验版
      chioceMeal: false,
    };
  },
  components: {
    Give: (resolve) => require(["../coms/give_center"], resolve),
    MyService: (resolve) => require(["../coms/my_service"], resolve),
    Meal: (resolve) => require(["../coms/meal"], resolve),
    MealMobileCenter: (resolve) =>
      require(["../coms/meal_mobile_center"], resolve),
    InviteBtn: (resolve) => require(["../coms/invite_button"], resolve),
    MobileInviteBtn: (resolve) =>
      require(["../coms/mobile_invite_button"], resolve),
    Modal,
    RewardChoice: (resolve) => require(["@/comsmine/reward_choice"], resolve),
    DownPoster: (resolve) => require(["@/comsmine/down_poster"], resolve),
    Invite: (resolve) => require(["../setting/invite"], resolve),
  },
  computed: {
    ...mapState(["app"]),
    baseUrl() {
      return process.env.VUE_APP_RESET + "/#/index";
    },
  },
  created() {
    this.getNextDate();
    this.getNewPro();
    this.getMyServiceMsg();
  },
  mounted() {
    this.getAllUnRead();
  },
  methods: {
    async reNew(_type) {
      this.$store.dispatch("setPoint", 1);
      const result = await api.priceList();
      const priceInfo = await api.mealInfo({ id: result[_type].id });
      const orderMsg = {
        id: result[_type].id,
        price1: priceInfo.price1,
        price: priceInfo.price,
        name: result[_type].name,
      };
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.chioceMeal = false;
      this.$router.push(this.$flag ? "/mobile-place-order" : "/placeOrder");
    },
    //获取下次研报发布时间
    async getNextDate() {
      const result = await api.nextProject();
      this.nextDate = result.publish_time;
    },
    //续费
    goMeal() {
      let container = document.querySelector(".mine-view");
      container.scrollTo({
        top: this.$flag
          ? document.querySelector(".mobile-other").offsetTop
          : document.querySelector(".meal-center").offsetTop,
        behavior: "smooth",
      });
    },
    //最新发布的研报
    async getNewPro() {
      const result = await api.newProject({ limit: 5 });
      this.tableData = result;
    },
    //查看PDF
    detailsPDF(_url, _type, _id) {
      // const is_old = !is_new_pdf ? 1 : is_new_pdf == 1 ? 0 : 1;
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
      _row.type == 1
        ? this.goProDetails(_row.id, _row.symbol)
        : this.detailsPDF(
            this.$falg ? _row.mobile_pdf : _row.pdf,
            _row.type,
            _row.id
          );
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
          //邀请链接复制成功
          message: this.$t("notify.link_copy"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          //复制失败
          message: this.$t("notify.copy_falied"),
        });
        clipboard.destroy();
      });
    },
    //开启一日游
    async openExperienceEv() {
      await api.openTry();
      this.$notify({
        type: "success",
        //一日游开启成功
        message: this.$t("notify.open_try"),
      });
      this.$router.push("/userCenter");
      // window.location.reload();
      // window.location.replace(process.env.VUE_APP_RESET + '/#/userCenter')
    },
    //获取所有未读消息
    async getAllUnRead() {
      const result = await api.newMessage({ limit: 5 });
      this.$store.commit("upNotifyHeight", "high-height");
      result.list > 0 &&
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
};
</script>

<style lang="scss" scoped>
.other-center {
  .title-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .next-project {
    display: flex;
    justify-content: center;
    margin-top: 80px;
    margin-bottom: 16px;
    position: relative;

    .public-next {
      height: 124px;
      width: 120px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .mint-spinner-triple-bounce {
        margin-top: -40px;
      }
      p {
        position: relative;
        z-index: 10;
        font-size: 72px;
        color: $success;
      }
      .bg-top {
        position: absolute;
        width: 100%;
        height: 60px;
        background: $contentBg;
        top: 0;
        left: 0;
        border-radius: 4px;
      }
      .bg-bottom {
        position: absolute;
        width: 100%;
        height: 60px;
        background: $contentBg;
        bottom: 0;
        left: 0;
        border-radius: 4px;
      }
    }
    .next-year {
      width: 200px;
    }
    .next-month {
      margin: 0 24px;
    }
  }
  .next-remark {
    color: $remarkColor;
    text-align: center;
    margin-bottom: 40px;
  }
  .is-experience {
    margin: 24px 0 40px 0;
    text-align: center;
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
    }
    .iconfont {
      font-size: 24px;
      margin-left: 8px;
      cursor: pointer;
    }
  }
  .my-service {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-bottom: 8px;
    .h4 {
      font-weight: bold;
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
  .other-center {
    .next-project {
      margin: $padd80 0 1rem 0;
      .public-next {
        height: 4rem;
        width: 3.75rem;
        .bg-top {
          height: 1.9rem;
        }
        .bg-bottom {
          height: 1.9rem;
        }
        p {
          font-size: 2.25rem;
        }
      }
      .next-year {
        width: 6.25rem;
      }
    }
    .next-remark {
      font-size: $fon12;
      margin-bottom: $padd40;
    }
    .new-project-title {
      font-size: 1rem;
    }
    .new-project-remark {
      font-size: $fon12;
    }
    .new-project-box {
      padding: 1rem;
    }
    .my-service {
      div:last-child {
        p:first-child {
          display: none;
        }
      }
    }
    .mobile-other {
      text-align: center;
      color: $success;
      margin-top: $padd80;
    }
    .mobile-other-remark {
      text-align: center;
      margin-bottom: 2.6rem;
    }
  }
}
.open-experience {
  text-align: center;
  .icon-ex {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin: 0 auto;
    margin-top: 24px;
    margin-bottom: 16px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    font-size: 17px;
    font-weight: bold;
    color: $titleColor;
  }
  @media screen and (max-width: 1279px) {
    p {
      font-size: 1rem;
    }
    ul {
      margin: $padd24 0 !important;
      li {
        font-size: $fon12 !important;
      }
    }
    p:last-child {
      margin-bottom: $padd24;
    }
  }
  ul {
    margin: 24px;
    li {
      line-height: 24px;
      font-size: 13px;
      color: $titleColor;
      text-align: left;
    }
  }
  p:last-child {
    .label {
      display: inline-block;
      width: 16px;
    }
  }
}
.pay-success {
  text-align: center;
  padding: 48px;
  .success-title {
    font-size: 17px;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 40px;
  }
  ul {
    margin-bottom: 38px;
    display: flex;
    li {
      margin-bottom: 16px;
      width: 100px;
      height: 100px;
      display: flex;
      flex-direction: column;
      margin-right: 24px;
      border: 1px solid $textColor;
      border-radius: 4px;
      justify-content: center;
      cursor: pointer;
      transition: 0.3s all;
      .iconfont {
        font-size: 40px;
        color: $textColor;
        margin-bottom: 8px;
      }
      p {
        color: $remarkColor;
        font-size: 12px;
      }
    }
    li:hover {
      background: #f2faff;
      border-color: #33b1ff;
      .iconfont {
        color: #33b1ff;
      }
      p {
        color: #33b1ff;
      }
    }
    li:last-child {
      margin-right: 0;
    }
  }
  .success-remark {
    font-size: $fon12;
    color: $remarkColor;
    margin-bottom: $padd24;
  }
}
</style>