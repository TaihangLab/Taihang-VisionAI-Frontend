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
      const usedPercent = ((used / total) * 100).toFixed(1);
      return `${path}<br/>
              ${params[0].marker}已使用: ${used.toFixed(1)}GB (${usedPercent}%)<br/>
              ${params[1].marker}剩余: ${free.toFixed(1)}GB<br/>
              总计: ${total.toFixed(1)}GB`;
    },
    backgroundColor: '#5c6b77',
    borderWidth: 0,
    textStyle: {
      color: '#fff'
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
        show: true,
        position: 'inside',
        formatter: (params: any) => {
          const total = params.value + option.series[1].data[params.dataIndex];
          const percent = ((params.value / total) * 100).toFixed(0);
          return params.value > 0 ? `${percent}%` : '';
        },
        fontSize: 10,
        color: '#FFFFFF'
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
    
    // 窗口大小变化时自动调整图表大小
    window.addEventListener('resize', () => {
      chart?.resize()
    })
    
    console.log('磁盘图表初始化完成')
  }
}

/**
 * 更新图表
 */
const updateChart = () => {
  if (!chart) {
    return
  }
  
  console.log('更新磁盘图表数据：', chartData.rows)
  
  const dataSource = chartData.rows.map((item: any) => ({
    ...item,
    used: Number(item.used.toFixed(1)),
    free: Number(item.free.toFixed(1))
  }))
  
  // 从数据中获取所有路径
  const paths = dataSource.map((item: any) => item.path)
  // 从数据中获取所有已使用值
  const used = dataSource.map((item: any) => item.used)
  // 从数据中获取所有剩余值
  const free = dataSource.map((item: any) => item.free)
  
  console.log('路径：', paths)
  console.log('已用：', used)
  console.log('可用：', free)
  
  // 更新选项
  option.yAxis.data = paths
  option.series[0].data = used
  option.series[1].data = free
  
  // 设置图表选项
  chart.setOption(option, true)
  
  console.log('已更新磁盘图表数据')
  
  // 添加基准线
  addBaseline()
}

/**
 * 添加基准线
 */
const addBaseline = () => {
  if (!chart) return
  
  try {
    // 获取当前的option配置
    const currentOption = chart.getOption()
    
    // 修改X轴配置，添加0值基准线
    const xAxisOption = {
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
      },
      // 添加零刻度线高亮
      minorSplitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(180, 180, 180, 0.5)'
        }
      }
    }
    
    // 更新配置
    chart.setOption({
      xAxis: xAxisOption
    })
    
    console.log('已添加基准线')
  } catch (error) {
    console.error('添加基准线失败:', error)
  }
}

// 设置数据方法（供父组件调用）
const setData = (data: any[]) => {
  // 确保数据是数组且有效
  if (!data || !Array.isArray(data)) {
    console.warn('磁盘数据无效:', data);
    return;
  }
  
  // 处理并验证数据
  const validData = data.map(item => {
    // 检查路径字段
    const path = item.path || '未知';
    
    // 处理已使用字段 - 可能是used或use
    let used = 0;
    if (typeof item.used === 'number') {
      used = item.used;
    } else if (typeof item.used === 'string') {
      used = parseFloat(item.used);
    } else if (typeof item.use === 'number') {
      used = item.use;
    } else if (typeof item.use === 'string') {
      used = parseFloat(item.use);
    }
    
    // 处理剩余空间字段
    let free = 0;
    if (typeof item.free === 'number') {
      free = item.free;
    } else if (typeof item.free === 'string') {
      free = parseFloat(item.free);
    } else if (typeof item.available === 'number') {
      free = item.available;
    } else if (typeof item.available === 'string') {
      free = parseFloat(item.available);
    }
    
    // 确保值为非负数
    used = isNaN(used) ? 0 : Math.max(0, used);
    free = isNaN(free) ? 0 : Math.max(0, free);
    
    return { path, used, free };
  }).filter(item => 
    // 过滤掉无效数据
    item.path !== '未知' && (item.used > 0 || item.free > 0)
  );
  
  // 按使用率排序(已使用/总容量)
  validData.sort((a, b) => {
    const totalA = a.used + a.free;
    const totalB = b.used + b.free;
    const usedPercentA = totalA > 0 ? a.used / totalA : 0;
    const usedPercentB = totalB > 0 ? b.used / totalB : 0;
    return usedPercentB - usedPercentA; // 降序排列，使用率高的在上面
  });
  
  if (validData.length === 0) {
    console.warn('没有有效的磁盘数据');
    return;
  }
  
  console.log('有效磁盘数据:', validData);
  
  // 更新数据
  chartData.rows = validData;
  
  // 下一帧更新图表
  nextTick(() => {
    if (!chart) {
      initChart();
    }
    updateChart();
  });
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
