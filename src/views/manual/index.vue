<template lang="pug">
.manual-page
  .side-menus-wrap
    .side-menus
      router-link.menu-item(
        tag="div", v-for="menu in menus", :key="menu.file",
        :to="{query: {f: menu.file}}") {{menu.label}}
  .md-content
    div(id="markdown-container" v-html="markdownHtml")
</template>

<script>
const menus = [{
  label: '数据导入',
  file: 'import-data'
}, {
  label: '在开发环境使用 Mock 数据',
  file: 'develop'
}]

export default {
  data () {
    const manualMap = menus.reduce((res, item) => {
      res[item.file] = require('@/doc/' + item.file + '.md')
      return res
    }, {})
    return {
      menus,
      manualMap
    }
  },
  computed: {
    markdownHtml () {
      return this.manualMap[this.$route.query.f] || '试试左边的文章'
    }
  },
  mounted () {
    !this.$route.query.f && this.$router.replace({
      query: {
        f: menus[0].file
      }
    })
  }
}
</script>

<style lang="less" scoped>
.manual-page {
  display: flex;
}
.side-menus-wrap {
  margin: 15px 0;
}
.side-menus {
  overflow: auto;
  position: sticky;
  top: 76px;
  width: 250px;
  height: calc(100vh - 90px);
  line-height: 1.5;
  font-size: 15px;
  padding: 0 15px;
  border-right: 1px solid #eee;
  .menu-item {
    margin-bottom: 5px;
    cursor: pointer;
    // transition: color .2s;
    &:hover {
      color: #369cf0;
      text-decoration: underline;
    }
    &.router-link-exact-active {
      font-weight: bold;
      color: #2196F3;
    }
  }
}
.md-content {
  flex: 1;
}
</style>
