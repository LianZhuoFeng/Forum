<template>
   <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="550px"
      :showCancel="false"
      @close="dialogConfig.show=false"
    >
    <el-form :model="formData" label-width="110px" :rules="rules" ref="formDataRef">
        <el-form-item label="一级版块" prop="pBoardName" v-if="formData.boardType==1">
            {{ formData.pBoardName }}
        </el-form-item>
        <el-form-item label="版块名称" prop="boardName">
            <el-input placeholder="请输入名称" v-model="formData.boardName"></el-input>
        </el-form-item>
        <el-form-item label="发帖权限" prop="postType">
            <el-radio-group v-model="formData.postType">
                <el-radio :label="1">{{ postTypeMap[1] }}</el-radio>
                <el-radio :label="0">{{ postTypeMap[0] }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
            <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="boardDesc">
            <el-input placeholder="请输入简介" type="textarea" v-model="formData.boardDesc" :autosize="{minRows:4,maxRows:4}"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
</template>

<script setup>
import {ref,reactive, getCurrentInstance, nextTick} from 'vue'
import {useRouter,useRoute} from 'vue-router'
const {proxy} =getCurrentInstance()
const router = useRouter()
const route = useRoute()
const api = {
    saveBoard:"/board/saveBoard"
}
const props = defineProps({
    currentBoard:{
        type:Object,
    },
    postTypeMap:{
        type:Object,
    }
})
 const dialogConfig = reactive({
    show: false,
    title: "编辑版块",
    buttons: [
      {
        text: "上传",
        type: "primary",
        click: (e) => {
         submitForm()
        },
      },
    ],
  });
  const formData = ref({});
  const formDataRef = ref();
  const rules = {
  boardName: [{ required: true, message: "请输入版块名称" }],
  postType: [{ required: true, message: "请选择发帖权限" }],
};

const show = (opType,boardType,data)=>{
    dialogConfig.show = true
    nextTick(()=>{
        formDataRef.value.resetFields();
        if(opType == 'add'){
            dialogConfig.title = boardType == 0? "新增版块":'新增二级版块'
            formData.value = {}
        }else if(opType == 'update'){
            dialogConfig.title = boardType == 0? "修改版块":'修改二级版块'
            formData.value = JSON.parse(JSON.stringify(data))
            console.log(formData.value );
            if(formData.value.cover){
                formData.value.cover =  {
                    imageUrl:formData.value.cover
                }
            }
        }
        formData.value.boardType = boardType
        if(boardType == 1){
            formData.value.pBoardName = props.currentBoard.boardName
            formData.value.pBoardId = props.currentBoard.boardId
        }else{
            formData.value.pBoardId = 0
        }
    })
}
defineExpose({show})

const emit = defineEmits(['submitForm'])
const submitForm = ()=>{
    formDataRef.value.validate(async (value)=>{
        if(!value){
            return
        }
        let params = {}
        Object.assign(params,formData.value)
        delete params.children
        if(!(params.cover instanceof File)){
            delete params.cover
        }
        let result = await proxy.Request({
            url:api.saveBoard,
            params,
        })
        if(!result){
            return
        }
        dialogConfig.show = false
        proxy.Message.success('保存成功')
        emit('submitForm')
    })
}
</script>

<style lang="scss">

</style>