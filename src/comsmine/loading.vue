<!-- Loading -->
<template>
  <!--   -->
  <div class="loading" :style="loadStyle">
    <div class="flex-box">
      <div class="loader-inner line-scale-pulse-out-rapid">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Loading",
  data() {
    return {
      // loadStyle:{},
    };
  },
  computed: {
    ...mapState(["app"]),
    loadStyle() {
      return this.app.loading;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/loader.css";
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh + 80px);
  z-index: 9999;
  transition: 0.3s all;
  .flex-box {
    width: 100%;
    height: 100%;
    display: flex;
    padding-left: 240px;
    justify-content: center;
    align-items: center;
  }
  @media screen and (max-width:1200px){
    .flex-box{
      padding-left: 0;
    }
  }
}
</style>
