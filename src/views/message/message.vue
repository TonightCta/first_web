<template>
  <div class="message-center">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 如有疑问，请联系我们的销售顾问 -->
        {{ $t("message.message_title") }}
        <el-popover placement="bottom" width="180" trigger="hover" v-if="app.language != 'en'">
          <div>
            <img :src="contactURL" style="width: 160px; height: 160px" alt="" />
          </div>
          <span
            class="iconfont icon-fukuanma_pay-code-one"
            slot="reference"
          ></span>
        </el-popover>
        <a
          href="mailto:marketing@first.vip"
          target="_blank"
          v-else
        >
          <p class="iconfont icon-youjian"></p>
        </a>
      </p>
    </div>
    <div class="message-list" v-loading="loadingData">
      <el-table
        :data="tableData"
        :empty-text="$t('no_data.no_message')"
        height="70vh"
      >
        <!-- 暂无消息 -->
        <el-table-column min-width="450" :label="$t('message.content')">
          <!-- 消息内容 -->
          <template slot-scope="{ row }">
            <p style="color: #fff">{{ row.content }}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="100" :label="$t('message.get_time')">
          <!-- 接收时间 -->
          <template slot-scope="{ row }">
            <p style="color: #a2a5b0">{{ row.create_time }}</p>
          </template>
        </el-table-column>
        <el-table-column
          min-width="50"
          :label="$t('month_vip.table_oper')"
          header-align="right"
        >
          <!-- 操作 -->
          <template slot-scope="{ row }">
            <div class="message-oper">
              <p
                class="iconfont icon-PDF"
                v-if="row.type == 1"
                @click="viewMessagePDF($flag ? row.mobile_pdf : row.pdf)"
              ></p>
              <p
                class="iconfont icon-yanjing_eyes"
                v-if="row.type == 2"
                @click="viewWorkDetails(row.workorder_id)"
              ></p>
              <p
                class="iconfont icon-shuaka_swipe"
                v-if="row.type == 4 || row.type == 5"
                @click="reNew"
              ></p>
              <p
                class="iconfont icon-wode_me"
                v-if="row.type == 3"
                @click="viewProduct"
              ></p>
              <p v-if="row.type == 22" class="other-show">-</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="page-tools" v-if="neddPage">
        <base-pagination
          :page-count="total"
          type="info"
          v-model="defaultPagination"
        ></base-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/request/api";
import { BasePagination } from "@/components";
import { mapState } from "vuex";
export default {
  name: "Message",
  data() {
    return {
      tableData: [],
      total: 1, //总页数
      defaultPagination: 1, //当前页码
      loadingData: false,
      contactURL: null,
      neddPage: false,
    };
  },
  components: { BasePagination },
  watch: {
    defaultPagination() {
      this.getMessageList();
    },
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.operAll();
    this.getContact();
  },
  mounted() {
    window.operAll = this.operAll;
  },
  methods: {
    //获取消息列表
    async getMessageList() {
      this.loadingData = true;
      const result = await api.messageList({
        limit: 16,
        page: this.defaultPagination,
      });
      result.data.forEach((e) => {
        if (e.type == 2 && e.workorder_id == 0) {
          this.$set(e, "type", "22");
        }
      });
      this.loadingData = false;
      this.tableData = result.data;
      this.total = result.last_page;
      result.last_page > 1 ? (this.neddPage = true) : (this.neddPage = false);
    },
    //消息内页全部操作
    operAll() {
      this.getMessageList();
      api.readMessage();
      this.$store.commit("upMessageStatus", false);
    },
    //删除消息
    async deleteMessage(_id) {
      const result = await api.delMessage({ id: _id });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        //删除消息成功
        message: this.$t("notify.delete_success"),
      });
      this.getMessageList();
    },
    //客服微信获取
    async getContact() {
      const result = await api.contactQR();
      this.contactURL = result.image;
    },
    //查看消息PDF
    viewMessagePDF(_url) {
      window.open(_url);
    },
    //查看消息工单详情
    viewWorkDetails(_id) {
      this.$store.commit("upServiceIDL", _id);
      this.$router.push("/proNews/serviceDetails");
    },
    //续费会员
    async reNew() {
      const result = await api.priceList();
      const priceInfo = await api.mealInfo({ id: result[2].id });
      const orderMsg = {
        id: result[2].id,
        price1: priceInfo.price1,
        price: priceInfo.price,
        name: result[2].name,
      };
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$router.push(this.$flag ? "/mobile-place-order" : "/placeOrder");
    },
    //消息调整详情
    viewProduct() {
      const { meal_id, is_distributor } = this.app.account;
      is_distributor == 1
        ? this.$router.push("/channel-business")
        : this.$router.push(
            (meal_id == 3 && "/userCenter") ||
              (meal_id == 4 && "/userCenter") ||
              (meal_id == 1 &&
                this.app.account.one_day_try_status.status &&
                this.app.account.one_day_try_status.status == 1 &&
                "/userCenter") ||
              (meal_id == 0 && "/unVip") ||
              "/otherCenter"
          );
    },
  },
};
</script>

<style lang="scss" scoped>
.message-center {
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
  .message-list {
    widows: 100%;
    height: 80vh;
    background: $contentBg;
    margin-top: 16px;
    border-radius: 4px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /deep/ .has-gutter {
      .cell {
        color: $textColor;
        font-weight: bold;
      }
    }
    .message-oper {
      display: flex;
      justify-content: flex-end;
      .iconfont {
        font-size: 20px;
        color: $success;
        cursor: pointer;
      }
      .other-show {
        width: 20px;
        text-align: center;
      }
    }

    .page-tools {
      display: flex;
      justify-content: flex-end;
      margin-top: 36px;
    }
  }
}
</style>
