<template>
  <div class="visual-center" ref="visualCenter">
    <div class="top-bar">
      <div class="time">{{ format(new Date(), 'yyyy-MM-dd HH:mm:ss') }}</div>
      <div class="title">
        <span>太行视觉AI监控中心</span>
      </div>
      <div class="right-controls">
        <div class="location-info">
          <div v-if="locationInfo.loading" class="loading-indicator">
            <span>加载中...</span>
          </div>
          <template v-else>
            <div class="location">
              <svg class="location-icon" viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{{ locationInfo.location }}</span>
            </div>
            <div class="weather-info">
              <svg class="weather-icon" viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
              </svg>
              <span>{{ locationInfo.weather }}</span>
              <span class="air-quality">{{ locationInfo.airQuality }}</span>
            </div>
          </template>
        </div>
        <div class="fullscreen-btn" @click="toggleFullscreen">
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="main-content">
      <el-row :gutter="20">
        <!-- 左侧统计 -->
        <el-col :span="6">
          <div class="stat-panel panel-box">
            <div class="panel-title">预警趋势</div>
            <div class="trend-chart" ref="trendChart"></div>
          </div>
          <div class="type-panel panel-box">
            <div class="panel-title">预警类型排名</div>
            <div class="type-list">
              <div v-for="(item, index) in warningTypes" :key="index" class="type-item">
                <span class="type-name">{{ item.name }}</span>
                <div class="type-bar">
                  <div class="bar-inner" :style="{ width: item.value + '%' }"></div>
                </div>
                <span class="type-count">{{ item.count }}个</span>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 中间3D地图 -->
        <el-col :span="12">
          <div class="map-panel panel-box">
            <div class="center-stats">
              <div class="stat-box warning-stat">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <div class="stat-title">今日预警</div>
                  <div class="stat-value">{{ todayWarnings }}<span class="unit">个</span></div>
                </div>
              </div>
              <div class="stat-box device-stat">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <div class="stat-title">设备概览</div>
                  <div class="stat-value">{{ deviceCount }}<span class="unit">/{{ totalDevices }}</span></div>
                </div>
              </div>
              <div class="stat-box">
                <div class="warning-icon stat-icon"></div>
                <div class="stat-info">
                  <div class="stat-title">当前预警</div>
                  <div class="stat-value">{{ currentEvent }}</div>
                </div>
              </div>
              <div class="stat-box">
                <div class="device-icon stat-icon"></div>
                <div class="stat-info">
                  <div class="stat-title">设备位置</div>
                  <div class="stat-value">{{ currentDevice }}</div>
                </div>
              </div>
            </div>
            <div class="map-container" ref="mapContainer">
              <!-- 3D地图将在这里渲染 -->
              <div class="map-stats">
                <div class="map-stat-item">
                  <div class="stat-label">今日预警</div>
                  <div class="stat-value">{{ todayWarnings }}<span class="unit">个</span></div>
                </div>
                <div class="map-stat-item">
                  <div class="stat-label">设备概览</div>
                  <div class="stat-value">{{ deviceCount }}<span class="unit">/{{ totalDevices }}</span></div>
                </div>
              </div>
            </div>
            <div class="map-info">
              <div class="info-title">预警信息</div>
              <div class="info-item">
                <span>时间：</span>{{ currentDetailTime }}
              </div>
              <div class="info-item">
                <span>事件：</span>{{ currentEvent }}
              </div>
              <div class="info-item">
                <span>设备名称：</span>{{ currentDevice }}
              </div>
              <div class="info-tip">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v8h-2z"/>
                </svg>
                <span>提示：鼠标拖动可旋转视角，滚轮可缩放</span>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧统计 -->
        <el-col :span="6">
          <div class="level-panel panel-box">
            <div class="panel-title">预警等级占比</div>
            <div class="level-chart" ref="levelChart"></div>
          </div>
          <div class="top-panel panel-box">
            <div class="panel-title">组织预警 Top 5</div>
            <div class="top-list">
              <div v-for="(item, index) in topWarnings" :key="index" class="top-item">
                <span class="item-name">{{ item.name }}</span>
                <div class="item-bar">
                  <div class="bar-inner" :style="{ width: item.value + '%' }"></div>
                </div>
                <span class="item-count">{{ item.count }}个</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 底部表格 -->
      <el-row class="bottom-section" :gutter="20">
        <el-col :span="6">
          <div class="status-panel panel-box">
            <div class="panel-title">预警处理情况</div>
            <div class="status-tabs">
              <div 
                class="tab-item" 
                :class="{ active: statusTimeRange === 'day' }"
                @click="changeStatusTimeRange('day')"
              >本日</div>
              <div 
                class="tab-item" 
                :class="{ active: statusTimeRange === 'week' }"
                @click="changeStatusTimeRange('week')"
              >本周</div>
              <div 
                class="tab-item" 
                :class="{ active: statusTimeRange === 'month' }"
                @click="changeStatusTimeRange('month')"
              >本月</div>
            </div>
            <div class="status-chart" ref="statusChart"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="list-panel panel-box">
            <div class="panel-title">预警记录</div>
            <div class="warning-table">
              <el-table :data="warningList" style="width: 100%" :header-cell-style="headerCellStyle" height="280">
                <el-table-column prop="event" label="预警事件" min-width="120" />
                <el-table-column prop="time" label="预警时间" width="180" />
                <el-table-column prop="status" label="处理状态" width="120">
                  <template #default="scope">
                    <span :class="['status-tag', scope.row.status]">{{ scope.row.statusText }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="device-panel panel-box">
            <div class="panel-title">设备预警数量 Top 10</div>
            <div class="device-tabs">
              <div 
                class="tab-item" 
                :class="{ active: deviceTimeRange === 'day' }"
                @click="changeDeviceTimeRange('day')"
              >本日</div>
              <div 
                class="tab-item" 
                :class="{ active: deviceTimeRange === 'week' }"
                @click="changeDeviceTimeRange('week')"
              >本周</div>
              <div 
                class="tab-item" 
                :class="{ active: deviceTimeRange === 'month' }"
                @click="changeDeviceTimeRange('month')"
              >本月</div>
            </div>
            <div class="device-table">
              <el-table :data="deviceWarnings" style="width: 100%" :header-cell-style="headerCellStyle" height="320">
                <el-table-column prop="name" label="设备名称" min-width="150" />
                <el-table-column prop="count" label="预警数量" width="120" align="right" />
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, nextTick } from 'vue';
import * as echarts from 'echarts';
import { format } from 'date-fns';
import axios from 'axios';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 系统状态数据
const todayWarnings = ref(0);
const deviceCount = ref(0);
const totalDevices = ref(0);
const currentDetailTime = ref(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
const currentEvent = ref('');
const currentDevice = ref('');

// 天气和位置信息
const locationInfo = reactive({
  location: '',
  weather: '',
  airQuality: '',
  loading: true
});

// Define statusData as a reactive object
const statusData = reactive({
  day: [
    { value: 5, name: '待处理', itemStyle: { color: '#FF8746' } },
    { value: 3, name: '处理中', itemStyle: { color: '#44FF9B' } },
    { value: 12, name: '已完成', itemStyle: { color: '#00FFFF' } }
  ],
  week: [
    { value: 18, name: '待处理', itemStyle: { color: '#FF8746' } },
    { value: 25, name: '处理中', itemStyle: { color: '#44FF9B' } },
    { value: 65, name: '已完成', itemStyle: { color: '#00FFFF' } }
  ],
  month: [
    { value: 42, name: '待处理', itemStyle: { color: '#FF8746' } },
    { value: 78, name: '处理中', itemStyle: { color: '#44FF9B' } },
    { value: 180, name: '已完成', itemStyle: { color: '#00FFFF' } }
  ]
});

// 获取系统状态数据
const fetchSystemStatus = async () => {
  try {
    // 这里应该是从后端API获取数据
    // 暂时使用模拟数据，后续需要替换为实际API调用
    const response = await axios.get('/api/system/status').catch(() => null);
    
    if (response?.data) {
      const { data } = response;
      todayWarnings.value = data.todayWarnings || 0;
      deviceCount.value = data.deviceCount || 0;
      totalDevices.value = data.totalDevices || 0;
      currentEvent.value = data.currentEvent || '';
      currentDevice.value = data.currentDevice || '';
    }
  } catch (error) {
    console.error('获取系统状态失败:', error);
  }
};

// 获取实时位置和天气信息
const fetchWeatherData = async () => {
  try {
    locationInfo.loading = true;
    
    // 首先尝试获取用户位置
    let position;
    try {
      position = await getCurrentPosition();
    } catch (error) {
      console.warn('无法获取用户位置，使用默认位置:', error);
      position = { latitude: 38.0428, longitude: 114.5149 }; // 石家庄默认坐标
    }
    
    // 使用获取到的位置请求天气信息
    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: 'f0245b8d45c94ca58ba24440251703',
        q: `${position.latitude},${position.longitude}`,
        lang: 'zh',
        aqi: 'yes'
      }
    });
    
    if (response?.data?.location && response?.data?.current) {
      const { location, current } = response.data;
      locationInfo.location = location.name;
      // 天气和温度合并显示
      locationInfo.weather = `${current.condition.text} ${current.temp_c}°C`;
      // 空气质量
      if (current.air_quality) {
        const aqi = current.air_quality['us-epa-index'];
        const aqiText = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'][aqi - 1] || '未知';
        locationInfo.airQuality = `空气质量: ${aqiText}`;
      }
    } else {
      throw new Error('Invalid weather data');
    }
  } catch (error) {
    console.error('获取天气数据失败:', error);
    locationInfo.location = '太行山工业园区';
    locationInfo.weather = '晴 26°C';
    locationInfo.airQuality = '空气质量: 良';
  } finally {
    locationInfo.loading = false;
  }
};

