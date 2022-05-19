// 情报审核
<template>
  <div class="b-admin">
    <!-- 筛选信息 -->
    <div class="b-filter-box">
      <div class="b-tabs-filter">
        <p class="admin-title">
          待审核
          <span>{{ allUnAudit }}</span>
        </p>
        <div class="tabs-inner">
          <van-dropdown-menu active-color="#a7f0ba" style="margin-right: 2rem">
            <van-dropdown-item
              v-model="comfirmPersonnel"
              @change="choicePersonnel"
              :options="personnelList"
            />
          </van-dropdown-menu>
          <van-dropdown-menu active-color="#a7f0ba">
            <van-dropdown-item
              v-model="comfirmDataType"
              @change="choiceType"
              :options="dataType"
            />
          </van-dropdown-menu>
        </div>
      </div>
      <div class="search-filter">
        <!-- 数据类型 -->
        <ul>
          <li
            :class="typeIndex == 999 && 'active-type'"
            @click="typeIndex = 999"
          >
            全部
            <span></span>
          </li>
          <li :class="typeIndex == 1 && 'active-type'" @click="typeIndex = 1">
            已发布
            <span></span>
          </li>
          <li :class="typeIndex == 0 && 'active-type'" @click="typeIndex = 0">
            待发布
            <span></span>
          </li>
        </ul>
        <!-- 搜索 -->
        <p>
          <span class="iconfont icon-sousuo_search"></span>
          <input type="text" placeholder="情输入搜索内容" v-model="searchVal" />
        </p>
      </div>
    </div>
    <div class="b-list" v-if="isHasData">
      <van-pull-refresh
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="reloadData"
      >
        <!-- v-infinite-scroll="loadMoreEv"
          infinite-scroll-immediate="false"
          infinite-scroll-disabled="disabled" -->
        <ul>
          <li v-for="(i, x) in BAList" :key="x">
            <p v-if="false">
              {{ i.happen_day }}&nbsp;&nbsp;{{ i.happen_time }}
            </p>
            <p v-if="false">{{ i.publish_time }}</p>
            <div class="title-and-logo">
              <img :src="i.logo" alt="" />
              <div class="title-inner">
                <div class="title-msg">
                  <p>{{ i.projectTitle }}</p>
                  <div class="type-msg">
                    <!-- 推特   v-if="i.type == 'twitter'"-->
                    <p>
                      <i
                        class="iconfont icon-qingbaoju_tuite"
                        style="color: #1d9bf0"
                        v-if="i.type == 1"
                      ></i>
                      <i
                        class="iconfont icon-lianwen"
                        style="color: #0257fe"
                        v-if="i.type == 4"
                      ></i>
                      <i
                        class="iconfont icon-luntan_topic"
                        v-if="i.type == 2"
                      ></i>
                      <i
                        class="iconfont icon-pinglun_comments"
                        v-if="i.type == 6"
                      ></i>
                    </p>
                    <p v-if="i.type == 1">
                      <span>{{ i.twitter_role }}</span>
                    </p>
                    <!-- 链闻 -->
                    <p v-if="i.type == 4">
                      作者<span>{{ i.author ? i.author : "链闻快讯" }}</span>
                    </p>
                    <!-- 论坛 -->
                    <p v-if="i.type == 2" class="type-remark">论坛</p>
                    <!-- 提案 -->
                    <p v-if="i.type == 6" class="type-remark">提案</p>
                  </div>
                </div>
              </div>
            </div>
            <p class="push-date">
              <!-- <span>{{ i.happen_day }}&nbsp;&nbsp;{{ i.happen_time }}</span> -->
              发布时间&nbsp;&nbsp;<span>{{ i.publish_time }}</span>
            </p>
            <div class="b-content">
              <div class="normal-content">
                <!-- <p>{{ i.abstract_zh }}</p> -->
                <div v-html="i.abstract_zh"></div>
              </div>
              <!-- && i.relation.length > 0 -->
              <div v-if="i.type == 1 && i.relation.length > 0">
                <div
                  class="normal-content twitter-other-content"
                  v-for="(x, y) in i.relation"
                  :key="y + 'red'"
                >
                  <span class="twitter-line"></span>
                  <!-- <p>{{  }}</p> -->
                  <div v-html="x.abstract_zh"></div>
                </div>
              </div>
            </div>
            <div class="oper-box">
              <p v-if="tabIndex == 0" @click="changeStatus(2, i.type, i.id)">
                <span class="iconfont icon-guanbi_close"></span>
                丢弃
              </p>
              <p
                v-if="tabIndex == 0 && i.status == 0"
                @click="changeStatus(1, i.type, i.id)"
              >
                <span class="iconfont icon-xiaoyan-xiao_check-small"></span>
                通过
              </p>
              <p
                v-if="tabIndex == 0"
                @click="
                  datePicker = true;
                  BAId = i.id;
                  BAType = i.type;
                "
              >
                <span class="iconfont icon-rili_calendar"></span>
                未来事件
              </p>
              <p v-if="tabIndex == 0" @click="changeStatus(3, i.type, i.id)">
                <span class="iconfont icon-bianji"></span>
                分析
              </p>
              <p
                v-if="tabIndex != 4"
                @click="
                  termBox = true;
                  BAId = i.id;
                "
              >
                <span class="iconfont icon-fanyi_translation"></span>
                添加术语
              </p>
              <p
                @click="
                  fullContent = true;
                  fullContentID = i.id;
                  getInfoContent();
                "
              >
                <span class="iconfont icon-shuji_book"></span>
                源文
              </p>

              <base-button
                type="info"
                round
                v-if="false"
                @click="changeStatus(0, i.type, i.id)"
                >撤销</base-button
              >
            </div>
            <p
              class="status-box"
              v-if="tabIndex == 1 || tabIndex == 2 || tabIndex == 3"
            >
              {{ tabIndex == 1 || tabIndex == 3 ? "已发布" : "待领取" }}
            </p>
          </li>
        </ul>
        <p
          v-if="loadMore"
          v-loading="loadMore"
          class="load-more-mine"
          element-loading-text="拼命加载中..."
          element-loading-spinner="el-icon-loading"
        ></p>
        <p v-if="noMore" class="no-more">没有更多了</p>
      </van-pull-refresh>
      <div class="page-tools" v-if="isNeedPage">
        <base-pagination
          :page-count="total"
          type="info"
          v-model="defaultPagination"
        ></base-pagination>
      </div>
    </div>
    <p class="no-data" v-else>暂无情报</p>
    <!-- 登陆 -->
    <van-popup
      v-model="showLogin"
      position="bottom"
      :close-on-click-overlay="false"
      :style="{ height: '45%' }"
    >
      <div class="login-b-box">
        <p>
          账号:
          <input type="text" placeholder="请输入账号" v-model="baAccount" />
        </p>
        <p>
          密码:
          <input type="password" placeholder="请输入密码" v-model="baPass" />
        </p>
        <p>
          <base-button
            type="info"
            round
            @click="subLogin"
            :loading="pendLogin"
            :disabled="pendLogin"
            >登录</base-button
          >
        </p>
      </div>
    </van-popup>
    <!-- 未来事件时间选择 -->
    <van-popup
      v-model="datePicker"
      position="bottom"
      :style="{ height: '45%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        @cancel="datePicker = false"
        @confirm="turnFuture"
        title="未来事件时间"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <!-- 完整文章 -->
    <van-popup v-model="fullContent" :style="{ width: '90%' }" round>
      <div class="full-content" v-loading="loadContent">
        <p
          class="iconfont icon-guanbi_close-one"
          @click="fullContent = false"
        ></p>
        <div v-html="fullContentText"></div>
      </div>
    </van-popup>
    <!-- 添加术语 -->
    <van-popup v-model="termBox" :style="{ width: '90%' }" round>
      <div class="add-term" v-loading="loadContent">
        <p>添加术语</p>
        <p>注意区分大小写，如List、list是两个单词</p>
        <p>
          <textarea
            placeholder="术语:dog,狗(换行)cat,猫 中英文用英文逗号隔开,词之间换行隔开"
            v-model="termCon"
          ></textarea>
        </p>
        <p>
          <base-button type="default" round @click="termBox = false"
            >取消</base-button
          >
          <base-button type="info" round @click="subTerm">确定</base-button>
        </p>
      </div>
    </van-popup>
    <!-- 通过类型 -->
    <van-popup v-model="gradeBox" :style="{ width: '90%' }" round>
      <div class="grade-box">
        <p>选择级别</p>
        <p>
          <base-button
            type="info"
            class="other-info"
            round
            @click="changeStatus(1, i.type, i.id, 1)"
            >精品</base-button
          >
          <span></span>
          <base-button
            type="default"
            round
            @click="changeStatus(1, i.type, i.id, 0)"
            >普通</base-button
          >
          <span></span>
          <base-button type="default" round @click="gradeBox = false">
            <i class="iconfont icon-fanhui_return"></i>
          </base-button>
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import * as api from "@/request/api";
import { BasePagination } from "@/components";
import { scrollInner } from "@/util/index";
import { InfiniteScroll } from "element-ui";
export default {
  directives: {
    "infinite-scroll": InfiniteScroll,
  },
  name: "BureauAdmin",
  data() {
    return {
      tabIndex: 0, //当前选中菜单
      tabsList: [
        //类型列表
        {
          title: "待审核",
          type: 0,
          id: 0,
          num: 0,
        },
        {
          title: "未来事件",
          type: 1,
          id: 4,
          status: "已发布",
          num: 0,
        },
        {
          title: "待分析",
          type: 2,
          id: 3,
          num: 0,
        },
        {
          title: "已通过",
          type: 3,
          id: 1,
          status: "待领取",
          num: 0,
        },
        {
          title: "已丢弃",
          type: 4,
          id: 2,
          status: "已发布",
          num: 0,
        },
      ],
      personnelList: [], //操作员列表
      tabID: 0, //当前选中菜单ID
      showLogin: false, //登录窗口
      token: null, //接口验证
      BAList: [], //数据列表
      loadData: false, //loading
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      datePicker: false, //日期选择
      BAId: null, //情报ID
      BAType: null, //情报类型
      total: 1, //总页码
      defaultPagination: 1, //默认页码
      isNeedPage: false, //是否需要分页器
      isHasData: true, //是否有数据
      fullContent: false, //完整文章
      fullContentText: null, //文章内容
      fullContentID: null, //内容ID
      baAccount: null, //管理员账号
      baPass: null, //管理员密码
      pendLogin: false, //按钮loading
      loadContent: false, //
      termBox: false, //添加术语
      dataType: [
        { text: "全部", value: 0 },
        { text: "推特", value: 1 },
        { text: "链闻", value: 4 },
        { text: "论坛", value: 2 },
        { text: "提案", value: 6 },
      ], //数据类型
      comfirmDataType: 0, //当前选中数据类型
      gradeBox: false, //选择级别
      isLoading: false, //上拉加载
      loadMore: false, //下拉加载
      dataTotal: 999,
      termCon: null,
      allUnAudit: null, //未审核
      comfirmPersonnel: 0,
      searchVal: null, //搜索
      typeIndex: 999, //数据类型选中
    };
  },
  components: {
    BasePagination,
  },
  watch: {
    defaultPagination() {
      this.getBList();
      scrollInner();
    },
    termBox(val) {
      !val && (this.termCon = null);
    },
    searchVal(val) {
      this.getBList();
    },
    typeIndex() {
      this.getBList();
    },
  },
  created() {
    // window.localStorage.clear()
    setInterval(() => {
      this.getBList();
      this.getBACount();
    }, 60000);
  },
  mounted() {
    if (!window.localStorage.getItem("buid")) {
      this.showLogin = true;
    } else {
      this.token = window.localStorage.getItem("buid");
      this.getBACount();
      this.getBList();
      this.getPersonnela();
    }
  },
  computed: {
    noMore() {
      return this.dataTotal == 0;
    },
    // 禁用滚动加载
    disabled() {
      return this.loadMore || this.noMore;
    },
  },
  methods: {
    //筛选数据
    choiceType(_val) {
      this.defaultPagination = 1;
      this.BAList = [];
      this.comfirmDataType = _val;
      this.getBList();
    },
    //操作员选择
    choicePersonnel(_val) {
      this.defaultPagination = 1;
      this.BAList = [];
      this.comfirmPersonnel = _val;
      this.getBList();
    },
    //下拉刷新
    async reloadData() {
      await this.getBList();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    // 上拉加载
    loadMoreEv() {
      this.defaultPagination += 1;
      this.loadMore = true;
      setTimeout(async () => {
        await this.getBList();
      }, 500);
    },
    //获取内容原文
    async getInfoContent() {
      this.loadContent = true;
      const result = await api.infoContent({
        token: this.token,
        id: this.fullContentID,
      });
      this.fullContentText = result.content;
      this.loadContent = false;
    },
    //获取操作人员列表
    async getPersonnela() {
      const result = await api.getPersonnel({
        token: this.token,
      });
      this.personnelList = result;

      this.personnelList = this.personnelList.map((e) => ({
        text: e.username,
        value: e.id,
      }));
      this.personnelList.unshift({
        text: "负责人",
        value: 0,
      });
    },
    //登录
    async subLogin() {
      if (!this.baAccount) {
        this.$notify({
          type: "danger",
          message: "请输入账号",
        });
        return;
      }
      if (!this.baPass) {
        this.$notify({
          type: "danger",
          message: "请输入密码",
        });
        return;
      }
      this.pendLogin = true;
      const result = await api.BALogin({
        username: this.baAccount,
        password: this.baPass,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        this.pendLogin = false;
        return;
      }
      this.pendLogin = false;
      this.showLogin = false;
      localStorage.setItem("buid", result.data.token);
      this.token = result.data.token;
      this.getBACount();
      this.getBList();
      this.getPersonnela();
    },
    // 数量统计
    async getBACount() {
      const result = await api.BATotal({
        token: this.token,
      });
      result.forEach((e) => {
        e.status == 0 && (this.allUnAudit = e.num);
      });
    },
    //列表数据
    async getBList() {
      this.loadData = true;
      const result = await api.BAList({
        token: this.token,
        page: this.defaultPagination,
        limit: 10,
        status: this.typeIndex,
        type: this.comfirmDataType,
        id: this.comfirmPersonnel,
        search: this.searchVal,
      });
      if (result.code == 7000) {
        localStorage.removeItem("buid");
        this.showLogin = true;
        this.loadData = false;
        return;
      }
      this.loadData = false;
      this.allUnAudit = result.total;
      this.BAList = result.data;
      this.total = result.last_page;
      this.loadMore = false;
      this.dataTotal = result.data.length;
      result.last_page > 1
        ? (this.isNeedPage = true)
        : (this.isNeedPage = false);
      this.BAList.length == 0 && (this.isHasData = false);
      this.BAList.length > 0 && (this.isHasData = true);
    },
    //列表状态修改
    async changeStatus(_status, _type, _id, _grade) {
      this.$mobileToast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      const result = await api.changeBA({
        token: this.token,
        status: _status,
        type: _type,
        id: _id,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        message: "更新状态成功",
      });
      this.$mobileToast.clear();
      this.getBACount();
      this.getBList();
    },
    //上传未来事件日期
    async turnFuture(val) {
      const result = await api.BAPushDate({
        token: this.token,
        type: this.BAType,
        id: this.BAId,
        happen_time: val,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        message: "更新状态成功",
      });
      this.datePicker = false;
      this.getBList();
    },
    //提交术语
    async subTerm() {
      if (!this.termCon) {
        this.$notify({ type: "danger", message: "请输入术语" });
        return;
      }
      const result = await api.addTerm({
        id: this.BAId,
        terminology: this.termCon,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: "格式错误",
        });
        return;
      }
      this.$notify({
        type: "success",
        message: "添加术语成功",
      });
      this.termBox = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-popup {
  z-index: 3000 !important;
}
.b-admin {
  padding: 0 $fon14;
  padding-bottom: 4rem;
  margin-top: 6.5rem;
}
.b-title {
  width: 100%;
  height: 3.4rem;
  line-height: 4rem;
  text-align: left;
  padding-left: 0.8rem;
  font-size: $fon18;
  position: fixed;
  top: 0;
  left: 0;
  background: $mineBg;
  z-index: 200;
  display: none;
}
.b-tabs {
  height: 3rem;
  width: 100%;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 3.4rem;
  left: 0;
  z-index: 6000;
  background: $mineBg;
  overflow-x: auto;
  ul {
    height: 100%;
    width: 140%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    .active-tabs {
      color: $success;
      .line {
        width: 30%;
      }
    }
    li {
      padding: 0 1rem;
      position: relative;
      font-size: $fon14;
      transition: 0.3s all;
      .line {
        position: absolute;
        height: 3px;
        display: inline-block;
        background-color: $success;
        bottom: -1rem;
        left: 25%;
        border-radius: 4px;
        width: 0;
        transition: 0.3s all;
      }
    }
  }
}
.b-tabs::-webkit-scrollbar {
  display: none;
}
.b-filter-box {
  height: 6.5rem;
  width: 100%;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 6000;
  background: $mineBg;
  overflow-x: auto;
  .search-filter {
    width: 90%;
    margin: 0 auto;
    display: flex;
    p:last-child {
      height: 100%;
      position: relative;
      width: 50%;
      input {
        width: 100%;
        height: 1.8rem;
        border-radius: $fon20;
        background: $conBg2;
        font-size: $fon12;
        box-sizing: border-box;
        padding-left: $size48;
      }
      .iconfont {
        position: absolute;
        font-size: 1rem;
        top: 0.4rem;
        left: 1rem;
      }
    }
    ul {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-around;
      li {
        position: relative;
        transition: 0.3s all;
        span {
          position: absolute;
          display: inline-block;
          width: 0;
          height: 2px;
          bottom: -0.5rem;
          left: 50%;
          margin-left: -35%;
          background: $success;
          transition: 0.3s all;
        }
      }
      .active-type {
        color: $success;
        span {
          width: 70%;
        }
      }
    }
  }
}
.b-tabs-filter {
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: $padd24;
  p {
    font-size: $fon18;
    color: $textColor;
    width: 5rem;
    padding-left: $padd24;
  }
  .admin-title {
    display: flex;
    width: initial;
    span {
      display: inline-block;
      padding: 0 8px;
      font-size: $fon12;
      background: rgba(255, 212, 92, 0.1);
      color: #ffd45c;
      border-radius: 4px;
      margin-left: 0.5rem;
      height: $fon18;
      line-height: $fon18;
    }
  }
  .tabs-inner {
    width: auto;
    display: flex;
    /deep/ .van-dropdown-menu__bar {
      background: rgba(0, 0, 0, 0);
      box-shadow: none;
      .van-ellipsis {
        color: $success;
      }
      .van-dropdown-menu__title::after {
        right: -10px;
        // margin-top: -4px;
      }
    }
    /deep/ .van-popup {
      background: $contentBg;
      .van-cell {
        background: rgba(0, 0, 0, 0);
        color: $remarkColor;
      }
      .van-cell::after {
        border-color: $lineTwoColor;
      }
    }
  }
}
.b-list {
  min-height: 10rem;
  ul {
    li {
      padding: $padd24 1rem;
      background-color: $contentBg;
      border-radius: 4px;
      margin-top: 1rem;
      position: relative;
      overflow: hidden;
      .status-box {
        font-size: $fon12;
        position: absolute;
        padding: 0.2rem 3rem;
        background: linear-gradient(180deg, #25b89b 0%, #0096ad 100%);
        color: white;
        transform: rotate(45deg);
        top: 1.5rem;
        right: -2rem;
      }
      // p:first-child {
      //   font-size: $fon14;
      //   color: white;
      //   margin-bottom: 1rem;
      // }
      // p:nth-child(2) {
      //   display: flex;
      //   align-items: center;
      //   height: $size48;
      //   img {
      //     width: $size48;
      //     height: $size48;
      //     border-radius: 50%;
      //   }
      //   span {
      //     margin-left: 0.5rem;
      //     font-size: $fon14;
      //     color: white;
      //   }
      // }
      .title-and-logo {
        display: flex;
        img {
          width: $padd40;
          height: $padd40;
          border-radius: 50%;
          margin-right: 1rem;
        }
        .title-inner {
          flex: 1;
          display: flex;
          .title-msg {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: space-between;
            .type-msg {
              display: flex;
              font-size: $fon12;
              align-items: center;
              .iconfont {
                font-size: 1rem;
                margin-right: 0.5rem;
              }
              .type-remark {
                font-size: $fon12;
                color: $remarkColor;
                display: flex;
                align-items: center;
              }
              span {
                font-size: $fon12;
                padding: 1px 8px;
                background: rgba(167, 240, 186, 0.1);
                color: $success;
                border-radius: 4px;
                display: inline-block;
                margin-left: 0.5rem;
                // transform: translateY(-1px);
              }
            }
          }
        }
      }
      .push-date {
        display: flex;
        align-items: flex-start;
        margin-top: 1rem;
        font-size: 0.81rem;
        span {
          font-size: $fon12;
          color: $textColor;
        }
      }
      .b-content {
        .normal-content {
          margin: 1rem auto;
          padding: 1rem;
          background: $conBg2;
          border-radius: 4px;
          max-height: 10rem;
          line-height: $padd24;
          overflow-y: auto;
          p {
            height: 100%;
            overflow-y: auto;
            word-break: break-all;
            max-height: 10rem;
            line-height: $padd24;
            text-align: justify;
          }
        }
        // .normal-content::-webkit-scrollbar {
        //   display: none;
        // }
        .twitter-other-content {
          position: relative;
          .twitter-line {
            display: inline-block;
            position: absolute;
            height: 1rem;
            width: 3px;
            background: $conBg2;
            top: -1rem;
            left: 1rem;
          }
        }
      }
      .oper-box {
        border-top: 1px solid $mineBg;
        padding-top: $padd24;
        display: flex;
        justify-content: space-between;
        p {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: $fon12;
          color: $remarkColor;
          .iconfont {
            font-size: $fon18;
            color: white;
            margin-bottom: 0.5rem;
          }
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
.login-b-box {
  padding-top: 4rem;
  p {
    color: $titleColor;
    text-align: center;
    margin-bottom: 1rem;
    input {
      border: 1px solid $textColor;
      border-radius: 4px;
      height: 2rem;
      width: 60%;
      padding-left: 0.5rem;
    }
    button {
      width: 50%;
    }
  }
}
.page-tools {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
.full-content {
  width: 100%;
  padding: 1rem;
  background: white;
  position: relative;
  padding-top: 3rem;
  padding-bottom: 2rem;
  overflow-y: auto;
  max-height: 70vh;
  .iconfont {
    text-align: right;
    font-size: 1.8rem;
    color: $conBg2;
    position: fixed;
    top: 1rem;
    right: 1rem;
  }
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
    font-size: 14px;
    line-height: $fon18;
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
  /deep/ img {
    margin: 16px 0;
  }
  // /deep/ h1 {
  //   color: $titleColor;
  // }
  // /deep/ h2 {
  //   color: $titleColor;
  // }
  // /deep/ h3 {
  //   color: $titleColor;
  // }
  // /deep/ h4 {
  //   color: $titleColor;
  // }
  // /deep/ h5 {
  //   color: $titleColor;
  // }
  // /deep/ strong {
  //   color: $titleColor;
  // }
  // /deep/ p {
  //   color: $titleColor;
  // }
  // /deep/ ul {
  //   li {
  //     color: $titleColor;
  //   }
  // }
}
.add-term {
  text-align: center;
  p {
    text-align: center;
  }
  textarea {
    width: 90%;
    height: 10rem;
    border: 1px solid $remarkColor;
    border-radius: 4px;
    margin-top: 1rem;
    resize: none;
    font-size: $fon14;
    box-sizing: border-box;
    padding: 1rem;
    color: $titleColor;
  }
  p:first-child {
    color: $titleColor;
    font-size: $fon14;
    font-weight: bold;
    margin-top: $padd24;
    margin-bottom: 0.5rem;
  }
  p:nth-child(2) {
    font-size: $fon12;
    color: $contentBg;
  }
  p:last-child {
    width: 70%;
    display: flex;
    justify-content: space-between;
    margin: 1rem auto;
  }
}
.grade-box {
  text-align: center;
  p:first-child {
    margin: $padd24 0;
    color: $titleColor;
    font-size: 1rem;
  }
  p:last-child {
    margin-bottom: $padd24;
    span {
      display: inline-block;
      width: $padd24;
    }
  }
}
</style>