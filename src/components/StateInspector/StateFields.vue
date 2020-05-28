<template>
  <div class="data-fields">
    <template v-if="isFieldsArray">
      <data-field
        v-for="field in fields"
        :key="field.key"
        :field="field"
        :depth="0"
        :path="field.key"
        :editable="field.editable"
        :force-collapse="forceCollapse"
        :is-state-field="isStateField(field)"
      />
    </template>
    <template v-else>
      <data-field
        v-for="(value, key) in fields"
        :key="key"
        :field="{ value, key }"
        :depth="0"
        :path="key"></data-field>
    </template>
    <!-- <VueButton></VueButton> -->
  </div>
</template>

<script>
import DataField from './DataField.vue'

export default {
  name: 'StateFields',
  components: {
    DataField
  },
  props: {
    fields: {
      type: [Array, Object],
      required: true
    },
    forceCollapse: {
      type: String,
      default: null
    }
  },
  computed: {
    isFieldsArray () {
      return Array.isArray(this.fields)
    }
  },
  methods: {
    isStateField (field) {
      return field && field.type === 'state'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
