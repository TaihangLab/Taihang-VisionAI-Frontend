<template>
  <div id="devicePlayer" v-loading="loading">
    <el-dialog
      v-model="dialogVisible"
      title="视频播放"
      top="0"
      :close-on-click-modal="false"
      @close="close()"
      width="80%">
      <div style="width: 100%; height: 400px; background-color: #000; display: flex; justify-content: center; align-items: center;">
        <div style="color: #fff; text-align: center;">
          <div style="font-size: 18px; margin-bottom: 10px;">视频加载中...</div>
          <div>视频播放器组件</div>
          <div style="margin-top: 15px" v-if="streamInfo">
            <el-button type="primary" size="small" @click="copyStreamUrl">复制视频流地址</el-button>
          </div>
        </div>
      </div>
      
      <div id="shared" style="text-align: right; margin-top: 1rem;">
        <el-tabs v-model="tabActiveName" @tab-click="tabHandleClick">
          <el-tab-pane label="实时视频" name="media">
            <div style="display: flex; margin-bottom: 0.5rem; height: 2.5rem;">
              <span style="width: 5rem; line-height: 2.5rem; text-align: right;">播放地址：</span>
              <el-input v-model="getPlayerShared.sharedUrl" :disabled="true">
                <template #append>
                  <el-button :icon="DocumentCopy" title="点击拷贝" @click="copyUrl(getPlayerShared.sharedUrl)"></el-button>
                </template>
              </el-input>
            </div>
            <div style="display: flex; margin-bottom: 0.5rem; height: 2.5rem;">
              <span style="width: 5rem; line-height: 2.5rem; text-align: right;">资源地址：</span>
              <el-input v-model="getPlayerShared.sharedRtmp" :disabled="true">
                <template #append>
                  <el-button :icon="DocumentCopy" title="点击拷贝" @click="copyUrl(getPlayerShared.sharedRtmp)"></el-button>
                </template>
                <el-dropdown slot="prepend" v-if="streamInfo" trigger="click" @command="copyUrl">
                  <el-button>
                    更多地址<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-if="streamInfo.flv" :command="streamInfo.flv">
                        <el-tag>FLV:</el-tag>
                        <span>{{ streamInfo.flv }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="streamInfo.rtmp" :command="streamInfo.rtmp">
                        <el-tag>RTMP:</el-tag>
                        <span>{{ streamInfo.rtmp }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="streamInfo.hls" :command="streamInfo.hls">
                        <el-tag>HLS:</el-tag>
                        <span>{{ streamInfo.hls }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-input>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DocumentCopy, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 状态
const dialogVisible = ref(false)
const loading = ref(false)
const tabActiveName = ref('media')
const type = ref('')
const deviceId = ref('')
const channelId = ref('')
const streamInfo = ref(null)
const hasAudio = ref(true)
const videoUrl = ref('')
const videoError = ref('')

// 计算属性
const getPlayerShared = computed(() => {
  let url = '';
  let rtmp = '';
  
  if (streamInfo.value) {
    url = streamInfo.value.flv || '';
    rtmp = streamInfo.value.rtmp || '';
  }
  
  return {
    sharedUrl: url,
    sharedRtmp: rtmp,
    sharedIframe: `<iframe src="${window.location.origin}/iframe.html?url=${encodeURIComponent(url)}" frameborder="0" width="100%" height="100%"></iframe>`
  }
})

// 方法
const openDialog = (tabActive, deviceIdParam, channelIdParam, streamData) => {
  dialogVisible.value = true
  tabActiveName.value = tabActive
  type.value = tabActive
  deviceId.value = deviceIdParam
  channelId.value = channelIdParam
  
  if (streamData) {
    streamInfo.value = streamData.streamInfo
    hasAudio.value = streamData.hasAudio
    
    // 选择播放地址
    if (streamInfo.value) {
      videoUrl.value = streamInfo.value.flv || streamInfo.value.rtmp || streamInfo.value.hls || ''
    }
  }
}

const close = () => {
  dialogVisible.value = false
  videoUrl.value = ''
  streamInfo.value = null
  videoError.value = ''
}

const tabHandleClick = (tab: any) => {
  tabActiveName.value = String(tab.name)
}

const copyUrl = (url) => {
  try {
    navigator.clipboard.writeText(url).then(() => {
      ElMessage({
        type: 'success',
        message: '复制成功'
      })
    })
  } catch (e) {
    console.error('复制失败', e)
    ElMessage({
      type: 'error',
      message: '复制失败'
    })
  }
}

const copyStreamUrl = () => {
  if (streamInfo.value) {
    copyUrl(getPlayerShared.value.sharedUrl)
  }
}

// 暴露方法
defineExpose({
  openDialog,
  close
})
</script>

<style scoped>
.cpoy-btn {
  cursor: pointer;
}
</style> 