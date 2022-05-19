// 原文盒子
<template>
  <div>
    <!-- 事件原文 -->
    <modal :show.sync="infoBox" modalClasses="read-original-box">
      <div class="posal-box-inner" v-loading="loadContent">
        <div class="inner-content" v-if="app.language == 'en'">
          <div class="inner-text" v-html="infoContent"></div>
        </div>
        <div class="inner-content" v-else>
          <div
            class="inner-text"
            v-if="languageStatus"
            v-html="infoContentZH"
          ></div>
          <div class="inner-text" v-else v-html="infoContent"></div>
        </div>
        <!-- 操作 -->
        <div class="inner-oper" :class="{ 'two-btn': isTrans == 1 }">
          <!-- <p v-if="$flag" class="mobile-deep">翻译由DEEPL提供</p> -->
          <p>
            <base-button
              type="defalut"
              round
              @click="
                infoContent = null;
                infoContentZH = null;
                infoBox = false;
                languageStatus = false;
              "
            >
              <!-- 关闭 -->
              {{ $t("public.close") }}
            </base-button>
          </p>
          <p class="inner-label"></p>
          <p v-if="isTrans == 1 && app.language != 'en'">
            <!-- <span
              >翻译自<font @click="viewOffcial('https://deepl.com')"
                >deepl.com</font
              ></span
            > -->
            <el-popover
              placement="right"
              trigger="hover"
              :content="$t('bureau_evs.deep_remark')"
              v-if="translateStatus == 1 || translateStatus == 0"
            >
              <!-- 翻译由DEEPL提供 -->
              <base-button
                type="info"
                round
                class="other-info"
                slot="reference"
                @click="getContent()"
              >
                <i class="iconfont icon-fanyi_translation"></i>
                {{ languageStatus ? "English Version" : "翻译成中文" }}
              </base-button>
            </el-popover>
            <base-button
              class="other-info"
              round
              v-if="translateStatus == 2"
              disabled="disabled"
            >
              <i class="iconfont icon-fanyi_translation"></i>
              翻译中
            </base-button>
          </p>
        </div>
      </div>
    </modal>
    <!-- 提交翻译 -->
    <TranslateSub ref="translateSub" />
  </div>
</template>

<script>
import { Modal } from "@/components";
import { infoContent, infoContentZh } from "@/request/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      infoBox: false,
      languageStatus: false, //翻译状态
      loadContent: false, //内容加载
      infoContent: null, //原文内容
      infoContentZH: null, //原文翻译内容
      isTrans: 0,
      contentID: null,
      translateStatus: 0,
    };
  },
  watch: {
    infoBox(val) {
      val && this.getInfoContent();
      !val && (this.translateStatus = 0);
    },
  },
  computed: {
    ...mapState(["app"]),
  },
  components: {
    Modal,
    TranslateSub: (resolve) =>
      require(["./mine_bureau/sub_translate"], resolve),
  },
  methods: {
    getProps(_id, _is_trans) {
      this.contentID = _id;
      this.isTrans = _is_trans;
      this.infoBox = true;
    },
    //获取内容原文
    async getInfoContent() {
      if (this.app.isBureau == 0) {
        this.$store.dispatch("readPDF", { _type: 5, _id: this.contentID });
      }
      this.loadContent = true;
      const result = await infoContent({ id: this.contentID });
      this.infoContent = result.content;
      // this.translateStatus = result.tran;
      this.loadContent = false;
    },
    //获取内容译文
    async getInfoContentZh() {
      this.loadContent = true;
      const result = await infoContentZh({ id: this.contentID });
      this.translateStatus = result.tran;
      if (result.tran == 2) {
        this.$refs.translateSub.subTranslate = true;
        this.languageStatus = false;
        this.getInfoContent();
      } else {
        this.infoContentZH = result.content;
      }
      this.loadContent = false;
    },
    //获取内容
    getContent() {
      this.languageStatus = !this.languageStatus;
      this.languageStatus ? this.getInfoContentZh() : this.getInfoContent();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-dialog {
  z-index: 4020 !important;
}
.posal-box-inner {
  padding: 24px 24px 32px 24px;
  position: relative;
  /deep/ .el-loading-spinner .path {
    stroke: $contentBg;
  }
  .inner-title {
    font-size: 17px;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 28px;
    display: none;
  }
  .inner-content {
    width: 100%;
    height: 70vh;
    overflow-y: auto;
    padding-right: 16px;
    .inner-text {
      margin: 0 auto;
      font-size: 12px;
      color: #676c7a;
      line-height: 18px;
      margin-bottom: 24px;
      // text-align: center;
      /deep/ h1 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ h2 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ h3 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ h4 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ h5 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ strong {
        color: $titleColor;
        margin: 16px 0;
        margin-right: 8px;
      }
      /deep/ p {
        color: $titleColor;
        margin: 16px 0;
        font-size: 14px;
        word-break: break-all;
      }
      /deep/ ul {
        li {
          margin: 16px 0;
          color: $titleColor;
        }
      }
      /deep/ li {
        padding-left: 16px;
      }
      /deep/ blockquote {
        word-break: break-all;
        border-left: 6px solid $textColor;
        padding-left: 8px;
      }
      /deep/ pre {
        padding: 16px;
        border-radius: 4px;
        background: $textColor;
        code {
          color: $titleColor;
        }
      }
      /deep/ table {
        th {
          padding: 16px;
          border: 1px solid $textColor;
        }
        td {
          padding: 8px;
        }
        tr {
          border: 1px solid $textColor;
        }
        td {
          border: 1px solid $textColor;
        }
      }
      /deep/ br {
        content: "";
        display: block;
        height: 4px;
      }
      /deep/ ol {
        li {
          margin: 16px 0;
          color: $titleColor;
        }
      }
      /deep/ img {
        margin: 16px 0;
      }
    }
  }
  .inner-oper {
    width: 100%;
    position: absolute;
    bottom: -104px;
    display: flex;
    justify-content: center;
    left: 0;
    .inner-label {
      width: 16px;
      display: none;
    }
    .mobile-deep {
      top: -2rem;
      font-size: $fon12;
      color: white;
      position: absolute;
    }
    p:last-child {
      span {
        margin-right: 24px;
        color: $remarkColor;
        font-size: 12px;
        font {
          color: $iconColor;
          cursor: pointer;
          margin-left: 2px;
        }
      }
    }
  }
  .two-btn {
    .inner-label {
      display: block;
    }
  }
}
</style>