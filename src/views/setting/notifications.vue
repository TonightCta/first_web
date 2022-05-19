//通知管理
<template>
  <div class="notification-box">
    <div class="icon-box">
      <div class="icon-left">
        <!-- 图标 -->
        <div class="icon-img">
          <img
            :src="require('@/assets/images/setting/notification_icon.png')"
            alt=""
          />
        </div>
        <!-- 描述 -->
        <div class="icon-remark">
          <p>一键开关通知</p>
          <p>灵活开启或关闭短信、邮箱通知</p>
        </div>
      </div>
      <!-- 总开关 -->
      <div class="control-all">
        <el-switch
          @change="switchAll"
          v-model="allValue"
          active-color="#0F83FE"
          inactive-color="#25345c"
        >
        </el-switch>
      </div>
    </div>
    <!-- 移动端Title -->
    <div class="mobile-noti-title" v-if="$flag">
      <p>一键开关通知</p>
      <p>灵活开启或关闭短信、邮箱通知</p>
    </div>
    <!-- 控制盒子 -->
    <div class="control-box">
      <el-table :data="controlList" style="width: 100%">
        <el-table-column prop="name" label="项目" :width="$flag ? 130 : 380">
        </el-table-column>
        <el-table-column label="短信" header-align="right">
          <template slot-scope="{ row }">
            <div class="text-right" @click="switchOption(row, 'mobile')">
              <el-switch
                v-model="row.message"
                active-color="#0F83FE"
                inactive-color="#304270"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="邮件" header-align="right">
          <template slot-scope="{ row }">
            <div
              class="text-right"
              v-if="row.isHasEmeail"
              @click="switchOption(row, 'email')"
            >
              <el-switch
                v-model="row.email"
                active-color="#0F83FE"
                inactive-color="#304270"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="control-row">
        <p>一键开关</p>
        <p>
          <el-switch
            @change="switchAllType(controlAllMessage, 'mobile')"
            v-model="controlAllMessage"
            active-color="#0F83FE"
            inactive-color="#304270"
          >
          </el-switch>
        </p>
        <p>
          <el-switch
            @change="switchAllType(controlAllEmail, 'email')"
            v-model="controlAllEmail"
            active-color="#0F83FE"
            inactive-color="#304270"
          >
          </el-switch>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { NotificationManage, ChangeNotification } from "@/request/api";
