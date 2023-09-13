<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="400px"
    :showCancel="false"
    @close="closeDialog"
  >
    <el-form
      class="login-register"
      :model="formData"
      :rules="rules"
      ref="formDataRef"
    >
      <el-form-item prop="email">
        <el-input
          size="large"
          clearable
          placeholder="请输入邮箱"
          v-model="formData.email"
          maxLength="150"
        >
          <template #prefix>
            <i class="iconfont icon-email"></i>
          </template>
        </el-input>
      </el-form-item>
      <!-- 登录密码 -->
      <el-form-item prop="password" v-if="opType == 1">
        <el-input
          :type="passwordEyeType.passwordEyeOpen ? 'text' : 'password'"
          size="large"
          type="password"
          placeholder="请输入密码"
          v-model="formData.password"
          @keyup.enter="doSubmit"
        >
          <template #prefix>
            <i class="iconfont icon-password"></i>
          </template>
          <template #suffix>
            <i
              @click="eyeChange('passwordEyeOpen')"
              :class="[
                'iconfont',
                passwordEyeType.passwordEyeOpen ? 'icon-eye1' : 'icon-no_eye',
              ]"
            ></i>
          </template>
        </el-input>
      </el-form-item>
      <!-- 注册 -->
      <div v-if="opType == 0 || opType == 2">
        <el-form-item prop="emailCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入邮箱验证码"
              v-model="formData.emailCode"
            >
              <template #prefix>
                <i class="iconfont icon-yanzhengyanzhengma"></i>
              </template>
            </el-input>
            <el-button
              type="primary"
              class="send-mail-btn"
              size="large"
              @click="showSendEmailDialgo"
              >获取邮箱验证码</el-button
            >
          </div>
          <el-popover placement="left" :width="460" trigger="click">
            <div>
              <p>1、在垃圾箱中查找邮箱验证码</p>
              <p>2、在邮箱中头像->设置->反垃圾->白名单->设置邮箱地址白名单</p>
              <p>3、将邮箱【2942156707@qq.com】添加至白名单</p>
            </div>
            <template #reference>
              <span class="a-link" :style="{ 'font-size': '14px' }">
                未收到邮箱验证码?
              </span>
            </template>
          </el-popover>
        </el-form-item>

        <el-form-item prop="nickName" v-if="opType == 0">
          <el-input
            size="large"
            clearable
            placeholder="请输入昵称"
            v-model="formData.nickName"
            maxLength="20"
          >
            <template #prefix>
              <i class="iconfont icon-account"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="registerPassword">
          <el-input
            :type="passwordEyeType.regpasswordEyeOpen ? 'text' : 'password'"
            size="large"
            type="password"
            placeholder="请输入密码"
            v-model="formData.registerPassword"
            
          >
            <template #prefix>
              <i class="iconfont icon-password"></i>
            </template>
            <template #suffix>
              <i
                @click="eyeChange('regpasswordEyeOpen')"
                :class="[
                  'iconfont',
                  passwordEyeType.regpasswordEyeOpen
                    ? 'icon-eye1'
                    : 'icon-no_eye',
                ]"
              ></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="reRegisterPassword">
          <el-input
            :type="passwordEyeType.reRegpasswordEyeOpen ? 'text' : 'password'"
            size="large"
            type="password"
            placeholder="请再次输入密码"
            v-model="formData.reRegisterPassword"
          >
            <template #prefix>
              <i class="iconfont icon-password"></i>
            </template>
            <template #suffix>
              <i
                @click="eyeChange('reRegpasswordEyeOpen')"
                :class="[
                  'iconfont',
                  passwordEyeType.reRegpasswordEyeOpen
                    ? 'icon-eye1'
                    : 'icon-no_eye',
                ]"
              ></i>
            </template>
          </el-input>
        </el-form-item>
      </div>

      <el-form-item prop="checkCode">
        <div class="check-code-panel">
          <el-input
            size="large"
            clearable
            placeholder="请输入验证码"
            v-model="formData.checkCode"
          >
            <template #prefix>
              <i class="iconfont icon-yanzhengyanzhengma"></i>
            </template>
          </el-input>
          <img
            :src="checkCodeUrl"
            class="check-code"
            @click="changeCheckCode(0)"
          />
        </div>
      </el-form-item>
      <el-form-item v-if="opType == 1">
        <div class="rememberme-panel">
          <el-checkbox v-model="formData.rememberMe">记住老子</el-checkbox>
        </div>
        <div class="no-account">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(2)"
            >忘记密码？</a
          >
          <a
            href="javascript:void(0)"
            class="a-link"
            @click="showPanel(0)"
            v-if="opType == 1"
            >没有账号？</a
          >
        </div>
      </el-form-item>
      <el-form-item v-if="opType == 0">
        <a href="javascript:void(0)" class="a-link" @click="showPanel(1)"
          >已有账号？</a
        >
      </el-form-item>
      <el-form-item v-if="opType == 2">
        <a href="javascript:void(0)" class="a-link" @click="showPanel(1)"
          >去登录？</a
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="op-btn" @click="doSubmit">
          <span v-if="opType == 0">注册</span>
          <span v-if="opType == 1">登录</span>
          <span v-if="opType == 2">重置密码</span>
        </el-button>
      </el-form-item>
    </el-form>
  </Dialog>
  <Dialog
    :show="dialogConfig4SendMailCode.show"
    :title="dialogConfig4SendMailCode.title"
    :buttons="dialogConfig4SendMailCode.buttons"
    width="400px"
    :showCancel="false"
    @close="dialogConfig4SendMailCode.show = false"
  >
    <el-form
      :model="formData4SendMailCode"
      :rules="rules"
      ref="formDataRef4SendMailCode"
    >
      <el-form-item label="邮箱">
        {{ formData.email }}
      </el-form-item>
      <el-form-item prop="checkCode" label="验证码">
        <div class="check-code-panel">
          <el-input
            size="large"
            placeholder="请输入验证码"
            v-model="formData4SendMailCode.checkCode"
          >
            <template #prefix>
              <i class="iconfont icon-yanzhengyanzhengma"></i>
            </template>
          </el-input>
          <img
            :src="checkCodeUrl4SendMailCode"
            class="check-code"
            @click="changeCheckCode(1)"
          />
        </div>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import md5 from 'js-md5';
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();
const route = useRoute();
const api = {
  checkCode: "/api/checkCode",
  sendEMailCode: "/sendEmailCode",
  register: "/register",
  login: "/login",
  resetPwd: "/resetPwd",
};

