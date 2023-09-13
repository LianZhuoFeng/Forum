<template>
  <div
    class="container-body article-list-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="sub-board" v-if="pBoardId">
      <span>
        <router-link :to="`/forum/${pBoardId}`" :class="['board-item',boardId ? '' : 'active']">全部</router-link>
      </span>
      <span v-for="item in subBoardList" >
        <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`" :class="['board-item',item.boardId == boardId? 'active':'']">{{ item.boardName }}</router-link>
      </span>
    </div>
    <div class="article-panel">
      <div class="top-tab">
        <div
          :class="['tab', orderType == 0 ? 'active' : '']"
          @click="changeOrderType(0)"
        >
          热榜
        </div>
        <el-divider direction="vertical" />
        <div
          :class="['tab', orderType == 1 ? 'active' : '']"
          @click="changeOrderType(1)"
        >
          发布时间
        </div>
        <el-divider direction="vertical" />
        <div
          :class="['tab', orderType == 2 ? 'active' : '']"
          @click="changeOrderType(2)"
        >
          最新
        </div>
      </div>
      <div class="arrice-list">
        <DataList
          :dataSource="articleListInfo"
          :loading="loading"
          @loadData="loadArticle"
          noDataMsg="没有发现帖子，快来发一个吧(￣▽￣)"
        >
          <template #default="{ data }">
            <ArticleListItem :data="data" :showComment="showComment"></ArticleListItem>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  loadArticle: "/forum/loadArticle",
};
// 文章列表
// 一级版块
const pBoardId = ref(0);
// 二级版块
const boardId = ref(0);
const orderType = ref(0);
const changeOrderType = (type) => {
  orderType.value = type;
  articleListInfo.value.pageNo = 1;
  loadArticle();
};
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    pBoardId: pBoardId.value,
    boardId: boardId.value,
    orderType: orderType.value,
  };
  let result = await proxy.Request({
    url: api.loadArticle,
    params: params,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  loading.value = false;
  articleListInfo.value = result.data;
};

// 二级版块
const subBoardList = ref([]);
const setSubBoard = () => {
  subBoardList.value = store.getters.getSubBoardList(pBoardId.value);
};
// 监听路由变化
watch(
  () => route.params,
  (newVal, oldVal) => {
    if (
      Object.keys(newVal).length != 0 &&
      !newVal.pBoardId &&
      !newVal.boardId
    ) {
      return;
    }
    pBoardId.value = newVal.pBoardId;
    boardId.value = newVal.boardId;
    loadArticle();
    setSubBoard();
    store.commit('setActivePBoardId',newVal.pBoardId)
    store.commit('setActiveBoardId',newVal.boardId)
  },
  { immediate: true, deep: true }
);
// 监听版块数据发生变化
watch(
  () => store.state.boardList,
  (newVal, oldVal) => {
    setSubBoard();
    loadArticle();
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
.article-list-body {
  .sub-board {
    padding-bottom: 15px;
    .board-item {
      background: #fff;
      border-radius: 15px;
      padding: 2px 10px;
      margin-right: 10px;
      color: #909090;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
    }
    .active{
      background: var(--link);
      color:#fff;
    }
  }
  .article-panel {
    background: #fff;
    .top-tab {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 15px;
      border-bottom: 1px solid #ddd;
      .tab {
        cursor: pointer;
      }
      .active {
        color: var(--link);
      }
    }
  }
}
</style>