// 获取当前位置的Promise封装
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理位置'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

// 立即获取数据
fetchWeatherData();
fetchSystemStatus();

// 定期更新数据
const weatherTimer = setInterval(fetchWeatherData, 5 * 60 * 1000); // 每5分钟更新天气
const statusTimer = setInterval(fetchSystemStatus, 30 * 1000); // 每30秒更新系统状态

onUnmounted(() => {
  clearInterval(weatherTimer);
  clearInterval(statusTimer);
});

// 全屏状态
const isFullscreen = ref(false);
const visualCenter = ref<HTMLElement | null>(null);

// 切换全屏
const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await visualCenter.value?.requestFullscreen();
      isFullscreen.value = true;
    } else {
      await document.exitFullscreen();
      isFullscreen.value = false;
    }
  } catch (err) {
    console.error('全屏切换失败:', err);
  }
};

// 监听全屏变化
onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
  
  // 初始化图表 - 使用nextTick确保DOM已经渲染
  nextTick(() => {
    initTrendChart();
    initLevelChart();
    initStatusChart();
    
    // 初始化数据 - 确保在图表初始化后调用
    updateDeviceTable();
  });
  
  // 初始化3D工厂地图
  init3DFactory();
  
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
  window.removeEventListener('resize', handleResize);
  
  // 销毁图表实例
  trendChart?.dispose();
  levelChart?.dispose();
  statusChart?.dispose();
  
  // 清理3D资源
  cleanup3DFactory();
});

