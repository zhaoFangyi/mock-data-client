<template>
  <el-dialog
    :visible.sync="showModel"
    width="85%"
    lock-scroll
    :title="title"
    @close="closeModal">
    <el-form :model="model" :rules="rules" size="mini" ref="form">
      <el-form-item label="RES名称">
        <el-input v-model="model.name" placeholder="请输入RES名称"></el-input>
      </el-form-item>
      <el-form-item label="数据" prop="res_body">
        <el-link size="mini" class="ft-12" type="primary" @click="handleBeautify">Beautify</el-link>
        <el-link size="mini" class="ft-12 ml-10" type="primary" @click="handleUglify">Uglify</el-link>
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
import { mapGetters } from 'vuex'
import { isJson } from '@/utils/util.js'

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
    },
    mode: {
      type: String,
      default: 'add'
    }
  },
  data () {
    const validateValue = (rule, value, callback) => {
      if (!isJson(value)) {
        return callback(new Error('必须是JSON格式'))
      } else {
        callback()
      }
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
  computed: {
    title () {
      return this.mode === 'add' ? '新建数据RES' : '编辑数据Res'
    },
    ...mapGetters([
      'curMockData'
    ])
  },
  watch: {
    visible (n) {
      this.showModel = n
    },
    // mode (n) {
    //   if (n === 'add') {
    //     this.model.res_body = JSON.stringify({}, null, 2)
    //   } else if (n === 'edit') {
    //     this.model.res_body = JSON.stringify(this.curMockData, null, 2)
    //   }
    // }
    data (n) {
      console.log('data -> n', n)
      this.model = n
      // console.log('data -> n', n)
      // n.res_body = JSON.stringify((n || {}).res_body || {})
      // this.model = n
      // console.log('data -> this.model', this.model)
      // this.$refs.rCode && this.$refs.rCode.cm && this.$refs.rCode.cm.setValue(n.res_body)
    }
  },
  mounted () {
    console.log(11111111)
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
    handleUglify (e) {
      e.preventDefault()
      if (this.$refs.rCode) {
        const result = JSON.parse(this.model.res_body)
        const beautified = JSON.stringify(result)
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
              res_body: this.$refs.rCode.cm.getValue()
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
.ml-10 {
  margin-left: 10px;
}
.ft-12 {
  font-size: 12px;
}
</style>
