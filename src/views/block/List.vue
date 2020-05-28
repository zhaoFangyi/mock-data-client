<template>
  <article class="blockEditor">
    <div class="header">
      <span class="title">
        <i class="el-icon-s-management"></i>
        <span>{{block.name}}</span>
      </span>
      <div class="toolbar">
        <span class="fake-link edit el-icon-edit">编辑</span>
      </div>
      <div class="blockSearcher">
        <el-input
          class="input"
          placeholder="搜索"></el-input>
      </div>
    </div>
    <div class="body">
      <div class="interfaceWrapper">
        <article class="interfaceList">
          <div class="header">
            <el-button class="newIntf">新建接口</el-button>
          </div>
          <div class="scrollWrapper">
            <el-scrollbar>
              <ul class="body">
                <li
                  class="sortable"
                  :class="{'active': item.id === itf.id}"
                  v-for="item in itfs"
                  :key="item.id">
                  <div class="interface">
                    <span>
                      <el-link type="primary" @click="handleInterfaceClick(item)">
                        <div class="name">{{item.name}}</div>
                        <div class="url">{{item.url}}</div>
                      </el-link>
                    </span>
                    <div class="toolbar">
                      <el-link class="mr6" icon="el-icon-edit"></el-link>
                      <el-link class="mr6" icon="el-icon-delete"></el-link>
                    </div>
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </article>
        <article class="interfaceEditor">
          <div class="interfaceEditorToolbar"></div>
          <div class="interfaceSummary">
            <div class="header">
              <copy-to-clipboard :text="itf.name">
                <span class="title">{{itf.name}}</span>
              </copy-to-clipboard>
              <ul class="summary">
                <li>
                  <copy-to-clipboard
                    :text="itf.url"
                    type="right">
                    <span class="mr5">
                      <span class="label">地址：</span>
                      <a>{{itf.url}}</a>
                    </span>
                  </copy-to-clipboard>
                </li>
                <li>
                  <copy-to-clipboard :text="itf.method">
                    <span>
                      <span class="label">类型：</span>
                      <span>{{itf.method}}</span>
                    </span>
                  </copy-to-clipboard>
                </li>
              </ul>
            </div>
            <div class="body">
              <RSortable :onChange="onChangeRSortable">
                <ul class="ModuleList clearfix">
                  <li
                    v-for="item in res"
                    :key="item.id"
                    :class="['sortable', {'active': item.id === mod.id}]">
                    <div class="Module clearfix" @click="onClickRes(item)">
                      <span class="name">
                        {{item.name}}
                      </span>
                    </div>
                  </li>
                  <li>
                    <span class="fake-link" @click="openResDialog">
                      <i class="el-icon-folder-add"></i>
                      新建模块
                    </span>
                    <ResDialog
                      :visible="showResDialog"
                      @close="showResDialog=false"></ResDialog>
                  </li>
                </ul>
              </RSortable>

              <div class="component-state-inspector">
                <vue-json-pretty
                  :deep="3"
                  :data="itf.response"
                  @click="handleClick">
                </vue-json-pretty>
                <div class="toolbar">
                  <copy-to-clipboard
                    :text="itf.response"
                    type="right"
                    class="copyJson">
                    <span>复制JSON</span>
                  </copy-to-clipboard>
                  <el-link
                    size="mini"
                    type="text"
                    class="replaceWith"
                    @click="showReplaceDialog=true">Replace With</el-link>
                  <ReplaceDialog :visible="showReplaceDialog"
                    @close="showReplaceDialog=false"></ReplaceDialog>
                </div>
                <state-inspector
                  :state="itf.response"
                ></state-inspector>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </article>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import StateInspector from '@/components/StateInspector/index'
import CopyToClipboard from '@/components/CopyToClipboard/index'
import RSortable from '@/components/RSortable/RSortable'
import store from '@/store/store.js'
import { parse, set } from '@/utils/util.js'
import ResDialog from './Dialog/ResDialog'
import ReplaceDialog from './Dialog/ReplaceDialog'

