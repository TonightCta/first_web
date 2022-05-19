<template>
  <div class="footer-rights" v-if="!$flag">
    <div>
      <img :src="require('@/assets/images/firstLogo.png')" alt="" />
      <p class="rights-title">
        <!-- © 2021 头等仓. All rights reserved. -->
        {{ $t("index.contact.con_min") }}
      </p>
      <p
        class="rights-title"
        style="margin-left: 24px; cursor: pointer"
        @click="openView"
      >
        <!-- 闽ICP备18013148号-2 -->
        {{ $t("index.contact.con_min_2") }}
      </p>
    </div>
    <div>
      <a href="https://twitter.com/firstvip61" target="_blank">
        <p class="iconfont icon-qingbaoju_tuite"></p>
      </a>
      <a
        href="https://weibo.com/u/7469273067?from=myfollow_all&is_all=1"
        target="_blank"
        v-if="app.language != 'en'"
      >
        <p class="iconfont icon-weibo"></p>
      </a>
      <a href="mailto:marketing@first.vip" target="_blank">
        <p class="iconfont icon-youjian"></p>
      </a>
      <el-popover placement="top" trigger="hover" v-if="app.language != 'en'">
        <img :src="contactQR" style="width: 160px; height: 160px" alt="" />
        <p class="iconfont icon-weixin" slot="reference"></p>
      </el-popover>
    </div>
  </div>
  <div
    class="footer-rights-mobile"
    :class="$route.name == 'Committed' && 'out-footer'"
    v-else
  >
    <!-- LOGO -->
    <div class="logo-mobile-box">
      <img :src="require('@/assets/images/firstLogo.png')" alt="" />
      <div>
        <a href="https://twitter.com/firstvip61" target="_blank">
          <p class="iconfont icon-qingbaoju_tuite"></p>
        </a>
        <a
          href="https://weibo.com/u/7469273067?from=myfollow_all&is_all=1"
          target="_blank"
          v-if="app.language != 'en'"
        >
          <p class="iconfont icon-weibo"></p>
        </a>
        <a href="mailto:marketing@first.vip" target="_blank">
          <p class="iconfont icon-youjian"></p>
        </a>
        <p
          class="iconfont icon-weixin copy"
          v-if="app.language == 'zh-CN'"
          @click="copyAccount"
          :data-clipboard-text="contactAccount"
        ></p>
      </div>
    </div>
    <!-- RIGHTS -->
    <div class="rights-mobile-box">
      <p>
        <!-- © 2021 头等仓. All rights reserved. -->
        {{ $t("index.contact.con_min") }}
      </p>
      <p>
        <!-- 闽ICP备18013148号-2 -->
        {{ $t("index.contact.con_min_2") }}
      </p>
    </div>
  </div>
</template>

<script>
import { contactQR } from "@/request/api";
import Clipboard from "clipboard";
import { mapState } from "vuex";
export default {
  data() {
    return {
      contactQR: null,
      contactAccount: null,
    };
  },
  created() {
    this.getQR();
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    async getQR() {
      const result = await contactQR();
      this.contactQR = result.image;
      this.contactAccount = result.nickname;
    },
    //备案信息
    openView() {
      window.open("https://beian.miit.gov.cn/");
    },
    copyAccount() {
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          //邀请链接复制成功
          message: this.$t("notify.link_copy"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          //复制失败
          message: this.$t("notify.copy_falied"),
        });
        clipboard.destroy();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.footer-rights {
  width: 100%;
  height: 80px;
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  img {
    width: 100px;
    display: inline-block;
    transform: translateY(-2px);
  }
  div {
    display: flex;
    align-items: center;
    .rights-title {
      margin-left: 40px;
      font-size: 14px;
      color: white;
    }
    .iconfont {
      font-size: 20px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
.footer-rights-mobile {
  margin-top: 6rem;
  .logo-mobile-box {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
    border-bottom: 1px solid #242d52;
    margin-bottom: 1rem;
    img {
      width: 6.25rem;
      height: 1.75rem;
    }
    div {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: $fon20;
        color: white;
        margin-left: 1rem;
      }
    }
  }
  .rights-mobile-box {
    display: flex;
    justify-content: space-between;
    margin-bottom: $padd40;
    p {
      font-size: $fon12;
      color: white;
    }
  }
}
.out-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  padding: 0 1rem;
}
</style>