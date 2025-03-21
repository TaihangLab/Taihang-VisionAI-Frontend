<template>
  <div id="ConsoleNodeLoad" style="width: 100%; height: 100%; background: #FFFFFF; text-align: center">
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
  columns: ['id', 'push', 'proxy', 'gbReceive', 'gbSend'],
  rows: [] as any[]
})

// 图表配置
const option = {
  title: {
    show: true,
    text: "节点负载",
    left: "center",
    top: 20
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['直播推流', '拉流代理', '国标收流', '国标推流'],
    left: 'center',
    bottom: 5,
    itemWidth: 12,
    itemHeight: 10,
    textStyle: {
      fontSize: 12,
      color: '#606266'
    }
  },
  grid: {
    top: 60,
    left: '3%',
    right: '4%',
    bottom: '12%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [] as string[],
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
  yAxis: {
    type: 'value',
    max: 2,
    minInterval: 0.5,
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
      color: '#606266'
    },
    splitLine: {
      lineStyle: {
        color: '#EBEEF5',
        type: 'solid'
      }
    }
  },
  series: [
    {
      name: '直播推流',
      type: 'bar',
      stack: 'total',
      barWidth: '40%',
      itemStyle: {
        color: '#67c23a'
      },
      label: {
        show: true,
        fontSize: 10,
        color: '#ffffff',
        formatter: function(params: any) {
          return params.value > 0 ? params.value : '';
        }
      },
      data: [] as number[]
    },
    {
      name: '拉流代理',
      type: 'bar',
      stack: 'total',
      barWidth: '40%',
      itemStyle: {
        color: '#409eff'
      },
      label: {
        show: true,
        fontSize: 10,
        color: '#ffffff',
        formatter: function(params: any) {
          return params.value > 0 ? params.value : '';
        }
      },
      data: [] as number[]
    },
    {
      name: '国标收流',
      type: 'bar',
      stack: 'total',
      barWidth: '40%',
      itemStyle: {
        color: '#f56c6c'
      },
      label: {
        show: true,
        fontSize: 10,
        color: '#ffffff',
        formatter: function(params: any) {
          return params.value > 0 ? params.value : '';
        }
      },
      data: [] as number[]
    },
    {
      name: '国标推流',
      type: 'bar',
      stack: 'total',
      barWidth: '40%',
      itemStyle: {
        color: '#e6a23c'
      },
      label: {
        show: true,
        fontSize: 10,
        color: '#ffffff',
        formatter: function(params: any) {
          return params.value > 0 ? params.value : '';
        }
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
  
  const xAxisData: string[] = []
  const pushData: number[] = []
  const proxyData: number[] = []
  const gbReceiveData: number[] = []
  const gbSendData: number[] = []
  
  chartData.rows.forEach(item => {
    xAxisData.push(item.id)
    pushData.push(item.push)
    proxyData.push(item.proxy)
    gbReceiveData.push(item.gbReceive)
    gbSendData.push(item.gbSend)
  })
  
  // 查找最大值以设置y轴范围
  const allValues = [...pushData, ...proxyData, ...gbReceiveData, ...gbSendData];
  const stackedValues: number[] = [];
  
  for (let i = 0; i < xAxisData.length; i++) {
    let stackedValue = 0;
    if (i < pushData.length) stackedValue += pushData[i];
    if (i < proxyData.length) stackedValue += proxyData[i];
    if (i < gbReceiveData.length) stackedValue += gbReceiveData[i];
    if (i < gbSendData.length) stackedValue += gbSendData[i];
    stackedValues.push(stackedValue);
  }
  
  const maxStackedValue = stackedValues.length > 0 ? Math.max(...stackedValues) : 0;
  const yAxisMax = Math.max(2, Math.ceil(maxStackedValue * 1.2)); // 确保至少为2，并留出20%空间
  
  chart.setOption({
    yAxis: {
      max: yAxisMax
    },
    xAxis: {
      data: xAxisData
    },
    series: [
      {
        data: pushData
      },
      {
        data: proxyData
      },
      {
        data: gbReceiveData
      },
      {
        data: gbSendData
      }
    ]
  })
}

// 设置数据方法（供父组件调用）
const setData = (data: any[]) => {
  // 如果数据不足，添加虚拟数据
  if (data.length < 3) {
    const realData = [...data];
    if (realData.length > 0) {
      // 添加两个虚拟节点，数据为0
      data = [
        ...realData,
        {
          id: 'Node2',
          push: 4,
          proxy: 2,
          gbReceive: 1,
          gbSend: 3
        },
        {
          id: 'Node3',
          push: 2,
          proxy: 0,
          gbReceive: 2,
          gbSend: 1
        }
      ];
    }
  }
  
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
#ConsoleNodeLoad {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>
