<template>
  <el-dialog
    :visible.sync="showModel"
    width="500px"
    lock-scroll
    title="新建数据RES"
    @close="closeModal">
    <el-form :model="model" :rules="rules" size="mini" ref="form">
      <el-form-item label="RES名称">
        <el-input v-model="model.name" placeholder="请输入RES名称"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="model.desc" placeholder="RES简介"></el-input>
      </el-form-item>
      <el-form-item label="数据" prop="value">
        <el-input type="textarea" v-model="model.value" placeholder="mock数据值"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button  @click="$emit('close')" size="mini">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'ResDialog',
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
      default: () => ({})
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
      model: {},
      rules: {
        value: [
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
      if (n) {
        n.value = JSON.stringify(n.value)
        this.model = n
      }
    }
  },
  methods: {
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
              value: this.model.value
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
