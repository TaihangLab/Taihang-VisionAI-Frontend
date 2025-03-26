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
      const value = parseFloat(param.value).toFixed(2)
      return param.name + "<br/> " 
        + '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#50a3f8;"></span>' 
        + "内存使用率  " + value + "%"
    },
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    borderWidth: 0,
    textStyle: {
      color: '#fff'
    },
    axisPointer: {
      type: 'line',
      label: {
        formatter: (params: any) => {
          const value = params.value;
          if (typeof value === 'number') {
            return value.toFixed(2) + '%';
          }
          return value;
        }
      },
      lineStyle: {
        color: '#cccccc',
        width: 1
      }
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
  }],
}

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    // 确保图表容器存在
    try {
      if (!chart) {
        chart = echarts.init(chartRef.value)
      }
      // 使用克隆的选项以避免引用问题
      chart.setOption(JSON.parse(JSON.stringify(option)), true)
    } catch (error) {
      console.error('初始化内存图表出错:', error)
    }
  }
}

// 更新图表数据
const updateChart = () => {
  if (!chart) {
    initChart()
    if (!chart) return
  }
  
  try {
    // 处理时间数据
    const times: string[] = []
    const values: number[] = []
    
    // 添加详细调试输出
    console.log('内存数据详细信息:', JSON.stringify(chartData.rows))
    
    chartData.rows.forEach(item => {
      if (item && typeof item === 'object') {
        // 确保数据有效
        if (!item.time) {
          console.warn('内存数据缺少time字段:', item)
          return
        }
        
        // 格式化时间为HH:MM:SS
        try {
          let time;
          if (typeof item.time === 'string' && item.time.includes('-')) {
            // 如果是标准日期字符串格式 (如 "2023-03-24 12:34:56")
            const parts = item.time.split(' ');
            if (parts.length > 1) {
              // 只保留时间部分
              times.push(parts[1]);
            } else {
              times.push(item.time);
            }
          } else {
            // 如果是时间戳格式
            time = new Date(item.time);
            const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
            times.push(timeStr);
          }
          
          // 确保percent是数字
          let percentValue = 0;
          if (typeof item.percent === 'number') {
            percentValue = item.percent;
            
            // 检查是否为小数形式的百分比(0-1范围)，如是则转换为0-100范围
            if (percentValue > 0 && percentValue < 1) {
              percentValue = percentValue * 100;
              console.log(`将小数形式的百分比 ${item.percent} 转换为 ${percentValue}%`);
            }
          } else if (typeof item.percent === 'string') {
            percentValue = parseFloat(item.percent);
            
            // 检查是否为小数形式的百分比
            if (percentValue > 0 && percentValue < 1) {
              percentValue = percentValue * 100;
              console.log(`将字符串形式的小数百分比 ${item.percent} 转换为 ${percentValue}%`);
            }
          }
          
          console.log(`处理内存数据: 时间=${times[times.length-1]}, percent=${percentValue}, 原始数据:`, JSON.stringify(item));
          // 确保所有值都是两位小数
          values.push(parseFloat(percentValue.toFixed(2)));
        } catch (e) {
          console.warn('内存时间格式化错误:', item.time, e)
        }
      }
    })
    
    // 如果没有足够的数据点，直接使用空数组
    if (times.length === 0) {
      console.warn('内存数据为空，无法渲染图表')
    }
    
    // 限制显示最近30个数据点
    const maxDataPoints = 30
    if (times.length > maxDataPoints) {
      times.splice(0, times.length - maxDataPoints)
      values.splice(0, values.length - maxDataPoints)
    }
    
    // 使用异步方式更新
    setTimeout(() => {
      if (chart) {
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
    }, 0)
  } catch (error) {
    console.error('更新内存图表数据出错:', error)
  }
}

// 设置数据方法（供父组件调用）
const setData = (data: any[]) => {
  if (!data || !Array.isArray(data)) {
    console.warn('内存数据无效:', data)
    return
  }
  
  // 克隆数据以避免引用问题
  chartData.rows = JSON.parse(JSON.stringify(data))
  
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
    // 使用异步方式调整大小
    setTimeout(() => {
      if (chart) chart.resize()
    }, 0)
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
