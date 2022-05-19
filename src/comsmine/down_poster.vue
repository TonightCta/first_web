// 下载海报
<template>
  <div class="down-poster" v-if="posterBg">
    <modal :show.sync="isShow" :append-to-body="true">
      <div>
        <!-- <div class="poster-mask" @click="testClose"></div> -->
        <div class="show-poster">
          <div class="poster-inner">
            <p v-if="$flag" class="mobile-title">
              <!-- 带有您推荐码的专属海报 -->
              {{ $t("poster.poster_title") }}
            </p>
            <p class="img-box">
              <img :src="posterURL" alt="" />
            </p>
            <p v-if="!$flag" class="pc-remark">
              <!-- 带有您推荐码的专属海报 -->
              {{ $t("poster.poster_title") }}
            </p>
            <p v-if="!$flag" class="pc-oper">
              <base-button type="default" round @click.stop="testClose">
                <!-- 关闭 -->
                {{ $t("public.close") }}
              </base-button>
              <base-button
                type="info"
                :class="app.isBureau == 1 && 'other-info'"
                round
              >
                <a href="" id="download" download>
                  <!-- 保存本地 -->
                  {{ $t("poster.down_loca") }}
                </a>
              </base-button>
            </p>
            <p class="mobile-remark" v-if="$flag">
              <span class="iconfont icon-guangbo_broadcast"></span>
              <!-- 长按缩略图保存 -->
              {{ $t("poster.click_loca") }}
            </p>
            <p class="mobile-close" v-if="$flag" @click="testClose">
              <span class="iconfont icon-guanbi-xiao_close-small"></span>
            </p>
          </div>
        </div>
      </div>
    </modal>
    <base-button
      type="info"
      round
      :class="app.isBureau == 1 && 'other-info'"
      @click="createPoster"
      v-if="!$flag"
    >
      <i class="iconfont icon-xiazai_download"></i>
      <font>
        <!-- 下载专属海报 -->
        {{ $t("poster.down_poster") }}
      </font>
    </base-button>
    <p v-else class="copy-icon" @click="createPoster">
      <i class="iconfont icon-xiazai_download"></i>
    </p>
    <div
      class="down-content"
      :style="{ background: `url(${posterBg})` }"
      id="down-content"
      ref="downContent"
    >
      <div
        class="qr-box"
        id="qr-box"
        :style="{
          width: `${posotionMsg.width}px`,
          height: `${posotionMsg.height}px`,
          left: `${posotionMsg.left}px`,
          top: `${posotionMsg.top}px`,
          right: `${posotionMsg.right}px`,
          bottom: `${posotionMsg.bottom}px`,
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import QRCode from "qrcode2";
import html2canvas from "html2canvas";
import { Loading } from "element-ui";
import { Modal } from "../components";
import { getPoster } from "@/request/api";
export default {
  data() {
    return {
      openPriview: "",
      isShow: false,
      qrUrl: null,
      posterURL: null,
      posterBg: null,
      posotionMsg: {
        width: "",
        height: "",
        top: "",
        left: "",
        bottom: "",
        right: "",
      },
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  components: {
    Modal,
  },
  created() {
    this.getPosterBg();
    this.app.account.code
      ? (this.qrUrl = `${process.env.VUE_APP_RESET}/#/index?code=${this.app.account.code}`)
      : (this.qrUrl = `${process.env.VUE_APP_RESET}/#/index?open=1`);
  },
  mounted() {},
  methods: {
    //获取海报背景
    async getPosterBg() {
      const result = await getPoster();
      this.posterBg = result.image;
      this.$set(this.posotionMsg, "width", result.width);
      this.$set(this.posotionMsg, "height", result.height);
      this.$set(this.posotionMsg, "top", result.top == 0 ? "" : result.top);
      this.$set(this.posotionMsg, "left", result.left == 0 ? "" : result.left);
      this.$set(
        this.posotionMsg,
        "right",
        result.right == 0 ? "" : result.right
      );
      this.$set(
        this.posotionMsg,
        "bottom",
        result.bottom == 0 ? "" : result.bottom
      );
      this.posterBg && this.createQR();
    },
    //生成海报
    createPoster() {
      this.$store.dispatch("setPoint", this.app.isBureau == 1 ? 15 : 4);
      const options = {
        lock: true,
        text: `${this.$t("poster.poster_load")}...`,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      };
      const loading = Loading.service(options);
      (window.html2canvas || html2canvas)(this.$refs.downContent, {
        useCORS: true,
        y: window.pageYOffset,
      }).then((canvas) => {
        let dataURL = canvas.toDataURL("image/png");
        this.posterURL = dataURL;
        if (this.posterURL != "") {
          this.isShow = true;
          loading.close();
          setTimeout(() => {
            this.openPriview = "open-preview";
            if (!this.$flag) {
              let OA = document.querySelector("#download");
              //头等仓年终特惠
              OA.download = this.$t("poster.poster_name");
              OA.href = dataURL;
            }
          }, 20);
        }
      });
    },
    testOpen() {
      this.isShow = true;
      setTimeout(() => {
        this.openPriview = "open-preview";
      }, 30);
    },
    testClose() {
      this.openPriview = "";
      setTimeout(() => {
        this.isShow = false;
      }, 300);
    },
    //生成地址二维码
    createQR() {
      let qrcode = new QRCode("qr-box", {
        width: this.posotionMsg.width - 10,
        height: this.posotionMsg.height - 10,
        text: this.qrUrl,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .modal-dialog {
  width: 375px;
  max-width: 375px;
  margin: 0 auto;
  transform: translate(0, 10%) !important;
}
/deep/ .modal-body {
  padding: 0;
  width: 100%;
  margin: 0 auto;
}
/deep/ .modal-content {
  background: rgba(0, 0, 0, 0);
  box-shadow: none;
}
.down-poster {
  margin-left: 16px;
  overflow: hidden;
  button {
    white-space: nowrap;
  }
}
.poster-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9000;
  opacity: 0;
  transition: 0.3s all;
  // transform: translateZ(1000px);
}
.show-poster {
  width: 400px;
  height: 820px;
  .poster-inner {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 200;
    .mobile-title {
      font-size: $fon14;
      margin-bottom: 1rem;
      text-align: center;
      color: white;
    }
    .mobile-remark {
      width: 10rem;
      height: $padd40;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f6fa;
      transform: translateY(-4rem);
      .iconfont {
        font-size: $padd24;
        color: $remarkColor;
        margin-right: 0.5rem;
      }
      font-size: $fon12;
      color: #4d4d4d;
      border-radius: $fon20;
      margin: 0 auto;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
    }
    .mobile-close {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 1px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      transform: translateY(-1rem);
      .iconfont {
        font-size: $padd24;
        color: white;
      }
    }
    .img-box {
      width: 100%;
      height: 717px;
      padding: 2px;
      background: white;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .pc-remark {
      margin-top: 16px;
      font-size: 14px;
      color: white;
      text-align: center;
    }
    .pc-oper {
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin-top: 24px;
      a {
        color: white;
        font-weight: bold;
      }
    }
  }
}
.open-preview {
  // transform: translateY(0)  translateZ(1000px);
  opacity: 1;
}
.down-content {
  width: 750px;
  height: 1334px;
  position: fixed;
  top: -5000px;
  left: 50%;
  // top:100px;
  // left: 30%;
  z-index: 200;
  // background: url("../assets/images/poster_bg_2.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .qr-box {
    // width: 120px;
    // height: 120px;
    position: absolute;
    background: white;
    // right: 50px;
    // bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.copy-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: $info;
  cursor: pointer;
  .iconfont {
    font-size: 1rem;
  }
}
@media screen and (max-width: 1279px) {
  /deep/ .modal-dialog {
    width: 18.75rem;
    max-width: 18.75rem;
  }
  .show-poster {
    width: 18.75rem;
    height: 39rem;
    .poster-inner {
      .img-box {
        height: 33rem;
      }
    }
  }
}
</style>