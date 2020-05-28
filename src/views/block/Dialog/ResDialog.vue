<template>
  <el-dialog
    :visible.sync="showModel"
    width="500px"
    lock-scroll
    title="新建数据RES"
    @close="closeModal">
    <el-form :model="model" size="mini" ref="form">
      <el-form-item label="RES名称">
        <el-input v-model="model.name" placeholder="请输入RES名称"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="model.desc" placeholder="RES简介"></el-input>
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
    }
  },
  data () {
    return {
      model: {},
      showModel: false
    }
  },
  watch: {
    visible (n) {
      this.showModel = n
    }
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    submit () {
      this.$refs.form.validate()
        .then()
    }
  }
}
</script>
