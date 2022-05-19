// 套餐列表
<template>
  <div class="meal-page">
    <p class="h1 meal-title">
      <!-- 头等仓套餐服务 -->
      {{ $t("meal.meal_title") }}
    </p>
    <p class="h4 meal-remark">
      <!-- 86%以上的包年订阅会员已通过研报赚回了年费 -->
      {{ $t("meal.meal_remark") }}
    </p>
    <div class="pc-meal">
      <div class="meal-list">
        <ul>
          <li
            v-for="(meal, indexM) in mealList"
            :key="indexM"
            :class="app.language == 'en' && 'meal-en'"
          >
            <p
              class="meal-name"
              :class="meal.isMonth && 'meal-name-month'"
              v-if="app.language != 'zh-CN'"
            >
              {{
                meal.price3 &&
                (app.account.is_buy_first_meal == 1 || !app.token)
                  ? "First Month"
                  : meal.name
              }}
            </p>
            <div class="meal-msg-box">
              <p class="meal-title-inner">
                {{ meal.title }}
              </p>
              <p class="meal-remark-inner">
                {{
                  meal.price3 &&
                  (app.account.is_buy_first_meal == 1 || !app.token)
                    ? $t("meal.meal_first_remark")
                    : meal.remark
                }}
              </p>
              <p class="meal-price">
                <span v-if="!meal.price">
                  <mt-spinner :type="2" color="#33B1FF"></mt-spinner>
                </span>
                <span v-else>
                  {{
                    meal.price3 &&
                    (app.account.is_buy_first_meal == 1 || !app.token)
                      ? meal.price3
                      : meal.price
                  }}
                </span>
              </p>
              <p class="meal-unit">USDT/{{ meal.unit }}</p>

              <p
                class="meal-go"
                :class="[
                  meal.price3 && 'out-bottom',
                  meal.id == 3 && 'meal-go-nft',
                ]"
                v-if="!meal.price3"
              >
                <base-button
                  :type="meal.type"
                  round
                  @click="
                    meal.price3 && app.account.is_buy_first_meal == 1
                      ? placeOrder(indexM, 1)
                      : placeOrder(indexM, 0)
                  "
                >
                  {{ $t("public.sub_now") }}
                </base-button>
                <!-- meal.id == 3 -->
                <span v-if="false" class="give-nft">*买即送1个NFT</span>
              </p>
              <p class="meal-go" v-if="meal.price3">
                <base-button
                  type="info"
                  @click="placeOrder(indexM, 1)"
                  round
                  v-if="!app.token || app.account.is_buy_first_meal == 1"
                  :style="{
                    'font-size': app.language == 'en' ? '13px' : '14px',
                  }"
                >
                  {{ app.language == "en" ? `First Month` : `首月体验` }}
                </base-button>
                <base-button
                  type="info"
                  @click="placeOrder(indexM, 0)"
                  round
                  v-else
                >
                  {{ $t("public.sub_now") }}
                </base-button>
              </p>
            </div>

            <div class="rights-box">
              <div
                v-for="(right, indexR) in app.language == 'en'
                  ? meal.rights_en
                  : meal.rights"
                :key="indexR"
              >
                <p class="point"></p>
                <p v-html="right"></p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <MobileMeal class="mobile-meal" ref="mobileMeal" />
    <!-- 手机号登录 -->
    <!-- <LoginBox ref="loginBox" key="meal"/> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { priceList, isNewVip, mealInfo } from "@/request/api";
