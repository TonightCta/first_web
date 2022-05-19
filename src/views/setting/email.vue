<template>
  <div class="">
    <modal :show.sync="emailEdit" modalClasses="login-box-modal">
      <div class="mobile-edit">
        <img :src="require('@/assets/images/setting/boxEmail.png')" alt="" />
        <p class="h4">
          {{
            workType == "1"
              ? $t("setting.bind_email")
              : $t("setting.change_email")
          }}
        </p>
        <div class="phone-box-before public-box" v-if="workType == 2">
          <p class="label">
            <!-- 当前邮箱 -->
            {{ $t("setting.now_email_inner") }}
          </p>
          <p>
            <input
              type="text"
              v-model="app.account.email"
              disabled="disabled"
            />
          </p>
        </div>
        <div class="phone-box public-box">
          <p class="label">
            <!-- 邮箱地址 -->
            {{ $t("place_order.emali_adress") }}
          </p>
          <p>
            <input
              type="text"
              onKeyUp="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
              :class="{ 'has-danger-mine': emailFailed }"
              v-model="email"
              :placeholder="$t('setting.pls_enter_email')"
            />
            <!-- 请输入您的邮箱地址 -->
            <button
              :disabled="sendCodeStaus"
              :style="{ color: sendCodeStaus ? '#A2A5B0' : '#0f62fe' }"
              @click="sendCodeEvent"
            >
              {{ sendCodeText }}
            </button>
          </p>
          <p class="error" v-if="emailFailed">
            <!-- 请输入正确的邮箱地址 -->
            {{ $t("setting.enter_email_failed") }}
          </p>
        </div>
        <div class="code-box public-box">
          <p class="label">
            <!-- 验证码 -->
            {{ $t("login_box.login_code") }}
          </p>
          <p>
            <input
              type="number"
              :class="{ 'has-danger-mine': codeFailed }"
              onKeyUp="if(value.length>6)value=value.slice(0,6)"
              v-model="code"
              :placeholder="$t('setting.pls_enter_code')"
              v-if="!$flag"
            />
            <!-- 请输入您邮箱内收到的验证码 -->
            <input
              type="tel"
              v-else
              pattern="[0-9]*"
              maxlength="6"
              :class="{ 'has-danger-mine': codeFailed }"
              onKeyUp="if(value.length>6)value=value.slice(0,6)"
              v-model="code"
              :placeholder="$t('setting.pls_enter_code')"
            />
            <!-- 请输入您邮箱内收到的验证码 -->
          </p>
          <p class="error" v-if="codeFailed">{{ codeError }}</p>
        </div>
        <div class="oper-btn">
          <base-button type="default" round @click="emailEdit = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span></span>
          <base-button
            type="info"
            round
            @click="submitBind"
            :loading="btnStatus"
            :disabled="btnStatus"
          >
            <!-- 确认 -->
            {{ $t("public.confirm") }}
          </base-button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Modal } from "@/components";
