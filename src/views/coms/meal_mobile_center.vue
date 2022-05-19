//移动端套餐列表
<template>
  <!-- Mobile套餐列表 -->
  <div class="mealMobile">
    <p class="meal-type">
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
          v-for="(meal, indexM) in mealList"
          :key="indexM"
        >
          <ul>
            <li>
              <p class="meal-title-inner">{{ meal.title }}</p>
              <p class="meal-remark-inner">{{ meal.remark }}</p>
              <p class="meal-price">
                <span v-if="!meal.price">
                  <mt-spinner :type="2" color="#33B1FF"></mt-spinner>
                </span>
                <span v-else> {{ meal.price }} </span>
              </p>
              <p class="meal-unit">USDT/{{ meal.unit }}</p>
              <p class="meal-go">
                <base-button :type="meal.type" round @click="placeOrder(indexM)"
                  >立即订阅</base-button
                >
              </p>
              <p
                v-for="(right, indexR) in meal.rights"
                :key="indexR"
                v-html="right"
              ></p>
            </li>
          </ul>
        </div>
      </div>
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
      mealList: [
        {
          title: "包年套餐",
          remark: "包年惊喜不断，86%已赚回年费",
          price: "",
          price1: "",
          id: "",
          unit: "年",
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
        },
        {
          title: "包月套餐",
          remark: "每月收费，随时取消",
          price: "",
          price1: "",
          id: "",
          unit: "月",
          type: "default",
          rights: [
            '<p class="rights-title">查看<span class="high">订阅期内</span>发布的项目研报(额外赠送5篇)</p>',
            '<p class="rights-title"><span class="high">订阅期内</span>赛道解析(额外赠送5篇)</p>',
            '<p class="rights-title">额外赠送公开版新币速递</p>',
            '<p class="rights-title">免费咨询10个项目信息</p>',
          ],
        },
      ],
      mealSwiper: null,
    };
  },
  computed: {
    ...mapState(["app"]),
    mealTilte() {
      return ["包年", "包月"];
    },
  },
  created() {
    this.getMealList();
  },
  mounted() {
    this.initMeallist();
  },
  methods: {
    changeSwPrice(index) {
      //   切换swiper
      this.mealSwiper.slideToLoop(index, 500, false);
      for (let i in this.$refs.mealType) {
        this.$refs.mealType[i].className = "out-ground";
      }
      this.$refs.mealType[index].className = "ground";
    },
    //获取套餐列表
    async getMealList() {
      const result = await priceList();
      this.$set(this.mealList[0], "id", result[2].id);
      this.$set(this.mealList[0], "price", result[2].price);
      this.$set(this.mealList[0], "price1", result[2].price1);
      this.$set(this.mealList[1], "id", result[1].id);
      this.$set(this.mealList[1], "price", result[1].price);
      this.$set(this.mealList[1], "price1", result[1].price1);
    },
    //下单
    async placeOrder(_index) {
      let meal_id;
      if (this.mealList[_index].id == 99) {
        meal_id = this.app.account.is_buy_first_meal == 1 ? 1 : 2;
      } else {
        meal_id = this.mealList[_index].id;
      }
      const result = await mealInfo({ id: this.mealList[_index].id });
      const orderMsg = {
        id: this.mealList[_index].id,
        price1: result.price1,
        price: result.price,
        name: this.mealList[_index].title,
      };
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$store.commit("upAliveName", "open-alive")
      this.$router.push("/mobile-place-order");
    },
    initMeallist() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.mealSwiper = new Swiper(".meal-list", {
            initialSlide: 0,
            spaceBetween: 30,
            pagination: {
              el: ".meal-type",
              clickable: true,
              type: "custom",
              renderCustom: (swiper, current, total) => {
                // console.log(current);
                for (let i in this.$refs.mealType) {
                  this.$refs.mealType[i].className = "out-ground";
                }
                if (this.$refs.mealType[current - 1] != undefined) {
                  this.$refs.mealType[current - 1].className = "ground";
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
.ground {
  background: linear-gradient(90deg, #0f83fe 0%, #00b0f0 100%);
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
      padding: 3.75rem 0;
      text-align: center;
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
        margin-bottom: 3.75rem;
      }
      /deep/ .rights-title {
        margin-bottom: $fon12;
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
  .swiper-slide:nth-child(1) {
    ul {
      li {
        background-image: url("../../assets/images/mealBg.png");
        background-size: 100% 100%;
      }
    }
  }
}
</style>