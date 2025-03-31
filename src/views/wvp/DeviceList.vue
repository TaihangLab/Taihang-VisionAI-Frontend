<template>
    <div id="device-list" style="width: 100%">
      <div class="page-header">
        <div class="page-title">设备列表</div>
        <div class="page-header-btn">
          搜索:
          <el-input @input="initData" style="margin-right: 1rem; width: auto;" size="small" placeholder="关键字"
                    :prefix-icon="Search" v-model="searchSrt" clearable></el-input>
          在线状态:
          <el-select size="small" style="width: 8rem; margin-right: 1rem;" @change="initData" v-model="online" placeholder="请选择"
                     default-first-option>
            <el-option label="全部" value=""></el-option>
            <el-option label="在线" value="true"></el-option>
            <el-option label="离线" value="false"></el-option>
          </el-select>
          <el-button :icon="Plus" size="small" style="margin-right: 1rem;" type="primary" @click="add">添加设备
          </el-button>
          <el-button :icon="InfoFilled" size="small" style="margin-right: 1rem;" type="primary" @click="showInfo()">平台信息
          </el-button>
          <el-button :icon="RefreshRight" circle size="small" :loading="getDeviceListLoading"
                     @click="getDeviceList()"></el-button>
        </div>
      </div>
      <!--设备列表-->
      <el-table size="default" :data="deviceList" style="width: 100%;font-size: 12px;" :height="tableHeight" header-row-class-name="table-header">
        <el-table-column prop="name" label="名称" min-width="160" align="center" />
        <el-table-column prop="deviceId" label="设备编号" min-width="160" align="center" />
        <el-table-column label="地址" min-width="160" align="center">
          <template #default="scope">
            <div class="name-wrapper">
              <el-tag v-if="scope.row.hostAddress" size="default">{{ scope.row.hostAddress }}</el-tag>
              <el-tag v-if="!scope.row.hostAddress" size="default">未知</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="manufacturer" label="厂家" min-width="100" align="center" />
        <el-table-column prop="transport" label="信令传输模式" min-width="120" align="center" />
        <el-table-column label="流传输模式" min-width="160" align="center">
          <template #default="scope">
            <el-select size="small" @change="transportChange(scope.row)" v-model="scope.row.streamMode" placeholder="请选择" style="width: 120px">
              <el-option key="UDP" label="UDP" value="UDP" />
              <el-option key="TCP-ACTIVE" label="TCP主动模式" value="TCP-ACTIVE" />
              <el-option key="TCP-PASSIVE" label="TCP被动模式" value="TCP-PASSIVE" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="通道数" min-width="100" align="center">
          <template #default="scope">
            <span style="font-size: 1rem">{{scope.row.channelCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100" align="center">
          <template #default="scope">
            <div class="name-wrapper">
              <el-tag size="default" v-if="scope.row.onLine && myServerId !== scope.row.serverId" style="border-color: #ecf1af">在线</el-tag>
              <el-tag size="default" v-if="scope.row.onLine && myServerId === scope.row.serverId">在线</el-tag>
              <el-tag size="default" type="info" v-if="!scope.row.onLine">离线</el-tag>
            </div>
          </template>
        </el-table-column>  
        <el-table-column label="订阅" min-width="260" align="center">
          <template #default="scope">
            <el-checkbox label="目录" :model-value="scope.row.subscribeCycleForCatalog > 0" 
              @change="(e)=>subscribeForCatalog(scope.row, e)"
              :disabled="subscribingItems[scope.row.id + '_catalog']" />
            <el-checkbox label="位置" :model-value="scope.row.subscribeCycleForMobilePosition > 0" 
              @change="(e)=>subscribeForMobilePosition(scope.row, e)"
              :disabled="subscribingItems[scope.row.id + '_position']" />
            <el-checkbox label="报警" disabled :model-value="scope.row.subscribeCycleForAlarm > 0" />
          </template>
        </el-table-column>
        <el-table-column prop="keepaliveTime" label="最近心跳" min-width="140" align="center" />
        <el-table-column prop="registerTime" label="最近注册" min-width="140" align="center" />
        <el-table-column label="操作" min-width="300" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" link size="default" :disabled="scope.row.online===0" :icon="Refresh" @click="refDevice(scope.row)">刷新</el-button>
            <el-divider direction="vertical" />
            <el-button type="primary" link size="default" :icon="VideoCamera" @click="showChannelList(scope.row)">通道</el-button>
            <el-divider direction="vertical" />
            <el-button size="default" :icon="Edit" type="primary" link @click="edit(scope.row)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-dropdown @command="(command)=>{moreClick(command, scope.row)}">
              <el-button size="default" type="primary" link>
                操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete" style="color: #f56c6c">删除</el-dropdown-item>
                  <el-dropdown-item command="setGuard" :disabled="!scope.row.onLine">布防</el-dropdown-item>
                  <el-dropdown-item command="resetGuard" :disabled="!scope.row.onLine">撤防</el-dropdown-item>
                  <el-dropdown-item command="syncBasicParam" :disabled="!scope.row.onLine">基础配置同步</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: right"
        @size-change="handleSizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-size="count"
        :page-sizes="[15, 25, 35, 50]"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加组件引用 -->
    <DeviceEdit ref="deviceEditRef" />
    <SyncChannelProgress ref="syncChannelProgressRef" @refresh="getDeviceList" />
    <ConfigInfo ref="configInfoRef" />
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { 
    Search, 
    Plus, 
    InfoFilled, 
    RefreshRight, 
    Refresh, 
    VideoCamera, 
    Edit, 
    ArrowDown 
  } from '@element-plus/icons-vue'
  import axios from 'axios'
  
  import DeviceEdit from './dialog/DeviceEdit.vue'
  import SyncChannelProgress from './dialog/SyncChannelProgress.vue'
  import ConfigInfo from './dialog/ConfigInfo.vue'
  
  // 配置axios默认地址
  axios.defaults.baseURL = 'http://192.168.1.107:18080'
  
  // 添加axios请求拦截器进行日志记录
  axios.interceptors.request.use(function (config) {
    console.log('发送请求:', config.method?.toUpperCase(), config.url, config.params || {})
    return config
  }, function (error) {
    console.error('请求错误:', error)
    return Promise.reject(error)
  })
  
  // 添加axios响应拦截器进行日志记录
  axios.interceptors.response.use(function (response) {
    console.log('接收响应:', response.config.method?.toUpperCase(), response.config.url, response.data)
    return response
  }, function (error) {
    console.error('响应错误:', error.message, error.config?.url)
    return Promise.reject(error)
  })
  
  const router = useRouter()
  
  // 引用组件
  const deviceEditRef = ref()
  const syncChannelProgressRef = ref()
  const configInfoRef = ref()
  
  // 响应式状态
  const deviceList = ref([])
  const currentDevice = ref({})
  const searchSrt = ref('')
  const online = ref('')
  const videoComponentList = ref([])
  const currentPage = ref(1)
  const count = ref(15)
  const total = ref(0)
  const getDeviceListLoading = ref(false)
  const myServerId = ref('')
  const tableHeight = ref('calc(100vh - 200px)')
  const apiAvailable = ref(true) // 添加API可用性状态
  const subscribingItems = ref<Record<string, boolean>>({}) // 添加订阅加载状态
  let updateLooper = null
  
  // 计算属性
  const currentDeviceChannels = computed(() => {
    const data = currentDevice.value['channelMap']
    let channels = null
    if (data) {
      channels = Object.keys(data).map(key => {
        return data[key]
      })
    }
    return channels
  })
  
  // 生命周期钩子
  onMounted(() => {
    // 先检查API是否可用
    checkApiAvailability().then(isAvailable => {
      apiAvailable.value = isAvailable
      if (!isAvailable) {
        ElMessage.warning({
          showClose: true,
          message: '无法连接到后端API，将使用模拟数据'
        })
      }
      initData()
      updateLooper = setInterval(initData, 10000)
    })
  })
  
  onUnmounted(() => {
    if (updateLooper) {
      clearInterval(updateLooper)
    }
  })
  
  // 方法
  function initData() {
    currentPage.value = 1
    total.value = 0
    getDeviceList()
  }
  
  function currentChange(val) {
    currentPage.value = val
    getDeviceList()
  }
  
  function handleSizeChange(val) {
    count.value = val
    getDeviceList()
  }
  
  function getDeviceList() {
    getDeviceListLoading.value = true
    
    // 如果API不可用，直接使用模拟数据
    if (!apiAvailable.value) {
      console.log('API不可用，使用模拟设备数据')
      loadMockDeviceData()
      getDeviceListLoading.value = false
      return
    }
    
    axios({
      method: 'get',
      url: `/api/device/query/devices`,
      params: {
        page: currentPage.value,
        count: count.value,
        query: searchSrt.value,
        status: online.value,
      },
      timeout: 5000 // 添加超时设置
    }).then((res) => {
      if (res.data.code === 0) {
        total.value = res.data.data.total
        deviceList.value = res.data.data.list
      } else {
        // 处理业务错误
        console.warn('获取设备列表返回错误码:', res.data.code, res.data.msg)
        ElMessage.error({
          showClose: true,
          message: res.data.msg || '获取设备列表失败'
        })
        // 加载模拟数据作为后备
        loadMockDeviceData()
      }
      getDeviceListLoading.value = false
    }).catch((error) => {
      console.error('获取设备列表错误:', error)
      
      // 详细的错误信息
      let errorMsg = '未知错误'
      if (error.response) {
        errorMsg = `服务器错误 (${error.response.status})`
        // 如果服务器持续返回错误，将apiAvailable设置为false
        if (error.response.status >= 500) {
          apiAvailable.value = false
        }
      } else if (error.request) {
        errorMsg = '无法连接到服务器，请检查网络连接'
        apiAvailable.value = false // 无法连接，标记API不可用
      } else if (error.message) {
        errorMsg = error.message
      }
      
      ElMessage.error({
        showClose: true,
        message: '获取设备列表失败: ' + errorMsg
      })
      
      // 使用模拟数据
      loadMockDeviceData()
      
      getDeviceListLoading.value = false
    })
  }
  
  function deleteDevice(row) {
    let msg = "确定删除此设备？"
    if (row.online !== 0) {
      msg = "在线设备删除后仍可通过注册再次上线。<br/>如需彻底删除请先将设备离线。<br/><strong>确定删除此设备？</strong>"
    }
    ElMessageBox.confirm(msg, '提示', {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true,
      type: 'warning'
    }).then(() => {
      axios({
        method: 'delete',
        url: `/api/device/query/devices/${row.deviceId}/delete`
      }).then(() => {
        getDeviceList()
      }).catch((error) => {
        console.error(error)
      })
    }).catch(() => {
      // 取消删除，什么都不做
    })
  }
  
  function showChannelList(row) {
    // 跳转到通道列表页面，并传递设备ID和父通道ID
    console.log('跳转到通道列表，设备ID:', row.deviceId)

    // 确保deviceId是字符串类型
    const deviceId = String(row.deviceId)
    
    // 显示加载状态提示
    ElMessage({
      showClose: false,
      message: '正在加载通道列表...',
      type: 'info',
      duration: 2000
    })

    // 使用replace而不是push，避免浏览器历史堆栈问题
    router.replace({
      path: `/channelList/${deviceId}/0`,
      query: { 
        from: 'deviceList',
        t: new Date().getTime() // 添加时间戳确保路由刷新
      }
    })
  }
  
  function refDevice(itemData) {
    // 显示加载指示
    getDeviceListLoading.value = true
    
    // 如果API不可用，提供反馈而不是尝试发送请求
    if (!apiAvailable.value) {
      getDeviceListLoading.value = false
      ElMessage({
        showClose: true,
        message: '当前后端API不可用，无法刷新设备',
        type: 'warning'
      })
      return
    }
    
    // 添加超时和错误处理
    axios({
      method: 'get',
      url: '/api/device/query/devices/' + itemData.deviceId + '/sync',
      timeout: 5000  // 添加5秒超时
    }).then((res) => {
      getDeviceListLoading.value = false
      if (res.data.code !== 0) {
        ElMessage({
          showClose: true,
          message: res.data.msg || '刷新设备信息失败',
          type: 'error'
        })
      } else {
        if (res.data.data && res.data.data.errorMsg) {
          ElMessage({
            showClose: true,
            message: res.data.data.errorMsg,
            type: 'error'
          })
          return
        }

        try {
          // 尝试调用同步通道进度对话框
          syncChannelProgressRef.value.openDialog(itemData.deviceId, () => {
            initData()
          })
        } catch (err) {
          console.error('打开同步进度对话框失败:', err)
          // 即使对话框打开失败，也刷新列表
          initData()
        }
      }
    }).catch((e) => {
      getDeviceListLoading.value = false
      console.error('刷新设备错误:', e)
      
      // 详细的错误信息
      let errorMsg = e.message || '未知错误'
      if (e.response) {
        errorMsg = `服务器错误 (${e.response.status}): ${e.response.data?.msg || errorMsg}`
      } else if (e.request) {
        errorMsg = '无法连接到服务器，请检查网络连接'
      }
      
      ElMessage({
        showClose: true,
        message: '刷新设备信息失败: ' + errorMsg,
        type: 'error'
      })
      
      // 使用模拟数据或简单刷新列表
      initData()
    })
  }
  
  async function getTooltipContent(deviceId) {
    let result = ""
    
    // 如果API不可用，直接返回信息
    if (!apiAvailable.value) {
      return "API不可用，无法获取同步状态"
    }
    
    try {
      const res = await axios({
        method: 'get',
        url: `/api/device/query/${deviceId}/sync_status/`,
        timeout: 3000 // 添加3秒超时
      })
      if (res.data.code == 0) {
        if (res.data.data?.errorMsg !== null && res.data.data?.errorMsg !== undefined) {
          result = res.data.data.errorMsg
        } else if (res.data.msg !== null && res.data.msg !== undefined) {
          result = res.data.msg
        } else if (res.data.data) {
          result = `同步中...[${res.data.data.current || 0}/${res.data.data.total || 0}]`
        } else {
          result = "获取同步状态成功，但无数据"
        }
      } else {
        result = `获取同步状态错误: ${res.data.msg || '未知错误'}`
      }
    } catch (error: any) {  // 使用any类型来避免TypeScript错误
      console.error('获取同步状态错误:', error)
      
      // 详细错误信息
      if (error.response) {
        result = `服务器错误 (${error.response.status})`
        // 如果服务器持续返回500错误，考虑标记API不可用
        if (error.response.status >= 500) {
          apiAvailable.value = false
        }
      } else if (error.request) {
        result = '无法连接到服务器'
        apiAvailable.value = false // 无法连接，标记API不可用
      } else if (error.message) {
        result = `请求错误: ${error.message}`
      } else {
        result = '未知错误'
      }
    }
    
    return result
  }
  
  function transportChange(row) {
    axios({
      method: 'post',
      url: '/api/device/query/transport/' + row.deviceId + '/' + row.streamMode
    }).then(function () {
      // 成功处理
    }).catch(function (e) {
      console.error(e)
    })
  }
  
  function edit(row) {
    // 参考web_src直接调用deviceEdit组件
    deviceEditRef.value.openDialog(row, () => {
      deviceEditRef.value.close()
      ElMessage({
        showClose: true,
        message: "设备修改成功，通道字符集将在下次更新生效",
        type: "success",
      })
      setTimeout(getDeviceList, 200)
    })
  }
  
  function add() {
    // 参考web_src直接调用deviceEdit组件
    deviceEditRef.value.openDialog(null, () => {
      deviceEditRef.value.close()
      ElMessage({
        showClose: true,
        message: "添加成功",
        type: "success",
      })
      setTimeout(getDeviceList, 200)
    })
  }
  
  function showInfo() {
    axios({
      method: 'get',
      url: `/api/server/system/configInfo`,
    }).then((res) => {
      if (res.data.code === 0) {
        // 参考web_src实现，简化代码
        myServerId.value = res.data.data.addOn.serverId
        configInfoRef.value.openDialog(res.data.data)
      } else {
        ElMessage.error({
          showClose: true,
          message: res.data.msg || '获取平台信息失败'
        })
      }
    }).catch((error) => {
      console.error(error)
      ElMessage.error({
        showClose: true,
        message: '获取平台信息失败: ' + error.message
      })
    })
  }
  
  function moreClick(command, itemData) {
    if (command === "setGuard") {
      setGuard(itemData)
    } else if (command === "resetGuard") {
      resetGuard(itemData)
    } else if (command === "delete") {
      deleteDevice(itemData)
    } else if (command === "syncBasicParam") {
      syncBasicParam(itemData)
    }
  }
  
  function setGuard(itemData) {
    axios({
      method: 'get',
      url: `/api/device/control/guard/${itemData.deviceId}/SetGuard`,
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: "布防成功"
        })
      } else {
        ElMessage.error({
          showClose: true,
          message: res.data.msg
        })
      }
    }).catch((error) => {
      ElMessage.error({
        showClose: true,
        message: error.message
      })
    })
  }
  
  function resetGuard(itemData) {
    axios({
      method: 'get',
      url: `/api/device/control/guard/${itemData.deviceId}/ResetGuard`,
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: "撤防成功"
        })
      } else {
        ElMessage.error({
          showClose: true,
          message: res.data.msg
        })
      }
    }).catch((error) => {
      ElMessage.error({
        showClose: true,
        message: error.message
      })
    })
  }
  
  function subscribeForCatalog(row, value) {
    // 防止重复点击
    const loadingKey = row.id + '_catalog';
    if (subscribingItems.value[loadingKey]) {
      return;
    }
    
    // 立即更新UI状态
    subscribingItems.value[loadingKey] = true;
    
    // 立即更新数据模型，以便UI立即响应
    row.subscribeCycleForCatalog = value ? 60 : 0;
    
    axios({
      method: 'get',
      url: `/api/device/query/subscribe/catalog`,
      params: {
        id: row.id,
        cycle: value ? 60 : 0
      },
      timeout: 8000 // 增加超时时间
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: value ? "订阅成功" : "取消订阅成功",
          duration: 2000
        });
      } else {
        // 如果请求失败，恢复原始状态
        row.subscribeCycleForCatalog = value ? 0 : 60;
        ElMessage.error({
          showClose: true,
          message: res.data.msg
        });
      }
    }).catch((error) => {
      // 如果请求失败，恢复原始状态
      row.subscribeCycleForCatalog = value ? 0 : 60;
      ElMessage.error({
        showClose: true,
        message: error.message
      });
    }).finally(() => {
      // 延迟500ms释放状态，防止用户快速点击
      setTimeout(() => {
        subscribingItems.value[loadingKey] = false;
      }, 500);
    });
  }
  
  function subscribeForMobilePosition(row, value) {
    // 防止重复点击
    const loadingKey = row.id + '_position';
    if (subscribingItems.value[loadingKey]) {
      return;
    }
    
    // 立即更新UI状态
    subscribingItems.value[loadingKey] = true;
    
    // 立即更新数据模型，以便UI立即响应
    row.subscribeCycleForMobilePosition = value ? 60 : 0;
    
    axios({
      method: 'get',
      url: `/api/device/query/subscribe/mobile-position`,
      params: {
        id: row.id,
        cycle: value ? 60 : 0,
        interval: value ? 5 : 0
      },
      timeout: 8000 // 增加超时时间
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: value ? "订阅成功" : "取消订阅成功",
          duration: 2000
        });
      } else {
        // 如果请求失败，恢复原始状态
        row.subscribeCycleForMobilePosition = value ? 0 : 60;
        ElMessage.error({
          showClose: true,
          message: res.data.msg
        });
      }
    }).catch((error) => {
      // 如果请求失败，恢复原始状态
      row.subscribeCycleForMobilePosition = value ? 0 : 60;
      ElMessage.error({
        showClose: true,
        message: error.message
      });
    }).finally(() => {
      // 延迟500ms释放状态，防止用户快速点击
      setTimeout(() => {
        subscribingItems.value[loadingKey] = false;
      }, 500);
    });
  }
  
  function syncBasicParam(data) {
    // 如果API不可用，提供反馈
    if (!apiAvailable.value) {
      ElMessage({
        showClose: true,
        message: '当前后端API不可用，无法同步基础配置',
        type: 'warning'
      })
      return
    }
    
    // 显示加载提示
    ElMessage({
      showClose: false,
      message: '正在同步设备基础配置...',
      type: 'info',
      duration: 3000
    })
    
    axios({
      method: 'get',
      url: `/api/device/config/query/${data.deviceId}/BasicParam`,
      timeout: 5000 // 添加5秒超时
    }).then((res) => {
      if (res.data.code === 0) {
        // 检查返回数据的完整性
        if (res.data.data && res.data.data.BasicParam) {
          ElMessage.success({
            showClose: true,
            message: `配置已同步，当前心跳间隔： ${res.data.data.BasicParam.HeartBeatInterval} 心跳间隔:${res.data.data.BasicParam.HeartBeatCount}`
          })
        } else {
          ElMessage.warning({
            showClose: true,
            message: '配置已同步，但未返回具体参数信息'
          })
        }
      } else {
        ElMessage.error({
          showClose: true,
          message: res.data.msg || '同步基础配置失败'
        })
      }
    }).catch((error) => {
      console.error('同步基础配置错误:', error)
      
      // 详细的错误信息
      let errorMsg = '未知错误'
      if (error.response) {
        errorMsg = `服务器错误 (${error.response.status})`
        // 如果服务器返回500错误，考虑API不可用
        if (error.response.status >= 500) {
          apiAvailable.value = false
        }
      } else if (error.request) {
        errorMsg = '无法连接到服务器，请检查网络连接'
        apiAvailable.value = false // 无法连接，标记API不可用
      } else if (error.message) {
        errorMsg = error.message
      }
      
      ElMessage.error({
        showClose: true,
        message: '同步基础配置失败: ' + errorMsg
      })
    })
  }
  
  // 检查API是否可用
  const checkApiAvailability = async () => {
    try {
      console.log('开始检测API可用性...')
      const response = await axios({
        method: 'get',
        url: '/api/server/system/configInfo',
        timeout: 3000
      })
      return response.status === 200
    } catch (error) {
      console.error('API不可用:', error)
      return false
    }
  }
  
  // 加载模拟设备数据
  function loadMockDeviceData() {
    console.log('加载模拟设备数据')
    const mockDevices = []
    const totalItems = 15
    
    for (let i = 1; i <= totalItems; i++) {
      const deviceId = `34020000001320000${i}`
      const online = i % 3 === 0 ? false : true
      
      mockDevices.push({
        id: `device_${i}`,
        deviceId: deviceId,
        name: `测试设备 ${i}`,
        manufacturer: '太行科技',
        hostAddress: `192.168.1.${100 + i}`,
        transport: 'UDP',
        streamMode: i % 3 === 0 ? 'UDP' : (i % 3 === 1 ? 'TCP-ACTIVE' : 'TCP-PASSIVE'),
        channelCount: i + 5,
        onLine: online,
        registerTime: new Date().toLocaleString(),
        keepaliveTime: new Date().toLocaleString(),
        subscribeCycleForCatalog: i % 2 === 0 ? 30 : 0,
        subscribeCycleForMobilePosition: i % 3 === 0 ? 30 : 0,
        subscribeCycleForAlarm: i % 4 === 0 ? 30 : 0,
        serverId: i % 2 === 0 ? 'local-server' : 'remote-server'
      })
    }
    
    deviceList.value = mockDevices
    total.value = mockDevices.length
  }
  </script>
  
  <style scoped>
  .page-header {
    padding: 16px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
  
  .page-header-btn {
    display: flex;
    align-items: center;
  }
  
  .table-header {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 600;
  }
  
  .name-wrapper {
    display: flex;
    align-items: center;
  }
  
  .videoList {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }
  
  .video-item {
    position: relative;
    width: 15rem;
    height: 10rem;
    margin-right: 1rem;
    background-color: #000000;
  }
  
  .video-item-img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: 100%;
  }
  
  .video-item-title {
    position: absolute;
    bottom: 0;
    color: #000000;
    background-color: #ffffff;
    line-height: 1.5rem;
    padding: 0.3rem;
    width: 14.4rem;
  }
  </style>