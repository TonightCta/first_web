<template>
  <div class="mobile-order" v-loading="loadOrder">
    <div class="order-title">
      <p>
        <!-- 订单号 -->
        {{ $t("mine_order.order_number") }}
      </p>
      <p>
        <!-- 产品 -->
        {{ $t("mine_order.product") }}
      </p>
      <p>
        <!-- 单价 -->
        {{ $t("mine_order.unit") }}
      </p>
    </div>
    <div class="data-box" v-if="isHasData">
      <ul>
        <li
          v-for="(order, indexO) in orderList"
          :key="indexO"
          @click="
            $router.push({
              path: '/mobile-order-details',
              query: { order_id: order.id },
            })
          "
        >
          <p>#{{ order.id }}</p>
          <p>{{ order.name }}</p>
          <p>{{ order.price }}</p>
        </li>
      </ul>
      <div class="page-tools-mobile" v-if="isWithPage">
        <base-pagination
          :page-count="total"
          type="info"
          v-model="defaultPagination"
        ></base-pagination>
      </div>
    </div>
    <p class="no-order" v-else>
      <!-- 暂无订单 -->
      {{ $t("no_data.no_order") }}
    </p>
  </div>
</template>

<script>
import { BasePagination } from "@/components";
import { userOrder } from "@/request/api";
import { mapState } from 'vuex';
export default {
  name: "MobileOrder",
  components: { BasePagination },
  data() {
    return {
      orderList: [], //订单列表
      total: 1, //总页数
      defaultPagination: 1, //当前页码
      loadOrder: false, //数据加载
      isWithPage: true, //是否需要分页器
      isHasData: true,
    };
  },
  created() {
    this.getOrderList();
  },
  watch: {
    defaultPagination() {
      this.getOrderList();
    },
  },
  computed:{
    ...mapState(['app'])
  },
  methods: {
    async getOrderList() {
      this.loadOrder = true;
      const result = await userOrder({
        limit: 10,
        page: this.defaultPagination,
        type:this.app.isBureau == 1 ? 2 : 1
      });
      this.loadOrder = false;
      console.log(this.loadOrder);
      this.orderList = result.data;
      this.orderList.length == 0
        ? (this.isHasData = false)
        : (this.isHasData = true);
      this.total = result.last_page;
      result.last_page > 1
        ? (this.isWithPage = true)
        : (this.isWithPage = false);
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-order {
  width: 100%;
  height: 100%;
  background: $contentBg;
  border-radius: 4px;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  .order-title {
    display: flex;
    justify-content: space-around;
    height: $padd40;
    align-items: center;
    margin-bottom: $fon18;
    p {
      width: 30%;
      text-align: left;
      color: $textColor;
      font-weight: bold;
      font-size: $fon12;
    }
  }
  .data-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }
  ul {
    li {
      display: flex;
      justify-content: space-around;
      height: 3.3rem;
      align-items: center;
      border-top: 1px solid $lineTwoColor;
      overflow-x: hidden;
      p {
        width: 30%;
        text-align: left;
        font-size: $fon14;
        color: $remarkColor;
      }
      p:nth-child(2) {
        color: white;
      }
      p:last-child {
        overflow-x: auto;
        overflow-y: hidden;
      }
      p:last-child::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
.no-order {
  text-align: center;
  font-size: $fon14;
  color: $remarkColor;
  margin-top: 3rem;
}
</style>