<template>
  <div id="channelList" style="width: 100%">
    <div v-if="!editId">
      <div class="page-header">
        <div class="page-title">
          <el-page-header @back="showDevice" :content="parentChannelId === '0' ? '通道列表' : '子通道列表'">
            <template #title>
              <span class="breadcrumb-item">{{ device?.name || '设备' }}</span>
            </template>
          </el-page-header>
          
          <!-- 导航面包屑 -->
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item @click="goToDeviceList">设备列表</el-breadcrumb-item>
              <el-breadcrumb-item v-if="device">{{ device.name }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="parentChannelId !== '0'">通道: {{ parentChannelId }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ parentChannelId === '0' ? '所有通道' : '子通道' }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="page-header-btn">
          <div v-if="!showTree" style="display: inline;">
            <el-tag v-if="!deviceId" type="warning" style="margin-right: 1rem;">请选择设备</el-tag>
            <el-tag v-else type="success" style="margin-right: 1rem;">{{ device?.name || deviceId }}</el-tag>
            搜索:
            <el-input @input="search" style="margin-right: 1rem; width: auto;" size="small" placeholder="关键字"
                      :prefix-icon="Search" v-model="searchSrt" clearable></el-input>

            通道类型:
            <el-select size="small" @change="search" style="width: 8rem; margin-right: 1rem;" v-model="channelType" placeholder="请选择"
                       default-first-option>
              <el-option label="全部" value=""></el-option>
              <el-option label="设备" value="false"></el-option>
              <el-option label="子目录" value="true"></el-option>
            </el-select>
            在线状态:
            <el-select size="small" style="width: 8rem; margin-right: 1rem;" @change="search" v-model="online" placeholder="请选择"
                       default-first-option>
              <el-option label="全部" value=""></el-option>
              <el-option label="在线" value="true"></el-option>
              <el-option label="离线" value="false"></el-option>
            </el-select>
            码流类型重置:
            <el-select size="small" style="width: 16rem; margin-right: 1rem;" @change="subStreamChange" v-model="subStream"
                       placeholder="请选择码流类型" default-first-option >
              <el-option label="stream:0(主码流)" value="stream:0"></el-option>
              <el-option label="stream:1(子码流)" value="stream:1"></el-option>
              <el-option label="streamnumber:0(主码流-2022)" value="streamnumber:0"></el-option>
              <el-option label="streamnumber:1(子码流-2022)" value="streamnumber:1"></el-option>
              <el-option label="streamprofile:0(主码流-大华)" value="streamprofile:0"></el-option>
              <el-option label="streamprofile:1(子码流-大华)" value="streamprofile:1"></el-option>
              <el-option label="streamMode:main(主码流-水星+TP-LINK)" value="streamMode:main"></el-option>
              <el-option label="streamMode:sub(子码流-水星+TP-LINK)" value="streamMode:sub"></el-option>
            </el-select>
          </div>
          <el-button :icon="RefreshRight" circle size="small" @click="refresh()"></el-button>
        </div>
      </div>
      <el-table size="default" ref="channelListTable" :data="deviceChannelList" :height="tableHeight"
                header-row-class-name="table-header">
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="deviceId" label="编号" min-width="180" />
        <el-table-column label="快照" min-width="100">
          <template #default="scope">
            <el-image
              :src="getSnap(scope.row)"
              :preview-src-list="getBigSnap(scope.row)"
              @error="getSnapErrorEvent(scope.row.deviceId, scope.row.channelId)"
              :fit="'contain'"
              style="width: 60px">
              <div slot="error" class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="manufacturer" label="厂家" min-width="100" />
        <el-table-column label="位置信息" min-width="150">
          <template #default="scope">
            <span size="default" v-if="scope.row.longitude && scope.row.latitude">{{scope.row.longitude}}<br/>{{scope.row.latitude}}</span>
            <span size="default" v-if="!scope.row.longitude || !scope.row.latitude">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="ptzType" label="云台类型" min-width="100">
          <template #default="scope">
            <div>{{ getPtzTypeText(scope.row.ptzType) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开启音频" min-width="100">
          <template #default="scope">
            <el-switch @change="updateChannel(scope.row)" v-model="scope.row.hasAudio" active-color="#409EFF">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="码流类型" min-width="180">
          <template #default="scope">
            <el-select size="small" style="margin-right: 1rem;" @change="channelSubStreamChange(scope.row)" v-model="scope.row.streamIdentification"
                       placeholder="请选择码流类型" default-first-option >
              <el-option label="stream:0(主码流)" value="stream:0"></el-option>
              <el-option label="stream:1(子码流)" value="stream:1"></el-option>
              <el-option label="streamnumber:0(主码流-2022)" value="streamnumber:0"></el-option>
              <el-option label="streamnumber:1(子码流-2022)" value="streamnumber:1"></el-option>
              <el-option label="streamprofile:0(主码流-大华)" value="streamprofile:0"></el-option>
              <el-option label="streamprofile:1(子码流-大华)" value="streamprofile:1"></el-option>
              <el-option label="streamMode:main(主码流-水星+TP-LINK)" value="streamMode:main"></el-option>
              <el-option label="streamMode:sub(子码流-水星+TP-LINK)" value="streamMode:sub"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="scope">
            <div class="name-wrapper">
              <el-tag size="default" v-if="scope.row.status === 'ON'">在线</el-tag>
              <el-tag size="default" type="info" v-if="scope.row.status !== 'ON'">离线</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="340" fixed="right">
          <template #default="scope">
            <el-button link size="default" :disabled="device == null || device.online === 0" :icon="VideoPlay"
                     :loading="scope.row.playLoading" @click="sendDevicePush(scope.row)">播放
            </el-button>
            <el-button link size="default" :disabled="device == null || device.online === 0"
                     :icon="SwitchButton"
                     type="danger" v-if="!!scope.row.streamId"
                     @click="stopDevicePush(scope.row)">停止
            </el-button>
            <el-divider direction="vertical" />
            <el-button
              link
              size="default"
              :icon="Edit"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-divider direction="vertical" />
            <el-button link size="default" :icon="Connection" 
                     v-if="scope.row.subCount > 0 || scope.row.parental === 1 || scope.row.deviceId.length <= 8"
                     @click="changeSubchannel(scope.row)">查看
            </el-button>
            <el-divider v-if="scope.row.subCount > 0 || scope.row.parental === 1 || scope.row.deviceId.length <= 8" direction="vertical" />
            <el-dropdown @command="(command)=>{moreClick(command, scope.row)}">
              <el-button link size="default">
                更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="records" :disabled="device == null || device.online === 0">
                    设备录像</el-dropdown-item>
                  <el-dropdown-item command="cloudRecords" :disabled="device == null || device.online === 0">
                    云端录像</el-dropdown-item>
                  <el-dropdown-item command="record" :disabled="device == null || device.online === 0">
                    设备录像控制-开始</el-dropdown-item>
                  <el-dropdown-item command="stopRecord" :disabled="device == null || device.online === 0">
                    设备录像控制-停止</el-dropdown-item>
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

    <DevicePlayer ref="devicePlayerRef"></DevicePlayer>
    <ChannelEdit v-if="editId" :id="editId" :closeEdit="closeEdit"></ChannelEdit>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, VideoPlay, SwitchButton, Edit, Connection, ArrowDown, Picture } from '@element-plus/icons-vue'
import axios from 'axios'

import DevicePlayer from './dialog/DevicePlayer.vue'
import ChannelEdit from './ChannelEdit.vue'

// 配置axios默认地址 - 确保使用正确的后端地址
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
const route = useRoute()

// 引用组件
const devicePlayerRef = ref()
const channelListTable = ref()

// 响应式状态
const deviceId = ref(route.params.deviceId ? String(route.params.deviceId) : '')
const parentChannelId = ref(route.params.parentChannelId ? String(route.params.parentChannelId) : '0')
const device = ref(null)
const deviceChannelList = ref([])
const currentPage = ref(1)
const count = ref(15)
const total = ref(0)
const searchSrt = ref('')
const channelType = ref('')
const online = ref('')
const subStream = ref('')
const showTree = ref(false)
const editId = ref(null)
const tableHeight = ref('calc(100vh - 200px)')
const loadSnap = ref({})
const beforeUrl = ref('/deviceList')
const tabActiveName = ref('1')

// 云台类型映射
const ptzTypes = {
  '0': '未知',
  '1': '球机',
  '2': '半球',
  '3': '固定枪机',
  '4': '遥控枪机',
  '5': '遥控半球',
  '6': '多目全景',
  '7': '多目分割'
}

// 获取PTZ类型文本
const getPtzTypeText = (type) => {
  return ptzTypes[String(type)] || '未知'
}

// 生命周期钩子
onMounted(() => {
  
  
  // 从路由参数获取deviceId
  if (route.params.deviceId) {
    deviceId.value = String(route.params.deviceId)
  } else {
    // 如果没有deviceId，提示用户选择设备
    deviceId.value = ''
    ElMessage.warning({
      showClose: true,
      message: '请从设备列表选择一个设备',
      duration: 3000
    })
  }
  
  // 从路由参数获取parentChannelId
  if (route.params.parentChannelId) {
    parentChannelId.value = String(route.params.parentChannelId)
  } else {
    parentChannelId.value = '0'
  }

  // 初始化参数
  initParam()
  
  if (deviceId.value) {
    // 先获取设备信息，然后在回调中获取通道列表
    getDevice().then(() => {
      initData()
    }).catch(err => {
      console.error('获取设备信息失败:', err)
      // 显示错误消息，提示用户重新选择设备
      ElMessage.error({
        showClose: true,
        message: '获取设备信息失败，请返回设备列表重新选择设备',
        duration: 5000
      })
    })
  } else {
    console.error('无法初始化数据，deviceId为空')
    ElMessage.warning({
      showClose: true,
      message: '请从设备列表选择一个设备以查看通道列表',
      duration: 5000
    })
  }
  
  // 添加路由参数变化监听
  watch(
    () => route.params,
    (newParams) => {
      if (newParams.deviceId) {
        deviceId.value = String(newParams.deviceId)
      } else if (deviceId.value === '') {
        // 如果没有设备ID，不使用测试ID，而是提示用户
        ElMessage.warning({
          showClose: true,
          message: '请从设备列表选择一个设备',
          duration: 3000
        })
        return // 不继续加载数据
      }
      
      if (newParams.parentChannelId) {
        parentChannelId.value = String(newParams.parentChannelId)
      } else {
        parentChannelId.value = '0'
      }
      
      // 只要路由参数变化，就重新初始化参数
      initParam()
      
      if (deviceId.value) {
        getDevice().then(() => initData())
      }
    },
    { immediate: true, deep: true } // 立即触发，深度监听
  )

  // 修改当前路由变化处理
  watch(
    () => route,
    (newRoute, oldRoute) => {
      console.log('完整路由对象变化:', 
        'new path:', newRoute.path, 
        'old path:', oldRoute?.path,
        'new params:', newRoute.params, 
        'new query:', newRoute.query)
      
      // 如果路径或参数发生变化，重新初始化
      if (newRoute.path !== oldRoute?.path || 
          newRoute.params.deviceId !== oldRoute?.params.deviceId || 
          newRoute.params.parentChannelId !== oldRoute?.params.parentChannelId ||
          newRoute.query.t !== oldRoute?.query.t) {
        // 初始化参数
        initParam()
        // 获取设备信息
        getDevice().then(() => {
          // 获取通道数据
          initData()
        })
      }
    },
    { deep: true, immediate: true }
  )
})

onUnmounted(() => {
  // 清理工作
})

// 获取设备信息
const getDevice = () => {
  
  if (!deviceId.value) {
    return Promise.reject(new Error('设备ID为空，请从设备列表选择一个设备'))
  }
  
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: `/api/device/query/devices/${deviceId.value}`,
      timeout: 8000
    }).then((res) => {
      if (res.data.code === 0) {
        device.value = res.data.data
        console.log('获取设备信息成功:', device.value)
        resolve(device.value)
      } else {
        const error = new Error(res.data.msg || '获取设备信息失败')
        ElMessage.error({
          showClose: true,
          message: res.data.msg || '获取设备信息失败，请确认设备ID是否正确',
          duration: 5000
        })
        reject(error)
      }
    }).catch((error) => {
      console.error('获取设备信息错误:', error)
      ElMessage.error({
        showClose: true,
        message: '获取设备信息失败:' + (error.message || '未知错误') + '，请检查网络连接或API服务状态',
        duration: 5000
      })
      reject(error)
    })
  })
}

