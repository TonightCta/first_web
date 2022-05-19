// 套餐列表
<template>
  <div>
    <p
      class="h1 meal-title"
      :style="{ 'margin-top': app.isBureau == 1 ? '40px' : '0px' }"
    >
      {{ $t("meal.meal_title") }}
    </p>
    <p class="h4 meal-remark">
      {{
        app.isBureau == 1 ? $t("meal.meal_remark_2") : $t("meal.meal_remark")
      }}
    </p>
    <div class="meal-list">
      <ul>
        <li
          v-for="(meal, indexM) in app.isBureau == 0 ? mealList : mealListInfo"
          :key="indexM"
          :class="[
            app.isBureau == 1 && meal.two && 'other-meal',
            app.isBureau == 1 && 'bureau-meal',
          ]"
        >
          <p
            class="meal-name"
            :class="meal.isMonth && 'meal-name-month'"
            v-if="app.language != 'zh-CN'"
          >
            {{ meal.name }}
          </p>
          <div class="meal-msg-box">
            <p class="meal-title-inner">
              {{
                app.language == "zh-CN"
                  ? meal.title
                  : app.isBureau == 1
                  ? $t("meal.meal_year_name_2")
                  : $t("public.project_name")
              }}
            </p>
            <p class="meal-remark-inner">{{ meal.remark }}</p>
            <p class="meal-price">
              <span v-if="!meal.price">
                <mt-spinner :type="2" color="#33B1FF"></mt-spinner>
              </span>
              <span v-else> {{ meal.price }} </span>
            </p>
            <p class="meal-unit" :class="app.isBureau == 1 && 'with-cny'">
              USDT/{{ meal.unit }}
            </p>
            <p
              v-if="app.isBureau == 1 && app.language != 'en'"
              class="cny-price"
            >
              ({{ meal.price1 }}元/{{ meal.unit }})
            </p>
            <p class="meal-go">
              <base-button
                :type="meal.type"
                :disabled="meal.id == 999"
                round
                @click="placeOrder(indexM)"
                :class="app.isBureau == 1 && 'other-info'"
                >{{
                  meal.id == 999 ? "Coming soon" : $t("public.sub_now")
                }}</base-button
              >
              <!-- TODO meal.id == 3--> 
              <span v-if="false" class="give-nft">*买即送1个NFT</span>
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
</template>

