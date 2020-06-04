<template>
  <span v-html="highlighted"></span>
</template>

<script>
export default {
  name: 'Highlight',
  props: {
    clip: {
      type: String,
      default: ''
    },
    seed: {
      type: String,
      default: ''
    }
  },
  computed: {
    highlighted () {
      return this.generatedText(this.clip, this.seed)
    }
  },
  mounted () {
  },
  methods: {
    generatedText (clip, seed) {
      if (!seed) { return clip }
      const rseed = new RegExp(seed, 'ig')
      return ('' + clip).replace(rseed, (matched) =>
        `<span class="highlight">${matched}</span>`)
    }
  }
}
</script>

<style lang="less" scoped>
.highlight {
  font-weight: bold;
  color: #4A7BF7;
}
</style>
