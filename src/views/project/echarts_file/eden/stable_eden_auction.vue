<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-eden-auction">
      <p class="h4">
        <!-- Slot拍卖情况 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="auction-box">
        <el-table :data="slotData" height="310" style="width: 100%">
          <el-table-column width="180" label="Slot">
            <template slot-scope="{ row }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.name"
                placement="top-start"
              >
                <p class="text-overflow">{{ row.name }}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="180" label="Slot 1">
            <template slot-scope="{ row }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.slot_1"
                placement="top-start"
              >
                <p class="text-overflow">{{ row.slot_1 }}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="180" label="Slot 2">
            <template slot-scope="{ row }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.slot_2"
                placement="top-start"
              >
                <p class="text-overflow">{{ row.slot_2 }}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="Slot 3">
            <template slot-scope="{ row }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.slot_3"
                placement="top-start"
              >
                <p class="text-overflow">{{ row.slot_3 }}</p>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { EdenSlot } from "@/request/api";
export default {
  props: ["title", "desc"],
  data() {
    return {
      slotData: [],
    };
  },
  created() {
    this.getSlotNumber();
  },
  methods: {
    async getSlotNumber() {
      const result = await EdenSlot();
      this.slotData = result;
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-eden-auction {
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
  .stable-eden-auction{
    padding:1rem;
  }
}
</style>