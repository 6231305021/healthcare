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

          <!-- Export buttons -->
          <v-row class="mb-4">
            <v-col cols="12">
              <v-card outlined class="pa-3">
                <v-card-title class="text-h6 font-weight-semibold pb-2">
                  <v-icon left color="success">mdi-download</v-icon>
                  ส่งออกกราฟ
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn
                        color="success"
                        @click="exportAllCharts"
                        block
                        outlined
                        :loading="exportingAll"
                        :disabled="!filteredData.length"
                      >
                        <v-icon left>mdi-download-multiple</v-icon>
                        ส่งออกทั้งหมด
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn
                        color="info"
                        @click="exportAsPDF"
                        block
                        outlined
                        :loading="exportingPDF"
                        :disabled="!filteredData.length"
                      >
                        <v-icon left>mdi-file-pdf-box</v-icon>
                        ส่งออกเป็น PDF
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn
                        color="secondary"
                        @click="printCharts"
                        block
                        outlined
                        :disabled="!filteredData.length"
                      >
                        <v-icon left>mdi-printer</v-icon>
                        พิมพ์กราฟ
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row v-if="filteredData.length" class="flex-grow-1">
            <v-col cols="12" md="6" v-for="(chartConfig, index) in chartConfigs" :key="index" class="d-flex">
              <v-card class="mb-4 pa-4 rounded-lg elevation-2 flex-grow-1 chart-card">
                <v-card-title class="text-h6 font-weight-semibold pb-2 d-flex justify-space-between align-center" :style="{ color: chartConfig.color }">
                  <span>{{ chartConfig.label }}</span>
                  <v-btn
                    icon
                    small
                    color="primary"
                    @click="exportSingleChart(index)"
                    :loading="exportingCharts[index]"
                    class="export-btn"
                  >
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
import Swal from 'sweetalert2'
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import axios from 'axios';
import JSZip from 'jszip';

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

    // Export states
    const exportingAll = ref(false);
    const exportingPDF = ref(false);
    const exportingCharts = ref([]);

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
        const res = await axios.get(`https://healthcare-production-1567.up.railway.app/auth/${patientId.value}`);
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

    // Export functions
    const exportSingleChart = async (index) => {
      if (!chartInstances.value[index]) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่พบกราฟที่ต้องการส่งออก'
        });
        return;
      }

      exportingCharts.value[index] = true;
      
      try {
        const chart = chartInstances.value[index];
        const canvas = chart.canvas;
        const link = document.createElement('a');
        
        // Create a temporary canvas with better quality
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width * 2;
        tempCanvas.height = canvas.height * 2;
        tempCtx.scale(2, 2);
        tempCtx.drawImage(canvas, 0, 0);
        
        link.download = `${chartConfigs[index].label}_${new Date().toISOString().split('T')[0]}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
        
        Swal.fire({
          icon: 'success',
          title: 'ส่งออกสำเร็จ',
          text: `กราฟ ${chartConfigs[index].label} ถูกส่งออกแล้ว`
        });
      } catch (error) {
        console.error('Export error:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถส่งออกกราฟได้'
        });
      } finally {
        exportingCharts.value[index] = false;
      }
    };

    const exportAllCharts = async () => {
      exportingAll.value = true;
      
      try {
        const zip = new JSZip();
        const promises = chartInstances.value.map(async (chart, index) => {
          if (!chart) return;
          
          const canvas = chart.canvas;
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width * 2;
          tempCanvas.height = canvas.height * 2;
          tempCtx.scale(2, 2);
          tempCtx.drawImage(canvas, 0, 0);
          
          const blob = await new Promise(resolve => {
            tempCanvas.toBlob(resolve, 'image/png');
          });
          
          zip.file(`${chartConfigs[index].label}_${new Date().toISOString().split('T')[0]}.png`, blob);
        });
        
        await Promise.all(promises);
        const content = await zip.generateAsync({ type: 'blob' });
        
        const link = document.createElement('a');
        link.download = `health_charts_${new Date().toISOString().split('T')[0]}.zip`;
        link.href = URL.createObjectURL(content);
        link.click();
        
        Swal.fire({
          icon: 'success',
          title: 'ส่งออกสำเร็จ',
          text: 'กราฟทั้งหมดถูกส่งออกแล้ว'
        });
      } catch (error) {
        console.error('Export error:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถส่งออกกราฟได้'
        });
      } finally {
        exportingAll.value = false;
      }
    };

    const exportAsPDF = async () => {
      exportingPDF.value = true;
      
      try {
        // Simple PDF export using canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 900;
        canvas.height = 1400;
        const paddingX = 60; // horizontal padding
        const chartWidth = canvas.width - paddingX * 2;
        const chartHeight = 160;
        
        // Set background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw title with better styling
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('รายงานข้อมูลสุขภาพ', paddingX, 60);
        
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '16px Arial';
        ctx.fillText(`วันที่: ${new Date().toLocaleDateString('th-TH')}`, paddingX, 90);
        
        // Draw charts with better spacing
        let yOffset = 130;
        chartInstances.value.forEach((chart, index) => {
          if (!chart) return;
          
          // Draw chart title
          ctx.fillStyle = '#34495e';
          ctx.font = 'bold 18px Arial';
          ctx.fillText(chartConfigs[index].label, paddingX, yOffset);
          
          const chartCanvas = chart.canvas;
          // Draw chart with horizontal padding
          ctx.drawImage(chartCanvas, paddingX, yOffset + 10, chartWidth, chartHeight);
          yOffset += chartHeight + 40;
        });
        
        const link = document.createElement('a');
        link.download = `health_report_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        Swal.fire({
          icon: 'success',
          title: 'ส่งออกสำเร็จ',
          text: 'รายงานถูกส่งออกแล้ว'
        });
      } catch (error) {
        console.error('PDF export error:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถส่งออกเป็น PDF ได้'
        });
      } finally {
        exportingPDF.value = false;
      }
    };

    const printCharts = () => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>รายงานข้อมูลสุขภาพ</title>
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background-color: #f8f9fa;
                color: #2c3e50;
              }
              .print-container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #3498db;
              }
              .header h1 {
                color: #2c3e50;
                margin: 0 0 10px 0;
                font-size: 28px;
                font-weight: bold;
              }
              .header p {
                color: #7f8c8d;
                margin: 0;
                font-size: 16px;
              }
              .chart-container { 
                margin-bottom: 40px; 
                page-break-inside: avoid; 
                padding: 20px;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                background: #fafbfc;
              }
              .chart-title { 
                font-size: 20px; 
                font-weight: bold; 
                margin-bottom: 15px; 
                color: #2c3e50;
                padding: 10px 0;
                border-bottom: 2px solid #3498db;
              }
              canvas { 
                max-width: 100%; 
                height: auto; 
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              @media print {
                body { background-color: white; }
                .print-container { box-shadow: none; }
                .chart-container { border: 1px solid #ddd; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <div class="header">
                <h1>รายงานข้อมูลสุขภาพ</h1>
                <p>วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
              </div>
              ${chartInstances.value.map((chart, index) => `
                <div class="chart-container">
                  <div class="chart-title">${chartConfigs[index].label}</div>
                  <canvas id="chart${index}"></canvas>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      
      // Copy charts to print window
      setTimeout(() => {
        chartInstances.value.forEach((chart, index) => {
          if (chart) {
            const printCanvas = printWindow.document.getElementById(`chart${index}`);
            const printCtx = printCanvas.getContext('2d');
            printCanvas.width = chart.canvas.width;
            printCanvas.height = chart.canvas.height;
            printCtx.drawImage(chart.canvas, 0, 0);
          }
        });
        printWindow.print();
      }, 500);
    };

    onMounted(fetchData);

    return {
      patientId,
      startDate,
      endDate,
      filteredData,
      chartConfigs,
      chartRefs,
      exportingAll,
      exportingPDF,
      exportingCharts,

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
      exportSingleChart,
      exportAllCharts,
      exportAsPDF,
      printCharts,
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

/* Export button styles */
.export-btn {
  transition: all 0.3s ease;
  opacity: 0.7;
}

.export-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.v-btn--outlined {
  transition: all 0.3s ease;
  border-width: 2px !important;
}

.v-btn--outlined:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Export section styling */
.v-card--outlined {
  border: 2px solid #e3f2fd !important;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.1) !important;
}

.v-card--outlined .v-card__title {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white !important;
  margin: -12px -12px 16px -12px;
  padding: 20px 16px;
  border-radius: 6px 6px 0 0;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.v-card--outlined .v-card__title .v-icon {
  color: #ffffff !important;
  margin-right: 8px;
}

/* Export button specific colors */
.v-btn--outlined.v-btn--has-bg {
  background-color: rgba(255, 255, 255, 0.9) !important;
}

.v-btn--outlined.v-btn--has-bg:hover {
  background-color: rgba(255, 255, 255, 1) !important;
}

/* Success button (Export All) */
.v-btn--outlined.success--text {
  border-color: #27ae60 !important;
  color: #27ae60 !important;
}

.v-btn--outlined.success--text:hover {
  background-color: #27ae60 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

/* Info button (PDF Export) */
.v-btn--outlined.info--text {
  border-color: #3498db !important;
  color: #3498db !important;
}

.v-btn--outlined.info--text:hover {
  background-color: #3498db !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* Secondary button (Print) */
.v-btn--outlined.secondary--text {
  border-color: #95a5a6 !important;
  color: #95a5a6 !important;
}

.v-btn--outlined.secondary--text:hover {
  background-color: #95a5a6 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
}

/* Loading animation */
.v-btn--loading {
  position: relative;
}

.v-btn--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  
  /* Mobile export buttons */
  .v-btn--outlined {
    font-size: 0.9rem;
    padding: 8px 12px;
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
  
  /* Mobile export section */
  .v-card--outlined .v-card__title {
    font-size: 1rem;
    padding: 12px 8px;
  }
  
  .export-btn {
    width: 32px;
    height: 32px;
  }
  
  .export-btn .v-icon {
    font-size: 16px;
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
  
  /* Small mobile export buttons */
  .v-btn--outlined {
    font-size: 0.8rem;
    padding: 6px 8px;
  }
  
  .export-btn {
    width: 28px;
    height: 28px;
  }
  
  .export-btn .v-icon {
    font-size: 14px;
  }
}
</style>