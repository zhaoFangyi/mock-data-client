<template>
  <article class="blockEditor">
    <div class="header">
      <span class="title">
        <i class="el-icon-takeaway-box mr-10"></i>
        <router-link :to="{name: 'modules-list'}">仓库</router-link>
        <span class="slash"> / </span>
        <span>{{$route.query.name}}</span>
      </span>
      <div class="toolbar">
        <!-- <span class="fake-link edit el-icon-edit">编辑</span> -->
      </div>
      <div class="blockSearcher">
        <custom-search :data="[repository]"></custom-search>
        <!-- <el-input
          class="input"
          placeholder="搜索"></el-input> -->
      </div>
    </div>
    <div class="body">
      <div class="interfaceWrapper">
        <article class="interfaceList">
          <div class="header">
            <el-button class="newIntf" @click="openItfDialog">新建接口</el-button>
          </div>
          <div class="scrollWrapper">
            <el-scrollbar>
              <RSortable :onChange="handleSortItf">
                <ul class="body">
                  <li
                    class="sortable"
                    :class="{'active': item.id === curItf.id}"
                    v-for="item in itfs"
                    :data-id="item.id"
                    :key="item.id">
                    <div class="interface">
                      <span>
                        <a type="primary" @click="handleInterfaceClick(item)">
                          <div class="name">{{item.name}}</div>
                          <!-- <div class="url">{{item.url}}</div> -->
                          <el-tooltip class="item" effect="dark" open-delay="1000" :content="item.url" placement="top-start">
                            <!-- <el-button>上左</el-button> -->
                            <div class="url">{{item.url}}</div>
                          </el-tooltip>
                        </a>
                      </span>
                      <div class="toolbar">
                        <el-link class="mr6" icon="el-icon-edit" @click="handleClickEdit(item)"></el-link>
                        <el-link class="mr6" icon="el-icon-delete" @click="handleClickDel(item)"></el-link>
                      </div>
                    </div>
                  </li>
                </ul>
              </RSortable>
            </el-scrollbar>
          </div>
        </article>
        <article class="interfaceEditor">
          <div class="interfaceEditorToolbar">
            <el-button type="primary" size="mini" @click="showMoveItfDialog=true">移动/复制接口</el-button>
          </div>
          <div class="interfaceSummary">
            <div class="header">
              <copy-to-clipboard :text="curItf.name">
                <span class="title">{{curItf.name}}</span>
              </copy-to-clipboard>
              <ul class="summary">
                <li>
                  <copy-to-clipboard
                    :text="curItf.url"
                    type="right">
                    <span class="mr5">
                      <span class="label">地址：</span>
                      <a>{{curItf.url}}</a>
                    </span>
                  </copy-to-clipboard>
                </li>
                <li>
                  <copy-to-clipboard :text="curItf.method">
                    <span>
                      <span class="label">类型：</span>
                      <span>{{curItf.method}}</span>
                    </span>
                  </copy-to-clipboard>
                </li>
              </ul>
            </div>
            <div class="body interfaceArea">
              <div class="params_contenter" >
                <el-button  class="newIntf" @click="newExpect"><i class="el-icon-circle-plus-outline" ></i>新建参数</el-button>
                <el-scroll-bar>
                  <RSortable :onChange="handleExpectItf">
                    <ul class="body">
                      <li
                        class="sortable params_list"
                        v-for="exp in expects"
                        :key="exp.id"
                        :data-id="exp.id"
                        :class="{'active': exp.id === curExpect.id}"
                        @click="handleClickExpect(exp)"
                        >
                        <span class="ellipse_hidden">{{exp.name}}</span>
                        <div class="actions">
                          <i class="el-icon-edit" @click.stop="editExpect(exp)"></i>
                          <i class="el-icon-delete" @click.stop="deleteExpect(exp)"></i>
                        </div>
                      </li>
                    </ul>
                  </RSortable>
                </el-scroll-bar>
              </div>
              <div class="flex_1">
                <RSortable :onChange="onChangeRSortable">
                <ul class="ModuleList clearfix">
                  <li
                    v-for="item in mockData"
                    :data-id="item.id"
                    :key="item.id"
                    :class="['sortable', {'active': item.id === curMockData.id}]">
                    <div class="Module clearfix" @click="onClickRes(item)">
                      <span class="name">
                        {{item.name}}
                      </span>
                    </div>
                  </li>
                  <li data-id="addMock">
                    <span class="fake-link" @click="openResDialog">
                      <i class="el-icon-folder-add"></i>
                      新建Mock
                    </span>
                  </li>
                </ul>
                </RSortable>
                <div class="component-state-inspector">
                <vue-json-pretty
                  selectableType="single"
                  v-model="selectPath"
                  :deep="3"
                  :showSelectController="false"
                  :highlightMouseoverNode="true"
                  :data="curMockData.res_body"
                  @click="handleClick">
                </vue-json-pretty>
                <div class="toolbar">
                  <copy-to-clipboard
                    type="right"
                    :showDefaultIcon="false"
                    :text="copyData">
                    <el-link
                      size="mini"
                      type="text"
                      icon="el-icon-copy-document">复制</el-link>
                  </copy-to-clipboard>
                  <el-link
                    size="mini"
                    type="text"
                    class="replaceWith"
                    icon="el-icon-edit"
                    @click="handleReplaceWith">编辑</el-link>
                  <el-link
                    size="mini"
                    type="text"
                    class="delete"
                    icon="el-icon-delete"
                    @click="handleDeleteMock">删除</el-link>
                  <ReplaceDialog
                    :visible="showReplaceDialog"
                    @close="showReplaceDialog=false"></ReplaceDialog>
                </div>
                <state-inspector
                  :state="curMockData.res_body"
                ></state-inspector>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
    <AddItfDialog :visible="showItfDialog"
      :data="editItfModel"
      @close="showItfDialog=false"></AddItfDialog>
    <ResDialog
      :visible="showResDialog"
      :id="curItf.id"
      :mode="resActionMode"
      :data="resDialogData"
      @close="showResDialog=false"></ResDialog>
    <MoveItfDialog
      :visible="showMoveItfDialog"
      @close="showMoveItfDialog=false"></MoveItfDialog>
    <newExpectDialog
     :id="curItf.id"
     :visible="newExpectDialog"
     :mode="expectMode"
     :data="expectDialogData"
     @success="newExpectSuccess"
     @close="newExpectDialog=false"></newExpectDialog>
  </article>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import StateInspector from '@/components/StateInspector/index'
