<template>
  <!-- 项目解析 -->
  <div class="pro-con">
    <div class="con-inner-top">
      <!-- 关注变化 -->
      <div
        class="attention-change"
        v-if="
          data.permission == 1 &&
          (data.attention_switch == 3 || data.attention_switch == 4)
        "
      >
        <p>
          {{
            data.attention_switch == 3
              ? $t("project_info.change_follow")
              : $t("project_info.change_unfollow")
          }}
        </p>
      </div>
      <div
        @click="
          data.permission == 1
            ? data.is_attention == 1
              ? goProDetails(data.id, data.symbol, false)
              : goPDF($flag ? data.mobile_pdf : data.pdf, 1, data.id)
            : null
        "
      >
        <div class="pro-msg">
          <p class="pro-icon-bg">
            <img :src="data.logo" alt="" />
            <span
              class="start start-in"
              v-if="data.is_attention == 1 && data.permission == 1"
            >
              <!-- 关注 -->
              {{ $t("public.follow") }}
            </span>
            <span
              class="start start-out"
              v-if="data.is_attention == 0 && data.permission == 1"
            >
              <!-- 不关注 -->
              {{ $t("public.un_follow") }}
            </span>
          </p>
          <div class="pro-date">
            <p>{{ data.publish_time }}</p>
            <p v-if="false">
              <!-- 发布时间 -->
              {{ $t("month_vip.table_date") }}
            </p>
          </div>
        </div>
        <p class="pro-title">{{ data.title }}({{ data.symbol }})</p>
        <div class="priods-and-race">
          <span class="issus-no">
            {{
              app.language == "en"
                ? `No.${data.periods}`
                : `第${data.periods}期`
            }}
          </span>
          <span
            class="race-tag"
            @click.stop="goSearch(data.race.parent)"
            style="cursor: pointer"
            >{{ data.race.parent }}</span
          >
          <span
            v-if="data.race.child"
            class="child-tag iconfont icon-you_right"
          ></span>
          <span
            v-if="data.race.child"
            class="race-tag-child"
            @click.stop="goSearch(data.race.child)"
          >
            {{ data.race.child }}
          </span>
        </div>
        <div class="tag-list">
          <span
            v-for="(tag, indexTag) in data.tag"
            :key="indexTag"
            @click.stop="goSearch(tag)"
            >{{ tag }}</span
          >
        </div>
      </div>
      <p class="pro-line"></p>
      <div class="oper-box" v-if="data.is_attention == 1">
        <div
          class="oper-public"
          @click.stop="
            goProDetails(
              data.id,
              data.symbol,
              data.event_count > 0 ? true : false
            )
          "
        >
          <p class="iconfont icon-tishi_tips"></p>
          <p>
            <!-- 探子回报 -->
            {{ $t("project_info.intell_title") }}
          </p>
          <span v-if="data.event_count > 0">{{ data.event_count }}</span>
        </div>
        <p class="oper-line"></p>
        <el-popover
          v-model="viewAndDown"
          placement="bottom"
          min-width="105"
          trigger="hover"
        >
          <ul class="view-choice">
            <li
              @click.stop="
                goPDF($flag ? data.mobile_pdf : data.pdf, 1, data.id)
              "
            >
              <!-- 查看研报 -->
              {{ $t("project_info.view_reports") }}
            </li>
            <li></li>
            <li @click.stop="downPDF(data.pdf, 1, data.id, data.is_new_pdf)">
              <!-- 下载研报 -->
              {{ $t("project_info.down_load") }}
            </li>
          </ul>
          <!-- @click="goPDF($flag ? data.mobile_pdf : data.pdf, 1, data.id)" -->
          <div slot="reference" class="oper-public">
            <p class="iconfont icon-shuqian_bookmark-one"></p>
            <p>
              <!-- 项目研报 -->
              {{
                $flag
                  ? $t("project_info.report_title_mobile")
                  : $t("project_info.report_title")
              }}
            </p>
          </div>
        </el-popover>
        <p class="oper-line"></p>
        <div
          class="oper-public"
          @click.stop="goProDetails(data.id, data.symbol, false)"
        >
          <p class="iconfont icon-shujubiao_data-sheet"></p>
          <p>
            <!-- 解析面板 -->
            {{ $t("project_info.face_title") }}
          </p>
        </div>
      </div>
      <div class="oper-box" v-else>
        <el-popover
          placement="top"
          trigger="hover"
          :content="$t('project_info.only_intell')"
          v-model="noRemarkIntell"
        >
          <div class="oper-public has-gone" slot="reference">
            <p class="iconfont icon-tishi_tips"></p>
            <p>
              <!-- 探子回报 -->
              {{ $t("project_info.intell_title") }}
            </p>
          </div>
        </el-popover>
        <p class="oper-line"></p>
        <el-popover
          v-model="viewAndDownOut"
          placement="bottom"
          min-width="105"
          trigger="hover"
        >
          <ul class="view-choice">
            <li
              @click.stop="
                goPDF($flag ? data.mobile_pdf : data.pdf, 1, data.id)
              "
            >
              <!-- 查看研报 -->
              {{ $t("project_info.view_reports") }}
            </li>
            <li></li>
            <li @click.stop="downPDF(data.pdf, 1, data.id, data.is_new_pdf)">
              <!-- 下载研报 -->
              {{ $t("project_info.down_load") }}
            </li>
          </ul>
          <div slot="reference" class="oper-public">
            <p class="iconfont icon-shuqian_bookmark-one"></p>
            <p>
              <!-- 项目研报 -->
              {{
                $flag
                  ? $t("project_info.report_title_mobile")
                  : $t("project_info.report_title")
              }}
            </p>
          </div>
        </el-popover>
        <p class="oper-line"></p>
        <el-popover
          v-model="noRemarkFace"
          placement="top"
          trigger="hover"
          :content="$t('project_info.only_interface')"
        >
          <div class="oper-public has-gone" slot="reference">
            <p class="iconfont icon-shujubiao_data-sheet"></p>
            <p>
              <!-- 解析面板 -->
              {{ $t("project_info.face_title") }}
            </p>
          </div>
        </el-popover>
      </div>
    </div>
    <!-- 图表标识 -->
    <div class="echarts-flag" v-if="data.charts_ids">

    </div>
    <!-- 无权限 -->
    <NoPermission v-if="data.permission == 0" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ProjectComs",
  props: ["data"],
  data() {
    return {
      viewAndDown: false,
      noRemarkIntell: false,
      viewAndDownOut: false,
      noRemarkFace: false,
    };
  },
  components: {
    NoPermission: (resolve) => require(["./no_permission.vue"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  mounted() {
    console.log(this.data)
    this.$flag && window.addEventListener("scroll", this.closeTooltip, true);
  },
  methods: {
    //查看PDF
    goPDF(_url, _type, _id) {
      this.$store.dispatch("setPoint", 6);
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      // const is_old = !is_new_pdf ? 1 : is_new_pdf == 1 ? 0 : 1;
      !this.$flag
        ? this.$store.dispatch("viewPDF", _url)
        : this.$cell
        ? this.$store.dispatch("viewPDF", _url)
        : window.viewPDF(_url);
    },
    //项目解析面板
    goProDetails(_id, _symbol, is_event) {
      this.$store.dispatch("setPoint", is_event ? 8 : 9);
      this.$store.commit("upIsGoEvent", is_event);
      this.$store.commit("upProjectID", _id);
      // console.log(_title,_symbol)
      this.$router.push({
        path: this.$flag
          ? "/mobile-project-details"
          : "/project/projectDetails",
        query: {
          id: _id,
          name: _symbol,
        },
      });
    },
    //标签跳转搜索
    goSearch(_val) {
      this.$emit("sendSearch", _val);
      window.goSearch(_val);
    },
    //下载研报
    downPDF(_url, _type, _id, is_new_pdf) {
      // console.log(is_new_pdf)
      // return
      const is_old = !is_new_pdf ? 1 : is_new_pdf == 1 ? 0 : 1;
      window.PDFLock(_type, _id, this.$flag ? 2 : 1, is_old);
    },
    closeTooltip() {
      this.viewAndDown = false;
      this.noRemarkIntell = false;
      this.viewAndDownOut = false;
      this.noRemarkFace = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-width: 0 !important;
}
.pro-con {
  padding: 24px;
  padding-bottom: 0;
  background: $contentBg;
  margin-bottom: 24px;
  border-radius: 4px;
  position: relative;
  .con-inner-top{
    position: relative;
    z-index: 200;
  }
  .echarts-flag{
    position: absolute;
    width: 100%;
    height: 270px;
    top:0;
    left:0;
    background: url('../../../assets/images/has_echarts.png');
    background-size: 100% 100%;
    z-index: 100;
  }
  .attention-change {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 12px;
    p {
      color: white;
    }
    background: $conBg2;
    padding: 4px 16px;
    border-radius: 0px 4px 0px 8px;
  }
  .pro-msg {
    display: flex;
    justify-content: space-between;
    .pro-icon-bg {
      width: 64px;
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: $mineBg;
      position: relative;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .start {
        position: absolute;
        padding: 2px 5px;
        border-radius: 4px;
        font-size: 12px;
      }
      .start-in {
        background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
        bottom: -10px;
        color: $titleColor;
        font-weight: bold;
        padding: 2px 9px;
      }
      .start-out {
        background: linear-gradient(90deg, #25345c 0%, #304270 100%);
        color: white;
        bottom: -10px;
        max-width: 50px;
        text-align: center;
      }
    }
    .pro-date {
      height: 64px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      p:first-child {
        line-height: 30px;
        font-size: 13px;
        color: white;
      }
      p:last-child {
        font-size: 12px;
        color: $remarkColor;
        text-align: right;
      }
    }
  }
  .pro-title {
    margin-top: 28px;
    font-size: 17px;
    font-weight: bold;
    color: white;
    margin-bottom: 8px;
  }
  .priods-and-race {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 40px;
    .issus-no {
      padding: 2px 8px;
      background: $info;
      font-size: 13px;
      border-radius: 4px;
      color: white;
      margin-right: 8px;
    }
    .race-tag {
      padding: 2px 8px;
      background: rgba(167, 240, 186, 0.1);
      border-radius: 4px;
      color: $success;
    }
    .child-tag {
      font-size: 16px;
      color: $remarkColor;
      transform: translateY(1px);
    }
    .race-tag-child {
      padding: 2px 8px;
      background: rgba(255, 212, 92, 0.1);
      border-radius: 4px;
      color: #ffd45c;
    }
  }
  .tag-list {
    font-size: flex;
    flex-wrap: wrap;
    min-height: 75px;
    span {
      display: inline-block;
      padding: 1px 8px;
      color: $textColor;
      font-size: 12px;
      background: $info;
      border-radius: 8px;
      margin-right: 8px;
      margin-bottom: 8px;
      cursor: pointer;
    }
  }
  .pro-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background: $mineBg;
    bottom: 82px;
    left: 0;
  }
  .oper-box {
    display: flex;
    height: 81px;
    margin-top: 26px;
    align-items: center;
    justify-content: space-around;
    .oper-line {
      width: 1px;
      height: 40px;
      background: $mineBg;
    }
    .has-gone {
      p {
        color: #49537a;
      }
      .iconfont {
        color: #49537a !important;
      }
    }
    .oper-public {
      text-align: center;
      font-size: 13px;
      color: $remarkColor;
      line-height: 14px;
      cursor: pointer;
      position: relative;
      outline: none;
      p {
        color: $remarkColor;
      }
      span {
        font-size: 12px;
        position: absolute;
        display: inline-block;
        text-align: center;
        line-height: 18px;
        background: $danger;
        color: white;
        top: -8px;
        right: 5px;
        width: 18px;
        border-radius: 50%;
      }
      .iconfont {
        font-size: 22px;
        margin-bottom: 9px;
        color: white;
      }
    }
  }
}
@media screen and (max-width: 1279px) {
  .pro-con {
    padding: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 0;
    .oper-box {
      margin-top: 0;
    }
  }
}
@media screen and (max-width: 1600px) {
  .pro-tent {
    max-width: none;
  }
}
</style>