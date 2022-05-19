// 移动端添加自选
<template>
  <div class="mine-track-mobile">
    <div
      class="mine-box"
      v-if="app.account.is_follow != 0"
      @click="
        app.account.is_follow == 0
          ? $router.push('/add-track')
          : (addTrackMobile = true);
        unSel();
        getMineTrack();
      "
    >
      <span class="iconfont icon-dingyue_rss"></span>
      <p>
        <!-- 我的自选 -->
        {{ $t("bureau_mine.own_track") }}
      </p>
    </div>
    <el-drawer
      :append-to-body="true"
      :visible.sync="addTrackMobile"
      :show-close="false"
      direction="rtl"
      size="75%"
    >
      <div class="mine-track-drawer">
        <p class="drawer-title">
          <span class="iconfont icon-dingyue_rss"></span>
          <!-- 我的自选 -->
          {{ $t("bureau_mine.own_track") }}
        </p>
        <div class="track-list" v-loading="loadData">
          <ul>
            <li
              v-for="(mineTrack, i) in trackMine"
              :key="i"
              @click="choicePro(mineTrack.id, i)"
              :class="activeIndex == i && 'active-pro'"
            >
              <p>
                <img :src="mineTrack.logo" alt="" />
                {{ mineTrack.title }}
                <span>{{ mineTrack.symbol }}</span>
              </p>
              <p @click="unFollow(mineTrack.id)">
                <span class="iconfont icon-jian_minus"></span>
              </p>
            </li>
          </ul>
        </div>

        <p
          class="drawer-oper"
          v-if="unSelected > 0"
          @click="
            $store.dispatch('setPoint', 19);
            addTrackMobile = false;
            $router.push('/add-track');
          "
        >
          <base-button type="info" class="other-info" round>
            <i class="iconfont icon-tianjia_add"></i>
            <!-- 添加自选 -->
            {{ $t("bureau_mine.add_track") }}
          </base-button>
        </p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import * as api from "@/request/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      addTrackMobile: false, //弹出框
      isHasData: true, //是否有数据
      loadData: false,
      trackMine: [], //我的自选
      unSelected: 999, //未选中数量
      activeIndex: 999, //当前选中项目
    };
  },
  created() {
    // this.getMineTrack();
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    //我的自选
    async getMineTrack() {
      this.loadData = true;
      const result = await api.trackPro({ limit: 500, follow: 1 });
      result.data.length > 0
        ? (this.isHasData = true)
        : (this.isHasData = false);
      this.loadData = false;
      this.trackMine = result.data;
    },
    //取消自选
    async unFollow(_id) {
      const result = await api.addTrack({
        id: _id,
        follow: 0,
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
        //移除自选成功
        message: this.$t("notify.move_track"),
      });
      this.unSel();
      this.getMineTrack();
      this.$store.dispatch("upAccount");
      this.activeIndex = 999;
      this.$emit("upPosalList", null);
    },
    async unSel() {
      const result = await api.trackCount();
      this.unSelected = result.notFollow;
    },
    //选中项目
    choicePro(_id, _index) {
      if (this.activeIndex == _index) {
        this.$emit("upPosalList", null);
        this.activeIndex = 999;
      } else {
        this.$emit("upPosalList", _id);
        this.activeIndex = _index;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-drawer {
  background: $contentBg;
  .el-drawer__header {
    display: none;
  }
}
.mine-box {
  position: fixed;
  right: 0;
  bottom: 5rem;
  padding: $fon12 1rem;
  background: $info;
  border-radius: 20px 0px 0px 20px;
  display: flex;
  align-items: center;
  .iconfont {
    font-size: 1rem;
    color: white;
    margin-right: 0.5rem;
  }
  p {
    font-size: 0.81rem;
    color: white;
  }
}
.mine-track-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: space-between;
  .drawer-title {
    width: 100%;
    height: 4.4rem;
    border-bottom: 1px solid $mineBg;
    padding-left: 1rem;
    display: flex;
    align-items: center;
    font-size: $fon14;
    color: white;
    .iconfont {
      font-size: $fon20;
      margin-right: 0.5rem;
    }
  }
  .track-list {
    flex: 1;
    padding: 1rem 0.5rem;
    ul {
      height: 100%;
      overflow-y: auto;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0.5rem;
        align-items: center;
        transition: 0.3s all;
        border-radius: 4px;
        p:first-child {
          display: flex;
          align-items: center;
          img {
            width: $padd24;
            height: $padd24;
            border-radius: 50%;
            margin-right: 0.5rem;
            background: white;
          }
          font-size: 0.81rem;
          color: white;
          font-weight: bold;
          span {
            margin-left: 0.5rem;
            font-size: $fon12;
            color: $remarkColor;
            font-weight: 400;
          }
        }
        p:last-child {
          width: 1rem;
          height: 1rem;
          border-radius: 4px;
          background: $conBg2;
          .iconfont {
            font-size: 1rem;
            color: white;
          }
        }
      }
      .active-pro {
        background: $conBg2;
      }
    }
  }

  .drawer-oper {
    height: 4rem;
    border-top: 1px solid $mineBg;
    padding: 0 $fon14;
    display: flex;
    align-items: center;
    button {
      width: 100%;
    }
  }
}
</style>