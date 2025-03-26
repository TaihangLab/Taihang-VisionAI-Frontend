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
let maxYValue = 10

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
        try {
          // 确保v是数字字符串，避免非数字解析错误
          if (v.includes('-')) {
            // 如果是标准日期字符串，直接格式化为时分秒
            return v.split(' ')[1] || '';
          }
          const timestamp = isNaN(parseInt(v)) ? Date.now() : parseInt(v);
          return format(new Date(timestamp), 'HH:mm:ss');
        } catch (e) {
          console.error('格式化x轴标签失败:', v, e);
          return '';
        }
      },
      showMaxLabel: true,
      fontSize: 12,
      color: '#666'
    }
  },
  yAxis: {
    type: 'value',
    name: 'Mbps',
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
        // 将放大后的值转换回实际值显示
        return (v / 100).toFixed(2)
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
        backgroundColor: '#6a7985',
        formatter: (params: any) => {
          const value = params.value;
          if (typeof value === 'number') {
            // 将放大后的值转换回实际值显示
            return (value / 100).toFixed(2);
          }
          return value;
        }
      }
    },
    formatter: (params: any) => {
      if (params.length === 0) return ''
      
      let result = '';
      
      // 处理不同格式的时间显示
      const axisValue = params[0].axisValue;
      if (typeof axisValue === 'string') {
        if (axisValue.includes('-')) {
          // 如果包含日期，可能是完整的时间字符串
          const parts = axisValue.split(' ');
          if (parts.length > 1) {
            result = parts[1] + '<br/>';
          } else {
            result = axisValue + '<br/>';
          }
        } else if (axisValue.includes(':')) {
          // 如果只包含时分秒
          result = axisValue + '<br/>';
        } else {
          // 可能是时间戳
          try {
            result = format(new Date(parseInt(axisValue)), 'HH:mm:ss') + '<br/>';
          } catch (e) {
            result = axisValue + '<br/>';
          }
        }
      } else {
        result = axisValue + '<br/>';
      }
      
      for (const param of params) {
        if (legendSelected[param.seriesName]) {
          // 显示实际值，而不是内部放大后的值
          const actualValue = (parseFloat(param.value[1]) / 100).toFixed(2);
          result += '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + param.color + ';"></span>' 
            + param.seriesName + ':  ' + actualValue + 'Mbps<br/>'
        }
      }
      
      return result
    },
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    borderWidth: 0,
    textStyle: {
      color: '#fff'
    },
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
    // 确保图表容器存在
    try {
      if (!chart) {
        chart = echarts.init(chartRef.value)
        
        // 添加图例切换事件
        chart.on('legendselectchanged', (params: any) => {
          Object.assign(legendSelected, params.selected)
        })
      }
      
      // 使用克隆的选项以避免引用问题
      chart.setOption(JSON.parse(JSON.stringify(option)), true)
    } catch (error) {
      console.error('初始化网络图表出错:', error)
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
    const xAxisData: string[] = []
    const outData: any[] = []
    const inData: any[] = []
    
    // 添加详细调试输出
    console.log('网络数据详细信息:', JSON.stringify(chartData.rows))
    
    // 计算最大Y轴值以适应数据
    let maxValue = 0
    
    chartData.rows.forEach(item => {
      if (item && typeof item === 'object') {
        // 确保数据有效
        if (!item.time) {
          console.warn('网络数据缺少time字段:', item)
          return
        }
        
        try {
          // 处理不同格式的时间字符串
          let timeStr;
          if (typeof item.time === 'string' && item.time.includes('-')) {
            // 如果是标准日期字符串格式 (如 "2023-03-24 12:34:56")
            const parts = item.time.split(' ');
            if (parts.length > 1) {
              // 只保留时间部分
              timeStr = parts[1];
            } else {
              timeStr = item.time;
            }
          } else {
            // 如果是时间戳格式
            const time = new Date(item.time);
            timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
          }
          
          // 处理不同单位的数据，确保转换为Mbps
          let uploadValue = 0;
          let downloadValue = 0;
          
          // 检查多种可能的字段名
          if (typeof item.upload === 'number') {
            uploadValue = item.upload;
          } else if (typeof item.out === 'number') {
            uploadValue = item.out;
          } else if (typeof item.tx === 'number') {
            uploadValue = item.tx;
          } else if (typeof item.upload === 'string') {
            uploadValue = parseFloat(item.upload);
          }
          
          if (typeof item.download === 'number') {
            downloadValue = item.download;
          } else if (typeof item.in === 'number') {
            downloadValue = item.in;
          } else if (typeof item.rx === 'number') {
            downloadValue = item.rx;
          } else if (typeof item.download === 'string') {
            downloadValue = parseFloat(item.download);
          }
          
          // 将数据转换为Mbps (8 bits = 1 byte)
          // 如果原始数据单位是KB/s，需要转换: KB/s * 8 / 1024 = Mbps
          // 放大100倍以便在图表中清晰显示
          uploadValue = ((uploadValue * 8) / 1024) * 100;
          downloadValue = ((downloadValue * 8) / 1024) * 100;
          
          // 确保数值保留两位小数
          uploadValue = parseFloat(uploadValue.toFixed(2));
          downloadValue = parseFloat(downloadValue.toFixed(2));
          
          console.log(`处理网络数据: 时间=${timeStr}, 上传=${(uploadValue/100).toFixed(2)}Mbps (显示值: ${uploadValue.toFixed(2)}), 下载=${(downloadValue/100).toFixed(2)}Mbps (显示值: ${downloadValue.toFixed(2)})`);
          
          xAxisData.push(timeStr)
          outData.push([timeStr, uploadValue])
          inData.push([timeStr, downloadValue])
          
          // 更新最大值以便Y轴调整
          maxValue = Math.max(maxValue, uploadValue, downloadValue)
        } catch (e) {
          console.warn('网络数据处理错误:', item, e)
        }
      }
    })
    
    // 如果没有足够的数据点，直接使用空数组
    if (xAxisData.length === 0) {
      console.warn('网络数据为空，无法渲染图表')
    }
    
    // 设置Y轴最大值，添加一些余量
    maxYValue = Math.max(10, Math.ceil(maxValue * 1.2))
    
    // 限制显示最近30个数据点
    const maxDataPoints = 30
    if (xAxisData.length > maxDataPoints) {
      const start = xAxisData.length - maxDataPoints
      xAxisData.splice(0, start)
      outData.splice(0, start)
      inData.splice(0, start)
    }
    
    // 使用异步方式更新
    setTimeout(() => {
      if (chart) {
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
    }, 0)
  } catch (error) {
    console.error('更新网络图表数据出错:', error)
  }
}

// 设置数据方法（供父组件调用）
const setData = (data: any[]) => {
  if (!data || !Array.isArray(data)) {
    console.warn('网络数据无效:', data)
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
#ConsoleNet {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>
