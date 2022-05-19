<template>
  <div>
    <!-- TODO -->
    <!-- 过滤合作 - 新 -->
    <div class="filter-box-new filter-box-new-pc">
      <!-- 标题信息 -->
      <div class="filter-box-new-inner">
        <p class="h5" @click="openFilterNew = !openFilterNew">
          <span class="iconfont icon-caidan"></span>
          <font>
            <!-- 筛选 -->
            {{ $t("project_info.filter") }}
          </font>
          <span
            class="iconfont icon-xia_down"
            :style="{
              transform: openFilterNew
                ? 'rotate(180deg) translateY(-2px)'
                : 'rotate(0) translateY(2px)',
            }"
          ></span>
        </p>
        <p class="choose-now" v-if="levelTwoText.length > 0">
          <span>
            {{ levelOneText }}<i class="iconfont icon-you_right"></i
            >{{ levelTwoText.join(",") }}
            <i class="iconfont icon-guanbi_close" @click="resetFilter()"></i>
          </span>
        </p>
        <div class="title-filter">
          <span>|</span>
          <el-checkbox v-model="attention" @change="attentionJS">
            <!-- 关注 -->
            {{ $t("public.follow") }}
          </el-checkbox>
          <el-checkbox v-model="unattention" @change="unattentionJS">
            <!-- 不关注 -->
            {{ $t("public.un_follow") }}
          </el-checkbox>
          <el-checkbox v-model="unCoin" @change="unCoinJS">
            <!-- 尚未发币 -->
            {{ $t("project_info.un_coin") }}
          </el-checkbox>
        </div>
      </div>

      <!-- 筛选条件盒子 -->
      <div
        class="filter-dom-new"
        :class="openFilterNew ? 'show-filter-new' : ''"
      >
        <!-- 一级赛道 -->
        <div class="level-one">
          <p class="level-title">
            <!-- 一级赛道 -->
            {{ $t("project_info.one_level") }}
          </p>
          <ul class="stop-click-ul" v-if="isChooseOne">
            <li
              class="stop-click"
              v-for="i in raceList"
              :key="i.id"
              @click="
                raceList = [];
                levelOneText = i.name;
                levelOneID = i.id;
                checkAll = true;
                getRaceList();
                isChooseOne = false;
              "
            >
              {{ i.name }}
            </li>
          </ul>
          <!-- 选中一级赛道 -->
          <p class="choose-one" v-else>{{ levelOneText }}</p>
        </div>
        <!-- 二级赛道 -->
        <div class="level-two">
          <p class="level-title">
            <!-- 二级赛道 -->
            {{ $t("project_info.two_level") }}
          </p>
          <p class="level-remark" v-if="isChooseOne">
            <!-- 请先选择一级赛道 -->
            {{ $t("public.pls_choice_race") }}
          </p>
          <p class="level-remark choose-two-level" v-else>
            <el-checkbox
              class="check-all"
              v-model="checkAll"
              @change="checkAllEvent"
            >
              <!-- 全选 -->
              {{ $t("public.chioce_all") }}
            </el-checkbox>
            <el-checkbox-group v-model="checkedRace">
              <el-checkbox
                v-for="(race, indexR) in raceList"
                :label="race.id"
                :key="indexR"
                @change="checkRace($event, indexR)"
                >{{ race.name }}</el-checkbox
              >
            </el-checkbox-group>
          </p>
        </div>
        <p class="level-line"></p>
        <div class="level-oper">
          <p
            class="reset-level"
            @click="
              raceList = [];
              checkedRace = [];
              levelTwoText = [];
              isChooseOne = true;
              levelOneID = null;
              getRaceList();
              getProList();
            "
          >
            <span class="iconfont icon-shuaxin_refresh"></span>
            <!-- 重置筛选 -->
            {{ $t("public.reset_filter") }}
          </p>
          <p>
            <base-button type="defalut" round @click="resetFilter()">
              <!-- 取消 -->
              {{ $t("public.cancel") }}
            </base-button>
            <span class="label"></span>
            <base-button type="info" round @click="subRaceFilter">
              <!-- 提交 -->
              {{ $t("public.submit") }}
            </base-button>
          </p>
        </div>
      </div>
    </div>
    <p class="choose-now choose-new-mobile" v-if="levelTwoText.length > 0">
      <span>
        {{ levelOneText }}<i class="iconfont icon-you_right"></i
        >{{ levelTwoText.join(",") }}
      </span>
      <i class="iconfont icon-guanbi_close" @click="resetFilter()"></i>
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>