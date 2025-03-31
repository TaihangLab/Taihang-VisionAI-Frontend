<template>
  <div id="CommonChannelEdit" v-loading="loading" style="width: 100%">
    <el-form ref="formRef" status-icon label-width="120px" class="channel-form">
      <div class="form-box">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input v-model="form.gbName" placeholder="请输入通道名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="警区">
              <el-input placeholder="请输入警区" v-model="form.police"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务分组编号">
              <el-input placeholder="请输入业务分组编号" v-model="form.businessGroupId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="编码">
              <el-input v-model="form.gbDeviceId" placeholder="请输入通道编码">
                <template #append>
                  <el-button @click="buildDeviceIdCode(form.gbDeviceId)">生成</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备归属">
              <el-input placeholder="Owner" v-model="form.owner"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="位置类型">
              <el-select v-model="form.locationType" style="width: 100%" placeholder="请选择位置类型">
                <el-option label="未知" value=""></el-option>
                <el-option label="室内" value="indoor"></el-option>
                <el-option label="室外" value="outdoor"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="设备厂商">
              <el-input v-model="form.gbManufacturer" placeholder="请输入设备厂商"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="信令安全模式">
              <el-select v-model="form.securityMode" style="width: 100%" placeholder="请选择安全模式">
                <el-option label="不采用" value="none"></el-option>
                <el-option label="携带签名" value="signed"></el-option>
                <el-option label="携带摘要" value="digest"></el-option>
                <el-option label="加密" value="encrypted"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="室内/室外">
              <el-select v-model="form.inOutDoor" style="width: 100%" placeholder="请选择室内/室外">
                <el-option label="未知" value=""></el-option>
                <el-option label="室内" value="indoor"></el-option>
                <el-option label="室外" value="outdoor"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="设备型号">
              <el-input v-model="form.gbModel" placeholder="请输入设备型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册方式">
              <el-select v-model="form.registerMode" style="width: 100%" placeholder="请选择注册方式">
                <el-option label="IETFRFC3261标准" value="IETFRFC3261"></el-option>
                <el-option label="基于口令" value="password"></el-option>
                <el-option label="基于用户" value="user"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用途">
              <el-input placeholder="请选择用途" v-model="form.purpose"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="行政区域">
              <el-input v-model="form.administrativeArea" placeholder="请输入行政区域">
                <template #append>
                  <el-button>选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证书序列号">
              <el-input placeholder="请输入证书序列号" v-model="form.certNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="补光">
              <el-select v-model="form.fillLight" style="width: 100%" placeholder="请选择补光方式">
                <el-option label="无" value=""></el-option>
                <el-option label="红外" value="infrared"></el-option>
                <el-option label="白光" value="white"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="安装地址">
              <el-input v-model="form.address" placeholder="请输入安装地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证书有效标识">
              <el-select v-model="form.certValid" style="width: 100%" placeholder="请选择证书有效标识">
                <el-option label="无效" value="invalid"></el-option>
                <el-option label="有效" value="valid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="监视方位">
              <el-select v-model="form.monitoringDirection" style="width: 100%" placeholder="请选择监视方位">
                <el-option label="未知" value=""></el-option>
                <el-option label="东" value="east"></el-option>
                <el-option label="南" value="south"></el-option>
                <el-option label="西" value="west"></el-option>
                <el-option label="北" value="north"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="子设备">
              <el-select v-model="form.gbParental" style="width: 100%" placeholder="请选择是否有子设备">
                <el-option label="无" :value="0"></el-option>
                <el-option label="有" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="无效原因码">
              <el-input placeholder="请输入无效原因码" v-model="form.invalidCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分辨率">
              <el-input placeholder="请输入分辨率" v-model="form.resolution"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="设备状态">
              <el-select v-model="form.gbStatus" style="width: 100%" placeholder="请选择设备状态">
                <el-option label="在线" value="ON"></el-option>
                <el-option label="离线" value="OFF"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证书终止有效期">
              <el-date-picker
                v-model="form.certExpire"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下载倍速">
              <el-select v-model="form.downloadSpeed" style="width: 100%" placeholder="请选择下载倍速">
                <el-option label="1倍速" value="1"></el-option>
                <el-option label="2倍速" value="2"></el-option>
                <el-option label="4倍速" value="4"></el-option>
                <el-option label="8倍速" value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="保密属性">
              <el-select v-model="form.secrecyLevel" style="width: 100%" placeholder="请选择保密属性">
                <el-option label="不涉密" value="none"></el-option>
                <el-option label="涉密" value="secret"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="空域编解能力">
              <el-input placeholder="请输入空域编解能力" v-model="form.spatialCodingAbility"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="经度">
              <el-input v-model="form.gbLongitude" placeholder="请输入经度"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IP地址">
              <el-input placeholder="请输入IP地址" v-model="form.ipAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时域编解能力">
              <el-input placeholder="请输入时域编解能力" v-model="form.temporalCodingAbility"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="纬度">
              <el-input v-model="form.gbLatitude" placeholder="请输入纬度"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="端口">
              <el-input placeholder="请输入端口" v-model="form.port"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="云台类型">
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
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备口令">
              <el-input placeholder="请输入设备口令" v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="云台类型">
              <el-select v-model="form.cloudPlatformType" style="width: 100%" placeholder="请选择云台类型">
                <el-option label="未知" value=""></el-option>
                <el-option label="类型1" value="type1"></el-option>
                <el-option label="类型2" value="type2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="text-align: right; margin-top: 20px;">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="cancelSubmit">取消</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { useRoute } from 'vue-router'

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

