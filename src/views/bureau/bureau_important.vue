<template>
  <div class="bureau-important" ref="important_box">
    <!-- 头部导航 -->
    <div class="important-header">
      <div class="header-logo">
        <img
          :src="
            require(`@/assets/images/${
              $flag ? 'important_title_mobile' : 'important_title'
            }.png`)
          "
          alt=""
        />
        <p v-if="$flag">
          <span></span>
          重点情报
        </p>
      </div>
      <div class="header-oper">
        <p type="icon" v-if="false" class="iconfont icon-sousuo_search"></p>
        <el-dropdown
          placement="bottom"
          @command="handleCommand"
          :trigger="$flag ? 'click' : 'hover'"
          @visible-change="menuChange"
        >
          <div class="connect-msg" v-if="!$flag">
            <div class="address-icon" ref="addressIcon"></div>
            <div class="address-text">
              <p v-if="app.account.wallet_address">
                {{ app.account.wallet_address.substr(0, 4) }}
                ...
                {{ app.account.wallet_address.substr(38, 4) }}
              </p>
              <p v-else>
                {{ app.account.mobile.substr(0, 3) }}
                ...
                {{ app.account.mobile.substr(7, 11) }}
              </p>
            </div>
            <p
              class="iconfont icon-xia_down"
              type="icon"
              :class="iconStatusClass"
            ></p>
          </div>
          <div class="address-icon" v-else ref="addressIcon"></div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="$flag">
              <div class="address-text">
                <span class="iconfont icon-wode_me"></span>
                <p v-if="app.account.wallet_address">
                  {{ app.account.wallet_address.substr(0, 4) }}
                  ...
                  {{ app.account.wallet_address.substr(38, 4) }}
                </p>
                <p v-else>
                  {{ app.account.mobile.substr(0, 3) }}
                  ...
                  {{ app.account.mobile.substr(7, 11) }}
                </p>
              </div>
            </el-dropdown-item>
            <el-dropdown-item
              icon="iconfont icon-leida_radar"
              divided
              command="back"
              v-if="$flag"
            >
              <!-- 回情报局 -->
              回情报局
            </el-dropdown-item>
            <el-dropdown-item
              icon="iconfont icon-leida_radar"
              command="back"
              v-else
            >
              <!-- 回情报局 -->
              回情报局
            </el-dropdown-item>
            <el-dropdown-item icon="iconfont icon-kaiguan_power" command="out">
              <!-- 退出登录 -->
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="important-tabs">
      <div
        class="all-important"
        :class="tabIndex == 99 && 'active-tab'"
        @click="
          tabIndex = 99;
          puid = null;
          getData();
        "
      >
        <span class="iconfont icon-xingxing_star" type="icon"></span>
        <p>重点情报</p>
      </div>
      <ul v-dragscroll v-if="false">
        <li
          v-for="(mineT, indexMT) in mineTrack"
          :key="indexMT"
          :class="indexMT == tabIndex && 'active-tab'"
          @click="
            tabIndex = indexMT;
            puid = mineT.id;
            getData();
          "
        >
          <img :src="mineT.logo" alt="" />
          <p>{{ mineT.symbol }}</p>
        </li>
        <li></li>
      </ul>
    </div>
    <div class="exporess-list">
      <div class="center-list" v-loading="loadData" v-if="isHasData">
        <van-pull-refresh
          v-model="loadRefresh"
          :success-text="$t('public.reload')"
          @refresh="refreshExpress"
          :disabled="!$flag"
        >
          <!-- 刷新成功 -->
          <ul
            v-infinite-scroll="loadMoreEv"
            infinite-scroll-immediate="false"
            infinite-scroll-disabled="disabled"
          >
            <li v-for="(d, a) in BAShowList" :key="a">
              <!-- 标题信息 -->
              <div class="icon-box">
                <p class="icon-month">
                  <span>
                    {{ d.date_week }}
                  </span>
                  <span> {{ d.date_month }} </span>
                </p>
                <p>
                  {{ d.date_day }}
                </p>
              </div>
              <!-- 内容盒子 -->
              <div
                class="content-box"
                v-for="(i, indexI) in d.list"
                :key="indexI + 'd'"
              >
                <div class="inner-parent">
                  <div>
                    <div class="pro-icon">
                      <img :src="i.logo" alt="" />
                    </div>
                    <p class="mobile-pro-time" v-if="$flag">
                      {{ i.publish_time_minute }}
                    </p>
                  </div>
                  <!-- 内容 -->
                  <div
                    class="content-inner"
                    :class="[$flag && 'mobile-contnet-inner']"
                    :style="{ 'padding-bottom': `${i.analysis ? 16 : 24}px` }"
                  >
                    <!-- 标题信息 -->
                    <div class="content-title">
                      <div class="content-title-msg">
                        <div class="min-msg">
                          {{ $flag ? "" : i.publish_time_minute }}
                          <span class="pro-name">
                            {{ i.projectTitle }}
                          </span>
                          <span>
                            <span
                              class="content-type"
                              v-if="
                                dataIndex == 999 ||
                                dataIndex == 101 ||
                                dataIndex == 102
                              "
                            >
                              {{
                                (i.type == 1 && "Twitter") ||
                                /** 论坛 */
                                (i.type == 2 && $t("bureau_express.forum")) ||
                                (i.type == 3 && "Medium") ||
                                /** 交易所公告 */
                                (i.type == 5 && $t("bureau_express.ann")) ||
                                /** 全网提案 */
                                (i.type == 6 && $t("routes.network_pro")) ||
                                (i.type == 7 && "Discord") ||
                                /** 未来事件 */
                                (i.type == 100 && $t("routes.future_ev"))
                              }}
                            </span>
                          </span>
                          <!-- 价格 -->
                          <span class="min-price" v-if="i.price">
                            <sub>|</sub>
                            <span class="price-title">
                              {{ $flag ? "" : "Price:" }} &nbsp;<font
                                :class="
                                  i.price_change_percentage > 0
                                    ? 'up-price'
                                    : 'down-price'
                                "
                                >${{ i.price }}&nbsp;<span class="price-cent"
                                  >{{ i.price_change_percentage > 0 ? "+" : ""
                                  }}{{ i.price_change_percentage }}%</span
                                ></font
                              ></span
                            >
                          </span>
                        </div>
                        <p class="title-new">
                          {{ app.language == "en" ? i.title : i.title_zh }}
                          <span
                            class="view-source-inner"
                            v-if="i.content_url"
                            @click="
                              $store.dispatch('setPoint', 23);
                              viewOffcial(i.content_url);
                              staAllEvs(5, i.id);
                            "
                            >[查看来源]</span
                          >
                        </p>
                      </div>
                      <!-- Pc端操作盒子 -->
                      <div class="like-box">
                        <!-- 分析状态 -->
                        <p class="ang-status" v-if="i.analysis_status == 2">
                          <span class="iconfont icon-gengduo2_more-two"></span>
                          <!-- 待分析 -->
                          {{ $t("bureau_express.un_ana") }}
                        </p>
                        <p
                          class="ang-status has-ang"
                          v-if="i.analysis_status == 3"
                        >
                          <span class="iconfont icon-xiaoyan2_check-one"></span>
                          <!-- 已分析 -->
                          {{ $t("bureau_express.has_ana") }}
                        </p>
                        <!-- 查看来源 -->
                        <el-popover
                          placement="top"
                          trigger="hover"
                          :content="$t('public.soure')"
                        >
                          <p
                            slot="reference"
                            class="twitter-translate view-source"
                            @click="
                              $store.dispatch('setPoint', 23);
                              viewOffcial(i.content_url);
                              staAllEvs(5, i.id);
                            "
                          >
                            <i
                              class="iconfont icon-yuanbian-lianjie_link-two"
                            ></i>
                          </p>
                        </el-popover>
                        <!-- 收藏 -->
                        <el-popover
                          placement="top"
                          trigger="hover"
                          :content="$t('bureau_express.add_fav')"
                          v-if="i.type != 100"
                        >
                          <!-- 添加收藏 -->
                          <p
                            class="like-round"
                            slot="reference"
                            @click="like(i.id, i.favorite == 1 ? 0 : 1)"
                            :class="{ 'has-like': i.favorite == 1 }"
                          >
                            <span
                              class="iconfont"
                              :class="
                                i.favorite == 1
                                  ? 'icon-yuanbian-xihuan_shixin_like'
                                  : 'icon-yuanbian-xihuan_like'
                              "
                            ></span>
                          </p>
                        </el-popover>
                        <!-- 忽略 -->
                        <el-popover
                          placement="top"
                          trigger="hover"
                          :content="$t('year_vip.ignore')"
                          v-if="i.type != 100"
                        >
                          <p
                            slot="reference"
                            @click="neglect(i.id)"
                            class="like-round"
                          >
                            <span
                              class="iconfont icon-yuanbian-jinzhi_forbid"
                            ></span>
                          </p>
                        </el-popover>
                      </div>
                    </div>
                    <div
                      class="inner-text"
                      :class="{ 'out-max': i.type == 1 }"
                      v-if="app.language == 'en'"
                    >
                      {{ i.abstract }}
                    </div>
                    <div
                      v-else
                      class="inner-text"
                      :class="{ 'out-max': i.type == 1 }"
                      v-html="
                        i.type != 4 && i.abs_translate
                          ? i.abstract
                          : i.abstract_zh
                      "
                    ></div>
                    <p v-if="i.expand_url" class="expand-url" @click="viewOutSide(i.expand_url)" style="color:#115af0;">
                      扩展阅读
                    </p>
                    <!-- 推特 -> 图片消息 -->
                    <div class="twitter-box" v-if="i.image_url.length > 0">
                      <div class="img-box-twitter">
                        <div
                          class="img-inner"
                          v-for="(tImg, a) in i.image_url"
                          :key="a"
                        >
                          <el-image
                            :src="tImg"
                            :preview-src-list="i.image_url"
                            fit="cover"
                            v-if="i.t_type != 10"
                          >
                          </el-image>
                          <img
                            :src="tImg"
                            v-else
                            @click="viewOffcial(i.content_url)"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <!-- 推特 -> 链接 -->
                    <div
                      class="twitter-link-box"
                      v-if="i.type == 1 && i.t_type == 7"
                    >
                      <el-image
                        v-if="i.extend_img_url"
                        :style="{
                          width: $flag ? '100%' : '480px',
                          height: $flag ? '4rem' : '250px',
                        }"
                        :src="i.extend_img_url"
                        fit="cover"
                        :preview-src-list="[i.extend_img_url]"
                      >
                      </el-image>
                      <div
                        class="link-box-title"
                        @click="viewOffcial(i.extend_url)"
                      >
                        <div v-if="i.extendTitle">
                          <p class="link-title text-overflow">
                            {{
                              i.abs_translate ? i.extendTitle : i.extendTitle_zh
                            }}
                          </p>
                          <p
                            class="link-content two-elip"
                            v-if="app.language == 'en'"
                          >
                            {{ i.extendAbstract }}
                          </p>
                          <p class="link-content two-elip" v-else>
                            {{
                              i.abs_translate
                                ? i.extendAbstract
                                : i.extendAbstract_zh
                            }}
                          </p>
                        </div>
                        <p class="only-link" v-else>
                          {{ i.extend_url }}
                        </p>
                      </div>
                    </div>
                    <!-- 推特 -> 转推 -->
                    <div
                      class="twitter-retweet"
                      v-if="i.type == 1 && i.t_type == 8"
                    >
                      <div class="retweet-pro">
                        <img :src="i.extend_avatar" alt="" />
                        <p>{{ i.extend_nickname }}</p>
                        <span>@{{ i.extend_name_date }}</span>
                        <!-- <span>10月4日</span> -->
                      </div>
                      <div
                        v-if="app.language == 'en'"
                        class="retweet-con"
                        v-html="i.extendAbstract"
                      ></div>
                      <div
                        v-else
                        class="retweet-con"
                        v-html="
                          i.abs_translate
                            ? i.extendAbstract
                            : i.extendAbstract_zh
                        "
                      ></div>
                    </div>
                    <!-- 推特 -> 投票 -->
                    <div
                      class="twitter-vote"
                      v-if="i.type == 1 && (i.t_type == 6 || i.t_type == 9)"
                    >
                      <ul>
                        <li
                          v-for="(voteIns, indexVote) in i.polls"
                          :key="indexVote"
                        >
                          <p>{{ voteIns.title }}</p>
                          <p>{{ voteIns.result }}%</p>
                          <div
                            class="vote-bg"
                            :style="{ width: voteIns.result + '%' }"
                          ></div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- 推特主题帖 -->
                  <div v-if="i.type == 1 && i.t_type == 11">
                    <div
                      class="twitter-two-con"
                      :class="[$flag && 'mobile-contnet-inner']"
                      v-for="(twitterTwo, indexTW) in i.relations"
                      :key="indexTW"
                    >
                      <p class="contact-line"></p>
                      <div
                        v-if="app.language == 'en'"
                        class="inner-text"
                        :class="{ 'out-max': i.type == 1 }"
                        v-html="twitterTwo.abstract"
                      ></div>
                      <div
                        v-else
                        class="inner-text"
                        :class="{ 'out-max': i.type == 1 }"
                        v-html="
                          i.abs_translate
                            ? twitterTwo.abstract
                            : twitterTwo.abstract_zh
                        "
                      ></div>
                      <div
                        class="twitter-box"
                        v-if="twitterTwo.image_url.length > 0"
                      >
                        <div
                          class="img-box-twitter"
                          v-if="twitterTwo.image_url.length > 0"
                        >
                          <div
                            class="img-inner"
                            v-for="(tImg, a) in twitterTwo.image_url"
                            :key="a"
                          >
                            <el-image
                              :src="tImg"
                              fit="cover"
                              :preview-src-list="twitterTwo.image_url"
                            >
                            </el-image>
                          </div>
                        </div>
                      </div>
                      <!-- 推特 -> 链接 -->
                      <div
                        class="twitter-link-box"
                        v-if="i.type == 1 && twitterTwo.t_type == 7"
                      >
                        <el-image
                          v-if="twitterTwo.extend_img_url"
                          fit="cover"
                          :style="{
                            width: $flag ? '100%' : '94px',
                            height: $flag ? '4rem' : '94px',
                          }"
                          :src="twitterTwo.extend_img_url"
                          :preview-src-list="[twitterTwo.extend_img_url]"
                        >
                        </el-image>
                        <div
                          class="link-box-title"
                          @click="viewOffcial(twitterTwo.extend_url)"
                        >
                          <div v-if="twitterTwo.extendTitle_zh">
                            <p class="link-title" v-if="app.language == 'en'">
                              {{ twitterTwo.extendTitle }}
                            </p>
                            <p class="link-title" v-else>
                              {{
                                i.abs_translate
                                  ? twitterTwo.extendTitle
                                  : twitterTwo.extendTitle_zh
                              }}
                            </p>
                            <p
                              class="link-content two-elip"
                              v-if="app.language == 'en'"
                            >
                              {{ twitterTwo.extendAbstract }}
                            </p>
                            <p class="link-content two-elip" v-else>
                              {{
                                i.abs_translate
                                  ? twitterTwo.extendAbstract
                                  : twitterTwo.extendAbstract_zh
                              }}
                            </p>
                          </div>
                          <p class="only-link" v-else>
                            {{ twitterTwo.extend_url }}
                          </p>
                        </div>
                      </div>
                      <!-- 推特 -> 投票 -->
                      <div
                        class="twitter-vote"
                        v-if="
                          i.type == 1 &&
                          (twitterTwo.t_type == 6 || twitterTwo.t_type == 9)
                        "
                      >
                        <ul>
                          <li
                            v-for="(voteIns, indexVote) in twitterTwo.polls"
                            :key="indexVote"
                          >
                            <p>{{ voteIns.title }}</p>
                            <p>{{ voteIns.result }}%</p>
                            <div
                              class="vote-bg"
                              :style="{ width: voteIns.result + '%' }"
                            ></div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="reply-parent" v-if="i.analysis">
                  <!-- 研究员观点 -->
                  <div class="reply-box">
                    <p>
                      <!-- 研究员分析 -->
                      {{ $t("bureau_express.ann_back") }}
                    </p>
                    <p class="reply-content">
                      {{ i.analysis }}
                    </p>
                    <span class="reply-tri"></span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </van-pull-refresh>
        <p
          v-if="loadMore"
          v-loading="loadMore"
          class="load-more-mine"
          :element-loading-text="`${$t('public.con_load')}...`"
          element-loading-spinner="el-icon-loading"
        >
          <!-- 拼命加载中 -->
        </p>
        <p v-if="noMore" class="no-more">
          {{
            dataIndex == 1
              ? $t("bureau_express.limit")
              : $t("bureau_express.no_more")
          }}
        </p>
      </div>
      <p class="no-data" v-else>
        <!-- 暂无情报 -->
        {{ $t("no_data.no_intell") }}
      </p>
    </div>
    <div class="back-top-important" @click="testBack">
      <p class="iconfont icon-shang_up"></p>
    </div>
  </div>
