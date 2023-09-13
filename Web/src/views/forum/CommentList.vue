<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">评论<span class="count">{{commentListInfo.totalCount}}</span></div>
      <div class="tab">
        <span @click="orderChange(0)" :class="['tab-item',orderType == 0 ?'active':'']">热榜</span>
        <el-divider direction="vertical" />
        <span @click="orderChange(1)" :class="['tab-item',orderType == 1 ?'active':'']">最新</span>
      </div>
    </div>
    <!--发送评论 -->
    <div class="comment-form-panel">
      <PostComment
        :articleId="articleId"
        :avatarWidth="50"
        :pCommentId='0'
        :userId="currentUserInfo.userId"
        :showInserImg="currentUserInfo.userId != null"
        @postCommentFinish="postCommentFinish"
      ></PostComment>
    </div>
    <div class="comment-list">
      <DataList
        :dataSource="commentListInfo"
        :loading="loading"
        noDataMsg="当前暂无评论,赶快来占沙发吧!"
        @loadData="loadComment"
      >
        <template #default="{ data }">
          <CommentListItem
            :commentData="data"
            :articleId="articleId"
            :articleUserId="articleUserId"
            :currentUserId="currentUserInfo.userId"
            @hiddenAllReply="hiddenAllReplyHandler"
            @reloadData="loadComment"
          ></CommentListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import CommentListItem from "@/views/forum/CommentListItem.vue";
import PostComment from "@/views/forum/PostComment.vue";
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const props = defineProps({
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
});
const api = {
  loadComment: "/comment/loadComment",
};

// 排序
const orderType = ref(0);
const orderChange = (type)=>{
  orderType.value = type
  loadComment()
}
// 评论列表
const loading = ref(null);
const commentListInfo = ref({});

const loadComment = async () => {
  let params = {
    pageNo: commentListInfo.value.pageNo,
    articleId: props.articleId,
    orderType: orderType.value,
  };
  loading.value = true;
  let result = await proxy.Request({
    url: api.loadComment,
    showLoading:false,
    params: params,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  commentListInfo.value = result.data;
};
loadComment();

// 隐藏所有回复框
const hiddenAllReplyHandler =()=>{
  commentListInfo.value.list.forEach(element => {
   element.showReply = false  
  });
}
// 评论发表完成
const emit = defineEmits(['updateCommentCount'])
const postCommentFinish = (resultData)=>{
  commentListInfo.value.list.unshift(resultData)
  // 更新评论数量
  const totalCount = commentListInfo.value.totalCount+1
  commentListInfo.value.totalCount = totalCount
  emit('updateCommentCount',totalCount)
}
// 当前用户信息
const currentUserInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => (currentUserInfo.value = newVal || {}),
  { immediate: true, deep: true }
);

</script>

<style lang="scss">
.comment-body {
  .comment-title {
    display: flex;
    align-items: center;
    .title {
      font-size: 20px;
      .count {
        font-size: 20px;
        padding: 0px 10px;
      }
    }
    .tab{
      .active{
        color: var(--link);
      }
      .tab-item{
        cursor: pointer;
      }
    }
  }
  .comment-form-panel {
    margin-top: 20px;
  }
}
</style>