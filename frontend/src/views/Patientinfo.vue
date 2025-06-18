<template>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark elevation="4">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-account-multiple</v-icon>
        รายชื่อผู้ป่วย
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="goToHomePage">
          <v-icon left>mdi-logout</v-icon>
          ออกจากระบบ
        </v-btn>
        <v-btn text @click="goToUserPage">
          <v-icon left>mdi-account</v-icon>
          ข้อมูลส่วนตัว
        </v-btn>
        <v-btn text @click="goToAddPatient">
          <v-icon left>mdi-account-plus</v-icon>
          เพิ่มผู้ป่วยใหม่
        </v-btn>
        <v-btn text @click="goToMap">
          <v-icon left>mdi-map-marker-multiple</v-icon>
          แผนที่ผู้ป่วย
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToHomePage">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ออกจากระบบ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
        <v-list-item @click="goToMap">
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
        <v-text-field
          v-model="search"
          label="ค้นหาชื่อผู้ป่วย"
          append-icon="mdi-magnify"
          outlined
          dense
          class="search-field"
        />

        <v-container fluid class="pa-2">
          <v-row dense>
            <v-col
              v-for="patient in filteredPatients"
              :key="patient.id"
              cols="12"
              sm="6"
              md="4"
              lg="2"
              class="pa-1"
            >
              <v-card class="mx-auto my-3 patient-card" elevation="4">
                <div class="image-container">
                  <v-btn
                    icon
                    x-small
                    class="delete-btn"
                    @click="deletePatient(patient.id)"
                    style="position: absolute; top: 8px; right: 8px; z-index: 2;"
                  >
                    <v-icon color="error" size="20">mdi-delete</v-icon>
                  </v-btn>
                  <v-img
                    :src="patient.image_path ? `http://localhost:3001/${patient.image_path}` : defaultImage"
                    class="patient-image"
                    :aspect-ratio="1"
                    cover
                  >
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                  <div class="patient-info-overlay">
                    <v-card-title class="text-h6 white--text">
                      {{ patient.name }}
                    </v-card-title>
                    <v-card-subtitle class="white--text">
                      {{ patient.age }} ปี | {{ patient.gender }}
                    </v-card-subtitle>
                  </div>
                </div>

                <v-card-text class="pt-2 pb-2">
                  <v-row dense>
                    <v-col cols="12">
                      <div class="info-item">
                        <v-icon x-small color="primary" class="mr-1">mdi-map-marker</v-icon>
                        <span class="text-truncate">{{ formatAddress(patient) }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="info-item">
                        <v-icon x-small color="primary" class="mr-1">mdi-account</v-icon>
                        <span class="text-truncate">{{ patient.occupation || 'ไม่มีข้อมูลอาชีพ' }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="info-item">
                        <v-icon x-small color="primary" class="mr-1">mdi-heart-pulse</v-icon>
                        <span class="text-truncate">{{ patient.illness_info || 'ไม่มีข้อมูลการเจ็บป่วย' }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="info-item">
                        <v-icon x-small color="primary" class="mr-1">mdi-account-group</v-icon>
                        <span class="text-truncate">{{ patient.community_health_worker || 'ยังไม่มีอสม.ที่รับผิดชอบ' }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-2">
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn x-small text color="primary" @click="editPatient(patient.id)" class="action-btn">
                        <v-icon x-small left>mdi-pencil</v-icon> แก้ไข
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn x-small text color="green" @click="viewOnMap(patient)" class="action-btn">
                        <v-icon x-small left>mdi-map-marker</v-icon> แผนที่
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn x-small text color="#03A9F4" @click="goToDailyTracking(patient.id)" class="action-btn">
                        <v-icon x-small left>mdi-clipboard-pulse</v-icon> ติดตาม
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn x-small text color="#FFC107" @click="goToAppointments(patient.id)" class="action-btn">
                        <v-icon x-small left>mdi-calendar-check</v-icon> การนัด
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn x-small text color="#607D8B" @click="goToAppointmentHistory(patient.id)" class="action-btn">
                        <v-icon x-small left>mdi-history</v-icon> ประวัติ
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn x-small text color="#8BC34A" @click="goToDailyTrackingGraph(patient.id)" class="action-btn">
                        <v-icon x-small left>mdi-chart-line</v-icon> กราฟ
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-alert
          v-if="filteredPatients.length === 0"
          type="warning"
          border="left"
          colored-border
          elevation="2"
        >
          ไม่พบผู้ป่วยที่ค้นหา
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
        const response = await axios.get('http://localhost:3001/api/patients');
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
          await axios.delete(`http://localhost:3001/api/patients/${id}`, { headers });
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
          // ทำการ logout หรือเปลี่ยนหน้า
          this.$router.push('/')
        }
      })
    },
    goToUserPage() {
      this.$router.push('/profile');
    },
    goToAddPatient() {
      this.$router.push('/addpatient');
    },
    goToMap() {
      this.$router.push('/map');
    },
  },
  mounted() {
    this.fetchPatients();
  },
};
</script>

<style scoped>
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/backgroundvue.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: transparent;
  filter: blur(6px);
}
.patient-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0;
}

.patient-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.image-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 100%;
}

.patient-image {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  transition: transform 0.3s;
}

.patient-card:hover .patient-image {
  transform: scale(1.05);
}

.patient-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent);
  padding: 12px;
}

.patient-info-overlay .v-card-title {
  font-size: 1rem;
  line-height: 1.2;
  margin-bottom: 2px;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  font-weight: 600;
}

.patient-info-overlay .v-card-subtitle {
  font-size: 0.875rem;
  line-height: 1.2;
  padding-top: 0;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  opacity: 0.9;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.2;
}

.action-btn {
  margin: 2px;
  border-radius: 4px;
  transition: all 0.2s;
  height: 28px;
  min-width: 0;
  padding: 0 8px;
}

.action-btn:hover {
  background-color: rgba(0,0,0,0.05);
}

.v-card-actions {
  background-color: #f5f5f5;
  margin-top: auto;
}

.search-field {
  max-width: 600px;
  margin: 0 auto 16px;
}

/* Responsive adjustments */
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
}

@media (max-width: 600px) {
  .v-toolbar__title {
    font-size: 1rem;
  }
  
  .v-card {
    margin: 4px;
  }
  
  .v-card-title {
    font-size: 1.1rem;
  }
  
  .v-card-text {
    font-size: 0.9rem;
  }
  
  .action-btn {
    padding: 0 4px;
    font-size: 0.8rem;
  }
}

@media (min-width: 960px) {
  .patient-card {
    max-width: 100%;
  }
}

.v-container {
  max-width: 100%;
  padding: 4px;
}

.v-row {
  margin: 0;
}

.v-col {
  padding: 4px;
}

.delete-btn {
  background-color: rgba(255, 255, 255, 0.9) !important;
  transition: all 0.3s ease;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #ffebee !important;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-btn:active {
  transform: scale(0.95);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.delete-btn .v-icon {
  transition: all 0.3s ease;
}

.delete-btn:hover .v-icon {
  transform: scale(1.1);
}
</style>