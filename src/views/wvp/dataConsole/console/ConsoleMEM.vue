<template>
  <div id="ConsoleMEM" style="width: 100%; height: 100%; background: #FFFFFF; text-align: center">
    <div ref="chartRef" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

// 图表DOM引用
const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

// 数据
const chartData = reactive({
  columns: ['time', 'percent'],
  rows: [] as any[]
})

// 图表配置
const option = {
  title: {
    show: true,
    text: "内存",
    left: "center",
    top: 20
  },
  grid: {
    top: 60,
    right: 30,
    bottom: 40,
    left: 20,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [] as string[],
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: '#DCDFE6'
      }
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: '#DCDFE6'
      }
    },
    axisLabel: {
      fontSize: 10,
      margin: 10,
      color: '#606266',
      showMaxLabel: true
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    interval: 20,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#DCDFE6'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#DCDFE6'
      }
    },
    axisLabel: {
      formatter: '{value}%',
      fontSize: 10,
      color: '#606266'
    },
    splitLine: {
      lineStyle: {
        color: '#EBEEF5',
        type: 'solid'
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const param = params[0]
      return param.name + "<br/> " 
        + param.marker + "使用：" + param.value + "%"
    }
  },
  series: [{
    name: '内存使用率',
    type: 'line',
    smooth: true,
    symbol: 'none',
    lineStyle: {
      width: 2
    },
    data: [] as number[],
    itemStyle: {
      color: "#50a3f8"
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: 'rgba(64, 158, 255, 0.3)'
        }, {
          offset: 1, color: 'rgba(64, 158, 255, 0.1)'
        }],
        global: false
      }
    }
  }]
}

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    // 确保容器存在
    if (!chart) {
      chart = echarts.init(chartRef.value)
    }
    chart.setOption(option, true)
  }
}

// 更新图表数据
const updateChart = () => {
  if (!chart) {
    initChart()
    if (!chart) return
  }
  
  // 处理时间数据
  const times: string[] = []
  const values: number[] = []
  
  chartData.rows.forEach(item => {
    // 格式化时间为HH:MM:SS
    const time = new Date(item.time)
    const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`
    times.push(timeStr)
    values.push(item.percent)
  })
  
  // 限制显示最近30个数据点
  const maxDataPoints = 30
  if (times.length > maxDataPoints) {
    times.splice(0, times.length - maxDataPoints)
    values.splice(0, values.length - maxDataPoints)
  }
  
  chart.setOption({
    xAxis: {
      data: times
    },
    series: [
      {
        data: values
      }
    ]
  })
}

// 设置数据方法（供父组件调用）
const setData = (data: any[]) => {
  chartData.rows = data
  nextTick(() => {
    updateChart()
  })
}

// 组件挂载时初始化图表
onMounted(() => {
  nextTick(() => {
    initChart()
    
    // 窗口大小变化时重新调整图表大小
    window.addEventListener('resize', handleResize)
  })
})

// 处理窗口大小变化
const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}

// 组件卸载前清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})

// 暴露方法给父组件调用
defineExpose({
  setData
})
</script>

<style scoped>
#ConsoleMEM {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>
