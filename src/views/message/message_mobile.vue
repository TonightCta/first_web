// 移动端消息中心
<template>
  <div class="message-mobile" v-loading="loadingData">
    <p class="message-title">
      <span>
        <!-- 消息内容 -->
        {{ $t("message.content") }}
      </span>
      <span>
        <!-- 接收时间 -->
        {{ $t("message.get_time") }}
      </span>
    </p>
    <ul>
      <li v-for="(mes, indexMes) in tableData" :key="indexMes">
        <p>
          {{ mes.content }}
        </p>
        <p>{{ mes.create_time }}</p>
      </li>
      <li
        class="load-more"
        @click="
          limit += 10;
          getMessageList();
        "
      >
        <!-- 加载更多 -->
        {{ $t("public.load") }}
        <span class="iconfont icon-jiazai"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import * as api from "@/request/api";
export default {
  name: "MessageMobile",
  components: {},
  data() {
    return {
      tableData: [],
      loadingData: false, //数据加载
      limit: 15,
    };
  },
  created() {
    this.operAll();
  },
  methods: {
    //获取消息列表
    async getMessageList() {
      this.loadingData = true;
      const result = await api.messageList({
        limit: this.limit,
      });
      this.loadingData = false;
      this.tableData = result.data;
    },
    //消息内页全部操作
    operAll() {
      this.getMessageList();
      api.readMessage();
      this.$store.commit("upMessageStatus", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.message-mobile {
  width: 100%;
  height: 100%;
  background: $contentBg;
  border-radius: 4px;
  padding: 1rem;
  overflow-y: auto;
  .message-title {
    display: flex;
    justify-content: space-between;
    height: $padd40;
    align-items: center;
    font-size: $fon12;
    font-weight: bold;
    color: $textColor;
    border-bottom: 1px solid $lineTwoColor;
  }
  ul {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $fon14 0;
      border-bottom: 1px solid $lineTwoColor;
      p {
        font-size: $fon12;
        color: white;
        margin-right: 1.6rem;
        line-height: $fon18;
      }
      p:first-child {
        text-align: justify;
      }
      p:last-child {
        min-width: 4.5rem;
        font-size: $fon12;
        color: $remarkColor;
        margin-right: 0;
      }
    }
    li:last-child {
      border-bottom: 0;
    }
    .load-more {
      justify-content: center;
      font-size: $fon14;
      color: $remarkColor;
      margin-top: 0.5rem;
    }
  }
}
</style>