<script>
import { priceList, mealInfo } from "@/request/api";
import { mapState } from "vuex";
export default {
  name: "MealList",
  data() {
    return {
      //研报库套餐
      mealList: [
        {
          title: this.$t("meal.meal_first_name"),
          name: "First Month",
          remark: this.$t("meal.meal_first_remark_2"),
          price: "",
          price1: "",
          id: "",
          unit: this.$t("meal.month_uint"),
          type: "default",
          rights: [
            '<p class="rights-title">查看<span class="high">订阅期内</span>发布的项目研报(额外赠送5篇)</p>',
            '<p class="rights-title">订阅期内项目情报信息分析</p>',
            '<p class="rights-title"><span class="high">订阅期内</span>赛道解析（额外赠送5篇）</p>',
            '<p class="rights-title">额外赠送公开版新币速递</p>',
            '<p class="rights-title">免费咨询10个项目信息</p>',
            '<p class="rights-title">每个用户仅有一次体验机会</p>',
          ],
          rights_en: [
            `<p class="rights-title">Project Analysis published <span class="high">during subscription</span>(extra 5 complimentary reports)</p>`,
            '<p class="rights-title">News during subscription</p>',
            '<p class="rights-title">Sector Analysis <span class="high">during subscription</span> (extra 5 complimentary reports)</p>',
            '<p class="rights-title">Extra complimentary public version of Project Express</p>',
            '<p class="rights-title">Free enquiry on 10 projects</p>',
            '<p class="rights-title">One subscription/user, no refund</p>',
          ],
          two: false,
          isMonth: true,
        },
        {
          title: "研报库包年套餐",
          name: this.$t("meal.meal_year_name"),
          remark: this.$t("meal.meal_year_remark"),
          price: "",
          price1: "",
          id: "",
          unit: this.$t("meal.year_uint"),
          type: "info",
          rights: [
            '<p class="rights-title">查看<span class="high">所有已发布</span>的项目研报</p>',
            '<p class="rights-title">所有项目的解析</p>',
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
          two: false,
          isMonth: false,
        },
        {
          title: "研报库包月套餐",
          name: this.$t("meal.meal_month_name"),
          remark: this.$t("meal.meal_month_remark"),
          price: "",
          price1: "",
          id: "",
          unit: this.$t("meal.month_uint"),
          type: "default",
          rights: [
            '<p class="rights-title">查看<span class="high">订阅期内</span>发布的项目研报(额外赠送5篇)</p>',
            '<p class="rights-title">订阅期内项目情报信息分析</p>',
            '<p class="rights-title"><span class="high">订阅期内</span>赛道解析（额外赠送5篇）</p>',
            '<p class="rights-title">额外赠送公开版新币速递</p>',
            '<p class="rights-title">免费咨询10个项目信息</p>',
          ],
          rights_en: [
            `<p class="rights-title">Project Analysis published <span class="high">during subscription</span>(extra 5 complimentary reports)</p>`,
            '<p class="rights-title">News during subscription</p>',
            '<p class="rights-title">Sector Analysis <span class="high">during subscription</span> (extra 5 complimentary reports)</p>',
            '<p class="rights-title">Extra complimentary public version of Project Express</p>',
            '<p class="rights-title">Free enquiry on 10 projects</p>',
          ],
          two: false,
          isMonth: true,
        },
      ],
      //情报局套餐
      mealListInfo: [
        {
          //情报局免费套餐
          title: this.$t("meal.meal_zero_name"),
          name: this.$t("meal.meal_zero_name"),
          remark: this.$t("meal.meal_zero_remark"),
          price: "",
          price1: "",
          id: "",
          unit: this.$t("meal.year_uint"),
          type: "info",
          rights: [
            '<p class="rights-title">可跟踪<span class="high">数十个</span>项目的情报</p>',
            '<p class="rights-title"><span class="high">订阅期内</span>发布的情报速递</p>',
            '<p class="rights-title"><span class="high">订阅期内</span>发布的全网提案</p>',
            '<p class="rights-title">添加项目自选跟踪</p>',
          ],
          rights_en: [
            '<p class="rights-title"><span class="high">Track dozens of project</span></p>',
            '<p class="rights-title">All News</p>',
            '<p class="rights-title">All Proposals</p>',
            '<p class="rights-title">Customized watchlist</p>',
          ],
          two: false,
          btntext: "Coming soon",
          isMonth: true,
        },
        {
          //情报局包年套餐
          title: this.$t("meal.meal_year_name_2"),
          name: this.$t("meal.meal_bureau_name"),
          remark: this.$t("meal.meal_year_remark_2"),
          price: "",
          price1: "",
          id: "6",
          unit: this.$t("meal.year_uint"),
          type: "info",
          rights: [
            '<p class="rights-title"><span class="high">订阅期内</span>发布的情报速递</p>',
            '<p class="rights-title"><span class="high">订阅期内</span>发布的未来事件</p>',
            '<p class="rights-title"><span class="high">订阅期内</span>发布的全网提案</p>',
            '<p class="rights-title">添加项目自选跟踪</p>',
          ],
          rights_en: [
            '<p class="rights-title"><span class="high">All News</span></p>',
            '<p class="rights-title"><span class="high">All Upcoming Events</span></p>',
            '<p class="rights-title"><span class="high">All Proposals</span></p>',
            '<p class="rights-title">Customized Watchlist</p>',
          ],
          two: true,
          isMonth: false,
          btntext: "Coming soon",
        },
      ],
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getMealList();
  },
  methods: {
    //获取套餐列表
    async getMealList() {
      const result = await priceList();
      this.$set(this.mealList[0], "id", result[0].id);
      this.$set(this.mealList[0], "price", result[0].price);
      this.$set(this.mealList[0], "price1", result[0].price1);
      this.$set(this.mealList[1], "id", result[2].id);
      this.$set(this.mealList[1], "price", result[2].price);
      this.$set(this.mealList[1], "price1", result[2].price1);
      this.$set(this.mealList[2], "id", result[1].id);
      this.$set(this.mealList[2], "price", result[1].price);
      this.$set(this.mealList[2], "price1", result[1].price1);
      this.$set(this.mealListInfo[0], "id", result[result.length - 1].id);
      this.$set(this.mealListInfo[0], "price", result[result.length - 1].price);
      this.$set(this.mealListInfo[0], "price1", "0.00");
      this.$set(this.mealListInfo[1], "id", result[result.length - 2].id);
      this.$set(this.mealListInfo[1], "price", result[result.length - 2].price);
      this.$set(
        this.mealListInfo[1],
        "price1",
        result[result.length - 2].price1
      );
    },
    //下单
    async placeOrder(_index) {
      const result = await mealInfo({
        id:
          this.app.isBureau == 0
            ? this.mealList[_index].id
            : this.mealListInfo[_index].id,
      });
      const orderMsg = {
        id:
          this.app.isBureau == 0
            ? this.mealList[_index].id
            : this.mealListInfo[_index].id,
        price1: result.price1,
        price: result.price,
        name:
          this.app.isBureau == 0
            ? this.mealList[_index].title
            : this.mealListInfo[_index].title,
      };
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$store.commit("upAliveName", "open-alive");
      this.$router.push("/placeOrder");
    },
  },
};
</script>

<style lang="scss" scoped>
.meal-title {
  color: $success;
  text-align: center;
  margin-bottom: 8px;
}
.meal-remark {
  color: white;
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
      height: 668px;
      background: $contentBg;
      border-radius: 4px;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
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
        height: 342px;
        .meal-title-inner {
          font-size: 20px;
          margin-bottom: 8px;
        }
        .meal-remark-inner {
          font-size: 14px;
          color: $textColor;
          margin-bottom: 40px;
          padding: 0 16px;
          line-height: 16px;
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
        .with-cny {
          margin-bottom: 16px;
        }
        .cny-price {
          margin-bottom: 24px;
          font-size: 13px;
          color: $remarkColor;
        }
        .meal-go {
          margin-bottom: 81px;
          display: flex;
          flex-direction: column;
          align-items: center;
          button {
            width: 200px;
          }
        }
      }
      .rights-box {
        flex: 1;
        background: $info;
        background: $info;
        border-radius: 0 0 4px 4px;
        padding-top: 40px;
        padding-left: 40px;
        padding: 40px 40px 0;
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
    }
    li:nth-child(2) {
      height: 708px;
      margin: 0 30px;
      background-image: url("../../assets/images/mealBg.png");
      background-size: 100% 100%;
    }
    .bureau-meal {
      height: 564px !important;
      margin: 0 15px !important;
    }
    .other-meal {
      background-image: url("../../assets/images/mealBgTwo.png") !important;
      background-size: 100% 100%;
    }
  }
}
</style>