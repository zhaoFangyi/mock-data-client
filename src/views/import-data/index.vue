<template>
  <div class="handle-data">
    <el-upload
      class="upload-demo"
      drag
      multiple
      :http-request="handleFile"
      action="https://jsonplaceholder.typicode.com/posts/">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>

<script>
import api from '@/data/api'
import importHar from './import-har'
// import importJson from './import-json'
// const GenerateSchema = require('generate-schema/src/schemas/json.js')

// const transformJsonToSchema = json => {
//   json = json || {};
//   let jsonData = jsonParse(json);

//   jsonData = GenerateSchema(jsonData);

//   const schemaData = JSON.stringify(jsonData);

//   return schemaData;
// };
export default {
  name: 'ImportData',
  data () {
    return {
      repositoryId: this.$route.params.id
    }
  },
  computed: {
  },
  methods: {
    handleExport () {
      api.exportOneRepo({
        pid: this.repositoryId,
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
        res = await importHar(res.target.result)
        // const res2 = await importJson(res.target.result)
        console.log(res)
        // console.log(res2)
        await this.handleAddInterface(res)
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
          repositoryId: this.repositoryId
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
  padding: 20px;
  display: flex;
  justify-content: space-evenly;
}
</style>
