<template>
  <div class="setting" :class="app.isBureau == 1 && 'bureau-setting'">
    <p class="user-id">
      <span class="iconfont icon-bianhao_id"></span>
      UID：<font>{{ app.account.uid }}</font>
    </p>
    <!-- NFT管理 -->
    <div class="col-md-12 mobile-setting" v-if="app.account.nft">
      <div class="inner-box">
        <div class="msg-box">
          <p class="icon-box">
            <img :src="require('@/assets/images/setting/boxNft.png')" alt="" />
            <span class="icon-bg" v-if="app.account.nft.status == 4">
              <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
            </span>
          </p>
          <div class="bind-msg">
            <p class="h3">我的NFT</p>
            <p class="h5">
              凡是研报库包年会员即送1个NFT，且推荐3个研报库年费会员再送一个NFT（推荐可累加）。
            </p>
          </div>
        </div>
        <div class="oper-box">
          <base-button
            v-if="app.account.nft.status == 5"
            type="info"
            round
            class="danger-style"
            >已失效</base-button
          >
          <base-button
            type="info"
            round
            @click="getNFTStatus"
            v-if="app.account.nft.status == 2"
          >
            <!-- 开奖 -->
            开奖
            <!-- {{ $t("setting.bind_wallet") }} -->
          </base-button>
          <base-button
            type="info"
            v-if="app.account.nft.status == 3"
            @click="getNFTStatus"
            round
          >
            <!-- 领取 -->
            领取
            <!-- {{ $t("setting.copy_address") }} -->
          </base-button>
          <base-button
            type="default"
            v-if="app.account.nft.status == 4"
            @click="viewNFT"
            round
          >
            <!-- 领取 -->
            链上查看
            <!-- {{ $t("setting.copy_address") }} -->
          </base-button>
        </div>
      </div>
    </div>
    <!-- 钱包地址编辑 -->
    <div class="col-md-12 mobile-setting">
      <div class="inner-box">
        <div class="msg-box">
          <p class="icon-box">
            <img
              :src="require('@/assets/images/setting/boxWallet.png')"
              alt=""
            />
            <span
              class="icon-bg"
              :class="{ unBind: !app.account.wallet_address }"
            >
              <span
                class="iconfont icon-gengduo_more"
                v-if="!app.account.wallet_address"
              ></span>
              <span
                class="iconfont icon-xiaoyan-xiao_check-small"
                v-else
              ></span>
            </span>
          </p>
          <div class="bind-msg">
            <p class="h3">
              {{
                app.language == "en"
                  ? !app.account.wallet_address
                    ? `You have not linked the wallet`
                    : `Wallet linked`
                  : `${!app.account.wallet_address ? "未" : "已"}绑定钱包`
              }}
            </p>
            <p
              class="h5"
              :class="app.language == 'en' && 'h5-en'"
              v-if="app.account.wallet_address"
            >
              <font>
                <!-- 钱包地址： -->
                {{ $t("setting.wallet_address") }}
              </font>
              <span>
                {{ app.account.wallet_address }}
              </span>
            </p>
            <p class="h5" v-else>
              <!-- 您尚未绑定钱包，为保障您对相关服务功能的正常使用，请尽快完成钱包绑定。 -->
              {{ $t("setting.un_bind_wallet") }}
              <span v-if="!mobileType" style="margin-top: 0.3rem"
                >请用钱包浏览器登录绑定钱包。</span
              >
            </p>
          </div>
        </div>
        <div class="oper-box">
          <base-button
            type="info"
            round
            v-if="!app.account.wallet_address"
            @click="bindAddress()"
            :loading="bindStatusLoading"
            :disabled="bindStatus"
            :class="app.isBureau == 1 && 'other-info'"
          >
            <!-- 绑定钱包 -->
            {{ $t("setting.bind_wallet") }}
          </base-button>
          <base-button
            type="default"
            round
            v-else
            :data-clipboard-text="app.account.wallet_address"
            class="copy"
            @click="copyCode"
          >
            <!-- 复制地址 -->
            {{ $t("setting.copy_address") }}
          </base-button>
        </div>
      </div>
    </div>
    <!-- 手机号编辑 -->
    <div class="col-md-12 mobile-setting">
      <div class="inner-box">
        <div class="msg-box">
          <p class="icon-box">
            <img :src="require('@/assets/images/setting/mobile.png')" alt="" />
            <span class="icon-bg" :class="{ unBind: !app.account.mobile }">
              <span
                class="iconfont icon-gengduo_more"
                v-if="!app.account.mobile"
              ></span>
              <span
                class="iconfont icon-xiaoyan-xiao_check-small"
                v-else
              ></span>
            </span>
          </p>
          <div class="bind-msg">
            <p class="h3">
              {{
                app.language == "en"
                  ? !app.account.mobile
                    ? `You have not linked mobile number`
                    : `Mobile number linked`
                  : `${!app.account.mobile ? "未" : "已"}绑定安全手机`
              }}
            </p>
            <p
              class="h5"
              :class="app.language == 'en' && 'h5-en'"
              v-if="app.account.mobile"
            >
              <font>
                <!-- 当前号码： -->
                {{ $t("setting.now_number") }}&nbsp;
              </font>
              <span>
                {{ app.account.mobile.substr(0, 3) }} ***
                {{ app.account.mobile.substr(7, 11) }}
              </span>
            </p>
            <p class="h5" style="color: #dddfe6" v-else>
              <!-- 您尚未绑定安全手机，为保障您对相关服务功能的正常使用，请尽快完成手机绑定。 -->
              {{ $t("setting.un_bind_mobile") }}
            </p>
          </div>
        </div>
        <div class="oper-box">
          <base-button
            type="info"
            round
            v-if="!app.account.mobile"
            @click="$refs.mobileEdit.getWorkType(1)"
            :class="app.isBureau == 1 && 'other-info'"
          >
            <!-- 绑定手机 -->
            {{ $t("setting.bind_mobile") }}
          </base-button>
          <base-button
            type="default"
            round
            v-else
            @click="$refs.mobileEdit.getWorkType(2)"
          >
            <!-- 更换号码 -->
            {{ $t("setting.change_mobile") }}
          </base-button>
        </div>
      </div>
    </div>
    <!-- 邮箱编辑 -->
    <div class="col-md-12 email-setting">
      <div class="inner-box">
        <div class="msg-box">
          <p class="icon-box">
            <img :src="require('@/assets/images/setting/email.png')" alt="" />
            <span class="icon-bg" :class="{ unBind: !app.account.email }">
              <span
                class="iconfont icon-gengduo_more"
                v-if="!app.account.email"
              ></span>
              <span
                class="iconfont icon-xiaoyan-xiao_check-small"
                v-else
              ></span>
            </span>
          </p>
          <div class="bind-msg">
            <p class="h3">
              {{
                app.language == "en"
                  ? !app.account.email
                    ? `You have not linked Email`
                    : `Email Linked`
                  : `${!app.account.email ? "未" : "已"}绑定安全邮箱`
              }}
            </p>
            <p
              class="h5"
              :class="app.language == 'en' && 'h5-en'"
              v-if="app.account.email"
            >
              <font>
                <!-- 当前邮箱： -->
                {{ $t("setting.now_email") }}&nbsp;
              </font>
              <span> {{ app.account.email }} </span>
            </p>
            <p class="h5" style="color: #dddfe6" v-else>
              <!-- 您尚未绑定安全邮箱，为保障您对相关服务功能的正常使用，请尽快完成邮箱绑定。 -->
              {{ $t("setting.un_bind_email") }}
            </p>
          </div>
        </div>
        <div class="oper-box">
          <base-button
            type="info"
            round
            v-if="!app.account.email"
            @click="$refs.emailEdit.getWorkType(1)"
            :class="app.isBureau == 1 && 'other-info'"
          >
            <!-- 绑定邮箱 -->
            {{ $t("setting.bind_email") }}
          </base-button>
          <base-button
            type="default"
            round
            v-else
            @click="$refs.emailEdit.getWorkType(2)"
          >
            <!-- 更换邮箱 -->
            {{ $t("setting.change_email") }}
          </base-button>
        </div>
      </div>
    </div>
    <!-- 邀请编辑 -->
    <div class="col-md-12 invite-setting">
      <div class="inner-box">
        <div class="msg-box">
          <p class="icon-box">
            <img :src="require('@/assets/images/setting/invite.png')" alt="" />
          </p>
          <div class="bind-msg">
            <p class="h3" :class="$flag && 'h3-en'">
              <!-- 我的推荐码 -->
              {{ $t("setting.my_code") }}
              <span class="set-code-en" v-if="$flag">
                {{ app.account.code ? app.account.code : $t("public.un_set") }}
              </span>
              <span v-if="!$flag" class="current-pc">
                <!-- 我的推荐人： -->
                {{ $t("setting.my_current") }}&nbsp;
                <font>
                  {{
                    app.account.parent
                      ? app.account.parent
                      : $t("public.un_set")
                  }}
                </font></span
              >
              <span
                class="set-code"
                v-if="!app.account.parent && !$flag"
                @click="$refs.invitecode.invoteCodeBox = true"
                >{{
                  $flag ? $t("setting.inp_code_mobile") : $t("setting.inp_code")
                }}</span
              >
            </p>
            <p class="mobile-cppy mobile-copy-en">
              <!-- 推荐码： -->
              <font>
                {{ $t("setting.invite_code") }}
                <span>{{
                  app.account.code ? app.account.code : $t("public.un_set")
                }}</span>
              </font>
              <span
                class="set-code"
                v-if="!app.account.parent"
                @click="$refs.invitecode.invoteCodeBox = true"
                >{{
                  $flag ? $t("setting.inp_code_mobile") : $t("setting.inp_code")
                }}</span
              >
            </p>
            <p class="h5">
              {{
                app.account.meal_id == 0 && app.account.is_information == 0
                  ? $t("public.get_reward")
                  : `${$t("year_vip.reward_remark_2")}，${$t(
                      "year_vip.reward_remark_1"
                    )}`
              }}
              <!-- 非年费会员累计推荐100个研报库试用会员或10个任意年费会员，即可兑换1个包年套餐 -->
              <!-- 新会员通过您的推荐码购买年费会员，可为您购买的以下产品赠送一个月时长 -->
            </p>
            <div
              class="reward-box"
              :class="app.language == 'en' && 'reward-box-en'"
              v-if="app.account.meal_id != 0 || app.account.is_information != 0"
            >
              <!-- 将获赠时长增加至 -->
              {{ $t("setting.choice_remark") }}
              <p>
                <span>
                  <base-radio
                    @input="test"
                    name="1"
                    v-model="rewardType"
                    :disabled="app.account.meal_id != 3"
                  >
                    <!-- 研报库会员 -->
                    {{ $t("public.vip_1") }}
                  </base-radio>
                </span>
                <span>
                  <base-radio
                    @input="test"
                    name="2"
                    v-model="rewardType"
                    :disabled="app.account.is_information != 1"
                  >
                    <!-- 情报局会员 -->
                    {{ $t("public.vip_2") }}
                  </base-radio>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="oper-box" v-if="!app.account.code">
          <base-button
            type="info"
            round
            @click="$refs.createCode.creatInvite = true"
            :class="app.isBureau == 1 && 'other-info'"
          >
            <!-- 生成推荐码 -->
            {{ $t("public.create_code") }}
          </base-button>
        </div>
        <div class="oper-box" v-else>
          <p class="h3">{{ app.account.code }}</p>
          <base-button
            type="default"
            class="copy"
            @click="copyCode"
            round
            :data-clipboard-text="app.account.code"
          >
            <!-- 复制 -->
            {{ $t("public.copy") }}
          </base-button>
        </div>
      </div>
    </div>
    <!-- 通知管理 -->
    <div class="col-md-12">
      <Notification />
    </div>
    <!-- 手机号编辑 -->
    <Mobile ref="mobileEdit" />
    <!-- 邮箱编辑 -->
    <Email ref="emailEdit" />
    <!-- 创建邀请码 -->
    <Invite ref="createCode" />
    <!-- 已绑定 -->
    <modal :show.sync="hasBindBox" modalClasses="login-box-modal">
      <div class="has-bind-box">
        <p class="icon-box">
          <span class="iconfont icon-guanbi_close"></span>
        </p>
        <p>
          <!-- 该地址已绑定用户，如有疑问，请联系销售顾问 -->
          {{ $t("setting.address_binded") }}
        </p>
        <p>
          <base-button type="default" round @click="hasBindBox = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
          <span class="label"></span>
          <base-button
            type="info"
            round
            v-clipboard:copy="contactWechat"
            v-clipboard:success="firstCopySuccess"
            v-clipboard:error="firstCopyError"
          >
            <!-- 复制销售顾问微信 -->
            {{ $t("public.confirm_2") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- 填写邀请码 -->
    <InviteCode ref="invitecode" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Clipboard from "clipboard";
import EthTool from "@/util//web3";
import * as api from "@/request/api";
import { Modal, BaseRadio } from "@/components";
export default {
  name: "Setting",
  data() {
    return {
      bindStatus: false, //地址绑定状态
      hasBindBox: false, //已经绑定提示
      contactWechat: "",
      bindStatusLoading: false,
      rewardType: "1", //奖励类型
    };
  },
  components: {
    Mobile: (resolve) => require(["./mobile"], resolve),
    Email: (resolve) => require(["./email"], resolve),
    Invite: (resolve) => require(["./invite"], resolve),
    Notification: (resolve) => require(["./notifications"], resolve),
    Modal,
    BaseRadio,
    InviteCode: (resolve) => require(["@/comsmine/invite_code"], resolve),
  },
  created() {
    this.getContact();
    const { code_reward } = this.app.account;
    this.rewardType = String(code_reward);
  },
  mounted() {
    this.mobileType ? (this.bindStatus = false) : (this.bindStatus = true);
  },
  computed: {
    ...mapState(["app"]),
    mobileType() {
      const { ethereum } = window;
      return ethereum ? true : false;
    },
    isEngMobile() {
      if (this.$flag && this.app.language == "en") {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    //查看NFT
    viewNFT() {
      window.open(process.env.VUE_APP_OPENSEA + this.app.account.nft.address);
    },
    //获取NFT领取信息
    getNFTStatus() {
      window.upDateNFT(true);
    },
    async test(_type) {
      if (_type == this.app.account.code_reward) {
        return;
      }
      const result = await api.changeReward({
        type: _type,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        //设置成功
        message: this.$t("notify.set_success"),
      });
      api.userInfo().then((res) => {
        this.$store.dispatch("setAccount", res);
      });
    },
    //绑定钱包地址
    async bindAddress() {
      const { ethereum } = window;
      this.bindStatus = true;
      this.bindStatusLoading = true;
      //阻断登录操作  --> accountsChanged
      this.$store.commit("upIsBindAddress", true);
      //判断钱包是已连接
      !ethereum.selectedAddress &&
        (await EthTool.signIn(true),
        (this.bindStatus = false),
        (this.bindStatusLoading = false),
        this.$store.commit("upIsBindAddress", false));
      const _address = ethereum.selectedAddress;
      //获取签名随机值
      const signNonce = await api.metaNonce({
        address: _address,
      });
      if (!signNonce.data.nonce) {
        this.bindStatus = false;
        this.bindStatusLoading = false;
        this.$store.commit("upIsBindAddress", false);
        return;
      }
      //调用钱包签名
      const sign = await EthTool.sign(_address, signNonce.data.nonce);
      if (!sign) {
        this.bindStatus = false;
        this.bindStatusLoading = false;
        this.$store.commit("upIsBindAddress", false);
        return;
      }
      //绑定钱包地址
      const result = await api.bindAddress({
        address: _address,
        signature: sign,
      });
      //取消阻断登录操作
      this.$store.commit("upIsBindAddress", false);
      const next = () => {
        this.$notify({
          type: "success",
          //绑定成功,同步会员状态可能会需要花费一些时间,请您耐心等待
          message: this.$t("notify.bind_time"),
        });
        setTimeout(() => {
          api.userInfo().then((res) => {
            this.$store.dispatch("setAccount", res);
          });
        }, 3000);
      };
      this.bindStatus = false;
      this.bindStatusLoading = false;
      if (result.code == 2000) {
        next();
        return;
      }
      result.code == 7000
        ? (this.hasBindBox = true)
        : this.$notify({ type: "danger", message: result.msg });
    },
    //复制邀请码
    copyCode() {
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          //复制成功
          message: this.$t("notify.copy_success"),
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
    firstCopySuccess() {
      this.$notify({
        type: "success",
        //复制成功
        message: this.$t("notify.copy_success"),
      });
      this.hasBindBox = false;
    },
    firstCopyError() {
      this.$notify({
        type: "danger",
        //复制失败，请稍后再试
        message: this.$t("notify.copy_falied"),
      });
      this.hasBindBox = false;
    },
    //客服微信获取
    async getContact() {
      const result = await api.contactQR();
      this.contactURL = result.image;
      this.contactWechat = result.nickname;
    },
  },
  beforeDestroy() {
    this.$store.commit("upIsBindAddress", false);
  },
};
</script>

<style lang="scss" scoped>
.bureau-setting {
  padding: 1rem $fon14 0;
}
.other-info {
  background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
}
.setting {
  .user-id {
    padding: 1rem;
    background: $contentBg;
    border-radius: 4px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    color: white;
    .iconfont {
      font-size: 1rem;
      margin-right: 1rem;
      display: inline-block;
      transform: translateY(-1px);
    }
    font-size: $fon12;
    font {
      color: $success;
    }
  }
  .col-md-12 {
    padding: 40px 24px;
    background: $contentBg;
    border-radius: 4px;
    margin-bottom: 16px;
    .inner-box {
      height: 72px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .msg-box {
        display: flex;
        .icon-box {
          width: 72px;
          height: 72px;
          background: $conBg2;
          border-radius: 50%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
          }
          .unBind {
            background: linear-gradient(
              90deg,
              #ff6666 0%,
              #ff8389 100%
            ) !important;
          }
          .icon-bg {
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00b0f0 0%, #a7f0ba 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            left: 48px;
            top: 0;
          }
        }
        .bind-msg {
          margin-left: 16px;
          padding-top: 8px;
          padding-bottom: 9px;
          .h3 {
            margin: 0;
            color: white;
            text-align: left;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            height: 32px;
            .mine-code {
              font-size: 12px;
              height: 24px;
              line-height: 24px;
              margin-left: 12px;
              padding: 0 12px;
              background: $conBg2;
              border-radius: 4px;
              font {
                color: white;
              }
            }
            .set-code {
              font-size: 12px;
              border-radius: 4px;
              background: rgba(255, 212, 92, 0.1);
              color: #ffd45c;
              cursor: pointer;
              height: 20px;
              text-align: center;
              padding: 0 8px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .current-pc {
              font-size: 12px;
              border-radius: 4px;
              background: $conBg2;
              color: $remarkColor;
              cursor: pointer;
              height: 20px;
              text-align: center;
              padding: 0 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 12px;
              margin-right: 8px;
              font {
                color: white;
              }
            }
          }
          .h3-en {
            justify-content: space-between;
            .set-code-en {
              font-size: 1rem;
              color: $success;
            }
          }
          .h5 {
            margin: 0;
            color: $remarkColor;
            span {
              color: $success;
            }
          }
          .reward-box {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            background: $conBg2;
            border-radius: 4px;
            font-size: 12px;
            color: $textColor;
            margin-top: 16px;
            max-width: 340px;
            p {
              display: flex;
              height: 20px;
              margin-left: 24px;
              /deep/ .form-check {
                margin-top: -2px;
              }
              span {
                margin-right: 16px;
              }
              span:last-child {
                margin-right: 0;
              }
            }
          }
          .reward-box-en {
            max-width: 800px;
          }
        }
      }
      .oper-box {
        display: flex;
        align-items: center;
        .danger-style {
          background: rgba(255, 212, 92, 0.1);
          color: #FFD45C;
        }
        .h3 {
          margin: 0;
          margin-right: 24px;
          color: $success;
        }
      }
    }
  }
  @media screen and (min-width: 1280px) {
    .user-id {
      display: none;
    }
    .mobile-cppy {
      display: none !important;
    }
  }
  @media screen and (max-width: 1279px) {
    .col-md-12 {
      padding: 1rem;
      padding-block: $padd24;
      .inner-box {
        flex-direction: column;
        height: auto;
        align-items: flex-start;
        position: relative;
        .msg-box {
          flex-direction: column;
          width: 100%;
          .icon-box {
            width: $size48;
            height: $size48;
            img {
              width: $padd24;
              height: $padd24;
            }
            .icon-bg {
              width: 1rem;
              height: 1rem;
              left: 2.1rem;
              top: 0.1rem;
            }
          }
          .bind-msg {
            margin-left: 0;
            margin-top: $padd24;
            padding: 0;
            width: 100%;
            .h3 {
              font-size: 1rem;
              color: white;
            }
            .mobile-cppy {
              font-size: $fon12;
              margin-bottom: 0.5rem;
              color: white;
              span {
                color: $success;
              }
            }
            .mobile-copy-en {
              // background: red;
              font {
                padding: 2px 8px;
                background: $conBg2;
                border-radius: 4px;
                color: $remarkColor;
                span {
                  color: $remarkColor;
                }
              }
              .set-code {
                background: rgba(255, 212, 92, 0.1);
                color: #ffd45c;
                cursor: pointer;
                margin-left: 4px;
                padding: 2px 8px;
                border-radius: 4px;
              }
            }
            .h5 {
              display: flex;
              width: 100%;
              color: $remarkColor;
              font-size: $fon12;
              word-wrap: normal;
              font {
                display: inline-block;
                min-width: 4rem;
              }
              span {
                display: inline-block;
                width: 80%;
                word-wrap: break-word;
              }
            }
            .h5-en {
              display: inherit;
              span {
                width: auto;
              }
            }
          }
        }
        .oper-box {
          position: absolute;
          top: 0;
          right: 0;
          .h3 {
            display: none;
          }
        }
      }
    }
    .reward-box {
      width: 100%;
      flex-direction: column;
      align-items: flex-start !important;
      text-align: left;
      padding: 1rem !important;
      p {
        width: 100%;
        margin-top: 0.5rem;
        margin-left: 0 !important;
        justify-content: flex-start;
      }
    }
  }
}
.has-bind-box {
  text-align: center;
  .icon-box {
    width: $size48;
    height: $size48;
    border-radius: 50%;
    background: $danger;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-bottom: $padd24;
    .iconfont {
      font-size: $fon20;
      color: white;
      font-weight: bold;
    }
  }
  p {
    font-size: 0.8rem;
  }
  p:last-child {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
    .label {
      display: inline-block;
      width: 1rem;
    }
  }
}
</style>