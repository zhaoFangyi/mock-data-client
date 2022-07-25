<template>
  <el-dialog
    :visible.sync="showModel"
    width="85%"
    lock-scroll
    :title="title"
    :close-on-click-modal="false"
    @close="closeModal">
    <el-form :model="model" :rules="rules" size="mini" label-width="80px" ref="form">
      <el-form-item label="参数名称" prop="name">
        <el-input v-model="model.name" placeholder="请输入参数名称"></el-input>
      </el-form-item>
      <el-form-item label="参数过滤" prop="expectParams">
        <div v-for= "(param,index) in model.expectParams" :key="param">
          <el-input class="wh-200 " size="mini" v-model="param.key" placeholder="请输入key"></el-input>
          <el-input class="wh-200 mt-5 ml-10" size="mini" v-model="param.value" placeholder="请输入value"></el-input>
          <i class="el-icon-circle-plus-outline ml-10 ft-16"  @click="addExpectParams(index)"> </i>
          <i class="el-icon-remove-outline ml-10 ft-16" v-if="model.expectParams.length>1" @click="removeExpectParams(index)"></i>
        </div>
      </el-form-item>
      <!-- <el-form-item label="数据" prop="res_body" >
        <el-link size="mini" class="ft-12" type="primary" @click="handleBeautify">Beautify</el-link>
        <el-link size="mini" class="ft-12 ml-10" type="primary" @click="handleUglify">Uglify</el-link>
        <RCodeMirror ref="rCode" v-model="model.res_body"></RCodeMirror>
      </el-form-item> -->
    </el-form>

    <div class="dialog-footer" slot="footer">
      <el-button  @click="$emit('close')" size="mini">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import RCodeMirror from '@/components/RCodeMirror/RCodeMirror'
import { mapGetters } from 'vuex'
import { isJson } from '@/utils/util.js'

export default {
  name: 'newExpectDialog',
  components: {
    // RCodeMirror
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
        expectParams: [{ key: '', value: '' }]
      },
      rules: {
        name: {
          required: true
        },
        res_body: [
          { validator: validateValue, trigger: 'blur' }
        ]
      },
      showModel: false
    }
  },
  computed: {
    title () {
      return this.mode === 'add' ? '新建参数期望' : '编辑参数期望'
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
    }
  },
  methods: {
    handleBeautify (e) {
      e.preventDefault()
      if (this.$refs.rCode) {
        try {
          const result = JSON.parse(this.$refs.rCode.cm.getValue())
          const beautified = JSON.stringify(result, null, 2)
          this.$refs.rCode.cm.setValue(beautified)
        } catch (error) {
          this.$message.error('格式错误')
        }
      }
    },
    handleUglify (e) {
      e.preventDefault()
      if (this.$refs.rCode) {
        try {
          const result = JSON.parse(this.$refs.rCode.cm.getValue())
          const beautified = JSON.stringify(result)
          this.$refs.rCode.cm.setValue(beautified)
        } catch (error) {
          this.$message.error('格式错误')
        }
      }
    },
    generateItem () {
      return { key: '', value: '' }
    },
    addExpectParams (idx) {
      this.model.expectParams.push(this.generateItem())
    },
    removeExpectParams (idx) {
      this.model.expectParams.splice(idx, 1)
    },
    closeModal () {
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    submit () {
      try {
        this.$refs.form.validate()
          .then(() => {
            const params = Object.assign(
              {},
              this.model,
              {
                interfaceId: this.id
              }
            )
            params.body = JSON.stringify(params.expectParams.reduce((narr, obj) => {
              return { ...narr, [obj.key]: obj.value }
            }, {}))
            delete params.expectParams
            const actionName = this.model.id ? 'updateExpect' : 'createExpect'
            this.$store.dispatch(actionName, params)
              .then(() => {
                this.$message.success('新建成功')
                this.$emit('close')
                this.model = {
                  name: '',
                  expectParams: [{ key: '', value: '' }]
                }
              })
              .catch((err) => {
                console.log(err)
              })
          })
      } catch (e) {
        this.$message.error('格式错误')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ml-10 {
  margin-left: 10px;
}
.mt-5 {
  margin-top: 5px;
}
.ft-12 {
  font-size: 12px;
}
.ft-16 {
  font-size: 16px;
}
.wh-200{
  width: 200px;
}

</style>
