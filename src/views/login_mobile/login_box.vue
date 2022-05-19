// 手机号登录
<template>
  <div>
    <div class="phone-login-box">
      <modal :show.sync="phoneLoginBox" modalClasses="login-box-modal">
        <div class="login-box-modal-con">
          <img :src="require('@/assets/images/phoneLogin.png')" alt="" />
          <p class="h4">
            <!-- 手机号登录 -->
            {{ $t("login_box.login_mobile") }}
          </p>
          <p class="h5" v-if="app.language != 'en'">
            <!-- 未注册用户将直接用手机注册为新账号 -->
            {{ $t("login_box.login_mobile_remark") }}
          </p>
          <div class="inp-phone form-row">
            <p class="label">
              <!-- 手机号 -->
              {{ $t("login_box.login_number") }}
            </p>
            <p class="phone-inp" :class="{ 'has-danger-me': phoneFaild }">
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
                type="number"
                maxlength="11"
                v-model="phone"
                :placeholder="app.language == 'en' ? '' : $t('public.phone_number')"
              />
            </p>
            <p class="error" v-if="phoneFaild">
              <!-- 请输入正确的手机号 -->
              {{ $t("login_box.login_inp_failed") }}
            </p>
            <button
              :disabled="phoneStatus"
              :style="{ color: phoneStatus ? '#A2A5B0' : '#0F62FE' }"
              @click="sendCodeEvent()"
            >
              {{ sendCodeText }}
            </button>
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
                    <p>
                      {{
                        app.language == "en"
                          ? area.english_name
                          : area.chinese_name
                      }}
                    </p>
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
                    <p>
                      {{
                        app.language == "en"
                          ? area.english_name
                          : area.chinese_name
                      }}
                    </p>
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
                    <p>
                      {{
                        app.language == "en"
                          ? area.english_name
                          : area.chinese_name
                      }}
                    </p>
                  </div>
                  <p class="area-num">+{{ area.phone_code }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="inp-code form-row">
            <p class="label">
              <!-- 验证码 -->
              {{ $t("login_box.login_code") }}
            </p>
            <p :class="{ 'has-danger-me': codeFaild }">
              <input
                type="number"
                maxlength="6"
                onKeyUp="if(value.length>6)value=value.slice(0,6)"
                v-model="code"
                :placeholder="app.language == 'en' ? '' : $t('login_box.inp_code')"
              />
            </p>
            <p class="error" v-if="codeFaild">{{ codeError }}</p>
          </div>
          <p style="margin-top: 1rem" class="protocol-login">
            <el-checkbox v-model="agree">
              <!-- 我已经阅读并同意 -->
              {{ $t("login_box.protocol_remark") }}
            </el-checkbox>
            <span
              style="color: #33b1ff; font-size: 0.75rem; cursor: pointer"
              @click="$refs.termspc.termsServiceBox = true"
            >
              <!-- 《头等仓注册服务协议》 -->
              {{ $t("login_box.protocol_one") }} </span
            >{{ app.language == "en" ? "&nbsp;and&nbsp;" : "、&nbsp;"
            }}<span
              style="color: #33b1ff; font-size: 0.75rem; cursor: pointer"
              @click="$refs.termspc.termsServiceBoxTwo = true"
            >
              <!-- 《隐私政策》 -->
              {{ $t("login_box.protocol_two") }}
            </span>
            <!-- termsServiceBoxTwo -->
          </p>
          <div class="submit-btn">
            <base-button
              type="default"
              round
              @click="
                phoneLoginBox = false;
                phoneFaild = false;
                codeFaild = false;
                loginText = $t('public.login');
                isTry = false;
                phone = '';
                countdown = 0;
                code = '';
                clearUnClose();
              "
            >
              <!-- 取消 -->
              {{ $t("public.cancel") }}
            </base-button>
            <span></span>
            <base-button
              type="info"
              round
              @click="loginInPhone"
              :loading="loginLoading"
              :disabled="loginLoading"
              >{{ loginText }}</base-button
            >
          </div>
          <p class="try-again" v-if="isTry">
            由于每个账号只限同时登录两台设备，您当前已登录2台设备，请先退出其中一台设备，才可登录当前设备。
          </p>
        </div>
      </modal>
    </div>
    <!-- 注册协议 -->
    <TermsPc ref="termspc" />
  </div>
</template>

<script>
import * as api from "@/request/api";
import axios from "axios";
import { BaseDropdown, Modal, BaseInput } from "@/components";
import { GetUrlKey } from "@/util/index";
import { mapState } from "vuex";
export default {
  data() {
    return {
      phoneLoginBox: false, //手机号登录
      phoneFaild: false, //手机号错误
      phone: "", //登录手机号
      codeFaild: false, //验证码错误
      code: "", //验证码
      phoneStatus: true, //手机号输入状态
      mobileTicket: null, //验证码回执
      countdown: 59, //验证码读秒
      loginLoading: false,
      agree: true,
      isOpenArea: false, //区号选择

      isTry: false, //再试一次说明
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
      sendCodeText:this.$t("login_box.send_code")
    };
  },
  components: {
    BaseDropdown,
    Modal,
    BaseInput,
    TermsPc: (resolve) => require(["@/comsmine/terms_pc"], resolve),
  },
  computed: {
    ...mapState(["app"]),
    //登录
    loginText() {
      return this.$t("public.login");
    },
    //请输入验证码
    codeError() {
      return this.$t("login_box.code_failed");
    },
  },
  watch: {
    //手机号输入监听
    phone(val, oldVal) {
      //国外手机号
      val ? (this.phoneStatus = false) : (this.phoneStatus = true);
      //国内手机号
      // const phoneEval =
      //   /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      // if (val.length == 11) {
      //   if (phoneEval.test(val)) {
      //     this.phoneFaild = false;
      //     this.phoneStatus = false;
      //   }
      // } else if (val.length > 11) {
      //   this.phone = this.phone.substr(0, 11);
      // } else {
      //   this.phoneStatus = true;
      // }
    },
    //验证码输入监听
    code() {
      this.codeFaild = false;
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
  created() {
    this.getCode();
  },
  mounted() {
    // 模拟外部点击
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
    if (GetUrlKey("code", window.location.href) && !this.$flag) {
      this.phoneLoginBox = true;
      localStorage.setItem("openSearchBox", true);
    }
  },
  methods: {
    getCode() {
      axios.get("/area.json").then((res) => {
        this.areaList = res.data;
      });
    },
    clearUnClose() {
      localStorage.removeItem("openSearchBox");
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
          // 验证码发送成功
          message: this.$t("notify.code_success"),
        });
        let settime = setInterval(() => {
          if (this.countdown == 0) {
            this.sendCodeText = this.$t("login_box.send_code");
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
        this.phoneFaild = true;
      } else {
        this.phoneFaild = false;
      }
      if (!this.code) {
        this.codeFaild = true;
      } else {
        this.codeFaild = false;
      }
      if (!this.mobileTicket) {
        this.codeFaild = true;
        this.codeError = this.$t("login_box.code_failed");
      } else {
        this.codeFaild = false;
      }
      if (!this.agree) {
        this.$notify({
          type: "danger",
          message: this.$t("login_box.need_read"),
        });
      }
      const submit = async () => {
        this.loginLoading = true;
        const loginMsg = {
          mobile: this.phone,
          ticket: this.mobileTicket,
          code: this.code,
          area_code: this.areaCode,
          parent_code: GetUrlKey("code", window.location.href)
            ? GetUrlKey("code", window.location.href)
            : "",
          cooperateCode: GetUrlKey("cooperateCode", window.location.href)
            ? GetUrlKey("cooperateCode", window.location.href)
            : "",
        };
        const result = await api.phoneLogin(loginMsg);
        this.loginLoading = false;
        if (result.code == 1001) {
          // 再试一次
          this.loginText = this.$t("login_box.try_again");
          this.isTry = true;
          return;
        } else if (result.code == 1003) {
          window.openFailed();
          this.phoneLoginBox = false;
          return;
        } else if (result.code != 2000) {
          this.$notify({
            type: "danger",
            verticalAlign: "top",
            horizontalAlign: "center",
            message: result.msg,
          });
          this.codeFaild = true;
          this.codeError = result.msg;
          return;
        }
        this.$store.dispatch("setAccount", result.data.data);
        this.$store.commit("upToken", result.data.token);
        localStorage.removeItem("openSearchBox");
        this.phoneLoginBox = false;
        // const { meal_id, is_distributor } = result.data.data;
        // is_distributor == 1
        //   ? this.$router.push("/channel-business")
        //   : this.$router.push(
        //       (meal_id == 3 && "/userCenter") ||
        //         (meal_id == 4 && "/userCenter") ||
        //         (meal_id == 1 &&
        //           this.app.account.one_day_try_status.status &&
        //           this.app.account.one_day_try_status.status == 1 &&
        //           "/userCenter") ||
        //         (meal_id == 0 && "/unVip") ||
        //         "/otherCenter"
        //     );
        window.getAnn();
        // this.$store.commit("upAliveName", "open-alive");
        window.getCodeStatus();
      };
      !this.phoneFaild && !this.codeFaild && this.agree && submit();
    },
  },
};
</script>

<style lang="scss" scoped>
.open-area-chose {
  height: 13.75rem !important;
  padding: 10px 8px !important;
  padding-top: 0 !important;
  opacity: 1 !important;
}
.login-box-modal-con {
  padding: 24px 24px 32px 24px;
  text-align: center;
  img {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
  .h4 {
    margin-bottom: 8px;
    color: $titleColor;
    font-weight: bold;
  }
  .h5 {
    color: $remarkColor;
    margin-bottom: 24px;
  }
  .form-row {
    text-align: left;
    display: flex;
    flex-direction: column;
    .label {
      font-size: 12px;
      color: #676c7a;
      margin-bottom: 4px;
    }

    input {
      height: 38px;
      width: 100%;
      border: 1px solid $textColor;
      border-radius: 4px;
      font-size: 13px;
      box-sizing: border-box;
      padding-left: 18px;
    }
    .error {
      font-size: 12px;
      color: #ff6666;
      margin-top: 4px;
    }
  }
  /deep/ .el-checkbox {
    margin-bottom: 0 !important;
  }
  /deep/ .el-checkbox__label {
    font-size: 12px;
    color: $titleColor;
  }
  /deep/ .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }
  /deep/ .el-checkbox__inner:after {
    top: 0;
    left: 4px;
  }
  .inp-phone {
    position: relative;

    input {
      padding-left: 80px;
    }
    span {
      display: flex;
      align-items: center;
      height: 38px;
      font-size: 12px;
      color: $lineColor;
      width: 60px;
      justify-content: space-around;
      position: absolute;
      top: 26px;
      left: 12px;
      cursor: pointer;
      img {
        width: 20px;
        height: 16px;
        margin: 0;
      }
      .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        background: $remarkColor;
      }
    }
    button {
      position: absolute;
      font-size: 12px;
      background: rgba(0, 0, 0, 0);
      border: 0;
      outline: none;
      right: 18px;
      top: 33px;
      color: #0f62fe;
    }
    .area-code-box {
      position: absolute;
      width: 100%;
      background: white;
      border-radius: 4px;
      top: 66px;
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
          margin: 16px 0;
        }
        li {
          transition: 0.3s all;
          padding: 0 8px;
          cursor: pointer;
          div {
            display: flex;
            height: 100%;
            align-items: center;
            p {
              height: 100%;
              display: flex;
              align-items: center;
              font-size: 14px;
            }
            p:last-child {
              color: #676c7a;
            }
          }
          display: flex;
          justify-content: space-between;
          height: 40px;
          align-items: center;
          img {
            width: 26px;
            height: 20px;
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
    margin-top: 24px;
  }
  .protocol-login {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    word-break: break-all;
  }
  .has-danger-me {
    input {
      border-color: #ff6666;
      color: #ff6666;
    }
  }
  .submit-btn {
    margin-top: 24px;
    display: flex;
    justify-content: space-around;
    span {
      display: inline-block;
      width: 24px;
    }
  }
  .try-again {
    font-size: 14px;
    text-align: left;
    color: $danger;
    line-height: 16px;
    margin-top: 12px;
  }
}
</style>