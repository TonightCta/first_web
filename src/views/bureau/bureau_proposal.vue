// 全网提案
<template>
  <div
    class="bureau-proposal"
    :class="[
      isFixed && 'has-fixed-posal',
      app.account.is_follow == 0 && $flag && 'no-date-mobile',
    ]"
  >
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        <!-- 关注项目提案，提早了解项目发展方向 -->
        {{ $t("bureau_posal.posal_title") }}
      </p>
    </div>
    <!-- 移动端搜索 -->
    <div class="mobile-posal-search" v-if="app.account.is_follow == 1 && $flag">
      <span class="iconfont icon-sousuo_search"></span>
      <input
        type="text"
        :placeholder="$t('public.pls_inp')"
        v-model="trackSearch"
      />
    </div>
    <div v-if="app.account.is_follow == 1">
      <!-- 赛道类型 -->
      <div
        class="race-type type-pc"
        :class="[
          isFixed && 'posal-fixed-box',
          isFixed && app.isOpenMenu == 0 && 'other-fixed-width',
        ]"
      >
        <ul>
          <li
            :class="{ activeType: nowType == 9999 }"
            @click="
              nowType = 9999;
              isFollow = 1;
              posalList = [];
              defaultPagination = 1;
              getPosalList();
            "
          >
            <!-- 活跃提案 -->
            {{ $t("bureau_posal.active") }}
            <span class="race-line"></span>
            <span class="race-num">{{ totalPro }}</span>
          </li>
          <li
            v-for="(raceType, indexT) in raceTypeList"
            :key="indexT"
            @click="
              nowType = indexT;
              isFollow = raceType.id;
              defaultPagination = 1;
              posalList = [];
              getPosalList();
            "
            :class="{ activeType: nowType == indexT }"
          >
            {{ raceType.name }}
            <span class="race-line"></span>
            <span class="race-num">{{ raceType.num }}</span>
          </li>
        </ul>
        <p class="search-type">
          <span class="iconfont icon-sousuo_search"></span>
          <input
            type="text"
            :placeholder="$t('public.pls_inp')"
            v-model="trackSearch"
          />
        </p>
        <div class="fixed-mask"></div>
      </div>
      <!-- 提案列表 -->
      <div class="proposal-center">
        <div class="center-list" v-loading="loadData">
          <div v-if="isHasData">
            <van-pull-refresh
              v-model="reloadPoasl"
              :success-text="$t('public.reload')"
              @refresh="onRefreshPosal"
              :disabled="!$flag"
            >
              <!-- 刷新成功 -->
              <ul
                v-infinite-scroll="loadMoreEv"
                infinite-scroll-immediate="false"
                infinite-scroll-disabled="disabled"
              >
                <div v-if="isFollow != 0">
                  <li
                    v-for="(posal, indexPos) in posalList"
                    :key="indexPos"
                    class="ordinary-posal"
                  >
                    <!-- 项目信息 -->
                    <div class="pro-msg">
                      <div class="mobile-panel" v-if="$flag">
                        <div class="mobile-title-msg">
                          <p class="two-elip" v-if="app.language == 'en'">
                            {{ posal.title }}
                          </p>
                          <p class="two-elip" v-else>
                            {{
                              posal.translateStatus
                                ? posal.title_zh
                                : posal.title
                            }}
                          </p>
                          <p v-if="app.language != 'en'">
                            <span
                              class="iconfont-box"
                              @click="
                                posal.translateStatus = !posal.translateStatus
                              "
                            >
                              <i
                                class="iconfont"
                                :class="
                                  posal.translateStatus
                                    ? ' icon-yuanbian-yingwen_english1'
                                    : ' icon-yuanbian-zhongwen1_chinese-one'
                                "
                              ></i>
                            </span>
                          </p>
                        </div>
                        <div class="mobile-logo-msg">
                          <img :src="posal.logo" alt="" />
                          <p>{{ posal.projectTitle }}({{ posal.symbol }})</p>
                        </div>
                      </div>
                      <!-- PC面板内容 -->
                      <div v-else>
                        <p>
                          <img :src="posal.logo" alt="" />
                        </p>
                        <p class="pro-name">
                          {{ posal.projectTitle }}({{ posal.symbol }})
                        </p>
                        <p class="pro-content">
                          <base-button
                            type="info"
                            round
                            :disabled="posal.is_empty == 1"
                            @click="
                              $store.dispatch('setPoint', 39);
                              votes = posal.votes;
                              contentID = posal.id;
                              posalConTitle = posal.title_zh;
                              posalConTitleEN = posal.title;
                              getInfoContent();
                              isChoice =
                                posal.proposal_type == 1 ? false : true;
                              isTrans = posal.is_chinese == 1 ? false : true;
                            "
                          >
                            <i class="iconfont icon-wenjian_file"></i>
                            <!-- 提案内容 -->
                            {{
                              posal.is_empty == 1
                                ? "无提案内容"
                                : $t("bureau_posal.posal_con")
                            }}
                          </base-button>
                        </p>
                        <p class="pro-official">
                          <base-button
                            type="default"
                            round
                            @click="
                              $store.dispatch('setPoint', 40);
                              viewOffcial(posal.content_url);
                            "
                          >
                            <i class="iconfont icon-diqiuyi_earth"></i>
                            <!-- 查看来源 -->
                            {{ $t("bureau_posal.soure") }}
                          </base-button>
                        </p>
                      </div>
                    </div>
                    <!-- 提案信息 -->
                    <div class="proposal-msg">
                      <!-- 翻译 -->
                      <div class="data-box">
                        <el-popover
                          placement="top"
                          trigger="hover"
                          :content="$t('public.translate')"
                          v-if="app.language != 'en'"
                        >
                          <!-- 中英切换 -->
                          <span
                            slot="reference"
                            class="iconfont-box"
                            @click="
                              $store.dispatch('setPoint', 41);
                              posal.translateStatus = !posal.translateStatus;
                            "
                          >
                            <i
                              class="iconfont"
                              :class="
                                posal.translateStatus
                                  ? ' icon-yuanbian-yingwen_english1'
                                  : ' icon-yuanbian-zhongwen1_chinese-one'
                              "
                            ></i>
                          </span>
                        </el-popover>
                        <!-- 提案结束时间 -->
                        <div class="posal-date" v-if="posal.day_end >= 1">
                          {{
                            app.language == "en"
                              ? `${posal.day_end} Days ${posal.hour_end} Hours`
                              : `${posal.day_end}&nbsp;天&nbsp;${posal.hour_end}&nbsp;时后结束`
                          }}
                        </div>
                        <div class="posal-date" v-if="posal.p_status == 2">
                          <!-- 已结束 -->
                          {{ $t("bureau_posal.has_end") }}
                        </div>
                        <div
                          class="posal-date-count"
                          v-if="posal.day_end == 0 && posal.p_status != 2"
                        >
                          <p>
                            <span></span>
                            {{ timeChange(posal.end_time_str).substr(0, 2) }}
                            <span></span>
                          </p>
                          <p>
                            <span></span>
                            {{ timeChange(posal.end_time_str).substr(3, 2) }}
                            <span></span>
                          </p>
                          <p>
                            <span></span>
                            {{ timeChange(posal.end_time_str).substr(6, 2) }}
                            <span></span>
                          </p>
                        </div>
                      </div>
                      <!-- @click="viewOffcial(posal.content_url)" can-click-->
                      <p class="posal-title" v-if="app.language == 'en'">
                        {{ posal.title }}
                      </p>
                      <p class="posal-title" v-else>
                        {{
                          posal.translateStatus ? posal.title_zh : posal.title
                        }}
                      </p>
                      <!-- @dblclick="
                          votes = posal.votes;
                          contentID = posal.id;
                          posalConTitle = posal.title_zh;
                          posalConTitleEN = posal.title;
                          posalBox = true;
                          isChoice = posal.proposal_type == 1 ? false : true;
                          isTrans = posal.is_chinese == 1 ? false : true;
                        " -->
                      <div>
                        <!-- 提案日期信息 -->
                        <div class="posal-time">
                          <!-- 移动端面板时间 -->
                          <div class="mobile-time-panel" v-if="$flag">
                            <p>
                              <!-- 剩余时间 -->
                              {{ $t("bureau_posal.rama") }}
                            </p>
                            <div>
                              <div class="posal-date" v-if="posal.day_end >= 1">
                                {{
                                  app.language == "en"
                                    ? `Ends in ${posal.day_end} Days ${posal.hour_end} Hours`
                                    : `${posal.day_end}&nbsp;天&nbsp;${posal.hour_end}&nbsp;时后结束`
                                }}
                              </div>
                              <div
                                class="posal-date"
                                v-if="posal.p_status == 2"
                              >
                                <!-- 已结束 -->
                                {{ $t("bureau_posal.has_end") }}
                              </div>
                              <!--  -->
                              <div
                                class="posal-date-count"
                                v-if="posal.day_end == 0 && posal.p_status != 2"
                              >
                                <p>
                                  {{
                                    timeChange(posal.end_time_str).substr(0, 2)
                                  }}
                                </p>
                                <p>
                                  {{
                                    timeChange(posal.end_time_str).substr(3, 2)
                                  }}
                                </p>
                                <p>
                                  {{
                                    timeChange(posal.end_time_str).substr(6, 2)
                                  }}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p v-if="posal.start_time">
                            <span>
                              <!-- 开始日期 -->
                              {{ $t("bureau_posal.start_date") }}
                            </span>
                            <span>{{ posal.start_time }}</span>
                          </p>
                          <p v-if="posal.end_time">
                            <span>
                              <!-- 结束日期 -->
                              {{ $t("bureau_posal.end_date") }}
                            </span>
                            <span>{{ posal.end_time }}</span>
                          </p>
                          <p v-else>
                            <!-- 无 -->
                            {{ $t("bureau_evs.no_vote") }}
                          </p>
                        </div>
                        <!-- 投票信息 -->
                        <!-- 单选投票 -->
                        <div
                          class=""
                          v-if="
                            posal.proposal_type == 1 && posal.votes.length > 1
                          "
                        >
                          <div
                            class="vote-msg"
                            v-for="(i, x) in posal.votes"
                            :key="x"
                          >
                            <p class="vote-title">
                              <span v-if="app.language == 'en'">
                                {{ i.title }}
                              </span>
                              <span v-else>{{
                                posal.translateStatus ? i.title_zh : i.title
                              }}</span>
                              <span>{{ i.result_original }}</span>
                            </p>
                            <el-progress
                              :percentage="Number(i.result)"
                              color="#33B1FF"
                              :show-text="false"
                            ></el-progress>
                          </div>
                        </div>
                        <!-- 多选投票 -->
                        <div
                          class="more-choice"
                          v-if="
                            posal.proposal_type == 2 && posal.votes.length > 1
                          "
                        >
                          <div
                            class="choice-inner"
                            v-for="(vote, indexV) in posal.votes"
                            :key="indexV"
                          >
                            <p
                              class="choice-title"
                              v-if="vote.data.length != 0"
                            >
                              <span></span>
                              {{
                                /** 大众投票 & 委员会投票 */
                                vote.vote_type == 1
                                  ? posal.translateStatus
                                    ? $t("bureau_evs.vote_title_1")
                                    : "Members"
                                  : posal.translateStatus
                                  ? $t("bureau_evs.vote_title_2")
                                  : "Advisory Board"
                              }}
                            </p>
                            <!-- <p class="no-vote" v-if="vote.data.length == 0">无</p> -->
                            <div v-if="vote.data.length != 0">
                              <div
                                iv
                                class="vote-msg"
                                v-for="(i, x) in vote.data"
                                :key="x"
                              >
                                <p class="vote-title">
                                  <span v-if="app.language == 'en'">
                                    {{ i.title }}
                                  </span>
                                  <span v-else>{{
                                    posal.translateStatus ? i.title_zh : i.title
                                  }}</span>
                                  <span>{{ i.result_original }}</span>
                                </p>
                                <el-progress
                                  :percentage="Number(i.result)"
                                  color="#33B1FF"
                                  :show-text="false"
                                ></el-progress>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p
                          style="text-align: right; margin-top: 24px"
                          v-if="posal.analysis"
                        >
                          <base-button
                            type="info"
                            round
                            @click="
                              analysisBox = true;
                              analysisText = posal.analysis;
                            "
                          >
                            <i
                              class="iconfont icon-renyuanshuohua_people-speak"
                            ></i>
                            <!-- 研究员观点 -->
                            {{ $t("bureau_evs.ann_think") }}
                          </base-button>
                        </p>
                      </div>
                    </div>
                    <!-- 移动端操作 -->
                    <div class="mobile-posal-oper" v-if="$flag">
                      <p
                        v-if="posal.analysis"
                        @click="
                          analysisBox = true;
                          analysisText = posal.analysis;
                        "
                      >
                        <span
                          class="iconfont icon-renyuanshuohua_people-speak"
                        ></span>
                        <!-- 研究员观点 -->
                        {{ $t("bureau_evs.ann_think") }}
                      </p>
                      <p class="mobile-oper-line" v-if="posal.analysis"></p>
                      <p
                        @click="
                          $store.dispatch('setPoint', 40);
                          viewOffcial(posal.content_url);
                        "
                      >
                        <span class="iconfont icon-diqiuyi_earth"></span>
                        <!-- 查看来源 -->
                        {{ $t("public.soure") }}
                      </p>
                      <p class="mobile-oper-line"></p>
                      <p
                        :class="posal.is_empty == 1 && 'disable-con'"
                        @click="
                          posal.is_empty == 1 ? null : mobileContent(posal)
                        "
                      >
                        <span class="iconfont icon-wenjian_file"></span>
                        <!-- 提案内容 -->
                        {{
                          posal.is_empty == 1
                            ? "无提案内容"
                            : $t("bureau_mine.proposal_con")
                        }}
                      </p>
                    </div>
                  </li>
                </div>
                <div v-else class="">
                  <li
                    class="other-posal"
                    v-for="(other_posal, indexPos_o) in posalList"
                    :key="indexPos_o"
                  >
                    <!-- 操作盒子 -->
                    <div class="other-posal-oper">
                      <el-popover
                        placement="top"
                        trigger="hover"
                        :content="$t('public.translate')"
                        v-if="app.language != 'en'"
                      >
                        <!-- 中英切换 -->
                        <p
                          slot="reference"
                          class="iconfont"
                          :class="
                            other_posal.translateStatus
                              ? ' icon-yuanbian-yingwen_english1'
                              : ' icon-yuanbian-zhongwen1_chinese-one'
                          "
                          @click="
                            $store.dispatch('setPoint', 41);
                            other_posal.translateStatus =
                              !other_posal.translateStatus;
                          "
                        ></p>
                      </el-popover>
                      <el-popover
                        placement="top"
                        trigger="hover"
                        :content="$t('bureau_mine.proposal_con')"
                      >
                        <!-- 提案内容 -->
                        <p
                          class="iconfont icon-yuanbian-yingwenquanwen"
                          slot="reference"
                          @click="
                            $store.dispatch('setPoint', 39);
                            $refs.contentbox.getProps(
                              other_posal.id,
                              (isTrans = other_posal.is_chinese == 1 ? 0 : 1)
                            );
                          "
                        ></p>
                      </el-popover>
                      <el-popover
                        placement="top"
                        trigger="hover"
                        :content="$t('public.soure')"
                      >
                        <!-- 查看来源 -->
                        <p
                          slot="reference"
                          class="iconfont icon-yuanbian-lianjie_link-two"
                          @click="
                            $store.dispatch('setPoint', 40);
                            viewOffcial(other_posal.content_url);
                          "
                        ></p>
                      </el-popover>
                    </div>
                    <div class="mobile-use">
                      <div class="other-title">
                        <p class="two-elip" v-if="app.language == 'en'">
                          {{ other_posal.title }}
                        </p>
                        <p class="two-elip" v-else>
                          {{
                            other_posal.translateStatus
                              ? other_posal.title_zh
                              : other_posal.title
                          }}
                        </p>
                        <span
                          class="iconfont"
                          :class="
                            other_posal.translateStatus
                              ? ' icon-yuanbian-yingwen_english1'
                              : ' icon-yuanbian-zhongwen1_chinese-one'
                          "
                          @click="
                            other_posal.translateStatus =
                              !other_posal.translateStatus
                          "
                          v-if="$flag"
                        ></span>
                      </div>
                      <div class="other-pro-msg">
                        <img :src="other_posal.logo" alt="" />
                        <p>
                          {{ other_posal.projectTitle }}({{
                            other_posal.symbol
                          }})
                        </p>
                        <p>
                          <!-- 开始时间 -->
                          {{ $t("bureau_posal.start_time") }}
                          <span>{{
                            other_posal.start_time
                              ? other_posal.start_time
                              : $t("bureau_evs.no_vote")
                          }}</span>
                        </p>
                      </div>
                    </div>
                    <!-- 移动端时间 -->
                    <p class="mobile-use-time" v-if="$flag">
                      <span>
                        <!-- 开始时间 -->
                        {{ $t("bureau_posal.start_time") }}
                      </span>
                      <span>{{
                        other_posal.start_time
                          ? other_posal.start_time
                          : $t("bureau_evs.no_vote")
                      }}</span>
                    </p>
                    <p class="other-content" v-if="app.language == 'en'">
                      {{ other_posal.abstract }}
                    </p>
                    <p class="other-content" v-else>
                      {{
                        other_posal.translateStatus
                          ? other_posal.abstract_zh
                          : other_posal.abstract
                      }}
                    </p>
                    <!-- 移动端操作 -->
                    <div class="mogile-use-oper" v-if="$flag">
                      <p v-if="other_posal.analysis">
                        <span
                          class="iconfont icon-renyuanshuohua_people-speak"
                        ></span>
                        <span>
                          <!-- 研究员观点 -->
                          {{ $t("bureau_evs.ann_think") }}
                        </span>
                      </p>
                      <p v-if="other_posal.analysis" class="use-line"></p>
                      <p
                        @click="
                          $store.dispatch('setPoint', 40);
                          viewOffcial(other_posal.content_url);
                        "
                      >
                        <span class="iconfont icon-diqiuyi_earth"></span>
                        <span>
                          <!-- 查看来源 -->
                          {{ $t("public.soure") }}
                        </span>
                      </p>
                      <p class="use-line"></p>
                      <p
                        @click="
                          $store.dispatch('setPoint', 39);
                          $router.push({
                            path: '/posal-details',
                            query: {
                              votes: JSON.stringify([]),
                              id: other_posal.id,
                              isChoice: other_posal.proposal_type == 1 ? 1 : 2,
                              isTrans: other_posal.is_chinese == 1 ? 0 : 1,
                            },
                          });
                        "
                      >
                        <span class="iconfont icon-wenjian_file"></span>
                        <span>
                          <!-- 提案内容 -->
                          {{ $t("bureau_posal.posal_con") }}
                        </span>
                      </p>
                    </div>
                  </li>
                </div>
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
              <!-- 没有更多了 -->
              {{ $t("bureau_express.no_more") }}
            </p>
          </div>
          <p v-else class="no-data">
            <!-- 暂无提案 -->
            {{ $t("no_data.no_posal") }}
          </p>
        </div>
        <!-- 我的自选 -->
        <div class="center-attention">
          <MyOptional @upPosalList="upPosalList" />
        </div>
        <!-- 提案详情 -->
        <modal :show.sync="posalBox" modalClasses="read-original-box">
          <div class="posal-box-inner" v-loading="loadContent">
            <p class="inner-title">
              {{ languageStatus ? posalConTitle : posalConTitleEN }}
            </p>
            <!-- loadContent -->
            <div class="inner-content">
              <p
                class="inner-text"
                v-html="languageStatus ? posalContentZH : posalContent"
              ></p>
              <!-- 投票信息 -->
              <!-- 单选投票 -->
              <div class="vote-box" v-if="!isChoice">
                <div class="vote-msg" v-for="(i, x) in votes" :key="x">
                  <p class="vote-title">
                    <span>{{ languageStatus ? i.title_zh : i.title }}</span>
                    <span>{{ i.result_original }}</span>
                  </p>
                  <el-progress
                    :percentage="Number(i.result)"
                    color="#33B1FF"
                    :show-text="false"
                  ></el-progress>
                </div>
              </div>
              <!-- 多选投票 -->
              <div class="more-choice" v-else>
                <div
                  class="choice-inner"
                  v-for="(vote, indexV) in votes"
                  :key="indexV"
                >
                  <p class="choice-title" v-if="vote.data.length != 0">
                    <span></span>
                    {{
                      /** 大众投票 & 委员会投票 */
                      vote.vote_type == 1
                        ? languageStatus
                          ? $t("bureau_evs.vote_title_1")
                          : "Members"
                        : languageStatus
                        ? $t("bureau_evs.vote_title_2")
                        : "Advisory Board"
                    }}
                  </p>
                  <!-- <p class="no-vote" v-if="vote.data.length == 0">无</p> -->
                  <div>
                    <div
                      iv
                      class="vote-msg"
                      v-for="(i, x) in vote.data"
                      :key="x"
                    >
                      <p class="vote-title">
                        <span>{{ languageStatus ? i.title_zh : i.title }}</span>
                        <span>{{ i.result_original }}</span>
                      </p>
                      <el-progress
                        :percentage="Number(i.result)"
                        color="#33B1FF"
                        :show-text="false"
                      ></el-progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 操作 -->
            <div class="inner-oper" :class="{ 'two-btn': isTrans }">
              <p>
                <base-button
                  type="defalut"
                  round
                  @click="
                    votes = [];
                    posalConTitle = null;
                    posalContent = null;
                    posalContentZH = null;
                    languageStatus = false;
                    posalBox = false;
                  "
                >
                  <!-- 关闭 -->
                  {{ $t("public.close") }}
                </base-button>
              </p>
              <p class="inner-label"></p>
              <p v-if="isTrans">
                <el-popover
                  placement="right"
                  trigger="hover"
                  :content="$t('bureau_evs.deep_remark')"
                >
                  <!-- 翻译由DEEPL提供 -->
                  <base-button
                    type="info"
                    round
                    class="other-info"
                    slot="reference"
                    @click="
                      languageStatus = !languageStatus;
                      languageStatus ? getInfoContentZh() : getInfoContent();
                    "
                  >
                    <i class="iconfont icon-fanyi_translation"></i>
                    {{ languageStatus ? "English Version" : "翻译成中文" }}
                  </base-button>
                </el-popover>
                <!-- v-if="translateStatus == 2" -->
                <base-button
                  class="other-info"
                  round
                  v-if="false"
                  disabled="disabled"
                >
                  <i class="iconfont icon-fanyi_translation"></i>
                  翻译中
                </base-button>
              </p>
            </div>
          </div>
        </modal>
        <!-- 研究员观点 -->
        <modal :show.sync="analysisBox" modalClasses="login-box-modal">
          <div class="analysis-box">
            <p class="">
              <!-- 研究员观点 -->
              {{ $t("bureau_evs.ann_think") }}
            </p>
            <p>{{ analysisText }}</p>
            <p>
              <base-button type="default" round @click="analysisBox = false">
                <!-- 关闭 -->
                {{ $t("public.close") }}
              </base-button>
            </p>
          </div>
        </modal>
      </div>
    </div>
    <div v-else>
      <NoData @upPageData="upPageData" />
    </div>
    <!-- 提案原文 -->
    <ConetentBox ref="contentbox" />
    <!-- 提交翻译 -->
    <TranslateSub ref="translateSub" />
    <!-- 移动端我的自选 -->
    <MobileMineTrack v-if="$flag" @upPosalList="upPosalList" />
  </div>
