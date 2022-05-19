// NTF盲盒
<template>
  <div class="nft-blind-box">
    <!-- 抽取 -->
    <van-dialog v-model="blindBox" width="380" :showConfirmButton="false">
      <div class="drawn-box" :class="!drawnStatus && 'setp-two-bg'">
        <!-- 过渡动画盒子 -->
        <div
          class="transition-box"
          v-if="transitionBox"
          :class="transitionBox && 'transition-open'"
        ></div>
        <div class="drawn-title">
          <!-- 默认 -->
          <div class="normal-title" v-if="info.status == 1"></div>
          <!-- 未领取 -->
          <div class="receive-title" v-else>
            <van-count-down :time="time">
              <template #default="timeData">
                <span class="block">{{
                  timeData.hours >= 10 ? timeData.hours : "0" + timeData.hours
                }}</span>
                <span class="colon">:</span>
                <span class="block">{{
                  timeData.minutes >= 10
                    ? timeData.minutes
                    : "0" + timeData.minutes
                }}</span>
                <span class="colon">:</span>
                <span class="block">{{
                  timeData.seconds >= 10
                    ? timeData.seconds
                    : "0" + timeData.seconds
                }}</span>
              </template>
            </van-count-down>
            <p>请在倒计时结束之前开奖，否则视为放弃头等仓NFT</p>
          </div>
        </div>
        <div style="z-index: 1800" class="blind-con">
          <!-- 未开奖 -->
          <div class="not-drawn" v-if="drawnStatus">
            <!-- 未开奖灯光 -->
            <div class="not-drawn-light"></div>
            <!-- 未开奖盲盒 -->
            <div class="not-drawn-box">
              <div class="box-top" :class="openStatus">
                <img :src="require('@/assets/images/nft/box_top.png')" alt="" />
                <!-- <div class="white-light"></div> -->
              </div>
              <div class="box-bottom">
                <img
                  :src="require('@/assets/images/nft/box_bottom.png')"
                  alt=""
                />
              </div>
            </div>
          </div>
          <!-- 已开奖  -->
          <div class="has-drawn" v-else>
            <!-- 已开奖灯光 -->
            <div class="has-drawn-light"></div>
            <!-- NFT盒子 -->
            <div class="nft-box">
              <img :src="info.thumb_image" alt="" />
            </div>
          </div>
        </div>
        <!-- 操作 -->
        <div class="reward-oper-box" :class="protocalFailed && 'error-msg'">
          <!-- 协议 -->
          <div class="nft-msg">
            <el-checkbox v-model="agreeNft"></el-checkbox>
            <p>
              我已经阅读并同意<span @click="nftProtocol = true"
                >《头等仓NFT活动规则》</span
              >
            </p>
          </div>
          <!-- 按钮 -->
          <p class="oper-btn">
            <base-button type="info" round @click="lottery" v-if="drawnStatus"
              >抽奖</base-button
            >
            <base-button
              type="info"
              class="receive-info"
              round
              v-else
              @click="receiveEv"
              >领取</base-button
            >
          </p>
        </div>
      </div>
      <!-- 关闭 -->
      <div class="close-drawn">
        <p
          class="iconfont icon-guanbi_close-two"
          @click="
            openStatus = null;
            blindBox = false;
            getDrawnStatus();
          "
        ></p>
      </div>
    </van-dialog>
    <!-- 领取 -->
    <van-dialog v-model="receiveBox" width="500" :showConfirmButton="false">
      <div class="receive-box">
        <p class="icon-box">
          <img
            :src="require('@/assets/images/nft/receive_address.png')"
            alt=""
          />
        </p>
        <!-- Title -->
        <p>您的NFT将领取到以下地址</p>
        <!-- 钱包地址 -->
        <p>钱包地址</p>
        <!-- 编辑 & 确认 -->
        <div class="edit-address">
          <p
            class="not-edit"
            v-if="app.account.wallet_address && !switchAddress"
          >
            {{ editAddress }}
            <span @click="switchAddress = true">修改</span>
          </p>
          <p class="write-edit" v-else>
            <input
              type="text"
              placeholder="请输入您的数字钱包地址"
              v-model="editAddress"
            />
            <span @click="editAddressLoc">确认</span>
          </p>
        </div>
        <!-- Remark -->
        <div class="nft-remark">
          <p class="iconfont icon-xinxi_info"></p>
          <p>
            头等仓NFT将根据该地址发放NFT，请确保所填地址准确无误，如因个人填写错误导致未领取到NFT，头等仓不对该结果负责任。
          </p>
        </div>
        <!-- 操作 -->
        <div class="recevie-oper">
          <base-button type="default" round @click="receiveBox = false"
            >取消</base-button
          >
          <p class="label"></p>
          <base-button
            type="info"
            :disabled="waitChain"
            :loading="waitChain"
            round
            @click="turnReceiveNFT"
            >确认</base-button
          >
        </div>
      </div>
    </van-dialog>
    <!-- 领取成功 -->
    <van-dialog v-model="receiveSuccess" width="380" :showConfirmButton="false">
      <div class="receive-success">
        <p class="icon-box">
          <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
        </p>
        <p>恭喜</p>
        <p>您的NFT已经领取到相应的地址</p>
        <div class="success-oper">
          <base-button type="default" round @click="receiveSuccess = false"
            >关闭</base-button
          >
          <p class="label"></p>
          <base-button type="info" round @click="viewNFT">
            <i class="iconfont icon-opensea"></i>
            查看
          </base-button>
        </div>
      </div>
    </van-dialog>
    <!-- 未开奖浮窗 -->
    <div
      class="not-drawn-fixed"
      @click="blindBox = true"
      v-if="info.status == 2 && !blindBox"
    >
      <div class="bg-box">
        <img :src="require('@/assets/images/nft/nft_thumb.png')" alt="" />
      </div>
      <div class="remark-box">NTF盲盒</div>
    </div>
    <!-- 已开奖浮窗 -->
    <div
      class="has-drawn-fixed"
      @click="receiveBox = true"
      v-if="info.status == 3 && !blindBox && !receiveBox"
    >
      <div class="review-nft">
        <img :src="info.thumb_image" alt="" />
      </div>
      <p>
        <van-count-down :time="time">
          <template #default="timeData">
            <span class="block">{{
              timeData.hours >= 10 ? timeData.hours : "0" + timeData.hours
            }}</span>
            <span class="colon">:</span>
            <span class="block">{{
              timeData.minutes >= 10 ? timeData.minutes : "0" + timeData.minutes
            }}</span>
            <span class="colon">:</span>
            <span class="block">{{
              timeData.seconds >= 10 ? timeData.seconds : "0" + timeData.seconds
            }}</span>
          </template>
        </van-count-down>
      </p>
    </div>
    <!-- NFT协议 -->
    <van-dialog v-model="nftProtocol" width="800" :showConfirmButton="false">
      <div class="nft-protocol">
        <div class="nft-protocol-con">
          <div v-html="$t('nft_protocol')"></div>
          <p class="close-con">
            <base-button type="default" round @click="nftProtocol = false">
              关闭
            </base-button>
          </p>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  DrawnStatus,
  SetDrawnStatus,
  LotterNFT,
  BulidMsg,
  ReceiveNFT,
} from "@/request/api";
import NFTTool from "@/util/nft/config";
export default {
  data() {
    return {
      blindBox: false, //抽奖盒子
      receiveBox: false, //领取盒子
      receiveSuccess: false, //领取成功
      agreeNft: false, //协议
      openStatus: null, //开启动画
      transitionBox: false, //过渡动画盒子
      drawnStatus: true, //抽奖步骤
      time: 0, //抽奖 & 领取倒计时
      info: {}, //抽奖信息
      switchAddress: false, //修改地址
      editAddress: null, //编辑地址
      protocalFailed: false, //协议状态
      reviewURL: null, //查看NFT地址
      waitChain: false, //区块等待
      nftProtocol: false, //NFT领取协议
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getDrawnStatus();
  },
  mounted() {
    window.upDateNFT = this.getDrawnStatus;
  },
  methods: {
    //获取抽奖状态
    async getDrawnStatus(_open) {
      this.editAddress = this.app.account.wallet_address;
      !this.editAddress && (this.switchAddress = true);
      //TODO
      // return;
      const result = await DrawnStatus();
      if (!result) {
        return;
      }
      this.info = result;
      const setView = async () => {
        await SetDrawnStatus({ id: result.id });
      };
      result.status == 2 && (this.time = result.draw_time_remaining * 1000,_open && (this.blindBox = true));
      result.status == 3 && (this.time = result.award_time_remaining * 1000,_open && (this.blindBox = true));
      result.status == 3
        ? (this.drawnStatus = false)
        : (this.drawnStatus = true);
      result.status == 1 &&
        this.app.isBureau == 0 &&
        ((this.blindBox = true), setView());
    },
    // 进行抽奖
    async lottery() {
      if (!this.agreeNft) {
        this.protocalFailed = true;
        this.$notify({
          type: "danger",
          message: "请仔细阅读《活动规则》并勾选相应选项以继续领取NFT",
          verticalAlign: "top",
          horizontalAlign: "center",
          icon: "iconfont icon-tixing_remind",
          showClose: false,
        });
        return;
      } else {
        this.protocalFailed = false;
      }
      const result = await LotterNFT();
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.openStatus = "open-box";
      setTimeout(() => {
        this.transitionBox = true;
        setTimeout(() => {
          this.getDrawnStatus();
          this.drawnStatus = false;
        }, 650);
        setTimeout(() => {
          this.transitionBox = false;
        }, 1300);
      }, 300);
    },
    //领取NFT
    async receiveEv() {
      if (!this.agreeNft) {
        this.protocalFailed = true;
        this.$notify({
          type: "danger",
          message: "请仔细阅读《活动规则》并勾选相应选项以继续领取NFT",
          verticalAlign: "top",
          horizontalAlign: "center",
          icon: "iconfont icon-tixing_remind",
          showClose: false,
        });
        return;
      } else {
        this.protocalFailed = false;
      }
      this.receiveBox = true;
      this.blindBox = false;
    },
    editAddressLoc() {
      if (this.editAddress.length != 42) {
        this.$notify({
          type: "danger",
          message: "请输入正确的钱包地址",
        });
        return;
      }
      this.switchAddress = false;
    },
    //网格提交领取NFT
    async turnReceiveNFT() {
      if (this.switchAddress) {
        this.$notify({
          type: "danger",
          message: "请完成地址编辑",
        });
        return;
      }
      this.waitChain = true;
      const chain = await BulidMsg();
      if (chain.code != 2000) {
        this.$notify({
          type: "danger",
          message: chain.msg,
        });
        return;
      }
      const netResult = await NFTTool.ReceiveChain(
        this.editAddress,
        chain.data.token_uri,
        chain.data.ticket,
        chain.data.sign
      );
      if (netResult == 0) {
        this.waitChain = false;
        return;
      }
      const result = await ReceiveNFT({ address: this.editAddress });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: chain.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        message: "领取成功",
      });
      this.getDrawnStatus();
      this.receiveBox = false;
      this.receiveSuccess = true;
      this.reviewURL = process.env.VUE_APP_OPENSEA + this.editAddress;
    },
    //查看NFT
    viewNFT() {
      // this.receiveSuccess = false;
      window.open(this.reviewURL);
    },
  },
};
</script>

