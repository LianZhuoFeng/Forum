<template>
  <div>
    <transition name="el-fade-in-linear">
      <div class="header" v-show="showHeader">
        <div
          class="header-content"
          :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
        >
          <!-- logo -->
          <router-link to="/" class="logo">
            <span v-for="item in logoInfo" :style="{ color: item.color }">
              {{ item.value }}
            </span>
          </router-link>
          <!-- 板块信息 -->
          <div class="menu-panel">
            <span
              :class="[
                'menu-item',
                activePBoardId == undefined ? 'active' : '',
              ]"
              @click="router.push('/')"
              >首页</span
            >
            <!-- <span class="menu-item" to="/">首页</span> -->
            <template v-for="board in boardList">
              <el-popover
                placement="bottom-start"
                :width="300"
                trigger="hover"
                content="this is content, this is content, this is content"
                v-if="board.children.length > 0"
              >
                <template #reference>
                  <!-- 一级版块 -->
                  <span
                    :class="[
                      'menu-item',
                      board.boardId == activePBoardId ? 'active' : '',
                    ]"
                    @click="boardClickHandler(board)"
                    >{{ board.boardName }}</span
                  >
                </template>
                <div class="sub-board-list">
                  <!-- 二级版块 -->
                  <span
                    :class="[
                      'sub-board',
                      subBoard.boardId == activeBoardId ? 'active' : '',
                    ]"
                    v-for="subBoard in board.children"
                    @click="subBoardClickHandler(subBoard)"
                  >
                    {{ subBoard.boardName }}
                  </span>
                </div>
              </el-popover>
              <span
                :class="[
                  'menu-item',
                  board.boardId == activePBoardId ? 'active' : '',
                ]"
                v-else
                @click="boardClickHandler(board)"
                >{{ board.boardName }}</span
              >
            </template>
          </div>
          <!-- 登录，注册 用户信息 -->
          <div class="user-info-panel">
            <el-button type="primary" class="el-button-left" @click="newPost">
              发帖<i class="iconfont icon-add"></i>
            </el-button>
            <el-button type="primary" class="el-button-left" @click="goSearch">
              搜索<i class="iconfont icon-search"></i>
            </el-button>
            <template v-if="userInfo.userId">
              <div class="message-info">
                <el-dropdown>
                  <el-badge
                    :value="messageCountInfo.total"
                    class="item"
                    :hidden="
                      messageCountInfo.total == null ||
                      messageCountInfo.total == 0
                    "
                  >
                    <i class="iconfont icon-message-fill"></i>
                  </el-badge>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        @click="gotoMessage('reply')"
                        class="message-item"
                      >
                        <span class="text">回复我的</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.reply > 0"
                          >{{
                            messageCountInfo.reply > 99
                              ? "99+"
                              : messageCountInfo.reply
                          }}</span
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        @click="gotoMessage('likePost')"
                        class="message-item"
                      >
                        <span class="text">赞了我的文章</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.likePost > 0"
                          >{{
                            messageCountInfo.likePost > 99
                              ? "99+"
                              : messageCountInfo.likePost
                          }}</span
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        @click="gotoMessage('downloadAttachment')"
                        class="message-item"
                      >
                        <span class="text">下载了我的附件</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.downloadAttachment > 0"
                          >{{
                            messageCountInfo.downloadAttachment > 99
                              ? "99+"
                              : messageCountInfo.downloadAttachment
                          }}</span
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        @click="gotoMessage('likeComment')"
                        class="message-item"
                      >
                        <span class="text">赞了我的评论</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.likeComment > 0"
                          >{{
                            messageCountInfo.likeComment > 99
                              ? "99+"
                              : messageCountInfo.likeComment
                          }}</span
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        @click="gotoMessage('sys')"
                        class="message-item"
                      >
                        <span class="text">系统消息</span>
                        <span
                          class="count-tag"
                          v-if="messageCountInfo.sys > 0"
                          >{{
                            messageCountInfo.sys > 99
                              ? "99+"
                              : messageCountInfo.sys
                          }}</span
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="user-info">
                <el-dropdown>
                  <Avatar
                    :userId="userInfo.userId"
                    :width="50"
                    :addLink="false"
                  ></Avatar>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        @click="router.push('/user/' + userInfo.userId)"
                        >我的主页</el-dropdown-item
                      >
                      <el-dropdown-item @click="loginOut"
                        >退出</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>

            <el-button-group style="margin-left: 5px" v-else>
              <el-button type="primary" plain @click="loginRegiser(1)"
                >登录</el-button
              >
              <el-button type="primary" plain @click="loginRegiser(0)"
                >注册</el-button
              >
            </el-button-group>
          </div>
        </div>
      </div>
    </transition>
    <div class="body-content">
      <router-view></router-view>
    </div>
    <div class="footer" v-if="showFooter">
      <div
        class="footer-content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <el-row>
          <el-col :span="6" class="item">
            <div class="logo">
              <div class="log-letter">
                <span v-for="item in logoInfo" :style="{ color: item.color }">
                  {{ item.value }}
                </span>
              </div>
              <div class="info">一个水货满满的编程社区</div>
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">网站相关</div>
            <div @click="goInfo"><router-link :to="'/post/zTQZcapG18Paq75'">规章制度</router-link></div>
            <div @click="goInfo"><router-link :to="'/post/5p5o0AJCL5dIKFw'">免费声明</router-link></div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">友情链接</div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">关注站长</div>
            <div class="focus-item">
              <div class="wx-info">
                <img src="@/assets/ee823328a2c442920c1b4c85fb778aa.jpg" />
              </div>
              <span class="info">扫码添加站长微信</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <LoginAndReg ref="loginRegiserRef"></LoginAndReg>
    <!--回到顶部-->
    <el-backtop :right="100" :bottom="100"></el-backtop>
  </div>
