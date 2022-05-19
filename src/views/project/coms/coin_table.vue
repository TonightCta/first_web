<template>
  <div class="coin-table">
    <div class="mobile-need">
      <p class="h4">
        <!-- 代币分布 -->
        {{ $t("project_interface.coin_sca") }}
      </p>
      <p class="h5">
        <!-- 已刨除交易所地址、项目方地址、Staking合约地址等干扰 -->
        {{ $t("project_interface.coin_sca_remark") }}
      </p>
      <el-table
        :data="tableData"
        :empty-text="$t('no_data.no_table')"
        v-if="!$flag"
      >
        <!-- 暂无数据 -->
        <el-table-column
          prop="rank"
          :label="$t('project_interface.coin_rank')"
          min-width="30"
        >
          <!-- 排名 -->
        </el-table-column>
        <el-table-column
          :label="$t('project_interface.coin_address')"
          min-width="150"
        >
          <!-- 持币地址 -->
          <template slot-scope="{ row }">
            <!-- <p>{{scope.row.rank}}</p> -->
            <p
              :style="{
                color: !row.rank ? 'white' : '#A2A5B0',
                'font-weight': !row.rank ? 'bold' : '400',
              }"
              class="address-text"
              @click="
                row.url
                  ? viewInBlockChain(row.url)
                  : $notify({
                      type: 'info',
                      //未找到该地址对应浏览器地址
                      message: this.$t('notify.un_address'),
                    })
              "
            >
              {{ row.address }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('project_interface.coin_num')"
          min-width="70"
        >
          <!-- 持币数量 -->
          <template slot-scope="{ row }">
            <p
              style="color: white"
              :style="{ 'font-weight': !row.rank ? 'bold' : '400' }"
            >
              {{ row.quantity }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('project_interface.coin_per')"
          min-width="70"
        >
          <!-- 占比 -->
          <template slot-scope="{ row }">
            <p
              style="color: white"
              :style="{ 'font-weight': !row.rank ? 'bold' : '400' }"
            >
              {{ row.percentage }} %
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('project_interface.close_one')"
          min-width="100"
        >
          <!-- 近1天 -->
          <template slot-scope="{ row }">
            <p
              style="color: white"
              :style="{
                color:
                  parseFloat(row.day_one_differ) == 0
                    ? '#A2A5B0'
                    : parseFloat(row.day_one_differ) > 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !row.rank ? 'bold' : '400',
              }"
            >
              {{ row.day_one_differ > 0 ? "+" : ""
              }}{{ row.day_one_differ }} (<span style="font-size: 12px"
                >{{ row.day_one > 0 ? "+" : "" }}{{ row.day_one }}%</span
              >)
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('project_interface.close_seven')"
          min-width="100"
        >
          <!-- 近7天 -->
          <template slot-scope="{ row }">
            <p
              :style="{
                color:
                  parseFloat(row.day_seven_differ) == 0
                    ? '#A2A5B0'
                    : parseFloat(row.day_seven_differ) > 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !row.rank ? 'bold' : '400',
              }"
            >
              {{ row.day_seven_differ > 0 ? "+" : ""
              }}{{ row.day_seven_differ }} (<span style="font-size: 12px"
                >{{ row.day_seven > 0 ? "+" : "" }}{{ row.day_seven }}%</span
              >)
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('project_interface.close_month')"
          min-width="100"
        >
          <!-- 近30天 -->
          <template slot-scope="{ row }">
            <p
              :style="{
                color:
                  parseFloat(row.day_month_differ) == 0
                    ? '#A2A5B0'
                    : parseFloat(row.day_month_differ) > 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !row.rank ? 'bold' : '400',
              }"
            >
              {{ row.day_month_differ > 0 ? "+" : ""
              }}{{ row.day_month_differ }} (<span style="font-size: 12px"
                >{{ row.day_month > 0 ? "+" : "" }}{{ row.day_month }}%</span
              >)
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 移动端-代币分布 -->
    <div class="mobile-coin" v-if="$flag">
      <ul>
        <li
          v-for="(row, indexRow) in tableData"
          :key="indexRow"
          @click="
            row.url
              ? viewInBlockChain(row.url)
              : $notify({
                  type: 'info',
                  //未找到该地址对应浏览器地址
                  message: this.$t('notify.un_address'),
                })
          "
        >
          <div v-if="indexRow < 10">
            <div class="coin-rank">
              <p>
                <span>{{ indexRow + 1 }}</span>
                <span
                  >{{ row.address.substr(0, 4) }}...{{
                    row.address.substr(38, 4)
                  }}</span
                >
              </p>
              <p>
                <span>
                  <!-- 持币数量 -->
                  {{ $t("project_interface.coin_num") }}
                </span>
                <span
                  >{{ row.quantity }}<font>{{ row.percentage }} %</font></span
                >
              </p>
            </div>
            <div class="coin-change">
              <div class="change-box">
                <p class="change-type">
                  <!-- 近1天 -->
                  {{ $t("project_interface.close_one") }}
                </p>
                <p
                  class="change-num"
                  :style="{
                    color:
                      parseFloat(row.day_one_differ) >= 0
                        ? '#a7f0ba'
                        : '#FF6B6B',
                    'font-weight': !row.rank ? 'bold' : '400',
                  }"
                >
                  {{ row.day_one_differ > 0 ? "+" : ""
                  }}{{ row.day_one_differ }}
                </p>
                <p class="change-inc">
                  {{ row.day_one > 0 ? "+" : "" }}{{ row.day_one }}%
                </p>
              </div>
              <div class="change-box">
                <p class="change-type">
                  <!-- 近7天 -->
                  {{ $t("project_interface.close_seven") }}
                </p>
                <p
                  class="change-num"
                  :style="{
                    color:
                      parseFloat(row.day_seven_differ) >= 0
                        ? '#a7f0ba'
                        : '#FF6B6B',
                    'font-weight': !row.rank ? 'bold' : '400',
                  }"
                >
                  {{ row.day_seven_differ > 0 ? "+" : ""
                  }}{{ row.day_seven_differ }}
                </p>
                <p class="change-inc">
                  {{ row.day_seven > 0 ? "+" : "" }}{{ row.day_seven }}%
                </p>
              </div>
              <div class="change-box">
                <p class="change-type">
                  <!-- 近30天 -->
                  {{ $t("project_interface.close_month") }}
                </p>
                <p
                  class="change-num"
                  :style="{
                    color:
                      parseFloat(row.day_month_differ) >= 0
                        ? '#a7f0ba'
                        : '#FF6B6B',
                    'font-weight': !row.rank ? 'bold' : '400',
                  }"
                >
                  {{ row.day_month_differ > 0 ? "+" : ""
                  }}{{ row.day_month_differ }}
                </p>
                <p class="change-inc">
                  {{ row.day_month > 0 ? "+" : "" }}{{ row.day_month }}%
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 统计 -->
    <div class="total-sta" v-if="$flag && tableData[10]">
      <div class="top-ten top-public">
        <p class="ten-title">
          <!-- 前10持币地址持币总数 -->
          {{ $t("project_interface.rank_ten") }}
        </p>
        <p class="ten-num">{{ tableData[10].quantity }}</p>
        <p class="ten-per">{{ tableData[10].percentage }}%</p>
        <p class="ten-line"></p>
        <div class="nearly-one nearly-public">
          <p>
            <!-- 近1天 -->
            {{ $t("project_interface.close_one") }}
          </p>
          <div>
            <p
              class="change-num"
              :style="{
                color:
                  parseFloat(tableData[10].day_seven_differ) >= 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !tableData[10].rank ? 'bold' : '400',
              }"
            >
              {{ tableData[10].day_one_differ > 0 ? "+" : ""
              }}{{ tableData[10].day_one_differ }}
            </p>
            <p>
              {{ tableData[10].day_one > 0 ? "+" : ""
              }}{{ tableData[10].day_one }}%
            </p>
          </div>
        </div>
        <div class="nearly-one nearly-public">
          <p>
            <!-- 近7天 -->
            {{ $t("project_interface.close_seven") }}
          </p>
          <div>
            <p
              class="change-num"
              :style="{
                color:
                  parseFloat(tableData[10].day_seven_differ) >= 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !tableData[10].rank ? 'bold' : '400',
              }"
            >
              {{ tableData[10].day_seven_differ > 0 ? "+" : ""
              }}{{ tableData[10].day_seven_differ }}
            </p>
            <p>
              {{ tableData[10].day_seven > 0 ? "+" : ""
              }}{{ tableData[10].day_seven }}%
            </p>
          </div>
        </div>
        <div class="nearly-thirty nearly-public">
          <p>
            <!-- 近30天 -->
            {{ $t("project_interface.close_month") }}
          </p>
          <div>
            <p
              class="change-num"
              :style="{
                color:
                  parseFloat(tableData[10].day_month_differ) >= 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !tableData[10].rank ? 'bold' : '400',
              }"
            >
              {{ tableData[10].day_month_differ > 0 ? "+" : ""
              }}{{ tableData[10].day_month_differ }}
            </p>
            <p>
              {{ tableData[10].day_month > 0 ? "+" : ""
              }}{{ tableData[10].day_month }}%
            </p>
          </div>
        </div>
      </div>
      <div class="ten-label"></div>
      <div class="top-ten top-public">
        <p class="ten-title">
          <!-- 前30持币地址持币总数 -->
          {{ $t("project_interface.rank_thirty") }}
        </p>
        <p class="ten-num">{{ tableData[11].quantity }}</p>
        <p class="ten-per">{{ tableData[11].percentage }}%</p>
        <p class="ten-line"></p>
        <div class="nearly-one nearly-public">
          <p>
            <!-- 近1天 -->
            {{ $t("project_interface.close_one") }}
          </p>
          <div>
            <p
              class="change-num"
              :style="{
                color:
                  parseFloat(tableData[11].day_seven_differ) >= 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !tableData[11].rank ? 'bold' : '400',
              }"
            >
              {{ tableData[11].day_one_differ > 0 ? "+" : ""
              }}{{ tableData[11].day_one_differ }}
            </p>
            <p>
              {{ tableData[11].day_one > 0 ? "+" : ""
              }}{{ tableData[11].day_one }}%
            </p>
          </div>
        </div>
        <div class="nearly-one nearly-public">
          <p>
            <!-- 近7天 -->
            {{ $t("project_interface.close_seven") }}
          </p>
          <div>
            <p
              class="change-num"
              :style="{
                color:
                  parseFloat(tableData[11].day_seven_differ) >= 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !tableData[11].rank ? 'bold' : '400',
              }"
            >
              {{ tableData[11].day_seven_differ > 0 ? "+" : ""
              }}{{ tableData[11].day_seven_differ }}
            </p>
            <p>
              {{ tableData[11].day_seven > 0 ? "+" : ""
              }}{{ tableData[11].day_seven }}%
            </p>
          </div>
        </div>
        <div class="nearly-thirty nearly-public">
          <p>
            <!-- 近30天 -->
            {{ $t("project_interface.close_month") }}
          </p>
          <div>
            <p
              class="change-num"
              :style="{
                color:
                  parseFloat(tableData[11].day_month_differ) >= 0
                    ? '#a7f0ba'
                    : '#FF6B6B',
                'font-weight': !tableData[11].rank ? 'bold' : '400',
              }"
            >
              {{ tableData[11].day_month_differ > 0 ? "+" : ""
              }}{{ tableData[11].day_month_differ }}
            </p>
            <p>
              {{ tableData[11].day_month > 0 ? "+" : ""
              }}{{ tableData[11].day_month }}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { coinType } from "@/request/api";
