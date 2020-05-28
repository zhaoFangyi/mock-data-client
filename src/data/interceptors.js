import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = '/api'

axios.interceptors.response.use(
  response => {
    return Promise.resolve(response.data)
  }
)

Vue.use({
  install () {
    Vue.prototype.$http = axios
  }
})
