// 未来事件内容
<template>
  <div>
    <div class="events-list" v-for="(x, y) in eventsList" :key="y">
      <div class="events-date">
        <p>
          {{
            /** 今天 */
            (x.date_text == "today" && $t("public.today")) ||
            /** 明天 */
            (x.date_text == "tomorrow" && $t("public.tomorrow")) ||
            /** 后天 */
            (x.date_text == "theDayAfterTomorrow" && $t("public.day_after")) ||
            x.date_day
          }}
        </p>
        <p>{{ x.date_month }}</p>
      </div>
      <div class="events-content">
        <el-collapse accordion>
          <div v-for="(i, a) in x.list" :key="a + 999" class="accordion-box">
            <el-collapse-item>
              <template slot="title">
                <div class="collapse-header-mine">
                  <div class="pro-msg">
                    <p
                      class="pro-logo"
                      :class="
                        nowType != 9999 && i.is_attention == 1 && 'has-star'
                      "
                    >
                      <img :src="i.logo" alt="" />
                      <span
                        class="mine-attention"
                        v-if="nowType != 9999 && i.is_attention == 1"
                      >
                        <!-- 自选 -->
                        {{ $t("bureau_mine.my_track") }}
                      </span>
                    </p>
                    <p class="title-msg">
                      <span v-if="app.language == 'en'">
                        {{ i.happen_time }}&nbsp;&nbsp;&nbsp;&nbsp;{{ i.title }}
                      </span>
                      <span v-else>
                        {{ i.happen_time }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                          i.abs_translate ? i.title_zh : i.title
                        }}
                      </span>
                      <span
                        >{{ i.projectTitle }}（{{ i.symbol }}）<font
                        >
                          <!-- 以下内容由DeepL提供翻译 -->
                          {{ $t("bureau_evs.deep_remark") }}
                        </font></span
                      >
                    </p>
                    <p class="mobile-title-msg" v-if="$flag">
                      <span>{{ i.projectTitle }}</span>
                      <span>{{ i.happen_time }}</span>
                    </p>
                  </div>
                  <div class="oper-box">
                    <p class="has-add-calendar" v-if="i.added == 1">
                      <span class="iconfont icon-xiaoyan2_check-one"></span>
                      <!-- 已添加 -->
                      {{ $t("bureau_mine.has_push") }}
                    </p>
                    <!-- 添加到日历 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('bureau_mine.add_calendar')"
                      v-if="i.added == 0 && showCalendar == 1"
                    >
                      <!-- 添加到日历 -->
                      <p
                        slot="reference"
                        class="other-oper"
                        @click.stop="addCalendar(1, i.id)"
                      >
                        <i class="iconfont icon-rili_calendar"></i>
                      </p>
                    </el-popover>
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('public.translate')"
                      v-if="i.is_chinese != 1 && app.language != 'en'"
                    >
                      <!-- 中英切换 -->
                      <p
                        slot="reference"
                        class="other-oper-two"
                        @click.stop="
                          $store.dispatch('setPoint', 32);
                          i.abs_translate = !i.abs_translate;
                        "
                      >
                        <i
                          class="iconfont"
                          :class="
                            i.abs_translate
                              ? ' icon-yuanbian-yingwen_english1'
                              : ' icon-yuanbian-zhongwen1_chinese-one'
                          "
                        ></i>
                      </p>
                    </el-popover>
                    <!-- 研究员观点 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('bureau_evs.ann_think')"
                    >
                      <!-- 研究员观点 -->
                      <p
                        slot="reference"
                        class="other-oper"
                        v-if="i.analysis"
                        @click.stop="
                          analysisText = i.analysis;
                          analysisBox = true;
                        "
                      >
                        <i
                          class="iconfont icon-renyuanshuohua_people-speak"
                        ></i>
                      </p>
                    </el-popover>
                    <!-- 事件原文 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('public.con_full')"
                      v-if="i.type != 1"
                    >
                      <!-- 英文全文 -->
                      <p
                        slot="reference"
                        class="other-oper-two"
                        @click.stop="
                          $store.dispatch('setPoint', 34);
                          $refs.contentbox.getProps(
                            i.id,
                            (isTrans = i.is_chinese == 1 ? 0 : 1)
                          );
                        "
                      >
                        <i class="iconfont icon-yuanbian-yingwenquanwen"></i>
                      </p>
                    </el-popover>
                    <!-- 查看来源 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('public.soure')"
                    >
                      <!-- 查看来源 -->
                      <p
                        slot="reference"
                        class="other-oper-two"
                        @click.stop="
                          $store.dispatch('setPoint', 33);
                          viewOffcial(i.content_url);
                        "
                      >
                        <i class="iconfont icon-yuanbian-lianjie_link-two"></i>
                      </p>
                    </el-popover>
                  </div>
                </div>
                <div class="mobile-title-header" v-if="$flag">
                  <p>{{ i.abs_translate ? i.title_zh : i.title }}</p>
                </div>
              </template>
              <div class="collapse-content-mine">
                <div class="content-box">
                  <div
                    class="content-text"
                    v-if="app.language == 'en'"
                    v-html="i.abstract"
                  ></div>
                  <div
                    class="content-text"
                    v-else
                    v-html="i.abs_translate ? i.abstract_zh : i.abstract"
                  ></div>
                  <p class="more-show">......</p>
                </div>
              </div>
            </el-collapse-item>
            <div class="mobile-oper" v-if="$flag">
              <div class="oper-left">
                <!-- 添加到日历 -->
                <p
                  class="other-oper"
                  v-if="i.added == 0 && showCalendar == 1"
                  @click.stop="addCalendar(1, i.id)"
                >
                  <i class="iconfont icon-rili_calendar"></i>
                </p>
                <p class="has-fav" v-if="i.added == 1">
                  <span class="iconfont icon-xiaoyan2_check-one"></span>
                  <!-- 已添加 -->
                  {{ $t("bureau_mine.has_push") }}
                </p>
                <!-- 中英切换 -->
                <p
                  class="other-oper-two"
                  @click.stop="
                    $store.dispatch('setPoint', 32);
                    i.abs_translate = !i.abs_translate;
                  "
                >
                  <i
                    class="iconfont"
                    :class="
                      i.abs_translate
                        ? ' icon-yuanbian-yingwen_english1'
                        : ' icon-yuanbian-zhongwen1_chinese-one'
                    "
                  ></i>
                </p>
                <!-- 原文 -->
                <p
                  class="other-oper-two"
                  v-if="i.type != 1"
                  @click.stop="
                    $store.dispatch('setPoint', 34);
                    $router.push({
                      path: '/mobile-inner',
                      query: {
                        id: i.id,
                        isTrans: i.is_chinese == 1 ? 0 : 1,
                      },
                    });
                  "
                >
                  <i class="iconfont icon-yuanbian-yingwenquanwen"></i>
                </p>
                <!-- 查看来源 -->
                <p
                  class="other-oper-two"
                  @click.stop="
                    $store.dispatch('setPoint', 33);
                    viewOffcial(i.content_url);
                  "
                >
                  <i class="iconfont icon-yuanbian-lianjie_link-two"></i>
                </p>
              </div>
            </div>
          </div>
        </el-collapse>
      </div>
    </div>
    <!-- 内容原文 -->
    <ConetentBox ref="contentbox" />
    <!-- 研究员观点 -->
    <modal :show.sync="analysisBox" modalClasses="login-box-modal">
      <div class="analysis-box">
        <p class="">
          <!-- 研究员观点 -->
          {{ $t("bureau_evs.ann_think") }}
        </p>
        <p>{{ analysisText }}</p>
        <p>
          <base-button type="default" round @click="analysisBox = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { addCalendar } from "@/request/api";
