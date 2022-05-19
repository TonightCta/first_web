// 支付等待
<template>
  <div class="pending-box">
    <!-- 支付中 -->
    <modal :show.sync="pendingBox" modalClasses="login-box-modal other-modal">
      <div class="pending">
        <p class="h4">
          <!-- 转账支付确认中 -->
          {{ $t("pay_order.transfer_pending") }}
          ...
        </p>
        <div class="pend-msg">
          <ul>
            <li>
              <p>
                <!-- 订单金额： -->
                {{ $t("pay_order.order_amount") }}
              </p>
              <p>{{ price }}&nbsp;{{ coinName }}</p>
            </li>
            <li>
              <p>
                <!-- 平均到账时间： -->
                {{ $t("pay_order.arrival_time") }}
              </p>
              <p>&asymp;30{{ app.language == "en" ? "s" : "秒" }}</p>
            </li>
            <li v-if="isTransfar">
              <p>
                <!-- 网络确认数： -->
                {{ $t("pay_order.confirm_num") }}
              </p>
              <p class="with-high">
                {{ blockNow }}/
                <!-- 2个网格确认 -->
                {{ $t("pay_order.two_confirm") }}
              </p>
            </li>
            <li>
              <p>
                <!-- 到账金额： -->
                {{ $t("pay_order.arrival_amount") }}
              </p>
              <p class="with-flex">
                <span
                  >{{ isTransfar ? hasPay : price }}&nbsp;{{ coinName }}</span
                >
                <span v-if="isTransfar">
                  <!-- need_transfer -->
                  {{ $t("pay_order.arrival_amount") }}
                  <font>{{ unPay }}</font>
                  <!-- USDT，网络确认中，请稍等 -->
                  {{ $t("pay_order.need_remark") }}
                </span>
                <span v-else>
                  <!-- 网络确认中，请稍等 -->
                  {{ $t("pay_order.confirm_pending") }}
                </span>
              </p>
            </li>
            <li>
              <p>
                <!-- 交易ID： -->
                {{ $t("pay_order.transfer_id") }}
              </p>
              <p>
                {{ hash }}
              </p>
            </li>
          </ul>
        </div>
        <div class="open-brower">
          <base-button type="info" round @click="openBrowser">
            <!-- 查看区块链浏览器 -->
            {{ $t("mine_order.view_block") }}
          </base-button>
        </div>
      </div>
    </modal>
    <!-- 支付成功 -->
    <modal :show.sync="payEnd" modalClasses="login-box-modal other-modal">
      <div class="pay-end">
        <div class="iconfont-box">
          <p class="iconfont icon-xiaoyan-xiao_check-small"></p>
        </div>
        <p class="h4">
          <!-- 恭喜，支付成功 -->
          {{ $t("pay_order.pay_ok") }}
        </p>
        <p class="h5">
          {{ $t("pay_order.pay_ok_2") }}
        </p>
        <p>
          <base-button
            type="info"
            round
            :class="app.isBureau == 1 && 'other-info'"
            @click="
              $router.push(
                app.isBureau == 0
                  ? (app.account.meal_id == 1 && '/otherCenter') ||
                      (app.account.meal_id == 2 && '/otherCenter') ||
                      (app.account.meal_id == 3 && '/userCenter')
                  : '/mine-bureau'
              )
            "
          >
            <!-- 进入研报库 & 进入情报局 -->
            {{ $t("public.into_first") }}</base-button
          >
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { payOver, userInfo, queryChain } from "@/request/api";
import { mapState } from "vuex";
import Web3 from "web3";
export default {
  name: "PedingBox",
  data() {
    return {
      pendingBox: false,
      payEnd: false,
      hash: null, //交易hash
      browserUrl: null, //交易查询
      timeSet: null, //合约支付结果查询
      price: 0, //付款金额
      coinName: "", //币种名称
      isTransfar: false, //是否为转账付款
      queryTransferTime: null, //查询区块高度定时器
      blockNow: 0, //当前区块高度
      hasPay: 0, //已付款金额
      unPay: 0, //未付款金额
    };
  },
  components: { Modal },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    openBrowser() {
      window.open(this.browserUrl);
    },
    //查询支付结果
    queryOrder(
      HASH,
      BROWSER,
      NUMBER,
      PRICE,
      NAME,
      BOOL,
      BLOCK,
      CHAIN,
      CHAINID,
      HASPAY,
      UNPAY
    ) {
      /**
       * @param HASH ---> 交易hash
       * @param BROWSER ---> 浏览器查询地址
       * @param NUMBER ---> 订单编号
       * @param PRICE ---> 订单价格
       * @param NAME ---> 币种名称
       * @param BOOL ---> 是否为转账交易
       * @param BLOCK ---> 当前区块高度
       * @param CHAIN ---> 当前交易链
       * @param CHAINID ---> 当前交易链ID
       * @param HASPAY ---> 已付款金额
       * @param UNPAY ---> 已付款金额
       */
      this.hash = HASH;
      this.browserUrl = BROWSER;
      this.price = PRICE;
      this.coinName = NAME;
      this.isTransfar = BOOL;
      localStorage.setItem("openSearchBox", true);
      this.pendingBox = true;
      this.hasPay = HASPAY;
      this.unPay = UNPAY;
      BOOL
        ? this.queryTransfer(HASH, BLOCK, CHAIN, NUMBER, CHAINID)
        : this.quertContract(NUMBER);
    },
    //查询合约支付
    quertContract(_order_num) {
      const success = async () => {
        await userInfo().then((res) => {
          this.$store.dispatch("setAccount", res);
        });
        localStorage.removeItem("openSearchBox");
        this.pendingBox = false;
        this.payEnd = true;
        clearInterval(this.timeSet);
      };
      this.timeSet = setInterval(async () => {
        const result = await payOver({ order_number: _order_num });
        if (!result.status) {
          this.$notify({ type: "danger", message: result.msg });
          clearInterval(this.timeSet);
        }
        result.status == 2 && success();
      }, 3000);
    },
    //查询转账支付
    queryTransfer(_hash, _trans_block, _chian, _order_num, _chain_id) {
      //支付成功
      const success = async () => {
        await userInfo().then((res) => {
          this.$store.dispatch("setAccount", res);
        });
        localStorage.removeItem("openSearchBox");
        this.pendingBox = false;
        this.payEnd = true;
        clearInterval(this.queryTransferTime);
      };
      //hash绑定
      const bind = async () => {
        clearInterval(this.queryTransferTime);
        await queryChain({
          order_number: _order_num,
          hash: _hash,
          chain_id: _chain_id,
        });
      };
      this.queryTransferTime = setInterval(async () => {
        const web3 = new Web3(_chian);
        const blockNumber = await web3.eth.getBlockNumber();
        this.blockNow = blockNumber - _trans_block;
        this.blockNow >= 2 && (await bind());
        this.blockNow >= 2 && this.unPay <= 0 && success();
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .modal-dialog {
  transform: translate(0, 90%) !important;
}
.pending {
  padding: 24px 0 32px 0;
  .h4 {
    margin-bottom: 24px;
    color: $titleColor;
    text-align: center;
    font-weight: bold;
  }
  .pend-msg {
    width: 100%;
    padding: 0 24px;
    ul {
      width: 100%;
      li {
        display: flex;
        line-height: 28px;
        width: 100%;
        p {
          font-size: 12px;
        }
        p:first-child {
          color: $remarkColor;
          min-width: 92px;
        }
        p:last-child {
          flex: 1;
          color: $titleColor;
        }
        .with-high {
          font-size: 13px;
          color: #0f62fe !important;
        }
        @media screen and (max-width: 1279px) {
          .with-high {
            color: #f5b400 !important;
          }
        }
        .with-flex {
          display: flex;
          flex-direction: column;
          span:last-child {
            display: inline-block;
            color: $remarkColor;
            line-height: 16px;
          }
          font {
            color: $titleColor;
          }
        }
      }
      li:last-child {
        margin-top: 8px;
        p {
          line-height: 20px;
        }
        p:last-child {
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
  }
  .open-brower {
    margin-top: 24px;
    text-align: center;
    font-weight: 400;
    .iconfont {
      font-weight: 400;
    }
  }
}
.pay-end {
  text-align: center;
  padding: 24px 0 32px;
  .iconfont-box {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    background: linear-gradient(90deg, #00bad6 0%, #2de0bd 100%);
    margin-bottom: 18px;
    .iconfont {
      font-size: 30px;
      font-weight: bold;
      color: white;
    }
  }
  .h4 {
    margin-bottom: 8px;
    font-weight: bold;
    color: $titleColor;
  }
  .h5 {
    color: $remarkColor;
    margin-bottom: 20px;
  }
  p:last-child {
    button {
      width: 240px;
    }
  }
}
@media screen and (max-width: 1279px) {
  .pending {
    padding: $padd24 0;
  }
  .pend-msg {
    padding: 0 !important;
  }
}
</style>
