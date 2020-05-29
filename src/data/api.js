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
  },
  updateRepository (params) {
    return axios.post('/repository/update', params)
  },
  getInterfaceList (params) {
    return axios.get('/interface/getList', {
      params
    })
  },
  createInterface (params) {
    return axios.post('/interface/create', params)
  },
  deleteInterface (params) {
    return axios.get('/interface/delete', {
      params
    })
  },
  updateInterface (params) {
    return axios.post('/interface/update', params)
  },
  // getInterfaceList (params) {
  //   return axios.get('/interface/getList', {
  //     params
  //   })
  // },
  createMockData (params) {
    return axios.post('/mockData/create', params)
  },
  deleteMockData (params) {
    return axios.get('/mockData/delete', {
      params
    })
  },
  updateMockData (params) {
    return axios.post('/mockData/update', params)
  }
}
