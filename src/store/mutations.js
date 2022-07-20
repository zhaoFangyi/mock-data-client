import * as types from './mutation-types'

const mutations = {
  [types.REPOSITORIES_SET] (state, list) {
    state.repositories = list
  },
  [types.REPOSITORY_SET] (state, repository) {
    state.repository = repository
  },

  [types.INTERFACE_SET] (state, interfaces) {
    state.itfs = interfaces
  },
  [types.INTERFACE_ID_CUR_SET] (state, payload = {}) {
    state.curItfId = payload.id
  },

  [types.UPDATE_INTERFACE_SUCCEEDED] (state, data) {
    const repository = state.repository
    const itfId = data.id
    repository.interfaces = repository.interfaces.map(itf => {
      if (itf.id !== itfId) {
        return itf
      }
      return {
        ...data
      }
    })
    state.repository = repository
  },
  [types.CREATE_INTERFACE_SUCCEEDED] (state, data) {
    const repository = state.repository
    repository.interfaces = [data, ...repository.interfaces]
    state.repository = repository
  },
  [types.DELETE_INTERFACE_SUCCEEDED] (state, itfId) {
    const repository = state.repository
    repository.interfaces = repository.interfaces.filter(itf => itf.id !== itfId)
    state.repository = repository
  },

  [types.SORT_INTERFACE_SUCCEEDED] (state, { ids }) {
    const repo = state.repository
    const itfIdsMap = {}
    ids.forEach((id, index) => {
      itfIdsMap[id] = index
    })
    state.repository = {
      ...repo,
      interfaces: [...repo.interfaces].sort((a, b) => itfIdsMap[a.id] - itfIdsMap[b.id])
    }
  },

  [types.MOCKDATA_SET] (state, mockData) {
    state.mockData = mockData
      .map(item => {
        return Object.assign({}, item, { res_body: JSON.parse(item.res_body || '{}') })
      })
  },
  [types.MOCKDATA_ID_CUR_SET] (state, payload = {}) {
    state.curMockId = payload.id
  },
  [types.CHANGE_MOCKDATA_FIELD] (state, { obj, field, value, newKey, remove } = {}) {
    (remove || newKey) && delete obj[field]
    !remove && (obj[newKey || field] = value)
  },
  [types.UPDATE_MOCKDATA_SUCCEEDED] (state, data) {
    data.res_body = JSON.parse(data.res_body || '{}')
    let mockData = state.mockData
    const itfId = data.id
    mockData = mockData.map(itf => {
      if (itf.id !== itfId) {
        return itf
      }
      return {
        ...itf,
        ...data
      }
    })
    state.mockData = mockData
  },
  [types.CREATE_MOCKDATA_SUCCEEDED] (state, data) {
    data.res_body = JSON.parse(data.res_body || '{}')
    let mockData = state.mockData
    mockData = [...mockData, data]
    state.mockData = mockData
  },
  [types.DELETE_MOCKDATA_SUCCEEDED] (state, itfId) {
    let mockData = state.mockData
    mockData = mockData.filter(itf => itf.id !== itfId)
    state.mockData = mockData
  },
  [types.SORT_MOCKDATA_SUCCEEDED] (state, { ids }) {
    const mockData = state.mockData
    const mockIdsMap = {}
    ids.forEach((id, index) => {
      mockIdsMap[id] = index
    })
    state.mockData = [...mockData].sort((a, b) => mockIdsMap[a.id] - mockIdsMap[b.id])
  },
  [types.CREATE_EXPECT_SUCCEEDED] (state, data) {
    const interfaceId = data.interfaceId
    const { interfaces } = state.repository
    const itfs = interfaces.find(i => i.id === interfaceId)
    itfs.expect = [...itfs.expect, data]
  },
  [types.DELETE_EXPECT_SUCCEEDED] (state, data) {

  },
  [types.UPDATE_EXPECT_SUCCEEDED] (state, data) {
  },
  [types.EXPECTED_SET] (state, data) {
    state.mockData = data.map(item => {
      return Object.assign({}, item, { res_body: JSON.parse(item.res_body || '{}') })
    })
  }
}

export default mutations
