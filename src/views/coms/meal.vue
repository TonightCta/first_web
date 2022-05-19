// 套餐续费
<template>
  <div class="meal-center">
    <div
      class="month-box public-meal"
      v-for="(mealOnly, indexOn) in mealList"
      :key="indexOn"
    >
      <div class="price-box">
        <p class="only-meal-title">{{ mealOnly.title }}</p>
        <p class="only-meal-remark">{{ mealOnly.remark }}</p>
        <p class="only-meal-price">{{ mealOnly.price }}</p>
        <p class="only-meal-unit">USDT/{{ mealOnly.unit }}</p>
        <p>
          <base-button :type="mealOnly.type" round @click="placeOrder(indexOn)"
            >立即订阅</base-button
          >
        </p>
      </div>
      <div class="rights-box">
        <p
          v-for="(rightsOnly, indexOnRi) in mealOnly.rights"
          :key="indexOnRi"
          v-html="rightsOnly"
        ></p>
      </div>
    </div>
  </div>
</template>

<script>
import { priceList,mealInfo } from "@/request/api";
export default {
  name: "MealCenter",
  data() {
    return {
      mealList: [
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
            '<p class="rights-title"><span class="high">订阅期内</span>赛道解析（额外赠送5篇）</p>',
            '<p class="rights-title">额外赠送公开版新币速递</p>',
            '<p class="rights-title">免费咨询10个项目信息</p>',
          ],
        },
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
            '<p class="rights-title">赛道解析（不定期发布）</p>',
            '<p class="rights-title high">特权1：专享新币速递板块</p>',
            '<p class="rights-title">特权2：制定项目深度调研</p>',
            '<p class="rights-title">特权3：免费咨询所有项目信息</p>',
            '<p class="rights-title">开放内部数据库</p>',
            '<p class="rights-title">100%无风险（10天）退款保证</p>',
          ],
        },
      ],
    };
  },
  created() {
    this.getMealList();
  },
  methods: {
    //获取套餐列表
    async getMealList() {
      const result = await priceList();
      this.$set(this.mealList[0], "id", result[1].id);
      this.$set(this.mealList[0], "price", result[1].price);
      this.$set(this.mealList[0], "price1", result[1].price1);
      this.$set(this.mealList[1], "id", result[2].id);
      this.$set(this.mealList[1], "price", result[2].price);
      this.$set(this.mealList[1], "price1", result[2].price1);
    },
    //下单
    async placeOrder(_index) {
      const result = await mealInfo({ id: this.mealList[_index].id });
      const orderMsg = {
        id: this.mealList[_index].id,
        price1: result.price1,
        price: result.price,
        name: this.mealList[_index].title,
      };
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$store.commit("upAliveName", "open-alive")
      this.$router.push("/placeOrder");
    },
  },
};
</script>

<style lang="scss" scoped>
.meal-center {
  display: flex;
  justify-content: space-between;
  .public-meal {
    display: flex;
    width: 49.3%;
    height: 360px;
    background: $default;
    border-radius: 4px;
    .price-box {
      padding: 48px;
      width: 50%;
      background: $conBg2;
      height: 100%;
      border-radius: 4px;
      text-align: center;
      .only-meal-title {
        font-size: 28px;
        line-height: 37px;
        color: white;
        margin-bottom: 4px;
      }
      .only-meal-remark {
        font-size: 14px;
        color: $textColor;
        line-height: 32px;
        margin-bottom: 48px;
      }
      .only-meal-price {
        font-size: 40px;
        line-height: 60px;
        color: white;
      }
      .only-meal-unit {
        margin-bottom: 24px;
        font-size: 18px;
        color: $textColor;
      }
    }
    .rights-box {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      /deep/ .rights-title {
        font-size: 14px;
        line-height: 32px;
        color:$textColor;
      }
      /deep/ .high {
        color: $success;
      }
    }
  }
  .public-meal:last-child {
    .price-box {
      background-image: url("../../assets/images/mealBg2.png");
      background-size: 100% 100%;
    }
  }
}
</style>