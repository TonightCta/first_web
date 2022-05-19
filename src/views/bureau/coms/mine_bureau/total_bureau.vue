// 情报局统计
<template>
  <div class="total-bureau">
    <div class="row">
      <div class="col-sm-6 col-lg-3" v-for="(i, x) in totalList" :key="x + 'a'">
        <div class="total-inner" :style="{ background: i.bg }">
          <p class="icon-box">
            <span class="iconfont" :class="i.icon"></span>
          </p>
          <!-- 项目数量信息 -->
          <div class="msg-box">
            <p>
              {{ i.title }}
              <!-- <span v-if="i.optional" :style="{ color: i.opt_color }"
                >自选</span
              > -->
              <span
                tag-type="icon"
                class="iconfont icon-xinxi_info"
                v-if="app.language == 'en' && i.has_en_icon"
              ></span>
            </p>
            <p>
              <mt-spinner
                :type="2"
                color="#a7f0ba"
                v-if="i.num == null"
              ></mt-spinner>
              <span v-else>{{ i.num }}</span>
              <span
                v-if="app.language == 'en' && i.has_with_num"
                class="has-with-num"
              >
                Last 7 Days
              </span>
            </p>
            <p>
              <span>
                {{ i.total_num_text }}
                <mt-spinner
                  :type="2"
                  color="#a7f0ba"
                  v-if="i.total_num == null"
                ></mt-spinner>
                <font v-else>
                  <!-- {{
                    (app.language == "en" && i.isunit)
                      ? `${i.total_num} Events During the Month`
                      : `${i.total_num} (${i.isunit && "条"})`
                  }} -->
                  <!-- {{ (i.isunit && app.language == 'en') ? '' : i.total_num}}&nbsp;{{ (i.isunit && app.language != 'en') ? "条" : '' }} -->
                  {{ i.total_num
                  }}{{ i.isunit && app.language != "en" ? "条" : "" }}
                  <i
                    class="new-point"
                    v-if="i.total_num_two != undefined && i.new_total != 0"
                    :class="app.language == 'en' && 'new-point-en'"
                  ></i>
                </font>
              </span>
              <span class="other-total" v-if="i.total_num_two != undefined">
                <!-- 开放项目 -->
                {{ $t("bureau_mine.open_pro") }}
                <mt-spinner
                  :type="2"
                  color="#a7f0ba"
                  v-if="i.total_num_two == null"
                ></mt-spinner>
                <font v-else>{{ i.total_num_two }}</font>
              </span>
            </p>
          </div>
          <!-- 统计说明 -->
          <div class="msg-remark">
            <p>
              <span class="iconfont icon-xinxi_info"></span>
              {{
                i.remark_num != undefined && i.remark_num != 0
                  ? app.language == "en"
                    ? `There are ${i.remark_num} events need your attention today!`
                    : `今日有${i.remark_num}条事件需要您关注！`
                  : i.remark
              }}
            </p>
            <p
              v-if="
                i.remark_num != undefined && app.account.is_information == 1
              "
              class="my-calendar"
              @click.stop="
                $store.dispatch('setPoint', 18);
                $flag
                  ? $router.push('/my-calendar')
                  : ($refs.mycalendar.calendarBox = true);
              "
            >
              <!-- 我的日历 -->
              {{ $t("bureau_mine.calendar") }}
            </p>
            <!-- 添加自选 -->
            <p
              class="my-calendar"
              style="color: #8a3ffc"
              v-if="i.title == $t('bureau_mine.own_add')"
              @click="
                $store.dispatch('setPoint', 17);
                $flag ? $router.push('/add-track') : $refs.addTrack.initTrack();
              "
            >
              <span class="iconfont icon-jia_plus"></span>
              <!-- 自选 -->
              {{ $t("bureau_mine.my_track") }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 我的日历 -->
    <MyCalendar ref="mycalendar" />
    <!-- 添加自选 -->
    <AddTrack ref="addTrack" @upLoadMine="upLoadMine" />
  </div>
</template>

<script>
import { totalMineBureau } from "@/request/api";
import { Modal } from "@/components";
import { mapState } from "vuex";
export default {
  data() {
    return {
      totalList: [
        {
          icon: " icon-dingyue_rss",
          //我的自选项目
          title: this.$t("bureau_mine.own_add"),
          num: 0,
          total_num: 0,
          //总项目数
          total_num_text: this.$t("place_order.all_total"),
          total_num_two: 0,
          new_total: 0,
          url: "",
          bg: "linear-gradient(90deg, #B866FF 0%, #9652FF 100%)",
          //开放项目可免费订阅
          remark: this.$t("bureau_mine.total_remark"),
          optional: false,
        },
        {
          icon: " icon-leida_radar",
          //自选近七天情报数
          title: this.$t("bureau_mine.my_remark"),
          num: 0,
          total_num: 0,
          //有效情报总数
          total_num_text: this.$t("bureau_mine.valid_total"),
          url: "/bureau-express",
          bg: "linear-gradient(90deg, #00CC8F 0%, #29C7CC 100%)",
          //近七天情报数只包含自选
          remark: this.$t("bureau_mine.valid_remark"),
          optional: true,
          opt_color: "#00CC8F",
          has_with_num: true,
          has_en_icon: true,
        },
        {
          icon: " icon-jihua_plan",
          //自选未来事件
          title: this.$t("bureau_mine.my_future"),
          num: 0,
          total_num: 0,
          total_num_text: this.$t("bureau_mine.month_evs"),
          url: "/bureau-events",
          bg: "linear-gradient(90deg, #F55D5D 0%, #FF7B61 100%)",
          remark_num: 0,
          //今日暂无事件发生
          remark: this.$t("bureau_mine.no_events"),
          optional: true,
          opt_color: "#F55D5D",
          isunit: true,
        },
        {
          icon: " icon-pinglun_comments",
          //自选活跃提案
          title: this.$t("bureau_mine.own_pro"),
          num: 0,
          total_num: 0,
          //全网提案数
          total_num_text: this.$t("bureau_mine.propposal"),
          url: "/bureau-proposal",
          bg: "linear-gradient(90deg, #3072F0 0%, #339CFF 100%)",
          //活跃提案只包含自选
          remark: this.$t("bureau_mine.proposal_remark"),
          optional: true,
          opt_color: "#3072F0",
          has_en_icon: true,
        },
      ],
    };
  },
  components: {
    Modal,
    MyCalendar: (resolve) => require(["../my_calendar"], resolve),
    AddTrack: (resolve) => require(["./add_track"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getTotal();
  },
  methods: {
    async getTotal() {
      const result = await totalMineBureau();
      this.$set(this.totalList[0], "num", result.follow_num);
      this.$set(this.totalList[0], "total_num", result.total_num);
      this.$set(this.totalList[0], "total_num_two", result.free_num);
      this.$set(this.totalList[0], "new_total", result.new_num);
      this.$set(this.totalList[1], "num", result.seven_day_num);
      this.$set(this.totalList[1], "total_num", result.effective_num);
      this.$set(this.totalList[2], "num", result.future_num);
      this.$set(this.totalList[2], "total_num", result.month_future_num);
      this.$set(this.totalList[2], "remark_num", result.today_future_num);
      this.$set(this.totalList[3], "num", result.active_proposal_num);
      this.$set(this.totalList[3], "total_num", result.all_proposal_num);
    },
    goSpecific(_url) {
      _url && this.$router.push(_url);
    },
    upLoadMine() {
      this.getTotal();
      this.$emit("reloadMine", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.total-bureau {
  margin-top: 40px;
  .total-inner {
    height: 175px;
    background: $contentBg;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    justify-content: space-between;
    position: relative;
    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      background: rgba(255, 255, 255, 0.2);
      top: 24px;
      right: 24px;
      .iconfont {
        font-size: 28px;
        color: white;
      }
    }
    .msg-box {
      padding: 24px;
      p:first-child {
        font-size: 13px;
        color: white;
        display: flex;
        align-items: center;
        span[tag-type="icon"] {
          color: $textColor;
          font-size: 14px;
          margin-left: 4px;
          display: inline;
        }
      }
      p:nth-child(2) {
        font-size: 40px;
        font-weight: bold;
        color: white;
        margin-top: 16px;
        .has-with-num {
          font-size: 13px;
          color: white;
          font-weight: 400;
        }
      }
      p:last-child {
        margin-top: 4px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        position: relative;
        font {
          color: white;
          margin-left: 4px;
        }
        .other-total {
          margin-left: 16px;
        }
        .new-point {
          display: inline-block;
          position: absolute;
          width: 4px;
          height: 4px;
          left: 52px;
          top: 0;
          background: red;
          border-radius: 50%;
        }
        .new-point-en {
          left: 55px;
        }
      }
    }
    .msg-remark {
      height: 40px;
      min-height: 40px;
      background: rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      padding-left: 24px;
      font-size: 13px;
      color: white;
      justify-content: space-between;
      .iconfont {
        font-size: 16px;
        margin-right: 8px;
        color: $textColor;
      }
      p:first-child {
        display: flex;
        align-items: center;
      }
      .my-calendar {
        white-space: nowrap;
        padding: 4px 8px;
        color: #f55d5d;
        background: white;
        border-radius: 4px 0px 0px 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 16px;
          margin-right: 2px;
          color: rgb(138, 63, 252);
        }
      }
    }
  }
}
@media screen and (max-width: 1279px) {
  .total-inner {
    height: 155px !important;
  }
  .msg-box {
    padding: 1rem !important;
  }
  .col-sm-6 {
    margin-bottom: 1rem;
  }
}
</style>