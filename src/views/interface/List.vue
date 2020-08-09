<template>
  <article class="interfaceContainer">
    <div class="header">
      <div class="storeTitle">{{ curRepo.name || '/'}}</div>
      <description-list>
        <description-item term="项目类型">{{ '--' }}</description-item>
        <description-item term="API 总数">{{ curRepo.interfaces.length || '--' }}</description-item>
        <description-item term="协作人员数量">{{ '--' }}</description-item>
        <description-item term="版本号">{{ '--' }}</description-item>
        <description-item term="状态码总数">{{ '--' }}</description-item>
        <description-item term="项目文档总数">{{ '--' }}</description-item>
        <description-item term="更新时间">{{ formatDate }}</description-item>
      </description-list>
    </div>
    <div class="body">
      <article class="interfaceList">
        <div class="header">{{`全部接口共（${itfs.length || 0}）个`}}</div>
        <div class="tableWrapper">
          <a-table :columns="columns" :data-source="itfs" :rowKey="record => record.id"></a-table>
        </div>
      </article>
    </div>
  </article>
</template>

<script>
/**
 * 接口中间层页面，展示该仓库所有接口的 list，并且带有仓库基本信息
 */
import DescriptionList from '@/components/description'
// import store from '@/store/store.js'
// import { parse, set } from '@/utils/util.js'
import api from '@/data/api.js'
import { mapState, mapGetters } from 'vuex'
import URI from 'urijs'
import * as types from '@/store/mutation-types.js'
import dayjs from 'dayjs'
import { METHOD_TYPE } from './method'
const DescriptionItem = DescriptionList.Item
// const columns = ;

export default {
  name: 'IntetfaceList',
  components: {
    DescriptionList,
    DescriptionItem
  },
  data () {
    return {
      resActionMode: 'add',
      showResDialog: false,
      showReplaceDialog: false,
      showItfDialog: false,
      showMoveItfDialog: false,
      resDialogData: '',
      editItfModel: '',
      repositoryId: '',
      selectData: '',
      selectPath: '',
      columns: [
        {
          title: '接口名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          customRender: (text, record, index) => {
            const itfId = record.id
            return <el-link type="primary" onClick={() => this.handleClickDetail(itfId)}>{text}</el-link>
          }
        },
        {
          title: '接口方法',
          dataIndex: 'method',
          key: 'method',
          width: 100,
          customRender: (text) => {
            return <el-tag type={METHOD_TYPE[text]}>{text}</el-tag>
          }
        },
        {
          title: '接口路径',
          dataIndex: 'url',
          key: 'url',
          ellipsis: true,
          customRender: (text) => {
            return <el-tooltip effect="dark" content={text} placement="bottom-end">
              <div>{text}</div>
            </el-tooltip>
          }
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          ellipsis: true,
          customRender: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'repository',
      'curItfId',
      'mockData',
      'curMockId'
    ]),
    ...mapGetters([
      'curItf',
      'curMockData',
      'itfs',
      'curRepo'
    ]),
    copyData () {
      return this.selectData || this.curMockData.res_body
    },
    formatDate () {
      return dayjs(this.curRepo.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created () {
    this.repositoryId = this.$route.params.id
  },
  mounted () {
    console.log('itfs >>>', this.itfs)
    console.log('this.repository >>', this.curRepo)

    this.getRepositoryById()
  },
  methods: {
    handleClickDetail (id) {
      console.log(id)
      this.$router.push({
        name: 'interface-detail',
        params: { itfId: `${id}` },
        query: { itf: `${id}` }
      })
    },
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
      this.resDialogData = {
        name: '',
        res_body: JSON.stringify({})
      }
      this.showResDialog = true
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
      this.$store.dispatch('getCurItf', { id: item.id }).then(() => {
        const selectHref = new URI(this.$route.fullPath)
          .setSearch('itf', item.id)
          .setSearch('mock', this.curMockId)
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
    handleClick (path, data, treeName = '') {
      this.selectData = !data ? data + '' : data // 处理 data = null 的情况
    }
  }
}
</script>

<style lang="less" scoped>
@brand: #4a7bf7;
.mr5 {
  margin-right: 5px;
}
.mr6 {
  margin-right: 6px;
}

.interfaceContainer {
  .header {
    margin: 24px;
    .storeTitle {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 20px;
    }
  }
}
</style>