<style lang="scss" scoped>
.receive-info {
  background: linear-gradient(90deg, #00bad6 0%, #2de0bd 100%);
}
@-webkit-keyframes slowAndShort {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
@-webkit-keyframes openLight {
  0% {
    background: rgba(255, 255, 255, 0);
  }
  50% {
    background: rgba(255, 255, 255, 1);
  }
  100% {
    background: rgba(255, 255, 255, 0);
  }
}
@-webkit-keyframes roundLight {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
/deep/ .van-dialog {
  background: rgba(0, 0, 0, 0);
}
.nft-blind-box {
  position: relative;
  .drawn-box {
    width: 380px;
    height: 620px;
    background: url("../assets/images/nft/not_drawn.png");
    background-size: 100% 100%;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .transition-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
    }
    .transition-open {
      animation: openLight 1.3s linear infinite;
    }
    .normal-title {
      background: url("../assets/images/nft/blind_title.png");
      background-size: 100% 100%;
      width: 194px;
      height: 73px;
      margin-top: 48px;
    }
    .receive-title {
      margin-top: 48px;
      text-align: center;
      .colon,
      .block {
        font-size: 26px;
        color: $success;
        font-weight: bold;
        line-height: 45px;
      }
      p {
        font-size: 12px;
        color: white;
        margin-top: 4px;
      }
    }
    .blind-con {
      z-index: 1800;
      .not-drawn {
        .not-drawn-light {
          position: absolute;
          top: 50px;
          left: 0;
          width: 100%;
          height: 442px;
          background: url("../assets/images/nft/not_drawn_light.png");
          background-size: 100% 100%;
          animation: slowAndShort 4s linear infinite;
        }
        .not-drawn-box {
          width: 173px;
          height: 233px;
          animation: slowAndShort 4s linear infinite;
          div {
            position: relative;
            img {
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }
          }
          .open-box {
            transform: translateY(-80px);
            opacity: 0;
            transition: 1s all;
          }
          .white-light {
            position: absolute;
            border-radius: 50%;
            left: 50%;
            top: 50%;
            z-index: 2000;
            box-shadow: 0 0 20px white;
            animation: openLight 3s linear infinite;
          }
        }
      }
      .has-drawn {
        .has-drawn-light {
          position: absolute;
          top: 100px;
          left: -10%;
          width: 120%;
          height: 442px;
          z-index: 100;
          background: url("../assets/images/nft/has_drawn_ani.png");
          background-size: 100% 100%;
          animation: roundLight 6s linear infinite;
        }
        .nft-box {
          width: 200px;
          height: 200px;
          border-radius: 4px;
          border: 2px solid #00fff7;
          position: relative;
          z-index: 300;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }
      }
    }
    .reward-oper-box {
      padding-bottom: 40px;
      z-index: 3000;
      /deep/ .el-checkbox {
        margin-bottom: -1px !important;
      }
      /deep/ .el-checkbox__inner {
        background: $contentBg;
        border-color: #49537a;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: -3px;
      }
      /deep/ .el-checkbox__inner::after {
        top: 3px;
        left: 6px;
      }
      /deep/ .el-checkbox__label {
        color: $textColor;
      }
      /deep/ .is-checked {
        .el-checkbox__inner {
          background: #33b1ff;
        }
      }
      .nft-msg {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        p {
          font-size: 12px;
          color: $remarkColor;
          margin-left: 8px;
          span {
            color: #ffd45c;
            cursor: pointer;
          }
        }
      }
      text-align: center;
    }
    .error-msg {
      /deep/ .el-checkbox__inner {
        border-color: #ff8389;
      }
      .nft-msg {
        p {
          color: #ff8389;
          span {
            color: #ff8389;
          }
        }
      }
    }
  }
  .setp-two-bg {
    background: url("../assets/images/nft/has_drawn.png");
  }
  .close-drawn {
    width: 100%;
    text-align: center;
    margin-top: 26px;
    .iconfont {
      font-size: 32px;
      color: white;
      cursor: pointer;
    }
  }
}
.receive-box {
  padding: 48px;
  background: white;
  border-radius: 4px;
  text-align: center;
  .icon-box {
    width: 48px;
    height: 48px;
    text-align: center;
    margin: 0 auto;
  }
  p:nth-child(2) {
    font-size: 17px;
    margin-top: 16px;
    color: $titleColor;
    text-align: center;
    font-weight: bold;
  }
  p:nth-child(3) {
    margin-top: 24px;
    text-align: left;
    font-size: 12px;
    color: #676c7a;
  }
  .edit-address {
    p {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;
      border-radius: 4px;
      color: $titleColor;
      font-size: 12px;
      margin-bottom: 24px;
      span {
        color: $iconColor;
        cursor: pointer;
      }
    }
    .not-edit {
      margin-bottom: 12px;
    }
    .write-edit {
      margin-top: 8px;
      border: 1px solid $textColor;
      padding: 0 18px;
      input {
        width: 85%;
      }
    }
  }
  .nft-remark {
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 16px;
      color: #ffac33;
    }
    p:last-child {
      text-align: left;
      font-size: 12px;
      color: $remarkColor;
      font-weight: 400;
      margin-top: 0;
      margin-left: 8px;
      line-height: 18px;
    }
  }
  .recevie-oper {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    .label {
      width: 24px;
    }
  }
}
.receive-success {
  padding: 50px 56px 48px;
  background: white;
  border-radius: 4px;
  text-align: center;
  .icon-box {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(90deg, #00bad6 0%, #2de0bd 100%);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    .iconfont {
      font-size: 2rem;
      font-weight: bold;
    }
  }
  p:nth-child(2) {
    margin-top: 18px;
    font-size: 17px;
    font-weight: bold;
    color: $titleColor;
  }
  p:nth-child(3) {
    font-size: 13px;
    margin-top: 8px;
    color: $remarkColor;
  }
  .success-oper {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    .label {
      width: 24px;
    }
  }
}
.not-drawn-fixed {
  position: fixed;
  z-index: 3333;
  right: 30px;
  bottom: 80px;
  cursor: pointer;
  .bg-box {
    width: 72px;
    height: 72px;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 72px;
      height: 72px;
    }
  }
  .remark-box {
    width: 56px;
    margin: 0 auto;
    margin-top: 12px;
    padding: 2px 4px;
    box-shadow: 0px 3px 6px rgba(11, 5, 26, 0.16);
    background: linear-gradient(90deg, #9d5cff 0%, #33b1ff 100%);
    color: white;
    border-radius: 4px;
    font-size: 12px;
    line-height: 16px;
  }
}
.has-drawn-fixed {
  position: fixed;
  z-index: 3333;
  right: 30px;
  bottom: 80px;
  cursor: pointer;
  .review-nft {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 2px solid white;
    background: rgba(255, 255, 255, 0.39);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  p {
    text-align: center;
    margin-top: 12px;
    padding: 2px 4px;
    box-shadow: 0px 3px 6px rgba(11, 5, 26, 0.16);
    background: linear-gradient(90deg, #ff6666 0%, #ff8389 100%);
    border-radius: 4px;
    span {
      font-size: 14px;
      line-height: 18px;
      color: white;
    }
  }
}
.nft-protocol {
  padding: 48px;
  background: white;
  position: relative;
  .nft-protocol-con {
    height: 500px;
    border-radius: 4px;
    overflow: auto;
    padding-bottom: 40px;
    /deep/ .padd-left {
      padding-left: 16px;
    }
    /deep/ .with-bold {
      font-weight: bold;
    }
    /deep/ .with-line {
      text-decoration: underline;
    }
    /deep/ .big-title {
      margin-top: 24px;
    }
    /deep/ .h5 {
      line-height: 20px;
    }
    .close-con {
      position: absolute;
      left: 0;
      bottom: 48px;
      width: 100%;
      text-align: center;
    }
  }
}
</style>