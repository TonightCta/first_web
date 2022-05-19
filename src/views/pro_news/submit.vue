<template>
  <div class="submit-project">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-tishi_tips-one"></span>
        <font
          v-html="
            app.language == 'en'
              ? `Please submit one project per enquiry (on fundamentals only)`
              : `由于咨询数量较多，请一次只提交一个项目，且研究员只回复<span>项目的基本面</span>情况，敬请谅解`
          "
        ></font>
      </p>
    </div>
    <div class="submit-con">
      <div class="form-row">
        <!-- pro_news.pro_symbol -->
        <base-input
          class="col-md-6 nedd-must"
          :class="{ 'has-danger': symbolFailed }"
          type="text"
          v-model="proSymbol"
          :label="$t('pro_news.pro_symbol')"
          :placeholder="$t('public.pls_inp')"
        >
          <small slot="error" v-if="symbolFailed" class="form-text form-error">
            <!-- 请输入项目简称 -->
            {{ $t("pro_news.inp_holder_symbol") }}
          </small>
        </base-input>
        <base-input
          class="col-md-6 nedd-must"
          :class="{ 'has-danger': nameFailed }"
          type="text"
          :label="$t('pro_news.pro_name')"
          v-model="proName"
          :placeholder="$t('public.pls_inp')"
        >
          <small slot="error" v-if="nameFailed" class="form-text form-error">
            <!-- 请输入项目全称 -->
            {{ $t("pro_news.inp_holder_name") }}
          </small>
        </base-input>
        <p style="height: 12px; width: 100%"></p>
        <!-- 项目地址 -->
        <base-input
          class="col-md-12 pro-address"
          type="text"
          :label="$t('pro_news.pro_address')"
          v-model="proWebsit"
          :placeholder="$t('public.pls_inp')"
        >
        </base-input>
        <p style="height: 12px; width: 100%"></p>
        <base-input
          class="col-md-12 nedd-must"
          :class="{ 'has-danger': contentFailed }"
          :label="$t('pro_news.desc')"
        >
          <textarea
            class="form-control"
            :style="{ border: areaErr }"
            rows="10"
            :placeholder="$t('public.pls_inp')"
            v-model="proContent"
          ></textarea>
          <small slot="error" v-if="contentFailed" class="form-text form-error">
            <!-- 请输入描述内容 -->
            {{ $t("pro_news.inp_holder_desc") }}
          </small>
        </base-input>
        <p class="title-radio">
          <!-- 优先级 -->
          {{ $t("pro_news.pri") }}
        </p>
        <div class="col-md-12 radio-box">
          <base-radio name="1" type="info" class="mb-3" v-model="priority">
            <!-- 普通咨询 -->
            {{ $t("pro_news.level_sub") }}
          </base-radio>
          <base-radio name="0" type="info" class="mb-3" v-model="priority">
            <!-- 加急处理 -->
            {{ $t("pro_news.level_two_remark") }}
          </base-radio>
          <span>
            <font
              v-html="
                app.language == 'en'
                  ? `&nbsp;(<span class='success'>Once</span>/month for annual subscribers)`
                  : ` (包年订阅用户每个月<span class='success'>1</span>次享受加急处理特权）`
              "
            ></font>
          </span>
        </div>
        <p class="remark-radio col-md-12">
          <span>
            <!-- 普通咨询：需等待排队处理（响应速度约为2小时/条） -->
            {{ $t("pro_news.level_sub_remark") }}
          </span>
          <span>
            <!-- 加急处理：人工响应时间＜1天/条 -->
            {{ $t("pro_news.level_two") }}
          </span>
        </p>
        <p class="title-radio col-md-12">
          <!-- 是否公开 -->
          {{ $t("pro_news.is_public") }}
        </p>
        <div class="col-md-12 radio-box">
          <base-radio name="1" type="info" class="mb-3" v-model="isPublic">
            <!-- 是 -->
            {{ $t("public.yes") }}
          </base-radio>
          <base-radio name="0" type="info" class="mb-3" v-model="isPublic">
            <!-- 否 -->
            {{ $t("public.no") }}
          </base-radio>
        </div>
        <p class="remark-radio col-md-12">
          <span>
            <!-- 允许研究员在必要时公开此工单内容，并发布至项目库 -->
            {{ $t("pro_news.public_remark") }}
          </span>
        </p>
        <p class="title-radio col-md-12">
          <!-- 消息通知 -->
          {{ $t("pro_news.is_noti") }}
        </p>
        <div class="col-md-12 radio-box">
          <base-radio name="1" type="info" class="mb-3" v-model="isNot">
            <!-- 是 -->
            {{ $t("public.yes") }}
          </base-radio>
          <base-radio name="0" type="info" class="mb-3" v-model="isNot">
            <!-- 否 -->
            {{ $t("public.no") }}
          </base-radio>
        </div>
        <p class="remark-radio col-md-12">
          <span>
            <!-- 是否接收手机、邮箱信息通知 -->
            {{ $t("pro_news.noti_remark") }}
          </span>
        </p>
        <p class="form-line col-md-12"></p>
        <div class="btn-box col-md-12">
          <base-checkbox inline class="mb-3" type="info" v-model="agree">
            <!-- 我已确认所填信息无误，并同意提交 -->
            {{ $t("pro_news.sub_agree") }}
          </base-checkbox>
          <base-button type="info" round @click="submit()" :loading="upResult">
            <!-- 提交 -->
            {{ $t("public.submit") }}
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BaseRadio, BaseCheckbox } from "@/components";
import { addService } from "@/request/api";
import { mapState } from "vuex";
export default {
  name: "SubmitPro",
  components: {
    BaseRadio,
    BaseCheckbox,
  },
  data() {
    return {
      priority: "1", //优先级
      isPublic: "1", //是否公开
      isNot: "1", //是否通知
      agree: false, //同意提交
      symbolFailed: false, //项目简称错误
      proSymbol: "", //项目简称
      nameFailed: false, //项目全称错误
      proName: "", //项目全称
      contentFailed: false, //描述内容错误
      proContent: "", //描述内容
      areaErr: "1px solid #353E66", //文本域错误
      upResult: false,
      proWebsit: "", //项目网址
    };
  },
  created() {
    this.$route.query.name && (this.proName = this.$route.query.name);
    this.$route.query.symbol && (this.proSymbol = this.$route.query.symbol);
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {
    proSymbol() {
      this.symbolFailed = false;
    },
    proName() {
      this.nameFailed = false;
    },
    proContent() {
      this.areaErr = "1px solid #353E66";
      this.contentFailed = false;
    },
  },
  methods: {
    async submit() {
      const error = () => {
        if (!this.proSymbol) {
          this.symbolFailed = true;
        } else {
          this.symbolFailed = false;
        }
        if (!this.proName) {
          this.nameFailed = true;
        } else {
          this.nameFailed = false;
        }
        if (!this.proContent) {
          this.areaErr = "1px solid #f33620";
          this.contentFailed = true;
        } else {
          this.areaErr = "1px solid #353E66";
          this.contentFailed = false;
        }
      };
      const submitEv = async () => {
        if (this.agree) {
          this.upResult = true;
          const serMsg = {
            name: this.proName,
            symbol: this.proSymbol,
            desc: this.proContent,
            remind: this.isNot,
            urgentrank: this.priority,
            public: this.isPublic,
            url: this.proWebsit,
          };
          const result = await addService(serMsg);
          this.upResult = false;
          if (result.code == 2000) {
            this.$notify({
              type: "success",
              //咨询提交成功，请您耐心等待
              message: this.$t("notify.work_order_success"),
              duration: 3000,
            });
            this.$router.go(-1);
          } else {
            this.$notify({
              type: "danger",
              message: result.msg,
            });
          }
        } else {
          this.$notify({
            type: "danger",
            //请确认所填信息无误
            message: this.$t("notify.pls_agree"),
          });
        }
      };
      if (this.proSymbol && this.proName && this.proContent) {
        submitEv();
      } else {
        error();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-project {
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: flex-start;
    padding-left: 24px;
    align-items: center;
    border-radius: 4px;
    .h4 {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      color: white;
      .iconfont {
        font-size: $iconSize;
        color: white;
        margin-right: 8px;
      }
      /deep/ span {
        color: $success;
        padding: 0 2px;
        font-weight: bold;
      }
    }
  }
  .submit-con {
    padding: 24px;
    background: $contentBg;
    margin-top: 16px;
    border-radius: 4px;
    /deep/ label {
      color: $textColor;
    }
    .nedd-must {
      /deep/ label::after {
        content: "*";
        color: $danger;
        font-size: 16px;
      }
    }
    .title-radio {
      font-size: 12px;
      margin-top: 24px;
      padding-left: 4px;
      color: $textColor;
      margin-bottom: 8px;
    }
    .remark-radio {
      font-size: 12px;
      color: $remarkColor;
      padding-left: 4px;
      margin-top: 6px;
    }
    .radio-box {
      display: flex;
      height: 18px;
      align-items: center;
      margin-bottom: 8px;
      .mb-3:first-child {
        margin-right: 16px;
      }
      .mb-3 {
        margin-bottom: 0 !important;
      }
      /deep/ label {
        font-size: 14px !important;
        color: $textColor;
      }
      span {
        font-size: 12px;
        color: $remarkColor;
        margin-top: 6px;
        /deep/ span {
          color: $success;
          font-weight: bold;
          padding-left: 2px;
          padding-right: 2px;
        }
      }
    }
    .form-line {
      height: 1px;
      background: $lineColor;
      margin-top: 24px;
      margin-bottom: 35px;
    }
    .btn-box {
      display: flex;
      justify-content: space-between;
      /deep/ .form-check-label {
        color: $textColor;
        font-size: 14px !important;
      }
    }
    .form-control {
      max-height: 100px;
    }
  }
}
</style>