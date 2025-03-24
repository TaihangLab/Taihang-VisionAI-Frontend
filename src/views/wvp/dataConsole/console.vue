<template>
  <div class="console-container">
    <!-- 第一行 -->
    <el-row :gutter="20" class="console-row">
      <el-col :span="8">
        <div class="control-cell">
          <ConsoleCPU ref="cpuRef" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="control-cell">
          <ConsoleResource ref="resourceRef" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="control-cell">
          <ConsoleNet ref="networkRef" />
        </div>
      </el-col>
    </el-row>
    
    <!-- 第二行 -->
    <el-row :gutter="20" class="console-row">
      <el-col :span="8">
        <div class="control-cell">
          <ConsoleMEM ref="memoryRef" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="control-cell">
          <ConsoleNodeLoad ref="nodeLoadRef" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="control-cell">
          <ConsoleDisk ref="diskRef" />
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

// 设置axios的基础URL
axios.defaults.baseURL = 'http://192.168.1.107:18080'

let timer: any = null
let dataLoaded = ref<boolean>(false)

const cpuRef = ref()
const memoryRef = ref()
const networkRef = ref()
const nodeLoadRef = ref()
const diskRef = ref()
const resourceRef = ref()

// 用于记录上次数据，判断是否有变化
let lastCpuData: any[] = []
let lastMemData: any[] = []
let lastNetData: any[] = []
let forceUpdate = true // 首次强制更新标志

