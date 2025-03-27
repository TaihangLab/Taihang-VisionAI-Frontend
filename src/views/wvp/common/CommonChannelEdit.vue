<template>
  <div id="CommonChannelEdit" v-loading="loading" style="width: 100%">
    <el-form ref="formRef" status-icon label-width="160px" class="channel-form">
      <div class="form-box">
        <el-form-item label="名称" >
          <el-input v-model="form.gbName" placeholder="请输入通道名称"></el-input>
        </el-form-item>
        <el-form-item label="编码" >
          <el-input v-model="form.gbDeviceId" placeholder="请输入通道编码">
            <template #append>
              <el-button @click="buildDeviceIdCode(form.gbDeviceId)">生成</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="设备厂商" >
          <el-input v-model="form.gbManufacturer" placeholder="请输入设备厂商"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" >
          <el-input v-model="form.gbModel" placeholder="请输入设备型号"></el-input>
        </el-form-item>

        <el-form-item label="子设备" >
          <el-select v-model="form.gbParental" style="width: 100%" placeholder="请选择是否有子设备">
            <el-option label="有" :value="1"></el-option>
            <el-option label="无" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" >
          <el-select v-model="form.gbStatus" style="width: 100%" placeholder="请选择设备状态">
            <el-option label="在线" value="ON"></el-option>
            <el-option label="离线" value="OFF"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度" >
          <el-input v-model="form.gbLongitude" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度" >
          <el-input v-model="form.gbLatitude" placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item label="云台类型" >
          <el-select v-model="form.gbPtzType" style="width: 100%" placeholder="请选择云台类型">
            <el-option label="球机" :value="1"></el-option>
            <el-option label="半球" :value="2"></el-option>
            <el-option label="固定枪机" :value="3"></el-option>
            <el-option label="遥控枪机" :value="4"></el-option>
            <el-option label="遥控半球" :value="5"></el-option>
            <el-option label="多目设备的全景/拼接通道" :value="6"></el-option>
            <el-option label="多目设备的分割通道" :value="7"></el-option>
          </el-select>
        </el-form-item>
        <div style="text-align: right;">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button v-if="cancel" @click="cancelSubmit">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 配置axios默认地址
axios.defaults.baseURL = 'http://192.168.1.107:18080'

// 定义props
const props = defineProps({
  id: {
    type: [String, Number],
    required: false
  },
  dataForm: {
    type: Object,
    default: () => ({})
  },
  saveSuccess: {
    type: Function,
    default: null
  },
  cancel: {
    type: Function,
    default: null
  }
})

// 状态
const formRef = ref()
const loading = ref(false)
const form = ref({
  gbName: '',
  gbDeviceId: '',
  gbManufacturer: '',
  gbModel: '',
  gbParental: 0,
  gbStatus: 'ON',
  gbLongitude: '',
  gbLatitude: '',
  gbPtzType: 1
})

// 生命周期钩子
onMounted(() => {
  // 获取完整信息
  if (props.id) {
    getChannelInfo()
  } else if (props.dataForm) {
    form.value = { ...props.dataForm } as typeof form.value
  }
})

// 获取通道信息
const getChannelInfo = () => {
  loading.value = true
  axios({
    method: 'get',
    url: `/api/device/query/channel/${props.id}`
  }).then((res) => {
    if (res.data.code === 0) {
      form.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || '获取通道信息失败')
    }
    loading.value = false
  }).catch((error) => {
    console.error(error)
    ElMessage.error('获取通道信息失败')
    loading.value = false
  })
}

// 生成设备ID编码
const buildDeviceIdCode = (prefix) => {
  if (!prefix) {
    ElMessage.warning('请先输入前缀')
    return
  }
  
  // 简单实现：添加随机数
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  form.value.gbDeviceId = prefix + random
}

// 提交表单
const onSubmit = () => {
  loading.value = true
  
  const submitData = { ...form.value }
  
  axios({
    method: 'post',
    url: `/api/device/query/channel/update`,
    data: submitData
  }).then((res) => {
    if (res.data.code === 0) {
      ElMessage.success('保存成功')
      if (props.saveSuccess) {
        props.saveSuccess()
      }
    } else {
      ElMessage.error(res.data.msg || '保存失败')
    }
    loading.value = false
  }).catch((error) => {
    console.error(error)
    ElMessage.error('保存失败')
    loading.value = false
  })
}

// 取消
const cancelSubmit = () => {
  if (props.cancel) {
    props.cancel()
  }
}
</script>

<style scoped>
.channel-form {
  padding: 20px;
  background-color: #fff;
}

.form-box {
  max-width: 800px;
  margin: 0 auto;
}
</style> 