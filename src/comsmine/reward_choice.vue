// 邀请码奖励切换
<template>
  <div class="reward-choice">
    <modal :show.sync="choiceBox" modalClasses="login-box-modal">
      <div class="choice-box">
        <p>
          <!-- 设置 -->
          {{ $t("routes.set") }}
        </p>
        <p>
          <!-- 新会员通过您的推荐码购买年费会员 -->
          {{ $t("year_vip.reward_remark_1") }}
          <br />
          <!-- 可为您购买的以下产品赠送一个月时长 -->
          {{ $t("year_vip.reward_remark_2") }}
        </p>
        <p>
          <base-radio name="1" v-model="rewardType">
            <!-- 研报库会员 -->
            {{ $t("public.vip_1") }}
          </base-radio>
          <base-radio name="2" v-model="rewardType">
            <!-- 情报局会员 -->
            {{ $t("public.vip_2") }}
          </base-radio>
        </p>
        <p>
          <el-checkbox v-model="isRepeat">
            <!-- 下次不提醒(可在设置中修改) -->
            {{ $t("year_vip.next_tip") }}
          </el-checkbox>
        </p>
        <p>
          <base-button type="default" round @click="choiceBox = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
          <span class="label"></span>
          <base-button
            type="info"
            v-clipboard:copy="need"
            v-clipboard:success="firstCopySuccess"
            v-clipboard:error="firstCopyError"
            round
            @click="turnChoice"
            :class="app.isBureau == 1 && 'other-info'"
          >
            <!-- 确认 -->
            {{ $t("public.confirm") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal, BaseRadio } from "@/components";
import { changeReward, userInfo, hideReward } from "@/request/api";
import { mapState } from "vuex";
export default {
  props: ["need"],
  data() {
    return {
      choiceBox: false,
      rewardType: "1",
      isRepeat: false, //是否继续提示
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  components: {
    Modal,
    BaseRadio,
  },
  methods: {
    //提交选项
    async turnChoice() {
      const result = await changeReward({
        type: this.rewardType,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      //是否继续出现该提示
      this.isRepeat && (await hideReward());
      userInfo().then((res) => {
        this.$store.dispatch("setAccount", res);
      });
      this.$emit("continueCopy", true);
      this.choiceBox = false;
    },
    firstCopySuccess() {
      this.$notify({
        type: "success",
        //复制成功
        message: this.$t('notify.copy_success'),
      });
    },
    firstCopyError() {
      this.$notify({
        type: "danger",
        //复制失败，请稍后再试
        message: this.$t('notify.copy_falied'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.other-info {
  background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
}
.choice-box {
  padding: 24px 24px 32px 24px;
  text-align: center;
  p:first-child {
    font-size: 17px;
    color: $titleColor;
    font-weight: bold;
    margin-bottom: 8px;
  }
  p:nth-child(2) {
    font-size: 12px;
    color: $remarkColor;
  }
  p:nth-child(3) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin-top: 24px;
    /deep/ .form-check {
      margin-top: 0;
      label {
        color: $titleColor;
        font-size: 14px;
        margin-right: 24px;
      }
    }
    /deep/ .form-check:last-child {
      label {
        margin-right: 0;
      }
    }
  }
  p:nth-child(4) {
    margin-top: 8px;
    /deep/ .el-checkbox__inner {
      border-radius: 4px;
    }
    /deep/ .el-checkbox{
      display: flex;
      align-items: center;
    }
    /deep/ .el-checkbox__label {
      padding-left: 8px;
      font-size: 12px;
      color: #676c7a;
      white-space: normal;
      word-break: break-all;
      text-align: left;
    }
  }
  p:last-child {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    .label {
      display: inline-block;
      width: 24px;
    }
  }
}
</style>