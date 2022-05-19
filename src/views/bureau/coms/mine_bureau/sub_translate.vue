// 提交翻译
<template>
  <div>
    <!-- 翻译中 -->
    <van-dialog v-model="subTranslate" :showConfirmButton="false" width="380">
      <div class="pay-success">
        <p class="icon-box">
          <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
        </p>
        <p class="success-title">已提交翻译</p>
        <p class="success-remark">请5分钟后回来查看译文</p>
        <p class="success-btn">
          <base-button type="default" class="other-info" round @click="subTranslate = false"
            >好的</base-button
          >
        </p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subTranslate: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.pay-success {
  text-align: center;
  .icon-box {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(90deg, #00bad6 0%, #2de0bd 100%);
    margin: 0 auto;
    margin-top: 3.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    .iconfont {
      font-size: 2rem;
      font-weight: bold;
    }
  }
  .success-title {
    font-size: 1rem;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 0.5rem;
  }
  .success-remark {
    font-size: $fon12;
    color: $remarkColor;
    margin-bottom: $padd24;
  }
  button {
    margin-bottom: $size48;
  }
}
</style>