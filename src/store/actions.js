import api from '@/data/api'
import * as types from './mutation-types'

export const test = function (params) {
}

export const getRepository = async function ({ getters, commit, dispatch }, id) {
  try {
    const res = await api.getRepositoryById({ id })
    commit(types.REPOSITORY_SET, res.data)
    commit(types.INTERFACE_ID_CUR_SET, getters.curItf)
    dispatch('getCurItf')
  } catch (err) {
    console.log(err)
  }
}

export const getCurItf = async function ({ state, getters, commit }, payload) {
  const params = {
    id: state.curItfId,
    ...payload
  }
  const res = await api.getInterfaceById(params)
  // commit(types.INTERFACE_CUR_SET, res.data)
  commit(types.MOCKDATA_SET, res.data.mockData)
  commit(types.MOCKDATA_ID_CUR_SET, res.data.mockData[0])
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
