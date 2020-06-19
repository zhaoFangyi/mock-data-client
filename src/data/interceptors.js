import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = '/api'

axios.interceptors.response.use(
  response => {
    if (response.data.errcode !== 0) {
      Vue.prototype.$message.error(response.data.errmsg)
      return Promise.reject(response.data)
    } else {
      return Promise.resolve(response.data)
    }
  },
  response => {
    Vue.prototype.$message.error('服务器错误')
    return Promise.reject(response.data)
  }
)

Vue.use({
  install () {
    Vue.prototype.$http = axios
  }
})
