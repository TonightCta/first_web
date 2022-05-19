<template>
  <!-- 标题信息 -->
  <div class="title-box">
    <div class="title-left">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 服务期限至 -->
        {{ $t("bureau_mine.till") }}
        <mt-spinner :type="2" color="#a7f0ba" v-if="!expireDate"></mt-spinner>
        <span class="high" v-else>
          {{ expireDate }}
        </span>
      </p>
      <p>
        <base-button
          type="info"
          round
          @click="
            app.account.is_information == 1 ? reNew(1) : (chioceMeal = true)
          "
        >
          <!-- 立即续费 -->
          {{ $t("public.renew") }}
        </base-button>
      </p>
    </div>
    <div class="title-right">
      <p
        class="h4"
        @click="
          !app.account.code ? ($refs.createCode.creatInvite = true) : null
        "
      >
        <span class="iconfont icon-quan_ticket"></span>
        <!-- 我的推荐码： -->
        {{ $t("public.my_code") }}
        <span class="high">
          {{ app.account.code ? app.account.code : $t("public.un_set") }}
        </span>
      </p>
      <div class="title-btn-box">
        <div class="btn-box-pc" v-if="app.account.code">
          <p
            class="copy copy-icon"
            @click="copyCodeUrl"
            :data-clipboard-text="baseUrl + '?code=' + app.account.code"
          >
            <i class="iconfont icon-fuzhi_copy"></i>
          </p>
          <InviteBtn style="margin-left: 16px" />
        </div>
        <base-button
          type="info"
          round
          v-if="!app.account.code"
          @click="$refs.createCode.creatInvite = true"
        >
          <!-- 生成推荐码 -->
          {{ $t("public.create_code") }}
        </base-button>
        <div class="btn-box-mobile" v-if="app.account.code">
          <p
            class="copy"
            @click="copyCodeUrl"
            :data-clipboard-text="baseUrl + '?code=' + app.account.code"
          >
            <span class="iconfont icon-fuzhi_copy"></span>
          </p>
          <p>
            <MobileInviteBtn :icon="true" />
          </p>
        </div>
        <!-- 下载海报 -->
        <DownPoster />
      </div>
    </div>
    <!-- 邀请奖励选择 -->
    <RewardChoice
      ref="rewardchoice"
      :need="baseUrl + '?code=' + app.account.code"
    />
    <!-- 选择套餐 -->
    <van-dialog v-model="chioceMeal" :showConfirmButton="false" width="320">
      <div class="pay-success">
        <p class="icon-box">
          <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
        </p>
        <p class="success-title">
          <!-- 续费情报局套餐 -->
          {{ $t("bureau_mine.renew") }}
        </p>
        <ul>
          <li @click="reNew(1)">
            <p class="iconfont icon-taocantubiao_baonian"></p>
            <p>
              <!-- 包年套餐 -->
              {{ $t("bureau_mine.renew_year") }}
            </p>
          </li>
          <li @click="reNew(2)">
            <p class="iconfont icon-taocantubiao_yiyuan"></p>
            <p>
              <!-- 1元套餐 -->
              {{ $t("bureau_mine.renew_one") }}
            </p>
          </li>
        </ul>
        <p class="success-btn">
          <base-button type="default" round @click="chioceMeal = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
        </p>
      </div>
    </van-dialog>
    <!-- 创建邀请码 -->
    <Invite ref="createCode" />
  </div>
</template>

