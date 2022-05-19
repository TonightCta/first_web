<template>
  <div>
    <el-popover placement="bottom-end" width="362" trigger="click">
      <el-table :data="gridData" height="300" :empty-text="emptyText">
        <el-table-column
          min-width="80"
          prop="uid"
          :label="$t('invite.new_uid')"
        >
          <!-- 新会员UID -->
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="name"
          :label="$t('invite.activities')"
        >
          <template slot-scope="{ row }">
            <span v-if="row.type == 1" class="high-text">
              <!-- 年费会员推荐新年费会员 -->
              {{ $t("invite.reward_remark_1") }}
            </span>
            <span v-if="row.type == 3" class="high-text">
              <!-- 非年费会员推荐年费 -->
              {{ $t("invite.reward_remark_2") }}
            </span>
            <span v-if="row.type == 2" class="high-text">
              <!-- 非年费会员推荐试用会员 -->
              {{ $t("invite.reward_remark_3") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="70"
          :label="$t('invite.reward')"
          header-align="right"
        >
          <!-- 奖励 -->
          <template slot-scope="{ row }">
            <div class="text-right">
              <span
                :class="{ 'high-reward': row.is_reward == 1 }"
                v-if="row.is_new == 1"
                >{{ row.reward }}</span
              >
              <span
                :class="{ 'high-reward': row.is_reward == 1 }"
                style="text-decoration: line-through"
                v-else
                >{{ row.reward }}</span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="reference" class="invite-data" v-if="!icon">
        <!-- 查看数据 -->
        {{ $t("invite.view_data") }}
      </span>
      <span
        slot="reference"
        class="iconfont icon-zhexiantu_chart-line"
        v-else
      ></span>
    </el-popover>
  </div>
</template>

<script>
import { InviteMsg } from "@/request/api";
import { mapState } from "vuex";
export default {
  props: ["icon"],
  data() {
    return {
      gridData: [],
      emptyText: this.$t("invite.normal"),
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getInviteMsg();
    if (this.app.account.meal_id == 1) {
      // "非年费会员累计推荐100个试用会员或10个年费会员，即可兑换1个包年套餐";
      this.emptyText = this.$t("invite.reward_empty_2");
    }
  },
  methods: {
    //获取邀请数据
    async getInviteMsg() {
      const result = await InviteMsg({ limit: 500 });
      this.gridData = result.data;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table__empty-text {
  word-break: normal;
  line-height: 18px;
}
.invite-data {
  font-size: $fon12;
  color: $iconColor;
}
.iconfont {
  font-size: $fon14;
  color: white;
}
.high-reward {
  color: #0f62fe !important;
}
.high-text {
  color: $titleColor;
}
/deep/ .el-table__header-wrapper {
  .cell {
    color: #676c7a;
    font-weight: bold;
  }
}
/deep/ .el-table__body-wrapper {
  .el-table__row {
    border-color: red !important;
  }
  .cell {
    color: #676c7a;
  }
}
</style>