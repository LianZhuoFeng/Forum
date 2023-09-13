<template>
  <div class="cover" :style="{ width: width + 'px', height: width + 'px' }">
    <el-image
      :style="{ width: width + 'px', height: width + 'px' }"
      fit="scale-down"
      loading="lazy"
      :src="cover ? proxy.globalInfo.imageUrl+cover : localCover"
    >
    </el-image>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const localCover = new URL('@/assets/default_avatar.jpg',import.meta.url).href;
const props = defineProps({
  cover: {
    type: String,
  },
  width: {
    type: Number,
    default: 60,
  },
});
</script>

<style lang="scss">
.cover{
    // background:#ddd;
    border-radius:5px;
    overflow: hidden;
}
</style>