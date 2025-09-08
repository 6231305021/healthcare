<template>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-history</v-icon>
        ประวัติการนัดหมาย: {{ patientName }}
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
      <v-container class="mt-6">
        <v-card class="pa-5">
          <v-card-title class="text-h6 d-flex justify-space-between align-center">
            <span>ประวัติการนัดหมายทั้งหมด</span>
            <v-btn color="#3B5F6D" dark @click="exportAppointmentsCSV" :disabled="filteredAppointments.length === 0" class="ml-2">
              <v-icon left>mdi-file-delimited</v-icon>
              ส่งออก CSV
            </v-btn>
          </v-card-title>

          <v-text-field
            v-model="search"
            label="ค้นหาสาเหตุการนัด, ผู้นัด หรือสถานะ"
            append-icon="mdi-magnify"
            outlined
            dense
            class="mb-4"
          />

          <v-data-table
            :headers="headers"
            :items="filteredAppointments"
            :loading="loadingData"
            :search="search"
            class="elevation-1"
            :items-per-page="10"
            :footer-props="{
              'items-per-page-text': 'รายการต่อหน้า',
              'items-per-page-options': [5, 10, 25, 50, -1]
            }"
            no-data-text="ไม่พบประวัติการนัดหมายสำหรับผู้ป่วยนี้"
          >
            <template v-slot:item.appointment_date="{ item }">
              {{ formatDate(item.appointment_date) }}
            </template>

            <template v-slot:item.appointment_time="{ item }">
              {{ item.appointment_time ? item.appointment_time.substring(0, 5) + ' น.' : 'N/A' }}
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
            </template>

            <template v-slot:no-results>
              <v-alert :value="true" color="warning" icon="mdi-alert">
                ไม่พบผลลัพธ์สำหรับการค้นหา "{{ search }}"
              </v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios';

export default {
  name: 'AppointmentHistory',
  props: {
    patientId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      drawer: false,
      patientName: 'กำลังโหลด...',
      allAppointments: [],
      loadingData: true,
      search: '',
      headers: [
        { text: 'วันที่นัด', value: 'appointment_date' },
        { text: 'เวลานัด', value: 'appointment_time' },
        { text: 'สาเหตุ', value: 'reason' },
        { text: 'แพทย์ผู้นัด', value: 'appointed_by' },
        { text: 'สถานที่ติดต่อ', value: 'contact_location' },
        { text: 'อื่นๆ', value: 'other_details' },
        { text: 'วินิจฉัยโรค', value: 'diagnosis' },
        { text: 'สถานะ', value: 'status' },
      ],
    };
  },
  computed: {
    filteredAppointments() {
      return Array.isArray(this.allAppointments) ? this.allAppointments : [];
    }
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchPatientDetails(newVal);
          this.fetchAllAppointments(newVal);
        } else {
          this.patientName = 'ไม่พบผู้ป่วย';
          this.allAppointments = [];
          this.loadingData = false;
        }
      },
    },
  },
  methods: {
    async fetchPatientDetails(id) {
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`https://healthcare-production-1567.up.railway.app/auth/${id}`, { headers });
        this.patientName = response.data.name;
      } catch (error) {
        console.error('โหลดชื่อผู้ป่วยล้มเหลว:', error.response?.data || error.message);
        this.patientName = 'ไม่พบผู้ป่วย';
        if (error.response?.status === 401) this.logout();
      }
    },
    async fetchAllAppointments(patientId) {
      this.loadingData = true;
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`https://healthcare-production-1567.up.railway.app/auth/${patientId}`, { headers });
        this.allAppointments = response.data.filter(app => app.appointment_date);
        this.allAppointments.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
      } catch (error) {
        console.error('โหลดประวัติการนัดหมายล้มเหลว:', error.response?.data || error.message);
        this.allAppointments = [];
        if (error.response?.status === 401) this.logout();
      } finally {
        this.loadingData = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH');
    },
    getStatusColor(status) {
      switch (status) {
        case 'มาตามนัด': return 'success';
        case 'ไม่มาตามนัด': return 'error';
        case 'ส่งต่อรักษา': return 'warning';
        case 'รอนัด': return 'info';
        default: return 'grey';
      }
    },
    goToUserPage() { this.$router.push('/profile'); },
    logout() { localStorage.removeItem('userToken'); localStorage.removeItem('userData'); this.$router.push('/'); },
    goToAddPatient() { this.$router.push('/Addpatient'); },
    goToPatientInfo() { this.$router.push('/patientinfo'); },
    goToMapPage() { this.$router.push('/Map'); },

    exportAppointmentsCSV() {
      const headers = this.headers.map(h => h.text);
      const rows = this.filteredAppointments.map(item => [
        item.appointment_date ? "'" + (new Date(item.appointment_date).toISOString().slice(0, 10)) + "'" : '',
        item.appointment_time ? item.appointment_time.substring(0, 5) + ' น.' : 'N/A',
        item.reason || '-',
        item.appointed_by || '-',
        item.contact_location || '-',
        item.other_details || '-',
        item.diagnosis || '-',
        item.status || '-',
      ]);
      let csvContent = '\uFEFF' + headers.join(',') + '\n';
      rows.forEach(row => {
        const safeRow = row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"');
        csvContent += safeRow.join(',') + '\n';
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'appointment-history.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}

@media (max-width: 960px) {
  .v-toolbar__title { font-size: 1.1rem; }
  .v-btn { padding: 0 8px; }
  .v-btn .v-icon { margin-right: 4px; }
  .v-card { padding: 16px; }
  .v-data-table { font-size: 0.9rem; }
}

@media (max-width: 600px) {
  .v-toolbar__title { font-size: 1rem; }
  .v-card { padding: 12px; }
  .v-card-title { font-size: 1.1rem; }
  .v-card-text { font-size: 0.9rem; }
  .v-text-field { margin-bottom: 8px; }
  .v-btn { padding: 0 4px; font-size: 0.8rem; }
  .v-data-table { font-size: 0.8rem; }
  .v-chip { font-size: 0.8rem; height: 24px; }
}
</style>
