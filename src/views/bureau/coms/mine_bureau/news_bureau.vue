// 最新资讯
<template>
  <div class="news-bureau">
    <div class="news-title">
      <!-- 以下是根据您的自选，展示相应的内容 -->
      {{ $t("bureau_mine.add_remark") }}
    </div>
    <!-- 研究员观点 & 即将发生的事件 -->
    <div class="ang-and-events">
      <!-- 研究员观点 -->
      <div class="ang-box public-ae">
        <div class="news-inner-title">
          <p>
            <!-- 最新Medium文章 -->
            {{ $t("bureau_mine.last_medium") }}
            <span>{{ angTotal }}</span>
          </p>
          <p>
            <span @click="$router.push('/bureau-express')">
              <!-- 查看更多 -->
              {{ $t("bureau_mine.view_more") }}
            </span>
          </p>
        </div>
        <!-- 数据主体 -->
        <div class="data-box">
          <TableAng ref="tableang" />
        </div>
      </div>
      <!-- 即将发生的事件 -->
      <div class="events-box public-ae">
        <!-- 包年会员 - 事件 -->
        <div
          class="news-inner-title no-ev-way"
          v-if="app.account.is_information == 1"
        >
          <ul>
            <li
              :class="activeEv == 1 && 'active-evs'"
              @click="
                activeEv = 1;
                $refs.tableev.changeEvType(activeEv);
              "
            >
              <p>
                <!-- 全部事件 -->
                {{ $t("bureau_mine.last_evs") }}
                <span>{{ evTotalAll }}</span>
              </p>
            </li>
            <li
              :class="activeEv == 2 && 'active-evs'"
              @click="
                activeEv = 2;
                $refs.tableev.changeEvType(activeEv);
              "
            >
              <p>
                <!-- 近7天自选事件 -->
                {{ $t("bureau_mine.seven_evs") }}
                <span>{{ evTotal }}</span>
              </p>
            </li>
          </ul>
          <p v-if="!$flag">
            <span
              class="evs-calendar"
              @click="$refs.mycalendar.calendarBox = true"
            >
              <i class="iconfont icon-rili_calendar"></i>
              <!-- 我的日历 -->
              {{ $t("bureau_mine.calendar") }}
            </span>
            <span @click="$router.push('/bureau-events')">
              <!-- 查看更多 -->
              {{ $t("bureau_mine.view_more") }}
            </span>
          </p>
          <el-popover
            placement="bottom-end"
            width="120"
            v-model="moreOper"
            trigger="click"
            v-else
          >
            <ul class="mobile-more-oper">
              <li @click="$router.push('/my-calendar')">
                <!-- 我的日历 -->
                {{ $t("bureau_mine.calendar") }}
              </li>
              <li @click="$router.push('/bureau-events')">
                <!-- 查看更多 -->
                {{ $t("bureau_mine.view_more") }}
              </li>
            </ul>
            <span slot="reference" class="iconfont icon-gengduo_more"></span>
          </el-popover>
        </div>
        <!-- 非包年 - 事件 -->
        <div class="news-inner-title" v-else>
          <p>
            <!-- 最新交易所公告 -->
            {{ $t("bureau_mine.last_an") }}
            <span>{{ evNews }}</span>
          </p>
          <p>
            <span @click="$router.push('/bureau-express')">
              <!-- 查看更多 -->
              {{ $t("bureau_mine.view_more") }}
            </span>
          </p>
        </div>
        <!-- 数据主体 -->
        <div class="data-box">
          <TableEvent ref="tableev" />
        </div>
      </div>
    </div>
    <!-- 投票中的提案 -->
    <div class="news-inner-title">
      <p>
        <!-- 投票中的提案 -->
        {{ $t("bureau_mine.vote") }}
        <span>{{ posalTotal }}</span>
      </p>
      <p>
        <span @click="$router.push('/bureau-proposal')">
          <!-- 查看更多 -->
          {{ $t("bureau_mine.view_more") }}
        </span>
      </p>
    </div>
    <!-- 数据主体 -->
    <div class="data-box">
      <TablePosal ref="tableposal" />
    </div>
    <!-- 我的日历 -->
    <MyCalendar ref="mycalendar" />
  </div>
