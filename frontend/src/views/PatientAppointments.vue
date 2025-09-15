<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="#3B5F6D" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-calendar-edit</v-icon>
        การนัดหมายผู้ป่วย: {{ patientName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="goToUserPage"><v-icon left>mdi-account</v-icon> ข้อมูลส่วนตัว</v-btn>
        <v-btn text @click="goToAddPatient"><v-icon left>mdi-account-plus</v-icon> เพิ่มผู้ป่วยใหม่</v-btn>
        <v-btn text @click="goToPatientInfo"><v-icon left>mdi-account-group</v-icon> ข้อมูลผู้ป่วย</v-btn>
        <v-btn text @click="goToMapPage"><v-icon left>mdi-map-marker-multiple</v-icon> แผนที่ผู้ป่วย</v-btn>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToUserPage">
          <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToAddPatient">
          <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToPatientInfo">
          <v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToMapPage">
          <v-list-item-icon><v-icon>mdi-map-marker-multiple</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container class="mt-6">
        <v-row>
          <!-- Appointment History Table -->
          <v-col cols="12">
            <v-card class="pa-5">
              <v-card-title class="text-h6 d-flex justify-space-between align-center">
                <span>ประวัติการนัดหมาย</span>
                <v-btn color="#3B5F6D" dark @click="openExportDialog" :disabled="appointmentHistory.length===0">
                  <v-icon left>mdi-printer</v-icon> ส่งออกใบนัด
                </v-btn>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="appointmentHistory"
                :loading="loadingData"
                class="elevation-1"
                item-key="id"
              >
                <template v-slot:item.appointment_datetime="{ item }">
                  {{ formatDateTime(item.appointment_date, item.appointment_time) }}
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="deleteAppointment(item.id)">mdi-delete</v-icon>
                </template>
                <template v-slot:no-data>
                  ไม่มีข้อมูลการนัดหมายสำหรับผู้ป่วยนี้
                </template>
              </v-data-table>
            </v-card>
          </v-col>

          <!-- Export Dialog -->
          <v-dialog v-model="exportDialog" max-width="600px">
            <v-card>
              <v-card-title class="text-h6">เลือกนัดหมายที่ต้องการส่งออกใบนัด</v-card-title>
              <v-card-text>
                <v-select
                  v-model="selectedAppointmentId"
                  :items="appointmentHistory.map(a => ({ title: `HN: ${a.hn_number || '-' } - วันที่: ${formatDate(a.appointment_date)}`, value: a.id }))"
                  label="เลือกนัดหมาย"
                  item-title="title"
                  item-value="value"
                  outlined
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="exportDialog=false">ยกเลิก</v-btn>
                <v-btn color="#3B5F6D" dark @click="exportAppointmentPDF" :disabled="!selectedAppointmentId">
                  <v-icon left>mdi-printer</v-icon> ส่งออก
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_APPOINTMENTS = import.meta.env.VITE_API_APPOINTMENTS;

export default {
  name: 'PatientAppointments',
  data() {
    return {
      drawer: false,
      patientName: 'กำลังโหลด...',
      appointmentHistory: [],
      patientId: null,
      loadingData: false,
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
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      chartColors: {
        'มาตามนัด': '#4CAF50',
        'ไม่มาตามนัด': '#F44336',
        'ส่งต่อรักษา': '#2196F3',
        'รอนัด': '#FF9800',
      },
      exportDialog: false,
      selectedAppointmentId: null,
    };
  },
  mounted() {
    this.patientId = this.$route.query.patientId || null;
    if (this.patientId) {
      this.fetchAppointments(this.patientId);
    }
  },
  methods: {
    async fetchAppointments(patientId) {
      this.loadingData = true;
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`${API_APPOINTMENTS}patient/${patientId}`, { headers });
        this.appointmentHistory = response.data || [];
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลการนัดหมายได้', 'error');
        this.appointmentHistory = [];
      } finally {
        this.loadingData = false;
      }
    },

    formatDateTime(date, time) {
      if (!date) return '-';
      const d = new Date(`${date}T${time || '00:00'}`);
      return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    },

    formatDate(date) {
      if (!date) return '-';
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
    },

    getStatusColor(status) {
      return this.chartColors[status] || '#000000';
    },

    async deleteAppointment(id) {
      if (!confirm('คุณต้องการลบการนัดหมายนี้ใช่หรือไม่?')) return;
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        await axios.delete(`${API_APPOINTMENTS}${id}`, { headers });
        this.fetchAppointments(this.patientId); // refresh
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'ไม่สามารถลบการนัดหมายได้', 'error');
      }
    },

    openExportDialog() {
      this.selectedAppointmentId = null;
      this.exportDialog = true;
    },

    exportAppointmentPDF() {
      const element = document.body;
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('appointments.pdf');
        this.exportDialog = false;
      });
    },

    // Navigation buttons
    goToUserPage() { this.$router.push('/profile'); },
    goToAddPatient() { this.$router.push('/addpatient'); },
    goToPatientInfo() { this.$router.push('/patientinfo'); },
    goToMapPage() { this.$router.push('/map'); },
  },
};
</script>
