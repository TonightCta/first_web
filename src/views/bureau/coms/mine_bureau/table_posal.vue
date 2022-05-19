// 投票中的提案
<template>
  <div class="table-posal">
    <!-- @row-click="rowPoasl" -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :empty-text="$t('no_data.no_posal')"
    >
      <!-- 暂无投票中的提案 -->
      <el-table-column :label="$t('month_vip.table_name')" width="80">
        <!-- 项目 -->
        <template slot-scope="{ row }">
          <p class="icon-box">
            <img :src="row.logo" alt="" />
          </p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('bureau_mine.proposal_con')">
        <!-- 提案内容 -->
        <template slot-scope="{ row }">
          <div class="ev-box">
            <p>
              {{ app.language == 'en' ? row.title : row.title_zh }}
            </p>
            <p>
              {{ app.language == 'en' ? row.abstract : row.abstract_zh }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('bureau_mine.dead_time')"
        v-if="!$flag"
        :width="app.language == 'en' ? 220 :  180"
      >
        <!-- 截止时间 -->
        <template slot-scope="{ row }">
          <p class="end-box">
            {{
              row.day_end >= 0
                ? row.day_end == 0
                  ? app.language == "en"
                    ? `${row.hour_end} Hours`
                    : `${row.hour_end}时后结束`
                  : app.language == "en"
                  ? `${row.day_end} Days ${row.hour_end} Hours`
                  : `${row.day_end}天${row.hour_end}时后结束`
                : $t("public.been_close")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('month_vip.table_oper')"
        :width="$flag ? '50' : '100'"
        header-align="right"
      >
        <!-- 操作 -->
        <template slot-scope="{ row }">
          <div class="text-right">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('bureau_mine.get_ann')"
              v-if="false"
            >
              <!-- 召唤研究员 -->
              <p
                slot="reference"
                class="iconfont icon-renyuanshuohua_people-speak icon-color"
              ></p>
            </el-popover>
            <el-popover
              placement="top"
              :disabled="Boolean($flag)"
              trigger="hover"
              :content="$t('public.con_text')"
              v-if="!$flag"
            >
              <!-- 英文原文 -->
              <p
                slot="reference"
                class="iconfont icon-yanjing_eyes icon-eyes"
                @click="
                  !$flag
                    ? ((votes = row.votes),
                      (contentID = row.id),
                      (posalBox = true),
                      (isChoice = row.proposal_type == 1 ? false : true),
                      (isTrans = row.is_chinese == 1 ? false : true))
                    : $router.push({
                        path: '/posal-details',
                        query: {
                          votes: JSON.stringify(row.votes),
                          id: row.id,
                          isChoice: row.proposal_type == 1 ? 1 : 2,
                          isTrans: row.is_chinese == 1 ? 0 : 1,
                        },
                      })
                "
              ></p>
            </el-popover>

            <el-popover
              placement="top"
              :disabled="Boolean($flag)"
              trigger="hover"
              :content="$t('public.soure')"
            >
              <!-- 查看来源 -->
              <p
                slot="reference"
                class="iconfont icon-yuanbian-lianjie_link-two"
                @click="viewOffical(row.content_url)"
              ></p>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 提案详情 -->
    <modal :show.sync="posalBox" modalClasses="read-original-box">
      <div class="posal-box-inner" v-loading="loadContent">
        <!-- loadContent -->
        <div class="inner-content">
          <p
            class="inner-text"
            v-html="languageStatus ? posalContentZH : posalContent"
          ></p>
          <!-- 投票信息 -->
          <!-- 单选投票 -->
          <div class="vote-box" v-if="!isChoice">
            <div class="vote-msg" v-for="(i, x) in votes" :key="x">
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
          <!-- 多选投票 -->
          <div class="more-choice" v-else>
            <div
              class="choice-inner"
              v-for="(vote, indexV) in votes"
              :key="indexV"
            >
              <p class="choice-title">
                <span></span>
                {{
                  vote.vote_type == 1
                    ? $t("bureau_evs.vote_title_1")
                    : $t("bureau_evs.vote_title_2")
                }}
                <!-- 大众投票 & 委员会投票 -->
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
        </div>
        <!-- 操作 -->
        <div class="inner-oper" :class="{ 'two-btn': isTrans }">
          <p>
            <base-button
              type="defalut"
              round
              @click="
                votes = [];
                posalContent = null;
                posalContentZH = null;
                languageStatus = false;
                posalBox = false;
              "
            >
              <!-- 关闭 -->
              {{ $t("public.close") }}
            </base-button>
          </p>
          <p class="inner-label"></p>
          <p v-if="isTrans">
            <!-- <span
                >翻译自<font @click="viewOffcial('https://deepl.com')"
                  >deepl.com</font
                ></span
              > -->
            <el-popover
              placement="right"
              trigger="hover"
              :content="$t('bureau_evs.deep_remark')"
            >
              <!-- 翻译由DEEPL提供 -->
              <base-button
                type="info"
                round
                class="other-info"
                slot="reference"
                @click="
                  languageStatus = !languageStatus;
                  languageStatus ? getInfoContentZh() : getInfoContent();
                "
              >
                <i class="iconfont icon-fanyi_translation"></i>
                {{ languageStatus ? "English Version" : "翻译成中文" }}
              </base-button>
            </el-popover>
            <el-popover
              placement="right"
              trigger="hover"
              :content="$t('bureau_evs.deep_remark')"
            >
              <!-- 翻译由DEEPL提供 -->
              <base-button
                slot="reference"
                class="other-info"
                round
                v-if="false"
                @click="transToSub"
              >
                <i class="iconfont icon-fanyi_translation"></i>
                翻译成中文
              </base-button>
            </el-popover>
            <base-button
              class="other-info"
              round
              v-if="false"
              disabled="disabled"
            >
              <i class="iconfont icon-fanyi_translation"></i>
              翻译中
            </base-button>
          </p>
        </div>
      </div>
    </modal>
    <!-- 提交翻译 -->
    <TranslateSub ref="translateSub" />
  </div>
</template>

<script>
import { posalList, infoContent, infoContentZh } from "@/request/api";
import { Modal } from "@/components";
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      posalBox: false,
      butText: "翻译成中文",
      languageStatus: false, // true---->中文  false---->英文
      posalContent: null, //提案内容
      posalContentZH: null,
      loadContent: false,
      contentID: null,
      isTrans: true,
      isChoice: false, //是否为多选投票
      votes: [],
      translateStatus: 0,
    };
  },
  components: {
    Modal,
    TranslateSub: (resolve) => require(["./sub_translate"], resolve),
  },
  created() {
    this.getData();
  },
  watch: {
    posalBox(val) {
      val && this.getInfoContent();
      !val && (this.translateStatus = 0);
    },
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    rowPoasl(row) {
      !this.$flag
        ? ((this.votes = row.votes),
          (this.contentID = row.id),
          (this.posalBox = true),
          (this.isChoice = row.proposal_type == 1 ? false : true),
          (this.isTrans = row.is_chinese == 1 ? false : true))
        : this.$router.push({
            path: "/posal-details",
            query: {
              votes: JSON.stringify(row.votes),
              id: row.id,
              isChoice: row.proposal_type == 1 ? 1 : 2,
              isTrans: row.is_chinese == 1 ? 0 : 1,
            },
          });
    },
    //获取数据
    async getData() {
      const result = await posalList({
        status: 1,
        limit: 500,
      });
      this.tableData = result.data;
    },
    //查看来源
    viewOffical(_url) {
      window.open(_url);
    },
    //获取内容原文
    async getInfoContent() {
      this.loadContent = true;
      const result = await infoContent({ id: this.contentID });
      this.posalContent = result.content;
      this.translateStatus = result.tran;
      this.loadContent = false;
    },
    //获取内容译文
    async getInfoContentZh() {
      this.loadContent = true;
      const result = await infoContentZh({ id: this.contentID });
      this.posalContentZH = result.content;
      this.loadContent = false;
    },
    //提交翻译
    async transToSub() {
      const result = await infoContentZh({ id: this.contentID });
      this.languageStatus = false;
      this.translateStatus = result.tran;
      this.$refs.translateSub.subTranslate = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-posal {
  .icon-box {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid $lineTwoColor;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      border-radius: 50%;
      height: 100%;
      background: white;
    }
  }
  .ev-box {
    p:first-child {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: white;
    }
    p:last-child {
      font-size: 12px;
      border-radius: 4px;
      color: $remarkColor;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .end-box {
    display: inline-block;
    padding: 8px 16px;
    background: rgba(167, 240, 186, 0.1);
    color: $success;
    font-size: 13px;
    border-radius: 4px;
    width: auto;
  }
  .text-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .iconfont {
      margin-left: 8px;
      font-size: 20px;
      cursor: pointer;
    }
    .icon-color {
      color: $iconColor !important;
    }
    .icon-eyes {
      color: $success !important;
    }
    p:last-child {
      color: #ffd45c;
    }
  }
}
.posal-box-inner {
  padding: 24px 24px 32px 24px;
  position: relative;
  /deep/ .el-loading-spinner .path {
    stroke: $contentBg;
  }
  .inner-title {
    font-size: 17px;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 28px;
    display: none;
  }
  .inner-content {
    width: 100%;
    overflow-y: auto;
    padding-right: 16px;
    height: 70vh;
    .inner-text {
      font-size: 12px;
      color: #676c7a;
      line-height: 18px;
      margin-bottom: 24px;
      min-height: 70%;
      /deep/ h1 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ h2 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ h3 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ h4 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ h5 {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ strong {
        color: $titleColor;
        margin: 16px 0;
      }
      /deep/ p {
        color: $titleColor;
        margin: 16px 0;
        font-size: 14px;
      }
      /deep/ ul {
        li {
          color: $titleColor;
          margin: 16px 0;
        }
      }
      /deep/ ol {
        li {
          margin: 16px 0;
          color: $titleColor;
        }
      }
      /deep/ img {
        margin: 16px 0;
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
    .vote-box {
      margin-top: 24px;
      .vote-msg {
        margin-bottom: 16px;
        .vote-title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          span {
            font-size: 13px;
            color: $titleColor;
          }
          span:last-child {
            font-weight: bold;
          }
        }
      }
    }
  }
  .inner-oper {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    bottom: -84px;
    p:last-child {
      span {
        margin-right: 24px;
        color: $remarkColor;
        font-size: 12px;
        font {
          color: $iconColor;
          cursor: pointer;
          margin-left: 2px;
        }
      }
    }
  }
  .two-btn {
    .inner-label {
      display: block;
    }
  }
}
@media screen and (max-width: 1279px) {
  /deep/ .el-table__header {
    th {
      padding-left: 0;
      padding-right: 0;
      .cell {
        padding-right: 0;
      }
    }
  }
  /deep/ .el-table__body {
    td {
      padding-left: 0;
      padding-right: 0;
      .cell {
        padding-right: 0;
      }
    }
  }
}
</style>