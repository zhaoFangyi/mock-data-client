<template>
  <section class="moduleListWrapper">
    <nav class="toolbar">
      <el-input
        v-model.lazy="query"
        clearable
        placeholder="搜索模块: 名称"
      >
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
      <el-button class="create" type="primary" @click="openFrom">新建仓库</el-button>
      <el-button class="create" type="primary" @click="mockData">mock data</el-button>
    </nav>
    <div class="body">
      <div class="moduleList">
        <div
          v-for="item in moduleList"
          :key="item.id">
          <el-card class="module card" >
            <div slot="header" class="card-block">
              <router-link tag="el-link"
                :to="{ name: 'block-list', params: { id: item.id}, query: {name: item.moduleName,} }">
                <i class="el-icon-s-management"></i>
                <span>{{item.name}}</span>
              </router-link>
              <div class="actions">
                <a :href="`http://localhost:9999/plugin/export?type=json&pid=${item.id}`"
                  target="_black"
                  rel="noopener noreferrer">
                  <el-link class="mr6" icon="el-icon-download"></el-link>
                </a>
                <el-link class="mr6" icon="el-icon-upload" @click="importData(item)"></el-link>
                <el-link class="mr6" icon="el-icon-edit" @click="handleEditModule(item)"></el-link>
                <el-link class="mr6" icon="el-icon-delete" @click="handleDeleteModule(item)"></el-link>
              </div>
            </div>
            <div>
              {{item.moduleName}}
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-dialog
      title="新建仓库"
      width="500px"
      lock-scroll
      :visible.sync="showForm">
      <el-form :model="model" size="mini" ref="form">
        <el-form-item lable="名称">
          <el-input
            v-model="model.name"
            placeholder="请输入名称"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-input clearable v-model="model.moduleName" placeholder="请输入仓库名称"></el-input>
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
export default {
  name: 'ModulesList',
  data () {
    return {
      query: '',
      moduleList: '',
      showForm: false,
      model: {
        name: '',
        moduleName: ''
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
          moduleName: ''
        }
      }
    }
  },
  methods: {
    mockData () {
      api.getTaskTypeList()
        .then(res => {
          console.log('mockData -> res', res)
        })
    },
    importData (item) {
      this.$router.push({
        name: 'import-data',
        params: { id: item.id }
      })
    },
    openFrom () {
      this.showForm = true
    },
    getList () {
      api.getRepositoryList({ key: this.query })
        .then(res => {
          this.moduleList = res.data
        })
        .catch(err => {
          console.log('getList -> err', err)
        })
    },
    createModule () {
      const apiName = this.model.id ? 'updateRepository' : 'createRepository'
      api[apiName](this.model)
        .then(res => {
          this.showForm = false
          this.getList()
        })
    },
    handleEditModule ({ name, moduleName, id }) {
      this.showForm = true
      this.$nextTick(() => {
        this.model = {
          name,
          moduleName,
          id
        }
      })
    },
    handleDeleteModule (item) {
      this.$confirm(`确认删除${item.name}吗？`, '提示', {
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
  padding: 20px;
  .toolbar {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e1e4e8;
    display: flex;
    .create {
      margin-left: 20px;
    }
  }
  .body {
    margin-bottom: 20px;
  }
}

.moduleList {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  padding: 0 15px;
  .module.card {
    margin-bottom: 10px;
    width: 260px;
    &:hover {

    }
  }
  .card-block {
    display: flex;
    align-items: center;
    .actions {
      margin-left: auto;
    }
  }
}
</style>