import { BaseSwitch } from "@/components";
export default {
  data() {
    return {
      controlList: [
        {
          name: "发布项目研报提醒",
          type: "report",
          message: true,
          email: true,
          isHasEmeail: true,
        },
        {
          name: "发布重大事件提醒",
          type: "event",
          message: true,
          email: true,
          isHasEmeail: true,
        },
        {
          name: "发布新币速递",
          type: "coin",
          message: true,
          email: true,
          isHasEmeail: true,
        },
        {
          name: "发布赛道解析",
          message: true,
          type: "race",
          email: true,
          isHasEmeail: true,
        },
        {
          name: "项目状态变更",
          type: "follow_changes",
          message: true,
          email: true,
          isHasEmeail: false,
        },
      ],
      allValue: true, //总开关
      controlAllMessage: false, //短信开关
      controlAllEmail: false, //邮件开关
    };
  },
  components: {
    BaseSwitch,
  },
  created() {
    this.getNotStatus();
  },
  watch: {},
  methods: {
    //获取当前配置
    async getNotStatus() {
      const result = await NotificationManage();
      this.allValue = result.all == 1 ? true : false;
      this.controlAllMessage = result.mobile.all == 1 ? true : false;
      this.controlAllEmail = result.email.all == 1 ? true : false;
      this.$set(
        this.controlList[0],
        "message",
        result.mobile.report == 1 ? true : false
      );
      this.$set(
        this.controlList[0],
        "email",
        result.email.report == 1 ? true : false
      );
      this.$set(
        this.controlList[1],
        "message",
        result.mobile.event == 1 ? true : false
      );
      this.$set(
        this.controlList[1],
        "email",
        result.email.event == 1 ? true : false
      );
      this.$set(
        this.controlList[2],
        "message",
        result.mobile.coin == 1 ? true : false
      );
      this.$set(
        this.controlList[2],
        "email",
        result.email.coin == 1 ? true : false
      );
      this.$set(
        this.controlList[3],
        "message",
        result.mobile.race == 1 ? true : false
      );
      this.$set(
        this.controlList[3],
        "email",
        result.email.race == 1 ? true : false
      );
      this.$set(
        this.controlList[4],
        "message",
        result.mobile.follow_changes == 1 ? true : false
      );
      this.$set(
        this.controlList[4],
        "email",
        result.email.follow_changes == 1 ? true : false
      );
    },
    //一键关闭
    async switchAll(val) {
      const result = await ChangeNotification({
        remind_type: "all",
        field: "all",
        value: val ? 1 : 0,
      });
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        this.getNotStatus();
        return;
      }
      this.$notify({
        type: "success",
        message: "设置成功",
      });
      this.getNotStatus();
    },
    //短信通知配置
    async switchOption(_row, _type) {
      const params = {
        remind_type: _type,
        field: _row.type,
        value: _type == "email" ? (_row.email ? 1 : 0) : _row.message ? 1 : 0,
      };
      const result = await ChangeNotification(params);
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        this.getNotStatus();
        return;
      }
      this.$notify({
        type: "success",
        message: "设置成功",
      });
      this.getNotStatus();
    },
    //一键关闭
    async switchAllType(_val, _type) {
      const params = {
        remind_type: _type,
        field: "all",
        value: _val ? 1 : 0,
      };
      const result = await ChangeNotification(params);
      if (result.code != 2000) {
        this.$notify({
          type: "danger",
          message: result.msg,
        });
        this.getNotStatus();
        return;
      }
      this.$notify({
        type: "success",
        message: "设置成功",
      });
      this.getNotStatus();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table__body-wrapper {
  td {
    border: 0;
  }
}
/deep/ .el-table__header {
  margin-bottom: 0;
  border-bottom: 1px solid $lineTwoColor;
}
/deep/ .el-table__header-wrapper {
  .cell {
    font-weight: bold;
    font-size: 14px;
  }
}
.notification-box {
  .icon-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 72px;
    align-items: center;
    .icon-left {
      display: flex;
      align-items: center;
      .icon-img {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: $conBg2;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        img {
          width: 48px;
          height: 48px;
        }
      }
    }
    .icon-remark {
      p:first-child {
        font-size: 24px;
        color: $textColor;
        line-height: 30px;
        margin-bottom: 8px;
      }
      p:last-child {
        font-size: 13px;
        color: $remarkColor;
      }
    }
  }
  .control-box {
    margin-top: 16px;
    margin-left: 88px;
    padding: 24px;
    background: $conBg2;
    width: 600px;
    border-radius: 4px;
  }
  .control-row {
    padding: 0 10px;
    display: flex;
    border-top: 1px solid $lineTwoColor;
    margin-top: -6px;
    padding-top: 15px;
    align-items: center;
    p:first-child {
      font-size: 14px;
      color: $textColor;
      font-weight: bold;
      width: 380px;
    }
    p:nth-child(2) {
      padding-right: 3px;
    }
    p:nth-child(2),
    p:last-child {
      width: 86px;
      text-align: right;
    }
  }
}
@media screen and (max-width: 1279px) {
  .notification-box {
    .icon-box {
      height: $size48;
      .icon-left {
        .icon-img {
          width: $size48;
          height: $size48;
          img {
            width: $padd24;
            height: $padd24;
          }
        }
      }
    }
    .icon-remark {
      display: none;
    }
    .mobile-noti-title{
      margin-top: $padd24;
      margin-bottom: .5rem;
      p:first-child{
        font-size: 1rem;
        color:white;
        margin-bottom: 1rem;
      }
      p:last-child{
        font-size: 12px;
        color: $textColor;
      }
    }
    .control-box {
      margin-left: 0;
      width: 100%;
      padding: 1rem;
      .control-row {
        p:first-child {
          width: 120px;
        }
        p:nth-child(2),
        p:last-child {
          width: 86px;
          text-align: right;
        }
      }
    }
  }
}
</style>