const opType = ref();
const showPanel = (type) => {
  opType.value = type;
  resetForm();
};

defineExpose({ showPanel });

// 关闭弹框触发
const closeDialog =()=>{
  dialogConfig.show = false
  store.commit('updateShowLogin',false)
}
// 验证码
const checkCodeUrl = ref(api.checkCode);
const checkCodeUrl4SendMailCode = ref(api.checkCode);
const changeCheckCode = (type) => {
  if (type == 0) {
    checkCodeUrl.value =
      api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  } else {
    checkCodeUrl4SendMailCode.value =
      api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  }
};
//发送邮箱验证码弹框
const formData4SendMailCode = ref({});
const formDataRef4SendMailCode = ref();
const dialogConfig4SendMailCode = reactive({
  show: false,
  title: "获取邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      click: () => {
        sendEmailCode();
      },
    },
  ],
});
const showSendEmailDialgo = () => {
  formDataRef.value.validateField("email", (valid) => {
    if (!valid) {
      return;
    }
    dialogConfig4SendMailCode.show = true;
    nextTick(() => {
      changeCheckCode(1);
      formDataRef4SendMailCode.value.resetFields();
      formData4SendMailCode.value = {
        email: formData.value.email,
      };
    });
  });
};
//发送邮件
const sendEmailCode = () => {
  formDataRef4SendMailCode.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData4SendMailCode.value);
    params.type = opType.value == 0 ? 0 : 1;
    let result = await proxy.Request({
      url: api.sendEMailCode,
      params: params,
      errorCallback: () => {
        changeCheckCode(1);
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("验证码发送成功，请登录邮箱查看");
  });
};
// 登录、注册、重置密码 提交表单
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData.value);
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.registerPassword;
      delete params.registerPassword;
      delete params.reRegisterPassword;
    }
    let url = null;
    if (opType.value == 0) {
      url = api.register;
    } else if (opType.value == 1) {
      url= api.login;
    } else if (opType.value == 2) {
      url = api.resetPwd;
    }
    // 登录
    if(opType.value == 1){
      let cookieLoginInfo = proxy.VueCookies.get('loginInfo')
      let cookiePassword = cookieLoginInfo == null? null:cookieLoginInfo.password
      if(params.password !== cookiePassword){
        params.password = md5(params.password)
      }

    }
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changeCheckCode(0);
      },
    });
    if (!result) {
      return;
    }
    if (opType.value == 0) {
      // 注册
      proxy.Message.success("注册成功，请登录");
      showPanel(1);
    } else if (opType.value == 1) {
      // 登录
      if(params.rememberMe){
        const loginInfo = {
          email:params.email,
          password:params.password,
          rememberMe:params.rememberMe
        }
        proxy.VueCookies.set('loginInfo',loginInfo,'7d')
      }else{
        proxy.VueCookies.remove('loginInfo')
      }
      dialogConfig.show = false
      store.commit('updateLoginUserInfo',result.data)
      proxy.Message.success("登录成功");
    } else if (opType.value == 2) {
      proxy.Message.success("重置密码成功，请登录");
      showPanel(1);
    }
  });
};
// 登录，注册弹出框
const dialogConfig = reactive({
  show: false,
  title: "标题",
});
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const formData = ref({});
const formDataRef = ref();
const rules = {
  email: [
    {
      required: true,
      message: "请输入邮箱",
    },
    {
      validator: proxy.veryfy.email,
      message: "请输入正确的邮箱",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
  emailCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
    },
  ],
  nickName: [
    {
      required: true,
      message: "请输入昵称",
    },
  ],
  registerPassword: [
    {
      required: true,
      message: "请输入密码",
    },
    {
      validator: proxy.veryfy.password,
      message: "密码必须包含数字和字母且长度为8-18位",
    },
  ],
  reRegisterPassword: [
    {
      required: true,
      message: "再次输入密码",
    },
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入图片验证码",
    },
  ],
};

