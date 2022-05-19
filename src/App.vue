<template>
  <div class="">
    <!-- 安卓PDF查看 -->
    <PDFView />
    <notifications></notifications>
    <div class="app" :class="app.navStyle">
      <Loading v-if="$flag" />
      <div class="view-box" :class="$route.name == 'BureauImportant' && 'white-bg'">
        <router-view></router-view>
      </div>
    </div>
    <!-- 账号重复登录提示 -->
    <Repeat />
    <!-- 返回顶部 -->
    <BackTop v-if="$flag" />
    <!-- 全屏CBBI -->
    <RotateCBBI />
    <!-- 引导访问 -->
    <Visit />
    <!-- 登录失败 -->
    <LoginFailed />
    <!-- 填写邀请码 -->
    <InviteCode />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { GetUrlKey } from "@/util/index";
import { loginOut, outsideClick } from "@/request/api";
export default {
  components: {
    Loading: (resolve) => require(["@/comsmine/loading"], resolve),
    Repeat: (resolve) => require(["@/comsmine/repeat"], resolve),
    BackTop: (resolve) => require(["@/comsmine/back_top"], resolve),
    RotateCBBI: (resolve) => require(["@/comsmine/rotate_echarts"], resolve),
    Visit: (resolve) => require(["@/comsmine/guided_visit"], resolve), //引导访问
    PDFView: (resolve) => require(["@/comsmine/PDF_view"], resolve),
    LoginFailed: (resolve) => require(["@/comsmine/login_failed"], resolve),
    //绑定邀请码
    InviteCode: (resolve) => require(["@/comsmine/invite_code"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.$flag &&
      GetUrlKey("code", window.location.href) &&
      this.$router.push({
        path: "/login-mobile",
        query: {
          code: GetUrlKey("code", window.location.href),
          coopcode: GetUrlKey("cooperateCode", window.location.href)
            ? GetUrlKey("cooperateCode", window.location.href)
            : "",
        },
      });
    this.$flag &&
      GetUrlKey("open", window.location.href) &&
      this.$router.push("/login-mobile");
    //合作地址统计
    GetUrlKey("cooperateCode", window.location.href) &&
      outsideClick({
        cooperateCode: GetUrlKey("cooperateCode", window.location.href),
      });
  },
  methods: {
    initializeLayout() {
      if (!this.$rtl.isRTL) {
        // Just make sure rtl css is off when we are not on rtl
        this.$rtl.disableRTL();
      }
    },
    async loginOut() {
      await loginOut();
      localStorage.clear();
      window.location.replace(process.env.VUE_APP_RESET);
    },
    //全局标签跳转搜索
    goSearch(_val) {
      const next = () => {
        this.$store.commit("upSearchMsg", _val);
        this.$router.push("/search");
      };
      this.app.account.meal_id == 3 || this.app.account.meal_id == 4
        ? next()
        : this.$notify({
            type: "danger",
            //内部数据库仅对年费会员开放
            message: this.$t("public.no_pre"),
          });
    },
    //PDF指纹锁追加
    PDFLock(_type, _id, _device, _is_old) {
      window.open(
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
    },
    closeTooltip() {
      // console.log(document.querySelector(".el-popover").style.cssText)
      // document.querySelector("tooltip").style.cssText = "background:red";
      // console.log(document.querySelector(".el-popover").style.cssText)
    },
    setToolBack(){
      // let ws = plus.webview.currentWebView();
    }
  },
  mounted() {
    window.loginOut = this.loginOut;
    window.goSearch = this.goSearch;
    window.PDFLock = this.PDFLock;
    this.initializeLayout();
    // this.$flag && window.addEventListener('plusready',this.setToolBack,false)
    // this.$flag && window.addEventListener("scroll", this.closeTooltip, true);
  },
};
</script>
<style lang="scss">
.white-bg{
  background: #f5f5f7;
}
</style>
