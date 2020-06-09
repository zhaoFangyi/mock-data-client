<template>
  <el-dialog
    :visible.sync="showModel"
    width="500px"
    lock-scroll
    :title="title"
    @close="closeModal">
    <el-form :model="model" size="mini" ref="form">
      <el-form-item lable="名称">
        <el-input
          v-model="model.name"
          placeholder="请输入名称"
          clearable></el-input>
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-input clearable v-model="model.moduleName" placeholder="请输入仓库名称"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button  @click="showForm=false" size="mini">取消</el-button>
        <el-button size="mini" type="primary" @click="createModule">确定</el-button>
      </div>
  </el-dialog>
</template>

<script>
import { Methods } from '@/contants'

export default {
  name: 'AddItfDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: '',
      Methods,
      model: {},
      showModel: false
    }
  },
  watch: {
    visible (n) {
      this.showModel = n
    },
    data (v) {
      if (v && Object.keys(v).length > 0) {
        this.model = v
      }
    }
  },
  mounted () {
    this.title = this.model.id
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    submit () {
      this.$refs.form.validate()
        .then(() => {
          const actionName = this.model.id ? 'updateInterface' : 'createInterface'
          const params = {
            repositoryId: this.$route.params.id,
            ...this.model
          }
          this.$store.dispatch(actionName, params)
            .then(() => {
              this.$emit('close')
            })

          // api[apiName]({
          //   repositoryId: this.$route.params.id,
          //   ...this.model
          // })
          //   .then(res => {
          //     console.log(res)
          //     this.$emit('close')
          //     this.$emit('update')
          //   })
        })
    }
  }
}
</script>
