// 分享
<template>
  <div class="share-box">
    <div class="share-inner" ref="share_inner">
      <div class="share-title">
        <img :src="require('@/assets/images/share_logo.png')" alt="" />
      </div>
      <div class="bg-box"></div>
      <div class="share-content">
        <!-- 情报详情 -->
        <div class="content-box">
          <!-- 项目信息 -->
          <div class="pro-msg">
            <img :src="share_logo" alt="" />
            <div
              class="title-msg"
              :class="(share_type == 1 || share_type == 2) && 'other-title'"
            >
              <p class="two-elip">{{ share_title }}</p>
              <div style="display: flex; align-items: center">
                <p v-if="share_type == 1" class="other-msg">
                  <font>
                    <!-- 来自 -->
                    {{ $t("public.from") }} </font
                  ><span>{{ share_role }}</span> @{{ share_user }}
                </p>
                <p v-if="share_type == 2" class="other-msg">
                  <font>
                    <!-- 来自 -->
                    {{ $t("public.from") }} </font
                  ><span>{{
                    share_section
                      ? `${share_section}${$t("public.plate")}`
                      : $t("bureau_express.forum")
                  }}</span>
                </p>
                <p v-if="share_type == 3" class="other-msg">
                  <font>
                    <!-- 来自 -->
                    {{ $t("public.from") }} </font
                  ><span>Medium</span>
                </p>
                <p class="pub-date">
                  {{ share_date }}<span>{{ share_min }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="content-inner" v-html="share_abs"></div>
          <!-- 图片消息 -->
          <div class="img-msg" v-if="share_img_url">
            <img
              :src="img"
              alt=""
              v-for="(img, indexImg) in share_img_url"
              :key="indexImg"
            />
          </div>
          <!-- 推特转推内容 -->
          <div class="twitter-reweet" v-if="share_extendAbstract_zh">
            <div class="reweet-pro">
              <img :src="share_extend_avatar" alt="" />
              <div class="title-re">
                <p>{{ share_extend_name_date }}</p>
                <p>@{{ share_extend_nickname }}</p>
              </div>
            </div>
            <div class="content-inner" v-html="share_extendAbstract_zh"></div>
          </div>
        </div>
        <!-- 推特主题帖 -->
        <div class="continue-box" v-if="share_relations">
          <div v-for="(ti, indexTi) in share_relations" :key="indexTi">
            <p class="line"></p>
            <div class="content-inner" v-html="ti.abstract_zh"></div>
            <div class="img-msg" v-if="ti.img_url">
              <img
                :src="img"
                alt=""
                v-for="(img, indexImgCo) in ti.img_url"
                :key="indexImgCo"
              />
            </div>
          </div>
        </div>
        <!-- 研究员观点 -->
        <div class="ang-box" v-if="share_ang">
          <p>
            <!-- 研究员分析 -->
            {{ $t("bureau_express.ann_back") }}
          </p>
          <p>
            {{ share_ang }}
          </p>
        </div>
      </div>
      <div class="share-footer">
        <div class="qr-box" id="qr-box" ref="qrBox"></div>
        <div class="company-msg">
          <p>
            <!-- 头等仓情报局 -->
            {{ $t("public.bur_title") }}
          </p>
          <p>
            <!-- 推特、官博、交易所公告、论坛等有价值的信息，一个头等仓情报局搞定！ -->
            {{ $t("public.share_remark") }}
          </p>
        </div>
      </div>
    </div>
    <modal :show.sync="shareViewBox" modalClasses="share-priview-box">
      <div class="priview-box">
        <div class="source-box">
          <img :src="posterURL" alt="" />
        </div>
        <p v-if="!$flag">
          <base-button
            type="default"
            round
            @click="
              shareViewBox = false;
              posterURL = null;
              $refs.qrBox.innerHTML = '';
            "
          >
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
          <base-button type="info" round>
            <a href="" id="down_load">
              <!-- 保存本地 -->
              {{ $t("poster.down_loca") }}
            </a>
          </base-button>
        </p>
        <p class="mobile-remark" v-if="$flag">
          <span class="iconfont icon-guangbo_broadcast"></span>
          <!-- 长按缩略图保存 -->
          {{ $t("poster.click_loca") }}
        </p>
        <p
          class="mobile-close"
          v-if="$flag"
          @click="
            shareViewBox = false;
            posterURL = null;
            $refs.qrBox.innerHTML = '';
          "
        >
          <span class="iconfont icon-guanbi-xiao_close-small"></span>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { Loading } from "element-ui";
import { Modal } from "@/components";
import QRCode from "qrcode2";
import { mapState } from "vuex";
import { dataURLtoFile } from "@/util/index";
export default {
  data() {
    return {
      posterURL: null, //海报文件
      shareViewBox: false, //预览
      share_type: 99, //分享类型
      share_ang: null, //研究员观点
      share_abs: null, //分享内容
      share_logo: null, //分享logo
      share_title: null, //分享标题
      share_user: null, //推特账号
      share_date: null, //推特账号
      share_min: null, //推特账号
      share_role: null, //推特身份
      share_section: null, //论坛版块
      share_img_url: null, //推特图片消息
      share_extend_avatar: null, //推特转推头像
      share_extend_name_date: null, //推特转推名称
      share_extend_nickname: null, //推特转推地址
      share_extendAbstract_zh: null, //推特转推内容
      share_relations: null, //推特主题帖
      share_url: null, //分享链接
    };
  },
  components: {
    Modal,
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.app.account.code
      ? (this.share_url = `${process.env.VUE_APP_RESET}/#/index?code=${this.app.account.code}`)
      : (this.share_url = `${process.env.VUE_APP_RESET}/#/index?open=1`);
  },
  mounted() {
    // this.createQR();
  },
  methods: {
    //生成海报
    async createPoster(
      _type,
      _abs,
      _ang,
      _logo,
      _title,
      _date,
      _min,
      _user,
      _role,
      _section,
      _img_url,
      _extend_avatar,
      _extend_name_date,
      _extend_nickname,
      _extendAbstract_zh,
      _relations
    ) {
      await this.createQR();
      const options = {
        lock: true,
        text: `${this.$t("public.share_creat")}...`,
        //情报生成中
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      };
      const loading = Loading.service(options);
      this.share_type = _type;
      this.share_abs = _abs;
      this.share_ang = _ang;
      this.share_logo = _logo;
      this.share_title = _title;
      this.share_date = _date;
      this.share_min = _min;
      this.share_user = _user;
      this.share_role = _role;
      this.share_section = _section;
      this.share_img_url = _img_url;
      this.share_extend_avatar = _extend_avatar;
      this.share_extend_name_date = _extend_name_date;
      this.share_extend_nickname = _extend_nickname;
      this.share_extendAbstract_zh = _extendAbstract_zh;
      this.share_relations = _relations;
      setTimeout(() => {
        (window.html2canvas || html2canvas)(this.$refs.share_inner, {
          useCORS: true,
          dpi: window.devicePixelRatio * 2,
          scale: 1,
          y: window.pageYOffset,
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          //头等仓情报局情报分享
          let file = dataURLtoFile(dataURL, this.$t('public.share_filename'));
          // this.posterURL = dataURLtoFile(dataURL,'头等仓情报局情报分享');
          let reader = new FileReader();
          reader.readAsDataURL(file);
          if (this.posterURL != "") {
            reader.onload = (e) => {
              this.posterURL = e.target.result;
              // alert(this.posterURL);
            };
            this.shareViewBox = true;
            loading.close();
            setTimeout(() => {
              // this.openPriview = "open-preview";
              if (!this.$flag) {
                let OA = document.querySelector("#down_load");
                OA.download = this.$t('public.share_filename');
                OA.href = dataURL;
              }
            }, 300);
          }
        });
      }, 300);
    },
    //生成地址二维码
    async createQR() {
      let qrcode = new QRCode("qr-box", {
        width: 160,
        height: 160,
        text: this.share_url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .modal-dialog {
  width: 400px;
  max-width: 400px;
  margin: 0 auto;
  margin-top: -5%;
}
.share-inner {
  position: fixed;
  height: auto;
  width: 800px;
  background: #f3f4fa;
  top: -100%;
  left: -1000%;
  // top: -19800px;
  // left: 0;
  z-index: 4999;
  .share-title {
    width: 100%;
    height: 168px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 200;
    img {
      width: 400px;
      height: 60px;
    }
  }
  .bg-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 600px;
    background: url("../../../assets/images/share_bg.png");
    background-size: 100% 100%;
  }
  .share-content {
    padding: 40px;
    padding-top: 0;
    position: relative;
    min-height: 600px;
    z-index: 200;
    .type-title {
      padding: 20px 32px;
      background: rgba(51, 177, 255, 0.1);
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 64px;
      p:first-child {
        color: #1d9bf0;
        font-size: 28px;
        font-weight: bold;
        display: flex;
        align-items: center;
        .iconfont {
          font-weight: 400;
          font-size: 40px;
          margin-right: 16px;
        }
        font {
          display: inline-block;
          transform: translateY(2px);
        }
      }
      p:last-child {
        font-size: 28px;
        color: #898ea3;
        transform: translateY(2px);
        span {
          margin-left: 16px;
        }
      }
    }
    .pro-msg {
      display: flex;
      margin-bottom: 48px;
      img {
        width: 96px;
        height: 96px;
        border-radius: 50%;
      }
      .title-msg {
        margin-left: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .two-elip {
          font-size: 32px;
          font-weight: bold;
          color: #676c7a;
          line-height: 48px;
        }
        .other-msg {
          margin-top: 8px;
          font-size: 24px;
          color: #676c7a;
          font {
            font-size: 24px;
            color: $remarkColor;
            margin-right: 8px;
          }
          span {
            padding: 5px 16px;
            background: rgba(0, 204, 143, 0.1);
            color: #00cc8f;
            border-radius: 4px;
            font-size: 24px;
            margin-right: 16px;
          }
        }
        .pub-date {
          font-size: 24px;
          color: $remarkColor;
          margin-left: 24px;
          margin-top: 8px;
          span {
            margin-left: 8px;
          }
        }
      }
      .other-title {
        justify-content: flex-start;
      }
    }
    .content-box {
      padding: 40px 32px;
      background: white;
      border-radius: 16px;
      .twitter-reweet {
        margin-top: 48px;
        padding: 35px 24px;
        background: #f3f4fa;
        border: 1px solid #ccc;
        border-radius: 8px;
        .reweet-pro {
          display: flex;
          margin-bottom: 35px;
          img {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            margin-right: 16px;
          }
          .title-re {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            p:first-child {
              font-size: 24px;
              color: $titleColor;
            }
            p:last-child {
              font-size: 24px;
              color: $remarkColor;
            }
          }
        }
      }
    }
    .continue-box {
      div {
        position: relative;
        margin-top: 24px;
        padding: 40px 32px;
        background: white;
        border-radius: 8px;
        .line {
          width: 2px;
          height: 24px;
          background: #49537a;
          position: absolute;
          top: -24px;
          left: 50%;
          margin-left: -1px;
        }
        .content-inner {
          padding: 0;
        }
        .img-msg {
          padding: 0;
        }
      }
    }
    .content-inner {
      color: #676c7a;
      line-height: 48px;
      border-radius: 8px;
      font-size: 28px;
      margin-bottom: 32px;
      word-break: break-all;
      /deep/ h1 {
        color: #676c7a;
        margin: 16px 0;
        font-size: 40px;
        line-height: 78px;
      }
      /deep/ h2 {
        color: #676c7a;
        margin: 16px 0;
        font-size: 36px;
        line-height: 68px;
      }
      /deep/ h3 {
        color: #676c7a;
        margin: 16px 0;
        font-size: 32px;
        line-height: 58px;
      }
      /deep/ h4 {
        color: #676c7a;
        margin: 16px 0;
        font-size: 28px;
        line-height: 48px;
      }
      /deep/ h5 {
        color: #676c7a;
        margin: 16px 0;
        font-size: 28px;
        line-height: 48px;
      }
      /deep/ strong {
        color: #676c7a;
        margin: 16px 0;
      }
      /deep/ p {
        color: #676c7a;
        margin: 16px 0;
        font-size: 28px;
        word-break: break-all;
        line-height: 48px;
      }
      /deep/ ul {
        li {
          margin: 16px 0;
          font-size: 28px;
          color: #676c7a;
        }
      }
      /deep/ ol {
        li {
          margin: 16px 0;
          font-size: 28px;
          color: #676c7a;
        }
      }
      /deep/ img {
        margin: 16px 0;
      }
    }
    .ang-box {
      padding: 40px 32px;
      background: #00cc8f;
      border-radius: 8px;
      margin-top: 36px;
      p:first-child {
        font-size: 32px;
        color: white;
        font-weight: bold;
        margin-bottom: 24px;
      }
      p:last-child {
        font-size: 28px;
        color: white;
        line-height: 48px;
      }
    }
  }
  .share-footer {
    padding: 40px 32px;
    margin: 0 40px;
    background: white;
    z-index: 200;
    position: relative;
    border-radius: 16px;
    display: flex;
    margin-bottom: 48px;
    .qr-box {
      width: 160px;
      height: 160px;
      margin-right: 24px;
    }
    .company-msg {
      padding-top: 12px;
      flex: 1;
      p:first-child {
        font-size: 32px;
        font-weight: bold;
        color: $titleColor;
      }
      p:last-child {
        margin-top: 24px;
        line-height: 42px;
        color: $remarkColor;
        font-size: 24px;
      }
    }
  }
}

/deep/ .modal-body {
  padding: 0;
  width: 100%;
  margin: 0 auto;
}
/deep/ .modal-content {
  background: rgba(0, 0, 0, 0);
  box-shadow: none;
}
.priview-box {
  .source-box {
    width: 100%;
    max-height: 600px;
    overflow: auto;
    border-radius: 4px;
  }
  p {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    margin-top: 24px;
    a {
      color: white;
      font-weight: bold;
    }
  }
  @media screen and (min-width: 1279px) {
    // /deep/ .modal-dialog {
    //   transform: translate(0, 15%) !important;
    // }
    .source-box {
      height: 80vh !important;
    }
  }
  .mobile-remark {
    width: 12rem;
    height: $padd40;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f6fa;
    transform: translateY(-3rem);
    .iconfont {
      font-size: $padd24;
      color: $remarkColor;
      margin-right: 0.5rem;
    }
    font-size: $fon12;
    color: #4d4d4d;
    border-radius: $fon20;
    margin: 0 auto;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  }
  .mobile-close {
    width: 2rem;
    height: 2rem;
    padding: 0;
    border-radius: 50%;
    border: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    transform: translateY(-1rem);
    .iconfont {
      font-size: $padd24;
      color: white;
    }
  }
}
@media screen and (max-width: 1279px) {
  /deep/ .modal-dialog {
    margin-top: -10% !important;
  }
}
</style>