// 初始化数据
const initData = () => {
  if (!deviceId.value) {
    console.warn('initData: deviceId为空，无法获取通道列表')
    return
  }
  
  if (parentChannelId.value === '0' || !parentChannelId.value) {
    getDeviceChannelList()
  } else {
    showSubchannels()
  }
}

// 初始化参数
const initParam = () => {
  console.log('initParam被调用 - 当前路由:', route.fullPath, '参数:', route.params, '查询:', route.query)
  
  // 确保使用String转换，避免类型问题
  if (route.params.deviceId) {
    deviceId.value = String(route.params.deviceId)
  }
  
  if (route.params.parentChannelId) {
    parentChannelId.value = String(route.params.parentChannelId)
  } else {
    parentChannelId.value = '0'
  }
  
  // 重置分页相关参数
  currentPage.value = 1
  count.value = 15
  
  // 设置返回URL
  if (parentChannelId.value === '' || parentChannelId.value === '0') {
    // 如果是顶层通道，根据查询参数设置返回路径
    if (route.query.from === 'deviceList') {
      beforeUrl.value = '/deviceList'
    } else {
      // 可能是从其他页面进入的，保持之前的返回路径
      // 如果没有特定的返回路径，默认使用设备列表
      if (!beforeUrl.value) {
        beforeUrl.value = '/deviceList'
      }
    }
  } else {
    // 如果是子通道，设置返回路径为父通道页面
    const parentPath = route.name ? `/${String(route.name)}/${deviceId.value}/0` : `/channelList/${deviceId.value}/0`
    if (route.query.from) {
      // 保留来源信息
      beforeUrl.value = parentPath
    } else {
      beforeUrl.value = parentPath
    }
  }
  
  // 清空当前数据，防止新旧数据混淆
  deviceChannelList.value = []
  total.value = 0
}

