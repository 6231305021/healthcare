<template>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-calendar-clock</v-icon>
        ประวัติการนัดหมายผู้ป่วย
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="mt-6">
        <v-card class="pa-5">
          <v-card-title class="text-h6 d-flex justify-space-between align-center">
            <span>ประวัติการนัดหมายทั้งหมด</span>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="appointmentHistory"
            :loading="loading"
            class="elevation-1"
            item-key="id"
          >
            <template v-slot:item.appointment_datetime="{ item }">
              {{ formatDateTime(item.appointment_date, item.appointment_time) }}
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
            </template>
            <template v-slot:no-data>
              ไม่มีข้อมูลการนัดหมาย
            </template>
          </v-data-table>

          <v-card class="mt-6 pa-5" v-if="appointmentHistory.length">
            <v-card-title class="text-h6">สถิติสถานะการนัดหมาย</v-card-title>
            <v-card-text>
              <canvas id="appointmentChart"></canvas>
            </v-card-text>
          </v-card>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

const API_APPOINTMENTS = import.meta.env.VITE_API_APPOINTMENTS;

export default {
  name: 'AppointmentHistory',
  data() {
    return {
      appointmentHistory: [],
      loading: false,
      headers: [
        { text: 'วันที่/เวลา', value: 'appointment_datetime' },
        { text: 'HN', value: 'hn_number' },
        { text: 'สิทธิการรักษา', value: 'rights' },
        { text: 'เหตุผล', value: 'reason' },
        { text: 'แพทย์/ผู้บันทึก', value: 'appointed_by' },
        { text: 'สถานที่ติดต่อ', value: 'contact_location' },
        { text: 'วินิจฉัย', value: 'diagnosis' },
        { text: 'รายละเอียดอื่นๆ', value: 'other_details' },
        { text: 'สถานะ', value: 'status' },
      ],
      chartInstance: null,
      statusOptions: ['มาตามนัด', 'ไม่มาตามนัด', 'ส่งต่อรักษา', 'รอนัด'],
      chartColors: {
        'มาตามนัด': '#4CAF50',
        'ไม่มาตามนัด': '#F44336',
        'ส่งต่อรักษา': '#2196F3',
        'รอนัด': '#FF9800',
      },
    };
  },
  mounted() {
    this.fetchAppointments();
  },
  methods: {
    async fetchAppointments() {
      this.loading = true;
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`${API_APPOINTMENTS}all`, { headers });

        // ✅ ทำให้เป็น array เสมอ
        this.appointmentHistory = Array.isArray(response.data)
          ? response.data
          : (response.data.appointments || []);

        this.$nextTick(() => this.updateChart());
      } catch (error) {
        console.error('Failed to load appointment history:', error.response?.data || error.message);
        this.appointmentHistory = [];
        if (this.chartInstance) this.chartInstance.destroy();
      } finally {
        this.loading = false;
      }
    },

    formatDateTime(date, time) {
      if (!date) return '-';
      const d = new Date(`${date}T${time || '00:00'}`);
      return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    },

    getStatusColor(status) {
      return this.chartColors[status] || '#000000';
    },

    updateChart() {
      if (!this.appointmentHistory.length) return;

      const counts = {};
      this.statusOptions.forEach(s => counts[s] = 0);
      this.appointmentHistory.forEach(a => {
        if (counts[a.status] !== undefined) counts[a.status]++;
      });

      const data = {
        labels: this.statusOptions,
        datasets: [{
          label: 'สถานะการนัดหมาย',
          data: this.statusOptions.map(s => counts[s]),
          backgroundColor: this.statusOptions.map(s => this.chartColors[s])
        }]
      };

      if (this.chartInstance) this.chartInstance.destroy();
      const ctx = document.getElementById('appointmentChart').getContext('2d');
      this.chartInstance = new Chart(ctx, { type: 'bar', data });
    }
  }
};
</script>
