<template>
  <v-container fluid class="py-4">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="12" class="pa-4 rounded-xl">
          <v-card-title class="font-weight-bold text-h5">
            <v-icon left color="primary">mdi-chart-line</v-icon>
            กราฟการติดตามสุขภาพรายวัน
          </v-card-title>
          <v-card-text>
            <div v-if="loading" class="text-center my-4">กำลังโหลดข้อมูล...</div>
            <line-chart v-else :chart-data="chartData" :chart-options="chartOptions"></line-chart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top timeout="3000">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">ปิด</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';
import { showErrorAlert } from '../utils/sweetAlert';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
  components: {
    LineChart: {
      extends: Line,
      props: ['chartData', 'chartOptions'],
      mounted() { this.renderChart(this.chartData, this.chartOptions); }
    }
  },
  data() {
    return {
      trackingData: [],
      loading: false,
      chartData: { labels: [], datasets: [] },
      chartOptions: { responsive: true, maintainAspectRatio: false },
      snackbar: { show: false, text: '', color: '' }
    };
  },
  mounted() {
    this.fetchDailyTracking();
  },
  methods: {
    async fetchDailyTracking() {
      this.loading = true;
      try {
        const res = await axios.get('https://healthcare-production-1567.up.railway.app/tracking/daily');
        if (res.data?.tracking) {
          this.trackingData = res.data.tracking;
          this.prepareChart();
        } else {
          this.showSnackbar('ไม่พบข้อมูลการติดตาม', 'warning');
        }
      } catch (error) {
        console.error(error);
        showErrorAlert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        this.loading = false;
      }
    },
    prepareChart() {
      this.chartData.labels = this.trackingData.map(item => new Date(item.date).toLocaleDateString('th-TH'));
      this.chartData.datasets = [
        {
          label: 'น้ำหนัก (kg)',
          data: this.trackingData.map(item => item.weight),
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76,175,80,0.2)',
          fill: true,
        },
        {
          label: 'ความดัน (mmHg)',
          data: this.trackingData.map(item => item.blood_pressure),
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33,150,243,0.2)',
          fill: true,
        }
      ];
    },
    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
};
</script>

<style scoped>
.v-card { transition: 0.3s; }
.v-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
#line-chart { height: 300px; }
</style>
