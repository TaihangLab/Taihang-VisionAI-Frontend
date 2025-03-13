<template>
  <div class="color-block-carousel">
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="(color, index) in colors" :key="index" :style="{ backgroundColor: color }">
        <div class="color-block"></div>
      </el-carousel-item>
    </el-carousel>
    
    <div class="notification-module">
      <h2>通知</h2>
      <p>{{ notificationModule }}</p>
    </div>
    
    <div class="data-display-module">
      <h2>数据展示</h2>
      <ul>
        <li v-for="(data, index) in simulatedData" :key="index">{{ data }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const colors = ref([
  '#FF5733', // Red
  '#33FF57', // Green
  '#3357FF', // Blue
  '#F1C40F', // Yellow
  '#8E44AD', // Purple
  // Add more colors as needed
]);

const notificationModule = ref('您有新的消息！请查看。');

const simulatedData = ref([
  '数据项 1: 100',
  '数据项 2: 200',
  '数据项 3: 300',
  '数据项 4: 400',
  '数据项 5: 500',
]);
</script>

<style scoped lang="scss">
.color-block-carousel {
  .color-block {
    width: 100%;
    height: 300px; // Set a fixed height for the color blocks
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    font-weight: bold;
  }

  .notification-module {
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    
    h2 {
      margin: 0 0 10px;
      color: #333;
    }
    
    p {
      color: #555;
    }
  }

  .data-display-module {
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    
    h2 {
      margin: 0 0 10px;
      color: #333;
    }
    
    ul {
      list-style-type: none;
      padding: 0;
      
      li {
        padding: 5px 0;
        color: #555;
      }
    }
  }
}
</style>



