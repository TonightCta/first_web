// 引导访问
<template>
  <div style="position:relative;z-index:9999;">
    <div class="guided-visit" :class="isPush ? 'show-visit' : ''">
      <img :src="require('@/assets/images/visit.gif')" alt="" />
      <p class="icon-visit" @click="closeTip">
        <span class="iconfont icon-guanbi_close"></span>
      </p>
      <p class="line"></p>
    </div>
    <div class="visit-mask" @click="isPush = false;" v-if="isPush"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Modal } from "@/components";
import { noLongerTip } from "@/request/api";
export default {
  name: "GuidedVisit",
  data() {
    return {
      isPush: false,
    };
  },
  components: {
    Modal,
  },
  computed: {
    ...mapState(["app"]),
  },
  mounted() {
    window.isTip = this.isTip;
  },
  methods: {
    isTip() {
      const { show_desk_tip } = this.app.account;
      show_desk_tip == 1 ? (this.isPush = true) : (this.isPush = false);
    },
    async closeTip() {
      await noLongerTip();
      this.isPush = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.show-visit {
  transform: translateY(0) !important;
  opacity: 1 !important;
}
.visit-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.guided-visit {
  position: fixed;
  bottom: 1.375rem;
  width: 80%;
  left: 10%;
  padding: 4px;
  background: white;
  border-radius: 4px;
  transition: 0.8s all;
  transform: translateY(120%);
  z-index: 200;
  opacity: 0;
  .icon-visit {
    position: absolute;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: $contentBg;
    top: $fon12;
    right: $fon12;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 1rem;
    }
  }
  .line {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid white;
    position: absolute;
    left: 50%;
    margin-left: -6px;
    bottom: -6px;
  }
}
</style>