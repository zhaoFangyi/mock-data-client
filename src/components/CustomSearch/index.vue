<template>
  <div class="dropdown CustomSearch">
    <el-input
      v-model="seed"
      @change="handleInputChange"
      clearable
      class="dropdown-input"
      placeholder="输入搜索"/>
    <dropdown-menu
      v-show="seed"
      :data="repository"
      :seed="seed"
      @select="clearSeed" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu'
export default {
  name: 'CustomSearch',
  components: { DropdownMenu },
  data () {
    return {
      seed: ''
    }
  },
  computed: {
    ...mapState([
      'repository'
    ])
  },
  methods: {
    filterResults (respository, seed) {
    },
    handleInputChange () {},
    clearSeed () {
      this.seed = ''
    }
  }
}
</script>

<style lang="less" scoped>
.CustomSearch.dropdown {
  > .dropdown-input {
    margin-bottom: 0;
    width: 200px;
  }
}
</style>