</template>

<script>
import { Modal, BasePagination } from "@/components";
import { mapState } from "vuex";
import { scrollBack } from "@/util/index";
import { InfiniteScroll } from "element-ui";
import {
  posalList,
  posalCount,
  infoContent,
  infoContentZh,
} from "@/request/api";
export default {
  directives: {
    "infinite-scroll": InfiniteScroll,
  },
  data() {
    return {
      raceTypeList: [
        {
          //待开始提案
          name: this.$t("bureau_posal.begin"),
          id: 0,
          num: 0,
        },
        {
          //已结束提案
          name: this.$t("bureau_posal.end"),
          id: 2,
          num: 0,
        },
        // {
        //   name: "全部活跃提案",
        //   id: 0,
        //   num: 0,
        // },
      ], //赛道类型列表
      nowType: 9999, //默认选中
      posalList: [], //提案列表
      total: 10, //总页数
      defaultPagination: 1, //当前页码
      loadData: false, //数据加载
      isNeedPage: false,
      isHasData: true,
      mobileTabs: false, //菜单打开状态
      totalPro: 0, //项目总数
      isFollow: 1, //项目类型
      trackSearch: null, //搜索
      posalBox: false, //提案内容
      nowID: null, //选择项目提案
      posalContent: null, //提案内容
      posalContentZH: null,
      posalConTitleEN: null,
      posalConTitle: null, //提案标题
      votes: [], //投票详情信息
      languageStatus: false, // true---->中文  false---->英文
      timer: null,
      butText: "翻译成中文",
      analysisBox: false,
      analysisText: null,
      loadContent: false,
      contentID: null,
      isChoice: false, //是否为多选投票
      isTrans: true,
      isFixed: false, //是否吸顶
      translateStatus: 0,
      loadMore: false,
      dataTotal: 999,
      reloadPoasl: false,
    };
  },
  components: {
    MyOptional: (resolve) => require(["./coms/my_optional.vue"], resolve),
    Modal,
    BasePagination,
    NoData: (resolve) => require(["./coms/no_data"], resolve),
    TranslateSub: (resolve) =>
      require(["./coms/mine_bureau/sub_translate"], resolve),
    MobileMineTrack: (resolve) =>
      require(["./coms/my_optional_mobile"], resolve),
    ConetentBox: (resolve) => require(["./coms/content_box"], resolve),
  },
  watch: {
    trackSearch() {
      this.defaultPagination = 1;
      this.posalCount();
      this.getPosalList();
    },
    posalBox(val) {
      // val && this.getInfoContent();
      !val && (this.translateStatus = 0);
    },
  },
  created() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.posalCount();
    this.getPosalList();
    this.beginTimer();
  },
  mounted() {
    window.addEventListener("scroll", this.initHeight, true);
  },
  computed: {
    ...mapState(["app"]),
    newTimestemp() {
      return (new Date().getTime() / 1000).toFixed(0);
    },
    noMore() {
      return this.dataTotal == 0;
    },
    // 禁用滚动加载
    disabled() {
      return this.loadMore || this.noMore;
    },
  },
  methods: {
    mobileContent(posal) {
      this.$store.dispatch("setPoint", 39);
      this.$router.push({
        path: "/posal-details",
        query: {
          votes: JSON.stringify(posal.votes),
          id: posal.id,
          isChoice: posal.proposal_type == 1 ? 1 : 2,
          isTrans: posal.is_chinese == 1 ? 0 : 1,
        },
      });
    },
    //下拉刷新
    async onRefreshPosal() {
      await this.getPosalList();
      setTimeout(() => {
        this.reloadPoasl = false;
      }, 500);
    },
    //加载更多
    loadMoreEv() {
      this.defaultPagination += 1;
      this.loadMore = true;
      setTimeout(async () => {
        await this.getPosalList();
      }, 500);
    },
    //提交翻译
    async transToSub() {
      const result = await infoContentZh({ id: this.contentID });
      this.languageStatus = false;
      this.translateStatus = result.tran;
      this.$refs.translateSub.subTranslate = true;
    },
    //倒计时开始
    beginTimer() {
      this.timer = setInterval(() => {
        for (let i in this.posalList) {
          const item = this.posalList[i];
          if (item.end_time_str > 0) {
            item.end_time_str = item.end_time_str - 1;
          }
        }
      }, 1000);
    },
    timeChange(_count) {
      if (_count < 0) {
        clearInterval(setInterval(this.timeChange(_count), 1000));
      }
      // let count_down = _count * 1000 - new Date().getTime();
      let sec = this.filterNumber((_count - this.newTimestemp) % 60);
      let min = this.filterNumber(((_count - this.newTimestemp) / 60) % 60);
      let hours = this.filterNumber(
        ((_count - this.newTimestemp) / (60 * 60)) % 24
      );
      return hours + "-" + min + "-" + sec;
    },
    filterNumber(_num) {
      let number = Math.floor(_num);
      return number > 9 ? number : "0" + number;
    },
    //提案统计
    async posalCount() {
      const result = await posalCount({
        search: this.trackSearch,
        ipid: this.nowID,
      });
      this.totalPro = result.active;
      this.$set(this.raceTypeList[0], "num", result.pending);
      this.$set(this.raceTypeList[1], "num", result.closed);
    },
    //提案列表
    async getPosalList() {
      this.defaultPagination == 1 && (this.loadData = true);
      const result = await posalList({
        page: this.defaultPagination,
        limit: 12,
        status: this.isFollow,
        ipid: this.nowID,
        search: this.trackSearch,
      });
      this.loadData = false;
      if (this.defaultPagination > 1) {
        result.data.forEach((to) => {
          this.posalList.push(to);
        });
      } else {
        this.posalList = result.data;
      }
      this.loadMore = false;
      this.dataTotal = result.data.length;
      this.posalList.forEach((e) => {
        this.$set(e, "translateStatus", true);
      });
      this.total = result.last_page;
      // result.last_page > 1
      //   ? (this.isNeedPage = true)
      //   : (this.isNeedPage = false);
      this.posalCount();
      this.posalList.length == 0 && (this.isHasData = false);
      this.posalList.length > 0 && (this.isHasData = true);
    },
    //获取内容原文
    async getInfoContent() {
      this.loadContent = true;
      const result = await infoContent({ id: this.contentID });
      if (!result.content) {
        this.$notify({
          type: "danger",
          //该提案暂无内容
          message: this.$t("notify.posal_none"),
        });
        return;
      }
      this.posalContent = result.content;
      this.posalBox = true;
      this.translateStatus = result.tran;
      this.loadContent = false;
    },
    //获取内容译文
    async getInfoContentZh() {
      this.loadContent = true;
      const result = await infoContentZh({ id: this.contentID });
      console.log(result);
      if (!result.content) {
        this.$notify({
          type: "danger",
          //该提案暂无内容
          message: this.$t("notify.posal_none"),
        });
        return;
      }
      this.posalContentZH = result.content;
      this.posalBox = true;
      this.loadContent = false;
    },
    //访问来源
    viewOffcial(_url) {
      window.open(_url);
    },
    //追踪项目提案
    upPosalList(_id) {
      this.nowID = _id;
      this.defaultPagination = 1;
      this.getPosalList();
      this.posalCount();
      scrollBack();
    },
    //判断吸顶
    initHeight() {
      let el = document.querySelector(".open-alive");
      let scrollTop = el.getBoundingClientRect().top;
      if (!this.$flag) {
        this.isFixed = scrollTop <= 0 ? true : false;
      }
      if (this.$flag) {
        this.isFixed = scrollTop <= 18 ? true : false;
      }
    },
    //更新页面数据
    upPageData() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      setTimeout(() => {
        this.posalCount();
        this.getPosalList();
        this.beginTimer();
      }, 200);
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener("scroll", this.initHeight, true);
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-pull-refresh {
  min-height: auto;
}
.has-fixed-posal {
  padding-top: 64px;
}
.posal-fixed-box {
  position: fixed !important;
  width: 83.5%;
  top: 64px;
  z-index: 1100;
  .fixed-mask {
    display: block !important;
  }
}
.other-fixed-width {
  width: 91.4%;
}
@media screen and (min-width: 2000px) {
  .posal-fixed-box {
    width: 87.5% !important;
  }
  .other-fixed-width {
    width: 93.5% !important;
  }
}
@media screen and (max-width: 1400px) {
  .posal-fixed-box {
    width: 88.1% !important;
  }
}
.bureau-proposal {
  .title-box {
    width: 100%;
    height: 64px;
    background: $contentBg;
    display: flex;
    justify-content: space-between;
    padding-left: 24px;
    align-items: center;
    border-radius: 4px;
    .h4 {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      color: white;
      .iconfont {
        font-size: $iconSize;
        color: white;
        font-size: 22px;
        margin-right: 8px;
      }
    }
  }
  .race-type {
    height: 48px;
    padding: 0 12px;
    background: $contentBg;
    margin-top: 16px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .fixed-mask {
      position: absolute;
      width: 100%;
      height: 24px;
      bottom: -24px;
      background: $mineBg;
      left: 0;
      display: none;
    }
    ul {
      overflow-x: auto;
      display: flex;
      .activeType {
        color: $success;
        .race-line {
          width: 100%;
        }
        .race-num {
          background: rgba(167, 240, 186, 0.1);
          color: $success;
        }
      }
      li {
        line-height: 48px;
        margin: 0 12px;
        white-space: nowrap;
        font-size: 14px;
        color: $remarkColor;
        cursor: pointer;
        transition: 0.3s all;
        position: relative;
        .race-line {
          display: inline-block;
          position: absolute;
          width: 0;
          height: 2px;
          background: $success;
          transition: 0.3s all;
          left: 0;
          bottom: 0;
        }
        .race-num {
          font-size: 12px;
          display: inline-block;
          height: 14px;
          padding: 0 4px;
          background: rgba(255, 212, 92, 0.1);
          color: #ffd45c;
          line-height: 14px;
          transform: translateY(-1px);
          border-radius: 4px;
          transition: 0.3s all;
        }
      }
    }
    .search-type {
      width: 160px;
      height: 28px;
      background: $conBg2;
      border-radius: 18px;
      position: relative;
      margin-right: 12px;
      .iconfont {
        position: absolute;
        top: 7px;
        font-size: 14px;
        left: 12px;
      }
      input {
        width: 100%;
        height: 100%;
        color: $textColor;
        background: rgba(0, 0, 0, 0);
        font-size: 12px;
        box-sizing: border-box;
        padding-left: 30px;
      }
    }
  }
  .proposal-center {
    display: flex;
    margin-top: 24px;
    .center-list {
      flex: 1;
      min-height: 800px;
      ul {
        .ordinary-posal {
          margin-bottom: 16px;
          background: $contentBg;
          border-radius: 4px;
          display: flex;
          .pro-msg {
            width: 240px;
            padding: 40px 24px;
            background: $conBg2;
            border-radius: 4px;
            p {
              button {
                width: 100%;
                margin-bottom: 12px;
              }
            }
            .pro-content {
              button {
                background: linear-gradient(90deg, #8433ff 0%, #7970fe 100%);
              }
            }
            p:first-child {
              text-align: center;
              margin-bottom: 8px;
              img {
                width: 48px;
                height: 48px;
                border-radius: 50%;
              }
            }
            p:last-child {
              button {
                margin-bottom: 0;
              }
            }
            .pro-name {
              font-size: 13px;
              color: white;
              font-weight: bold;
              text-align: center;
              margin-bottom: 24px;
            }
          }
          .proposal-msg {
            flex: 1;
            height: 100%;
            position: relative;
            padding: 24px;
            .data-box {
              display: flex;
              position: absolute;
              top: 24px;
              right: 24px;
              justify-content: flex-start;
              align-items: center;
              .iconfont-box {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                flex: inherit;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 12px;
                margin-left: 16px;
                position: relative;
                cursor: pointer;
                i {
                  font-size: 24px;
                  font-weight: 400;
                  color: $remarkColor;
                }
                i:hover {
                  color: white;
                }
              }
              .posal-date {
                height: 32px;
                padding: 0 16px;
                background: rgba(167, 240, 186, 0.1);
                color: $success;
                display: flex;
                align-items: center;
                font-size: 13px;
                border-radius: 4px;
              }
              .posal-date-count {
                display: flex;
                top: 24px;
                right: 24px;
                height: 42px;
                p {
                  position: relative;
                  display: flex;
                  align-items: center;
                  width: 40px;
                  height: 100%;
                  justify-content: center;
                  font-size: 23px;
                  color: $success;
                  margin-left: 4px;
                  span {
                    display: inline-block;
                    width: 100%;
                    height: 20px;
                    background: rgba(167, 240, 186, 0.1);
                    border-radius: 4px;
                    position: absolute;
                    left: 0;
                  }
                  span:first-child {
                    top: 0;
                  }
                  span:last-child {
                    bottom: 0;
                  }
                }
              }
            }

            .posal-title {
              width: 75%;
              line-height: 23px;
              font-size: 17px;
              color: white;
              margin-bottom: 16px;
              display: flex;
            }
            .can-click:hover {
              text-decoration: underline;
              cursor: pointer;
            }
            .posal-time {
              width: 100%;
              display: flex;
              margin-bottom: 40px;
              .mobile-time-panel {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p {
                  margin-top: 0;
                  font-size: $fon12;
                  color: $remarkColor;
                }
                .posal-date {
                  height: $fon20;
                  padding: 0 3px;
                  font-size: $fon12;
                  color: $success;
                  background: rgba(167, 240, 186, 0.1);
                  border-radius: 4px;
                  line-height: $fon20;
                }
                .posal-date-count {
                  display: flex;
                  p {
                    height: $fon20;
                    padding: 0 3px;
                    background: rgba(167, 240, 186, 0.1);
                    font-size: $fon12;
                    color: $success;
                    font-size: $fon12;
                    margin-right: 0.25rem;
                    border-radius: 4px;
                    line-height: $fon20;
                  }
                }
              }
              p {
                display: flex;
                flex-direction: column;
                margin-right: 40px;
                span:first-child {
                  margin-bottom: 4px;
                  color: $remarkColor;
                  font-size: 12px;
                }
                span:last-child {
                  font-size: 13px;
                  color: $success;
                }
              }
              p:last-child {
                span:last-child {
                  color: $danger;
                }
              }
            }
            .more-choice {
              .choice-inner {
                margin-bottom: 40px;
                .choice-title {
                  margin-bottom: 16px;
                  font-size: 12px;
                  color: #ffd45c;
                  span {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 4px;
                    border: 2px solid #ffd45c;
                  }
                }
              }
            }
            .vote-msg {
              margin-bottom: 16px;
              .vote-title {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                span {
                  font-size: 13px;
                  color: white;
                }
                span:first-child {
                  color: $textColor;
                }
                span:last-child {
                  font-weight: bold;
                }
              }
            }
            .vote-msg:last-child {
              margin-bottom: 0;
            }
          }
          .mobile-posal-oper {
            border-top: 1px solid $mineBg;
            display: flex;
            justify-content: space-between;
            padding: 1rem 0;
            margin-top: 0.5rem;
            .mobile-oper-line {
              width: 1px;
              height: $padd40;
              background: $mineBg;
              flex: none;
            }
            p {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 0.81rem;
              color: $remarkColor;
              flex: 1;
              .iconfont {
                font-size: 1rem;
                margin-bottom: 0.5rem;
                color: white;
              }
            }
            .disable-con {
              color: $lineColor;
              .iconfont {
                color: $lineColor;
              }
            }
          }
        }
        .other-posal {
          padding: 24px;
          background: $contentBg;
          border-radius: 4px;
          margin-bottom: 16px;
          position: relative;
          .other-posal-oper {
            position: absolute;
            top: 24px;
            right: 24px;
            display: flex;
            p {
              margin-left: 24px;
              font-size: 24px;
              color: $remarkColor;
              cursor: pointer;
              transition: 0.3s all;
            }
            p:hover {
              color: white;
            }
          }
          .other-title {
            font-size: 17px;
            color: white;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .iconfont {
              font-weight: 400;
              font-size: $fon20;
              color: $remarkColor;
            }
          }
          .mobile-use-time {
            display: flex;
            justify-content: space-between;
            margin-top: 1rem;
            padding: 0 1rem;
            font-size: $fon12;
            color: $remarkColor;
            align-items: center;
            span:last-child {
              color: $success;
            }
          }
          .other-pro-msg {
            display: flex;
            align-items: center;
            img {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              margin-right: 8px;
            }
            p:nth-child(2) {
              font-size: 12px;
              color: white;
              margin-right: 24px;
            }
            p:last-child {
              font-size: 12px;
              color: $remarkColor;
              span {
                color: $success;
                margin-left: 8px;
              }
            }
          }
          .other-content {
            margin-top: 16px;
            font-size: 13px;
            color: $remarkColor;
            line-height: 22px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            word-break: break-all;
            line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          .mogile-use-oper {
            border-top: 1px solid $mineBg;
            padding: 1rem 0;
            display: flex;
            justify-content: space-between;
            p {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              .iconfont {
                font-size: 1rem;
                margin-bottom: 0.5rem;
                color: white;
              }
              font-size: 0.81rem;
              color: $remarkColor;
            }
            .use-line {
              flex: none;
              width: 1px;
              height: $padd40;
              background: $mineBg;
            }
          }
        }
      }
      .load-more-mine {
        margin-top: 36px;
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
    }
    .center-attention {
      width: 23%;
      max-height: 650px;
      margin-left: 30px;
    }
  }
}
.posal-box-inner {
  padding: 24px 24px 32px 24px;
  position: relative;
  /deep/ .el-loading-spinner .path {
    stroke: $contentBg;
  }
  /deep/ .el-progress-bar__outer {
    background-color: $textColor;
  }
  .inner-title {
    font-size: 17px;
    font-weight: bold;
    color: $titleColor;
    margin-bottom: 28px;
    display: none;
  }
  .inner-content {
    width: 100%;
    overflow-y: auto;
    padding-right: 16px;
    height: 70vh;
    .inner-text {
      font-size: 12px;
      color: #676c7a;
      line-height: 18px;
      margin-bottom: 24px;
      min-height: 70%;
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
        margin-right: 8px;
      }
      /deep/ p {
        color: $titleColor;
        margin: 16px 0;
        font-size: 14px;
      }
      /deep/ blockquote {
        word-break: break-all;
        border-left: 6px solid $textColor;
        padding-left: 8px;
      }
      /deep/ pre {
        padding: 16px;
        border-radius: 4px;
        background: $textColor;
        code {
          color: $titleColor;
        }
      }
      /deep/ li {
        padding-left: 16px;
      }
      /deep/ ul {
        li {
          color: $titleColor;
          margin: 16px 0;
        }
      }
      /deep/ ol {
        li {
          margin: 16px 0;
          color: $titleColor;
        }
      }
      /deep/ table {
        th {
          padding: 16px;
          border: 1px solid $textColor;
        }
        td {
          padding: 8px;
        }
        tr {
          border: 1px solid $textColor;
        }
        td {
          border: 1px solid $textColor;
        }
      }
      /deep/ br {
        content: "";
        display: block;
        height: 4px;
      }
      /deep/ img {
        margin: 16px 0;
      }
    }
    .more-choice {
      .choice-inner {
        margin-bottom: 40px;
        .choice-title {
          margin-bottom: 16px;
          font-size: 12px;
          color: #ffac33;
          span {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 4px;
            border: 2px solid #ffac33;
          }
        }
      }
    }
    .vote-box {
      margin-top: 24px;
      .vote-msg {
        margin-bottom: 16px;
        .vote-title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          span {
            font-size: 13px;
            color: $titleColor;
          }
          span:last-child {
            font-weight: bold;
          }
        }
      }
      .vote-msg:last-child {
        margin-bottom: 0;
      }
    }
  }
  .inner-oper {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    bottom: -84px;
    p:last-child {
      span {
        margin-right: 24px;
        color: $remarkColor;
        font-size: 12px;
        font {
          color: $iconColor;
          cursor: pointer;
          margin-left: 2px;
        }
      }
    }
  }
  .two-btn {
    .inner-label {
      display: block;
    }
  }
}
.page-tools {
  display: flex;
  justify-content: center;
}
.no-data {
  text-align: center;
  font-size: 18px;
  color: $remarkColor;
  margin-top: 100px;
}
.analysis-box {
  text-align: center;
  padding: 24px 24px 32px 24px;
  p:first-child {
    font-size: 17px;
    color: $titleColor;
    font-weight: bold;
  }
  p:nth-child(2) {
    text-align: left;
    margin-top: 24px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #676c7a;
    line-height: 22px;
  }
}
@media screen and (max-width: 1279px) {
  .has-fixed-posal {
    padding-top: 3.3rem;
  }
  .posal-fixed-box {
    // top:;
    width: 100% !important;
    position: fixed;
    top: 5rem;
    .fixed-mask {
      height: 1rem !important;
      bottom: -1rem !important;
    }
  }
  .bureau-proposal {
    // padding-top: 6rem;
    .title-box {
      display: none;
    }
    .mobile-posal-search {
      padding: 1rem;
      background: $contentBg;
      width: 100%;
      input {
        width: 100%;
        height: 2rem;
        background: $conBg2;
        border-radius: $fon18;
        box-sizing: border-box;
        padding-left: 2rem;
        color: white;
      }
      .iconfont {
        position: absolute;
        font-size: 1rem;
        left: 1.625rem;
        top: $padd24;
        color: $textColor;
      }
    }
    .race-type {
      margin-top: 0;
      width: 100%;
      border-radius: 0;
      ul {
        .activeType {
          .race-line {
            width: $padd24;
            left: 50%;
            margin-left: -$fon12 - 0.5rem;
          }
        }
      }
      .search-type {
        display: none;
      }
    }
    .proposal-center {
      .center-list {
        padding: 0 $fon14;
        width: 100%;
        ul {
          .ordinary-posal {
            flex-direction: column;
            .pro-msg {
              width: 100%;
              padding: 1rem;
              .mobile-panel {
                .mobile-title-msg {
                  display: flex;
                  align-items: center;
                  margin-bottom: $fon12;
                  p:first-child {
                    flex: 1;
                    text-align: left;
                    font-size: 0.94rem;
                    color: white;
                    font-weight: bold;
                    line-height: 1.875rem;
                    margin-bottom: 0;
                  }
                  p:last-child {
                    width: $fon20;
                    height: $fon20;
                    margin-right: 0.5rem;
                    .iconfont {
                      font-size: $fon20;
                      color: $remarkColor;
                    }
                  }
                }
                .mobile-logo-msg {
                  display: flex;
                  align-items: center;
                  img {
                    width: $padd24;
                    height: $padd24;
                    border-radius: 50%;
                    margin-right: 0.5rem;
                    background: white;
                  }
                  p {
                    font-size: $fon12;
                    color: $remarkColor;
                  }
                }
              }
            }
            .proposal-msg {
              padding: 1rem;
              .data-box {
                display: none;
              }
              .posal-title {
                display: none;
              }
              .posal-time {
                flex-direction: column;
                p {
                  margin-right: 0;
                  flex-direction: row;
                  justify-content: space-between;
                  margin-top: 0.625rem;
                }
              }
            }
          }
          .other-posal {
            padding: 0;
            overflow: hidden;
            .other-posal-oper {
              display: none;
            }
            .mobile-use {
              padding: 1rem;
              background: $conBg2;
              .other-title {
                font-size: $fon14;
              }
              .other-pro-msg {
                p:last-child {
                  display: none;
                }
              }
            }
            .other-content {
              padding: 0 1rem;
              line-height: $fon18;
              margin-top: $padd24;
              margin-bottom: 1rem;
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