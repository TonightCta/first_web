// 返回顶部
<template>
  <div class="back-top" @click="backTop" :class="showBack && 'show-back'">
    <p class="iconfont icon-shang_up"></p>
  </div>
</template>

<script>
import { scrollInner, scrollBack } from "@/util/index";
export default {
  name: "BackTop",
  data() {
    return {
      showBack: false,
    };
  },
  mounted() {
    this.$flag && window.addEventListener("scroll", this.watchScroll);
    setTimeout(() => {
      this.$route.name != "Index" &&
        this.$route.name !== "Committed" &&
        this.$route.name !== "BureauImportant" &&
        (this.showBack = true);
    }, 300);
  },
  methods: {
    watchScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop);
      scrollTop >= 200 ? (this.showBack = true) : (this.showBack = false);
    },
    backTop() {
      scrollInner() || scrollBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.back-top {
  width: $padd40;
  height: $padd40;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 2000;
  border: 1px solid #49537a;
  opacity: 0;
  transition: 0.3s all;
  .iconfont {
    font-size: 1rem;
    color: white;
  }
}
.show-back {
  opacity: 1;
}
</style>