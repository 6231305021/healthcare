<template>
  <v-container fluid class="py-4">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="12" class="pa-4 rounded-xl">
          <v-card-title class="font-weight-bold text-h5">
            <v-icon left color="primary">mdi-chart-line</v-icon>
            การติดตามสุขภาพรายวัน
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="dailyTracking"
              :loading="loading"
              loading-text="กำลังโหลด..."
              class="elevation-1"
              dense
            >
              <template v-slot:item.date="{ item }">
                {{ formatDate(item.date) }}
              </template>
              <template v-slot:item.temperature="{ item }">
                {{ item.temperature }} °C
              </template>
              <template v-slot:item.oxygen="{ item }">
                {{ item.oxygen }} %
              </template>
              <template v-slot:item.symptoms="{ item }">
                {{ item.symptoms || '-' }}
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
      dailyTracking: [],
      loading: false,
      snackbar: { show: false, text: '', color: '' },
      headers: [
        { text: 'วันที่', value: 'date' },
        { text: 'อุณหภูมิ (°C)', value: 'temperature' },
        { text: 'ออกซิเจน (%)', value: 'oxygen' },
        { text: 'อาการ', value: 'symptoms' }
      ]
    };
  },
  mounted() {
    this.fetchDailyTracking();
  },
  methods: {
    async fetchDailyTracking() {
      const patientId = this.$route.params.id;
      if (!patientId) return showErrorAlert('ไม่พบ Patient ID');
      this.loading = true;
      try {
        const res = await axios.get(`https://healthcare-production-1567.up.railway.app/patient/${patientId}/dailytracking`);
        if (res.data?.dailyTracking) {
          this.dailyTracking = res.data.dailyTracking;
        } else {
          this.showSnackbar('ไม่พบข้อมูลการติดตามรายวัน', 'warning');
        }
      } catch (error) {
        console.error(error);
        showErrorAlert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลการติดตาม');
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('th-TH', options);
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
.v-card-title {
  display: flex;
  align-items: center;
}

.v-data-table {
  font-size: 0.95rem;
}
</style>
