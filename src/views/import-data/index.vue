<template>
  <div class="handle-data">
    <el-form class="data-form" label-suffix=": ">
      <el-form-item label="文件类型">
        <el-select v-model="form.type">
          <el-option
            v-for="type in types"
            :key="type.value"
            :value="type.value"
            :label="type.label"
            ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否新建仓库">
        <el-checkbox v-model="form.isCreate"></el-checkbox>
      </el-form-item>
      <el-form-item v-if="form.isCreate" label="仓库名称" placeholder="请输入仓库名称">
        <el-input v-model="form.repositoryName" clearable></el-input>
      </el-form-item>
      <el-form-item v-else label="选择仓库">
        <el-select v-model="form.repositoryId" placeholder="请选择仓库">
          <el-option
            v-for="repository in repositories"
            :key="repository.id"
            :value="repository.id"
            :label="repository.name"
            ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          drag
          multiple
          :http-request="handleFile"
          action="">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
    </el-form>
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
    const repositoryId = this.$route.query.id
    return {
      repositoryId,
      form: {
        type: 'json',
        repositoryId: Number(repositoryId),
        file: null,
        isCreate: false,
        repositoryName: ''
      },
      types: [{
        value: 'json',
        label: 'JSON'
      }, {
        value: 'har',
        label: 'HAR'
      }]
    }
  },
  computed: {
    ...mapState(['repositories'])
  },
  mounted () {
    if (this.repositories && this.repositories.length) {
      this.form.repositoryId = this.repositories[0].id
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (from.path === '/') {
        vm.getRepository()
      }
    })
  },
  methods: {
    ...mapMutations({ setRepositories: types.REPOSITORIES_SET }),
    getRepository () {
      api.getRepositoryList({})
        .then(res => {
          this.setRepositories(res.data)
        })
        .catch(err => {
          console.log('getList -> err', err)
        })
    },
    handleExport () {
      api.exportOneRepo({
        pid: this.form.repositoryId,
        type: 'json'
      })
        .then(res => {
          // console.log(res)
          console.log(22222222)
        })
    },
    handleFile (info) {
      const reader = new FileReader()
      reader.readAsText(info.file)
      reader.onload = async (res) => {
        const parser = parsers[this.form.type]
        const result = parser(res.target.result)
        console.log(result)
        await this.handleAddInterface(result)
      }
    },

    async handleAddInterface (info, basePath, dataSync = 'good', token) {
      // const cats = await this.handleAddCat(info.cats)
      // if (cats === false) {}

      const res = info.apis
      console.log('handleAddInterface -> res', res)
      const len = res.length
      let count = 0
      let successNum = len;
      const existNum = 0
      if (len === 0) {}
      // if (info.basePath) {}
      for (let index = 0; index < res.length; index++) {
        const item = res[index]
        const data = Object.assign(item, {
          repositoryId: this.form.repositoryId
          // catid: selectCatid
        })
        // if (basePath) {
        //   data.path =
        //     data.path.indexOf(basePath) === 0 ? data.path.substr(basePath.length) : data.path
        // }
        // if (data.catname && cats[data.catname] && typeof cats[data.catname] === 'object' && cats[data.catname].id) {
        //   // cat
        // }
        data.token = token
        if (dataSync !== 'normal') {
          // 开启同步功能
          count++
          // if (isNode) {}
          data.dataSync = dataSync

          const result = await api.saveItfAndMock(data)
          console.log('handleAddInterface -> result', result)
          if (result) {
            successNum--
            // callback({ showLoading: false})
          } else {
            // existNum = existNum + result.data.data.length
          }
        } else {
          // count++
          // const apipath = '/api/interface/add'
          // // if (isNode) {}
          // const result = await axios.post(apipath, data)
          // if (result.data.errcode) {
          //   successNum--;
          //   if (result.data.errcode === 40022) {
          //     existNum++
          //   }
          //   if (result.data.errcode === 40033) {
          //     break;
          //   }
          // }
        }
        if (count === len) {
          console.log(`成功导入接口 ${successNum} 个, 已存在的接口 ${existNum} 个`)
        }
      }
    },
    async handleAddCat (cats) {
      const catsObj = {}
      if (cats && Array.isArray(cats)) {
        // do something
      }
      return catsObj
    }
  }
}
</script>

<style lang="less" scoped>
.handle-data {
  height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: space-evenly;
  background: #f7f7f7;
}
.data-form {
  padding: 40px;
  background: #fff;
  border-radius: 20px;
}
</style>