// 表格样式
const headerCellStyle = {
  background: 'linear-gradient(180deg, rgba(6, 30, 93, 0.9) 0%, rgba(4, 20, 63, 1) 100%)',
  color: '#00FFFF',
  borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
  fontWeight: 'normal',
  padding: '12px 0',
  textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
};

// 预警类型数据
const warningTypes = ref([
  { name: '未戴安全帽', count: 9, value: 90 },
  { name: '区域入侵', count: 7, value: 70 },
  { name: '垃圾堆积', count: 5, value: 50 },
  { name: '人员聚集', count: 4, value: 40 },
  { name: '烟雾识别', count: 2, value: 20 }
]);

// Top 5预警数据
const topWarnings = ref([
  { name: '水处理车间', count: 6, value: 100 },
  { name: '引桥', count: 5, value: 83 },
  { name: '气机间', count: 3, value: 50 },
  { name: '综合水泵房', count: 3, value: 50 },
  { name: '电车充电棚', count: 1, value: 17 }
]);

// 预警列表数据
const warningList = ref([
  { event: '烟雾识别', time: '07-25 16:23:49', status: 'pending', statusText: '待处理' },
  { event: '垃圾堆积', time: '07-25 14:19:31', status: 'processing', statusText: '处理中' },
  { event: '走路玩手机', time: '07-25 12:53:16', status: 'completed', statusText: '已完成' },
  { event: '区域入侵', time: '07-25 10:45:36', status: 'completed', statusText: '已完成' },
  { event: '未戴安全帽', time: '07-25 09:25:12', status: 'completed', statusText: '已完成' }
]);

// 设备预警数量数据
const deviceWarnings = ref([
  { name: '21米东平台', count: '2个' },
  { name: '前料平台西北', count: '1个' },
  { name: '化水配电室', count: '1个' },
  { name: '控制室操作机', count: '1个' },
  { name: '引桥南侧', count: '1个' },
  { name: '水处理车间', count: '1个' },
  { name: '气机间西侧', count: '1个' },
  { name: '综合水泵房', count: '1个' },
  { name: '电车充电棚', count: '1个' },
  { name: '主厂房东侧', count: '1个' }
]);

// 图表初始化
let trendChart: echarts.ECharts | null = null;
let levelChart: echarts.ECharts | null = null;
let statusChart: echarts.ECharts | null = null;

// 3D工厂地图相关变量
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let factoryGroup: THREE.Group;
let animationId: number;
let warningLight: THREE.PointLight;

// 添加预警点数据结构
const warningPoints = ref([
  { position: { x: 20, y: 10, z: -15 }, level: 'critical' }, // 严重
  { position: { x: -15, y: 8, z: 10 }, level: 'high' },     // 高危
  { position: { x: 10, y: 5, z: 15 }, level: 'medium' },    // 中危
  { position: { x: -10, y: 7, z: -10 }, level: 'low' }      // 低危
]);

// 预警等级对应的颜色
const warningLevelColors = {
  critical: 0xff0000, // 红色 - 严重
  high: 0xff7e00,     // 橙色 - 高危
  medium: 0xffff00,   // 黄色 - 中危
  low: 0x00ff00       // 绿色 - 低危
};

// 存储预警点对象的数组
let warningMarkers = [];
let warningLights = [];