<script>
import * as api from "@/request/api";
import { mapState } from "vuex";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      expireDate: null, //会员到期时间
      chioceMeal: false, //选择套餐
    };
  },
  computed: {
    ...mapState(["app"]),
    baseUrl() {
      return process.env.VUE_APP_RESET + "/#/index";
    },
  },
  components: {
    InviteBtn: (resolve) => require(["@/views/coms/invite_button"], resolve),
    MobileInviteBtn: (resolve) =>
      require(["@/views/coms/mobile_invite_button"], resolve),
    RewardChoice: (resolve) => require(["@/comsmine/reward_choice"], resolve),
    DownPoster: (resolve) => require(["@/comsmine/down_poster"], resolve),
    Invite: (resolve) => require(["../../../setting/invite"], resolve),
  },
  created() {
    this.getExpire();
  },
  methods: {
    // 获取到期时间
    async getExpire() {
      const result = await api.expireDate();
      this.expireDate = result.expire;
    },
    //续费会员
    async reNew(meal_type) {
      this.$store.dispatch("setPoint", 3);
      const result = await api.priceList();
      const priceInfo = await api.mealInfo({
        id:
          meal_type == 1
            ? result[result.length - 2].id
            : result[result.length - 1].id,
      });
      const orderMsg = {
        id:
          meal_type == 1
            ? result[result.length - 2].id
            : result[result.length - 1].id,
        price1: priceInfo.price1,
        price: priceInfo.price,
        name:
          meal_type == 1
            ? result[result.length - 2].name
            : result[result.length - 1].name,
      };
      this.chioceMeal = false;
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$router.push(this.$flag ? "/mobile-place-order" : "/placeOrder");
    },
    //复制邀请链接
    copyCodeUrl() {
      this.$store.dispatch("setPoint", 16);
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
          message: this.$t("notify.link_copy"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          //复制失败,请稍后再试
          message: this.$t("notify.copy_falied"),
        });
        clipboard.destroy();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-info {
  background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
}
.title-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .title-left {
    display: flex;
    justify-content: space-between;
    background: $contentBg;
    padding: 0 24px;
    border-radius: 4px;
    align-items: center;
    height: 64px;
    width: calc(50% - 15px);
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
        margin-left: 4px;
      }
    }
  }
  .title-right {
    width: calc(50% - 15px);
    display: flex;
    height: 64px;
    justify-content: space-between;
    background: $contentBg;
    margin-left: 30px;
    border-radius: 4px;
    align-items: center;
    padding: 0 24px;
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
        margin-left: 4px;
      }
    }
    .title-btn-box {
      display: flex;
      align-items: center;
      .btn-box-pc {
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
      .btn-box-mobile {
        display: flex;
        p {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: $info;
          display: flex;
          justify-content: center;
          margin-left: 1rem;
          align-items: center;
          .iconfont {
            font-size: $fon14;
            color: white;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1579px) {
  .btn-box-mobile {
    display: none !important;
  }
}
@media screen and (max-width: 1578px) {
  .title-box {
    flex-direction: column;
    .title-left {
      width: 100%;
      padding: 0 1rem;
      .h4 {
        font-size: $fon12;
        width: auto;
        .iconfont {
          font-size: 1rem;
        }
      }
    }
    .title-right {
      width: 100%;
      padding: 1rem 1rem;
      margin-left: 0;
      margin-top: 1rem;
      .title-btn-box {
        .btn-box-pc {
          display: none;
        }
      }
      .h4 {
        font-size: $fon12;
        width: auto;
        .iconfont {
          font-size: 1rem;
        }
      }
    }
  }
}
.pay-success {
  text-align: center;
  padding: 48px;
  .success-title {
    font-size: 17px;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 40px;
  }
  ul {
    margin-bottom: 38px;
    display: flex;
    li {
      margin-bottom: 16px;
      width: 100px;
      height: 100px;
      display: flex;
      flex-direction: column;
      margin-right: 24px;
      border: 1px solid $textColor;
      border-radius: 4px;
      justify-content: center;
      cursor: pointer;
      transition: 0.3s all;
      .iconfont {
        font-size: 40px;
        color: $textColor;
        margin-bottom: 8px;
      }
      p {
        color: $remarkColor;
        font-size: 12px;
      }
    }
    li:hover {
      background: #f2faff;
      border-color: #33b1ff;
      .iconfont {
        color: #33b1ff;
      }
      p {
        color: #33b1ff;
      }
    }
    li:last-child {
      margin-right: 0;
    }
  }
  .success-remark {
    font-size: $fon12;
    color: $remarkColor;
    margin-bottom: $padd24;
  }
}
@media screen and (max-width: 1279px) {
  .title-box {
    margin-top: 1rem;
  }
}
</style>