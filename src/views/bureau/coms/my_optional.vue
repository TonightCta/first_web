// 我的自选
<template>
  <div
    class="my-optional"
    :class="isFixed && !$flag && 'fixed-box'"
    id="fixed-box"
    v-loading="loadData"
  >
    <div class="optional-title">
      <p>
        <span class="iconfont icon-dingyue_rss"></span>
        <!-- 我的自选 -->
        {{ $t("bureau_mine.own_track") }}
      </p>
      <p
        v-if="isHasTurn"
        class="cancel-choose"
        @click="
          isHasTurn = false;
          chooseTrack = 9999;
          $emit('upPosalList', null);
        "
      >
        <!-- 取消选中 -->
        {{ $t("bureau_mine.cancel_active") }}
      </p>
    </div>
    <p class="optional-line"></p>
    <ul>
      <li
        v-for="(i, x) in trackMine"
        :key="x"
        @click="sendEmit(i.id, x)"
        :class="{ 'active-pro': chooseTrack == x }"
      >
        <p>
          <img :src="i.logo" alt="" />
          <span>{{ i.title }}</span>
          <span>{{ i.symbol }}</span>
        </p>
        <p
          @click.stop="
            $store.dispatch(
              'setPoint',
              $route.name == 'BureauExpress' ? 29 : 45
            );
            followOper(i.id);
            $emit('upPosalList', null);
          "
        >
          <span class="iconfont icon-jianshao_reduce"></span>
          <!-- 移除 -->
          {{ $t("bureau_mine.move") }}
        </p>
      </li>
      <li v-if="!isHasData">
        <p class="no-data">
          <!-- 暂无自选 -->
          {{ $t("no_data.no_track") }}
        </p>
      </li>
    </ul>
    <p class="optional-line" v-if="unSelected > 0"></p>
    <div class="optional-oper" v-if="unSelected > 0">
      <base-button
        type="info"
        round
        @click="
          addTrack = true;
          $store.dispatch('setPoint', $route.name == 'BureauExpress' ? 28 : 44);
          getOtherTrack();
        "
      >
        <i class="iconfont icon-tianjia_add"></i>
        <!-- 添加自选 -->
        {{ $t("bureau_mine.add_track") }}
      </base-button>
    </div>
    <!-- 添加自选 -->
    <modal :show.sync="addTrack" modalClasses="add-track-box">
      <div class="add-track">
        <div class="add-title">
          <p>
            <span class="iconfont icon-tianjia_add"></span>
            <!-- 添加自选 -->
            {{ $t("bureau_mine.add_track") }}
          </p>
          <p class="search-add">
            <span class="iconfont icon-sousuo_search"></span>
            <input
              type="text"
              :placeholder="$t('public.pls_inp')"
              v-model="searchTrack"
            />
          </p>
        </div>
        <div class="add-lsit" v-loading="loadTrack">
          <ul v-if="isSearchResult">
            <li v-for="(i, a) in trackOther" :key="a">
              <div class="add-pro-msg">
                <img :src="i.logo" alt="" />
                <div class="pro-msg-title">
                  <p class="text-overflow">{{ i.title }} ({{ i.symbol }})</p>
                  <p>
                    <span
                      v-if="app.account.is_information == 2 && i.free == 0"
                      class="is-vip"
                    >
                      VIP
                    </span>
                    <span v-for="race in i.race" :key="race.id">{{
                      race.name
                    }}</span>
                  </p>
                </div>
              </div>
              <div class="pro-oper">
                <p @click="addTrackEv(i.free, 1, i.id)" v-if="i.follow == 0">
                  <span class="iconfont icon-jia_plus"></span>
                </p>
                <p @click="addTrackEv(i.free, 0, i.id)" v-else>
                  <span class="iconfont icon-jian_minus"></span>
                </p>
              </div>
            </li>
          </ul>
          <p v-else class="no-data-two">
            <!-- 没有找到你想要的 -->
            {{ $t("bureau_mine.no_want") }}
          </p>
        </div>
        <p class="close-btn">
          <base-button
            type="default"
            round
            @click="
              addTrack = false;
              $store.dispatch('upAccount');
            "
          >
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- 会员专享 -->
    <NeedVIP ref="needvip" />
  </div>
