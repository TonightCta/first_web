<template>
  <!-- 赛道解析 -->
  <div
    class="race-tent"
    @click="
      data.permission == 1
        ? goPDF($flag ? data.mobile_pdf : data.pdf, 4, data.id)
        : null
    "
  >
    <div class="race-msg">
      <div class="title-msg">
        <p class="h4">{{ data.title }}</p>
        <p class="h5">{{ data.publish_time }}</p>
      </div>
      <div style="display: flex">
        <div
          class="icon-box"
          v-for="(gem, indexM) in data.gem_info"
          :key="'gem' + indexM"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="gem.title"
            placement="top"
          >
            <div>
              <!-- <div class="mask-box"></div> -->
              <img :src="gem.logo" alt="" />
              <div class="gem-box"></div>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <p class="race-content">
      {{ data.content }}
    </p>
    <div class="tools-box">
      <div class="img-box">
        <p v-for="(gem, indexG) in data.gem_info" :key="'gemL' + indexG">
          <img :src="gem.logo" alt="" />
        </p>
        <p v-for="(gem, indexG) in data.project_info" :key="'proL' + indexG">
          <img :src="gem.logo" alt="" />
        </p>
      </div>
      <div class="btn-box">
        <el-popover placement="bottom" min-width="105" trigger="hover">
          <ul class="view-choice">
            <li @click="goPDF($flag ? data.mobile_pdf : data.pdf, 4, data.id)">
              <!-- 查看研报 -->
              {{ $t("project_info.view_reports") }}
            </li>
            <li></li>
            <li @click="downPDF(data.pdf, 4, data.id)">
              <!-- 下载研报 -->
              {{ $t("project_info.down_load") }}
            </li>
          </ul>
          <!-- @click="goPDF($flag ? data.mobile_pdf : data.pdf, 1, data.id)" -->
          <base-button type="default" slot="reference" round>{{
            $t("public.read")
          }}</base-button>
        </el-popover>
      </div>
    </div>
    <!-- 无权限 -->
    <NoPermission v-if="data.permission == 0" />
  </div>
</template>

<script>
export default {
  name: "RaceComs",
  props: ["data"],
  components: {
    NoPermission: (resolve) => require(["./no_permission"], resolve),
  },
  methods: {
    //查看PDF
    goPDF(_url, _type, _id) {
      this.$store.dispatch("setPoint", 10);
      this.$store.dispatch("readPDF", { _type: _type, _id: _id });
      !this.$flag
        ? this.$store.dispatch("viewPDF", _url)
        : this.$cell
        ? this.$store.dispatch("viewPDF", _url)
        : window.viewPDF(_url);
    },
    //下载研报
    downPDF(_url, _type, _id) {
      window.PDFLock(_type, _id, this.$flag ? 2 : 1, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.race-tent {
  padding: 24px;
  background: $contentBg;
  border-radius: 4px;
  margin-bottom: 24px;
  // max-width: 415px;
  position: relative;
  overflow: hidden;
  .race-msg {
    height: 48px;
    display: flex;
    justify-content: space-between;

    .title-msg {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .h4 {
        color: $success;
        margin: 0;
      }

      .h5 {
        color: $textColor;
        margin: 0;
      }
    }

    .icon-box {
      position: relative;
      width: 48px;
      height: 48px;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
      }
      .mask-box {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("../../../assets/images/gemBg.png");
        background-size: 100% 100%;
      }

      .gem-box {
        position: absolute;
        width: 32px;
        height: 14px;
        background: url("../../../assets/images/gemText.png");
        background-size: 100% 100%;
        left: 50%;
        margin-left: -16px;
        bottom: -8px;
        border-radius: 2px;
      }
    }

    .icon-box:last-child {
      margin-right: 0;
    }
  }

  .race-content {
    margin: 40px 0;
    line-height: 24px;
    font-size: 12px;
    color: $remarkColor;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    min-height: 72px;
  }

  .tools-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .img-box {
      display: flex;
      p {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: $contentBg;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: -4px;
        position: relative;

        img {
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
        }
      }

      p:first-child {
        margin-left: 0;
        z-index: 100;
      }

      p:nth-child(2) {
        z-index: 99;
      }

      p:nth-child(3) {
        z-index: 98;
      }

      p:nth-child(4) {
        z-index: 97;
      }

      p:nth-child(5) {
        z-index: 96;
      }

      p:nth-child(6) {
        z-index: 95;
      }

      p:nth-child(7) {
        z-index: 94;
      }

      p:nth-child(8) {
        z-index: 93;
      }
    }
  }
}
@media screen and (min-width: 1280px) {
  .mobile-btn {
    display: none !important;
  }
}
@media screen and (max-width: 1600px) {
  .race-tent {
    max-width: none;
  }
}
@media screen and (max-width: 1279px) {
  .race-tent {
    padding: 1rem;
    margin-bottom: 1rem;
    .race-msg {
      .title-msg {
        .h4 {
          font-size: 1rem;
        }
        .h5 {
          font-size: $fon12;
        }
      }
      .icon-box {
        width: $size48;
        height: $size48;
        .gem-box {
          width: 2rem;
          height: $fon14;
        }
      }
    }
    .race-content {
      font-size: $fon12;
      margin: $padd40 0;
    }
    .tools-box {
      .img-box {
        p {
          img {
            width: $padd24;
            height: $padd24;
          }
        }
      }
      .btn-box {
        .pc-btn {
          display: none;
        }
      }
    }
  }
}
</style>