// 分页相关
const currentChange = (val) => {
  currentPage.value = val
  initData()
}

const handleSizeChange = (val) => {
  count.value = val
  getDeviceChannelList()
}

// 获取设备通道列表
const getDeviceChannelList = () => {
  
  if (!deviceId.value) {
    console.warn('deviceId为空，无法获取通道列表')
    // 在UI中显示设备选择提示
    ElMessage.info({
      showClose: true,
      message: '请从设备列表选择一个设备'
    })
    return
  }

  console.log('开始获取通道列表，设备ID:', deviceId.value, '筛选条件:', {
    page: currentPage.value,
    count: count.value,
    query: searchSrt.value,
    online: online.value,
    channelType: channelType.value
  })

  // 更新加载状态
  ElMessage({
    showClose: false,
    message: '正在加载通道列表...',
    type: 'info',
    duration: 2000
  })

  // 记录使用的是真实API数据
  window.localStorage.setItem('usingRealApiData', 'true')

  axios({
    method: 'get',
    url: `/api/device/query/devices/${deviceId.value}/channels`,
    params: {
      page: currentPage.value,
      count: count.value,
      query: searchSrt.value,
      online: online.value,
      channelType: channelType.value
    },
    timeout: 10000 // 增加超时时间，防止网络不稳定导致失败
  }).then((res) => {
    if (res.data.code === 0) {
      console.log('获取通道列表成功，总数:', res.data.data.total)
      total.value = res.data.data.total
      deviceChannelList.value = res.data.data.list.map(item => {
        item.ptzType = String(item.ptzType)
        item.playLoading = false
        return item
      })
      
      
      // 防止出现表格错位
      setTimeout(() => {
        if (channelListTable.value) {
          channelListTable.value.doLayout()
        }
      }, 100)
    } else {
      console.warn('获取通道列表返回错误码:', res.data.code, res.data.msg)
      ElMessage.error({
        showClose: true,
        message: res.data.msg || '获取通道列表失败'
      })
      // 显示空列表
      deviceChannelList.value = []
      total.value = 0
    }
  }).catch((error) => {
    console.error('获取通道列表错误:', error)
    ElMessage.error({
      showClose: true,
      message: '获取通道列表失败: ' + (error.message || '未知错误')
    })
    // 显示空列表
    deviceChannelList.value = []
    total.value = 0
  })
}

