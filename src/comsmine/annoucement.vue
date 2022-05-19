// 公告
<template>
  <div>
    <modal :show.sync="annBox" modalClasses="ann-box-modal">
      <div class="announcement">
        <div class="ann-title">
          <p
            class="iconfont icon-zuo_left"
            @click="annIndex != 0 ? annIndex-- : (annIndex = 0)"
            v-if="$flag && annList.length > 0"
          ></p>
          <p class="title-ont" v-if="annList.length > 0">
            {{ annList[annIndex].title }}
          </p>
          <p
            class="iconfont icon-you_right"
            v-if="$flag && annList.length > 0"
            @click="
              annIndex != annList.length - 1
                ? annIndex++
                : (annIndex = annList.length - 1)
            "
          ></p>
        </div>
        <div class="ann-content">
          <div
            class="ann-text"
            v-if="annList.length > 0"
            v-html="annList[annIndex].content"
          ></div>
        </div>
        <p>
          <i v-if="annList.length > 1 && !$flag">
            <base-button
              type="defalut"
              v-if="annIndex != 0"
              round
              @click="annIndex != 0 ? annIndex-- : (annIndex = 0)"
            >
              <!-- 上一条 -->
              {{ $t("ann_box.before") }}
            </base-button>
            <base-button
              style="margin-left: 16px"
              type="defalut"
              v-if="annIndex != annList.length - 1"
              @click="
                annIndex != annList.length - 1
                  ? annIndex++
                  : (annIndex = annList.length - 1)
              "
              round
            >
              <!-- 下一条 -->
              {{ $t("ann_box.next") }}
            </base-button>
          </i>
          <span v-if="!$flag"></span>
          <!-- readAnn(); -->
          <base-button
            type="info"
            round
            @click="
              annBox = false;
              annBoxEasy = false;
              readAnn();
            "
          >
            <!-- 我知道了 -->
            {{ $t("ann_box.know") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- GoEasy -->
    <modal :show.sync="annBoxEasy" modalClasses="ann-box-modal">
      <div class="announcement">
        <div class="ann-title">
          <p
            class="iconfont icon-zuo_left"
            @click="annIndex != 0 ? annIndex-- : (annIndex = 0)"
            v-if="$flag && annListEasy.length > 0"
          ></p>
          <p class="title-ont" v-if="annListEasy.length > 0">
            {{
              app.language == "en"
                ? annListEasy[annIndex].title_en
                : annListEasy[annIndex].title
            }}
          </p>
          <p
            class="iconfont icon-you_right"
            v-if="$flag && annListEasy.length > 0"
            @click="
              annIndex != annListEasy.length - 1
                ? annIndex++
                : (annIndex = annListEasy.length - 1)
            "
          ></p>
        </div>
        <div class="ann-content">
          <div
            class="ann-text"
            v-if="annListEasy.length > 0"
            v-html="
              app.language == 'en'
                ? annListEasy[annIndex].content_en
                : annListEasy[annIndex].content
            "
          ></div>
        </div>
        <p>
          <i v-if="annListEasy.length > 1 && !$flag">
            <base-button
              type="defalut"
              v-if="annIndex != 0"
              round
              @click="annIndex != 0 ? annIndex-- : (annIndex = 0)"
            >
              <!-- 上一条 -->
              {{ $t("ann_box.before") }}
            </base-button>
            <base-button
              style="margin-left: 16px"
              type="defalut"
              v-if="annIndex != annListEasy.length - 1"
              @click="
                annIndex != annListEasy.length - 1
                  ? annIndex++
                  : (annIndex = annListEasy.length - 1)
              "
              round
            >
              <!-- 下一条 -->
              {{ $t("ann_box.next") }}
            </base-button>
          </i>
          <span v-if="!$flag"></span>
          <!-- readAnn(); -->
          <base-button
            type="info"
            round
            @click="
              annBox = false;
              annBoxEasy = false;
              readAnn();
            "
          >
            <!-- 我知道了 -->
            {{ $t("ann_box.know") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { Announcement, readAnn } from "@/request/api";
import { mapState } from "vuex";
import GoEasy from "goeasy";
export default {
  data() {
    return {
      isHasann: false,
      annList: [],
      annIndex: 0,
      annBox: false,
      annBoxEasy: false,
      annListEasy: [],
    };
  },
  components: { Modal },
  mounted() {
    window.getAnn = this.getAnn;
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {
    annBox(val) {
      !val && localStorage.removeItem("openSearchBox");
    },
  },
  created() {
    this.getAnn();
    this.initAnnGoeasy();
  },
  methods: {
    //获取公告
    async getAnn() {
      const result = await Announcement();
      this.annList = [];
      if (result.length <= 0) {
        return;
      }
      result.forEach((e) => {
        if (e.type == 0) {
          this.annList.unshift(e);
        }
        if (this.app.isBureau == 0 && e.type == 1) {
          this.annList.unshift(e);
        }
        if (this.app.isBureau == 1 && e.type == 2) {
          this.annList.unshift(e);
        }
      });

      this.annList.length > 0 && (this.annBox = true);
      // this.annList = result;
      // this.annBox = true;
      localStorage.setItem("openSearchBox", true);
    },
    //最新推送
    initAnnGoeasy(_obj) {
      let goeasy = GoEasy.getInstance({
        host: "hangzhou.goeasy.io",
        appkey: "BC-2a7907b7a2a84350aca0f9669c114272",
      });
      goeasy.connect({
        onSuccess: () => {
          // console.log("连接成功");
        },
      });
      goeasy.subscribe({
        channel: process.env.VUE_APP_APPCHANNEL,
        onMessage: async (message) => {
          let obj = JSON.parse(message.content);
          if (this.app.language == "en") {
            if (obj.announcement_type == 0 && obj.title_en != '') {
              this.annListEasy.unshift(obj);
            }
            if (this.app.isBureau == 0 && obj.announcement_type == 1 && obj.title_en != '') {
              this.annListEasy.unshift(obj);
            }
            if (this.app.isBureau == 1 && obj.announcement_type == 2 && obj.title_en != '') {
              this.annListEasy.unshift(obj);
            }
          } else {
            if (obj.announcement_type == 0 && obj.title != '') {
              this.annListEasy.unshift(obj);
            }
            if (this.app.isBureau == 0 && obj.announcement_type == 1 && obj.title != '') {
              this.annListEasy.unshift(obj);
            }
            if (this.app.isBureau == 1 && obj.announcement_type == 2 && obj.title != '') {
              this.annListEasy.unshift(obj);
            }
          }
          this.annListEasy.length > 0 && (this.annBoxEasy = true);
          localStorage.setItem("openSearchBox", true);
        },
        onSuccess: () => {
          // console.log("成功");
        },
        onFailed: (failed) => {
          // console.log(failed);
          // console.log("失败");
        },
      });
    },
    //已读公告
    async readAnn() {
      if (this.app.token) {
        this.annList.forEach((e) => {
          readAnn({ id: e.id });
        });
        this.annListEasy.forEach((e) => {
          readAnn({ id: e.id });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.announcement {
  width: 100%;
  .ann-title {
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    align-items: center;
    color: $titleColor;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    .title-ont {
      flex: 1;
      text-align: center;
    }
    .iconfont {
      font-size: $padd24;
      color: #49537a;
      font-weight: 400;
    }
  }
  .ann-content {
    display: flex;
    align-items: center;
    min-height: 140px;
    .ann-text {
      flex: 1;
      padding: 0 16px;
      text-align: left;
      justify-content: flex-start;
      max-height: 500px;
      overflow-y: auto;
    }
    .iconfont {
      font-size: 24px;
      color: #49537a;
      opacity: 0.5;
      cursor: pointer;
    }
  }
  p:last-child {
    display: flex;
    justify-content: center;
    span {
      display: inline-block;
      width: 16px;
    }
  }
  // .ann-inner {
  //   width: 74%;
  //   height: 100%;
  //   margin: 0 auto;
  //   display: flex;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  // }
  // .ann-content {
  //   display: flex;
  //   height: 100%;
  //   align-items: center;
  //   font-size: 14px;
  //   .iconfont {
  //     font-size: 24px;
  //     font-weight: normal;
  //     margin-right: 20px;
  //     color: white;
  //   }
  //   p:last-child {
  //     color: white;
  //   }
  // }
  // .ann-close {
  //   display: flex;
  //   align-items: center;
  //   button {
  //     padding: 3px 16px;
  //     font-size: 12px;
  //     background: rgba(15, 131, 254, 0.1) !important;
  //     margin-right: 16px;
  //   }
  //   button:hover {
  //     background: white !important;
  //     color: #0f83fe !important;
  //   }
  //   .iconfont {
  //     font-size: 28px;
  //     cursor: pointer;
  //     color: white;
  //   }
  // }
}
</style>