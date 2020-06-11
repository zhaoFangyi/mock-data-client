import axios from 'axios'

export default {
  // repository
  getRepositoryList (params) {
    return axios.get('/repository/owned', {
      params
    })
  },
  getRepositoryById (params) {
    return axios.get('/repository/getById', {
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
  // interface
  getInterfaceById (params) {
    return axios.get('/interface/getById', {
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
  saveItfAndMock (params) {
    return axios.post('/interface/saveAndMock', params)
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
  },
  exportOneRepo (params) {
    return axios.get('/plugin/export', {
      params
    })
  },
  getTaskTypeList (params) {
    return axios.post('/api/monitor/task/getTaskTypeList', params)
  }
}
