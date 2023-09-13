<template>
  <div class="post-comment-panel">
    <Avatar :width="avatarWidth" :userId="userId"></Avatar>
    <div class="comment-form">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="content">
          <el-input
            v-model="formData.content"
            clearable
            :placeholder="placeholderInfo"
            type="textarea"
            :maxlength="800"
            show-word-limit
            resize="none"
          />
          <div class="insert-img" v-if="showInserImg">
            <div class="pre-img" v-if="commentImg">
              <CommentImage :src="commentImg"></CommentImage>
              <i class="iconfont icon-closefill" @click="removeCommentImg"></i>
            </div>
            <el-upload
            v-else
              name="file"
              :show-file-list="false"
              accept=".png,.PNG,.jpg,.JPG,.jepg,JEPG,.gif,.GIF,.bmp,.BMP"
              :multiple="false"
              :http-request="selectImg"
            >
              <i class="iconfont icon-image"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="send-btn" @click="postCommentDo">发表</div>
  </div>
</template>

<script setup>
import CommentImage from '@/views/forum/CommentImage.vue';
import {ref,reactive, getCurrentInstance} from 'vue'
import {useRouter,useRoute} from 'vue-router'
const {proxy} =getCurrentInstance()
const router = useRouter()
const route = useRoute()
const api = {
    postComment:"/comment/postComment"
}
const props = defineProps({
    articleId:{
        type:String
    },
    pCommentId:{
        type:Number
    },
    replyUserId:{
        type:String,
    },
    avatarWidth:{
        type:Number,
    },
    userId:{
        type:String
    },
    showInserImg:{
        type:Boolean,
    },
    placeholderInfo:{
        type:String,
        default:'请文明发言，做个讲礼貌的程序员'
    }
})

// form信息
const checkPostComment = (rule,value,callback)=>{
  if(value == null&&formData.value.image==null){
    callback(new Error(rule.message))
  }else{
    callback()
  }
}
const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [
    { required: true, message: "请输入评论内容",validator:checkPostComment },
    {
      min:5,message:"评论最少5个字"
    }],
};
const emit =defineEmits(["postCommentFinish"])
// 发表评论
const postCommentDo = ()=>{
    formDataRef.value.validate(async(valid) => {
    let params = Object.assign({},formData.value)
    params.articleId = props.articleId
    params.pCommentId = props.pCommentId
    params.replyUserId = props.replyUserId
    let result = await proxy.Request({
        url:api.postComment,
        params:params
    })
    if(!result){
        return
    }
    proxy.Message.success("评论发表成功")
    formDataRef.value.resetFields()
    removeCommentImg()
    emit("postCommentFinish",result.data)
  });
}
//选择图片
const commentImg = ref(null)
const selectImg = (file) => {
  file = file.file
  let img = new FileReader()
  img.readAsDataURL(file)
  img.onload = ({target})=>{
    console.log(target);
    let imgData = target.result
    commentImg.value = imgData
    formData.value.image = file
  }
};
// 删除评论发表时的图片
const removeCommentImg = ()=>{
  commentImg.value = null
  formData.value.image = null
}
</script>

<style lang="scss">
.post-comment-panel{
    display: flex;
    align-items: top;
    .comment-form {
      flex: 1;
      margin: 0px 10px;
      .el-textarea__inner {
        height: 60px;
      }
      .insert-img{
        line-height: normal;
        .iconfont{
          margin-top: 3px;
          font-size: 20px;
          color:#3f3f3f;
          cursor: pointer;
        }
        .pre-img{
          position: relative;
          margin-top: 10px;
          .iconfont{
            position: absolute;
            top:-10px;
            right: -10px;
            color:rgb(121,121,121);
            cursor: pointer;
          }
        }
      }
    }
    .send-btn {
      width: 60px;
      height: 60px;
      background: #6ca1f7;
      color: #fff;
      text-align: center;
      line-height: 60px;
      border-radius: 5px;
      cursor: pointer;
    }
}
</style>