import { Modal } from "@/components";
import { mapState } from "vuex";
export default {
  props: ["eventsList", "nowType", "showCalendar"],
  data() {
    return {
      analysisText: null,
      analysisBox: false,
    };
  },
  components: {
    Modal,
    ConetentBox: (resolve) => require(["./content_box"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    //添加日历
    async addCalendar(_type, _id) {
      const result = await addCalendar({ id: _id, type: _type });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        //已添加到我的日历<br>如果您已订阅日历，稍后将同步到您的日历客户端。
        message: this.$t("notify.add_calendar"),
      });

      //  @upCalendar="getEventsList"
      this.$emit("upCalendar");
      // this.getEventsList();
    },
    //访问来源
    viewOffcial(_url) {
      window.open(_url);
    },
  },
};
</script>

<style lang="scss" scoped>
.events-list {
  width: 100%;
  display: flex;
  margin-bottom: 24px;
  .events-date {
    width: 80px;
    height: 96px;
    border-radius: 4px;
    margin-right: 16px;
    background: $contentBg;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    p:first-child {
      width: 100%;
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 23px;
      background: $conBg2;
    }
    p:last-child {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: $remarkColor;
    }
  }
  .events-content {
    flex: 1;
    /deep/ .el-collapse {
      border: 0;
      border-radius: 4px;
      overflow: hidden;
      .el-collapse-item {
        border-bottom: 1px solid $mineBg;
        .el-collapse-item__header {
          border-color: rgba(0, 0, 0, 0);
          background-color: $contentBg;
          height: auto;
          line-height: normal;
          padding: 24px;
          .el-icon-arrow-right {
            font-size: 18px;
            color: white;
          }
        }
        .el-collapse-item__wrap {
          border-color: $mineBg;
          background-color: $contentBg;
          .el-collapse-item__content {
            background-color: $contentBg;
            padding: 0 72px 24px 88px;
          }
        }
      }
    }
    .collapse-header-mine {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-right: 24px;
      .pro-msg {
        display: flex;
        .has-star {
          background-color: #ffd45c !important;
        }
        .pro-logo {
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
          border-radius: 50%;
          background-color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          img {
            width: 44px;
            height: 44px;
            border-radius: 50%;
          }
          .mine-attention {
            position: absolute;
            display: inline-block;
            width: 44px;
            height: 20px;
            line-height: 20px;
            background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
            border-radius: 4px;
            font-size: 12px;
            color: $titleColor;
            text-align: center;
            bottom: -16px;
            font-weight: bold;
          }
        }
        .title-msg {
          display: flex;
          flex-direction: column;
          margin-left: 16px;
          padding-top: 4px;
          span:first-child {
            font-size: 14px;
            color: white;
            font-weight: bold;
          }
          span:last-child {
            font-size: 13px;
            color: $success;
          }
          font {
            font-size: 12px;
            color: $remarkColor;
          }
        }
      }
      .oper-box {
        min-width: 338px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .has-add-calendar {
          padding: 4px 8px;
          background: $conBg2;
          color: $remarkColor;
          border-radius: 16px;
          font-size: 12px;
          display: flex;
          align-items: center;
          .iconfont {
            font-size: 16px;
            margin-right: 4px;
          }
        }
        .other-oper-two {
          margin-left: 24px;
          .iconfont {
            font-size: 24px;
            color: $remarkColor;
          }
          .iconfont:hover {
            color: white;
          }
        }
        .like-box {
          display: flex;
          margin-left: 16px;
          font-size: 13px;
          color: $textColor;
          font-weight: bold;
          align-items: center;
          cursor: pointer;
          .like-line {
            width: 1px;
            height: 16px;
            background: $lineTwoColor;
            border-radius: 0;
            border: 0;
            margin-right: 16px;
          }
          p {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            .iconfont {
              font-size: 24px;
              color: $remarkColor;
              margin-right: 8px;
              font-weight: 400;
            }
            .iconfont:hover {
              color: white;
            }
          }
          .has-like {
            border-color: $success;
            .iconfont {
              color: $success;
            }
          }
        }
        .other-oper {
          width: 24px;
          height: 24px;
          cursor: pointer;
          margin-left: 24px;
          border-radius: 50%;
          background: #8a3ffc;
          display: flex;
          justify-content: center;
          align-items: center;
          .iconfont {
            font-size: 13px;
            color: white;
          }
        }
      }
    }
    .mobile-title-header {
      margin-top: $padd24;
      width: 100%;
      p {
        width: 100%;
        text-align: left;
        font-size: 0.81rem;
        color: white;
        font-weight: bold;
        line-height: $fon18;
      }
    }
    .collapse-content-mine {
      .content-box {
        position: relative;
        margin-bottom: 16px;
        .more-show {
          position: absolute;
          background-color: $contentBg;
          bottom: 0;
          right: 0;
          display: none;
        }
      }
      .content-text {
        font-size: 12px;
        color: $remarkColor;
        line-height: 22px;
        height: 100%;
        overflow: hidden;
        /deep/ h1 {
          font-size: 12px;
          margin: 0;
        }
        /deep/ h2 {
          font-size: 12px;
          margin: 0;
        }
        /deep/ h3 {
          font-size: 12px;
          margin: 0;
        }
        /deep/ h4 {
          font-size: 12px;
          margin: 0;
        }
        /deep/ h5 {
          font-size: 12px;
          margin: 0;
        }
        /deep/ p,
        strong {
          font-size: 12px;
          // margin-bottom: 10px !important;
          color: $remarkColor;
        }
        /deep/ strong {
          margin-bottom: 0;
        }
        /deep/ img {
          display: none;
        }
      }
      .reply-box {
        padding: 16px 24px;
        background-color: $conBg2;
        margin-bottom: 24px;
        border-radius: 4px;
        p:first-child {
          font-size: 13px;
          color: $remarkColor;
          margin-bottom: 12px;
        }
        p:last-child {
          font-size: 12px;
          color: $textColor;
          line-height: 22px;
        }
      }
      .content-oper {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        .oper-translate {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: $iconColor;
          cursor: pointer;
          .iconfont {
            font-size: 16px;
            color: $iconColor;
            margin-right: 8px;
          }
          span {
            // margin-left: 8px;
            font-size: 12px;
            color: $remarkColor;
          }
        }
        .oper-other {
          display: flex;
          align-items: center;
          p {
            margin-left: 24px;
            font-size: 16px;
            color: $remarkColor;
            display: flex;
            align-items: center;
            span {
              color: $textColor;
              font-size: 13px;
              margin-left: 8px;
            }
            img {
              width: 16px;
              height: 16px;
              border-radius: 50%;
            }
          }
        }
      }
    }
    .mobile-oper {
      display: flex;
      padding: 1rem;
      justify-content: flex-end;
      background: $contentBg;
      border-top: 1px solid $mineBg;
      .oper-left {
        display: flex;
        .other-oper {
          width: $padd24;
          height: $padd24;
          border-radius: 50%;
          background: #8a3ffc;
          display: flex;
          justify-content: center;
          align-items: center;
          .iconfont {
            font-size: $fon12;
          }
        }
        .has-fav {
          font-size: $fon12;
          color: $remarkColor;
          padding: 2px 0.5rem;
          border-radius: $padd24;
          background: $conBg2;
          display: flex;
          align-items: center;
          .iconfont {
            font-size: 1rem;
            margin-right: 0.25rem;
          }
        }
        .other-oper-two {
          .iconfont {
            font-size: $padd24;
            color: $remarkColor;
          }
          margin-left: $padd24;
        }
      }
      .oper-right {
        .like-box {
          display: flex;
          align-items: center;
          font-size: 0.81rem;
          font-weight: bold;
          color: $remarkColor;
          .iconfont {
            color: $remarkColor;
            margin-right: 0.5rem;
            font-size: $padd24;
            font-weight: 400;
          }
        }
        .has-like {
          border-color: $success;
          .iconfont {
            color: $success;
          }
        }
      }
    }
  }
}
.analysis-box {
  text-align: center;
  padding: 24px 24px 32px 24px;
  p:first-child {
    font-size: 17px;
    color: $titleColor;
    font-weight: bold;
  }
  p:nth-child(2) {
    text-align: left;
    margin-top: 24px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #676c7a;
    line-height: 22px;
  }
}
@media screen and (max-width: 1279px) {
  .events-list {
    flex-direction: column;
    .events-date {
      width: 7.5rem;
      margin-bottom: 1rem;
      flex-direction: initial;
      height: 2.25rem;
      margin-right: 0;
      p:first-child {
        width: 3.25rem;
        height: 100%;
        font-size: $fon14;
        color: white;
        border-radius: 4px;
      }
      p:last-child {
        border-radius: 0 4px 4px 0;
        font-size: $fon12;
        color: $remarkColor;
      }
    }
    .events-content {
      /deep/ .el-collapse-item {
        position: relative;
        border-bottom: 0 !important;
      }
      /deep/ .el-collapse-item__wrap {
        border-bottom: 0;
      }
      /deep/ .el-collapse-item__header {
        padding: 1rem !important;
        flex-direction: column;
        border-bottom: 0;
        .pro-msg {
          .pro-logo {
            width: $padd40;
            height: $padd40;
            margin-right: 1rem;
            img {
              width: 2.375rem;
              height: 2.375rem;
            }
          }
          .title-msg {
            display: none;
          }
          .mobile-title-msg {
            display: flex;
            flex-direction: column;
            span:first-child {
              font-size: 0.81rem;
              color: white;
              font-weight: bold;
            }
            span:last-child {
              font-size: $fon12;
              color: $success;
            }
          }
        }
        .oper-box {
          display: none;
        }
        .el-collapse-item__arrow {
          position: absolute;
          top: $padd24;
          right: 1rem;
          margin: 0;
          color: $remarkColor !important;
          font-weight: bold;
          transform: rotate(90deg);
        }
        .is-active {
          transform: rotate(270deg);
        }
      }
      /deep/ .el-collapse-item__content {
        padding: 0 1rem $padd24 1rem !important;
      }
      .accordion-box {
        margin-bottom: 1rem;
      }
      .accordion-box:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>