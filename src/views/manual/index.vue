<template>
  <div id="markdown-container" v-html="markdown"></div>
</template>

<script>
import markdown from '@/doc/manual.md'

export default {
  data () {
    return {
      markdown
    }
  }
}
</script>