</template>

<script>
import { trackPro, addTrack, trackCount } from "@/request/api";
import { Modal } from "@/components";
import { mapState } from "vuex";
export default {
  data() {
    return {
      trackMine: [], //我的自选
      chooseTrack: 9999,
      addTrack: false,
      trackOther: [],
      searchTrack: null, //搜索
      isHasTurn: false, //是否有选择项目
      isHasData: true,
      loadData: false,
      isFixed: false, //是否吸顶
      unSelected: 999, //未选中数量
      loadTrack: false,
      isSearchResult: true, //我的自选 -》 是否有搜索结果
    };
  },
  components: {
    Modal,
    NeedVIP: (resolve) => require(["../coms/mine_bureau/need_vip"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getMineTrackCenter();
    this.getOtherTrack();
    this.unSel();
  },
  mounted() {
    !this.$flag && window.addEventListener("scroll", this.initHeight, true);
  },
  watch: {
    searchTrack() {
      this.getOtherTrack();
    },
  },
  methods: {
    //判断吸顶
    initHeight() {
      let el = document.querySelector(".open-alive");
      var scrollTop = el.getBoundingClientRect().top;
      this.isFixed = scrollTop <= 0 ? true : false;
    },
    //我的自选
    async getMineTrackCenter() {
      this.loadData = true;
      const result = await trackPro({ limit: 500, follow: 1 });
      result.data.length > 0
        ? (this.isHasData = true)
        : (this.isHasData = false);
      this.loadData = false;
      this.trackMine = result.data;
    },
    //移除自选
    async followOper(_id) {
      const result = await addTrack({
        id: _id,
        follow: 0,
      });
      if (result.code !== 2000) {
        this.$notify({
          type: "danger",
          message: result.data.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        //移除自选成功
        message: this.$t("notify.move_track"),
      });
      this.getOtherTrack();
      this.getMineTrackCenter();
      this.unSel();
      this.$emit("upPosalList", null);
      this.$store.dispatch("upAccount");
    },
    //获取未自选
    async getOtherTrack() {
      this.loadTrack = true;
      const result = await trackPro({
        follow: 0,
        search: this.searchTrack,
        limit: 500,
      });
      this.loadTrack = false;
      this.trackOther = result.data;
      this.trackOther.length > 0
        ? (this.isSearchResult = true)
        : (this.isSearchResult = false);
    },
    async unSel() {
      const result = await trackCount();
      this.unSelected = result.notFollow;
      result.notFollow <= 0 && (this.addTrack = false);
    },
    //添加自选
    async addTrackEv(_is_free, _type, _id) {
      if (_is_free == 0 && this.app.account.is_information == 2) {
        this.$refs.needvip.needVIP = true;
        return;
      }
      const result = await addTrack({
        id: _id,
        follow: _type,
      });
      if (result.code !== 2000) {
        this.$notify({
          type: "danger",
          message: result.data.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        // 添加自选成功 & 移除自选成功
        message:
          _type == 1
            ? this.$t("notify.add_track")
            : this.$t("notify.move_track"),
      });
      this.getOtherTrack();
      this.getMineTrackCenter();
      this.unSel();
      this.$emit("upPosalList", null);
    },
    sendEmit(_id, _index) {
      if (this.isHasTurn && this.chooseTrack == _index) {
        this.isHasTurn = false;
        this.chooseTrack = 9999;
        this.$emit("upPosalList", null);
      } else {
        this.isHasTurn = true;
        this.chooseTrack = _index;
        this.$emit("upPosalList", _id);
      }
    },
  },
  beforeDestroy() {
    !this.$flag && window.removeEventListener("scroll", this.initHeight, true);
  },
};
</script>

<style lang="scss" scoped>
.active-pro {
  background: $info !important;
}
.fixed-box {
  position: fixed;
  right: 38px;
  top: 152px;
  width: 19.2% !important;
}
@media screen and (max-width: 1400px) {
  .fixed-box {
    width: 20.2% !important;
  }
}
.my-optional {
  width: 100%;
  background: $contentBg;
  border-radius: 4px;
  padding-bottom: 24px;
  .optional-title {
    display: flex;
    justify-content: space-between;
    padding: 24px;
    .iconfont {
      font-size: 20px;
      margin-right: 8px;
    }
    p {
      display: flex;
      align-items: center;
    }
    p:first-child {
      color: white;
      font-size: 17px;
    }
    .cancel-choose {
      font-size: 13px;
      color: $remarkColor;
      cursor: pointer;
    }
  }
  .optional-line {
    width: 100%;
    height: 1px;
    background: $mineBg;
  }
  ul {
    height: 55.3vh;
    overflow-y: auto;
    padding: 16px 8px;
    li {
      padding: 8px 16px;
      transition: 0.3s all;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        height: 24px;
        display: flex;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
        }
      }
      p:first-child {
        span {
          font-size: 13px;
        }
        span:nth-child(2) {
          color: white;
          font-weight: bold;
          margin-left: 16px;
          margin-right: 8px;
        }
        span:last-child {
          font-size: 12px;
          color: $remarkColor;
          margin-top: 1px;
        }
      }
      p:last-child {
        font-size: 12px;
        cursor: pointer;
        color: $remarkColor;
        transition: 0.3s all;
        .iconfont {
          font-size: 16px;
          color: #676c7a;
          margin-right: 4px;
          display: inline-block;
          transform: translateY(-1px);
          transition: 0.3s all;
        }
      }
      .no-data {
        width: 100%;
        text-align: center;
        font-size: 16px !important;
        justify-content: center;
      }
    }
    li:hover {
      background: $conBg2;
      p:last-child {
        color: $iconColor;
        .iconfont {
          color: $iconColor;
        }
      }
    }
  }
  @media screen and (min-width: 2000px) {
    ul {
      height: 69.8vh !important;
    }
  }
  .optional-oper {
    padding: 24px;
    padding-bottom: 0;
    button {
      width: 100%;
      background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
    }
  }
}
.add-track {
  padding: 24px 24px 32px 24px;
  /deep/ .el-loading-spinner .path {
    stroke: $contentBg;
  }
  .add-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    p {
      .iconfont {
        font-size: 20px;
        color: $titleColor;
        margin-right: 8px;
        font-weight: 400;
        display: inline-block;
        transform: translateY(1px);
      }
      font-size: 17px;
      font-weight: bold;
      color: $titleColor;
    }
    .search-add {
      width: 160px;
      height: 28px;
      position: relative;
      .iconfont {
        font-size: 16px;
        position: absolute;
        top: 2px;
        left: 12px;
        color: $remarkColor;
      }
      input {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-size: 12px;
        border-radius: 18px;
        background: white;
        border: 1px solid $textColor;
        color: $titleColor;
        padding-left: 34px;
      }
    }
  }
  .add-lsit {
    width: 101%;
    min-height: 300px;
    ul {
      display: flex;
      flex-wrap: wrap;
      max-height: 400px;
      overflow-y: auto;
      li {
        width: 340px;
        margin-right: 16px;
        height: 74px;
        padding: 24px;
        background: #f3f4fa;
        margin-bottom: 16px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .add-pro-msg {
          display: flex;
          height: 40px;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 16px;
            background: white;
          }
          .pro-msg-title {
            display: flex;
            flex-direction: column;
            p {
              color: #676c7a;
            }
            p:first-child {
              font-size: 13px;
              font-weight: bold;
            }
            p:last-child {
              font-size: 12px;
              display: flex;
              .is-vip {
                background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
                font-weight: bold;
                color: $titleColor;
                margin-right: 8px;
              }
              span {
                display: inline-block;
                height: 20px;
                line-height: 20px;
                padding: 0 8px;
                color: #00cc8f;
                border-radius: 4px;
                background: rgba(0, 204, 143, 0.1);
                margin-right: 4px;
              }
            }
          }
        }
        .pro-oper {
          p {
            width: 24px;
            height: 24px;
            background: $textColor;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .iconfont {
              font-size: 20px;
              color: #676c7a;
            }
          }
        }
      }
      li:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
  .close-btn {
    width: 100%;
    margin-top: 24px;
    text-align: center;
  }
}
</style>