import CopyToClipboard from '@/components/CopyToClipboard/index'
import CustomSearch from '@/components/CustomSearch/index'
import RSortable from '@/components/RSortable/RSortable'
import store from '@/store/store.js'
import { parse, set } from '@/utils/util.js'
import ResDialog from './Dialog/ResDialog'
import ReplaceDialog from './Dialog/ReplaceDialog'
import MoveItfDialog from './Dialog/MoveItfDialog'
import AddItfDialog from './Dialog/AddItfDialog'
import newExpectDialog from './Dialog/newExpectDialog'
import api from '@/data/api.js'
import { mapState, mapGetters } from 'vuex'
import URI from 'urijs'
import * as types from '@/store/mutation-types.js'

export default {
  name: 'Bolck',
  components: {
    CopyToClipboard,
    StateInspector,
    CustomSearch,
    VueJsonPretty,
    RSortable,
    ResDialog,
    ReplaceDialog,
    AddItfDialog,
    MoveItfDialog,
    newExpectDialog
  },
  data () {
    return {
      resActionMode: 'add',
      expectMode: 'add',
      activeExpect: '',
      showResDialog: false,
      showReplaceDialog: false,
      showItfDialog: false,
      showMoveItfDialog: false,
      newExpectDialog: false,
      resDialogData: '',
      expectDialogData: {},
      editItfModel: '',
      repositoryId: '',
      selectData: '',
      selectPath: ''
    }
  },
  computed: {
    ...mapState([
      'repository',
      'curItfId',
      'mockData',
      'curMockId',
      'curExpectId'
    ]),
    ...mapGetters([
      'curItf',
      'curMockData',
      'itfs',
      'expects',
      'curExpect'
    ]),
    copyData () {
      return this.selectData || this.curMockData.res_body
    }
  },
  created () {
    this.repositoryId = this.$route.params.id
  },
  mounted () {
    window.hy = this
    store.$on('field-change', ({ path, value, newKey, remove }) => {
      console.log(99999, path, value, newKey, remove)
      try {
        let parsedValue
        if (value) {
          parsedValue = parse(value, true)
        }
        set(this.curMockData.res_body, path, parsedValue, (obj, field, value) => {
          this.$store.commit(types.CHANGE_MOCKDATA_FIELD, {
            obj,
            field,
            value,
            newKey,
            remove
          })
        })
        const payload = Object.assign({}, this.curMockData, {
          res_body: JSON.stringify(this.curMockData.res_body)
        })
        this.$store.dispatch('updateMockData', payload)
      } catch (e) {
        console.error(e)
      }
    })
    this.getRepositoryById()
  },
  methods: {
    // 编辑res Mock
    handleReplaceWith () {
      this.$nextTick(() => {
        this.resActionMode = 'edit'
        this.resDialogData = Object.assign({}, this.curMockData, {
          res_body: JSON.stringify(this.curMockData.res_body, null, 2)
        })
        this.showResDialog = true
      })
    },
    // 新增res mock
    openResDialog () {
      this.resActionMode = 'add'
      console.log(this.curExpectId,"curExpectIdcurExpectId")
      this.resDialogData = {
        name: '',
        expectId: this.curExpectId,
        res_body: JSON.stringify({})
      }
      this.showResDialog = true
    },
    // 新建参数期望
    newExpect () {
      this.newExpectDialog = true
    },
    // 编辑参数
    editExpect ({ name, body, id }) {
      const handleBody = body ? Object.entries(JSON.parse(body)).map(v => ({ key: v[0], value: v[1] })) : [{ key: '', value: '' }]
      this.expectMode = 'edit'
      this.newExpectDialog = true
      this.expectDialogData = {
        name,
        id,
        expectParams: handleBody
      }
    },
    // 删除参数
    deleteExpect ({ name, id }) {
      this.$confirm(`确认删除${name}期望吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteExpect', { id })
      })
    },
    handleDeleteMock () {
      const item = this.curMockData
      this.$confirm(`确认删除${item.name}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteMockData({
            id: item.id
          })
        })
    },
    deleteMockData (params) {
      api.deleteMockData(params)
        .then(res => {
          this.getRepositoryById()
        })
    },
    openItfDialog () {
      this.editItfModel = ''
      this.showItfDialog = true
    },
    getRepositoryById () {
      this.$store.dispatch('getRepository', this.repositoryId)
        .then(() => {
          const selectHref = new URI(this.$route.fullPath)
            .setSearch('itf', this.curItfId)
            .setSearch('mock', this.curMockId)
            .setSearch('expect', this.curExpectId)
            .href()
          this.$router.replace(selectHref)
        })
    },
    handleClickEdit ({ name, url, method, id }) {
      this.showItfDialog = true
      this.editItfModel = {
        name,
        url,
        method,
        id
      }
    },
    handleClickDel (item) {
      this.$confirm(`确认删除接口-${item.name}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItf({
            id: item.id
          })
        })
    },
    deleteItf (params) {
      const isDelSelf = params.id === this.curItfId
      this.$store.dispatch('deleteInterface', params)
        .then(() => {
          if (isDelSelf) {
            const selectHref = new URI(this.$route.fullPath)
              .setSearch('itf', this.curItfId)
              .setSearch('mock', this.curMockId)
              .href()
            this.$router.replace(selectHref)
          }
        })
    },
    onClickRes (item) {
      const selectHref = new URI(this.$route.fullPath)
        .setSearch('mock', item.id)
        .href()
      this.$router.replace(selectHref)
      this.$store.commit(types.MOCKDATA_ID_CUR_SET, item)
    },
    handleInterfaceClick (item) {
      this.$store.commit(types.INTERFACE_ID_CUR_SET, item)
      const defaultExpect = item?.expect?.[0]
      this.$store.commit(types.EXPECT_ID_CUR_SET, defaultExpect)
      this.$store.dispatch('getCurItf', { id: item.id }).then(() => {
        const selectHref = new URI(this.$route.fullPath)
          .setSearch('itf', item.id)
          .setSearch('mock', this.curMockId)
          .setSearch('expect',defaultExpect.id)
          .href()
        this.$router.replace(selectHref)
      })
    },
    handleClickExpect (exp) {
      this.$store.commit(types.EXPECT_ID_CUR_SET, exp)
      this.$store.dispatch('getMockDataList', exp.id).then(() => {
        const selectHref = new URI(this.$route.fullPath)
          .setSearch('itf', this.curItfId)
          .setSearch('mock', this.curMockId)
          .setSearch('expect', exp.id)
          .href()
        this.$router.replace(selectHref)
      })
    },
    onChangeRSortable (event, sortable) {
      const ids = sortable.toArray().filter(item => item !== 'addMock')
      this.$store.dispatch('sortMockDataList', ids)
    },
    handleSortItf (event, sortable) {
      const ids = sortable.toArray()
      this.$store.dispatch('sortInterfaceList', ids)
    },
    handleExpectItf (event, sortable) {
      const ids = sortable.toArray()
      this.$store.dispatch('sortExpectList', ids)
    },
    handleClick (path, data, treeName = '') {
      this.selectData = !data ? data + '' : data // 处理 data = null 的情况
    }
  }
}
</script>

<style lang="less" scoped>
@brand: #4A7BF7;
.mr5 {
  margin-right: 5px;
}
.mr6 {
  margin-right: 6px;
}
.blockEditor {
  > .header {
    display: flex;
    align-items: center;
    position: relative;
    padding: 20px 30px;
    background: #fafbfc;
    > .title {
      font-size: 20px;
      margin-right: 10px;
      .slash {
        color: #999;
      }
    }
    > .toolbar {
      flex: 1;
      display: inline-block;
      a, .fake-link {
        margin-right: 10px;
      }
    }
    > .desc {
      white-space: pre-wrap;
      margin: 1rem 0 .5rem;
      color: #666;
    }
    .blockSearcher {
      .input {
        margin-bottom: 0;
        width: 200px;
      }
    }
  }
}
.interfaceWrapper {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  padding: 20px;
  .interfaceList {
    width: 230px;
    flex-shrink: 0;
  }
  .interfaceEditor {
    overflow-x: hidden;
    padding: 0 1px;
    flex-grow: 1;
  }
}
.interfaceEditor {
  margin-left: 20px;
  position: relative;
  .interfaceEditorToolbar {
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    /deep/ .el-button {
      margin: 8px;
    }
  }
  .component-state-inspector {
    display: grid;
    // grid-template-columns: repeat(2, 1fr);
    grid-template-columns: 1fr 60px 1fr;
    padding: 20px;
  }
}
 .newIntf {
      margin-bottom: 10px;
      color: #3f51b5;
      border: 1px solid rgba(63, 81, 181, 0.5);
      width: 100%;
    }
.interfaceList {
  position: sticky;
  top: 10px;
  height: calc(100vh - 60px);
  .header {
    margin-bottom: 10px;
  }
  .scrollWrapper {
    border: 1px solid rgba(63, 81, 181, 0.5);
    border-radius: 4px;
  }
  ul.body {
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: calc(100vh - 115px);
    li {
      position: relative;
      padding: 10px;
      border-bottom: 1px solid rgba(63, 81, 181, 0.5);
      &:first-child {
        border-top-left-radius: 3px;
      }
      &:last-child {
        border-bottom: 0;
        border-bottom-left-radius: 3px;
      }
      .interface {
        position: relative;
        .name {
          position: relative;
          font-size: 13px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-right: 40px;
        }
        .url {
          font-size: 12px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: rgba(0, 0, 0, 0.54);
        }
        .toolbar {
          display: none;
          position: absolute;
          right: 0;
          top: 0;
          font-size: 14px;
        }
      }
      &:hover {
        .toolbar{
          display: block;
        }
      }
      &.active {
        .interface {
          .name a {
            color: #333;
            &:hover {
              color: #333;
            }
          }
          .toolbar {
            display: block;
          }
        }
      }
      &.active {
        border-left: 2px solid #3f51b5;
      }
    }
  }

}
.interfaceSummary {
  margin-bottom: 20px;
  > .header {
    padding: 20px 20px 10px 20px;
    background-color: #fafbfc;
    > .title {
      font-size: 16px;
      margin-right: 10px;
    }
  }
  > .body{
    display: flex;
    flex-direction: row;
    .params_contenter{
      text-align: center;
      width: 144px;
       ul.body {
        margin: 0;
        padding: 0;
        border: 1px solid rgba(63, 81, 181, 0.5);
        border-radius: 4px;
        li.params_list{
          list-style: none;
          cursor: pointer;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(63, 81, 181, 0.5);
          &:first-child {
            border-top-left-radius: 3px;
          }
          &:last-child {
            border-bottom: 0;
            border-bottom-left-radius: 3px;
          }
          .actions{
            flex: 0 0 auto;
          }
          &.active {
          background-color: #f2f5ff;
          }
        }
       }
    }
  }
  .summary {
    color: #666;
    font-size: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      margin-bottom: 4px;
      .label {
        color: #666;
        margin-right: 6px;
      }
    }
  }
  > .body {
    .component-state-inspector {
      .toolbar {
        padding-right: 10px;
        border-right: 1px solid #eee;
        .copyJson {
          color: rgb(153, 153, 153);
        }
        .replaceWith {
          display: block;
          margin-top: 10px;
        }
        .delete {
          display: block;
          margin-top: 10px;
        }
      }
    }
  }
}
.flex_1{
  flex:1
}
.ellipse_hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ModuleList {
  margin: 0;
  padding: 0 20px;
  list-style: none;
  border-bottom: 1px solid #e1e4e8;
  background-color: #fafbfc;
  > li {
    position: relative;
    display: block;
    float: left;
    margin-bottom: -1px;
    padding: .8rem 1.2rem;
    border: 1px solid transparent;
    border-width: 3px 1px 0px 1px;
    border-radius: .4rem .4rem 0 0;
    &.active {
      border-bottom-color: transparent;
      background-color: white;
      cursor: default;
      border-color: #3f51b5 #e1e4e8 transparent #e1e4e8;
    }
    &.active:hover {
      background-color: white;
    }
    > .Module {
      position: relative;
      cursor: pointer;
      .name {
        color: #586069;
      }
      .toolbar {
        display: inline-block;
        a, .fake-link {
          margin-left: 5px;
          font-size: 14px;
          color: #999;
          &:hover {
            color: @brand;
          }
        }
      }
    }
  }
  > li:hover > .Module {
    .toolbar {
      display: inline-block
    }
  }
  > li.active > .Module {
    a.name {
      color: #333;
    }
    .toolbar {
      display: inline-block;
    }
  }
}
</style>
