<template>
  <div
    class="container-body ucenter"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="user-banner">
      <router-link to="/" class="a-link">首页</router-link>
      <i class="iconfont icon-shouqi"></i>
      <span>个人中心</span>
    </div>
    <div class="ucenter-panel">
      <div class="user-side">
        <!--头像信息-->
        <div class="avatar-panel">
          <div
            class="edit-btn a-link"
            v-if="isCurrentUser"
            @click="updateUserInfo"
          >
            修改资料
          </div>
          <div class="avatar-inner">
            <Avatar :userId="userInfo.userId" :width="120"></Avatar>
          </div>
          <div class="nick-name">
            <span>{{ userInfo.nickName }}</span>
            <i v-if="userInfo.sex == 0" class="iconfont icon-woman"></i>
            <i v-if="userInfo.sex == 1" class="iconfont icon-man"></i>
          </div>
          <div class="desc">
            {{ userInfo.personDescription }}
          </div>
        </div>
        <!--扩展信息-->
        <div class="user-extend-panel">
          <div class="info-item">
            <i class="label iconfont icon-jifen">积分</i>
            <div
              class="value a-link"
              v-if="isCurrentUser"
              @click="showIntegralRecord"
            >
              {{ userInfo.currentIntegral }}
            </div>
            <div v-else class="value">{{ userInfo.currentIntegral }}</div>
          </div>
          <div class="info-item">
            <i class="label iconfont icon-like">获赞</i>
            <div class="value">{{ userInfo.likeCount }}</div>
          </div>
          <div class="info-item">
            <i class="label iconfont icon-fatie_icon">发帖</i>
            <div class="value">{{ userInfo.postCount }}</div>
          </div>
          <div class="info-item">
            <i class="label iconfont icon-zhuce">加入</i>
            <div class="value">{{ userInfo.joinTime }}</div>
          </div>
          <div class="info-item">
            <i class="label iconfont icon-denglu">最后登录</i>
            <div class="value">{{ userInfo.lastLoginTime }}</div>
          </div>
        </div>
      </div>
      <div class="article-panel">
        <el-tabs :model-value="activeTabName" @tab-change="changeTab">
          <el-tab-pane label="发帖" :name="0"></el-tab-pane>
          <el-tab-pane label="评论" :name="1"></el-tab-pane>
          <el-tab-pane label="点赞" :name="2"></el-tab-pane>
        </el-tabs>
        <div class="article-list">
          <DataList
            :dataSource="articleListInfo"
            :loading="loading"
            @loadData="loadArticle"
            noDataMsg="暂无相关文章，快来操作一个吧(￣▽￣)"
          >
            <template #default="{ data }">
              <ArticleListItem
                :data="data"
                :showEdit="activeTabName == 0 && isCurrentUser"
                :showComment="showComment"
              ></ArticleListItem>
            </template>
          </DataList>
        </div>
      </div>
    </div>
    <!--修改用户信息-->
    <UcenterEditUserInfo
      ref="ucenterEditUserInfoRef"
      @resetUserInfo="resetUserInfoHandler"
    ></UcenterEditUserInfo>
    <!--用户积分记录-->
    <UserIntegralRecord ref="ucenterIntegralRecordRef"></UserIntegralRecord>
  </div>
</template>
  
  <script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import UserIntegralRecord from "@/views/ucenter/UserIntegralRecord.vue";
import UcenterEditUserInfo from "@/views/ucenter/UcenterEditUserInfo.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  getUserInfo: "/ucenter/getUserInfo",
  loadUserArticle: "/ucenter/loadUserArticle",
};

const userId = ref(null);
const userInfo = ref({});
const loadUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
    params: { userId: userId.value },
    errorCallback: () => {
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data;
};
// 是否为当前登录用户
const isCurrentUser = ref(false);
const resetCurrentUser = () => {
  const loginUserInfo = store.getters.getLoginUserInfo;
  if (loginUserInfo && loginUserInfo.userId === userId.value) {
    isCurrentUser.value = true;
  } else {
    isCurrentUser.value = false;
  }
};

//右侧文章
const activeTabName = ref(0);
const changeTab = (type) => {
  activeTabName.value = type;
  loadArticle();
};
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    type: activeTabName.value,
    userId: userId.value,
  };
  let result = await proxy.Request({
    url: api.loadUserArticle,
    params: params,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  loading.value = false;
  articleListInfo.value = result.data;
};
// 修改资料
const ucenterEditUserInfoRef = ref(null);
const updateUserInfo = () => {
  ucenterEditUserInfoRef.value.showEditUserInfoDialog(userInfo.value);
};
const resetUserInfoHandler = (data) => {
  userInfo.value = data;
};
// 获取用户积分记录
const ucenterIntegralRecordRef = ref(null);
const showIntegralRecord = () => {
  ucenterIntegralRecordRef.value.showRecord();
};
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    resetCurrentUser();
  }
);

watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal;
      loadUserInfo();
      resetCurrentUser();
      loadArticle();
    }
  },
  { immediate: true, deep: true }
);
// 是否展示评论
const showComment = ref(false)
watch(
  () => store.state.sysSetting,
  (newVal, oldVal) => {
    if(newVal){
      showComment.value = newVal.commentOpen
    }
  },
  { immediate: true, deep: true }
);
</script>
  
  <style lang="scss">
.ucenter {
  .user-banner {
    color: #9ba7b9;
    line-height: 35px;
    .icon-shouqi {
      padding: 0px 5px;
    }
  }
  .ucenter-panel {
    display: flex;
    .user-side {
      width: 300px;
      margin-right: 10px;
      .avatar-panel {
        background: #fff;
        text-align: center;
        padding: 10px;
        .edit-btn {
          text-align: right;
          font-size: 14px;
        }
        .avatar-inner {
          display: flex;
          justify-content: center;
        }
        .nick-name {
          .iconfont {
            margin-left: 5px;
            color: var(--link);
          }
          .icon-woman {
            color: var(--pink);
          }
        }
        .desc {
          margin-top: 5px;
          text-align: left;
          font-size: 14px;
          color: #929393;
        }
      }
      .user-extend-panel {
        margin-top: 10px;
        background: #fff;
        padding: 10px;
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 30px;
          .label {
            font-size: 13px;
            align-items: center;
            display: flex;
          }
          .label::before {
            font-size: 22px;
            color: #888888;
            padding-right: 5px;
          }
          .value {
            font-size: 13px;
          }
        }
      }
    }
    .article-panel {
      flex: 1;
      background: #fff;
      padding: 0px 10px 10px 10px;
    }
  }
}
</style>