// 自选项目详情
<template>
  <div class="track-details">
    <div class="track-inner-search" v-if="$flag">
      <p class="search-box">
        <span class="iconfont icon-sousuo_search"></span>
        <input
          type="text"
          :placeholder="$t('public.pls_inp')"
          v-model="innerSearch"
        />
      </p>
    </div>
    <div class="track-msg">
      <div class="msg-box">
        <div class="icon-and-title">
          <div class="icon-box">
            <img :src="details.logo" alt="" />
          </div>
          <div class="title-box">
            <p>{{ details.title }} ({{ details.symbol }})</p>
            <p>
              {{ app.language == "en" ? details.desc_en : details.desc }}
            </p>
          </div>
        </div>
        <!-- 价格信息 -->
        <div class="price-box" v-if="details.is_tokens == 1">
          <div class="inner-line"></div>
          <div class="inner">
            <p>
              ${{ details.price
              }}<span
                :style="{
                  color:
                    details.price_change_percentage > 0 ? '#a7f0ba' : '#ff6666',
                }"
              >
                {{ details.price_change_percentage > 0 ? "+" : ""
                }}{{ details.price_change_percentage }}%</span
              >
            </p>
            <p>
              <!-- 价格 -->
              {{ $t("place_order.msg_amount") }}
              (24h)
            </p>
          </div>
          <div class="inner">
            <p>${{ details.market_cap }}</p>
            <p>
              <!-- 流通市值 -->
              {{ $t("project_interface.cap_trade") }}
            </p>
          </div>
        </div>
        <!-- 操作 -->
      </div>
      <div class="oper-box" :class="app.language == 'en' && 'oper-box-en'">
        <base-button
          type="default"
          v-if="details.is_follow == 0"
          @click="followOper(1, details.id)"
        >
          <span><i class="iconfont icon-jia_plus"></i></span>
          <!-- 添加自选 -->
          {{ $t("bureau_mine.add_track") }}
        </base-button>
        <base-button type="default" v-else @click="followOper(0, details.id)">
          <span><i class="iconfont icon-jianshao_reduce"></i></span>
          <!-- 取消自选 -->
          {{ $t("bureau_track.cancel_track") }}
        </base-button>
      </div>
    </div>
    <!-- 移动端项目信息 -->
    <div class="mobile-track-msg" v-if="$flag">
      <div
        class="mobile-track-inner"
        :class="!details.price_change_percentage && 'reduce-height'"
      >
        <div>
          <!-- 项目图标 -->
          <div class="mobile-track-icon">
            <p>
              <img :src="details.logo" alt="" />
            </p>
            <p>
              <base-button
                type="default"
                v-if="details.is_follow == 0"
                @click="followOper(1, details.id)"
              >
                <span><i class="iconfont icon-jia_plus"></i></span>
                <!-- 添加自选 -->
                {{ $t("bureau_mine.add_track") }}
              </base-button>
              <base-button
                type="default"
                v-else
                @click="followOper(0, details.id)"
              >
                <span><i class="iconfont icon-jianshao_reduce"></i></span>
                <!-- 取消自选 -->
                {{ $t("bureau_track.cancel_track") }}
              </base-button>
            </p>
          </div>
          <!-- 标题信息 -->
          <p class="mobile-track-title">
            {{ details.title }} ({{ details.symbol }})
          </p>
          <p class="mobile-track-desc">
            {{ app.language == "en" ? details.desc_en : details.desc }}
          </p>
        </div>
        <div class="mobile-track-price" v-if="details.price_change_percentage">
          <div class="inner">
            <p>
              ${{ details.price
              }}<span
                :style="{
                  color:
                    details.price_change_percentage > 0 ? '#a7f0ba' : '#ff6666',
                }"
              >
                {{ details.price_change_percentage > 0 ? "+" : ""
                }}{{
                  details.price_change_percentage
                    ? details.price_change_percentage
                    : "-"
                }}%</span
              >
            </p>
            <p>
              <!-- 价格 -->
              {{ $t("place_order.msg_amount") }}
              (24h)
            </p>
          </div>
          <div class="inner">
            <p>${{ details.market_cap ? details.market_cap : "-" }}</p>
            <p>
              <!-- 流通市值 -->
              {{ $t("project_interface.cap_trade") }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Intellgence :defin="details.price_change_percentage" ref="intel" />
    <!-- 会员专享 -->
    <!-- <NeedVIP ref="needvip" /> -->

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
        :title="
          dateType == 1
            ? $t('bureau_posal.start_time')
            : $t('bureau_posal.start_end')
        "
        @confirm="selectedDate"
        @cancel="closePicker"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { trackDetails, addTrack } from "@/request/api";
export default {
  data() {
    return {
      details: {},
      checked: false,
      innerSearch: null,
      mobileStartDate: null, //移动端筛选 - 开始时间
      mobileEndDate: null, //移动端筛选 - 结束时间
      dateType: 1, // 1 - 开始时间 && 2 - 结束时间
      minDate: new Date(2017, 0, 1), //最小可选择时间
      maxDate: new Date(), //最大可选择时间
      currentDate: new Date(), //默认选择时间
      mobilePicker: false, //移动端时间选择器
    };
  },
  components: {
    Intellgence: (resolve) => require(["./coms/Intelligence_list"], resolve),
    // NeedVIP: (resolve) => require(["./coms/mine_bureau/need_vip"], resolve),
  },
  computed: {
    ...mapState(["app"]),
  },
  watch: {
    checked(_val) {
      this.$refs.intel.getProps(this.innerSearch, _val ? 1 : 0);
    },
    innerSearch(_val) {
      this.$refs.intel.getProps(_val, this.checked ? 1 : 0);
    },
  },
  created() {
    this.getDetails();
  },
  methods: {
    // 基本信息
    async getDetails() {
      const result = await trackDetails({ id: this.app.trackID });
      this.details = result;
    },
    //自选
    async followOper(_is_follow, _id) {
      const result = await addTrack({
        id: _id,
        follow: _is_follow,
      });
      if (result.code !== 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        return;
      }
      this.$notify({
        type: "success",
        // 添加自选成功 & 移除自选成功
        message:
          _is_follow == 0
            ? this.$t("notify.add_track")
            : this.$t("notify.move_track"),
      });
      this.getDetails();
    },
    //移动端选择时间
    selectedDate() {
      let newDate = new Date(this.currentDate);
      let year = newDate.getFullYear();
      let month = newDate.getMonth() + 1;
      month < 10 && (month = "0" + month);
      let chioceDate = `${year}-${month}`;
      this.$refs.intel.selectedDate(this.dateType, chioceDate);
      this.dateType == 1
        ? (this.mobileStartDate = chioceDate)
        : (this.mobileEndDate = chioceDate);
      this.mobilePicker = false;
    },
    //关闭时间选择器
    closePicker() {
      this.mobileStartDate = null;
      this.mobileEndDate = null;
      this.currentDate = new Date();
      this.mobilePicker = false;
      this.$refs.intel.closePicker();
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
  },
  beforeDestroy() {
    // this.$store.commit("upTrackID", null);
  },
};
</script>

<style lang="scss" scoped>
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
.inner {
  margin-right: 80px;
  p:first-child {
    font-size: 23px;
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
    span {
      font-size: 17px;
      color: $success;
      font-weight: 400;
    }
  }
  p:last-child {
    font-size: 13px;
    color: $remarkColor;
  }
}
.track-inner-search {
  padding: 1rem;
  background: $contentBg;
  .search-box {
    position: relative;
    .iconfont {
      position: absolute;
      font-size: 1rem;
      color: $textColor;
      left: $fon12;
      top: 0.5rem;
    }
    input {
      width: 100%;
      height: 2rem;
      color: white;
      background: $conBg2;
      border-radius: $fon18;
      font-size: 0.81rem;
      color: white;
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
.track-msg {
  width: 100%;
  height: 136px;
  display: flex;
  justify-content: space-between;
  background: url("../../assets/images/track_bg.png");
  background-size: 100% 100%;
  padding: 0 24px;
  align-items: center;
  margin-bottom: 24px;
  .msg-box {
    display: flex;
    width: 80%;
    .icon-and-title {
      display: flex;
      width: 50%;
      .icon-box {
        min-width: 72px;
        height: 72px;
        border-radius: 50%;
        background: white;
        padding: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 24px;
        img {
          width: 70px;
          height: 68px;
          border-radius: 50%;
        }
      }
      .title-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        p:first-child {
          font-size: 17px;
          font-weight: bold;
          color: white;
          margin-bottom: 8px;
        }
        p:last-child {
          width: 100%;
          font-size: 13px;
          color: $textColor;
          line-height: 18px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
    .price-box {
      flex: 1;
      display: flex;
      align-items: center;
      .inner-line {
        width: 1px;
        height: 76px;
        background: #353e66;
        margin: 0 24px;
      }
    }
  }

  .oper-box {
    button {
      width: 116px;
      height: 40px;
      font-size: 14px;
      padding: 0;
      background: $conBg2;
      font-weight: 400;
      span {
        width: 20px;
        height: 20px;
        background: #304270;
        border-radius: 4px;
        margin-right: 8px;
      }
    }
  }
  .oper-box-en {
    button {
      width: auto;
      padding:0 16px;
    }
  }
}
.mobile-track-msg {
  padding: 1rem;
  background: $mineBg;
  padding-bottom: 0;
  .mobile-track-inner {
    width: 100%;
    height: 18rem;
    background: url("../../assets/images/bureau/track_inner_bg.png");
    background-size: 100% 100%;
    border-radius: 4px;
    padding: $padd24 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .mobile-track-icon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p:first-child {
        width: $size48;
        height: $size48;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 50%;
        img {
          border-radius: 50%;
          width: 2.75rem;
          height: 2.75rem;
        }
      }
      p:last-child {
        button {
          background: $conBg2;
        }
      }
    }
    .mobile-track-title {
      margin-top: $padd24;
      font-size: $fon14;
      color: white;
      font-weight: bold;
    }
    .mobile-track-desc {
      margin-top: 0.5rem;
      line-height: $fon18;
      font-size: $fon12;
      color: $textColor;
      max-height: 5rem;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      line-clamp: 5;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
    .mobile-track-price {
      display: flex;
      .inner {
        margin-right: $padd40;
        p:first-child {
          font-size: 1.06rem;
          display: flex;
          align-items: center;
          span {
            font-size: 0.81rem;
            margin-left: 0.25rem;
          }
        }
        p:last-child {
          font-size: $fon12;
        }
      }
    }
  }
  .reduce-height {
    height: 14rem;
  }
}
@media screen and (max-width: 1279px) {
  .track-details {
    // padding-top: 7rem;
    // overflow-x: hidden;
  }
  .track-msg {
    display: none;
  }
}
</style>