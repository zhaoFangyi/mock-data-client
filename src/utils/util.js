import * as CircularJSON from './transfer'
import path from 'path'
import json5 from 'json5'

const Base64 = require('js-base64').Base64

function cached (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const classifyRE = /(?:^|[-_/])(\w)/g
export const classify = cached((str) => {
  return str && str.replace(classifyRE, toUpper)
})

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

export const MAX_STRING_SIZE = 10000
export const MAX_ARRAY_SIZE = 5000

export const UNDEFINED = '__vue_devtool_undefined__'
export const INFINITY = '__vue_devtool_infinity__'
export const NEGATIVE_INFINITY = '__vue_devtool_negative_infinity__'
export const NAN = '__vue_devtool_nan__'

export const SPECIAL_TOKENS = {
  true: true,
  false: false,
  undefined: UNDEFINED,
  null: null,
  '-Infinity': NEGATIVE_INFINITY,
  Infinity: INFINITY,
  NaN: NAN
}

export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function sortByKey (state) {
  return state && state.slice().sort((a, b) => {
    if (a.key < b.key) return -1
    if (a.key > b.key) return 1
    return 0
  })
}

export function openInEditor (file) {
  // Console display
  // const fileName = file.replace(/\\/g, '\\\\')
  // const src = `fetch('${SharedData.openInEditorHost}__open-in-editor?file=${encodeURI(file)}').then(response => {
  //   if (response.ok) {
  //     console.log('File ${fileName} opened in editor')
  //   } else {
  //     const msg = 'Opening component ${fileName} failed'
  //     const target = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {}
  //     if (target.__VUE_DEVTOOLS_TOAST__) {
  //       target.__VUE_DEVTOOLS_TOAST__(msg, 'error')
  //     } else {
  //       console.log('%c' + msg, 'color:red')
  //     }
  //     console.log('Check the setup of your project, see https://github.com/vuejs/vue-devtools/blob/master/docs/open-in-editor.md')
  //   }
  // })`
  // if (isChrome) {
  //   chrome.devtools.inspectedWindow.eval(src)
  // } else {
  //   // eslint-disable-next-line no-eval
  //   eval(src)
  // }
}
class EncodeCache {
  constructor () {
    this.map = new Map()
  }

  /**
   * Returns a result unique to each input data
   * @param {*} data Input data
   * @param {*} factory Function used to create the unique result
   */
  cache (data, factory) {
    const cached = this.map.get(data)
    if (cached) {
      return cached
    } else {
      const result = factory(data)
      this.map.set(data, result)
      return result
    }
  }

  clear () {
    this.map.clear()
  }
}
const encodeCache = new EncodeCache()

export function getComponentName (options) {
  const name = options.name || options._componentTag
  if (name) {
    return name
  }
  const file = options.__file // injected by vue-loader
  if (file) {
    return classify(basename(file, '.vue'))
  }
}
function basename (filename, ext) {
  return path.basename(
    filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/'),
    ext
  )
}

export function getCustomComponentDefinitionDetails (def) {
  let display = getComponentName(def)
  if (display) {
    if (def.name && def.__file) {
      display += ` <span>(${def.__file})</span>`
    }
  } else {
    display = '<i>Unknown Component</i>'
  }
  return {
    _custom: {
      type: 'component-definition',
      display,
      tooltip: 'Component definition',
      ...def.__file ? {
        file: def.__file
      } : {}
    }
  }
}

export function getCustomFunctionDetails (func) {
  let string = ''
  let matches = null
  try {
    string = Function.prototype.toString.call(func)
    matches = String.prototype.match.call(string, /\([\s\S]*?\)/)
  } catch (e) {
    // Func is probably a Proxy, which can break Function.prototype.toString()
  }
  // Trim any excess whitespace from the argument string
  const match = matches && matches[0]
  const args = typeof match === 'string'
    ? `(${match.substr(1, match.length - 2).split(',').map(a => a.trim()).join(', ')})` : '(?)'
  const name = typeof func.name === 'string' ? func.name : ''
  return {
    _custom: {
      type: 'function',
      display: `<span>ƒ</span> ${escape(name)}${args}`
    }
  }
}
export function specialTokenToString (value) {
  if (value === null) {
    return 'null'
  } else if (value === UNDEFINED) {
    return 'undefined'
  } else if (value === NAN) {
    return 'NaN'
  } else if (value === INFINITY) {
    return 'Infinity'
  } else if (value === NEGATIVE_INFINITY) {
    return '-Infinity'
  }
  return false
}

const ESC = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '&': '&amp;'
}
export function escape (s) {
  return s.replace(/[<>"&]/g, escapeChar)
}
function escapeChar (a) {
  return ESC[a] || a
}

export function getCustomRefDetails (instance, key, ref) {
  let value
  if (Array.isArray(ref)) {
    value = ref.map((r) => getCustomRefDetails(instance, key, r)).map(data => data.value)
  } else {
    let name
    if (ref._isVue) {
      name = getComponentName(ref.$options)
    } else {
      name = ref.tagName.toLowerCase()
    }

    value = {
      _custom: {
        display: `&lt;${name}` +
          (ref.id ? ` <span class="attr-title">id</span>="${ref.id}"` : '') +
          (ref.className ? ` <span class="attr-title">class</span>="${ref.className}"` : '') + '&gt;',
        uid: instance.__VUE_DEVTOOLS_UID__,
        type: 'reference'
      }
    }
  }
  return {
    type: '$refs',
    key: key,
    value,
    editable: false
  }
}

export function getCustomMapDetails (val) {
  const list = []
  val.forEach(
    (value, key) => list.push({
      key,
      value
    })
  )
  return {
    _custom: {
      type: 'map',
      display: 'Map',
      value: list,
      readOnly: true,
      fields: {
        abstract: true
      }
    }
  }
}
export function parse (data, revive) {
  // eslint-disable-next-line no-debugger
  return revive
    ? CircularJSON.parse(data, reviver)
    : CircularJSON.parse(data)
}

export function isJson (json) {
  if (!json) return false
  try {
    json = JSON.parse(json)
    return json
  } catch (e) {
    return false
  }
}
export function isJson5 (json) {
  if (!json) return false
  try {
    json = json5.parse(json)
    return json
  } catch (e) {
    return false
  }
}

export const joinPath = (domain, joinPath) => {
  const l = domain.length
  if (domain[l - 1] === '/') {
    domain = domain.substr(0, l - 1)
  }
  if (joinPath[0] !== '/') {
    joinPath = joinPath.substr(1)
  }
  return domain + joinPath
}

export const safeArray = (arr) => {
  return Array.isArray(arr) ? arr : []
}

export function set (object, path, value, cb = null) {
  const sections = Array.isArray(path) ? path : path.split('.')
  while (sections.length > 1) {
    object = object[sections.shift()]
  }
  const field = sections[0]
  if (cb) {
    cb(object, field, value)
  } else {
    object[field] = value
  }
}
function reviver (key, val) {
  if (val === UNDEFINED) {
    return undefined
  } else if (val === INFINITY) {
    return Infinity
  } else if (val === NEGATIVE_INFINITY) {
    return -Infinity
  } else if (val === NAN) {
    return NaN
  } else if (val && val._custom) {
    if (val._custom.type === 'component') {
      // return instanceMap.get(val._custom.id)
    } else if (val._custom.type === 'map') {
      return reviveMap(val)
    } else if (val._custom.type === 'set') {
      return reviveSet(val)
    }
  } else if (symbolRE.test(val)) {
    const [, string] = symbolRE.exec(val)
    return Symbol.for(string)
  } else if (specialTypeRE.test(val)) {
    const [, type, string] = specialTypeRE.exec(val)
    return new window[type](string)
  } else {
    return val
  }
}
const specialTypeRE = /^\[native (\w+) (.*)\]$/
const symbolRE = /^\[native Symbol Symbol\((.*)\)\]$/

export function reviveMap (val) {
  const result = new Map()
  const list = val._custom.value
  for (let i = 0; i < list.length; i++) {
    const { key, value } = list[i]
    result.set(key, reviver(null, value))
  }
  return result
}

export function reviveSet (val) {
  const result = new Set()
  const list = val._custom.value
  for (let i = 0; i < list.length; i++) {
    const value = list[i]
    result.add(reviver(null, value))
  }
  return result
}

export function getCustomSetDetails (val) {
  const list = Array.from(val)
  return {
    _custom: {
      type: 'set',
      display: `Set[${list.length}]`,
      value: list,
      readOnly: true
    }
  }
}

export function stringify (data) {
  // Create a fresh cache for each serialization
  encodeCache.clear()
  return CircularJSON.stringify(data, replacer)
}

function replacer (key) {
  const val = this[key]
  const type = typeof val
  if (Array.isArray(val)) {
    const l = val.length
    if (l > MAX_ARRAY_SIZE) {
      return {
        _isArray: true,
        length: l,
        items: val.slice(0, MAX_ARRAY_SIZE)
      }
    }
    return val
  } else if (typeof val === 'string') {
    if (val.length > MAX_STRING_SIZE) {
      return val.substr(0, MAX_STRING_SIZE) + `... (${(val.length)} total length)`
    } else {
      return val
    }
  } else if (type === 'undefined') {
    return UNDEFINED
  } else if (val === Infinity) {
    return INFINITY
  } else if (val === -Infinity) {
    return NEGATIVE_INFINITY
  } else if (type === 'function') {
    return getCustomFunctionDetails(val)
  } else if (type === 'symbol') {
    return `[native Symbol ${Symbol.prototype.toString.call(val)}]`
  } else if (val !== null && type === 'object') {
    const proto = Object.prototype.toString.call(val)
    if (proto === '[object Map]') {
      return encodeCache.cache(val, () => getCustomMapDetails(val))
    } else if (proto === '[object Set]') {
      return encodeCache.cache(val, () => getCustomSetDetails(val))
    } else if (proto === '[object RegExp]') {
      // special handling of native type
      return `[native RegExp ${RegExp.prototype.toString.call(val)}]`
    } else if (proto === '[object Date]') {
      return `[native Date ${Date.prototype.toString.call(val)}]`
    } else if (proto === '[object Error]') {
      return `[native Error ${val.message}]`
    // } else if (val.state && val._vm) {
    //   return encodeCache.cache(val, () => getCustomStoreDetails(val))
    // } else if (val.constructor && val.constructor.name === 'VueRouter') {
    //   return encodeCache.cache(val, () => getCustomRouterDetails(val))
    // } else if (val._isVue) {
    //   return encodeCache.cache(val, () => getCustomInstanceDetails(val))
    } else if (typeof val.render === 'function') {
      return encodeCache.cache(val, () => getCustomComponentDefinitionDetails(val))
    } else if (val.constructor && val.constructor.name === 'VNode') {
      return `[native VNode <${val.tag}>]`
    }
  } else if (Number.isNaN(val)) {
    return NAN
  }
  return sanitize(val)
}

function sanitize (data) {
  if (
    !isPrimitive(data) &&
    !Array.isArray(data) &&
    !isPlainObject(data)
  ) {
    // handle types that will probably cause issues in
    // the structured clone
    return Object.prototype.toString.call(data)
  } else {
    return data
  }
}

function isPrimitive (data) {
  if (data == null) {
    return true
  }
  const type = typeof data
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'boolean'
  )
}

export function copyToClipboard (state) {
  if (typeof document === 'undefined') return
  const dummyTextArea = document.createElement('textarea')
  dummyTextArea.textContent = stringify(state)
  document.body.appendChild(dummyTextArea)
  dummyTextArea.select()
  document.execCommand('copy')
  document.body.removeChild(dummyTextArea)
}

export function jsonParse (json) {
  try {
    return JSON.parse(json)
  } catch (err) {
    return json
  }
}

export function jsonFormat (json) {
  try {
    return JSON.stringify(JSON.parse(json), null, '   ')
  } catch (e) {
    return json
  }
}

export function unbase64 (base64Str) {
  try {
    return Base64.decode(base64Str);
  } catch (err) {
    return base64Str;
  }
};
