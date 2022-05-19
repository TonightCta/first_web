<template>
  <div class="contact-us">
    <div class="us-box">
      <p class="contact-title">
        <!-- 联系我们 -->
        {{ $t("index_nav.contact") }}
      </p>
      <p class="contact-remark">
        <!-- 如有任何疑问，您可以通过以下方式联系我们 -->
        {{ $t("index.contact.con_remark") }}
      </p>
      <p class="contact-line"></p>
      <div class="contact-msg">
        <ul>
          <li v-for="(way, indexW) in wayList" :key="indexW">
            <p class="iconfont" :class="[way.icon,way.url && 'with-hand']" @click="way.url && goSide(way.url)"></p>
            <p>{{ way.text }}</p>
          </li>
        </ul>
        <div class="wechat-box" v-if="app.language != 'en'">
          <div>
            <img :src="contactQR" alt="" />
            <p>
              <!-- 销售顾问&商务合作 -->
              {{ $t("index.contact.con_remark_2") }}
            </p>
          </div>
          <div>
            <img :src="require('@/assets/images/da_c.png')" alt="" />
            <p>
              <!-- 头等仓公众号 -->
              {{ $t("index.contact.con_remark_3") }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Foo />
  </div>
</template>

<script>
import { contactQR } from "@/request/api";
import { mapState } from 'vuex';
export default {
  name: "ContactUs",
  data() {
    return {
      contactQR: null,
    };
  },
  components: {
    Foo: (resolve) => require(["./footer_nav"], resolve),
  },
  computed: {
    ...mapState(['app']),
    wayList() {
      return [
        {
          icon: "icon-qingbaoju_tuite",
          text: '@firstvip61',
          url:'https://twitter.com/firstvip61'
        },
        {
          icon: "icon-weibo",
          text: this.$t('index.contact.weibo'),
          url:'https://weibo.com/u/7469273067?from=myfollow_all&is_all=1'
        },
        {
          icon: "icon-dizhi",
          text: this.$t("index.contact.con_address"),
        },
        {
          icon: "icon-youjian",
          text: "marketing@first.vip",
        },
      ];
    },
  },
  created() {
    const getQR = async () => {
      const result = await contactQR();
      this.contactQR = result.image;
    };
    getQR();
  },
  methods:{
    goSide(_url){
      window.open(_url)
    }
  }
};
</script>

<style lang="scss" scoped>
.contact-us {
  .us-box {
    margin: 0 19.5%;
  }
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background: url("../../assets/images/pageIcon/contact_bg.png");
  background-size: 100% 100%;
  .contact-title {
    font-size: 28px;
    color: $success;
    text-align: left;
    margin-bottom: 24px;
  }
  .contact-remark {
    font-size: 14px;
    margin-bottom: 80px;
  }
  .contact-line {
    width: 100%;
    height: 1px;
    background: #242d52;
    margin-bottom: 84px;
  }
  .contact-msg {
    display: flex;
    justify-content: space-between;
    ul {
      display: flex;
      flex-direction: column;
      li {
        width: 80%;
        margin-bottom: 50px;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 24px;
          color: $success;
        }
        .with-hand{
          cursor: pointer;
        }
        p{
          line-height: 24px;
        }
        p:last-child {
          font-size: 18px;
          margin-left: 26px;
          color: white;
          white-space: nowrap;
        }
      }
    }
    .wechat-box {
      display: flex;
      div {
        width: 160px;
        height: 160px;
        text-align: center;
        p {
          font-size: 14px;
          color: white;
          margin-top: 16px;
        }
      }
      div:first-child {
        margin-right: 80px;
      }
    }
    img {
      width: 160px;
      height: 160px;
    }
  }
}
@media screen and (max-width: 1279px) {
  .contact-us {
    padding: 8rem $padd24 0;
    .us-box {
      margin: 0;
      .contact-title {
        font-size: $fon18;
        margin-bottom: 1rem;
      }
      .contact-remark {
        font-size: $fon12;
        margin-bottom: $padd40;
        line-height: $fon18;
      }
      .contact-line {
        margin-bottom: 2.6rem;
      }
      .contact-msg {
        flex-direction: column;
        ul {
          li {
            margin-bottom: 1.6rem;
            .iconfont {
              font-size: $padd24;
            }
            p:last-child {
              margin-left: 1rem;
              font-size: $fon14;
              white-space: inherit;
            }
          }
          li:nth-child(2) {
            p:last-child {
              line-height: $padd24;
            }
          }
          li:last-child {
            margin-bottom: 0;
          }
        }
        .wechat-box {
          margin-top: $padd80;
          justify-content: space-around;
          div:first-child {
            margin: 0;
          }
          img {
            width: 8.125rem;
            height: 8.125rem;
          }
          p {
            font-size: $fon12;
            margin-top: 0.5rem;
          }
        }
      }
    }
  }
}
</style>