// 获取路由
const route = useRoute()

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
const apiAvailable = ref(true) // 添加API可用性标志
const deviceId = ref('') // 添加设备ID变量
const form = ref<{
  // 基本属性
  gbName: string;
  gbDeviceId: string;
  gbManufacturer: string;
  gbModel: string;
  gbParental: number;
  gbStatus: string;
  gbLongitude: string;
  gbLatitude: string;
  gbPtzType: number;
  
  // 保存原始ID
  id?: number | string;
  
  // 新增属性
  police: string;
  businessGroupId: string;
  owner: string;
  locationType: string;
  securityMode: string;
  inOutDoor: string;
  registerMode: string;
  purpose: string;
  administrativeArea: string;
  certNum: string;
  fillLight: string;
  address: string;
  certValid: string;
  monitoringDirection: string;
  invalidCode: string;
  resolution: string;
  certExpire: string | Date;
  downloadSpeed: string;
  secrecyLevel: string;
  spatialCodingAbility: string;
  ipAddress: string;
  temporalCodingAbility: string;
  port: string;
  password: string;
  cloudPlatformType: string;
}>({
  // 基本属性
  gbName: '',
  gbDeviceId: '',
  gbManufacturer: '',
  gbModel: '',
  gbParental: 0,
  gbStatus: 'ON',
  gbLongitude: '',
  gbLatitude: '',
  gbPtzType: 1,
  
  // 新增属性
  police: '',
  businessGroupId: '',
  owner: '',
  locationType: '',
  securityMode: 'none',
  inOutDoor: '',
  registerMode: 'IETFRFC3261',
  purpose: '',
  administrativeArea: '',
  certNum: '',
  fillLight: '',
  address: '',
  certValid: '',
  monitoringDirection: '',
  invalidCode: '',
  resolution: '',
  certExpire: '',
  downloadSpeed: '1',
  secrecyLevel: 'none',
  spatialCodingAbility: '',
  ipAddress: '',
  temporalCodingAbility: '',
  port: '5060',
  password: '',
  cloudPlatformType: ''
})

