<template>
  <div id="ConsoleNodeLoad" style="width: 100%; height: 100%; background: #FFFFFF; text-align: center">
    <div class="chart-title">节点负载</div>
    <div ref="chartRef" style="width: 100%; height: calc(100% - 30px);"></div>
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
  rows: [] // 初始为空数组，由父组件通过setData方法提供真实数据
})

// 图表配置
const option = {
  backgroundColor: '#FFFFFF',
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
    itemWidth: 25,
    itemHeight: 10,
    textStyle: {
      fontSize: 12,
      color: '#606266'
    },
    icon: 'rect',
    itemGap: 25,
    padding: [5, 0, 5, 0]
  },
  grid: {
    top: 40,
    left: '5%', 
    right: '5%',
    bottom: 50,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLine: {
      lineStyle: {
        color: '#DCDFE6'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      fontSize: 12,
      color: '#606266',
      rotate: 0,
      margin: 16
    }
  },
  yAxis: {
    type: 'value',
    name: '',
    max: function(value) {
      return value.max <= 2 ? 2 : Math.ceil(value.max);
    },
    interval: 0.5,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#DCDFE6'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      fontSize: 12,
      color: '#606266',
      margin: 16
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
      stack: false,
      barWidth: '10%',
      barGap: '80%',
      itemStyle: {
        color: '#36CFC9' // 青绿色
      },
      emphasis: {
        focus: 'series'
      },
      label: {
        show: true,
        position: 'top',
        distance: 2,
        formatter: function(params) {
          return params.value.toString();
        },
        fontSize: 12,
        color: '#36CFC9',
        fontWeight: 'normal',
        offset: [0, -2]
      },
      z: 10,
      data: []
    },
    {
      name: '拉流代理',
      type: 'bar',
      stack: false,
      barWidth: '10%',
      barGap: '80%',
      itemStyle: {
        color: '#5AC8FA' // 蓝色
      },
      emphasis: {
        focus: 'series'
      },
      label: {
        show: true,
        position: 'top',
        distance: 2,
        formatter: function(params) {
          return params.value.toString();
        },
        fontSize: 12,
        color: '#5AC8FA',
        fontWeight: 'normal',
        offset: [0, -2]
      },
      z: 10,
      data: []
    },
    {
      name: '国标收流',
      type: 'bar',
      stack: false,
      barWidth: '10%',
      barGap: '80%',
      itemStyle: {
        color: '#FF596A' // 红色
      },
      emphasis: {
        focus: 'series'
      },
      label: {
        show: true,
        position: 'top',
        distance: 2,
        formatter: function(params) {
          return params.value.toString();
        },
        fontSize: 12,
        color: '#FF596A',
        fontWeight: 'normal',
        offset: [0, -2]
      },
      z: 10,
      data: []
    },
    {
      name: '国标推流',
      type: 'bar',
      stack: false,
      barWidth: '10%',
      barGap: '80%',
      itemStyle: {
        color: '#FFBB33' // 黄色
      },
      emphasis: {
        focus: 'series'
      },
      label: {
        show: true,
        position: 'top',
        distance: 2,
        formatter: function(params) {
          return params.value.toString();
        },
        fontSize: 12,
        color: '#FFBB33',
        fontWeight: 'normal',
        offset: [0, -2]
      },
      z: 10,
      data: []
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
    
    // 添加基线
    addBaseline()
  }
}

