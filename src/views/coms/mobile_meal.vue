//移动端套餐列表
<template>
  <!-- Mobile套餐列表 -->
  <div class="mealMobile">
    <p class="meal-type" v-if="isCustomTitle">
      <span
        v-for="(meal, indexMe) in mealTilte"
        @click="changeSwPrice(indexMe)"
        :key="indexMe"
        ref="mealType"
        >{{ meal }}</span
      >
    </p>
    <div class="swiper-container meal-list">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          :class="[
            app.isBureau == 1 && 'bureau-bg',
            $route.name == 'Index' && 'bureau-bg-index',
          ]"
          v-for="(meal, indexM) in $route.name != 'UnVip'
            ? mealListReport
            : app.isBureau == 1
            ? mealListInnerNews
            : mealListInnerReport"
          :key="indexM"
        >
          <ul>
            <li>
              <p
                class="meal-name"
                :class="meal.isMonth && 'meal-name-en'"
                v-if="app.language != 'zh-CN' && $route.name == 'Index'"
              >
                {{
                  meal.price3 &&
                  (app.account.is_buy_first_meal == 1 || !app.token)
                    ? "First Month"
                    : meal.name
                }}
              </p>
              <div>
                <p class="meal-title-inner">
                  {{
                    app.language == "zh-CN"
                      ? meal.price3 && app.account.is_buy_first_meal == 1
                        ? $t("meal.meal_first_name")
                        : meal.title
                      : app.isBureau == 1
                      ? $t("meal.meal_year_name_2")
                      : $t("public.project_name")
                  }}
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
                    <mt-spinner
                      :type="2"
                      :color="app.isBureau == 1 ? '#8A3FFC' : '#33B1FF'"
                    ></mt-spinner>
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
                <p class="meal-go" :class="meal.id == 3 && 'meal-go-nft'" v-if="!meal.price3">
                  <base-button
                    :type="meal.type"
                    :class="meal.isInfo && 'other-info'"
                    round
                    @click="placeOrder(indexM, 0)"
                  >
                    <!-- 立即订阅 -->
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
                  >
                    {{ app.language == "en" ? "First Month" : "首月体验" }}
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
              <div
                :class="app.language == 'en' && 'rights-en'"
                class="rights-box"
              >
                <div
                  v-for="(right, indexR) in app.language == 'en'
                    ? meal.rights_en
                    : meal.rights"
                  :key="indexR"
                  class="rights-inner"
                >
                  <p class="rights-point"></p>
                  <div v-html="right"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 英文版翻页器 -->
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import { priceList, mealInfo } from "@/request/api";
import { mapState } from "vuex";
export default {
  name: "MobileMeal",
  data() {
    return {
      //首页套餐
      mealListReport: [
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
            `<p class="rights-title">查看<span class="high">订阅期内</span>发布的项目研报（额外赠送5篇）</p>`,
            `<p class="rights-title"><span class="high">订阅期内</span>项目情报信息分析</p>`,
            '<p class="rights-title"><span class="high">订阅期内</span>赛道解析（额外赠送5篇）</p>',
            '<p class="rights-title">额外赠送公开版新币速递</p>',
            '<p class="rights-title">免费咨询10个项目信息</p>',
            // '<p class="rights-title">每个用户仅有一次体验机会</p>',
          ],
          rights_en: [
            `<p class="rights-title">Project Analysis published <span class="high">during subscription</span> (extra 5 complimentary reports)</p>`,
            `<p class="rights-title">News <span class="high">during subscription</span></p>`,
            '<p class="rights-title">Sector Analysis <span class="high">during subscription</span> (extra 5 complimentary reports)</p>',
            '<p class="rights-title">Extra complimentary public version of Project Express</p>',
            '<p class="rights-title">Free enquiry on 10 projects</p>',
          ],
          isMonth: true,
          isInfo: false,
        },
        {
          title: "研报库包年套餐",
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
          isMonth: false,
          isInfo: false,
        },
        {
          title: "情报局包年套餐",
          name: this.$t("meal.meal_bureau_name"),
          remark: this.$t("meal.meal_bureau_remark"),
          price: "",
          price1: "",
          id: "",
          unit: this.$t("meal.year_uint"),
          type: "info",
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
          isMonth: false,
          isInfo: true,
        },
      ],
      // 研报库内页套餐
      mealListInnerReport: [
        {
          title: this.$t("meal.meal_first_name"),
          title_2: this.$t("meal.meal_first_name"),
          name: this.$t("meal.meal_month_name"),
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
          title_2: this.$t("meal.meal_year_name"),
          name: this.$t("meal.meal_year_name"),
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
          two: false,
          isMonth: false,
        },
        {
          title: "研报库包月套餐",
          title_2: this.$t("meal.meal_month_name"),
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
      //情报局内页套餐
      mealListInnerNews: [
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
          isInfo:true
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
          isInfo:true
        },
      ],
      mealSwiper: null,
      isMonth: false,
    };
  },
  computed: {
    ...mapState(["app"]),
    mealTilte() {
      //研报包月 研报包年 情报包年
      return this.$route.name != "UnVip"
        ? [
            this.$t("public.month_vip_mobile"),
            this.$t("public.year_vip_mobile"),
            this.$t("public.year_intell_mobile"),
          ]
        : this.app.isBureau == 1
        ? this.app.language == "en"
          ? ["Free", "Annual"]
          : ["免费套餐", "包年套餐"]
        : this.app.language == "en"
        ? ["Monthly", "Annual", "Monthly"]
        : ["首次体验", "包年套餐", "包月套餐"];
    },
    isCustomTitle() {
      if (this.app.language == "en" && this.$route.name == "Index") {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {
    this.getMealList();
  },
  mounted() {
    this.initMeallist();
  },
  watch: {
    $route(_route) {
      this.initMeallist();
    },
  },
  methods: {
    changeSwPrice(index) {
      let arr = [];
      arr.push(this.mealSwiper);
      !(this.mealSwiper instanceof Array) && (this.mealSwiper = arr);
      //切换swiper
      this.mealSwiper[this.mealSwiper.length - 1].slideToLoop(
        index,
        500,
        false
      );
      for (let i in this.$refs.mealType) {
        this.$refs.mealType[i].className = "out-ground";
      }
      this.$refs.mealType[index].className =
        this.app.isBureau == 1 ? "bureau-ground" : "ground";
    },
    //获取套餐列表
    async getMealList() {
      const result = await priceList();
      this.$set(this.mealListReport[0], "id", result[1].id);
      this.$set(this.mealListReport[0], "price", result[1].price);
      this.$set(this.mealListReport[0], "price1", result[1].price1);
      this.$set(this.mealListReport[0], "price3", result[0].price);
      this.$set(this.mealListReport[1], "id", result[2].id);
      this.$set(this.mealListReport[1], "price", result[2].price);
      this.$set(this.mealListReport[1], "price1", result[2].price1);
      this.$set(this.mealListReport[2], "id", result[result.length - 2].id);
      this.$set(
        this.mealListReport[2],
        "price",
        result[result.length - 2].price
      );
      this.$set(
        this.mealListReport[2],
        "price1",
        result[result.length - 2].price1
      );
      //内页
      this.$set(this.mealListInnerReport[0], "id", result[0].id);
      this.$set(this.mealListInnerReport[0], "price", result[0].price);
      this.$set(this.mealListInnerReport[0], "price1", result[0].price1);
      this.$set(this.mealListInnerReport[1], "id", result[2].id);
      this.$set(this.mealListInnerReport[1], "price", result[2].price);
      this.$set(this.mealListInnerReport[1], "price1", result[2].price1);
      this.$set(this.mealListInnerReport[2], "id", result[1].id);
      this.$set(this.mealListInnerReport[2], "price", result[1].price);
      this.$set(this.mealListInnerReport[2], "price1", result[1].price1);
      this.$set(this.mealListInnerNews[0], "id", result[result.length - 1].id);
      this.$set(
        this.mealListInnerNews[0],
        "price",
        result[result.length - 1].price
      );
      this.$set(this.mealListInnerNews[0], "price1", "0.00");
      this.$set(this.mealListInnerNews[1], "id", result[result.length - 2].id);
      this.$set(
        this.mealListInnerNews[1],
        "price",
        result[result.length - 2].price
      );
      this.$set(
        this.mealListInnerNews[1],
        "price1",
        result[result.length - 2].price1
      );
    },
    //下单
    async placeOrder(_index, _type) {
      if (!this.app.token) {
        this.$router.push("/login-mobile");
        return;
      }
      if (_type == 1) {
        const result = await mealInfo({
          id: 1,
        });
        const orderMsg = {
          id: result.id,
          price1: result.price1,
          price: result.price,
          name: this.$t("meal.meal_first_name"),
        };
        this.$store.commit("upPlaceOrderMsg", orderMsg);
        this.$router.push("/mobile-place-order");
        this.$store.commit("upAliveName", "open-alive");
      } else {
        const result = await mealInfo({
          id:
            (this.app.isBureau == 1 &&
              this.$route.name == "UnVip" &&
              this.mealListInnerNews[_index].id) ||
            (this.app.isBureau == 0 &&
              this.$route.name == "UnVip" &&
              this.mealListInnerReport[_index].id) ||
            this.mealListReport[_index].id,
        });
        const orderMsg = {
          id:
            (this.app.isBureau == 1 &&
              this.$route.name == "UnVip" &&
              this.mealListInnerNews[_index].id) ||
            (this.app.isBureau == 0 &&
              this.$route.name == "UnVip" &&
              this.mealListInnerReport[_index].id) ||
            this.mealListReport[_index].id,
          price1: result.price1,
          price: result.price,
          name:
            (this.app.isBureau == 1 &&
              this.$route.name == "UnVip" &&
              this.mealListInnerNews[_index].title) ||
            (this.app.isBureau == 0 &&
              this.$route.name == "UnVip" &&
              this.mealListInnerReport[_index].title_2) ||
            this.mealListReport[_index.title],
        };
        this.$store.commit("upPlaceOrderMsg", orderMsg);
        this.$router.push("/mobile-place-order");
        this.$store.commit("upAliveName", "open-alive");
      }
    },
    initMeallist() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.mealSwiper = new Swiper(".meal-list", {
            initialSlide: 1,
            spaceBetween: 30,
            pagination: {
              el:
                this.app.language == "en" && this.$route.name == "Index"
                  ? ".swiper-pagination"
                  : ".meal-type",
              clickable: true,
              type:
                this.app.language == "en" && this.$route.name == "Index"
                  ? "bullets"
                  : "custom",
              renderCustom: (swiper, current, total) => {
                // console.log(current);
                for (let i in this.$refs.mealType) {
                  this.$refs.mealType[i].className = "out-ground";
                }
                if (this.$refs.mealType[current - 1] != undefined) {
                  this.$refs.mealType[current - 1].className =
                    this.app.isBureau == 1 ? "bureau-ground" : "ground";
                }
              },
            },
          });
        }, 100);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .swiper-container {
  overflow: inherit;
}
/deep/ .swiper-pagination {
  bottom: -30px;
}
/deep/ .swiper-pagination-bullet {
  background: $info;
  opacity: 1;
}
/deep/ .swiper-pagination-bullet-active {
  background: #7a91cc;
}
.ground {
  background: linear-gradient(90deg, #0f83fe 0%, #00b0f0 100%);
}
.bureau-ground {
  background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
}
.out-ground {
  background: $contentBg;
}
.meal-type {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  span {
    display: inline-block;
    width: 5rem;
    height: 1.75rem;
    text-align: center;
    line-height: 1.75rem;
    font-size: $fon12;
    border-radius: 0.25rem;
    color: white;
  }
}
.meal-list {
  width: 90%;
  height: 100%;
  ul {
    width: 100%;
    height: 100%;
    li {
      width: 100%;
      background: rgba(27, 36, 71, 0.8);
      border-radius: 4px;
      padding: $padd40 0;
      padding-bottom: 0;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
      .meal-name {
        position: absolute;
        left: 0;
        top: 0;
        padding: 4px 8px;
        font-size: $fon14;
        font-weight: bold;
        color: white;
        line-height: $fon20;
        background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
        border-radius: 4px 0 4px 0;
      }
      .meal-name-en {
        background: rgba(0, 0, 0, 0.2);
      }
      .meal-title-inner {
        font-size: $fon18;
        margin-bottom: 0.5rem;
      }
      .meal-remark-inner {
        font-size: $fon12;
        color: $textColor;
        margin-bottom: $padd40;
      }
      .meal-price {
        font-size: 1.75rem;
        color: white;
        margin-bottom: 0.25rem;
      }
      .meal-unit {
        font-size: $fon14;
        color: $textColor;
        margin-bottom: $padd24;
      }
      .meal-go {
        margin-bottom: $padd40;
      }
      .meal-go-nft{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .meal-other {
        margin-bottom: 40px;
        margin-top: -50px;
        button {
          font-size: 12px;
          background: rgba(255, 212, 92, 0.1) !important;
          color: #ffd45c;
        }
      }
      .rights-en {
        padding: 2.5rem 1rem !important;
      }
      .rights-box {
        background: $info;
        padding: $padd40 0;
        padding-left: $padd40;
        border-radius: 0 0 4px 4px;
        text-align: left;
        .rights-inner {
          display: flex;
          align-items: center;
          margin-bottom: $fon12;
        }
        .rights-point {
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          margin-right: 0.5rem;
        }
      }
      /deep/ .rights-title {
        font-size: $fon12;
        color: $textColor;
      }
      /deep/ .high {
        color: $success;
        margin-left: 4px;
        margin-right: 4px;
      }
    }
  }
  // .swiper-slide:nth-child(2) {
  //   ul {
  //     li {
  //       background-image: url("../../assets/images/mealBg.png");
  //       background-size: 100% 100%;
  //     }
  //   }
  // }
  // .bureau-bg:nth-child(2) {
  //   ul {
  //     li {
  //       background-image: url("../../assets/images/mealBgTwo.png");
  //       background-size: 100% 100%;
  //     }
  //   }
  // }
  // .bureau-bg-index:nth-child(2) {
  //   ul {
  //     li {
  //       background-image: url("../../assets/images/mealBg.png");
  //       background-size: 100% 100%;
  //     }
  //   }
  // }
  // .bureau-bg-index:nth-child(3) {
  //   ul {
  //     li {
  //       background-image: url("../../assets/images/mealBgTwo.png");
  //       background-size: 100% 100%;
  //     }
  //   }
  // }
}
</style>