// 密码显示隐藏操作
const passwordEyeType = reactive({
  passwordEyeOpen: false,
  regpasswordEyeOpen: false,
  reRegpasswordEyeOpen: false,
});

const eyeChange = (type) => {
  passwordEyeType[type] = !passwordEyeType[type];
};
// 重置表单
const resetForm = () => {
  dialogConfig.show = true;
  if (opType.value == 0) {
    dialogConfig.title = "注册";
  } else if (opType.value == 1) {
    dialogConfig.title = "登录";
  } else if (opType.value == 2) {
    dialogConfig.title = "重置密码";
  }
  nextTick(() => {
    changeCheckCode(0);
    formDataRef.value.resetFields();
    formData.value = {};
    // 登录
    if(opType.value == 1){
      const cookieLoginInfo = proxy.VueCookies.get('loginInfo')
      if(cookieLoginInfo){
        formData.value = cookieLoginInfo
      }
    }
  });
};
</script>

<style lang="scss">
.login-register {
  .rememberme-panel {
    width: 100%;
  }
  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .op-btn {
    width: 100%;
  }
}
.check-code-panel {
  display: flex;
  width: 100%;
  .check-code {
    margin-left: 5px;
    cursor: pointer;
  }
  .send-mail-btn {
    margin-left: 5px;
  }
}
</style>