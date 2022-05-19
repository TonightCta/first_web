// 内容
<template>
  <div class="inner-details">
    <MobileNav>
      <p>
        <!-- 原文详情 -->
        {{ $t("bureau_evs.full") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div
        class="content-box"
        v-html="contentInfo"
        v-loading="loadContent"
      ></div>
      <div class="trans-box" v-if="isTrans == 1">
        <p>
          <!-- 翻译由DEEPL提供 -->
          {{ $t("bureau_evs.deep_remark") }}
        </p>
        <base-button
          type="info"
          class="other-info"
          round
          @click="transStatus = !transStatus"
        >
          <i class="iconfont icon-fanyi_translation"></i>
          {{ transStatus ? "English Version" : "翻译成中文" }}
        </base-button>
      </div>
    </div>
  </div>
</template>

<script>
import { infoContent, infoContentZh } from "@/request/api";
export default {
  data() {
    return {
      contentInfo: null, //提案内容
      transStatus: false, //翻译状态
      loadContent: false, //提案加载load
      isTrans: 0, //是否有译文
    };
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
  },
  watch: {
    transStatus(val) {
      val && this.getContentZH();
      !val && this.getContent();
    },
  },
  created() {
    this.contentID = this.$route.query.id;
    this.isTrans = this.$route.query.isTrans;
    this.getContent();
  },
  methods: {
    async getContent() {
      this.loadContent = true;
      const result = await infoContent({ id: this.contentID });
      this.contentInfo = result.content;
      this.loadContent = false;
    },
    async getContentZH() {
      this.loadContent = true;
      const result = await infoContentZh({ id: this.contentID });
      this.contentInfo = result.content;
      this.loadContent = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.view-inner-mobile {
  padding: 4rem 1rem;
  min-height: 100px;
  .content-box {
    font-size: $fon14;
    color: white;
    line-height: $fon18;
    padding-bottom: 4rem;
    /deep/ h1 {
      margin-bottom: 1rem;
    }
    /deep/ h2 {
      margin-bottom: 1rem;
    }
    /deep/ h3 {
      margin-bottom: 1rem;
    }
    /deep/ h4 {
      margin-bottom: 1rem;
    }
    /deep/ h5 {
      margin-bottom: 1rem;
    }
    /deep/ strong {
      margin-bottom: 1rem;
    }
    /deep/ p {
      margin-bottom: 1rem;
      font-size: $fon14;
      line-height: $fon18;
      word-break: break-all;
    }
    /deep/ ul {
      li {
        margin-bottom: 1rem;
      }
    }
    /deep/ li {
      padding-left: 1rem;
    }
    /deep/ blockquote {
      word-break: break-all;
      border-left: 6px solid $textColor;
      padding-left: 0.5rem;
    }
    /deep/ pre {
      padding: 1rem;
      border-radius: 4px;
      background: $textColor;
      code {
        color: $titleColor;
        word-break: break-all;
        white-space: normal;
      }
    }
    /deep/ table {
      th {
        padding: 1rem;
        border: 1px solid $textColor;
      }
      td {
        padding: 0.5rem;
      }
    }
    /deep/ br {
      content: "";
      display: block;
      height: 4px;
    }
    /deep/ ol {
      li {
        margin-bottom: 1rem;
      }
    }
    /deep/ img {
      margin-bottom: 1rem;
    }
    /deep/ br {
      display: none;
    }
  }
  .trans-box {
    padding: $padd24;
    padding-bottom: 0;
    padding-top: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: saturate(180%) blur(6px);
    p {
      width: 100%;
      text-align: center;
      color: white;
      margin: 0.5rem 0;
      font-size: $fon12;
    }
    button {
      width: 100%;
      height: 2rem;
      margin-bottom: 0.5rem;
    }
  }
}
</style>