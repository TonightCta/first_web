<template>
  <div>
    <!-- 权限蔗罩 -->
    <div class="no-permission">
      <div class="bg-box"></div>
      <base-button type="default" round @click="permissionBox = true">
        <!-- 年费会员专享 -->
        {{ $t("need_vip.need_title") }}
      </base-button>
    </div>
    <modal :show.sync="permissionBox" modalClasses="login-box-modal">
      <div class="permission-tips">
        <p class="">!</p>
        <p>
          <!-- 年费会员专享 -->
          {{ $t("need_vip.need_title") }}
        </p>
        <p>
          <!-- 如想阅读，请升级成包年套餐 -->
          {{ $t("need_vip.need_vip_remark") }}
        </p>
        <p>
          <base-button type="default" round @click="permissionBox = false">
            <!-- 取消 -->
            {{ $t("public.cancel") }}
          </base-button>
          <span></span>
          <base-button type="info" round @click="reNew()">
            <!-- 立即订阅 -->
            {{$t('public.sub_now')}}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { priceList, mealInfo } from "@/request/api";
export default {
  data() {
    return {
      permissionBox: false,
    };
  },
  components: {
    Modal,
  },
  methods: {
    //续费会员
    async reNew() {
      const result = await priceList();
      const priceInfo = await mealInfo({ id: result[2].id });
      const orderMsg = {
        id: result[2].id,
        price1: priceInfo.price1,
        price: priceInfo.price,
        name: result[2].name,
      };
      this.permissionBox = false;
      this.$store.commit("upPlaceOrderMsg", orderMsg);
      this.$router.push(this.$flag ? "/mobile-place-order" : "/placeOrder");
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .modal-dialog {
  transform: translate(0, 100%) !important;
}
@media screen and (max-width: 1279px) {
  /deep/ .modal-dialog {
    transform: translate(0, 60%) !important;
  }
}
.no-permission {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  .bg-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    background: linear-gradient(180deg, #1b2447 0%, #111a3b 100%);
    opacity: 0.9;
  }
}
.permission-tips {
  text-align: center;
  padding-top: 26px;
  padding-bottom: 32px;
  p:first-child {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: white;
    margin: 0 auto;
    margin-bottom: 18px;
  }
  p:nth-child(2) {
    font-size: 17px;
    color: $titleColor;
    font-weight: bold;
  }
  p:nth-child(3) {
    margin-bottom: 24px;
    font-size: 13px;
    color: $remarkColor;
  }
  p:last-child {
    display: flex;
    justify-content: center;
    span {
      display: inline-flex;
      width: 24px;
    }
  }
}
</style>