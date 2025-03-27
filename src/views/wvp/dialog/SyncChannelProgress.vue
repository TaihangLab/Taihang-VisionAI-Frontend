<template>
  <el-dialog
    v-model="dialogVisible"
    title="同步通道进度"
    width="30%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false">
    <div class="progress-container">
      <el-progress 
        :percentage="progressPercentage" 
        :status="progressStatus" 
        :stroke-width="18"
        :text-inside="true"
        :format="progressFormat">
      </el-progress>
      <div class="progress-text">
        {{ progressText }}
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, defineEmits } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 配置axios默认地址
axios.defaults.baseURL = 'http://192.168.1.107:18080'

// 定义组件的事件
const emit = defineEmits(['refresh'])

// 对话框相关
const dialogVisible = ref(false)

// 进度相关
const syncStatus = reactive({
  deviceId: '',
  total: 0,
  current: 0,
  errorMsg: '',
  completed: false
})

// 进度百分比
const progressPercentage = computed(() => {
  if (syncStatus.total === 0) return 0
  return Math.floor((syncStatus.current / syncStatus.total) * 100)
})

// 进度状态
const progressStatus = computed(() => {
  if (syncStatus.errorMsg) return 'exception'
  if (syncStatus.completed) return 'success'
  return ''
})

// 进度提示文本
const progressText = computed(() => {
  if (syncStatus.errorMsg) return `同步失败: ${syncStatus.errorMsg}`
  if (syncStatus.completed) return '同步完成'
  return `正在同步: ${syncStatus.current} / ${syncStatus.total}`
})

// 进度格式化函数
const progressFormat = (percentage) => {
  return `${percentage}%`
}

// 轮询定时器
let timer = null

// 打开对话框方法
const openDialog = (deviceId, callback) => {
  dialogVisible.value = true
  syncStatus.deviceId = deviceId
  syncStatus.total = 0
  syncStatus.current = 0
  syncStatus.errorMsg = ''
  syncStatus.completed = false
  
  // 开始轮询同步状态
  startPolling()
  
  // 保存回调函数
  saveCallback.value = callback
}

// 保存回调函数
const saveCallback = ref(null)

// 开始轮询同步状态
const startPolling = () => {
  if (timer) {
    clearInterval(timer)
  }
  
  timer = setInterval(() => {
    checkSyncStatus()
  }, 1000)
}

// 检查同步状态
const checkSyncStatus = () => {
  axios({
    method: 'get',
    url: `/api/device/query/${syncStatus.deviceId}/sync_status/`,
  }).then((res) => {
    if (res.data.code === 0) {
      // 更新同步状态
      syncStatus.total = res.data.data.total || 0
      syncStatus.current = res.data.data.current || 0
      syncStatus.errorMsg = res.data.data.errorMsg || ''
      
      // 判断是否完成
      if (syncStatus.errorMsg || (syncStatus.total > 0 && syncStatus.current >= syncStatus.total)) {
        syncStatus.completed = true
        stopPolling()
        
        // 延迟关闭对话框
        setTimeout(() => {
          dialogVisible.value = false
          if (saveCallback.value) {
            saveCallback.value()
          }
          // 触发刷新事件
          emit('refresh')
        }, 1500)
      }
    } else {
      syncStatus.errorMsg = res.data.msg || '获取同步状态失败'
      stopPolling()
    }
  }).catch((error) => {
    syncStatus.errorMsg = error.message || '获取同步状态出错'
    stopPolling()
  })
}

// 停止轮询
const stopPolling = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  stopPolling()
})

// 将方法暴露给父组件
defineExpose({
  openDialog
})
</script>

<style scoped>
.progress-container {
  padding: 20px 0;
}

.progress-text {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}
</style>