</template>

<script setup>
import LoginAndReg from "@/views/LoginAndReg.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();
const route = useRoute();

const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  getMessageCount: "/ucenter/getMessageCount",
  logout: "/logout",
  getSysSetting: "/getSysSetting",
};
const logoInfo = ref([
  {
    value: "F",
    color: "#FB3624",
  },
  {
    value: "e",
    color: "#3285ff",
  },
  {
    value: "n",
    color: "#FFBA02",
  },
  {
    value: "g",
    color: "#25b24e",
  },
  {
    value: "G",
    color: "#3285ff",
  },
  {
    value: "e",
    color: "#FFBA02",
  },
]);
const showHeader = ref(true);
// 获取滚动条的高度
const getScrollTop = () => {
  // 解决不同浏览器问题
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};
const initScroll = () => {
  let initScrollTop;
  let scrollType;
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    if (currentScrollTop > initScrollTop) {
      // 往下滚
      scrollType = 1;
    } else {
      // 往上滚
      scrollType = 0;
    }
    initScrollTop = currentScrollTop;
    if (scrollType === 1 && currentScrollTop > 128) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  });
};

const loginRegiserRef = ref();

const loginRegiser = (id) => {
  loginRegiserRef.value.showPanel(id);
};

onMounted(() => {
  initScroll();
  getUserInfo();
  loadBoard();
  loadSysSetting()
});
// 获取用户信息
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  store.commit("updateLoginUserInfo", result.data);
};
const boardList = ref({});
const loadBoard = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
  store.commit("saveBoardList", result.data);
};

// 监听 登录用户消息
const userInfo = ref({});
// 监听登录用户信息
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal != undefined && newVal != null) {
      userInfo.value = newVal;
    } else {
      userInfo.value = {};
    }
  },
  { immediate: true, deep: true }
);
// 监听是否展示登录框
watch(
  () => store.state.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      loginRegiser(1);
    }
  },
  { immediate: true, deep: true }
);
//  版块点击
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
};

const activePBoardId = ref(0);
watch(
  () => store.state.activePBoardId,
  (newVal, oldVal) => {
    if (newVal != 0) {
      activePBoardId.value = newVal;
    }
  },
  { immediate: true, deep: true }
);

const activeBoardId = ref(0);
watch(
  () => store.state.activeBoardId,
  (newVal, oldVal) => {
    activeBoardId.value = newVal;
  },
  { immediate: true, deep: true }
);
// 发帖
const newPost = () => {
  if (!store.getters.getLoginUserInfo) {
    loginRegiser(1);
  } else {
    router.push("/newPost");
  }
};

