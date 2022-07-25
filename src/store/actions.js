import api from '@/data/api'
import * as types from './mutation-types'

export const test = function (params) {
}

export const getRepository = async function ({ getters, commit, dispatch }, id) {
  try {
    const res = await api.getRepositoryById({ id })
    commit(types.REPOSITORY_SET, res.data)
    commit(types.INTERFACE_ID_CUR_SET, getters.curItf)
    await dispatch('getCurItf')
    commit(types.EXPECT_ID_CUR_SET, getters.curExpect)
    dispatch('getMockDataList', getters.curExpect.id)
  } catch (err) {
    console.log(err)
  }
}

// export const refreshRepository = async function () {

// }

export const getCurItf = async function ({ state, getters, commit, dispatch }, payload) {
  const params = {
    id: state.curItfId,
    ...payload
  }
  const res = await api.getInterfaceById(params)
  // commit(types.INTERFACE_CUR_SET, res.data)
  const expects = res.data.expect
  commit(types.EXPECTED_SET, expects)
  // commit(types.MOCKDATA_SET, res.data.mockData)
  // commit(types.MOCKDATA_ID_CUR_SET, res.data.mockData[0])
  dispatch('getMockDataList', expects[0].id)
}

export const updateInterface = async function ({ commit }, payload) {
  const result = await api.updateInterface(payload)
  commit(types.UPDATE_INTERFACE_SUCCEEDED, result.data)
}

export const createInterface = async function ({ commit }, payload) {
  const result = await api.createInterface(payload)
  commit(types.CREATE_INTERFACE_SUCCEEDED, result.data)
}

export const deleteInterface = async function ({ getters, commit, dispatch }, payload) {
  await api.deleteInterface(payload)
  commit(types.DELETE_INTERFACE_SUCCEEDED, payload.id)
  commit(types.INTERFACE_ID_CUR_SET, getters.curItf)
  await dispatch('getCurItf')
  // commit(types.INTERFACE_CUR_SET)
}

export const moveInterface = async function ({ state, getters, commit, dispatch }, payload) {
  try {
    payload.interfaceId = state.curItfId
    await api.moveInterface(payload)
    const repository = state.repository
    // commit(types.MOVE_INTERFACE_SUCCEEDED, payload)
    dispatch('getRepository', repository.id)
  } catch (error) {
    console.log(error)
    // commit(types.MOVE_INTERFACE_FAILED, payload)
  }
  // commit(types.INTERFACE_ID_CUR_SET, getters.curItf)
  // await dispatch('getCurItf')
  // commit(types.INTERFACE_CUR_SET)
}
export const updateMockData = async function ({ commit }, payload) {
  const result = await api.updateMockData(payload)
  commit(types.UPDATE_MOCKDATA_SUCCEEDED, result.data)
}

export const createMockData = async function ({ commit }, payload) {
  const result = await api.createMockData(payload)
  commit(types.CREATE_MOCKDATA_SUCCEEDED, result.data)
}

export const deleteMockData = async function ({ getters, commit, dispatch }, payload) {
  await api.deleteMockData(payload)
  commit(types.DELETE_MOCKDATA_SUCCEEDED, payload.id)
  commit(types.MOCKDATA_ID_CUR_SET, getters.curMockData)
  // dispatch('getCurItf')

  // commit(types.INTERFACE_CUR_SET)
}

export const sortMockDataList = async function ({ commit }, ids) {
  try {
    const count = await api.sortMockDataList({ ids })
    console.log('count', count)
    commit(types.SORT_MOCKDATA_SUCCEEDED, { count, ids })
  } catch (error) {
    console.error(error)
    // commit(types.SORT_MOCKDATA_FAILED, error)
  }
}

export const sortInterfaceList = async function ({ commit }, ids) {
  try {
    const count = await api.sortInterfaceList({ ids })
    console.log('count', count)
    commit(types.SORT_INTERFACE_SUCCEEDED, { count, ids })
  } catch (error) {
    console.error(error)
    // commit(types.SORT_MOCKDATA_FAILED, error)
  }
}

export const getMockDataList = async function ({ getters, commit, dispatch }, id) {
  try {
    const res = await api.getMockDataList({ expectId: id })
    commit(types.MOCKDATA_SET, res.data)
  } catch (error) { }
}

export const createExpect = async function ({ commit }, payload) {
  try {
    const result = await api.createExpect(payload)
    commit(types.CREATE_EXPECT_SUCCEEDED, result.data)
  } catch (error) { }
}
export const deleteExpect = async function ({ getters, commit, dispatch }, payload) {
  try {
    const id = payload.id
    await api.deleteExpect(payload)
    commit(types.DELETE_EXPECT_SUCCEEDED, id)
  } catch (error) { }
}
export const updateExpect = async function ({ getters, commit, dispatch }, payload) {
  try {
    const result = await api.updateExpect(payload)
    commit(types.UPDATE_EXPECT_SUCCEEDED, result.data)
    await dispatch('getCurItf')
  } catch (error) { }
}
export const sortExpectList = async function ({ commit }, ids) {
  try {
    const count = await api.sortExpectList({ ids })
    commit(types.SORT_EXPECT_SUCCESSDED, { count, ids })
  } catch (error) {
  }
}
