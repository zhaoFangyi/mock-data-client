<template lang="pug">
.manual-page
  .side-menus-wrap
    .side-menus
      .mb-20(style="font-size:18px")
        b 指南
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
// }, {
//   label: '创建仓库、接口、Mock',
//   file: 'create'
}, {
  label: '在开发环境使用 Mock 数据',
  file: 'develop'
}]

const manualMap = menus.reduce((res, item) => {
  res[item.file] = () => import('@/docs/' + item.file + '.md')
  return res
}, {})

export default {
  data () {
    return {
      menus,
      markdownHtml: '...'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => to.query.f ? vm.setMarkdown(to.query.f) : vm.redirect())
  },
  beforeRouteUpdate (to, from, next) {
    if (to.query.f) {
      next()
      this.setMarkdown(to.query.f)
    } else {
      next(!from.query.f)
    }
  },
  methods: {
    redirect () {
      this.$router.replace({
        query: {
          f: menus[0].file
        }
      })
    },
    setMarkdown (file) {
      manualMap[file] && manualMap[file]().then(mk => {
        this.markdownHtml = mk.default
      }, err => {
        this.markdownHtml = err
      })
    }
  }
}
</script>

<style lang="less" scoped>
.manual-page {
  display: flex;
}
.side-menus {
  overflow: auto;
  position: sticky;
  top: 61px;
  width: 250px;
  height: calc(100vh - 61px);
  line-height: 1.5;
  font-size: 15px;
  padding: 25px;
  border-right: 1px solid #ebedf1;
  background: #f9fafb;
  .menu-item {
    margin-bottom: 12px;
    cursor: pointer;
    transition: color .1s;
    color: #4d6277;
    &:hover {
      color: #369cf0;
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