// 发送设备推流请求
const sendDevicePush = (itemData) => {
  itemData.playLoading = true
  
  // 重试计数器和最大重试次数
  let retryCount = 0
  const maxRetries = 2
  
  // 尝试不同协议的播放方法
  const protocols = ['HTTP', 'RTSP', 'RTMP']
  let currentProtocolIndex = 0
  
  const tryPlayStream = () => {
    const currentProtocol = protocols[currentProtocolIndex]
    
    // 添加认证头和跨域支持
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      // 如果需要，添加授权头
      // 'Authorization': 'Bearer ' + token
    }
    
    
    axios({
      method: 'get',
      url: `/api/play/start/${deviceId.value}/${itemData.deviceId}`,
      params: {
        isSubStream: itemData.streamIdentification ? itemData.streamIdentification.includes('1') : false,
        protocol: currentProtocol,
        transportMode: currentProtocol === 'RTSP' ? 'TCP' : undefined, // RTSP使用TCP传输模式
        port: currentProtocol === 'HTTP' ? 18085 : undefined // 为HTTP指定端口
      },
      headers: headers,
      timeout: 15000 // 增加超时时间
    }).then((res) => {
      if (res.data.code === 0) {
        
        // 5秒后获取快照
        setTimeout(() => {
          let snapId = deviceId.value + "_" + itemData.deviceId
          loadSnap.value[deviceId.value + itemData.deviceId] = 0
          getSnapErrorEvent(snapId)
        }, 5000)
        
        itemData.streamId = res.data.data.stream
        devicePlayerRef.value.openDialog("media", deviceId.value, itemData.deviceId, {
          streamInfo: res.data.data,
          hasAudio: itemData.hasAudio
        })
        
        setTimeout(() => {
          initData()
        }, 1000)
        
        itemData.playLoading = false
        ElMessage.success({
          showClose: true,
          message: `推流成功 (${currentProtocol})`
        })
      } else {
        console.warn('推流返回错误:', res.data)
        
        // 尝试使用下一个协议或重试
        if (currentProtocolIndex < protocols.length - 1) {
          currentProtocolIndex++
          tryPlayStream()
        } else if (retryCount < maxRetries) {
          retryCount++
          currentProtocolIndex = 0 // 重置协议索引
          setTimeout(tryPlayStream, 1000) // 延迟1秒后重试
        } else {
          itemData.playLoading = false
          ElMessage.warning({
            showClose: true,
            message: res.data.msg || '推流失败，请稍后重试'
          })
        }
      }
    }).catch((error) => {
      console.error('推流错误:', error)
      
      // 构建更有用的错误信息
      let errorMsg = '未知错误'
      let shouldRetry = true
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMsg = '权限不足，无法访问流媒体服务器 (403 Forbidden)'
        } else if (error.response.status === 401) {
          errorMsg = '未授权，请检查认证信息 (401 Unauthorized)'
          shouldRetry = false // 认证问题，不重试
        } else if (error.response.status === 404) {
          errorMsg = '请求的资源不存在 (404 Not Found)'
        } else if (error.response.status === 500) {
          errorMsg = '服务器内部错误 (500)'
        } else {
          errorMsg = `服务器错误: ${error.response.status} ${error.response.statusText}`
        }
      } else if (error.request) {
        errorMsg = '无法连接到服务器，请检查网络连接'
      } else if (error.message) {
        errorMsg = error.message
      }
      
      // 尝试使用下一个协议或重试
      if (shouldRetry) {
        if (currentProtocolIndex < protocols.length - 1) {
          currentProtocolIndex++
          console.log(`服务器错误后切换到${protocols[currentProtocolIndex]}协议尝试播放`)
          tryPlayStream()
          return
        } else if (retryCount < maxRetries) {
          retryCount++
          currentProtocolIndex = 0 // 重置协议索引
          console.log(`服务器错误后重置协议选择并重试播放 (${retryCount}/${maxRetries})`)
          setTimeout(tryPlayStream, 1000) // 延迟1秒后重试
          return
        }
      }
      
      // 所有尝试都失败
      itemData.playLoading = false
      ElMessage.error({
        showClose: true,
        message: '推流失败: ' + errorMsg
      })
    })
  }
  
  // 开始尝试播放
  tryPlayStream()
}

