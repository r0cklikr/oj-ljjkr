import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: 'http://101.34.58.190:8081',
  timeout: 5000
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {  // 修改这里，判断 code === 200
      return res
    }
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(res.message || '请求失败')
  },
  error => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default service