// 添加多个预警点效果
const addWarningPoints = () => {
  // 清除之前的预警点
  warningMarkers.forEach(marker => scene.remove(marker));
  warningLights.forEach(light => scene.remove(light));
  warningMarkers = [];
  warningLights = [];
  
  // 为每个预警点创建标记和光源
  warningPoints.value.forEach(point => {
    const color = warningLevelColors[point.level];
    
    // 添加预警点光源
    const warningLight = new THREE.PointLight(color, 2, 15);
    warningLight.position.set(point.position.x, point.position.y, point.position.z);
    scene.add(warningLight);
    warningLights.push(warningLight);
    
    // 添加预警标记
    const warningGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const warningMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.6
    });
    const warningMarker = new THREE.Mesh(warningGeometry, warningMaterial);
    warningMarker.position.copy(warningLight.position);
    scene.add(warningMarker);
    warningMarkers.push(warningMarker);
    
    // 存储初始数据用于动画
    warningMarker.userData = {
      baseOpacity: 0.6,
      baseScale: 1.0,
      level: point.level
    };
  });
};

const handleResize = () => {
  // 使用防抖函数处理resize事件
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    trendChart?.resize();
    levelChart?.resize();
    statusChart?.resize();
  }, 100);
};

// 防抖定时器
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

const initTrendChart = () => {
  trendChart = echarts.init(document.querySelector('.trend-chart') as HTMLElement);
  trendChart.setOption({
    grid: {
      top: 30,
      right: 20,
      bottom: 30,
      left: 40
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.3)',
          width: 1,
          type: 'solid'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: ['07-19', '07-20', '07-21', '07-22', '07-23', '07-24', '07-25'],
      axisLine: {
        lineStyle: { color: '#235894' }
      },
      axisLabel: { color: '#7EAEE5' }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { color: '#235894' }
      },
      axisLine: {
        lineStyle: { color: '#235894' }
      },
      axisLabel: { color: '#7EAEE5' }
    },
    series: [{
      data: [35, 32, 34, 35, 32, 30, 29],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#00FFFF'
      },
      lineStyle: {
        color: '#00FFFF',
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(0,255,255,0.3)'
          }, {
            offset: 1,
            color: 'rgba(0,255,255,0)'
          }]
        }
      }
    }]
  });
};

const initLevelChart = () => {
  levelChart = echarts.init(document.querySelector('.level-chart') as HTMLElement);
  levelChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#7EAEE5' },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [{
      name: '预警等级',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#00FFFF'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 0, name: '一级预警', itemStyle: { color: '#FF4444' } },
        { value: 2, name: '二级预警', itemStyle: { color: '#FF8746' } },
        { value: 5, name: '三级预警', itemStyle: { color: '#FFD159' } },
        { value: 22, name: '四级预警', itemStyle: { color: '#44FF9B' } }
      ]
    }]
  });
};

// 完全重写初始化和更新函数
const initStatusChart = () => {
  const chartDom = document.querySelector('.status-chart') as HTMLElement;
  if (!chartDom) return;
  
  statusChart = echarts.init(chartDom);
  
  // 初始化图表配置
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      textStyle: { color: '#7EAEE5' },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [{
      name: '处理状态',
      type: 'pie',
      radius: ['60%', '80%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#00FFFF'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: statusData.day // 默认显示日数据
    }]
  };
  
  // 设置初始配置
  statusChart.setOption(option);
}

// Function to update the status chart
const updateStatusChart = () => {
  if (!statusChart) {
    console.error('状态图表未初始化');
    return;
  }
  
  const currentRange = statusTimeRange.value;
  const currentData = statusData[currentRange];
  console.log('更新状态图表:', currentRange, currentData);
  
  // 确保数据存在
  if (!currentData || !Array.isArray(currentData)) {
    console.error('状态数据不存在或格式不正确:', currentRange, currentData);
    return;
  }
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      textStyle: { color: '#7EAEE5' },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [{
      name: '处理状态',
      type: 'pie',
      radius: ['60%', '80%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#00FFFF'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: currentData
    }]
  };
  
  // 使用notMerge: true确保完全替换配置而不是合并
  statusChart.setOption(option, { notMerge: true });
}

// Function to change the time range
const changeStatusTimeRange = (range) => {
  console.log('切换状态时间范围:', range);
  statusTimeRange.value = range;
  
  // 使用nextTick确保DOM更新后再更新图表
  nextTick(() => {
    console.log('nextTick中更新图表，当前范围:', statusTimeRange.value);
    updateStatusChart();
  });
}

// 初始化3D工厂地图
const init3DFactory = () => {
  const container = document.querySelector('.map-container') as HTMLElement;
  if (!container) return;
  
  // 清除现有内容
  container.innerHTML = '';
  
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x061e5d);
  
  // 创建相机
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 30, 50);
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  
  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.1;
  controls.minDistance = 20;
  controls.maxDistance = 100;
  
  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);
  
  // 添加方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  // 创建工厂模型
  createFactory();
  
  // 添加网格地面
  createGridGround();
  
  // 添加多个预警点效果
  addWarningPoints();
  
  // 开始动画循环
  animate();
  
  // 窗口大小变化时调整
  window.addEventListener('resize', onWindowResize);
};

