// 咨询库详情
<template>
  <div class="library-details">
    <p class="details-title h4">
      {{ detailsMsg.title }}({{ detailsMsg.symbol }})
    </p>
    <ul class="details-list">
      <li v-for="(qa, indexQ) in detailsMsg.content" :key="indexQ">
        <div class="question" v-if="qa.source == 1">
          <div class="question-title">
            <p class="iconfont icon-wenti_question"></p>
            <p>
              <!-- 用户 -->
              {{ $t("work_details.user") }}
            </p>
            <span>&nbsp;({{ qa.create_time }})&nbsp;</span>
          </div>
          <p class="question-content h4">{{ qa.message }}</p>
        </div>
        <div class="answer" v-else>
          <div class="answer-title">
            <p class="iconfont icon-huida_answer"></p>
            <p>
              <!-- 分析师 -->
              {{ $t("work_details.ana") }}
            </p>
            <span>&nbsp;({{ qa.create_time }})&nbsp;</span>
          </div>
          <p class="answer-content h5" v-if="qa.type == 1">{{ qa.message }}</p>
          <a
            class="answer-content h5"
            :href="qa.message"
            target="_blank"
            v-if="qa.type == 3"
          >
            <!-- 查看研报 -->
            {{ $t("project_info.view_reports") }}
          </a>
        </div>
      </li>
    </ul>
    <div class="libiary-oper">
      <p round @click="$router.go(-1)">
        <span class="iconfont icon-fanhui_return"></span>
        <!-- 返回 -->
        {{ $t("public.back") }}
      </p>
      <span class="libiary-line" v-if="detailsMsg.is_pdf == 1"></span>
      <p @click="downPdf(detailsMsg.pdf)" v-if="detailsMsg.is_pdf == 1">
        <!-- v-if="detailsMsg.is_pdf == 1" -->
        <span class="iconfont icon-xiazai_download"></span>
        <!-- 下载研报 -->
        {{ $t("project_info.down_load") }}
      </p>
      <base-button
        type="info"
        round
        @click="
          $store.dispatch('setPoint', 12);
          $router.push({
            path: '/proNews/submitPro',
            query: {
              name: detailsMsg.title,
              symbol: detailsMsg.symbol,
            },
          });
        "
      >
        <!-- 我也有问题 -->
        {{ $t("work_details.has_too") }}
      </base-button>
    </div>
  </div>
</template>

<script>
import { libraryDetails } from "@/request/api";
import { mapState } from "vuex";
import { downPDF } from "@/util/index";
export default {
  name: "LibraryDetails",
  data() {
    return {
      titleMsg: {},
      detailsMsg: {
        title: "-",
        symbol: "-",
        content: [],
      },
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getLibraryDetails();
  },
  methods: {
    async getLibraryDetails() {
      const result = await libraryDetails({ id: this.app.libraryID });
      this.detailsMsg = result;
    },
    downPdf(_url) {
      downPDF(_url);
    },
  },
};
</script>

<style lang="scss" scoped>
.library-details {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  .details-title {
    padding-bottom: 16px;
    border-bottom: 1px solid $lineColor;
    font-weight: bold;
    color: $success;
    span {
      font-weight: normal;
      color: $textColor;
    }
  }
  .details-list {
    border-bottom: 1px solid $lineColor;
    .iconfont {
      font-size: 16px;
    }
    .question-title {
      display: flex;
      align-items: center;
      p {
        color: $remarkColor;
      }
      p:nth-child(2) {
        margin-left: 8px;
      }
      p:last-child {
        margin-left: 8px;
      }
      span {
        font-size: 12px;
        color: $remarkColor;
        transform: translateY(1px);
      }
    }
    .question-content {
      font-weight: bold;
      color: white;
      margin-bottom: 24px;
      box-sizing: border-box;
      padding-left: 24px;
      margin-top: 4px;
      word-break: break-all;
    }
    .answer-title {
      display: flex;
      align-items: center;
      p {
        color: $success;
      }
      p:nth-child(2) {
        margin-left: 8px;
      }
      p:last-child {
        margin-left: 8px;
      }
      span {
        font-size: 12px;
        color: $remarkColor;
        transform: translateY(1px);
      }
    }
    .answer-content {
      color: $textColor;
      margin-bottom: 40px;
      box-sizing: border-box;
      padding-left: 24px;
      margin-top: 8px;
      line-height: 24px;
      word-break: break-all;
      display: inline-block;
    }
    a {
      text-decoration: underline;
      color: $primary !important;
    }
  }
  .libiary-oper {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-top: 22px;
    .libiary-line {
      display: inline-block;
      width: 1px;
      height: 20px;
      background: $lineTwoColor;
      transform: translateY(1px);
      margin: 0 24px;
    }
    p {
      color: white;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 20px;
        margin-right: 8px;
      }
    }
    button {
      margin-left: 40px;
    }
  }
}
</style>