<template>
  <el-config-provider :locale="locale" :message="config">
    <RouterView />
  </el-config-provider>
</template>
<script setup>
import { RouterView } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { reactive } from "vue";
const locale = zhCn;
const config = reactive({
  max: 1,
});
</script>
<style>
</style>