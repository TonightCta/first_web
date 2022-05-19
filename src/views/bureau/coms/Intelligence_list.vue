// 情报速递
<template>
  <div
    class="bureau-express"
    :class="[
      isFixed && 'has-top',
      isFixed && $route.name == 'TrackDetails' && 'has-top-mobile-inner',
      $route.name == 'TrackDetails' && 'inner-mobile-express',
    ]"
  >
    <!-- 移动端搜索 -->
    <div
      class="express-search-mobile"
      v-if="$flag && $route.name != 'TrackDetails'"
    >
      <p class="inp-inner">
        <span class="iconfont icon-sousuo_search"></span>
        <input
          type="text"
          v-model="searchExpress"
          :placeholder="$t('public.pls_inp')"
        />
      </p>
    </div>
    <!-- 菜单栏 -->
    <div
      class="tabs-box"
      :class="[
        isFixed && 'has-fixed-tabs',
        isFixed &&
          $route.name == 'TrackDetails' &&
          'has-fixed-tabs-inner-mobile',
        $route.name == 'TrackDetails' && 'inner-mobile-tabs',
        isFixed && app.isOpenMenu == 0 && 'other-fixed-width',
      ]"
    >
      <div style="display: flex; flex: 1">
        <div
          class="all-tabs"
          v-if="puid"
          @click="
            tabIndex = 999;
            dataIndex = 999;
            BAShowList = [];
            defaultPagination = 1;
            isNeedPage = false;
            getBAShowList();
          "
          :class="{ activeTabs: tabIndex == 999 }"
        >
          <p>
            <span class="iconfont icon-quanbu_all-application"></span>
            <font>
              <!-- 全部 -->
              {{ $t("echarts_filter.all") }}
            </font>
          </p>
        </div>
        <ul v-dragscroll v-if="$route.name == 'TrackDetails'">
          <li
            v-for="(i, a) in tabsListInner"
            :key="a"
            @click="
              defaultPagination = 1;
              tabIndex = a + 1;
              dataIndex = i.id;
              BAShowList = [];
              isNeedPage = false;
              getBAShowList();
            "
            :class="{ activeTabs: tabIndex == a + 1 }"
            :style="{ 'margin-right': i.is_show == 1 ? '8px' : '0' }"
          >
            <div class="tabs-inner-else" v-if="i.is_show == 1">
              <p>
                <span :class="'iconfont ' + i.icon"></span>
                <font>{{ i.name }}</font>
              </p>
              <p class="num-box" v-if="i.num != 0"></p>
            </div>
          </li>
        </ul>
        <ul v-else>
          <li
            v-for="(i, a) in tabsList"
            :key="a"
            @click="
              tabIndex = a + 1;
              BAShowList = [];
              dataIndex = i.id;
              defaultPagination = 1;
              isNeedPage = false;
              getBAShowList();
            "
            :class="{ activeTabs: tabIndex == a + 1 }"
            style="margin-right: 8px"
          >
            <div class="tabs-inner-else">
              <p>
                <span :class="'iconfont ' + i.icon"></span>
                <font>{{ i.name }}</font>
              </p>
              <p class="num-box" v-if="i.num != 0"></p>
            </div>
          </li>
        </ul>
        <div class="other-tabs">
          <div style="display: flex; align-items: center"></div>
          <p class="search-label">
            <span class="iconfont icon-sousuo_search"></span>
            <input
              type="text"
              :placeholder="$t('public.pls_inp')"
              v-model="searchExpress"
            />
          </p>
        </div>
      </div>
      <div
        class="reload-box"
        :class="isOpenMenu == 0 && 'open-width'"
        @click="upPosalList()"
      >
        <p>
          <span class="iconfont icon-shuaxin_refresh" type="icon"></span>
          加载最新
        </p>
      </div>
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
            <li v-for="(i, a) in BAShowList" :key="a">
              <!-- 标题信息 -->
              <div class="icon-box">
                <p class="ba-logo">
                  <img :src="i.type_icon" alt="123" v-if="dataIndex == 999" />
                  <el-popover
                    placement="top"
                    trigger="hover"
                    :content="
                      i.announcement_name
                        .toLowerCase()
                        .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
                    "
                    v-if="i.type == 5 && dataIndex != 999"
                  >
                    <img slot="reference" :src="i.announcement_icon" alt="" />
                  </el-popover>
                  <img
                    :src="i.logo"
                    alt=""
                    v-if="dataIndex != 999 && i.type != 5"
                  />
                </p>
                <p class="icon-line"></p>
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  :content="i.publish_year"
                  v-if="i.type != '5'"
                >
                  <div class="release-time" slot="reference">
                    <div v-if="app.language == 'en'">
                      <p v-if="i.type != 100" class="date-text">
                        {{
                          (i.publish_day_text == "today" &&
                            $t("public.today")) ||
                          i.publish_day
                        }}
                      </p>
                      <p v-else class="date-text">
                        {{
                          (i.happen_day_text == "today" &&
                            $t("public.today")) ||
                          i.happen_day
                        }}
                      </p>
                    </div>
                    <div v-else>
                      <p v-if="i.type != 100" class="date-text">
                        {{
                          /** 今天 */
                          (i.publish_day_text == "today" &&
                            $t("public.today")) ||
                          /** 昨天 */
                          (i.publish_day_text == "yesterday" &&
                            $t("public.yesterday")) ||
                          /** 前天 */
                          (i.publish_day_text == "theDayBeforeYesterday" &&
                            $t("public.day_before")) ||
                          /** 明天 */
                          (i.publish_day_text == "tomorrow" &&
                            $t("public.tomorrow")) ||
                          /** 后天 */
                          (i.publish_day_text == "theDayAfterTomorrow" &&
                            $t("public.day_after")) ||
                          i.publish_day
                        }}
                      </p>
                      <p v-else class="date-text">
                        {{
                          /** 今天 */
                          (i.happen_day_text == "today" &&
                            $t("public.today")) ||
                          /** 昨天 */
                          (i.happen_day_text == "yesterday" &&
                            $t("public.yesterday")) ||
                          /** 前天 */
                          (i.happen_day_text == "theDayBeforeYesterday" &&
                            $t("public.day_before")) ||
                          /** 明天 */
                          (i.happen_day_text == "tomorrow" &&
                            $t("public.tomorrow")) ||
                          /** 后天 */
                          (i.happen_day_text == "theDayAfterTomorrow" &&
                            $t("public.day_after")) ||
                          i.happen_day
                        }}
                      </p>
                    </div>

                    <p class="data-min">
                      {{
                        i.type == 100
                          ? i.happen_time_minute
                          : i.publish_time_minute
                      }}
                    </p>
                  </div>
                </el-popover>
              </div>
              <!-- 内容盒子 -->
              <div
                class="content-box"
                :class="[dataIndex == '5' && 'content-box-an']"
              >
                <!-- 标题信息 -->
                <div
                  class="content-title"
                  :class="[i.type == '5' && 'content-title-msg-an']"
                >
                  <div class="content-title-msg" v-if="!$flag">
                    <p
                      v-if="(i.type == 1 || i.type == 7) && dataIndex != '101'"
                    >
                      {{ i.author }}
                    </p>
                    <p v-if="i.type == 4 && dataIndex != '101'">
                      {{ i.title }}
                    </p>
                    <p v-if="i.type == 1 && dataIndex == '101'">
                      {{
                        app.language == "en"
                          ? i.title
                          : i.abs_translate
                          ? i.title
                          : i.title_zh
                      }}
                    </p>
                    <!-- @click="viewOffcial(i.content_url)" class="can-click"-->
                    <p v-if="i.type != 1 && i.type != 4">
                      <span v-if="i.type == 100" style="margin-right: 8px">{{
                        i.happen_time_minute
                      }}</span>
                      {{
                        app.language == "en"
                          ? i.title
                          : i.abs_translate
                          ? i.title
                          : i.title_zh
                      }}
                    </p>
                    <p>
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
                      <!-- 论坛模块 -->
                      <span class="forum-box" v-if="i.type == 2 && i.section">
                        {{ i.author }}&nbsp;发布于&nbsp;{{ i.section }}
                      </span>
                      <span v-if="i.type == 100" class="future-title">
                        {{ i.projectTitle }}({{ i.symbol }})
                      </span>
                      <!-- 推特发帖人身份 -->
                      <span v-if="i.type == 1" class="twitter-role">
                        <font>{{ i.twitter_role }}</font>
                        @{{ i.username }}
                      </span>
                      <span
                        v-if="i.type == 1 && dataIndex == '101'"
                        style="margin-right: 16px"
                      >
                        {{ i.author }}
                      </span>
                      <span
                        v-if="i.type == '5'"
                        style="
                          margin-right: 16px;
                          color: #a7f0ba;
                          font-size: 12px;
                        "
                      >
                        {{
                          /** 今天 */
                          (i.publish_day_text == "today" &&
                            $t("public.today")) ||
                          /** 昨天 */
                          (i.publish_day_text == "yesterday" &&
                            $t("public.yesterday")) ||
                          /** 前天 */
                          (i.publish_day_text == "theDayBeforeYesterday" &&
                            $t("public.day_before")) ||
                          /** 明天 */
                          (i.publish_day_text == "tomorrow" &&
                            $t("public.tomorrow")) ||
                          /** 后天 */
                          (i.publish_day_text == "theDayAfterTomorrow" &&
                            $t("public.day_after")) ||
                          i.publish_day
                        }}
                      </span>
                      <font
                        v-if="i.type != 4 && i.is_chinese == 0"
                        class="trans-remark"
                      >
                        <!-- 以下内容由DeepL提供翻译 -->
                        {{ $t("bureau_evs.deep_remark") }}
                      </font>
                      <!-- 链闻作者 -->
                      <span class="chain-box" v-if="i.type == 4">
                        <!-- 作者 -->
                        {{ $t("public.authore") }}
                        <span class="green-bg">{{
                          i.author ? i.author : "链闻快讯"
                        }}</span>
                        <font>{{ i.read_time }}</font>
                      </span>
                    </p>
                  </div>
                  <!-- 移动端Title -->
                  <div class="content-title-msg-mobile" v-else>
                    <!-- 图标 -->
                    <p>
                      <img
                        :src="i.type_icon"
                        alt="123"
                        v-if="dataIndex == 999"
                      />
                      <img
                        :src="i.announcement_icon"
                        alt=""
                        v-if="i.type == 5 && dataIndex != 999"
                      />
                      <img
                        :src="i.logo"
                        alt=""
                        v-if="dataIndex != 999 && i.type != 5"
                      />
                    </p>
                    <!-- 标题 -->
                    <p v-if="i.type == 1 || i.type == 7" class="two-elip">
                      {{ i.author }}
                      <br />
                      <span class="twitter-account"> @{{ i.username }}</span>
                    </p>
                    <p v-if="i.type == 4" class="two-elip">
                      {{ i.title }}
                    </p>
                    <!-- <p v-if="i.type != 4 && !$flag" class="two-elip">
                      以下内容由DeepL提供翻译
                    </p> -->
                    <p v-if="i.type != 1 && i.type != 4" class="two-elip">
                      {{
                        app.language == "en"
                          ? i.title
                          : i.abs_translate
                          ? i.title
                          : i.title_zh
                      }}
                      <span v-if="i.type == 100" class="future-title-mobile">
                        {{ i.projectTitle }}({{ i.symbol }})
                      </span>
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
                    <p class="ang-status has-ang" v-if="i.analysis_status == 3">
                      <span class="iconfont icon-xiaoyan2_check-one"></span>
                      <!-- 已分析 -->
                      {{ $t("bureau_express.has_ana") }}
                    </p>
                    <!-- 已经添加到日历 -->
                    <p
                      class="has-add-calendar"
                      v-if="i.type == 100 && i.added == 1 && dataIndex != 101"
                    >
                      <span class="iconfont icon-xiaoyan2_check-one"></span>
                      <!-- 已添加 -->
                      {{ $t("bureau_mine.has_push") }}
                    </p>
                    <!-- 添加到日历 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('bureau_mine.add_calendar')"
                      v-if="i.type == 100 && i.added == 0 && dataIndex != 101"
                    >
                      <!-- 添加到日历 -->
                      <p
                        slot="reference"
                        class="add-calendar-icon"
                        @click="addCalendar(1, i.id)"
                      >
                        <i class="iconfont icon-rili_calendar"></i>
                      </p>
                    </el-popover>
                    <!-- 分享情报 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('bureau_express.share')"
                      v-if="dataIndex != 101"
                    >
                      <!-- 分享情报 -->
                      <p
                        slot="reference"
                        class="twitter-translate"
                        v-if="i.type == 1 || i.type == 2 || i.type == 3"
                        @click="
                          $store.dispatch('setPoint', 21);
                          createShare(
                            i.type,
                            i.id,
                            i.abstract_zh,
                            i.analysis,
                            i.logo,
                            i.type == 1 ? i.author : i.title_zh,
                            i.publish_day_text,
                            i.publish_time_minute,
                            i.username,
                            i.twitter_role,
                            i.section,
                            i.img_url,
                            i.extend_avatar,
                            i.extend_nickname,
                            i.extend_name_date,
                            i.extendAbstract_zh,
                            i.relations
                          );
                        "
                      >
                        <i class="iconfont icon-yuanbian-fenxiang_share"></i>
                      </p>
                    </el-popover>
                    <!-- 翻译 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('public.translate')"
                      v-if="
                        i.type != 4 &&
                        i.is_chinese != 1 &&
                        app.language != 'en' &&
                        dataIndex != 101
                      "
                    >
                      <!-- 中英切换 -->
                      <p
                        slot="reference"
                        class="twitter-translate"
                        @click="
                          $store.dispatch('setPoint', 22);
                          i.abs_translate = !i.abs_translate;
                        "
                      >
                        <i
                          class="iconfont"
                          :class="
                            i.abs_translate
                              ? ' icon-yuanbian-zhongwen1_chinese-one'
                              : ' icon-yuanbian-yingwen_english1'
                          "
                        ></i>
                      </p>
                    </el-popover>
                    <!-- 完整对话 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('bureau_evs.whole_talk')"
                      v-if="i.type == 7 && dataIndex != 101"
                    >
                      <!-- 完整对话 -->
                      <p
                        slot="reference"
                        class="twitter-translate"
                        @click="$refs.wholebox.getProps(i.did, i.content_url)"
                      >
                        <i
                          class="
                            iconfont
                            icon-yuanbian-biaoqingxinxi_message-emoji
                          "
                        ></i>
                      </p>
                    </el-popover>
                    <!-- 原文 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      v-if="
                        i.type != 1 &&
                        i.type != 4 &&
                        i.type != 7 &&
                        dataIndex != 101 &&
                        i.a_type != 9
                      "
                      :content="
                        i.type == 5
                          ? $t('public.con_all')
                          : $t('public.con_full')
                      "
                    >
                      <!-- 全文内容 & 英文全文 -->
                      <p
                        slot="reference"
                        class="twitter-translate"
                        @click="
                          $store.dispatch('setPoint', 24);
                          $refs.contentbox.getProps(
                            i.id,
                            (isTrans = i.is_chinese == 1 ? 0 : 1)
                          );
                        "
                      >
                        <i class="iconfont icon-yuanbian-yingwenquanwen"></i>
                      </p>
                    </el-popover>
                    <!-- 查看来源 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      :content="$t('public.soure')"
                    >
                      <!-- 查看来源 -->
                      <p
                        slot="reference"
                        class="twitter-translate view-source"
                        @click="
                          $store.dispatch('setPoint', 23);
                          viewOffcial(i.content_url);
                        "
                      >
                        <i class="iconfont icon-yuanbian-lianjie_link-two"></i>
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
                      <!-- 忽略 -->
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
                <!-- 内容 -->
                <div
                  class="content-inner"
                  :class="[$flag && 'mobile-contnet-inner']"
                  v-if="
                    i.type != '5' && (i.abstract != '' || i.abstract_zh != '')
                  "
                >
                  <div class="mobile-type-date" v-if="$flag">
                    <div style="flex: 1; display: flex; align-items: center">
                      <!-- 全部 - 数据类型 -->
                      <p
                        class="content-type"
                        v-if="
                          dataIndex == 999 ||
                          dataIndex == 101 ||
                          dataIndex == 102
                        "
                      >
                        {{
                          (i.type == 1 && "Twitter") ||
                          (i.type == 2 && $t("bureau_express.forum")) ||
                          (i.type == 3 && "Medium") ||
                          (i.type == 5 && $t("bureau_express.ann")) ||
                          (i.type == 6 && $t("routes.network_pro")) ||
                          (i.type == 7 && "Discord") ||
                          (i.type == 100 && $t("routes.future_ev"))
                        }}
                      </p>
                      <!-- 论坛模块 -->
                      <p class="forum-box" v-if="i.type == 2 && i.section">
                        {{ i.author }}&nbsp;发布于&nbsp;{{ i.section }}
                      </p>
                      <!-- 推特发帖人身份 -->
                      <p v-if="i.type == 1" class="twitter-role">
                        <font>{{ i.twitter_role }}</font>
                      </p>
                      <!-- 链闻作者 -->
                      <p class="chain-box" v-if="i.type == 4">
                        <!-- 作者 -->
                        {{ $t("public.authore") }}
                        <span class="green-bg">{{
                          i.author ? i.author : "链闻快讯"
                        }}</span>
                      </p>
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
                    </div>
                    <div class="mobile-date">
                      <div v-if="app.language == 'en'">
                        <p v-if="i.type != 100">
                          {{
                            /** 今天 */
                            (i.publish_day_text == "today" &&
                              $t("public.today")) ||
                            i.publish_day
                          }}
                          <span>{{
                            i.type == 100
                              ? i.happen_time_minute
                              : i.publish_time_minute
                          }}</span>
                        </p>
                        <p v-else>
                          {{
                            /** 今天 */
                            (i.happen_day_text == "today" &&
                              $t("public.today")) ||
                            i.happen_day
                          }}
                          <span>{{
                            i.type == 100
                              ? i.happen_time_minute
                              : i.publish_time_minute
                          }}</span>
                        </p>
                      </div>
                      <div v-else>
                        <p v-if="i.type != 100">
                          {{
                            /** 今天 */
                            (i.publish_day_text == "today" &&
                              $t("public.today")) ||
                            /** 昨天 */
                            (i.publish_day_text == "yesterday" &&
                              $t("public.yesterday")) ||
                            /** 前天 */
                            (i.publish_day_text == "theDayBeforeYesterday" &&
                              $t("public.day_before")) ||
                            /** 明天 */
                            (i.publish_day_text == "tomorrow" &&
                              $t("public.tomorrow")) ||
                            /** 后天 */
                            (i.publish_day_text == "theDayAfterTomorrow" &&
                              $t("public.day_after")) ||
                            i.publish_day
                          }}
                          <span>{{
                            i.type == 100
                              ? i.happen_time_minute
                              : i.publish_time_minute
                          }}</span>
                        </p>
                        <p v-else>
                          {{
                            /** 今天 */
                            (i.happen_day_text == "today" &&
                              $t("public.today")) ||
                            /** 昨天 */
                            (i.happen_day_text == "yesterday" &&
                              $t("public.yesterday")) ||
                            /** 前天 */
                            (i.happen_day_text == "theDayBeforeYesterday" &&
                              $t("public.day_before")) ||
                            /** 明天 */
                            (i.happen_day_text == "tomorrow" &&
                              $t("public.tomorrow")) ||
                            /** 后天 */
                            (i.happen_day_text == "theDayAfterTomorrow" &&
                              $t("public.day_after")) ||
                            i.happen_day
                          }}
                          <span>{{
                            i.type == 100
                              ? i.happen_time_minute
                              : i.publish_time_minute
                          }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    class="inner-text"
                    :class="{ 'out-max': i.type == 1 }"
                    v-if="app.language == 'en'"
                    v-html="'<p>' + i.abstract + '</p>'"
                  ></div>
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
                  <!-- 重点情报标示 -->
                  <div
                    class="attention-sign"
                    v-if="dataIndex != 101 && i.elite == 1"
                  >
                    <span class="iconfont icon-xingxing_star"></span>
                    <font>
                      <!-- 重点情报 -->
                      {{ $t("bureau_express.important") }}
                    </font>
                  </div>
                  <!-- 推特 -> 图片消息 -->
                  <div
                    class="twitter-box"
                    v-if="i.type == 1 && i.img_url.length > 0"
                  >
                    <div
                      class="img-box-twitter"
                      :class="[
                        i.img_url.length == 1 && 'just-one',
                        i.img_url.length == 2 && 'two-pic',
                        i.img_url.length == 3 && 'three-pic',
                        i.img_url.length == 4 && 'four-pic',
                      ]"
                      v-if="i.img_url.length > 0"
                    >
                      <div
                        class="img-inner"
                        v-for="(tImg, a) in i.img_url"
                        :key="a"
                      >
                        <el-image
                          :src="tImg"
                          :preview-src-list="i.img_url"
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
                        i.abs_translate ? i.extendAbstract : i.extendAbstract_zh
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
                  <!-- Discord附件 i.extends.length > 0 -->
                  <div v-if="i.type == 7">
                    <div
                      class="ang-box-discord"
                      v-for="(appendix, indexA) in i.extends"
                      :key="indexA"
                    >
                      <el-image
                        :style="{
                          width: $flag ? '100%' : '94px',
                          height: $flag ? '4rem' : '94px',
                        }"
                        v-if="appendix.thumbnail"
                        :src="appendix.thumbnail"
                        fit="cover"
                        :preview-src-list="[appendix.thumbnail]"
                      >
                      </el-image>
                      <div class="ang-other" @click="viewOffcial(appendix.url)">
                        <p class="text-overflow" v-if="app.language == 'en'">
                          {{ appendix.title }}
                        </p>
                        <p class="text-overflow" v-else>
                          {{
                            i.abs_translate ? appendix.title : appendix.title_zh
                          }}
                        </p>
                        <p class="text-overflow" v-if="app.language == 'en'">
                          {{ appendix.abstract }}
                        </p>
                        <p class="text-overflow" v-else>
                          {{
                            i.abs_translate
                              ? appendix.abstract
                              : appendix.abstract_zh
                          }}
                        </p>
                        <p>
                          <span class="iconfont icon-lianjie_link-one"></span>
                          {{ appendix.url }}
                        </p>
                      </div>
                    </div>
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
                      v-if="twitterTwo.img_url.length > 0"
                    >
                      <div
                        class="img-box-twitter"
                        :class="[
                          twitterTwo.img_url.length == 1 && 'just-one',
                          twitterTwo.img_url.length == 2 && 'two-pic',
                          twitterTwo.img_url.length == 3 && 'three-pic',
                          twitterTwo.img_url.length == 4 && 'four-pic',
                        ]"
                        v-if="twitterTwo.img_url.length > 0"
                      >
                        <div
                          class="img-inner"
                          v-for="(tImg, a) in twitterTwo.img_url"
                          :key="a"
                        >
                          <el-image
                            :src="tImg"
                            :preview-src-list="twitterTwo.img_url"
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
                <!-- 移动端操作 -->
                <div class="oper-express-mobile" v-if="$flag">
                  <div class="left-oper">
                    <!-- 查看原文 -->
                    <p
                      class="left-oper-inner"
                      v-if="
                        i.type != 1 &&
                        i.type != 4 &&
                        i.type != 7 &&
                        dataIndex != 101 &&
                        i.a_type != 9
                      "
                      @click="
                        $store.dispatch('setPoint', 24);
                        $store.commit('saveInedx', {
                          _tabIndex: tabIndex, //当前选中菜单类型
                          _dataIndex: dataIndex, //当前选择数据类型
                        });
                        $router.push({
                          path: '/mobile-inner',
                          query: {
                            id: i.id,
                            isTrans: i.is_chinese == 1 ? 0 : 1,
                          },
                        });
                      "
                    >
                      <i class="iconfont icon-yuanbian-yingwenquanwen"></i>
                    </p>
                    <!-- 中英切换 -->
                    <p
                      class="left-oper-inner"
                      v-if="
                        i.type != 4 &&
                        i.is_chinese != 1 &&
                        app.language != 'en' &&
                        dataIndex != 101
                      "
                      @click="
                        $store.dispatch('setPoint', 22);
                        i.abs_translate = !i.abs_translate;
                      "
                    >
                      <i
                        class="iconfont"
                        :class="
                          i.abs_translate
                            ? ' icon-yuanbian-zhongwen1_chinese-one'
                            : ' icon-yuanbian-yingwen_english1'
                        "
                      ></i>
                    </p>
                    <!-- 查看来源 -->
                    <p
                      class="left-oper-inner"
                      @click="
                        $store.dispatch('setPoint', 23);
                        viewOffcial(i.content_url);
                      "
                    >
                      <i class="iconfont icon-yuanbian-lianjie_link-two"></i>
                      <span></span>
                    </p>
                    <!-- 分享 -->
                    <p
                      class="left-oper-inner"
                      v-if="
                        (i.type == 1 || i.type == 2 || i.type == 3) &&
                        dataIndex != 101
                      "
                      @click="
                        $store.dispatch('setPoint', 21);
                        createShare(
                          i.type,
                          i.id,
                          i.abstract_zh,
                          i.analysis,
                          i.logo,
                          i.type == 1
                            ? i.author
                            : i.type == 2
                            ? i.title
                            : i.title_zh,
                          i.publish_day_text,
                          i.publish_time_minute,
                          i.username,
                          i.twitter_role,
                          i.section,
                          i.img_url,
                          i.extend_avatar,
                          i.extend_nickname,
                          i.extend_name_date,
                          i.extendAbstract_zh,
                          i.relations
                        );
                      "
                    >
                      <i class="iconfont icon-yuanbian-fenxiang_share"></i>
                    </p>
                  </div>
                  <div class="right-oper">
                    <!-- 收藏 -->
                    <div
                      @click="like(i.id, i.favorite == 1 ? 0 : 1)"
                      style="margin-left: 24px"
                      v-if="i.type != 100 && dataIndex != 101"
                    >
                      <p
                        class="like-round"
                        :class="{ 'has-like': i.favorite == 1 }"
                      >
                        <span
                          class="iconfont"
                          :class="
                            i.favorite == 1
                              ? ' icon-yuanbian-xihuan_shixin_like'
                              : ' icon-yuanbian-xihuan_like'
                          "
                        ></span>
                      </p>
                    </div>
                    <!-- 忽略 -->
                    <div
                      @click="neglect(i.id)"
                      v-if="i.type != 100 && dataIndex != 101"
                    >
                      <p class="like-round">
                        <span
                          class="iconfont icon-yuanbian-jinzhi_forbid"
                        ></span>
                      </p>
                    </div>
                    <!-- 添加到日历 -->
                    <div
                      @click="addCalendar(1, i.id)"
                      v-if="i.type == 100 && dataIndex != 101"
                    >
                      <p class="add-calendar-icon">
                        <i class="iconfont icon-rili_calendar"></i>
                      </p>
                    </div>
                  </div>
                </div>
                <!-- 研究员观点 -->
                <div class="reply-box" v-if="i.analysis">
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
        <!-- 分页器 -->
        <div class="page-tools" v-if="isNeedPage">
          <base-pagination
            :page-count="total"
            type="info"
            v-model="defaultPagination"
          ></base-pagination>
        </div>
      </div>
      <p class="no-data" v-else>
        <!-- 暂无情报 -->
        {{ $t("no_data.no_intell") }}
      </p>
      <div class="center-attention" v-if="$route.name != 'TrackDetails'">
        <MyOptional @upPosalList="upPosalList" />
      </div>
    </div>
    <!-- 内容原文 -->
    <ConetentBox ref="contentbox" />
    <!-- 完整对话 -->
    <WholeBox ref="wholebox" />
    <!-- 提交翻译 -->
    <TranslateSub ref="translateSub" />
    <!-- 会员专享 -->
    <NeedVIP ref="needvip" />
    <!-- 我的自选 - 移动端 -->
    <MobileMineTrack
      v-if="$flag && $route.name != 'TrackDetails'"
      @upPosalList="upPosalList"
    />
    <!-- 分享 -->
    <ShareBox ref="sharebox" />
    <!-- 移动端时间选择器 -->
    <van-popup
      v-model="mobilePicker"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :title="dateType == 1 ? '开始时间' : '结束时间'"
        @confirm="selectedDate"
        @cancel="closePicker"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
      />
      <!-- 开始时间 & 结束时间 -->
    </van-popup>
  </div>
