<template>
  <div class="custom-dropdown-menu dropdown-menu" :style="{[position]: 0}" v-if="nextData.counter !== 0">
    <div v-for="repo in nextData.nextRespository.repositories" :key="repo.id">
      <a
        class="dropdown-item dropdown-item-module">
        <span class="label">仓库</span>
        <Highlight class="dropdown-item-clip" :clip="repo.name" :seed="seed"></Highlight>
      </a>
      <div v-for="itf in repo.interfaces" :key="itf.id">
        <a
          class="dropdown-item dropdown-item-interface"
          @click="handleGoItf(itf, repo)">
          <span class="label">接口</span>
          <Highlight class="dropdown-item-clip" :clip="itf.name" :seed="seed"></Highlight>
          <Highlight class="dropdown-item-clip" :clip="itf.method" :seed="seed"></Highlight>
          <Highlight class="dropdown-item-clip" :clip="itf.url" :seed="seed"></Highlight>
        </a>
      </div>
      <!-- <div class="dropdown-divider" v-if="data.length -1 > index"></div> -->
    </div>
  </div>
</template>

<script>
import Highlight from './Highlight'
import * as types from '@/store/mutation-types.js'

export default {
  name: 'DropdownMenu',
  components: {
    Highlight
  },
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    seed: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      id: this.$route.params.id
      // nextData: []
      // seed: 'get'
    }
  },
  computed: {
    routeName () {
      return this.$route.name
    },
    routeParams () {
      return this.$route.params
    },
    routeQuery () {
      return this.$route.query
    },
    nextData () {
      const nextRespository = { repositories: [] }
      const resposities = [...this.data]
      let counter = 0
      const seed = this.seed.toLowerCase()
      resposities.forEach((repo = { name: '', description: '' }) => {
        const nextRepo = { ...repo, interfaces: [] }
        let matchRepo = repo.name.toLowerCase().indexOf(seed) !== -1 ||
            repo.description.indexOf(seed) !== -1
        if (matchRepo) {
          counter++
          nextRespository.repositories.push(nextRepo)
        }

        repo.interfaces.forEach(itf => {
          const nextItf = { ...itf }
          const matchInterface =
            itf.name.toLowerCase().indexOf(seed) !== -1 ||
            itf.url.toLowerCase().indexOf(seed) !== -1 ||
            itf.method === seed
          if (matchInterface) {
            counter++
            if (!matchRepo) {
              matchRepo = true
              nextRespository.repositories.push(nextRepo)
            }
            nextRepo.interfaces.push(nextItf)
          }
        })
      })
      return { nextRespository, counter }
    }
  },
  methods: {
    genToRoute (item, repo = { name: '', id: '' }) {
      const { name, params, query } = this.$route
      const newQuery = Object.assign({}, query, {
        name: repo.name || name,
        itf: item.id,
        mock: ''
      })
      const newParams = Object.assign({}, params, {
        id: repo.id
      })
      return {
        name: repo.id ? 'interface-list' : name,
        params: newParams,
        query: newQuery
      }
    },
    handleGoItf (itf, repo) {
      const newRoute = this.genToRoute(itf, repo)

      this.$store.commit(types.INTERFACE_ID_CUR_SET, itf)
      this.$store.dispatch('getCurItf', { id: itf.id })
        .then(res => {
          this.$router.push(newRoute)
          this.clearSeed()
        })
    },
    clearSeed () {
      this.$emit('clear')
    }
  }
}
</script>

<style lang="less" scoped>
.custom-dropdown-menu {
  position: absolute;
  top: 32px;
  left: auto;
  display: block;
  min-width: 100%;
  max-height: 500px;
  overflow: scroll;
  .dropdown-item {
    &.dropdwon-item-module {
      padding-left: 15px;
      color: #333;
    }
    &.dropdown-item-interface {
      padding-left: 40px;
      color: #333;
    }
    > .label {
      margin-right: 5px;
      color: #666;
    }
    > .dropdown-item-clip {
      margin-right: 5px;
      /deep/ .highlight {
        font-weight: bold;
        color: #4A7BF7;
      }
    }
    &.active {
      color: #fff;
      > .label {
        color: #fff;
      }
      > .dropdown-item-clip {
        /deep/ .highlight {
          color: #fff;
        }
      }
    }
  }
}
</style>
