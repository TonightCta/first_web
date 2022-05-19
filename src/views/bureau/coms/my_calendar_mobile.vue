// 我的日历
<template>
  <div class="my-calendar">
    <MobileNav>
      <p>
        <!-- 我的日历 -->
        {{ $t("bureau_mine.calendar") }}
      </p>
    </MobileNav>

    <div class="view-inner-mobile">
      <van-pull-refresh
        v-model="reloadCa"
        :success-text="$t('public.reload')"
        @refresh="onRefresh"
      >
        <!-- 刷新成功 -->
        <div>
          <!-- 操作盒子 -->
          <div class="oper-box">
            <div class="url-box">
              <div class="remark-box">
                <p>
                  <!-- 订阅地址 -->
                  {{ $t("bureau_evs.sub_address") }}
                  <span
                    class="iconfont icon-bangzhu_help"
                    @click="remarkCalendar = true"
                  ></span>
                </p>
                <p :data-clipboard-text="payUrl" class="copy" @click="copyICS">
                  <!-- 复制 -->
                  {{ $t("public.copy") }}
                </p>
              </div>
              <p class="pay-url" v-if="payUrl">
                <mt-spinner
                  :type="2"
                  color="#a7f0ba"
                  v-if="!payUrl"
                ></mt-spinner>
                <span v-else>{{ payUrl }}</span>
              </p>
              <p class="un-pay" v-if="!payUrl">
                <!-- 未添加自选项目 -->
                {{ $t("no_data.no_track") }}
              </p>
            </div>
            <div class="btn-box" @click="addCalendarEv">
              <base-button type="info" class="other-info" round>
                <!-- 订阅日历 -->
                {{ $t("bureau_evs.sub_calendar") }}
              </base-button>
            </div>
          </div>
          <!-- 日历列表 -->
          <div class="calendar-list">
            <el-table
              :data="calendarData"
              style="width: 100%"
              :empty-text="$t('no_data.no_sub')"
            >
              <!-- 暂无订阅 -->
              <el-table-column
                prop="date"
                :label="$t('month_vip.table_name')"
                min-width="40"
              >
                <!-- 项目 -->
                <template slot-scope="{ row }">
                  <p class="pro-icon">
                    <img :src="row.logo" alt="" />
                  </p>
                </template>
              </el-table-column>
              <el-table-column :label="$t('public.evs')" min-width="100">
                <!-- 事件 -->
                <template slot-scope="{ row }">
                  <p class="pro-ev">
                    {{ row.abstract_zh }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="happen_time"
                :label="$t('bureau_evs.start_time')"
                min-width="80"
              >
                <!-- 发生时间 -->
              </el-table-column>
              <el-table-column
                :label="$t('month_vip.table_oper')"
                min-width="60"
                header-align="right"
              >
                <!-- 操作 -->
                <template slot-scope="{ row }">
                  <div class="remove-ev">
                    <p @click="addCalendar(2, row.id)">
                      <span class="iconfont icon-jian_minus"></span>
                    </p>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </van-pull-refresh>
      <!-- 分页器 -->
      <div class="page-tools" v-if="isNeedPage">
        <base-pagination
          :page-count="total"
          type="info"
          v-model="defaultPagination"
        ></base-pagination>
      </div>
    </div>
    <!-- 订阅说明 -->
    <van-dialog v-model="remarkCalendar" :showConfirmButton="false">
      <div class="remark-calendar">
        <p>
          <!-- 订阅日历 -->
          {{ $t("bureau_evs.sub_calendar") }}
        </p>
        <p>
          <!-- 您可将日历订阅链接添加到您的日历客户端，可通过手机、PC、平板等所有日历客户端自动同步您的最新日历。苹果手机可直接点击按钮导入日历，安卓手机型号较为复杂，请自行根据手机品牌百度搜索添加日历的方法，PC电脑可使用Outlook或者其它日历客户端进行订阅。 -->
          {{ $t("bureau_evs.copy_remark") }}{{ $t("bureau_evs.ios_remark") }}
        </p>
        <p>
          <base-button type="dafault" round @click="remarkCalendar = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
        </p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { myCalendar, subUrl, addCalendar } from "@/request/api";
import { BasePagination } from "@/components";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      calendarBox: false, //我的日历
      calendarData: [],
      loadCalendar: false, //日历加载
      payUrl: null,
      defaultPagination: 1,
      loadMore: false,
      reloadCa: false, //下拉刷新
      isNeedPage: false,
      total: 0,
      remarkCalendar: false, //订阅说明
    };
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    BasePagination,
  },
  computed: {
    // 禁用滚动加载
    disabled() {
      return false;
    },
  },
  created() {
    this.getMyCalendar();
  },
  watch: {
    defaultPagination() {
      this.getMyCalendar();
    },
  },
  methods: {
    async onRefresh() {
      await this.getMyCalendar();
      setTimeout(() => {
        this.reloadCa = false;
      }, 500);
    },
    loadMoreEv() {
      this.defaultPagination += 1;
      this.loadMore = true;
      setTimeout(async () => {
        this.loadMore = false;
        // await this.getPosalList();
      }, 500);
    },
    //获取我的日历
    async getMyCalendar() {
      this.loadCalendar = true;
      const result = await myCalendar({ limit: 12 });
      const url = await subUrl();
      this.payUrl = url.url;
      this.calendarData = result;
      this.total = result.last_page;
      result.last_page > 1
        ? (this.isNeedPage = true)
        : (this.isNeedPage = false);
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
          message: this.$t('notify.copy_success'),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          // 复制失败
          message: $t('notify.copy_falied'),
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
        message: this.$t('notify.move_sub'),
      });
      this.getMyCalendar();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table__row {
  td {
    padding-left: 0;
    padding-right: 0;
  }
}
/deep/ .has-gutter {
  th {
    padding-right: 0;
    padding-left: 0;
  }
}
.view-inner-mobile {
  padding: 4rem 1rem 0;
  .oper-box {
    width: 100%;
    background: $contentBg;
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
    .url-box {
      padding: $fon12 1rem;
      background: $conBg2;
      border-radius: 4px;
      margin-bottom: 1rem;
      .remark-box {
        display: flex;
        justify-content: space-between;
        margin-bottom: $fon12;
        align-items: center;
        .iconfont {
          font-size: 1rem;
          color: $textColor;
          margin-left: 0.5rem;
        }
        p:first-child {
          font-size: $fon12;
          color: $remarkColor;
          display: flex;
          align-items: center;
        }
        p:last-child {
          font-size: $fon12;
          color: #33b1ff;
        }
      }
      .pay-url {
        word-break: break-all;
        line-height: $fon18;
        font-size: $fon12;
        color: $textColor;
      }
    }
    .btn-box {
      button {
        width: 100%;
      }
    }
  }
  .calendar-list {
    padding: 1rem;
    background: $contentBg;
    border-radius: 4px;
    .pro-icon {
      width: $padd24;
      height: $padd24;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 1.375rem;
        height: 1.375rem;
        border-radius: 50%;
      }
    }
    .pro-ev {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .remove-ev {
      display: flex;
      justify-content: flex-end;
      p {
        width: 1rem;
        height: 1rem;
        background: $conBg2;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        .iconfont {
          font-size: $fon12;
        }
      }
    }
  }
  .page-tools {
    display: flex;
    justify-content: center;
  }
}
.remark-calendar {
  text-align: center;
  p:first-child {
    margin-top: $padd24;
    margin-bottom: 1rem;
    font-size: $fon14;
    color: $mineBg;
  }
  p:nth-child(2) {
    font-size: $fon12;
    color: $remarkColor;
    line-height: $fon18;
    text-align: justify;
    margin: 0 2rem;
  }
  p:last-child {
    margin: $padd24 0;
  }
}
</style>