// 生命周期钩子
onMounted(() => {
  console.log('通道编辑组件初始化，ID:', props.id)
  
  // 首先尝试从localStorage获取已有通道数据
  const channelDataStr = window.localStorage.getItem('currentChannelData')
  if (channelDataStr) {
    try {
      const channelData = JSON.parse(channelDataStr)
      console.log('从localStorage获取通道数据:', channelData)
      // 转换数据字段到表单需要的格式
      mapChannelDataToForm(channelData)
      loading.value = false
      return
    } catch (e) {
      console.error('解析localStorage中的通道数据失败:', e)
    }
  }
  
  // 从id中解析设备ID
  if (props.id) {
    // 尝试从id中解析设备ID（如果ID格式是 "deviceId_channelId"）
    if (typeof props.id === 'string' && props.id.includes('_')) {
      const parts = props.id.toString().split('_')
      deviceId.value = parts[0]
      console.log('从通道ID中解析出设备ID:', deviceId.value)
    } else if (route?.params?.deviceId) {
      // 从路由参数获取设备ID
      deviceId.value = String(route.params.deviceId)
      console.log('从路由获取设备ID:', deviceId.value)
    } else {
      // 尝试从ChannelList中获取当前设备ID
      const channelListDeviceId = window.localStorage.getItem('currentDeviceId')
      if (channelListDeviceId) {
        deviceId.value = channelListDeviceId
        console.log('从localStorage获取设备ID:', deviceId.value)
      } else {
        ElMessage.error({
          showClose: true,
          message: '无法确定设备ID，请返回通道列表重试'
        })
        console.error('无法确定设备ID，编辑功能可能无法正常工作')
        if (props.cancel) {
          props.cancel()
        }
        return
      }
    }
    
    // 获取通道信息
    getChannelInfo()
  } else if (props.dataForm) {
    // 如果直接传入了数据，则使用这些数据
    mapChannelDataToForm(props.dataForm)
  }
})

// 字段映射函数 - 将API返回的数据映射到表单字段
const mapChannelDataToForm = (channelData) => {
  // 创建一个映射后的对象
  const mappedData = {
    // 基本属性 - 首先尝试使用gb前缀的字段，若不存在则使用无前缀字段
    gbName: channelData.gbName || channelData.name || '',
    gbDeviceId: channelData.gbDeviceId || channelData.deviceId || '',
    gbManufacturer: channelData.gbManufacturer || channelData.manufacturer || '',
    gbModel: channelData.gbModel || channelData.model || '',
    gbParental: channelData.gbParental !== null ? channelData.gbParental : channelData.parental || 0,
    gbStatus: channelData.gbStatus || channelData.status || 'ON',
    gbLongitude: channelData.gbLongitude || channelData.longitude || '',
    gbLatitude: channelData.gbLatitude || channelData.latitude || '',
    gbPtzType: Number(channelData.gbPtzType) || Number(channelData.ptzType) || 1,
    
    // 保存原始ID，用于提交表单时
    id: channelData.id,
    
    // 其它属性映射
    police: channelData.police || '',
    businessGroupId: channelData.gbBusinessGroupId || channelData.businessGroupId || '',
    owner: channelData.gbOwner || channelData.owner || '',
    locationType: channelData.locationType || '',
    securityMode: channelData.gbSafetyWay !== null ? String(channelData.gbSafetyWay) : 'none',
    inOutDoor: channelData.inOutDoor || '',
    registerMode: channelData.gbRegisterWay !== null ? mapRegisterWay(channelData.gbRegisterWay || channelData.registerWay) : 'IETFRFC3261',
    purpose: channelData.purpose || channelData.gbUseType || channelData.useType || '',
    administrativeArea: channelData.administrativeArea || channelData.gbCivilCode || channelData.civilCode || '',
    certNum: channelData.gbCertNum || channelData.certNum || '',
    fillLight: channelData.gbSupplyLightType || channelData.supplyLightType || '',
    address: channelData.gbAddress || channelData.address || '',
    certValid: channelData.certValid || '',
    monitoringDirection: channelData.gbDirectionType || channelData.directionType || '',
    invalidCode: channelData.gbErrCode || channelData.errCode || '',
    resolution: channelData.gbResolution || channelData.resolution || '',
    certExpire: channelData.gbEndTime || channelData.endTime || '',
    downloadSpeed: channelData.gbDownloadSpeed || channelData.downloadSpeed || '1',
    secrecyLevel: mapSecrecyLevel(channelData.gbSecrecy || channelData.secrecy),
    spatialCodingAbility: channelData.gbSvcSpaceSupportMod || channelData.svcSpaceSupportMod || '',
    ipAddress: channelData.gbIpAddress || channelData.ipAddress || '',
    temporalCodingAbility: channelData.gbSvcTimeSupportMode || channelData.svcTimeSupportMode || '',
    port: channelData.gbPort || channelData.port || '5060',
    password: channelData.gbPassword || channelData.password || '',
    cloudPlatformType: ''
  };
  
  // 更新表单
  form.value = mappedData;
  console.log('映射后的表单数据:', form.value);
}

