<template>
  <textarea
    name="myCodeMirror"
    :autoFocus="true"
    id="myCodeMirror"
    v-model="value"
    ref="myCodeMirror"></textarea>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/solarized.css'
// 代码折叠
// 折叠
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'

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
        theme: 'solarized',
        foldGutter: true,
        lineWrapping: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']

      },
      cm: null
    }
  },
  watch: {
    value (n) {
      // this.code = n
      this.cm.setValue(n)
    }
  },
  mounted () {
    // const ele = document.getElementById('myCodeMirror')
    this.cm = CodeMirror.fromTextArea(this.$refs.myCodeMirror, this.options)

    this.cm.setValue(this.value)

    // this.cm.on('change', () => {
    //   this.$emit('input', this.cm.getValue())
    // })
  }
}
</script>

<style lang="less">
.cm-s-solarized.CodeMirror {
  box-shadow: none;
  border: 1px solid #dddfe6;
}
</style>
