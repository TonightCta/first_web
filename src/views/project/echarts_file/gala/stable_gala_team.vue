<template>
  <div class="col-sm-12 col-lg-6">
    <div class="stable-gala-team">
      <p class="h4">
        <!-- Gala Games生态内游戏合作情况 -->
        {{ title }}
        <el-popover placement="top" trigger="hover" width="360" :content="desc">
          <span slot="reference" class="iconfont icon-bangzhu_help"></span>
        </el-popover>
      </p>
      <div class="gala-team-box">
        <p class="box-title" v-if="false">Gala Games生态中的项目</p>
        <div class="table-name">
          <p>项目名称</p>
          <p>项目名称</p>
        </div>
        <div class="list-table">
          <ul>
            <li v-for="(pro, indexPro) in teamData" :key="indexPro">
              {{ pro }}
            </li>
          </ul>
        </div>
        <div class="total-box">
          <p>所有项目数量</p>
          <p>{{ total }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GalaTeam } from "@/request/api";
export default {
  props: ["title", "desc"],
  data() {
    return {
      teamData: [],
      total: 0,
    };
  },
  created() {
    this.getTeamData();
  },
  methods: {
    async getTeamData() {
      const result = await GalaTeam();
      this.teamData = result.games;
      this.total = result.total;
    },
  },
};
</script>
<style lang="scss" scoped>
.stable-gala-team {
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
    margin-bottom: 24px;
    .iconfont {
      font-size: 15px;
      color: $textColor;
      cursor: pointer;
    }
  }
  .gala-team-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .box-title {
      font-size: 15px;
      color: $textColor;
      padding-bottom: 16px;
    }
    .table-name {
      display: flex;
      border-bottom: 1px solid $lineTwoColor;
      padding-bottom: 16px;
      margin-bottom: 0;
      p {
        width: 50%;
        text-align: left;
      }
    }
    .list-table {
      flex:1;
      overflow: auto;
    }
    div {
      margin-bottom: 16px;
      ul {
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid $lineTwoColor;
        li {
          width: 50%;
          height: 40px;
          line-height: 40px;
          text-align: left;
          border-bottom: 1px solid $lineTwoColor;
        }
        li:nth-last-child(2) {
          border-bottom: 0;
        }
        li:last-child {
          border-bottom: 0;
        }
      }
    }
    .total-box {
      display: flex;
      p {
        font-size: 15px;
      }
      p:first-child {
        width: 25%;
      }
      p:last-child {
        flex: 1;
      }
    }
  }
}
@media screen and (max-width: 1279px) {
  .stable-gala-team {
    padding: 1rem;
    .gala-team-box {
      div {
        ul {
          li {
            width: auto;
            margin-right: 1rem;
          }
        }
      }
      .total-box {
        p:first-child {
          width: 30%;
        }
      }
    }
  }
}
</style>