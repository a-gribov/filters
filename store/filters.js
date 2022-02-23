const state = () => ({
  activeFilters: {
    artist: [],
    album: []
  }
})

// getters
const getters = {
  getActiveFilters: state => state.activeFilters
}

// mutations
const mutations = {
  CHANGE_FILTER(state, payload) {
    state.activeFilters = payload
  }
}

// actions
const actions = {
  setActiveFilters({ commit, state }, filterObject) {
    commit('CHANGE_FILTER', filterObject)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
