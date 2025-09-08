<template>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-clipboard-pulse</v-icon>
        กราฟติดตามข้อมูลสุขภาพ: {{ patientName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="goToUserPage">
          <v-icon left>mdi-account</v-icon>
          ข้อมูลส่วนตัว
        </v-btn>
        <v-btn text @click="goToAddPatient">
          <v-icon left>mdi-account-plus</v-icon>
          เพิ่มผู้ป่วยใหม่
        </v-btn>
        <v-btn text @click="goToPatientInfo">
          <v-icon left>mdi-account-group</v-icon>
          ข้อมูลผู้ป่วย
        </v-btn>
        <v-btn text @click="goToMapPage">
          <v-icon left>mdi-map-marker-multiple</v-icon>
          แผนที่ผู้ป่วย
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToUserPage">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToAddPatient">
          <v-list-item-icon>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToPatientInfo">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToMapPage">
          <v-list-item-icon>
            <v-icon>mdi-map-marker-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-4 fill-height d-flex flex-column">
        <v-card elevation="8" class="pa-4 rounded-lg flex-grow-1">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon left color="primary">mdi-chart-line</v-icon>
            กราฟแสดงข้อมูลสุขภาพ
          </v-card-title>

          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="จากวันที่"
                type="date"
                v-model="startDate"
                @change="applyFilter"
                outlined
                dense
                clearable
                prepend-inner-icon="mdi-calendar-start"
                color="primary"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="ถึงวันที่"
                type="date"
                v-model="endDate"
                @change="applyFilter"
                outlined
                dense
                clearable
                prepend-inner-icon="mdi-calendar-end"
                color="primary"
              />
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-btn color="primary" @click="resetDates" outlined class="ml-auto">
                <v-icon left>mdi-refresh</v-icon>
                รีเซ็ตวันที่
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-if="filteredData.length" class="flex-grow-1">
            <v-col cols="12" md="6" v-for="(chartConfig, index) in chartConfigs" :key="index" class="d-flex">
              <v-card class="mb-4 pa-4 rounded-lg elevation-2 flex-grow-1 chart-card">
                <v-card-title class="text-h6 font-weight-semibold pb-2 d-flex justify-space-between align-center" :style="{ color: chartConfig.color }">
                  <span>{{ chartConfig.label }}</span>
                  <v-btn icon small color="primary" @click="exportSingleChart(index)">
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-0 d-flex flex-column flex-grow-1">
                  <canvas :ref="el => chartRefs[index] = el" class="chart-canvas"></canvas>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-alert v-else class="mt-6 text-center" prominent type="info">
            <v-icon left>mdi-information</v-icon>
            ไม่พบข้อมูลในช่วงเวลาที่เลือก
          </v-alert>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import axios from 'axios';
import Swal from 'sweetalert2';
import JSZip from 'jszip';

export default {
  name: 'DailyTrackingGraph',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const drawer = ref(false);
    const patientId = ref(route.query.patientId || '');
    const patientName = ref('กำลังโหลด...');
    const startDate = ref('');
    const endDate = ref('');
    const filteredData = ref([]);
    const allData = ref([]);
    const chartRefs = reactive([]);
    const chartInstances = ref([]);
    const exportingAll = ref(false);
    const exportingCharts = ref([]);

    const chartConfigs = [
      { key: 'temperature', label: 'อุณหภูมิ (°C)', color: '#e74c3c' },
      { key: 'blood_pressure_systolic', label: 'SBP (ความดันบน)', color: '#3498db' },
      { key: 'blood_pressure_diastolic', label: 'DBP (ความดันล่าง)', color: '#1abc9c' },
      { key: 'pulse_rate', label: 'ชีพจร (ครั้ง/นาที)', color: '#2ecc71' },
      { key: 'respiratory_rate', label: 'อัตราการหายใจ (ครั้ง/นาที)', color: '#f39c12' },
      { key: 'blood_sugar', label: 'ระดับน้ำตาลในเลือด (mg/dL)', color: '#9b59b6' }
    ];

    const fetchData = async () => {
      try {
        const res = await axios.get(`https://healthcare-production-1567.up.railway.app/auth/${patientId.value}`);
        allData.value = res.data.map(item => ({ ...item, recorded_at: new Date(item.recorded_at) }));
        filteredData.value = [...allData.value];
        nextTick(drawCharts);
      } catch (err) {
        console.error(err);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลผู้ป่วยได้', 'error');
      }
    };

    const drawCharts = () => {
      chartInstances.value.forEach(c => c.destroy());
      chartInstances.value = [];

      chartConfigs.forEach((config, index) => {
        const ctx = chartRefs[index]?.getContext('2d');
        if (!ctx) return;
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: filteredData.value.map(d => d.recorded_at.toLocaleDateString('th-TH')),
            datasets: [{ label: config.label, data: filteredData.value.map(d => d[config.key]), borderColor: config.color, backgroundColor: config.color + '33', tension: 0.4, fill: true }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
        chartInstances.value.push(chart);
      });
    };

    const applyFilter = () => {
      let data = [...allData.value];
      if (startDate.value) data = data.filter(d => d.recorded_at >= new Date(startDate.value));
      if (endDate.value) data = data.filter(d => d.recorded_at <= new Date(endDate.value + 'T23:59:59'));
      filteredData.value = data.sort((a,b) => a.recorded_at - b.recorded_at);
      nextTick(drawCharts);
    };

    const resetDates = () => { startDate.value = ''; endDate.value = ''; filteredData.value = [...allData.value]; nextTick(drawCharts); };

    const exportSingleChart = async (index) => {
      if (!chartInstances.value[index]) return;
      const chart = chartInstances.value[index];
      const link = document.createElement('a');
      link.download = `${chartConfigs[index].label}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = chart.canvas.toDataURL('image/png');
      link.click();
    };

    onMounted(fetchData);

    return {
      drawer, patientId, patientName, startDate, endDate,
      filteredData, chartConfigs, chartRefs, chartInstances,
      exportingAll, exportingCharts,
      goToUserPage: () => router.push('/profile'),
      goToAddPatient: () => router.push('/Addpatient'),
      goToPatientInfo: () => router.push('/patientinfo'),
      goToMapPage: () => router.push('/Map'),
      applyFilter, resetDates, exportSingleChart
    };
  }
};
</script>
