<template>
  <v-container fluid class="py-4">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="12" class="pa-4 rounded-xl">
          <v-card-title class="font-weight-bold text-h5">
            <v-icon left color="primary">mdi-calendar-clock</v-icon>
            ประวัติการนัดหมาย
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="appointments"
              :loading="loading"
              loading-text="กำลังโหลดข้อมูล..."
              class="elevation-1"
            >
              <template #item.date="{ item }">
                {{ formatDate(item.date) }}
              </template>
              <template #no-data>
                ไม่พบประวัติการนัดหมาย
              </template>
            </v-data-table>
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
import { showErrorAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      appointments: [],
      loading: false,
      headers: [
        { text: 'วันที่', value: 'date' },
        { text: 'ชื่อผู้ป่วย', value: 'patient_name' },
        { text: 'รายละเอียด', value: 'details' }
      ],
      snackbar: { show: false, text: '', color: '' }
    };
  },
  mounted() {
    this.fetchAppointments();
  },
  methods: {
    async fetchAppointments() {
      this.loading = true;
      try {
        const res = await axios.get('https://healthcare-production-1567.up.railway.app/appointments');
        if (res.data?.appointments) this.appointments = res.data.appointments;
        else this.showSnackbar('ไม่พบข้อมูลการนัดหมาย', 'warning');
      } catch (error) {
        console.error(error);
        showErrorAlert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
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
</style>
