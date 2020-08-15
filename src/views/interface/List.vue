<template>
  <article class="interfaceContainer">
    <div class="header">
      <description-list :title="curRepo.name || '/'">
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
        <div class="title">{{`全部接口共（${itfs.length || 0}）个`}}</div>
        <div class="tableWrapper">
          <a-table
            :loading="loading"
            :columns="columns"
            :data-source="itfs"
            :rowKey="record => record.id"
          ></a-table>
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
import { mapState, mapGetters } from 'vuex'
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
      loading: false,
      repositoryId: '',
      selectData: '',
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
      'curItfId'
    ]),
    ...mapGetters([
      'itfs',
      'curRepo'
    ]),

    formatDate () {
      return dayjs(this.curRepo.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created () {
    this.repositoryId = this.$route.params.id
  },
  mounted () {
    this.getRepositoryById()
  },
  methods: {
    handleClickDetail (id) {
      this.$store.commit(types.INTERFACE_ID_CUR_SET, { id })
      this.$router.push({
        name: 'interface-detail',
        params: { id: `${this.repositoryId}` }
      })
    },
    getRepositoryById () {
      this.loading = true
      this.$store.dispatch('getRepository', this.repositoryId)
        .finally(() => {
          this.loading = false
        })
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
  margin: 24px;

  .body {
    .interfaceList {
      .title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
