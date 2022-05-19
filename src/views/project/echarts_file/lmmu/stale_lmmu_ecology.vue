<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stale-lmmu-eco">
      <p class="h4">
        <!-- Lmmutable X 生态 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="lmmu-eco-box" id="lmmu-eco-box">
        <div class="eco-title">
          <p>项目名称</p>
          <p>项目名称</p>
        </div>
        <div class="eco-content">
          <div v-for="(item, indexItem) in ecoMsg.items" :key="indexItem">
            <ul>
              <li v-for="(name, indexName) in item" :key="indexName + '-name'">
                <p>
                  {{ name }}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="eco-total">
          <p>所有项目数量</p>
          <p>{{ ecoMsg.total }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LmmuEco } from "@/request/api";
export default {
  props: ["title", "desc"],
  data() {
    return {
      ecoMsg: {
        item: [],
        total: 0,
      },
    };
  },
  created() {
    this.getEcoList();
  },
  methods: {
    async getEcoList() {
      const result = await LmmuEco();
      this.ecoMsg = result;
    },
  },
};
</script>

<style lang="scss" scoped>
.stale-lmmu-eco {
  padding: 24px;
  height: 400px;
  display: flex;
  flex-direction: column;
  background: $contentBg;
  border-radius: 4px;
  .h4 {
    position: relative;
    z-index: 100;
    color: $textColor;
    margin-bottom: 24px;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .lmmu-eco-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .eco-content {
      flex: 1;
      padding: 16px 0;
      width: 100%;
      overflow-y: auto;
      div {
        ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          li {
            width: 50%;
            text-align: left;
            margin-bottom: 16px;
            line-height: 1;
            border-bottom: 1px solid $lineTwoColor;
            padding-bottom: 16px;
            p {
              font-size: 14px;
            }
          }
        }
      }
    }
    .eco-title {
      border-bottom: 1px solid $lineTwoColor;
      padding-bottom: 16px;
      p {
        width: 50%;
        margin-right: 0;
      }
    }
    .eco-title,
    .eco-total {
      display: flex;
      p {
        font-weight: bold;
        font-size: 14px;
        margin-right: 24px;
      }
    }
  }
}
@media screen and (max-width: 1279px) {
  .stale-lmmu-eco {
    padding: 1rem;
    .lmmu-eco-box {
      .eco-content {
        div {
          ul {
            flex-wrap: wrap;
            li {
              width: 50%;
              margin-bottom: 0.5rem;
            }
            li:last-child {
              text-align: left;
            }
          }
        }
      }
    }
  }
}
</style>