// 创建工厂模型
const createFactory = () => {
  factoryGroup = new THREE.Group();
  scene.add(factoryGroup);
  
  // 创建地面
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0a2550,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  factoryGroup.add(ground);
  
  // 创建主厂房
  const mainBuildingGeometry = new THREE.BoxGeometry(30, 10, 20);
  const mainBuildingMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x00334e,
    specular: 0x00ffff,
    shininess: 30
  });
  const mainBuilding = new THREE.Mesh(mainBuildingGeometry, mainBuildingMaterial);
  mainBuilding.position.set(0, 5, 0);
  mainBuilding.castShadow = true;
  mainBuilding.receiveShadow = true;
  factoryGroup.add(mainBuilding);
  
  // 创建屋顶
  const roofGeometry = new THREE.ConeGeometry(22, 5, 4);
  const roofMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x005580,
    specular: 0x00ffff,
    shininess: 30
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 12.5, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  factoryGroup.add(roof);
  
  // 创建烟囱
  const chimneyGeometry = new THREE.CylinderGeometry(1, 1.5, 15, 16);
  const chimneyMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x333333,
    specular: 0x666666,
    shininess: 10
  });
  const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
  chimney.position.set(-10, 15, -5);
  chimney.castShadow = true;
  factoryGroup.add(chimney);
  
  // 创建水池
  const poolGeometry = new THREE.CylinderGeometry(8, 8, 2, 32);
  const poolMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x0077be,
    specular: 0x00ffff,
    shininess: 90,
    transparent: true,
    opacity: 0.8
  });
  const pool = new THREE.Mesh(poolGeometry, poolMaterial);
  pool.position.set(20, 1, 15);
  factoryGroup.add(pool);
  
  // 创建小型建筑1
  const building1Geometry = new THREE.BoxGeometry(8, 6, 10);
  const building1Material = new THREE.MeshPhongMaterial({ 
    color: 0x004466,
    specular: 0x00ffff,
    shininess: 30
  });
  const building1 = new THREE.Mesh(building1Geometry, building1Material);
  building1.position.set(-20, 3, 15);
  building1.castShadow = true;
  building1.receiveShadow = true;
  factoryGroup.add(building1);
  
  // 创建小型建筑2
  const building2Geometry = new THREE.BoxGeometry(10, 8, 12);
  const building2Material = new THREE.MeshPhongMaterial({ 
    color: 0x004466,
    specular: 0x00ffff,
    shininess: 30
  });
  const building2 = new THREE.Mesh(building2Geometry, building2Material);
  building2.position.set(20, 4, -15);
  building2.castShadow = true;
  building2.receiveShadow = true;
  factoryGroup.add(building2);
  
  // 创建连接管道
  createPipes();
};

// 创建连接管道
const createPipes = () => {
  // 主管道
  const mainPipeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 40, 16);
  const pipeMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x888888,
    specular: 0x00ffff,
    shininess: 50
  });
  const mainPipe = new THREE.Mesh(mainPipeGeometry, pipeMaterial);
  mainPipe.position.set(0, 3, -15);
  mainPipe.rotation.z = Math.PI / 2;
  mainPipe.castShadow = true;
  factoryGroup.add(mainPipe);
  
  // 垂直管道1
  const verticalPipe1Geometry = new THREE.CylinderGeometry(0.6, 0.6, 10, 16);
  const verticalPipe1 = new THREE.Mesh(verticalPipe1Geometry, pipeMaterial);
  verticalPipe1.position.set(-15, 8, -15);
  verticalPipe1.castShadow = true;
  factoryGroup.add(verticalPipe1);
  
  // 垂直管道2
  const verticalPipe2Geometry = new THREE.CylinderGeometry(0.6, 0.6, 8, 16);
  const verticalPipe2 = new THREE.Mesh(verticalPipe2Geometry, pipeMaterial);
  verticalPipe2.position.set(15, 7, -15);
  verticalPipe2.castShadow = true;
  factoryGroup.add(verticalPipe2);
};

// 创建网格地面
const createGridGround = () => {
  const gridHelper = new THREE.GridHelper(100, 50, 0x00ffff, 0x004466);
  gridHelper.position.y = 0.1;
  scene.add(gridHelper);
  
  // 添加辅助坐标轴
  // const axesHelper = new THREE.AxesHelper(20);
  // scene.add(axesHelper);
};

