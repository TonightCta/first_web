<template>
  <div class="service-and-news">
    <div class="service-box">
      <div class="service-title-box">
        <p class="h4">
          <!-- 项目咨询 -->
          {{ $t("routes.project_en") }}
        </p>
        <p>
          <span @click="$router.push('/proNews/library')" v-if="!$flag">
            <!-- 查看全部 -->
            {{ $t("year_vip.view_all") }}
          </span>
          <base-button
            type="default"
            round
            @click="
              $flag
                ? $router.push({
                    path: '/mobile-submit-pro',
                    query: {
                      name: detailsMsg.title,
                      symbol: detailsMsg.symbol,
                    },
                  })
                : $router.push({
                    path: '/proNews/submitPro',
                    query: {
                      name: detailsMsg.title,
                      symbol: detailsMsg.symbol,
                    },
                  })
            "
          >
            <!-- 我要咨询 -->
            {{ $t("year_vip.need_sub") }}
          </base-button>
        </p>
      </div>
      <div class="table-box">
        <el-table
          :data="tableData"
          :empty-text="$t('no_data.no_service')"
          v-if="!$flag"
        >
          <el-table-column
            prop="desc"
            :label="$t('project_interface.service_con')"
            min-width="300"
          >
            <!-- 咨询内容 -->
          </el-table-column>
          <el-table-column
            :label="$t('project_interface.service_date')"
            min-width="80"
          >
            <!-- 咨询时间 -->
            <template slot-scope="{ row }">
              <div>{{ row.create_time }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('work_order.work_status')" min-width="80">
            <!-- 状态 -->
            <template slot-scope="{ row }">
              <div>
                <p v-if="row.status == 1">
                  <!-- 正在处理 -->
                  {{ $t("public.is_process") }}
                </p>
                <p v-if="row.status == 2">
                  <!-- 已回复 -->
                  {{ $t("library.has_back") }}
                </p>
                <p v-if="row.status == 3">
                  <!-- 待评价 -->
                  {{ $t("library.wait_evl") }}
                </p>
                <p v-if="row.status == 4">
                  <!-- 已结单 -->
                  {{ $t("library.has_end") }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('month_vip.table_oper')"
            header-align="right"
            min-width="30"
          >
            <!-- 操作 -->
            <template slot-scope="{ row }">
              <div class="text-right">
                <p
                  class="iconfont icon-yanjing_eyes"
                  @click="goLibraryDetails(row.id)"
                ></p>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 移动端 -->
        <el-table
          :data="tableData"
          :empty-text="$t('no_data.no_service')"
          v-else
          @row-click="goLibraryDetailsMobile"
        >
          <!-- 暂无咨询 -->
          <el-table-column
            :label="$t('project_interface.service_con')"
            min-width="150"
          >
            <!-- 咨询内容 -->
            <template slot-scope="{ row }">
              <p class="text-overflow-two">{{ row.desc }}</p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('project_interface.service_date')"
            min-width="50"
          >
            <!-- 咨询时间 -->
            <template slot-scope="{ row }">
              <div>{{ row.create_time.substr(5, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" header-align="right" min-width="50">
            <template slot-scope="{ row }">
              <div class="text-right">
                <p v-if="row.status == 1">
                  <!-- 正在处理 -->
                  {{ $t("public.is_process") }}
                </p>
                <p v-if="row.status == 2">
                  <!-- 已回复 -->
                  {{ $t("library.has_back") }}
                </p>
                <p v-if="row.status == 3">
                  <!-- 待评价 -->
                  {{ $t("library.wait_evl") }}
                </p>
                <p v-if="row.status == 4">
                  <!-- 已结单 -->
                  {{ $t("library.has_end") }}
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <p class="show-more">
          <base-button
            type="default"
            v-if="$flag"
            @click="$router.push('/mobile-library')"
          >
            <!-- 查看全部 -->
            {{ $t("year_vip.view_all") }}
          </base-button>
        </p>
      </div>
    </div>
    <div class="news-box" v-if="false">
      <p class="h4">链闻资讯</p>
      <ul v-if="newsData.length > 0">
        <li
          v-for="(news, indexNews) in newsData"
          :key="indexNews"
          @click="goView(news.link)"
        >
          <p class="h4">{{ news.title }}</p>
          <p>
            <span class="iconfont icon-rili_calendar"></span>
            {{ news.date }}
          </p>
        </li>
      </ul>
      <p class="no-data" v-else>暂无资讯</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { proService, proNews, projectDetails } from "@/request/api";
export default {
  name: "ServiceAndNews",
  data() {
    return {
      tableData: [],
      newsData: [],
      detailsMsg: {},
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    this.getService();
    this.getNews();
    this.getDetailsPro();
  },
  methods: {
    //获取解析详情
    async getDetailsPro(_id) {
      const result = await projectDetails({
        id: _id ? _id : this.$route.query.id,
      });
      this.detailsMsg = result;
    },
    async getService() {
      const result = await proService({ id: this.$route.query.id });
      this.tableData = result;
    },
    async getNews() {
      const result = await proNews({ id: this.$route.query.id });
      this.newsData = result;
    },
    // 阅读资讯
    goView(_url) {
      window.open(_url);
    },
    //项目咨询详情
    goLibraryDetails(_id) {
      this.$store.commit("upLibraryID", _id);
      this.$router.push(
        this.$flag
          ? "/mobile-library-details?id=" + _id
          : "/proNews/library/libraryDetails"
      );
    },
    goLibraryDetailsMobile(_row) {
      this.goLibraryDetails(_row.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.h4 {
  margin-bottom: 0;
  font-weight: bold;
  color: white;
}

.service-and-news {
  // display: flex;
  margin-top: 16px;
  .service-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    .service-title-box {
      height: 64px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .h4 {
        transform: translateY(10px);
      }
      p {
        span {
          font-size: 13px;
          color: white;
          cursor: pointer;
          margin-right: 24px;
        }
        button {
          font-size: 13px;
        }
      }
    }
    .table-box {
      flex: 1;
      background: $contentBg;
      border-radius: 4px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .text-overflow-two {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        padding-right: 0.5rem;
      }
      .iconfont {
        font-size: 24px;
        color: $success;
        cursor: pointer;
      }
      .show-more {
        button {
          width: 100%;
        }
      }
    }
  }
  .label-box {
    width: 30px;
  }
  .news-box {
    width: 510px;
    margin-left: 30px;
    background: $contentBg;
    border-radius: 4px;
    padding: 24px;
    ul {
      margin-top: 24px;
      height: 466px;
      overflow-y: auto;
      cursor: pointer;
      li {
        margin-top: 16px;
        border-bottom: 1px dashed $lineTwoColor;
        padding-bottom: 17px;
        .h4 {
          font-weight: 400;
          line-height: 26px;
        }
        p:first-child {
          margin-bottom: 10px;
        }
        p:last-child {
          font-size: 12px;
          color: $remarkColor;
          .iconfont {
            font-size: 14px;
            display: inline-block;
            transform: translateY(1px);
          }
        }
      }
      li:first-child {
        margin-top: 0;
      }
      li:last-child {
        border: none;
      }
    }
  }
  .no-data {
    text-align: center;
    margin-top: 100px;
    font-size: 17px;
    color: white;
    font-weight: bold;
  }
}
@media screen and (max-width: 1560px) {
  .service-and-news {
    flex-wrap: wrap;
    .service-box {
      flex: none !important;
      width: 100%;
    }
    .label-box {
      display: none;
    }
    .news-box {
      margin-top: 16px;
      width: 100%;
      margin-left: 0;
    }
  }
}
@media screen and (max-width: 1279px) {
  /deep/ .el-table__header-wrapper {
    table {
      th,
      td {
        padding: $fon12 0;
        .cell {
          padding: 0;
        }
      }
    }
  }
  /deep/ .el-table__body-wrapper {
    table {
      td {
        padding: $fon12 0;
        .cell {
          padding: 0;
        }
      }
    }
  }
  .service-and-news {
    // margin-bottom:14.5rem;
    .service-box {
      .table-box {
        padding: 1rem;
        padding-top: 0.5rem;
        margin-bottom: 3rem;
      }
    }
    .news-box {
      padding: 1rem;
      ul {
        li {
          .h4 {
            font-size: $fon14;
          }
          p:last-child {
            .iconfont {
              font-size: $fon14;
            }
            font-size: $fon12;
          }
        }
      }
      .no-data {
        font-size: $fon14;
      }
    }
  }
}
</style>