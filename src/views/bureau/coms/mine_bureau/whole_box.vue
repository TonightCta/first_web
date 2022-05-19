<template>
  <!-- 完整对话 -->
  <modal :show.sync="wholeBox" modalClasses="read-original-box">
    <div class="whole-box">
      <div class="whole-title">
        <p>
          <span class="iconfont icon-biaoqingxinxi_message-emoji"></span>
          <!-- 完整对话 -->
          {{ $t("bureau_evs.whole_talk") }}
        </p>
        <p @click="viewOffical()">
          <span class="iconfont icon-qingbaoju_discord"></span>
          <!-- 查看来源 -->
          {{ $t("public.soure") }}
          <span class="iconfont icon-fenxiang_share"></span>
        </p>
      </div>
      <div v-loading="loadWhole">
        <div class="whole-inner">
          <ul>
            <li v-for="i in talkList" :key="i.did + '999'">
              <div class="icon-box">
                <img :src="i.avatar" alt="" />
                <p class="icon-line"></p>
              </div>
              <div class="inner-content">
                <div class="inner-box">
                  <p>
                    {{ i.author }}
                    <span>{{ i.publish_time }}</span>
                  </p>
                  <div
                    class="inner-text"
                    v-html="detailsTranslate ? i.content_zh : i.content"
                  ></div>
                  <div
                    class="img-box"
                    :class="[
                      i.attachments.length == 1 && 'just-one',
                      i.attachments.length == 2 && 'two-pic',
                      i.attachments.length == 3 && 'three-pic',
                      i.attachments.length == 4 && 'four-pic',
                    ]"
                    v-if="i.attachments.length > 0"
                  >
                    <div
                      class="img-inner"
                      v-for="(testp, a) in i.attachments"
                      :key="a"
                    >
                      <el-image :src="testp" :preview-src-list="i.attachments">
                      </el-image>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="whole-oper">
        <base-button
          type="default"
          round
          @click="
            wholeBox = false;
            detailsTranslate = false;
          "
        >
          <!-- 关闭 -->
          {{ $t("public.close") }}
        </base-button>
        <p class="inner-label-other"></p>
        <el-popover placement="top" trigger="hover" :content="$t('bureau_evs.deep_remark')">
          <!-- 翻译由DEEPL提供 -->
          <base-button
            type="info"
            round
            class="other-info"
            slot="reference"
            @click="detailsTranslate = !detailsTranslate"
          >
            <i class="iconfont icon-fanyi_translation"></i>
            {{ detailsTranslate ? "English Version" : "翻译成中文" }}
          </base-button>
        </el-popover>
      </div>
    </div>
  </modal>
</template>

<script>
import { Modal } from "@/components";
import { disDetails } from "@/request/api";
export default {
  data() {
    return {
      wholeBox: false, //完整对话盒子
      loadWhole: false, //loading
      detailsTranslate: false, //翻译状态
      talkList: [], //对话内容
      disID: null, //对应ID
      offURL: null, //对应来源
      testpic: [
        require("@/assets/images/test.png"),
        require("@/assets/images/test.png"),
        require("@/assets/images/test.png"),
        require("@/assets/images/test.png"),
      ],
    };
  },
  components: {
    Modal,
  },
  watch: {
    wholeBox(val) {
      val && this.getDisDetails();
    },
  },
  methods: {
    getProps(_id, _url) {
      this.disID = _id;
      this.offURL = _url;
      this.wholeBox = true;
    },
    // 完整对话
    async getDisDetails() {
      this.loadWhole = true;
      const result = await disDetails({ did: this.disID });
      this.loadWhole = false;
      this.talkList = result;
    },
    //查看来源
    viewOffical() {
      window.open(this.offURL);
    },
  },
};
</script>

<style lang="scss" scoped>
.whole-box {
  padding: 24px 24px 32px 24px;
  position: relative;
  .whole-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      display: flex;
      align-items: center;
    }
    p:first-child {
      font-size: 17px;
      color: $titleColor;
      font-weight: bold;
      .iconfont {
        font-size: 20px;
        font-weight: 400;
        margin-right: 4px;
      }
    }
    p:last-child {
      color: #5865f2;
      cursor: pointer;
      font-size: 13px;
      .iconfont {
        font-size: 16px;
        margin-right: 8px;
      }
      .iconfont:last-child {
        margin-left: 4px;
        font-size: 14px;
        margin-right: 0;
      }
    }
  }
  .whole-inner {
    width: 100%;
    height: 65vh;
    overflow-y: auto;
    padding-right: 16px;
    margin-top: 28px;
    margin-bottom: 24px;
    /deep/ .el-loading-spinner .path {
      stroke: $contentBg;
    }
    ul {
      li {
        display: flex;
        .icon-box {
          width: 32px;
          margin-right: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            box-sizing: border-box;
            border: 2px solid #ddd;
          }
          .icon-line {
            flex: 1;
            width: 2px;
            background: $remarkColor;
          }
        }
        .inner-content {
          flex: 1;
          padding-bottom: 16px;
          .inner-box {
            width: 100%;
            padding: 16px;
            background: #f3f4fa;
            border-radius: 4px;
            p:first-child {
              font-size: 13px;
              margin-bottom: 8px;
              color: $titleColor;
              font-weight: bold;
              span {
                margin-left: 8px;
                color: #00cc8f;
                font-weight: 400;
              }
            }
            .inner-text {
              font-size: 12px;
              line-height: 22px;
              color: #676c7a;
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
                  margin: 16px 0;
                  color: $titleColor;
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
            .img-box {
              width: 240px;
              height: 120px;
              // background: red;
              margin-top: 16px;
              .img-inner {
                display: flex;
                justify-content: center;
                background: $textColor;
                align-items: center;
                overflow: hidden;
                border-radius: 4px;
                cursor: pointer;
              }
            }
            // 只有一张大图时
            .just-one {
              .img-inner {
                height: 100%;
                width: 100%;
              }
            }
            // 两张图
            .two-pic {
              display: flex;
              justify-content: space-between;
              .img-inner {
                width: 49%;
                height: 100%;
              }
            }
            //三张图
            .three-pic {
              display: grid;
              grid-template-columns: 49% 49%;
              grid-template-rows: 49% 49%;
              .img-inner:first-child {
                grid-column: 1 / span 1;
                grid-row: 1 / span 2;
                margin-right: 4px;
              }
              .img-inner {
                margin-bottom: 4px;
              }
            }
            //四张图
            .four-pic {
              display: grid;
              grid-template-columns: 49% 49%;
              grid-template-rows: 49% 49%;
              .img-inner {
                margin-right: 4px;
                margin-bottom: 4px;
              }
            }
          }
        }
      }
      li:last-child {
        .icon-line {
          display: none;
        }
      }
    }
  }
  .whole-oper {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    bottom: -84px;
    .inner-label-other {
      width: 16px;
    }
  }
}
</style>