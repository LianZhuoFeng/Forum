<template>
  <div
    v-if="!loading && dataSource.list != null && dataSource.list.length == 0"
  >
    <NoData :msg="noDataMsg"></NoData>
  </div>
  <div class="skeleton" v-if="loading">
    <el-skeleton :rows="2" animated />
  </div>
  <div v-for="item in dataSource.list" v-if="!loading">
    <slot :data="item"></slot>
  </div>
  <div class="pagination">
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      background
      layout="prev, pager, next,jumper"
      :page-count="dataSource.pageTotal"
      :current-page="dataSource.pageNo"
      @current-change="handlePageNoChange"
      style="text-align: right"
      :page-size="15"

    ></el-pagination>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const props = defineProps({
  dataSource: {
    type: Object,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  noDataMsg: {
    type: String,
    default: "暂无数据",
  },
});
const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
};
</script>

<style lang="scss">
.pagination {
  padding: 5px 5px 10px 20px;
}
.skeleton {
  padding: 15px;
}
</style>