import * as api from "@/request/api";
export default {
  name: "MobileEdit",
  data() {
    return {
      emailEdit: false,
      email: "", //邮箱地址
      emailFailed: false, //邮箱地址错误
      code: "", //验证码
      codeFailed: false, //验证码错误
      sendCodeStaus: true, //发送验证码禁用状态
      emailTicket: null, //验证码回执
      sendCodeText: this.$t('login_box.send_code'),//发送验证码
      countdown: 59, //验证码读秒
      btnStatus: false, //按钮状态
      workType: "1",
      codeError: this.$t('login_box.code_failed'),//验证码错误
    };
  },
  components: {
    Modal,
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {
    emailEdit(val) {
      if (!val) {
        this.email = "";
        this.code = "";
        this.emailFailed = false;
        this.codeFailed = false;
        this.countdown = 0;
      }
    },
    code() {
      this.codeFailed = false;
    },
    email(val) {
      let mobileEval =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (mobileEval.test(val)) {
        this.emailFailed = false;
        this.sendCodeStaus = false;
      } else {
        this.sendCodeStaus = true;
      }
    },
  },
  methods: {
    //获取操作类型
    getWorkType(_type) {
      /**
       * @param _type -> 1 绑定邮箱
       * @param _type -> 2 更换邮箱
       */
      this.workType = _type;
      this.emailEdit = true;
    },
    //发送验证码
    async sendCodeEvent() {
      const sendMsg = {
        email: this.email,
        scene: this.workType == "1" ? "email" : "changeEmail",
      };
      await api.sendEmailCode(sendMsg).then((res) => {
        if (res.code != 2000) {
          this.$notify({
            type: "danger",
            message: res.msg,
          });
          return;
        }
        this.emailTicket = res.data.ticket;
        this.$notify({
          type: "success",
          //验证码发送成功
          message: this.$t("notify.code_success"),
        });
        let settime = setInterval(() => {
          if (this.countdown == 0) {
            //发送验证码
            this.sendCodeText = this.$t('login_box.send_code');
            this.countdown = 59;
            this.sendCodeStaus = false;
            clearInterval(settime);
            return false;
          } else {
            this.sendCodeStaus = true;
            this.sendCodeText = this.countdown + "s";
            this.countdown--;
          }
        }, 1000);
      });
    },
    //提交绑定
    submitBind() {
      const submit = async () => {
        this.btnStatus = true;
        const bindMsg = {
          email: this.email,
          ticket: this.emailTicket,
          code: this.code,
        };
        const result =
          this.workType == "1"
            ? await api.bindEmail(bindMsg)
            : await api.changeBindEmail(bindMsg);
        this.btnStatus = false;
        if (result.code != 2000) {
          this.$notify({
            type: "danger",
            message: result.msg,
          });
          this.codeFailed = true;
          this.codeError = result.msg;
          return;
        }
        this.$notify({
          type: "success",
          // 绑定成功 & 换绑成功
          message:
            this.workType == "1"
              ? this.$t("notify.bind_success")
              : this.$t("notify.change_success"),
        });
        this.emailEdit = false;
        api.userInfo().then((res) => {
          this.$store.dispatch("setAccount", res);
        });
      };
      let emailEval =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!this.email || !emailEval.test(this.email)) {
        this.emailFailed = true;
      }
      if (!this.code || !this.emailTicket) {
        this.codeFailed = true;
      }
      const emailStatus = emailEval.test(this.email);
      const codeStatus = Boolean(this.code) && Boolean(this.emailTicket);
      emailStatus && codeStatus && submit();
    },
  },
};
</script>

<style lang="scss" scoped>
input:disabled {
  -webkit-text-fill-color: $titleColor;
}
.mobile-edit {
  text-align: center;
  padding: 24px 24px 8px 24px;
  img {
    width: 48px;
    height: 48px;
    margin-bottom: 24px;
  }
  .h4 {
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 24px;
  }
  .phone-box-before {
    margin-bottom: 24px;
  }
  .public-box {
    text-align: left;
    .label {
      font-size: 12px;
      color: #676c7a;
      margin-bottom: 8px;
    }
    p {
      position: relative;
      input {
        width: 100%;
        height: 38px;
        border: 1px solid $textColor;
        border-radius: 4px;
        font-size: 12px;
        color: $titleColor;
        box-sizing: border-box;
        padding-left: 18px;
      }
      .has-danger-mine {
        border-color: $danger;
        color: $danger;
      }
      input::placeholder {
        color: #a2a5b0 !important;
      }
      button {
        font-size: 12px;
        border: 0;
        outline: none;
        background: rgba(0, 0, 0, 0);
        position: absolute;
        right: 18px;
        top: 8px;
      }
    }
    .error {
      font-size: 12px;
      color: $danger;
      margin-top: 4px;
    }
  }
  .code-box {
    margin-top: 24px;
  }
  .oper-btn {
    margin-top: 24px;
    display: flex;
    justify-content: space-around;
    span {
      display: inline-block;
      width: 24px;
    }
  }
}
@media screen and (max-width: 1280px) {
  .mobile-edit {
    padding: 0;
    padding-top: $padd24;
    img {
      width: $size48;
      height: $size48;
      margin-bottom: 0.2rem;
    }
    .h4 {
      font-size: 1rem;
      margin-bottom: $padd24;
    }
    .public-box {
      .label {
        font-size: $fon12;
      }
      input {
        height: 2.3rem;
      }
    }
  }
}
</style>