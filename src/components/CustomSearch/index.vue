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
      v-bind="$attrs"
      :data="data"
      :seed="seed"
      @clear="seed=''"
      @select="clearSeed" />
  </div>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu'
export default {
  name: 'CustomSearch',
  components: { DropdownMenu },
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      seed: ''
    }
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
  position: relative;
  > .dropdown-input {
    margin-bottom: 0;
    width: 200px;
  }
}
</style>