// 窗口大小变化时调整
const onWindowResize = () => {
  const container = document.querySelector('.map-container') as HTMLElement;
  if (!container || !camera || !renderer) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);
  
  // 更新控制器
  if (controls) controls.update();
  
  // 预警点闪烁效果
  const time = Date.now() * 0.001;
  
  warningMarkers.forEach((marker, index) => {
    const light = warningLights[index];
    const level = marker.userData.level;
    
    // 根据预警等级设置不同的闪烁频率和强度
    let pulseSpeed, pulseIntensity;
    
    switch(level) {
      case 'critical':
        pulseSpeed = 8;
        pulseIntensity = 1.5;
        break;
      case 'high':
        pulseSpeed = 6;
        pulseIntensity = 1.3;
        break;
      case 'medium':
        pulseSpeed = 4;
        pulseIntensity = 1.2;
        break;
      case 'low':
        pulseSpeed = 2;
        pulseIntensity = 1.1;
        break;
      default:
        pulseSpeed = 4;
        pulseIntensity = 1.2;
    }
    
    // 闪烁效果 - 透明度变化
    const opacityPulse = 0.3 + 0.7 * Math.sin(time * pulseSpeed) * 0.5 + 0.5;
    marker.material.opacity = marker.userData.baseOpacity * opacityPulse;
    
    // 闪烁效果 - 大小变化
    const scalePulse = 1 + 0.2 * Math.sin(time * pulseSpeed) * 0.5 + 0.5;
    marker.scale.set(scalePulse, scalePulse, scalePulse);
    
    // 闪烁效果 - 光源强度变化
    light.intensity = 1 + Math.sin(time * pulseSpeed) * pulseIntensity;
  });
  
  // 渲染场景
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

// 清理资源
const cleanup3DFactory = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  if (renderer) {
    renderer.dispose();
  }
  
  // 清理预警点资源
  warningMarkers.forEach(marker => {
    if (marker.geometry) marker.geometry.dispose();
    if (marker.material) marker.material.dispose();
  });
  
  window.removeEventListener('resize', onWindowResize);
};

// Declare the reactive reference
const statusTimeRange = ref('day'); // Correctly defined

// Declare deviceTimeRange as a reactive reference
const deviceTimeRange = ref('day'); // Initialize with a default value

// Function to change the device time range
const changeDeviceTimeRange = (range) => {
  console.log('切换设备时间范围:', range);
  deviceTimeRange.value = range; // Update the time range
  nextTick(() => {
    updateDeviceTable(); // 确保更新设备表格
  });
};

// Function to update the device table
const updateDeviceTable = () => {
  // 根据当前选择的时间范围更新设备预警数据
  deviceWarnings.value = deviceWarningsData[deviceTimeRange.value];
};

// 定义设备预警数据
const deviceWarningsData = reactive({
  day: [
    { name: '21米东平台', count: '2个' },
    { name: '前料平台西北', count: '1个' },
    { name: '化水配电室', count: '1个' },
    { name: '控制室操作机', count: '1个' },
    { name: '引桥南侧', count: '1个' },
    { name: '水处理车间', count: '1个' },
    { name: '气机间西侧', count: '1个' },
    { name: '综合水泵房', count: '1个' },
    { name: '电车充电棚', count: '1个' },
    { name: '主厂房东侧', count: '1个' }
  ],
  week: [
    { name: '21米东平台', count: '5个' },
    { name: '前料平台西北', count: '4个' },
    { name: '化水配电室', count: '4个' },
    { name: '控制室操作机', count: '3个' },
    { name: '引桥南侧', count: '3个' },
    { name: '水处理车间', count: '3个' },
    { name: '气机间西侧', count: '2个' },
    { name: '综合水泵房', count: '2个' },
    { name: '电车充电棚', count: '2个' },
    { name: '主厂房东侧', count: '2个' }
  ],
  month: [
    { name: '21米东平台', count: '12个' },
    { name: '前料平台西北', count: '10个' },
    { name: '化水配电室', count: '9个' },
    { name: '控制室操作机', count: '8个' },
    { name: '引桥南侧', count: '7个' },
    { name: '水处理车间', count: '7个' },
    { name: '气机间西侧', count: '6个' },
    { name: '综合水泵房', count: '5个' },
    { name: '电车充电棚', count: '5个' },
    { name: '主厂房东侧', count: '4个' }
  ]
});
</script>

<style lang="scss" scoped>
.visual-center {
  min-height: 100vh;
  background: linear-gradient(135deg, #001529 0%, #000B18 100%);
  color: #fff;
  padding: 20px;
  position: relative;
  
  // 背景网格
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }
  
  // 顶部发光线
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 48px;
    background: rgba(0, 20, 40, 0.7);
    z-index: 1;
  }
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  z-index: 2;
  padding: 0 20px;
  height: 30px;
  
  .time {
    width: 280px;
    font-size: 18px;
    font-weight: bold;
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    white-space: nowrap;
    line-height: 1;
  }
  
  .title {
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    
    span {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
      position: relative;
      z-index: 2;
      line-height: 1;
      
      &::before, &::after {
        content: '';
        position: absolute;
        height: 2px;
        width: 70px;
        background: linear-gradient(90deg, transparent, #00ffff, transparent);
        top: 50%;
      }
      
      &::before {
        right: calc(100% + 15px);
      }
      
      &::after {
        left: calc(100% + 15px);
      }
    }
  }
  
  .right-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    flex: 0 0 auto;
    min-width: 300px;
    max-width: 500px;
  }
}

