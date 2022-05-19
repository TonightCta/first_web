<!-- 验证码输入框 -->
<template lang="html">
  <div class="codeInp">
    <div class="input-wrapper" v-for="item in 6" :key="item">
      <input type="text"
        @paste="handlePaste"
        v-focus="(item - 1) === currentIndex"
        maxlength="1"
        onKeyUp="value=value.replace(/[\W]/g,'')"
        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
        onkeydown="if(event.keyCode==9){event.returnValue=false;}"
        @input="handleInput($event,(item-1))"
        @keyup.delete="onDelete($event,(item-1))"
        :style="{width:loSize + 'px',height:loSize + 'px',fontSize:loFont + 'px' }"
        v-model="code[item-1]"/>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as api from "@/request/api";
export default {
  props: ["size", "bind"],
  name: "CodeInp",
  data() {
    return {
      code: [],
      currentIndex: 0,
      loSize: 40,
      loFont: 18,
      flag: null,
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  directives: {
    focus: {
      componentUpdated: function (el, obj) {
        obj.value && el.focus();
      },
    },
  },
  created() {
    this.code = new Array(this.amount).fill("");
    this.flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    if (this.size) {
      this.loSize = this.size;
      this.loFont = this.size - 22;
    }
  },
  watch: {
    code(val) {
      if (val.length != 6) {
        this.$emit("detectCode", "3", "");
      }
    },
  },
  methods: {
    handleInput(e, index) {
      this.currentIndex = index;
      e.target.value = this.validateNumber(e.target.value);
      e.target.value !== "" && ++this.currentIndex;
      // this.loginA();
      // this.bindPlace()
      // this.bindInviteCode()
      this.bind && this.isByCode();
    },
    onDelete() {
      this.currentIndex = 0;
      this.code = [];
    },
    validateNumber(val) {
      return val.replace(/[\W]/g, "");
    },
    handlePaste(e) {
      e.preventDefault();
    },
    // getInpCode(e){
    //   console.log(e.Vue.config.keyCodes = {})
    // },
    //绑定邀请码
    async bindInviteCode() {
      const _code = this.code.join("");
      const error = () => {
        this.$notify({
          type: "danger",
          //请输入6推荐码
          message: this.$t('notify.pls_invite'),
        });
        this.$emit("cancelLoad");
      };
      if (_code.length == 6) {
        return new Promise(async (resolve, reject) => {
          const result = await api.bindCode({
            invite_code: _code.toUpperCase(),
          });
          if (result.code == 2000) {
            this.$notify({
              verticalAlign: "top",
              horizontalAlign: "center",
              type: "success",
              //绑定成功
              message: this.$t('notify.bind_success'),
            });
            resolve(result);
          } else {
            this.$notify({
              verticalAlign: "top",
              horizontalAlign: "center",
              type: "danger",
              message: result.msg,
            });
            this.$emit("cancelLoad");
          }
        });
      } else {
        error();
      }
    },
    //邀请是否可用
    async isByCode() {
      const _code = this.code.join("");
      const result = async () => {
        const result = await api.isByCode({ invite_code: _code });
        if (result.code == 2000) {
          this.$emit("detectCode", result.data.status, _code);
        }
      };
      if (_code.length == 6) {
        result();
      } else {
        this.$emit("detectCode", "3", _code);
      }
    },
    //创建邀请码
    async createCode() {
      const _code = this.code.join("");
      if (_code.length == 6) {
        const result = await api.createCode({
          invite_code: _code.toUpperCase(),
        });
        if (result.code == 2000) {
          //生成成功
          (this.flag == null && this.$message.success(this.$t('notify.creat_invite_success'))) ||
            this.$toast(this.$t('notify.creat_invite_success'));
          return result;
        } else {
          this.$message.error(result.msg);
          if (this.bind == 2) {
            this.$parent.$parent.loadingResult = false;
          } else if (this.bind == 1) {
            this.$parent.loadingResult = false;
          }
        }
      } else {
        //请输入6位邀请码
        (this.flag == null && this.$message.error(this.$t('notify.pls_inp_invite'))) ||
          this.$toast(this.$t('notify.pls_inp_invite'));
        if (this.bind == 2) {
          this.$parent.$parent.loadingResult = false;
        } else if (this.bind == 1) {
          this.$parent.loadingResult = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.codeInp {
  width: 100%;
  display: flex;
  justify-content: space-between;
  input {
    width: 60px;
    height: 60px;
    background: white;
    border: 1px solid #efefef;
    border-radius: 4px;
    text-align: center;
    font-size: 17px;
    color: $titleColor;
    font-weight: 500;
    text-transform: uppercase;
  }
  //   @media screen and (max-width: 1279px) {
  //     padding: 0 0.8rem;
  //     font-size: $font14;
  //     input {
  //       width: 1rem !important;
  //       height: 1rem !important;
  //       font-size: $font18 !important;
  //     }
  //   }
}
</style>
