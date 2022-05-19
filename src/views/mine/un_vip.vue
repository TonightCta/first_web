// 非会员
<template>
  <div class="un-vip">
    <div
      class="title-box"
      :style="{
        margin: app.isBureau == 1 && $flag ? '0 0.875rem' : '0',
        'margin-top': app.isBureau == 1 && '1rem',
        width: app.isBureau == 1 && 'auto',
      }"
      v-if="app.isBureau == 1 ? app.account.information_status == 2 : app.account.status == 3"
    >
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        {{
          app.language == "en"
            ? `Your membership has expired and you cannot enjoy
              enjoy the membership benefits of ${ app.isBureau == 0 ? 'Research Center' : 'News Center' }`
            : `您的会员已过期，无法继续享受${
                app.isBureau == 0 ? "研报库" : "情报局"
              }会员权益。`
        }}
      </p>
      <p></p>
    </div>
    <div
      class="title-box"
      :style="{
        margin: app.isBureau == 1 && $flag ? '0.875rem 0' : '0',
        width: app.isBureau == 1 && 'auto',
      }"
      v-else
    >
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        {{
          app.language == "en"
            ? `You are not the subscriber of ${ app.isBureau == 1 ? $t('public.into_bureau') : $t('public.into_project') } and cannot enjoy the membership benefits`
            : `您还不是${
                app.isBureau == 0 ? "研报库" : "情报局"
              }会员，无法享受${
                app.isBureau == 0 ? "研报库" : "情报局"
              }会员的相关权益`
        }}
      </p>
      <p v-if="false">
        <base-button
          type="info"
          round
          :class="app.isBureau == 1 && 'other-info'"
          @click="scrollSS"
        >
          <!-- 成为会员 -->
          {{ $t("public.mead_vip") }}
        </base-button>
      </p>
    </div>
    <div class="invite-box" v-if="!$flag">
      <div class="invite-msg">
        <p class="invite-icon">
          <img :src="require('@/assets/images/inviteCode.png')" alt="" />
        </p>
        <div class="msg-right">
          <p class="h3">
            <!-- 非年费会员累计推荐100个试用会员或任意10个年费会员，即可兑换1个包年套餐 -->
            {{ $t("public.get_reward") }}
          </p>
          <p class="h4">
            <!-- 我的推荐码： -->
            {{ $t("public.my_code") }}
            <span class="code-text">
              {{ app.account.code ? app.account.code : $t("public.un_set") }}
            </span>
            <span
              class="code-remark"
              style="margin-left: 16px"
              v-if="app.account.code"
            >
              ({{ app.language == 'en' ? 'Invited' : '您当前已推荐' }}<span class="code-text"> {{ inviteMsg.try }} </span
              >{{ app.language == 'en' ? 'trial subscriber' : '个试用会员' }}，<span class="code-text"> {{ inviteMsg.year }} </span
              >{{ app.language == 'en' ? 'annual subscriber' : '个年费会员' }})
            </span>
            <span class="code-remark" v-else>
              <!-- 请生成您的专属推荐码，长期享受推荐有奖活动 -->
              （{{ $t("up_vip.set_remark") }}）
            </span>
          </p>
        </div>
      </div>
      <div class="invite-oper">
        <p
          v-if="app.account.code"
          @click="copyCodeUrl"
          class="copy copy-icon"
          :data-clipboard-text="baseUrl + '?code=' + app.account.code"
        >
          <i class="iconfont icon-fuzhi_copy"></i>
        </p>
        <InviteBtn
          v-if="app.account.code"
          :isUnvip="true"
          style="margin-left: 16px"
        />
        <base-button
          type="info"
          :class="app.isBureau == 1 && 'other-info'"
          round
          @click="$refs.createCode.creatInvite = true"
          v-else
        >
          <!-- 生成推荐码 -->
          {{ $t("public.create_code") }}
        </base-button>
        <!-- 下载海报 -->
        <DownPoster />
      </div>
    </div>
    <div
      class="invite-box-mobile"
      v-if="$flag"
      :style="{
        margin: app.isBureau == 1 ? '0 0.875rem' : '1rem 0 0',
        'margin-top': app.isBureau == 1 && '1rem',
      }"
    >
      <div class="invite-top">
        <div style="display: flex; align-items: center">
          <p class="top-icon">
            <span class="iconfont icon-quan_ticket"></span>
          </p>
          <p class="top-text">
            <!-- 我的推荐码 -->
            {{ $t("public.my_code") }}
            <span
              class="code-text"
              @click="
                !app.account.code ? ($refs.createCode.creatInvite = true) : null
              "
            >
              {{ app.account.code ? app.account.code : $t("public.un_set") }}
            </span>
          </p>
        </div>
        <div style="display: flex">
          <p
            v-if="app.account.code"
            @click="copyCodeUrl"
            class="copy copy-icon"
            :data-clipboard-text="baseUrl + '?code=' + app.account.code"
          >
            <i class="iconfont icon-fuzhi_copy"></i>
          </p>
          <!-- 下载海报 -->
          <DownPoster />
        </div>
      </div>

      <p class="invite-line"></p>
      <div class="invite-bottom">
        <p>
          <!-- 非年费会员累计推荐100个试用会员或10个年费会员，即可兑换1个包年套餐 -->
          {{ $t("public.get_reward") }}
        </p>
        <p>
          <span v-if="app.account.code">
            您当前已推荐<span class="code-text"> {{ inviteMsg.try }} </span
            >个试用会员，<span class="code-text"> {{ inviteMsg.year }} </span
            >个年费会员
          </span>
          <span class="code-remark" v-else>
           （
            <!-- 请生成您的专属推荐码，长期享受推荐有奖活动 -->
            {{ $t("up_vip.set_remark") }}
            ）
          </span>
          <MobileInviteBtn :icon="false" v-if="app.account.code" />
        </p>
      </div>
    </div>
    <p class="meal-title">
      {{ $t('meal.meal_title') }}
    </p>
    <p class="meal-remark">
      {{
        app.isBureau == 1
          ? $t('meal.meal_remark_2')
          : $t('meal.meal_remark')
      }}
    </p>
    <Meal class="meal" v-if="!$flag" />
    <MobileMeal v-else />
    <!-- 设置邀请码奖励 -->
    <RewardChoice
      ref="rewardchoice"
      :need="baseUrl + '?code=' + app.account.code"
    />
    <!-- 创建邀请码 -->
    <Invite ref="createCode" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { InviteNumber } from "@/request/api";