export default {
  name: "MealList",
  data() {
    return {
      mealList: [
        //包月套餐
        {
          title: this.$t("public.project_name"),
          name: this.$t("meal.meal_month_name"),
          remark: this.$t("meal.meal_month_remark"),
          price: "",
          price1: "",
          id: "",
          unit: this.$t("meal.month_uint"),
          type: "default",

          rights: [
            `<p class="rights-title">查看<span class="high">订阅期内</span>发布的项目研报（额外赠送5篇）</p>`,
            `<p class="rights-title"><span class="high">订阅期内</span>项目情报信息分析</p>`,
            '<p class="rights-title"><span class="high">订阅期内</span>赛道解析（额外赠送5篇）</p>',
            '<p class="rights-title">额外赠送公开版新币速递</p>',
            '<p class="rights-title">免费咨询10个项目信息</p>',
          ],
          rights_en: [
            `<p class="rights-title">Project Analysis published <span class="high">during subscription</span> (extra 5 complimentary reports)</p>`,
            `<p class="rights-title">News <span class="high">during subscription</span></p>`,
            '<p class="rights-title">Sector Analysis <span class="high">during subscription</span> (extra 5 complimentary reports)</p>',
            '<p class="rights-title">Extra complimentary public version of Project Express</p>',
            '<p class="rights-title">Free enquiry on 10 projects</p>',
          ],
          isDis: true,
          isMonth: true,
        },
        {
          title: this.$t("public.project_name"),
          name: this.$t("meal.meal_bureau_name"),
          remark: this.$t("meal.meal_year_remark"),
          price: "",
          price1: "",
          id: "",
          unit: this.$t("meal.year_uint"),
          type: "info",
          rights: [
            '<p class="rights-title">查看<span class="high">所有已发布</span>的项目研报</p>',
            '<p class="rights-title">所有项目的情报信息</p>',
            '<p class="rights-title">赛道解析(不定时发布)</p>',
            '<p class="rights-title high">特权1：专享新币速递板块</p>',
            '<p class="rights-title">特权2：制定项目深度调研</p>',
            '<p class="rights-title">特权3：免费咨询所有项目信息</p>',
            '<p class="rights-title">开放内部数据库</p>',
            '<p class="rights-title">100%无风险（10天）退款保证</p>',
          ],
          rights_en: [
            `<p class="rights-title"><span class="high">All Project Analysis</span></p>`,
            `<p class="rights-title">All Information</p>`,
            '<p class="rights-title">All Sector Analysis (Released irregularly)</p>',
            '<p class="rights-title"><span class="high">Privilege 1: Exclusive Project Express</span></p>',
            '<p class="rights-title">Privilege 2: Customize In-depth Project Research</p>',
            '<p class="rights-title">Privilege 3: Free Enquiry on All Projects</p>',
            '<p class="rights-title">Available Internal Database</p>',
            '<p class="rights-title">100% Risk-free (10 Days) Refund Guarantee</p>',
          ],
          isDis: true,
          isMonth: false,
        },
        {
          title: this.$t("public.bureau_name"),
          name: this.$t("meal.meal_bureau_name"),
          remark: this.$t("meal.meal_bureau_remark"),
          price: "",
          price1: "",
          id: "",
          unit: this.$t("meal.year_uint"),
          type: "default",
          rights: [
            '<p class="rights-title">查看<span class="high">所有项目</span>已发布的情报速递</p>',
            '<p class="rights-title">查看<span class="high">所有项目</span>已发布的未来事件</p>',
            '<p class="rights-title">查看<span class="high">所有项目</span>已发布的全网提案</p>',
            '<p class="rights-title">可添加感兴趣的项目到自选并持续跟踪</p>',
          ],
          rights_en: [
            `<p class="rights-title"><span class="high">All Information</span></p>`,
            '<p class="rights-title"><span class="high">All Upcoming Events</span></p>',
            '<p class="rights-title"><span class="high">All Proposals</span></p>',
            '<p class="rights-title">Customized Watchlist</p>',
          ],
          isDis: true,
          isMonth: false,
        },
      ],
    };
  },
  components: {
    MobileMeal: (resolve) => require(["../coms/mobile_meal"], resolve),
    LoginBox: (resolve) => require(["@/views/login_mobile/login_box"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    if (this.app.account.is_buy_first_meal == 1 || !this.app.token) {
      this.mealList[0].rights.push(
        '<p class="rights-title">每个用户仅有一次体验机会</p>'
      );
    }
    if (this.app.language == "zh-CN") {
      this.mealList[1].title = "研报库包年套餐";
      this.mealList[2].title = "情报局包年套餐";
    }
  },
  mounted() {
    this.getMealList();
    this.app.token && this.getIsNew();
  },
  methods: {
    //获取套餐列表
    async getMealList() {
      const result = await priceList();
      // console.log(result);
      // console.log(this.mealList);
      this.$set(this.mealList[0], "id", result[1].id);
      this.$set(this.mealList[0], "price", result[1].price);
      this.$set(this.mealList[0], "price1", result[1].price1);
      this.$set(this.mealList[0], "price3", result[0].price);
      this.$set(this.mealList[1], "id", result[2].id);
      this.$set(this.mealList[1], "price", result[2].price);
      this.$set(this.mealList[1], "price1", result[2].price1);
      this.$set(this.mealList[2], "id", result[result.length - 2].id);
      this.$set(this.mealList[2], "price", result[result.length - 2].price);
      this.$set(this.mealList[2], "price1", result[result.length - 2].price1);
      // console.log(this.mealList);
    },
    //下单
    placeOrder(_index, _type) {
      const next = async () => {
        let meal_id;
        if (_type == 1) {
          meal_id = 1;
        } else {
          meal_id = this.mealList[_index].id;
        }
        const result = await mealInfo({ id: meal_id });
        const orderMsg = {
          id: meal_id,
          price1: result.price1,
          price: result.price,
          name: meal_id == 1 ? "研报库试用会员" : this.mealList[_index].title,
        };
        meal_id == 6
          ? this.$store.commit("uIsBureau", 1)
          : this.$store.commit("uIsBureau", 0);
        this.$store.commit("upPlaceOrderMsg", orderMsg);
        this.$router.push("/placeOrder");
        this.$store.commit("upAliveName", "open-alive");
      };
      this.app.token ? next() : this.$emit("openLogin");
    },
    //是否为新用户
    async getIsNew() {
      const result = await isNewVip();
      result.status == 1 && (this.mealList[0].isDis = false);
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1280px) {
  .mobile-meal {
    display: none;
  }
}
@media screen and (max-width: 1279px) {
  .pc-meal {
    display: none;
  }
  .meal-page {
    padding-top: 8rem;
    .meal-title {
      font-size: $fon18;
    }
    .meal-remark {
      font-size: $fon12;
      margin-bottom: $padd24;
      padding: 0 $padd24;
    }
  }
}
.meal-page {
  width: 100%;
  height: 100%;
  background: url("../../assets/images/pageIcon/meal_bg.png");
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 40px;
}
.meal-title {
  color: $success;
  text-align: center;
  margin-bottom: 8px;
  font-size: 28px;
}
.meal-remark {
  color: white;
  font-size: 14px;
  margin-bottom: 40px;
  text-align: center;
}
.meal-list {
  width: 100%;
  ul {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    li {
      width: 370px;
      height: 702px;
      background: rgba(37, 52, 92, 0.8);
      border-radius: 4px;
      text-align: center;
      display: flex;
      flex-direction: column;
      position: relative;
      .meal-name {
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px 8px;
        border-radius: 4px 0px 4px 0px;
        background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
        font-size: 14px;
        font-weight: 800;
        color: white;
      }
      .meal-name-month {
        background: rgba(0, 0, 0, 0.2);
      }
      .meal-msg-box {
        padding-top: 40px;
        min-height: 322px;
        .meal-title-inner {
          font-size: 20px;
          margin-bottom: 8px;
        }
        .meal-remark-inner {
          font-size: 12px;
          color: $textColor;
          margin-bottom: 40px;
        }
        .meal-price {
          font-size: 40px;
          line-height: 60px;
          color: white;
        }
        .meal-unit {
          font-size: 18px;
          color: $textColor;
          margin-bottom: 24px;
        }
        .meal-go {
          margin-bottom: 40px;
          width: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          button {
            width: 200px;
          }
        }
        .meal-go-nft {
          margin-bottom: 20px;
        }
      }
      .rights-box {
        flex: 1;
        max-height: 380px;
        background: $info;
        border-radius: 0 0 4px 4px;
        padding: 40px 40px 0;
        padding-right: 28px;
        div {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        /deep/ .rights-title {
          font-size: 14px;
          color: $textColor;
          text-align: left;
          // word-break: break-all;
          line-height: 18px;
        }
        /deep/ .high {
          color: $success;
          // word-break: break-all;
        }
        .point {
          min-width: 4px;
          min-height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          margin-right: 8px;
        }
      }
      .out-bottom {
        margin-bottom: 2px;
      }
    }
    li:first-child {
      background-image: url("../../assets/images/mealBg.png");
      background-size: 100% 100%;
    }
    li:nth-child(2) {
      margin: 0 30px;
      background-image: url("../../assets/images/mealBg.png");
      background-size: 100% 100%;
    }
    li:last-child {
      background-image: url("../../assets/images/mealBgTwo.png");
      background-size: 100% 100%;
      button {
        background: linear-gradient(90deg, #bd3ffc 0%, #9d5cff 100%);
      }
    }
    // .meal-en {
    //   height: 712px !important;
    //   .meal-title-inner {
    //     font-size: 20px;
    //     margin-bottom: 8px;
    //     color: white;
    //   }
    //   .meal-remark-inner {
    //     font-size: 12px;
    //     color: white;
    //     line-height: 0;
    //     margin-bottom: 36px;
    //   }
    //   button {
    //     width: auto !important;
    //   }
    //   // .meal-other{
    //   //   margin-bottom: 40px!important;
    //   // }
    //   /deep/ .rights-title {
    //     padding: 0 24px;
    //     font-size: 14px;
    //     line-height: 18px;
    //     text-align: center;
    //   }
    // }
  }
}
</style>