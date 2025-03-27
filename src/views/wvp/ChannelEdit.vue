<template>
  <div id="ChannelEdit" v-loading="loading" style="width: 100%">
    <div class="page-header">
      <div class="page-title">
        <el-page-header @back="close" content="编辑通道"></el-page-header>
      </div>
      <div class="page-header-btn">
        <div style="display: inline;">
          <el-button :icon="Close" size="small" style="font-size: 20px; color: #000;" type="text" @click="close"></el-button>
        </div>
      </div>
    </div>
    <CommonChannelEdit ref="commonChannelEditRef" :id="id" :saveSuccess="close" :cancel="close"></CommonChannelEdit>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'
import CommonChannelEdit from './common/CommonChannelEdit.vue'

// 定义props
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  closeEdit: {
    type: Function,
    required: true
  }
})

// 引用组件
const commonChannelEditRef = ref()
const loading = ref(false)

// 关闭编辑
const close = () => {
  props.closeEdit()
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
}

.page-header-btn {
  display: flex;
  align-items: center;
}
</style> 