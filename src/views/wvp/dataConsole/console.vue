<template>
  <div id="app" style="width: 100%">
    <el-row style="width: 100%">
      <el-col :xl="{ span: 8 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="{ span: 12 }" :xs="{ span: 24 }" >
        <div class="control-cell">
          <div style="width:100%; height:100%;">
            <ConsoleCPU ref="consoleCPURef"></ConsoleCPU>
          </div>
        </div>
      </el-col>
      <el-col :xl="{ span: 8 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="{ span: 12 }" :xs="{ span: 24 }" >
        <div class="control-cell">
          <div style="width:100%; height:100%;">
            <ConsoleResource ref="consoleResourceRef"></ConsoleResource>
          </div>
        </div>
      </el-col>
      <el-col :xl="{ span: 8 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="{ span: 12 }" :xs="{ span: 24 }" >
        <div class="control-cell">
          <div style="width:100%; height:100%;">
            <ConsoleNet ref="consoleNetRef"></ConsoleNet>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="width: 100%">
      <el-col :xl="{ span: 8 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="{ span: 12 }" :xs="{ span: 24 }" >
        <div class="control-cell">
          <div style="width:100%; height:100%;">
            <ConsoleMEM ref="consoleMemRef"></ConsoleMEM>
          </div>
        </div>
      </el-col>
      <el-col :xl="{ span: 8 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="{ span: 12 }" :xs="{ span: 24 }" >
        <div class="control-cell">
          <div style="width:100%; height:100%;">
            <ConsoleNodeLoad ref="consoleNodeLoadRef"></ConsoleNodeLoad>
          </div>
        </div>
      </el-col>
      <el-col :xl="{ span: 8 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="{ span: 12 }" :xs="{ span: 24 }" >
        <div class="control-cell">
          <div style="width:100%; height:100%;">
            <ConsoleDisk ref="consoleDiskRef"></ConsoleDisk>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

import ConsoleCPU from './console/ConsoleCPU.vue'
import ConsoleMEM from './console/ConsoleMEM.vue'
import ConsoleNet from './console/ConsoleNet.vue'
import ConsoleNodeLoad from './console/ConsoleNodeLoad.vue'
import ConsoleDisk from './console/ConsoleDisk.vue'
import ConsoleResource from './console/ConsoleResource.vue'

let timer = ref<NodeJS.Timeout | null>(null)

const consoleCPURef = ref()
const consoleMemRef = ref()
const consoleNetRef = ref()
const consoleDiskRef = ref()
const consoleNodeLoadRef = ref()
const consoleResourceRef = ref()

onMounted(() => {
  // 调用模拟数据方法替代实际API调用
  loadMockData()
  loopForSystemInfo()
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearTimeout(timer.value)
  }
})

// 循环更新数据函数
const loopForSystemInfo = () => {
  if (timer.value != null) {
    clearTimeout(timer.value)
  }
  timer.value = setTimeout(() => {
    // 使用模拟数据
    loadMockData()
    timer.value = null
    loopForSystemInfo()
  }, 2000)
}

// 模拟数据函数
const loadMockData = () => {
  // 设置CPU数据
  const cpuData = generateCpuData()
  consoleCPURef.value.setData(cpuData)
  
  // 设置内存数据
  const memData = generateMemData()
  consoleMemRef.value.setData(memData)
  
  // 设置网络数据
  const netData = generateNetData()
  consoleNetRef.value.setData(netData)
  
  // 设置磁盘数据
  const diskData = generateDiskData()
  consoleDiskRef.value.setData(diskData)
  
  // 设置节点负载数据
  const nodeLoadData = generateNodeLoadData()
  consoleNodeLoadRef.value.setData(nodeLoadData)
  
  // 设置资源信息数据
  const resourceData = generateResourceData()
  consoleResourceRef.value.setData(resourceData)
}

// 生成CPU模拟数据
const generateCpuData = () => {
  const now = new Date()
  const data = []
  const baseValue = 35 // 基础值为35%左右
  
  for (let i = 0; i < 30; i++) {
    const time = new Date(now.getTime() - (29 - i) * 1000)
    
    // 如果是第9个或第20个点，生成低谷值
    let value = baseValue
    if (i === 9 || i === 20) {
      value = 20
    } else {
      // 其他点在基础值附近波动
      value = Math.floor(baseValue + Math.random() * 10 - 5)
    }
    
    data.push({
      time: time.getTime(),
      percent: value
    })
  }
  return data
}

// 生成内存模拟数据
const generateMemData = () => {
  const now = new Date()
  const data = []
  const baseValue = 65 // 基础值为65%左右
  
  for (let i = 0; i < 30; i++) {
    const time = new Date(now.getTime() - (29 - i) * 1000)
    
    // 内存值相对稳定，小幅波动
    const value = Math.floor(baseValue + Math.random() * 2 - 1)
    
    data.push({
      time: time.getTime(),
      percent: value
    })
  }
  return data
}

// 生成网络模拟数据
const generateNetData = () => {
  const now = new Date()
  const data = []
  
  for (let i = 0; i < 30; i++) {
    const time = new Date(now.getTime() - (29 - i) * 1000)
    
    // 网络数据波动较小，几乎接近0
    const upload = Math.random() * 3
    const download = Math.random() * 3
    
    data.push({
      time: time.getTime(),
      upload: upload,
      download: download
    })
  }
  
  return data
}

// 生成磁盘模拟数据
const generateDiskData = () => {
  return [
    {
      path: '/home',
      used: 800,
      free: 200
    },
    {
      path: '/',
      used: 150,
      free: 50
    }
  ]
}

// 生成节点负载模拟数据
const generateNodeLoadData = () => {
  // 创建与图片中相匹配的数据
  return [
    {
      id: 'XwFvZrfZbH1q4UV',
      push: 0,
      proxy: 0,
      gbReceive: 2,
      gbSend: 0
    }
  ]
}

// 生成资源信息模拟数据
const generateResourceData = () => {
  return {
    device: {
      total: 2,
      online: 2
    },
    channel: {
      total: 2,
      online: 2
    },
    push: {
      total: 0,
      online: 0
    },
    proxy: {
      total: 0,
      online: 0
    }
  }
}

// 以下是原有API接口代码（保留但不使用）
/**
 * 获取系统信息
 */
const getSystemInfo = () => {
  axios({
    method: 'get',
    url: `/api/server/system/info`,
  }).then((res) => {
    if (res.data.code === 0) {
      consoleCPURef.value.setData(res.data.data.cpu)
      consoleMemRef.value.setData(res.data.data.mem)
      consoleNetRef.value.setData(res.data.data.net)
      consoleDiskRef.value.setData(res.data.data.disk)
    }
  }).catch((error) => {
    console.error(error)
  })
}

/**
 * 获取负载信息
 */
const getLoad = () => {
  axios({
    method: 'get',
    url: `/api/server/media_server/load`,
  }).then((res) => {
    if (res.data.code === 0) {
      consoleNodeLoadRef.value.setData(res.data.data)
    }
  }).catch((error) => {
    console.error(error)
  })
}

/**
 * 获取资源信息
 */
const getResourceInfo = () => {
  axios({
    method: 'get',
    url: `/api/server/resource/info`,
  }).then((res) => {
    if (res.data.code === 0) {
      consoleResourceRef.value.setData(res.data.data)
    }
  }).catch((error) => {
    console.error(error)
  })
}
</script>

<style>
#app {
  height: 100%;
}
.control-cell {
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 10px;
  height: 360px;
}
.page-header {
  margin-bottom: 10px;
  padding: 10px 0;
}
.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
