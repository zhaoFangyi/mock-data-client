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
  sortInterfaceList (params) {
    return axios.post('/interface/sort', params)
  },
  saveItfAndMock (params) {
    return axios.post('/interface/saveAndMock', params)
  },
  // 1 move 2 copy
  moveInterface (params) {
    return axios.post('/interface/move', params)
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
  sortMockDataList (params) {
    return axios.post('/mockData/sort', params)
  },
  exportOneRepo (params) {
    return axios.get('/plugin/export', {
      params
    })
  },
  getTaskTypeList (params) {
    return axios.post('/api/monitor/task/getTaskTypeList', params)
  },
  bulkImport (params) {
    return axios.post('/interface/bulkImport', params)
  },
  // expect 期望
  getExpectList (params) {
    return axios.get('/expect/getList', {
      params
    })
  },
  createExpect (params) {
    return axios.post('/expect/create', params)
  }
}
