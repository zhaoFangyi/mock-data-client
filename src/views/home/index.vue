<template>
  <div id="markdown-container" v-html="markdown"></div>
</template>

<script>
import markdown from '@/doc/home.md'

export default {
  data () {
    return {
      markdown
    }
  }
}
</script>
