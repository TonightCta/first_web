// 渠道商
<template>
  <div class="busi-ness">
    <p class="h3">
      <!-- 渠道商数据中心 -->
      {{ $t("business.bus_title") }}
    </p>
    <!-- 统计数据 -->
    <div class="row">
      <div class="col-sm-6 col-lg-3">
        <div class="total-box">
          <p class="h5">
            <!-- 注册总人数 -->
            {{ $t("business.regis_all_total") }}
          </p>
          <p class="num-text">
            <span v-if="rowMsg.total == undefined">
              <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
            </span>
            <span v-else> {{ rowMsg.total }} </span>
          </p>
          <img :src="require('@/assets/images/businessBg.png')" alt="" />
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="data-box-inner">
          <div class="data-top">
            <p class="h5">
              <!-- 试用人数 -->
              {{ $t("business.try_total") }}
            </p>
            <p class="h2">
              <span v-if="rowMsg.try == undefined">
                <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
              </span>
              <span v-else> {{ rowMsg.try }} </span>
            </p>
          </div>
          <div class="data-label"></div>
          <div class="data-bottom">
            <p class="h5">
              <!-- 当前试用人数 -->
              {{ $t("business.try_total_now") }}
            </p>
            <p class="h2">
              <span v-if="rowMsg.try_now == undefined">
                <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
              </span>
              <span v-else> {{ rowMsg.try_now }} </span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="data-box-inner">
          <div class="data-top">
            <p class="h5">
              <!-- 包年总人数 -->
              {{ $t("business.year_total") }}
            </p>
            <p class="h2">
              <span v-if="rowMsg.year == undefined">
                <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
              </span>
              <span v-else> {{ rowMsg.year }} </span>
            </p>
          </div>
          <div class="data-label"></div>
          <div class="data-bottom">
            <p class="h5">
              <!-- 当前包年人数 -->
              {{ $t("business.year_total_now") }}
            </p>
            <p class="h2">
              <span v-if="rowMsg.year_now == undefined">
                <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
              </span>
              <span v-else> {{ rowMsg.year_now }} </span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="data-box-inner">
          <div class="data-top">
            <p class="h5">
              <!-- 总分成金额 (元) -->
              {{ $t("business.all_amount") }}
            </p>
            <div>
              <p class="h2">
                <span v-if="rowMsg.amount_r == undefined">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else> {{ Number(rowMsg.amount_r).toFixed(2) }} </span>
              </p>
              <p class="h4" style="display: flex">
                &asymp;&nbsp;
                <span v-if="rowMsg.amount_u == undefined">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else>
                  {{ Number(rowMsg.amount_u).toFixed(2) }}&nbsp;USDT</span
                >
              </p>
            </div>
          </div>
          <div class="data-label"></div>
          <div class="data-bottom">
            <p class="h5">
              <!-- 待结算金额 (元) -->
              {{ $t("business.pending_amount") }}
            </p>
            <div>
              <p class="h2">
                <span v-if="rowMsg.pending_r == undefined">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else> {{ Number(rowMsg.pending_r).toFixed(2) }}</span>
              </p>
              <p class="h4" style="display: flex">
                &asymp;&nbsp;
                <span v-if="rowMsg.pending_u == undefined">
                  <mt-spinner :type="2" color="#a7f0ba"></mt-spinner>
                </span>
                <span v-else>
                  {{ Number(rowMsg.pending_u).toFixed(2) }}&nbsp;USDT</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
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
          <p class="un-count">({{ tab.count }})</p>
          <p class="tab-line"></p>
        </li>
      </ul>
      <!-- 导出 -->
      <a
        :href="
          baseUrl +
          '?token=' +
          app.token +
          '&language=' +
          (app.language == 'en' ? 'en-us' : 'zh-cn') +
          '&type=' +
          tabIndex
        "
        target="_blank"
      >
        <p class="exit-out">
          <span class="iconfont icon-yiduyoujian_mail-open"></span>
          <!-- 导出 -->
          {{ $t("business.exit") }}
        </p>
      </a>
    </div>
    <!-- 数据主体 -->
    <div class="data-box" v-loading="loadData">
      <el-table
        :data="tableData"
        v-if="tabIndex == 1 && !$flag"
        :empty-text="$t('no_data.no_table')"
      >
        <el-table-column prop="uid" label="UID" min-width="100">
        </el-table-column>
        <el-table-column
          prop="mobile"
          :label="$t('login_box.login_number')"
          min-width="100"
        >
          <!-- 手机号 -->
        </el-table-column>
        <el-table-column
          prop="email"
          :label="$t('business.email')"
          min-width="180"
        >
          <!-- 邮箱 -->
        </el-table-column>
        <el-table-column
          prop="create_time"
          :label="$t('business.rigis_time')"
          min-width="100"
        >
          <!-- 注册时间 -->
        </el-table-column>
        <el-table-column
          :label="$t('business.last_time')"
          min-width="60"
          header-align="center"
        >
          <!-- 最后交互时间 -->
          <template slot-scope="{ row }">
            <p class="text-left">{{ row.prev_time }}</p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 移动端 -->
      <el-table
        :data="tableData"
        v-if="tabIndex == 1 && $flag"
        :empty-text="$t('no_data.no_table')"
      >
        <el-table-column prop="uid" label="UID" min-width="60">
        </el-table-column>
        <el-table-column :label="$t('business.phone_email')" min-width="100">
          <!-- 手机号/邮箱 -->
          <template slot-scope="{ row }">
            <span style="color: white"> {{ row.mobile }} </span>
            <br />
            <span style="color: #a2a5b0"> {{ row.email }} </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('business.last_time')"
          min-width="100"
          header-align="right"
        >
          <!-- 最后交互时间 -->
          <template slot-scope="{ row }">
            <p class="">{{ row.prev_time.substr(5, 5) }}</p>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="tableData"
        v-if="(tabIndex == 2 || tabIndex == 3) && !$flag"
        :empty-text="$t('no_data.no_table')"
      >
        <el-table-column prop="uid" label="UID" min-width="80">
        </el-table-column>
        <el-table-column
          prop="order_id"
          :label="$t('mine_order.order_number')"
          min-width="80"
        >
          <!-- 订单号 -->
        </el-table-column>
        <el-table-column
          prop="mobile"
          :label="$t('login_box.login_number')"
          min-width="80"
        >
          <!-- 手机号 -->
        </el-table-column>
        <el-table-column
          prop="pay_time"
          :label="$t('business.sub_time')"
          min-width="80"
        >
          <!-- 订阅时间 -->
        </el-table-column>
        <!-- <el-table-column prop="txid" label="TxHash" min-width="90">
        </el-table-column> -->
        <el-table-column
          prop="left_day"
          :label="$t('business.left_day')"
          min-width="80"
        >
          <!-- 剩余天数 -->
        </el-table-column>
        <el-table-column
          prop="workorder_num"
          :label="$t('business.ens_number')"
          min-width="80"
        >
          <!-- 咨询数量 -->
        </el-table-column>
        <el-table-column
          prop="read_num"
          :label="$t('business.read_number')"
          min-width="80"
        >
          <!-- 阅读数量 -->
        </el-table-column>
        <el-table-column
          prop="prev_time"
          :label="$t('business.last_time')"
          min-width="80"
        >
          <!-- 最后交互时间 -->
        </el-table-column>
        <el-table-column
          :label="$t('work_order.work_status')"
          min-width="80"
          header-align="center"
        >
          <!-- 状态 -->
          <template slot-scope="{ row }">
            <p class="text-center">
              <span v-if="row.the_status == 1">
                <!-- 有效 -->
                {{ $t("business.has_val") }}
              </span>
              <span v-if="row.the_status == 2">
                <!-- 过期 -->
                {{ $t("business.un_val") }}
              </span>
              <span v-if="row.the_status == 3">
                <!-- 已退款 -->
                {{ $t("business.has_return") }}
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('business.is_end')"
          min-width="60"
          header-align="right"
          v-if="tabIndex == 3"
        >
          <!-- 是否结算 -->
          <template slot-scope="{ row }">
            <p class="text-right">
              <span v-if="row.is_pay == 1">
                <!-- 已结算 -->
                {{ $t("business.has_end") }}
              </span>
              <span v-else>
                <!-- 未结算 -->
                {{ $t("business.un_end") }}
              </span>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 移动端 -->
      <el-table
        :data="tableData"
        v-if="(tabIndex == 2 || tabIndex == 3) && $flag"
        :empty-text="$t('no_data.no_table')"
      >
        <el-table-column
          prop="uid"
          :label="$t('business.phone_uid')"
          min-width="80"
        >
          <!-- 手机号/UID -->
          <template slot-scope="{ row }">
            <span style="color: white"> {{ row.mobile }} </span>
            <br />
            <span> {{ row.uid }} </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('business.order_sub')" min-width="90">
          <!-- 订单号/订阅时间 -->
          <template slot-scope="{ row }">
            <span style="color: white"> #{{ row.order_id }} </span>
            <br />
            <span> {{ row.pay_time.substr(5, 5) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="70" header-align="center">
          <template slot-scope="{ row }">
            <p class="text-center">
              <span v-if="row.the_status == 1">
                <!-- 有效 -->
                {{ $t("business.has_val") }}
              </span>
              <span v-if="row.the_status == 2">
                <!-- 过期 -->
                {{ $t("business.un_val") }}
              </span>
              <span v-if="row.the_status == 3">
                <!-- 已退款 -->
                {{ $t("business.has_return") }}
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('business.end')"
          min-width="60"
          header-align="right"
          v-if="tabIndex == 3"
        >
          <!-- 结算 -->
          <template slot-scope="{ row }">
            <p class="text-right">
              <span v-if="row.is_pay == 1">
                <!-- 已结算 -->
                {{ $t("business.has_end") }}
              </span>
              <span v-else>
                <!-- 未结算 -->
                {{ $t("business.un_end") }}
              </span>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div class="page-tools" v-if="isNeed">
      <base-pagination
        :page-count="total"
        type="info"
        v-model="defaultPagination"
      ></base-pagination>
    </div>
  </div>
</template>

<script>
import { BasePagination } from "@/components";
import { mapState } from "vuex";
import { busiNessTotal, busiNessList, busiNessExit } from "@/request/api";
export default {
  name: "ChannelBusiness",
  data() {
    return {
      tabList: [
        {
          //未订阅用户
          name: this.$t("business.un_sub"),
          type: 1,
          count: "0",
        },
        {
          //试用用户
          name: this.$t("business.try_account"),
          type: 2,
          count: "0",
        },
        {
          //年费用户
          name: this.$t("business.year_amount"),
          type: 3,
          count: "0",
        },
      ],
      tabIndex: 1, //当前选中列表
      defaultPagination: 1, //默认页码
      isNeed: true, //是否需要分页器
      total: 1, //总页数
      loadData: false, //数据加载
      tableData: [],
      rowMsg: {}, //统计数据
    };
  },
  components: {
    BasePagination,
  },
  watch: {
    defaultPagination() {
      this.getListMsg();
    },
  },
  created() {
    this.getRowMsg();
    this.getListMsg();
  },
  computed: {
    ...mapState(["app"]),
    baseUrl() {
      return process.env.VUE_APP_BASEURL + "/distributor/export";
    },
  },
  methods: {
    //切换选项卡
    changeTab(_index) {
      this.tabIndex = 99;
      this.loadData = true;
      this.tableData = [{}];
      this.defaultPagination = 1;
      this.isNeed = false;
      setTimeout(() => {
        this.tabIndex = _index + 1;
        this.getListMsg();
        this.loadData = false;
      }, 200);
    },
    //统计数据
    async getRowMsg() {
      const result = await busiNessTotal();
      this.rowMsg = result;
      this.$set(this.tabList[0], "count", result.visitor);
      this.$set(this.tabList[1], "count", result.try);
      this.$set(this.tabList[2], "count", result.year);
    },
    //列表数据
    async getListMsg() {
      const params = {
        page: this.defaultPagination,
        limit: 12,
        type: this.tabIndex,
      };
      const result = await busiNessList(params);
      this.total = result.last_page;
      result.last_page > 1 ? (this.isNeed = true) : (this.isNeed = false);
      this.tableData = result.data;
    },
    //导出图表
    async exitExcl() {
      // console.log(this.app.language)
      await busiNessExit({ language: this.app.language, type: this.tabIndex });
    },
  },
};
</script>

<style lang="scss" scoped>
.h3 {
  color: white;
  font-weight: bold;
  margin-bottom: 16px;
}
.h5 {
  color: white;
  margin-bottom: 0;
}
.text-left {
  padding-left: 10px;
}
.row {
  .col-sm-6 {
    min-height: 200px;
    .total-box {
      width: 100%;
      height: 100%;
      background: $contentBg;
      border-radius: 4px;
      border: 1px solid $lineColor;
      padding: 24px;
      position: relative;
      .num-text {
        font-size: 48px;
        color: $success;
        line-height: 40px;
        margin-top: 8px;
      }
      img {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 180px;
        height: 160px;
      }
    }
    .data-box-inner {
      display: flex;
      height: 100%;
      flex-direction: column;
      .data-label {
        width: 100%;
        height: 16px;
      }
      .data-top,
      .data-bottom {
        flex: 1;
        width: 100%;
        background: $contentBg;
        border-radius: 4px;
        border: 1px solid $lineColor;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .h2 {
          margin-bottom: 0;
          color: $success;
          text-align: right;
        }
        .h4 {
          color: white;
          margin-bottom: 0;
        }
      }
    }
  }
}
.un-tab {
  display: flex;
  justify-content: space-between;
  padding: 15px 24px;
  border-radius: 4px;
  background: $contentBg;
  margin-top: 40px;
  .exit-out {
    font-size: 14px;
    color: white;
    cursor: pointer;
    .iconfont {
      font-size: 14px;
    }
  }
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
      }
      .tab-line {
        width: 24px;
      }
    }
  }
}
.data-box {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  margin-top: 16px;
  min-height: 600px;
}
@media screen and (max-width: 1279px) {
  .busi-ness {
    overflow-x: hidden;
  }
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
  .col-sm-6 {
    margin-top: 1rem;
  }
  .un-tab {
    margin-top: $padd40;
    ul {
      li {
        font-size: $fon12;
      }
    }
    a {
      display: none;
    }
  }
  .data-box {
    padding: 1rem;
  }
  .page-tools {
    justify-content: center;
  }
}
</style>