</template>

<script>
import * as api from "@/request/api";
import { Modal, BasePagination } from "@/components";
import { scrollBack } from "@/util/index";
import { mapState } from "vuex";
import { InfiniteScroll } from "element-ui";
export default {
  props: ["defin"],
  directives: {
    "infinite-scroll": InfiniteScroll,
  },
  data() {
    return {
      tabsList: [
        {
          //重点情报
          name: this.$t("bureau_express.important"),
          icon: "icon-xingxing_star",
          type: 12,
          id: 101,
          color: "",
          num: 0,
        },
        {
          name: "Twitter",
          icon: "icon-qingbaoju_tuite",
          type: 3,
          id: 1,
          color: "#1D9BF0",
          num: 0,
        },
        // {
        //   name: "链闻",
        //   icon: "icon-lianwen",
        //   type: 4,
        //   id: 4,
        //   color: "#0257FE",
        //   num: 0,
        // },
        {
          name: "Medium",
          icon: "icon-medium",
          type: 1,
          id: 3,
          color: "",
          num: 0,
        },
        {
          //论坛
          name: this.$t("bureau_express.forum"),
          icon: "icon-luntan_topic",
          type: 2,
          id: 2,
          color: "",
          num: 0,
        },
        {
          //交易所公告
          name: this.$t("bureau_express.ann"),
          icon: "icon-shengyin-da_volume-notice",
          type: 0,
          id: 5,
          color: "",
          num: 0,
        },
        {
          //我的收藏
          name: this.$t("bureau_express.favourite"),
          icon: "icon-xihuan_like",
          type: 13,
          id: 102,
          color: "",
          num: 0,
        },
      ],
      tabsListInner: [
        {
          //重点情报
          name: this.$t("bureau_express.important"),
          icon: "icon-xingxing_star",
          type: 12,
          id: 101,
          color: "",
          num: 0,
          show: true,
        },
        {
          name: "Twitter",
          icon: "icon-qingbaoju_tuite",
          type: 3,
          id: 1,
          color: "#1D9BF0",
          num: 0,
          show: true,
        },
        {
          name: "Discord",
          icon: "icon-qingbaoju_discord",
          type: 4,
          id: 7,
          color: "#5865F2",
          num: 0,
          show: false,
        },
        {
          name: "链闻",
          icon: "icon-lianwen",
          type: 4,
          id: 4,
          color: "#0257FE",
          num: 0,
          show: true,
        },
        {
          name: "Medium",
          icon: "icon-medium",
          type: 1,
          id: 3,
          color: "",
          num: 0,
          show: true,
        },
        {
          //论坛
          name: this.$t("bureau_express.forum"),
          icon: "icon-luntan_topic",
          type: 2,
          id: 2,
          color: "",
          num: 0,
          show: true,
        },
        {
          //交易所公告
          name: this.$t("bureau_express.ann"),
          icon: "icon-shengyin-da_volume-notice",
          type: 0,
          id: 5,
          color: "",
          num: 0,
          show: true,
        },
        {
          //未来事件
          name: this.$t("routes.future_ev"),
          icon: "icon-jihua_plan",
          type: 0,
          id: 100,
          color: "",
          num: 0,
          show: true,
        },
        {
          //全网提案
          name: this.$t("routes.network_pro"),
          icon: "icon-pinglun_comments",
          type: 0,
          id: 6,
          color: "",
          num: 0,
          show: false,
        },
      ],
      checked: false, //研究员观点
      isBout: false, //是否精品
      tabIndex: 1, //当前选中菜单类型
      dataIndex: 101, //当前选择数据类型
      BAShowList: [], //数据列表
      searchExpress: null, //搜索内容
      loadData: false, //数据加载
      isHasData: true, //是否有数据
      isNeedPage: false, //是否需要分页器
      total: 1, //总页数
      defaultPagination: 1, //默认页码
      puid: "", //自选项目ID
      timer: null,
      analysis: 0,
      isFixed: false, //是否吸顶
      loadMore: false, //加载更多
      dataTotal: 999, //数据总数
      loadRefresh: false, //下拉刷新状态
      filterExpress: null,
      mobileStartDate: null, //移动端是筛选 - 开始时间
      mobileEndDate: null, //移动端是筛选 - 结束时间
      dateType: 1, // 1 - 开始时间 && 2 - 结束时间
      minDate: new Date(2017, 0, 1), //最小可选择时间
      maxDate: new Date(), //最大可选择时间
      currentDate: new Date(), //默认选择时间
      mobilePicker: false, //移动端时间选择器
    };
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
    //
    isOpenMenu() {
      return this.app.isOpenMenu;
    },
  },
  components: {
    MyOptional: (resolve) => require(["./my_optional"], resolve),
    Modal,
    BasePagination,
    WholeBox: (resolve) => require(["./mine_bureau/whole_box"], resolve),
    TranslateSub: (resolve) =>
      require(["./mine_bureau/sub_translate"], resolve),
    NeedVIP: (resolve) => require(["./mine_bureau/need_vip"], resolve),
    MobileMineTrack: (resolve) => require(["./my_optional_mobile"], resolve),
    ConetentBox: (resolve) => require(["./content_box"], resolve),
    ShareBox: (resolve) => require(["./share_coms"], resolve),
  },
  created() {
    // this.getInfoTotal();
    if (this.app.trackID) {
      this.puid = this.app.trackID;
      this.tabIndex = 999;
      this.dataIndex = 999;
      api.trackDetails({ id: this.puid }).then((res) => {
        this.$set(this.tabsListInner[0], "is_show", 1);
        this.$set(this.tabsListInner[1], "is_show", res.is_show.twitter);
        this.$set(this.tabsListInner[2], "is_show", res.is_show.discord);
        this.$set(this.tabsListInner[3], "is_show", 0);
        this.$set(this.tabsListInner[4], "is_show", res.is_show.medium);
        this.$set(this.tabsListInner[5], "is_show", res.is_show.forum);
        this.$set(this.tabsListInner[6], "is_show", res.is_show.announcement);
        this.$set(this.tabsListInner[7], "is_show", 1);
        this.$set(this.tabsListInner[8], "is_show", res.is_show.proposal);
      });
    } else {
      this.tabIndex = 1;
      this.dataIndex = 101;
    }
  },
  mounted() {
    this.app.tabIndex != "null" &&
      this.app.tabIndex != null &&
      (this.tabIndex = this.app.tabIndex);
    this.app.dataIndex != "null" &&
      this.app.tabIndex != null &&
      (this.dataIndex = this.app.dataIndex);
    this.getBAShowList();
    // this.timer = setInterval(() => {
    //   this.defaultPagination = 1;
    //   this.getBAShowList();
    // }, 1000 * 60 * 15);
    // }, 3000);
    // (!this.$flag || this.$route.name == "TrackDetails") &&
    window.addEventListener("scroll", this.initHeight, true);
  },
  watch: {
    searchExpress() {
      this.defaultPagination = 1;
      this.getBAShowList();
      scrollBack();
    },
    checked() {
      this.getBAShowList();
      scrollBack();
    },
    isBout() {
      this.getBAShowList();
      scrollBack();
    },
    // isOpenMenu(_val){
    //   console.log(_val)
    // }
  },
  methods: {
    //移动端选择时间
    selectedDate(_type, _date) {
      let newDate = new Date(this.currentDate);
      let year = newDate.getFullYear();
      let month = newDate.getMonth() + 1;
      month < 10 && (month = "0" + month);
      let chioceDate = `${year}-${month}`;
      _type && (this.dateType = _type);
      this.dateType == 1
        ? (this.mobileStartDate = _date ? _date : chioceDate)
        : (this.mobileEndDate = _date ? _date : chioceDate);
      this.getBAShowList();
      this.mobilePicker = false;
    },
    //关闭时间选择器
    closePicker() {
      this.mobileStartDate = null;
      this.mobileEndDate = null;
      this.currentDate = new Date();
      this.mobilePicker = false;
      this.getBAShowList();
    },
    //格式化时间
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    //创建分享
    async createShare(
      _type,
      _id,
      _abs,
      _ang,
      _logo,
      _title,
      _date,
      _min,
      _user,
      _role,
      _section,
      _img_url,
      _extend_avatar,
      _extend_name_date,
      _extend_nickname,
      _extendAbstract_zh,
      _relations
    ) {
      /**
       * @param _type -> 分享类型
       * @param _id -> 情报类型
       * @param _abs -> 推特分享内容
       * @param _ang -> 研究员观点
       * @param _logo -> 情报logo
       * @param _title -> 情报标题
       * @param _date -> 情报时间
       * @param _min -> 情报时分
       * @param _user -> 推特账号地址
       * @param _role -> 推特身份
       * @param _section -> 论坛版块
       * @param _img_url -> 推特图片消息
       * @param _extend_avatar -> 推特转推头像
       * @param _extend_name_date -> 推特转推名称
       * @param _extend_nickname -> 推特转推账号
       * @param _extendAbstract_zh -> 推特转推内容
       * @param _relations -> 推特主题帖
       */
      const result = await api.infoContentZh({ id: _id, type: 1 });
      const _content = _type == 1 ? _abs : result.content;
      this.$refs.sharebox.createPoster(
        _type,
        _content,
        _ang,
        _logo,
        _title,
        _date,
        _min,
        _user,
        _role,
        _section,
        _img_url,
        _extend_avatar,
        _extend_name_date,
        _extend_nickname,
        _extendAbstract_zh,
        _relations
      );
    },
    //滚动
    scrollBot() {
      this.$nextTick(() => {
        let container = document.querySelector(".bureau-express");
        // console.log(container);
        // return
        container.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    },
    //加载更多
    loadMoreEv() {
      this.defaultPagination += 1;
      this.loadMore = true;
      setTimeout(async () => {
        await this.getBAShowList();
      }, 500);
    },
    //提交翻译
    async transToSub() {
      const result = await api.infoContentZh({ id: this.contentID });
      this.translateStatus = result.tran;
      this.languageStatus = false;
      this.$refs.translateSub.subTranslate = true;
    },
    //自选项目情报
    upPosalList(_id) {
      this.isNeedPage = false;
      this.defaultPagination = 1;
      if (_id) {
        this.puid = _id;
        this.dataIndex = 999;
        this.tabIndex = 999;
        this.BAShowList = [];
        this.getBAShowList();
      } else {
        this.puid = null;
        this.dataIndex = 101;
        this.tabIndex = 1;
        this.BAShowList = [];
        this.getBAShowList();
      }
      scrollBack();
    },
    //情报统计
    async getInfoTotal() {
      const result = await api.infoTotal({ id: this.puid });
      this.$set(this.tabsList[0], "num", result.elite.unread);
      this.$set(this.tabsList[1], "num", result.twitter.unread);
      // this.$set(this.tabsList[1], "num", result.news.unread);
      this.$set(this.tabsList[2], "num", result.medium.unread);
      this.$set(this.tabsList[3], "num", result.forum.unread);
      this.$set(this.tabsList[4], "num", result.announcement.unread);
      this.$set(this.tabsList[5], "num", result.favorite.unread);
      this.$set(this.tabsListInner[0], "num", result.elite.unread);
      this.$set(this.tabsListInner[1], "num", result.twitter.unread);
      this.$set(this.tabsListInner[2], "num", result.discord.unread);
      this.$set(this.tabsListInner[3], "num", result.news.unread);
      this.$set(this.tabsListInner[4], "num", result.medium.unread);
      this.$set(this.tabsListInner[5], "num", result.forum.unread);
      this.$set(this.tabsListInner[6], "num", result.announcement.unread);
      this.$set(this.tabsListInner[7], "num", result.future.unread);
      // this.$set(this.tabsListInner[8], "num", result.proposal.unread);
    },
    //数据列表
    async getBAShowList() {
      this.defaultPagination == 1 && (this.loadData = true);
      this.checked ? (this.analysis = 1) : (this.analysis = 0); //研究员观点
      let isBout = this.isBout ? 1 : 0; //是否精品
      const result = await api.BAShowList({
        type: this.dataIndex,
        ipid: this.puid,
        search: this.searchExpress,
        limit: 10,
        page: this.defaultPagination,
        analysis: this.analysis,
        elite: isBout,
        is_elite: 0,
        month_start: this.$flag
          ? this.mobileStartDate
          : this.filterExpress
          ? this.filterExpress[0]
          : "",
        month_end: this.$flag
          ? this.mobileEndDate
          : this.filterExpress
          ? this.filterExpress[1]
          : "",
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
      const infoID = [];
      this.BAShowList.forEach((e) => {
        this.$set(e, "is_show_reply", true);
        this.$set(e, "abs_translate", false);
        infoID.push(e.id);
      });
      await api.readType({
        type: this.dataIndex,
        ipid: this.puid,
      });
      await this.getInfoTotal();
      this.total = result.last_page;
      // result.last_page > 1
      //   ? (this.isNeedPage = true)
      //   : (this.isNeedPage = false);
      this.isNeedPage = false;
      this.BAShowList.length == 0 && (this.isHasData = false);
      this.BAShowList.length > 0 && (this.isHasData = true);
    },
    //已读全部情报
    async realAllIn() {
      const result = await api.realAllInfo({ ipid: this.puid });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        //全部已读成功
        message: this.$t("notify.read_all"),
      });
      this.getInfoTotal();
    },
    //访问来源
    viewOffcial(_url) {
      window.open(_url);
    },
    //收藏
    async like(_id, _type) {
      const result = await api.favorite({
        id: _id,
        status: _type,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      _type == 1
        ? this.$notify({
            type: "success",
            //添加收藏成功
            message: this.$t("notify.add_favourite"),
          })
        : this.$notify({
            type: "success",
            //取消收藏成功
            message: this.$t("notify.cancel_favourite"),
          });
      this.defaultPagination = 1;
      this.getBAShowList();
    },
    //忽略
    async neglect(_id) {
      await api.neglect({ id: _id });
      this.getBAShowList();
    },
    //判断吸顶
    initHeight() {
      let el = document.querySelector(".open-alive");
      let scrollTop = el.getBoundingClientRect().top;
      if (!this.$falg && this.$route.name == "TrackDetails") {
        this.isFixed = scrollTop <= -80 ? true : false;
      } else {
        this.isFixed = scrollTop <= 0 ? true : false;
      }
      if (this.$flag && this.$route.name == "TrackDetails") {
        this.isFixed = scrollTop <= (this.defin ? -338 : -274) ? true : false;
      }
      if (this.$flag && this.$route.name == "BureauExpress") {
        this.isFixed = scrollTop <= -36 ? true : false;
      }
    },
    //重载页面
    reload() {
      this.getBAShowList();
      this.timer = setInterval(() => {
        this.defaultPagination = 1;
        this.getBAShowList();
      }, 1000 * 60 * 15);
    },
    //下拉刷新
    async refreshExpress() {
      await this.getBAShowList();
      setTimeout(() => {
        this.loadRefresh = false;
      }, 500);
    },
    //接收外部参数
    getProps(_search, _ang) {
      this.analysis = _ang;
      this.searchExpress = _search;
      this.getBAShowList();
    },
    //添加日历
    async addCalendar(_type, _id) {
      const result = await api.addCalendar({ id: _id, type: _type });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        //已添加到我的日历<br>如果您已订阅日历，稍后将同步到您的日历客户端。
        message: this.$t("notify.add_calendar"),
      });
    },
    //时间过滤
    chioceMonth(_val) {
      this.getBAShowList();
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener("scroll", this.initHeight, true);
  },
};
</script>

<style lang="scss" scoped>
//时间选择器穿透
/deep/ .el-date-editor {
  background: $conBg2;
  max-width: 224px;
  border: 0;
  border-radius: 18px;
  height: 28px;
  align-items: center;
  .el-input__icon {
    line-height: normal;
    margin-top: 2px;
  }
  .el-range-separator {
    color: white;
    line-height: normal;
    margin: 0 8px;
    padding: 0;
    margin-bottom: -3px;
  }
  input {
    width: 68px;
    background: rgba(0, 0, 0, 0);
    color: white;
    font-size: 12px;
    padding-top: 1px;
  }
  input::placeholder {
    color: $remarkColor;
  }
}
/deep/ .el-picker-panel__body {
  .el-date-range-picker__header {
    button {
      color: red !important;
    }
    div {
      color: red;
    }
  }
}
/deep/ .el-checkbox {
  margin-bottom: 0 !important;
  .el-checkbox__inner {
    background: $contentBg;
    border: 1px solid #49537a;
    border-radius: 4px;
  }
  .el-checkbox__label {
    font-size: 14px;
    color: $textColor;
  }
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #409eff;
}
.has-top {
  padding-top: 124px;
}
.has-fixed-tabs {
  position: fixed !important;
  top: 64px;
  z-index: 500;
  width: 83.5%;
  padding-bottom: 24px;
  .reload-box {
    opacity: 1 !important;
  }
}
.other-fixed-width {
  width: 91.2%;
}

@media screen and (min-width: 2000px) {
  .has-fixed-tabs {
    width: 87.5% !important;
  }
  .other-fixed-width {
    width: 93.4% !important;
  }
}
@media screen and (max-width: 1400px) {
  .has-fixed-tabs {
    width: 88.1% !important;
  }
}
.bureau-express {
  .express-search-mobile {
    width: 100%;
    padding: 1rem $fon14;
    background: $contentBg;
    .inp-inner {
      position: relative;
      .iconfont {
        position: absolute;
        font-size: 1rem;
        left: $fon12;
        top: 0.5rem;
        color: $remarkColor;
      }
      input {
        width: 100%;
        height: 2rem;
        font-size: 0.81rem;
        background: $conBg2;
        border-radius: $fon18;
        box-sizing: border-box;
        padding-left: 2rem;
      }
    }
    .ang-and-bou {
      display: flex;
      margin-top: 1.75rem;
      align-items: center;
      justify-content: space-around;
      input {
        width: 4rem;
        background: rgba(0, 0, 0, 0);
        color: white;
        font-size: $fon12;
      }
      input::placeholder {
        color: $remarkColor !important;
      }
      .choice-date {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 1rem;
          color: white;
          margin-right: 0.5rem;
          display: inline-block;
          transform: translateY(-1px);
        }
      }
      // p {
      //   margin-right: $padd24;
      // }
      // .all-neglect {
      //   margin-right: 0;
      //   display: flex;
      //   font-size: $fon14;
      //   align-items: center;
      //   color: #ffd45c;
      //   .iconfont {
      //     position: static !important;
      //     font-size: 1rem;
      //     margin-right: 0.3rem;
      //   }
      // }
    }
  }
  .tabs-box {
    display: flex;
    margin-top: 16px;
    background: $mineBg;
    position: relative;
    .reload-box {
      position: absolute;
      left: 0;
      bottom: -40px;
      width: 75.1%;
      background: #183862;
      // backdrop-filter: saturate(180%) blur(6px);
      border-radius: 0 0 4px 4px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      cursor: pointer;
      // transition: .3s all;
    }
    .open-width {
      width: 75.4%;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    .activeTabs {
      background: #8a3ffc !important;
      .iconfont {
        color: white !important;
      }
    }
    .all-tabs {
      padding: 14px 18px;
      background: $contentBg;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      cursor: pointer;
      min-width: 92px;
      transition: 0.3s all;
      p {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: white;
        .iconfont {
          font-size: 20px;
          margin-right: 8px;
          color: $remarkColor;
        }
      }
    }
    .all-tabs:hover {
      background: $conBg2;
    }
    ul {
      display: flex;
      overflow-x: auto;
      li {
        transition: 0.3s all;
        background: $contentBg;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        .tabs-inner-else {
          padding: 14px 18px;
        }
        p {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: white;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .iconfont {
            font-size: 20px;
            margin-right: 8px;
            color: $remarkColor;
          }
          .icon-qingbaoju_tuite {
            color: #1d9bf0;
          }
          .icon-qingbaoju_discord {
            color: #5865f2;
          }
          .icon-lianwen {
            color: #0257fe;
          }
        }
        .num-box {
          position: absolute;
          width: 8px;
          height: 8px;
          background: $danger;
          top: 0;
          right: 0;
          border-radius: 50%;
        }
      }
      li:hover {
        background: $conBg2;
      }
    }
    .other-tabs {
      flex: 1;
      height: 48px;
      background: $contentBg;
      display: flex;
      border-radius: 4px;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      min-width: 300px;
      position: relative;
      .tabs-filter {
        display: flex;
        p:last-child {
          margin-left: 24px;
        }
      }
      .ang-mask {
        display: inline-block;
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        top: 0;
        left: 0;
        z-index: 100;
      }
      .neglect-all {
        color: #ffd45c;
        display: flex;
        align-items: center;
        cursor: pointer;
        white-space: nowrap;
        margin-left: 8px;
        .iconfont {
          margin-right: 8px;
        }
      }
      .search-label {
        position: relative;
        z-index: 200;
        width: 160px;
        input {
          width: 100%;
          height: 28px;
          border-radius: 18px;
          font-size: 12px;
          background: $conBg2;
          padding-left: 34px;
        }
        .iconfont {
          font-size: 16px;
          color: $textColor;
          position: absolute;
          left: 12px;
          top: 6px;
        }
      }
    }
  }
  .exporess-list {
    width: 100%;
    display: flex;
    margin-top: 24px;
    .center-list {
      flex: 1;
      width: 100%;
      min-height: 800px;
      ul {
        li {
          display: flex;
          margin-bottom: 4px;
          min-height: 132px;
          .icon-box {
            width: 48px;
            margin-right: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .ba-logo {
              margin-bottom: 4px;
              width: 48px;
              height: 48px;
              max-height: 48px;
              padding: 2px;
              border-radius: 50%;
              background: white;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .icon-line {
              width: 2px;
              flex: 1;
              background: #49537a;
            }
            .release-time {
              position: absolute;
              cursor: pointer;
              width: 48px;
              height: 56px;
              border-radius: 4px;
              background: $contentBg;
              top: 64px;
              left: 0;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              .date-text {
                display: flex;
                align-items: center;
                height: 32px;
                background: $conBg2;
                font-size: 14px;
                color: white;
                justify-content: center;
              }
              .data-min {
                flex: 1;
                font-size: 12px;
                color: $remarkColor;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
          }
          .content-box {
            flex: 1;
            padding-bottom: 36px;
            .content-title {
              display: flex;
              justify-content: space-between;
              .content-title-msg {
                padding-top: 2px;
                .can-click:hover {
                  text-decoration: underline;
                  cursor: pointer;
                }
                p:first-child {
                  font-size: 14px;
                  color: white !important;
                  font-weight: bold;
                  margin-bottom: 8px;
                  text-align: left;
                }
                p:last-child {
                  height: 20px;
                  display: flex;
                  align-items: center;
                  font-size: 12px;
                  color: $remarkColor;
                  .content-type {
                    height: 100%;
                    line-height: 20px;
                    border-radius: 4px;
                    font-size: 13px;
                    padding: 0 8px;
                    color: #ffd45c;
                    background: rgba(255, 212, 92, 0.1);
                    margin-right: 16px;
                  }
                  .twitter-msg {
                    font-size: 12px;
                    color: $remarkColor;
                    display: flex;
                    align-items: center;
                    margin-right: 16px;
                    .pro-logo {
                      width: 20px;
                      height: 20px;
                      background: white;
                      border-radius: 50%;
                      overflow: hidden;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding: 1px;
                      margin-left: 8px;
                      margin-right: 4px;
                      img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                      }
                    }
                    font {
                      font-weight: bold;
                      color: $success;
                    }
                  }
                  .chain-box {
                    font-size: 12px;
                    color: white;
                    .green-bg {
                      background: rgba(167, 240, 186, 0.1);
                      color: $success;
                      padding: 1px 8px;
                      border-radius: 4px;
                      margin-left: 2px;
                    }
                    font {
                      color: $remarkColor;
                    }
                  }
                  .forum-box {
                    background: rgba(167, 240, 186, 0.1);
                    color: $success;
                    padding: 2px 8px;
                    margin-right: 16px;
                    border-radius: 4px;
                  }
                  .future-title {
                    color: $success;
                    margin-right: 8px;
                  }
                  .twitter-role {
                    font-size: 12px;
                    color: $remarkColor;
                    margin-right: 16px;
                    font {
                      display: inline-block;
                      padding: 2px 8px;
                      border-radius: 4px;
                      background: rgba(167, 240, 186, 0.1);
                      color: $success;
                      margin-right: 8px;
                    }
                  }
                  .icon-fanyi_translation {
                    font-size: 16px;
                    color: $iconColor;
                    margin-left: 16px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    span {
                      font-size: 12px;
                      margin-left: 4px;
                      display: inline-block;
                    }
                  }
                  .offcial-box {
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    margin-left: 16px;
                    color: $iconColor;
                    cursor: pointer;
                    .iconfont {
                      font-size: 16px;
                      margin-left: 4px;
                      display: inline-block;
                      transform: translateY(-1px);
                    }
                  }
                  .content-date {
                    margin-left: 8px;
                    color: $success;
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
                display: flex;
                align-items: center;
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
                  color: #a7f0ba !important;
                  border-color: #a7f0ba;
                  .iconfont {
                    color: #a7f0ba;
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
              padding: 24px;
              background: $contentBg;
              border-radius: 4px;
              .content-title-msg {
                p:first-child {
                  margin-bottom: 12px;
                  line-height: 18px;
                }
              }
            }
            .inner-text {
              font-size: 12px;
              color: $remarkColor !important;
              line-height: 22px;
              white-space: pre-wrap;
              overflow: hidden;
              /deep/ span {
                font-size: 12px !important;
                color: $remarkColor !important;
                margin: 0;
              }
              /deep/ h1 {
                font-size: 12px;
                color: $remarkColor !important;
                margin: 0;
              }
              /deep/ h2 {
                font-size: 12px;
                color: $remarkColor !important;
                margin: 0;
              }
              /deep/ h3 {
                font-size: 12px;
                color: $remarkColor !important;
                margin: 0;
              }
              /deep/ h4 {
                font-size: 12px;
                color: $remarkColor !important;
                margin: 0;
              }
              /deep/ h5 {
                font-size: 12px;
                color: $remarkColor !important;
                margin: 0;
              }
              /deep/ p {
                color: $remarkColor !important;
                font-size: 14px;
              }
              // /deep/ br {
              //   display: none;
              // }
              /deep/ p,
              strong {
                font-size: 12px;
                // margin-bottom: 10px !important;
                color: $remarkColor;
              }
              /deep/ strong {
                margin-bottom: 0;
              }
              /deep/ img {
                display: none;
              }
            }
            .twitter-box {
              margin-top: 16px;
              .img-box-twitter {
                // max-width: 480px;
                // max-height: 240px;
                // overflow: hidden;
                width: 40%;
                // background: red;
                margin-top: 16px;
                .img-inner {
                  display: flex;
                  justify-content: center;
                  background: $contentBg;
                  align-items: center;
                  overflow: hidden;
                  border-radius: 4px;
                  cursor: pointer;
                }
              }
              // 只有一张大图时
              .just-one {
                .img-inner {
                  height: 100%;
                  width: 100%;
                }
              }
              // 两张图
              .two-pic {
                display: flex;
                justify-content: space-between;
                .img-inner {
                  width: 49%;
                  height: 100%;
                }
              }
              //三张图
              .three-pic {
                display: grid;
                grid-template-columns: 49% 49%;
                grid-template-rows: 49% 49%;
                .img-inner:first-child {
                  grid-column: 1 / span 1;
                  grid-row: 1 / span 2;
                  margin-right: 4px;
                }
                .img-inner {
                  margin-bottom: 4px;
                }
              }
              //四张图
              .four-pic {
                display: grid;
                grid-template-columns: 49% 49%;
                grid-template-rows: 49% 49%;
                .img-inner {
                  margin-right: 4px;
                  margin-bottom: 4px;
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
              margin-top: 16px;
              padding: 24px;
              padding-top: 32px;
              background: $contentBg;
              border-radius: 4px;
              position: relative;
              .mobile-type-date {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
                align-items: center;
                p {
                  flex: none;
                }
                .content-type {
                  font-size: $fon12;
                  padding: 2px 0.5rem;
                  background: rgba(255, 212, 92, 0.1);
                  color: #ffd45c;
                  border-radius: 4px;
                  margin-right: 0.5rem;
                }
                .twitter-role {
                  font-size: $fon12;
                  color: $success;
                  background: rgba(167, 240, 186, 0.1);
                  padding: 2px 0.5rem;
                  border-radius: 4px;
                  margin-right: 0.5rem;
                }
                .chain-box {
                  font-size: $fon12;
                  color: white;
                  span {
                    color: $success;
                    background: rgba(167, 240, 186, 0.1);
                    padding: 1px 0.5rem;
                    border-radius: 4px;
                    margin-left: 0.5rem;
                  }
                }
                .forum-box {
                  font-size: $fon12;
                  background: rgba(167, 240, 186, 0.1);
                  color: $success;
                  padding: 2px 0.5rem;
                  border-radius: 4px;
                  margin-right: 0.5rem;
                  display: flex;
                  align-items: center;
                }
                .ang-status {
                  padding: 2px 0.5rem;
                  background: rgba(255, 212, 92, 0.1);
                  color: #ffd45c;
                  border-radius: 1rem;
                  font-size: $fon12;
                  display: flex;
                  align-items: center;
                  .iconfont {
                    font-size: 1rem;
                    margin-right: 0.25rem;
                  }
                }
                .has-ang {
                  background: rgba(167, 240, 186, 0.1);
                  color: $success;
                }
                .mobile-date {
                  p {
                    color: $remarkColor;
                    font-size: $fon12;
                    flex: none;
                    span {
                      color: white;
                      margin-left: 0.25rem;
                    }
                  }
                }
              }
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
            .oper-express-mobile {
              display: flex;
              justify-content: space-between;
              padding: 1rem;
              background: $contentBg;
              border-top: 1px solid $mineBg;
              border-radius: 0 0 4px 4px;
              .left-oper {
                display: flex;
                .left-oper-inner {
                  margin-right: $padd24;
                  .iconfont {
                    font-size: $padd24;
                  }
                }
              }
              .right-oper {
                display: flex;
                div {
                  margin-left: $padd24;
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  p:last-child {
                    font-size: 0.81rem;
                    font-weight: bold;
                    color: $textColor;
                  }
                }
                .add-calendar-icon {
                  width: $padd24;
                  height: $padd24;
                  border-radius: 50%;
                  background: #8a3ffc;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  .iconfont {
                    font-size: $fon14;
                    color: white;
                    font-weight: 400;
                  }
                }
                .like-round {
                  width: $padd24;
                  height: $padd24;
                  border-radius: 50%;
                  flex: inherit;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  // margin-right: 0.5rem;
                  .iconfont {
                    font-size: $padd24;
                    color: $remarkColor;
                    font-weight: 400;
                  }
                  .iconfont:hover {
                    color: white;
                  }
                }
                .has-like {
                  color: #a7f0ba !important;
                  border-color: #a7f0ba;
                  .iconfont {
                    color: #a7f0ba;
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
            .reply-box {
              padding: 24px;
              border-radius: 4px;
              background: rgba(167, 240, 186, 0.1);
              margin-top: 14px;
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
              }
              p:first-child {
                font-size: 13px;
                color: $success;
                font-weight: bold;
                margin-bottom: 16px;
              }
              .reply-content {
                font-size: 12px;
                color: $success;
                line-height: 22px;
              }
            }
          }
          .content-box-an {
            padding-bottom: 24px;
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
          color: $success;
        }
        .el-loading-text {
          color: $success;
        }
      }
    }
    p {
      text-align: center;
      font-size: 20px;
      color: $remarkColor;
      flex: 1;
    }
    .center-attention {
      width: 23%;
      max-height: 650px;
      margin-left: 30px;
    }
  }
}

.page-tools {
  display: flex;
  justify-content: center;
}
@media screen and (max-width: 1279px) {
  .has-fixed-tabs {
    top: 74px;
  }
  .has-top {
    padding-top: 74px;
  }
  .bureau-express {
    .tabs-box {
      margin-top: 0;
      background: $mineBg;
      width: 100% !important;
      padding: 1rem $fon14;
      z-index: 4000;
      ul {
        li {
          .tabs-inner-else {
            padding: 1rem;
            p {
              .iconfont {
                margin-right: 0;
              }
              font {
                display: none;
              }
            }
          }
        }
      }
      .other-tabs {
        display: none;
      }
    }
    .inner-mobile-tabs {
      position: static;
      padding: 0;
      // margin-top: $padd24;
      padding: 1rem;
      padding-left: 0.9rem;
      .all-tabs {
        min-width: auto;
        p {
          .iconfont {
            margin-right: 0;
          }
          font {
            display: none;
          }
        }
      }
    }
    .has-fixed-tabs-inner-mobile {
      position: fixed;
      top: 74px;
      left: 0;
    }
    .exporess-list {
      padding: 0 $fon14;
      margin-top: 0;
      .center-list {
        ul {
          li {
            .icon-box {
              width: $padd40;
              margin-right: 1rem;
              display: none;
              .ba-logo {
                width: $padd40;
                height: $padd40;
                max-height: $padd40;
                img {
                  width: 2.25rem;
                  height: 2.25rem;
                }
              }
              .release-time {
                width: $padd40;
                p {
                  font-size: $fon12 !important;
                }
              }
            }
            .content-box {
              .img-box-twitter {
                width: 16rem !important;
                height: 8rem !important;
              }
              .content-title {
                width: 100%;
                .content-title-msg {
                  display: none;
                }
                .like-box {
                  display: none;
                }
              }
              .content-inner {
                width: 100%;
                padding: $padd24 1rem;
                padding-top: 2rem;
                margin-top: 1rem;
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
  .inner-mobile-express {
    padding-top: 0;
  }
  .has-top-mobile-inner {
    padding-top: 5rem;
  }
}
</style>