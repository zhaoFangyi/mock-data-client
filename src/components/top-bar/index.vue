<template>
  <div class="top-bar">
    <el-menu :default-active="activeIndex" router mode="horizontal">
      <el-menu-item index="/">
        <img class="logo" src="/logo@2x.png" alt="">
        <span class="logo-name">MockHub</span>
      </el-menu-item>
      <el-menu-item :index="m[1]" v-for="m in menus" :key="m[1]">{{m[0]}}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
const menus = [
  ['接口管理', '/modules/list'],
  ['接口测试', '/test-api'],
  ['数据导入', '/import-data'],
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
      if (this.$route.name === 'interface-list') {
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
  width: 40px;
}
.logo-name {
  font-size: 17px;
  font-weight: bold;
  font-family: 'Helvetica Neue';
  margin-left: 10px;
  color: #555;
}
</style>
