<template>
  <el-dialog
    v-model="dialogVisible"
    title="平台信息"
    width="50%"
    :close-on-click-modal="false"
    :before-close="close">
    <div v-if="platformInfo">
      <el-descriptions title="国标服务信息" :column="2" border v-if="platformInfo.sip">
        <el-descriptions-item label="编号">{{ platformInfo?.sip?.id || '未配置' }}</el-descriptions-item>
        <el-descriptions-item label="域">{{ platformInfo?.sip?.domain || '未配置' }}</el-descriptions-item>
        <el-descriptions-item label="IP">{{ platformInfo?.sip?.host || '未配置' }}</el-descriptions-item>
        <el-descriptions-item label="端口">{{ platformInfo?.sip?.port || '未配置' }}</el-descriptions-item>
        <el-descriptions-item label="密码">
          <el-tag size="small">{{ platformInfo?.sip?.password || '未配置' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="SIP地址">
          {{ getSipAddress() }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="媒体配置" :column="2" border class="margin-top">
        <el-descriptions-item label="媒体IP">
          {{ platformInfo?.media?.ip || '未配置' }}
        </el-descriptions-item>
        <el-descriptions-item label="流媒体端口范围">
          {{ platformInfo?.media?.streamPort?.min || '未配置' }} - {{ platformInfo?.media?.streamPort?.max || '未配置' }}
        </el-descriptions-item>
        <el-descriptions-item label="HTTP端口">
          {{ platformInfo?.media?.httpPort || '未配置' }}
        </el-descriptions-item>
        <el-descriptions-item label="HTTPS端口">
          {{ platformInfo?.media?.httpSSLPort || '未配置' }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="版本信息" :column="2" border class="margin-top" v-if="platformInfo.version">
        <el-descriptions-item label="版本">{{ platformInfo?.version?.version || '未配置' }}</el-descriptions-item>
        <el-descriptions-item label="编译时间">{{ platformInfo?.version?.build_DATE || '未配置' }}</el-descriptions-item>
        <el-descriptions-item label="GIT版本">{{ platformInfo?.version?.git_Revision_SHORT || '未配置' }}</el-descriptions-item>
        <el-descriptions-item label="GIT提交时间">{{ platformInfo?.version?.git_DATE || '未配置' }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-else class="loading-container">
      <el-empty description="暂无平台信息"></el-empty>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

// 配置axios默认地址
axios.defaults.baseURL = 'http://192.168.1.107:18080'

// 对话框相关
const dialogVisible = ref(false)
const platformInfo = ref(null)

// 打开对话框方法
const openDialog = (info) => {
  dialogVisible.value = true
  console.log('平台信息数据:', info)
  platformInfo.value = info
}

// 关闭对话框
const close = () => {
  dialogVisible.value = false
}

// 获取SIP地址
const getSipAddress = () => {
  if (!platformInfo.value || !platformInfo.value.sip) return '未配置'
  const { sip } = platformInfo.value
  return `sip:${sip.id || ''}@${sip.domain || ''}`
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.margin-top {
  margin-top: 20px;
}
</style>