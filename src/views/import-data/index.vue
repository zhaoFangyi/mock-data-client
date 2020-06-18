<template lang="pug">
  .handle-data
    .data-form
      el-form.form(label-suffix=": ", label-width="150px", :rules="rules", :model="form")
        h2 导入API
        br
        el-form-item(label="是否新建仓库")
          el-checkbox(v-model="form.isCreateNew")

        template(v-if="form.isCreateNew")
          el-form-item(label="新建仓库名", prop="name")
            el-input.w-380(v-model="form.name", clearable, placeholder="请输入仓库名；支持英文、数字、下划线")

          el-form-item(label="备注名", prop="description")
            el-input.w-380(v-model="form.description", clearable, placeholder="请输入仓库备注名；例如：预警管理")

        el-form-item(v-else, label="选择已有仓库", prop="repositoryId")
          el-select(filterable, v-model="form.repositoryId", placeholder="请选择仓库")
            el-option(
              v-for="repository in repositories",
              :key="repository.id",
              :value="repository.id",
              :label="repository.name",
            )

        el-form-item(label="导入文件", prop="file")
          el-upload(
            class="upload-demo",
            drag,
            :multiple="false",
            :http-request="handleFile",
            action="")
            i.el-icon-upload
            .el-upload__text 将文件拖到此处，或<em>点击导入</em>，支持 {{extList.join('、')}} 格式

        el-form-item(label="选择要导入的API", prop="selected")
          .itfs-result
            el-table(:data="apiList", @selection-change="handleSelectionChange")
              el-table-column(type="selection")
              el-table-column(width="80", prop="method", label="method")
              el-table-column(prop="path", label="path")
              el-table-column(prop="res_body", label="res_body", show-overflow-tooltip)
        el-form-item
          el-button(@click="$router.back()") 返回
          el-button(
            :disabled="!form.selectedList.length",
            type="primary", @click="submit"
            :loading="loading") 提交
</template>

<script>
import api from '@/data/api'
import importHar from './import-har'
import importJson from './import-json'
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'

const parsers = {
  json: importJson,
  har: importHar
}

export default {
  name: 'ImportData',
  data () {
    return {
      apiList: [],
      loading: false,
      form: {
        isCreateNew: false,
        repositoryId: '',
        description: '',
        name: '',
        file: null,
        selectedList: []
      },
      extList: ['json', 'har'],
      rules: {
        repositoryId: [{ required: true, trigger: 'change', message: '请选择仓库' }],
        description: [{ required: true, trigger: 'input', message: '请输入备注名' }],
        name: [{ required: true, trigger: 'input', message: '请输入仓库名' }],
        file: [{ required: true, trigger: 'change', message: '请导入文件' }],
        selectedList: [{ required: true, trigger: 'change', message: '请选择API' }]
      }
    }
  },
  computed: mapState(['repositories']),
  mounted () {
    if (this.repositories && this.repositories.length) {
      this.form.repositoryId = this.repositories[0].id
    }
  },
  beforeRouteEnter (to, { path }, next) {
    next(({ getRepository }) => path === '/' && getRepository())
  },
  methods: {
    ...mapMutations({ setRepositories: types.REPOSITORIES_SET }),
    getRepository () {
      api.getRepositoryList({})
        .then(({ data }) => {
          if (data && data.length) {
            this.form.repositoryId = data[0].id
          }
          this.setRepositories(data)
        })
        .catch(console.error)
    },
    handleSelectionChange (selectedList) {
      this.form.selectedList = selectedList
    },
    handleFile ({ file }) {
      const ext = (file.name.split('.').pop() || '').toLowerCase()
      if (!this.extList.includes(ext)) {
        return this.$message.warning(`暂不支持 .${ext} 格式的文件`)
      }
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = event => {
        const parser = parsers[ext]
        const { apis } = parser(event.target.result)
        this.apiList.push(...apis)
      }
    },

    async handleAddInterface (info, basePath, dataSync = 'good', token) {
      const apis = info.apis

      let form
      if (this.form.isCreateNew) {
        form = {
          name: this.form.name,
          description: this.form.description
        }
      } else {
        form = {
          repositoryId: this.form.repositoryId
        }
      }

      const params = {
        interfaces: apis,
        ...form
      }
      api.bulkImport(params).then(res => {
        const {
          exisNum,
          successNum,
          total,
          repositoryId
        } = res.data

        this.$message.success(`导入 ${total} 个接口，成功 ${successNum} 个，已存在 ${exisNum} 个`)

        let query = {}
        if (this.form.isCreateNew) {
          query = {
            name: this.form.description
          }
        } else {
          query = {
            name: this.repositories.find(v => this.form.repositoryId === v.id).name
          }
        }
        this.$router.push({
          name: 'block-list',
          params: {
            id: repositoryId
          },
          query
        })
      })
    },
    submit () {
      this.loading = true
      this.handleAddInterface({
        apis: this.form.selectedList
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.handle-data {
  height: 100vh;
  display: flex;
  justify-content: space-evenly;
  background: #f7f7f7;
}
.data-form {
  overflow: auto;
  width: 100%;
  padding: 40px;
  margin: 20px;
  background: #fff;
  border-radius: 20px;
}
.form {
  max-width: 800px;
}
.w-380 {
  width: 380px;
}
</style>
