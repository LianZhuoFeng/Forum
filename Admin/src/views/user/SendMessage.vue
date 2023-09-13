<template>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      @close="dialogConfig.show = false"
    >
    <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item label="消息中心" prop="message">
        <el-input
          placeholder="请输入消息内容"
          type="textarea"
          v-model="formData.message"
          maxlength="200"
          clearable
          rows="5"
          resize="none"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="积分" prop="integral">
        <el-input
          placeholder="积分，为空或者0不增减积分，可以为负数"
          v-model="formData.integral"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    </Dialog>
  </template>
    
<script setup>
  import { ref, reactive, getCurrentInstance, nextTick } from "vue";
  import { useRouter, useRoute } from "vue-router";
  const { proxy } = getCurrentInstance();
  const router = useRouter();
  const route = useRoute();
  const api = {
    sendMessage: "/user/sendMessage",
  };
  
  const dialogConfig = reactive({
    show: false,
    title: "发送消息",
    buttons: [
      {
        type: "primary",
        text: "确定",
        click: (e) => {
          submitForm()
        },
      },
    ],
  });
  
  const formData = ref({});
  const formDataRef = ref();
  const rules = {
    message:[{required:true,message:"请输入消息内容"}]
  }
  const commentList = ref([])
  const sendMessage =async (data) => {
      dialogConfig.show = true
     nextTick(()=>{
        formDataRef.value.resetFields()
        formData.value={
            userId:data.userId,
            nickName:data.nickName
        }
     })
    };
  defineExpose({ sendMessage });

//   提交表单
const emit = defineEmits(['reload'])
const submitForm = ()=>{
    formDataRef.value.validate(async (valid)=>{
        if(!valid){
            return
        }
        let params = Object.assign({},formData.value)
        let result =await proxy.Request({
            url:api.sendMessage,
            params,
        })
        if(!result){
            return
        }
        dialogConfig.show=false
        proxy.Message.success('发送成功')
        emit('reload')
    })
}
  </script>
    
  <style lang="scss" scoped>
  .comment-list{
      .comment-item{
          margin-top:10px;
          border-bottom:1px solid #ddd;
          padding:10px 0px;
          .p-comment-item{
              display:flex;
              .content-info{
                  margin-left:5px;
                  .comment-content{
                      margin:5px 0px;
                  }
                  .s-comment-item{
                      display: flex;
                      margin-top:10px ;
                  }
                  .post-info{
                      font-size:12px;
                      color:rgb(135,130,130)
                  }
              }
          }
      }
  }
  </style>