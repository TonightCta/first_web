// Discord专区
<template>
  <div class="bureau-discord">
    <div class="title-box">
      <p class="h4">
        <span class="iconfont icon-xinxi_info"></span>
        Discord专区，直击关键信息
      </p>
    </div>
    <div class="mobile-discord-search" v-if="$flag">
      <span class="iconfont icon-sousuo_search"></span>
      <input type="text" placeholder="请输入" v-model="searchVal">
    </div>
    <div
      class=""
      v-if="app.account.is_follow == 1 && app.account.is_information == 1"
    >
      <!-- 项目选项卡 -->
      <div class="tabs-pro" :class="isFixed && 'fixed-box-dis'">
        <!-- 左转 -->
        <div class="left-arrow" @click="leftArrow" v-if="false">
          <p class="iconfont icon-zuo_left"></p>
        </div>
        <div class="swiper-list">
          <div class="swiper-container swiper-discord">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(i, x) in swiperList"
                :key="i.id"
                :class="{ 'tabs-active': proIndex == x }"
                @click="changePro(i.id, x)"
              >
                <p>
                  <img :src="i.logo" alt="" />
                </p>
                <p class="text-overflow" style="width: 80%; text-align: center">
                  {{ i.title }}
                </p>
                <p>{{ i.symbol }}</p>
              </div>
              <!-- 添加自选 -->
              <div
                class="swiper-slide add-last"
                @click="$flag ? $router.push('/add-track') : (addTrack = true)"
              >
                <span class="iconfont icon-jia_plus"></span>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧操作 -->
        <div class="right-oper" v-if="false">
          <!-- 添加项目 -->
          <div class="add-pro" @click="addTrack = true">
            <p class="iconfont icon-jia_plus"></p>
          </div>
          <!-- 右转 -->
          <div class="right-arrow" @click="rightArrow">
            <p class="iconfont icon-you_right"></p>
          </div>
        </div>
      </div>
      <!-- 数据类型选项卡 -->
      <div class="tabs-type" :class="isFixed && 'fixed-box-tabs'">
        <div class="tabs-remark">{{ $flag ? "频道" : "跟踪频道" }}</div>
        <div class="tabs-inner">
          <ul>
            <li
              v-for="(type, indexT) in tabsType"
              :key="indexT + 'type'"
              :class="{ 'type-active': typeIndex == indexT }"
              @click="
                typeIndex = indexT;
                typeID = type.id;
                getDataList();
              "
            >
              {{ type.name }}
              <span class="tabs-line"></span>
            </li>
          </ul>
          <div class="search-box">
            <p class="iconfont icon-sousuo_search"></p>
            <input type="text" v-model="searchVal" placeholder="请输入" />
          </div>
        </div>
        <div class="fixed-mask"></div>
      </div>
      <!-- 数据主体 -->
      <div class="data-list" :class="isFixed && 'has-fixed-dis'">
        <div v-if="isHasData" v-loading="loadData" style="min-height: 300px">
          <ul>
            <li v-for="(i, x) in disList" :key="x + 'data'">
              <div class="icon-box">
                <img :src="i.avatar" alt="" />
              </div>
              <div class="msg-box">
                <div class="msg-top">
                  <!-- 项目名称信息 -->
                  <div class="title-msg">
                    <p>{{ i.author }}</p>
                    <p>
                      {{ i.publish_time }}<span>以下内容由DeepL提供翻译</span>
                    </p>
                  </div>
                  <div class="oper-box">
                    <!-- 翻译 -->

                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="中英切换"
                    >
                      <div
                        class="whole-btn"
                        slot="reference"
                        @click="i.abs_translate = !i.abs_translate"
                        style="margin-right: 16px"
                      >
                        <p
                          class="iconfont"
                          :class="
                            i.abs_translate
                              ? 'icon-yuanbian-zhongwen1_chinese-one'
                              : ' icon-yuanbian-yingwen_english1'
                          "
                        ></p>
                      </div>
                    </el-popover>
                    <!-- 完整对话 -->
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="完整对话"
                    >
                      <div
                        class="whole-btn"
                        slot="reference"
                        @click="$refs.wholebox.getProps(i.did, i.content_url)"
                      >
                        <p
                          class="
                            iconfont
                            icon-yuanbian-biaoqingxinxi_message-emoji
                          "
                        ></p>
                        <p class="bet-line"></p>
                      </div>
                    </el-popover>

                    <!-- 点赞 & 点踩 -->
                    <div class="like-and-un">
                      <p
                        @click="like(i.id, 1)"
                        :class="{ 'has-like': i.like == 1 }"
                      >
                        <span
                          class="iconfont icon-yuanbian-youxiu_shixin_good-one"
                          v-if="i.like == 1"
                        ></span>
                        <span
                          class="iconfont icon-yuanbian-youxiu_good-one"
                          v-else
                        ></span>
                        {{ i.like_num > 0 ? i.like_num : "赞" }}
                      </p>
                      <el-popover
                        placement="top"
                        trigger="hover"
                        content="无用内容踩一踩，帮助头等仓改善内容过滤机制，超过15个踩，本情报将丢弃。"
                      >
                        <p
                          @click="like(i.id, 0)"
                          slot="reference"
                          :class="{ 'un-like': i.like == 2 }"
                        >
                          <span
                            class="iconfont icon-yuanbian-chajin_bad-one"
                          ></span>
                          {{ i.unlike_num > 0 ? i.unlike_num : "踩" }}
                        </p>
                      </el-popover>
                    </div>
                  </div>
                </div>
                <!-- 内容 -->
                <div class="con-bot">
                  <div
                    class="con-text"
                    v-html="i.abs_translate ? i.abstract : i.abstract_zh"
                  ></div>
                  <!-- 附件 -->
                  <div v-if="i.extends.length > 0">
                    <div
                      class="ang-box"
                      v-for="(appendix, indexA) in i.extends"
                      :key="indexA"
                    >
                      <el-image
                        style="width: 94px; height: 94px"
                        v-if="appendix.thumbnail"
                        :src="appendix.thumbnail"
                        fit="none"
                        :preview-src-list="[appendix.thumbnail]"
                      >
                      </el-image>
                      <div class="ang-other" @click="viewOffical(appendix.url)">
                        <p class="text-overflow">
                          {{
                            i.abs_translate ? appendix.title : appendix.title_zh
                          }}
                        </p>
                        <p class="text-overflow">
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
              </div>
            </li>
          </ul>
          <!-- 分页器 -->
          <div class="page-tools" v-if="isNeedPage">
            <base-pagination
              :page-count="total"
              type="info"
              v-model="defaultPagination"
            ></base-pagination>
          </div>
        </div>
        <p class="no-data" v-else>暂无数据</p>
      </div>
    </div>
    <!-- 无自选 -->
    <div class="no-data-track" v-else>
      <NoData @upPageData="upPageData" />
    </div>
    <!-- 完整对话 -->
    <WholeBox ref="wholebox" />
    <!-- 添加自选 -->
    <modal :show.sync="addTrack" modalClasses="add-track-box">
      <div class="add-track">
        <div class="add-title">
          <p>
            <span class="iconfont icon-tianjia_add"></span>
            添加自选
          </p>
          <p class="search-add">
            <span class="iconfont icon-sousuo_search"></span>
            <input type="text" placeholder="请输入" v-model="searchTrack" />
          </p>
        </div>
        <div class="add-lsit" v-loading="loadTrack">
          <ul v-if="isSearchResult">
            <li v-for="(i, a) in trackOther" :key="a">
              <div class="add-pro-msg">
                <img :src="i.logo" alt="" />
                <div class="pro-msg-title">
                  <p class="text-overflow">{{ i.title }} ({{ i.symbol }})</p>
                  <p>
                    <span
                      v-if="app.account.is_information == 2 && i.free == 0"
                      class="is-vip"
                    >
                      VIP
                    </span>
                    <span v-for="race in i.race" :key="race.id">{{
                      race.name
                    }}</span>
                  </p>
                </div>
              </div>
              <div class="pro-oper">
                <p @click="addTrackEv(i.free, 1, i.id)" v-if="i.follow == 0">
                  <span class="iconfont icon-jia_plus"></span>
                </p>
                <p @click="addTrackEv(i.free, 0, i.id)" v-else>
                  <span class="iconfont icon-jian_minus"></span>
                </p>
              </div>
            </li>
          </ul>
          <p v-else class="no-data-two">没有找到你想要的</p>
        </div>
        <p class="close-btn">
          <base-button
            type="default"
            round
            @click="
              addTrack = false;
              $store.dispatch('upAccount');
            "
            >关闭</base-button
          >
        </p>
      </div>
    </modal>
    <!-- 会员专享 -->
    <NeedVIP ref="needvip" />
  </div>
