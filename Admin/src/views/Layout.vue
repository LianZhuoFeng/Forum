<template>
  <div class="layout-body">
    <el-container>
      <el-aside class="aside" :style="{ width: asideWidth + 'px' }">
        <div class="logo">
          <span v-if="!menuCollapse">FengGe论坛管理后台</span>
        </div>
        <div class="menu-panel">
          <el-menu
            :default-openeds="defaultOpeneds"
            :collapse-transition="false"
            :collapse="menuCollapse"
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#3d3c4a"
            text-color="#fff"
            active-text-color="#fff"
            router
            :defaultActive="defaultActive"
          >
            <template v-for="item in menuList">
              <el-sub-menu :index="item.path" v-if="item.children">
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
                <el-menu-item
                  v-for="subItem in item.children"
                  :index="subItem.path"
                >
                  <span class="menu-name">{{ subItem.menuName }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu :index="item.path" v-else>
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
              </el-sub-menu>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <i
            :class="[
              'op-menu',
              'iconfont',
              menuCollapse ? 'icon-shouqi2' : 'icon-shouqi1',
            ]"
            @click="opMenu"
          ></i>
          <div class="menu-bread">
            <el-breadcrumb>
              <template v-for="item in menuBreadCrumbList">
                <el-breadcrumb-item v-if="item.name">
                  {{ item.name }}
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </el-header>
        <el-main class="main-content">
          <div class="tag-content">
            <el-tabs
              type="border-card"
              v-model="defaultActive"
              @tab-change="tabClick"
              @edit="editTab"
            >
              <el-tab-pane
                v-for="item in tabList"
                :name="item.path"
                :label="item.menuName"
                :closable="tabList.length > 1"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="content-body">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
// 默认选中的菜单
const defaultActive = ref();
// 系统菜单
const menuList = [
  {
    menuName: "内容管理",
    icon: "icon-wenzhangfenlei",
    path: "/forum",
    children: [
      {
        menuName: "帖子管理",
        path: "/forum/article",
      },
      {
        menuName: "评论管理",
        path: "/forum/comment",
      },
      {
        menuName: "版块管理",
        path: "/forum/board",
      },
    ],
  },
  {
    menuName: "用户管理",
    icon: "icon-user-fill",
    path: "/user",
    children: [
      {
        menuName: "用户列表",
        path: "/user/list",
      },
    ],
  },
  {
    menuName: "设置",
    icon: "icon-settings",
    path: "/settings",
    children: [
      {
        menuName: "系统设置",
        path: "/settings/sys",
      },
    ],
  },
];
const menuMap = {}
// 默认展开的菜单
const defaultOpeneds = ref([]);
const init = () => {
  menuList.forEach((element) => {
    defaultOpeneds.value.push(element.path);
    element.children.forEach(subItem=>{
        menuMap[subItem.path] = subItem
    })
  });
};
init();

// 收起和关闭菜单
const menuCollapse = ref(false);
const asideWidth = ref(220);
const opMenu = () => {
  menuCollapse.value = !menuCollapse.value;
  if (menuCollapse.value) {
    asideWidth.value = 63;
  } else {
    asideWidth.value = 220;
  }
};

const handleOpen = () => {};
const handleClose = () => {};

// tab操作
const tabList = ref([]);
const tabClick = (e)=>{
    router.push(e)
}
const editTab = (targetKey,action)=>{
    if(action!=="remove"){
        return
    }
    let currentPath = defaultActive.value;
    let tabs = tabList.value
    // 关闭当前选中的tab
    if(targetKey == defaultActive.value){
        tabs.forEach((tab,index)=>{
            if(tab.path === targetKey){
                let nextTab =tabs[index+1] || tabs[index-1]
                if(nextTab){
                    currentPath = nextTab.path
                }
            }
        })
    }
    tabList.value = tabs.filter((tab)=>{
        return tab.path!==targetKey
    })
    if(currentPath !== defaultActive.value){
        router.push(currentPath)
    }
}
// 面包屑数据
const menuBreadCrumbList = ref([]);

watch(
  () => route,
  (newVal, oldVal) => {
    defaultActive.value = route.path;
    menuBreadCrumbList.value = route.matched;
    let currentMenu = tabList.value.find((item)=>{
        return item.path == defaultActive.value
    })
    if(!currentMenu){
        tabList.value.push(menuMap[route.path])
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
.el-popper {
  border: none !important;
  .el-menu-item.is-active {
    background: var(--el-color-primary);
  }
  .el-menu-item:hover {
    color: #d8d8ee;
  }
  .el-menu--popup {
    padding: 0px;
  }
}
.layout-body {
  .aside {
    background: #3d3c4a;
    .logo {
      display: flex;
      height: 50px;
      color: #fff;
      background: #191828;
      align-items: center;
      font-size: 18px;
      padding-left: 5px;
    }
    .menu-panel {
      height: calc(100vh - 50px);
      .menu-name {
        padding-left: 10px;
      }
      .el-menu {
        border-right: none;
      }
      .el-menu-item {
        background: #353544;
      }
      .el-menu-item.is-active {
        color: #fff;
        background: var(--el-color-primary);
      }
      .el-menu-item:hover {
        color: #d8d8ee;
      }
    }
  }
  .header {
    background: #fff;
    border-bottom: 1px solid #ddd;
    height: 50px;
    line-height: 50px;
    padding: 0px 10px !important;
    display: flex;
    align-items: center;
    .op-menu {
      font-size: 20px;
      cursor: pointer;
      color: #3a3a40;
    }
    .menu-bread {
      margin-left: 10px;
    }
  }
  .main-content{
    padding: 0px;
    .tag-content{
        .el-tabs--border-card{
            border:none;
        }
        .el-tabs__content{
            display: none;
        }
    }
    .content-body{
        background: #fff;
        overflow: hidden;
        padding: 10px 10px 5px 10px;
    }
  }
}
</style>