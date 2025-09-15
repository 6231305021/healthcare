<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <!-- ช่องค้นหา -->
        <v-text-field
          v-model="search"
          label="ค้นหาผู้ป่วย"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="my-4"
        ></v-text-field>

        <!-- Loading skeleton -->
        <v-skeleton-loader
          v-if="loading"
          type="image"
          class="my-4"
          max-width="150"
        ></v-skeleton-loader>

        <!-- Error message -->
        <v-alert v-if="error" type="error" class="my-4">
          {{ error }}
        </v-alert>

        <!-- Grid ผู้ป่วย -->
        <v-row v-if="!loading && filteredPatients.length" dense>
          <v-col
            v-for="patient in filteredPatients"
            :key="patient.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="pa-2" outlined>
              <v-img
                :src="patient.avatar || defaultImage"
                alt="Patient Image"
                height="120"
                contain
              ></v-img>

              <v-card-title class="text-h6">
                {{ patient.name }}
              </v-card-title>

              <v-card-subtitle class="text-body2">
                {{ formatAddress(patient) }}
              </v-card-subtitle>

              <v-card-actions>
                <v-btn icon @click="editPatient(patient.id)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deletePatient(patient.id)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
                <v-btn icon @click="viewOnMap(patient)">
                  <v-icon color="green">mdi-map-marker</v-icon>
                </v-btn>
                <v-btn icon @click="goToDailyTracking(patient.id)">
                  <v-icon color="blue">mdi-calendar-check</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- ข้อความเมื่อไม่พบข้อมูล -->
        <v-alert v-else-if="!loading && !filteredPatients.length" type="info" class="my-4">
          ไม่พบข้อมูลผู้ป่วย
        </v-alert>
      </v-container>
    </v-main>
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
        this.loading = true;
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
      } finally {
        this.loading = false;
      }
    },
    async editPatient(id) {
      const result = await showConfirmDialog('ยืนยันการแก้ไข', 'คุณต้องการแก้ไขข้อมูลผู้ป่วยนี้ใช่หรือไม่?');
      if (result.isConfirmed) this.$router.push(`/editpatient/${id}`);
    },
    async viewOnMap(patient) {
      const result = await showConfirmDialog('ยืนยันการดูแผนที่', 'คุณต้องการดูตำแหน่งที่อยู่ของผู้ป่วยบนแผนที่ใช่หรือไม่?');
      if (result.isConfirmed) {
        const lat = patient.latitude || 0;
        const lng = patient.longitude || 0;
        const name = encodeURIComponent(patient.name || 'ไม่ทราบชื่อ');
        this.$router.push(`/map?lat=${lat}&lng=${lng}&name=${name}`);
      }
    },
    async goToDailyTracking(id) {
      const result = await showConfirmDialog(
        'ยืนยันการบันทึกรายวัน',
        'คุณต้องการบันทึกข้อมูลรายวันของผู้ป่วยนี้ใช่หรือไม่?'
      );
      if (result.isConfirmed) {
        this.$router.push(`/daily-tracking?patientId=${id}`);
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
          this.fetchPatients();
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
        if (result.isConfirmed) this.$router.push('/')
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
/* ลดขนาดรูปเล็กลงให้สมดุลกับ card */
.v-img {
  border-radius: 8px;
}
</style>
