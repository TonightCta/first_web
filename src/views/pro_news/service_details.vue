<template>
  <div class="service-details">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-tishi_tips-one"></span>
        <font
          v-html="
            app.language == 'en'
              ? `Due to the large number of enquiries, please submit one project once, and the researcher will only respond to the <span>project fundamentals</span>.`
              : `由于咨询数量较多，请一次只提交一个项目，且研究员只回复<span>项目的基本面</span>情况，敬请谅解`
          "
        ></font>
      </p>
    </div>
    <!-- 项目基本信息 -->
    <div class="service-msg">
      <p class="col-md-6 h5" style="marginbottom: 0">
        <!-- 项目名称 -->
        {{ $t("month_vip.table_pro") }}
      </p>
      <p class="col-md-6 right">
        <span class="iconfont icon-bianhao_id"></span>
        <!-- 工单号 -->
        {{ $t("work_order.work_numer") }}
        : <span>{{ details.id }}</span>
      </p>
      <p class="col-md-12">{{ details.name }}({{ details.symbol }})</p>
      <p class="col-md-3">
        <!-- 手机 -->
        {{ $t("public.mobile") }}
        ：<span>{{ details.mobile }}</span>
      </p>
      <p class="col-md-3">
        <!-- 邮箱 -->
        {{ $t("public.email") }}
        ：<span>{{ details.email }}</span>
      </p>
      <p class="col-md-3">
        <!-- 优先级 -->
        {{ $t("work_order.work_pri") }}
        ：<span>
          <span v-if="details.urgentrank_id == 1">
            <!-- 普通处理 -->
            {{ $t("pro_news.level_sub") }}
          </span>
          <span v-else>
            <!-- 加急处理 -->
            {{ $t("pro_news.level_two_remark") }}
          </span>
        </span>
      </p>
      <p class="col-md-3">
        <!-- 消息通知 -->
        {{ $t("pro_news.is_noti") }}
        ：<span>
          <span v-if="details.remind == 1">
            <!-- 是 -->
            {{ $t("public.yes") }}
          </span>
          <span v-else>
            <!-- 否 -->
            {{ $t("public.no") }}
          </span>
        </span>
      </p>
      <p class="col-md-3">
        <!-- 是否公开 -->
        {{ $t("pro_news.is_public") }}
        ：<span>
          <span v-if="details.public == 1">
            <!-- 是 -->
            {{ $t("public.yes") }}
          </span>
          <span v-else>
            <!-- 否 -->
            {{ $t("public.no") }}
          </span>
        </span>
      </p>
      <p class="col-md-3">
        <!-- 咨询时间 -->
        {{ $t("work_order.work_date") }}
        ：<span>{{ details.create_time }}</span>
      </p>
    </div>
    <!-- 沟通窗口 -->
    <div
      class="contact-box col-md-12"
      :class="{ heightDown: details.status == 3 || details.status == 4 }"
    >
      <div class="contact-title col-md-12 h4">
        <!-- 沟通记录 -->
        {{ $t("work_details.talk_pass") }}
      </div>
      <div class="contact-text col-md-12">
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
                  <!-- 我 -->
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
                  <!-- 头等仓 -->
                  {{ $t("work_details.first") }}
                </span>
                <span class="h6">{{ i.create_time }}</span>
              </p>
              <p class="msg-box h4" v-if="i.type == 1">{{ i.message }}</p>
              <a
                class="msg-box h4"
                target="_blank"
                :href="i.message"
                v-if="i.type == 3"
                >{{ i.message }}</a
              >
            </div>
          </li>
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
      <div
        class="send-box col-md-12"
        v-if="details.status == 1 || details.status == 2"
      >
        <p class="col-md-12 inp">
          <textarea
            name=""
            :placeholder="$t('work_details.can_copy')"
            @keydown="sendEnter($event)"
            @paste="descImgPaste($event)"
            v-model="feedback"
          >
          <!-- 请输入反馈内容，截图后可直接在此处粘贴上传 -->
          </textarea>
        </p>
        <p class="oper-box">
          <span class="up-image">
            <input type="file" accept="image/*" @change="turnImg" />
            <i class="iconfont icon-tupian_picture"></i>
          </span>
          <base-button type="default" round @click="endService = true">
            <!-- 结束工单 -->
            {{ $t("work_details.end_btn") }}
          </base-button>
          <span style="width: 24px"></span>
          <base-button type="info" round @click="sendMsg">
            <!-- 发送 -->
            {{ $t("public.send") }}
          </base-button>
        </p>
      </div>
    </div>
    <!-- 发送图片 -->
    <modal :show.sync="imageBox" modalClasses="send-image-box">
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
    <!-- 结束工单 -->
    <modal :show.sync="endService" modalClasses="end-service">
      <h5
        slot="header"
        style="fontweight: bold"
        class="modal-title"
        id="modal-title-default"
      >
        <!-- 提示 -->
        {{ $t("public.reminder") }}
      </h5>
      <div class="send-image">
        <p style="margin: 0; font-size: 14px; color: #222a42">
          <!-- 此操作将结束当前咨询，是否继续？ -->
          {{ $t("work_details.end_remark") }}
        </p>
        <p>
          <base-button type="default" round @click="endService = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <base-button type="info" round @click="endServiceSub">
            <!-- 确定 -->
            {{ $t("public.confirm") }}
          </base-button>
        </p>
      </div>
    </modal>
    <!-- 咨询评价 -->
    <div class="eval-box" v-if="details.status == 3 || details.status == 4">
      <p class="h4">
        <!-- 咨询评价 -->
        {{ $t("work_details.evl_title") }}
      </p>
      <div class="ant-eval" v-if="details.is_evaluate == 0">
        <p class="h5">
          <!-- 你尚未对此次咨询工单进行评价 -->
          {{ $t("work_details.un_vel") }}
          <span @click="subEval = true">
            <!-- 立即评价 -->
            {{ $t("work_details.vel_now") }}
          </span>
        </p>
      </div>
      <div class="has-eval" v-else>
        <p class="col-md-12 h5">
          <span>
            <!-- 是否满意 -->
            {{ $t("work_details.is_sat") }}
          </span>
          <font v-if="evalMsg.is_satisfied == 1">
            <!-- 满意 -->
            {{ $t("work_details.sat") }}
          </font>
          <font v-else>
            <!-- 不满意 -->
            {{ $t("work_details.un_sat") }}
          </font>
        </p>
        <p class="col-md-12 h5">
          <span>
            <!-- 问题是否解决 -->
            {{ $t("work_details.is_solved") }}
          </span>
          <font v-if="evalMsg.is_solve == 1">
            <!-- 已解决 -->
            {{ $t("work_details.solved") }}
          </font>
          <font v-else>
            <!-- 未解决 -->
            {{ $t("work_details.un_solved") }}
          </font>
        </p>
        <p class="col-md-12 h5">
          <span>
            <!-- 反馈内容 -->
            {{ $t("work_details.feed") }}
          </span>
          <font v-if="evalMsg.feeback != null">{{ evalMsg.feeback }}</font>
          <font v-else>
            <!-- 未填写 -->
            {{ $t("public.un_write") }}
          </font>
        </p>
      </div>
    </div>
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
        <p class="h5">
          <span>
            <!-- 是否满意 -->
            {{ $t("work_details.is_sat") }}
          </span>
          <base-radio name="1" class="mb-3" v-model="isSait">
            <!-- 满意  -->
            {{ $t("work_details.sat") }}
          </base-radio>
          <base-radio name="0" class="mb-3" v-model="isSait">
            <!-- 不满意 -->
            {{ $t("work_details.un_sat") }}
          </base-radio>
        </p>
        <p class="h5">
          <span>
            <!-- 问题是否解决 -->
            {{ $t("work_details.is_solved") }}
          </span>
          <base-radio name="1" class="mb-3" v-model="isSlove">
            <!-- 已解决 -->
            {{ $t("work_details.solved") }}
          </base-radio>
          <base-radio name="0" class="mb-3" v-model="isSlove">
            <!-- 未解决 -->
            {{ $t("work_details.un_solved") }}
          </base-radio>
        </p>
        <p class="h5 col-md-12">
          <!-- 反馈内容 -->
          {{ $t("work_details.feed") }}
        </p>
        <p class="col-md-12">
          <textarea
            name=""
            id=""
            v-model="feeback"
            :placeholder="$t('work_details.feed_holder')"
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
            {{ $t("public.submit") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { dataURLtoFile } from "@/util/index";
import { Modal, BaseRadio } from "@/components";
import GoEasy from "goeasy";
import * as qiniu from "qiniu-js";
import * as api from "@/request/api";
export default {
  name: "ServiceDetails",
  data() {
    return {
      goeasy: null,
      details: {
        name: "-",
        id: "-",
        mobile: "-",
        email: "-",
        urgentrank_id: "1",
        public: "1",
        remind: "1",
        create_time: "-",
      }, //工单详情
      chatList: [], //消息记录
      feedback: "", //反馈内容
      imageBox: false, //图片发送
      pasteImg: null,
      previewUrl: null, //发送图片预览
      previewFile: null, //发送图片文件
      sendLoad: false, //发送图片Loading
      bigView: null, //大图预览地址
      endService: false, //结束工单
      subEval: false, //提交评价
      isSait: "1", //是否满意
      isSlove: "1", //是否解决
      feeback: null, //评价反馈
      subLoading: false, //提交loading
      evalMsg: {
        feeback: "",
        is_satisfied: "1",
        is_solve: "1",
      },
    };
  },
  components: {
    Modal,
    BaseRadio,
  },
  computed: {
    ...mapState(["app"]),
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
    //获取沟通记录
    getMsgList() {
      api.msgList({ id: this.app.serviceID }).then((res) => {
        this.chatList = res;
      });
    },
    //滚动
    scrollBot() {
      this.$nextTick(() => {
        let container = this.$el.querySelector(".contact-text");
        container.scrollTop = container.scrollHeight;
      });
    },
    //发送消息
    sendMsg() {
      if (!this.feedback) {
        this.$notify({
          type: "danger",
          //不能发送空白消息
          message: this.$t('work_details.need_con'),
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
    //键盘发送事件
    sendEnter(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        this.sendMsg();
        return false;
      }
    },
    //选择本地图片
    async turnImg(e) {
      let file = e.target.files[0];
      this.openChoseView(file);
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
    //获取七牛云Token
    async getQIToken() {
      const result = await api.qiToken().then((res) => {
        return res;
      });
      return result;
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
                  message: _this.$t('notify.send_success'),
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
            message: this.$t('notify.end_work'),
          });
          this.getServiceDetails();
          this.endService = false;
          this.subEval = true;
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
          message: this.$t('notify.evl_success'),
        });
        this.getServiceDetails();
      }
    },
    //获取评价
    async getServiceEval() {
      const result = await api.getCom({ id: this.details.id });
      this.evalMsg = result;
    },
  },
  beforeDestroy() {
    this.goeasy.disconnect({
      onSuccess: function () {
        // console.log("GoEasy disconnect successfully.");
      },
      onFailed: function (error) {
        // console.log(
        //   "Failed to disconnect GoEasy, code:" +
        //     error.code +
        //     ",error:" +
        //     error.content
        // );
      },
    });
  },
  updated() {
    this.scrollBot();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .end-service{
  transform: translate(0,120%)!important;
}
h5 {
  color: #222a42 !important;
  font-weight: bold;
}
.heightDown {
  height: calc(800px - 140px) !important;
}
.service-details {
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: flex-start;
    padding-left: 24px;
    align-items: center;
    border-radius: 4px;
    .h4 {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      color: white;
      .iconfont {
        font-size: $iconSize;
        color: white;
        margin-right: 8px;
      }
      /deep/ span {
        color: $success;
        padding: 0 2px;
        font-weight: bold;
      }
    }
  }
  .service-msg {
    display: flex;
    padding: 24px 24px 6px 24px;
    background: $contentBg;
    margin-top: 16px;
    flex-wrap: wrap;
    border-radius: 4px;
    .col-md-6 {
      display: flex;
      align-items: center;
      color: $remarkColor;
      .iconfont {
        margin-right: 8px;
        font-size: 16px;
      }
    }
    .right {
      justify-content: flex-end;
      font-size: 13px;
    }
    .col-md-12 {
      font-size: 17px;
      color: $success;
      font-weight: bold;
      margin-top: 8px;
      margin-bottom: 56px;
    }
    .col-md-3 {
      font-size: 13px;
      color: $remarkColor;
      margin-bottom: 22px;
      span {
        color: $textColor;
      }
    }
  }
  .contact-box {
    height: 800px;
    background: $contentBg;
    padding: 0;
    border: 1px solid $conBg2;
    margin-top: 16px;
    border-radius: 4px;
    .contact-title {
      height: 60px;
      background: $conBg2;
      text-align: center;
      line-height: 60px;
      color: white;
      margin-bottom: 0;
    }
    .contact-text {
      height: 600px;
      overflow-y: auto;
      ul {
        li:first-child {
          margin-top: 45px;
        }
        li {
          margin-bottom: 54px;
          .public-text {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            // height: 54px;
            position: relative;
            .user-msg {
              position: absolute;
              top: -24px;
              right: 64px;
              .h6 {
                color: $remarkColor;
                margin-right: 8px;
              }
              .h5 {
                color: $textColor;
              }
            }
            .icon {
              width: 48px;
              height: 48px;
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
                font-size: 44px;
              }
              .icon-kefuliaotiantouxiang {
                font-size: 46px;
              }
            }
            .msg-box {
              padding: 16px;
              background: $conBg2;
              max-width: 640px;
              border-radius: 12px 0px 12px 12px;
              margin-right: 12px;
              margin-bottom: 0;
              line-height: 30px;
              white-space: pre-wrap;
              color: $textColor;
            }
            a {
              text-decoration: underline;
              color: $primary !important;
            }
          }
          .company-text {
            justify-content: flex-start;
            .icon {
              background: #304270;
            }
            .user-msg {
              left: 64px;
              .h5 {
                margin-right: 8px;
              }
            }
            .msg-box {
              margin-left: 12px;
              background: #304270;
              border-radius: 0px 12px 12px 12px;
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
        // width: 320px;
        max-width: 460px;
        height: 54px;
        background: rgba(167, 240, 186, 0.1);
        margin: 0 auto;
        text-align: center;
        margin-bottom: 40px;
        border-radius: 12px;
        p {
          line-height: 54px;
          color: $success;
          margin: 0;
        }
      }
    }
    .send-box {
      height: 140px;
      border-top: 1px solid $conBg2;
      padding: 0;
      .inp {
        height: 76px;
        padding: 0;
        textarea {
          resize: none;
          width: 100%;
          height: 100%;
          outline: none;
          border: 0;
          background: $contentBg;
          color: $textColor;
          font-size: 14px;
          box-sizing: border-box;
          padding: 24px;
        }
        textarea::placeholder {
          color: $remarkColor;
        }
        textarea:focus {
          border: none !important;
        }
      }
      .oper-box {
        display: flex;
        justify-content: flex-end;
        padding-right: 24px;
        position: relative;
        .up-image {
          position: absolute;
          width: 20px;
          height: 20px;
          left: 24px;
          bottom: 0;
          display: flex;
          justify-content: center;
          cursor: pointer;
          align-items: center;
          i {
            cursor: pointer;
            font-size: 20px;
          }
          input {
            cursor: pointer;
            opacity: 0;
            position: absolute;
            top: 0;
            left: -100px;
            background: red;
          }
        }
      }
    }
  }
}
.send-image {
  img {
    width: 452px;
    height: 240px;
  }
  p {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
  }
  .col-md-12 {
    margin: 0;
  }
}
.eval-box {
  margin-top: 16px;
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  .h4 {
    color: white;
    margin: 0;
  }
  .has-eval {
    margin-top: 16px;
    padding: 24px 0;
    background: $conBg2;
    p {
      color: $textColor;
      margin-bottom: 28px;
      span {
        color: $remarkColor;
        width: 155px;
        display: inline-block;
        margin-right: 30px;
      }
    }
    p:last-child {
      margin: 0;
    }
  }
  .ant-eval {
    height: 50px;
    background: $conBg2;
    margin-top: 16px;
    .h5 {
      color: $textColor;
      display: flex;
      justify-content: center;
      line-height: 50px;
      margin: 0;
      span {
        color: $success;
        margin-left: 24px;
        cursor: pointer;
      }
    }
  }
}
.sub-eval {
  .sub-con {
    margin-bottom: 8px;
    color: $textColor;
    p {
      color: $textColor !important;
    }
    .h4 {
      text-align: center;
      font-weight: bold;
      margin-top: 24px;
    }
    .h5 {
      display: flex;
      height: 18px;
      align-items: center;
      margin-bottom: 26px;
      /deep/ .mb-3,
      .my-3 {
        margin-bottom: 0.1rem !important;
        margin-right: 16px;
      }
      /deep/ .form-check-label {
        color: $textColor;
      }
      span {
        display: inline-block;
        min-width: 80px;
        margin-right: 16px;
      }
    }
    .col-md-12 {
      padding: 0;
      textarea {
        height: 100px;
        resize: none;
        outline: none;
        width: 100%;
        border: 1px solid #353e66;
        background: rgba(0, 0, 0, 0);
        color: white;
        box-sizing: border-box;
        padding: 10px 18px;
      }
    }
    .oper-col {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
      margin-top: 10px;
      span {
        display: inline-block;
        width: 24px;
      }
    }
  }
}
</style>