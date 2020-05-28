<template>
  <div class="data-wrapper">
    <div
      :class="[
        'data-el',
        'data',
      ]"
    >
    <div
      class="data-type selectable-item"
      @click="toggle">
      <span :class="{ rotated: isExpanded()}" class="arrow right" />
      <span class="key">data</span>
    </div>
    <StateFields
      v-show="isExpanded()"
      :fields="state"></StateFields>
    </div>
  </div>
</template>

<script>
import StateFields from './StateFields'

export default {
  name: 'StateInspector',
  components: { StateFields },
  props: {
    state: {
      type: Object,
      required: true,
      default: () => ({
        id: '12333',
        name: 'gogo',
        obj: {
          class: '3',
          desc: '我是测试数据'
        },
        list: [1, 4, 6, 0],
        data: [{
          key: 555,
          name: '好的'
        }, {
          key: 666,
          name: '你好'
        }]
      })
    },
    dimAfter: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      expandedData: true,
      forceCollapse: null
    }
  },
  computed: {},
  mounted () {

  },
  methods: {
    isExpanded () {
      const value = this.expandedData
      return typeof value === 'undefined' || value
    },
    toggle (event = null) {
      console.log('toggle -> event', event)
      if (event) {
        if (event.ctrlKey || event.metaKey) {
          return this.setExpandToAll(false)
        } else if (event.shiftKey) {
          return this.setExpandToAll(true)
        }
      }
      this.expandedData = !this.expandedData
    },
    setExpandToAll (value) {
      this.forceCollapse = value ? 'expand' : 'collapse'
      this.expandedData = value
    }
  }
}
</script>

<style lang="less" scoped>
@grey: #DDDDDD;
@blueishGrey: #486887;
.data-el {
  font-size: 15px;
  &.dim {
    opacity: 0.7;
    pointer-events: none;
    user-select: none;
    filter: grayscale(50%)
  }
  &:not(:last-child) {
    border-bottom: rgba(@grey, 0.4) solid 1px;
  }
  .data-type,
  .data-fields {
    margin: 5px;
    padding: 2px 9px 2px 21px;
  }
  .data-type {
    color: @blueishGrey;
    position: relative;
    cursor: pointer;
    border-radius: 3px;
    display: flex;
    align-items: baseline;
    padding-left: 9px;
    user-select: none;
    .arrow {
      transition: transform 0.1s ease;
      margin-right: 8px;
      opacity: .7;
      &.rotated {
        transform: rotate(90deg);
      }
    }

  }
}
</style>
