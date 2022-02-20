import { Commit } from 'vuex'

export enum ProjectSorting {
  Company = 'Company',
  Round = 'Round',
  Geography = 'Geography',
  Sector = 'Sector',
  Bio = 'Bio',
}

export type SortDirection = 'up' | 'down'

export enum FilterTitle {
  Company = 'company',
  Rounds = 'rounds',
  Sectors = 'sectors',
  Geos = 'geos',
  Bio = 'bio',
}

export type SortingItem = {
  readonly name: ProjectSorting
  readonly id: number
  readonly direction: SortDirection
}

export type ActiveFiltersData = {
  tab: string
  [FilterTitle.Rounds]: string[]
  [FilterTitle.Sectors]: string[]
  [FilterTitle.Geos]: string[]
}

type ProjectsState = {
  allProjects: ReadonlyArray<string>
  roundFilters: ReadonlyArray<string>
  sectorFilters: ReadonlyArray<string>
  geoFilters: ReadonlyArray<string>
  // объект, в который будем записывать активные фильтры
  activeFilters: ActiveFiltersData
}

export const state = (): ProjectsState => ({
  allProjects: [],
  roundFilters: [],
  sectorFilters: [],
  geoFilters: [],
  activeFilters: {
    tab: '',
    rounds: [],
    sectors: [],
    geos: [],
  },
})

export const getters = {
  getRoundFilters: (state: ProjectsState): ReadonlyArray<string> =>
    state.roundFilters,
  getSectorFilters: (state: ProjectsState): ReadonlyArray<string> =>
    state.sectorFilters,
  getGeoFilters: (state: ProjectsState): ReadonlyArray<string> =>
    state.geoFilters,
  getActiveFilters: (state: ProjectsState): ActiveFiltersData =>
    state.activeFilters,

}

export const mutations = {
  SET_ALL_PROJECTS(state: ProjectsState, payload: ReadonlyArray<any>) {
    state.allProjects = payload
  },
  SET_ROUND_FILTERS(state: ProjectsState) {
    const roundsFromProjectList = state.allProjects.map((x: any) => x.round)
    const uniqueRounds = Array.from(new Set(roundsFromProjectList))
    const sorted = uniqueRounds.sort((a, b) => a.localeCompare(b))
    state.roundFilters = sorted
  },
  SET_SECTOR_FILTERS(state: ProjectsState) {
    const sectorsFromProjectList = state.allProjects.map(
      (x: any) => x.sector
    )
    const uniqueSectors = Array.from(new Set(sectorsFromProjectList))
    const sorted = uniqueSectors.sort((a, b) => a.localeCompare(b))
    state.sectorFilters = sorted
  },
  SET_GEO_FILTERS(state: ProjectsState) {
    const geosFromProjectList = state.allProjects.map(
      (x: any) => x.location
    )
    const uniqueGeos = Array.from(new Set(geosFromProjectList))
    const sorted = uniqueGeos.sort((a, b) => a.localeCompare(b))
    state.geoFilters = sorted
  },

  SET_ACTIVE_FILTERS(state: ProjectsState, payload: ActiveFiltersData) {
    state.activeFilters = payload
  },
  CLEAR_ACTIVE_FILTERS(state: ProjectsState) {
    state.activeFilters = {
      tab: state.activeFilters.tab,
      rounds: [],
      sectors: [],
      geos: [],
    }
  },

}

export const actions = {

  setAllProjects(
    { commit }: { commit: Commit },
    payload: ReadonlyArray<any>
  ) {
    commit('SET_ALL_PROJECTS', payload)
    //
    commit('SET_RELEVANT_TABS')
    commit('SET_ROUND_FILTERS')
    commit('SET_SECTOR_FILTERS')
    commit('SET_GEO_FILTERS')
  },
  setActiveFilters({ commit }: { commit: Commit }, payload: ActiveFiltersData) {
    commit('SET_ACTIVE_FILTERS', payload)
  },
  clearActiveFilters({ commit }: { commit: Commit }) {
    commit('CLEAR_ACTIVE_FILTERS')
  },
}
