<template>
  <el-dialog
    :visible.sync="showModel"
    width="500px"
    lock-scroll
    :title="title"
    @close="closeModal">
    <el-form :model="model" size="mini" ref="form">
      <el-form-item label="接口名称">
        <el-input v-model="model.name" placeholder="请输入接口名称"></el-input>
      </el-form-item>
      <el-form-item label="接口url">
        <el-input v-model="model.url" placeholder="接口url"></el-input>
      </el-form-item>
      <el-form-item label="请求方式">
        <el-select v-model="model.method" placeholder="请选择">
          <el-option
            v-for="item in Methods"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button  @click="$emit('close')" size="mini">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Methods } from '@/constants'

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
    }
  },
  data () {
    return {
      Methods,
      title: '新建接口',
      model: {},
      showModel: false
    }
  },
  watch: {
    visible (n) {
      this.showModel = n
    },
    data (v) {
      this.model = v
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
