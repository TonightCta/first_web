// 移动端登录
<template>
  <div class="login-mobile">
    <MobileNav :hiddenMenu="true">
      <p>
        <!-- 登录 -->
        {{ $t("public.login") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="inp-box">
        <img :src="require('@/assets/images/mobile/login.png')" alt="" />
        <p class="login-title">
          <!-- 手机号登录 -->
          {{ $t("login_box.login_mobile") }}
        </p>
        <p class="login-remark">
          <!-- 未注册用户将直接用手机注册为新账号 -->
          {{ $t("login_box.login_mobile_remark") }}
        </p>
        <div class="public-inp inp-phone">
          <span class="open-area-btn" @click="isOpenArea = true">
            <img
              class="open-area-btn"
              :src="areaCodeIcon"
              v-if="areaCodeIcon"
              alt=""
            />
            <font v-else>{{ areaCodeText }}</font>
            &nbsp;+<font class="open-area-btn">{{ areaCode }}</font
            >&nbsp;
            <i class="line open-area-btn"></i>
          </span>
          <input
            type="tel"
            maxlength="11"
            pattern="[0-9]*"
            v-model="phone"
            :placeholder="$t('setting.pls_enter_mobile')"
          />
          <!-- 请输入您的手机号 -->
          <div
            class="area-code-box"
            :class="isOpenArea ? 'open-area-chose' : ''"
          >
            <div class="search-area">
              <p class="search-icon">
                <i class="iconfont icon-sousuo_search"></i>
              </p>
              <p class="search-inp">
                <input
                  type="text"
                  :placeholder="$t('setting.search_fast')"
                  class="search-inp-inner"
                  v-model="searchAreaVal"
                />
                <!-- 快速搜索 -->
              </p>
            </div>
            <ul v-if="searchAreaCode.length == 0">
              <li
                class="area-code-list"
                v-for="(area, indexAreaIcon) in areaListWithIcon"
                :key="indexAreaIcon + 'icon'"
                @click="choseAreaWithIcon(indexAreaIcon)"
              >
                <div>
                  <p class="icon-box">
                    <img :src="area.icon" alt="" />
                  </p>
                  <p>{{ app.language == 'en' ? area.english_name : area.chinese_name }}</p>
                </div>
                <p class="area-num">+{{ area.phone_code }}</p>
              </li>
              <p class="area-line"></p>
              <li
                class="area-code-list"
                v-for="(area, indexArea) in areaList"
                :key="indexArea"
                @click="choseArea(indexArea)"
              >
                <div>
                  <p class="icon-box"></p>
                  <p>{{ app.language == 'en' ? area.english_name : area.chinese_name }}</p>
                </div>
                <p class="area-num">+{{ area.phone_code }}</p>
              </li>
            </ul>
            <!-- 搜索结果 -->
            <ul v-else>
              <li
                class="area-code-list"
                v-for="(area, indexAreaIcon) in searchAreaCode"
                :key="indexAreaIcon + 'icon'"
                @click="choseSearchCode(indexAreaIcon)"
              >
                <div>
                  <p class="icon-box">
                    <img :src="area.icon" alt="" v-if="area.icon" />
                  </p>
                  <p>{{ app.language == 'en' ? area.english_name : area.chinese_name }}</p>
                </div>
                <p class="area-num">+{{ area.phone_code }}</p>
              </li>
            </ul>
          </div>
        </div>
        <p class="public-inp inp-code">
          <input
            type="tel"
            pattern="[0-9]*"
            v-model="code"
            maxlength="6"
            :placeholder="$t('login_box.inp_code')"
          />
          <!-- 请输入您手机上收到的验证码 -->
          <button
            :disabled="phoneStatus"
            :style="{ color: phoneStatus ? '#A2A5B0' : '#a7f0ba' }"
            @click="sendCodeEvent"
          >
            {{ sendCodeText }}
          </button>
        </p>
        <p class="login-btn">
          <base-button
            type="info"
            round
            @click="loginInPhone"
            :loading="loadWait"
            :disabled="loadWait"
          >
            <!-- 登录 -->
            {{ $t("public.login") }}
          </base-button>
        </p>
        <p class="protocol-login" style="font-size: 0.75rem; margin-top: 1rem">
          <el-checkbox v-model="agree">
            <!-- 我已经阅读并同意   -->
            {{ $t("login_box.protocol_remark") }}
          </el-checkbox>
          <span
            style="color: #33b1ff; font-size: 0.75rem"
            @click="$router.push('/mobile-terms')"
          >
            <!-- 《头等仓注册服务协议》 -->
            {{ $t("login_box.protocol_one") }} </span
          >{{ app.language == 'en' ? '&nbsp;and&nbsp;' : '、' }}<span
            style="color: #33b1ff; font-size: 0.75rem"
            @click="$router.push('/mobile-protocol-two')"
          >
            <!-- 《隐私政策》 -->
            {{ $t("login_box.protocol_two") }}
          </span>
        </p>
      </div>
      <div class="other-link">
        <p>
          <span class="login-line"></span>
          <!-- 其他登录方式 -->
          {{ $t("login_box.other_way") }}
          <span class="login-line"></span>
        </p>
        <p class="wallet-login">
          <base-button type="default" round @click="linkWallet">
            <!-- 连接钱包 -->
            {{ $t("login_box.contact_wallet") }}
          </base-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { GetUrlKey } from "@/util/index";
import * as api from "@/request/api";
import axios from "axios";
import { mapState } from 'vuex';
export default {
  name: "LoginMobile",
  data() {
    return {
      outCode: null,
      phoneStatus: true, //手机号输入状态
      phone: "", //手机号
      code: "", //验证码
      sendCodeText: this.$t('login_box.send_code'),//发送验证码
      countdown: 59, //倒计时
      mobileTicket: null, //验证码回执
      loadWait: false,
      agree: true,
      isOpenArea: false, //区号选择
      areaListWithIcon: [
        {
          chinese_name: "中国",
          english_name: "China",
          phone_code: "86",
          icon: require("@/assets/images/area/86.png"),
        },
        {
          chinese_name: "中国澳门",
          english_name: "Macao, China",
          phone_code: "853",
          icon: require("@/assets/images/area/86.png"),
        },
        {
          chinese_name: "中国台湾",
          english_name: "Taiwan, China",
          phone_code: "886",
          icon: require("@/assets/images/area/86.png"),
        },
        {
          chinese_name: "中国香港",
          english_name: "Hong Kong, China",
          phone_code: "852",
          icon: require("@/assets/images/area/86.png"),
        },
        {
          chinese_name: "美国",
          english_name: "USA",
          phone_code: "1",
          icon: require("@/assets/images/area/1.png"),
        },
        {
          chinese_name: "俄罗斯",
          english_name: "Russia",
          phone_code: "7",
          icon: require("@/assets/images/area/7.png"),
        },
        {
          chinese_name: "加拿大",
          english_name: "Canada",
          phone_code: "1",
          icon: require("@/assets/images/area/1-1.png"),
        },

        {
          chinese_name: "新加坡",
          english_name: "Singapore",
          phone_code: "65",
          icon: require("@/assets/images/area/65.png"),
        },
        {
          chinese_name: "马来西亚",
          english_name: "Malaysia",
          phone_code: "60",
          icon: require("@/assets/images/area/60.png"),
        },
        {
          chinese_name: "英国",
          english_name: "UK",
          phone_code: "44",
          icon: require("@/assets/images/area/44.png"),
        },
        {
          chinese_name: "日本",
          english_name: "Japan",
          phone_code: "81",
          icon: require("@/assets/images/area/81.png"),
        },
        {
          chinese_name: "韩国",
          english_name: "South Korea",
          phone_code: "82",
          icon: require("@/assets/images/area/82.png"),
        },
      ],
      areaList: [], //区号列表
      areaCodeIcon: require("@/assets/images/area/86.png"), //国旗
      areaCode: "86", //区号
      areaCodeText: "", //国家代码
      searchAreaVal: null, //区号搜索关键词
      searchAreaCode: [],
    };
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
  },
  computed:{
    ...mapState(['app'])
  },
  created() {
    this.outCode = GetUrlKey("code", window.location.href);
    this.getCode();
  },

  watch: {
    phone(val) {
      val ? (this.phoneStatus = false) : (this.phoneStatus = true);
      // const phoneEval =
      //   /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      // if (val.length == 11) {
      //   if (phoneEval.test(val)) {
      //     this.phoneStatus = false;
      //   }
      // } else if (val.length > 11) {
      //   this.phone = this.phone.substr(0, 11);
      // } else {
      //   this.phoneStatus = true;
      // }
    },
    //搜索区号
    searchAreaVal(val) {
      const search = () => {
        let codeWithIcon = [];
        this.areaListWithIcon.forEach((e) => {
          if (
            e.chinese_name.indexOf(val) > -1 ||
            e.english_name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            e.phone_code.indexOf(val) > -1
          ) {
            codeWithIcon.push(e);
            this.searchAreaCode = codeWithIcon;
          }
        });
        this.areaList.forEach((e) => {
          if (
            e.chinese_name.indexOf(val) > -1 ||
            e.english_name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            e.phone_code.indexOf(val) > -1
          ) {
            codeWithIcon.push(e);
            this.searchAreaCode = codeWithIcon;
          }
        });
      };
      val && search();
      !val && (this.searchAreaCode = []);
    },
  },
  mounted() {
    document.addEventListener("click", (e) => {
      if (
        e.target.className !== "area-code-box" &&
        e.target.className !== "area-code-list" &&
        e.target.className !== "open-area-btn" &&
        e.target.className !== "iconfont icon-sousuo_search" &&
        e.target.className !== "search-icon" &&
        e.target.className !== "search-inp-inner"
      ) {
        this.isOpenArea = false;
      }
    });
  },
  methods: {
    getCode() {
      axios.get("/area.json").then((res) => {
        this.areaList = res.data;
      });
    },
    //连接钱包
    async linkWallet() {
      await this.$store.dispatch("loginIn");
    },
    //发送验证码
    async sendCodeEvent() {
      const params = {
        mobile: this.phone,
        scene: "login",
        area_code: this.areaCode,
      };
      await api.sendMobileCode(params).then((res) => {
        if (res.code != 2000) {
          this.$notify({
            type: "danger",
            message: res.msg,
          });
          return;
        }
        this.mobileTicket = res.data.ticket;
        this.$notify({
          type: "success",
          //验证码发送成功
          message: this.$t("notify.code_success"),
        });
        let settime = setInterval(() => {
          if (this.countdown == 0) {
            //发送验证码
            this.sendCodeText = this.$t('login_box.send_code');
            this.countdown = 59;
            this.phoneStatus = false;
            clearInterval(settime);
            return false;
          } else {
            this.phoneStatus = true;
            this.sendCodeText = this.countdown + "s";
            this.countdown--;
          }
        }, 1000);
      });
    },
    //手机号登录提交
    loginInPhone() {
      if (!this.phone) {
        this.$notify({
          type: "danger",
          //请输入正确的手机号
          message: this.$t('setting.enter_mobile_falied'),
        });
        return;
      }
      if (!this.code) {
        this.$notify({
          type: "danger",
          //请输入验证码
          message: this.$t('login_box.inp_code'),
        });
        return;
      }
      if (!this.mobileTicket) {
        this.$notify({
          type: "danger",
          //验证码错误
          message: this.$t('login_box.code_failed'),
        });
        return;
      }
      if (!this.agree) {
        this.$notify({
          type: "danger",
          //请阅读并同意头等仓注册服务协议
          message: this.$t("notify.need_protocol"),
        });
        return;
      }
      const submit = async () => {
        this.loadWait = true;
        const loginMsg = {
          mobile: this.phone,
          ticket: this.mobileTicket,
          code: this.code,
          area_code: this.areaCode,
          parent_code: GetUrlKey("code", window.location.href)
            ? GetUrlKey("code", window.location.href)
            : "",
          cooperateCode: GetUrlKey("coopcode", window.location.href)
            ? GetUrlKey("coopcode", window.location.href)
            : "",
        };
        const result = await api.phoneLogin(loginMsg);
        this.loadWait = false;
        if (result.code == 1003) {
          window.openFailed();
          return;
        }
        if (result.code != 2000) {
          this.$notify({
            type: "danger",
            message: result.msg,
          });
          return;
        }
        this.$store.dispatch("setAccount", result.data.data);
        this.$store.commit("upToken", result.data.token);
        this.$router.push("/");
        window.getAnn();
        window.getCodeStatus();
        this.$store.commit("upAliveName", "open-alive");
        window.isTip();
      };
      this.phone && this.code && submit();
    },
    //选择区号
    choseAreaWithIcon(_index) {
      this.areaCodeIcon = this.areaListWithIcon[_index].icon;
      this.areaCode = this.areaListWithIcon[_index].phone_code;
      this.isOpenArea = false;
    },
    choseArea(_index) {
      this.areaCodeIcon = "";
      this.areaCode = this.areaList[_index].phone_code;
      this.areaCodeText = this.areaList[_index].country_code;
      this.isOpenArea = false;
    },
    choseSearchCode(_index) {
      this.searchAreaCode[_index].icon
        ? (this.areaCodeIcon = this.searchAreaCode[_index].icon)
        : (this.areaCodeText = this.searchAreaCode[_index].country_code);
      this.areaCode = this.searchAreaCode[_index].phone_code;
      this.isOpenArea = false;
    },
  },
  beforeDestroy() {
    window.removeEventListener("click", () => {}, true);
  },
};
</script>

<style lang="scss" scoped>
.open-area-chose {
  height: 10.75rem !important;
  padding: 10px 8px !important;
  padding-top: 0 !important;
  opacity: 1 !important;
}
/deep/ .el-checkbox__label {
  font-size: $fon12;
  color: $textColor !important;
}
/deep/ .el-checkbox__inner {
  width: $fon14;
  height: $fon14;
  transform: translateY(-1px);
}
/deep/ .el-checkbox__inner::after {
  left: 4px;
  top: 1px;
}
.login-mobile {
  text-align: center;
  .view-inner-mobile {
    padding-top: $padd80 + 3rem;
  }
  img {
    width: $size48;
    height: $size48;
    margin-bottom: 1rem;
  }
  .login-title {
    font-size: $fon18;
    margin-bottom: 0.5rem;
  }
  .login-remark {
    font-size: $fon12;
    color: $remarkColor;
    padding:0 1rem $padd24;
  }
  .public-inp {
    display: flex;
    width: 75%;
    margin: 0 auto;
    border-bottom: 1px solid #242d52;
    margin-bottom: 0.5rem;
    position: relative;
    input {
      height: $size48;
      line-height: $size48;
      font-size: $fon12;
      background: $mineBg;
      color: $textColor;
      width: 60%;
    }
    input::placeholder {
      color: $remarkColor;
    }
  }
  .inp-phone {
    position: relative;
    span {
      display: flex;
      align-items: center;
      font-size: $fon12;
      color: white;
      // width: 5.5rem;
      img {
        width: $padd24;
        height: 1rem;
        margin-bottom: 0;
      }
      font {
        display: inline-block;
        // transform: translateY(1px);
      }
      .line {
        display: inline-block;
        width: 1px;
        height: 1rem;
        background: #242d52;
      }
    }
    input {
      padding-left: 0.5rem;
    }
    .area-code-box {
      position: absolute;
      width: 100%;
      background: white;
      border-radius: 4px;
      top: 3.3rem;
      z-index: 10;
      box-shadow: 0px 3px 6px rgba(11, 5, 26, 0.16);
      border: 1px solid $textColor;
      transition: 0.3s all;
      height: 0;
      padding: 0;
      overflow-y: hidden;
      opacity: 0;
      .search-area {
        height: 40px;
        width: 100%;
        display: flex;
        padding: 0 8px;
        border-bottom: 1px solid $textColor;
        margin-bottom: 10px;
        .search-icon {
          width: 26px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 4px;
          .iconfont {
            font-size: 16px;
            display: inline;
            margin: 0;
            color: $remarkColor;
          }
        }
        .search-inp {
          flex: 1;
          input {
            width: 100%;
            padding-left: 0;
            height: 100%;
            border: none;
            background: white;
            color: $titleColor;
          }
        }
      }
      ul {
        overflow-y: auto;
        height: 100%;
        .area-line {
          width: 100%;
          height: 1px;
          background: $textColor;
          margin: 1rem 0;
        }
        li {
          transition: 0.3s all;
          padding: 0 0.5rem;
          cursor: pointer;
          font-size: $fon12;
          div {
            display: flex;
            height: 100%;
            align-items: center;
            p {
              height: 100%;
              display: flex;
              align-items: center;
              font-size: $fon12;
            }
            p:last-child {
              color: #676c7a;
            }
          }
          display: flex;
          justify-content: space-between;
          height: 2.2rem;
          align-items: center;
          img {
            width: $fon20;
            height: $fon14;
            border-radius: 4px;
            margin-right: 8px;
            margin-bottom: 0;
          }
          .area-num {
            color: $titleColor;
          }
        }
        li:hover {
          background: #f0f2f5;
        }
      }
    }
  }
  .inp-code {
    justify-content: space-between;
    button {
      width: 6rem;
      font-size: $fon12;
      background: rgba(0, 0, 0, 0);
      border: 0;
      outline: none;
      color: $success;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .protocol-login {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
    align-items: center;
    margin: 0 auto;
  }
  /deep/ .el-checkbox {
    margin-bottom: 0 !important;
  }
  .login-btn {
    width: 75%;
    margin: 0 auto;
    margin-top: 1.2rem;
    button {
      font-size: $fon14;
      width: 100%;
    }
  }
  .other-link {
    width: 75%;
    margin: 0 auto;
    margin-bottom: $padd40;
    margin-top: 6rem;
    p {
      height: $fon20;
      font-size: $fon14;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: white;
      .login-line {
        width: 30%;
        height: 1px;
        background: #242d52;
        display: inline-block;
      }
      margin-bottom: $padd24;
      button {
        width: 100%;
      }
    }
    p:last-child {
      margin-bottom: 0;
      height: $padd40;
    }
  }
}
</style>