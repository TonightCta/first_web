// 项目解析面板
<template>
  <div class="project-details">
    <!-- Title -->
    <div class="coin-msg">
      <div class="icon-box">
        <p class="coin-logo">
          <img :src="detailsMsg.logo" alt="" />
          <span v-if="detailsMsg.is_attention == 1" class="is-star">
            <!-- 关注 -->
            {{ $t("public.follow") }}
          </span>
          <span v-else class="un-star">
            <!-- 不关注 -->
            {{ $t("public.un_follow") }}
          </span>
        </p>
        <div class="name-box">
          <p>{{ detailsMsg.title }} ({{ detailsMsg.symbol }})</p>
          <p>
            <span
              class="race"
              v-for="(race, indexRace) in detailsMsg.race"
              :key="indexRace"
              style="cursor: pointer"
              @click="goSearch(race)"
              >{{ race }}</span
            >
            <span
              class="tag"
              v-for="(tag, indexTag) in detailsMsg.tag"
              @click="goSearch(tag)"
              style="cursor: pointer"
              :key="indexTag + 'tag'"
              >{{ tag }}</span
            >
          </p>
        </div>
      </div>
      <div class="oper-box">
        <el-popover
          placement="bottom"
          width="105"
          trigger="hover"
          v-if="detailsMsg.coin"
        >
          <ul class="view-choice">
            <li
              @click="
                goPDF(
                  $flag ? detailsMsg.coin_mobile_pdf : detailsMsg.coin_pdf,
                  3,
                  detailsMsg.coin
                )
              "
            >
              <!-- 查看研报 -->
              {{ $t("project_info.view_reports") }}
            </li>
            <li></li>
            <li @click="downPDF(3, detailsMsg.coin, 1)">
              <!-- 下载研报 -->
              {{ $t("project_info.down_load") }}
            </li>
          </ul>
          <base-button type="default" slot="reference" round>
            <!-- 新币速递 -->
            {{ $t("public.info_coin") }}
          </base-button>
        </el-popover>
        <el-popover
          placement="bottom"
          width="105"
          trigger="hover"
          v-if="detailsMsg.is_new_pdf == 1"
        >
          <ul class="view-choice">
            <li @click="downPDF(1, detailsMsg.id, 0)">
              <!-- 下载第二版 -->
              {{ $t("public.load_second") }}
            </li>
            <li></li>
            <li @click="downPDF(1, detailsMsg.id, 1)">
              <!-- 下载第一版 -->
              {{ $t("public.load_first") }}
            </li>
          </ul>
          <base-button slot="reference" type="default" round>
            <!-- 下载研报 -->
            {{ $t("project_info.down_load") }}
          </base-button>
        </el-popover>
        <base-button
          type="default"
          round
          v-else
          @click="downPDF(1, detailsMsg.id, 1)"
        >
          <!-- 下载研报 -->
          {{ $t("project_info.down_load") }}
        </base-button>
        <base-button
          type="default"
          round
          v-if="detailsMsg.race_analysis"
          @click="$router.push('/race')"
        >
          <!-- 赛道解析 -->
          {{ $t("public.info_race") }}
        </base-button>
        <!-- v-if="detailsMsg.is_new_pdf == 0" -->
        <base-button
          type="info"
          round
          v-if="detailsMsg.is_new_pdf == 0"
          @click="
            goPDF(
              $flag ? detailsMsg.mobile_pdf : detailsMsg.pdf,
              1,
              detailsMsg.id
            )
          "
        >
          <!-- 阅读研报 -->
          {{ $t("project_info.view_reports") }}
        </base-button>
        <!-- TODO -->
        <!-- detailsMsg.is_new_pdf == 1 -->
        <el-popover
          placement="bottom-end"
          trigger="hover"
          width="200"
          :visible-arrow="false"
          v-else
        >
          <ul class="view-choice">
            <li
              @click="
                goPDF(
                  $flag ? detailsMsg.mobile_new_pdf : detailsMsg.pdf_new,
                  1,
                  detailsMsg.id
                )
              "
            >
              <div>
                <p>
                  <!-- 第2版研报 -->
                  {{ $t("public.second_report") }}
                  <i class="iconfont icon-new"></i>
                </p>
                <p>{{ detailsMsg.new_pdf_time }}</p>
              </div>
              <span class="iconfont icon-you_right"></span>
            </li>
            <li></li>
            <li
              @click="
                goPDF(
                  $flag ? detailsMsg.mobile_pdf : detailsMsg.pdf,
                  1,
                  detailsMsg.id
                )
              "
            >
              <div>
                <p>
                  <!-- 第1版研报 -->
                  {{ $t("public.first_report") }}
                </p>
                <p>{{ detailsMsg.publish_time }}</p>
              </div>
              <span class="iconfont icon-you_right"></span>
            </li>
          </ul>
          <base-button type="info" round slot="reference">
            <!-- 阅读研报 -->
            {{ $t("project_info.view_reports") }}
          </base-button>
        </el-popover>
      </div>
    </div>
    <!-- 基本数据 -->
    <Information :info="detailsMsg" v-if="detailsMsg.is_tokens == 1" />
    <!-- 暂未发行代币 -->
    <div class="un-coin" v-else>
      <!-- 该项目当前没有发行代币 -->
      {{ $t("public.no_coin") }}
    </div>
    <!-- 头等仓观点 -->
    <!--   && detailsMsg.desc_full -->
    <div
      class="details-left-bottom-out"
      v-if="detailsMsg.is_tokens == 0 && detailsMsg.desc_full"
    >
      <div class="message-inner">
        <p class="h3">
          <!-- 头等仓观点 -->
          {{ $t("project_interface.first_view") }}
          (<label>{{ detailsMsg.desc_time }}</label
          >)
          <span></span>
        </p>
        <el-popover
          placement="top"
          title="头等仓观点"
          :width="$flag ? 320 : 400"
          trigger="hover"
          :content="detailsMsg.desc_full"
          v-if="detailsMsg.desc_full"
        >
          <p class="h4 text-overflow" slot="reference" style="cursor: pointer">
            {{ detailsMsg.desc }}
          </p>
        </el-popover>
        <p class="h4" v-else>{{ detailsMsg.desc }}</p>
      </div>

      <img :src="require('@/assets/images/proIcon.png')" alt="" />
    </div>
    <!-- 图表数据 -->
    <EchartsBox
      v-if="detailsMsg.is_tokens == 1"
      :projectId="$route.query.id"
      @resizeEcharts="getResize"
      :desc="detailsMsg.no_token_distribute_desc"
    />
    <!-- 代币分发规则 -->
    <CoinTable v-if="detailsMsg.is_tokens == 1 && detailsMsg.is_regular == 1" />
    <!-- 重大事件 -->
    <EventTable />
    <!-- 我的咨询 & 资讯 -->
    <ServiceAndNews :title="detailsMsg.title" :symbol="detailsMsg.symbol" />
    <!-- 特定数据 -->
    <div class="row">
      <component
        v-for="(com, indexCom) in detailsMsg.charts"
        :is="com.flag"
        :title="app.language == 'en' ? com.title_en : com.title"
        :desc="app.language == 'en' ? com.desc_en : com.desc"
        :key="indexCom"
        :projectType="com.params"
        @resizeEcharts="getResize"
      ></component>
    </div>
    <!-- 同赛道竞品 -->
    <div
      class="compete-box"
      v-if="detailsMsg.competitor && detailsMsg.competitor.length > 0"
    >
      <el-popover
        placement="top-end"
        :visible-arrow="false"
        width="300"
        trigger="hover"
      >
        <div class="compete-list">
          <ul>
            <li
              v-for="(compete, indexPete) in detailsMsg.competitor"
              :key="indexPete"
              @click="changePro(compete.id, compete.symbol)"
            >
              <img :src="compete.logo" alt="" />
              <p>{{ compete.title }}({{ compete.symbol }})</p>
            </li>
          </ul>
        </div>
        <base-button type="info" round slot="reference">
          <i class="iconfont icon-xianglintiaomu_adjacent-item"></i>
          <!-- 赛道竞品 -->
          {{ $t("project_interface.sector") }}
        </base-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { projectDetails } from "@/request/api";