onMounted(() => {
  // 调用实际API获取数据
  loadRealData()
  
  // 500ms后检查数据是否已加载，如果未加载则重新尝试
  setTimeout(() => {
    if (!dataLoaded.value) {
      console.log('数据未成功加载，重试中...')
      loadRealData()
    }
    // 启动数据定时刷新
    loopForSystemInfo()
  }, 500)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// 循环更新数据函数
const loopForSystemInfo = () => {
  if (timer != null) {
    clearInterval(timer)
  }
  timer = setInterval(() => {
    // 使用实际API数据
    loadRealData()
    loopForSystemInfo()
  }, 5000) // 每5秒更新一次
}

// 加载真实数据函数
const loadRealData = () => {
  getSystemInfo()
  getLoad()
  getResourceInfo()
}

/**
 * 获取系统信息
 */
const getSystemInfo = () => {
  axios({
    method: 'get',
    url: `/api/server/system/info`,
  }).then((res) => {
    if (res.data.code === 0) {
     
      // 添加数据结构分析
      analyzeDataStructure(res.data.data)
      
      dataLoaded.value = true
      
      // 处理CPU数据
      if (res.data.data.cpu && Array.isArray(res.data.data.cpu)) {
        // 确保数据格式正确
        const cpuData = res.data.data.cpu.map((item: any) => {
          // 检查所有可能的CPU使用率字段
          let percentValue = 0;
          
          // 检查所有键名，寻找可能的使用率字段
          const keys = Object.keys(item);
          for (const key of keys) {
            const value = item[key];
            // 跳过time字段和非数值字段
            if (key === 'time' || typeof value !== 'number' && typeof value !== 'string') {
              continue;
            }
            
            // 尝试将字符串转换为数字
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            
            // 如果是0-1范围内的小数，表示百分比，需要乘以100
            if (numValue >= 0 && numValue < 1) {
              percentValue = numValue * 100;
              console.log(`找到小数形式的CPU使用率字段: ${key} = ${numValue}, 转换为: ${percentValue}%`);
              if (numValue > 0) break; // 如果找到非0值直接使用
            } 
            // 如果是百分比范围的值(0-100)并且不是0，优先使用
            else if (numValue > 0 && numValue <= 100) {
              percentValue = numValue;
              console.log(`找到可能的CPU使用率字段: ${key} = ${numValue}%`);
              break;
            } else if (numValue > 0 && percentValue === 0) {
              // 如果找到的值大于0但不在0-100范围内，先记录下来
              percentValue = numValue;
            }
          }
          
          if (percentValue === 0 && 'percent' in item) {
            const rawPercent = typeof item.percent === 'number' ? item.percent : 
                              typeof item.percent === 'string' ? parseFloat(item.percent) : 0;
            
            // 如果percent是0-1范围内的小数，表示百分比，需要乘以100
            if (rawPercent > 0 && rawPercent < 1) {
              percentValue = rawPercent * 100;
             } else {
              percentValue = rawPercent;
            }
          }
          
          // 格式化为两位小数
          percentValue = parseFloat(percentValue.toFixed(2));
          return {
            time: item.time || Date.now(),
            percent: percentValue
          }
        })
        
        // 检测数据是否变化
        const dataChanged = forceUpdate || JSON.stringify(cpuData) !== JSON.stringify(lastCpuData)
        if (dataChanged) {
          cpuRef.value?.setData(cpuData)
          lastCpuData = [...cpuData]
        }
      } else {
        // 添加模拟数据以测试图表渲染
        const mockCpuData = generateMockCpuData()
        cpuRef.value?.setData(mockCpuData)
      }
      
      // 处理内存数据
      if (res.data.data.mem && Array.isArray(res.data.data.mem)) {
        // 确保数据格式正确
        const memData = res.data.data.mem.map((item: any) => {
          // 检查所有可能的内存使用率字段
          let percentValue = 0;
          
          // 检查所有键名，寻找可能的使用率字段
          const keys = Object.keys(item);
          for (const key of keys) {
            const value = item[key];
            // 跳过time字段和非数值字段
            if (key === 'time' || typeof value !== 'number' && typeof value !== 'string') {
              continue;
            }
            
            // 尝试将字符串转换为数字
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            
            // 如果是0-1范围内的小数，表示百分比，需要乘以100
            if (numValue >= 0 && numValue < 1) {
              percentValue = numValue * 100;
              console.log(`找到小数形式的内存使用率字段: ${key} = ${numValue}, 转换为: ${percentValue}%`);
              if (numValue > 0) break; // 如果找到非0值直接使用
            } 
            // 如果是百分比范围的值(0-100)并且不是0，优先使用
            else if (numValue > 0 && numValue <= 100) {
              percentValue = numValue;
              console.log(`找到可能的内存使用率字段: ${key} = ${numValue}%`);
              break;
            } else if (numValue > 0 && percentValue === 0) {
              // 如果找到的值大于0但不在0-100范围内，先记录下来
              percentValue = numValue;
              console.log(`找到可能的内存使用率(需要换算): ${key} = ${numValue}`);
            }
          }
          
          if (percentValue === 0 && 'percent' in item) {
            const rawPercent = typeof item.percent === 'number' ? item.percent : 
                              typeof item.percent === 'string' ? parseFloat(item.percent) : 0;
            
            // 如果percent是0-1范围内的小数，表示百分比，需要乘以100
            if (rawPercent > 0 && rawPercent < 1) {
              percentValue = rawPercent * 100;
              console.log(`percent字段是小数形式: ${rawPercent}, 转换为: ${percentValue}%`);
            } else {
              percentValue = rawPercent;
            }
          }
          
          // 格式化为两位小数
          percentValue = parseFloat(percentValue.toFixed(2));
          return {
            time: item.time || Date.now(),
            percent: percentValue
          }
        })
        
        // 检测数据是否变化
        const dataChanged = forceUpdate || JSON.stringify(memData) !== JSON.stringify(lastMemData)
        if (dataChanged) {
          memoryRef.value?.setData(memData)
          lastMemData = [...memData]
        }
      } else {
        // 添加模拟数据以测试图表渲染
        const mockMemData = generateMockMemData()
        memoryRef.value?.setData(mockMemData)
      }
      
      // 处理网络数据
      if (res.data.data.net && Array.isArray(res.data.data.net)) {
        // 确保数据格式正确
        const netData = res.data.data.net.map((item: any) => {
          // 检查upload/download字段，尝试从其他可能的字段名获取
          let uploadValue = 0;
          let downloadValue = 0;
          
          // 检查所有键名，寻找可能的网络传输率字段
          const keys = Object.keys(item);
          for (const key of keys) {
            const value = item[key];
            // 跳过time字段和非数值字段
            if (key === 'time' || (typeof value !== 'number' && typeof value !== 'string')) {
              continue;
            }
            
            // 尝试将字符串转换为数字
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            
            // 检查字段名是否与上传相关
            if (['upload', 'out', 'tx', 'sent'].includes(key.toLowerCase())) {
              uploadValue = numValue;
            }
            // 检查字段名是否与下载相关
            else if (['download', 'in', 'rx', 'received'].includes(key.toLowerCase())) {
              downloadValue = numValue;
            }
          }
          
          // 生成标准化的网络数据对象，单位为MB/s
          return {
            time: item.time || Date.now(),
            upload: uploadValue,
            download: downloadValue
          }
        })
        
        // 检测数据是否变化
        const dataChanged = forceUpdate || JSON.stringify(netData) !== JSON.stringify(lastNetData)
        if (dataChanged) {
          networkRef.value?.setData(netData)
          lastNetData = [...netData]
        }
      } else {
        console.warn('网络数据格式不正确:', res.data.data.net)
      }
      
      // 处理磁盘数据
      if (res.data.data.disk && Array.isArray(res.data.data.disk)) {
        // 确保数据格式正确并使用真实数据
        const diskData = res.data.data.disk.map((item: any) => {
          // 检查并处理不同可能的字段名
          let usedValue = 0;
          let freeValue = 0;
          let pathValue = '未知';
          
          // 检查所有键名，寻找可能的磁盘路径
          if (item.path) {
            pathValue = item.path;
          } else if (item.mountPoint) {
            pathValue = item.mountPoint;
          } else if (item.drive) {
            pathValue = item.drive;
          }
          
          // 检查已使用空间字段 - 可能是used或use
          if (typeof item.used === 'number') {
            usedValue = item.used;
          } else if (typeof item.used === 'string') {
            usedValue = parseFloat(item.used);
          } else if (typeof item.use === 'number') {
            usedValue = item.use;
          } else if (typeof item.use === 'string') {
            usedValue = parseFloat(item.use);
          }
          
          // 检查剩余空间字段
          if (typeof item.free === 'number') {
            freeValue = item.free;
          } else if (typeof item.free === 'string') {
            freeValue = parseFloat(item.free);
          } else if (typeof item.available === 'number') {
            freeValue = item.available;
          } else if (typeof item.available === 'string') {
            freeValue = parseFloat(item.available);
          }
          
          // 确保数值有效
          usedValue = Math.max(0, usedValue);
          freeValue = Math.max(0, freeValue);
          return {
            path: pathValue,
            used: usedValue,
            free: freeValue
          }
        });
        
        // 过滤掉无效数据
        const validDiskData = diskData.filter(item => 
          item.path !== '未知' && (item.used > 0 || item.free > 0)
        );
        
        if (validDiskData.length > 0) {
          diskRef.value?.setData(validDiskData);
        } 
      }
      
      // 首次加载后关闭强制更新标志
      if (forceUpdate) {
        forceUpdate = false
      }
    }
  }).catch((error) => {
    // 记录加载失败
    dataLoaded.value = false
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
      console.log('负载信息数据:', res.data.data)
      
      // 确保数据是数组格式
      if (res.data.data && Array.isArray(res.data.data)) {
        nodeLoadRef.value?.setData(res.data.data)
      } 
    }
  }).catch((error) => {
    console.error('获取负载信息失败:', error)
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
      // 确保数据是对象格式
      if (res.data.data && typeof res.data.data === 'object') {
        resourceRef.value?.setData(res.data.data)
      } 

    }
  }).catch((error) => {
  })
}

