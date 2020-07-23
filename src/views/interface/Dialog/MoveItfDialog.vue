<template>
  <el-dialog
    :visible.sync="showModel"
    width="500px"
    lock-scroll
    title="移动/复制接口"
    :close-on-click-modal="false"
    @close="closeModal">
    <el-form label-width="100px" :model="model" :rules="rules" size="mini" ref="form">
      <el-form-item label="选择仓库" prop="repositoryId">
        <el-select v-model="model.repositoryId" placeholder="请选择仓库">
          <el-option
            v-for="item in repositoryWithoutSelf"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-radio-group v-model="model.op">
          <el-radio :label="1">移动</el-radio>
          <el-radio :label="2">复制</el-radio>
        </el-radio-group>
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
import { mapState } from 'vuex'

export default {
  name: 'MoveItfDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      Methods,
      title: '新建接口',
      model: {
        repositoryId: '',
        op: 1
      },
      showModel: false,
      rules: {
        repositoryId: [{ required: true, trigger: 'change', message: '选择仓库' }]
      }
    }
  },
  watch: {
    visible (n) {
      this.showModel = n
    }
  },
  computed: {
    repositoryWithoutSelf () {
      return this.repositories.filter(item => item.id !== this.repository.id)
    },
    ...mapState([
      'repository',
      'repositories'
    ])
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    submit () {
      this.$refs.form.validate()
        .then(() => {
          this.$store.dispatch('moveInterface', this.model)
            .then(() => {
              this.$emit('close')
            })
        })
    }
  }
}
</script>
