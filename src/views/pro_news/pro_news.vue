// 项目咨询
<template>
  <div class="pro-news">
    <div class="title-box">
      <p class="h4" v-if="noLimit">
        <span class="iconfont icon-tishi_tips-one"></span>
        <span v-if="app.language != 'en'">
          您订阅的<span class="high">{{ limitMsg.name }}</span
          >套餐，可咨询<span class="high">{{ limitMsg.workorder_count }}</span
          >条项目，当前已咨询 {{ limitMsg.used }} 条，剩余<span class="high">{{
            limitMsg.rest
          }}</span
          >条
        </span>
        <span v-else>
          You are the<span class="high">{{ limitMsg.name }}</span
          >and can submit<span class="high">{{ limitMsg.workorder_count }}</span
          >enquiry(s). Submitted: <span class="high">{{ limitMsg.used }}</span
          >, Remaining: <span class="high">{{ limitMsg.rest }}</span>
        </span>
      </p>
      <p class="h4" v-else>
        <span class="iconfont icon-tishi_tips-one"></span>
        <font
          v-html="
            app.language == 'en'
              ? `You are the annual subscriber and can enjoy unlimited enquiries.`
              : `您订阅的<span class='high'>
          ${
            app.account.meal_id == 3 ? '包年套餐' : '股东订阅'
          } </span>，无限制咨询条数`
          "
        ></font>
      </p>
    </div>
    <!-- 提交咨询 -->
    <div class="con-box">
      <div class="before-content" v-if="before">
        <img :src="require('@/assets/images/wait.png')" alt="" />
        <p
          class="h3"
          v-html="
            app.language == 'en'
              ? `There are currently ${proCount} enquiries in the queue`
              : `当前共有<span>${proCount}</span>条咨询正在排队处理`
          "
        ></p>
        <p
          class="h4"
          v-html="
            app.language == 'en'
              ? `Submit your enquiry now and expect to be replied on ${backDate}`
              : `当天提交咨询，预计可于<span>${backDate}</span>回复您`
          "
        ></p>
        <p>
          <base-button
            round
            type="info"
            class="submit-mobile"
            @click="$router.push('/mobile-submit-pro')"
          >
            <!-- 提交咨询 -->
            {{ $t("pro_news.sun_libray") }}
          </base-button>
          <base-button
            round
            type="default"
            class="submit-mobile"
            @click="$router.push('/mobile-library')"
          >
            <!-- 查看咨询库 -->
            {{ $t("pro_news.view_libary") }}
          </base-button>
          <base-button
            round
            type="default"
            class="submit-pc"
            @click="$router.push('/proNews/library')"
          >
            <!-- 查看咨询库 -->
            {{ $t("pro_news.view_libary") }}
          </base-button>
          <span class="label"></span>
          <base-button
            round
            type="info"
            class="submit-pc"
            @click="$router.push('/proNews/submitPro')"
          >
            <!-- 提交咨询 -->
            {{ $t("pro_news.sun_libray") }}
          </base-button>
        </p>
      </div>
      <div class="submit-pro" v-else></div>
    </div>
    <!-- 咨询列表 -->
    <p class="h4 list-title">
      <!-- 咨询列表 -->
      {{ $t("work_details.work_list") }}
    </p>
    <MyService :showmore="false" />
  </div>
</template>

<script>
import * as api from "@/request/api";
import { mapState } from "vuex";
export default {
  name: "ProNews",
  data() {
    return {
      before: true, //前置提交咨询
      proCount: "-", //排队总计
      backDate: "-", //预计回复时间
      noLimit: true, //有无限制咨询条数
      limitMsg: {
        name: "-",
        workorder_count: "-",
        rest: "-",
      }, //限制信息
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  components: {
    MyService: (resolve) => require(["../coms/my_service"], resolve),
  },
  watch: {
    defaultPagination(val, oldVal) {
      this.getWorkList();
    },
  },
  created() {
    this.getWorkStatus();
    this.getVIPStatus();
    this.getWorkList();
  },
  methods: {
    // 获取工单现状
    async getWorkStatus() {
      const result = await api.situation();
      this.proCount = result.count;
      this.backDate = result.reply_time;
    },
    //获取会员咨询工单状态
    async getVIPStatus() {
      const result = await api.userMeal();
      if (result.workorder_type == 1) {
        this.noLimit = false;
      } else {
        this.limitMsg = result;
      }
    },
    //获取会员咨询列表
    async getWorkList() {
      const result = await api.serviceList({
        limit: 10,
        page: this.defaultPagination,
      });
      this.tableData = result.data;
      this.last_page = result.last_page;
    },
    //工单详情
    goDetails(_ROW) {
      this.$store.commit("upServiceIDL", _ROW.id);
      this.$router.push("/proNews/serviceDetails");
    },
  },
};
</script>

<style lang="scss" scoped>
.pro-news {
  width: 100%;
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
        margin-right: 8px;
      }
      .high {
        color: $success;
        padding: 0 2px;
        font-weight: bold;
      }
      /deep/ .high {
        color: $success;
        padding: 0 2px;
        font-weight: bold;
      }
    }
  }
  .con-box {
    .before-content {
      padding: 120px 0;
      text-align: center;
      background: $contentBg;
      border-radius: 4px;
      margin-top: 16px;
      img {
        width: 160px;
        height: 160px;
        margin-bottom: 40px;
      }
      p {
        color: white;
        span {
          color: $success;
          padding: 0 2px;
          font-weight: bold;
        }
      }
      .h3 {
        margin-bottom: 16px;
      }
      .h4 {
        color: $textColor;
      }
      .label {
        display: inline-block;
        width: 24px;
      }
    }
  }
  .list-title {
    background: $contentBg;
    margin-bottom: -12px;
    padding-top: 24px;
    margin-top: 16px;
    border-radius: 4px 4px 0 0;
    padding-left: 24px;
    color: $textColor;
  }
}
@media screen and (min-width: 1201px) {
  .submit-mobile {
    display: none !important;
  }
}
@media screen and (max-width: 1200px) {
  .pro-news {
    .title-box {
      height: auto;
      padding: 1rem;
      .h4 {
        font-size: $fon12;
        .iconfont {
          font-size: $fon14;
        }
      }
    }
    .con-box {
      .before-content {
        padding: $padd80 0;
        img {
          width: 10rem;
          height: 10rem;
          margin-bottom: $padd40;
        }
        .h3 {
          font-size: 1rem;
          padding: 0 1rem;
        }
        .h4 {
          padding: 0 1rem;
          font-size: $fon12;
        }
        p:last-child {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .submit-pc {
            display: none;
          }
          button {
            width: 10rem;
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
}
</style>
