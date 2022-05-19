// 全局搜索
<template>
  <div>
    <modal
      :show.sync="searchBox"
      modalClasses="search-box-modal other-modal"
      :showClose="false"
    >
      <div class="search-box">
        <input
          type="text"
          :placeholder="$t('public.search_holder')"
          v-model="searchVal"
          @keydown="searchEvent($event)"
          class="pc-search"
        />
        <input
          type="text"
          :placeholder="$t('search_all.pls_enter')"
          v-model="searchVal"
          @keydown="searchEvent($event)"
          class="mobile-search"
        />
        <!-- 输入关键字搜索 -->
        <p
          class="iconfont icon-guanbi_close close-dom"
          @click="
            searchBox = false;
            searchVal = '';
          "
        ></p>
        <p
          class="iconfont icon-sousuo_search search-dom"
          @click="searchEvent({ keyCode: 13 })"
        ></p>
        <div class="history-box" :class="openHistory">
          <ul>
            <li v-for="(i, index) in historyList" :key="index">
              <span @click="goSearchByHis(index)">{{ i }}</span>
              <span @click="deleteHistory(index)">
                <!-- 删除 -->
                {{ $t("public.del") }}
              </span>
            </li>
          </ul>
          <p class="h5" @click="clearHistory">
            <span class="iconfont icon-shanchu_delete-one"></span>
            <!-- 清除所有记录 -->
            {{ $t("public.del_all") }}
          </p>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
export default {
  data() {
    return {
      searchBox: false,
      searchVal: "", //搜索内容
      historyList: [], //历史搜索
      openHistory: "", //历史记录盒子动画
    };
  },
  components: {
    Modal,
  },
  watch: {
    searchBox(val) {
      if (val) {
        localStorage.setItem("openSearchBox", true);
        setTimeout(() => {
          this.historyList = JSON.parse(localStorage.getItem("historyList"));
          if (this.historyList.length != 0) {
            this.openHistory = "openHeight";
          }
        }, 100);
      } else {
        localStorage.removeItem("openSearchBox");
        this.searchVal = "";
        this.historyList = [];
        this.openHistory = "";
      }
    },
  },
  methods: {
    //键盘搜索事件
    searchEvent(_key_code) {
      if (_key_code.keyCode == 13) {
        const next = () => {
          let history = JSON.parse(localStorage.getItem("historyList")) || [];
          if (history.length == 5) {
            history.splice(history.length - 1, 1);
            history.unshift(this.searchVal);
          } else {
            if (history.indexOf(this.searchVal) < 0) {
              history.unshift(this.searchVal);
            }
          }
          localStorage.setItem("historyList", JSON.stringify(history));
          this.$store.commit("upSearchMsg", this.searchVal);
          this.$router.push(
            this.$route.path !== "/search" ? "/search" : "/searchBefore"
          );

          this.searchBox = false;
          this.searchVal = "";
        };
        this.searchVal != ""
          ? next()
          : this.$notify({
              //请输入您要搜索的内容
              message: this.$t("notify.pls_search"),
              type: "danger",
            });
      }
    },
    //通过历史记录搜索
    goSearchByHis(_index) {
      this.$store.commit("upSearchMsg", this.historyList[_index]);
      this.$router.push(
        this.$route.path !== "/search" ? "/search" : "/searchBefore"
      );
      this.searchBox = false;
      this.searchVal = "";
    },
    //删除当前历史记录
    deleteHistory(_index) {
      // console.log(this.historyList[_index]);
      const history = JSON.parse(localStorage.getItem("historyList"));
      history.splice(history.indexOf(this.historyList[_index]), 1);
      localStorage.setItem("historyList", JSON.stringify(history));
      this.historyList = JSON.parse(localStorage.getItem("historyList"));
      if (this.historyList.length == 0) {
        this.openHistory = "";
      }
    },
    //清除所有历史记录
    clearHistory() {
      localStorage.setItem("historyList", JSON.stringify([]));
      this.openHistory = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  margin-bottom: 12px;
  width: 100%;
  position: relative;
  input {
    width: 100%;
    font-size: 17px;
  }
  input::placeholder {
    color: $titleColor;
  }
  .close-dom {
    position: absolute;
    font-size: 16px;
    color: #555555;
    right: 12px;
    top: 3px;
    cursor: pointer;
  }
  .search-dom {
    position: absolute;
    font-size: 16px;
    color: #33b1ff;
    right: 50px;
    top: -1px;
    cursor: pointer;
    font-size: 21px;
  }
  .openHeight {
    height: auto !important;
    max-height: 284px;
    opacity: 1 !important;
    ul {
      max-height: 190px;
    }
  }
  .history-box {
    position: absolute;
    top: 78px;
    width: 650px;
    left: -24px;
    border-radius: 4px;
    background: white;
    box-sizing: border-box;
    padding: 24px;
    height: 0;
    overflow: hidden;
    transition: 0.3s all;
    opacity: 0;
    ul {
      li {
        line-height: 38px;
        color: $titleColor;
        font-size: 17px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        span:first-child {
          flex: 1;
        }
        span:last-child {
          font-size: 13px;
          color: #676c7a;
        }
      }
    }
    .h5 {
      position: static;
      text-align: center;
      margin-top: 26px;
      margin-bottom: 0;
      color: #676c7a;
      cursor: pointer;
      font-size: 13px;
      .iconfont {
        font-size: 14px;
      }
    }
  }
  @media screen and (max-width: 1279px) {
    .history-box {
      width: 100%;
      left: 0;
      top: 3.4rem;
      ul {
        li {
          font-size: $fon12;
        }
      }
    }
  }
}
@media screen and (max-width: 1279px) {
  .search-box {
    margin: 0.5rem 0;
    .pc-search {
      display: none !important;
    }
    .mobile-search {
      font-size: $fon12;
      padding-left: 1rem;
    }
    .iconfont {
      font-size: $fon18 !important;
      top: -2px !important;
    }
  }
}
@media screen and (min-width: 1280px) {
  .mobile-search {
    display: none !important;
  }
}
</style>