// 停止设备推流
const stopDevicePush = (itemData) => {
  axios({
    method: 'get',
    url: `/api/play/stop/${deviceId.value}/${itemData.deviceId}`,
    params: {
      isSubStream: false // TODO: 根据实际情况设置
    }
  }).then((res) => {
    if (res.data.code === 0 || (res.data.code && res.data.code !== 0)) {
      initData()
      ElMessage.success({
        showClose: true,
        message: '停止推流成功'
      })
    }
  }).catch((error) => {
    if (error.response && error.response.status === 402) { // 已经停止过
      initData()
      ElMessage.info({
        showClose: true,
        message: '流已经停止'
      })
    } else {
      console.error('停止推流错误:', error)
      ElMessage.error({
        showClose: true,
        message: '停止推流失败: ' + (error.message || '未知错误')
      })
    }
  })
}

// 更多操作点击
const moreClick = (command, itemData) => {
  if (command === "records") {
    queryRecords(itemData)
  } else if (command === "cloudRecords") {
    queryCloudRecords(itemData)
  } else if (command === "record") {
    startRecord(itemData)
  } else if (command === "stopRecord") {
    stopRecord(itemData)
  }
}

// 查询设备录像
const queryRecords = (itemData) => {
  router.push(`/gbRecordDetail/${deviceId.value}/${itemData.deviceId}`)
}

