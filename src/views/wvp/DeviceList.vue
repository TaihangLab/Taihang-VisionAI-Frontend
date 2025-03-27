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
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="deviceId" label="设备编号" min-width="160" />
        <el-table-column label="地址" min-width="160">
          <template #default="scope">
            <div class="name-wrapper">
              <el-tag v-if="scope.row.hostAddress" size="default">{{ scope.row.hostAddress }}</el-tag>
              <el-tag v-if="!scope.row.hostAddress" size="default">未知</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="manufacturer" label="厂家" min-width="100" />
        <el-table-column prop="transport" label="信令传输模式" min-width="100" />
        <el-table-column label="流传输模式" min-width="160">
          <template #default="scope">
            <el-select size="small" @change="transportChange(scope.row)" v-model="scope.row.streamMode" placeholder="请选择" style="width: 120px">
              <el-option key="UDP" label="UDP" value="UDP" />
              <el-option key="TCP-ACTIVE" label="TCP主动模式" value="TCP-ACTIVE" />
              <el-option key="TCP-PASSIVE" label="TCP被动模式" value="TCP-PASSIVE" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="通道数" min-width="100">
          <template #default="scope">
            <span style="font-size: 1rem">{{scope.row.channelCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="scope">
            <div class="name-wrapper">
              <el-tag size="default" v-if="scope.row.onLine && myServerId !== scope.row.serverId" style="border-color: #ecf1af">在线</el-tag>
              <el-tag size="default" v-if="scope.row.onLine && myServerId === scope.row.serverId">在线</el-tag>
              <el-tag size="default" type="info" v-if="!scope.row.onLine">离线</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订阅" min-width="260">
          <template #default="scope">
            <el-checkbox label="目录" :model-value="scope.row.subscribeCycleForCatalog > 0" @change="(e)=>subscribeForCatalog(scope.row.id, e)" />
            <el-checkbox label="位置" :model-value="scope.row.subscribeCycleForMobilePosition > 0" @change="(e)=>subscribeForMobilePosition(scope.row.id, e)" />
            <el-checkbox label="报警" disabled :model-value="scope.row.subscribeCycleForAlarm > 0" />
          </template>
        </el-table-column>
        <el-table-column prop="keepaliveTime" label="最近心跳" min-width="140" />
        <el-table-column prop="registerTime" label="最近注册" min-width="140" />
        <el-table-column label="操作" min-width="300" fixed="right">
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
    initData()
    updateLooper = setInterval(initData, 10000)
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
    axios({
      method: 'get',
      url: `/api/device/query/devices`,
      params: {
        page: currentPage.value,
        count: count.value,
        query: searchSrt.value,
        status: online.value,
      }
    }).then((res) => {
      if (res.data.code === 0) {
        total.value = res.data.data.total
        deviceList.value = res.data.data.list
      }
      getDeviceListLoading.value = false
    }).catch((error) => {
      console.error(error)
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
    // 直接跳转到通道列表，参考web_src实现
    router.push(`/channelList/${row.deviceId}/0`)
  }
  
  function refDevice(itemData) {
    axios({
      method: 'get',
      url: '/api/device/query/devices/' + itemData.deviceId + '/sync'
    }).then((res) => {
      if (res.data.code !== 0) {
        ElMessage({
          showClose: true,
          message: res.data.msg,
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

        // 参考web_src写法，调用同步通道进度对话框
        syncChannelProgressRef.value.openDialog(itemData.deviceId, () => {
          initData()
        })
      }
      initData()
    }).catch((e) => {
      console.error(e)
      ElMessage({
        showClose: true,
        message: e.message,
        type: 'error'
      })
    })
  }
  
  async function getTooltipContent(deviceId) {
    let result = ""
    try {
      const res = await axios({
        method: 'get',
        url: `/api/device/query/${deviceId}/sync_status/`,
      })
      if (res.data.code == 0) {
        if (res.data.data.errorMsg !== null) {
          result = res.data.data.errorMsg
        } else if (res.data.msg !== null) {
          result = res.data.msg
        } else {
          result = `同步中...[${res.data.data.current}/${res.data.data.total}]`
        }
      }
    } catch (error) {
      console.error(error)
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
  
  function subscribeForCatalog(data, value) {
    axios({
      method: 'get',
      url: `/api/device/query/subscribe/catalog`,
      params: {
        id: data,
        cycle: value ? 60 : 0
      }
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: value ? "订阅成功" : "取消订阅成功"
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
  
  function subscribeForMobilePosition(data, value) {
    axios({
      method: 'get',
      url: `/api/device/query/subscribe/mobile-position`,
      params: {
        id: data,
        cycle: value ? 60 : 0,
        interval: value ? 5 : 0
      }
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: value ? "订阅成功" : "取消订阅成功"
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
  
  function syncBasicParam(data) {
    axios({
      method: 'get',
      url: `/api/device/config/query/${data.deviceId}/BasicParam`,
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: `配置已同步，当前心跳间隔： ${res.data.data.BasicParam.HeartBeatInterval} 心跳间隔:${res.data.data.BasicParam.HeartBeatCount}`
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