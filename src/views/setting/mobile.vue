<template>
  <div class="">
    <modal :show.sync="mobildEdit" modalClasses="login-box-modal">
      <div class="mobile-edit">
        <img :src="require('@/assets/images/setting/boxMobile.png')" alt="" />
        <p class="h4">
          {{
            workType == "1"
              ? $t("setting.bind_mobile")
              : $t("setting.change_mobile")
          }}
        </p>
        <div class="phone-box-before public-box" v-if="workType == 2">
          <p class="label">
            <!-- 原手机号码 -->
            {{ $t("setting.before_mobile") }}
          </p>
          <p>
            <input
              type="number"
              v-model="app.account.mobile"
              :placeholder="$t('public.phone_number')"
              disabled="disabled"
            />
            <!-- 请输入您的手机号 -->
          </p>
        </div>
        <div class="phone-box public-box">
          <p class="label">
            <!-- 手机号码 -->
            {{ $t("setting.mobile_number") }}
          </p>
          <div class="inp-inner">
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
              pattern="[0-9]*"
              :class="{ 'has-danger-mine': phoneFailed }"
              v-model="phone"
              :placeholder="$t('public.phone_number')"
              v-if="!$flag"
            />
            <!-- 请输入您的手机号 -->
            <input
              type="tel"
              pattern="[0-9]*"
              maxlength="11"
              :class="{ 'has-danger-mine': phoneFailed }"
              v-model="phone"
              :placeholder="$t('public.phone_number')"
              v-else
            />
            <!-- 请输入您的手机号 -->
            <!-- onKeyUp="if(value.length>11)value=value.slice(0,11)" -->
            <button
              :disabled="sendCodeStaus"
              :style="{ color: sendCodeStaus ? '#A2A5B0' : '#0f62fe' }"
              @click="sendCodeEvent"
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
          <p class="error" v-if="phoneFailed">
            <!-- 请输入正确的手机号 -->
            {{ $t("setting.enter_mobile_falied") }}
          </p>
        </div>
        <div class="code-box public-box">
          <p class="label">
            <!-- 验证码 -->
            {{ $t("login_box.login_code") }}
          </p>
          <p>
            <input
              type="number"
              onKeyUp="if(value.length>6)value=value.slice(0,6)"
              pattern="[0-9]*"
              maxlength="6"
              :class="{ 'has-danger-mine': codeFailed }"
              v-model="code"
              :placeholder="$t('setting.pls_enter_code')"
              v-if="!$flag"
            />
            <!-- 请输入您手机上收到的验证码 -->
            <input
              type="tel"
              v-else
              pattern="[0-9]*"
              onKeyUp="if(value.length>6)value=value.slice(0,6)"
              maxlength="6"
              :class="{ 'has-danger-mine': codeFailed }"
              v-model="code"
              :placeholder="$t('setting.pls_enter_code')"
            />
            <!-- 请输入您手机上收到的验证码 -->
          </p>
          <p class="error" v-if="codeFailed">{{ codeError }}</p>
        </div>
        <div class="oper-btn">
          <base-button type="default" round @click="mobildEdit = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <base-button
            type="info"
            round
            @click="submitBind"
            :loading="btnStatus"
            :disabled="btnStatus"
          >
            <!-- 确认 -->
            {{ $t("public.confirm") }}
          </base-button>
        </div>
      </div>
    </modal>
    <!-- 验证码数字键盘 -->
    <van-number-keyboard
      :show="mineBoardCode"
      v-model="code"
      theme="custom"
      :maxlength="6"
      :close-button-text="$t('setting.down')"
      @blur="mineBoardCode = false"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Modal } from "@/components";
