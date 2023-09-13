<template>
  <div>
    <div class="top-panel">
      <el-button type="primary" @click="showEdit('add', 0)">新增版块</el-button>
    </div>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>一级版块</span>
            </div>
          </template>
          <Table
            ref="tableRef"
            :showPagination="false"
            :columns="columns"
            :dataSource="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            @rowClick="rowClick"
          >
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <template #boardInfo="{ index, row }">
              <div>版块名称:{{ row.boardName }}</div>
              <div>版块权限:{{ postTypeMap[row.postType] }}</div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdit('update', 0, row)"
                  >修改</a
                >
                <el-divider direction="vertical" />
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                  >删除</a
                >
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 0)"
                  >上移</a
                >
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  :class="[
                    index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
                  ]"
                  @click="changeSort(index, 'down', 0)"
                  >下移</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>二级版块</span>
              <a
                href="javascript:void(0)"
                class="a-link"
                @click="showEdit('add', 1)"
                >新增二级版块</a
              >
            </div>
          </template>
          <Table
            :showPagination="false"
            :columns="columns"
            :dataSource="tableChildData"
            :options="tableOptions"
          >
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <template #boardInfo="{ index, row }">
              <div>版块名称:{{ row.boardName }}</div>
              <div>版块权限:{{ postTypeMap[row.postType] }}</div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdit('update', 1, row)"
                  >修改</a
                >
                <el-divider direction="vertical" />
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                  >删除</a
                >
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 1)"
                  >上移</a
                >
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  :class="[
                    index == tableChildData.list.length - 1 ? 'not-allow' : 'a-link',
                  ]"
                  @click="changeSort(index, 'down', 1)"
                  >下移</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
    <BoardDialog
      :postTypeMap="postTypeMap"
      :currentBoard="currentBoard"
      ref="showEditRef"
      @submitForm = "loadDataList"
    ></BoardDialog>
  </div>
</template>

<script setup>
import BoardDialog from "@/views/forum/BoardDialog.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  loadBoard: "/board/loadBoard",
  delBoard: "/board/delBoard",
  changeBoardSort: "/board/changeBoardSort",
};
const postTypeMap = { 0: "只允许管理员发帖", 1: "任何人可以发帖" };

// 数据列
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "版块信息",
    prop: "boardName",
    width: 210,
    scopedSlots: "boardInfo",
  },
  {
    label: "简介",
    prop: "boardDesc",
  },
  {
    label: "操作",
    prop: "op",
    width: 190,
    scopedSlots: "op",
  },
];
// 一级版块
const tableData = ref({});
// 二级版块
const tableChildData = ref({});
const tableOptions = {
  extHeight: 100,
};
const tableRef = ref();
const currentBoard = ref(null);
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  tableData.value.list = result.data;
  if (currentBoard.value == null && result.data.length > 0) {
    rowClick(result.data[0]);
  } else {
    currentBoard.value = result.data.find((item) => {
      return item.boardId == currentBoard.value.boardId;
    });
    rowClick(currentBoard.value);
  }
  nextTick(() => {
    tableRef.value.setCurrentRow("boardId", currentBoard.value.boardId);
  });
};
loadDataList();
const rowClick = (row) => {
  currentBoard.value = row;
  tableChildData.value.list = row.children;
};
const showEditRef = ref();
const showEdit = (opType, boardType, data) => {
  showEditRef.value.show(opType, boardType, data);
};

const del = (data)=>{
  proxy.Confirm(`你确定要删除${data.boardName}吗`,async()=>{
    let result = await proxy.Request({
      url:api.delBoard,
      params:{
        boardId:data.boardId
      }
    })
    if(!result){
      return
    }
    if(currentBoard.value.boardId == data.boardId){
      currentBoard.value = null
    }
  loadDataList();
  })
}
const changeSort = async (index,type,boardType)=>{
  console.log(index);
  let dataList = tableData.value.list
  if(boardType == 1){
    dataList = tableChildData.value.list
  }
  if(
    (type == 'down' && index == dataList.length - 1) ||
    (type == 'up' && index == 0 )
  ){
    return
  }
  console.log(dataList);

  let temp = dataList[index]
  let number = type == "down"? 1 :-1
  dataList.splice(index,1)
  dataList.splice(index + number,0,temp)

  let boardIdList = []
  dataList.forEach((element) =>{
    boardIdList.push(element.boardId)
  })
  let result =await proxy.Request({
    url:api.changeBoardSort,
    params:{
      boardIds:boardIdList.join(",")
    }
  })
  if(!result){
    return
  }
  proxy.Message.success('重新排序成功')
  loadDataList();
}
</script>

<style lang="scss">
.not-allow {
  cursor: not-allowed;
  color: #ddd;
  text-decoration: none;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .a-link {
    font-size: 14px;
  }
}
</style>