<template>
  <div id="ConsoleNet" style="width: 100%; height: 100%; background: #FFFFFF; text-align: center">
    <div ref="chartRef" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { format } from 'date-fns'

// 图表DOM引用
const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

// 数据
const chartData = reactive({
  columns: ['time', 'out', 'in'],
  rows: [] as any[]
})

// 默认最大值
let maxYValue = 120

// 选择状态
const legendSelected = reactive({
  '上传': true,
  '下载': true
})

// 图表配置
const option = {
  title: {
    show: true,
    text: "网络",
    left: "center",
    top: 20,
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333'
    }
  },
  grid: {
    show: true,
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
        color: '#ddd'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#ddd'
      }
    },
    axisLabel: {
      formatter: (v: string) => {
        return format(new Date(parseInt(v)), 'HH:mm:ss')
      },
      showMaxLabel: true,
      fontSize: 12,
      color: '#666'
    }
  },
  yAxis: {
    type: 'value',
    name: 'KB/s',
    nameTextStyle: {
      fontSize: 12,
      color: '#666'
    },
    min: 0,
    max: maxYValue,
    splitNumber: 6,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#ddd'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#ddd'
      }
    },
    axisLabel: {
      fontSize: 12,
      color: '#666',
      formatter: (v: number) => {
        return v + ""
      }
    },
    splitLine: {
      lineStyle: {
        color: '#eee',
        type: 'dashed'
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    },
    formatter: (params: any) => {
      if (params.length === 0) return ''
      
      let result = format(new Date(parseInt(params[0].axisValue)), 'HH:mm:ss') + '<br/>'
      
      for (let i = 0; i < params.length; i++) {
        const param = params[i]
        if (legendSelected[param.seriesName]) {
          result += param.marker + param.seriesName + '：' + parseFloat(param.value[1]).toFixed(2) + ' KB/s<br/>'
        }
      }
      
      return result
    }
  },
  legend: {
    left: "center",
    bottom: 5,
    itemWidth: 12,
    itemHeight: 8,
    icon: 'rect',
    textStyle: {
      fontSize: 12,
      color: '#666'
    },
    selectedMode: 'multiple',
    selected: legendSelected,
    data: ['上传', '下载']
  },
  series: [
    {
      name: '上传',
      type: 'line',
      smooth: true,
      data: [] as any[],
      symbol: 'none',
      sampling: 'average',
      lineStyle: {
        width: 2
      },
      itemStyle: {
        color: "#50a3f8"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(80, 163, 248, 0.3)'
          },
          {
            offset: 1,
            color: 'rgba(80, 163, 248, 0)'
          }
        ])
      }
    },
    {
      name: '下载',
      type: 'line',
      smooth: true,
      data: [] as any[],
      symbol: 'none',
      sampling: 'average',
      lineStyle: {
        width: 2
      },
      itemStyle: {
        color: "#ff7849"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(255, 120, 73, 0.3)'
          },
          {
            offset: 1,
            color: 'rgba(255, 120, 73, 0)'
          }
        ])
      }
    }
  ]
}

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    // 确保容器存在
    if (!chart) {
      chart = echarts.init(chartRef.value)
      
      // 添加图例切换事件
      chart.on('legendselectchanged', (params) => {
        Object.assign(legendSelected, params.selected)
      })
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
  
  const xAxisData: string[] = []
  const outData: any[] = []
  const inData: any[] = []
  
  chartData.rows.forEach(item => {
    const timeStr = item.time.toString()
    xAxisData.push(timeStr)
    outData.push([timeStr, item.upload])
    inData.push([timeStr, item.download])
  })
  
  chart.setOption({
    xAxis: {
      data: xAxisData
    },
    yAxis: {
      max: maxYValue
    },
    series: [
      {
        data: outData
      },
      {
        data: inData
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
#ConsoleNet {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>
