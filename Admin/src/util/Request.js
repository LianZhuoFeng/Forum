import axios from 'axios'
import { ElLoading } from 'element-plus'
import Message from '@/util/Message.js'
import router from '../router'
import { Loading } from 'element-plus/es/components/loading/src/service'
const contentTypeForm = 'application/x-www-form-urlencoded;charset=utf-8'
const contentTypeJson = 'application/json;charset=utf-8'

const Service = axios.create({
    timeout: 30 * 1000,
    baseURL: '/api',
})
// 请求拦截
let loadingObj = null;
Service.interceptors.request.use(config => {
    if (config.showLoading) {
        loadingObj = ElLoading.service({
            lock: true,
            text: '请求中',
            background: 'rgba(0, 0, 0, 0.7)',
        })
    }
    return config
}, (error) => {
    if (error.conifg.showLoading && loadingObj) {
        loadingObj.close()
    }
    Message.error('请求发送失败')
    return Promise.reject('请求发送失败')
})
// 响应拦截
Service.interceptors.response.use(res => {
    const { showLoading, errorCallback, showError } = res.config
    if (showLoading && loadingObj) {
        loadingObj.close()
    }
    const responseData = res.data
    if (responseData.code == 200) {
        return responseData
    } else if (responseData.code == 901) {
        setTimeout(()=>{
            router.push("/login")
        },2000)
        return Promise.reject({ showError: false, msg: '登录超时' })
    } else {
        if (errorCallback) {
            errorCallback(responseData)
        }
        return Promise.reject({ showError: showError, msg: responseData.info })
    }
}, error => {
    if (error.config.showLoading && Loading) {
        loadingObj.close()
    }
    return Promise.reject({ showError: true, msg: '网络异常' })
}

)


const request = (config) => {
    const { url, params, dataType, showLoading = true, errorCallback, showError = true } = config
    let contentType = contentTypeForm
    let formData = new FormData()
    for (let key in params) {
        formData.append(key, params[key] == undefined ? '' : params[key])
    }
    if (dataType != null && dataType === 'json') {
        contentType = contentTypeJson
    }
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
    }
    return Service.post(url, formData, {
        headers: headers,
        showLoading: showLoading,
        errorCallback: errorCallback,
        showError: showError
    }).catch(error => {
        if (error.showError) {
            Message.error(error.msg)
        }
        return null
    })
}
export default request;