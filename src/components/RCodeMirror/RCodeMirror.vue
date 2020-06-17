<template>
  <textarea
    name="myCodeMirror"
    :autoFocus="true"
    id="myCodeMirror"
    v-model="code"
    style="height: 200px;width:600px;"
    ref="myCodeMirror"></textarea>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/solarized.css'

export default {
  name: 'RCodeMirror',
  props: ['value'],
  data () {
    return {
      code: '',
      options: {
        tabSize: 2,
        lineNumbers: true,
        mode: {
          name: 'javascript',
          json: true
        },
        theme: 'solarized'
      },
      cm: null
    }
  },
  watch: {
    value (n) {
      this.code = n
      this.cm.setValue(n)
    }
  },
  mounted () {
    // const ele = document.getElementById('myCodeMirror')
    this.cm = CodeMirror.fromTextArea(this.$refs.myCodeMirror, this.options)

    this.cm.setValue(this.value || this.code)

    this.cm.on('change', () => {
      this.$emit('input', this.cm.getValue())
    })
  }
}
</script>

<style lang="less" scoped>
.codeMirror {
  border: 1px solid #d1d5da;
}
</style>