// 注册方式映射函数
const mapRegisterWay = (registerWay) => {
  const map = {
    1: 'IETFRFC3261',
    2: 'password',
    3: 'user'
  };
  if (typeof registerWay === 'number' || !isNaN(Number(registerWay))) {
    return map[Number(registerWay)] || 'IETFRFC3261';
  }
  return registerWay || 'IETFRFC3261';
}

// 保密属性映射函数
const mapSecrecyLevel = (secrecy) => {
  if (secrecy === 0 || secrecy === '0') {
    return 'none';
  } else if (secrecy === 1 || secrecy === '1') {
    return 'secret';
  }
  return 'none';
}

// 获取通道信息
const getChannelInfo = () => {
  loading.value = true
  console.log('获取通道信息，ID:', props.id)
  
  // 显示加载消息
  ElMessage({
    showClose: false,
    message: '正在加载通道信息...',
    type: 'info',
    duration: 2000
  })
  
  // 使用通道列表API作为主要数据源
  axios({
    method: 'get',
    url: `/api/device/query/devices/${deviceId.value}/channels`,
    params: {
      page: 1,
      count: 1000, // 获取所有通道，以确保能找到目标通道
    },
    timeout: 10000
  }).then((res) => {
    if (res.data.code === 0) {
      // 在返回的列表中查找匹配ID的通道
      const channelList = res.data.data.list || [];
      const channel = channelList.find(item => item.id === props.id);
      
      if (channel) {
        // 找到匹配的通道，映射字段
        mapChannelDataToForm(channel);
        loading.value = false;
      } else {
        // 未找到匹配的通道，尝试单独获取
        console.warn('在通道列表中未找到ID为', props.id, '的通道，尝试单独获取');
        getSingleChannel();
      }
    } else {
      console.warn('获取通道列表返回错误码:', res.data.code, res.data.msg);
      ElMessage.error({
        showClose: true,
        message: res.data.msg || '获取通道信息失败'
      });
      // 尝试单独获取
      getSingleChannel();
    }
  }).catch((error) => {
    console.error('获取通道列表失败:', error);
    showApiError(getErrorMessage(error));
    // 尝试单独获取
    getSingleChannel();
  });
}

