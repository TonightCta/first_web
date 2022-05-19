<template>
  <div class="order">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 以下订单如有疑问，请联系我们的销售顾问 -->
        {{ $t("mine_order.order_title") }}
        <el-popover
          placement="bottom"
          width="180"
          trigger="hover"
          v-if="app.language == 'zh-CN'"
        >
          <div>
            <img :src="contactURL" style="width: 160px; height: 160px" alt="" />
          </div>
          <span
            class="iconfont icon-fukuanma_pay-code-one"
            slot="reference"
          ></span>
        </el-popover>
        <a href="mailto:marketing@first.vip" target="_blank" v-else>
          <p class="iconfont icon-youjian"></p>
        </a>
      </p>
    </div>
    <div class="order-list" v-loading="loadingData">
      <div style="min-height: 550px">
        <el-table :data="tableData" :empty-text="$t('no_data.no_order')">
          <!-- 暂无订单 -->
          <el-table-column
            min-width="110"
            prop="name"
            :label="$t('mine_order.order_number')"
          >
            <!-- 订单号 -->
            <template slot-scope="{ row }">
              <span style="color: #a2a5b0"> #{{ row.id }} </span>
            </template>
          </el-table-column>
          <el-table-column min-width="110" :label="$t('mine_order.product')">
            <!-- 产品 -->
            <template slot-scope="{ row }">
              <span style="color: #fff"> {{ row.name }} </span>
            </template>
          </el-table-column>
          <el-table-column min-width="120" :label="$t('mine_order.unit')">
            <!-- 单价 -->
            <template slot-scope="{ row }">
              <span style="color: #a2a5b0">
                {{ row.price }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="80" :label="$t('mine_order.num')">
            <!-- 数量 -->
            <template slot-scope="{ row }">
              <span style="color: #a2a5b0"> {{ row.num }} </span>
            </template>
          </el-table-column>
          <el-table-column min-width="120" :label="$t('mine_order.pay_amount')">
            <!-- 支付金额 -->
            <template slot-scope="{ row }">
              <span style="color: #fff">
                {{ row.price }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="120" :label="$t('mine_order.pay_way')">
            <!-- 支付方式 -->
            <template slot-scope="{ row }">
              <span style="color: white">
                <i
                  class="iconfont pay-way"
                  :class="row.pay_type == 1 ? 'icon-weixinzhifu' : 'icon-USDT'"
                  style="margin-right: 8px"
                  :style="{ color: row.pay_type == 1 ? '#09BB07' : '#1BA27A' }"
                  v-if="false"
                ></i
                >{{
                  /** 待付款 */
                  (row.pay_type == 0 && $t("mine_order.un_pay")) ||
                  /** 微信支付 */
                  (row.pay_type == 1 && $t("mine_order.wechat_pay")) ||
                  /** 合约支付 */
                  (row.pay_type == 2 && $t("mine_order.contract_pay")) ||
                  /** 微信支付 */
                  (row.pay_type == 3 && $t("mine_order.wechat_pay")) ||
                  /** 转账支付 */
                  (row.pay_type == 4 && $t("mine_order.transfer_pay"))
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="100" :label="$t('mine_order.date')">
            <!-- 日期 -->
            <template slot-scope="{ row }">
              <span style="color: #a2a5b0"> {{ row.create_time }} </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="110"
            prop="name"
            header-align="center"
            :label="$t('work_order.work_status')"
          >
            <!-- 状态 -->
            <div class="text-center" slot-scope="{ row }">
              <span style="color: #a2a5b0" v-if="row.status == 1">
                <!-- 待付款 -->
                {{ $t("mine_order.un_pay") }}
              </span>
              <span style="color: #a2a5b0" v-if="row.status == 2">
                <!-- 已完成 -->
                {{ $t("mine_order.down") }}
              </span>
              <span style="color: #a2a5b0" v-if="row.status == 3">
                <!-- 已取消 -->
                {{ $t("mine_order.cancel") }}
              </span>
              <span style="color: #a2a5b0" v-if="row.status == 4">
                <!-- 部分已付 -->
                {{ $t("mine_order.pay_part") }}
              </span>
              <span style="color: #a2a5b0" v-if="row.status == 5">
                <!-- 付款中 -->
                {{ $t("mine_order.pay_pending") }}
              </span>
            </div>
          </el-table-column>
          <el-table-column
            min-width="100"
            header-align="right"
            prop="name"
            :label="$t('month_vip.table_oper')"
          >
            <!-- 操作 -->
            <div
              slot-scope="{ row }"
              class="text-right"
              style="cursor: pointer"
              :style="{
                color:
                  row.status == 1 || row.status == 5 ? '#A7F0BA' : '#ffffff',
              }"
              @click="
                row.status == 1 || row.status == 5
                  ? openDetails(1, row.id)
                  : openDetails(2, row.id)
              "
            >
              <span
                class="iconfont"
                :class="
                  row.status == 1 || row.status == 5
                    ? 'icon-shuaka_swipe'
                    : 'icon-yanjing_eyes'
                "
              ></span>
              {{
                row.status == 1 || row.status == 5
                  ? $t("mine_order.pay")
                  : $t("mine_order.view")
              }}
              <!-- 付款 & 查看 -->
            </div>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <div class="page-tools" v-if="isWithPage">
        <base-pagination
          :page-count="total"
          type="info"
          v-model="defaultPagination"
        ></base-pagination>
      </div>
    </div>
    <!-- 订单详情 -->
    <modal
      :show.sync="detailsBox"
      modalClasses="order-details"
      modalContentClasses="order-details"
    >
      <div class="order-details-inner">
        <div class="details-title">
          <p class="h3">
            <!-- 订单详情 -->
            {{ $t("mine_order.details") }}
          </p>
          <p class="h5">
            <span>
              <!-- 订单号： -->
              {{ $t("pay_order.order_number") }}
              <font> #{{ orderDetails.id }} </font>
            </span>
            <span>
              <!-- 生成日期：  -->
              {{ $t("pay_order.create_date") }}
              <font> {{ orderDetails.create_time_text }} </font>
            </span>
          </p>
        </div>
        <p class="h4">
          <!-- 产品信息 -->
          {{ $t("mine_order.product_info") }}
        </p>
        <div class="row row-header">
          <div class="col-sm-6 col-lg-3">
            <!-- 产品 -->
            {{ $t("mine_order.product") }}
          </div>
          <div class="col-sm-6 col-lg-3">
            <!-- 单价 -->
            {{ $t("mine_order.unit") }}
          </div>
          <div class="col-sm-6 col-lg-3">
            <!-- 数量 -->
            {{ $t("mine_order.num") }}
          </div>
          <div class="col-sm-6 col-lg-3 text-right">
            <!-- 支付金额 -->
            {{ $t("mine_order.pay_amount") }}
          </div>
        </div>
        <div class="row row-content">
          <div class="col-sm-6 col-lg-3 meal-name">{{ orderDetails.name }}</div>
          <div class="col-sm-6 col-lg-3">{{ orderDetails.price }}</div>
          <div class="col-sm-6 col-lg-3">{{ orderDetails.num }}</div>
          <div class="col-sm-6 col-lg-3 pay-price text-right">
            {{ orderDetails.price }}
          </div>
        </div>
        <p class="h5 details-remark">
          <!-- 订单备注 -->
          {{ $t("mine_order.order_remark") }}
          <span>
            {{
              orderDetails.remark ? orderDetails.remark : $t("public.un_write")
            }}
          </span>
        </p>
        <p class="h4">
          <!-- 账户信息 -->
          {{ $t("mine_order.account_info") }}
        </p>
        <div class="bill-msg">
          <p class="h5">
            <!-- 手机 -->
            {{ $t("mine_order.mobile") }}
            <span>
              {{
                orderDetails.mobile
                  ? orderDetails.mobile.substr(0, 3) +
                    "****" +
                    orderDetails.mobile.substr(7, 11)
                  : $t("public.un_write")
              }}
            </span>
          </p>
          <p class="h5">
            <!-- 邮箱： -->
            {{ $t("mine_order.email") }}
            <span>
              {{
                orderDetails.email ? orderDetails.email : $t("public.un_write")
              }}
            </span>
          </p>
        </div>
        <div class="pay-msg">
          <p class="h4 pay-status">
            <!-- 订单状态 -->
            {{ $t("mine_order.order_status") }}
            <span v-if="orderDetails.status == 1" style="color: #ff8389">
              <!-- 待支付 -->
              {{ $t("mine_order.un_pay") }}
            </span>
            <span v-if="orderDetails.status == 2" style="color: #a7f0ba">
              <!-- 已完成 -->
              {{ $t("mine_order.down") }}
            </span>
            <span v-if="orderDetails.status == 5" style="color: #00b0f0">
              <!-- 支付中 -->
              {{ $t("mine_order.pay_pending") }}
            </span>
            <span v-if="orderDetails.status == 3" style="color: #ff6666">
              <!-- 已取消 -->
              {{ $t("mine_order.cancel") }}
            </span>
          </p>
          <p class="h4 pay-way" v-if="orderDetails.status == 2">
            <!-- 支付方式 -->
            {{ $t("mine_order.pay_way") }}
            <span
              class="iconfont"
              :class="
                orderDetails.pay_type == 1 ? 'icon-weixinzhifu' : 'icon-USDT'
              "
              :style="{
                color: orderDetails.pay_type == 1 ? '#09BB07' : '#1BA27A',
              }"
            ></span>
            <span>
              {{
                orderDetails.pay_type == 1
                  ? $t("mine_order.wechat_pay")
                  : "USDT-ERC20"
              }}
            </span>
          </p>
          <p
            class="h4 pay-way"
            v-if="orderDetails.status == 5 && orderDetails.pay_type == 4"
          >
            <!-- 支付公链 -->
            {{ $t("pay_order.pay_chain") }}
            <img :src="orderDetails.chain_icon" alt="" />
            <span>
              {{ orderDetails.chain }}
            </span>
          </p>
        </div>
        <div class="other-oper">
          <base-button
            type="default"
            round
            @click="detailsBox = false"
            style="margin-right: 8px"
          >
            <!-- 返回 -->
            {{ $t("public.back") }}
          </base-button>
          <base-button
            type="info"
            round
            v-if="
              (orderDetails.status == 2 || orderDetails.status == 5) &&
              orderDetails.pay_type == 2
            "
            @click="viewBrowser(orderDetails.hash, orderDetails.type)"
          >
            <i class="iconfont icon-diqiuyi_earth"></i>
            <!-- 查看区块链浏览器 -->
            {{ $t("mine_order.view_block") }}
          </base-button>
          <base-button
            type="info"
            round
            v-if="orderDetails.status == 1 || orderDetails.status == 5"
            @click="payOrder"
          >
            <i class="iconfont icon-shuaka_swipe"></i>
            <!-- 立即支付 -->
            {{ $t("pay_order.pay_now") }}
          </base-button>
        </div>
      </div>
    </modal>
    <!-- 支付 -->
    <modal
      :show.sync="payBox"
      modalClasses="order-details-pay"
      modalContentClasses="order-details-pay"
    >
      <PayTable
        ref="paytable"
        @choosePayType="choosePayType"
        :isTransfar="isTransfar"
      />
      <p class="pay-btn-new" :class="payType == 2 ? 'pay-btn-new-border' : ''">
        <base-button type="default" round @click="payBox = false">
          <!-- 返回 -->
          {{ $t("public.back") }}
        </base-button>
        <span style="display: inline-block; width: 16px"></span>
        <base-button
          type="info"
          round
          @click="$refs.paytable.payWallet()"
          v-if="payType == 2"
        >
          <!-- 跳转支付 -->
          {{ $t("mine_order.go_pay") }}
        </base-button>
      </p>
    </modal>
  </div>
</template>

<script>
import * as api from "@/request/api";
import { mapState } from "vuex";
import { BasePagination, Modal } from "@/components";
export default {
  name: "Order",
  data() {
    return {
      tableData: [],
      loadingData: false, //数据加载
      orderDetails: {},
      total: 1, //总页数
      defaultPagination: 1, //当前页码
      detailsBox: false, //订单详情
      isWithPage: false, //是否需要分页器
      contactURL: null,
      payBox: false, //支付
      payType: 2, //支付方式
      isTransfar: false, //是否为转账支付
    };
  },
  components: {
    BasePagination,
    Modal,
    PayTable: (resolve) =>
      require(["@/views/place_order/coms/pay_table"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getOrderList();
    this.getContact();
  },
  watch: {
    defaultPagination() {
      this.getOrderList();
    },
    payBox(val) {
      !val &&
        this.$refs.paytable.watchEtherLogCancel &&
        this.$refs.paytable.watchEtherLogCancel.unsubscribe();
      this.$refs.paytable.clearTime();
    },
  },
  methods: {
    //获取订单列表
    async getOrderList() {
      this.loadingData = true;
      const result = await api.userOrder({
        page: this.defaultPagination,
        limit: 10,
        type: this.app.isBureau == 0 ? 1 : 2,
      });
      this.loadingData = false;
      this.tableData = result.data;
      this.total = result.last_page;
      result.last_page > 1
        ? (this.isWithPage = true)
        : (this.isWithPage = false);
    },
    //订单详情
    async openDetails(_type, _id) {
      /**
       * @param _type -> 1  可支付
       * @param _type -> 2  不可支付
       */
      this.orderDetails = await api.orderDetails({ order_id: _id });
      this.$store.commit("upPlaceOrderMsg", this.orderDetails);
      this.detailsBox = true;
    },
    //客服微信获取
    async getContact() {
      const result = await api.contactQR();
      this.contactURL = result.image;
    },
    //支付方式切换
    choosePayType(_type) {
      this.payType = _type;
    },
    //支付订单
    payOrder() {
      this.orderDetails.status == 5 && this.orderDetails.pay_type == 4
        ? (this.$refs.paytable.infoOrderdetails(
            this.orderDetails.payed,
            this.orderDetails.left,
            this.orderDetails.chain,
            this.orderDetails.chain_icon,
            this.orderDetails.chain_id
          ),
          (this.payType = 3))
        : (this.$refs.paytable.infoTable(), (this.payType = 2));
      this.payBox = true;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .modal-body {
  padding: 0 !important;
}
.pay-way-new {
  width: 100% !important;
  margin-top: 0 !important;
  min-height: 570px;
  transform: translateY(-44px) !important;
  .transfar-msg,
  .qr-content {
    width: 100% !important;
  }
  .pay-way-new-content {
    padding-bottom: 0 !important;
  }
}
.order {
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: flex-start;
    padding-left: 24px;
    align-items: center;
    border-radius: 4px;
    .h4 {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      color: white;
      .iconfont {
        font-size: $iconSize;
        color: white;
        margin:0 8px;
      }
      span {
        color: $success;
        padding: 0 2px;
      }
      span:last-child {
        cursor: pointer;
      }
    }
  }
  .order-list {
    padding: 24px;
    background: $contentBg;
    margin-top: 16px;
    border-radius: 4px;
    min-height: 550px;
    .iconfont {
      font-size: 22px;
      display: inline-block;
      transform: translateY(2px);
    }
    .pay-way {
      font-size: 24px;
      transform: translateY(3px);
    }
  }
  .page-tools {
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
  }
}
.order-details-inner {
  padding: 0 24px 32px 24px;
  color: white;
  .details-title {
    display: flex;
    justify-content: space-between;
    height: 32px;
    align-items: center;
    margin-bottom: 24px;
    .h3 {
      color: white;
      font-weight: bold;
      margin: 0;
    }
    .h5 {
      height: 32px;
      padding: 0 16px;
      background: $conBg2;
      border-radius: 16px;
      color: $remarkColor;
      margin: 0;
      line-height: 32px;
      font {
        color: $textColor;
      }
      span:first-child {
        margin-right: 24px;
      }
    }
  }
  .h4 {
    color: $textColor !important;
    margin-bottom: 17px;
  }
  .row {
    margin: 0;
  }
  .row-header {
    font-size: 12px;
    box-sizing: border-box;
    border-bottom: 1px solid #353e66;
    .col-sm-6 {
      line-height: 48px;
      color: $textColor;
    }
  }
  .row-content {
    font-size: 14px;
    color: $remarkColor;
    .col-sm-6 {
      line-height: 54px;
    }
    .meal-name {
      font-weight: bold;
      color: white;
    }
    .pay-price {
      color: $success;
      font-weight: bold;
    }
  }
  .details-remark {
    color: $remarkColor !important;
    margin-top: 16px;
    margin-bottom: 40px;
    span {
      margin-left: 16px;
      color: $textColor;
      font-weight: bold;
    }
  }
  .bill-msg {
    display: flex;
    height: 40px;
    align-items: center;
    padding-left: 24px;
    background: $conBg2;
    border-radius: 4px;
    margin-bottom: 40px;
    p {
      margin: 0;
      color: $remarkColor;
      span {
        color: $textColor;
      }
    }
    p:first-child {
      margin-right: 24px;
    }
  }
  .pay-msg {
    display: flex;
    justify-content: space-between;
    .pay-status {
      span {
        color: white;
        font-size: 17px;
        font-weight: bold;
      }
    }
    .pay-way {
      .iconfont {
        font-size: 24px;
        display: inline-block;
        transform: translateY(3px);
        margin-left: 16px;
        margin-right: 8px;
      }
      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: inline-block;
        margin-left: 16px;
        margin-right: 8px;
        transform: translateY(6px);
      }
    }
  }
  .other-oper {
    text-align: center;
    margin-top: 40px;
    button {
      font-weight: 400;
    }
    i {
      font-weight: 400;
      font-size: 20px;
    }
    button:last-child {
      margin-left: 24px;
    }
  }
}
.wechat-pay-box {
  .pay-total {
    display: flex;
    justify-content: space-between;
    height: 24px;
    align-items: center;
    p {
      color: $textColor;
      font-size: 17px;
    }
    p:last-child {
      font-size: 23px;
      color: $success;
    }
  }
  .pay-line {
    width: 100%;
    height: 1px;
    background: $lineTwoColor;
    margin-top: 25px;
    margin-bottom: 40px;
  }
  .pay-remark {
    font-size: 13px;
    color: $remarkColor !important;
    text-align: center;
    margin-bottom: 24px;
    span {
      color: white;
      margin: 0 4px;
      font-weight: bold;
    }
  }
  .pay-qr-box {
    width: 160px;
    height: 160px;
    background: white;
    margin: 0 auto;
    padding: 2px;
  }
  .pay-need-know {
    height: 40px;
    width: 240px;
    background: $conBg2;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-top: 24px;
    border-radius: 4px;
    .iconfont {
      font-size: 15px;
      margin-right: 10px;
      display: inline-block;
      transform: translateY(1px);
    }
    p {
      color: $remarkColor;
      font-size: 13px;
      span {
        font-weight: bold;
        color: $success;
        margin: 0 4px;
      }
    }
  }
}
.pay-btn-new {
  text-align: center;
  width: 92%;
  margin: 0 auto;
  padding: 24px 0;
  margin-top: -30px;
}
.pay-btn-new-border {
  border-top: 1px solid $conBg2;
}
</style>