<template>
  <div class="top-bar" :class="{home: $route.path === '/home'}">
    <el-menu :default-active="activeIndex" router mode="horizontal">
      <el-menu-item index="/">
        <img class="logo" src="/logo@3x.png" alt="">
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
  z-index: 100;
  /deep/ .el-menu {
    border-color: #ebedf1;
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: saturate(180%) blur(10px);
  }
  /deep/ .el-menu--horizontal {
    .el-menu-item:focus,
    .el-menu-item:hover,
    .el-submenu__title:hover {
      background: transparent;
    }
  }
  &.home {
    /deep/ .el-menu {
      border-color: transparent;
    }
  }
}
.logo {
  width: 40px;
  vertical-align: -16px;
  margin-right: 10px;
}
.logo-name {
  font-size: 17px;
  font-weight: bold;
  font-family: 'Helvetica Neue';
  vertical-align: -2px;
  color: #555;
}
</style>
