//透明承诺
<template>
  <div class="com-box">
    <Nav />
    <p class="com-title">
      <!-- 透明承诺 -->
      {{$t('index.comm.comm_title')}}
    </p>
    <img
      class="back-bg back-bg-pc"
      :src="require('@/assets/images/pageIcon/com_2.png')"
      alt=""
    />
    <img
      class="back-bg back-bg-mobile"
      :src="require('@/assets/images/pageIcon/committedBgMobile.png')"
      alt=""
    />
    <p class="com-remark">
      <!-- 头等仓研报所发布的观点完全基于对项目基本面的理解与认知。头等仓不会收取项目方的任何费用以在研报中。 -->
      {{$t('index.comm.comm_remark')}}
    </p>
    <Foo />
  </div>
</template>

<script>
export default {
  components: {
    Nav: (resolve) => require(["@/comsmine/nav_header"], resolve),
    Foo: (resolve) => require(["./footer_nav"], resolve),
  },
};
</script>

<style lang="scss" scoped>
/deep/ .nav-header{
  position: fixed!important;
  top:0;
  left:0;
  .logo-box{
    text-align: left;
  }
}
.com-box {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/pageIcon/committedBg.png");
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .back-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .com-title {
    font-size: 33px;
    color: $success;
    margin-bottom: 16px;
  }
  .com-remark {
    font-size: 14px;
    color: white;
    margin-bottom: 8px;
  }
}
@media acreen and (max-width: 1280px) {
  .back-bg-mobile {
    display: none !important;
  }
}
@media screen and (max-width: 1279px) {
  .com-box {
    .back-bg-pc {
      display: none;
    }
    background-image: none;
    .com-title {
      font-size: $fon18;
      margin-bottom: 1rem;
    }
    .com-remark {
      font-size: $fon12;
      margin: 0 $padd24;
      line-height: $padd24;
    }
  }
}
</style>