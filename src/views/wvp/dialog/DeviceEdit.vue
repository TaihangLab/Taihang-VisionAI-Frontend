<template>
  <el-dialog
    v-model="dialogVisible"
    :title="device ? '编辑设备' : '添加设备'"
    width="40%"
    :close-on-click-modal="false"
    :before-close="close">
    <el-form :model="device" :rules="rules" ref="deviceFormRef" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="device.name" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备编号" prop="deviceId">
        <el-input v-model="device.deviceId" placeholder="请输入设备编号" :disabled="!!device.id"></el-input>
      </el-form-item>
      <el-form-item label="传输协议" prop="transport">
        <el-select v-model="device.transport" placeholder="请选择传输协议" style="width: 100%">
          <el-option label="UDP" value="UDP"></el-option>
          <el-option label="TCP" value="TCP"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="厂家" prop="manufacturer">
        <el-input v-model="device.manufacturer" placeholder="请输入厂家"></el-input>
      </el-form-item>
      <el-form-item label="IP地址" prop="hostAddress">
        <el-input v-model="device.hostAddress" placeholder="请输入IP地址"></el-input>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input-number v-model="device.port" :min="1" :max="65535" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="注册密码" prop="password">
        <el-input v-model="device.password" placeholder="请输入注册密码"></el-input>
      </el-form-item>
      <el-form-item label="字符集" prop="charset">
        <el-select v-model="device.charset" placeholder="请选择字符集" style="width: 100%">
          <el-option label="GB2312" value="GB2312"></el-option>
          <el-option label="UTF-8" value="UTF-8"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="save" :loading="saveLoading">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 配置axios默认地址
axios.defaults.baseURL = 'http://192.168.1.107:18080'

// 定义组件的事件
const emit = defineEmits(['refresh'])

// 对话框相关
const dialogVisible = ref(false)
const saveLoading = ref(false)

// 设备表单和验证规则
const device = reactive({
  id: '',
  name: '',
  deviceId: '',
  transport: 'UDP',
  manufacturer: '',
  hostAddress: '',
  port: 5060,
  password: '',
  charset: 'GB2312'
})

const deviceFormRef = ref()
const rules = {
  name: [
    { required: true, message: '请输入设备名称', trigger: 'blur' }
  ],
  deviceId: [
    { required: true, message: '请输入设备编号', trigger: 'blur' }
  ],
  transport: [
    { required: true, message: '请选择传输协议', trigger: 'change' }
  ],
  hostAddress: [
    { required: true, message: '请输入IP地址', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口', trigger: 'blur' }
  ],
  charset: [
    { required: true, message: '请选择字符集', trigger: 'change' }
  ]
}

// 打开对话框方法
const openDialog = (deviceData, callback) => {
  dialogVisible.value = true
  
  console.log('接收到的设备数据:', deviceData)
  
  // 重置表单
  Object.keys(device).forEach(key => {
    device[key] = deviceData && deviceData[key] !== undefined ? deviceData[key] : (
      key === 'transport' ? 'UDP' : 
      key === 'port' ? 5060 : 
      key === 'charset' ? 'GB2312' : 
      ''
    )
  })
  
  // 确保端口是数字类型
  if (typeof device.port !== 'number') {
    device.port = parseInt(device.port) || 5060
  }
  
  // 保存回调函数
  saveCallback.value = callback
}

// 保存回调函数
const saveCallback = ref(null)

// 关闭对话框
const close = () => {
  dialogVisible.value = false
}

// 保存设备
const save = () => {
  deviceFormRef.value.validate((valid) => {
    if (valid) {
      saveLoading.value = true
      
      // 打印提交的数据用于调试
      console.log('提交设备数据:', device)
      
      // 准备要提交的数据
      const submitData = { ...device } as any
      
      // 确保端口是数字类型
      if (typeof submitData.port !== 'number') {
        submitData.port = parseInt(submitData.port)
      }
      
      // 处理ID字段
      if (!submitData.id || submitData.id === '') {
        delete submitData.id
      }
      
      // 移除其他可能导致问题的字段
      delete submitData.onLine
      delete submitData.channelCount
      delete submitData.subscribeCycleForCatalog
      delete submitData.subscribeCycleForMobilePosition
      delete submitData.subscribeCycleForAlarm
      delete submitData.createTime
      delete submitData.updateTime
      
      // 参考web_src的接口路径
      const isEdit = !!device.id
      // 使用更兼容的接口
      const url = `/api/device/query/device/${isEdit ? 'update' : 'add'}/`
      
      console.log('请求URL:', url)
      console.log('提交数据:', submitData)
      
      axios({
        method: 'post',
        url: url,
        params: submitData, // 使用params而不是data，与参考代码一致
      }).then((res) => {
        console.log('设备保存响应:', res.data)
        if (res.data.code === 0) {
          if (saveCallback.value) {
            saveCallback.value()
          }
          // 触发刷新事件
          emit('refresh')
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg || '保存失败',
            type: 'error'
          })
        }
        saveLoading.value = false
      }).catch((error) => {
        console.error('设备保存错误:', error)
        console.error('错误响应:', error.response?.data)
        
        // 显示更详细的错误信息
        let errorMsg = '保存请求失败'
        if (error.response && error.response.data) {
          errorMsg = error.response.data.msg || errorMsg
        } else if (error.message) {
          errorMsg = error.message
        }
        
        ElMessage({
          showClose: true,
          message: errorMsg,
          type: 'error'
        })
        saveLoading.value = false
      })
    }
  })
}

// 将方法暴露给父组件
defineExpose({
  openDialog,
  close
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>