<template>
  <div class="no-data">
    <i class="iconfont icon-empty-status"></i>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<script setup>
    const props = defineProps({
        msg:{
            type:String,
        }
    })
</script>

<style lang="scss">
.no-data{
    text-align: center;
    padding: 10px 0px;
    .icon-empty-status{
        font-size: 50px;
        color: #bbb;
    }
    .msg{
        margin-top: 10px;
        color:#909399;
        font-size: 14px;
    }
}
</style>