// 尝试单独获取通道
const getSingleChannel = () => {
  console.log('尝试单独获取通道，ID:', props.id);
  
  // 尝试不同的API端点
  const tryEndpointQueries = [
    // 第一个尝试: 直接查询通道接口
    () => axios({
      method: 'get',
      url: `/api/device/query/channel`,
      params: { id: props.id },
      timeout: 10000
    }),
    // 第二个尝试: 通过设备和通道ID查询
    () => {
      // 如果ID包含下划线，可能是deviceId_channelId格式
      if (typeof props.id === 'string' && props.id.includes('_')) {
        const [deviceId, channelId] = props.id.split('_');
        return axios({
          method: 'get',
          url: `/api/device/query/channels/${deviceId}/${channelId}`,
          timeout: 10000
        });
      }
      return Promise.reject(new Error('无法解析通道ID格式'));
    },
    // 第三个尝试: 通过通道ID查询
    () => axios({
      method: 'get',
      url: `/api/device/query/channel/${props.id}`,
      timeout: 10000
    })
  ];
  
  // 执行查询尝试
  const executeQueries = async () => {
    for (let i = 0; i < tryEndpointQueries.length; i++) {
      try {
        console.log(`尝试获取通道信息方法 #${i+1}`);
        const res = await tryEndpointQueries[i]();
        
        if (res.data.code === 0 && res.data.data) {
          // 使用字段映射函数处理数据
          mapChannelDataToForm(res.data.data);
          console.log(`成功通过方法 #${i+1} 获取通道信息:`, form.value);
          loading.value = false;
          return true;
        }
        console.warn(`方法 #${i+1} 返回错误码:`, res.data.code, res.data.msg);
      } catch (error) {
        console.error(`方法 #${i+1} 失败:`, error);
      }
    }
    return false;
  };
  
  executeQueries().then(success => {
    if (!success) {
      showApiError('尝试了所有可能的API端点，但无法获取通道信息');
      loading.value = false;
    }
  });
}

// 获取格式化的错误信息
const getErrorMessage = (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 404) {
      return `通道不存在或API端点无效 (404)`;
    } else if (status === 401 || status === 403) {
      return `无权限访问此通道 (${status})`;
    }
    return `服务器错误 (${status})`;
  } else if (error.request) {
    return '无法连接到服务器，请检查网络连接';
  } else if (error.message) {
    return error.message;
  }
  return '未知错误';
}

