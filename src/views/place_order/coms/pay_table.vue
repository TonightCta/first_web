<template>
  <!-- TODO -->
  <!-- 支付 - 新 -->
  <div class="pay-way-new" v-if="chainList.length > 0">
    <!-- 标题 -->
    <div class="pay-way-new-title">
      <p>
        <!-- 付款方式 -->
        {{ $t("pay_order.pay_way") }}
      </p>
      <div v-if="app.language == 'en'">
        <p>
          <!-- 支付如遇问题，请联系我们的销售顾问 -->
          {{ this.$flag ? $t("index_nav.contact") : $t("pay_order.pay_error") }}
          <a href="mailto:marketing@first.vip" target="_blank">
            <p class="iconfont icon-youjian"></p>
          </a>
        </p>
      </div>
      <div v-else>
        <p v-if="$flag">
          <!-- 支付如遇问题，请联系我们的销售顾问 -->
          {{ this.$flag ? $t("index_nav.contact") : $t("pay_order.pay_error") }}
          <span
            class="iconfont icon-fukuanma_pay-code-one copy-we"
            @click="copyContact"
            :data-clipboard-text="contactWe"
          ></span>
        </p>
        <p v-else>
          <!-- 支付如遇问题，请联系我们的销售顾问 -->
          {{ this.$flag ? $t("index_nav.contact") : $t("pay_order.pay_error") }}
          <el-popover placement="top" trigger="hover">
            <div>
              <img
                :src="contactURL"
                style="width: 160px; height: 160px"
                alt=""
              />
            </div>
            <p class="iconfont icon-fukuanma_pay-code-one" slot="reference"></p>
          </el-popover>
        </p>
      </div>
    </div>
    <div class="pay-way-new-content">
      <!-- 支付方式选项卡 -->
      <div class="new-content-table" v-if="reloadTable">
        <ul>
          <li
            v-for="(tab, indexTa) in table"
            :key="indexTa"
            :class="tabNow == indexTa ? 'active-tab' : ''"
            :style="{ padding: !tab.title && '0' }"
            @click="chosePayWay(indexTa)"
          >
            {{ tab.title }}
          </li>
        </ul>
      </div>
      <!-- 合约支付 -->
      <div class="contract-pay" v-if="tabNow == 0">
        <!-- 公链 -->
        <div class="coin-type">
          <p>
            <!-- 选择公链 -->
            {{ $t("pay_order.switch_chain") }}
          </p>
          <div class="type-flex">
            <p
              class="coin-tab"
              @click="
                chainType = String(indexCI);
                changeChain(indexCI);
              "
              v-for="(chainTypeInner, indexCI) in chainList"
              :key="indexCI"
            >
              <base-radio
                :name="String(indexCI)"
                class="mb-3"
                v-model="chainType"
              >
              </base-radio>
              <img :src="chainTypeInner.icon" />
              <span> {{ chainTypeInner.name }} </span>
            </p>
          </div>
        </div>
        <!-- 资产类型 -->
        <div class="coin-type" style="margin-bottom: 0">
          <p>
            <!-- 选择资产 -->
            {{ $t("pay_order.switch_asset") }}
          </p>
          <div class="type-flex">
            <p
              class="coin-tab"
              @click="
                coinType = String(indexCT);
                $emit('chooseCoinType', String(indexCT));
              "
              v-for="(coinTypeInner, indexCT) in chainList[chainType].coin"
              :key="indexCT"
            >
              <base-radio
                :name="String(indexCT)"
                class="mb-3"
                v-model="coinType"
              >
              </base-radio>
              <img :src="coinTypeInner.icon" />
              <span>{{ coinTypeInner.name }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 转账支付 -->
      <div class="transfar-pay" v-if="tabNow == 1">
        <!-- 选择公链 -->
        <div class="coin-type" v-if="!isHasPay">
          <p>
            <!-- 选择公链 -->
            {{ $t("pay_order.switch_chain") }}
          </p>
          <div class="type-flex">
            <p
              class="coin-tab"
              @click="
                chainType = String(indexCIT);
                transfarChangeChain(indexCIT);
              "
              v-for="(chainTypeInner, indexCIT) in chainList"
              :key="indexCIT"
            >
              <base-radio
                :name="String(indexCIT)"
                class="mb-3"
                v-model="chainType"
              >
              </base-radio>
              <img :src="chainTypeInner.icon" />
              <span> {{ chainTypeInner.name }} </span>
            </p>
          </div>
        </div>
        <!-- 资产类型 -->
        <div class="coin-type" style="margin-bottom: 0">
          <p>
            <!-- 支付金额 -->
            {{ $t("pay_order.pay_price") }}
          </p>
          <div class="type-flex">
            <p
              class="coin-tab without-radio"
              v-for="(coinTypeInner, indexCT) in chainList[chainType].coin"
              :key="indexCT"
            >
              <img :src="coinTypeInner.icon" />
              <span
                >{{ app.placeOrderMsg.price }}&nbsp;{{
                  coinTypeInner.name
                }}</span
              >
              <span class="coin-line">/</span>
            </p>
          </div>
        </div>
        <!-- 已付金额 -->
        <div class="coin-type" v-if="isHasPay">
          <p>
            <!-- 已付金额 -->
            {{ $t("pay_order.amount_paid") }}
          </p>
          <div class="type-flex">
            <p class="has-pay">{{ hasPayNum }}</p>
          </div>
        </div>
        <!-- 未付金额 -->
        <div class="coin-type" v-if="isHasPay">
          <p>
            <!-- 未付金额 -->
            {{ $t("pay_order.un_paid") }}
          </p>
          <div class="type-flex">
            <p class="has-pay un-pay">{{ unPayNum }}</p>
          </div>
        </div>
        <!-- 支付公链 -->
        <div class="coin-type" style="margin-bottom: 0" v-if="isHasPay">
          <p>
            <!-- 支付公链 -->
            {{ $t("pay_order.pay_chain") }}
          </p>
          <div class="type-flex">
            <img :src="hasPayChainIcon" alt="" />
            <p style="font-weight: bold">{{ hasPayChain }}</p>
          </div>
        </div>
        <!-- 支付信息 -->
        <div class="transfar-box">
          <div class="transfar-msg">
            <p class="msg-title">
              <!-- 请使用钱包扫描下方二维码，或者复制下方地址到钱包进行支付 -->
              {{ $t("pay_order.scan") }}
            </p>
            <div class="transfat-con">
              <!-- 转账二维码 -->
              <div class="trans-box">
                <div class="trans-qr" id="transQR" ref="transQR">
                  <!-- <img :src="require('@/assets/images/test.png')" alt="" /> -->
                </div>
                <div class="trans-mask" v-loading="true"></div>
              </div>

              <!-- 转账地址 & 注意事项 -->
              <div class="trans-address">
                <!-- 转账地址 -->
                <div class="address-box">
                  <p>
                    <!-- USDT充值地址： -->
                    {{ $t("pay_order.pay_address") }}
                  </p>
                  <p>
                    <span>{{ app.account.pay_address }}</span>
                    <span
                      class="iconfont copy icon-fuzhi_copy copy"
                      @click="copyCodeAddress"
                      :data-clipboard-text="app.account.pay_address"
                    ></span>
                  </p>
                </div>
                <!-- 注意事项 -->
                <div class="attention-box">
                  <p>
                    <!-- 注意： -->
                    {{ $t("pay_order.attention") }}
                  </p>
                  <p>
                    *
                    <!-- 在充值时，请注意对应的网络，以免造成充值不上的情况 -->
                    {{ $t("pay_order.attention_one") }}
                  </p>
                  <p>
                    *
                    <!-- 禁止向USDT地址充值除USDT之外的资产，任何充入USDT地址的非USDT资产将不可找回 -->
                    {{ $t("pay_order.attention_two") }}
                  </p>
                  <p>
                    *
                    <!-- 充值需要2个网络确认才能到账 -->
                    {{ $t("pay_order.attention_three") }}
                  </p>
                  <p>
                    *
                    <!-- 交易过程中请勿切换公链，如因切换造成资产丢失，头等仓一概不负责。 -->
                    {{ $t("pay_order.attention_four") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 微信支付 -->
      <div class="wechat-pay" v-if="tabNow == 2">
        <!-- 资产类型 -->
        <div class="coin-type">
          <p>
            <!-- 支付方式 -->
            {{ $t("pay_order.pay_way") }}
          </p>
          <div class="type-flex">
            <p class="coin-tab without-radio">
              <img :src="require('@/assets/images/we_pay.png')" />
              <span>
                <!-- 微信支付 - 零钱通 -->
                {{ $t("pay_order.wechat_pay") }}
              </span>
              <el-popover placement="top" width="302" trigger="hover">
                <div>
                  <img
                    :src="require('@/assets/images/wechatRemark.png')"
                    style="width: 272px; height: 160px"
                    alt=""
                  />
                </div>
                <p class="iconfont icon-bangzhu_help" slot="reference"></p>
              </el-popover>
            </p>
          </div>
        </div>
        <div class="coin-type" v-if="$flag">
          <p>
            <!-- 支付金额 -->
            {{ $t("pay_order.pay_price") }}
          </p>
          <div class="type-flex">
            <p class="coin-tab without-radio">
              <span
                >{{ app.placeOrderMsg.price1 }} &nbsp;
                <!-- 元 -->
                {{ $t("public.coin") }}
              </span>
            </p>
          </div>
        </div>
        <!-- 微信支付二维码 -->
        <div class="wechat-qr" v-else>
          <div class="qr-content">
            <p
              v-html="
                app.language == 'en'
                  ? 'Please <span>Scan</span> the QR Code below to complete the payment'
                  : '请使用<span>微信扫一扫</span>扫描下方二维码来完成支付>'
              "
            ></p>
            <div class="qr-box">
              <div class="payQR" id="payQR" ref="payQR">
                <!-- <img :src="require('@/assets/images/test.png')" alt="" /> -->
              </div>
              <div class="mask-qr" v-loading="true"></div>
            </div>
            <p :class="app.language == 'en' && 'qr-remark-en'">
              <i class="iconfont icon-zhuyi_attention"></i>
              <font
                v-html="
                  app.language == 'en'
                    ? 'Payment can only be made through<span>WeChat Pay-Mini Fund</span>'
                    : '仅限使用<span>微信零钱通</span>支付'
                "
              ></font>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 支付等待 -->
    <Pending ref="pend" />
    <!-- 微信支付成功 -->
    <van-dialog v-model="paySuccess" :showConfirmButton="false">
      <div class="pay-success">
        <p class="icon-box">
          <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
        </p>
        <p class="success-title">
          <!-- 恭喜，支付成功 -->
          {{ $t("pay_order.pay_ok") }}
        </p>
        <p class="success-remark">
          <!-- 恭喜，支付成功 -->
          {{ $t("pay_order.pay_ok_2") }}
        </p>
        <p class="success-btn">
          <base-button
            type="info"
            :class="app.isBureau == 1 && 'other-info'"
            round
            @click="
              $router.push(
                app.isBureau == 0
                  ? (app.account.meal_id == 1 && '/otherCenter') ||
                      (app.account.meal_id == 2 && '/otherCenter') ||
                      (app.account.meal_id == 3 && '/userCenter')
                  : '/mine-bureau'
              )
            "
            >{{ $t("public.inside_first") }}</base-button
          >
        </p>
      </div>
    </van-dialog>
    <!-- 未绑定钱包地址 -->
    <van-dialog v-model="unBindWallet" :showConfirmButton="false">
      <div class="un-bind-wallet">
        <!-- 您的账号尚未绑定钱包，是否立即前往绑定？ -->
        <p>
          {{ $t("pay_order.un_bind_wallet") }}
        </p>
        <p>
          <base-button type="default" round>
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <base-button
            type="info"
            round
            :class="app.isBureau == 1 && 'other-info'"
            @click="
              unBindWallet = flase;
              $router.push('/setting');
            "
          >
            <!-- 立即绑定 -->
            {{ $t("pay_order.bind_now") }}
          </base-button>
        </p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ChainTool from "@/util/index";
import { BaseRadio } from "@/components";
import Web3 from "web3";
let watchEtherLog = null;
import Clipboard from "clipboard";
import QRCode from "qrcode2";
import * as api from "@/request/api";
export default {
  props: ["isTransfar"],
  name: "PayTable",
  data() {
    return {
      payType: 2,
      timeQuery: null, //微信支付查询支付结果
      chainList: [], //公链列表
      tabNow: 0, //当前选择支付方式
      contactURL: null, //客服微信二维码
      contactWe: null, //客服微信号
      coinType: "0", //资产类型
      chainType: "0", //公链类型
      watchEtherLogCancel: null, //转账监听
      weTimer: null, //移动端微信支付查询
      paySuccess: false,
      reloadTable: true, //从新渲染选项卡
      isHasPay: false, //是否已支付部分金额
      hasPayNum: 0, //已付金额
      unPayNum: 0, //未付金额
      hasPayChain: null, //已支付公链
      hasPayChainIcon: null, //已支付公链ICON
      unBindWallet: false, //未绑定钱包
    };
  },
  computed: {
    ...mapState(["app"]),
    table() {
      return this.app.language == "zh-CN"
        ? [
            {
              //合约支付
              title: this.$t("mine_order.contract_pay"),
              pay_type: "2",
            },
            {
              //转账支付
              title: this.$t("mine_order.transfer_pay"),
              pay_type: "4",
            },
            {
              //微信支付
              title: this.$t("mine_order.wechat_pay"),
              pay_type: "1",
            },
          ]
        : [
            {
              //合约支付
              title: this.$t("mine_order.contract_pay"),
              pay_type: "2",
            },
            {
              //转账支付
              title: this.$t("mine_order.transfer_pay"),
              pay_type: "4",
            },
          ];
    },
  },
  components: {
    Pending: (resolve) => require(["@/comsmine/pending"], resolve),
    BaseRadio,
  },
  created() {
    this.getChain();
    this.chainType = String(this.app.chainType);
    this.getContact();
  },
  mounted() {
    this.$emit("payWallet", this.payWallet);
  },
  methods: {
    //订单详情 - 已支付部分金额
    infoOrderdetails(_has_pay, _un_pay, _chain, _icon, _icon_index) {
      this.table.pop();
      this.table.push({});
      this.table.shift();
      this.table.splice(0, 0, {});
      this.tabNow = 1;
      this.chainType = _icon_index - 1;
      this.coinType = "3";
      this.isHasPay = true;
      this.hasPayNum = _has_pay;
      this.unPayNum = _un_pay;
      this.hasPayChain = _chain;
      this.hasPayChainIcon = _icon;
      setTimeout(() => {
        this.payTransfar();
      }, 500);
    },
    //正常选项卡
    infoTable() {
      this.tabNow = 0;
      this.coinType = "0";
      this.reloadTable = false;
      this.isHasPay = false;
      setTimeout(() => {
        this.reloadTable = true;
      });
      this.table = [
        {
          //合约支付
          title: this.$t("mine_order.contract_pay"),
          pay_type: "2",
        },
        {
          //转账支付
          title: this.$t("mine_order.transfer_pay"),
          pay_type: "4",
        },
        {
          //微信支付
          title: this.$t("mine_order.wechat_pay"),
          pay_type: "1",
        },
      ];
    },
    //获取公链信息
    async getChain() {
      const result = await api.chainList();
      this.chainList = result;
      //移动端普通浏览器 & 钱包浏览器区分
      if (this.$flag) {
        const { ethereum } = window;
        ethereum && !this.isHasPay
          ? (this.table.pop(), this.table.push({}))
          : ((this.table.shift(), this.table.splice(0, 0, {})),
            (this.tabNow = 2),
            (this.coinType = "2"),
            this.$emit("chooseCoinType", "2"),
            this.queryOrder());
      }
      localStorage.getItem("isHasPay") &&
        this.infoOrderdetails(
          this.app.placeOrderMsg.payed,
          this.app.placeOrderMsg.left,
          this.app.placeOrderMsg.chain,
          this.app.placeOrderMsg.chain_icon,
          this.app.placeOrderMsg.chain_id
        );
    },
    //切换支付方式
    async chosePayWay(_index) {
      await this.clearQR();
      this.tabNow = _index;
      this.payType = this.table[_index].pay_type;
      this.$emit("choosePayType", this.payType);
      clearInterval(this.weTimer);
      clearInterval(this.timeQuery);
      /**
       * @param coinType == 2 ----> 微信支付
       * @param coinType == 3 ----> 转账支付
       * @param coinType == 0 ----> 合约支付
       */
      _index == 2 &&
        (((this.coinType = "2"), this.$emit("chooseCoinType", "2")),
        this.$emit("choosePayType", "1"),
        setTimeout(() => {
          this.$flag ? this.queryOrder() : this.creatPayQr();
        }, 100));
      _index == 1 &&
        (((this.coinType = "3"), this.$emit("chooseCoinType", "3")),
        setTimeout(() => {
          this.payTransfar();
        }, 500));
      _index == 0 && ((this.coinType = "0"), this.$emit("chooseCoinType", "0"));
    },
    //切换公链
    async changeChain(_index) {
      await this.clearQR();
      this.$store.commit("upChainType", _index);
      this.coinType = "0";
      this.$emit("chooseCoinType", "0");
      ChainTool.chooseChain(this.chainList, _index);
    },
    //转账支付 - 切换公链
    async transfarChangeChain(_index) {
      await this.clearQR();
      await this.changeChain(_index);
      this.watchEtherLogCancel && this.watchEtherLogCancel.unsubscribe();
      setTimeout(() => {
        this.payTransfar();
      }, 100);
    },
    //TODO
    //钱包支付 --> 合约支付
    async payWallet() {
      this.$emit("openLoading", true);
      const { ethereum } = window;
      if (!ethereum) {
        this.$notify({
          type: "danger",
          //您的浏览器尚未安装钱包
          message: this.$t("notify.un_wallet"),
        });
        this.$emit("openLoading", false);
        return;
      }
      //支付参数
      const params = {
        _chain: this.chainList,
        _chain_type: this.chainType,
        _order_num: this.app.placeOrderMsg.order_number,
        _coin_type: this.coinType,
      };
      const result = await ChainTool.payContract(params);
      result == 0 && this.$emit("openLoading", false);
      //支付成功
      const next = () => {
        localStorage.setItem("openSearchBox", true);
        this.$refs.pend.queryOrder(
          //当前交易hash
          result,
          //浏览器查询地址
          this.chainList[this.chainType].explorer + "/tx/" + result,
          //当前操作订单Number
          this.app.placeOrderMsg.order_number,
          //当前订单价格
          this.coinType == 2
            ? this.app.placeOrderMsg.price1
            : this.app.placeOrderMsg.price,
          //当前选中资产类型  USDT / USDC
          this.chainList[this.chainType].coin[this.coinType].name,
          //是否为转账支付
          false
        );
        this.$emit("openLoading", false);
      };
      result.length > 1 && next();
    },
    //钱包支付 - 转账支付
    async payTransfar() {
      //切换公链
      await api.choseChain({
        order_number: this.app.placeOrderMsg.order_number,
        chain_id: this.chainList[this.chainType].id,
      });
      //生成地址二维码
      let qrcode = new QRCode("transQR", {
        width: 160,
        height: 160,
        text: this.app.account.pay_address,
      });
      //币种列表渲染
      let address_coin = this.chainList[this.chainType].coin.map(
        (e) => e.contract
      );
      // 充值地址 -- 去掉0x
      const address = this.app.account.pay_address.replace("0x", "");
      //调用转账监听
      watchEtherLog = () => {
        // 0 - 1 随机数
        let random = Math.floor(Math.random() + 0.5);
        const web3Http = new Web3(
          this.chainList[this.chainType].developer_rpc[random]
        );
        const web3 = new Web3(
          new Web3.providers.WebsocketProvider(
            this.chainList[this.chainType].developer_wss[random]
          )
        );
        //唤起监听
        this.watchEtherLogCancel = web3.eth
          .subscribe(
            "logs",
            {
              fromBlock: "pending",
              address: address_coin, //代币地址
              topics: [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                null,
                "0x000000000000000000000000" + address,
              ],
            },
            (error, result) => {
              if (error) {
                watchEtherLog();
                // return
              }
            }
          )
          .on("connected", function (subscriptionId) {
            console.log(subscriptionId);
          })
          .on("data", async (log) => {
            //查询转账信息
            let info = await web3Http.eth.getTransactionReceipt(
              log.transactionHash
            );
            //获取币种名称
            const coinName =
              this.chainList[this.chainType].coin[
                address_coin.indexOf(info.logs[0].address)
              ].name;
            //获取当前已支付信息
            const result = await api.transInfo({
              order_number: this.app.placeOrderMsg.order_number,
              amount:
                info.logs[0].data /
                ("1e" +
                  this.chainList[this.chainType].coin[
                    address_coin.indexOf(info.logs[0].address)
                  ].decimals),
            });
            //开启支付 Pending 窗口
            this.$refs.pend.queryOrder(
              //当前交易hash
              info.transactionHash,
              //浏览器查询地址
              this.chainList[this.chainType].explorer +
                "/tx/" +
                info.transactionHash,
              //当前操作订单Number
              this.app.placeOrderMsg.order_number,
              //订单价格
              this.app.placeOrderMsg.price,
              //资产类型 USDT / USDC
              coinName,
              //是否为转账支付
              true,
              //当前交易区块高度
              info.logs[0].blockNumber,
              //当前节点rpc
              this.chainList[this.chainType].developer_rpc[random],
              //当前节点ID
              this.chainList[this.chainType].id,
              //当前交易已支付金额
              result.pay_price,
              //当前交易剩余支付金额
              result.last_price
            );
            window.clearSub = this.clearSub;
          })
          .on("changed", function (log) {
            console.log(log);
          });
      };
      watchEtherLog();
    },
    //微信支付二维码
    async creatPayQr() {
      //获取支付信息
      const result = await api.wePay({
        order_number: this.app.placeOrderMsg.order_number,
        trade_type: this.$flag ? "MWEB" : "NATIVE",
      });
      //生成支付二维码
      const creatQR = () => {
        let qrcode = new QRCode("payQR", {
          width: 160,
          height: 160,
          text: result.data.code_url,
        });
      };
      const openWechat = () => {
        const backUrl = encodeURIComponent(
          process.env.VUE_APP_RESET +
            "/#/mobile-order-details?order_id=" +
            this.orderID +
            "&wechatBack=true"
        );
        window.open(result.data.code_url + `&redirect_url=${backUrl}`);
      };
      this.$flag ? openWechat() : creatQR();
      //支付成功
      const success = async () => {
        await api.userInfo().then((res) => {
          this.$store.dispatch("setAccount", res);
        });
        clearInterval(this.timeQuery);
        this.$refs.pend.payEnd = true;
      };
      //定时查询支付状态
      this.timeQuery = setInterval(async () => {
        const result = await api.payWechat({
          order_number: this.app.placeOrderMsg.order_number,
          trade_type: this.$flag ? "MWEB" : "NATIVE",
        });
        result.status == 1 && success();
      }, 3000);
    },
    //复制转账地址
    copyCodeAddress() {
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          //充值地址复制成功
          message: this.$t("notify.transfer_copy"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          //复制失败
          message: this.$t("notify.copy_falied"),
        });
        clipboard.destroy();
      });
    },
    //复制客服微信
    copyContact() {
      let clipboard = new Clipboard(".copy-we");
      clipboard.on("success", (e) => {
        this.$notify({
          type: "success",
          //客服微信复制成功
          message: this.$t("notify.wechat_copy"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          type: "danger",
          // 复制失败
          message: this.$t("notify.copy_falied"),
        });
        clipboard.destroy();
      });
    },
    //移动端微信支付查询
    queryOrder() {
      this.weTimer = setInterval(() => {
        api
          .payWechat({
            order_number: this.app.placeOrderMsg.order_number,
            trade_type: "MWEB",
          })
          .then(async (res) => {
            if (res.status == 1) {
              await api.userInfo().then((res) => {
                this.$store.dispatch("setAccount", res);
              });
              this.paySuccess = true;
              clearInterval(this.weTimer);
            }
          })
          .catch((err) => {
            clearInterval(this.timer);
            this.$$notify({ type: "danger", message: err.msg });
          });
      }, 3000);
    },
    //客服微信获取
    async getContact() {
      const result = await api.contactQR();
      this.contactURL = result.image;
      this.contactWe = result.nickname;
    },
    // 清除二维码缓存
    async clearQR() {
      if (this.$refs.payQR) this.$refs.payQR.innerHTML = "";
      if (this.$refs.transQR) this.$refs.transQR.innerHTML = "";
    },
    //清除以太坊监听
    clearSub() {
      this.watchEtherLogCancel && this.watchEtherLogCancel.unsubscribe();
    },
    //清除定时器
    clearTime() {
      clearInterval(this.$refs.pend.tiemSet);
      clearInterval(this.weTimer);
      clearInterval(this.timeQuery);
    },
  },
  beforeDestroy() {
    clearInterval(this.$refs.pend.tiemSet);
    clearInterval(this.timeQuery);
    localStorage.removeItem("openSearchBox");
    clearInterval(this.weTimer);
  },
};
</script>

<style lang="scss" scoped>
.active-tab {
  background: $conBg2;
  color: $success !important;
}
.pay-way-new {
  background: $contentBg;
  border-radius: 4px;
  width: calc(100% - 405px);
  min-width: 858px;
  margin-top: 16px;
  .pay-way-new-title {
    width: 100%;
    height: 60px;
    display: flex;
    padding: 0 24px;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    background: $conBg2;
    p {
      font-size: 17px;
      color: $textColor;
    }
    p:last-child {
      display: flex;
      align-items: center;
      font-size: 14px;
      .iconfont {
        font-size: 24px;
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
  .pay-way-new-content {
    padding: 24px 24px 40px;
    transition: 0.3s all;
    .new-content-table {
      width: 100%;
      border-bottom: 1px solid $conBg2;
      margin-bottom: 40px;
      ul {
        height: 48px;
        display: flex;
        li {
          height: 100%;
          line-height: 48px;
          font-size: 14px;
          color: $remarkColor;
          cursor: pointer;
          border-radius: 4px 4px 0 0;
          transition: 0.3s all;
          padding: 0 32px;
        }
      }
    }
    .coin-type {
      display: flex;
      padding: 0 24px;
      height: 24px;
      align-items: center;
      margin-bottom: 24px;
      /deep/ .form-check {
        margin-top: 0.2rem;
      }
      .type-flex {
        display: flex;
        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .has-pay {
          font-weight: bold;
          color: $success;
          font-size: 17px;
        }
        .un-pay {
          color: $danger;
        }
      }
      p {
        margin-right: 48px;
        color: white;
        white-space: nowrap;
      }
      .coin-tab {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin: 0 8px;
        }
      }
    }
    .without-radio {
      margin-right: 20px !important;
      color: white;
      .coin-line {
        color: #49537a;
        margin-left: 20px;
      }
      img {
        margin-left: 0 !important;
      }
    }
    .without-radio:last-child {
      .coin-line {
        display: none;
      }
    }
    .transfar-pay {
      .transfar-box {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .transfar-msg {
          width: calc(100% - 128px);
          padding: 48px;
          border: 1px solid $lineTwoColor;
          margin-top: 24px;
          .msg-title {
            font-size: 14px;
            color: white;
            margin-bottom: 24px;
          }
          .transfat-con {
            display: flex;
            .trans-box {
              width: 160px;
              height: 160px;
              position: relative;
              margin-right: 24px;
              .trans-qr {
                width: 160px;
                height: 160px;
                position: relative;
                z-index: 200;
                border: 8px solid white;
                overflow: hidden;
              }
              .trans-mask {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 100;
              }
            }

            .address-box {
              padding: 16px 24px;
              background: $conBg2;
              max-width: 445px;
              border-radius: 4px;
              display: flex;
              flex-direction: column;
              margin-bottom: 24px;
              p:first-child {
                font-size: 13px;
                color: $remarkColor;
                margin-bottom: 8px;
              }
              p:last-child {
                font-size: 14px;
                color: white;
                display: flex;
                .iconfont {
                  margin-left: 18px;
                  cursor: pointer;
                  display: inline-block;
                  transform: translateY(-1px);
                }
              }
            }
            .attention-box {
              p {
                font-size: 12px;
                line-height: 24px;
                color: $remarkColor;
              }
            }
          }
        }
      }
    }
    .wechat-pay {
      .iconfont {
        font-size: 16px;
        color: $remarkColor;
        cursor: pointer;
        margin-left: 8px;
      }
      .wechat-qr {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .qr-content {
          width: calc(100% - 128px);
          border: 1px solid $lineTwoColor;
          padding: 40px 0;
          text-align: center;
          .qr-box {
            width: 160px;
            height: 160px;
            margin: 0 auto;
            margin-top: 24px;
            margin-bottom: 24px;
            position: relative;
            .payQR {
              width: 100%;
              height: 100%;
              position: relative;
              z-index: 200;
              border: 8px solid white;
            }
            .mask-qr {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 100;
            }
          }

          p {
            color: $remarkColor;
          }
          p:first-child {
            /deep/ span {
              font-weight: bold;
              color: white;
              margin: 0 4px;
            }
          }
          p:last-child {
            background: $conBg2;
            width: 240px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            padding: 12px 0;
            border-radius: 4px;
            .iconfont {
              margin-right: 8px;
              font-size: 16px;
            }
            /deep/ span {
              font-weight: bold;
              color: $success;
              margin: 0 4px;
            }
          }
          .qr-remark-en {
            width: 460px !important;
          }
        }
      }
    }
  }
}
.un-bind-wallet {
  padding: 24px;
  padding-top: 48px;
  p:first-child {
    font-size: 14px;
    color: $titleColor;
    text-align: center;
    margin-bottom: 32px;
  }
  p:last-child {
    display: flex;
    justify-content: space-around;
    button {
      margin: 0 16px;
    }
  }
}
@media screen and (max-width: 1279px) {
  .pay-way-new {
    width: 100% !important;
    min-width: auto;
    .pay-way-new-title {
      height: $padd40;
      padding: 0 1rem;
      p:first-child {
        font-size: $fon14;
      }
      p:last-child {
        font-size: $fon12;
        margin-top: 1px;
        .iconfont {
          font-size: $fon14;
        }
      }
    }
    .pay-way-new-content {
      padding: $padd24 1rem $padd40;
      .new-content-table {
        ul {
          height: 2rem;
          li {
            line-height: 2rem;
            font-size: $fon12;
            padding: 0 1rem;
          }
        }
      }
      .coin-type {
        height: auto;
        width: 100%;
        align-items: flex-start;
        flex-direction: column;
        padding: 0;

        .type-flex {
          flex-wrap: wrap;
          transform: translateY(-6px);
          width: 50%;
          .has-pay {
            transform: translateY(5px);
          }
        }
        p:first-child {
          width: auto;
          margin-top: $fon12;
        }
        // p {
        //   margin-top: 1.5rem;
        //   margin-right: $padd24;
        // }
        .coin-tab {
          margin-bottom: 0.5rem;
        }
        .without-radio:first-child {
          margin-top: 1rem !important;
        }
        .without-radio {
          margin-top: 0.5rem;
        }
      }
      .transfar-pay {
        .coin-type:nth-child(4) {
          .type-flex {
            p:last-child {
              margin-top: 0.3rem;
            }
          }
        }
        .transfar-box {
          width: 100%;
          .transfar-msg {
            width: 100%;
            padding: $padd40 1rem;
            .msg-title {
              margin: 0 2rem !important;
              text-align: center;
              line-height: 20px;
            }
            .transfat-con {
              flex-direction: column;
              .trans-box {
                margin: 0 auto;
                margin-bottom: $padd24;
                margin-top: $padd24;
              }
              .trans-address {
                .address-box {
                  padding: 1rem;
                  position: relative;
                  p:first-child {
                    margin-bottom: 1rem;
                  }
                  p:last-child {
                    word-break: break-all;
                    line-height: $fon20;
                    span:last-child {
                      position: absolute;
                      top: 1rem;
                      right: 1rem;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .wechat-pay {
        .coin-type:last-child {
          span {
            color: $success;
            font-weight: bold;
            font-size: $fon14;
            display: inline-block;
            transform: translateY(6px);
          }
        }
      }
    }
  }
}
.pay-success {
  text-align: center;
  .icon-box {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(90deg, #00bad6 0%, #2de0bd 100%);
    margin: 0 auto;
    margin-top: 3.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    .iconfont {
      font-size: 2rem;
      font-weight: bold;
    }
  }
  .success-title {
    font-size: 1rem;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 0.5rem;
  }
  .success-remark {
    font-size: $fon12;
    color: $remarkColor;
    margin-bottom: $padd24;
  }
  button {
    margin-bottom: $size48;
  }
}
</style>