export default {
  name: "CoinTable",
  data() {
    return {
      tableData: [],
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getCoinType();
  },
  methods: {
    async getCoinType() {
      const result = await coinType({ id: this.$route.query.id });
      this.tableData = result;
      this.tableData[11].address = this.$t("project_interface.rank_thirty"); //前30持币地址持币总数
      this.tableData[10].address = this.$t("project_interface.rank_ten"); //前10持币地址持币总数
    },
    //查看区块链浏览器
    viewInBlockChain(_url) {
      window.open(_url);
    },
  },
};
</script>

<style lang="scss" scoped>
.h4 {
  margin-bottom: 4px;
  color: white;
}
.h5 {
  color: $remarkColor;
  margin-bottom: 24px;
}
.coin-table {
  padding: 24px;
  background: $contentBg;
  margin-top: 16px;
  border-radius: 4px;
  .address-text {
    cursor: pointer;
  }
}
.mobile-coin {
  padding: 2rem 1rem 1rem;
  background: $contentBg;
  border-radius: 0 0 4px 4px;
  ul {
    li {
      display: flex;
      flex-direction: column;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid $lineTwoColor;
      .coin-rank {
        display: flex;
        justify-content: space-between;
        p:first-child {
          font-size: $fon12;
          color: white;
          span:first-child {
            padding: 0 0.31rem;
            background: #ffac33;
            color: $contentBg;
            border-radius: 4px;
            margin-right: 0.5rem;
          }
        }
        p:last-child {
          font-size: $fon12;
          color: $remarkColor;
          span:last-child {
            font-weight: bold;
            color: white;
            margin-left: 0.5rem;
            font {
              color: #ffd45c;
              margin-left: 0.25rem;
            }
          }
        }
      }
      .coin-change {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        .change-box {
          width: 32%;
          padding: 0.5rem;
          background: $conBg2;
          border-radius: 4px;
          p {
            font-size: $fon12;
          }
          .change-type {
            margin-bottom: 0.5rem;
            color: white;
          }
          .change-inc {
            color: $remarkColor;
            margin-top: 0.25rem;
          }
        }
      }
    }
    li:nth-child(10) {
      border-bottom: 0;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    li:nth-child(11) {
      display: none;
    }
    li:last-child {
      display: none;
    }
  }
}
.total-sta {
  margin-top: 0.5rem;
  // padding
  display: flex;
  .ten-label {
    width: 0.5rem;
    height: 100%;
  }
  .top-public {
    flex: 1;
    padding: 1rem;
    background: $contentBg;
    border-radius: 4px;
    .ten-title {
      font-size: $fon12;
      color: white;
      margin-bottom: 0.5rem;
    }
    .ten-num {
      font-size: $fon14;
      font-weight: bold;
      margin-bottom: 0.2rem;
      color: white;
    }
    .ten-per {
      font-size: $fon12;
      color: #ffd45c;
    }
    .ten-line {
      width: 100%;
      height: 1px;
      background: $lineTwoColor;
      margin: 1rem 0;
    }
    .nearly-public {
      display: flex;
      flex-direction: column;
      margin-bottom: $fon12;
      p:first-child {
        margin-bottom: 0.4rem;
        font-size: $fon12;
        color: white;
      }
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: $fon12;
          margin-bottom: 0 !important;
        }
        p:last-child {
          color: $remarkColor;
        }
      }
    }
    .nearly-thirty {
      margin-bottom: 0;
    }
  }
}
@media screen and (max-width: 1279px) {
  .h4 {
    font-size: 1rem;
  }
  .h5 {
    font-size: $fon12;
    margin-bottom: 0;
  }
  .coin-table {
    background: rgba(0, 0, 0, 0);
    padding: 0;
    .mobile-need {
      background: $contentBg;
      border-radius: 4px 4px 0 0;
      padding: 1rem 1rem 0;
    }
  }
}
</style>