export default {
  name: 'Bolck',
  components: {
    CopyToClipboard,
    StateInspector,
    VueJsonPretty,
    RSortable,
    ResDialog,
    ReplaceDialog
  },
  data () {
    return {
      showResDialog: false,
      showReplaceDialog: false,
      block: {
        name: '预警布控'
      },
      mod: {
        id: 'res1',
        name: 'res2'
      },
      res: [
        {
          id: 'res1',
          name: 'res1'
        },
        {
          id: 'res2',
          name: 'res2'
        }
      ],
      itf: {},
      itfs: [
        {
          id: 111,
          name: '获取任务类型列表',
          url: '/monitor/task/getTaskTypeList',
          method: 'GET',
          response: {
            errno: 0,
            data: [
              {
                name: '群体预警',
                type: 'group_activity',
                desc: '根据所选的重点人群体或者人群包进行的管控任务',
                features: [
                  '进出围栏',
                  '多人聚集',
                  '同连WIFI',
                  '预警大屏'
                ],
                conditions: [
                  {
                    name: '进入围栏',
                    type: 'in_fence'
                  },
                  {
                    name: '超出围栏',
                    type: 'out_fence'
                  },
                  {
                    name: '多人聚集',
                    type: 'gather'
                  },
                  {
                    name: '同连Wi-Fi',
                    type: 'connected_wifi'
                  }
                ]
              },
              {
                name: '专项预警',
                type: 'group_special',
                desc: '辖区和北京之间建立三层围栏进行重点群体异动监测',
                features: [
                  '进出围栏',
                  '多人聚集',
                  '同连WIFI',
                  '预警大屏'
                ],
                conditions: [
                  {
                    name: '进入围栏',
                    type: 'in_fence'
                  },
                  {
                    name: '超出围栏',
                    type: 'out_fence'
                  },
                  {
                    name: '多人聚集',
                    type: 'gather'
                  },
                  {
                    name: '同连Wi-Fi',
                    type: 'connected_wifi'
                  }
                ]
              },
              {
                name: '设备布控',
                type: 'person',
                desc: '添加设备进行布控',
                features: [
                  '最新位置',
                  '进出围栏',
                  '多人聚集',
                  '安装敏感APP',
                  '换卡换机',
                  '消失预警'
                ],
                conditions: [
                  {
                    name: '最新位置',
                    type: 'rt_location'
                  },
                  {
                    name: '进入围栏',
                    type: 'in_fence'
                  },
                  {
                    name: '超出围栏',
                    type: 'out_fence'
                  },
                  {
                    name: '多人聚集',
                    type: 'gather'
                  },
                  {
                    name: '安装敏感APP',
                    type: 'install_sensitive_app'
                  },
                  {
                    name: '换卡换机',
                    type: 'change_device'
                  },
                  {
                    name: '消失预警',
                    type: 'disappear'
                  }
                ]
              },
              {
                name: '节点安保',
                type: 'node_security',
                desc: '重要时间节点/事件下的群体安保布控任务',
                features: [
                  '进出围栏',
                  '多人聚集',
                  '同连WIFI',
                  '同日入住',
                  '同离站',
                  '预警大屏'
                ],
                conditions: [
                  {
                    name: '进入围栏',
                    type: 'in_fence'
                  },
                  {
                    name: '超出围栏',
                    type: 'out_fence'
                  },
                  {
                    name: '多人聚集',
                    type: 'gather'
                  },
                  {
                    name: '同连Wi-Fi',
                    type: 'connected_wifi'
                  },
                  {
                    name: '同日入住',
                    type: 'accommodate_hotel'
                  },
                  {
                    name: '同离站',
                    type: 'leaving_city'
                  }
                ]
              },
              {
                name: '警卫安保',
                type: 'guard_security',
                desc: '重要领导人来杭常口下的群体安保布控任务',
                features: [
                  '进出围栏',
                  '多人聚集',
                  '同连WIFI',
                  '同日入住',
                  '同离站',
                  '预警大屏'
                ],
                conditions: [
                  {
                    name: '进入围栏',
                    type: 'in_fence'
                  },
                  {
                    name: '超出围栏',
                    type: 'out_fence'
                  },
                  {
                    name: '多人聚集',
                    type: 'gather'
                  },
                  {
                    name: '同连Wi-Fi',
                    type: 'connected_wifi'
                  },
                  {
                    name: '同日入住',
                    type: 'accommodate_hotel'
                  },
                  {
                    name: '同离站',
                    type: 'leaving_city'
                  }
                ]
              },
              {
                name: '专题安保',
                type: 'thematic_security',
                desc: '重点关注区域或重点关注人群的长期管控任务',
                features: [
                  '长期布控',
                  '进出围栏',
                  '多人聚集',
                  '同连WIFI',
                  '同日入住',
                  '同离站',
                  '预警大屏'
                ],
                conditions: [
                  {
                    name: '进入围栏',
                    type: 'in_fence'
                  },
                  {
                    name: '超出围栏',
                    type: 'out_fence'
                  },
                  {
                    name: '多人聚集',
                    type: 'gather'
                  },
                  {
                    name: '同连Wi-Fi',
                    type: 'connected_wifi'
                  },
                  {
                    name: '同日入住',
                    type: 'accommodate_hotel'
                  },
                  {
                    name: '同离站',
                    type: 'leaving_city'
                  }
                ]
              },
              {
                name: 'wifi布控',
                type: 'device',
                desc: '添加WIFI进行布控',
                features: [
                  '陌生设备连接预警'
                ],
                conditions: [
                  {
                    name: '陌生设备连接预警',
                    type: 'router_connected'
                  }
                ]
              }
            ],
            cost: '21.00'
          }
        },
        {
          id: 112,
          name: '预警任务列表',
          url: '/monitor/task/getList',
          method: 'GET',
          response: {
            errno: 0,
            data: {
              total: 33,
              list: [
                {
                  name: '测试',
                  event_code: '0000',
                  event_id: '0000',
                  type: 'thematic_security',
                  reason: '数据00000000000',
                  status: 'pending',
                  update_time: '2020-05-21T09:58:55.000Z',
                  detail: '{}',
                  follow_time: '2020-05-21T09:42:36.000Z',
                  id: 'c5c44c42-3413-4d6f-b8a2-8f8ea50fab68',
                  group_type: 'user',
                  user_group_id: '9ff41f33-3569-4e47-a0e6-3997e771fc95',
                  user_group_name: 'sb-张萍专用（勿动）',
                  start_time: '2020-05-21',
                  end_time: '2020-05-31',
                  is_long_task: 1,
                  creator_id: 'bc875f7b8b0942fd92a70b0464da679f',
                  creator_name: '张萍-普通',
                  create_time: '2020-05-21 17:42:36',
                  crowds: {
                    crowd: [],
                    crowd_package: [],
                    crowd_library: [
                      {
                        id: '7a6f67ba082c47d28421aa06ae473794',
                        name: '0424',
                        account_group_id: 'd0d442e7-402f-48bc-b54e-9d3070bea9a6',
                        own_id: 'wifi-9ff41f33-3569-4e47-a0e6-3997e771fc95',
                        creator_id: 'bc875f7b8b0942fd92a70b0464da679f',
                        code: 'QT000054',
                        detail: 'cesh',
                        department_id: '6d4e9b03-c99d-4998-82d5-ce21e543b0de',
                        count: 1,
                        crowd_library_type_id: '30d7a64f-269e-4eee-851d-fec6c68b0a6b',
                        is_delete: 0,
                        create_time: '2020-04-24T08:03:09.000Z',
                        update_time: '2020-05-07T11:53:52.000Z',
                        pkg_type: 1,
                        type_id: '30d7a64f-269e-4eee-851d-fec6c68b0a6b'
                      }
                    ]
                  },
                  conditions: [
                    {
                      type: 'gather',
                      data: {
                        fence_list: [],
                        people_limit_count: 3
                      },
                      situation: 'warning',
                      crowds: {}
                    },
                    {
                      type: 'in_fence',
                      data: {
                        fence_list: [
                          {
                            id: 91,
                            warn_level: 1,
                            name: '北京的一个地方',
                            address: '234567',
                            shape_type: 1,
                            shape_param: {
                              vertexes: [
                                {
                                  lng: 116.410554,
                                  lat: 39.938847
                                },
                                {
                                  lng: 116.439875,
                                  lat: 39.94637
                                },
                                {
                                  lng: 116.437575,
                                  lat: 39.930438
                                }
                              ]
                            },
                            update_time: 1587203469000,
                            create_time: 1587203469000,
                            fence_level_id: 'da8b6905-5c45-4262-b582-5a7fbcf94c69',
                            fence_level_name: '一级重点围栏'
                          },
                          {
                            id: 86,
                            warn_level: 1,
                            name: '浙江大学',
                            address: '浙大紫金港校区',
                            shape_type: 1,
                            shape_param: {
                              vertexes: [
                                {
                                  lng: 120.0995,
                                  lat: 30.265292
                                },
                                {
                                  lng: 120.07061,
                                  lat: 30.270657
                                },
                                {
                                  lng: 120.056956,
                                  lat: 30.31419
                                },
                                {
                                  lng: 120.10065,
                                  lat: 30.317183
                                },
                                {
                                  lng: 120.149517,
                                  lat: 30.31419
                                },
                                {
                                  lng: 120.125371,
                                  lat: 30.271281
                                },
                                {
                                  lng: 120.108698,
                                  lat: 30.26629
                                }
                              ]
                            },
                            update_time: 1586865086000,
                            create_time: 1586865086000,
                            fence_level_id: 'da8b6905-5c45-4262-b582-5a7fbcf94c69',
                            fence_level_name: '一级重点围栏'
                          },
                          {
                            id: 82,
                            warn_level: 1,
                            name: '999',
                            address: null,
                            shape_type: 1,
                            shape_param: {
                              vertexes: [
                                {
                                  lng: 120.129108,
                                  lat: 30.287249
                                },
                                {
                                  lng: 120.105536,
                                  lat: 30.275273
                                },
                                {
                                  lng: 120.113873,
                                  lat: 30.269285
                                },
                                {
                                  lng: 120.132126,
                                  lat: 30.265417
                                }
                              ]
                            },
                            update_time: 1586767842000,
                            create_time: 1586767842000,
                            fence_level_id: 'da8b6905-5c45-4262-b582-5a7fbcf94c69',
                            fence_level_name: '一级重点围栏'
                          }
                        ]
                      },
                      situation: 'warning',
                      crowds: {}
                    },
                    {
                      type: 'out_fence',
                      data: {
                        fence_list: [
                          {
                            id: 71,
                            warn_level: 3,
                            name: '超山风景去',
                            address: '江干区',
                            shape_type: 1,
                            shape_param: {
                              vertexes: [
                                {
                                  lng: 120.12034,
                                  lat: 30.450897
                                },
                                {
                                  lng: 120.334209,
                                  lat: 30.446912
                                },
                                {
                                  lng: 120.314087,
                                  lat: 30.317307
                                },
                                {
                                  lng: 120.08757,
                                  lat: 30.296355
                                },
                                {
                                  lng: 120.114016,
                                  lat: 30.31182
                                }
                              ]
                            },
                            update_time: 1586857562000,
                            create_time: 1586570690000,
                            fence_level_id: '8e62742d-c2c4-477b-b3b4-fb0c4a2622b0',
                            fence_level_name: '三级重点围栏'
                          }
                        ]
                      },
                      situation: 'warning',
                      crowds: {}
                    },
                    {
                      type: 'connected_wifi',
                      data: {
                        wifimacs: [],
                        connect_duration: 3
                      },
                      situation: 'warning',
                      crowds: {}
                    },
                    {
                      type: 'accommodate_hotel',
                      data: {
                        people_limit_count: 3
                      },
                      situation: 'warning',
                      crowds: {}
                    },
                    {
                      type: 'leaving_city',
                      data: {
                        time_interval: 1800,
                        people_limit_count: 3
                      },
                      situation: 'warning',
                      crowds: {}
                    }
                  ],
                  is_follow: 1,
                  has_checked: 'uncheck',
                  message: 0
                }
              ]
            },
            cost: '2218.00'
          }
        }
      ]
    }
  },
  computed: {
  },
  mounted () {
    store.$on('field:change', ({ path, value, newKey, remove }) => {
      console.log(99999, path, value, newKey, remove)
      try {
        let parsedValue
        if (value) {
          parsedValue = parse(value, true)
        }
        set(this.itf.response, path, parsedValue, (obj, field, value) => {
          (remove || newKey) && this.$delete(obj, field)
          !remove && this.$set(obj, newKey || field, value)
        })
      } catch (e) {
        console.error(e)
      }
    })
  },
  methods: {
    onClickRes (item) {
      this.mod = item
    },
    openResDialog () {
      console.log(111)
      this.showResDialog = true
    },
    handleClick () {},
    handleInterfaceClick (item) {
      this.itf = item
    },
    onChangeRSortable () {}
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
    position: relative;
    padding: 20px 20px 10px 20px;
    background: #fafbfc;
    text-align: left;
    min-height: 80px;
    > .title {
      font-size: 20px;
      margin-right: 10px;
    }
    > .toolbar {
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
      position: absolute;
      top: 20px;
      right: 20px;
      left: auto;
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
  .component-state-inspector {
    display: grid;
    // grid-template-columns: repeat(2, 1fr);
    grid-template-columns: 1fr 100px 1fr;
    padding: 20px;
  }
}
.interfaceList {
  position: sticky;
  top: 10px;
  height: calc(100vh - 10px);
  .header {
    .newIntf {
      margin-bottom: 10px;
      color: #3f51b5;
      border: 1px solid rgba(63, 81, 181, 0.5);
      width: 100%;
    }
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
      padding: 12px;
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
        padding-right: 40px;
        .name {
          position: relative;
          font-size: 13px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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
    // position: relative;
    // .toolbar {
    //   position: absolute;
    //   top: 80px;
    //   &.copyJson {
    //     color: rgb(153, 153, 153);
    //     right: 52%;
    //   }
    //   &.replaceWith {
    //     right: 60%;
    //   }
    // }
  }
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
