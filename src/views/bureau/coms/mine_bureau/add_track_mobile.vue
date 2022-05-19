// 移动端添加自选
<template>
  <div class="add-track-mobile">
    <MobileNav>
      <p>
        <!-- 添加自选 -->
        {{ $t("bureau_mine.add_track") }}
      </p>
    </MobileNav>
    <div class="view-inner-mobile">
      <div class="search-track">
        <span class="iconfont icon-sousuo_search"></span>
        <input
          type="text"
          :placeholder="$t('public.pls_inp')"
          v-model="searchTrack"
        />
      </div>
      <!-- 项目列表 -->
      <div v-if="hasData">
        <van-pull-refresh
          v-model="reloadTrack"
          :success-text="$t('public.reload')"
          @refresh="onRefreshTrack"
        >
          <!-- 刷新成功 -->
          <div style="min-height: 300px">
            <ul v-loading="loadTrack" class="track-list">
              <li v-for="i in trackList" :key="i.id">
                <!-- 图标 & 操作 -->
                <div class="logo-and-oper">
                  <p class="logo">
                    <img :src="i.logo" alt="" />
                  </p>
                  <p class="oper">
                    <span
                      class="iconfont icon-jia_plus"
                      @click="addTrackEv(i.free, 1, i.id)"
                      v-if="i.follow == 0"
                    ></span>
                    <span
                      class="iconfont icon-jian_minus"
                      @click="addTrackEv(i.free, 0, i.id)"
                      v-else
                    ></span>
                  </p>
                </div>
                <!-- 标题信息 -->
                <p class="pro-title">{{ i.title }}</p>
                <p class="pro-symbol">{{ i.symbol }}</p>
                <!-- 赛道 & 权限 -->
                <div class="auth-and-race">
                  <div
                    class="auth"
                    v-if="app.account.is_information == 2 && i.free == 0"
                  >
                    VIP
                  </div>
                  <div class="race">
                    <p v-for="a in i.race" :key="a.id">{{ a.name }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="page-tool" v-if="isNeedPage">
            <base-pagination
              :page-count="total"
              type="info"
              v-model="defaultPagination"
            ></base-pagination>
          </div>
        </van-pull-refresh>
      </div>
      <p class="no-data" v-else>
        <!-- 暂无项目 -->
        {{ $t("no_data.no_project") }}
      </p>
    </div>
    <!-- 会员专享 -->
    <NeedVIP ref="needvip" />
  </div>
</template>

<script>
import { trackPro, addTrack } from "@/request/api";
import { BasePagination } from "@/components";
import { mapState } from "vuex";
import { scrollBack } from "@/util/index";
// import { InfiniteScroll } from "element-ui";
export default {
  //   directives: {
  //     "infinite-scroll": InfiniteScroll,
  //   },
  data() {
    return {
      searchTrack: null, //搜索项目
      reloadTrack: false, //下拉刷新
      loadTrack: false, //数加载load
      hasData: true,
      isNeedPage: false,
      defaultPagination: 1,
      total: 1,
      trackList: [],
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  components: {
    MobileNav: (resolve) => require(["@/comsmine/mobile_nav"], resolve),
    BasePagination,
    NeedVIP: (resolve) => require(["./need_vip"], resolve),
  },
  created() {
    this.getTrackList();
  },
  watch: {
    defaultPagination() {
      this.getTrackList();
      scrollBack();
    },
  },
  methods: {
    async onRefreshTrack() {
      await this.getTrackList();
      setTimeout(() => {
        this.reloadTrack = false;
      }, 500);
    },
    //获取项目列表
    async getTrackList() {
      this.loadTrack = true;
      const result = await trackPro({
        follow: 0,
        page: this.defaultPagination,
        limit: 12,
      });
      this.total = result.last_page;
      this.loadTrack = false;
      this.trackList = result.data;
      result.last_page > 1
        ? (this.isNeedPage = true)
        : (this.isNeedPage = false);
      result.data.length == 0 && (this.hasData = false);
      result.data.length > 0 && (this.hasData = true);
    },
    //添加 & 移除 自选
    async addTrackEv(_is_free, _type, _id) {
      if (_is_free == 0 && this.app.account.is_information == 2) {
        this.$refs.needvip.needVIP = true;
        return;
      }
      const result = await addTrack({
        id: _id,
        follow: _type,
      });
      if (result.code !== 2000) {
        this.$notify({
          type: "danger",
          message: result.data.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        // 添加自选成功 & 移除自选成功
        message:
          _type == 1
            ? this.$t("notify.add_track")
            : this.$t("notify.move_track"),
      });
      this.getTrackList();
      this.$store.dispatch("upAccount");
    },
  },
};
</script>

<style lang="scss" scoped>
.view-inner-mobile {
  padding: 4rem 1rem;
  height: 100%;
  .search-track {
    width: 100%;
    padding: 1rem;
    background: $contentBg;
    border-radius: 4px;
    position: relative;
    .iconfont {
      font-size: 1rem;
      position: absolute;
      color: $textColor;
      left: $padd24;
      top: 1.5rem;
    }
    input {
      width: 100%;
      height: 2rem;
      border-radius: $fon18;
      background: $conBg2;
      color: white;
      font-size: 0.81rem;
      box-sizing: border-box;
      padding-left: 2rem;
    }
  }
  .track-list {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: calc(50% - 0.5rem);
      padding: 1rem;
      background: $contentBg;
      border-radius: 4px;
      margin-bottom: 1rem;
      .logo-and-oper {
        display: flex;
        justify-content: space-between;
        .logo {
          width: 2rem;
          height: 2rem;
          background: $mineBg;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 1.75rem;
            height: 1.75rem;
            border-radius: 50%;
            background: white;
          }
        }
        .oper {
          width: $padd24;
          height: $padd24;
          border-radius: 4px;
          background: $conBg2;
          display: flex;
          justify-content: center;
          align-items: center;
          .iconfont {
            font-size: $fon20;
            color: white;
          }
        }
      }
      .pro-title {
        margin-top: 1rem;
        color: white;
        font-weight: bold;
        font-size: 0.81rem;
      }
      .pro-symbol {
        font-size: $fon12;
        color: $remarkColor;
        margin-top: 0.25rem;
      }
      .auth-and-race {
        margin-top: 0.5rem;
        display: flex;
        .auth {
          padding: 2px 8px;
          background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
          font-size: $fon12;
          color: $titleColor;
          font-weight: bold;
          border-radius: 4px;
          margin-right: 0.5rem;
          max-height: 1rem;
        }
        .race {
          display: flex;
          flex-wrap: wrap;
          p {
            padding: 2px 8px;
            font-size: $fon12;
            color: $success;
            background: rgba(167, 240, 186, 0.1);
            border-radius: 4px;
            margin-right: 0.25rem;
            margin-bottom: 0.5rem;
          }
        }
      }
    }
  }
  .page-tool {
    display: flex;
    justify-content: center;
  }
}
</style>