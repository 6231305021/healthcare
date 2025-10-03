<template>
  <canvas ref="chartRef" style="width:100%;max-height:300px"></canvas>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({ 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: true } }
      })
    }
  },
  setup(props) {
    const chartRef = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (!chartRef.value) return;
      const ctx = chartRef.value.getContext('2d');
      
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      
      // ตรวจสอบข้อมูลก่อนวาด
      if (props.chartData.datasets && props.chartData.datasets.length > 0) {
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: props.chartData,
          options: props.chartOptions
        });
      }
    };

    onMounted(() => renderChart());
    // ใช้ deep watch เพื่อจับการเปลี่ยนแปลงของข้อมูลภายใน Object
    watch(() => props.chartData, () => renderChart(), { deep: true });
    watch(() => props.chartOptions, () => renderChart(), { deep: true });

    return { chartRef };
  }
};
</script>

<style scoped>
/* สามารถเพิ่ม style สำหรับกราฟได้ที่นี่ถ้าต้องการ */
</style>