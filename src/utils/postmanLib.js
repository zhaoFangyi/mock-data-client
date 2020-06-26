import { safeArray, jsonParse, isJson5 } from './util'
import { HTTP_METHOD } from '@/constants/variable'
import URL from 'url'

export const handleParams = function (interfaceData, requestParams) {
  const interfaceRunData = Object.assign({}, { req_params: [] }, interfaceData)

  function paramsToObjectWithEnable (arr) {
    const obj = {}
    safeArray(arr).forEach(item => {
      if (item && item.name && (item.enable || item.require === '1')) {
        // obj[item.name] = handleValue(item.value, currDomain.global)
        obj[item.name] = item.value
        if (requestParams) {
          requestParams[item.name] = obj[item.name]
        }
      }
    })
    return obj
  }

  function paramsToObjectUnWithEnable (params) {

  }

  let { path, _id } = interfaceData
  let requestBody
  let requestOptions = {}

  interfaceData.req_params.forEach(item => {
    // const val = handleValue(item.value, currDomain.global)
    if (requestParams) {
      requestParams[item.name] = item.val
    }
    path = path.replace(`:${item.name}`, item.val || `:${item.name}`);
    path = path.replace(`{${item.name}}`, item.val || `{${item.name}}`);
  })

  // eslint-disable-next-line node/no-deprecated-api
  const urlObj = URL.parse(path, true)
  const url = URL.format({
    protocol: urlObj.protocol || 'http',
    host: urlObj.host,
    pathname: urlObj.pathname,
    query: Object.assign(urlObj.query, paramsToObjectWithEnable(interfaceRunData.req_query))
  })

  // 对 raw 类型的 form 处理

  const headers = paramsToObjectUnWithEnable(interfaceRunData.req_headers)
  requestOptions = {
    url,
    caseId: _id,
    method: interfaceRunData.method,
    headers,
    timeout: 82400000
  }
  if (HTTP_METHOD[interfaceRunData.method].request_body) {
    // eslint-disable-next-line no-debugger
    // debugger
    if (interfaceRunData.req_body_type === 'json') {
      const reqBody = isJson5(interfaceRunData.req_body_other)
      if (!reqBody) {
        requestBody = interfaceRunData.req_body_other
      } else {
        if (requestParams) {
          requestParams = Object.assign(requestParams, reqBody)
        }
        requestBody = reqBody
      }
    } else {
      requestBody = interfaceRunData.req_body_other
    }

    requestOptions.data = requestBody
    if (interfaceRunData.req_body_type === 'form') {
      // handle form
    } else if (interfaceRunData.req_body_type === 'file') {
      // handel
    }
  }
  return requestOptions
}

export const handleCurrDomain = function (domains, caseEnv) {
  let currDomain = domains.find(item => item.name === caseEnv)
  if (!currDomain) {
    currDomain = domains[0]
  }
  return currDomain
}

export const crossRequest = async function (defaultOptions, preScript, afterScript) {
  const options = Object.assign({}, defaultOptions)
  // const taskId = options.taskId || Math.random() + ''
  // const urlObj = URL.parse(options.url, true)
  // let query = {}
  // query = Object.assign(query, urlObj.query)

  if (preScript) {
    // do some script
  }

  const data = await new Promise((resolve, reject) => {
    options.error = options.success = function (res, header, data) {
      const message = ''
      if (res && typeof res === 'string') {
        res = jsonParse(data.res.body)
        data.res.body = res
      }
      if (isNaN(data.res.status)) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          body: res || message,
          header,
          message
        })
      }
      resolve(data)
    }
    window.crossRequest(options)
  })
  if (afterScript) {}
  return data
}