// 获取消息数量
const messageCountInfo = ref({});
const loadMessageCount = async () => {
  let result = await proxy.Request({
    url: api.getMessageCount,
  });
  if (!result) {
    return;
  }
  messageCountInfo.value = result.data;
  store.commit("updateMessageCountInfo", result.data);
};
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      loadMessageCount();
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);
// 点击消息进入消息页面
const gotoMessage = (type) => {
  router.push(`/user/message/${type}`);
};

// 退出
const loginOut = () => {
  proxy.Confirm("确定要退出登录吗", async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    store.commit("updateLoginUserInfo", null);
  });
};
// 点击跳转刷新
const goInfo = ()=>{
  router.go(0)
}
//是否展示底部
const showFooter = ref(true);
watch(
  () => route.path,
  (newVal, oldVal) => {
    if (newVal.indexOf("newPost") != -1 || newVal.indexOf("editPost") != -1) {
      showFooter.value = false;
    } else {
      showFooter.value = true;
    }
  },
  { immediate: true, deep: true }
);
//获取系统配置
const loadSysSetting = async () => {
  let result = await proxy.Request({
    url: api.getSysSetting,
  });
  if (!result) {
    return;
  }
  store.commit("saveSysSetting", result.data);
};
//  搜索
const goSearch =()=>{
  router.push('/search')
}
</script>

<style lang="scss">
.header {
  width: 100%;
  height: 50px;
  z-index: 999;
  position: fixed;
  top: 0;
  box-shadow: 0 2px 6px 0 #ddd;
  background: #fff;
  .header-content {
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    .logo {
      font-size: 35px;
      text-decoration: none;
      margin-right: 5px;
    }
    .menu-panel {
      flex: 1;
      .menu-item {
        margin-left: 30px;
        cursor: pointer;
      }
      .active {
        // background: var(--link);
        color: var(--link);
      }
    }
    .user-info-panel {
      width: 300px;
      display: flex;
      align-items: center;
      .el-button-left {
        margin-left: 3px;
      }
      i {
        margin-left: 5px;
      }
      .message-info {
        .icon-message-fill {
          font-size: 25px;
          color: rgb(147, 147, 147);
          margin-left: 5px;
        }
        margin-left: 5px;
        margin-right: 25px;
        cursor: pointer;
      }
    }
  }
}
.sub-board-list {
  display: flex;
  flex-wrap: wrap;
  .sub-board {
    padding: 0px 10px;
    border-radius: 20px;
    margin-right: 10px;
    background: rgb(239, 239, 239);
    border: 1px solid #ddd;
    color: rgb(119, 118, 118);
    cursor: pointer;
    // margin-top: 5px;
  }
  .sub-board:hover {
    color: var(--link);
  }
  .active {
    background: var(--link);
    color: #ffffff;
  }
  .active:hover {
    color: #ffffff;
  }
}
.body-content {
  margin-top: 60px;
  position: relative;
  min-height: calc(100vh - 210px);
}
.message-item {
  display: flex;
  justify-content: space-around;
  .text {
    flex: 1;
  }
  .count-tag {
    height: 15px;
    line-height: 15px;
    min-width: 20px;
    display: inline-block;
    background: #f56c6c;
    border-radius: 10px;
    font-size: 13px;
    text-align: center;
    color: #fff;
    margin-left: 10px;
  }
}
.footer {
  background: #e9e9e9;
  height: 140px;
  margin-top: 10px;
  .footer-content {
    margin: 0 auto;
    padding-top: 10px;
    .item {
      text-align: left;
      .title {
        font-size: 18px;
        margin-bottom: 10px;
      }
      a {
        font-size: 14px;
        text-decoration: none;
        color: var(--text2);
        line-height: 25px;
      }
      .focus-item {
        display:flex;
        align-items: center;
        .wx-info {
          width: 80px;
          img {
            width: 80px;
          }
        }
        .info{
          margin-left: 5px;
          color: #515767;
          font-size: 13px;
        }
      }
    }
    .logo {
      .log-letter {
        font-size: 30px;
      }
      .info {
        margin-top: 10px;
        color: var(--text2);
      }
    }
  }
}
</style>