// 显示API错误
const showApiError = (message) => {
  ElMessage.error({
    showClose: true,
    message: '获取通道信息失败: ' + message,
    duration: 5000
  });
  
  // 如果有取消回调，则延迟关闭
  if (props.cancel) {
    setTimeout(() => {
      props.cancel();
    }, 2000);
  }
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
  if (!form.value || Object.keys(form.value).length === 0) {
    ElMessage.error({
      showClose: true,
      message: '无通道数据可保存'
    });
    return;
  }
  
  // 表单验证
  if (!form.value.gbName?.trim()) {
    ElMessage.warning({
      showClose: true,
      message: '请输入通道名称'
    });
    return;
  }
  
  if (!form.value.gbDeviceId?.trim()) {
    ElMessage.warning({
      showClose: true,
      message: '请输入通道编码'
    });
    return;
  }
  
  loading.value = true
  
  // 准备提交数据 - 构建API需要的格式
  const submitData = {
    ...form.value,
    id: form.value.id, // 确保ID正确传递
    // 确保数值字段是数值类型
    gbParental: Number(form.value.gbParental),
    gbPtzType: Number(form.value.gbPtzType)
  };
  
  // 显示加载消息
  ElMessage({
    showClose: false,
    message: '正在保存通道信息...',
    type: 'info',
    duration: 2000
  })
  
  console.log('提交的通道数据:', submitData);
  
  // 根据是否有ID决定是新增还是更新
  if (submitData.id) {
    // 更新通道
    axios({
      method: 'post',
      url: `/api/common/channel/update`,
      data: {
        id: submitData.id,
        gbName: submitData.gbName,
        gbDeviceId: submitData.gbDeviceId,
        gbManufacturer: submitData.gbManufacturer,
        gbModel: submitData.gbModel,
        gbParental: Number(submitData.gbParental),
        gbStatus: submitData.gbStatus,
        gbLongitude: submitData.gbLongitude,
        gbLatitude: submitData.gbLatitude,
        gbPtzType: Number(submitData.gbPtzType),
        police: submitData.police,
        businessGroupId: submitData.businessGroupId,
        owner: submitData.owner,
        locationType: submitData.locationType,
        securityMode: submitData.securityMode,
        inOutDoor: submitData.inOutDoor,
        registerMode: submitData.registerMode,
        purpose: submitData.purpose,
        administrativeArea: submitData.administrativeArea,
        certNum: submitData.certNum,
        fillLight: submitData.fillLight,
        address: submitData.address,
        certValid: submitData.certValid,
        monitoringDirection: submitData.monitoringDirection,
        invalidCode: submitData.invalidCode,
        resolution: submitData.resolution,
        certExpire: submitData.certExpire,
        downloadSpeed: submitData.downloadSpeed,
        secrecyLevel: submitData.secrecyLevel,
        spatialCodingAbility: submitData.spatialCodingAbility,
        ipAddress: submitData.ipAddress,
        temporalCodingAbility: submitData.temporalCodingAbility,
        port: submitData.port,
        password: submitData.password,
        cloudPlatformType: submitData.cloudPlatformType
      },
      timeout: 10000
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: '保存成功'
        });
        if (props.saveSuccess) {
          props.saveSuccess();
        }
      } else {
        ElMessage.error({
          showClose: true,
          message: res.data.msg || '保存失败'
        });
      }
    }).catch((error) => {
      console.error('保存通道失败:', error);
      ElMessage.error({
        showClose: true,
        message: '保存失败: ' + (error.message || '未知错误')
      });
    }).finally(() => {
      loading.value = false;
    });
  } else {
    // 新增通道
    axios({
      method: 'post',
      url: `/api/common/channel/add`,
      data: submitData,
      timeout: 10000
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success({
          showClose: true,
          message: '保存成功'
        });
        form.value = res.data.data;
        if (props.saveSuccess) {
          props.saveSuccess();
        }
      } else {
        ElMessage.error({
          showClose: true,
          message: res.data.msg || '保存失败'
        });
      }
    }).catch((error) => {
      console.error('保存通道失败:', error);
      ElMessage.error({
        showClose: true,
        message: '保存失败: ' + (error.message || '未知错误')
      });
    }).finally(() => {
      loading.value = false;
    });
  }
}

// 取消
const cancelSubmit = () => {
  if (props.cancel) {
    props.cancel()
  }
}

// 重置表单
const resetForm = () => {
  ElMessageBox.confirm('确定重置为默认内容?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true;
    
    // 如果是编辑模式，调用重置API
    if (props.id) {
      axios({
        method: 'post',
        url: `/api/common/channel/reset`,
        params: {
          id: props.id
        },
        timeout: 10000
      }).then((res) => {
        if (res.data.code === 0) {
          ElMessage.success({
            showClose: true,
            message: '重置成功'
          });
          // 重新获取通道信息
          getChannelInfo();
        } else {
          ElMessage.error({
            showClose: true,
            message: res.data.msg || '重置失败'
          });
        }
      }).catch((error) => {
        console.error('重置通道失败:', error);
        ElMessage.error({
          showClose: true,
          message: '重置失败: ' + (error.message || '未知错误')
        });
      }).finally(() => {
        loading.value = false;
      });
    } else {
      // 如果是新增模式，直接重置表单
      formRef.value?.resetFields();
      ElMessage.success({
        showClose: true,
        message: '表单已重置'
      });
    }
  }).catch(() => {
    // 用户取消重置操作
  });
}
</script>

<style scoped>
.channel-form {
  padding: 20px;
  background-color: #fff;
}

.form-box {
  width: 100%;
  margin: 0 auto;
}

:deep(.el-form-item__label) {
  font-weight: normal;
  color: #606266;
}

:deep(.el-input__inner) {
  font-size: 14px;
}

:deep(.el-input.is-disabled .el-input__inner) {
  color: #909399;
}
</style> 