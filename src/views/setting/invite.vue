<template>
  <div class="">
    <modal :show.sync="creatInvite" modalClasses="login-box-modal other-modal">
      <div class="invite-edit" v-if="active == 1">
        <img :src="require('@/assets/images/setting/boxInvite.png')" alt="" />
        <p class="h4">
          <!-- 自定义专属推荐码 -->
          {{ $t("invite.own_set_invite") }}
        </p>
        <p class="h5" :class="app.language == 'en' && 'last-h5'">
          <!-- 6位数推荐码，可用数字、英文组合 -->
          {{ $t("invite.invite_own_remark") }}
        </p>
        <p class="h5 last-h5">
          <!-- 设置完成后不可修改 -->
          {{ $t("invite.invite_not_change") }}
        </p>
        <CodeInp @detectCode="isByCode" :bind="true" ref="codeInp" />
        <p class="code-start" v-if="used">
          <span class="iconfont icon-xiaoyan_check-one pass"></span>
          <!-- 该推荐码可用 -->
          {{ $t("invite.invite_use") }}
        </p>
        <p class="code-start" v-if="notUsed">
          <span class="iconfont icon-guanbi_close-one stop"></span>
          <!-- 该推荐码已被占用 -->
          {{ $t("invite.invite_un_use") }}
        </p>
        <p class="oper-btn">
          <base-button
            type="default"
            round
            @click="
              $refs.codeInp.code = [];
              creatInvite = false;
            "
          >
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span></span>
          <base-button
            type="info"
            round
            @click="createCodeEvent"
            :loading="loadBtn"
            :disabled="loadBtn"
          >
            <!-- 确定 -->
            {{ $t("public.confirm_2") }}
          </base-button>
        </p>
      </div>
      <div v-else class="create-success">
        <p class="icon-box">
          <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
        </p>
        <p class="h4">
          <!-- 恭喜 -->
          {{ $t("invite.wish") }}
        </p>
        <p class="h5">
          <!-- 您的专属推荐码已生成 -->
          {{ $t("invite.invite_has_create") }}
        </p>
        <p class="code-box">
          {{ code.toUpperCase() }}
        </p>
        <p class="oper-btn">
          <base-button
            type="info"
            round
            @click="
              creatInvite = false;
              active = 1;
            "
          >
            <!-- 确定 -->
            {{ $t("public.confirm") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { createCode, userInfo } from "@/request/api";
import { mapState } from 'vuex';
export default {
  name: "InviteEdit",
  components: {
    Modal,
    CodeInp: (resolve) => require(["@/comsmine/codeInp"], resolve),
  },
  data() {
    return {
      creatInvite: false,
      notUsed: false, //不可用
      used: false, //可用
      code: null, //邀请码
      loadBtn: false, //按钮状态
      active: 1, //当前步骤
    };
  },
  computed:{
    ...mapState(['app'])
  },
  methods: {
    //检测邀请码可否可用
    isByCode(_status, _code) {
      if (_status == 0) {
        this.notUsed = true;
        this.used = false;
      } else if (_status == 1) {
        this.notUsed = false;
        this.used = true;
        this.code = _code;
      } else {
        this.notUsed = false;
        this.used = false;
      }
    },
    //提交创建邀请码
    createCodeEvent() {
      if (!this.code) {
        this.$notify({
          type: "danger",
          //请输入自定义6位推荐码
          message: this.$t("notify.pls_invite"),
        });
      }
      const submit = async () => {
        this.loadBtn = true;
        const result = await createCode({
          invite_code: this.code.toUpperCase(),
        });
        this.loadBtn = false;
        if (result.code != 2000) {
          this.$notify({
            verticalAlign: "top",
            horizontalAlign: "center",
            type: "danger",
            message: result.msg,
          });
          return;
        }
        this.active = 2;
        userInfo().then((res) => {
          this.$store.dispatch("setAccount", res);
        });
      };
      this.code && submit();
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-edit {
  padding: 24px 24px 8px 24px;
  text-align: center;
  img {
    width: 48px;
    height: 48px;
  }
  .h4 {
    color: $titleColor;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .h5 {
    color: $remarkColor;
    margin-bottom: 0;
  }
  .last-h5 {
    margin-bottom: 24px;
  }
  .code-start {
    font-size: 12px;
    color: $remarkColor;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    height: 18px;
    .iconfont {
      margin-right: 4px;
      font-size: 14px;
    }
    .pass {
      color: #00cc29;
    }
    .stop {
      color: #ff441f;
    }
  }
  .oper-btn {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    span {
      display: inline-block;
      width: 24px;
    }
  }
}
.create-success {
  text-align: center;
  padding: 24px 24px 8px 24px;
  .icon-box {
    width: 44px;
    height: 44px;
    background: linear-gradient(90deg, #00b0f0 0%, #a7f0ba 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 18px;
    border-radius: 50%;
    span {
      font-size: 28px;
      color: white;
      font-weight: bold;
    }
  }
  .h4 {
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 8px;
  }
  .h5 {
    color: $remarkColor;
    margin-bottom: 24px;
  }
  .code-box {
    width: 240px;
    height: 48px;
    background: #f5f6fa;
    line-height: 48px;
    margin: 0 auto;
    font-size: 23px;
    font-weight: bold;
    color: #2a2a2a;
    letter-spacing: 4px;
  }
  .oper-btn {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    button {
      width: 240px;
    }
  }
}
@media screen and (max-width: 1279px) {
  .invite-edit {
    padding: 0;
  }
}
</style>