export default {
  name: "ProjectDetails",
  components: {
    Information: (resolve) => require(["./coms/information"], resolve),
    EchartsBox: (resolve) => require(["./coms/echarts_box"], resolve),
    CoinTable: (resolve) => require(["./coms/coin_table"], resolve),
    EventTable: (resolve) => require(["./coms/event_table"], resolve),
    ServiceAndNews: (resolve) => require(["./coms/service_and_news"], resolve),
    // 稳定币市值
    StableCoinValue: (resolve) =>
      require(["./echarts_file/stable_coin_race_value.vue"], resolve),
    // 市值历史变化
    StableCoinHistory: (resolve) =>
      require(["./echarts_file/stable_coin_race_history.vue"], resolve),
    // 市值 & 交易量历史变化
    ValueHistory: (resolve) =>
      require(["./echarts_file/value_history.vue"], resolve),
    // 价格历史变化
    StableCoinPrice: (resolve) =>
      require(["./echarts_file/stablue_coin_race_price.vue"], resolve),
    //交易对数量
    StableCoinTrade: (resolve) =>
      require(["./echarts_file/stable_coin_race_trade.vue"], resolve),
    //成交量占比历史变化
    StableCoinDeal: (resolve) =>
      require(["./echarts_file/stablue_coin_race_deal.vue"], resolve),
    // LDO图表数据
    //质押资产总价值(USD计价)
    StableLdoTotal: (resolve) =>
      require(["./echarts_file/ldo/stable_ldo_total"], resolve),
    //质押人数
    StableLdoPeople: (resolve) =>
      require(["./echarts_file/ldo/stable_ldo_people"], resolve),
    //质押量占比
    StableLdoPre: (resolve) =>
      require(["./echarts_file/ldo/stable_ldo_pre"], resolve),
    //质押资产总价值 - Ethereum(ETH计价)
    StableLdoEth: (resolve) =>
      require(["./echarts_file/ldo/stable_ldo_eth"], resolve),
    //质押资产总价值 - Terra(LUNA计价)
    StableLdoLuna: (resolve) =>
      require(["./echarts_file/ldo/stable_ldo_luna"], resolve),
    // 质押资产总价值 - Solana(SOL计价)
    StableLdoSol: (resolve) =>
      require(["./echarts_file/ldo/stable_ldo_sol"], resolve),
    //Hotspots数量和拥有者数变化 - HNT
    StableHntHot: (resolve) =>
      require(["./echarts_file/hnt/stable_hnt_hot"], resolve),
    //花费DC数变化 - HNT
    StableHntDc: (resolve) =>
      require(["./echarts_file/hnt/stable_hnt_dc"], resolve),
    //质押数据 - HNT
    StableHntStakers: (resolve) =>
      require(["./echarts_file/hnt/stable_hnt_stakers"], resolve),
    //覆盖城市数 - HNT
    StableHntCity: (resolve) =>
      require(["./echarts_file/hnt/stable_hnt_city"], resolve),
    //以太坊混币资产规模 - Torn
    StableTornScale: (resolve) =>
      require(["./echarts_file/torn/stable_torn_scale"], resolve),
    //混币业务核心数据一览 - Torn
    StableTornData: (resolve) =>
      require(["./echarts_file/torn/stable_torn_data"], resolve),
    //协议收入 - Torn
    StableTornIncome: (resolve) =>
      require(["./echarts_file/torn/stable_torn_income"], resolve),
    //Nova混币池规模 - Torn
    StableTornNova: (resolve) =>
      require(["./echarts_file/torn/stable_torn_nova"], resolve),
    //算力占比变化 - EDEN
    StableEdenPower: (resolve) =>
      require(["./echarts_file/eden/stable_eden_power"], resolve),
    //Slot拍卖情况 - EDEN
    StableEdenAuction: (resolve) =>
      require(["./echarts_file/eden/stable_eden_auction"], resolve),
    //代币质押情况 - EDEN
    StableEdenPledge: (resolve) =>
      require(["./echarts_file/eden/stable_eden_pledge"], resolve),
    //代币质押情况 - Table - EDEN
    StableEdenPledgeTable: (resolve) =>
      require(["./echarts_file/eden/stable_eden_pledge_table"], resolve),
    //代币质押情况 - Two - EDEN
    StableEdenPledgeTwo: (resolve) =>
      require(["./echarts_file/eden/stable_eden_pledge_two"], resolve),
    //Float价格 - FLOAT
    StableFloatPrice: (resolve) =>
      require(["./echarts_file/float/stable_float_price"], resolve),
    //篮子TVL - FLOAT
    StableFloatTVL: (resolve) =>
      require(["./echarts_file/float/stable_float_tvl"], resolve),
    //Float供应量 - FLOAT
    StableFloatSupply: (resolve) =>
      require(["./echarts_file/float/stable_float_supply"], resolve),
    //Float持有地址 - FLOAT
    StableFloatAddress: (resolve) =>
      require(["./echarts_file/float/stable_float_address"], resolve),
    //Bank持有地址 - FLOAT
    StableFloatBank: (resolve) =>
      require(["./echarts_file/float/stable_float_bank"], resolve),
    //Aave资金锁仓规模 - AAVE
    StableAaveTVL: (resolve) =>
      require(["./echarts_file/aave/stable_aave_tvl"], resolve),
    //资金池内各项资产出借情况 - AAVE
    StableAaveLoan: (resolve) =>
      require(["./echarts_file/aave/stable_aave_loan"], resolve),
    //各项资产利用率百分比 - AAVE
    StableAaveUse: (resolve) =>
      require(["./echarts_file/aave/stable_aave_use"], resolve),
    //资金池内各项资产留存情况 - AAVE
    StableAaveKeep: (resolve) =>
      require(["./echarts_file/aave/stable_aave_keep"], resolve),
    //AAVE活跃用户数 - AAVE
    StableAaveActive: (resolve) =>
      require(["./echarts_file/aave/stable_aave_active"], resolve),
    //指数代币供应量 - Index
    StableIndexSupply: (resolve) =>
      require(["./echarts_file/index/stable_index_supply"], resolve),
    //FLI交易量 - Index
    StableIndexFLI: (resolve) =>
      require(["./echarts_file/index/stable_index_fli"], resolve),
    //DPI交易量 - Index
    StableIndexDPI: (resolve) =>
      require(["./echarts_file/index/stable_index_dpi"], resolve),
    // Immutable X TVL - Lmmutable
    StableImmuTVL: (resolve) =>
      require(["./echarts_file/lmmu/stable_lmmu_tvl"], resolve),
    //Immutable X 生态 - Lmmutable
    StableImmuEcology: (resolve) =>
      require(["./echarts_file/lmmu/stale_lmmu_ecology"], resolve),
    //Bridgeworld用户增长情况 - DAO
    StableDaoInc: (resolve) =>
      require(["./echarts_file/dao/stable_dao_inc"], resolve),
    //$MAGIC的持币地址数 - DAO
    StableDaoHold: (resolve) =>
      require(["./echarts_file/dao/stable_dao_hold"], resolve),
    //Treasure Market每日成交量 - DAO
    StableDaoMarket: (resolve) =>
      require(["./echarts_file/dao/stable_dao_market"], resolve),
    //Hop Protocol TVL - Hop Protocol
    StableHopTVL: (resolve) =>
      require(["./echarts_file/hop/stable_hop_tvl"], resolve),
    //Ethereum跨链桥TVL规模 - Hop Protocol
    StableHopETH: (resolve) =>
      require(["./echarts_file/hop/stable_hop_eth"], resolve),
    //Hop Protocol 累计用户数 - Hop Protocol
    StableHopUnumber: (resolve) =>
      require(["./echarts_file/hop/stable_hop_unumber"], resolve),
    //Convex每月活跃用户 - Convex
    StableConvexActive: (resolve) =>
      require(["./echarts_file/convex/stable_convex_active"], resolve),
    //DAO持有CVX数量 - Convex
    StableConvexCVX: (resolve) =>
      require(["./echarts_file/convex/stable_convex_cvx"], resolve),
    //CRV质押量 - Convex
    StableConvexPledge: (resolve) =>
      require(["./echarts_file/convex/stable_convex_pledge"], resolve),
    //Convex TVL - Convex
    StableConvexTVL: (resolve) =>
      require(["./echarts_file/convex/stable_convex_tvl"], resolve),
    //FEI -  PCV中代币资产组合(USD)
    StableFEICom: (resolve) =>
      require(["./echarts_file/fei/stable_fei_com"], resolve),
    //FEI -  FEI的持有分布(协议持有/用户持有)
    StableFEIDis: (resolve) =>
      require(["./echarts_file/fei/stable_fei_dis"], resolve),
    //FEI -  PCV中代币资产占比(USD)
    StableFEIPre: (resolve) =>
      require(["./echarts_file/fei/stable_fei_pre"], resolve),
    //FEI -  协议持有的FEI分布情况
    StableFEIPro: (resolve) =>
      require(["./echarts_file/fei/stable_fei_pro"], resolve),
    //FEI -  TRIBE的交易次数
    StableFEITrade: (resolve) =>
      require(["./echarts_file/fei/stable_fei_trade"], resolve),
    //Gala - Gala Games创始人在线节点数
    StableGalaOnline: (resolve) =>
      require(["./echarts_file/gala/stable_gala_online"], resolve),
    //Gala - Gala Games生态内游戏合作情况
    StableGalaTeam: (resolve) =>
      require(["./echarts_file/gala/stable_gala_team"], resolve),
    //Gear - GearBox协议存款规模
    StableGearDeposit: (resolve) =>
      require(["./echarts_file/gear/stable_gear_deposit"], resolve),
    //Gear - GearBox协议收入情况
    StableGearIncome: (resolve) =>
      require(["./echarts_file/gear/stable_gear_income"], resolve),
    //Gear - GearBox协议每日新增用户数
    StableGalaNew: (resolve) =>
      require(["./echarts_file/gear/stable_gear_new"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  data() {
    return {
      comsList: [],
      refsList: [], //重置图表大小列表
      detailsMsg: {},
    };
  },
  created() {
    this.getDetailsPro();
  },
  methods: {
    //接受图表参数
    getResize(_canvas) {
      _canvas.forEach((e) => {
        this.refsList.push(e);
      });
    },
    //重置图表尺寸
    turnResize() {
      this.refsList.forEach((e) => {
        e.resize();
      });
    },
    //清空图表占用内存
    clearEcharts() {
      this.refsList.forEach((e) => {
        e.clear();
      });
    },
    //获取解析详情
    async getDetailsPro(_id) {
      const result = await projectDetails({
        id: _id ? _id : this.$route.query.id,
      });
      this.detailsMsg = result;
    },
    //查看PDF
    goPDF(_url, _type, _id) {
      // readNow({
      //   type: _type,
      //   id: _id,
      // });
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      this.$store.dispatch("viewPDF", _url);
      // window.PDFLock(_type, _id, 1, _is_old);
    },
    //标签搜索
    goSearch(_val) {
      window.goSearch(_val);
    },
    moveEvent() {
      let container = document.querySelector(".mine-view");
      container.scrollTo({
        top: document.querySelector(".event-table").offsetTop - 10,
        behavior: "smooth",
      });
    },
    //下载研报
    downPDF(_type, _id, is_old) {
      window.PDFLock(_type, _id, this.$flag ? 2 : 1, is_old);
    },
    //切换竞品项目
    changePro(_id, _symbol) {
      this.detailsMsg = {};
      this.$router.push({
        path: "/project/projectDetails",
        query: {
          id: _id,
          name: _symbol,
        },
      });
      this.getDetailsPro(_id);
    },
  },
  mounted() {
    setTimeout(() => {
      window.addEventListener("resize", this.turnResize, true);
    }, 3000);
    this.$nextTick(() => {
      if (this.app.isGoEvent) {
        setTimeout(() => {
          this.moveEvent();
        }, 500);
      }
    });
  },
  beforeDestroy() {
    this.clearEcharts();
  },
  destroyed() {
    this.refsList = [];
    window.removeEventListener("resize", this.turnResize, true);
  },
};
</script>

<style lang="scss" scoped>
.view-choice {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    div {
      display: flex;
      flex-direction: column;
      p {
        text-align: left;
      }
      p:first-child {
        font-size: 14px;
        color: $titleColor;
        .iconfont {
          font-size: 16px;
          margin-left: 8px;
          color: #8a3ffc;
        }
      }
      p:last-child {
        font-size: 12px;
        color: $remarkColor;
        margin-top: 4px;
      }
    }
    .icon-you_right {
      font-size: 16px;
      color: $remarkColor;
    }
  }
}
.project-details {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  .col-sm-24,
  .col-sm-12 {
    margin-bottom: 24px;
  }
  .h4,
  .h5,
  .h1,
  .h3 {
    margin-bottom: 0;
    color: white;
  }
  .un-coin {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
    background: $conBg2;
    color: $success;
    margin-top: 24px;
  }
  .coin-msg {
    display: flex;
    justify-content: space-between;
    // position: absolute;
    // top:0;
    // right:0;
    // width: 100%;
    // z-index: 1000;
    .icon-box {
      display: flex;
      .coin-logo {
        width: 64px;
        height: 65px;
        border-radius: 50%;
        position: relative;
        img {
          width: 100%;
          height: 64100%px;
          border-radius: 50%;
        }
        span {
          position: absolute;
          bottom: -5px;
          font-size: 12px;
          left: 10px;
          padding: 2px 9px;
        }
        .is-star {
          background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
          color: $titleColor;
          border-radius: 4px;
          font-weight: bold;
        }
        .un-star {
          background: linear-gradient(90deg, #25345c 0%, #304270 100%);
          color: white;
        }
      }
      .name-box {
        display: flex;
        flex-direction: column;
        margin-left: 16px;
        p:first-child {
          line-height: 30px;
        }
        p:last-child {
          margin-top: 8px;
        }
        p {
          font-size: 23px;
          font-weight: bold;
          color: white;
          .race {
            font-size: 12px;
            padding: 2px 8px 1px 8px;
            border-radius: 4px;
            background: rgba(167, 240, 186, 0.1);
            color: $success;
            margin-right: 8px;
          }
          .tag {
            font-size: 12px;
            padding: 1px 8px;
            border-radius: 12px;
            background: $info;
            color: $textColor;
            margin-right: 8px;
          }
        }
      }
    }
    .oper-box {
      button {
        margin-left: 16px;
        height: 40px;
        max-height: 40px;
      }
    }
  }
  .row {
    margin-top: 40px;
  }
  .compete-box {
    position: fixed;
    right: 20px;
    bottom: 20px;
    .iconfont {
      margin-right: 4px;
    }
  }
}
.compete-list {
  max-height: 260px;
  overflow: auto;
  ul {
    li {
      display: flex;
      padding: 12px 16px;
      border-radius: 4px;
      transition: 0.3s all;
      align-items: center;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 8px;
      }
      p {
        font-size: 13px;
        color: #676c7a;
        font-weight: bold;
      }
    }
    li:hover {
      background: #f3f4fa;
    }
  }
}
.details-left-bottom-out {
  height: 100px;
  margin-top: 24px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 !important;
  .message-inner {
    flex: 1;
    padding: 16px;
  }
  .h3 {
    font-size: 17px;
    color: $remarkColor;
    position: relative;
    padding-left: 20px;
    // margin-bottom: 12px;
    label {
      font-size: 13px !important;
      color: $success;
      display: inline-block;
      transform: translateY(-1px);
      margin-bottom: 4px !important;
    }
    span {
      display: inline-block;
      width: 4px;
      height: 16px;
      background: $success;
      position: absolute;
      left: 0;
      top: 3px;
    }
  }
  .h4 {
    padding-left: 20px;
    font-size: 13px;
    width: 100%;
  }
  img {
    height: 100px;
    z-index: 100;
    width: 440px;
  }
}
</style>