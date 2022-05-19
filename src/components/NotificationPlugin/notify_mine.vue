<template>
  <div
    @click="tryClose"
    data-notify="container"
    class="alert open bottom right"
    role="alert"
    :style="customPosition"
    data-notify-position="bottom-center"
  >
    <div class="clear-all">
      <p>
        <span>
          <i class="iconfont icon-qingchu_clear"></i>
        </span>
        <!-- 一键忽略 -->
        {{$t('public.forget')}}
      </p>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "notification",
  components: {
    contentRender: {
      props: ["component"],
      render: (h) => h(this.component),
    },
  },
  props: {
    message: String,
    title: String,
    icon: String,
    type: {
      type: String,
      default: "info",
      validator: (value) => {
        let acceptedValues = [
          "info",
          "primary",
          "danger",
          "warning",
          "success",
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    timeout: {
      type: Number,
      default: 5000,
      validator: (value) => {
        return value >= 0;
      },
    },
    timestamp: {
      type: Date,
      default: () => new Date(),
    },
    component: {
      type: [Object, Function],
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    closeOnClick: {
      type: Boolean,
      default: true,
    },
    clickHandler: Function,
  },
  data() {
    return {
      elmHeight: 0,
    };
  },
  computed: {
    ...mapState(["app"]),
    upNotifyHeight() {
      return this.app.notifyHeight;
    },
    hasIcon() {
      return this.icon && this.icon.length > 0;
    },
    alertType() {
      return `alert-${this.type}`;
    },
    customPosition() {
      let initialMargin = 20;
      let alertHeight = this.elmHeight + 10;
      let sameAlerts = this.$notifications.state.filter((alert) => {
        return (
          alert.horizontalAlign === this.horizontalAlign &&
          alert.verticalAlign === this.verticalAlign
        );
      });
      let sameAlertsCount = 1;
      let currentIndex = sameAlerts.findIndex(
        (n) => n.timestamp === this.timestamp
      );
      if (this.$notifications.settings.overlap) {
        sameAlertsCount = 1;
      }
      if (currentIndex !== -1) {
        sameAlertsCount = currentIndex + 1;
      }
      let pixels = (sameAlertsCount - 1) * alertHeight + initialMargin;
      let styles = {};
      if (this.verticalAlign === "top") {
        styles.top = `${pixels}px`;
      } else {
        styles.bottom = `${pixels}px`;
      }
      return styles;
    },
  },
  methods: {
    close() {
      this.$emit("close", this.timestamp);
    },
    tryClose(evt) {
      if (this.clickHandler) {
        this.clickHandler(evt, this);
      }
      if (this.closeOnClick) {
        this.close();
      }
    },
  },
  mounted() {
    this.elmHeight = this.$el.clientHeight;
    if (this.timeout) {
      setTimeout(this.close, this.timeout);
    }
  },
};
</script>
<style lang="scss">
.notifications .alert {
  position: fixed;
  z-index: 9999;
  @media screen and (min-width: 1201px) {
    &[data-notify="container"] {
      width: 420px;
    }
  }
  @media screen and (max-width: 1200px) {
    &[data-notify="container"] {
      width: 80%;
    }
  }
  &.center {
    margin: 0 auto;
  }
  &.left {
    left: 20px;
  }
  &.right {
    right: 20px;
  }
}
.high-height {
  min-height: 80px;
  display: flex;
  align-items: center;
}
.clear-all {
  width: 110%;
  margin-left: -5%;
  border-radius: 4px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  p {
    height: 44px;
    padding-left: 6px;
    padding-right: 16px;
    border-radius: 22px;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.06);
    background: linear-gradient(90deg, #6274a3 0%, #405280 100%);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: white;
    span {
      display: flex;
      width: 36px;
      height: 36px;
      margin-right: 8px;
      background: $info;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      i {
        font-size: 20px;
        color: white;
      }
    }
  }
}
</style>
