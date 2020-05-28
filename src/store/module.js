import Vue from 'vue'

const state = {
  selected: null,
  inspectedInstance: {},
  inspectedInstanceId: null,
  loading: false,
  instances: [],
  instancesMap: {},
  expansionMap: {},
  events: [],
  scrollToExpanded: null
}

const getters = {}

const mutations = {
  FLUSH (state, payload) {
    const map = {}
    function walk (instance) {
      map[instance.id] = instance
      if (instance.children) {
        instance.children.forEach(child => {
          child.parent = instance
          walk(child)
        })
      }
    }
    payload.instance.forEach(walk)

    // Mutations
    state.instances = Object.freeze(payload.instance)
    state.inspectedInstance = Object.freeze(payload.inspectedInstance)
    state.inspectedInstanceId = state.inspectedInstance ? state.inspectedInstance.id : null
    state.instancesMap = Object.freeze(map)
  },
  INSPECT_INSTANCE (state, instance) {
    state.inspectedInstanceId = instance.id
    state.loading = true
  },
  RECEIVE_INSTANCE_DETAILS (state, instance) {
    state.inspectedInstance = Object.freeze(instance)
    state.inspectedInstanceId = instance.id
    state.scrollToExpanded = null
  },
  TOGGLE_INSTANCE (state, { id, expanded, scrollTo = null } = {}) {
    Vue.set(state.expansionMap, id, expanded)
    state.scrollToExpanded = scrollTo
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
