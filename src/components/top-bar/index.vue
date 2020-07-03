<template>
  <div class="top-bar">
    <el-menu :default-active="activeIndex" router mode="horizontal">
      <el-menu-item index="/">
        <img class="logo" src="/logo@2x.png" alt="">
      </el-menu-item>
      <el-menu-item :index="m[1]" v-for="m in menus" :key="m[1]">{{m[0]}}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
const menus = [
  ['首页', '/home'],
  ['接口管理', '/modules/list'],
  ['数据导入', '/import-data'],
  ['接口测试', '/test-api'],
  ['使用手册', '/manual']
]
export default {
  data () {
    return {
      menus
    }
  },
  computed: {
    activeIndex () {
      if (this.$route.name === 'block-list') {
        return '/modules/list'
      }
      return this.$route.path
    }
  }
}
</script>

<style lang="less" scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 2001;
}
.logo {
  width: 50px;
}
</style>
