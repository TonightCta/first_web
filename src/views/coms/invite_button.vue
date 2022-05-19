<template>
  <div>
    <el-popover width="600" trigger="hover" placement="bottom-end">
      <el-table :data="gridData" height="400" :empty-text="emptyText">
        <el-table-column width="60" type="index"></el-table-column>
        <el-table-column
          min-width="100"
          prop="uid"
          :label="$t('invite.new_uid')"
        >
          <!-- 新会员UID -->
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="name"
          :label="$t('invite.activities')"
        >
          <!-- 活动 -->
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
        <el-table-column min-width="100" :label="$t('invite.reward')" header-align="right">
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
      <p class="hover-icon" slot="reference">
        <i class="iconfont icon-zhexiantu_chart-line"></i>
      </p>
    </el-popover>
  </div>
</template>

<script>
import { InviteMsg } from "@/request/api";
export default {
  props: ["isUnvip"],
  data() {
    return {
      gridData: [],
      // emptyText: "推荐新用户订阅年费会员，双方各赠一个月",
    };
  },
  created() {
    this.getInviteMsg();
    // if (this.isUnvip) {
    //   this.emptyText =
    //     "非年费会员累计推荐100个试用会员或10任意年费会员，即可兑换1个包年套餐";
    // }
  },
  computed:{
    emptyText(){
      return this.isUnvip ? this.$t('invite.reward_empty_2') : this.$t('invite.reward_empty')
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
  line-height: normal;
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

.hover-icon {
  width: 40px;
  height: 40px;
  background: $info;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .iconfont {
    font-size: 16px;
  }
}
</style>