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
    <a :href="downHref"
      target="_black"
      rel="noopener noreferrer">
      <el-button type="primary" icon="el-icon-upload">
        {{' '}}
        导出{{' '}}
      </el-button>
    </a>
  </div>
</template>

<script>
import URL from 'url'
import { unbase64 } from '@/utils/util'
import api from '@/data/api'
// const GenerateSchema = require('generate-schema/src/schemas/json.js')

// const transformJsonToSchema = json => {
//   json = json || {};
//   let jsonData = jsonParse(json);

//   jsonData = GenerateSchema(jsonData);

//   const schemaData = JSON.stringify(jsonData);

//   return schemaData;
// };
export default {
  name: 'About',
  data () {
    return {
      repositoryId: this.$route.params.id
    }
  },
  computed: {
    downHref () {
      return `http://localhost:9999/plugin/export?type=json&pid=${this.repositoryId}`
    }
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
    handleExport1 () {
      const down = document.createElement('a')
      down.href = this.downHref
      console.log(down)
      down.download = 'test.json'
      document.body.appendChild(down)
      down.click()
      down.remove()
    },
    handleFile (info) {
      const reader = new FileReader()
      reader.readAsText(info.file)
      reader.onload = async res => {
        res = await this.importDataModule(res.target.result)
        console.log('handleFile -> res', res)
        await this.handleAddInterface(res)
      }
    },
    importDataModule (res) {
      try {
        res = JSON.parse(res)
        res = res.log.entries

        res = res.filter(item => {
          if (!item) return false
          return item.response.content.mimeType.indexOf('application/json') === 0
        })
        const interfaceData = { apis: [] }
        console.log('importDataModule -> res', res)
        // const interfaceData = { apis: [] }
        res = this.checkInterRepeat(res)
        if (res && res.length) {
          for (const item in res) {
            const data = this.importHar(res[item], ['title', 'path', 'method', 'res_body'])
            interfaceData.apis.push(data)
          }
        }

        return interfaceData
      } catch (e) {
        console.error(e)
        console.log('数据格式有误')
      }
    },
    checkInterRepeat (interData) {
      const obj = {}
      const arr = []
      for (const item in interData) {
        const key = interData[item].request.url + '|' + interData[item].request.method
        if (!obj[key]) {
          arr.push(interData[item])
          obj[key] = true
        }
      }
      return arr
    },
    importHar (data, key) {
      const reflect = {
        title: 'url',
        path: 'url',
        method: 'method',
        desc: 'description',
        req_query: 'queryString',
        req_body_form: 'params',
        req_body_other: 'text'
      }
      const allKey = [
        'title',
        'path',
        'method',
        'req_query',
        'req_body_type',
        'req_body_form',
        'req_body_other',
        'res_body_type',
        'res_body',
        'req_headers'
      ]
      key = key || allKey
      const res = {}
      let reqType = 'json';
      let header
      data.request.headers.forEach(item => {
        if (!item || !item.name || !item.value) return null
        if (/content-type/i.test(item.name) && item.value.indexOf('application/json') === 0) {
          reqType = 'json'
          header = 'application/json'
        } else if (
          /content-type/i.test(item.name) &&
        item.value.indexOf('application/x-www-form-urlencoded') === 0
        ) {
          header = 'application/x-www-form-urlencoded';
          reqType = 'form';
        } else if (
          /content-type/i.test(item.name) &&
        item.value.indexOf('multipart/form-data') === 0
        ) {
          header = 'multipart/form-data';
          reqType = 'form';
        }
      })

      for (let item in key) {
        item = key[item]
        const reqTarget = data.request[reflect[item]]
        if (item === 'req_query') {
          // res[item] = this.handleReq(reqTarget)
        } else if (item === 'req_body_form' && reqType === 'form' && data.request.postData) {

        } else if (item === 'req_body_other' && reqType === 'json' && data.request.postData) {

        } else if (item === 'req_header') {
          res[item] = [
            {
              name: 'Content-Type',
              value: header
            }
          ]
        } else if (item === 'req_body_type') {
          res[item] = reqType
        } else if (item === 'path') {
          console.log(data.request)
          res[item] = this.handlePath(reqTarget)
        } else if (item === 'title') {
          res[item] = this.handlePath(reqTarget)
        } else if (item === 'res_body_type') {
          res[item] = 'json'
        } else if (item === 'res_body') {
          // res.res_body_is_json_schema = true
          // base64
          if (data.response.content.encoding && data.response.content.encoding === 'base64') {
            res[item] = unbase64(data.response.content.text)
          } else {
            res[item] = data.response.content.text
          }
        } else {
          res[item] = reqTarget
        }
      }
      return res
    },
    async handleAddInterface (info, basePath, dataSync = 'good', token) {
      console.log('handleAddInterface -> info', info)
      // const cats = await this.handleAddCat(info.cats)
      // if (cats === false) {}

      const res = info.apis
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
    },
    handlePath (path) {
      console.log('handlePath -> path', path)
      path = this.parseUrl(path).pathname;
      path = decodeURIComponent(path);
      if (!path) return '';

      path = path.replace(/{{\w*}}/g, '');

      if (path[0] !== '/') {
        path = '/' + path;
      }
      return path;
    },
    parseUrl (url) {
      // eslint-disable-next-line node/no-deprecated-api
      return URL.parse(url);
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
