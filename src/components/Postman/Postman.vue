<template lang="pug">
  div.pd-20
    el-form(:model="model" size="mini" ref="form")
      el-form-item(label="请求方式")
        el-select(v-model="model.method" placeholder="请选择")
          el-option(v-for="item in Methods"
            :key="item.value"
            :label="item.label"
            :value="item.value")
      el-form-item(label="地址")
        el-input(v-model="model.path")
      el-form-item(label="")
        el-button( v-loading="loading" type="primary" @click="reqRealInterface") 发送
</template>

<script>
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
  props: {
    curUid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      Methods,
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
      if (tempJson && typeof tempJson === 'object') {} else if (isJson(result.body)) {}

      // 对 返回值数据结构 和 定义的 返回数据结构 进行 格式校验
    }
  }
}
</script>

<style lang="less" scoped>
.pd-20 {
  padding: 20px;
}
</style>
