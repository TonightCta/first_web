// 用户反馈
<template>
  <div class="feed-back">
    <modal
      :show.sync="feedBack"
      modalClasses="feed-back-box"
      modalContentClasses="order-details-pay"
    >
      <div class="feed-back-inner">
        <p class="feed-title">
          <!-- 用户反馈 -->
          {{ $t("feed_back.feed_title") }}
        </p>
        <p class="feed-remark">
          <!-- 反馈对象 -->
          {{ $t("feed_back.subject") }}
        </p>
        <div class="radio-box" :class="app.language == 'en' && 'radio-box-en'">
          <base-radio name="1" v-model="feedPro">
            <!-- 研报库 -->
            {{ $t("public.project_name") }}
          </base-radio>
          <base-radio name="2" v-model="feedPro">
            <!-- 情报局 -->
            {{ $t("public.bureau_name") }}
          </base-radio>
        </div>
        <p class="feed-remark">
          <!-- 反馈类型 -->
          {{ $t("feed_back.feed_type") }}
        </p>
        <div class="radio-box" :class="app.language == 'en' && 'radio-box-en'">
          <base-radio name="1" v-model="feedType">
            <!-- 功能异常 -->
            {{ $t("feed_back.normal") }}
          </base-radio>
          <base-radio name="2" v-model="feedType">
            <!-- 产品建议 -->
            {{ $t("feed_back.suggestion") }}
          </base-radio>
          <base-radio name="3" v-model="feedType">
            <!-- 其他反馈 -->
            {{ $t("feed_back.other") }}
          </base-radio>
        </div>
        <p class="feed-remark">
          <!-- 问题或建议 -->
          {{ $t("feed_back.problems") }}
        </p>
        <p>
          <textarea
            :placeholder="$t('feed_back.valuable')"
            v-model="feedContent"
          ></textarea>
          <!-- 请输入您的宝贵意见 -->
        </p>
        <p class="feed-remark">
          <!-- 添加图片 -->
          {{ $t("feed_back.push_img") }}
          <span>
            <!-- （最多6张） -->
            {{ $t("feed_back.max_push") }}
          </span>
        </p>
        <div class="up-img">
          <ul>
            <li v-for="(up, indexUp) in upServiceImg" :key="indexUp">
              <img :src="up" alt="" />
              <p class="close-mask" @click="delLocaImg(indexUp)">
                <span class="iconfont icon-guanbi_close-one"></span>
              </p>
            </li>
            <li v-if="upServiceImg.length < 6">
              <input type="file" accept="image/*" @change="upLocaImg" />
              <span class="iconfont icon-shangchuan_upload"></span>
            </li>
          </ul>
        </div>
        <p class="feed-oper">
          <base-button type="default" round @click="clearFeed">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span class="label"></span>
          <base-button
            type="info"
            round
            :class="app.isBureau == 1 && 'other-info'"
            @click="submitFeedBack"
          >
            <!-- 提交 -->
            {{ $t("public.submit") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal, BaseRadio } from "@/components";
import { mapState } from "vuex";
import { feedBack, upFile } from "@/request/api";
export default {
  data() {
    return {
      feedBack: false, //用户反馈
      feedPro: "1",
      feedType: "1",
      upList: [], //上传文件列表
      previewList: [], //上传预览列表
      feedContent: null, //反馈内容
      upServiceImg: [],
    };
  },
  components: {
    Modal,
    BaseRadio,
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    //上传图片
    async upLocaImg(e) {
      this.upList.push(e.target.files[0]);
      //   let imgUrl = window.URL.createObjectURL(e.target.files[0]);
      //   this.previewList.push(imgUrl);
      let formdata = new FormData();
      formdata.append("file", e.target.files[0]);
      const result = await upFile(formdata);
      this.upServiceImg.push(result.data.domain + result.data.url);
    },
    //删除本地图片
    delLocaImg(_index) {
      this.upList.splice(_index, 1);
      this.upServiceImg.splice(_index, 1);
    },
    clearFeed() {
      this.feedBack = false;
      this.feedPro = "1";
      this.feedType = "1";
      this.upList = [];
      this.feedContent = null;
      this.upServiceImg = [];
    },
    //提交反馈
    submitFeedBack() {
      //   console.log(this.upList);
      //   return;
      const next = async () => {
        const subResult = await feedBack({
          object: this.feedPro,
          type: this.feedType,
          content: this.feedContent,
          images: this.upServiceImg,
        });
        if (subResult.code != 2000) {
          this.$notify({
            type: "danger",
            message: subResult.msg,
          });
          return;
        }
        this.$notify({
          type: "success",
          //感谢您的反馈，我们会认真处理您的有效反馈，使得产品更好用。
          message: this.$t("notify.feed_success"),
        });
        this.upServiceImg = [];
        this.previewList = [];
        this.upList = [];
        this.feedContent = null;
        this.feedBack = false;
        this.feedPro = "1";
        this.feedType = "1";
      };
      !this.feedContent
        ? this.$notify({
            type: "danger",
            //请输入反馈内容
            message: this.$t("notify.inp_feed"),
          })
        : next();
    },
  },
};
</script>

<style lang="scss" scoped>
.feed-back-inner {
  padding: 24px 48px 48px;
  textarea {
    resize: none;
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    padding: 12px 18px;
    font-size: 12px;
    color: $textColor;
    background: $contentBg;
    border: 1px solid $lineTwoColor;
    margin-bottom: 24px;
    margin-top: 4px;
  }
  textarea::placeholder {
    color: $remarkColor;
  }
  .feed-title {
    color: $textColor;
    font-size: 13px;
    font-weight: bold;
    text-align: center;
  }
  .feed-remark {
    color: $textColor;
    font-size: 12px;
    span {
      color: #676c7a;
      margin-left: 4px;
    }
  }
  .radio-box {
    margin-bottom: 24px;
    display: flex;
    /deep/ .form-check {
      margin-top: 0;
      margin-right: 16px;
      .form-check-label {
        margin-bottom: 0 !important;
      }
    }
  }
  .radio-box-en{
    flex-direction: column;
    padding-top: .5rem;
  }
  .up-img {
    margin-top: 16px;
    ul {
      display: flex;
      li {
        width: 48px;
        height: 48px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        margin-right: 8px;
        img {
          width: 100%;
          height: 100%;
          border: 1px solid #49537a;
          border-radius: 4px;
        }
        .close-mask {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s all;
          opacity: 0;
          .iconfont {
            font-size: 16px;
            color: #ff6666;
          }
        }
      }
      li:hover {
        .close-mask {
          opacity: 1;
        }
      }
      li:last-child {
        background: $conBg2;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .iconfont {
          font-size: 20px;
        }
        input {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          cursor: pointer;
          opacity: 0;
        }
      }
    }
  }
  .feed-oper {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    .label {
      display: inline-block;
      width: 24px;
    }
  }
}
@media screen and (max-width: 1279px) {
  .feed-back-inner {
    padding: $padd24;
  }
}
</style>