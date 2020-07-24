<template lang="pug">
  .test-api
    p.tip 请安装 Mig 浏览器扩展以提供浏览器跨域请求能力
    el-form.request-form(:model="model" size="mini" ref="form")
      el-form-item(label="")
        el-select(v-model="model.method" placeholder="请求方式")
          el-option(v-for="item in Methods"
            :key="item.value"
            :label="item.label"
            :value="item.value")
      el-form-item.request-url(label="")
        el-input(v-model="model.path", placeholder="请求地址")
      el-form-item(label="")
        el-button(:loading="loading" type="primary" @click="reqRealInterface") 发送
        el-button(:loading="loading" type="primary" @click="reqRealInterface") 保存
    .response-box
      el-tabs(v-model="activeName" @tab-click="handleClick")
        el-tab-pane(label="body" name="first")
          RCodeMirror(ref="rCode" v-model="test_res_body")
        el-tab-pane(label="header" name="second")
          el-form(size="mini" label-width="130px")
            el-form-item(label="Connection")
              span {{test_res_header.connection}}
            el-form-item(label="Content-Length")
              span {{test_res_header['content-length']}}
            el-form-item(label="Content-Type")
              span {{test_res_header['content-type']}}
            el-form-item(label="Date")
              span {{test_res_header['date']}}
            el-form-item(label="Vary")
              span {{test_res_header['vary']}}
        //- el-tab-pane(label="cookie" name="third") cookie
</template>

<script>
import RCodeMirror from '@/components/RCodeMirror/RCodeMirror'
import { Methods } from '@/constants'
import {
  handleParams,
  crossRequest
} from '@/utils/postmanLib.js'
import {
  isJson
} from '@/utils/util.js'

export default {
  name: 'Postman',
  components: {
    RCodeMirror
  },
  props: {
    curUid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeName: 'first',
      loading: false,
      Methods,
      test_res_header: {},
      test_res_body: null,
      model: {
        path: 'http:localhost:9999/api/monitor/task/getTaskTypeList',
        method: 'POST',
        req_params: [
          {
            name: 'name',
            value: 'fangyi',
            example: '',
            desc: ''
          },
          {
            name: 'age',
            value: 20,
            example: '',
            desc: ''
          }
        ],
        req_query: [
          {
            name: 'page',
            value: 1,
            enable: true,
            example: '',
            desc: '',
            required: ''
          }
        ],
        req_headers: [],
        req_body_type: 'json',
        req_body_form: [],
        req_body_other: []
      }
    }
  },
  methods: {
    async reqRealInterface () {
      if (this.loading) {
        return null
      }
      this.loading = true

      const options = handleParams(this.model)
      console.log('reqRealInterface -> options', options)
      let result

      try {
        options.taskId = this.curUid

        result = await crossRequest(options, options.pre_script || this.pre_script, options.after_script || this.after_script)
        console.log('reqRealInterface -> result', result)

        result = {
          header: result.res.header,
          body: result.res.body,
          status: result.res.status,
          statusText: result.res.statusText,
          runTime: result.runTime
        }
      } catch (data) {
        console.log(data)
        result = {
          header: data.header,
          body: data.body,
          status: null,
          statusText: data.message
        };
      }

      this.loading = false
      console.log(result)
      const tempJson = result.body
      if (tempJson && typeof tempJson === 'object') {
        result.body = JSON.stringify(tempJson, null, '  ');
        this.model.res_body_type = 'json'
      } else if (isJson(result.body)) {
        this.model.res_body_type = 'json'
      }

      // 对 返回值数据结构 和 定义的 返回数据结构 进行 格式校验
      this.test_res_body = result.body
      this.test_res_header = result.header || {}
    }
  }
}
</script>

<style lang="less" scoped>
.test-api {
  padding: 30px;
}
.tip {
  font-size: 12px;
  color: #aaa;
  &:before {
    content: '*'
  }
}
.request-form {
  display: flex;
}
.request-url {
  flex: 1;
  margin: 0 10px;
  max-width: 800px;
}
.response-box {
  // padding: 20px;
}
</style>