</template>

<script>
import { BasePagination, Modal } from "@/components";
import { mapState } from "vuex";
import * as api from "@/request/api";
import { scrollBack } from "@/util/index";
export default {
  data() {
    return {
      swiperList: [], //项目自选列表
      swiperDis: null, //选项卡滚动
      swiperIndex: 1, //选项卡下标
      proIndex: 0, //当前选中项目
      tabsType: [], //选项卡列表
      disList: [], //数据列表
      typeIndex: 0, //选中数据类型
      isFixed: false, //是否吸顶
      wholeBox: false, //完整对话
      proID: 0, //选中项目ID
      typeID: 0, //选中类型ID
      searchVal: null, //搜索内容
      loadData: false, //loading
      isNeedPage: false, //是否需要分页器
      isHasData: true, //是否有数据
      total: 10, //总页数
      defaultPagination: 1, //当前页码
      addTrack: false,
      trackOther: [],
      searchTrack: null,
      loadTrack: false,
      isSearchResult: true, //我的自选 -》 是否有搜索结果
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  components: {
    BasePagination,
    Modal,
    WholeBox: (resolve) => require(["./coms/mine_bureau/whole_box"], resolve),
    NoData: (resolve) => require(["./coms/no_data"], resolve),
    NeedVIP: (resolve) => require(["./coms/mine_bureau/need_vip"], resolve),
  },
  created() {
    this.label();
    this.getOtherTrack();
  },
  mounted() {
    window.addEventListener("scroll", this.initHeight, true);
    this.$nextTick(() => {
      this.initSw();
    });
  },
  watch: {
    searchVal() {
      this.defaultPagination = 1;
      this.getDataList();
    },
    searchTrack() {
      this.getOtherTrack();
    },
    defaultPagination() {
      scrollBack();
      this.getDataList();
    },
  },
  methods: {
    initSw() {
      setTimeout(() => {
        this.swiperDis = new Swiper(".swiper-discord", {
          slidesPerView: "auto",
          spaceBetween: 8,
          pagination: {
            el: ".tabs-pro",
            clickable: true,
            type: "custom",
            renderCustom: (swiper, current, total) => {
              this.swiperIndex = current;
            },
          },
        });
      }, 400);
    },
    async label() {
      await this.getSwList();
      await this.getTabs();
      this.getDataList();
    },
    // 获取项目列表
    async getSwList() {
      const result = await api.trackPro({ limit: 500, follow: 1 });
      this.swiperList = result.data;
      if (result.data.length > 0) {
        this.proID = result.data[0].id;
      }
    },
    // 左滑
    leftArrow() {
      if (this.swiperIndex <= 1) {
        return;
      }
      this.swiperIndex--;
      this.swiperDis.slideToLoop(this.swiperIndex - 1, 300, false);
    },
    // 右滑
    rightArrow() {
      if (this.swiperIndex > 24) {
        return;
      }
      this.swiperIndex++;
      this.swiperDis.slideToLoop(this.swiperIndex - 1, 300, false);
    },
    //判断吸顶
    initHeight() {
      let el = document.querySelector(".open-alive");
      let scrollTop = el.getBoundingClientRect().top;
      this.isFixed = scrollTop <= 0 ? true : false;
    },
    // 获取选项卡
    async getTabs() {
      const result = await api.disTabs({ ipid: this.proID });
      this.tabsType = result;
      if (result.length <= 0) {
        return;
      }
      this.typeID = result[0].id;
    },
    //获取数据列表
    async getDataList() {
      this.loadData = true;
      const result = await api.disList({
        limit: 12,
        page: this.defaultPagination,
        ipid: this.proID,
        search: this.searchVal,
        type: this.typeID,
      });
      this.loadData = false;
      this.total = result.last_page;
      this.disList = result.data;
      this.disList.forEach((e) => {
        this.$set(e, "abs_translate", false);
      });
      result.last_page > 1
        ? (this.isNeedPage = true)
        : (this.isNeedPage = false);
      result.data.length == 0 && (this.isHasData = false);
      result.data.length > 0 && (this.isHasData = true);
    },
    //点赞
    async like(_id, _type) {
      const result = await api.likeOrUn({
        id: _id,
        like: _type,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.getDataList();
    },
    //附件来源
    viewOffical(_url) {
      window.open(_url);
    },
    //获取未自选
    async getOtherTrack() {
      this.loadTrack = true;
      const result = await api.trackPro({
        search: this.searchTrack,
        follow: 0,
        limit: 500,
      });
      this.loadTrack = false;
      this.trackOther = result.data;
      this.trackOther.length > 0
        ? (this.isSearchResult = true)
        : (this.isSearchResult = false);
    },
    //添加自选
    async addTrackEv(_is_free, _type, _id) {
      if (_is_free == 0 && this.app.account.is_information == 2) {
        this.$refs.needvip.needVIP = true;
        return;
      }
      const result = await api.addTrack({
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
        message: _type == 1 ? this.$t('notify.add_track') : this.$t('notify.move_track'),
      });
      await this.label();
      this.getOtherTrack();
      this.getDataList();
      this.initSw();
      this.$store.dispatch("upAccount");
    },
    async changePro(_id, _index) {
      this.disList = [];
      this.proIndex = _index;
      this.proID = _id;
      await this.getTabs();
      // if (this.tabsType.length > 0) {
      //   this.typeID = this.tabsType[0].id;
      //   this.isHasData = true;
      // }
      this.getDataList();
    },
    //更新页面信息
    upPageData() {
      setTimeout(() => {
        this.label();
        this.getOtherTrack();
        this.initSw();
      }, 200);
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.initHeight, true);
  },
};
</script>

<style lang="scss" scoped>
.has-fixed-dis {
  padding-top: 220px;
}
.fixed-box-dis {
  position: fixed;
  width: 83.5%;
  top: 64px;
  z-index: 1010;
  background: $mineBg;
}
.fixed-box-tabs {
  position: fixed !important;
  width: 83.5%;
  top: 190px;
  z-index: 1000;
  background: $mineBg;
  .fixed-mask {
    display: block !important;
  }
}
@media screen and (min-width: 2000px) {
  .fixed-box-dis {
    width: 84.5% !important;
  }
  .fixed-box-tabs {
    width: 84.5% !important;
  }
}
.bureau-discord {
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
  .no-data-track {
    flex: 1;
  }
  .tabs-pro {
    display: flex;
    height: 108px;
    margin-top: 16px;
    .left-arrow {
      width: 24px;
      height: 100%;
      margin-right: 8px;
      background: $conBg2;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      cursor: pointer;
      .iconfont {
        font-size: 20px;
        color: $remarkColor;
      }
    }
    .swiper-list {
      flex: 1;
      height: 100%;
      overflow: hidden;
      cursor: pointer;
      .swiper-container {
        height: 100%;
      }
      .swiper-slide {
        width: 100px;
        height: 100%;
        background: $contentBg;
        transition: 0.3s all;
        border-radius: 4px;
        display: flex;
        align-items: center;
        font-size: 18px;
        flex-direction: column;
        color: white;
        padding-top: 16px;
        p:first-child {
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }
        p:nth-child(2) {
          font-size: 12px;
          color: white;
          margin: 10px 0;
        }
        p:last-child {
          font-size: 10px;
          color: #93b5f5;
        }
      }
      .add-last {
        display: flex;
        justify-content: center;
        align-items: center;
        background: $conBg2;
        padding: 0;
        .iconfont {
          font-size: 40px;
          color: $remarkColor;
        }
      }
      .tabs-active {
        background: #8a3ffc;
      }
    }
    .right-oper {
      width: 132px;
      margin-left: 8px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      .add-pro {
        width: 100px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $conBg2;
        border-radius: 4px;
        .iconfont {
          font-size: 40px;
          color: $remarkColor;
        }
      }
      .right-arrow {
        width: 24px;
        height: 100%;
        background: $conBg2;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        .iconfont {
          font-size: 20px;
          color: $remarkColor;
          border-radius: 4px;
        }
      }
    }
  }
  .tabs-type {
    position: relative;
    display: flex;
    align-items: flex-end;
    .fixed-mask {
      position: absolute;
      width: 100%;
      height: 150px;
      background: $mineBg;
      left: 0;
      top: -42px;
      z-index: 100;
      display: none;
    }
    .tabs-remark {
      width: 124px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      height: 48px;
      background: url("../../assets/images/discord_icon.png");
      background-size: 100% 100%;
      font-size: 14px;
      color: $textColor;
      font-weight: bold;
      position: relative;
      z-index: 200;
    }
    .tabs-inner {
      flex: 1;
      position: relative;
      z-index: 200;
      display: flex;
      width: 100%;
      height: 48px;
      background: $contentBg;
      padding: 0 24px;
      border-radius: 0 4px 4px 0;
      justify-content: space-between;
      align-items: center;
      margin-top: 44px;
    }
    ul {
      display: flex;
      height: 100%;
      li {
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        margin-right: 24px;
        color: $remarkColor;
        transition: 0.3s all;
        cursor: pointer;
        .tabs-line {
          width: 0;
          height: 3px;
          background: $success;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -12px;
          display: inline-block;
          transition: 0.3s all;
        }
      }
      .type-active {
        color: $success;
        .tabs-line {
          width: 24px;
        }
      }
    }
    .search-box {
      position: relative;
      .iconfont {
        position: absolute;
        font-size: 16px;
        left: 10px;
        top: 5px;
        color: $textColor;
      }
      input {
        width: 160px;
        height: 28px;
        border-radius: 18px;
        background: $conBg2;
        color: white;
        font-size: 12px;
        box-sizing: border-box;
        padding-left: 30px;
      }
    }
  }
  .data-list {
    margin-top: 16px;
    ul {
      li {
        padding: 24px;
        border-radius: 4px;
        background: $contentBg;
        margin-bottom: 16px;
        display: flex;
        .icon-box {
          width: 48px;
          margin-right: 16px;
          img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }
        }
        .msg-box {
          flex: 1;
          .msg-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title-msg {
              padding-top: 4px;
              p:first-child {
                color: white;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 8px;
              }
              p:last-child {
                font-size: 13px;
                color: $success;
                span {
                  font-size: 12px;
                  margin-left: 16px;
                  color: $remarkColor;
                }
              }
            }
            .oper-box {
              display: flex;
              .iconfont {
                font-size: 24px;
                color: $remarkColor;
                cursor: pointer;
                font-weight: 400;
              }
              .iconfont:hover {
                color: white;
              }
              .whole-btn {
                display: flex;
                align-items: center;
                .bet-line {
                  width: 1px;
                  height: 16px;
                  background: $lineTwoColor;
                  margin-left: 16px;
                }
              }
              .like-and-un {
                display: flex;
                align-items: center;
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
                p {
                  display: flex;
                  align-items: center;
                  font-size: 13px;
                  color: $textColor;
                  font-weight: bold;
                  span {
                    margin-right: 8px;
                  }
                }
                p:first-child {
                  margin-left: 16px;
                }
                p:last-child {
                  margin-left: 24px;
                }
              }
            }
          }
          .con-bot {
            margin-top: 28px;
            color: $remarkColor;
            .con-text {
              font-size: 12px;
              line-height: 22px;
            }
            .ang-box {
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
          }
        }
      }
      li:last-child {
        border: 0;
      }
    }
  }
}
.add-track {
  padding: 24px 24px 32px 24px;
  /deep/ .el-loading-spinner .path {
    stroke: $contentBg;
  }
  .add-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    p {
      .iconfont {
        font-size: 20px;
        color: $titleColor;
        margin-right: 8px;
        font-weight: 400;
        display: inline-block;
        transform: translateY(1px);
      }
      font-size: 17px;
      font-weight: bold;
      color: $titleColor;
    }
    .search-add {
      width: 160px;
      height: 28px;
      position: relative;
      .iconfont {
        font-size: 16px;
        position: absolute;
        top: 2px;
        left: 12px;
        color: $remarkColor;
      }
      input {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-size: 12px;
        border-radius: 18px;
        background: white;
        border: 1px solid $textColor;
        color: $titleColor;
        padding-left: 34px;
      }
    }
  }
  .add-lsit {
    width: 101%;
    min-height: 300px;
    ul {
      display: flex;
      flex-wrap: wrap;
      max-height: 400px;
      overflow-y: auto;
      li {
        width: 340px;
        margin-right: 16px;
        height: 74px;
        padding: 24px;
        background: #f3f4fa;
        margin-bottom: 16px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .add-pro-msg {
          display: flex;
          height: 40px;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 16px;
            background: white;
          }
          .pro-msg-title {
            display: flex;
            flex-direction: column;
            p {
              color: #676c7a;
            }
            p:first-child {
              font-size: 13px;
              font-weight: bold;
            }
            p:last-child {
              font-size: 12px;
              display: flex;
              .is-vip {
                background: linear-gradient(90deg, #ffac33 0%, #ffd45c 100%);
                font-weight: bold;
                color: $titleColor;
                margin-right: 8px;
              }
              span {
                display: inline-block;
                height: 20px;
                line-height: 20px;
                padding: 0 8px;
                color: #00cc8f;
                border-radius: 4px;
                margin-right: 4px;
                background: rgba(0, 204, 143, 0.1);
              }
            }
          }
        }
        .pro-oper {
          p {
            width: 24px;
            height: 24px;
            background: $textColor;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .iconfont {
              font-size: 20px;
              color: #676c7a;
            }
          }
        }
      }
      li:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
  .close-btn {
    width: 100%;
    margin-top: 24px;
    text-align: center;
  }
}
@media screen and (max-width: 1279px) {
  .bureau-discord {
    .title-box {
      display: none;
    }
    .tabs-pro {
      display: none;
    }
    .tabs-type {
      margin-top: $padd24;
      .tabs-remark{
        width: 4.6rem;
        padding-left: 1rem;
      }
      .tabs-inner {
        margin-top: 0;
        .search-box {
          display: none;
        }
      }
    }
  }
}
</style>
