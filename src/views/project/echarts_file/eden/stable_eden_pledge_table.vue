<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-eden-pledge-table">
      <p class="h4">
        <!-- 代币质押情况 - Table -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <el-table :data="pleData" style="width: 100%">
        <el-table-column prop="top">
          <!-- 最大质押数 -->
          <template slot="header">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('eden.table_1')"
            >
              <p :class="app.language == 'en' && 'text-overflow'" slot="reference">
                {{ $t("eden.table_1") }}
              </p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="ave">
          <!-- 平均质押数 -->
          <template slot="header">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('eden.table_2')"
            >
              <p :class="app.language == 'en' && 'text-overflow'" slot="reference">
                {{ $t("eden.table_2") }}
              </p>
            </el-popover>
          </template> 
        </el-table-column>
        <el-table-column prop="ninety_five">
          <!-- Top 5%地址质押≥ -->
          <template slot="header">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('eden.table_3')"
            >
              <p :class="app.language == 'en' && 'text-overflow'" slot="reference">
                {{ $t("eden.table_3") }}
              </p>
            </el-popover>
          </template> 
        </el-table-column>
        <el-table-column prop="seventy_five">
          <!-- Top 25%地址质押≥ -->
          <template slot="header">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('eden.table_4')"
            >
              <p :class="app.language == 'en' && 'text-overflow'" slot="reference">
                {{ $t("eden.table_4") }}
              </p>
            </el-popover>
          </template> 
        </el-table-column>
        <el-table-column prop="fifty">
          <!-- Top 50%地址质押≥ -->
          <template slot="header">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('eden.table_5')"
            >
              <p :class="app.language == 'en' && 'text-overflow'" slot="reference">
                {{ $t("eden.table_5") }}
              </p>
            </el-popover>
          </template> 
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { EdenPledgeTable } from "@/request/api";
import { mapState } from "vuex";
export default {
  props: ["title", "desc"],
  data() {
    return {
      pleData: [],
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getPleData();
  },
  methods: {
    async getPleData() {
      const result = await EdenPledgeTable();
      this.pleData.push(result);
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-eden-pledge-table {
  padding: 24px;
  height: 400px;
  background: $contentBg;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .h4 {
    position: relative;
    z-index: 200;
    color: $textColor;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
}
@media screen and (max-width:1279px){
  .stable-eden-pledge-table{
    padding:1rem;
  }
}
</style>