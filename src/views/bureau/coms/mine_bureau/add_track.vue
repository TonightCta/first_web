// 添加自选
<template>
  <div class="add-track-coms">
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
              searchTrack = null;
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
import { Modal } from "@/components";
import { trackPro, addTrack } from "@/request/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      addTrack: false,
      loadTrack: false,
      searchTrack: null,
      trackOther: [],
      isSearchResult: true, //我的自选 -》 是否有搜索结果
    };
  },
  components: {
    Modal,
    NeedVIP: (resolve) => require(["./need_vip"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {
    searchTrack() {
      this.getOtherTrack();
    },
  },
  methods: {
    initTrack() {
      this.getOtherTrack();
      this.addTrack = true;
    },
    //获取未自选
    async getOtherTrack() {
      this.loadTrack = true;
      const result = await trackPro({
        search: this.searchTrack,
        follow: 0,
        limit: 500,
      });
      this.loadTrack = false;
      this.trackOther = result.data;
      this.trackOther.length > 0
        ? (this.isSearchResult = true)
        : (this.isSearchResult = false);
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
      this.$emit("upLoadMine", true);
      this.$store.dispatch("upAccount");
    },
  },
};
</script>

<style lang="scss" scoped>
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
    /deep/ .el-loading-spinner .path {
      stroke: $contentBg;
    }
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