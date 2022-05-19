<template>
  <div>
    <div class="track-tent" @click="goDetails">
      <div class="track-icon">
        <p class="track-logo">
          <img :src="data.logo" alt="" />
        </p>
        <!-- v-if="data.unread > 0" -->
        <p class="message-num" v-if="data.unread > 0">
          <span class="iconfont icon-tixing_remind"></span>
          <span class="message-count">{{
            data.unread > 99 ? "99+" : data.unread
          }}</span>
        </p>
      </div>
      <p class="track-name">{{ data.title }}({{ data.symbol }})</p>
      <p class="track-race">
        <span
          v-if="app.account.is_information == 2 && data.free == 0"
          class="is-vip"
        >
          VIP
        </span>
        <span v-for="(t, i) in data.race" :key="i">
          {{ t.name }}
        </span>
      </p>
      <div class="num-box-parant">
        <div class="num-box">
          <p>{{ data.info_num }}</p>
          <p :class="app.language == 'en' && 'num-box-en'">
            <!-- 情报数 -->
            {{ $t("bureau_track.intell_num") }}
          </p>
        </div>
        <p class="num-label"></p>
        <div class="num-box">
          <p>{{ data.future_num }}</p>
          <p :class="app.language == 'en' && 'num-box-en'">
            <!-- 未来事件数 -->
            {{ $t("bureau_track.future_num") }}
          </p>
        </div>
        <p class="num-label"></p>
        <div class="num-box">
          <p>{{ data.follow_num }}</p>
          <p :class="app.language == 'en' && 'num-box-en'">
            <!-- 跟踪人数 -->
            {{ $t("bureau_track.follow_num") }}
          </p>
        </div>
      </div>
      <div class="source-box">
        <p>
          <!-- 信息源 -->
          {{ $t("bureau_track.source") }}
        </p>
        <p>
          <el-popover
            placement="top"
            trigger="hover"
            v-for="source in sourceList"
            :key="source.icon"
            :content="source.tips"
          >
            <span
              class="iconfont"
              slot="reference"
              :class="source.icon"
              :style="{ color: source.color }"
              v-if="source.is_show == 1"
            ></span>
          </el-popover>
        </p>
      </div>
      <p class="oper-box with-all" v-if="data.pid == 0">
        <base-button
          type="default"
          round
          v-if="data.follow == 1"
          @click.stop="followOper(0, data.id)"
        >
          <i class="iconfont icon-jianshao_reduce"></i>
          <!-- 移除自选 -->
          {{ $t("bureau_track.move_track") }}
        </base-button>
        <base-button
          type="info"
          round
          v-else
          @click.stop="followOper(1, data.id)"
        >
          <i class="iconfont icon-tianjia_add"></i>

          <!-- 添加自选 -->
          {{ $t("bureau_mine.add_track") }}
        </base-button>
      </p>
      <p class="oper-box with-half" v-else>
        <base-button
          type="default"
          round
          @click.stop="goPDF($flag ? data.mobile_pdf : data.pdf)"
        >
          <i class="iconfont icon-shuqian_bookmark-one"></i>
          <!-- 研报 -->
          {{ $t("bureau_track.report") }}
        </base-button>
        <span class="label"></span>
        <base-button
          type="info"
          round
          v-if="data.follow == 0"
          @click.stop="followOper(1, data.id)"
        >
          <i class="iconfont icon-tianjia_add"></i>
          <!-- 添加 -->
          {{ $t("bureau_track.push") }}
        </base-button>
        <base-button
          type="default"
          round
          v-else
          @click.stop="followOper(0, data.id)"
        >
          <i class="iconfont icon-jianshao_reduce"></i>
          <!-- 移除 -->
          {{ $t("bureau_mine.move") }}
        </base-button>
      </p>
    </div>
    <!-- 会员专享 -->
    <NeedVIP ref="needvip" />
  </div>
</template>

