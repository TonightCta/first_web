<!-- 我们是谁 -->
<template>
  <div class="who-we section">
    <p class="we-title">
      <!-- 我们是谁 -->
      {{$t('index_nav.wo_we')}}
    </p>
    <p class="we-remark remark-pc">
      <!-- 头等仓是区块链行业领先的投资研究机构 -->
      {{$t('index.who_we.who_remark_1')}}
    </p>
    <p class="we-remark remark-pc">
      <!-- 头等仓一贯坚持中立、客观的基本原则，帮助投资者深度调研全球所有区块链项目，降低投资风险 -->
      {{$t('index.who_we.who_remark_2')}}
    </p>
    <p class="we-remark remark-pc">
      <!-- 全面覆盖前沿创新热点，帮助投资者及时把握机遇，助力投资成功 -->
      {{$t('index.who_we.who_remark_3')}}
    </p>
    <p class="we-remark remark-mobile">
      <!-- 头等仓是区块链行业领先的投研机构 -->
      {{$t('index.who_we.who_remark_1') + (app.language == 'en' ? '.' : '')}}
      {{ app.language == 'en' ? $t('index.who_we.who_remark_4') : ''}}
    </p>
    <p class="we-remark remark-mobile" v-if="app.language != 'en'">
      <!-- 全面覆盖区块链创新热点，紧跟时代发展机遇 -->
      {{$t('index.who_we.who_remark_4')}}
    </p>
    <div
      class="video-box"
      @click="($flag && isIos) ? $refs.videoBoxIOS.play() : playVideo()"
    >
      <img :src="require('@/assets/images/videoBg.png')" alt="" />
    </div>
    <img
      class="bg-img"
      :src="require('@/assets/images/pageIcon/bottom_left.png')"
      alt=""
    />
    <img
      class="bg-img-two"
      :src="require('@/assets/images/pageIcon/bottom_right.png')"
      alt=""
    />
    <modal
      :show.sync="isPlayer"
      :modalClasses="['video-box','video-box-modal']"
      modalContentClasses="no-bg"
    >
      <div class="modal-video">
        <video
          width="100%"
          height="400"
          controls
          :autoplay="false"
          name="media"
          ref="videoBox"
        >
          <source
            src="https://css.first.vip/video/first_video.mp4"
            type="video/mp4"
          />
        </video>
        <p class="iconfont icon-guanbi_close" @click="closeVideo()"></p>
      </div>
    </modal>
    <video
      width="100%"
      height="400"
      controls
      :autoplay="false"
      name="media"
      ref="videoBoxIOS"
      style="display:none;"
    >
      <source
        src="https://css.first.vip/video/first_video.mp4"
        type="video/mp4"
      />
    </video>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { mapState } from 'vuex';
export default {
  name: "WhoWe",
  data() {
    return {
      isPlayer: false,
    };
  },
  components: {
    Modal,
  },
  watch: {
    isPlayer(val, old) {
      if (val) {
        this.$refs.videoBox.play();
      } else {
        this.$refs.videoBox.pause();
      }
    },
  },
  methods: {
    playVideo() {
      this.isPlayer = true;
      localStorage.setItem("openSearchBox", true);
    },
    closeVideo() {
      this.isPlayer = false;
      localStorage.removeItem("openSearchBox");
    },
  },
  computed: {
    ...mapState(['app']),
    isIos() {
      const u = navigator.userAgent;
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isiOS) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .modal-body {
  padding: 0;
}
.who-we {
  width: 100%;
  height: calc(100%);
  box-sizing: border-box;
  text-align: center;
  font-size: 36px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: url("../../assets/images/pageIcon/who_we_bg.png");
  background-size: 100% 100%;
  @-webkit-keyframes FastAndShort {
    0% {
      transform: translateY(20px);
    }
    50% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(20px);
    }
  }
  @-webkit-keyframes FastAndFar {
    0% {
      transform: translateY(30px);
    }
    50% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(30px);
    }
  }
  .bg-img {
    position: absolute;
    width: 654px;
    height: 755px;
    left: -356px;
    top: -575px;
    animation: FastAndShort 4s linear infinite;
  }
  .bg-img-two {
    position: absolute;
    width: 540px;
    height: 624px;
    right: 77px;
    top: -294px;
    animation: FastAndFar 3s linear infinite;
  }
  .we-title {
    color: $success;
    font-size: 28px;
    margin-bottom: 24px;
  }
  .we-remark {
    font-size: 14px;
    color: white;
    margin-bottom: 16px;
  }
  .video-box {
    width: 600px;
    height: 300px;
    margin: 0 auto;
    margin-top: 80px;
    cursor: pointer;
  }
  .videoDialog {
    video {
      width: 900px;
      height: 506px;
    }
  }
}
.modal-video {
  position: relative;
  .iconfont {
    position: absolute;
    top: -40px;
    color: white;
    right: 0;
    font-size: 24px;
    cursor: pointer;
  }
}
@media screen and (min-width: 1280px) {
  .remark-mobile {
    display: none !important;
  }
}
@media screen and (max-width: 1279px) {
  .who-we {
    padding: 7.5rem 0 3rem;
    position: relative;
    .remark-mobile{
      padding:0 $padd24;
      line-height: $fon18;
      font-size: $fon12;
    }
    .remark-pc {
      display: none;
    }
    .we-title {
      font-size: $fon18;
    }
    .video-box {
      width: 20rem;
      height: 9.6rem;
    }
    .bg-img {
      display: none;
    }
    .bg-img-two {
      width: 11.68rem;
      height: 13.43rem;
      right: -4.43rem;
      top: -10rem;
      animation: FastAndFar 4s linear infinite;
    }
  }
}
</style>