</template>

<script>
import { angMineBureau, evMineBureau, posalList } from "@/request/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      angTotal: 0,
      evTotalAll: 0, //全部事件数量
      evTotal: 0, //我的自选事件数量
      posalTotal: 0,
      activeEv: 1,
      moreOper: false, //更多操作
      evNews: 0, //链闻资讯条数
    };
  },
  components: {
    TableAng: (resolve) => require(["./table_ang"], resolve),
    TableEvent: (resolve) => require(["./table_events"], resolve),
    TablePosal: (resolve) => require(["./table_posal"], resolve),
    MyCalendar: (resolve) => require(["../my_calendar"], resolve),
  },
  created() {
    this.getTotal();
  },
  mounted() {
    this.$flag && window.addEventListener("scroll", this.closeTooltip, true);
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    async getTotal() {
      const ang = await angMineBureau();
      this.angTotal = ang.length;
      const ev = await evMineBureau({ type: 1 });
      this.evTotal = ev.count.my;
      this.evTotalAll = ev.count.total;
      this.evNews = ev.list.length;
      const posal = await posalList({ status: 1 });
      this.posalTotal = posal.total;
    },
    reload() {
      this.$refs.tableang.getData();
      this.$refs.tableev.getData();
      this.$refs.tableposal.getData();
    },
    closeTooltip() {
      this.moreOper = false;
    },
  },
  beforeDestroy() {
    this.$flag && window.removeEventListener("scroll", this.closeTooltip, true);
  },
};
</script>

<style lang="scss" scoped>
.mobile-more-oper {
  li {
    font-size: $fon14;
    color: $titleColor;
    width: 100%;
    text-align: center;
    padding: 0.6rem 0;
  }
  // li:last-child{
  //   margin-top: $fon20;
  // }
}
.news-bureau {
  .news-title {
    width: 100%;
    height: 60px;
    margin: 40px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(270deg, #111a3b 0%, #25345c 51%, #111a3b 100%);
    font-size: 17px;
    color: $success;
  }
  .news-inner-title {
    height: 40px;
    display: flex;
    margin-bottom: 16px;
    justify-content: space-between;
    align-items: center;
    p:first-child {
      font-size: 17px;
      color: white;
      span {
        padding: 2px 4px;
        background: rgba(255, 212, 92, 0.1);
        color: #ffd45c;
        font-weight: bold;
        font-size: 12px;
        border-radius: 4px;
        margin-left: 4px;
      }
    }
    p:last-child {
      span {
        color: $remarkColor;
        cursor: pointer;
      }
    }
    .evs-calendar {
      margin-right: 24px;
      cursor: pointer;
      .iconfont {
        font-size: 16px;
        display: inline-block;
        transform: translateY(1px);
        color: white;
      }
    }
    ul {
      display: flex;
      li {
        margin-right: 24px;
        cursor: pointer;
        p {
          color: #676c7a !important;
          transition: 0.3s all;
          span {
            display: inline-block;
            transition: 0.3s all;
            background: rgba(103, 108, 122, 0.1) !important;
            color: #676c7a !important;
          }
        }
      }
      .active-evs {
        p {
          color: white !important;
          span {
            background: rgba(255, 212, 92, 0.1) !important;
            color: #ffd45c !important;
          }
        }
      }
    }
  }
  .data-box {
    padding: 24px;
    background: $contentBg;
    border-radius: 4px;
    margin-bottom: 40px;
  }
  .ang-and-events {
    display: flex;
    justify-content: space-between;
    .public-ae {
      width: calc(50% - 15px);
    }
  }
}
@media screen and (max-width: 1279px) {
  .news-bureau {
    .news-title {
      font-size: 0.81rem;
      height: $padd40;
    }
    .ang-and-events {
      flex-direction: column;
      .public-ae {
        width: 100%;
      }
    }
    .no-ev-way {
      ul {
        li {
          font-size: 1rem;
        }
      }
      .iconfont {
        font-size: $padd24;
        color: white;
      }
    }
    .data-box {
      padding: 1rem;
    }
  }
}
</style>