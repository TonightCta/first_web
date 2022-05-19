//重复登录
<template>
  <div class="repeat">
    <modal :show.sync="repeatBox" modalClasses="login-box-modal other-modal">
      <div class="repeat-box">
        <p class="iconfont icon-guanbi_close-one"></p>
        <p class="remark-msg">
          由于每个账号只限同时登录两台设备，您当前已登录2台设备，请先退出其中一台设备，才可登录当前设备。
        </p>
        <p class="oper-box">
          <base-button type="default" round @click="cancelTry(1)"
            >取消</base-button
          >
          <span class="label"></span>
          <base-button type="info" round @click="cancelTry(2)"
            >再试一次</base-button
          >
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { mapState } from "vuex";
export default {
  name: "Repeat",
  components: {
    Modal,
  },
  data() {
    return {};
  },
  mounted(){
    //   console.log(this.repeatBox)
  },
  methods: {
    cancelTry(_type) {
      const { ethereum } = window;
      localStorage.setItem("openSearchBox", false);
      this.$store.commit("upRepeatShow",0);
      _type == 2 &&
        setTimeout(() => {
          this.$store.dispatch("loginDiel", ethereum.selectedAddress), 500;
        });
    },
  },
  computed: {
    ...mapState(["app"]),
    repeatBox() {
      return this.app.repeatShow == 0 ? false : true;
    },
  },
};
</script>

<style lang="scss" scoped>
.repeat-box {
  text-align: center;
  .iconfont {
    font-size: 48px;
    color: $danger;
    margin-top: 12px;
  }
  .remark-msg {
    text-align: justify;
    font-size: 13px;
  }
  p:last-child {
    margin-top: 24px;
    span {
      display: inline-block;
      width: 24px;
    }
  }
}
</style>