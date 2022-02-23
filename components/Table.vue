<template>
  <div class="section">
    <div class="container">
      <div class="wrapper">
        <div class="table">
          <div
            class="title-item"
            v-for="(item, index) in filtersData"
            :key="index"
          >
            <div
              v-if="item.options"
              class="button-box"
              @click="openFilter(item.id)"
            >
              <button class="button" type="button">
                <span>{{ item.title }}</span>
              </button>
              <VueSlideToggle :open="item.id === openFilterId" :duration="300">
                <div class="select-list">
                  <div
                    v-for="(filter, index) in item.options"
                    :key="index"
                    class="value-row"
                  >
                    <label>
                      <input
                        type="checkbox"
                        name="project-filters"
                        class="visually-hidden select-item"
                        :value="filter"
                        :checked="filter.isChecked"
                        @change="setFilter(item.id, filter.title)"
                      />
                      <span class="value">{{ filter.title }}</span>
                    </label>
                  </div>
                </div>
              </VueSlideToggle>
            </div>
            <div v-else>
              <div class="no-button">
                <span>{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rows">
          <div
            v-for="(object, index) in filteredPreparedProjects"
            :key="index"
            class="row"
          >
            <div class="col">{{ object.artist }}</div>
            <div class="col">{{ object.name }}</div>
            <div class="col">{{ object.album }}</div>
            <div class="col">{{ object.duration }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { VueSlideToggle } from 'vue-slide-toggle'

export type Headings = {
  readonly title: string
}
export type TableItem = {
  readonly artist: string
  readonly name: string
  readonly album: string
  readonly duration: string
}

export type TableData = {
  readonly headings: ReadonlyArray<Headings>
  readonly list: ReadonlyArray<TableItem>
}

export default {
  name: 'Table',
  components: { VueSlideToggle },
  props: {
    tableData: {
      type: Object as PropType<TableData>,
      required: true,
    },
  },
  data() {
    return {
      openFilterId: '-1',
      preparedAllProjects: [] as Array<any>,
      tableDataNew: [] as Array<any>,
    }
  },
  computed: {
    ...mapGetters({
      activeFilters: 'filters/getActiveFilters',
    }),
    artistF(): any {
      const artistFromList = this.tableData.list.map((x: TableItem) => x.artist)
      const uniqueArtist = Array.from(new Set(artistFromList))
      return uniqueArtist.sort((a, b) => a.localeCompare(b))
    },
    albumF(): any {
      const albumFromList = this.tableData.list.map((x: TableItem) => x.album)
      const uniqueAlbum = Array.from(new Set(albumFromList))
      return uniqueAlbum.sort((a, b) => a.localeCompare(b))
    },

    filtersData(): ReadonlyArray<any> {
      const data = [
        {
          id: this.tableData.headings[0],
          title: this.tableData.headings[0],
          options: this.artistF.map((x: string) => ({
            title: x,
            isChecked: false,
          })),
        },
        {
          id: this.tableData.headings[1],
          title: this.tableData.headings[1],
        },
        {
          id: this.tableData.headings[2],
          title: this.tableData.headings[2],
          options: this.albumF.map((x: string) => ({
            title: x,
            isChecked: false,
          })),
        },
        {
          id: this.tableData.headings[3],
          title: this.tableData.headings[3],
        },
      ]

      return data
    },

    filteredPreparedProjects(): ReadonlyArray<any> {
      const filtersObj = JSON.parse(JSON.stringify(this.activeFilters)) as any

      const filteredBySelection = this.preparedAllProjects.filter((x: any) => {
        const isAlbumFilter =
          filtersObj.album.length === 0
            ? true
            : filtersObj.album.includes(x.album)
        const isArtistFilter =
          filtersObj.artist.length === 0
            ? true
            : filtersObj.artist.includes(x.artist)

        const isTotallyOk = isAlbumFilter && isArtistFilter

        return isTotallyOk
      })

      return filteredBySelection
    },
  },
  created() {
    if (process.browser) {
      this.addListeners()
    }
  },
  beforeDestroy() {
    this.removeListeners()
  },
  methods: {
    ...mapActions({
      saveActiveFiltersInStore: 'filters/setActiveFilters',
    }),
    saveActiveFilters(filterObject: any): void {
      this.saveActiveFiltersInStore(filterObject)
    },
    addListeners(): void {
      document.addEventListener('click', this.checkClickTarget)
    },
    removeListeners(): void {
      document.removeEventListener('click', this.checkClickTarget)
    },
    checkClickTarget(event: MouseEvent): void {
      if (!event.target) {
        console.warn('не обнаружен event.target в TitleItem.vue')
        return
      }

      let targetElement = event.target as HTMLElement
      let isOutside = true

      do {
        if (
          targetElement.classList &&
          targetElement.classList.contains('button-box')
        ) {
          isOutside = false
          return
        }

        targetElement = targetElement.parentNode as HTMLElement
      } while (targetElement)

      if (isOutside) {
        this.openFilterId = '-1'
      }
    },
    openFilter(id: string) {
      this.openFilterId === id
        ? (this.openFilterId = '-1')
        : (this.openFilterId = id)
    },
    setFilter(filterId: string, valueName: string): void {
      const id = filterId as 'album' | 'artist'
      const localActiveFilters = JSON.parse(JSON.stringify(this.activeFilters))

      if (localActiveFilters[id].length === 0) {
        localActiveFilters[id].push(valueName)
      } else {
        const isInStore = localActiveFilters[id].includes(valueName)
        if (isInStore) {
          const index = localActiveFilters[id].indexOf(valueName)
          localActiveFilters[id].splice(index, 1)
        } else {
          localActiveFilters[id].push(valueName)
        }
      }
      this.saveActiveFilters(localActiveFilters)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableDataNew = this.tableData.list.slice()

      this.preparedAllProjects = this.tableDataNew.map((x: any) => {
        const preparedProject: any = {
          ...x,
          allFilters: [x.album, x.artist],
        }
        return preparedProject
      })
    })
  },
}
</script>

<style lang="scss" scoped>
.section {
  padding: 3rem 6rem;
}
.container {
  max-width: 100rem;
  margin: 0 auto;
  width: 100%;
}
.wrapper {
  position: relative;
}
.table {
  display: flex;
  position: absolute;
  justify-content: space-between;
  width: 100%;
}
.rows {
  padding-top: 4rem;
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  margin-top: 1.5rem;
  justify-content: space-between;
}
.col {
  width: 20%;
}

.title-item {
  color: black;
  width: 20%;
}

.button-box {
  position: relative;
  background-color: gray;
  overflow: hidden;
}

.button {
  outline: none;
  border: 0;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 4rem 1rem 2rem;

  span {
    display: inline-block;
  }

  span + span {
    margin-left: 0.5rem;
  }

  &:after {
    content: '';
    position: absolute;
    top: 38%;
    right: 2rem;
    display: block;
    width: 6px;
    height: 6px;
    border-top: 2px solid currentColor;
    border-right: 2px solid currentColor;
    user-select: none;
    transform: rotate(135deg);
    transform-origin: center center;
    cursor: pointer;
    transition: rotate 0.3s ease-in-out, transform 0.3s ease-in-out;
  }
}

.no-button {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  padding-right: 4rem;
}

.select-list {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.value-row + .value-row {
  margin-top: 1.6rem;
}

label {
  position: relative;
  display: block;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: darken(gray, 10%);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0.8rem;
    right: 0;
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 1px;
    transform: translateY(-50%);
    box-sizing: border-box;
    cursor: pointer;
  }
}

.visually-hidden {
  position: absolute !important;
  overflow: hidden !important;
  clip: rect(0 0 0 0);
  height: 1px !important;
  width: 1px !important;
  margin: -1px !important;
  padding: 0 !important;
  border: 0 !important;
}

.value {
  display: inline-block;
  max-width: 80%;
  user-select: none;
}

input {
  &:checked + .value {
    &::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 0;
      display: block;
      width: 10px;
      height: 10px;
      background-color: green;
    }

    @media (min-width: 1023px) and (max-width: 1050px) {
      &::after {
        top: 2px;
      }
    }

    @media (min-width: 1439px) {
      &::after {
        top: 4px;
      }
    }

    @media (min-width: 1919px) {
      &::after {
        top: 6px;
      }
    }
  }
}

.reset-block {
  position: relative;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid gray;
  cursor: pointer;
}

.reset-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 20px;

  &::before &::after {
    content: '';
    position: absolute;
    top: 1rem;
    bottom: 0;
    right: 6px;
    width: 1px;
    height: 18px;
    display: block;
    background-color: gray;
    transform-origin: center;
  }

  &::after {
    transform: rotate(45deg);
  }

  &::before {
    transform: rotate(-45deg);
  }
}
</style>
