// 我的日历
<template>
  <div class="">
    <!-- 我的日历 -->
    <modal :show.sync="calendarBox" modalClasses="read-original-box">
      <div class="my-canlendar">
        <div class="calendar-title">
          <p>
            <span class="iconfont icon-jihua_plan"></span>
            <!-- 我的日历 -->
            {{ $t("bureau_mine.calendar") }}
          </p>
          <p @click="calendarBox = false">
            <span class="iconfont icon-guanbi-xiao_close-small"></span>
          </p>
        </div>
        <el-table
          :data="calendarData"
          style="width: 100%"
          height="468"
          v-loading="loadCalendar"
          :empty-text="loadCalendar ? ' ' : $t('no_data.no_sub')"
        >
          <!-- 暂无订阅 -->
          <el-table-column
            prop="date"
            :label="$t('month_vip.table_name')"
            width="70"
          >
            <!-- 项目 -->
            <template slot-scope="{ row }">
              <img :src="row.logo" alt="" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.evs')">
            <!-- 事件 -->
            <template slot-scope="{ row }">
              <p class="text-overflow">{{ row.abstract_zh }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="happen_time"
            :label="$t('bureau_evs.start_time')"
            width="150"
          >
            <!-- 发生时间 -->
          </el-table-column>
          <el-table-column
            :label="$t('month_vip.table_oper')"
            width="80"
            header-align="right"
          >
            <!-- 操作 -->
            <template slot-scope="{ row }">
              <div class="text-right" @click="addCalendar(2, row.id)">
                <p class="delete-calendar">
                  <span class="iconfont icon-jian_minus"></span>
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="calendar-oper">
          <base-button
            tyoe="default"
            round
            @click="calendarBox = false"
            v-if="app.language != 'en'"
          >
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
          <div class="push-calendar">
            <div class="push-url">
              <p>
                <!-- 订阅地址 -->
                {{ $t("bureau_evs.sub_address") }}:
              </p>
              <p>
                <mt-spinner
                  :type="2"
                  color="#1b2447"
                  v-if="payUrl == null"
                ></mt-spinner>
                <span v-if="payUrl">{{ payUrl }}</span>
              </p>
              <p
                v-if="payUrl"
                :data-clipboard-text="payUrl"
                class="copy"
                @click="copyICS"
              >
                <!-- 复制 -->
                {{ $t("public.copy") }}
              </p>
              <p class="un-pay" v-if="!payUrl">
                <!-- 未添加自选项目 -->
                {{ $t("no_data.no_track") }}
              </p>
            </div>
            <base-button
              type="info"
              round
              class="other-info"
              @click="addCalendarEv"
            >
              <!-- 订阅日历 -->
              {{ $t("bureau_evs.sub_calendar") }}
            </base-button>
          </div>
        </div>
        <div class="calendar-remark">
          <p>
            <!-- 您可将日历订阅链接添加到您的日历客户端，可通过手机、PC、平板等所有日历客户端自动同步您的最新日历 -->
            {{ $t("bureau_evs.copy_remark") }}
          </p>
          <p>
            <!-- 苹果手机可直接点击按钮导入日历，安卓手机型号较为复杂，请自行根据手机品牌百度搜索添加日历的方法，PC电脑可使用Outlook或者其它日历客户端进行订阅。 -->
            {{ $t("bureau_evs.ios_remark") }}
          </p>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { myCalendar, subUrl, addCalendar } from "@/request/api";
import Clipboard from "clipboard";
import { mapState } from "vuex";
export default {
  data() {
    return {
      calendarBox: false, //我的日历
      calendarData: [],
      loadCalendar: false, //日历加载
      payUrl: null,
    };
  },
  components: {
    Modal,
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {
    calendarBox(val) {
      val && this.getMyCalendar();
      !val && this.$emit("upCalendar");
    },
  },
  methods: {
    //获取我的日历
    async getMyCalendar() {
      this.loadCalendar = true;
      const result = await myCalendar();
      const url = await subUrl();
      this.payUrl = url.url;
      this.calendarData = result;
      this.loadCalendar = false;
    },
    //订阅日历事件
    addCalendarEv() {
      window.open(this.payUrl);
    },
    //复制日历订阅微信号
    copyICS() {
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          //复制成功
          message: this.$t("notify.copy_success"),
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
    //移除日历
    async addCalendar(_type, _id) {
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
        //移除订阅成功
        message: this.$t("notify.move_sub"),
      });
      this.getMyCalendar();
    },
  },
};
</script>

<style lang="scss" scoped>
.my-canlendar {
  padding: 24px 24px 32px 24px;
  /deep/ .el-loading-spinner .path {
    stroke: $contentBg;
  }
  .calendar-title {
    font-size: 17px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 16px;
    .iconfont {
      font-size: 20px;
      font-weight: 400;
    }
    p:last-child{
      .iconfont{
        font-size: 30px;
        color: $iconColor;
        cursor: pointer;
      }
    }
  }
  /deep/ .el-table__header-wrapper {
    .cell {
      color: #676c7a;
    }
  }
  /deep/ .el-table__body-wrapper {
    td {
      border-color: $textColor;
    }
    .cell {
      color: $titleColor;
    }
  }
  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid $textColor;
  }
  .text-right {
    display: flex;
    justify-content: flex-end;
    p {
      width: 24px;
      height: 24px;
      background: $textColor;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      cursor: pointer;
      .iconfont {
        font-size: 20px;
        color: #676c7a;
      }
    }
  }
  .calendar-oper {
    width: 100%;
    .push-calendar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      .push-url {
        height: 100%;
        display: flex;
        padding: 0 24px;
        background: #efefef;
        align-items: center;
        border-radius: 20px;
        min-width: 506px;
        p {
          font-size: 13px;
          color: $remarkColor;
        }
        p:nth-child(2) {
          color: $titleColor;
          margin-left: 8px;
          display: flex;
        }
        p:last-child {
          margin-left: 40px;
          color: #0f62fe;
          cursor: pointer;
        }
      }
      button {
        margin-left: 24px;
      }
    }
  }
  .calendar-remark {
    margin-top: 22px;
    p {
      font-size: 12px;
      color: $remarkColor;
    }
  }
}
</style>