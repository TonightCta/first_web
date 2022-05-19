<template>
  <!-- 填写邀请码 -->
  <div class="inp-invite-code">
    <modal :show.sync="invoteCodeBox" modalClasses="login-box-modal">
      <div class="invite-code-box">
        <img :src="require('@/assets/images/inviteCode.png')" alt="" />
        <p class="h4">
          <!-- 邀请码 -->
          {{ $t("public.invite_code") }}
        </p>
        <p class="h5">
          <!-- 填写推荐码可能会有优惠噢 -->
          {{ $t("public.invite_code_remark") }}
        </p>
        <CodeInp ref="codeInp" @cancelLoad="loadingResult = false" />
        <p class="invite-submit">
          <base-button
            type="info"
            round
            :loading="loadingResult"
            :disabled="loadingResult"
            class="col-md-12"
            @click="
              loadingResult = true;
              downBind();
            "
          >
            <!-- 确定 -->
            {{ $t("work_details.con_turn") }}
          </base-button>
        </p>
        <p class="other-oper">
          <span @click="waitEnterCode">
            <!-- 放弃 -->
            {{ $t("public.give_up") }}
          </span>
          <span>|</span>
          <span @click="waitEnterCode"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <!-- 再等等 -->
            {{ $t("public.wait") }}
          </span>
        </p>
      </div>
    </modal>
    <!-- 放弃邀请码 -->
    <modal :show.sync="giveUpBox" modalClasses="login-box-modal">
      <div class="giveup-box">
        <p class="h4">
          <!-- 此操作将无法再绑定邀请码，是否继续？ -->
          {{ $t("invite.not_bind") }}
        </p>
        <p>
          <base-button type="default" round @click="giveUpBox = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span></span>
          <base-button type="info" round @click="giveUp">
            <!-- 确认 -->
            {{ $t("public.confirm") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { giveUpCode, isBindCode } from "@/request/api";
import { mapState } from "vuex";
export default {
  name: "InviteCode",
  data() {
    return {
      invoteCodeBox: false,
      loadingResult: false, //按钮加载
      giveUpBox: false, //放弃邀请码确认窗口
    };
  },
  components: {
    Modal,
    CodeInp: (resolve) => require(["@/comsmine/codeInp"], resolve),
  },
  created() {
    if (!localStorage.getItem("isBindCode") && this.app.account.uid) {
      this.getCodeStatus();
    }
  },
  mounted() {
    window.getCodeStatus = this.getCodeStatus;
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    //获取是否显示绑定邀请码
    async getCodeStatus() {
      const result = await isBindCode();
      if (result.is_show == 1) {
        setTimeout(() => {
          this.invoteCodeBox = true;
        }, 1000);
      }
    },
    //绑定邀请码
    async downBind() {
      const success = () => {
        localStorage.setItem("isBindCode", true);
        this.invoteCodeBox = false;
        this.loadingResult = false;
      };
      const result = await this.$refs.codeInp.bindInviteCode();
      await this.$store.dispatch("upAccount");
      result && success();
    },
    //放弃邀请码
    async giveUp() {
      const result = await giveUpCode();
      if (result.code == 2000) {
        this.$notify({
          type: "success",
          //放弃成功
          message: this.$t("notify.give_success"),
          verticalAlign: "top",
          horizontalAlign: "center",
        });
        this.giveUpBox = false;
        this.invoteCodeBox = false;
        localStorage.setItem("isBindCode", true);
      }
    },
    //再等等
    waitEnterCode() {
      this.invoteCodeBox = false;
      localStorage.setItem("isBindCode", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-code-box {
  text-align: center;
  padding: 24px 21px 32px 21px;
  img {
    width: 48px;
    height: 48px;
  }
  .h4 {
    margin-bottom: 8px;
    font-weight: bold;
    color: $titleColor;
  }
  .h5 {
    margin-bottom: 24px;
    color: $remarkColor;
  }
  .invite-submit {
    width: 100%;
    margin-top: 24px;
  }
  .other-oper {
    width: 240px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
    margin-bottom: 24px;
    span {
      cursor: pointer;
      display: inline-block;
      font-size: 14px;
      color: #676c7a;
    }
    span:first-child,
    span:last-child {
      width: 49%;
      text-align: center;
    }
    span:nth-child(2) {
      color: #dddddd;
    }
  }
}
.giveup-box {
  text-align: center;
  span {
    display: inline-block;
    width: 16px;
  }
  p:last-child {
    margin-bottom: 8px;
  }
}
</style>