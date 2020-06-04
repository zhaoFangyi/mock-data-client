<template>
  <div class="sortable" ref="sortable-box">
    <slot></slot>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: 'RSortable',
  props: {
    onChange: {
      type: Function,
      default: null
    },
    opt: {
      type: Object,
      default: () => ({})
    }
  },
  mounted () {
    const $sortable = Sortable.create(this.$slots.default[0].elm, {
      handle: '.sortable',
      animation: 150,
      onEnd: (e) => {
        if (this.onChange) {
          this.onChange(e, $sortable)
        }
      },
      ...this.opt
    })
  }
}
</script>

<style lang="less" scoped>
// .sortable {}
.sortable-ghost {
  background-color: #F4E2C9;
}
.sorable-drag {
  background-color: white;
}
</style>
