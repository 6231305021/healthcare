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
                class="date-field"
              ></v-text-field>
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
                class="date-field"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-btn
                color="primary"
                @click="resetDates"
                class="ml-auto"
                outlined
              >
                <v-icon left>mdi-refresh</v-icon>
                รีเซ็ตวันที่
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row v-if="filteredData.length" class="flex-grow-1">
            <v-col cols="12" md="6" v-for="(chartConfig, index) in chartConfigs" :key="index" class="d-flex">
              <v-card class="mb-4 pa-4 rounded-lg elevation-2 flex-grow-1 chart-card">
                <v-card-title class="text-h6 font-weight-semibold pb-2" :style="{ color: chartConfig.color }">
                  {{ chartConfig.label }}
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
import Swal from 'sweetalert2'
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import axios from 'axios';

export default {
  name: 'DailyTrackingGraph',
  data() {
    return {
      drawer: false,
      patientId: null,
      patientName: '',
      startDate: '',
      endDate: '',
      chartRefs: [],
      chartConfigs: [
        {
          label: 'อุณหภูมิร่างกาย',
          color: '#FF6B6B',
          dataKey: 'temperature',
          unit: '°C'
        },
        {
          label: 'ความดันโลหิต',
          color: '#4ECDC4',
          dataKey: 'bloodPressure',
          unit: 'mmHg'
        },
        {
          label: 'อัตราการเต้นของหัวใจ',
          color: '#45B7D1',
          dataKey: 'heartRate',
          unit: 'bpm'
        },
        {
          label: 'ระดับน้ำตาลในเลือด',
          color: '#96CEB4',
          dataKey: 'bloodSugar',
          unit: 'mg/dL'
        }
      ],
      dailyData: []
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const patientId = ref(route.query.patientId || '');
    const allData = ref([]);
    const filteredData = ref([]);

    const startDate = ref('');
    const endDate = ref('');

    const chartInstances = ref([]);
    const chartRefs = [];

    const chartConfigs = [
      {
        key: 'temperature',
        label: 'อุณหภูมิ (°C)',
        color: '#e74c3c', // Stronger red
      },
      {
        key: 'blood_pressure_systolic',
        label: 'SBP (ความดันบน)',
        color: '#3498db', // Brighter blue
      },
      {
        key: 'blood_pressure_diastolic',
        label: 'DBP (ความดันล่าง)',
        color: '#1abc9c', // Teal
      },
      {
        key: 'pulse_rate',
        label: 'ชีพจร (ครั้ง/นาที)',
        color: '#2ecc71', // Emerald green
      },
      {
        key: 'respiratory_rate',
        label: 'อัตราการหายใจ (ครั้ง/นาที)',
        color: '#f39c12', // Orange
      },
      {
        key: 'blood_sugar',
        label: 'ระดับน้ำตาลในเลือด (mg/dL)',
        color: '#9b59b6', // Amethyst purple
      },
    ];

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/daily-tracking/${patientId.value}`);
        allData.value = res.data.map(item => ({
          ...item,
          recorded_at: new Date(item.recorded_at),
        }));
        filteredData.value = [...allData.value];
        nextTick(drawCharts);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    const applyFilter = () => {
      let data = [...allData.value];
      if (startDate.value) {
        const start = new Date(startDate.value);
        start.setHours(0, 0, 0, 0); // Set to start of the day
        data = data.filter(d => d.recorded_at >= start);
      }
      if (endDate.value) {
        const end = new Date(endDate.value);
        end.setHours(23, 59, 59, 999); // Set to end of the day
        data = data.filter(d => d.recorded_at <= end);
      }
      filteredData.value = data.sort((a, b) => a.recorded_at - b.recorded_at);
      nextTick(drawCharts);
    };

    const drawCharts = () => {
      chartInstances.value.forEach(chart => chart.destroy());
      chartInstances.value = [];

      chartConfigs.forEach((config, index) => {
        const labels = filteredData.value.map(d => d.recorded_at.toLocaleDateString('th-TH')); // Format date for readability
        const values = filteredData.value.map(d => d[config.key]);

        const ctx = chartRefs[index]?.getContext('2d');
        if (!ctx) return;

        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: config.label,
              data: values,
              borderColor: config.color,
              backgroundColor: config.color + '33',
              tension: 0.4, // Slightly more curved lines
              fill: true,
              pointBackgroundColor: config.color,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: config.color,
              pointRadius: 4,
              pointHoverRadius: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, // Allow custom height
            plugins: {
              title: { display: false },
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'วันที่',
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                },
                grid: {
                  display: false // Hide x-axis grid lines
                }
              },
              y: {
                title: {
                  display: true,
                  text: config.label,
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                },
                grid: {
                  color: '#e0e0e0' // Lighter grid lines
                }
              },
            },
          },
        });

        chartInstances.value.push(chart);
      });
    };

    const resetDates = () => {
      startDate.value = '';
      endDate.value = '';
      filteredData.value = [...allData.value];
      nextTick(drawCharts);
    };

    onMounted(fetchData);

    return {
      patientId,
      startDate,
      endDate,
      filteredData,
      chartConfigs,
      chartRefs,

      logout: () => {
        localStorage.removeItem('userToken');
        router.push('/');
      },
      goToUserPage: () => router.push('/profile'),
      goToAddPatient: () => router.push('/Addpatient'),
      goToPatientInfo: () => router.push('/patientinfo'),
      goToMapPage: () => router.push('/Map'),
      applyFilter,
      resetDates,
    };
  },
};
</script>

<style scoped>
.v-application {
  background-color: #f5f7fa !important;
  overflow-x: hidden;
  width: 100%;
}

.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.v-main {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
}

.v-container.fill-height {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  max-width: 100%;
  overflow-x: hidden;
}

.v-card.flex-grow-1 {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.v-card-text.d-flex.flex-column.flex-grow-1 {
  flex-grow: 1;
  width: 100%;
}

.v-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
  width: 100%;
}

.v-card-title {
  padding-bottom: 0px !important;
}

.chart-card {
  transition: all 0.3s ease;
  height: 100%;
  width: 100%;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12) !important;
}

.chart-canvas {
  width: 100% !important;
  height: 250px !important;
  margin-top: 16px;
}

.date-field {
  transition: all 0.3s ease;
}

.date-field:hover {
  transform: translateY(-1px);
}

.primary--text {
  color: #3498db !important;
}

.v-text-field--outlined.v-input--dense .v-input__control {
  min-height: 40px !important;
}

@media (max-width: 960px) {
  .v-toolbar__title {
    font-size: 1.1rem;
  }
  
  .v-btn {
    padding: 0 8px;
  }
  
  .v-btn .v-icon {
    margin-right: 4px;
  }
  
  .v-card {
    padding: 16px;
  }
  
  .chart-canvas {
    min-height: 200px;
  }
  
  .v-card-title {
    font-size: 1.2rem;
  }
  
  .date-field {
    margin-bottom: 8px;
  }
}

@media (max-width: 600px) {
  .v-toolbar__title {
    font-size: 1rem;
  }
  
  .v-card {
    padding: 12px;
  }
  
  .v-card-title {
    font-size: 1.1rem;
  }
  
  .v-card-text {
    font-size: 0.9rem;
  }
  
  .v-text-field {
    margin-bottom: 8px;
  }
  
  .v-btn {
    padding: 0 4px;
    font-size: 0.8rem;
  }
  
  .chart-canvas {
    height: 250px !important;
  }
  
  .date-field {
    margin-bottom: 12px;
  }
  
  .v-col {
    padding: 4px;
  }
}

@media (max-width: 375px) {
  .v-container.fill-height {
    padding: 8px;
  }
  
  .v-card {
    padding: 10px;
  }
  
  .chart-canvas {
    height: 250px !important;
  }
  
  .v-col {
    padding: 2px;
  }
}
</style>