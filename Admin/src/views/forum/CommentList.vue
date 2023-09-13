<template>
  <div>
     <div class="top-panel">
        <el-form :model="searchFormData" label-width="50px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="评论内容" class="comment">
                <el-input
                  placeholder="支持模糊搜索"
                  v-model="searchFormData.contentFuzzy"
                  clearable
                  @keyup.enter="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="昵称">
                <el-input
                  placeholder="请输入昵称"
                  v-model="searchFormData.nickNameFuzzy"
                  clearable
                  @keyup.native="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="状态">
                <el-select
                  placeholder="请选择状态"
                  v-model="searchFormData.status"
                  clearable
                  :style="{ width: '100%' }"
                >
                  <el-option :value="-1" label="已删除"></el-option>
                  <el-option :value="0" label="待审核"></el-option>
                  <el-option :value="1" label="已审核"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :style="{'padding-left':'10px'}">
              <el-button-group>
                <el-button type="primary" @click="loadDataList">搜索</el-button>
                <el-button
                  type="success"
                  @click="auditBatch"
                  :disabled="selectBatchList.length == 0"
                  >批量审批</el-button
                >
                <el-button
                  type="danger"
                  @click="delBatch"
                  :disabled="selectBatchList.length == 0"
                  >批量删除</el-button
                >
              </el-button-group>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="data-list">
      <Table
        ref="tableRef"
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
        @rowSelected="setRowSelected"
      >
        <!-- 用户信息 -->
        <template #userInfo="{ row, index }">
          <div class="user-info">
            <Avatar :userId="row.userId" :width="50"></Avatar>
            <div class="name-info">
              <div>
                <a
                  :href="`${proxy.globalInfo.webDomain}user/${row.userId}`"
                  class="a-link"
                  target="_blank"
                  >{{ row.nickName }}</a
                >
              </div>
              <div>{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template>

        <!-- 查看文章 -->
        <template #contentInfo="{ row, index }">
          <span>
            <a
            :href="`${proxy.globalInfo.webDomain}post/${row.articleId}`"
            class="a-link"
            target="_blank"
            tag="a"
            >查看文章</a
          >
          </span>
          <div v-html="row.content"></div>
          <div v-if="row.imgPath">
                <CommentImage
                :src="
                  proxy.globalInfo.imageUrl + row.imgPath.replace('.', '_.')
                "
                :imgList="[proxy.globalInfo.imageUrl + row.imgPath]"
                ></CommentImage>
          </div>
        </template>

        <!-- 状态 -->
        <template #statusInfo="{ row, index }">
          <div v-if="row.status == -1" :style="{ color: 'red' }">已删除</div>
          <div v-if="row.status == 0" :style="{ color: 'red' }">待审核</div>
          <div v-if="row.status == 1" :style="{ color: 'green' }">已审核</div>
        </template>

        <!-- 操作信息 -->
        <template #op="{ row, index }">
          <div class="op" v-if="row.status == 0||row.status == 1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more_android"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="delComment(row)"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item @click="audit(row)" v-if="row.status == 0"
                    >审核</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import CommentImage from '@/views/forum/CommentImage.vue'
import {ref,reactive, getCurrentInstance} from 'vue'
import {useRouter,useRoute} from 'vue-router'
const {proxy} =getCurrentInstance()
const router = useRouter()
const route = useRoute()
// 搜索
const searchFormData = ref({});
// 数据列
const columns = [
  {
    label: "用户信息",
    prop: "avatar",
    width: 200,
    scopedSlots: "userInfo",
  },
  {
    label: "评论内容",
    prop: "content",
    scopedSlots: "contentInfo",
  },
  {
    label: "点赞",
    width: 150,
    prop: "goodCount",
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    scopedSlots: "statusInfo",
  },
  {
    label: "发布时间",
    prop: "postTime",
    width: 180,
  },
  {
    label: "发布地址",
    prop: "userIpAddress",
    width: 100,
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
const api = {
  loadDataList: "/forum/loadComment",
  auditComment:"/forum/auditComment",
  delComment:"/forum/delComment",
 };
 // table显示的数据
 const tableData = ref({});

 const tableOptions = ref({
  selectType:"checkbox",
  extHeight:50,
});
// 表格属性
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params,searchFormData.value)
  let result = await proxy.Request({
    url: api.loadDataList,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};

// 删除
const delComment = (data)=>{
    proxy.Confirm(`你确定要删除该评论吗？`,async()=>{
    let result = await proxy.Request({
      url:api.delComment,
      params:{
        commentIds:data.commentId
      }
    })
    if(!result){
      return
    }
    proxy.Message.success('操作成功')
    loadDataList()
  })
}
// 审核
const audit = (data)=>{
    proxy.Confirm(`你确定要审核该评论吗？`,async()=>{
    let result = await proxy.Request({
      url:api.auditComment,
      params:{
        commentIds:data.commentId
      }
    })
    if(!result){
      return
    }
    proxy.Message.success('操作成功')
    loadDataList()
  })
}
// 批量选择
const selectBatchList = ref([]);
const setRowSelected = (rows) => {
  selectBatchList.value=[]
  rows.forEach(element => {
    selectBatchList.value.push(element.commentId)
  });
};
const tableRef = ref()
const auditBatch = (data)=>{
  proxy.Confirm(`你确定要批量审核吗？`,async()=>{
    let result = await proxy.Request({
      url:api.auditComment,
      params:{
        commentIds:selectBatchList.value.join(',')
      }
    })
    if(!result){
      return
    }
    tableRef.value.clearSelection()
    proxy.Message.success('操作成功')
    loadDataList()
  })
}
const delBatch = (data)=>{
  proxy.Confirm(`你确定要批量删除吗？`,async()=>{
    let result = await proxy.Request({
      url:api.delComment,
      params:{
        commentIds:selectBatchList.value.join(',')
      }
    })
    if(!result){
      return
    }
    tableRef.value.clearSelection()
    proxy.Message.success('操作成功')
    loadDataList()
  })
}
</script>

<style lang="scss">
.comment{
    .el-form-item__label{
    width:80px !important;
}
}
.data-list {
  .user-info {
    display: flex;
    align-items: center;
    .name-info {
      margin-left: 5px;
    }
  }
  .op {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>