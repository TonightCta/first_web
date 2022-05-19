// 登录失败
<template>
  <div class="login-failed">
    <modal :show.sync="failedBox" modalClasses="login-box-modal">
      <div class="failed-box">
        <p class="icon-box">
          <span class="iconfont icon-guanbi_close"></span>
        </p>
        <p>你的账号存在异常，已被冻结，如有疑问，请联系头等仓销售顾问。</p>
        <div>
          <base-button type="default" round @click="failedBox = false"
            >取消</base-button
          >
          <p></p>
          <base-button type="info" round @click="contactBox = true"
            >联系顾问</base-button
          >
        </div>
      </div>
    </modal>
    <modal :show.sync="contactBox" modalClasses="login-box-modal">
      <div style="text-align: center">
        <img :src="contactQR" alt="" />
        <p class="contact-qr">
          顾问微信:<span>{{ contactWechat }}</span>
        </p>
        <p class="close-qr">
          <base-button type="default" round @click="contactBox = false"
            >关闭</base-button
          >
          <span v-if="$flag" class="label"></span>
          <base-button
            type="info"
            round
            v-if="$flag"
            class="copy"
            @click="copyCode"
            :data-clipboard-text="contactWechat"
            >立即复制</base-button
          >
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { contactQR } from "@/request/api";
import Clipboard from "clipboard";
export default {
  name: "LoginFailed",
  data() {
    return {
      failedBox: false, //账号冻结
      contactBox: false, //客服二维码
      contactQR: null, //客服二维码
      contactWechat: null, //客服微信
    };
  },
  components: { Modal },
  created() {
    this.getMsg();
  },
  mounted() {
    window.openFailed = this.openFailed;
  },
  methods: {
    openFailed() {
      this.failedBox = true;
    },
    getMsg() {
      contactQR().then((res) => {
        this.contactQR = res.image;
        this.contactWechat = res.nickname;
      });
    },
    //复制客服微信号
    copyCode() {
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          // 复制成功
          message: this.$t('notify.copy_success'),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          message: "复制失败,请稍后再试",
        });
        clipboard.destroy();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.failed-box {
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: $danger;
    margin: 0 auto;
    .iconfont {
      font-size: 24px;
      color: white;
    }
  }
  p {
    margin-top: 24px;
  }
  div {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    p {
      width: 16px;
    }
  }
}
img {
  width: 160px;
  height: 160px;
  margin: 0 auto;
}
.close-qr {
  text-align: center;
  margin-top: 16px;
}
.label {
  display: inline-block;
  width: 1rem;
}
.contact-qr {
  span {
    font-weight: bold;
    margin-left: 0.5rem;
  }
}
@media screen and (min-width: 1280px) {
  .contact-qr {
    display: none;
  }
}
@media screen and (max-width: 1279px) {
  img {
    display: none;
  }
}
</style>