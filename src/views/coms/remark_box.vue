// 说明弹框
<template>
  <div class="remark-box">
    <modal :show.sync="remarkBox" modalClasses="search-box-modal">
      <div class="rich-remark">
        <p class="rich-remark-title">{{ remarkMsg.title }}</p>
        <div class="rich-con">
          <p
            class="rich-remark-text"
            v-for="(remarkMsgText, indexRMsg) in remarkMsg.tooltip"
            :key="indexRMsg"
          >
            {{ remarkMsgText }}
          </p>
        </div>
        <p class="rich-remark-btn">
          <base-button type="default" round @click="remarkBox = false">
            <!-- 关闭 -->
            {{ $t("public.close") }}
          </base-button>
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
export default {
  name: "RemarkBox",
  props: ["remarkMsg"],
  data() {
    return {
      remarkBox: false, //指数说明
    };
  },
  components: {
    Modal,
  },
};
</script>

<style lang="scss" scoped>
/deep/ .modal-dialog {
  transform: translate(0, 35%) !important;
}
.rich-remark {
  .rich-remark-title {
    font-size: 17px;
    text-align: center;
    margin-bottom: 30px;
  }
  .rich-remark-text {
    line-height: 30px;
    font-size: 13px;
  }
  .rich-remark-btn {
    text-align: center;
    margin-top: 30px;
  }
}
@media screen and (max-width: 1279px) {
  .rich-remark {
    padding: 2rem 1rem;
  }
  .rich-con {
    max-height: 15rem;
    overflow-y: auto;
  }
}
</style>