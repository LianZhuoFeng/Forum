<template>
    <div>
      <div class="top-panel">
        <el-form :model="searchFormData" label-width="50px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="昵称">
                <el-input
                  placeholder="请输入昵称"
                  v-model="searchFormData.nickNameFuzzy"
                  clearable
                  @keyup.enter="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="性别">
                <el-select
                  placeholder="请输入性别"
                  v-model="searchFormData.sex"
                  clearable
                  :style="{width:'100%'}"
                >
                <el-option :value="1" label="男"></el-option>
                <el-option :value="0" label="女"></el-option>
              </el-select>
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
                  <el-option :value="-1" label="正常"></el-option>
                  <el-option :value="0" label="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :style="{'padding-left':'10px'}">
              <el-button-group>
                <el-button type="primary" @click="loadDataList">搜索</el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="data-list">
        <Table
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
      >
        <!-- 头像 -->
        <template #userInfo="{ row, index }">
            <Avatar :userId="row.userId" :width="50"></Avatar>
        </template>
        <!-- 昵称 -->
        <template #nickName="{ row, index }">
          {{ row.nickName }}
          <span v-if="row.sex" :style="{color: row.sex == 0 ? 'red':'blue'}">{{ row.sex == 0? '女':'男' }}</span>
        </template>

        <!-- 登录信息 -->
        <template #loginInfo="{ row, index }">
          <div>最后登录时间：{{ row.lastLoginTime }}</div>
          <div>最后登录IP：{{ row.lastLoginIp }}</div>
          <div>最后登录地点：{{ row.lastLoginIpAddress }}</div>
        </template>

        <!-- 类型 -->
        <template #integral="{ row, index }">
          <div>总积分：{{row.totalIntegral}}</div>
          <div>当前积分：{{row.currentIntegral}}</div>
        </template>

        <!-- 状态 -->
        <template #status="{ row, index }">
          <span v-if="row.status == 1" :style="{color:'green'}">正常</span>
          <span v-else :style="{color:'red'}">禁用</span>
        </template>
        <!--操作 -->
        <template #op="{ row, index }">
          <div class="op" v-if="row.status == 0||row.status == 1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more_android"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateUserStatus(row)"
                    >{{row.status == 1? '禁用':'启用'}}</el-dropdown-item
                  >
                  <el-dropdown-item @click="sendMessage(row)"
                    >发送系统消息</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
      </div>
      <SendMessage ref="sendMessageRef" @reload="loadDataList"></SendMessage>
    </div>
  </template>
  
  <script setup>
  import SendMessage from '@/views/user/SendMessage.vue'
  import {ref,reactive, getCurrentInstance} from 'vue'
  import {useRouter,useRoute} from 'vue-router'
  const {proxy} =getCurrentInstance()
  const router = useRouter()
  const route = useRoute()
  const searchFormData = ref({})
  const api = {
    loadDataList:"/user/loadUserList",
    updateUserStatus:"/user/updateUserStatus"
  }
  // 数据列
const columns = [
  {
    label: "头像",
    prop: "avatar",
    width:80,
    scopedSlots: "userInfo",
  },
  {
    label: "昵称",
    prop: "nickName",
    width:120,
    scopedSlots: "nickName",
  },
  {
    label: "邮箱",
    width: 180,
    prop: "email",
  },
  {
    label: "个人描述",
    prop: "personDescription",
  },
  {
    label: "加入时间",
    prop: "joinTime",
    width: 180,
  },
  {
    label: "登录信息",
    prop: "lastLoginTime",
    width: 260,
    scopedSlots:'loginInfo'
  },
  {
    label: "积分",
    prop: "totalIntegral",
    width: 150,
    scopedSlots: "integral",
  },
  {
    label: "状态",
    prop: "status",
    width: 60,
    scopedSlots: "status",
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
 // table显示的数据
 const tableData = ref({});

 const tableOptions = ref({
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
// 是否禁用
const updateUserStatus = (data)=>{
  const opName = data.status == 1 ? '禁用' : '启用'
  proxy.Confirm(`你确定要${opName}用户${data.nickName}吗？`,async()=>{
    let result = await proxy.Request({
      url:api.updateUserStatus,
      params:{
        userId: data.userId,
        status: data.status == 1? 0:1,
      }
    })
    if(!result){
      return
    }
    proxy.Message.success('操作成功')
    loadDataList()
  })
}
// 发送系统消息
const sendMessageRef = ref()
const sendMessage = (data)=>{
  sendMessageRef.value.sendMessage(data)
}
  </script>
  
  <style lang="scss" scoped>
  .op{
    cursor: pointer;
  }
  </style>