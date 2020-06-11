<template>
  <div class="custom-dropdown-menu dropdown-menu" v-if="nextData.counter !== 0">
    <div>
      <a
        class="dropdown-item dropdown-item-module">
        <span class="label">仓库</span>
        <Highlight class="dropdown-item-clip" :clip="nextData.nextRespository.name" :seed="seed"></Highlight>
      </a>
      <template v-if="nextData.nextRespository.interfaces && nextData.nextRespository.interfaces.length">
        <div v-for="itf in nextData.nextRespository.interfaces" :key="itf.id">
          <router-link
            tag="a"
            class="dropdown-item dropdown-item-interface"
            :to="genToRoute(itf)">
            <span class="label">接口</span>
            <Highlight class="dropdown-item-clip" :clip="itf.name" :seed="seed"></Highlight>
            <Highlight class="dropdown-item-clip" :clip="itf.method" :seed="seed"></Highlight>
            <Highlight class="dropdown-item-clip" :clip="itf.url" :seed="seed"></Highlight>
          </router-link>
        </div>
      </template>
      <!-- <div class="dropdown-divider" v-if="data.length -1 > index"></div> -->
    </div>
  </div>
</template>

<script>
import Highlight from './Highlight'
export default {
  name: 'DropdownMenu',
  components: {
    Highlight
  },
  props: {
    data: {
      type: Array,
      default: () => ({
        interfaces: []
      })
    },
    seed: {
      type: String,
      default: ''
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
      const nextRespository = { ...this.data, interfaces: [] }
      let counter = 0
      const seed = this.seed.toLowerCase()
      ;(this.data.interfaces || []).forEach(itf => {
        const matchInterface =
          itf.name.toLowerCase().indexOf(seed) !== -1 ||
          itf.url.toLowerCase().indexOf(seed) !== -1 ||
          itf.method === seed
        if (matchInterface) {
          counter++
          nextRespository.interfaces.push(itf)
        }
      })
      return { nextRespository, counter }
    }
  },
  methods: {
    genToRoute (item) {
      const { name, params, query } = this.$route
      const newQuery = Object.assign({}, query, {
        itf: item.id
      })
      return {
        name,
        params,
        query: newQuery
      }
    }
  }
}
</script>

<style lang="less" scoped>
.custom-dropdown-menu {
  position: absolute;
  right: 0;
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
