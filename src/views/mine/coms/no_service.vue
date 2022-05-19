// 无权限搜索
<template>
  <div>
    <modal :show.sync="notSearch" modalClasses="login-box-modal other-modal">
      <div class="not-search">
        <p class="iconfont">!</p>
        <p class="h4">
          <!-- 内部数据库仅对年费会员开放 -->
          {{ $t("public.no_pre") }}
        </p>
        <p>
          <base-button type="default" round @click="notSearch = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span></span>
          <base-button
            type="info"
            round
            @click="
              reNew();
              notSearch = false;
            "
          >
            <!-- 立即订阅 -->
            {{ $t("public.sub_now") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { priceList } from "@/request/api";
export default {
  data() {
    return {
      notSearch: false,
    };
  },
  components: {
    Modal,
  },
  methods: {
    //续费会员
    async reNew() {
      const result = await priceList();
      const orderMsg = {
        id: result[2].id,
        price1: result[2].price1,
        price: result[2].price,
        name: result[2].name,
      };
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$router.push(this.$flag ? "/mobile-place-order" : "/placeOrder");
    },
  },
};
</script>

<style lang="scss" scoped>
.not-search {
  text-align: center;
  padding: 24px 24px 32px 24px;
  .iconfont {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    color: white;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 18px;
  }
  .h4 {
    margin-bottom: 24px;
    font-weight: bold;
    color: $titleColor;
  }
  span {
    display: inline-block;
    width: 24px;
  }
  p:last-child{
    display: flex;
    justify-content: space-around;
  }
}
</style>