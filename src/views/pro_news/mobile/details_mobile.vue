// 移动端咨询库详情
<template>
  <div class="library-details-mobile">
    <MobileNav>
      <p>
        <!-- 咨询信息 -->
        {{ $t("routes.en_infor") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="library-details-inner">
        <p class="details-title">
          {{ details.title }}({{ details.symbol }})
        </p>
        <p class="split-line"></p>
        <ul class="details-list">
          <li v-for="(qa, indexQ) in details.content" :key="indexQ">
            <div class="question" v-if="qa.source == 1">
              <div class="question-title">
                <p class="iconfont icon-wenti_question"></p>
                <p>
                  <!-- 用户 -->
                  {{ $t("work_details.user") }}
                </p>
                <span>({{ qa.create_time }})</span>
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
                <span>({{ qa.create_time }})</span>
              </div>
              <p class="answer-content h5" v-if="qa.type == 1">
                {{ qa.message }}
              </p>
              <a
                class="answer-content h5"
                :href="qa.message"
                v-if="qa.type == 3"
                target="_blank"
              >
                <!-- 查看研报 -->
                {{ $t("project_info.view_reports") }}
              </a>
            </div>
          </li>
        </ul>
        <p class="split-line"></p>
        <div class="oper-box">
          <p v-if="details.is_pdf == 1" @click="downPdf(details.pdf)">
            <span class="iconfont icon-xiazai_download" v-if="!$flag"></span>
            <!-- 下载研报 -->
            {{
              $flag
                ? $t("project_info.view_reports")
                : $t("project_info.down_load")
            }}
          </p>
          <base-button
            type="info"
            round
            style="width: 100%"
            @click="
              $store.dispatch('setPoint', 12);
              $router.push({
                path: '/mobile-submit-pro',
                query: {
                  name: details.title,
                  symbol: details.symbol,
                },
              });
            "
          >
            <!-- 我也有问题 -->
            {{ $t("work_details.has_too") }}
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { libraryDetails } from "@/request/api";
import { downPDF } from "@/util/index";
export default {
  name: "DetailsLibraryMobile",
  data() {
    return {
      details: {},
    };
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
  },
  created() {
    this.getDetails();
  },
  methods: {
    async getDetails() {
      this.details = await libraryDetails({ id: this.$route.query.id });
    },
    downPdf(_url) {
      downPDF(_url);
    },
  },
};
</script>

<style lang="scss" scoped>
.view-inner-mobile {
  padding: 4rem 1rem;
}
.library-details-inner {
  padding: $padd24;
  background: $contentBg;
  border-radius: 4px;
  .details-title {
    font-size: $fon14;
    color: $success;
    font-weight: bold;
    span {
      margin-left: 0.3rem;
      color: $textColor;
      font-weight: normal;
    }
  }
  .details-list {
    .iconfont {
      font-size: 1rem;
      margin-left: 0 !important;
    }
    .question-title {
      display: flex;
      align-items: center;
      p {
        color: $remarkColor;
        margin-left: 0.5rem;
      }
      span {
        font-size: $fon12;
        color: $remarkColor;
        transform: translateY(1px);
      }
    }
    .question-content {
      font-weight: bold;
      color: white;
      margin-bottom: $padd24;
      box-sizing: border-box;
      padding-left: $padd24;
      margin-top: 0.25rem;
      word-break: break-all;
    }
    .answer-title {
      display: flex;
      align-items: center;
      p {
        color: $success;
        margin-left: 0.5rem;
      }
      span {
        font-size: $fon12;
        color: $remarkColor;
        transform: translateY(1px);
      }
    }
    .answer-content {
      color: $textColor;
      margin-bottom: $padd40;
      box-sizing: border-box;
      padding-left: $padd24;
      margin-top: 0.5rem;
      line-height: $padd24;
      word-break: break-all;
    }
    a {
      text-decoration: underline;
      color: $primary !important;
    }
  }
  .oper-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      width: 45%;
      text-align: center;
      font-size: $fon14;
      color: $textColor;
      .iconfont {
        font-size: 1rem;
      }
    }
    button {
      flex: 1;
    }
  }
}
</style>