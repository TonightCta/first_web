<template>
  <div class="notifications">
    <transition-group :name="transitionName" :mode="transitionMode">
      <!-- notifications2.length > 0 && $flag && app.isNeglect == 1 -->
      <span
        v-if="notifications2.length > 0 && !$flag && app.isNeglect == 1"
        :key="notifications[0].timestamp.getTime()"
        @click="closeAll"
      >
        <Notification2
          v-for="notification in notifications"
          v-bind="notification"
          :clickHandler="notification.onClick"
          :key="notification.timestamp.getTime()"
          @close="removeNotification"
        >
        </Notification2>
      </span>
      <Notification
        v-for="notification in notifications2"
        v-bind="notification"
        :clickHandler="notification.onClick"
        :key="notification.timestamp.getTime()"
        @close="removeNotification"
      >
      </Notification>
    </transition-group>
  </div>
</template>
<script>
import Notification from "./Notification.vue";
import Notification2 from "./notify_mine.vue";
import { clearNotify } from "./index";
import { mapState } from "vuex";
import { readMessage } from "@/request/api";
export default {
  components: {
    Notification,
    Notification2,
  },
  props: {
    transitionName: {
      type: String,
      default: "list",
    },
    transitionMode: {
      type: String,
      default: "in-out",
    },
    overlap: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["app"]),
  },
  data() {
    return {
      notifications: [
        {
          closeOnClick: false,
          horizontalAlign: "right",
          message: "test-2",
          order: "reverse",
          overlap: false,
          showClose: false,
          timeout: 100000000000000,
          type: "success",
          timestamp: new Date(),
          verticalAlign: "top",
        },
      ],
      notifications2: this.$notifications.state,
    };
  },
  methods: {
    async closeAll() {
      await readMessage();
      this.$store.commit("UpIsNeglect", 0);
      clearNotify();
    },
    removeNotification(timestamp) {
      this.$notifications.removeNotification(timestamp);
    },
  },
  created() {
    this.$notifications.settings.overlap = this.overlap;
  },
  watch: {
    overlap: function (newVal) {
      this.$notifications.settings.overlap = newVal;
    },
  },
};
</script>
<style lang="scss">
.notifications {
  position: relative;
  z-index: 9999;
  .list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .list-item {
    display: inline-block;
  }
  .list-enter-active {
    transition: transform 0.2s ease-in, opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition: transform 1s ease-out, opacity 0.4s ease-out;
  }
  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }
}
</style>
