import axios from 'axios'

export default {
  getRepositoryList (params) {
    return axios.get('/repository/getList', {
      params
    })
  },
  deleteRepository (params) {
    return axios.get('/repository/delete', {
      params
    })
  },
  createRepository (params) {
    return axios.post('/repository/create', params)
  }
}
