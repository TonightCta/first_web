// 咨询详情
<template>
  <div class="details-service">
    <MobileNav>
      <p>
        <!-- 咨询详情 -->
        {{ $t("routes.en_details") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="details-inner">
        <!-- 咨询详情 -->
        <div class="details-msg" :class="msgOpen ? 'open-msg-box' : ''">
          <p class="title-msg" @click="msgOpen = !msgOpen">
            <!-- 咨询项目详情 -->
            {{ $t("work_details.pro_details") }}
            <span class="iconfont icon-xia_down"></span>
          </p>
          <div class="msg-box">
            <ul>
              <li>
                <p>
                  <!-- 项目名称 -->
                  {{ $t("month_vip.table_pro") }}
                </p>
                <p>{{ details.name }}({{ details.symbol }})</p>
              </li>
              <li>
                <p>
                  <!-- 工单号 -->
                  {{ $t("work_order.work_numer") }}
                </p>
                <p>{{ details.id }}</p>
              </li>
              <li>
                <p>
                  <!-- 手机 -->
                  {{ $t("public.mobile") }}
                </p>
                <p>
                  {{ details.mobile.substr(0, 3) }}****{{
                    details.mobile.substr(7, 11)
                  }}
                </p>
              </li>
              <li>
                <p>
                  <!-- 邮箱 -->
                  {{ $t("public.email") }}
                </p>
                <p>{{ details.email }}</p>
              </li>
              <li>
                <p>
                  <!-- 优先级 -->
                  {{ $t("pro_news.pri") }}
                </p>
                <p>
                  <span v-if="details.urgentrank_id == 1">
                    <!-- 普通处理 -->
                    {{ $t("pro_news.level_sub") }}
                  </span>
                  <span v-else>
                    <!-- 加急处理 -->
                    {{ $t("pro_news.level_two_remark") }}
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <!-- 消息通知 -->
                  {{ $t("pro_news.is_noti") }}
                </p>
                <p>
                  <span v-if="details.remind == 1">
                    <!-- 是 -->
                    {{ $t("public.yes") }}
                  </span>
                  <span v-else>
                    <!-- 否 -->
                    {{ $t("public.no") }}
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <!-- 是否公开 -->
                  {{ $t("pro_news.is_public") }}
                </p>
                <p>
                  <span v-if="details.public == 1">
                    <!-- 是 -->
                    {{ $t("public.yes") }}
                  </span>
                  <span v-else>
                    <!-- 否 -->
                    {{ $t("public.no") }}
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <!-- 创建时间 -->
                  {{ $t("work_details.creat_time") }}
                </p>
                <p>{{ details.create_time }}</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- 沟通记录 -->
        <div class="chat-box">
          <p class="chat-title">
            <!-- 沟通记录 -->
            {{ $t("work_details.talk_pass") }}
          </p>
          <div class="chat-box-inner">
            <ul>
              <li v-for="(i, index) in chatList" :key="index">
                <div class="user-text public-text" v-if="i.source == 1">
                  <p class="msg-box h4" v-if="i.type == 1">{{ i.message }}</p>
                  <p class="msg-box img-msg" v-if="i.type == 4">
                    <el-image
                      :src="i.message"
                      :preview-src-list="[i.message]"
                    ></el-image>
                  </p>
                  <p class="icon">
                    <span class="iconfont icon-yonghuliaotiantouxiang"></span>
                  </p>
                  <p class="user-msg">
                    <span class="h6">{{ i.create_time }}</span>
                    <span class="h5">
                      <!-- 用户 -->
                      {{ $t("work_details.me") }}
                    </span>
                  </p>
                </div>
                <div class="company-text public-text" v-else>
                  <p class="icon">
                    <span class="iconfont icon-kefuliaotiantouxiang"></span>
                  </p>
                  <p class="user-msg">
                    <span class="h5">
                      <!-- 分析师 -->
                      {{ $t("work_details.first") }}
                    </span>
                    <span class="h6">{{ i.create_time }}</span>
                  </p>
                  <p class="msg-box h4">{{ i.message }}</p>
                </div>
              </li>
              <!-- v-if="details.status == 3 || details.status == 4" -->
              <li
                class="service-end"
                v-if="details.status == 3 || details.status == 4"
              >
                <p class="h4">
                  <!-- 您的咨询工单已结束，感谢您的使用！ -->
                  {{ $t("work_details.work_end") }}
                </p>
              </li>
            </ul>
          </div>
          <!-- 发送消息 -->
          <div
            class="send-msg"
            v-if="details.status == 1 || details.status == 2"
          >
            <textarea
              :placeholder="$t('work_details.can_copy')"
              @paste="descImgPaste($event)"
              v-model="feedback"
            >
            <!-- 请输入反馈内容，截图后可直接在此处粘贴上传 -->
            </textarea>
            <div class="send-oper">
              <p class="iconfont icon-tupian_picture">
                <input type="file" accept="image/*" @change="turnImg" />
              </p>
              <p>
                <base-button type="info" round @click="sendMsg()">
                  <!-- 发送 -->
                  {{ $t("public.send") }}
                </base-button>
              </p>
            </div>
          </div>
        </div>
        <!-- 结束工单 -->
        <div
          class="end-service-inner"
          v-if="details.status != 3 && details.status != 4"
        >
          <base-button type="default" round @click="endService = true">
            <!-- 结束工单 -->
            {{ $t("work_details.end_btn") }}
          </base-button>
        </div>
        <!-- 咨询评价 -->
        <div class="eval-box" v-if="details.status == 3 || details.status == 4">
          <p class="eval-title">
            <!-- 咨询评价 -->
            {{ $t("work_details.evl_title") }}
          </p>
          <div class="un-eval" v-if="details.is_evaluate == 0">
            <p>
              <!-- 你尚未对此次咨询工单进行评价 -->
              {{ $t("work_details.un_vel") }}
            </p>
            <p @click="subEval = true">
              <!-- 立即评价 -->
              {{ $t("work_details.vel_now") }}
            </p>
          </div>
          <div class="has-eval" v-else>
            <ul>
              <li>
                <p>
                  <!-- 回复评价 -->
                  {{ $t("work_details.is_sat") }}
                </p>
                <p>
                  <span v-if="evalMsg.is_satisfied == 1">
                    <!-- 满意 -->
                    {{ $t("work_details.sat") }}
                  </span>
                  <span v-else>
                    <!-- 不满意 -->
                    {{ $t("work_details.un_sat") }}
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <!-- 问题是否解决 -->
                  {{ $t("work_details.is_solved") }}
                </p>
                <p>
                  <span v-if="evalMsg.is_solve == 1">
                    <!-- 已解决 -->
                    {{ $t("work_details.solved") }}
                  </span>
                  <span v-else>
                    <!-- 未解决 -->
                    {{ $t("work_details.un_solved") }}
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <!-- 反馈内容 -->
                  {{ $t("work_details.feed") }}
                </p>
                <p>
                  <span v-if="evalMsg.feeback != null">{{
                    evalMsg.feeback
                  }}</span>
                  <span v-else>
                    <!-- 未填写 -->
                    {{ $t("public.un_write") }}
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 发送图片 -->
    <modal :show.sync="imageBox" modalClasses="end-service-mobile">
      <div class="send-image">
        <img :src="previewUrl" alt="" />
        <p>
          <base-button
            type="dufault"
            round
            @click="
              imageBox = false;
              previewUrl = null;
              previewFile = null;
            "
          >
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <base-button type="info" round :loading="sendLoad" @click="sendImg">
            <!-- 发送图片 -->
            {{ $t("work_details.send_img") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- 结束咨询 -->
    <modal :show.sync="endService">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">
          <!-- 提示 -->
          {{ $t("public.reminder") }}
        </h5>
      </template>
      <div class="end-service-title">
        <p>
          <!-- 此操作将结束当前咨询，是否继续？ -->
          {{ $t("work_details.end_remark") }}
        </p>
        <p>
          <base-button type="default" round @click="endService = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <base-button type="info" round @click="endServiceSub">
            <!-- 确认 -->
            {{ $t("public.confirm") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- 提交评价 -->
    <modal
      :show.sync="subEval"
      modalContentClasses="sub-eval"
      modalClasses="login-box-modal"
    >
      <div class="sub-con">
        <p class="h4">
          <!-- 提交评价 -->
          {{ $t("work_details.sub_evl") }}
        </p>
        <p class="h5" :class="app.language == 'en' && 'h5-en'">
          <span>
            <!-- 是否满意 -->
            {{ $t("work_details.is_sat") }}
          </span>
          <span style="display:flex;">
            <base-radio name="1" class="mb-3" v-model="isSait">
              <!-- 满意 -->
              {{ $t("work_details.sat") }}
            </base-radio>
            <base-radio name="0" class="mb-3" v-model="isSait">
              <!-- 不满意 -->
              {{ $t("work_details.un_sat") }}
            </base-radio>
          </span>
        </p>
        <p class="h5" :class="app.language == 'en' && 'h5-en'">
          <span>
            <!-- 问题是否解决 -->
            {{ $t("work_details.is_solved") }}
          </span>
          <span style="display:flex;">
            <base-radio name="1" class="mb-3" v-model="isSlove">
              <!-- 已解决 -->
              {{ $t("work_details.solved") }}
            </base-radio>
            <base-radio name="0" class="mb-3" v-model="isSlove">
              <!-- 未解决 -->
              {{ $t("work_details.un_solved") }}
            </base-radio>
          </span>
        </p>
        <p class="h5 col-md-12 un-margin">
          <!-- 反馈内容 -->
          {{ $t("work_details.feed") }}
        </p>
        <p class="col-md-12">
          <textarea
            name=""
            id=""
            v-model="feeback"
            :placeholder="$t(`work_details.feed_holder`)"
            cols="30"
            rows="10"
          ></textarea>
        </p>
        <p class="col-md-12 oper-col">
          <base-button
            type="dufault"
            round
            @click="
              subEval = false;
              isSait = '1';
              isSlove = '1';
              feeback = '';
            "
          >
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span></span>
          <base-button
            type="info"
            round
            @click="subEvalEvent"
            :loading="subLoading"
            :disabled="subLoading"
          >
            <!-- 提交 -->
            {{ $t("public.confirm") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import GoEasy from "goeasy";
import * as qiniu from "qiniu-js";
import * as api from "@/request/api";
import { dataURLtoFile } from "@/util/index";
import { Modal, BaseRadio } from "@/components";
export default {
  name: "DetailsService",
  data() {
    return {
      msgOpen: false, //咨询内容展开状态
      details: {
        //详情
        mobile: "",
      },
      feedback: null, //反馈消息
      evalMsg: {}, //评价信息
      chatList: [],
      imageBox: false, //发送图片预览
      previewUrl: null, //预览地址
      previewFile: null, //选择文件
      sendLoad: false, //发送图片加载
      endService: false, //结束工单
      subEval: false, //提交评价
      subLoading: false, //提交loading
      isSait: "1", //是否满意
      isSlove: "1", //是否解决
      feeback: null, //评价反馈
    };
  },
  //   icon: "iconfont icon-xiaoyan_check-one",
  computed: {
    ...mapState(["app"]),
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    Modal,
    BaseRadio,
  },
  created() {
    this.getServiceDetails();
    this.getMsgList();
  },
  mounted() {
    this.goeasy = GoEasy.getInstance({
      host: "hangzhou.goeasy.io",
      appkey: "BC-2a7907b7a2a84350aca0f9669c114272",
    });
    this.goeasy.connect({
      onSuccess: () => {
        // console.log("连接成功");
      },
    });
    setTimeout(() => {
      this.goeasy.subscribe({
        channel: this.details.channel,
        onMessage: (message) => {
          let obj = JSON.parse(message.content);
          this.chatList.push(obj);
        },
        onSuccess: () => {
          // console.log("成功");
        },
        onFailed: (failed) => {
          // console.log(failed);
          // console.log("失败");
        },
      });
    }, 500);
  },
  methods: {
    //获取工单详情
    async getServiceDetails() {
      const result = await api.serviceDetails({ id: this.app.serviceID });
      this.details = result;
      this.getServiceEval();
    },
    //获取评价
    async getServiceEval() {
      const result = await api.getCom({ id: this.details.id });
      this.evalMsg = result;
    },
    //获取沟通记录
    getMsgList() {
      api.msgList({ id: this.app.serviceID }).then((res) => {
        this.chatList = res;
      });
    },
    //滚动
    scrollBot() {
      this.$nextTick(() => {
        let container = this.$el.querySelector(".chat-box-inner");
        container.scrollTop = container.scrollHeight;
      });
    },
    //获取七牛云Token
    async getQIToken() {
      const result = await api.qiToken().then((res) => {
        return res;
      });
      return result;
    },
    //发送消息
    sendMsg() {
      if (!this.feedback) {
        this.$notify({
          type: "danger",
          icon: "iconfont icon-guanbi_close-one",
          //不能发送空白消息
          message: this.$t("work_details.need_con"),
        });
      } else {
        const body = {
          id: this.app.serviceID,
          type: "1",
          message: this.feedback,
        };
        api.sendReplay(body).then((res) => {
          if (res.code == 2000) {
            this.feedback = "";
          }
        });
      }
    },
    //选择本地图片
    async turnImg(e) {
      let file = e.target.files[0];
      this.openChoseView(file);
    },
    //选中图片发送预览
    openChoseView(_file) {
      this.previewFile = _file;
      let reader = new FileReader();
      reader.readAsDataURL(_file);
      reader.onload = (result) => {
        this.previewUrl = result.target.result;
        this.imageBox = true;
      };
    },
    //获取粘贴图片
    descImgPaste(e) {
      let _this = this;
      if (event.clipboardData || event.originalEvent) {
        let clipboardData =
          event.clipboardData || event.originalEvent.clipboardData;
        if (clipboardData.items) {
          let blob;
          for (let i = 0; i < clipboardData.items.length; i++) {
            if (clipboardData.items[i].type.indexOf("image") !== -1) {
              blob = clipboardData.items[i].getAsFile();
            }
          }
          let render = new FileReader();
          render.onload = async (evt) => {
            //获取base64编码
            let base64 = evt.target.result;
            // console.log(this.pasteImg)
            let Num = "";
            for (var i = 0; i < 6; i++) {
              Num += Math.floor(Math.random() * 10);
            }
            this.pasteImg = dataURLtoFile(base64, Num);
            this.openChoseView(this.pasteImg);
          };
          if (blob) {
            render.readAsDataURL(blob);
          }
        }
      }
    },
    //发送图片消息
    async sendImg() {
      let _this = this;
      _this.sendLoad = true;
      let Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      const tokenQI = await this.getQIToken();
      if (!tokenQI.token) {
        return;
      }
      const observer = {
        next(res) {
          // console.log(res);
          // ...
        },
        error(err) {
          // console.log(err);
        },
        complete(res) {
          let url = "https://hodlup.first.vip/" + res.key;
          api
            .sendReplay({ id: _this.app.serviceID, type: "4", message: url })
            .then((res) => {
              if (res.code == 2000) {
                _this.feedback = null;
                _this.$notify({
                  type: "success",
                  //发送成功
                  message: _this.$t("notify.send_success"),
                });
                _this.imageBox = false;
                _this.sendLoad = false;
              } else {
                _this.sendLoad = false;
              }
            });
          // ...
        },
      };
      const observable = qiniu.upload(
        this.previewFile,
        Num + ".png",
        tokenQI.token
      );
      const subscription = observable.subscribe(observer); // 上传开始
    },
    // 结束工单
    endServiceSub() {
      api.endWork({ id: this.app.serviceID }).then((res) => {
        if (res.code == 2000) {
          this.$notify({
            type: "success",
            //结束工单成功
            message: this.$t("notify.end_work"),
            icon: "iconfont icon-xiaoyan_check-one",
          });
          this.getServiceDetails();
          this.endService = false;
          //   this.subEval = true;
        } else {
          this.$notify({
            type: "danger",
            message: res.msg,
          });
        }
      });
    },
    //提交评价
    async subEvalEvent() {
      this.subLoading = true;
      const evalMsg = {
        id: this.details.id,
        satisfied: this.isSait,
        solved: this.isSlove,
        message: this.feeback,
      };
      const result = await api.subCom(evalMsg);
      this.subLoading = false;
      if (result.code == 2000) {
        this.subEval = false;
        this.isSait = "1";
        this.isSlove = "1";
        this.feeback = "";
        this.$notify({
          verticalAlign: "top",
          type: "success",
          horizontalAlign: "center",
          //评价成功
          message: this.$t("notify.evl_success"),
        });
        this.getServiceDetails();
      }
    },
  },
  updated() {
    this.scrollBot();
  },
};
</script>

<style lang="scss" scoped>
.view-inner-mobile {
  padding: 4rem 1rem;
}
.open-msg-box {
  .title-msg {
    .iconfont {
      display: inline-block;
      transform: rotate(180deg);
    }
  }
  .msg-box {
    transform: translateY(0) !important;
    height: 14.25rem !important;
    padding: $padd24 !important;
    ul {
      opacity: 1 !important;
    }
  }
}
.details-inner {
  .details-msg {
    width: 100%;
    overflow: hidden;
    .title-msg {
      height: $padd40;
      background: $conBg2;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      font-size: $fon12;
      color: white;
      position: relative;
      z-index: 200;
      .iconfont {
        color: $lineColor;
        font-size: 1rem;
        margin-left: 0.5rem;
        transition: 0.3s all;
      }
    }
    .msg-box {
      width: 100%;
      background: $contentBg;
      border-radius: 0 0 4px 4px;
      transition: 0.5s all;
      position: relative;
      z-index: 100;
      transform: translateY(-100%);
      height: 0;
      padding: 0;
      overflow: hidden;
      ul {
        opacity: 0;
        transition: 0.3s all;
        li {
          display: flex;
          justify-content: space-between;
          color: $remarkColor;
          margin-bottom: $fon12;
          p {
            font-size: $fon12;
          }
          p:last-child {
            color: white;
          }
        }
        li:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .chat-box {
    margin-top: 1rem;
    border: 1px solid $conBg2;
    border-radius: 4px;
    .chat-title {
      font-size: $fon12;
      height: $padd40;
      width: 100%;
      background: $conBg2;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
    }
    .chat-box-inner {
      height: 26rem;
      background: $contentBg;
      overflow-y: auto;
      ul {
        padding: 0 1rem;
        li:first-child {
          margin-top: 1rem + $padd40;
        }
        li {
          margin-bottom: 2.5rem;
          .public-text {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            // height: 54px;
            position: relative;
            .h4 {
              font-size: $fon12;
            }
            .user-msg {
              position: absolute;
              top: -$padd24;
              right: 3rem;
              .h6 {
                color: $remarkColor;
                margin-right: 8px;
              }
              .h5 {
                color: $textColor;
              }
            }
            .icon {
              width: 2.18rem;
              height: 2.18rem;
              background: #f5f6fa;
              border-radius: 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid #353e66;
              span {
                color: #c5cbe0;
              }
              .icon-yonghuliaotiantouxiang {
                font-size: $padd24;
              }
              .icon-kefuliaotiantouxiang {
                font-size: $padd24;
              }
            }
            .msg-box {
              padding: 1rem;
              background: $conBg2;
              max-width: 15.6rem;
              border-radius: $fon12 0px $fon12 $fon12;
              margin-right: $fon12;
              margin-bottom: 0;
              line-height: 1.3rem;
              white-space: pre-wrap;
              color: $textColor;
              word-break: break-all;
            }
          }
          .company-text {
            justify-content: flex-start;
            .icon {
              background: #304270;
            }
            .user-msg {
              left: 3rem;
              .h5 {
                margin-right: 0.5rem;
              }
            }
            .msg-box {
              margin-left: $fon12;
              background: #304270;
              border-radius: 0px $fon12 $fon12 $fon12;
            }
          }
          .user-text {
            .icon {
              background: #242d52;
            }
          }
        }
      }
      .service-end {
        // width: auto;
        height: $size48;
        margin: 0 auto;
        text-align: center;
        margin-bottom: $padd24;
        p {
          line-height: 3rem;
          border-radius: $fon12;
          font-size: $fon12;
          display: inline-block;
          background: rgba(167, 240, 186, 0.1);
          padding: 0 0.5rem;
          color: $success;
          // margin: 0;
        }
      }
    }
    .send-msg {
      background: $contentBg;
      border-top: 1px solid $conBg2;
      padding-bottom: 1rem;
      textarea {
        width: 100%;
        height: 5.25rem;
        background: $contentBg;
        outline: none;
        border: 0;
        font-size: $fon12;
        padding: 1rem;
        color: $textColor;
      }
      .iconfont {
        position: relative;
        input {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
      }
      .send-oper {
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
        align-items: center;
        .iconfont {
          font-size: $fon20;
        }
      }
    }
  }
  .end-service-inner {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: $padd40 0;
  }
  .eval-box {
    margin-top: 1rem;
    padding: $padd24;
    background: $contentBg;
    border-radius: 4px;
    .eval-title {
      font-size: $fon14;
      margin-bottom: $padd24;
    }
    .un-eval {
      width: 100%;
      height: $size48;
      background: $conBg2;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: $fon12;
      justify-content: space-between;
      padding: 0 1rem;
      p:last-child {
        color: $success;
      }
    }
    .has-eval {
      ul {
        li {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          p {
            font-size: $fon12;
            color: $remarkColor;
          }
          p:last-child {
            color: white;
          }
        }
      }
    }
  }
}
.send-image {
  img {
    width: 100%;
  }
  p {
    display: flex;
    justify-content: space-between;
  }
}
.end-service-title {
  p {
    font-size: $fon14;
    color: $titleColor;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
  }
  p:last-child {
    margin-bottom: 0;
  }
}
.sub-eval {
  .sub-con {
    margin-bottom: 0.5rem;
    color: $textColor;
    p {
      color: $textColor !important;
    }
    .h4 {
      text-align: center;
      font-weight: bold;
      margin-top: $padd24;
    }
    .h5 {
      display: flex;
      height: $fon18;
      align-items: center;
      margin-bottom: 26px;
      /deep/ .mb-3,
      .my-3 {
        margin-bottom: 0.1rem !important;
        margin-right: 1rem;
      }
      /deep/ .form-check-label {
        color: $textColor;
      }
      span:first-child {
        display: inline-block;
        width: 5rem;
        margin-right: 1rem;
      }
    }
    .un-margin{
      margin-bottom: .5rem;
    }
    .h5-en{
      span:first-child{
        white-space: nowrap;
      }
      height: auto;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .col-md-12 {
      padding: 0;
      textarea {
        height: 6.25rem;
        resize: none;
        outline: none;
        font-size: $fon12;
        width: 100%;
        border: 1px solid #353e66;
        background: rgba(0, 0, 0, 0);
        color: white;
        box-sizing: border-box;
        padding: 0.6rem $fon18;
      }
    }
    .oper-col {
      display: flex;
      justify-content: center;
      margin-bottom: $padd24;
      margin-top: 0.6rem;
      span {
        display: inline-block;
        width: $padd24;
      }
    }
  }
}
</style>