<template>
  <div class="handle-data">
    <div class="data-form">
      <el-form class="form" label-suffix=": " label-width="120px" :rules="rules" :model="form">
        <h2>上传</h2>
        <br>
        <el-form-item label="选择已有仓库" prop="isSelectAlready">
          <el-checkbox v-model="form.isSelectAlready"></el-checkbox>
        </el-form-item>
        <el-form-item v-if="!form.isSelectAlready" label="新建仓库" prop="repositoryName">
          <el-input v-model="form.repositoryName" clearable placeholder="请输入仓库名称"></el-input>
        </el-form-item>
        <el-form-item v-else label="选择仓库" prop="repositoryId">
          <el-select filterable v-model="form.repositoryId" placeholder="请选择仓库">
            <el-option
              v-for="repository in repositories"
              :key="repository.id"
              :value="repository.id"
              :label="repository.name"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件类型" prop="type">
          <el-select filterable v-model="form.type">
            <el-option
              v-for="type in types"
              :key="type.value"
              :value="type.value"
              :label="type.label"
              ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            drag
            :multiple="false"
            :http-request="handleFile"
            action="">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>

        <el-form-item label="选择分析结果">
          <div class="itfs-result">
            <el-table :data="apiList" @selection-change="handleSelectionChange">
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column width="80" prop="method" label="method">
              </el-table-column>
              <el-table-column prop="path" label="path">
              </el-table-column>
              <el-table-column prop="res_body" label="res_body" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button @click="$router.back()">返回</el-button>
          <el-button :disabled="!form.selected.length" type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
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
      form: {
        type: 'har',
        repositoryId: '',
        file: null,
        isSelectAlready: true,
        repositoryName: '',
        selected: []
      },
      types: [
        {
          value: 'har',
          label: 'HAR'
        }, {
          value: 'json',
          label: 'JSON'
        }
      ],
      rules: {
        isSelectAlready: [{ required: true, trigger: 'change', message: '请选择新建方式' }],
        type: [{ required: true, trigger: 'change', message: '请选择文件类型' }],
        repositoryId: [{ required: true, trigger: 'change', message: '请选择仓库' }],
        repositoryName: [{ required: true, trigger: 'input', message: '请输入新的仓库名' }]
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
        .then(res => {
          if (res.data && res.data.length) {
            this.form.repositoryId = res.data[0].id
          }
          this.setRepositories(res.data)
        })
        .catch(console.error)
    },
    handleSelectionChange (val) {
      this.form.selected = val
    },
    handleFile (info) {
      const reader = new FileReader()
      reader.readAsText(info.file)
      reader.onload = async (res) => {
        const parser = parsers[this.form.type]
        const result = parser(res.target.result)
        console.log(result)
        this.apiList.push(...result.apis)
      }
    },

    async handleAddInterface (info, basePath, dataSync = 'good', token) {
      const apis = info.apis
      const count = apis.length
      // const existNum = 0

      console.log('handleAddInterface -> apis', apis)
      const PQueue = apis.map(api => {
        const params = {
          ...api,
          token
        }
        return this.saveItfAndMock(params)
          .catch(console.error)
          .then(res => res)
      })

      Promise.all(PQueue).then(resList => {
        const successNum = resList.filter(Boolean).length
        this.$message.success(`导入 ${count} 个接口，成功 ${successNum} 个。`)
      })
    },
    saveItfAndMock (params) {
      return api.saveItfAndMock({
        ...params,
        repositoryId: this.form.repositoryId
      })
    },
    submit () {
      this.handleAddInterface({
        apis: this.form.selected
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
</style>