<script>
import { addTrack } from "@/request/api";
import { mapState } from "vuex";
export default {
  name: "TrackList",
  props: ["data"],
  data() {
    return {
      sourceList: [
        {
          icon: " icon-qingbaoju_tuite",
          color: "#1D9BF0",
          tips: "Twitter",
        },
        // {
        //   icon: " icon-lianwen",
        //   color: "#0257FE",
        //   tips: "链闻",
        // },
        {
          icon: " icon-qingbaoju_discord",
          color: "#5865F2",
          tips: "Discord",
        },
        {
          icon: " icon-medium",
          color: "#FFFFFF",
          tips: "Medium",
        },
        {
          icon: " icon-luntan_topic",
          color: "#A2A5B0",
          //论坛
          tips: this.$t("bureau_express.forum"),
        },
        {
          icon: " icon-shengyin-da_volume-notice",
          color: "#A2A5B0",
          //公告
          tips: this.$t("bureau_track.ann"),
        },
        {
          icon: " icon-pinglun_comments",
          color: "#A2A5B0",
          //全网提案
          tips: this.$t("routes.network_pro"),
        },
      ],
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  mounted() {
    this.$set(this.sourceList[0], "is_show", this.data.is_show.twitter);
    // this.$set(this.sourceList[1], "is_show", this.data.is_show.news);
    this.$set(this.sourceList[1], "is_show", this.data.is_show.discord);
    this.$set(this.sourceList[2], "is_show", this.data.is_show.medium);
    this.$set(this.sourceList[3], "is_show", this.data.is_show.forum);
    this.$set(this.sourceList[4], "is_show", this.data.is_show.announcement);
    this.$set(this.sourceList[5], "is_show", this.data.is_show.proposal);
  },
  components: {
    NeedVIP: (resolve) => require(["./mine_bureau/need_vip"], resolve),
  },
  methods: {
    //查看PDF
    goPDF(_url) {
      this.$store.dispatch("setPoint", 46);
      if (this.app.account.is_information != 1) {
        this.$notify({
          //情报局包年会员专享
          message: this.$t("public.need_bureau_vip"),
          type: "danger",
        });
        return;
      }
      // this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      // const is_old = !is_new_pdf ? 1 : is_new_pdf == 1 ? 0 : 1;
      !this.$flag
        ? this.$store.dispatch("viewPDF", _url)
        : this.$cell
        ? this.$store.dispatch("viewPDF", _url)
        : window.viewPDF(_url);
    },
    //内页
    goDetails() {
      if (this.app.account.is_information != 1) {
        return;
      }
      this.$store.commit("upTrackID", this.data.id);
      this.$router.push("/bureau-track/track-details");
    },
    //自选
    async followOper(_is_follow, _id) {
      this.$store.dispatch("setPoint", _is_follow == 1 ? 48 : 47);
      if (this.data.free == 0 && this.app.account.is_information == 2) {
        this.$refs.needvip.needVIP = true;
        return;
      }
      const result = await addTrack({
        id: _id,
        follow: _is_follow,
      });
      if (result.code !== 2000) {
        this.$notify({
          type: "danger",
          message: result.data.msg,
        });
        return;
      };
      this.$notify({
        type: "success",
        // 添加自选成功 & 移除自选成功
        message:
          _is_follow == 1
            ? this.$t("notify.add_track")
            : this.$t("notify.move_track"),
      });
      this.$emit("upTrackList", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.track-tent {
  cursor: pointer;
  background: $contentBg;
  min-height: 345px;
  margin-bottom: 24px;
  border-radius: 4px;
  padding: 24px;
  overflow: hidden;
  .track-icon {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: space-between;
    .track-logo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      padding: 2px;
      background: white;
      img {
        width: 100%;
        border-radius: 50%;
        height: 100%;
      }
    }
    .message-num {
      width: 40px;
      height: 40px;
      background: $conBg2;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      .iconfont {
        font-size: 20px;
      }
      .message-count {
        position: absolute;
        display: inline-block;
        text-align: center;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        background: $danger;
        color: white;
        font-size: 12px;
        border-radius: 10px;
        line-height: 16px;
        top: -8px;
        right: -8px;
      }
    }
  }
  .track-name {
    margin-top: 24px;
    font-size: 17px;
    font-weight: bold;
    color: white;
    margin-bottom: 8px;
  }
  .track-race {
    display: flex;
    flex-wrap: wrap;
    .is-vip {
      background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
      font-weight: bold;
      color: $titleColor;
      margin-right: 8px;
    }
    span {
      padding: 0 4px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      background: rgba(167, 240, 186, 0.1);
      color: $success;
      margin-right: 8px;
      border-radius: 4px;
    }
  }
  .num-box-parant {
    display: flex;
    height: 80px;
    width: 110%;
    margin-left: -5%;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    .num-label {
      width: 1px;
      height: 40px;
      background: $mineBg;
    }
    .num-box {
      width: 30%;
      display: flex;
      flex-direction: column;
      align-items: center;
      p:first-child {
        margin-bottom: 8px;
        font-size: 17px;
        color: white;
      }
      p:last-child {
        margin-top: 8px;
        font-size: 13;
        color: $remarkColor;
        text-align: center;
      }
      .num-box-en {
        padding: 0 16px;
        line-height: 18px;
      }
    }
    .num-box:last-child {
      .num-box-en {
        line-height: 34px;
      }
    }
  }
  .source-box {
    display: flex;
    margin-top: 8px;
    height: 24px;
    border-radius: 12px;
    justify-content: space-between;
    padding: 0 16px;
    background: linear-gradient(90deg, #111a3b 0%, #1b2447 100%);
    align-items: center;
    p:first-child {
      font-size: 12px;
      color: $remarkColor;
    }
    .iconfont {
      font-size: 16px;
      margin-left: 8px;
    }
    .icon-pinglun_comments {
      display: inline-block;
      transform: translateY(1px);
    }
  }
  .oper-box {
    margin-top: 24px;
    .btn-info {
      background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
    }
    button {
      .iconfont {
        font-weight: 400;
        font-size: 20px;
      }
    }
  }
  .with-all {
    button {
      width: 100%;
    }
  }
  .with-half {
    display: flex;
    .label {
      display: inline-block;
      width: 24px;
    }
    button {
      flex: 1;
    }
  }
}
@media screen and (max-width: 1279px) {
  .col-sm-6 {
    margin-right: 0;
  }
}
</style>