// 添加基线
const addBaseline = () => {
  if (!chart) return;
  
  // 绘制底部基准线，让0值柱子位置更加明显
  chart.setOption({
    grid: {
      top: 40,
      left: '5%', 
      right: '5%',
      bottom: 50,
      containLabel: true
    },
    // 添加纵向网格线，使0值位置更明显
    xAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F0F0F0',
          width: 1,
          type: 'solid'
        }
      }
    },
    // 添加基准线图形元素
    graphic: [{
      type: 'rect',
      left: '5%',
      right: '5%',
      bottom: '50px',
      z: 1,
      bounding: 'raw',
      shape: {
        width: '90%',
        height: 2
      },
      style: {
        fill: '#CCCCCC'
      }
    }]
  });
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
    // 确保使用真实数据，并转为数字类型
    pushData.push(Number(item.push) || 0)
    proxyData.push(Number(item.proxy) || 0)
    gbReceiveData.push(Number(item.gbReceive) || 0)
    gbSendData.push(Number(item.gbSend) || 0)
  })
  
  // 计算数据的最大值，用于动态设置Y轴最大值
  const allValues = [...pushData, ...proxyData, ...gbReceiveData, ...gbSendData];
  const maxValue = Math.max(...allValues, 2); // 至少为2
  
  console.log('节点负载图表数据更新：', {
    ids: xAxisData,
    push: pushData,
    proxy: proxyData,
    gbReceive: gbReceiveData,
    gbSend: gbSendData
  });
  
  chart.setOption({
    xAxis: {
      data: xAxisData
    },
    yAxis: {
      max: function() {
        return maxValue <= 2 ? 2 : Math.ceil(maxValue);
      }
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
  
  // 处理x轴标签，避免重叠
  processXAxisLabels()
  
  // 确保基线显示
  addBaseline()
}

// 设置数据方法（供父组件调用）
const setData = (data: any[]) => {
  // 确保数据是数组
  if (!data || !Array.isArray(data)) {
    console.warn('节点负载数据无效:', data);
    return;
  }
  
  // 处理数据，确保数据字段完整且格式正确
  const processedData = data.map(item => {
    // 确保ID字段存在
    const id = item.id || '未知节点';
    
    // 确保所有数值字段为数字类型且有效
    const push = typeof item.push === 'number' ? item.push : 
                (typeof item.push === 'string' ? parseFloat(item.push) : 0);
    
    const proxy = typeof item.proxy === 'number' ? item.proxy : 
                 (typeof item.proxy === 'string' ? parseFloat(item.proxy) : 0);
    
    const gbReceive = typeof item.gbReceive === 'number' ? item.gbReceive : 
                     (typeof item.gbReceive === 'string' ? parseFloat(item.gbReceive) : 0);
    
    const gbSend = typeof item.gbSend === 'number' ? item.gbSend : 
                  (typeof item.gbSend === 'string' ? parseFloat(item.gbSend) : 0);
    
    return {
      id, 
      push: isNaN(push) ? 0 : push,
      proxy: isNaN(proxy) ? 0 : proxy,
      gbReceive: isNaN(gbReceive) ? 0 : gbReceive,
      gbSend: isNaN(gbSend) ? 0 : gbSend
    };
  });
  
  console.log('处理后的节点负载数据:', processedData);
  
  // 更新图表数据
  chartData.rows = processedData;
  
  nextTick(() => {
    // 根据节点数量动态调整柱状图宽度
    adjustBarWidth();
    updateChart();
  });
}

// 根据节点数量动态调整柱状图宽度
const adjustBarWidth = () => {
  if (!chart) return
  
  const nodeCount = chartData.rows.length
  let barWidth = '10%'
  
  // 根据节点数量动态调整柱宽
  if (nodeCount > 1) {
    if (nodeCount <= 3) {
      barWidth = '8%'
    } else if (nodeCount <= 5) {
      barWidth = '6%'
    } else if (nodeCount <= 8) {
      barWidth = '5%'
    } else {
      barWidth = '4%'
    }
  }
  
  // 更新所有系列的柱状图宽度
  chart.setOption({
    series: [
      { barWidth },
      { barWidth },
      { barWidth },
      { barWidth }
    ]
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

// 当节点数量增加时处理x轴标签
const processXAxisLabels = () => {
  // 如果节点数量较多，则旋转标签以避免重叠
  if (chartData.rows.length > 1) {
    if (chart) {
      const rotate = chartData.rows.length > 3 ? 45 : 30;
      chart.setOption({
        xAxis: {
          axisLabel: {
            rotate: rotate,
            fontSize: 10
          }
        }
      });
    }
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
  padding: 10px;
  height: 100%;
  background-color: #FFFFFF;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}
</style>
