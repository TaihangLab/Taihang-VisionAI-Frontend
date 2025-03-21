<template>
  <div id="ConsoleResource" style="width: 100%; height: 100%; background: #FFFFFF; text-align: center">
    <div class="resource-container">
      <div class="resource-item">
        <el-progress type="circle" :percentage="devicePercent" :width="100" :stroke-width="10" :show-text="false"></el-progress>
        <div class="resource-text">
          <div>设备总数:{{data.device.total}}</div>
          <div>在线数:{{data.device.online}}</div>
        </div>
      </div>
      <div class="resource-item">
        <el-progress type="circle" :percentage="channelPercent" :width="100" :stroke-width="10" :show-text="false"></el-progress>
        <div class="resource-text">
          <div>通道总数:{{data.channel.total}}</div>
          <div>在线数:{{data.channel.online}}</div>
        </div>
      </div>
      <div class="resource-item">
        <el-progress type="circle" :percentage="pushPercent" :width="100" :stroke-width="10" :show-text="false"></el-progress>
        <div class="resource-text">
          <div>推流总数:{{data.push.total}}</div>
          <div>在线数:{{data.push.online}}</div>
        </div>
      </div>
      <div class="resource-item">
        <el-progress type="circle" :percentage="proxyPercent" :width="100" :stroke-width="10" :show-text="false"></el-progress>
        <div class="resource-text">
          <div>代理总数:{{data.proxy.total}}</div>
          <div>在线数:{{data.proxy.online}}</div>
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
    total: 0,
    online: 0
  },
  channel: {
    total: 0,
    online: 0
  },
  push: {
    total: 0,
    online: 0
  },
  proxy: {
    total: 0,
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

// 设置数据的方法，供父组件调用
const setData = (newData: ResourceData) => {
  data.device.total = newData.device.total;
  data.device.online = newData.device.online;
  data.channel.total = newData.channel.total;
  data.channel.online = newData.channel.online;
  data.push.total = newData.push.total;
  data.push.online = newData.push.online;
  data.proxy.total = newData.proxy.total;
  data.proxy.online = newData.proxy.online;
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
  padding: 15px;
  height: 330px;
}

.resource-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  height: 280px;
}

.resource-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.resource-text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #333;
}

:deep(.el-progress__text) {
  font-size: 18px !important;
}

:deep(.el-progress-circle) {
  vertical-align: middle;
}
</style>