</template>

<script>
import { BAShowList, trackPro, StaImportant } from "@/request/api";
import { mapState } from "vuex";
import { InfiniteScroll } from "element-ui";
import jazzicon from "@metamask/jazzicon";
export default {
  directives: {
    "infinite-scroll": InfiniteScroll,
  },
  data() {
    return {
      defaultPagination: 1,
      loadData: false,
      BAShowList: [],
      isHasData: true, //是否有数据
      loadRefresh: false, //下拉刷新状态
      isNeedPage: false, //是否需要分页器
      dataTotal: 999,
      dataIndex: 101, //当前选择数据类型
      loadMore: false, //加载更多
      tabIndex: 99, //菜单选择下标
      puid: null,
      mineTrack: [
        {
          img: require("@/assets/images/test.png"),
          name: "Opensea",
        },
        {
          img: require("@/assets/images/test.png"),
          name: "Dydx",
        },
      ],
      iconStatusClass: "",
      menuStatus: false, //菜单展开状态
    };
  },
  created() {
    this.getMineTrack();
    this.getData();
    setInterval(() => {
      this.staAllEvs(2);
    }, 1000 * 60 * 10);
  },
  computed: {
    ...mapState(["app"]),
    noMore() {
      return this.dataTotal == 0;
    },
    // 禁用滚动加载
    disabled() {
      return this.loadMore || this.noMore;
    },
  },
  updated() {
    const el = jazzicon(
      16,
      parseInt(this.app.account.wallet_address.slice(2, 10), 16)
    );
    if (this.$refs.addressIcon && !this.$refs.addressIcon.children[0]) {
      this.$refs.addressIcon.appendChild(el);
    }
    if (
      this.$refs.addressIconMobile &&
      !this.$refs.addressIconMobile.children[0]
    ) {
      this.$refs.addressIconMobile.appendChild(el);
    }
  },
  // beforeCreate() {
  //   document
  //     .querySelector("body")
  //     .setAttribute("class", "sidebar-mini white-bg");
  // },
  // beforeDestroy() {
  //   document
  //     .querySelector("body")
  //     .setAttribute("class", "sidebar-mini");
  // },
  mounted() {
    // this.$flag && window.addEventListener("scroll", this.closeTooltip, true);
  },
  methods: {
    //获取我的自选
    async getMineTrack() {
      const result = await trackPro({ follow: 1, limit: 500 });
      this.mineTrack = result.data;
    },
    //获取情报列表
    async getData() {
      this.defaultPagination == 1 && (this.loadData = true);
      const result = await BAShowList({
        type: 101,
        ipid: this.puid,
        limit: 10,
        page: this.defaultPagination,
        elite: 1,
        is_elite: 1,
      });
      this.loadData = false;
      if (this.defaultPagination > 1) {
        result.data.forEach((to) => {
          this.BAShowList.push(to);
        });
      } else {
        this.BAShowList = result.data;
      }
      this.loadMore = false;
      this.dataTotal = result.data.length;
    },
    //下拉刷新
    async refreshExpress() {
      await this.getData();
      setTimeout(() => {
        this.loadRefresh = false;
      }, 500);
    },
    //加载更多
    loadMoreEv() {
      this.defaultPagination += 1;
      // console.log(this.defaultPagination);
      this.loadMore = true;
      // return
      setTimeout(async () => {
        await this.getData();
      }, 500);
    },
    //下拉菜单展开事件
    menuChange(_bool) {
      if (_bool) {
        this.iconStatusClass = "iconUp";
      } else {
        this.iconStatusClass = "";
      }
    },
    handleCommand(_command) {
      _command == "back" &&
        (this.$router.push({ path: "/mine-bureau", query: { type: 1 } }),
        this.staAllEvs(3));
      _command == "out" && (window.loginOut(), this.staAllEvs(4));
    },
    //埋点统计
    staAllEvs(_type, _id) {
      /**
       * @param _type == 1 - > 登录
       * @param _type == 2 - > 停留
       * @param _type == 3 - > 返回情报局
       * @param _type == 4 - > 退出登录
       * @param _type == 5 - > 来源按钮
       */
      StaImportant({ type: _type, id: _id ? _id : "" });
    },
    //访问来源
    viewOffcial(_url) {
      let tmp = window.open("about:blank", "", "fullscreen=1");
      tmp.moveBy(500, 300);
      tmp.resizeTo(1366, 768);
      tmp.focus();
      tmp.location = _url;
    },
    closeTooltip() {
      // console.log(this.$refs.test)
      // this.$refs.test.blur()
    },
    testBack() {
      this.$refs.important_box.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    viewOutSide(_url){
      window.open(_url)
    },
  },
};
</script>

<style lang="scss" scoped>
.expand-url{
  text-align: left!important;
  font-size: 14px;
  cursor:pointer;
  margin-top: 8px;
}
/deep/ .el-dropdown-menu__item {
  justify-content: left;
}
/deep/ .el-dropdown-menu__item--divided {
  display: inline-block;
  margin-left: 12px;
  padding-left: 8px;
}
/deep/ .van-pull-refresh {
  min-height: 300px;
}
.bureau-important {
  width: 100vw;
  height: 100vh;
  background: white;
  overflow: auto;
  // filter: grayscale(100%);
  .important-header {
    width: 100%;
    height: 76px;
    border-bottom: 1px solid #eee;
    background: white;
    padding: 0 25vw;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    justify-content: space-between;
    align-items: center;
    z-index: 200;
    img {
      width: 140px;
      height: 32px;
    }
    .header-oper {
      display: flex;
      align-items: center;
      p[type="icon"] {
        font-size: 24px;
        color: #999;
        cursor: pointer;
      }
      .connect-msg {
        width: 160px;
        height: 40px;
        border-radius: 20px;
        background: rgba(124, 126, 194, 0.12);
        margin-left: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        .address-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          transform: translateY(-1px);
        }
        .address-text {
          p {
            font-size: 13px;
            color: #383952;
          }
        }
        p[type="icon"] {
          font-size: 24px;
          color: #999;
          transition: 0.3s all;
          margin-left: 12px;
        }
        .iconUp {
          transform: rotate(180deg);
        }
      }
    }
  }
  .important-tabs {
    padding: 24px 25vw 16px;
    margin-bottom: 24px;
    position: fixed;
    background: white;
    top: 76px;
    width: 100%;
    left: 0;
    z-index: 200;
    display: flex;
    .all-important {
      border-radius: 4px;
      background: white;
      display: flex;
      align-items: center;
      padding: 0 16px;
      margin-right: 8px;
      height: 48px;
      transition: 0.3s all;
      margin-right: 8px;
      cursor: pointer;
      span[type="icon"] {
        font-size: 20px;
        color: #333;
        margin-right: 8px;
      }
      p {
        color: #333;
        font-size: 14px;
      }
    }
    ul::-webkit-scrollbar {
      display: none;
    }
    ul {
      display: flex;
      flex: 1;
      overflow: auto;
      li {
        border-radius: 4px;
        background: #f5f5f7;
        display: flex;
        align-items: center;
        padding: 0 16px;
        margin-right: 8px;
        height: 48px;
        transition: 0.3s all;
        cursor: pointer;
        min-width: 112px;
        justify-content: center;
        p {
          color: #333;
          font-size: 14px;
          white-space: nowrap;
        }
        img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 8px;
        }
      }
      li:last-child {
        flex: 1;
        margin-right: 0;
      }
      li:hover {
        background: #ebecf0;
      }
      li:last-child:hover {
        background: white;
      }
    }
    .active-tab,
    .active-tab:hover {
      background: #6e71b8;
      span[type="icon"] {
        color: white !important;
      }
      p {
        color: white;
      }
    }
  }
  .exporess-list {
    width: 100%;
    display: flex;
    margin-top: 182px;
    padding: 0 25vw;
    .center-list {
      flex: 1;
      width: 100%;
      min-height: 800px;
      padding-bottom: 30px;
      ul {
        li {
          display: flex;
          flex-direction: column;
          margin-bottom: 4px;
          min-height: 132px;
          border-bottom: 1px solid #ebecf0;
          margin-bottom: 40px;
          .icon-box {
            width: 80px;
            height: 40px;
            background: rgba(124, 126, 194, 0.1);
            margin-right: 16px;
            display: flex;
            align-items: center;
            border-radius: 4px;
            margin-bottom: 24px;
            p:first-child {
              width: 36px;
              background: rgba(124, 126, 194, 0.1);
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              border-radius: 4px 0 0 4px;
              font-size: 12px;
              span {
                color: #6e71b8;
              }
              span:last-child {
                font-weight: bold;
              }
            }
            p:last-child {
              font-size: 24px;
              flex: 1;
              font-weight: bold;
              color: #6e71b8 !important;
            }
          }
          .content-box {
            flex: 1;
            margin-bottom: 24px;
            .inner-parent {
              display: flex;
              .pro-icon {
                margin-right: 16px;
                width: 48px;
                height: 48px;
                border: 1px solid #ddd;
                border-radius: 50%;
                img {
                  border-radius: 50%;
                }
              }
            }
            .content-title {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              .content-title-msg {
                padding-top: 2px;
                .can-click:hover {
                  text-decoration: underline;
                  cursor: pointer;
                }
                .min-msg {
                  font-size: 14px;
                  text-align: left;
                  margin-bottom: 6px;
                  color: #808080 !important;
                  .pro-name {
                    margin-left: 8px;
                  }
                  .content-type {
                    height: 100%;
                    line-height: 20px;
                    border-radius: 4px;
                    font-size: 13px;
                    padding: 0 8px;
                    background: #f6f6f6;
                    color: #808080;
                    margin-left: 8px;
                  }
                  .min-price {
                    sub {
                      margin: 0 12px;
                      display: inline-block;
                      transform: translateY(-3px);
                      color: #dddddd;
                    }
                    .price-title {
                      display: inline-block;
                      transform: translateY(1px);
                      .price-cent {
                        padding: 1px 4px;
                        border-radius: 4px;
                        font-size: 12px;
                      }
                      .up-price {
                        color: #338f68;
                        .price-cent {
                          background: rgba(51, 143, 104, 0.1);
                        }
                      }
                      .down-price {
                        color: #cc4949;
                        .price-cent {
                          background: rgba(204, 73, 73, 0.1);
                        }
                      }
                    }
                  }
                }
                .title-new {
                  font-size: 16px;
                  color: $titleColor;
                  font-weight: bold;
                  text-align: left;
                  line-height: 20px;
                  .view-source-inner {
                    font-size: 13px;
                    color: #115af0;
                    cursor: pointer;
                    margin-left: 8px;
                    font-weight: 400;
                  }
                }
              }
              .content-title-msg-mobile {
                display: flex;
                align-items: center;
                width: 100%;
                .twitter-account {
                  display: inline-block;
                  color: $remarkColor;
                }
                p {
                  flex: none;
                  .future-title-mobile {
                    color: $success;
                    font-size: $fon12;
                  }
                }
                p:first-child {
                  width: $padd40;
                  height: $padd40;
                  max-width: $padd40;
                  max-height: $padd40;
                  border-radius: 50%;
                  background: white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 1rem;
                  img {
                    width: 2.25rem;
                    height: 2.25rem;
                    border-radius: 50%;
                  }
                }
                p:last-child {
                  flex: 1;
                  text-align: left;
                  font-size: 0.81rem;
                  color: white;
                  font-weight: bold;
                  display: flex;
                  align-items: flex-start;
                  flex-direction: column;
                  justify-content: center;
                }
                .two-elip {
                  font-size: $fon14;
                  color: white;
                  text-align: left;
                }
              }
              .like-box {
                display: none;
                align-items: center;
                position: absolute;
                top: 0;
                right: 0;
                .ang-status {
                  height: 24px;
                  border-radius: 16px;
                  padding: 0 8px;
                  font-size: 12px;
                  background: rgba(255, 212, 92, 0.1);
                  color: #ffd45c;
                  display: flex;
                  align-items: center;
                  .iconfont {
                    font-size: 16px;
                    margin-right: 4px;
                  }
                }
                .has-ang {
                  background: rgba(167, 240, 186, 0.1);
                  color: $success;
                }
                .add-calendar-icon {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #8a3ffc;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  margin-left: 24px;
                  .iconfont {
                    font-size: 16px;
                    color: white;
                  }
                }
                .has-add-calendar {
                  padding: 4px 8px;
                  background: $conBg2;
                  color: $remarkColor;
                  border-radius: 16px;
                  font-size: 12px;
                  display: flex;
                  align-items: center;
                  margin-left: 16px;
                  .iconfont {
                    font-size: 16px;
                    margin-right: 4px;
                  }
                }
                .twitter-translate {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  flex: inherit;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-left: 24px;
                  position: relative;
                  font-weight: 500;
                  cursor: pointer;
                  i {
                    font-size: 24px;
                    color: $remarkColor;
                  }
                  i:hover {
                    color: white;
                  }
                  span {
                    display: inline-block;
                    width: 1px;
                    height: 16px;
                    background: $lineTwoColor;
                    position: absolute;
                    right: -20px;
                    top: 50%;
                    margin-top: -8px;
                  }
                }
                .view-source {
                  // margin-right: 16px;
                }
                div {
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  p:last-child {
                    font-size: 13px;
                    font-weight: bold;
                    color: $textColor;
                  }
                }
                .like-round {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  flex: inherit;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-left: 24px;
                  cursor: pointer;
                  .iconfont {
                    font-size: 24px;
                    color: $remarkColor;
                    font-weight: 400;
                  }
                  .iconfont:hover {
                    color: white;
                  }
                }
                .has-like {
                  color: #7c7ec2 !important;
                  border-color: #7c7ec2;
                  .iconfont {
                    color: #7c7ec2;
                  }
                }
                .un-like {
                  color: #ff8389 !important;
                  border-color: #ff8389;
                  .iconfont {
                    color: #ff8389;
                  }
                }
              }
            }
            .content-title-msg-an {
              margin-bottom: 24px;
              .content-title-msg {
                p:first-child {
                  margin-bottom: 12px;
                }
              }
            }
            .inner-text {
              font-size: 14px;
              color: #808080;
              line-height: 22px;
              overflow: hidden;
              white-space: pre-wrap;
              /deep/ span {
                color: #808080!important;
                font-size: 14px!important;
                margin: 0;
              }
              /deep/ h1 {
                color: #808080!important;
                margin: 0;
              }
              /deep/ h2 {
                color: #808080!important;
                margin: 0;
              }
              /deep/ h3 {
                color: #808080!important;
                margin: 0;
              }
              /deep/ h4 {
                color: #808080!important;
                margin: 0;
              }
              /deep/ h5 {
                color: #808080!important;
                margin: 0;
              }
              /deep/ p {
                font-size: 14px!important;
                color: #808080!important;
              }
              // /deep/ br {
              //   display: none;
              // }
              /deep/ p,
              strong {
                color: #808080!important;
                font-size: 14px;
                // margin-bottom: 10px !important;
              }
              /deep/ strong {
                margin-bottom: 0;
              }
            }
            .twitter-box {
              margin-top: 16px;
              .img-box-twitter {
                display: flex;
                img {
                  width: 80px;
                  height: 80px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  margin-right: 12px;
                }
                .img-inner {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                  border-radius: 4px;
                  cursor: pointer;
                  /deep/ .el-image {
                    width: 80px;
                    height: 80px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-right: 12px;
                    // display: flex;
                    // align-items: center;
                    // img{
                    //   height: auto;
                    //   width: auto;
                    // }
                  }
                }
              }
            }
            .twitter-link-box {
              background: $conBg2;
              border-radius: 4px;
              margin-top: 24px;
              cursor: pointer;
              display: flex;
              max-height: 358px;
              width: 480px;
              align-items: center;
              flex-direction: column;
              p {
                text-align: left;
              }
              .link-box-title {
                flex: 1;
                padding: 24px;
                width: 100%;
                .only-link {
                  font-size: 14px;
                  color: $textColor;
                }
              }
              .link-title {
                font-size: 13px;
                color: $textColor;
                margin-bottom: 4px;
              }
              .link-content {
                font-size: 13px;
                color: $remarkColor;
                line-height: 22px;
                margin-bottom: 4px;
              }
              .link-url {
                font-size: 13px;
                color: $remarkColor;
                word-break: break-all;
                padding-right: 1rem;
              }
            }
            .twitter-retweet {
              padding: 16px 24px;
              background: $conBg2;
              border-radius: 4px;
              margin-top: 24px;
              .retweet-pro {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                justify-content: flex-start;
                flex-wrap: wrap;
                line-height: $fon18;
                img {
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                }
                p {
                  font-size: 12px;
                  color: white;
                  margin: 0 8px;
                  font-weight: bold;
                  flex: none;
                }
                span {
                  font-size: 12px;
                  color: $remarkColor;
                  margin-right: 16px;
                }
              }
              .retweet-con {
                font-size: 13px;
                color: $remarkColor;
                line-height: 22px;
                /deep/ h1 {
                  color: $titleColor;
                  margin: 16px 0;
                }
                /deep/ h2 {
                  color: $titleColor;
                  margin: 16px 0;
                }
                /deep/ h3 {
                  color: $titleColor;
                  margin: 16px 0;
                }
                /deep/ h4 {
                  color: $titleColor;
                  margin: 16px 0;
                }
                /deep/ h5 {
                  color: $titleColor;
                  margin: 16px 0;
                }
                /deep/ strong {
                  color: $titleColor;
                  margin: 16px 0;
                }
                /deep/ p {
                  color: $titleColor;
                  margin: 16px 0;
                }
                /deep/ ul {
                  li {
                    margin: 16px 0;
                    color: $titleColor;
                  }
                }
                /deep/ ol {
                  li {
                    margin: 16px 0;
                    color: $titleColor;
                  }
                }
                /deep/ img {
                  margin: 16px 0;
                }
              }
            }
            .twitter-vote {
              // padding: 16px 24px;
              // background: $conBg2;
              border-radius: 4px;
              margin-top: 24px;
              .vote-title {
                font-size: 13px;
                color: $remarkColor;
                margin-bottom: 16px;
                text-align: left;
              }
              ul {
                li {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  height: 32px;
                  margin-bottom: 8px;
                  font-size: 13px;
                  padding-left: 24px;
                  padding-right: 16px;
                  align-items: center;
                  position: relative;
                  border-radius: 4px;
                  overflow: hidden;
                  .vote-bg {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    background: $conBg2;
                    z-index: 100;
                  }
                  p {
                    font-size: 13px;
                    flex: none;
                    position: relative;
                    z-index: 200;
                  }
                  p:first-child {
                    color: $textColor;
                  }
                  p:nth-child(2) {
                    color: white;
                    font-weight: bold;
                  }
                }
                li:last-child {
                  margin-bottom: 0;
                }
              }
            }
            .ang-box-discord {
              border-radius: 4px;
              background: $conBg2;
              margin-top: 16px;
              height: 94px;
              display: flex;
              align-items: center;
              padding-right: 24px;
              cursor: pointer;
              img {
                height: 100%;
                width: 94px;
              }
              .ang-other {
                flex: 1;
                margin-left: 24px;
                p {
                  text-align: left;
                }
                p:first-child {
                  font-size: 13px;
                  color: $textColor;
                  margin-bottom: 4px;
                }
                p:nth-child(2) {
                  font-size: 13px;
                  color: $remarkColor;
                  line-height: 22px;
                  margin-bottom: 4px;
                }
                p:last-child {
                  font-size: 13px;
                  color: $remarkColor;
                }
              }
            }
            .content-inner {
              flex: 1;
              border-radius: 4px;
              position: relative;
              padding-bottom: 24px;
              border-bottom: 1px solid #ebecf0;
              .out-max {
                max-height: none !important;
              }
              .attention-sign {
                position: absolute;
                top: 0;
                right: 0;
                padding: 4px 16px;
                border-radius: 0px 4px 0px 8px;
                background: $conBg2;
                color: #ffd45c;
                font-size: 12px;
                .iconfont {
                  font-size: 16px;
                  margin-right: 4px;
                }
                font {
                  display: inline-block;
                  transform: translateY(-1px);
                }
              }
            }
            .twitter-two-con {
              margin-top: 16px;
              padding: 24px;
              background: $contentBg;
              border-radius: 4px;
              position: relative;
              .contact-line {
                position: absolute;
                width: 2px;
                height: 16px;
                top: -16px;
                left: 24px;
                background: $lineColor;
              }
            }
            .mobile-contnet-inner {
              border-radius: 4px 4px 0 0;
            }
            .reply-parent {
              width: 100%;
              margin-left: 64px;
              border-bottom: 1px solid #ebecf0;
              padding-bottom: 24px;
            }
            .reply-box {
              padding: 16px 24px;
              border-radius: 4px;
              background: rgba(124, 126, 194, 0.1);
              transition: 0.3s all;
              position: relative;
              .reply-tri {
                position: absolute;
                display: inline-block;
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 6px solid rgba(167, 240, 186, 0.1);
                top: -6px;
                left: 24px;
              }
              p {
                text-align: left;
                color: #7c7ec2 !important;
              }
              p:first-child {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 8px;
              }
              .reply-content {
                font-size: 14px;
                line-height: 22px;
              }
            }
          }
          .content-box:last-child {
            margin-bottom: 0;
            .content-inner {
              border: 0;
            }
          }
        }
        li:last-child {
          .icon-box {
            .icon-line {
              display: none;
            }
          }
        }
      }
    }
    .load-more-mine {
      /deep/ .el-loading-spinner {
        display: flex;
        justify-content: center;
        .el-icon-loading {
          margin-right: 8px;
          color: #6e71b8;
        }
        .el-loading-text {
          color: #6e71b8;
        }
      }
    }
    p {
      text-align: center;
      color: $titleColor;
      flex: 1;
    }
    .center-attention {
      width: 23%;
      max-height: 650px;
      margin-left: 30px;
    }
  }
  .back-top-important {
    position: fixed;
    bottom: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 10px #eee;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    z-index: 3000;
    .iconfont {
      font-size: 20px;
      color: $remarkColor;
    }
  }
}
@media screen and (max-width: 1279px) {
  /deep/ .el-dropdown-menu__item {
    .address-text {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 1rem;
        margin-right: 0.5rem;
        color: #999;
      }
      p {
        color: #383952;
        white-space: nowrap;
      }
    }
  }
  .bureau-important {
    .important-header {
      padding: 0 $fon14;
      height: 3.75rem;
      .header-logo {
        display: flex;
        align-items: center;
        p {
          color: #808080;
          transform: translateY(2px);
          margin-left: 0.5rem;
          span {
            display: inline-block;
            width: 1px;
            height: 0.5rem;
            background: #ddd;
            margin-right: 0.4rem;
            transform: translateY(-1px);
          }
        }
      }
      img {
        width: 7.5rem;
        height: 2.125rem;
      }
      .header-oper {
        .icon-drop {
          .iconfont {
            font-size: 24px;
            color: #999;
          }
        }
      }
    }
    .important-tabs {
      padding: 1rem $fon14;
      top: 3.75rem;
      padding-bottom: 1rem;
      display: none;
    }
    .exporess-list {
      padding: 0 $fon14;
      padding-top: 5rem;
      margin-top: 0;
      .center-list {
        padding-bottom: 30px;
        ul {
          li {
            .content-box {
              .inner-parent {
                .pro-icon {
                  min-width: $size48;
                  min-height: $size48;
                }
                .mobile-pro-time {
                  font-size: $fon12;
                  padding: 2px 8px;
                  border-radius: 4px;
                  background: rgba(246, 246, 246, 1);
                  width: auto;
                  display: inline-block;
                  color: #808080 !important;
                  margin-left: 0.2rem;
                  margin-top: 0.25rem;
                }
              }
              .img-box-twitter {
                .img-inner {
                  margin-right: 0.5rem;
                }
                /deep/ .el-image {
                  width: 4rem !important;
                  height: 4rem !important;
                  margin-right: 0 !important;
                }
              }
              .content-title {
                width: 100%;
                .content-title-msg {
                  .min-msg {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    margin-bottom: 0.25rem;
                    .pro-name {
                      margin-left: 0;
                    }
                    font-size: $fon12;
                    .content-type {
                      font-size: $fon12;
                    }
                    .min-price {
                      display: flex;
                      sub {
                        margin: 0 0.3rem;
                        transform: translateY(4px);
                      }
                    }
                  }
                  .title-new {
                    line-height: $fon20;
                    font-size: $fon14;
                    .view-source-inner {
                      white-space: nowrap;
                      margin-left: 0;
                    }
                  }
                }
                .like-box {
                  display: none;
                }
              }
              .content-inner {
                width: 100%;
                padding: 0;
                .inner-text {
                  color: #0a2540;
                  font-size: 0.81rem;
                }
                .ang-box-discord {
                  flex-direction: column;
                  width: 16.3rem;
                  height: auto;
                  margin-right: 0 !important;
                  padding-right: 0;
                  /deep/ .el-image__inner {
                    border-radius: 4px 4px 0 0;
                  }
                  img {
                    width: 100%;
                    border-radius: 4px 4px 0 0;
                  }
                  .ang-other {
                    width: 100%;
                    margin-left: 0;
                    padding: 1rem;
                    p {
                      width: 100%;
                      word-break: break-all;
                    }
                  }
                }
                .twitter-link-box {
                  // display: none;
                  flex-direction: column;
                  width: 19.5rem;
                  height: auto;
                  margin-right: 0 !important;
                  padding-right: 0;
                  padding-bottom: 1rem;
                  /deep/ .el-image__inner {
                    border-radius: 4px 4px 0 0;
                  }
                  /deep/ .el-image {
                    width: 4rem;
                    height: 4rem;
                  }
                  img {
                    width: 100%;
                    border-radius: 4px 4px 0 0;
                  }
                  .link-box-title {
                    margin-left: 1rem;
                  }
                  .link-title {
                    margin-top: 1rem;
                  }
                }
              }
            }
          }
        }
      }
      .center-attention {
        display: none;
      }
    }
  }
}
</style>