.location-info {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 15px;
  overflow: hidden;
  
  .loading-indicator {
    color: #7EAEE5;
    font-size: 14px;
  }
  
  .location {
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 0;
    
    .location-icon {
      color: #00FFFF;
      flex-shrink: 0;
      width: 14px;
      height: 14px;
    }
    
    span {
      color: #00FFFF;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .weather-info {
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 1;
    min-width: 0;
    
    .weather-icon {
      color: #00FFFF;
      flex-shrink: 0;
      width: 14px;
      height: 14px;
    }
    
    span {
      color: #7EAEE5;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .air-quality {
      margin-left: 8px;
      padding-left: 8px;
      border-left: 1px solid rgba(126, 174, 229, 0.3);
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.panel-box {
  background: linear-gradient(180deg, rgba(6, 30, 93, 0.8) 0%, rgba(4, 20, 63, 0.9) 100%);
  border: 1px solid rgba(35, 88, 148, 0.5);
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 20px;
    height: 20px;
    border-top: 2px solid #00FFFF;
    border-left: 2px solid #00FFFF;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 20px;
    height: 20px;
    border-bottom: 2px solid #00FFFF;
    border-right: 2px solid #00FFFF;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }

  .panel-title {
    color: #00FFFF;
    font-size: 16px;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #00FFFF;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
}

.trend-chart,
.level-chart {
  height: 240px;
  width: 100%;
  position: relative;
  
  // 添加加载中的样式
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: -1;
  }
}

.type-list,
.top-list {
  .type-item,
  .top-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    .type-name,
    .item-name {
      width: 100px;
      color: #7EAEE5;
    }
    
    .type-bar,
    .item-bar {
      flex: 1;
      height: 6px;
      background: rgba(126, 174, 229, 0.1);
      margin: 0 10px;
      border-radius: 3px;
      overflow: hidden;
      
      .bar-inner {
        height: 100%;
        background: #00FFFF;
        border-radius: 3px;
      }
    }
    
    .type-count,
    .item-count {
      width: 50px;
      text-align: right;
      color: #7EAEE5;
    }
  }
}

.map-panel {
  height: 550px;
  position: relative;
  
  .center-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    
    .stat-box {
      display: flex;
      align-items: center;
      background: rgba(0, 30, 60, 0.5);
      padding: 10px 15px;
      border-radius: 4px;
      border: 1px solid rgba(0, 255, 255, 0.2);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba(0, 255, 255, 0.5);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
        transform: translateY(-2px);
      }
      
      .stat-icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background: rgba(0, 255, 255, 0.1);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      
      .stat-info {
        .stat-title {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .stat-value {
          color: #00FFFF;
          font-size: 18px;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
      }
    }
  }
  
  .map-container {
    height: 400px;
    background: rgba(6, 30, 93, 0.3);
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    
    canvas {
      width: 100% !important;
      height: 100% !important;
      outline: none;
    }
    
    // 添加网格背景
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 20px 20px;
      background-position: center center;
      z-index: 0;
      pointer-events: none;
    }
    
    // 添加扫描线效果
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 200%;
      height: 100%;
      background: linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.05) 50%, transparent 100%);
      animation: scanLine 4s linear infinite;
      z-index: 1;
      pointer-events: none;
    }
    
    .map-stats {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      z-index: 10;
      
      .map-stat-item {
        background: rgba(0, 30, 60, 0.7);
        padding: 10px 15px;
        border-radius: 4px;
        border: 1px solid rgba(0, 255, 255, 0.3);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        
        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #00ffff;
          
          .unit {
            font-size: 14px;
            margin-left: 2px;
          }
        }
      }
    }
  }
  
  .map-info {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(6, 30, 93, 0.8);
    padding: 15px;
    border-radius: 4px;
    border: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    z-index: 10;
    
    .info-title {
      color: #00ffff;
      font-size: 16px;
      margin-bottom: 15px;
      padding-left: 10px;
      border-left: 3px solid #00ffff;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }
    
    .info-item {
      color: #7eaee5;
      margin-bottom: 8px;
      font-size: 14px;
      
      &:last-of-type {
        margin-bottom: 15px;
      }
      
      span {
        color: #00ffff;
        margin-right: 5px;
        font-weight: bold;
      }
    }
    
    .info-tip {
      display: flex;
      align-items: center;
      color: #7eaee5;
      font-size: 12px;
      margin-top: 5px;
      padding-top: 10px;
      border-top: 1px solid rgba(0, 255, 255, 0.1);
      
      svg {
        color: #00ffff;
        margin-right: 5px;
      }
    }
  }
}

.bottom-section {
  margin-bottom: 0px;
  
  .el-table {
    height: 280px !important;
  }
}

.status-tabs,
.device-tabs {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  
  .tab-item {
    padding: 8px 15px;
    cursor: pointer;
    color: #7EAEE5;
    font-size: 14px;
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
      color: #00FFFF;
    }
    
    &.active {
      color: #00FFFF;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #00FFFF;
        box-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
      }
    }
  }
}

