<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'

// 定义技能列表数据结构
interface Skill {
  id: string
  name: string
  version: string
  status: 'published' | 'unpublished'
  deviceCount: number
  type: string
  thumbnail: string
}

// 搜索和筛选条件
const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')

// 技能列表数据
const skillsList = ref<Skill[]>([])

// 分页配置
const currentPage = ref(1)
const pageSize = ref(12)

// 获取技能列表数据
const fetchSkills = async () => {
  // 模拟数据
  skillsList.value = [
    {
      id: '1',
      name: 'human_attribute_detection',
      version: 'v1.0.0',
      status: 'published',
      deviceCount: 5,
      type: '人体检测',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '2',
      name: 'vehicle_detection',
      version: 'v2.1.0',
      status: 'published',
      deviceCount: 8,
      type: '车辆检测',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '3',
      name: 'face_recognition',
      version: 'v1.5.0',
      status: 'unpublished',
      deviceCount: 0,
      type: '人脸识别',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '4',
      name: 'object_tracking',
      version: 'v2.0.0',
      status: 'published',
      deviceCount: 12,
      type: '目标跟踪',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '5',
      name: 'crowd_analysis',
      version: 'v1.2.0',
      status: 'published',
      deviceCount: 3,
      type: '人群分析',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '6',
      name: 'license_plate_recognition',
      version: 'v1.0.0',
      status: 'unpublished',
      deviceCount: 0,
      type: '车牌识别',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '7',
      name: 'behavior_analysis',
      version: 'v1.3.0',
      status: 'published',
      deviceCount: 6,
      type: '行为分析',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '8',
      name: 'traffic_monitoring',
      version: 'v2.2.0',
      status: 'published',
      deviceCount: 15,
      type: '交通监控',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '9',
      name: 'smoke_detection',
      version: 'v1.0.0',
      status: 'unpublished',
      deviceCount: 0,
      type: '烟雾检测',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '10',
      name: 'helmet_detection',
      version: 'v1.1.0',
      status: 'published',
      deviceCount: 4,
      type: '安全帽检测',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '11',
      name: 'intrusion_detection',
      version: 'v1.4.0',
      status: 'published',
      deviceCount: 7,
      type: '入侵检测',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    },
    {
      id: '12',
      name: 'fire_detection',
      version: 'v1.0.0',
      status: 'unpublished',
      deviceCount: 0,
      type: '火灾检测',
      thumbnail: 'linear-gradient(45deg, #409EFF, #1890ff)'
    }
  ]
}

onMounted(() => {
  fetchSkills()
})
</script>

<template>
  <div class="device-skills-container">
    <!-- 顶部搜索和筛选区域 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form :inline="true">
            <el-form-item label="状态">
              <el-select v-model="filterStatus" placeholder="选择状态">
                <el-option label="已发布" value="published" />
                <el-option label="未发布" value="unpublished" />
              </el-select>
            </el-form-item>
            <el-form-item label="技能类型">
              <el-select v-model="filterType" placeholder="选择类型">
                <el-option label="人体检测" value="human" />
                <el-option label="车辆检测" value="vehicle" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索技能名称"
            prefix-icon="Search"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 技能列表卡片区域 -->
    <div class="skills-grid">
      <el-row :gutter="20">
        <el-col
          v-for="skill in skillsList"
          :key="skill.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="6"
        >
          <el-card class="skill-card" shadow="hover">
            <div class="skill-thumbnail">
              <div 
                class="thumbnail-bg" 
                :style="{ background: skill.thumbnail }"
              ></div>
              <div
                class="status-badge"
                :class="skill.status === 'published' ? 'published' : 'unpublished'"
              >
                {{ skill.status === 'published' ? '已发布' : '未发布' }}
              </div>
            </div>
            <div class="skill-info">
              <h3>{{ skill.name }}</h3>
              <p>版本：{{ skill.version }}</p>
              <p>关联设备：{{ skill.deviceCount }}</p>
              <p>类型：{{ skill.type }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="50"
        layout="total, prev, pager, next"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.device-skills-container {
  padding: 20px;

  .filter-section {
    margin-bottom: 20px;
  }

  .skills-grid {
    margin-bottom: 20px;

    .skill-card {
      margin-bottom: 20px;
      cursor: pointer;

      .skill-thumbnail {
        position: relative;
        height: 160px;
        overflow: hidden;

        .thumbnail-bg {
          width: 100%;
          height: 100%;
        }

        .status-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: white;

          &.published {
            background-color: #67c23a;
          }

          &.unpublished {
            background-color: #909399;
          }
        }
      }

      .skill-info {
        padding: 12px;

        h3 {
          margin: 0 0 8px;
          font-size: 16px;
        }

        p {
          margin: 4px 0;
          color: #666;
          font-size: 14px;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