// 以下是生成模拟数据的函数，仅在API返回的数据格式不正确时使用
const generateMockCpuData = () => {
  const now = Date.now()
  const data = []
  
  for (let i = 0; i < 30; i++) {
    data.push({
      time: now - (29 - i) * 1000,
      percent: Math.floor(Math.random() * 30) + 20
    })
  }
  
  return data
}

const generateMockMemData = () => {
  const now = Date.now()
  const data = []
  
  for (let i = 0; i < 30; i++) {
    data.push({
      time: now - (29 - i) * 1000,
      percent: Math.floor(Math.random() * 10) + 60
    })
  }
  
  return data
}

const generateMockNetData = () => {
  const now = Date.now()
  const data = []
  
  for (let i = 0; i < 30; i++) {
    data.push({
      time: now - (29 - i) * 1000,
      upload: Math.random() * 10,
      download: Math.random() * 20
    })
  }
  
  return data
}

const generateMockNodeLoadData = () => {
  return [
    {
      id: 'Server1',
      push: 1,
      proxy: 2,
      gbReceive: 3,
      gbSend: 1
    }
  ]
}

const generateMockResourceData = () => {
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
      total: 1,
      online: 0
    },
    proxy: {
      total: 1,
      online: 0
    }
  }
}

// 添加数据结构分析函数
const analyzeDataStructure = (data: any) => {
  if (!data) {
    return;
  }
}
</script>

<style>
#app {
  height: 100%;
}
.console-container {
  padding: 15px;
  background-color: #F5F7FA;
  min-height: 100%;
  box-sizing: border-box;
}

.console-row {
  margin-bottom: 20px;
}

.console-row:last-child {
  margin-bottom: 0;
}

.control-cell {
  height: 380px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .control-cell {
    height: 350px;
  }
}

@media (max-width: 992px) {
  .control-cell {
    margin-bottom: 20px;
  }
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
.debug-panel {
  background-color: #f5f7fa;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
</style>
