<template>
  <div class="dropdown-menu">
    <div v-for="repository in data" :key="repository.id">
      <el-link>
        <span class="label">仓库</span>
      </el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownMenu',
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>