// 查询云端录像
const queryCloudRecords = (itemData) => {
  router.push(`/cloudRecordDetail/rtp/${deviceId.value}_${itemData.deviceId}`)
}

// 开始录像
const startRecord = (itemData) => {
  axios({
    method: 'get',
    url: `/api/device/control/record/${deviceId.value}/Record`,
    params: {
      channelId: itemData.deviceId
    }
  }).then((res) => {
    if (res.data.code === 0) {
      ElMessage.success({
        showClose: true,
        message: "开始录像成功"
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

// 停止录像
const stopRecord = (itemData) => {
  axios({
    method: 'get',
    url: `/api/device/control/record/${deviceId.value}/StopRecord`,
    params: {
      channelId: itemData.deviceId
    }
  }).then((res) => {
    if (res.data.code === 0) {
      ElMessage.success({
        showClose: true,
        message: "停止录像成功"
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

// 获取快照
const getSnap = (row) => {
  return `/api/device/query/snap/${deviceId.value}/${row.deviceId}`
}

// 获取大图预览列表
const getBigSnap = (row) => {
  return [getSnap(row)]
}

// 快照错误处理
const getSnapErrorEvent = (deviceId: string, channelId?: string) => {
  const key = deviceId + (channelId || '')
  if (typeof (loadSnap.value[key]) !== "undefined") {
    if (loadSnap.value[key] > 5) {
      delete loadSnap.value[key]
      return
    }
    setTimeout(() => {
      let url = `/api/device/query/snap/${deviceId}/${channelId || ''}`
      loadSnap.value[key]++
      const img = document.getElementById(deviceId + (channelId || ''))
      if (img) {
        img.setAttribute("src", url + '?' + new Date().getTime())
      }
    }, 1000)
  }
}

// 返回设备列表
const showDevice = () => {
  console.log('返回设备列表页面，当前路由参数:', route.query)
  
  // 判断是否有来源标记
  if (route.query.from === 'deviceList') {
    // 如果是从设备列表页面进入，则返回设备列表
    router.push('/deviceList')
  } else {
    // 否则返回之前存储的URL
    router.push(beforeUrl.value)
  }
}

// 切换子通道
const changeSubchannel = (itemData) => {
  // 保存当前路径作为返回路径
  beforeUrl.value = router.currentRoute.value.path
  
  // 保留路由的查询参数
  const query = { ...route.query }
  
  // 构建URL，包含设备ID和通道ID
  const url = `/${String(router.currentRoute.value.name)}/${deviceId.value}/${itemData.deviceId}`
  
  // 跳转到子通道页面，并保留查询参数
  router.push({
    path: url,
    query: query
  })
  
  // 重置搜索条件
  searchSrt.value = ""
  channelType.value = ""
  online.value = ""
  
  // 初始化参数和数据
  initParam()
  initData()
}

// 显示子通道
const showSubchannels = () => {
  
  if (!showTree.value) {
    axios({
      method: 'get',
      url: `/api/device/query/sub_channels/${deviceId.value}/${parentChannelId.value}/channels`,
      params: {
        page: currentPage.value,
        count: count.value,
        query: searchSrt.value,
        online: online.value,
        channelType: channelType.value
      },
      timeout: 5000
    }).then((res) => {
      if (res.data.code === 0) {
        total.value = res.data.data.total
        deviceChannelList.value = res.data.data.list.map(item => {
          item.ptzType = String(item.ptzType)
          item.playLoading = false
          return item
        })
        
        // 防止出现表格错位
        setTimeout(() => {
          if (channelListTable.value) {
            channelListTable.value.doLayout()
          }
        }, 100)
      } else {
        console.warn('获取子通道列表返回错误码:', res.data.code, res.data.msg)
        ElMessage.error({
          showClose: true,
          message: res.data.msg || '获取子通道列表失败'
        })
        // 显示空列表
        deviceChannelList.value = []
        total.value = 0
      }
    }).catch((error) => {
      console.error('获取子通道列表错误:', error)
      ElMessage.error({
        showClose: true,
        message: '获取子通道列表失败:' + (error.message || '未知错误')
      })
      // 显示空列表
      deviceChannelList.value = []
      total.value = 0
    })
  } else {
    axios({
      method: 'get',
      url: `/api/device/query/tree/channel/${deviceId.value}`,
      params: {
        parentId: parentChannelId.value,
        page: currentPage.value,
        count: count.value,
      },
      timeout: 5000
    }).then((res) => {
      if (res.data.code === 0) {
        total.value = res.data.total
        deviceChannelList.value = res.data.list.map(item => {
          item.ptzType = String(item.ptzType || '0')
          item.playLoading = false
          return item
        })
        
        // 防止出现表格错位
        setTimeout(() => {
          if (channelListTable.value) {
            channelListTable.value.doLayout()
          }
        }, 100)
      } else {
        console.warn('获取通道树返回错误码:', res.data.code, res.data.msg)
        ElMessage.error({
          showClose: true,
          message: res.data.msg || '获取通道树失败'
        })
        // 显示空列表
        deviceChannelList.value = []
        total.value = 0
      }
    }).catch((error) => {
      console.error('获取通道树错误:', error)
      ElMessage.error({
        showClose: true,
        message: '获取通道树失败:' + (error.message || '未知错误')
      })
      // 显示空列表
      deviceChannelList.value = []
      total.value = 0
    })
  }
}

// 搜索
const search = () => {
  currentPage.value = 1
  total.value = 0
  initData()
}

// 更新通道
const updateChannel = (row) => {
  axios({
    method: 'post',
    url: `/api/device/query/channel/audio`,
    params: {
      channelId: row.id,
      audio: row.hasAudio
    }
  }).then(() => {
    // 成功
  })
}

// 码流类型重置
const subStreamChange = () => {
  ElMessageBox.confirm('确定重置所有通道的码流类型?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios({
      method: 'post',
      url: `/api/device/query/channel/stream/identification/update/`,
      params: {
        deviceDbId: device.value.id,
        streamIdentification: subStream.value
      }
    }).then(() => {
      initData()
    }).finally(() => {
      subStream.value = ""
    })
  }).catch(() => {
    subStream.value = ""
  })
}

// 通道码流类型修改
const channelSubStreamChange = (row) => {
  axios({
    method: 'post',
    url: `/api/device/query/channel/stream/identification/update/`,
    params: {
      deviceDbId: row.deviceDbId,
      id: row.id,
      streamIdentification: row.streamIdentification
    }
  }).then((res) => {
    if (res.data.code === 0) {
      ElMessage.success({
        showClose: true,
        message: '码流类型修改成功'
      })
    } else {
      ElMessage.error({
        showClose: true,
        message: res.data.msg || '码流类型修改失败'
      })
    }
  }).catch((error) => {
    console.error('码流类型修改错误:', error)
    ElMessage.error({
      showClose: true,
      message: '码流类型修改失败: ' + (error.message || '未知错误')
    })
  })
}

// 刷新
const refresh = () => {
  initData()
}

// 编辑通道
const handleEdit = (row) => {
  // 检查row和row.id是否存在
  if (!row || !row.id) {
    console.error('无法编辑通道: 通道ID无效', row)
    ElMessage.error({
      showClose: true,
      message: '无法编辑通道: 通道ID无效'
    })
    return
  }
  
  // 保存更多通道信息到localStorage，以便编辑组件获取
  window.localStorage.setItem('currentDeviceId', deviceId.value)
  window.localStorage.setItem('currentChannelData', JSON.stringify(row))
  console.log('保存通道信息到localStorage:', deviceId.value, row.id, row)
  
  // 跳转到编辑页面
  editId.value = row.id
}

// 结束编辑
const closeEdit = () => {
  editId.value = null
  getDeviceChannelList()
}

// 修改tab事件处理函数，添加类型声明
const tabHandleClick = (tab: any) => {
  tabActiveName.value = String(tab.name) // 显式转换为字符串
}

// 跳转到设备列表
const goToDeviceList = () => {
  router.push('/deviceList')
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
  display: flex;
  flex-direction: column;
}

.breadcrumb {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  cursor: pointer;
}

.breadcrumb-item {
  font-weight: bold;
  color: #409EFF;
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