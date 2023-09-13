<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">论坛管理员登录</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="account">
          <el-input
            clearable
            placeholder="请输入账号"
            v-model="formData.account"
            size="large"
          >
            <template #prefix>
              <i class="iconfont icon-account"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            clearable
            placeholder="请输入密码"
            v-model="formData.password"
            type="password"
            size="large"
          >
            <template #prefix>
              <i class="iconfont icon-password"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              clearable
              placeholder="请输入验证码"
              v-model="formData.checkCode"
              class="input-panel"
              size="large"
              @keyup.enter="login"
            >
              <template #prefix>
                <i class="iconfont icon-yanzhengyanzhengma"></i>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl"
              class="check-code"
              @click="changeCheckCode"
            />
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="login"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import md5 from 'js-md5';
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  checkCode: "/api/checkCode",
  login: "/login",
};
const formData = ref({});
const formDataRef = ref();
const rules = {
  account: [{ require: true, message: "请输入账号" }],
  password: [{ require: true, message: "请输入密码" }],
  checkCode: [{ require: true, message: "请输入验证码" }],
};
const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
};
const login = () => {
    formDataRef.value.validate(async (valid)=>{
        if(!valid){
            return
        }
        let params = Object.assign({},formData.value)
        params.password = md5(params.password)
        let result = await proxy.Request({
            url:api.login,
            params:params,
            errorCallback:()=>{
                changeCheckCode()
            },
        })
        if(!result){
            return
        }
        proxy.Message.success("登录成功",()=>{
            router.push("/")
        });
        proxy.VueCookies.set("userInfo",result.data,0)
    })
};
</script>

<style lang="scss" scoped>
.login-body {
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url(../assets/dc6c598cba00a0d6870d9192f2e7a73.jpg);
  .login-panel {
    margin-top: 150px;
    width: 350px;
    float: right;
    margin-right: 100px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 2px 2px 10px #ddd;
    border-radius: 5px;
  }
  .login-title {
    font-size: 25px;
    text-align: center;
    margin-bottom: 10px;
  }
  .check-code-panel {
    width: 100%;
    display: flex;
    align-items: center;
    .input-panel {
      flex: 1;
      margin-right: 5px;
    }
    .check-code {
      cursor: pointer;
    }
  }
}
</style>