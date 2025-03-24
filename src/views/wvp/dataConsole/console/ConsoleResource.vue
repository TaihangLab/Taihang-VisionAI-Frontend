<template>
  <div id="ConsoleResource" style="width: 100%; height: 100%; background: #FFFFFF; text-align: center">
    <div class="resource-container">
      <div class="resource-row">
        <div class="resource-item">
          <div class="circle-progress">
            <el-progress type="circle" :percentage="100" :width="110" :stroke-width="10" :color="'#1890ff'" :format="() => '100%'" style="font-size: 24px; font-weight: normal; color: #666;"></el-progress>
          </div>
          <div class="resource-text">
            <div>设备总数:{{data.device.total}}</div>
            <div>在线数:{{data.device.online}}</div>
          </div>
        </div>
        <div class="resource-item">
          <div class="circle-progress">
            <el-progress type="circle" :percentage="100" :width="110" :stroke-width="10" :color="'#1890ff'" :format="() => '100%'" style="font-size: 24px; font-weight: normal; color: #666;"></el-progress>
          </div>
          <div class="resource-text">
            <div>通道总数:{{data.channel.total}}</div>
            <div>在线数:{{data.channel.online}}</div>
          </div>
        </div>
      </div>
      <div class="resource-row">
        <div class="resource-item">
          <div class="circle-progress">
            <el-progress type="circle" :percentage="0" :width="110" :stroke-width="10" :color="'#E5E7EB'" :format="() => '0%'" style="font-size: 24px; font-weight: normal; color: #999;"></el-progress>
          </div>
          <div class="resource-text">
            <div>推流总数:{{data.push.total}}</div>
            <div>在线数:{{data.push.online}}</div>
          </div>
        </div>
        <div class="resource-item">
          <div class="circle-progress">
            <el-progress type="circle" :percentage="0" :width="110" :stroke-width="10" :color="'#E5E7EB'" :format="() => '0%'" style="font-size: 24px; font-weight: normal; color: #999;"></el-progress>
          </div>
          <div class="resource-text">
            <div>拉流代理总数:{{data.proxy.total}}</div>
            <div>在线数:{{data.proxy.online}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 定义资源数据结构
interface ResourceData {
  device: {
    total: number;
    online: number;
  };
  channel: {
    total: number;
    online: number;
  };
  push: {
    total: number;
    online: number;
  };
  proxy: {
    total: number;
    online: number;
  };
}

// 初始化数据
const data = reactive<ResourceData>({
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
})

// 计算百分比
const devicePercent = computed(() => {
  return data.device.total > 0 ? Math.floor(data.device.online / data.device.total * 100) : 0;
});

const channelPercent = computed(() => {
  return data.channel.total > 0 ? Math.floor(data.channel.online / data.channel.total * 100) : 0;
});

const pushPercent = computed(() => {
  return data.push.total > 0 ? Math.floor(data.push.online / data.push.total * 100) : 0;
});

const proxyPercent = computed(() => {
  return data.proxy.total > 0 ? Math.floor(data.proxy.online / data.proxy.total * 100) : 0;
});

// 设置数据方法（供父组件调用）
const setData = (newData: any) => {
  try {
    if (!newData || typeof newData !== 'object') {
      console.warn('资源数据无效:', newData)
      return
    }
    
    // 克隆数据以避免引用问题
    const safeData = JSON.parse(JSON.stringify(newData))
    
    // 处理设备数据
    if (safeData.device && typeof safeData.device === 'object') {
      data.device.total = typeof safeData.device.total === 'number' ? safeData.device.total : 0
      data.device.online = typeof safeData.device.online === 'number' ? safeData.device.online : 0
    } else {
      data.device.total = 0
      data.device.online = 0
    }
    
    // 处理通道数据
    if (safeData.channel && typeof safeData.channel === 'object') {
      data.channel.total = typeof safeData.channel.total === 'number' ? safeData.channel.total : 0
      data.channel.online = typeof safeData.channel.online === 'number' ? safeData.channel.online : 0
    } else {
      data.channel.total = 0
      data.channel.online = 0
    }
    
    // 处理推流数据
    if (safeData.push && typeof safeData.push === 'object') {
      data.push.total = typeof safeData.push.total === 'number' ? safeData.push.total : 0
      data.push.online = typeof safeData.push.online === 'number' ? safeData.push.online : 0
    } else {
      data.push.total = 0
      data.push.online = 0
    }
    
    // 处理代理数据
    if (safeData.proxy && typeof safeData.proxy === 'object') {
      data.proxy.total = typeof safeData.proxy.total === 'number' ? safeData.proxy.total : 0
      data.proxy.online = typeof safeData.proxy.online === 'number' ? safeData.proxy.online : 0
    } else {
      data.proxy.total = 0
      data.proxy.online = 0
    }
  } catch (error) {
    console.error('处理资源数据出错:', error)
  }
}

// 暴露方法给父组件
defineExpose({
  setData
})
</script>

<style scoped>
#ConsoleResource {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.resource-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.resource-row {
  display: flex;
  flex: 1;
  width: 100%;
}

.resource-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.circle-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.resource-text {
  margin-top: 3px;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  text-align: center;
}

/* 覆盖Element Plus进度条样式 */
:deep(.el-progress__text) {
  font-size: 18px !important;
  font-weight: normal !important;
  font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
}

:deep(.el-progress-circle__track) {
  stroke: #e5e9f2 !important;
}
</style>
