<template>
  <div id="ConsoleDisk" style="width: 100%; height: 100%; background: #FFFFFF; text-align: center">
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
  columns: ['path', 'used', 'free'],
  rows: [] as any[]
})

// 图表配置
const option = {
  title: {
    show: true,
    text: "磁盘",
    left: "center",
    top: 20
  },
  grid: {
    top: 60,
    left: 20,
    right: 30,
    bottom: 40,
    containLabel: true,
  },
  legend: {
    orient: 'horizontal',
    left: 'center',
    bottom: 5,
    itemWidth: 12,
    itemHeight: 10,
    textStyle: {
      fontSize: 12,
      color: '#606266'
    },
    data: ['已使用', '剩余']
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params: any) => {
      const path = params[0].name;
      const used = params[0].value;
      const free = params[1].value;
      const total = used + free;
      return `${path}<br/>
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span>
              已使用: ${used.toFixed(1)}GB<br/>
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span>
              剩余: ${free.toFixed(1)}GB<br/>
              总计: ${total.toFixed(1)}GB`;
    }
  },
  xAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#DCDFE6'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#DCDFE6'
      }
    },
    axisLabel: {
      fontSize: 10,
      color: '#606266',
      formatter: '{value}GB'
    },
    splitLine: {
      lineStyle: {
        color: '#EBEEF5',
        type: 'solid'
      }
    }
  },
  yAxis: {
    type: 'category',
    data: [] as string[],
    inverse: true,
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
      color: '#606266',
      rotate: 0
    }
  },
  series: [
    {
      name: '已使用',
      type: 'bar',
      stack: 'total',
      barWidth: '30%',
      itemStyle: {
        color: '#5470c6'
      },
      label: {
        show: false
      },
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    },
    {
      name: '剩余',
      type: 'bar',
      stack: 'total',
      barWidth: '30%',
      itemStyle: {
        color: '#91cc75'
      },
      label: {
        show: false
      },
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    }
  ]
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
  
  const yAxisData: string[] = []
  const usedData: number[] = []
  const freeData: number[] = []
  
  chartData.rows.forEach(item => {
    yAxisData.push(item.path)
    usedData.push(item.used)
    freeData.push(item.free)
  })
  
  chart.setOption({
    yAxis: {
      data: yAxisData
    },
    series: [
      {
        data: usedData
      },
      {
        data: freeData
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
#ConsoleDisk {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>
