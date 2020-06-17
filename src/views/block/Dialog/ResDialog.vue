<template>
  <el-dialog
    :visible.sync="showModel"
    width="600px"
    lock-scroll
    title="新建数据RES"
    @close="closeModal">
    <el-form :model="model" :rules="rules" size="mini" ref="form">
      <el-form-item label="RES名称">
        <el-input v-model="model.name" placeholder="请输入RES名称"></el-input>
      </el-form-item>
      <el-form-item label="数据" prop="res_body">
        <el-link size="mini" class="ft-12" type="primary" @click="handleBeautify">格式化</el-link>
        <RCodeMirror ref="rCode" v-model="model.res_body"></RCodeMirror>
      </el-form-item>

    </el-form>

    <div class="dialog-footer" slot="footer">
      <el-button  @click="$emit('close')" size="mini">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RCodeMirror from '@/components/RCodeMirror/RCodeMirror'

export default {
  name: 'ResDialog',
  components: {
    RCodeMirror
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    const validateValue = (rule, value, callback) => {
      try {
        JSON.parse(value)
      } catch (error) {
        return callback(new Error('必须是JSON格式'))
      }
      callback()
    }
    return {
      model: {
        name: '',
        res_body: JSON.stringify({}, null, 2)
      },
      rules: {
        res_body: [
          { validator: validateValue, trigger: 'blur' }
        ]
      },
      showModel: false
    }
  },
  watch: {
    visible (n) {
      this.showModel = n
    },
    data (n) {
      console.log('data -> n', n)
      n.res_body = JSON.stringify((n || {}).res_body || {})
      this.model = n
      console.log('data -> this.model', this.model)
      this.$refs.rCode && this.$refs.rCode.cm && this.$refs.rCode.cm.setValue(n.res_body)
    }
  },
  methods: {
    handleBeautify (e) {
      e.preventDefault()
      if (this.$refs.rCode) {
        const result = JSON.parse(this.model.res_body)
        const beautified = JSON.stringify(result, null, 2)
        this.$refs.rCode.cm.setValue(beautified)
      }
    },
    closeModal () {
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    submit () {
      this.$refs.form.validate()
        .then(() => {
          const params = Object.assign(
            {},
            this.model,
            {
              interfaceId: this.id,
              res_body: this.model.res_body
            }
          )
          const actionName = this.model.id ? 'updateMockData' : 'createMockData'
          this.$store.dispatch(actionName, params)
            .then(() => {
              this.$emit('close')
              this.model = {}
            })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.ft-12 {
  font-size: 12px;
}
</style>
