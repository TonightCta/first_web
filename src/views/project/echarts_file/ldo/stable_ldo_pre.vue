// 质押量占比
<template>
  <div class="col-sm-24 col-lg-12">
    <div class="stable-ldo-pre">
      <p class="h4">
        <!-- 质押量占比 -->
        <!-- {{$t('ldo.pre')}} -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <el-table
        :data="tableData"
        style="width: 100%"
        :empty-text="$t('no_data.no_pre')"
      >
        <!-- 暂无占比信息 -->
        <el-table-column prop="network_name" :label="$t('ldo.network')">
          <!-- 网络 -->
        </el-table-column>
        <el-table-column prop="assets_name">
          <!-- 质押资产 -->
          <div slot="header">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('ldo.pre_account')"
            >
              <p class="text-overflow" slot="reference">
                {{$t('ldo.pre_account')}}
              </p>
            </el-popover>
          </div>
        </el-table-column>
        <el-table-column prop="amount">
          <!-- Lido平台质押量 -->
          <div slot="header">
            <el-popover
              placement="top"
              trigger="hover"
              :content="$t('ldo.lido_pl')"
            >
              <p class="text-overflow" slot="reference">
                {{$t('ldo.lido_pl')}}
              </p>
            </el-popover>
          </div>
        </el-table-column>
        <el-table-column prop="pledge_ratio">
          <!-- Lido平台质押量/网络总质押量 -->
          <div slot="header">
            <el-popover
              placement="top"
              width="300"
              trigger="hover"
              :content="$t('ldo.lido_pl_net')"
            >
              <p class="text-overflow" slot="reference">
                {{$t('ldo.lido_pl_net')}}
              </p>
            </el-popover>
          </div>
        </el-table-column>
        <el-table-column prop="supply_ratio">
          <!-- Lido平台质押量/供应总量 -->
          <div slot="header">
            <el-popover
              placement="top"
              width="300"
              trigger="hover"
              :content="$t('ldo.lido_pl_total')"
            >
              <p class="text-overflow" slot="reference">
                {{$t('ldo.lido_pl_total')}}
              </p>
            </el-popover>
          </div>
        </el-table-column>
        <el-table-column prop="apr" label="APR" width="100"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { LdoPre } from "@/request/api";
export default {
  props: ["title", "desc"],
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.getPreData();
  },
  methods: {
    async getPreData() {
      const result = await LdoPre();
      this.tableData = result;
      this.tableData = this.tableData.map((item) => {
        return {
          pledge_ratio: item.pledge_ratio + "%",
          supply_ratio: item.supply_ratio + "%",
          apr: item.apr + "%",
          assets_name: item.assets_name,
          amount: item.amount,
          network_name: item.network_name,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.col-lg-12 {
  margin-bottom: 24px;
}
.stable-ldo-pre {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  .h4 {
    position: relative;
    z-index: 100;
    color: $textColor;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
}
</style>