// 项目信息
<template>
  <div class="project-bureau">
    <!-- 左侧项目信息 -->
    <div class="pro-left">
      <!-- 最新项目 -->
      <div class="new-project">
        <p class="pro-title">
          <img :src="require('@/assets/images/bureau/icon_5.png')" alt="" />
          <!-- 最新项目 -->
          {{ $t("bureau_mine.last_pro") }}
          <span class="pro-count">6</span>
        </p>
        <div v-loading="loadNew">
          <ul>
            <li
              v-for="(i, indexNew) in newList"
              :key="indexNew"
              @click="goDetails(i.free, i.id)"
            >
              <div class="logo-and-title">
                <p class="logo-box">
                  <img :src="i.logo" alt="" />
                </p>
                <div>
                  <p>{{ i.title }} ({{ i.symbol }})</p>
                  <p>
                    <span
                      v-if="app.account.is_information == 2 && i.free == 0"
                      class="is-vip"
                    >
                      VIP
                    </span>
                    <span
                      v-for="(race, indexRace) in i.race"
                      :key="indexRace"
                      >{{ race.name }}</span
                    >
                  </p>
                </div>
                <!-- New 标识 -->
                <p class="new-label" v-if="i.is_new == 1">New</p>
              </div>
              <div
                class="add-track"
                @click.stop="addTrackEv(i.free, 1, i.id)"
                v-if="i.follow == 0"
              >
                <p class="iconfont icon-jia_plus"></p>
              </div>
              <div class="add-track" @click.stop="followOper(i.id)" v-else>
                <p class="iconfont icon-jian_minus"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 热门项目 -->
      <div class="hot-project">
        <p class="pro-title">
          <img :src="require('@/assets/images/bureau/icon_6.png')" alt="" />
          <!-- 近期热门项目 -->
          {{ $t("bureau_mine.hot_pro") }}
          <span class="pro-count">{{ hotTotal }}</span>
        </p>
        <div class="hot-inner" v-loading="loadHot">
          <p class="hot-line"></p>
          <div class="hot-pro-inner">
            <ul>
              <li
                v-for="(i, indexHot) in hotList"
                :key="indexHot + 'l'"
                @click="goDetails(i.free, i.id)"
              >
                <div class="logo-and-name">
                  <img :src="i.logo" alt="" />
                  <span>{{ i.title }}</span>
                  <span>{{ i.symbol }}</span>
                  <span
                    v-if="app.account.is_information == 2 && i.free == 0"
                    class="is-vip"
                  >
                    VIP
                  </span>
                </div>
                <div
                  class="oper-hot"
                  @click.stop="addTrackEv(i.free, 1, i.id)"
                  v-if="i.follow == 0"
                >
                  <i class="iconfont icon-tianjia_add"></i>
                  <!-- 自选 -->
                  {{ $t("bureau_mine.my_track") }}
                </div>
                <div
                  class="oper-hot has-turn"
                  @mouseover="i.follow_text = $t('bureau_mine.move')"
                  @mouseleave="i.follow_text = $t('bureau_mine.has_add')"
                  @click.stop="followOper(i.id)"
                  v-else
                >
                  <i class="iconfont icon-jianshao_reduce"></i>
                  {{ i.follow_text }}
                </div>
              </li>
            </ul>
            <ul>
              <li
                v-for="(i, indexHot2) in hotList2"
                :key="indexHot2 + 'r'"
                @click="goDetails(i.free, i.id)"
              >
                <div class="logo-and-name">
                  <img :src="i.logo" alt="" />
                  <span>{{ i.title }}</span>
                  <span>{{ i.symbol }}</span>
                  <span
                    v-if="app.account.is_information == 2 && i.free == 0"
                    class="is-vip"
                  >
                    VIP
                  </span>
                </div>
                <div
                  class="oper-hot"
                  @click.stop="addTrackEv(i.free, 1, i.id)"
                  v-if="i.follow == 0"
                >
                  <i class="iconfont icon-tianjia_add"></i>
                  <!-- 自选 -->
                  {{ $t("bureau_mine.my_track") }}
                </div>
                <div
                  class="oper-hot has-turn"
                  @mouseover="i.follow_text = $t('bureau_mine.move')"
                  @mouseleave="i.follow_text = $t('bureau_mine.has_add')"
                  @click.stop="followOper(i.id)"
                  v-else
                >
                  <i class="iconfont icon-jianshao_reduce"></i>
                  {{ i.follow_text }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 我的自选项目信息 -->
    <div class="pro-right" v-loading="loadMine">
      <p class="right-title">
        <i class="iconfont icon-dingyue_rss"></i>
        <!-- 我的自选 -->
        {{ $t("bureau_mine.own_track") }}
      </p>
      <ul v-if="isHasMine">
        <li v-for="(i, indexMine) in mineList" :key="indexMine">
          <div class="name-box">
            <img :src="i.logo" alt="" />
            {{ i.title }}<span>{{ i.symbol }}</span>
          </div>
          <div
            class="remove-pro"
            @click="
              $store.dispatch('setPoint', 20);
              followOper(i.id);
            "
          >
            <i class="iconfont icon-jianshao_reduce"></i>
            <!-- 移除 -->
            {{ $t("bureau_mine.move") }}
          </div>
        </li>
      </ul>
      <p v-else class="no-data" style="flex: 1">
        <!-- 暂无自选 -->
        {{ $t("no_data.no_track") }}
      </p>
      <p
        class="push-track"
        @click="
          $store.dispatch('setPoint', 19);
          addTrack = true;
          getOtherTrack();
        "
        v-if="unSelected > 0"
      >
        <base-button type="info" round>
          <i class="iconfont icon-tianjia_add"></i>
          <!-- 添加自选 -->
          {{ $t("bureau_mine.add_track") }}
        </base-button>
      </p>
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
                    <span
                      v-for="(race, indexxRace2) in i.race"
                      :key="indexxRace2"
                      >{{ race.name }}</span
                    >
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
import { proMineBureau, trackPro, addTrack, trackCount } from "@/request/api";
import { Modal } from "@/components";
import { mapState } from "vuex";
export default {
  data() {
    return {
      newList: [], //最新项目
      hotList: [], //最热项目
      hotList2: [],
      hotTotal: 0, //最热数量
      loadNew: false, //loading
      loadHot: false, //loading
      loadMine: false, //loading
      mineList: [], //我的自选
      addTrack: false, //添加自选
      trackOther: [],
      unSelected: 0,
      searchTrack: null,
      isHasMine: true,
      loadTrack: false,
      isSearchResult: true, //我的自选 -》 是否有搜索结果
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  components: {
    Modal,
    NeedVIP: (resolve) => require(["./need_vip"], resolve),
  },
  created() {
    this.getData();
    this.getMineTrack();
    this.unSel();
    if (this.app.account.is_follow == 0 && !this.$flag) {
      this.getOtherTrack();
      // this.addTrack = true;
      localStorage.setItem("openSearchBox", true);
    }
  },
  watch: {
    searchTrack() {
      this.getOtherTrack();
    },
  },
  methods: {
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
    //获取未选状态
    async unSel() {
      const result = await trackCount();
      this.unSelected = result.notFollow;
      result.notFollow <= 0 && (this.addTrack = false);
    },
    //最新项目
    async getData() {
      //   最新项目
      this.loadNew = true;
      const newData = await proMineBureau({ type: 2, limit: 6 });
      this.newList = newData;
      this.loadNew = false;
      //   热门项目
      this.loadHot = true;
      const hotData = await proMineBureau({
        type: 1,
        is_mobile: this.$flag ? 1 : 2,
      });
      if (this.$flag) {
        this.hotList = hotData;
        this.hotTotal = hotData.length;
        this.hotList.forEach((e) => {
          // 已选
          this.$set(e, "follow_text", this.$t("bureau_mine.has_add"));
        });
        this.loadHot = false;
        return;
      }
      this.hotList = hotData[0];
      this.hotList.forEach((e) => {
        this.$set(e, "follow_text", this.$t("bureau_mine.has_add"));
      });

      this.hotList2 = hotData[1];
      this.hotList2.forEach((e) => {
        this.$set(e, "follow_text", this.$t("bureau_mine.has_add"));
      });
      this.hotTotal = this.hotList.length + this.hotList2.length;
      this.loadHot = false;
    },
    //我的自选
    async getMineTrack() {
      this.loadMine = true;
      const mineData = await trackPro({ limit: 500, follow: 1 });
      this.mineList = mineData.data;
      mineData.data.length > 0
        ? (this.isHasMine = true)
        : (this.isHasMine = false);
      this.loadMine = false;
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
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        //移除自选成功
        message: this.$t("notify.move_track"),
      });
      this.getMineTrack();
      this.unSel();
      this.$emit("upLoadData", true);
      this.getData();
      this.$store.dispatch("upAccount");
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
      this.getMineTrack();
      this.unSel();
      this.$emit("upLoadData", true);
      this.getData();
      this.$store.dispatch("upAccount");
    },
    //项目详情
    goDetails(_is_free, _id) {
      if (this.app.account.is_information != 1) {
        return;
      }
      this.$store.commit("upTrackID", _id);
      this.$router.push("/bureau-track/track-details");
    },
    reload() {
      this.getData();
      this.getMineTrack();
      this.unSel();
    },
  },
};
</script>

<style lang="scss" scoped>
.project-bureau {
  height: 640px;
  margin-top: 40px;
  display: flex;
  width: 100%;
  .pro-left {
    flex: 1;
    .pro-title {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
      font-size: 17px;
      color: white;
      .pro-count {
        padding: 2px 4px;
        font-size: 13px;
        font-weight: bold;
        background: rgba(255, 212, 92, 0.1);
        color: #ffd45c;
        margin-left: 4px;
        border-radius: 4px;
      }
    }
    .new-project {
      margin-bottom: 24px;
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        min-height: 208px;
        li {
          width: calc(34% - 30px);
          cursor: pointer;
          max-height: 89px;
          padding: 24px;
          background: $contentBg;
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          border-radius: 4px;
          overflow: hidden;
          align-items: center;
          position: relative;
          .logo-and-title {
            display: flex;
            .logo-box {
              width: 40px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 2px;
              background: $mineBg;
              border-radius: 50%;
              img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
                background: white;
              }
            }
            div {
              margin-left: 16px;
              padding-top: 4px;
              p:first-child {
                color: white;
                font-weight: bold;
                font-size: 13px;
              }
              p:last-child {
                display: inline-block;
                margin-top: 8px;
                .is-vip {
                  background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
                  font-weight: bold;
                  color: $titleColor;
                  margin-right: 8px;
                }
                span {
                  padding: 0 8px;
                  border-radius: 4px;
                  background: rgba(167, 240, 186, 0.1);
                  color: $success;
                  margin-right: 8px;
                  margin-bottom: 4px;
                }
                font-size: 12px;
              }
            }
          }
          .new-label {
            position: absolute;
            height: 16px;
            width: 100px;
            font-size: 12px;
            color: white;
            background: linear-gradient(45deg, #00bad6 0%, #2de0bd 100%);
            line-height: 16px;
            text-align: center;
            transform: rotate(-45deg);
            left: -32px;
            top: 8px;
          }
          .add-track {
            width: 24px;
            height: 24px;
            padding: 0;
            background: $conBg2;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border-radius: 4px;
            .iconfont {
              font-size: 20px;
              color: white;
            }
          }
        }
        @media screen and (max-width: 1600px) {
          li {
            width: calc(50% - 30px);
          }
        }
      }
    }
    .hot-project {
      .hot-inner {
        padding: 24px;
        background: $contentBg;
        border-radius: 4px;
        height: 328px;
        position: relative;
        .hot-line {
          width: 1px;
          background: $mineBg;
          position: absolute;
          left: 50%;
          height: calc(100% - 48px);
          top: 24px;
        }
        .hot-pro-inner {
          height: 100%;
          overflow-y: auto;
          display: flex;
          ul {
            width: calc(50% - 1px);
            padding-right: 24px;
            li {
              padding: 11px 16px;
              border-bottom: 1px solid $lineTwoColor;
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              .logo-and-name {
                display: flex;
                align-items: center;
                img {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  margin-right: 16px;
                  background: white;
                }
                span:nth-child(2) {
                  font-size: 14px;
                  font-weight: bold;
                  color: white;
                  margin-right: 8px;
                }
                span:nth-child(3) {
                  font-size: 12px;
                  color: $remarkColor;
                }
                .is-vip {
                  background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
                  font-weight: bold;
                  color: $titleColor;
                  margin-left: 8px;
                  border-radius: 4px;
                  display: inline-block;
                  height: 17px;
                  line-height: 17px;
                  padding: 0 8px;
                  font-size: 12px;
                }
              }
              .oper-hot {
                display: flex;
                cursor: pointer;
                height: 18px;
                align-items: center;
                // background: rgba(0,0,0,.5);
                .iconfont {
                  font-size: 16px;
                  margin-right: 4px;
                }
                font-size: 12px;
                color: white;
              }
              .has-turn {
                color: $remarkColor;
              }
            }
          }
          ul:last-child {
            padding-right: 0;
            padding-left: 24px;
          }
        }
      }
    }
  }
  .pro-right {
    max-height: 744px;
    width: 375px;
    margin-left: 30px;
    background: $contentBg;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    .right-title {
      width: 100%;
      height: 70px;
      padding: 24px;
      border-bottom: 1px solid $mineBg;
    }
    ul {
      flex: 1;
      overflow-y: auto;
      width: 100%;
      margin: 16px 0;
      padding: 0 16px 0 8px;
      li {
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        padding-left: 24px;
        padding-right: 16px;
        transition: 0.3s all;
        border-radius: 4px;
        cursor: pointer;
        .name-box {
          display: flex;
          align-items: center;
          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 16px;
            background: white;
          }
          font-size: 13px;
          font-weight: bold;
          color: white;
          span {
            color: $remarkColor;
            margin-left: 8px;
            font-weight: 400;
          }
        }
        .remove-pro {
          display: flex;
          align-items: center;
          color: $remarkColor;
          font-size: 12px;
          cursor: pointer;
          .iconfont {
            margin-right: 4px;
          }
        }
      }
      li:hover {
        background: $conBg2;
        .remove-pro {
          color: $iconColor;
        }
      }
    }
    .push-track {
      border-top: 1px solid $mineBg;
      width: 100%;
      height: 88px;
      display: flex;
      justify-content: center;
      align-items: center;
      button {
        width: 80%;
        background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
      }
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
@media screen and (max-width: 1600px) {
  .project-bureau {
    height: auto;
  }
}
@media screen and (max-width: 1279px) {
  .project-bureau {
    height: auto;
    .pro-left {
      width: 100%;
      .new-project {
        ul {
          flex-direction: column;
          li {
            width: 100%;
            padding: 1rem;
          }
        }
      }
      .hot-project {
        .hot-inner {
          padding: 1rem;
          .hot-line {
            display: none;
          }
          .hot-pro-inner {
            ul {
              width: 100%;
              padding-right: 0;
              li:last-child {
                border: 0;
              }
            }
            ul:last-child {
              display: none;
            }
          }
        }
      }
    }
    .pro-right {
      display: none;
    }
  }
}
</style>