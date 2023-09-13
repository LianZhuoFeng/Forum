<template>
  <div class="image-viewer">
    <el-image-viewer
      :initial-index="previewImgIndex"
      hide-on-click-model
      :url-list="imageList"
      @close = "closeImgViewer"
      v-if="previewImgIndex !=null"
    >
    </el-image-viewer>
  </div>
</template>

<script setup>
import {ref,reactive, getCurrentInstance} from 'vue'
import {useRouter,useRoute} from 'vue-router'
const {proxy} =getCurrentInstance()
const router = useRouter()
const route = useRoute()
const props = defineProps({
  imageList: {
    type: Array,
  },
});
const previewImgIndex = ref(null);
const show = (index) => {
  stopScroll()
  previewImgIndex.value = index;
};
defineExpose({ show });
const closeImgViewer = () => {
  startScroll()
  previewImgIndex.value = null;

};

// 禁止滚动
const stopScroll =()=>{
  document.body.style.overflow = 'hidden'
}

// 开始滚动
const startScroll =()=>{
  document.body.style.overflow = 'visible'
}
</script>

<style lang="scss">
.image-viewer{
  .el-image-viewer__mask{
    opacity: 0.7;
}
}

</style>