// 提案详情- 移动端
<template>
  <div class="posal-details">
    <MobileNav>
      <p>
        <!-- 提案内容 -->
        {{ $t("bureau_posal.posal_con") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div
        class="content-box"
        v-html="contentInfo"
        v-loading="loadContent"
        v-if="contentInfo"
      ></div>
      <div v-else>
        <p class="no-content">
          <!-- 该提案暂无内容 -->
          {{ $t("notify.posal_none") }}
        </p>
      </div>
      <!-- 投票信息 -->
      <!-- 单选投票 -->
      <div class="vote-box" v-if="isChoice == 1">
        <div class="vote-msg" v-for="(i, x) in votes" :key="x">
          <p class="vote-title">
            <span>{{ transStatus ? i.title_zh : i.title }}</span>
            <span>{{ i.result }}%</span>
          </p>
          <el-progress
            :percentage="Number(i.result)"
            color="#33B1FF"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
      <!-- 多选投票 -->
      <div class="more-choice" v-else>
        <div class="choice-inner" v-for="(vote, indexV) in votes" :key="indexV">
          <p class="choice-title">
            <span></span>
            <!-- 大众投票 & 委员会投票 -->
            {{
              vote.vote_type == 1
                ? $t("bureau_evs.vote_title_1")
                : $t("bureau_evs.vote_title_2")
            }}
          </p>
          <p class="no-vote" v-if="vote.data.length == 0">
            <!-- 无 -->
            {{ $t("bureau_evs.no_vote") }}
          </p>
          <div v-else>
            <div iv class="vote-msg" v-for="(i, x) in vote.data" :key="x">
              <p class="vote-title">
                <span>{{ languageStatus ? i.title_zh : i.title }}</span>
                <span>{{ i.result }}%</span>
              </p>
              <el-progress
                :percentage="Number(i.result)"
                color="#33B1FF"
                :show-text="false"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
      <div class="trans-box" v-if="isTrans == 1">
        <p>
          <!-- 翻译由DEEPL提供 -->
          {{ $t("bureau_evs.deep_remark") }}
        </p>
        <base-button
          type="info"
          class="other-info"
          round
          @click="transStatus = !transStatus"
        >
          <i class="iconfont icon-fanyi_translation"></i>
          {{ transStatus ? "English Version" : "翻译成中文" }}
        </base-button>
      </div>
    </div>
  </div>
</template>

<script>
import { infoContent, infoContentZh } from "@/request/api";
export default {
  data() {
    return {
      votes: [], //投票列表
      contentID: null, //提案ID
      contentInfo: null, //提案内容
      transStatus: false, //翻译状态
      loadContent: false, //提案加载load
      isChoice: false, //是否为多选投票
      isTrans: 0,
    };
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
  },
  watch: {
    transStatus(val) {
      val && this.getContentZH();
      !val && this.getContent();
    },
  },
  created() {
    this.votes = JSON.parse(this.$route.query.votes);
    this.contentID = this.$route.query.id;
    this.isChoice = this.$route.query.isChoice;
    this.isTrans = this.$route.query.isTrans;
    this.getContent();
  },
  methods: {
    async getContent() {
      this.loadContent = true;
      const result = await infoContent({ id: this.contentID });
      this.contentInfo = result.content;
      this.loadContent = false;
    },
    async getContentZH() {
      this.loadContent = true;
      const result = await infoContentZh({ id: this.contentID });
      this.contentInfo = result.content;
      this.loadContent = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.view-inner-mobile {
  padding: 4rem 1rem;
  min-height: 100px;
  height: auto;
  .no-content {
    text-align: center;
    font-size: $fon18;
    color: $textColor;
    padding: 2rem 0;
  }
  .content-box {
    font-size: $fon14;
    color: white;
    line-height: $fon18;
    /deep/ h1 {
      margin-bottom: 1rem;
    }
    /deep/ h2 {
      margin-bottom: 1rem;
    }
    /deep/ h3 {
      margin-bottom: 1rem;
    }
    /deep/ h4 {
      margin-bottom: 1rem;
    }
    /deep/ h5 {
      margin-bottom: 1rem;
    }
    /deep/ strong {
      margin-bottom: 1rem;
    }
    /deep/ p {
      margin-bottom: 1rem;
      font-size: $fon14;
      line-height: $fon18;
    }
    /deep/ ul {
      li {
        margin-bottom: 1rem;
      }
    }
    /deep/ li {
      padding-left: 1rem;
    }
    /deep/ blockquote {
      word-break: break-all;
      border-left: 6px solid $textColor;
      padding-left: 0.5rem;
    }
    /deep/ pre {
      padding: 1rem;
      border-radius: 4px;
      background: $textColor;
      code {
        color: $titleColor;
        word-break: break-all;
        white-space: normal;
      }
    }
    /deep/ table {
      th {
        padding: 1rem;
        border: 1px solid $textColor;
      }
      td {
        padding: 0.5rem;
      }
    }
    /deep/ br {
      content: "";
      display: block;
      height: 4px;
    }
    /deep/ ol {
      li {
        margin-bottom: 1rem;
      }
    }
    /deep/ img {
      margin-bottom: 1rem;
    }
  }
  .vote-box {
    margin-top: $padd24;
    margin-bottom: 4rem;
    .vote-msg {
      margin-bottom: 16px;
      .vote-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        span {
          font-size: 13px;
          color: $textColor;
        }
        span:last-child {
          color: white;
          font-weight: bold;
        }
      }
    }
    .vote-msg:last-child {
      margin-bottom: 0;
    }
  }
  .more-choice {
    .choice-inner {
      margin-bottom: 40px;
      .choice-title {
        margin-bottom: 16px;
        font-size: 12px;
        color: #ffac33;
        span {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
          border: 2px solid #ffac33;
        }
      }
    }
  }
  .trans-box {
    padding: $padd24;
    padding-bottom: 0;
    padding-top: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: saturate(180%) blur(6px);
    p {
      width: 100%;
      text-align: center;
      color: white;
      margin: 0.5rem 0;
      font-size: $fon12;
    }
    button {
      width: 100%;
      height: 2rem;
      margin-bottom: 0.5rem;
    }
  }
}
</style>