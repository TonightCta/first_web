// 手机端提交项目咨询
<template>
  <div class="submit-pro-mobile">
    <MobileNav>
      <p>
        <!-- 提交咨询 -->
        {{ $t("routes.submit_en") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="submit-inner">
        <!-- 项目简称 -->
        <div class="inp-box">
          <p>
            <!-- 项目简称 -->
            {{ $t("pro_news.pro_symbol") }}
            <span>*</span>
          </p>
          <p class="">
            <input
              type="text"
              :placeholder="$t('pro_news.inp_holder_symbol')"
              v-model="symbol"
            />
          </p>
        </div>
        <!-- 项目全称 -->
        <div class="inp-box">
          <p>
            <!-- 项目全称 -->
            {{ $t("pro_news.pro_name") }}
            <span>*</span>
          </p>
          <p class="">
            <input
              type="text"
              :placeholder="$t('pro_news.inp_holder_name')"
              v-model="name"
            />
          </p>
        </div>
        <!-- 项目地址 -->
        <div class="inp-box">
          <p>
            <!-- 项目地址 -->
            {{ $t("pro_news.pro_address") }}
          </p>
          <p class="">
            <input
              type="text"
              :placeholder="$t('pro_news.inp_holder_url')"
              v-model="websit"
            />
          </p>
        </div>
        <!-- 描述内容 -->
        <div class="inp-box">
          <p>
            {{ $t("pro_news.desc") }}
            <span>*</span>
          </p>
          <p class="">
            <textarea
              :placeholder="$t('pro_news.inp_holder_desc')"
              v-model="content"
            ></textarea>
          </p>
        </div>
        <!-- 优先级 -->
        <div class="radio-box-inner">
          <p class="">
            <!-- 优先级 -->
            {{ $t("pro_news.pri") }}
          </p>
          <div class="inner-radio">
            <base-radio name="1" type="info" class="mb-3" v-model="priority">
              <!-- 普通咨询 -->
              {{ $t("pro_news.level_sub") }}
            </base-radio>
            <p class="inner-label"></p>
            <base-radio name="0" type="info" class="mb-3" v-model="priority">
              <!-- 加急处理 -->
              {{ $t("pro_news.level_two_remark") }}
            </base-radio>
          </div>
          <p class="radio-remark">
            <!-- 普通咨询：需等待排队处理（响应速度约为2小时/条） -->
            {{ $t("pro_news.level_sub_remark") }}
          </p>
          <p class="radio-remark">
            <!-- 加急处理：人工响应时间＜1天 -->
            {{ $t("pro_news.level_two") }}
          </p>
        </div>
        <!-- 是否公开 -->
        <div class="radio-box-inner">
          <p class="">
            <!-- 是否公开 -->
            {{ $t("pro_news.is_public") }}
          </p>
          <div class="inner-radio">
            <base-radio name="1" type="info" class="mb-3" v-model="isPublic">
              <!-- 是 -->
              {{ $t("public.yes") }}
            </base-radio>
            <p class="inner-label"></p>
            <base-radio name="0" type="info" class="mb-3" v-model="isPublic">
              <!-- 否 -->
              {{ $t("public.no") }}
            </base-radio>
          </div>
          <p class="radio-remark">
            <!-- 允许研究员在必要时公开此工单内容，并发布至项目库 -->
            {{ $t("pro_news.public_remark") }}
          </p>
        </div>
        <!-- 消息通知 -->
        <div class="radio-box-inner">
          <p class="">
            <!-- 消息通知 -->
            {{ $t("pro_news.is_noti") }}
          </p>
          <div class="inner-radio">
            <base-radio name="1" type="info" class="mb-3" v-model="isNot">
              <!-- 是 -->
              {{ $t("public.yes") }}
            </base-radio>
            <p class="inner-label"></p>
            <base-radio name="0" type="info" class="mb-3" v-model="isNot">
              <!-- 否 -->
              {{ $t("public.no") }}
            </base-radio>
          </div>
          <p class="radio-remark">
            <!-- 是否接收手机、邮箱信息通知 -->
            {{ $t("pro_news.noti_remark") }}
          </p>
        </div>
        <p class="split-line"></p>
        <!-- 信息确认 -->
        <div class="agree-box">
          <base-checkbox inline class="mb-3" type="info" v-model="agree">
            <!-- 我已确认所填信息无误，并同意提交 -->
            {{ $t("pro_news.sub_agree") }}
          </base-checkbox>
        </div>
        <!-- 提交 -->
        <div class="submit-box">
          <base-button
            type="info"
            round
            @click="submitEvent()"
            :loading="upResult"
            :disabled="upResult"
          >
            <!-- 提交咨询 -->
            {{ $t("pro_news.sun_libray") }}
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BaseRadio, BaseCheckbox } from "@/components";
import { addService } from "@/request/api";
export default {
  name: "SubmitProMobile",
  data() {
    return {
      symbol: "", //项目简称
      name: "", //项目全称
      content: "", //咨询内容
      priority: "1", //优先级
      isPublic: "1", //是否公开
      isNot: "1", //是否通知
      agree: false, //确认无误
      upResult: false, //提交loading
      websit: "", //项目地址
    };
  },
  created() {
    this.$route.query.name && (this.name = this.$route.query.name);
    this.$route.query.symbol && (this.symbol = this.$route.query.symbol);
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    BaseRadio,
    BaseCheckbox,
  },
  methods: {
    async submitEvent() {
      if (!this.symbol) {
        this.$notify({
          type: "danger",
          //请输入项目简称
          message: this.$t("pro_news.inp_holder_symbol"),
        });
        return;
      }
      if (!this.name) {
        this.$notify({
          type: "danger",
          //请输入项目全称
          message: this.$t("pro_news.inp_holder_name"),
        });
        return;
      }
      if (!this.content) {
        this.$notify({
          type: "danger",
          // 请输入咨询内容
          message: this.$t("pro_news.inp_holder_desc"),
        });
        return;
      }
      if (!this.agree) {
        this.$notify({
          type: "danger",
          //请确认所填信息无误
          message: this.$t("notify.pls_agree"),
        });
        return;
      }
      const params = {
        name: this.name,
        symbol: this.symbol,
        desc: this.content,
        remind: this.isNot,
        urgentrank: this.priority,
        public: this.isPublic,
        url: this.websit,
      };
      this.upResult = true;
      const result = await addService(params);
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        this.upResult = false;
        return;
      }
      this.$notify({
        type: "success",
        //咨询提交成功，请您耐心等待
        message: this.$t("notify.work_order_success"),
      });
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.view-inner-mobile {
  padding: 4rem 1rem;
}
.submit-inner {
  padding: $padd24;
  background: $contentBg;
  border-radius: 4px;
  .inp-box {
    width: 100%;
    margin-bottom: 1rem;
    p {
      font-size: $fon12;
      margin-bottom: 0.5rem;
      span {
        color: $danger;
      }
      input {
        width: 100%;
        height: 2.3rem;
        border-radius: 4px;
        font-size: $fon12;
        background: $contentBg;
        border: 1px solid $lineTwoColor;
        box-sizing: border-box;
        padding-left: $fon18;
        color: $textColor;
      }
      textarea {
        width: 100%;
        resize: none;
        outline: none;
        height: 6.25rem;
        background: $contentBg;
        border: 1px solid $lineTwoColor;
        color: $textColor;
        padding: 0.6rem $fon18;
      }
    }
  }
  .radio-box-inner {
    margin-top: $padd24;
    p {
      font-size: $fon12;
      color: $textColor;
    }
    .inner-radio {
      display: flex;
      /deep/ .form-check-label {
        margin-bottom: 0 !important;
        margin-right: 1rem;
      }
      .inner-label {
        width: 1rem;
      }
    }
    .radio-remark {
      font-size: $fon12;
      color: $remarkColor;
      margin-bottom: 0.25rem;
    }
  }
  .submit-box {
    width: 100%;
    button {
      width: 100%;
    }
  }
}
</style>