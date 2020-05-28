import Vue from 'vue'

window.__store__ =
  window.__store__ ||
  new Vue({
    data () {
      return {
        store: {}
      }
    },
    methods: {
      get (key, params) {
        return typeof this.store[key] === 'function'
          ? this.store[key](params)
          : this.store[key]
      },
      set (key, value) {
        this.$emit(`${key}Change`, value, this.store[key])
        this.$set(this.store, key, value)
      }
    }
  })

export default window.__store__