import * as api from "@/request/api";
import axios from "axios";
export default {
  name: "MobileEdit",
  data() {
    return {
      mobildEdit: false,
      phone: "", //手机号
      phoneFailed: false, //手机号错误
      code: "", //验证码
      codeFailed: false, //验证码错误
      sendCodeStaus: true, //发送验证码禁用状态
      mobileTicket: null, //验证码回执
      sendCodeText: this.$t('login_box.send_code'),//发送验证码
      countdown: 59, //验证码读秒
      btnStatus: false, //按钮状态
      workType: "1",
      codeError: this.$t('login_box.code_failed'),//验证码错误
      mineBoardCode: false,
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
    Modal,
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    axios.get("/area.json").then((res) => {
      this.areaList = res.data;
    });
  },
  watch: {
    mobildEdit(val) {
      if (!val) {
        this.phone = "";
        this.code = "";
        this.countdown = 0;
        this.phoneFailed = false;
        this.codeFailed = false;
      }
    },
    code() {
      this.codeFailed = false;
    },
    phone(val) {
      val ? (this.sendCodeStaus = false) : (this.sendCodeStaus = true);
      // let mobileEval =
      //   /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      // if (val.length == 11) {
      //   if (mobileEval.test(val)) {
      //     this.phoneFailed = false;
      //     this.sendCodeStaus = false;
      //   }
      // } else if (val.length > 11) {
      //   this.phone = this.phone.substr(0, 11);
      // } else {
      //   this.sendCodeStaus = true;
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
    //获取操作类型
    getWorkType(_type) {
      /**
       * @param _type -> 1 绑定手机号
       * @param _type -> 2 更换手机号
       */
      this.workType = _type;
      this.mobildEdit = true;
    },

    //发送验证码
    async sendCodeEvent() {
      const sendMsg = {
        mobile: this.phone,
        scene: this.workType == "1" ? "mobile" : "changeMobile",
        area_code: this.areaCode,
      };
      await api.sendMobileCode(sendMsg).then((res) => {
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
            //发送验证码
            this.sendCodeText = this.$t('login_box.send_code');
            this.countdown = 59;
            this.sendCodeStaus = false;
            clearInterval(settime);
            return false;
          } else {
            this.sendCodeStaus = true;
            this.sendCodeText = this.countdown + "s";
            this.countdown--;
          }
        }, 1000);
      });
    },
    //提交绑定
    submitBind() {
      const submit = async () => {
        this.btnStatus = true;
        const bindMsg = {
          mobile: this.phone,
          ticket: this.mobileTicket,
          code: this.code,
          area_code: this.areaCode,
        };
        const result =
          this.workType == "1"
            ? await api.bindMobile(bindMsg)
            : await api.changeBindMobile(bindMsg);
        this.btnStatus = false;
        if (result.code != 2000) {
          this.$notify({
            type: "danger",
            message: result.msg,
          });
          this.codeFailed = true;
          this.codeError = result.msg;
          return;
        }
        this.$notify({
          type: "success",
          //换绑成功 & 换绑成功
          message:
            this.workType == "1"
              ? this.$t("notify.bind_success")
              : this.$t("notify.change_success"),
        });
        this.mobildEdit = false;
        api.userInfo().then((res) => {
          this.$store.dispatch("setAccount", res);
        });
      };
      if (!this.phone) {
        this.phoneFailed = true;
      }
      if (!this.code || !this.mobileTicket) {
        this.codeFailed = true;
      }
      const phoneStatus = this.phone;
      const codeStatus = Boolean(this.code) && Boolean(this.mobileTicket);
      phoneStatus && codeStatus && submit();
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
input:disabled {
  -webkit-text-fill-color: $titleColor;
}
.mobile-edit {
  text-align: center;
  padding: 24px 24px 8px 24px;
  img {
    width: 48px;
    height: 48px;
    margin-bottom: 24px;
  }
  .h4 {
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 24px;
  }
  .phone-box-before {
    margin-bottom: 24px;
  }
  .phone-box {
    position: relative;
    input {
      padding-left: 80px !important;
      padding-top: 2px !important;
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
      top: 0;
      left: 12px;
      cursor: pointer;
      font {
        display: inline-block;
        transform: translateY(1px);
      }
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
    .area-code-box {
      position: absolute;
      width: 100%;
      background: white;
      border-radius: 4px;
      top: 42px;
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
            padding-left: 0 !important;
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
  .public-box {
    text-align: left;
    .label {
      font-size: 12px;
      color: #676c7a;
      margin-bottom: 8px;
    }
    p,
    .inp-inner {
      position: relative;
      input {
        width: 100%;
        height: 38px;
        border: 1px solid $textColor;
        border-radius: 4px;
        font-size: 12px;
        color: $titleColor;
        box-sizing: border-box;
        padding-left: 18px;
        line-height: 38px;
      }
      .has-danger-mine {
        border-color: $danger;
        color: $danger;
      }
      input::placeholder {
        color: #a2a5b0 !important;
      }
      button {
        font-size: 12px;
        border: 0;
        outline: none;
        background: rgba(0, 0, 0, 0);
        position: absolute;
        right: 18px;
        top: 8px;
      }
    }
    .error {
      font-size: 12px;
      color: $danger;
      margin-top: 4px;
    }
  }
  .code-box {
    margin-top: 24px;
  }
  .oper-btn {
    margin-top: 24px;
    display: flex;
    justify-content: space-around;
  }
}
@media screen and (max-width: 1280px) {
  .mobile-edit {
    padding: 0;
    padding-top: $padd24;
    img {
      width: $size48;
      height: $size48;
      margin-bottom: 0.2rem;
    }
    .h4 {
      font-size: 1rem;
      margin-bottom: $padd24;
    }
    .public-box {
      .label {
        font-size: $fon12;
      }
      input {
        height: 2.3rem;
      }
    }
  }
}
</style>