.status-panel,
.list-panel,
.device-panel {
  position: relative;
  overflow: hidden;
  height: 360px;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ffff, transparent);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
}

.status-chart {
  height: 240px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warning-table,
.device-table {
  flex: 1;
  overflow: hidden;
  
  :deep(.el-table) {
    background: transparent;
    height: 100%;
    
    &::before,
    &::after {
      display: none;
    }
    
    .el-table__header {
      th {
        background: linear-gradient(180deg, rgba(6, 30, 93, 0.9) 0%, rgba(4, 20, 63, 1) 100%);
        border-bottom: 1px solid rgba(0, 255, 255, 0.3);
        color: #00ffff;
        font-size: 14px;
        padding: 12px 0;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
      }
    }
  }
}

.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.6;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    border: 1px solid currentColor;
    opacity: 0.3;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
  }
  
  &.pending {
    color: #ff8746;
    background: linear-gradient(180deg, rgba(255, 135, 70, 0.2) 0%, rgba(255, 135, 70, 0.1) 100%);
    text-shadow: 0 0 5px rgba(255, 135, 70, 0.5);
  }
  
  &.processing {
    color: #44ff9b;
    background: linear-gradient(180deg, rgba(68, 255, 155, 0.2) 0%, rgba(68, 255, 155, 0.1) 100%);
    text-shadow: 0 0 5px rgba(68, 255, 155, 0.5);
  }
  
  &.completed {
    color: #00ffff;
    background: linear-gradient(180deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 255, 255, 0.1) 100%);
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  }
}

// 修改表格滚动条样式
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  background: rgba(0, 255, 255, 0.3);
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0, 255, 255, 0.2);
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background: rgba(6, 30, 93, 0.5);
  border-radius: 3px;
}

// 强制覆盖表格背景色
:deep(.el-table),
:deep(.el-table__inner-wrapper),
:deep(.el-table__body),
:deep(.el-table__header),
:deep(.el-table__footer),
:deep(.el-table__body tr),
:deep(.el-table__empty-block) {
  background-color: transparent !important;
}

:deep(.el-table__empty-text) {
  color: #7eaee5;
}

// 增强表格科技感
.warning-table,
.device-table {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
  }
}

.list-panel {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, transparent 100%);
    z-index: 0;
    pointer-events: none;
  }
}

.warning-table {
  background: transparent;
  
  :deep(.el-table) {
    background: transparent;
    
    &::before,
    &::after {
      display: none;
    }
    
    .el-table__header-wrapper {
      th {
        background: linear-gradient(180deg, rgba(6, 30, 93, 0.9) 0%, rgba(4, 20, 63, 1) 100%);
        border-bottom: 1px solid rgba(0, 255, 255, 0.3);
        color: #00ffff;
        font-size: 14px;
        padding: 12px 0;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
      }
    }
    
    .el-table__body-wrapper {
      td {
        background: transparent !important;
        border-bottom: 1px solid rgba(35, 88, 148, 0.3);
        color: #7eaee5;
        padding: 12px 0;
        transition: all 0.3s;
      }
      
      tr {
        background: transparent !important;
        
        &:hover {
          td {
            background: linear-gradient(180deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 255, 255, 0.05) 100%) !important;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
          }
        }
      }
      
      max-height: 280px;
    }
  }
}

@keyframes scanLine {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(50%);
  }
}

@keyframes rotate {
  0% {
    transform: perspective(1000px) rotateX(30deg) rotateZ(0deg);
  }
  100% {
    transform: perspective(1000px) rotateX(30deg) rotateZ(360deg);
  }
}

.warning-icon {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300ffff'%3E%3Cpath d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    z-index: 2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%);
    z-index: 1;
  }
}

.device-icon {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300ffff'%3E%3Cpath d='M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    z-index: 2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%);
    z-index: 1;
  }
}

.fullscreen-btn {
  cursor: pointer;
  color: #00FFFF;
  flex-shrink: 0;
  margin-left: 10px;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    color: #7EAEE5;
  }
}

// 删除之前的全屏样式，改用 mixin
@mixin fullscreen-styles {
  background: linear-gradient(135deg, #001529 0%, #000B18 100%);
  padding: 30px;
  
  .panel-box {
    backdrop-filter: blur(20px);
  }
  
  .map-container {
    height: 500px;
  }
  
  // 全屏模式下调整图表高度
  .trend-chart,
  .level-chart,
  .status-chart {
    height: 300px;
  }
  
  // 全屏模式下调整表格高度
  .status-panel,
  .list-panel,
  .device-panel {
    height: 400px;
  }
  
  .bottom-section .el-table {
    height: 320px !important;
  }
}

.visual-center:fullscreen {
  @include fullscreen-styles;
}

.visual-center:-webkit-full-screen {
  @include fullscreen-styles;
}

.visual-center:-moz-full-screen {
  @include fullscreen-styles;
}

.visual-center:-ms-fullscreen {
  @include fullscreen-styles;
}
</style>