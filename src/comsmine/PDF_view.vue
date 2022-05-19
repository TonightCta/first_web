<template>
  <div>
    <!-- PDF.js -- 新版 -->
    <div v-if="PDFBox" class="pdf-view">
      <iframe
        :src="'/generic/web/viewer.html?file=' + PDFUrl + '#view=FitH,top'"
        height="100%"
        width="100%"
        target="blank"
      ></iframe>
      <div class="view-inner-oper" :class="showTools">
        <span
          class="iconfont icon-fanhui_return"
          @click="
            PDFBox = false;
            showTools = null;
            $store.commit('upViewStatus', 3);
          "
        ></span>
        <div class="inner-other">
          <div style="display: flex; align-items: center">
            <p class="iconfont icon-shuji_book"></p>
            <p class="inner-title">
              <span>
                <!-- 1号阅读器 -->
                {{ $t("public.reader_1") }}
              </span>
              <span @click="chooseViewType = true">
                <!-- 切换 -->
                {{ $t("public.switch") }}
              </span>
            </p>
          </div>
          <p class="inner-oper">
            <base-button type="info" round @click="downLoad">
              <!-- 下载PDF -->
              {{ $t("public.down_pdf") }}
            </base-button>
          </p>
        </div>
      </div>
    </div>
    <!-- PDF.js -- 旧版 -->
    <div v-if="PDFBoxOld" class="pdf-view">
      <iframe
        :src="
          '/generic-legacy/web/viewer.html?file=' + PDFUrl + '#view=FitH,top'
        "
        height="100%"
        width="100%"
        scrolling="no"
        allowfullscreen
        webkitallowfullscreen
      ></iframe>
      <div class="view-inner-oper" :class="showTools">
        <span
          class="iconfont icon-fanhui_return"
          @click="
            PDFBoxOld = false;
            showTools = null;
            $store.commit('upViewStatus', 3);
          "
        ></span>
        <div class="inner-other">
          <div style="display: flex; align-items: center">
            <p class="iconfont icon-shuji_book"></p>
            <p class="inner-title">
              <span>
                <!-- 2号阅读器 -->
                {{ $t("public.reader_2") }}
              </span>
              <span @click="chooseViewType = true">
                <!-- 切换 -->
                {{ $t("public.switch") }}
              </span>
            </p>
          </div>
          <p class="inner-oper">
            <base-button type="info" round @click="downLoad">
              <!-- 下载PDF -->
              {{ $t("public.down_pdf") }}
            </base-button>
          </p>
        </div>
      </div>
    </div>
    <!-- 待定 -->
    <modal :show.sync="chooseViewType" modalClasses="login-box-modal">
      <div class="choose-view-type">
        <p class="type-title">
          <!-- 选择PDF阅读器 -->
          {{ $t("public.choice_reader") }}
        </p>
        <ul>
          <li
            @click="
              chooseViewType = false;
              PDFBox = true;
              PDFBoxOld = false;
              showTools = null;
              showToolsEv();
              $store.commit('upViewStatus', 0);
            "
          >
            <span class="iconfont icon-anjianyi_one-key"></span>
            <p>
              <span>
                <!-- 1号阅读器 -->
                {{ $t("public.reader_1") }}
              </span>
              <span>
                <!-- 体验一般，适用最新版本浏览器 -->
                {{ $t("public.reader_1_remark") }}
              </span>
            </p>
          </li>
          <li
            @click="
              chooseViewType = false;
              PDFBox = false;
              PDFBoxOld = true;
              showTools = null;
              showToolsEv();
              $store.commit('upViewStatus', 1);
            "
          >
            <span class="iconfont icon-anjianer_two-key"></span>
            <p>
              <span>
                <!-- 2号阅读器 -->
                {{ $t("public.reader_2") }}
              </span>
              <span>
                <!-- 体验一般，适用最老版本浏览器 -->
                {{ $t("public.reader_2_remark") }}
              </span>
            </p>
          </li>
          <li @click="googleView">
            <span class="iconfont icon-guge_google"></span>
            <p>
              <span>
                <!-- 谷歌阅读器 -->
                {{ $t("public.reader_google") }}
              </span>
              <span>
                <!-- 体验较好，但国内网络无法使用 -->
                {{ $t("public.reader_google_remark") }}
              </span>
            </p>
          </li>
        </ul>
        <p class="type-remark">
          <span>
            <!-- 如果以上阅读器您都无法使用 -->
            {{ $t("public.reader_failed_1") }}
          </span>
          <span>
            <!-- 建议您可以直接下载研报PDF到本机阅读 -->
            {{ $t("public.reader_failed_2") }}
          </span>
        </p>
        <p class="oper-btn">
          <base-button type="default" round @click="chooseViewType = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
          <span class="label"></span>
          <base-button type="info" round @click="downLoad">
            <!-- 下载PDF -->
            {{ $t("public.down_pdf") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>
<script>
import { Modal } from "@/components";
import { mapState } from "vuex";
export default {
  data() {
    return {
      PDFUrl: "",
      PDFBox: false, //阅读器查看
      PDFBoxOld: false, //旧版阅读器查看
      chooseViewType: false, //阅读方式
      showTools: null,
      downUrl: null,
    };
  },
  components: {
    Modal,
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    const { viewStatus, viewUrl } = this.app;
    this.PDFUrl = viewUrl;
    viewStatus == 0 && ((this.PDFBox = true), this.showToolsEv());
    viewStatus == 1 && ((this.PDFBoxOld = true), this.showToolsEv());
  },
  mounted() {
    window.viewPDF = this.viewPDF;
  },
  methods: {
    //阅读器查看PDF
    viewPDF(_type, _id, _device, _is_old) {
      if (_type.length > 2) {
        this.PDFUrl = encodeURIComponent(_type);
        this.downUrl = _type;
      } else {
        this.PDFUrl = encodeURIComponent(
          process.env.VUE_APP_BASEURL +
            "/pdf/previewPdf?token=" +
            this.app.token +
            "&type=" +
            _type +
            "&id=" +
            _id +
            "&device=" +
            _device +
            "&is_old=" +
            _is_old
        );
        this.downUrl =
          process.env.VUE_APP_BASEURL +
          "/pdf/previewPdf?token=" +
          this.app.token +
          "&type=" +
          _type +
          "&id=" +
          _id +
          "&device=" +
          _device +
          "&is_old=" +
          _is_old;
      }
      this.$store.commit("upViewUrl", this.PDFUrl);
      this.chooseViewType = true;
    },
    //谷歌阅读器
    googleView() {
      window.open(
        "https://docs.google.com/viewerng/viewer?url=" + this.downUrl
      );
    },
    //下载PDF
    downLoad() {
      window.open(this.downUrl);
    },
    showToolsEv() {
      setTimeout(() => {
        this.showTools = "show-tools";
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.show-tools {
  transform: translateY(0) !important;
  opacity: 1 !important;
}
.pdf-view {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2989;
  width: 100%;
  height: 100vh;
  .view-inner-oper {
    position: fixed;
    bottom: $padd24;
    width: 90%;
    left: 5%;
    border-radius: 4px;
    display: flex;
    height: $size48;
    align-items: center;
    justify-content: space-between;
    transform: translateY(50px);
    transition: 0.3s all;
    opacity: 0;
    .icon-fanhui_return {
      font-size: $fon20;
      color: #0f62fe;
      box-shadow: 0px 3px 4px rgba(11, 5, 26, 0.12);
      background: white;
      width: $size48;
      height: $size48;
      margin-right: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #efefef;
    }
    .inner-other {
      display: flex;
      align-items: center;
      height: 100%;
      flex: 1;
      background: white;
      box-shadow: 0px 3px 4px rgba(11, 5, 26, 0.12);
      justify-content: space-between;
      border-radius: 4px;
      border: 1px solid #efefef;
      padding: 0 1rem;
      p {
        color: $titleColor;
      }
      .iconfont {
        color: $remarkColor;
      }
      .inner-title {
        display: flex;
        font-size: $fon12;
        margin-left: 0.6rem;
        span:first-child {
          color: $titleColor;
          font-weight: bold;
          font-size: 0.8rem;
        }
        span:last-child {
          color: #0f62fe;
          margin-left: 0.5rem;
        }
      }
    }
  }
}
.choose-view-type {
  padding: 2rem 0;
  .type-title {
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    color: $titleColor;
  }
  ul {
    margin: $padd24 0;
    li {
      height: 4.125rem;
      display: flex;
      align-items: center;
      border: 1px solid #efefef;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      padding: 0 1rem;
      .iconfont {
        color: #33b1ff;
        font-size: 1rem;
        margin-right: 0.5rem;
      }
      p {
        display: flex;
        flex-direction: column;
        span {
          font-size: $fon12;
          color: $titleColor;
        }
        span:last-child {
          color: #676c7a;
        }
      }
    }
    li:last-child {
      margin-bottom: 0;
    }
  }
  .type-remark {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: $fon12;
    color: $titleColor;
  }
  .oper-btn {
    width: 100%;
    text-align: center;
    margin-top: $padd24;
    span {
      display: inline-block;
      width: 1rem;
    }
  }
}
</style>