import Clipboard from "clipboard";
export default {
  name: "UnVip",
  data() {
    return {
      inviteMsg: {
        try: 0,
        year: 0,
      },
    };
  },
  components: {
    Meal: (resolve) => require(["../coms/meal_list"], resolve),
    MobileMeal: (resolve) => require(["../coms/mobile_meal"], resolve),
    InviteBtn: (resolve) => require(["../coms/invite_button.vue"], resolve),
    MobileInviteBtn: (resolve) =>
      require(["../coms/mobile_invite_button"], resolve),
    RewardChoice: (resolve) => require(["@/comsmine/reward_choice"], resolve),
    DownPoster: (resolve) => require(["@/comsmine/down_poster"], resolve),
    Invite: (resolve) => require(["../setting/invite"], resolve),
  },
  computed: {
    ...mapState(["app"]),
    baseUrl() {
      return process.env.VUE_APP_RESET + "/#/index";
    },
  },
  created() {
    this.getInviteNum();
  },
  methods: {
    scrollSS() {
      let container = document.querySelector(".mine-view");
      container.scrollTo({
        top: this.$flag
          ? document.querySelector(".meal-title").offsetTop
          : document.querySelector(".meal").offsetTop,
        behavior: "smooth",
      });
    },
    //用户邀请数量
    async getInviteNum() {
      const result = await InviteNumber();
      this.inviteMsg = result;
    },
    //复制邀请链接
    copyCodeUrl() {
      if (
        this.app.account.reward_tip == 1 &&
        this.app.account.meal_id != 0 &&
        this.app.account.is_information != 0
      ) {
        this.$refs.rewardchoice.choiceBox = true;
        return;
      }
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          //邀请链接复制成功
          message: this.$t('notify.link_copy'),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          //复制失败
          message: this.$t('notify.copy_falied'),
        });
        clipboard.destroy();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.un-vip {
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
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
        font-size: 22px;
      }
      .high {
        margin-right: 12px;
        color: $success;
      }
    }
  }
  .invite-box {
    padding: 40px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $contentBg;
    margin-top: 16px;
    margin-bottom: 80px;
    border-radius: 4px;
    .invite-msg {
      display: flex;
      .invite-icon {
        width: 72px;
        height: 72px;
        background: $conBg2;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 48px;
          height: 48px;
        }
      }
      .msg-right {
        display: flex;
        flex-direction: column;
        margin-left: 6px;
        height: 72px;
        justify-content: space-between;
        padding: 6px 0;
        .h3 {
          margin-bottom: 0;
          color: white;
          line-height: 30px;
        }
        .h4 {
          margin-bottom: 0;
          color: white;
          line-height: 28px;
          span {
            color: $remarkColor;
          }
          .code-text {
            color: $success;
          }
        }
      }
    }
  }
  .invite-box-mobile {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    background: $contentBg;
    border-radius: 4px;
    margin-top: 1rem;
    .copy-icon {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: $info;
      cursor: pointer;
      .iconfont {
        font-size: 1rem;
      }
    }
    .code-text {
      color: $success;
    }
    .invite-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .top-icon {
        font-size: 1rem;
        margin-right: 0.5rem;
      }
      .top-text {
        font-size: $fon12;
        transform: translateY(1px);
      }
    }
    .invite-line {
      height: 1px;
      width: 100%;
      background: $conBg2;
      margin: 1rem 0;
    }
    .invite-bottom {
      p:first-child {
        font-size: $fon12;
        color: white;
        line-height: 1rem;
      }
      p:last-child {
        display: flex;
        justify-content: space-between;
        font-size: $fon12;
        margin-top: 0.5rem;
        .invite-data {
          color: $iconColor;
        }
      }
    }
  }
  .invite-oper {
    display: flex;
    align-items: center;
    .copy-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: $info;
      cursor: pointer;
      .iconfont {
        font-size: 16px;
      }
    }
  }
  .meal-title {
    font-size: $fon18;
    color: $success;
    text-align: center;
    margin-top: 3.75rem;
    margin-bottom: 1rem;
  }
  .meal-remark {
    font-size: $fon12;
    text-align: center;
    color: white;
    margin-bottom: 2.6rem;
  }
}
@media screen and (min-width: 1280px) {
  .meal-title {
    display: none;
  }
  .meal-remark {
    display: none;
  }
}
@media screen and (max-width: 1279px) {
  .un-vip {
    .title-box {
      .h4 {
        font-size: $fon12;
        .iconfont {
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>