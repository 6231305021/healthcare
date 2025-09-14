<template>
  <v-app>
    <!-- ... (template เหมือนเดิม ไม่ต้องแก้ไข) ... -->
  </v-app>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios';
import { showSuccessAlert, showErrorAlert, showConfirmDialog, showDeleteConfirm } from '../utils/sweetAlert';

export default {
  name: 'PatientInfo',
  data() {
    return {
      drawer: false,
      patients: [],
      search: '',
      defaultImage: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
      loading: false,
      error: null
    };
  },
  computed: {
    filteredPatients() {
      const patientList = Array.isArray(this.patients) ? this.patients : [];
      return patientList.filter((patient) =>
        patient.name?.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    formatAddress(patient) {
      const parts = [
        patient.address_detail,
        patient.subdistrict,
        patient.district,
        patient.province
      ].filter(Boolean);
      return parts.join(', ') || 'ไม่มีข้อมูลที่อยู่';
    },
    async fetchPatients() {
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`${import.meta.env.VITE_API_PATIENT}`, { headers });
        if (Array.isArray(response.data.patients)) {
          this.patients = response.data.patients;
        } else {
          this.patients = [];
          console.error('ข้อมูลไม่ถูกต้อง:', response.data);
        }
      } catch (error) {
        console.error('โหลดข้อมูลล้มเหลว', error);
        this.patients = [];
        showErrorAlert('ไม่สามารถโหลดข้อมูลผู้ป่วยได้');
      }
    },
    async editPatient(id) {
      const result = await showConfirmDialog(
        'ยืนยันการแก้ไข',
        'คุณต้องการแก้ไขข้อมูลผู้ป่วยนี้ใช่หรือไม่?'
      );
      
      if (result.isConfirmed) {
        this.$router.push(`/editpatient/${id}`);
      }
    },
    async viewOnMap(patient) {
      const result = await showConfirmDialog(
        'ยืนยันการดูแผนที่',
        'คุณต้องการดูตำแหน่งที่อยู่ของผู้ป่วยบนแผนที่ใช่หรือไม่?'
      );
      
      if (result.isConfirmed) {
        const lat = patient.latitude || 0;
        const lng = patient.longitude || 0;
        const name = encodeURIComponent(patient.name || 'ไม่ทราบชื่อ');
        this.$router.push(`/map?lat=${lat}&lng=${lng}&name=${name}`);
      }
    },
    async goToDailyTracking(id) {
      const result = await showConfirmDialog(
        'ยืนยันการดูข้อมูลติดตาม',
        'คุณต้องการดูข้อมูลการติดตามสุขภาพของผู้ป่วยใช่หรือไม่?'
      );
      
      if (result.isConfirmed) {
        this.$router.push(`/daily-tracking?patientId=${id}`);
      }
    },
    async goToAppointments(id) {
      const result = await showConfirmDialog(
        'ยืนยันการดูการนัดหมาย',
        'คุณต้องการดูข้อมูลการนัดหมายของผู้ป่วยใช่หรือไม่?'
      );
      
      if (result.isConfirmed) {
        this.$router.push(`/appointments?patientId=${id}`);
      }
    },
    async goToAppointmentHistory(id) {
      const result = await showConfirmDialog(
        'ยืนยันการดูประวัติ',
        'คุณต้องการดูประวัติการนัดหมายของผู้ป่วยใช่หรือไม่?'
      );
      
      if (result.isConfirmed) {
        this.$router.push(`/appointment-history?patientId=${id}`);
      }
    },
    async goToDailyTrackingGraph(id) {
      const result = await showConfirmDialog(
        'ยืนยันการดูกราฟ',
        'คุณต้องการดูกราฟข้อมูลการติดตามสุขภาพของผู้ป่วยใช่หรือไม่?'
      );
      
      if (result.isConfirmed) {
        this.$router.push(`/daily-tracking-graph?patientId=${id}`);
      }
    },
    async deletePatient(id) {
      const result = await showDeleteConfirm(
        'ยืนยันการลบผู้ป่วย',
        'คุณต้องการลบข้อมูลผู้ป่วยนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้'
      );
      
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('userToken');
          const headers = token ? { 'x-auth-token': token } : {};
          await axios.delete(`${import.meta.env.VITE_API_PATIENT}${id}`, { headers });
          showSuccessAlert('ลบข้อมูลผู้ป่วยสำเร็จ');
          this.fetchPatients(); // Refresh the patient list
        } catch (error) {
          console.error('ลบข้อมูลผู้ป่วยล้มเหลว:', error);
          showErrorAlert('ไม่สามารถลบข้อมูลผู้ป่วยได้: ' + (error.response?.data?.message || error.message));
        }
      }
    },
    goToHomePage() {
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการออกจากระบบใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push('/')
        }
      })
    },
    goToUserPage() { this.$router.push('/profile'); },
    goToAddPatient() { this.$router.push('/addpatient'); },
    goToMap() { this.$router.push('/map'); },
  },
  mounted() {
    this.fetchPatients();
  },
};
</script>

<style scoped>
/* ... (style เดิมทั้งหมด ไม่ต้องแก้ไข) ... */
</style>
