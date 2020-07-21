<template>
  <section class="moduleListWrapper" v-loading="loading">
    <nav class="toolbar">
      <custom-search class="search-input" placeholder="搜索仓库/名称/接口" :data="repositories" position="left"></custom-search>
      <!-- <el-input
        class="search-input"
        v-model.lazy="query"
        clearable
        placeholder="搜索模块: 名称"
      >
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input> -->
      <el-button class="create mb-20" type="primary" @click="openFrom">新建仓库</el-button>
      <el-button class="create mb-20" type="primary" @click="importData()">导入API</el-button>
      <!-- <el-button class="create" type="primary" @click="mockData">mock data</el-button> -->
    </nav>
    <div class="body">
      <div class="moduleList">
        <div
          v-for="item in moduleList"
          :key="item.id">
          <el-card class="module card" >
            <div slot="header" class="card-block">
              <router-link tag="el-link"
                :to="{ name: 'interface-list', params: { id: item.id}, query: {name: item.description,} }">
                <i class="el-icon-s-management"></i>
                <span class="break-all">{{item.name}}</span>
              </router-link>
              <div class="actions">
                <a :href="`${serve}/plugin/export?type=json&pid=${item.id}`"
                  target="_black"
                  rel="noopener noreferrer">
                  <el-link class="mr6" icon="el-icon-download"></el-link>
                </a>
                <!-- <el-link class="mr6" icon="el-icon-upload" @click="importData(item)"></el-link> -->
                <el-link class="mr6" icon="el-icon-edit" @click="handleEditModule(item)"></el-link>
                <el-link class="mr6" icon="el-icon-delete" @click="handleDeleteModule(item)"></el-link>
              </div>
            </div>
            <div class="break-all">
              {{item.description}}
            </div>
            <div class="card-footer">
              <span class="from-now">
                {{item.updatedAt | fromNow}}
              </span>
            </div>
          </el-card>
        </div>
      </div>
      <div class="no-data-tooltip" v-if="!moduleList.length">这里是空空的，快去新建仓库吧~</div>
    </div>
    <el-dialog
      :title="mode === 'create'? '新建仓库' : '编辑仓库'"
      width="500px"
      lock-scroll
      :visible.sync="showForm">
      <el-form :model="model" size="mini" ref="form">
        <el-form-item label="仓库名称">
          <el-input
            v-model="model.name"
            placeholder="请输入仓库名称"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="备注名称">
          <el-input clearable v-model="model.description" placeholder="请输入备注名称"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button  @click="showForm=false" size="mini">取消</el-button>
        <el-button size="mini" type="primary" @click="createModule">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import api from '@/data/api.js'
import { serve } from '@/constants'
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'
import CustomSearch from '@/components/CustomSearch'
import dayjs from 'dayjs'

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime).locale('zh-cn')

export default {
  name: 'ModulesList',
  components: {
    CustomSearch
  },
  filters: {
    fromNow: function (value) {
      return dayjs(value).fromNow();
    }
  },
  data () {
    return {
      query: '',
      loading: false,
      serve,
      moduleList: '',
      showForm: false,
      mode: '',
      model: {
        name: '',
        description: ''
      }
    }
  },
  mounted () {
    this.getList()
  },
  watch: {
    showForm (flag) {
      if (flag) {
        this.model = {
          name: '',
          description: ''
        }
      }
    }
  },
  computed: {
    ...mapState(['repositories'])
  },
  methods: {
    ...mapMutations({ setRepositories: types.REPOSITORIES_SET }),
    mockData () {
      api.getTaskTypeList()
        .then(res => {
          console.log('mockData -> res', res)
        })
    },
    importData () {
      this.$router.push({
        name: 'import-data'
      })
    },
    openFrom () {
      this.showForm = true
      this.mode = 'create'
    },
    getList () {
      this.loading = true
      api.getRepositoryList({ key: this.query })
        .then(res => {
          console.log('getList -> res', res)
          this.moduleList = res.data
          this.setRepositories(res.data)
        })
        .catch(err => {
          console.log('getList -> err', err)
        }).finally(() => {
          this.loading = false
        })
    },
    createModule () {
      const apiName = this.model.id ? 'updateRepository' : 'createRepository'
      api[apiName](this.model)
        .then(res => {
          this.$message.success('创建成功！')
          this.showForm = false
          this.getList()
          // 老板说啦不让跳
          // if (this.mode === 'create') {
          //   this.$router.push({
          //     name: 'interface-list',
          //     params: { id: res.data.id },
          //     query: { name: this.model.description }
          //   })
          // }
        })
    },
    handleEditModule ({ name, description, id }) {
      this.showForm = true
      this.mode = 'edit'
      this.$nextTick(() => {
        this.model = {
          description,
          name,
          id
        }
      })
    },
    handleDeleteModule (item) {
      this.$confirm(`确认删除 ${item.description} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRepository({
            id: item.id
          })
        })
    },
    deleteRepository (params) {
      api.deleteRepository(params)
        .then(res => {
          this.getList()
        })
    }
  }
}
</script>

<style lang="less" scoped>
.mr6 {
  margin-right: 6px;
}
.moduleListWrapper {
  height: 100vh;
  overflow: auto;
  padding: 20px;
  .toolbar {
    margin-bottom: 20px;
    border-bottom: 1px solid #e1e4e8;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    .create {
      margin-left: 20px;
    }
  }
  .search-input {
    flex: 1;
    min-width: 300px;
    margin-bottom: 20px;
  }
  .body {
    margin-bottom: 20px;
  }
}

.no-data-tooltip {
  margin-top: 200px;
  text-align: center;
  color: #888;
}

.moduleList {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 20px;
  padding: 0 15px;
  @media screen and (max-width: 1080px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (max-width: 980px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 780px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
  .module.card {
    margin-bottom: 10px;
    &:hover {

    }
  }
  .card-block {
    display: flex;
    .actions {
      margin-left: auto;
      padding-left: 3px;
      white-space: nowrap;
    }
  }
  .card-footer {
    padding-top: 0;
    background-color: white;
    border-top: none;
    color: #666;
    font-size: 12px;
    .from-now {
      float: right;
    }
  }
  /deep/ .el-card__header {
    padding: 15px;
  }
}
.break-all {
  word-break: break-all;
}
</style>
