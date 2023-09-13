import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//引入cookies
import VueCookies from 'vue-cookies'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/base.scss'
// 全局组件
import Dialog from '@/components/Dialog.vue'
import Avatar from '@/components/Avatar.vue'
import Cover from '@/components/Cover.vue'
import Table from '@/components/Table.vue'
import CoverUpload from '@/components/CoverUpload.vue'

// 全局方法
import veryfy from '@/util/veryfy.js'
import Message from '@/util/Message.js'
import Request from '@/util/Request.js' 
import Util from '@/util/Util.js'
import Confirm from '@/util/Confirm.js'
const app = createApp(App)

app.use(router)
app.use(ElementPlus);

app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.globalInfo = {
    bodyWidth : 1300,
    avatarUrl:'/api/file/getAvatar/',
    imageUrl:'/api/file/getImage/',
    webDomain:'http://116.62.130.112:8010/'
}
app.config.globalProperties.veryfy = veryfy
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request
app.config.globalProperties.Util = Util
app.config.globalProperties.Confirm = Confirm


app.component('Dialog',Dialog)
app.component('Avatar',Avatar)
app.component('Cover',Cover)
app.component('Table',Table)
app.component('CoverUpload',CoverUpload)

app.mount('#app')
