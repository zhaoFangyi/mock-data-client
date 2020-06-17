<script>
import copy from 'clipboard-copy'

export default {
  name: 'CopyToClipboard',
  props: {
    type: {
      type: String,
      default: 'hover'
    },
    text: {
      type: String,
      default: ''
    }
  },
  render (h) {
    if (this.type === 'hover') {
      return (
        <el-tooltip placement="right">
          <div
            slot='content'
            style={{ cursor: 'pointer' }}
            onClick={() => this.onCopy()}
          >
          复制
          </div>
          {this.$slots.default}
        </el-tooltip>
      )
    } else {
      return (
        <div>
          <span class="copy-link edit" onClick={() => this.onCopy()} title="复制名称">
            { this.$slots.default }
            <i class="el-icon-copy-document"></i>
          </span>
        </div>
      )
    }
  },
  methods: {
    onCopy () {
      const { text } = this
      const content = typeof text === 'string' ? text : JSON.stringify(text)
      copy(content)
        .then(() => {
          const maxLength = 30
          const cutContent =
            content.length > maxLength
              ? `${content.substr(0, maxLength)}...`
              : content
          this.$message({
            message: `成功复制 ${cutContent} 到剪贴板`,
            type: 'success'
          })
        })
        .catch(() => {
          this.$message({
            message: '复制失败',
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.mr5 {
  margin-right: 5px;
}
.copy-link {
  cursor: pointer;
  color: #999;
  &:hover {
    color: #4A7BF7;
  }
}
</style>
